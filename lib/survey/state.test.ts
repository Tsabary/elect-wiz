import { describe, expect, it } from "vitest";
import { seededShuffle } from "./shuffle";
import {
  SURVEY_SCHEMA_VERSION,
  addToRanking,
  buildMatchInput,
  canSkipRest,
  createSurveyState,
  draftFor,
  emptyDraft,
  hasProgress,
  isAnswered,
  issueOrder,
  markNotImportant,
  moveRanked,
  normalizeStep,
  optionOrder,
  rankingComplete,
  removeFromRanking,
  selectAnswer,
  setDraft,
  setRanking,
  skipRest,
  unmarkNotImportant,
  unrankedPool,
  type SurveyIssue,
  type SurveyState,
} from "./state";
import { createSurveyStorage, RESULT_RETENTION_DAYS, SURVEY_STORAGE_KEY } from "./storage";

const ISSUES: SurveyIssue[] = Array.from({ length: 10 }, (_, i) => ({
  id: `issue-${String.fromCharCode(97 + i)}`,
  options: [
    { id: "opt-1", text: `Option 1 of ${i}` },
    { id: "opt-2", text: `Option 2 of ${i}` },
    { id: "opt-3", text: `Option 3 of ${i}` },
    { id: "opt-4", text: `Option 4 of ${i}` },
  ],
}));
const IDS = ISSUES.map((i) => i.id);
const VERSION = "v1";

/** Ranks the first `n` issues, marks the rest "doesn't matter". */
function ranked(n = 7, s = createSurveyState(VERSION, { issueSeed: 1, optionSeed: 2 })) {
  let state = s;
  for (const id of IDS.slice(0, n)) state = addToRanking(state, id);
  for (const id of IDS.slice(n)) {
    const r = markNotImportant(state, id);
    if (r.ok) state = r.state;
  }
  return state;
}

function answered(state: SurveyState): SurveyState {
  let s = state;
  for (const id of s.ranked) s = setDraft(s, id, selectAnswer(emptyDraft(), "opt-2"));
  return s;
}

/** In-memory Storage double. */
function memoryStorage(): Storage {
  const m = new Map<string, string>();
  return {
    get length() {
      return m.size;
    },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, String(v)),
  };
}

describe("seeded shuffling", () => {
  it("is deterministic for a seed and differs across seeds", () => {
    const items = Array.from({ length: 10 }, (_, i) => i);
    expect(seededShuffle(items, 42)).toEqual(seededShuffle(items, 42));
    const orders = new Set([1, 2, 3, 4, 5].map((s) => seededShuffle(items, s).join(",")));
    expect(orders.size).toBeGreaterThan(1);
    expect([...seededShuffle(items, 7)].sort((a, b) => a - b)).toEqual(items);
  });

  it("gives the same issue and option order for the same state, regardless of input order", () => {
    const s = createSurveyState(VERSION, { issueSeed: 99, optionSeed: 5 });
    expect(issueOrder(s, IDS)).toEqual(issueOrder(s, [...IDS].reverse()));
    const opts = ISSUES[0].options;
    expect(optionOrder(s, "issue-a", opts)).toEqual(optionOrder(s, "issue-a", [...opts].reverse()));
  });

  it("gives new sessions different issue orders", () => {
    const orders = new Set(
      Array.from({ length: 6 }, () => issueOrder(createSurveyState(VERSION), IDS).join(",")),
    );
    expect(orders.size).toBeGreaterThan(1);
  });

  it("shuffles option order per issue", () => {
    const s = createSurveyState(VERSION, { issueSeed: 1, optionSeed: 123 });
    const orders = new Set(
      IDS.map((id) =>
        optionOrder(s, id, ISSUES[0].options)
          .map((o) => o.id)
          .join(","),
      ),
    );
    expect(orders.size).toBeGreaterThan(1);
  });
});

describe("ranking", () => {
  it("adds, inserts, moves and removes issues", () => {
    let s = createSurveyState(VERSION, { issueSeed: 1, optionSeed: 1 });
    s = addToRanking(s, "issue-a");
    s = addToRanking(s, "issue-b");
    s = addToRanking(s, "issue-c", 0);
    expect(s.ranked).toEqual(["issue-c", "issue-a", "issue-b"]);
    s = moveRanked(s, 0, 2);
    expect(s.ranked).toEqual(["issue-a", "issue-b", "issue-c"]);
    s = removeFromRanking(s, "issue-b");
    expect(s.ranked).toEqual(["issue-a", "issue-c"]);
    expect(unrankedPool(s, IDS)).not.toContain("issue-a");
    expect(unrankedPool(s, IDS)).toContain("issue-b");
  });

  it("caps 'doesn't matter' at 5 and refuses the sixth", () => {
    let s = createSurveyState(VERSION);
    for (const id of IDS.slice(0, 5)) {
      const r = markNotImportant(s, id);
      expect(r.ok).toBe(true);
      if (r.ok) s = r.state;
    }
    const sixth = markNotImportant(s, IDS[5]);
    expect(sixth).toEqual({ ok: false, reason: "limit" });
    s = unmarkNotImportant(s, IDS[0]);
    expect(markNotImportant(s, IDS[5]).ok).toBe(true);
  });

  it("marking a ranked issue 'doesn't matter' removes it from the ranking, and vice versa", () => {
    let s = addToRanking(createSurveyState(VERSION), "issue-a");
    const r = markNotImportant(s, "issue-a");
    if (!r.ok) throw new Error("unexpected");
    s = r.state;
    expect(s.ranked).toEqual([]);
    expect(s.notImportant).toEqual(["issue-a"]);
    s = addToRanking(s, "issue-a");
    expect(s.notImportant).toEqual([]);
  });

  it("is complete only when every non-excluded issue is ranked", () => {
    expect(rankingComplete(ranked(7), IDS)).toBe(true);
    expect(rankingComplete(removeFromRanking(ranked(7), "issue-a"), IDS)).toBe(false);
  });

  it("skipRest marks the unplaced issues 'doesn't matter' once enough are ranked", () => {
    let s = createSurveyState(VERSION);
    for (const id of IDS.slice(0, 4)) s = addToRanking(s, id);
    expect(canSkipRest(s, IDS)).toBe(false);
    expect(skipRest(s, IDS)).toBe(s);
    s = addToRanking(s, IDS[4]);
    const r = markNotImportant(s, IDS[5]);
    if (!r.ok) throw new Error("unexpected");
    s = r.state;
    expect(canSkipRest(s, IDS)).toBe(true);
    const done = skipRest(s, IDS);
    expect(done.ranked).toEqual(IDS.slice(0, 5));
    expect([...done.notImportant].sort()).toEqual(IDS.slice(5));
    expect(rankingComplete(done, IDS)).toBe(true);
    expect(canSkipRest(done, IDS)).toBe(false);
  });

  it("setRanking drops unknown and duplicate IDs", () => {
    const s = setRanking(
      createSurveyState(VERSION),
      ["issue-a", "nope", "issue-a", "issue-b"],
      IDS,
    );
    expect(s.ranked).toEqual(["issue-a", "issue-b"]);
  });
});

describe("answers", () => {
  const issue = ISSUES[0];

  it("an answer draft holds only the selected option ID", () => {
    expect(emptyDraft()).toEqual({ selected: null });
    expect(selectAnswer(emptyDraft(), "opt-3")).toEqual({ selected: "opt-3" });
    expect(selectAnswer(selectAnswer(emptyDraft(), "opt-3"), "opt-1")).toEqual({
      selected: "opt-1",
    });
  });

  it("is answered only when one of the issue's own options is chosen", () => {
    expect(isAnswered(issue, emptyDraft())).toBe(false);
    expect(isAnswered(issue, selectAnswer(emptyDraft(), "opt-1"))).toBe(true);
    expect(isAnswered(issue, selectAnswer(emptyDraft(), "not-an-option"))).toBe(false);
  });

  it("keeps each issue's answer separately", () => {
    let s = createSurveyState(VERSION);
    s = setDraft(s, "issue-a", selectAnswer(draftFor(s, "issue-a"), "opt-2"));
    s = setDraft(s, "issue-b", selectAnswer(draftFor(s, "issue-b"), "opt-4"));
    expect(s.answers).toEqual({
      "issue-a": { selected: "opt-2" },
      "issue-b": { selected: "opt-4" },
    });
    expect(draftFor(s, "issue-c")).toEqual(emptyDraft());
  });
});

describe("steps", () => {
  it("falls back to ranking when the ranking is incomplete, and clamps answer indexes", () => {
    const s = { ...ranked(6), step: { kind: "answer" as const, index: 9 } };
    expect(normalizeStep(s, IDS)).toEqual({ kind: "answer", index: 5 });
    const broken = removeFromRanking(s, "issue-a");
    expect(normalizeStep(broken, IDS)).toEqual({ kind: "ranking" });
  });
});

describe("matching input", () => {
  it("holds the ranking in order and one option ID per ranked issue", () => {
    let s = answered(ranked(7));
    s = setDraft(s, "issue-a", selectAnswer(draftFor(s, "issue-a"), "opt-1"));
    s = moveRanked(s, 0, 2);
    const input = buildMatchInput(s, ISSUES);
    expect(input).toEqual({
      ranked: ["issue-b", "issue-c", "issue-a", "issue-d", "issue-e", "issue-f", "issue-g"],
      answers: {
        "issue-a": "opt-1",
        "issue-b": "opt-2",
        "issue-c": "opt-2",
        "issue-d": "opt-2",
        "issue-e": "opt-2",
        "issue-f": "opt-2",
        "issue-g": "opt-2",
      },
    });
    // The input is a copy: later changes to the survey don't reach a result in progress.
    expect(input!.ranked).not.toBe(s.ranked);
  });

  it("leaves out 'doesn't matter' issues, even ones answered before they were set aside", () => {
    let s = answered(ranked(7));
    const r = markNotImportant(s, "issue-g");
    if (!r.ok) throw new Error("unexpected");
    s = r.state;
    const input = buildMatchInput(s, ISSUES)!;
    expect(input.ranked).not.toContain("issue-g");
    expect(Object.keys(input.answers).sort()).toEqual(IDS.slice(0, 6));
  });

  it("refuses incomplete surveys", () => {
    expect(buildMatchInput(ranked(7), ISSUES)).toBeNull();
    expect(buildMatchInput(createSurveyState(VERSION), ISSUES)).toBeNull();
    const oneMissing = setDraft(answered(ranked(7)), "issue-c", emptyDraft());
    expect(buildMatchInput(oneMissing, ISSUES)).toBeNull();
    const unknownOption = setDraft(answered(ranked(7)), "issue-c", { selected: "nope" });
    expect(buildMatchInput(unknownOption, ISSUES)).toBeNull();
  });
});

describe("progress worth resuming", () => {
  const fresh = () => createSurveyState(VERSION, { issueSeed: 1, optionSeed: 2 });

  it("a survey that was only opened is not progress", () => {
    expect(hasProgress(fresh())).toBe(false);
    // Moving between screens, or an answer screen opened with nothing chosen, changes nothing.
    expect(hasProgress({ ...fresh(), step: { kind: "answer", index: 0 } })).toBe(false);
    expect(hasProgress(setDraft(fresh(), "issue-a", emptyDraft()))).toBe(false);
    expect(hasProgress({ ...fresh(), started: false })).toBe(false);
  });

  it("a ranked issue, a 'doesn't matter' issue or an answer is progress", () => {
    expect(hasProgress(addToRanking(fresh(), "issue-a"))).toBe(true);
    const marked = markNotImportant(fresh(), "issue-a");
    expect(marked.ok && hasProgress(marked.state)).toBe(true);
    expect(hasProgress(setDraft(fresh(), "issue-a", selectAnswer(emptyDraft(), "opt-1")))).toBe(
      true,
    );
  });

  it("a survey counted as started stays progress after its changes are undone", () => {
    const undone = removeFromRanking(
      addToRanking({ ...fresh(), started: true }, "issue-a"),
      "issue-a",
    );
    expect(undone.ranked).toEqual([]);
    expect(hasProgress(undone)).toBe(true);
  });
});

describe("storage", () => {
  it("resumes an identical session", () => {
    const store = createSurveyStorage(memoryStorage());
    const s = answered(ranked(7));
    store.save(s);
    const loaded = store.load(VERSION);
    expect(loaded).toEqual(s);
    expect(issueOrder(loaded!, IDS)).toEqual(issueOrder(s, IDS));
    expect(optionOrder(loaded!, "issue-c", ISSUES[2].options)).toEqual(
      optionOrder(s, "issue-c", ISSUES[2].options),
    );
  });

  it("clears the state (after a result is shown)", () => {
    const mem = memoryStorage();
    const store = createSurveyStorage(mem);
    store.save(ranked(7));
    store.clear();
    expect(store.load(VERSION)).toBeNull();
    expect(mem.getItem(SURVEY_STORAGE_KEY)).toBeNull();
  });

  it("discards a saved state from a different survey-content version", () => {
    const mem = memoryStorage();
    const store = createSurveyStorage(mem);
    store.save(ranked(7));
    expect(store.load("v2")).toBeNull();
    expect(mem.getItem(SURVEY_STORAGE_KEY)).toBeNull();
  });

  it("discards a survey saved under schema version 1", () => {
    expect(SURVEY_SCHEMA_VERSION).toBe(2);
    const mem = memoryStorage();
    // What version 1 saved: editable answers and the "anything else" step.
    const v1 = {
      ...ranked(7),
      schemaVersion: 1,
      answers: { "issue-a": { selected: "own", optionTexts: {}, ownText: "My own view" } },
      anythingElse: { text: "Transport", importance: "minor" },
      step: { kind: "anything-else" },
    };
    mem.setItem(SURVEY_STORAGE_KEY, JSON.stringify(v1));
    expect(createSurveyStorage(mem).load(VERSION)).toBeNull();
    expect(mem.getItem(SURVEY_STORAGE_KEY)).toBeNull();
  });

  it("discards corrupt data", () => {
    const mem = memoryStorage();
    mem.setItem(SURVEY_STORAGE_KEY, "{not json");
    expect(createSurveyStorage(mem).load(VERSION)).toBeNull();
    mem.setItem(SURVEY_STORAGE_KEY, JSON.stringify({ hello: 1 }));
    expect(createSurveyStorage(mem).load(VERSION)).toBeNull();
  });

  it("keeps a finished survey for 7 days after its result was first shown, then discards it", () => {
    expect(RESULT_RETENTION_DAYS).toBe(7);
    const DAY = 24 * 60 * 60 * 1000;
    const finishedAt = Date.parse("2026-10-14T09:00:00Z");
    let now = finishedAt;
    const mem = memoryStorage();
    const store = createSurveyStorage(mem, { now: () => now });
    const finished = { ...answered(ranked(7)), finished: true, finishedAt };
    store.save(finished);
    now = finishedAt + 7 * DAY - 1;
    expect(store.load(VERSION)).toEqual(finished);
    now = finishedAt + 7 * DAY;
    expect(store.load(VERSION)).toBeNull();
    expect(mem.getItem(SURVEY_STORAGE_KEY)).toBeNull();
  });

  it("discards a finished survey with no record of when it finished; keeps unfinished ones", () => {
    const mem = memoryStorage();
    const later = Date.parse("2027-01-01T00:00:00Z");
    const store = createSurveyStorage(mem, { now: () => later });
    store.save({ ...answered(ranked(7)), finished: true });
    expect(store.load(VERSION)).toBeNull();
    const unfinished = answered(ranked(7));
    store.save(unfinished);
    expect(store.load(VERSION)).toEqual(unfinished);
  });

  it("with `keep`, only looks: another version or an expired result is not returned but stays", () => {
    const mem = memoryStorage();
    const other = { ...ranked(7), surveyContentVersion: "v-next" };
    mem.setItem(SURVEY_STORAGE_KEY, JSON.stringify(other));
    expect(createSurveyStorage(mem).load(VERSION, { keep: true })).toBeNull();
    expect(JSON.parse(mem.getItem(SURVEY_STORAGE_KEY)!)).toEqual(other);
  });

  it("forgetExpired deletes an expired result whatever its version, and nothing else", () => {
    const DAY = 24 * 60 * 60 * 1000;
    const finishedAt = Date.parse("2026-10-14T09:00:00Z");
    let now = finishedAt + 6 * DAY;
    const mem = memoryStorage();
    const store = createSurveyStorage(mem, { now: () => now });
    const finished = {
      ...answered(ranked(7)),
      surveyContentVersion: "v-other",
      finished: true,
      finishedAt,
    };
    store.save(finished);
    store.forgetExpired();
    expect(mem.getItem(SURVEY_STORAGE_KEY)).not.toBeNull();
    now = finishedAt + 7 * DAY;
    store.forgetExpired();
    expect(mem.getItem(SURVEY_STORAGE_KEY)).toBeNull();
    // A survey under way is never expired.
    store.save(answered(ranked(7)));
    now += 365 * DAY;
    store.forgetExpired();
    expect(mem.getItem(SURVEY_STORAGE_KEY)).not.toBeNull();
  });

  it("works without resume when storage is unavailable or throws", () => {
    const none = createSurveyStorage(null);
    expect(none.available).toBe(false);
    none.save(ranked(7));
    expect(none.load(VERSION)).toBeNull();

    const throwing = memoryStorage();
    throwing.setItem = () => {
      throw new Error("SecurityError");
    };
    const store = createSurveyStorage(throwing);
    expect(store.available).toBe(false);
    expect(() => store.save(ranked(7))).not.toThrow();
    expect(() => store.clear()).not.toThrow();
  });
});

describe("survey store", () => {
  it("loads saved progress, persists changes and starts fresh after clear", async () => {
    const { createSurveyStore } = await import("./store");
    const mem = memoryStorage();
    const storage = createSurveyStorage(mem);
    const saved = ranked(7);
    storage.save(saved);
    const store = createSurveyStore(VERSION, storage);
    expect({ ...store.get(), issueSeed: saved.issueSeed }).toEqual(saved);
    let calls = 0;
    store.subscribe(() => calls++);
    store.set((s) => addToRanking(removeFromRanking(s, "issue-a"), "issue-a", 0));
    expect(calls).toBe(1);
    expect(createSurveyStorage(mem).load(VERSION)?.ranked[0]).toBe("issue-a");
    store.clear();
    expect(mem.getItem(SURVEY_STORAGE_KEY)).toBeNull();
    expect(store.get().ranked).toEqual([]);
    expect(store.get().issueSeed).not.toBe(saved.issueSeed);
  });

  it("reshuffles the pool on every load but keeps the option order", async () => {
    const { createSurveyStore } = await import("./store");
    const storage = createSurveyStorage(memoryStorage());
    const saved = ranked(7);
    storage.save(saved);
    const seeds = new Set<number>();
    for (let i = 0; i < 5; i++) {
      const loaded = createSurveyStore(VERSION, storage).get();
      seeds.add(loaded.issueSeed);
      expect(loaded.optionSeed).toBe(saved.optionSeed);
      expect(loaded.ranked).toEqual(saved.ranked);
    }
    expect(seeds.size).toBeGreaterThan(1);
  });
});
