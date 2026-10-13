import { describe, expect, it } from "vitest";
import {
  editJson,
  issueJson,
  json,
  researchMd,
  validContent,
  ISSUE_IDS,
} from "@/tests/fixtures/content";
import { emptyMatching, validateContent, type RawFile, type RuleId } from "./validate";

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

    it("rejects fewer than 3 or more than 6 options", () => {
      const two = validContent();
      two.issues[0] = json("issues/issue-a.json", issueJson("issue-a", 2));
      expect(rulesOf(two)).toContain("issue-schema");
      const seven = validContent();
      seven.issues[0] = json("issues/issue-a.json", issueJson("issue-a", 7));
      expect(rulesOf(seven)).toContain("issue-schema");
    });

    it.each([3, 4, 5, 6])("accepts %i options", (n) => {
      const c = validContent();
      c.issues[0] = json("issues/issue-a.json", issueJson("issue-a", n));
      // The fixture's matching content covers 3 options; an inactive corpus may be incomplete.
      corpus(c).active = false;
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

    it("requires a matching version", () => {
      const c = validContent();
      editJson(c.versions, (d) => delete d.matchingVersion);
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
        matching: emptyMatching(),
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

  describe("party tiers", () => {
    /** Index of the fixture's listed party in parties.json. */
    const LISTED = 3;

    it("requires a tier from the vocabulary", () => {
      const missing = validContent();
      editJson(corpus(missing).parties, (d) => delete d.parties[0].tier);
      expect(rulesOf(missing)).toContain("registry-schema");
      const unknown = validContent();
      editJson(corpus(unknown).parties, (d) => (d.parties[0].tier = "minor"));
      expect(rulesOf(unknown)).toContain("registry-schema");
    });

    it("accepts a listed party with or without a platform link", () => {
      const c = validContent();
      editJson(corpus(c).parties, (d) => delete d.parties[LISTED].platform);
      expect(rulesOf(c)).toEqual([]);
    });

    it.each([
      ["an http URL", { url: "http://example.org/platform", checkedOn: "2026-10-13" }],
      ["a non-URL", { url: "example.org/platform", checkedOn: "2026-10-13" }],
      ["no check date", { url: "https://example.org/platform" }],
      ["a malformed check date", { url: "https://example.org/platform", checkedOn: "13/10/2026" }],
    ])("rejects a platform link with %s", (_name, platform) => {
      const c = validContent();
      editJson(corpus(c).parties, (d) => (d.parties[LISTED].platform = platform));
      expect(rulesOf(c)).toContain("registry-schema");
    });

    it("rejects a listed party with a researched-as-of date", () => {
      const c = validContent();
      editJson(corpus(c).parties, (d) => (d.parties[LISTED].researchedAsOf = "2026-10-06"));
      expect(rulesOf(c)).toEqual(["registry-tier"]);
    });

    it("rejects a researched party without a researched-as-of date", () => {
      const c = validContent();
      editJson(corpus(c).parties, (d) => (d.parties[0].researchedAsOf = null));
      expect(rulesOf(c)).toEqual(["registry-tier"]);
    });

    it("rejects a platform link on a researched party", () => {
      const c = validContent();
      editJson(
        corpus(c).parties,
        (d) => (d.parties[0].platform = { url: "https://example.org/p", checkedOn: "2026-10-13" }),
      );
      expect(rulesOf(c)).toEqual(["registry-tier"]);
    });

    it("rejects a research document for a listed party, in either corpus state", () => {
      for (const active of [true, false]) {
        const c = validContent();
        corpus(c).active = active;
        corpus(c).research.en.push({
          file: "placeholder/research/en/listed-only.md",
          raw: researchMd("listed-only", "en"),
        });
        expect(rulesOf(c)).toEqual(["research-listed"]);
      }
    });

    it("raises research-missing only for researched parties", () => {
      // The fixture's listed party has no documents, and the valid corpus passes.
      expect(rulesOf(validContent())).toEqual([]);
      const c = validContent();
      corpus(c).research = { en: [], he: [] };
      const errors = validateContent(c);
      expect(errors.map((e) => e.rule)).toEqual(Array(6).fill("research-missing"));
      expect(errors.some((e) => e.message.includes("listed-only"))).toBe(false);
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

  describe("matching content", () => {
    const m = (c: ReturnType<typeof validContent>) => corpus(c).matching;
    /** Breaks one thing in a matching file and returns the rules raised. */
    function broken(
      pick: (c: ReturnType<typeof validContent>) => RawFile | null,
      edit: (data: any) => void,
      active = true,
    ): RuleId[] {
      const c = validContent();
      corpus(c).active = active;
      editJson(pick(c), edit);
      return rulesOf(c);
    }
    type Edit = (data: any) => void;
    const positions = (edit: Edit, active = true) =>
      broken((c) => m(c).positions[0], edit, active);
    const distances = (edit: Edit, active = true) =>
      broken((c) => m(c).distances[0], edit, active);
    const texts = (edit: Edit, active = true) => broken((c) => m(c).texts.en[0], edit, active);
    const config = (edit: (data: any) => void) => broken((c) => m(c).config, edit);
    const profiles = (edit: (data: any) => void) => broken((c) => m(c).profiles, edit);

    it("accepts an inactive corpus with no matching content", () => {
      const c = validContent();
      corpus(c).active = false;
      corpus(c).matching = emptyMatching();
      expect(rulesOf(c)).toEqual([]);
    });

    it("checks matching files of an inactive corpus too", () => {
      const c = validContent();
      corpus(c).active = false;
      editJson(m(c).positions[0], (d) => (d.rows[0].held[0].optionId = "opt-9"));
      expect(rulesOf(c)).toEqual(["positions-option"]);
    });

    it("rejects invalid JSON in any matching file", () => {
      for (const pick of [
        (c: ReturnType<typeof validContent>) => m(c).positions[0],
        (c: ReturnType<typeof validContent>) => m(c).distances[0],
        (c: ReturnType<typeof validContent>) => m(c).texts.he[0],
        (c: ReturnType<typeof validContent>) => m(c).config!,
        (c: ReturnType<typeof validContent>) => m(c).profiles!,
      ]) {
        const c = validContent();
        pick(c).raw = "{ not json";
        expect(rulesOf(c)).toEqual(["json-parse"]);
      }
    });

    describe("positions", () => {
      it("rejects a level outside the vocabulary", () => {
        expect(positions((d) => (d.rows[0].held[0].level = "strong"))).toEqual([
          "positions-schema",
        ]);
      });

      it("requires the anchor and the basis note", () => {
        expect(positions((d) => delete d.rows[0].basis)).toEqual(["positions-schema"]);
        expect(positions((d) => delete d.rows[0].anchor)).toEqual(["positions-schema"]);
      });

      it("rejects an issue id that doesn't match the file name, or is unknown", () => {
        expect(positions((d) => (d.issueId = "issue-b"))).toContain("positions-issue");
        const c = validContent();
        m(c).positions[0].file = "placeholder/matching/positions/nothing.json";
        editJson(m(c).positions[0], (d) => {
          d.issueId = "nothing";
          for (const row of d.rows) row.anchor = "issue-nothing";
        });
        // The first issue is now left without a positions file.
        expect(rulesOf(c)).toEqual(["positions-issue", "positions-missing"]);
      });

      // In these three the renamed row also leaves its own party without one.
      it("rejects an unknown party", () => {
        expect(positions((d) => (d.rows[0].partyId = "ghost"))).toEqual([
          "positions-party",
          "positions-missing",
        ]);
      });

      it("rejects a row for a listed party", () => {
        expect(positions((d) => (d.rows[0].partyId = "listed-only"))).toEqual([
          "positions-party",
          "positions-missing",
        ]);
      });

      it("rejects two rows for one party", () => {
        expect(positions((d) => (d.rows[1].partyId = "solo"))).toEqual([
          "positions-party",
          "positions-missing",
        ]);
      });

      it("rejects an option that isn't one of the issue's", () => {
        expect(positions((d) => (d.rows[0].held[0].optionId = "opt-9"))).toEqual([
          "positions-option",
        ]);
      });

      it("rejects an option held twice in a row", () => {
        expect(positions((d) => (d.rows[0].held[1].optionId = "opt-1"))).toEqual([
          "positions-option",
        ]);
      });

      it("rejects more than one main", () => {
        expect(positions((d) => (d.rows[0].held[1].level = "main"))).toEqual(["positions-levels"]);
      });

      it("rejects either on fewer than two options", () => {
        expect(positions((d) => d.rows[1].held.pop())).toEqual(["positions-levels"]);
        expect(positions((d) => (d.rows[1].held[1].level = "secondary"))).toEqual([
          "positions-levels",
        ]);
      });

      it("rejects a row that mixes main and either", () => {
        expect(
          positions((d) => d.rows[1].held.push({ optionId: "opt-1", level: "main" })),
        ).toEqual(["positions-levels"]);
      });

      it("requires unclear exactly when no option is held", () => {
        expect(positions((d) => (d.rows[0].unclear = true))).toEqual(["positions-levels"]);
        expect(positions((d) => (d.rows[2].unclear = false))).toEqual(["positions-levels"]);
      });

      it("accepts either on two options next to a secondary, and a lone secondary", () => {
        expect(
          positions((d) => d.rows[1].held.push({ optionId: "opt-1", level: "secondary" })),
        ).toEqual([]);
        // The lone secondary is a valid row, but the party's texts no longer fit it.
        expect(new Set(positions((d) => d.rows[0].held.shift()))).toEqual(
          new Set(["texts-agreement"]),
        );
      });

      it("requires the issue's own anchor", () => {
        expect(positions((d) => (d.rows[0].anchor = "issue-issue-b"))).toEqual([
          "positions-anchor",
        ]);
      });
    });

    describe("distances", () => {
      it.each([-0.1, 1.01, "0.5", null])("rejects closeness %s", (value) => {
        expect(distances((d) => (d.pairs[0].closeness = value))).toEqual(["distances-schema"]);
      });

      it.each([0, 1])("accepts closeness %s", (value) => {
        // Inactive, so the texts written for the fixture's own value aren't compared.
        expect(distances((d) => (d.pairs[0].closeness = value), false)).toEqual([]);
      });

      it("requires a reason", () => {
        expect(distances((d) => delete d.pairs[0].reason)).toEqual(["distances-schema"]);
      });

      it("rejects an issue id that doesn't match the file name, or is unknown", () => {
        expect(distances((d) => (d.issueId = "issue-b"))).toContain("distances-issue");
        expect(distances((d) => (d.issueId = "nothing"))).toContain("distances-issue");
      });

      it("rejects an unknown option", () => {
        expect(distances((d) => (d.pairs[0].b = "opt-9"))).toEqual(["distances-option"]);
      });

      it("rejects a pair of an option with itself", () => {
        expect(distances((d) => (d.pairs[0].b = "opt-1"))).toEqual(["distances-option"]);
      });

      it("rejects a pair stored twice, in the same or the opposite order", () => {
        const same = (d: any) => d.pairs.push({ ...d.pairs[0] });
        expect(distances(same)).toEqual(["distances-duplicate"]);
        // The reverse entry with another value is the asymmetric case.
        const reversed = (d: any) =>
          d.pairs.push({ a: "opt-2", b: "opt-1", closeness: 0.9, reason: "Conflicts." });
        expect(distances(reversed)).toEqual(["distances-duplicate"]);
      });

      it("doesn't require every pair on an inactive corpus", () => {
        expect(distances((d) => d.pairs.pop(), false)).toEqual([]);
      });
    });

    describe("result texts", () => {
      const first = ISSUE_IDS[0];
      const second = ISSUE_IDS[1];

      it("rejects an agreement level outside the vocabulary", () => {
        expect(
          texts((d) => (d.issues[first].options["opt-1"].agreement = "strongly-agrees")),
        ).toEqual(["texts-schema"]);
      });

      it("rejects an empty text", () => {
        expect(texts((d) => (d.issues[first].options["opt-1"].text = " "))).toEqual([
          "texts-schema",
        ]);
        expect(texts((d) => (d.points[0].text = ""))).toEqual(["texts-schema"]);
      });

      it("requires exactly one of options or unclear per issue", () => {
        expect(texts((d) => (d.issues[first].unclear = { text: "Unclear." }))).toEqual([
          "texts-schema",
        ]);
        expect(texts((d) => delete d.issues[second].unclear)).toEqual(["texts-schema"]);
      });

      it("rejects a party id or language that doesn't match the path", () => {
        expect(texts((d) => (d.partyId = "left-half"))).toEqual(["texts-file"]);
        expect(texts((d) => (d.lang = "he"))).toEqual(["texts-file"]);
      });

      it("rejects texts for an unknown or a listed party", () => {
        for (const id of ["ghost", "listed-only"]) {
          const c = validContent();
          m(c).texts.en[0].file = `placeholder/matching/texts/en/${id}.json`;
          editJson(m(c).texts.en[0], (d) => (d.partyId = id));
          // The renamed file also leaves "solo" without English texts.
          expect(rulesOf(c)).toEqual(["texts-party", "texts-missing"]);
        }
      });

      it("rejects an unknown issue", () => {
        expect(
          texts((d) => (d.issues.nothing = { anchor: "issue-nothing", unclear: { text: "U." } })),
        ).toEqual(["texts-issue"]);
      });

      it("rejects an option that isn't one of the issue's", () => {
        expect(
          texts((d) => (d.issues[first].options["opt-9"] = { agreement: "agrees", text: "T." })),
        ).toEqual(["texts-option"]);
      });

      it("requires each issue's own anchor", () => {
        expect(texts((d) => (d.issues[first].anchor = `issue-${second}`))).toEqual([
          "texts-anchor",
        ]);
        expect(texts((d) => (d.issues[second].anchor = "overview"))).toEqual(["texts-anchor"]);
      });

      it("requires point anchors to be other- anchors", () => {
        expect(texts((d) => (d.points[0].anchor = "coalition"), false)).toEqual(["texts-anchor"]);
        expect(texts((d) => (d.points[0].anchor = `issue-${first}`), false)).toEqual([
          "texts-anchor",
        ]);
      });

      it("checks anchors against the research document in the same language", () => {
        expect(texts((d) => (d.points[0].anchor = "other-economy"))).toContain("texts-anchor");
        // Only the Hebrew document has the anchor, so only the English texts fail.
        const c = validContent();
        editDoc(c, "he", 0, (r) => r.replace("{#other-environment}", "{#other-nature}"));
        editJson(m(c).texts.he[0], (d) => (d.points[0].anchor = "other-nature"));
        const errors = validateContent(c).filter((e) => e.rule === "texts-anchor");
        expect(errors).toEqual([]);
        editJson(m(c).texts.en[0], (d) => (d.points[0].anchor = "other-nature"));
        expect(
          validateContent(c)
            .filter((e) => e.rule === "texts-anchor")
            .map((e) => e.file),
        ).toEqual(["placeholder/matching/texts/en/solo.json"]);
      });

      it("skips the document check when an inactive corpus has no document yet", () => {
        const c = validContent();
        corpus(c).active = false;
        corpus(c).research.he = [];
        editJson(m(c).texts.he[0], (d) => (d.points[0].anchor = "other-not-written-yet"));
        expect(rulesOf(c)).toEqual([]);
        // The form of the anchor is still checked.
        editJson(m(c).texts.he[0], (d) => (d.points[0].anchor = "coalition"));
        expect(rulesOf(c)).toEqual(["texts-anchor"]);
      });

      it("requires the research document on the active corpus", () => {
        const c = validContent();
        corpus(c).research.he = corpus(c).research.he.filter((f) => !f.file.endsWith("/solo.md"));
        expect(rulesOf(c)).toEqual(["research-missing"]);
      });

      it("rejects poll figures in an option text, an unclear text and a point", () => {
        const sentence = "Recent polls give the party 6 seats.";
        expect(texts((d) => (d.issues[first].options["opt-2"].text = sentence))).toEqual([
          "poll-figure",
        ]);
        expect(texts((d) => (d.issues[second].unclear.text = sentence))).toEqual(["poll-figure"]);
        expect(texts((d) => (d.points[0].text = sentence))).toEqual(["poll-figure"]);
        const c = validContent();
        editJson(
          m(c).texts.he[0],
          (d) => (d.points[0].text = "בסקר האחרון המפלגה קיבלה 5 מנדטים."),
        );
        expect(rulesOf(c)).toEqual(["poll-figure"]);
      });

      it("allows past results and vote counts in a text", () => {
        expect(
          texts((d) => (d.points[0].text = "It won 4.1% in 2022 and holds 14 seats.")),
        ).toEqual([]);
      });
    });

    describe("scoring constants", () => {
      it.each([
        ["levels.main", (d: any) => (d.levels.main = 1.2)],
        ["levels.either", (d: any) => (d.levels.either = -0.1)],
        ["levels.secondary", (d: any) => delete d.levels.secondary],
        ["unclear", (d: any) => (d.unclear = 2)],
        ["agreement.agrees", (d: any) => (d.agreement.agrees = 75)],
        ["agreement.partially", (d: any) => (d.agreement.partially = "0.35")],
        ["weakMatchBelow", (d: any) => delete d.weakMatchBelow],
      ])("rejects a missing or out-of-range %s", (_name, edit) => {
        expect(config(edit)).toEqual(["matching-config-schema"]);
      });

      it("rejects cut-offs in the wrong order", () => {
        expect(config((d) => (d.agreement.partially = 0.8))).toEqual(["matching-config-schema"]);
      });

      it("accepts the boundary values", () => {
        expect(
          config((d) => {
            d.unclear = 0;
            d.levels.main = 1;
            d.weakMatchBelow = 0;
          }),
        ).toEqual([]);
      });
    });

    describe("voter profiles", () => {
      it("rejects fewer than 5 or more than 10 ranked issues", () => {
        expect(profiles((d) => d.profiles[0].ranked.pop())).toEqual(["profiles-schema"]);
        expect(
          profiles((d) => (d.profiles[0].ranked = [...ISSUE_IDS, "issue-k"])),
        ).toEqual(["profiles-schema"]);
      });

      it("requires an expected top party and a reason", () => {
        expect(profiles((d) => (d.profiles[0].expect.topAnyOf = []))).toEqual(["profiles-schema"]);
        expect(profiles((d) => delete d.profiles[0].reason)).toEqual(["profiles-schema"]);
      });

      it("treats inTop4 and notInTop4 as optional", () => {
        expect(
          profiles((d) => {
            delete d.profiles[0].expect.inTop4;
            delete d.profiles[0].expect.notInTop4;
          }),
        ).toEqual([]);
      });

      it("rejects duplicate profile ids", () => {
        expect(profiles((d) => d.profiles.push({ ...d.profiles[0] }))).toEqual([
          "profiles-content",
        ]);
      });

      it("rejects an issue ranked twice", () => {
        expect(profiles((d) => (d.profiles[0].ranked[1] = d.profiles[0].ranked[0]))).toEqual([
          "profiles-content",
        ]);
      });

      it("rejects an unknown issue", () => {
        expect(
          profiles((d) => {
            d.profiles[0].ranked[0] = "nothing";
            d.profiles[0].answers.nothing = "opt-1";
          }),
        ).toEqual(["profiles-content"]);
      });

      it("rejects a ranked issue without an answer", () => {
        expect(profiles((d) => delete d.profiles[0].answers[ISSUE_IDS[0]])).toEqual([
          "profiles-content",
        ]);
      });

      it("rejects an answer that isn't one of the issue's options", () => {
        expect(profiles((d) => (d.profiles[0].answers[ISSUE_IDS[0]] = "opt-9"))).toEqual([
          "profiles-content",
        ]);
      });

      it("rejects an unknown or a listed party in the expectation", () => {
        expect(profiles((d) => (d.profiles[0].expect.topAnyOf = ["ghost"]))).toEqual([
          "profiles-content",
        ]);
        expect(profiles((d) => (d.profiles[0].expect.notInTop4 = ["listed-only"]))).toEqual([
          "profiles-content",
        ]);
      });

      it("rejects a party expected both in and out of the top 4", () => {
        expect(profiles((d) => (d.profiles[0].expect.notInTop4 = ["solo"]))).toEqual([
          "profiles-content",
        ]);
      });
    });

    describe("completeness (active corpus only)", () => {
      const first = ISSUE_IDS[0];
      const third = ISSUE_IDS[2];
      /** Applies one change to the valid corpus and returns the rules raised, active and inactive. */
      function both(change: (c: ReturnType<typeof validContent>) => void) {
        return [true, false].map((active) => {
          const c = validContent();
          corpus(c).active = active;
          change(c);
          return [...new Set(rulesOf(c))];
        });
      }

      it("requires the constants, and positions and a grid for every issue", () => {
        const [active, inactive] = both((c) => (corpus(c).matching = emptyMatching()));
        expect(active).toEqual([
          "matching-config-missing",
          "positions-missing",
          "distances-missing",
          "texts-missing",
        ]);
        expect(inactive).toEqual([]);
        expect(both((c) => (m(c).config = null))).toEqual([["matching-config-missing"], []]);
        expect(both((c) => m(c).positions.pop())).toEqual([["positions-missing"], []]);
        expect(both((c) => m(c).distances.pop())).toEqual([["distances-missing"], []]);
      });

      it("requires a row for every researched party in every issue", () => {
        const c = validContent();
        editJson(m(c).positions[2], (d) => d.rows.pop());
        const errors = validateContent(c);
        expect(errors.map((e) => e.rule)).toEqual(["positions-missing"]);
        expect(errors[0].file).toBe(`placeholder/matching/positions/${third}.json`);
        expect(errors[0].message).toContain("right-half");
        expect(both((x) => editJson(m(x).positions[2], (d) => d.rows.pop()))[1]).toEqual([]);
      });

      it("doesn't report a file or row a single-file rule already rejected as missing", () => {
        expect(positions((d) => (d.rows[0].held[0].level = "strong"))).toEqual([
          "positions-schema",
        ]);
        expect(positions((d) => (d.rows[0].held[0].optionId = "opt-9"))).toEqual([
          "positions-option",
        ]);
        expect(distances((d) => (d.pairs[0].closeness = 2))).toEqual(["distances-schema"]);
        expect(texts((d) => (d.lang = "fr"))).toEqual(["texts-schema"]);
      });

      it("requires every pair in a grid", () => {
        const c = validContent();
        editJson(m(c).distances[0], (d) => d.pairs.shift());
        const errors = validateContent(c);
        expect(errors.map((e) => e.rule)).toEqual(["distances-missing"]);
        expect(errors[0].message).toContain('"opt-1"/"opt-2"');
      });

      it("requires texts in both languages for every researched party", () => {
        expect(both((c) => m(c).texts.he.pop())).toEqual([["texts-missing"], []]);
        expect(both((c) => m(c).texts.en.shift())).toEqual([["texts-missing"], []]);
      });

      it("requires a text for every issue and every option", () => {
        // The other language still has the entry, so the two also differ.
        expect(both((c) => editJson(m(c).texts.en[0], (d) => delete d.issues[third]))).toEqual([
          ["texts-missing", "texts-parity"],
          [],
        ]);
        expect(
          both((c) => editJson(m(c).texts.he[1], (d) => delete d.issues[first].options["opt-2"])),
        ).toEqual([["texts-missing", "texts-parity"], []]);
        // Missing in both languages: complete parity, still incomplete.
        const c = validContent();
        for (const lang of ["en", "he"] as const)
          editJson(m(c).texts[lang][0], (d) => delete d.issues[third].options["opt-3"]);
        const errors = validateContent(c);
        expect(errors.map((e) => e.rule)).toEqual(["texts-missing", "texts-missing"]);
        expect(errors[0].message).toContain(`issue "${third}": no text for option "opt-3"`);
      });

      it("requires identical entries in both languages", () => {
        const [active, inactive] = both((c) =>
          editJson(m(c).texts.he[0], (d) => (d.points[1].anchor = "other-environment")),
        );
        expect(active).toEqual(["texts-parity"]);
        expect(inactive).toEqual([]);
      });

      it.each([1, 4])("rejects %i points", (count) => {
        const [active, inactive] = both((c) => {
          for (const lang of ["en", "he"] as const)
            editJson(m(c).texts[lang][0], (d) => {
              d.points = Array.from({ length: count }, () => d.points[0]);
            });
        });
        expect(active).toEqual(["texts-points"]);
        expect(inactive).toEqual([]);
      });

      it("accepts 3 points", () => {
        const c = validContent();
        for (const lang of ["en", "he"] as const)
          editJson(m(c).texts[lang][0], (d) => d.points.push(d.points[0]));
        expect(rulesOf(c)).toEqual([]);
      });

      it("rejects an unclear row when the research has a Closest option(s) line", () => {
        // "left-half" is documented on the third issue; its texts then no longer fit either.
        const edit = (d: any) => Object.assign(d.rows[1], { unclear: true, held: [] });
        const [active, inactive] = both((c) => editJson(m(c).positions[2], edit));
        expect(active).toEqual(["positions-research", "texts-agreement"]);
        expect(inactive).toEqual([]);
      });

      it("rejects a held position when the research says no documented position was found", () => {
        // "right-half" has no documented position on the first issue.
        const edit = (d: any) =>
          Object.assign(d.rows[2], {
            unclear: false,
            held: [{ optionId: "opt-1", level: "main" }],
          });
        const [active, inactive] = both((c) => editJson(m(c).positions[0], edit));
        expect(active).toEqual(["positions-research", "texts-missing"]);
        expect(inactive).toEqual([]);
      });

      it("reads the unclear rule from the English research document", () => {
        const c = validContent();
        // Index 2 is "right-half": give its English document a position on the first issue.
        editDoc(c, "en", 2, (r) =>
          r.replace("**No documented position found.**", "**Closest option(s):** Option 1."),
        );
        expect(rulesOf(c)).toEqual(["positions-research"]);
        const d = validContent();
        editDoc(d, "he", 2, (r) =>
          r.replace("**No documented position found.**", "**Closest option(s):** Option 1."),
        );
        expect(rulesOf(d)).toEqual([]);
      });

      it("rejects a text whose recorded agreement differs from the computed label", () => {
        const edit = (d: any) => (d.issues[first].options["opt-2"].agreement = "agrees");
        const c = validContent();
        editJson(m(c).texts.en[0], edit);
        const errors = validateContent(c);
        expect(errors.map((e) => e.rule)).toEqual(["texts-agreement"]);
        expect(errors[0].message).toContain('written for "agrees", but the score gives "partially"');
        expect(texts(edit, false)).toEqual([]);
      });

      it("recomputes the label when a row, a grid value or a constant changes", () => {
        // "solo" holds opt-1 as main on the third issue: opt-2 scores 0.5, "partially".
        expect(
          both((c) => editJson(m(c).positions[2], (d) => (d.rows[0].held[0].optionId = "opt-3"))),
        ).toEqual([["texts-agreement"], []]);
        expect(
          both((c) => editJson(m(c).distances[2], (d) => (d.pairs[0].closeness = 0.9))),
        ).toEqual([["texts-agreement"], []]);
        expect(both((c) => editJson(m(c).config, (d) => (d.agreement.partially = 0.55)))).toEqual([
          ["texts-agreement"],
          [],
        ]);
      });

      it("rejects per-option texts for an unclear row", () => {
        // "solo" is unclear on the second issue.
        const edit = (d: any) =>
          (d.issues[ISSUE_IDS[1]] = { ...d.issues[third], anchor: `issue-${ISSUE_IDS[1]}` });
        const c = validContent();
        for (const lang of ["en", "he"] as const) editJson(m(c).texts[lang][0], edit);
        expect([...new Set(rulesOf(c))]).toEqual(["texts-agreement"]);
      });
    });
  });
});
