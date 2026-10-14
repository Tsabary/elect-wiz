/**
 * On-device persistence of survey progress (PRD FR25). Local storage only;
 * nothing leaves the device.
 *
 * Every access is wrapped: if storage is unavailable (private mode, disabled,
 * quota), the survey still works, just without resume.
 *
 * Retention (owner decision, 2026-10-14; the Privacy page says so): a finished
 * survey is kept for `RESULT_RETENTION_DAYS` after its result was first shown,
 * then discarded on the next load. Once polls close the saved survey is deleted
 * outright (components/time/forget-survey.tsx).
 */
import { SURVEY_SCHEMA_VERSION, type SurveyState } from "./state";

export const SURVEY_STORAGE_KEY = "elect.survey";

/** How long a finished survey (and so its result) stays saved. */
export const RESULT_RETENTION_DAYS = 7;
const RESULT_RETENTION_MS = RESULT_RETENTION_DAYS * 24 * 60 * 60 * 1000;

export interface SurveyStorage {
  /** False when storage can't be used; the survey then runs without resume. */
  readonly available: boolean;
  /**
   * The saved state for this survey-content version, or null. A saved state for a
   * different content or schema version, or an expired result, is discarded,
   * unless `keep` is set: then it is only not returned. Readers that merely look
   * (the intro, another tab reacting to a change) keep it, so a tab still on an
   * older version never deletes the survey a newer tab is saving.
   */
  load(surveyContentVersion: string, opts?: { keep?: boolean }): SurveyState | null;
  /** Deletes a saved result past its retention period, whatever its version. */
  forgetExpired(): void;
  save(state: SurveyState): void;
  clear(): void;
  /**
   * Calls `onChange` when another tab changes or deletes the saved survey
   * (the browser's `storage` event). Returns the unsubscribe function.
   */
  subscribe(onChange: () => void): () => void;
}

export interface SurveyStorageOptions {
  /** The clock for the retention rule (tests). */
  now?: () => number;
  /** Where the browser fires `storage` events: `window` by default (tests pass their own). */
  events?: EventTarget | null;
}

function probe(storage: Storage): boolean {
  try {
    const k = `${SURVEY_STORAGE_KEY}.probe`;
    storage.setItem(k, "1");
    storage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

function looksLikeState(v: unknown): v is SurveyState {
  if (!v || typeof v !== "object") return false;
  const s = v as Partial<SurveyState>;
  return (
    typeof s.surveyContentVersion === "string" &&
    typeof s.issueSeed === "number" &&
    typeof s.optionSeed === "number" &&
    Array.isArray(s.ranked) &&
    Array.isArray(s.notImportant) &&
    !!s.answers &&
    typeof s.answers === "object" &&
    !!s.step
  );
}

/** A finished survey past its retention period, or one with no record of when it finished. */
function expired(state: SurveyState, now: number): boolean {
  if (!state.finished) return false;
  return typeof state.finishedAt !== "number" || now - state.finishedAt >= RESULT_RETENTION_MS;
}

export function createSurveyStorage(
  storage: Storage | null | undefined,
  options: SurveyStorageOptions = {},
): SurveyStorage {
  const usable = !!storage && probe(storage);
  if (!usable || !storage) {
    return {
      available: false,
      load: () => null,
      save: () => {},
      clear: () => {},
      forgetExpired: () => {},
      subscribe: () => () => {},
    };
  }
  const now = options.now ?? Date.now;
  const events = options.events !== undefined ? options.events : browserWindow();
  return {
    available: true,
    load(surveyContentVersion, { keep = false } = {}) {
      try {
        const raw = storage.getItem(SURVEY_STORAGE_KEY);
        if (!raw) return null;
        const parsed: unknown = JSON.parse(raw);
        if (
          !looksLikeState(parsed) ||
          parsed.schemaVersion !== SURVEY_SCHEMA_VERSION ||
          parsed.surveyContentVersion !== surveyContentVersion ||
          expired(parsed, now())
        ) {
          if (!keep) storage.removeItem(SURVEY_STORAGE_KEY);
          return null;
        }
        return parsed;
      } catch {
        if (keep) return null;
        try {
          storage.removeItem(SURVEY_STORAGE_KEY);
        } catch {
          /* ignore */
        }
        return null;
      }
    },
    forgetExpired() {
      try {
        const raw = storage.getItem(SURVEY_STORAGE_KEY);
        if (!raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (looksLikeState(parsed) && expired(parsed, now())) {
          storage.removeItem(SURVEY_STORAGE_KEY);
        }
      } catch {
        /* unreadable: the survey page discards it on its own load */
      }
    },
    save(state) {
      try {
        storage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* quota or disabled: continue without resume */
      }
    },
    clear() {
      try {
        storage.removeItem(SURVEY_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    },
    subscribe(onChange) {
      if (!events) return () => {};
      const listener = (e: Event) => {
        const { key, storageArea } = e as StorageEvent;
        // `key` is null when the other tab cleared all of this site's storage.
        if (key !== SURVEY_STORAGE_KEY && key !== null) return;
        if (storageArea && storageArea !== storage) return;
        onChange();
      };
      events.addEventListener("storage", listener);
      return () => events.removeEventListener("storage", listener);
    },
  };
}

function browserWindow(): EventTarget | null {
  return typeof window !== "undefined" ? window : null;
}

/** The browser's local storage, or null when inaccessible (e.g. blocked by settings). */
export function browserLocalStorage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}
