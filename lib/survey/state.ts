/**
 * Client-side survey state (plan Data model §5). Pure functions over a plain,
 * JSON-serializable object, persisted to local storage by `storage.ts`.
 *
 * Nothing here is ever sent anywhere until the user submits; then only the
 * matching-contract request built by `buildMatchRequest` is sent.
 */
import {
  MAX_NOT_IMPORTANT,
  MIN_RANKED,
  type AnythingElseImportance,
  type MatchAnswer,
  type MatchRequest,
} from "@/lib/matching/contract";
import { hashString, randomSeed, seededShuffle } from "./shuffle";

export const SURVEY_SCHEMA_VERSION = 1;
export { MAX_NOT_IMPORTANT, MIN_RANKED };

export type SurveyStep =
  { kind: "ranking" } | { kind: "answer"; index: number } | { kind: "anything-else" };

/** What the user has done on one issue's answer screen. */
export interface AnswerDraft {
  /** An option ID, "own" for the write-your-own field, or null when nothing is chosen yet. */
  selected: string | null;
  /** Edited wording of preset options, by option ID. Absent = unedited. */
  optionTexts: Record<string, string>;
  /** Text of the write-your-own field. */
  ownText: string;
}

export interface SurveyState {
  schemaVersion: typeof SURVEY_SCHEMA_VERSION;
  surveyContentVersion: string;
  /** Seed for the unranked pool's issue order. */
  issueSeed: number;
  /** Seed from which each issue's option-order seed is derived. */
  optionSeed: number;
  /** Issue IDs ranked 1 (most important) … n. */
  ranked: string[];
  /** "Doesn't matter to me" issue IDs (max 5). */
  notImportant: string[];
  answers: Record<string, AnswerDraft>;
  anythingElse: { text: string; importance: AnythingElseImportance | null };
  step: SurveyStep;
}

/** The minimal issue shape the survey logic needs. */
export interface SurveyIssue {
  id: string;
  options: { id: string; text: string }[];
}

export const OWN_ANSWER = "own";

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
    anythingElse: { text: "", importance: null },
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
  return { selected: null, optionTexts: {}, ownText: "" };
}

export function draftFor(state: SurveyState, issueId: string): AnswerDraft {
  return state.answers[issueId] ?? emptyDraft();
}

export function setDraft(state: SurveyState, issueId: string, draft: AnswerDraft): SurveyState {
  return { ...state, answers: { ...state.answers, [issueId]: draft } };
}

/** Selects a preset option (or "own") without changing any text. */
export function selectAnswer(draft: AnswerDraft, selected: string): AnswerDraft {
  return { ...draft, selected };
}

/**
 * Edits a preset option's wording in place. Editing selects that option. Text
 * identical to the original counts as unedited.
 */
export function editOption(
  draft: AnswerDraft,
  optionId: string,
  text: string,
  original: string,
): AnswerDraft {
  const optionTexts = { ...draft.optionTexts };
  if (text === original) delete optionTexts[optionId];
  else optionTexts[optionId] = text;
  return { ...draft, selected: optionId, optionTexts };
}

export function editOwn(draft: AnswerDraft, text: string): AnswerDraft {
  return { ...draft, selected: OWN_ANSWER, ownText: text };
}

/** The text currently shown in an option's editable field. */
export function optionText(draft: AnswerDraft, optionId: string, original: string): string {
  return draft.optionTexts[optionId] ?? original;
}

/**
 * The submitted form of an answer: final text, the preset option it started from
 * (null for write-your-own), and whether it was edited.
 */
export function finalAnswer(issue: SurveyIssue, draft: AnswerDraft): MatchAnswer | null {
  if (draft.selected === OWN_ANSWER) {
    return { issueId: issue.id, text: draft.ownText, startingOptionId: null, edited: false };
  }
  const option = issue.options.find((o) => o.id === draft.selected);
  if (!option) return null;
  const edited = Object.hasOwn(draft.optionTexts, option.id);
  return {
    issueId: issue.id,
    text: edited ? draft.optionTexts[option.id] : option.text,
    startingOptionId: option.id,
    edited,
  };
}

/** An answer is complete when something is chosen and its text isn't blank. */
export function isAnswered(issue: SurveyIssue, draft: AnswerDraft): boolean {
  const a = finalAnswer(issue, draft);
  return !!a && a.text.trim().length > 0;
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
  if (step.kind === "answer") {
    const index = Math.max(0, Math.min(step.index, state.ranked.length - 1));
    return { kind: "answer", index };
  }
  return step;
}

export function goTo(state: SurveyState, step: SurveyStep): SurveyState {
  return { ...state, step };
}

// ------------------------------------------------------------------ "anything else"

export function setAnythingElseText(state: SurveyState, text: string): SurveyState {
  return { ...state, anythingElse: { ...state.anythingElse, text } };
}

export function setAnythingElseImportance(
  state: SurveyState,
  importance: AnythingElseImportance,
): SurveyState {
  return { ...state, anythingElse: { ...state.anythingElse, importance } };
}

/** "Anything else" is optional, but text needs an importance choice. */
export function anythingElseComplete(state: SurveyState): boolean {
  return state.anythingElse.text.trim() === "" || state.anythingElse.importance !== null;
}

// ------------------------------------------------------------------ request

/**
 * Builds the matching-contract request (minus the abuse token, which the client
 * adds per attempt). Returns null if the survey isn't complete.
 */
export function buildMatchRequest(
  state: SurveyState,
  issues: readonly SurveyIssue[],
  locale: "he" | "en",
): Omit<MatchRequest, "token"> | null {
  const ids = issues.map((i) => i.id);
  if (!rankingComplete(state, ids) || !anythingElseComplete(state)) return null;
  const byId = new Map(issues.map((i) => [i.id, i]));
  const answers: MatchAnswer[] = [];
  for (const id of state.ranked) {
    const issue = byId.get(id);
    if (!issue) return null;
    const a = finalAnswer(issue, draftFor(state, id));
    if (!a || !a.text.trim()) return null;
    answers.push(a);
  }
  const text = state.anythingElse.text.trim();
  return {
    locale,
    surveyContentVersion: state.surveyContentVersion,
    ranked: [...state.ranked],
    notImportant: [...state.notImportant],
    answers,
    anythingElse:
      text && state.anythingElse.importance
        ? { text, importance: state.anythingElse.importance }
        : null,
  };
}
