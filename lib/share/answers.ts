/**
 * Answers in a share link: the optional "share with my answers" form of a share
 * URL. The ranking and the chosen option per ranked issue travel in the URL's
 * fragment (`/{locale}/share/{partyIds}#a=…`), which browsers never send to the
 * site: the server, its logs and its page cache only ever see the plain share
 * address. The share page reads the fragment in the browser and works the result
 * out again from it (`sharedTopParties`), so a link can't show a result its
 * answers don't produce.
 *
 * Format, version 1: `1-{tag}-{pairs}`, e.g. `1-k3x9-3b7a0c1d5e`.
 *
 * - `tag`: 4 base-36 characters fingerprinting the survey content version and
 *   every issue and option ID (`contentTag`). A link made for other survey
 *   content is refused rather than misread.
 * - `pairs`: one pair per ranked issue, most important first. The first
 *   character is the issue's index among the issue IDs sorted (base 36), the
 *   second the chosen option's index among that issue's option IDs sorted
 *   (`a`, `b`, …). Sorted IDs, not display order, which is shuffled per user.
 *
 * Decoding is strict: anything malformed or inconsistent is refused whole.
 * Must stay free of Node-only APIs: it runs in the browser.
 */
import { MAX_RANKED, MIN_RANKED, TOP_ENTRIES } from "@/lib/matching/contract";
import type { MatchingBundle } from "@/lib/matching/data";
import { scoreMatch, type MatchInput } from "@/lib/matching/score";
import { hashString } from "@/lib/survey/shuffle";

/** The fragment key: `#a=…`. */
export const ANSWERS_HASH_KEY = "a";
export const ANSWERS_FORMAT_VERSION = "1";

const ISSUE_DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";
const OPTION_DIGITS = "abcdefghijklmnopqrstuvwxyz";
const TAG_LENGTH = 4;
/** Longer than any valid value; anything longer isn't even looked at. */
const MAX_LENGTH = 2 + TAG_LENGTH + 1 + 2 * ISSUE_DIGITS.length;

/** The issue and option IDs the format refers to (any order: they are sorted here). */
export interface AnswersContent {
  surveyContentVersion: string;
  issues: readonly { id: string; options: readonly { id: string }[] }[];
}

const byString = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

function sortedContent(content: AnswersContent) {
  return [...content.issues]
    .sort((a, b) => byString(a.id, b.id))
    .map((i) => ({ id: i.id, options: i.options.map((o) => o.id).sort(byString) }));
}

/** The content fingerprint written into every link. */
export function contentTag(content: AnswersContent): string {
  const ids = sortedContent(content)
    .map((i) => `${i.id}:${i.options.join(",")}`)
    .join(";");
  const h = hashString(`${content.surveyContentVersion}|${ids}`);
  return (h % 36 ** TAG_LENGTH).toString(36).padStart(TAG_LENGTH, "0");
}

/**
 * The fragment value for a ranking and its answers, or null when they can't be
 * written (an ID the content doesn't have, a missing answer, a repeated issue,
 * too few or too many issues, or more issues or options than the digits cover).
 */
export function encodeAnswers(input: MatchInput, content: AnswersContent): string | null {
  const issues = sortedContent(content);
  if (issues.length > ISSUE_DIGITS.length) return null;
  if (input.ranked.length < MIN_RANKED || input.ranked.length > MAX_RANKED) return null;
  if (new Set(input.ranked).size !== input.ranked.length) return null;
  let pairs = "";
  for (const issueId of input.ranked) {
    const i = issues.findIndex((x) => x.id === issueId);
    if (i < 0 || !Object.hasOwn(input.answers, issueId)) return null;
    const o = issues[i].options.indexOf(input.answers[issueId]);
    if (o < 0 || o >= OPTION_DIGITS.length) return null;
    pairs += ISSUE_DIGITS[i] + OPTION_DIGITS[o];
  }
  return `${ANSWERS_FORMAT_VERSION}-${contentTag(content)}-${pairs}`;
}

export type AnswersRejection =
  /** Not this format at all (or an unknown format version). */
  | "malformed"
  /** Made for other survey content. */
  | "version"
  | "unknown-issue"
  | "unknown-option"
  | "duplicate-issue"
  | "too-few"
  | "too-many";

export type DecodedAnswers =
  { ok: true; input: MatchInput } | { ok: false; reason: AnswersRejection };

const FORMAT = /^1-([0-9a-z]{4})-((?:[0-9a-z][a-z])+)$/;

/** Reads a fragment value written by `encodeAnswers`. Never throws. */
export function decodeAnswers(value: string, content: AnswersContent): DecodedAnswers {
  const match = value.length <= MAX_LENGTH ? FORMAT.exec(value) : null;
  if (!match) return { ok: false, reason: "malformed" };
  const [, tag, pairs] = match;
  if (tag !== contentTag(content)) return { ok: false, reason: "version" };
  const issues = sortedContent(content);
  const ranked: string[] = [];
  const answers: Record<string, string> = {};
  for (let k = 0; k < pairs.length; k += 2) {
    const issue = issues[ISSUE_DIGITS.indexOf(pairs[k])];
    if (!issue) return { ok: false, reason: "unknown-issue" };
    const option = issue.options[OPTION_DIGITS.indexOf(pairs[k + 1])];
    if (!option) return { ok: false, reason: "unknown-option" };
    if (Object.hasOwn(answers, issue.id)) return { ok: false, reason: "duplicate-issue" };
    ranked.push(issue.id);
    answers[issue.id] = option;
  }
  if (ranked.length < MIN_RANKED) return { ok: false, reason: "too-few" };
  if (ranked.length > MAX_RANKED) return { ok: false, reason: "too-many" };
  return { ok: true, input: { ranked, answers } };
}

/** The `#a=…` fragment for a share link. */
export function answersHash(value: string): string {
  return `#${ANSWERS_HASH_KEY}=${value}`;
}

/**
 * The answers value in a URL fragment (`location.hash`, with or without the
 * `#`), or null when there is none. Other fragment parameters are ignored.
 */
export function answersFromHash(hash: string): string | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return params.get(ANSWERS_HASH_KEY);
}

/**
 * The top parties for shared answers, worked out exactly as the survey does
 * (`matchLocally`: every party the bundle has texts for and the page can name,
 * scored by `scoreMatch`). Null when the answers don't fit the bundle.
 */
export function sharedTopParties(
  bundle: MatchingBundle,
  input: MatchInput,
  partyIds: Iterable<string>,
): string[] | null {
  const known = new Set(partyIds);
  try {
    const { entries } = scoreMatch(
      bundle,
      input,
      bundle.texts.map((t) => t.partyId).filter((id) => known.has(id)),
    );
    return entries.length > 0 ? entries.slice(0, TOP_ENTRIES).map((e) => e.partyId) : null;
  } catch {
    return null;
  }
}
