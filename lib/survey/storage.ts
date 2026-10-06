/**
 * On-device persistence of survey progress (PRD FR25). Local storage only;
 * nothing leaves the device until the user submits.
 *
 * Every access is wrapped: if storage is unavailable (private mode, disabled,
 * quota), the survey still works, just without resume.
 */
import { SURVEY_SCHEMA_VERSION, type SurveyState } from "./state";

export const SURVEY_STORAGE_KEY = "elect.survey";

export interface SurveyStorage {
  /** False when storage can't be used; the survey then runs without resume. */
  readonly available: boolean;
  /**
   * The saved state for this survey-content version, or null. A saved state for a
   * different content or schema version is discarded.
   */
  load(surveyContentVersion: string): SurveyState | null;
  save(state: SurveyState): void;
  clear(): void;
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
    !!s.anythingElse &&
    !!s.step
  );
}

export function createSurveyStorage(storage: Storage | null | undefined): SurveyStorage {
  const usable = !!storage && probe(storage);
  if (!usable || !storage) {
    return { available: false, load: () => null, save: () => {}, clear: () => {} };
  }
  return {
    available: true,
    load(surveyContentVersion) {
      try {
        const raw = storage.getItem(SURVEY_STORAGE_KEY);
        if (!raw) return null;
        const parsed: unknown = JSON.parse(raw);
        if (
          !looksLikeState(parsed) ||
          parsed.schemaVersion !== SURVEY_SCHEMA_VERSION ||
          parsed.surveyContentVersion !== surveyContentVersion
        ) {
          storage.removeItem(SURVEY_STORAGE_KEY);
          return null;
        }
        return parsed;
      } catch {
        try {
          storage.removeItem(SURVEY_STORAGE_KEY);
        } catch {
          /* ignore */
        }
        return null;
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
  };
}

/** The browser's local storage, or null when inaccessible (e.g. blocked by settings). */
export function browserLocalStorage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}
