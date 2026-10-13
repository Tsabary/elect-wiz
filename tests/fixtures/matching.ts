import placeholderProfiles from "@/content/placeholder/matching/profiles.json";
import {
  issueSchema,
  listsFileSchema,
  partiesFileSchema,
  type Issue,
  type List,
  type Party,
} from "@/lib/content/schemas";
import { ISSUE_IDS, issueJson } from "./content";

/** A corpus view covering every metadata case: joint list, below threshold, not polled, limited info. */
export function corpusView(): { issues: Issue[]; parties: Party[]; lists: List[] } {
  const src = { title: "Avg", url: "https://example.org/p" };
  const reg = [{ title: "Reg", url: "https://example.org/r" }];
  const lists = listsFileSchema.parse({
    lists: [
      {
        id: "big",
        name: { he: "גדולה", en: "Big" },
        ballotLetters: "זץ",
        memberPartyIds: ["big"],
        poll: { status: "polled", percent: 20, source: src, asOf: "2026-10-01" },
        sources: reg,
      },
      {
        id: "joint",
        name: { he: "משותפת", en: "Joint List" },
        ballotLetters: "קט",
        memberPartyIds: ["left-half", "right-half"],
        poll: { status: "polled", percent: 8, source: src, asOf: "2026-10-01" },
        sources: reg,
      },
      {
        id: "small",
        name: { he: "קטנה", en: "Small" },
        ballotLetters: "טז",
        memberPartyIds: ["small"],
        poll: { status: "polled", percent: 2.1, source: src, asOf: "2026-10-01" },
        sources: reg,
      },
      {
        id: "unpolled",
        name: { he: "לא נסקרה", en: "Unpolled" },
        ballotLetters: "שץ",
        memberPartyIds: ["unpolled"],
        poll: { status: "not_polled", source: src, asOf: "2026-10-01" },
        sources: reg,
      },
    ],
  }).lists;
  const party = (id: string, listId: string, limitedInfo = false) => ({
    id,
    name: { he: `${id}-he`, en: `${id}-en` },
    listId,
    leader: { he: "ל", en: "L" },
    tier: "researched",
    limitedInfo,
    researchedAsOf: "2026-10-06",
  });
  const parties = partiesFileSchema.parse({
    parties: [
      party("big", "big"),
      party("left-half", "joint"),
      party("right-half", "joint"),
      party("small", "small"),
      party("unpolled", "unpolled", true),
    ],
  }).parties;
  return { issues: ISSUE_IDS.map((id) => issueSchema.parse(issueJson(id))), parties, lists };
}

// ------------------------------------------------------------------ placeholder answer sets

/**
 * Answer sets that produce each result case on the placeholder corpus
 * (`content/placeholder/matching/`), for the end-to-end tests. The rankings and
 * answers are the placeholder corpus's own voter profiles, written by
 * `scripts/generate-placeholder-matching.ts`; what each must produce is recorded
 * here and checked against the real scoring in `matching.test.ts`.
 */
export const PLACEHOLDER_CASES = [
  "joint-list-top",
  "below-threshold-top",
  "limited-information-top",
  "weak-match",
  "unclear-position",
] as const;
export type PlaceholderCase = (typeof PLACEHOLDER_CASES)[number];

export interface PlaceholderAnswerSet {
  /** Issue IDs ranked 1 … n. */
  ranked: string[];
  /** Issue ID → the chosen option ID. */
  answers: Record<string, string>;
  /** The result's party IDs in order, top match first: every researched placeholder party. */
  entries: string[];
  weakMatch: boolean;
  /** Breakdown items that must be labelled "party position unclear", as `[partyId, issueId]`. */
  unclear: [string, string][];
}

const EXPECTED: Record<PlaceholderCase, Omit<PlaceholderAnswerSet, "ranked" | "answers">> = {
  /** A party on the joint list "olive-and-valley" is the top match; its partner is a runner-up. */
  "joint-list-top": {
    entries: [
      "green-valley",
      "olive-branch",
      "cedar-tradition",
      "lighthouse",
      "pebble-citizens",
      "blue-horizon",
    ],
    weakMatch: false,
    unclear: [],
  },
  /** The top match's list ("lighthouse") polls below the electoral threshold. */
  "below-threshold-top": {
    entries: [
      "lighthouse",
      "cedar-tradition",
      "green-valley",
      "olive-branch",
      "pebble-citizens",
      "blue-horizon",
    ],
    weakMatch: false,
    unclear: [["cedar-tradition", "october-7-inquiry"]],
  },
  /** The limited-information party is the top match, with two unclear issues of its own. */
  "limited-information-top": {
    entries: [
      "pebble-citizens",
      "olive-branch",
      "green-valley",
      "blue-horizon",
      "lighthouse",
      "cedar-tradition",
    ],
    weakMatch: false,
    unclear: [
      ["pebble-citizens", "gaza"],
      ["pebble-citizens", "haredi-enlistment"],
    ],
  },
  /** No party is close: the top score is below `weakMatchBelow`. */
  "weak-match": {
    entries: [
      "green-valley",
      "blue-horizon",
      "olive-branch",
      "cedar-tradition",
      "pebble-citizens",
      "lighthouse",
    ],
    weakMatch: true,
    unclear: [],
  },
  /** The top match has no documented position on one ranked issue. */
  "unclear-position": {
    entries: [
      "cedar-tradition",
      "lighthouse",
      "green-valley",
      "olive-branch",
      "pebble-citizens",
      "blue-horizon",
    ],
    weakMatch: false,
    unclear: [["cedar-tradition", "october-7-inquiry"]],
  },
};

export function placeholderAnswerSet(id: PlaceholderCase): PlaceholderAnswerSet {
  const profile = placeholderProfiles.profiles.find((p) => p.id === id);
  if (!profile) throw new Error(`no placeholder profile "${id}"`);
  return {
    ranked: profile.ranked,
    answers: Object.fromEntries(
      Object.entries(profile.answers).filter((e): e is [string, string] => e[1] !== undefined),
    ),
    ...EXPECTED[id],
  };
}
