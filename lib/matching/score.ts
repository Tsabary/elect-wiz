/**
 * Deterministic matching (plan-deterministic-matching.md, "APIs & interfaces"
 * §2–§4). A pure function of the matching content and the user's ranking and
 * answers: the same input always gives the same result.
 *
 * Runs in the browser, in Vitest and in the validation script, so this module
 * must stay free of Node-only APIs and of `server-only` imports.
 */
import {
  issueAnchor,
  pairKey,
  type DistancePair,
  type MatchingConfig,
  type PartyTexts,
  type PositionRow,
  type TextAgreement,
} from "../content/schemas";
import { hashString } from "../survey/shuffle";
import type { AgreementLevel, IssueBreakdown, MatchEntryCore } from "./contract";

// ------------------------------------------------------------------ shapes

/**
 * The parts of a positions row and of a distance grid the scoring reads. The
 * content files (`PositionsFile`, `DistancesFile`) fit these as they are; the
 * matching bundle carries exactly these and leaves the reviewer notes out.
 */
export type ScoringRow = Pick<PositionRow, "partyId" | "unclear" | "held" | "ruledOut">;
export interface ScoringPositions {
  issueId: string;
  rows: readonly ScoringRow[];
}
export interface ScoringGrid {
  issueId: string;
  pairs: readonly Pick<DistancePair, "a" | "b" | "closeness">[];
}

/** The matching content the scoring works from (one corpus). */
export interface MatchingData {
  /** One file per issue. */
  positions: readonly ScoringPositions[];
  /** One grid per issue. */
  distances: readonly ScoringGrid[];
  config: MatchingConfig;
  /**
   * One language's result texts, one entry per party. Optional: without them
   * (or without a party's entry) explanations are empty and there are no points.
   */
  texts?: readonly PartyTexts[];
}

export interface MatchInput {
  /** Issue IDs ranked 1 (most important) … n. "Doesn't matter" issues are absent. */
  ranked: readonly string[];
  /** Issue ID → the chosen option ID, one per ranked issue. Other entries are ignored. */
  answers: Readonly<Record<string, string>>;
}

export interface MatchResult {
  /** Every given party in score order, top match first. */
  entries: MatchEntryCore[];
  weakMatch: boolean;
}

/** One party's place in the full order. The score is internal and never shown. */
export interface RankedParty {
  partyId: string;
  /** Weighted average of the issue scores, 0–1. */
  score: number;
  /** Issue scores in the user's rank order. */
  issueScores: number[];
}

/** The user's input doesn't fit the content: unknown IDs, a missing answer, a repeated issue. */
export class MatchInputError extends Error {
  readonly details: string[];
  constructor(details: string[]) {
    super(`invalid matching input: ${details.join("; ")}`);
    this.name = "MatchInputError";
    this.details = details;
  }
}

/** The matching content has a gap the scoring can't work around (validation should catch these). */
export class MatchDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MatchDataError";
  }
}

// ------------------------------------------------------------------ building blocks

/**
 * Scores that are equal on paper can differ in their last bits after floating
 * point arithmetic. Cut-offs and ties are judged with this tolerance.
 */
const EPSILON = 1e-9;

/** Closeness of two options of one issue: 1 for the same option, else the grid's value. */
export function closeness(grid: ScoringGrid, a: string, b: string): number {
  if (a === b) return 1;
  const key = pairKey(a, b);
  const pair = grid.pairs.find((p) => pairKey(p.a, p.b) === key);
  if (!pair) {
    throw new MatchDataError(
      `the distance grid for issue "${grid.issueId}" has no entry for the pair "${a}"/"${b}"`,
    );
  }
  return pair.closeness;
}

/**
 * A party's score on one issue for a user who chose `optionId`: the best of the
 * party's held options, each as level value × closeness to the user's option.
 * An unclear row scores the fixed unclear value.
 */
export function issueScore(
  row: ScoringRow,
  optionId: string,
  grid: ScoringGrid,
  config: MatchingConfig,
): number {
  if (row.unclear || row.held.length === 0) return config.unclear;
  const score = Math.max(
    ...row.held.map(
      (h) =>
        config.levels[h.level] *
        (h.inPart ? config.inPart : 1) *
        closeness(grid, h.optionId, optionId),
    ),
  );
  // Being near an option the party rejected is common ground, not a partial match.
  return row.ruledOut?.includes(optionId) ? Math.min(score, config.ruledOutMax) : score;
}

/** The agreement label for an issue score, from the two cut-offs. */
export function agreementLabel(score: number, config: MatchingConfig): TextAgreement {
  if (score >= config.agreement.agrees - EPSILON) return "agrees";
  if (score >= config.agreement.partially - EPSILON) return "partially";
  return "disagrees";
}

/** The label shown for a party on an issue: computed from the score, or "unclear" for an unclear row. */
export function issueAgreement(
  row: ScoringRow,
  optionId: string,
  grid: ScoringGrid,
  config: MatchingConfig,
): AgreementLevel {
  if (row.unclear || row.held.length === 0) return "party-position-unclear";
  // An option the research says the party rejects is a disagreement whatever the
  // score: being near a rejected option is not partial agreement.
  if (row.ruledOut?.includes(optionId)) return "disagrees";
  // A row resting only on tentative evidence doesn't show the party opposing the
  // options it isn't linked to, so those read as unclear, not as disagreement.
  const tentative = row.held.every((h) => h.level === "secondary");
  if (tentative && !row.held.some((h) => h.optionId === optionId)) return "party-position-unclear";
  return agreementLabel(issueScore(row, optionId, grid, config), config);
}

/**
 * The weight shown for the issue ranked `rank` of `n`: (n − rank + 1) / n, so
 * the top issue is 1 and the last is 1 / n.
 */
export function displayWeight(rank: number, n: number): number {
  return (n - rank + 1) / n;
}

/**
 * A party's overall score: the average of its issue scores (given in rank
 * order) weighted linearly by rank, so the top of n counts n and the last 1.
 */
export function partyScore(issueScores: readonly number[]): number {
  const n = issueScores.length;
  if (n === 0) return 0;
  let sum = 0;
  let weights = 0;
  issueScores.forEach((score, i) => {
    sum += (n - i) * score;
    weights += n - i;
  });
  return sum / weights;
}

/** True when the top score is below the configured weak-match level. */
export function isWeakMatch(topScore: number, config: MatchingConfig): boolean {
  return topScore < config.weakMatchBelow - EPSILON;
}

/**
 * Where a party falls among parties with an equal score: a hash of the user's
 * ranking and answers combined with the party ID. The same input always gives
 * the same order, and no party is favoured across inputs (an alphabetical rule
 * would hand every tie to the same party).
 */
export function tieBreakValue(input: MatchInput, partyId: string): number {
  const answers = input.ranked.map((id) => `${id}=${input.answers[id]}`).join("&");
  return hashString(`${partyId}\n${answers}`);
}

// ------------------------------------------------------------------ scoring

interface IssueData {
  rows: Map<string, ScoringRow>;
  grid: ScoringGrid;
}

/** Checks the input against the content and returns each ranked issue's data, in rank order. */
function resolveIssues(data: MatchingData, input: MatchInput): IssueData[] {
  const details: string[] = [];
  if (input.ranked.length === 0) details.push("no ranked issues");
  if (new Set(input.ranked).size !== input.ranked.length)
    details.push("ranked issues must be unique");

  const resolved: IssueData[] = [];
  for (const issueId of new Set(input.ranked)) {
    const positions = data.positions.find((p) => p.issueId === issueId);
    const grid = data.distances.find((d) => d.issueId === issueId);
    if (!positions || !grid) {
      details.push(`unknown issue id "${issueId}"`);
      continue;
    }
    const optionId = Object.prototype.hasOwnProperty.call(input.answers, issueId)
      ? input.answers[issueId]
      : undefined;
    if (typeof optionId !== "string") {
      details.push(`missing answer for ranked issue "${issueId}"`);
      continue;
    }
    // An issue's options are the ones its grid relates to each other.
    if (!grid.pairs.some((p) => p.a === optionId || p.b === optionId)) {
      details.push(`unknown option "${optionId}" for issue "${issueId}"`);
      continue;
    }
    resolved.push({ rows: new Map(positions.rows.map((r) => [r.partyId, r])), grid });
  }
  if (details.length > 0) throw new MatchInputError(details);
  return resolved;
}

function rowOf(issue: IssueData, partyId: string): ScoringRow {
  const row = issue.rows.get(partyId);
  if (!row) {
    throw new MatchDataError(
      `party "${partyId}" has no row in the positions for issue "${issue.grid.issueId}"`,
    );
  }
  return row;
}

/**
 * Every given party in result order: highest score first, equal scores ordered
 * by the tie-break, with the scores. Used by the profile test.
 */
export function rankParties(
  data: MatchingData,
  input: MatchInput,
  partyIds: readonly string[],
): RankedParty[] {
  const issues = resolveIssues(data, input);
  const ranked = [...new Set(partyIds)].map((partyId) => {
    const issueScores = issues.map((issue, i) =>
      issueScore(rowOf(issue, partyId), input.answers[input.ranked[i]], issue.grid, data.config),
    );
    const score = partyScore(issueScores);
    return {
      partyId,
      score,
      issueScores,
      // Scores are compared in whole steps of the tolerance, so the order is a strict one.
      step: Math.round(score / EPSILON),
      tie: tieBreakValue(input, partyId),
    };
  });
  ranked.sort((a, b) => b.step - a.step || a.tie - b.tie || (a.partyId < b.partyId ? -1 : 1));
  return ranked.map(({ partyId, score, issueScores }) => ({ partyId, score, issueScores }));
}

/**
 * The result for a user: every party of `researchedPartyIds` in score order
 * (top match first), each with its per-issue breakdown and its "also worth
 * knowing" points, and the weak-match flag. How many of them are shown is the
 * result view's business.
 *
 * Throws `MatchInputError` for input that doesn't fit the content, and
 * `MatchDataError` when a party has no row for a ranked issue or a grid lacks a
 * pair the score needs.
 */
export function scoreMatch(
  data: MatchingData,
  input: MatchInput,
  researchedPartyIds: readonly string[],
): MatchResult {
  const ranked = rankParties(data, input, researchedPartyIds);
  const issues = resolveIssues(data, input);
  const n = input.ranked.length;

  const entries = ranked.map(({ partyId }): MatchEntryCore => {
    const texts = data.texts?.find((t) => t.partyId === partyId);
    const breakdown = issues.map((issue, i): IssueBreakdown => {
      const issueId = input.ranked[i];
      const optionId = input.answers[issueId];
      const text = texts?.issues[issueId];
      return {
        issueId,
        rank: i + 1,
        weight: displayWeight(i + 1, n),
        agreement: issueAgreement(rowOf(issue, partyId), optionId, issue.grid, data.config),
        explanation: text?.unclear?.text ?? text?.options?.[optionId]?.text ?? "",
        anchor: text?.anchor ?? issueAnchor(issueId),
      };
    });
    return {
      partyId,
      breakdown,
      points: (texts?.points ?? []).map(({ text, anchor }) => ({ text, anchor })),
    };
  });

  return {
    entries,
    weakMatch: ranked.length > 0 && isWeakMatch(ranked[0].score, data.config),
  };
}
