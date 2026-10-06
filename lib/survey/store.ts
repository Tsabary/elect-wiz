/**
 * A tiny external store around the survey state, for `useSyncExternalStore`.
 * Loads (or creates) the state lazily on first read in the browser and persists
 * every change to on-device storage.
 */
import { createSurveyState, type SurveyState } from "./state";
import type { SurveyStorage } from "./storage";

export interface SurveyStore {
  get(): SurveyState;
  set(update: (s: SurveyState) => SurveyState): void;
  /** Forgets saved progress (after a result is shown); the next survey starts fresh. */
  clear(): void;
  subscribe(listener: () => void): () => void;
  readonly storageAvailable: boolean;
}

export function createSurveyStore(
  surveyContentVersion: string,
  storage: SurveyStorage,
): SurveyStore {
  let state: SurveyState | null = null;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  const get = (): SurveyState => {
    if (!state) {
      const saved = storage.load(surveyContentVersion);
      state = saved ?? createSurveyState(surveyContentVersion);
      // Save a new session right away so a reload keeps the same shuffled order.
      if (!saved) storage.save(state);
    }
    return state;
  };

  return {
    get,
    set(update) {
      const next = update(get());
      if (next === state) return;
      state = next;
      storage.save(next);
      emit();
    },
    clear() {
      storage.clear();
      state = createSurveyState(surveyContentVersion);
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    storageAvailable: storage.available,
  };
}
