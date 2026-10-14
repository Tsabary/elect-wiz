/**
 * The matching contract (plan-deterministic-matching.md, "APIs & interfaces"
 * §2 and §7): the shape of a result and the two failures that can still happen.
 * Matching runs in the browser (`score.ts`) from the matching bundle
 * (`data.ts`); nothing here is ever sent to a server.
 */
import type { PollNote } from "@/lib/content/polls";

// ------------------------------------------------------------------ limits

export const MIN_RANKED = 5;
export const MAX_RANKED = 10;
export const MAX_NOT_IMPORTANT = 5;

// ------------------------------------------------------------------ errors

export const ERROR_CODES = [
  /** The matching bundle could not be loaded (network failure, timeout, unreadable file). */
  "bundle_load_failed",
  /** The bundle was built for other survey content than the survey the user answered. */
  "content_version_mismatch",
] as const;
export type MatchErrorCode = (typeof ERROR_CODES)[number];

export interface ErrorInfo {
  /** What the UI offers: "retry" loads the bundle again; "restart" starts a new survey. */
  action: "retry" | "restart";
}

export const ERROR_INFO: Record<MatchErrorCode, ErrorInfo> = {
  bundle_load_failed: { action: "retry" },
  content_version_mismatch: { action: "restart" },
};

export function errorInfo(code: MatchErrorCode): ErrorInfo {
  return ERROR_INFO[code];
}

/** next-intl message key for an error code, under the `MatchErrors` namespace. */
export function errorMessageKey(code: MatchErrorCode): `MatchErrors.${MatchErrorCode}` {
  return `MatchErrors.${code}`;
}

// ------------------------------------------------------------------ result

export const AGREEMENT_LEVELS = [
  "agrees",
  "partially",
  "disagrees",
  "party-position-unclear",
] as const;
export type AgreementLevel = (typeof AGREEMENT_LEVELS)[number];

export interface IssueBreakdown {
  issueId: string;
  /** The user's rank for this issue (1 = most important). */
  rank: number;
  /** Display weight, (n − rank + 1) / n: the top issue is 1. */
  weight: number;
  agreement: AgreementLevel;
  /** The text for the option the user chose, in the bundle's language. */
  explanation: string;
  /** Anchor in the party's research document (e.g. "issue-cost-of-living"). */
  anchor: string;
}

/** An "also worth knowing" point about a party. */
export interface MatchPoint {
  text: string;
  /** An `other-…` anchor in the party's research document. */
  anchor: string;
}

/** What the scoring produces for one party. Contains no registry facts. */
export interface MatchEntryCore {
  partyId: string;
  /**
   * The party's score as a whole percent, 0–100 (`matchPercent` in `score.ts`).
   * Never increases down the entries; parties tied in score show the same value.
   */
  percent: number;
  /** One item per ranked issue, in rank order. */
  breakdown: IssueBreakdown[];
  /** 2–3 points from the matching content. */
  points: MatchPoint[];
}

/**
 * Registry facts about a researched party, built on the server by
 * `partyMetadata` (`lib/content/party-view.ts`), never by the scoring.
 */
export interface PartyMetadata {
  name: string;
  listId: string;
  listName: string;
  ballotLetters: string;
  isJointList: boolean;
  partners: { id: string; name: string }[];
  limitedInfo: boolean;
  /** Threshold or not-polled note; always null during the poll blackout. */
  pollNote: PollNote | null;
}

export interface MatchEntry extends MatchEntryCore {
  metadata: PartyMetadata;
  /**
   * Set only when this party's explanations and points are in another language
   * than the result's (the "Hebrew content pending" fallback): the view marks
   * them with it and shows a notice.
   */
  textsLang?: "he" | "en";
}

/** A user's result: what the result view renders. */
export interface MatchResponse {
  /** Every researched party in score order, top match first. */
  entries: MatchEntry[];
  weakMatch: boolean;
  meta: { surveyContentVersion: string; matchingVersion: string };
}

/**
 * How many leading entries count as "the top few": what a share link and
 * the tally carry and what the profile test's `inTop4` looks at. It doesn't cap the result.
 */
export const TOP_ENTRIES = 4;

/**
 * How many leading entries the result shows as full cards; the rest sit behind
 * the "show all" control (owner decision 2026-10-13).
 */
export const FULL_ENTRIES = 5;
