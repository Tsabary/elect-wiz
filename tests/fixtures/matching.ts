import { issueSchema, listsFileSchema, partiesFileSchema } from "@/lib/content/schemas";
import type { MatchRequest } from "@/lib/matching/contract";
import type { CorpusView } from "@/lib/matching/types";
import { ISSUE_IDS, issueJson } from "./content";

/** A corpus view covering every metadata case: joint list, below threshold, not polled, limited info. */
export function corpusView(): CorpusView {
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

export const SURVEY_VERSION = "v1";

export function validRequest(overrides: Partial<MatchRequest> = {}): MatchRequest {
  const ranked = ISSUE_IDS.slice(0, 7);
  return {
    locale: "en",
    surveyContentVersion: SURVEY_VERSION,
    ranked,
    notImportant: ISSUE_IDS.slice(7),
    answers: ranked.map((issueId, i) => ({
      issueId,
      text: i === 0 ? "My own words about this issue" : "Option 1",
      startingOptionId: i === 0 ? null : "opt-1",
      edited: false,
    })),
    anythingElse: { text: "Animal welfare", importance: "middle" },
    token: null,
    ...overrides,
  };
}
