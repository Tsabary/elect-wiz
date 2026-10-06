import { describe, expect, it } from "vitest";
import {
  editJson,
  issueJson,
  json,
  researchMd,
  validContent,
  ISSUE_IDS,
} from "@/tests/fixtures/content";
import { validateContent, type RuleId } from "./validate";

function rulesOf(content = validContent()): RuleId[] {
  return validateContent(content).map((e) => e.rule);
}

function corpus(c: ReturnType<typeof validContent>) {
  return c.corpora[0];
}

function editDoc(
  c: ReturnType<typeof validContent>,
  lang: "en" | "he",
  i: number,
  fn: (raw: string) => string,
) {
  const f = corpus(c).research[lang][i];
  f.raw = fn(f.raw);
}

describe("validateContent", () => {
  it("accepts a valid corpus", () => {
    expect(validateContent(validContent())).toEqual([]);
  });

  describe("issues", () => {
    it("rejects invalid JSON", () => {
      const c = validContent();
      c.issues[0].raw = "{ not json";
      expect(rulesOf(c)).toContain("json-parse");
    });

    it("rejects a missing field in one language", () => {
      const c = validContent();
      editJson(c.issues[0], (d) => delete d.he.moreInfo);
      expect(rulesOf(c)).toContain("issue-schema");
    });

    it("rejects an empty field", () => {
      const c = validContent();
      editJson(c.issues[0], (d) => (d.en.question = "  "));
      expect(rulesOf(c)).toContain("issue-schema");
    });

    it("rejects fewer than 3 or more than 4 options", () => {
      const two = validContent();
      two.issues[0] = json("issues/issue-a.json", issueJson("issue-a", 2));
      expect(rulesOf(two)).toContain("issue-schema");
      const five = validContent();
      five.issues[0] = json("issues/issue-a.json", issueJson("issue-a", 5));
      expect(rulesOf(five)).toContain("issue-schema");
    });

    it("accepts 4 options", () => {
      const c = validContent();
      c.issues[0] = json("issues/issue-a.json", issueJson("issue-a", 4));
      expect(rulesOf(c)).toEqual([]);
    });

    it("rejects a count other than 10", () => {
      const c = validContent();
      c.issues.pop();
      expect(rulesOf(c)).toContain("issue-count");
    });

    it("rejects an id that doesn't match the file name", () => {
      const c = validContent();
      c.issues[0].file = "issues/other-name.json";
      expect(rulesOf(c)).toContain("issue-id-filename");
    });

    it("rejects duplicate issue ids", () => {
      const c = validContent();
      c.issues[1] = { file: "issues/issue-a.json", raw: c.issues[0].raw };
      expect(rulesOf(c)).toContain("issue-duplicate");
    });

    it("rejects duplicate option ids", () => {
      const c = validContent();
      editJson(c.issues[0], (d) => (d.options[1].id = d.options[0].id));
      expect(rulesOf(c)).toContain("option-duplicate");
    });

    it("rejects non-kebab ids", () => {
      const c = validContent();
      editJson(c.issues[0], (d) => (d.options[0].id = "A"));
      expect(rulesOf(c)).toContain("issue-schema");
    });
  });

  describe("glossary and versions", () => {
    it("rejects a malformed glossary", () => {
      const c = validContent();
      editJson(c.glossary, (d) => delete d.terms[0].he);
      expect(rulesOf(c)).toContain("glossary-schema");
    });

    it("rejects duplicate glossary ids", () => {
      const c = validContent();
      editJson(c.glossary, (d) => d.terms.push({ ...d.terms[0] }));
      expect(rulesOf(c)).toContain("glossary-duplicate");
    });

    it("rejects a missing survey-content version", () => {
      const c = validContent();
      editJson(c.versions, (d) => (d.surveyContentVersion = ""));
      expect(rulesOf(c)).toContain("versions-schema");
    });
  });

  describe("registry", () => {
    it("requires a registry for the active corpus", () => {
      const c = validContent();
      corpus(c).lists = null;
      expect(rulesOf(c)).toContain("registry-missing");
    });

    it("tolerates a missing registry for an inactive corpus", () => {
      const c = validContent();
      c.corpora.push({
        name: "real",
        active: false,
        lists: null,
        parties: null,
        research: { en: [], he: [] },
      });
      expect(rulesOf(c)).toEqual([]);
    });

    it("rejects schema errors (list without a source)", () => {
      const c = validContent();
      editJson(corpus(c).lists, (d) => (d.lists[0].sources = []));
      expect(rulesOf(c)).toContain("registry-schema");
    });

    it("rejects a poll percent out of range", () => {
      const c = validContent();
      editJson(corpus(c).lists, (d) => (d.lists[0].poll.percent = 140));
      expect(rulesOf(c)).toContain("registry-schema");
    });

    it("rejects duplicate party ids", () => {
      const c = validContent();
      editJson(corpus(c).parties, (d) => d.parties.push({ ...d.parties[0] }));
      expect(rulesOf(c)).toContain("registry-duplicate");
    });

    it("rejects a party pointing at an unknown list", () => {
      const c = validContent();
      editJson(corpus(c).parties, (d) => (d.parties[0].listId = "nowhere"));
      expect(rulesOf(c)).toContain("registry-unknown-list");
    });

    it("rejects asymmetric joint-list membership (list omits a party)", () => {
      const c = validContent();
      editJson(corpus(c).lists, (d) => (d.lists[1].memberPartyIds = ["left-half"]));
      expect(rulesOf(c)).toContain("registry-membership");
    });

    it("rejects asymmetric joint-list membership (list claims another list's party)", () => {
      const c = validContent();
      editJson(corpus(c).lists, (d) => d.lists[1].memberPartyIds.push("solo"));
      expect(rulesOf(c)).toContain("registry-membership");
    });

    it("rejects a pending poll snapshot in the active corpus", () => {
      const c = validContent();
      editJson(corpus(c).lists, (d) => (d.lists[0].poll = { status: "pending" }));
      expect(rulesOf(c)).toContain("poll-snapshot-missing");
    });

    it("allows a pending poll snapshot in an inactive corpus", () => {
      const c = validContent();
      corpus(c).active = false;
      editJson(corpus(c).lists, (d) => (d.lists[0].poll = { status: "pending" }));
      expect(rulesOf(c)).toEqual([]);
    });
  });

  describe("research documents", () => {
    it("requires both languages for every party in the active corpus", () => {
      const c = validContent();
      corpus(c).research.he.pop();
      expect(rulesOf(c)).toContain("research-missing");
    });

    it("allows missing documents in an inactive corpus but still checks existing ones", () => {
      const c = validContent();
      corpus(c).active = false;
      corpus(c).research.he.pop();
      expect(rulesOf(c)).toEqual([]);
      editDoc(c, "en", 0, (r) => r.replace("## Coalition {#coalition}", "## Coalition"));
      expect(rulesOf(c)).toContain("research-structure");
    });

    it("rejects a document for a party not in the registry", () => {
      const c = validContent();
      corpus(c).research.en.push({
        file: "placeholder/research/en/ghost.md",
        raw: researchMd("ghost", "en"),
      });
      expect(rulesOf(c)).toContain("research-orphan");
    });

    it("rejects mismatched frontmatter", () => {
      const c = validContent();
      editDoc(c, "en", 0, (r) => r.replace("lang: en", "lang: he"));
      expect(rulesOf(c)).toContain("research-frontmatter");
    });

    it("requires the researched-as-of date", () => {
      const c = validContent();
      editDoc(c, "en", 0, (r) => r.replace("researchedAsOf: 2026-10-06", "researchedAsOf: soon"));
      expect(rulesOf(c)).toContain("research-date");
    });

    it("rejects a heading without an anchor", () => {
      const c = validContent();
      editDoc(c, "en", 0, (r) => r.replace("## Track record {#track-record}", "## Track record"));
      expect(rulesOf(c)).toContain("research-structure");
    });

    it("rejects a missing section", () => {
      const c = validContent();
      editDoc(c, "en", 0, (r) => r.replace(/## Legal \{#legal\}\n\nNone \[1\]\.\n/, ""));
      expect(rulesOf(c)).toContain("research-sections");
    });

    it("rejects sections out of order", () => {
      const c = validContent();
      editDoc(c, "en", 0, (r) =>
        r
          .replace("## Coalition {#coalition}", "## X {#tmp}")
          .replace("## Track record {#track-record}", "## Coalition {#coalition}")
          .replace("## X {#tmp}", "## Track record {#track-record}"),
      );
      expect(rulesOf(c)).toContain("research-sections");
    });

    it("rejects an empty section", () => {
      const c = validContent();
      editDoc(c, "en", 0, (r) => r.replace("Will sit with anyone [1].", ""));
      expect(rulesOf(c)).toContain("research-sections");
    });

    it("requires exactly one sub-section per issue", () => {
      const missing = validContent();
      corpus(missing).research.en[0].raw = researchMd("solo", "en", ISSUE_IDS.slice(1));
      corpus(missing).research.he[0].raw = researchMd("solo", "he", ISSUE_IDS.slice(1));
      expect(rulesOf(missing)).toContain("research-issue-subsections");

      const extra = validContent();
      editDoc(extra, "en", 0, (r) =>
        r.replace(
          "## Other positions",
          "### Bonus {#issue-bonus}\n\nText [1].\n\n## Other positions",
        ),
      );
      expect(rulesOf(extra)).toContain("research-issue-subsections");
    });

    it("requires other-positions sub-sections with the other- prefix", () => {
      const c = validContent();
      editDoc(c, "en", 0, (r) => r.replace("{#other-environment}", "{#environment}"));
      expect(rulesOf(c)).toContain("research-other-subsections");
    });

    it("rejects duplicate anchors", () => {
      const c = validContent();
      editDoc(c, "en", 0, (r) =>
        r.replace(
          "### Environment {#other-environment}\n\nSupports parks [2].\n",
          "### Environment {#other-environment}\n\nSupports parks [2].\n\n### Again {#other-environment}\n\nMore [2].\n",
        ),
      );
      expect(rulesOf(c)).toContain("research-duplicate-anchor");
    });

    it("requires identical anchors across languages", () => {
      const c = validContent();
      editDoc(c, "he", 0, (r) => r.replace("{#other-environment}", "{#other-nature}"));
      expect(rulesOf(c)).toContain("research-anchor-parity");
    });

    it("requires a numbered sources list", () => {
      const c = validContent();
      editDoc(c, "en", 0, (r) =>
        r.replace(
          "1. Source one. https://example.org/1\n2. Source two. https://example.org/2",
          "See the web.",
        ),
      );
      expect(rulesOf(c)).toContain("research-sources");
    });

    it("rejects citations to missing sources", () => {
      const c = validContent();
      editDoc(c, "en", 0, (r) => r.replace("Supports parks [2].", "Supports parks [7]."));
      expect(rulesOf(c)).toContain("research-citations");
    });

    it("rejects poll figures in research text", () => {
      for (const sentence of [
        "Recent polls give the party 6 seats.",
        "The list is polling at 2.8% in the latest survey.",
        "A Channel 12 poll from 2026-09-30 showed it winning 11 seats.",
        "בסקר האחרון המפלגה קיבלה 5 מנדטים.",
      ]) {
        const c = validContent();
        editDoc(c, "en", 0, (r) =>
          r.replace("Led by a fictional person [2].", `Led by a fictional person [2]. ${sentence}`),
        );
        expect(rulesOf(c), sentence).toContain("poll-figure");
      }
    });

    it("allows current seats, past results and non-figure poll wording", () => {
      for (const sentence of [
        "It currently holds 14 seats in the Knesset.",
        "In the 2022 election it won 4.1% of the vote.",
        "The party opened 300 polling stations volunteers groups.",
        "In a 2025 poll, voters cited housing as a priority.",
      ]) {
        const c = validContent();
        editDoc(c, "en", 0, (r) =>
          r.replace("Led by a fictional person [2].", `Led by a fictional person [2]. ${sentence}`),
        );
        expect(rulesOf(c), sentence).toEqual([]);
      }
    });
  });
});
