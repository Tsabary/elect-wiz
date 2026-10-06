import { describe, expect, it } from "vitest";
import { matchRequestSchema, validateMatchRequest } from "@/lib/matching/contract";
import { seededShuffle } from "./shuffle";
import {
  OWN_ANSWER,
  addToRanking,
  anythingElseComplete,
  buildMatchRequest,
  createSurveyState,
  draftFor,
  editOption,
  editOwn,
  emptyDraft,
  finalAnswer,
  isAnswered,
  issueOrder,
  markNotImportant,
  moveRanked,
  normalizeStep,
  optionOrder,
  rankingComplete,
  removeFromRanking,
  selectAnswer,
  setAnythingElseImportance,
  setAnythingElseText,
  setDraft,
  setRanking,
  unmarkNotImportant,
  unrankedPool,
  type SurveyIssue,
  type SurveyState,
} from "./state";
import { createSurveyStorage, SURVEY_STORAGE_KEY } from "./storage";

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

  it("selecting a preset submits its text with its option ID, unedited", () => {
    const d = selectAnswer(emptyDraft(), "opt-3");
    expect(finalAnswer(issue, d)).toEqual({
      issueId: issue.id,
      text: "Option 3 of 0",
      startingOptionId: "opt-3",
      edited: false,
    });
  });

  it("editing a preset keeps its option ID and sets the edited flag", () => {
    const d = editOption(emptyDraft(), "opt-2", "Option 2, but slower", "Option 2 of 0");
    expect(d.selected).toBe("opt-2");
    expect(finalAnswer(issue, d)).toEqual({
      issueId: issue.id,
      text: "Option 2, but slower",
      startingOptionId: "opt-2",
      edited: true,
    });
    // Typing it back to the original counts as unedited.
    const back = editOption(d, "opt-2", "Option 2 of 0", "Option 2 of 0");
    expect(finalAnswer(issue, back)?.edited).toBe(false);
  });

  it("write-your-own has no starting option", () => {
    const d = editOwn(emptyDraft(), "My own view");
    expect(d.selected).toBe(OWN_ANSWER);
    expect(finalAnswer(issue, d)).toEqual({
      issueId: issue.id,
      text: "My own view",
      startingOptionId: null,
      edited: false,
    });
  });

  it("keeps edits to other options when switching selection", () => {
    let d = editOption(emptyDraft(), "opt-1", "changed", "Option 1 of 0");
    d = selectAnswer(d, "opt-2");
    expect(d.optionTexts["opt-1"]).toBe("changed");
    d = selectAnswer(d, "opt-1");
    expect(finalAnswer(issue, d)?.text).toBe("changed");
  });

  it("is unanswered with nothing chosen or blank text", () => {
    expect(isAnswered(issue, emptyDraft())).toBe(false);
    expect(isAnswered(issue, editOwn(emptyDraft(), "   "))).toBe(false);
    expect(isAnswered(issue, selectAnswer(emptyDraft(), "opt-1"))).toBe(true);
  });
});

describe("'anything else'", () => {
  it("is optional, but text needs an importance", () => {
    let s = createSurveyState(VERSION);
    expect(anythingElseComplete(s)).toBe(true);
    s = setAnythingElseText(s, "Public transport");
    expect(anythingElseComplete(s)).toBe(false);
    s = setAnythingElseImportance(s, "middle");
    expect(anythingElseComplete(s)).toBe(true);
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

describe("matching request", () => {
  it("produces a request the contract accepts", () => {
    let s = answered(ranked(7));
    s = setDraft(
      s,
      "issue-a",
      editOption(draftFor(s, "issue-a"), "opt-1", "edited", "Option 1 of 0"),
    );
    s = setAnythingElseImportance(setAnythingElseText(s, "  Transport  "), "minor");
    const req = buildMatchRequest(s, ISSUES, "en");
    expect(req).not.toBeNull();
    expect(matchRequestSchema.safeParse({ ...req, token: null }).success).toBe(true);
    const outcome = validateMatchRequest(
      { ...req, token: null },
      {
        surveyContentVersion: VERSION,
        issues: new Map(ISSUES.map((i) => [i.id, i.options.map((o) => o.id)])),
      },
    );
    expect(outcome.ok).toBe(true);
    expect(req!.answers[0]).toEqual({
      issueId: "issue-a",
      text: "edited",
      startingOptionId: "opt-1",
      edited: true,
    });
    expect(req!.anythingElse).toEqual({ text: "Transport", importance: "minor" });
  });

  it("omits 'anything else' when blank and refuses incomplete surveys", () => {
    expect(buildMatchRequest(answered(ranked(7)), ISSUES, "he")?.anythingElse).toBeNull();
    expect(buildMatchRequest(ranked(7), ISSUES, "he")).toBeNull();
    expect(buildMatchRequest(createSurveyState(VERSION), ISSUES, "he")).toBeNull();
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

  it("discards corrupt data", () => {
    const mem = memoryStorage();
    mem.setItem(SURVEY_STORAGE_KEY, "{not json");
    expect(createSurveyStorage(mem).load(VERSION)).toBeNull();
    mem.setItem(SURVEY_STORAGE_KEY, JSON.stringify({ hello: 1 }));
    expect(createSurveyStorage(mem).load(VERSION)).toBeNull();
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
    expect(store.get()).toEqual(saved);
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
});
