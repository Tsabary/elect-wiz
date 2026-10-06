import { describe, expect, it } from "vitest";
import { researchMd } from "@/tests/fixtures/content";
import { extractCitations, parseResearchDoc } from "./research-parser";

describe("parseResearchDoc", () => {
  it("parses frontmatter, sections, sub-sections, anchors and sources", () => {
    const doc = parseResearchDoc(researchMd("solo", "en", ["issue-a", "issue-b"]));
    expect(doc.frontmatter).toEqual({ partyId: "solo", lang: "en", researchedAsOf: "2026-10-06" });
    expect(doc.sections.map((s) => s.id)).toEqual([
      "overview",
      "leadership",
      "issues",
      "other-positions",
      "coalition",
      "track-record",
      "legal",
      "sources",
      "information-availability",
    ]);
    expect(doc.sections[2].subsections.map((s) => s.id)).toEqual([
      "issue-issue-a",
      "issue-issue-b",
    ]);
    expect(doc.anchors).toContain("other-environment");
    expect(doc.sources).toEqual([
      { n: 1, text: "Source one. https://example.org/1" },
      { n: 2, text: "Source two. https://example.org/2" },
    ]);
    expect(doc.problems).toEqual([]);
  });

  it("extracts single, listed and ranged citations but not links", () => {
    expect(extractCitations("a [1] b [2, 4] c [5–7] d [text](https://x) e [8](https://y)")).toEqual(
      [1, 2, 4, 5, 6, 7],
    );
  });
});
