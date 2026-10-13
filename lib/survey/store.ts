/**
 * A tiny external store around the survey state, for `useSyncExternalStore`.
 * Loads (or creates) the state lazily on first read in the browser and persists
 * every change to on-device storage.
 */
import { randomSeed } from "./shuffle";
import { createSurveyState, type SurveyState } from "./state";
import type { SurveyStorage } from "./storage";

export interface SurveyStore {
  get(): SurveyState;
  set(update: (s: SurveyState) => SurveyState): void;
  /**
   * Forgets saved progress (after a result is shown, or when the user starts over) and
   * puts a new survey in its place, with new shuffle seeds, which counts as started anew.
   */
  clear(): void;
  subscribe(listener: () => void): () => void;
  readonly storageAvailable: boolean;
}

export interface SurveyStoreOptions {
  /**
   * Called once when a NEW survey begins: at its first ranking change. Opening
   * the page calls nothing, and neither does continuing a survey already counted.
   */
  onStarted?: () => void;
}

export function createSurveyStore(
  surveyContentVersion: string,
  storage: SurveyStorage,
  options: SurveyStoreOptions = {},
): SurveyStore {
  let state: SurveyState | null = null;
  /** True until the survey in hand has been reported as started (or was resumed). */
  let isNew = false;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  const get = (): SurveyState => {
    if (!state) {
      const saved = storage.load(surveyContentVersion);
      // The unranked pool is reshuffled on every page load, even when resuming:
      // issues still in the pool have no position worth keeping.
      state = saved
        ? { ...saved, issueSeed: randomSeed() }
        : createSurveyState(surveyContentVersion);
      isNew = !saved?.started;
      // Save a new session right away so a reload keeps the same option order.
      storage.save(state);
    }
    return state;
  };

  return {
    get,
    set(update) {
      const prev = get();
      const updated = update(prev);
      if (updated === prev) return;
      const starts =
        isNew && (updated.ranked !== prev.ranked || updated.notImportant !== prev.notImportant);
      // The flag is saved with the state, so undoing the change and reloading can't count twice.
      const next = starts ? { ...updated, started: true } : updated;
      state = next;
      storage.save(next);
      if (starts) {
        isNew = false;
        try {
          options.onStarted?.();
        } catch {
          /* reporting must never break the survey */
        }
      }
      emit();
    },
    clear() {
      storage.clear();
      state = createSurveyState(surveyContentVersion);
      isNew = true;
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    storageAvailable: storage.available,
  };
}
