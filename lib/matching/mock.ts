/**
 * Mock matching implementation (Phase 1). Returns canned, realistic results
 * built from whatever corpus is active, so it works with the placeholder corpus
 * now and with real party IDs later (Task 4.1).
 *
 * It never attaches registry facts (names, lists, poll notes): the route does.
 *
 * A scenario can be forced in development/preview/test (see `handler.ts`) to
 * produce every result case and every error code.
 */
import { isBelowThreshold } from "@/lib/content/polls";
import { issueAnchor, type Issue, type List, type Party } from "@/lib/content/schemas";
import {
  ERROR_CODES,
  type AgreementLevel,
  type IssueBreakdown,
  type MatchEntryCore,
  type MatchErrorCode,
  type MatchOutputCore,
  type MatchRequest,
} from "./contract";
import { MatchError, type CorpusView, type MatchingImplementation } from "./types";

export const MOCK_RESULT_SCENARIOS = [
  "default",
  "joint-list",
  "below-threshold",
  "not-polled",
  "limited-info",
  "weak-match",
  "no-usable-answers",
] as const;
export type MockResultScenario = (typeof MOCK_RESULT_SCENARIOS)[number];
export type MockScenario = MockResultScenario | `error-${MatchErrorCode}`;

export const MOCK_SCENARIOS: readonly MockScenario[] = [
  ...MOCK_RESULT_SCENARIOS,
  ...ERROR_CODES.map((c) => `error-${c}` as const),
];

export function isMockScenario(v: unknown): v is MockScenario {
  return typeof v === "string" && (MOCK_SCENARIOS as readonly string[]).includes(v);
}

/** Small deterministic string hash (FNV-1a). */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const TEXT = {
  en: {
    agrees: (t: string) => `On "${t}", the party's documented position is close to your answer.`,
    partially: (t: string) =>
      `On "${t}", the party shares part of your position but differs on how far to go.`,
    disagrees: (t: string) =>
      `On "${t}", the party's documented position differs from your answer.`,
    "party-position-unclear": (t: string) =>
      `On "${t}", the research found no clear position for this party.`,
    anythingElse: "The research mentions positions related to what you added.",
  },
  he: {
    agrees: (t: string) => `בנושא "${t}", העמדה המתועדת של המפלגה קרובה לתשובה שלך.`,
    partially: (t: string) =>
      `בנושא "${t}", המפלגה שותפה לחלק מהעמדה שלך אבל חלוקה לגבי היקף הצעדים.`,
    disagrees: (t: string) => `בנושא "${t}", העמדה המתועדת של המפלגה שונה מהתשובה שלך.`,
    "party-position-unclear": (t: string) => `בנושא "${t}", המחקר לא מצא עמדה ברורה של המפלגה.`,
    anythingElse: "במחקר יש עמדות שקשורות למה שהוספת.",
  },
} as const;

const STRONG: AgreementLevel[] = ["agrees", "agrees", "partially", "agrees", "disagrees"];
const WEAK: AgreementLevel[] = [
  "disagrees",
  "partially",
  "disagrees",
  "party-position-unclear",
  "disagrees",
];

/** Answers that are blank or trivially short carry no weight and are omitted from the breakdown. */
export function isUsableAnswer(text: string): boolean {
  return text.trim().replace(/\s+/g, " ").length >= 2;
}

function pickFirst(
  scenario: MockResultScenario,
  parties: Party[],
  listById: Map<string, List>,
): Party | undefined {
  const list = (p: Party) => listById.get(p.listId);
  switch (scenario) {
    case "joint-list":
      return parties.find((p) => (list(p)?.memberPartyIds.length ?? 0) > 1);
    case "below-threshold":
      return parties.find((p) => {
        const poll = list(p)?.poll;
        return poll?.status === "polled" && isBelowThreshold(poll.percent);
      });
    case "not-polled":
      return parties.find((p) => list(p)?.poll.status === "not_polled");
    case "limited-info":
      return parties.find((p) => p.limitedInfo);
    default:
      return undefined;
  }
}

export function mockMatch(
  req: MatchRequest,
  corpus: CorpusView,
  scenario: MockScenario = "default",
): MatchOutputCore {
  if (scenario.startsWith("error-")) {
    throw new MatchError(scenario.slice("error-".length) as MatchErrorCode);
  }
  const resultScenario = scenario as MockResultScenario;
  const listById = new Map(corpus.lists.map((l) => [l.id, l]));
  const issueById = new Map<string, Issue>(corpus.issues.map((i) => [i.id, i]));
  const seedText = JSON.stringify([
    req.ranked,
    req.answers.map((a) => a.text),
    req.anythingElse?.text ?? "",
  ]);
  const seed = hash(seedText);

  // Deterministic order: identical answers → identical result (PRD FR19).
  const ordered = [...corpus.parties].sort(
    (a, b) => hash(`${seed}:${a.id}`) - hash(`${seed}:${b.id}`),
  );
  const first = pickFirst(resultScenario, ordered, listById);
  if (first) {
    ordered.splice(ordered.indexOf(first), 1);
    ordered.unshift(first);
  }
  const count = Math.min(ordered.length, 3 + (seed % 2));
  const chosen = ordered.slice(0, count);

  const usable = req.answers.filter((a) => isUsableAnswer(a.text));
  const noUsableAnswers = resultScenario === "no-usable-answers" || usable.length === 0;
  const weakMatch = noUsableAnswers || resultScenario === "weak-match";
  const text = TEXT[req.locale];

  const entries: MatchEntryCore[] = chosen.map((party, entryIndex) => {
    const breakdown: IssueBreakdown[] = noUsableAnswers
      ? []
      : req.ranked
          .map((issueId, i) => ({ issueId, rank: i + 1 }))
          .filter(({ issueId }) => usable.some((a) => a.issueId === issueId))
          .map(({ issueId, rank }) => {
            const levels = weakMatch ? WEAK : STRONG;
            const agreement =
              levels[(hash(`${seed}:${party.id}:${issueId}`) + entryIndex) % levels.length];
            const title = issueById.get(issueId)?.[req.locale].title ?? issueId;
            return {
              issueId,
              rank,
              weight: Number(((req.ranked.length - rank + 1) / req.ranked.length).toFixed(3)),
              agreement,
              explanation: text[agreement](title),
              anchor: issueAnchor(issueId),
            };
          });
    const hasAnythingElse =
      !noUsableAnswers && !!req.anythingElse && isUsableAnswer(req.anythingElse.text);
    return {
      partyId: party.id,
      breakdown,
      anythingElseNote: hasAnythingElse
        ? { explanation: text.anythingElse, anchor: "other-positions" }
        : null,
    };
  });

  return { entries, weakMatch, noUsableAnswers };
}

export const mockImplementation: MatchingImplementation = {
  name: "mock",
  async match(req, corpus, opts) {
    // A short delay so the loading state is visible, as with a real backend.
    if (opts.delayMs) await new Promise((r) => setTimeout(r, opts.delayMs));
    return mockMatch(req, corpus, opts.scenario ?? "default");
  },
};
