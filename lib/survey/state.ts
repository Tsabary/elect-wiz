/**
 * Client-side survey state (plan Data model §5). Pure functions over a plain,
 * JSON-serializable object, persisted to local storage by `storage.ts`.
 *
 * Nothing here is ever sent anywhere: on submit, `buildMatchInput` hands the
 * ranking and the chosen options to the scoring, which runs in the browser.
 */
import { MAX_NOT_IMPORTANT, MIN_RANKED } from "@/lib/matching/contract";
import type { MatchInput } from "@/lib/matching/score";
import { hashString, randomSeed, seededShuffle } from "./shuffle";

/** Version 2: an answer is just the chosen option. Saved version-1 surveys are dropped on load. */
export const SURVEY_SCHEMA_VERSION = 2;
export { MAX_NOT_IMPORTANT, MIN_RANKED };

export type SurveyStep = { kind: "ranking" } | { kind: "answer"; index: number };

/** What the user has done on one issue's answer screen. */
export interface AnswerDraft {
  /** The chosen option's ID, or null when nothing is chosen yet. */
  selected: string | null;
}

export interface SurveyState {
  schemaVersion: typeof SURVEY_SCHEMA_VERSION;
  surveyContentVersion: string;
  /** Seed for the unranked pool's issue order. Rerolled on every page load. */
  issueSeed: number;
  /** Seed from which each issue's option-order seed is derived. */
  optionSeed: number;
  /** Issue IDs ranked 1 (most important) … n. */
  ranked: string[];
  /** "Doesn't matter to me" issue IDs (max 5). */
  notImportant: string[];
  answers: Record<string, AnswerDraft>;
  step: SurveyStep;
  /** Set once this survey has been counted as started, so a reload never counts it again. */
  started?: boolean;
}

/** The minimal issue shape the survey logic needs. */
export interface SurveyIssue {
  id: string;
  options: { id: string; text: string }[];
}

export function createSurveyState(
  surveyContentVersion: string,
  seeds: { issueSeed?: number; optionSeed?: number } = {},
): SurveyState {
  return {
    schemaVersion: SURVEY_SCHEMA_VERSION,
    surveyContentVersion,
    issueSeed: seeds.issueSeed ?? randomSeed(),
    optionSeed: seeds.optionSeed ?? randomSeed(),
    ranked: [],
    notImportant: [],
    answers: {},
    step: { kind: "ranking" },
  };
}

// ------------------------------------------------------------------ ordering

/** This session's random issue order. */
export function issueOrder(state: SurveyState, issueIds: readonly string[]): string[] {
  return seededShuffle([...issueIds].sort(), state.issueSeed);
}

/** This session's random option order for one issue. */
export function optionOrder<T extends { id: string }>(
  state: SurveyState,
  issueId: string,
  options: readonly T[],
): T[] {
  const sorted = [...options].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return seededShuffle(sorted, hashString(`${state.optionSeed}:${issueId}`));
}

/** Issues neither ranked nor marked "doesn't matter", in this session's order. */
export function unrankedPool(state: SurveyState, issueIds: readonly string[]): string[] {
  const used = new Set([...state.ranked, ...state.notImportant]);
  return issueOrder(state, issueIds).filter((id) => !used.has(id));
}

// ------------------------------------------------------------------ ranking

function without(list: readonly string[], id: string): string[] {
  return list.filter((x) => x !== id);
}

/** Adds an issue to the ranking (at the end by default), taking it out of the other groups. */
export function addToRanking(state: SurveyState, issueId: string, index?: number): SurveyState {
  const ranked = without(state.ranked, issueId);
  const at = index === undefined ? ranked.length : Math.max(0, Math.min(index, ranked.length));
  ranked.splice(at, 0, issueId);
  return { ...state, ranked, notImportant: without(state.notImportant, issueId) };
}

/** Moves an issue back to the unranked pool. */
export function removeFromRanking(state: SurveyState, issueId: string): SurveyState {
  return { ...state, ranked: without(state.ranked, issueId) };
}

/** Moves a ranked issue from one position to another. */
export function moveRanked(state: SurveyState, from: number, to: number): SurveyState {
  if (from === to || from < 0 || from >= state.ranked.length) return state;
  const ranked = [...state.ranked];
  const [item] = ranked.splice(from, 1);
  ranked.splice(Math.max(0, Math.min(to, ranked.length)), 0, item);
  return { ...state, ranked };
}

/** Replaces the ranking wholesale (drag and drop). Unknown or duplicate IDs are dropped. */
export function setRanking(
  state: SurveyState,
  ranked: readonly string[],
  issueIds: readonly string[],
): SurveyState {
  const known = new Set(issueIds);
  const seen = new Set<string>();
  const clean = ranked.filter((id) => known.has(id) && !seen.has(id) && !!seen.add(id));
  return {
    ...state,
    ranked: clean,
    notImportant: state.notImportant.filter((id) => !seen.has(id)),
  };
}

export type MarkResult = { ok: true; state: SurveyState } | { ok: false; reason: "limit" };

/** Marks an issue "doesn't matter to me". Refuses a sixth. */
export function markNotImportant(state: SurveyState, issueId: string): MarkResult {
  if (state.notImportant.includes(issueId)) return { ok: true, state };
  if (state.notImportant.length >= MAX_NOT_IMPORTANT) return { ok: false, reason: "limit" };
  return {
    ok: true,
    state: {
      ...state,
      ranked: without(state.ranked, issueId),
      notImportant: [...state.notImportant, issueId],
    },
  };
}

/** Moves a "doesn't matter" issue back to the unranked pool. */
export function unmarkNotImportant(state: SurveyState, issueId: string): SurveyState {
  return { ...state, notImportant: without(state.notImportant, issueId) };
}

/** Every issue is either ranked or "doesn't matter", with at least 5 ranked. */
export function rankingComplete(state: SurveyState, issueIds: readonly string[]): boolean {
  const covered = new Set([...state.ranked, ...state.notImportant]);
  return (
    issueIds.every((id) => covered.has(id)) &&
    state.ranked.length >= MIN_RANKED &&
    new Set(state.ranked).size === state.ranked.length
  );
}

// ------------------------------------------------------------------ answers

export function emptyDraft(): AnswerDraft {
  return { selected: null };
}

export function draftFor(state: SurveyState, issueId: string): AnswerDraft {
  return state.answers[issueId] ?? emptyDraft();
}

export function setDraft(state: SurveyState, issueId: string, draft: AnswerDraft): SurveyState {
  return { ...state, answers: { ...state.answers, [issueId]: draft } };
}

/** Selects one of the issue's options. */
export function selectAnswer(draft: AnswerDraft, selected: string): AnswerDraft {
  return { ...draft, selected };
}

/** An answer is complete when one of the issue's own options is chosen. */
export function isAnswered(issue: SurveyIssue, draft: AnswerDraft): boolean {
  return issue.options.some((o) => o.id === draft.selected);
}

// ------------------------------------------------------------------ steps

/** Number of answer screens (one per ranked issue). */
export function answerCount(state: SurveyState): number {
  return state.ranked.length;
}

/** Clamps a stored step to what the current state allows (e.g. after a ranking change). */
export function normalizeStep(state: SurveyState, issueIds: readonly string[]): SurveyStep {
  const step = state.step;
  if (step.kind === "ranking" || !rankingComplete(state, issueIds)) return { kind: "ranking" };
  const index = Math.max(0, Math.min(step.index, state.ranked.length - 1));
  return { kind: "answer", index };
}

export function goTo(state: SurveyState, step: SurveyStep): SurveyState {
  return { ...state, step };
}

// ------------------------------------------------------------------ matching input

/**
 * The input of the local scoring: the ranking and one option ID per ranked
 * issue. "Doesn't matter" issues are simply absent. Returns null if the survey
 * isn't complete.
 */
export function buildMatchInput(
  state: SurveyState,
  issues: readonly SurveyIssue[],
): MatchInput | null {
  const byId = new Map(issues.map((i) => [i.id, i]));
  if (!rankingComplete(state, [...byId.keys()])) return null;
  const answers: Record<string, string> = {};
  for (const id of state.ranked) {
    const issue = byId.get(id);
    const { selected } = draftFor(state, id);
    if (!issue || selected === null || !isAnswered(issue, { selected })) return null;
    answers[id] = selected;
  }
  return { ranked: [...state.ranked], answers };
}
