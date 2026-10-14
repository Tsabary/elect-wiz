import { describe, expect, it, vi } from "vitest";
import {
  addToRanking,
  createSurveyState,
  goTo,
  selectAnswer,
  setDraft,
  markNotImportant,
  removeFromRanking,
  type SurveyState,
} from "./state";
import { createSurveyStorage, SURVEY_STORAGE_KEY, type SurveyStorage } from "./storage";
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
    forgetExpired: () => {},
    subscribe: () => () => {},
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

  it("starting over puts a new survey in place, which is counted again at its first ranking change", () => {
    const onStarted = vi.fn();
    const storage = fakeStorage();
    const store = createSurveyStore(VERSION, storage, { onStarted });
    store.set((s) => addToRanking(s, "a"));
    const before = store.get();
    const listener = vi.fn();
    store.subscribe(listener);

    store.clear();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(storage.load(VERSION)).toBeNull();
    const fresh = store.get();
    expect(fresh).toMatchObject({ ranked: [], notImportant: [], answers: {} });
    expect(fresh.step).toEqual({ kind: "ranking" });
    expect(fresh.started).toBeUndefined();
    expect([fresh.issueSeed, fresh.optionSeed]).not.toEqual([before.issueSeed, before.optionSeed]);
    // Nothing is saved, and nothing counted, until the user does something.
    expect(storage.load(VERSION)).toBeNull();
    expect(onStarted).toHaveBeenCalledTimes(1);

    store.set((s) => addToRanking(s, "b"));
    expect(onStarted).toHaveBeenCalledTimes(2);
    expect(storage.load(VERSION)).toMatchObject({ ranked: ["b"], started: true });
    store.set((s) => addToRanking(s, "c"));
    expect(onStarted).toHaveBeenCalledTimes(2);
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

/**
 * Two tabs of one browser: one local storage, and a write in either tab fires
 * a `storage` event in the other (never in the tab that wrote), as browsers do.
 */
function twoTabs() {
  const data = new Map<string, string>();
  const windows = [new EventTarget(), new EventTarget()];
  const areas: Storage[] = [];
  const notify = (from: number, key: string | null) => {
    const to = 1 - from;
    windows[to].dispatchEvent(Object.assign(new Event("storage"), { key, storageArea: areas[to] }));
  };
  for (const tab of [0, 1]) {
    areas.push({
      get length() {
        return data.size;
      },
      key: (i) => [...data.keys()][i] ?? null,
      getItem: (k) => data.get(k) ?? null,
      setItem: (k, v) => {
        data.set(k, String(v));
        notify(tab, k);
      },
      removeItem: (k) => {
        data.delete(k);
        notify(tab, k);
      },
      clear: () => {
        data.clear();
        notify(tab, null);
      },
    });
  }
  const storage = (tab: number) => createSurveyStorage(areas[tab], { events: windows[tab] });
  const saved = () => {
    const raw = data.get(SURVEY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SurveyState) : null;
  };
  return { storage, saved, area: (tab: number) => areas[tab] };
}

/** A survey with a ranking, an answer and the answer step open. */
const midSurvey = (s: SurveyState) =>
  goTo(
    setDraft(addToRanking(addToRanking(s, "a"), "b"), "a", selectAnswer({ selected: null }, "x")),
    {
      kind: "answer",
      index: 1,
    },
  );

describe("survey store: another tab", () => {
  it("a 'start over' in another tab is not undone by a stale tab", () => {
    const tabs = twoTabs();
    const first = createSurveyStore(VERSION, tabs.storage(0));
    first.set(midSurvey);
    const stale = createSurveyStore(VERSION, tabs.storage(1));
    const listener = vi.fn();
    stale.subscribe(listener);
    expect(stale.get().ranked).toEqual(["a", "b"]);
    const before = stale.get();

    first.clear();
    expect(tabs.saved()).toBeNull();
    // The stale tab drops the deleted survey for a new one, back at the ranking step …
    expect(listener).toHaveBeenCalled();
    expect(stale.get()).toMatchObject({ ranked: [], notImportant: [], answers: {} });
    expect(stale.get().step).toEqual({ kind: "ranking" });
    expect(stale.get().optionSeed).not.toBe(before.optionSeed);
    // … and its next change saves that, never the deleted answers.
    stale.set((s) => addToRanking(s, "c"));
    expect(tabs.saved()).toMatchObject({ ranked: ["c"], answers: {} });
  });

  it("takes up a different survey another tab saved in place of its own", () => {
    const tabs = twoTabs();
    const stale = createSurveyStore(VERSION, tabs.storage(1));
    stale.subscribe(() => {});
    stale.set(midSurvey);
    const other = createSurveyStore(VERSION, tabs.storage(0));
    other.clear();
    other.set((s) => addToRanking(s, "z"));
    const theirs = tabs.saved()!;
    expect(stale.get()).toMatchObject({ ranked: ["z"], optionSeed: theirs.optionSeed });
    stale.set((s) => addToRanking(s, "y"));
    expect(tabs.saved()).toMatchObject({ ranked: ["z", "y"], optionSeed: theirs.optionSeed });
  });

  it("counts a new survey begun after another tab deleted the old one", () => {
    const tabs = twoTabs();
    createSurveyStore(VERSION, tabs.storage(0)).set((s) => addToRanking(s, "a"));
    const onStarted = vi.fn();
    const stale = createSurveyStore(VERSION, tabs.storage(1), { onStarted });
    stale.subscribe(() => {});
    stale.set((s) => addToRanking(s, "b"));
    expect(onStarted).not.toHaveBeenCalled();
    tabs.area(0).removeItem(SURVEY_STORAGE_KEY);
    stale.set((s) => addToRanking(s, "c"));
    expect(onStarted).toHaveBeenCalledTimes(1);
  });

  it("keeps its own survey when another tab saves the same one", () => {
    const tabs = twoTabs();
    const one = createSurveyStore(VERSION, tabs.storage(0));
    one.set((s) => addToRanking(s, "a"));
    const two = createSurveyStore(VERSION, tabs.storage(1));
    const listener = vi.fn();
    two.subscribe(listener);
    const mine = two.get();
    // Opening the survey in the first tab again saves the same survey (same seeds).
    createSurveyStore(VERSION, tabs.storage(0)).get();
    expect(listener).not.toHaveBeenCalled();
    expect(two.get()).toBe(mine);
  });

  it("a tab still on an older survey version never deletes a newer tab's survey", () => {
    const tabs = twoTabs();
    const old = createSurveyStore("v0", tabs.storage(1));
    old.subscribe(() => {});
    old.get();
    const current = createSurveyStore(VERSION, tabs.storage(0));
    current.set((s) => addToRanking(s, "a"));
    current.set((s) => addToRanking(s, "b"));
    expect(tabs.saved()).toMatchObject({ surveyContentVersion: VERSION, ranked: ["a", "b"] });
    expect(current.get().ranked).toEqual(["a", "b"]);
  });

  it("stops watching when nothing listens", () => {
    const tabs = twoTabs();
    const one = createSurveyStore(VERSION, tabs.storage(0));
    one.set((s) => addToRanking(s, "a"));
    const two = createSurveyStore(VERSION, tabs.storage(1));
    const unsubscribe = two.subscribe(() => {});
    two.get();
    unsubscribe();
    one.clear();
    expect(two.get().ranked).toEqual(["a"]);
  });
});
