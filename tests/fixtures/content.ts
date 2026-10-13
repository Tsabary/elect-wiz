/**
 * In-memory corpus fixtures for validation tests. `validContent()` returns a
 * corpus that passes every rule; tests break exactly one thing at a time.
 */
import type { RawContent, RawFile } from "@/lib/content/validate";

export const ISSUE_IDS = Array.from(
  { length: 10 },
  (_, i) => `issue-${String.fromCharCode(97 + i)}`,
);

export function issueJson(id: string, optionCount = 3): Record<string, unknown> {
  const text = (lang: string) => ({
    title: `${lang} title ${id}`,
    description: `${lang} description`,
    moreInfo: `${lang} more info`,
    question: `${lang} question?`,
  });
  return {
    id,
    en: text("en"),
    he: text("he"),
    options: Array.from({ length: optionCount }, (_, i) => ({
      id: `opt-${i + 1}`,
      en: `Option ${i + 1}`,
      he: `אפשרות ${i + 1}`,
    })),
  };
}

export const json = (file: string, data: unknown): RawFile => ({
  file,
  raw: JSON.stringify(data, null, 2),
});

export function researchMd(
  partyId: string,
  lang: "en" | "he",
  issueIds = ISSUE_IDS,
  extra = "",
  /** Issues where the document records no position. */
  unclearIssueIds: string[] = [],
): string {
  const issues = issueIds
    .map((id) =>
      unclearIssueIds.includes(id)
        ? `### Issue ${id} {#issue-${id}}\n\n**No documented position found.** Searches found nothing [1].\n`
        : `### Issue ${id} {#issue-${id}}\n\nThe party supports option 1 [1].\n\n**Closest option(s):** Option 1 (\`opt-1\`).\n`,
    )
    .join("\n");
  return `---
partyId: ${partyId}
lang: ${lang}
researchedAsOf: 2026-10-06
---

## Overview {#overview}

Founded in 2019. Currently holds 4 seats in the Knesset and won 3.9% in the 2022 election [1].
${extra}
## Leadership {#leadership}

Led by a fictional person [2].

## Positions {#issues}

${issues}
## Other positions {#other-positions}

### Environment {#other-environment}

Supports parks [2].

### Transport {#other-transport}

Supports cycling paths [2].

## Coalition {#coalition}

Will sit with anyone [1].

## Track record {#track-record}

None [1].

## Legal {#legal}

None [1].

## Sources {#sources}

1. Source one. https://example.org/1
2. Source two. https://example.org/2

## Information availability {#information-availability}

Sufficient [1].
`;
}

export function validContent(): RawContent {
  const lists = {
    lists: [
      {
        id: "solo",
        name: { he: "סולו", en: "Solo" },
        ballotLetters: "זץ",
        memberPartyIds: ["solo"],
        topCandidates: [{ he: "א", en: "A" }],
        status: "approved",
        poll: {
          status: "polled",
          percent: 2.5,
          source: { title: "Avg", url: "https://example.org/p" },
          asOf: "2026-10-01",
        },
        sources: [{ title: "Reg", url: "https://example.org/r" }],
      },
      {
        id: "joint",
        name: { he: "משותפת", en: "Joint" },
        ballotLetters: "קט",
        memberPartyIds: ["left-half", "right-half"],
        status: "approved",
        poll: {
          status: "not_polled",
          source: { title: "Avg", url: "https://example.org/p" },
          asOf: "2026-10-01",
        },
        sources: [{ title: "Reg", url: "https://example.org/r" }],
      },
      {
        id: "listed-only",
        name: { he: "רשומה", en: "Listed only" },
        ballotLetters: "נך",
        memberPartyIds: ["listed-only"],
        status: "approved",
        poll: {
          status: "not_polled",
          source: { title: "Avg", url: "https://example.org/p" },
          asOf: "2026-10-01",
        },
        sources: [{ title: "Reg", url: "https://example.org/r" }],
      },
    ],
  };
  const party = (id: string, listId: string) => ({
    id,
    name: { he: id, en: id },
    listId,
    leader: { he: "ל", en: "L" },
    tier: "researched",
    limitedInfo: false,
    researchedAsOf: "2026-10-06",
  });
  const parties = {
    parties: [
      party("solo", "solo"),
      party("left-half", "joint"),
      party("right-half", "joint"),
      // On the ballot but not researched: no research documents, no matching content.
      {
        ...party("listed-only", "listed-only"),
        tier: "listed",
        researchedAsOf: null,
        platform: { url: "https://example.org/platform", checkedOn: "2026-10-13" },
      },
    ],
  };
  const ids = ["solo", "left-half", "right-half"];
  return {
    issues: ISSUE_IDS.map((id) => json(`issues/${id}.json`, issueJson(id))),
    glossary: json("glossary.json", { terms: [{ id: "idf", en: "IDF", he: 'צה"ל' }] }),
    versions: json("versions.json", {
      surveyContentVersion: "v1",
      researchVersion: "r1",
      matchingVersion: "m1",
    }),
    corpora: [
      {
        name: "placeholder",
        active: true,
        lists: json("placeholder/registry/lists.json", lists),
        parties: json("placeholder/registry/parties.json", parties),
        research: {
          en: ids.map((id) => ({
            file: `placeholder/research/en/${id}.md`,
            raw: researchMd(id, "en", ISSUE_IDS, "", UNCLEAR_ISSUES[id]),
          })),
          he: ids.map((id) => ({
            file: `placeholder/research/he/${id}.md`,
            raw: researchMd(id, "he", ISSUE_IDS, "", UNCLEAR_ISSUES[id]),
          })),
        },
        matching: validMatching(),
      },
    ],
  };
}

const MATCHING_DIR = "placeholder/matching";

/** The constants every corpus starts with (plan-deterministic-matching.md, Decision 3). */
export const matchingConfigJson = () => ({
  levels: { main: 1, either: 0.85, secondary: 0.6 },
  unclear: 0.25,
  agreement: { agrees: 0.75, partially: 0.35 },
  weakMatchBelow: 0.6,
  ruledOutMax: 0.3,
  inPart: 0.7,
});

/** The issues where each fixture party has no documented position. */
const UNCLEAR_ISSUES: Record<string, string[]> = {
  solo: [ISSUE_IDS[1]],
  "left-half": [],
  "right-half": [ISSUE_IDS[0]],
};

type Held = { optionId: string; level: "main" | "either" | "secondary" }[];

/**
 * What each fixture party holds on the first issue; on every other issue a party
 * holds `opt-1` as `main` unless the issue is in `UNCLEAR_ISSUES`.
 */
const FIRST_ISSUE_HELD: Record<string, Held> = {
  solo: [
    { optionId: "opt-1", level: "main" },
    { optionId: "opt-2", level: "secondary" },
  ],
  "left-half": [
    { optionId: "opt-2", level: "either" },
    { optionId: "opt-3", level: "either" },
  ],
};

/**
 * The agreement label the score gives each party on the first issue, per option
 * chosen (grid below, starting constants). Elsewhere `opt-1` as `main` gives
 * agrees / partially / disagrees.
 */
const FIRST_ISSUE_AGREEMENT: Record<string, string[]> = {
  solo: ["agrees", "partially", "disagrees"],
  "left-half": ["partially", "agrees", "agrees"],
};
const OPTION_TEXTS = [
  "The party voted for this in 2024.",
  "The party backs part of this.",
  "The party voted against this.",
];

/**
 * Matching content for `validContent()`: a complete set for the three
 * researched parties. On the first issue the rows cover every level (`solo`:
 * main and secondary, `left-half`: either, `right-half`: unclear); `solo` is
 * also unclear on the second issue.
 */
export function validMatching(): RawContent["corpora"][number]["matching"] {
  const partyIds = Object.keys(UNCLEAR_ISSUES);
  const unclear = (partyId: string, issueId: string) => UNCLEAR_ISSUES[partyId].includes(issueId);
  const texts = (partyId: string, lang: "en" | "he") =>
    json(`${MATCHING_DIR}/texts/${lang}/${partyId}.json`, {
      partyId,
      lang,
      issues: Object.fromEntries(
        ISSUE_IDS.map((issueId, i) => {
          const anchor = `issue-${issueId}`;
          if (unclear(partyId, issueId))
            return [issueId, { anchor, unclear: { text: "No documented position was found." } }];
          const agreement =
            (i === 0 && FIRST_ISSUE_AGREEMENT[partyId]) || FIRST_ISSUE_AGREEMENT.solo;
          const options = agreement.map((a, o) => [
            `opt-${o + 1}`,
            { agreement: a, text: OPTION_TEXTS[o] },
          ]);
          return [issueId, { anchor, options: Object.fromEntries(options) }];
        }),
      ),
      points: [
        { text: "It also supports parks.", anchor: "other-environment" },
        { text: "It also supports cycling paths.", anchor: "other-transport" },
      ],
    });
  return {
    positions: ISSUE_IDS.map((issueId, i) =>
      json(`${MATCHING_DIR}/positions/${issueId}.json`, {
        issueId,
        rows: partyIds.map((partyId) => {
          const isUnclear = unclear(partyId, issueId);
          const held: Held = (i === 0 && FIRST_ISSUE_HELD[partyId]) || [
            { optionId: "opt-1", level: "main" },
          ];
          return {
            partyId,
            unclear: isUnclear,
            held: isUnclear ? [] : held,
            anchor: `issue-${issueId}`,
            basis: isUnclear ? "No documented position found." : "Voted for it.",
          };
        }),
      }),
    ),
    distances: ISSUE_IDS.map((issueId) =>
      json(`${MATCHING_DIR}/distances/${issueId}.json`, {
        issueId,
        pairs: [
          { a: "opt-1", b: "opt-2", closeness: 0.5, reason: "Neighbours." },
          { a: "opt-1", b: "opt-3", closeness: 0, reason: "Opposites." },
          { a: "opt-2", b: "opt-3", closeness: 0.4, reason: "Neighbours." },
        ],
      }),
    ),
    texts: {
      en: partyIds.map((id) => texts(id, "en")),
      he: partyIds.map((id) => texts(id, "he")),
    },
    config: json(`${MATCHING_DIR}/config.json`, matchingConfigJson()),
    profiles: json(`${MATCHING_DIR}/profiles.json`, {
      profiles: [
        {
          id: "first-option-voter",
          description: "Picks the first option everywhere.",
          ranked: ISSUE_IDS.slice(0, 5),
          answers: Object.fromEntries(ISSUE_IDS.slice(0, 5).map((id) => [id, "opt-1"])),
          expect: { topAnyOf: ["solo"], inTop4: ["left-half"], notInTop4: [] },
          reason: "Solo holds option 1 on the first issue.",
        },
      ],
    }),
  };
}

/** Rewrites one JSON file of the fixture in place. */
export function editJson(f: RawFile | null, edit: (data: any) => void): void {
  if (!f) throw new Error("missing file");
  const data = JSON.parse(f.raw);
  edit(data);
  f.raw = JSON.stringify(data);
}
