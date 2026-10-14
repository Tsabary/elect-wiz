/**
 * A tiny external store around the survey state, for `useSyncExternalStore`.
 * Loads (or creates) the state lazily on first read in the browser and persists
 * every change to on-device storage.
 *
 * Other tabs: while anything listens, the store watches the saved survey. When
 * another tab deletes it ("start over") or puts a different survey in its place
 * (other shuffle seeds), the survey held here is dropped for that one, or for a
 * new empty survey, so this tab never writes the old answers back.
 */
import { randomSeed } from "./shuffle";
import { createSurveyState, type SurveyState } from "./state";
import type { SurveyStorage } from "./storage";

export interface SurveyStore {
  get(): SurveyState;
  set(update: (s: SurveyState) => SurveyState): void;
  /**
   * Forgets saved progress and result (when the user starts over) and
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
  let unwatch: (() => void) | null = null;

  /** Another tab changed the saved survey. */
  const onExternalChange = () => {
    if (!state) return; // Nothing loaded here yet: the first read will load what is saved.
    const saved = storage.load(surveyContentVersion, { keep: true });
    // The same survey saved from another tab: carry on as before.
    if (saved && saved.optionSeed === state.optionSeed) return;
    if (saved) {
      state = { ...saved, issueSeed: randomSeed() };
      isNew = !saved.started;
    } else {
      // Deleted there: a new survey here too, saved (like after "start over") only once used.
      state = createSurveyState(surveyContentVersion);
      isNew = true;
    }
    emit();
  };

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
      unwatch ??= storage.subscribe(onExternalChange);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          unwatch?.();
          unwatch = null;
        }
      };
    },
    storageAvailable: storage.available,
  };
}
