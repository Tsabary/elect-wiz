import { describe, expect, it, vi } from "vitest";
import {
  addToRanking,
  createSurveyState,
  goTo,
  markNotImportant,
  removeFromRanking,
  type SurveyState,
} from "./state";
import type { SurveyStorage } from "./storage";
import { createSurveyStore } from "./store";

const VERSION = "v1";

/** A storage double holding at most one saved state. */
function fakeStorage(saved: SurveyState | null = null): SurveyStorage {
  let current = saved;
  return {
    available: true,
    load: () => current,
    save: (s) => {
      current = s;
    },
    clear: () => {
      current = null;
    },
  };
}

const mark = (s: SurveyState, id: string) => {
  const res = markNotImportant(s, id);
  return res.ok ? res.state : s;
};

describe("survey store: when a survey counts as started", () => {
  it("reports nothing for merely opening the page", () => {
    const onStarted = vi.fn();
    const store = createSurveyStore(VERSION, fakeStorage(), { onStarted });
    store.get();
    store.set((s) => goTo(s, { kind: "ranking" }));
    expect(onStarted).not.toHaveBeenCalled();
  });

  it("reports a new survey once, at its first ranking change", () => {
    const onStarted = vi.fn();
    const store = createSurveyStore(VERSION, fakeStorage(), { onStarted });
    store.set((s) => addToRanking(s, "a"));
    expect(onStarted).toHaveBeenCalledTimes(1);
    store.set((s) => addToRanking(s, "b"));
    store.set((s) => removeFromRanking(s, "a"));
    store.set((s) => mark(s, "c"));
    expect(onStarted).toHaveBeenCalledTimes(1);
  });

  it("counts marking an issue as not important as a ranking change", () => {
    const onStarted = vi.fn();
    const store = createSurveyStore(VERSION, fakeStorage(), { onStarted });
    store.set((s) => mark(s, "a"));
    expect(onStarted).toHaveBeenCalledTimes(1);
  });

  it("reports nothing when a saved survey is resumed", () => {
    const onStarted = vi.fn();
    const saved = { ...addToRanking(createSurveyState(VERSION), "a"), started: true };
    const store = createSurveyStore(VERSION, fakeStorage(saved), { onStarted });
    expect(store.get().ranked).toEqual(["a"]);
    store.set((s) => addToRanking(s, "b"));
    store.set((s) => removeFromRanking(s, "a"));
    expect(onStarted).not.toHaveBeenCalled();
  });

  it("treats a saved survey the user never touched as new", () => {
    // A new session is saved as soon as the page opens, so a reload before the
    // first ranking change finds a saved, still untouched state.
    const onStarted = vi.fn();
    const storage = fakeStorage();
    createSurveyStore(VERSION, storage).get();
    const store = createSurveyStore(VERSION, storage, { onStarted });
    store.set((s) => addToRanking(s, "a"));
    expect(onStarted).toHaveBeenCalledTimes(1);
  });

  it("does not report again after a reload", () => {
    const storage = fakeStorage();
    const first = vi.fn();
    createSurveyStore(VERSION, storage, { onStarted: first }).set((s) => addToRanking(s, "a"));
    const second = vi.fn();
    createSurveyStore(VERSION, storage, { onStarted: second }).set((s) => addToRanking(s, "b"));
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
  });

  it("does not report again when the first change is undone before a reload", () => {
    const storage = fakeStorage();
    const first = vi.fn();
    const before = createSurveyStore(VERSION, storage, { onStarted: first });
    before.set((s) => addToRanking(s, "a"));
    before.set((s) => removeFromRanking(s, "a"));
    const second = vi.fn();
    createSurveyStore(VERSION, storage, { onStarted: second }).set((s) => addToRanking(s, "b"));
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
  });

  it("keeps working when the report throws", () => {
    const store = createSurveyStore(VERSION, fakeStorage(), {
      onStarted: () => {
        throw new Error("boom");
      },
    });
    expect(() => store.set((s) => addToRanking(s, "a"))).not.toThrow();
    expect(store.get().ranked).toEqual(["a"]);
  });
});
