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
): string {
  const issues = issueIds
    .map((id) => `### Issue ${id} {#issue-${id}}\n\nThe party supports option 1 [1].\n`)
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
    ],
  };
  const party = (id: string, listId: string) => ({
    id,
    name: { he: id, en: id },
    listId,
    leader: { he: "ל", en: "L" },
    limitedInfo: false,
    researchedAsOf: "2026-10-06",
  });
  const parties = {
    parties: [party("solo", "solo"), party("left-half", "joint"), party("right-half", "joint")],
  };
  const ids = ["solo", "left-half", "right-half"];
  return {
    issues: ISSUE_IDS.map((id) => json(`issues/${id}.json`, issueJson(id))),
    glossary: json("glossary.json", { terms: [{ id: "idf", en: "IDF", he: 'צה"ל' }] }),
    versions: json("versions.json", { surveyContentVersion: "v1", researchVersion: "r1" }),
    corpora: [
      {
        name: "placeholder",
        active: true,
        lists: json("placeholder/registry/lists.json", lists),
        parties: json("placeholder/registry/parties.json", parties),
        research: {
          en: ids.map((id) => ({
            file: `placeholder/research/en/${id}.md`,
            raw: researchMd(id, "en"),
          })),
          he: ids.map((id) => ({
            file: `placeholder/research/he/${id}.md`,
            raw: researchMd(id, "he"),
          })),
        },
      },
    ],
  };
}

/** Rewrites one JSON file of the fixture in place. */
export function editJson(f: RawFile | null, edit: (data: any) => void): void {
  if (!f) throw new Error("missing file");
  const data = JSON.parse(f.raw);
  edit(data);
  f.raw = JSON.stringify(data);
}
