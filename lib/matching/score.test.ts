import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  matchingConfigSchema,
  optionPairs,
  type DistancesFile,
  type HeldOption,
  type MatchingConfig,
  type PartyTexts,
  type PositionRow,
  type PositionsFile,
} from "@/lib/content/schemas";
import { TOP_ENTRIES } from "./contract";
import {
  agreementLabel,
  closeness,
  displayWeight,
  issueAgreement,
  issueScore,
  isWeakMatch,
  MatchDataError,
  MatchInputError,
  partyScore,
  rankParties,
  scoreMatch,
  tieBreakValue,
  type MatchingData,
  type MatchInput,
} from "./score";

const CONFIG: MatchingConfig = {
  levels: { main: 1, either: 0.85, secondary: 0.6 },
  unclear: 0.25,
  agreement: { agrees: 0.75, partially: 0.35 },
  weakMatchBelow: 0.6,
  ruledOutMax: 0.3,
};

/** Six issues, each with options a–d on a line: neighbours 0.5, two apart 0.2, the ends 0. */
const ISSUES = ["i1", "i2", "i3", "i4", "i5", "i6"];
const OPTIONS = ["a", "b", "c", "d"];
const STEP_CLOSENESS = [1, 0.5, 0.2, 0];

const grid = (issueId: string): DistancesFile => ({
  issueId,
  pairs: optionPairs(OPTIONS).map(([a, b]) => ({
    a,
    b,
    closeness: STEP_CLOSENESS[Math.abs(OPTIONS.indexOf(a) - OPTIONS.indexOf(b))],
    reason: "test",
  })),
});

const held = (spec: string): HeldOption[] =>
  spec.split(",").map((part) => {
    const [optionId, level] = part.split(":");
    return { optionId, level: (level ?? "main") as HeldOption["level"] };
  });

/** A row from a short spec: "a" (main), "a:either,b:either", "b:secondary", or "" for unclear. */
const row = (partyId: string, issueId: string, spec: string): PositionRow => ({
  partyId,
  unclear: spec === "",
  held: spec === "" ? [] : held(spec),
  anchor: `issue-${issueId}`,
  basis: "test",
});

/** Matching data where each party holds the same spec on every issue, unless overridden. */
function dataFor(
  parties: Record<string, string | Record<string, string>>,
  extra: Partial<MatchingData> = {},
): MatchingData {
  const positions: PositionsFile[] = ISSUES.map((issueId) => ({
    issueId,
    rows: Object.entries(parties).map(([partyId, spec]) =>
      row(partyId, issueId, typeof spec === "string" ? spec : (spec[issueId] ?? spec.default)),
    ),
  }));
  return { positions, distances: ISSUES.map(grid), config: CONFIG, ...extra };
}

const input = (answers: Record<string, string>): MatchInput => ({
  ranked: Object.keys(answers),
  answers,
});
const allA = input(Object.fromEntries(ISSUES.slice(0, 5).map((id) => [id, "a"])));

describe("closeness", () => {
  it("is 1 for an option with itself, without a stored entry", () => {
    expect(closeness(grid("i1"), "a", "a")).toBe(1);
  });

  it("reads a pair in either order", () => {
    expect(closeness(grid("i1"), "a", "b")).toBe(0.5);
    expect(closeness(grid("i1"), "b", "a")).toBe(0.5);
    expect(closeness(grid("i1"), "d", "a")).toBe(0);
  });

  it("throws a clear error for a pair the grid lacks, instead of scoring 0", () => {
    const g = grid("i1");
    g.pairs = g.pairs.filter((p) => !(p.a === "a" && p.b === "c"));
    expect(() => closeness(g, "c", "a")).toThrow(MatchDataError);
    expect(() => closeness(g, "c", "a")).toThrow(/issue "i1".*"c"\/"a"/);
  });
});

describe("issueScore", () => {
  const score = (spec: string, optionId: string) =>
    issueScore(row("p", "i1", spec), optionId, grid("i1"), CONFIG);

  it("gives a main option its full value on the user's own option", () => {
    expect(score("a", "a")).toBe(1);
  });

  it("caps an option the party rejected, but never raises a score", () => {
    const rejected = (optionId: string) =>
      issueScore({ ...row("p", "i1", "a"), ruledOut: [optionId] }, optionId, grid("i1"), CONFIG);
    // A neighbour would score 0.5; rejected, it scores the cap.
    expect(score("a", "b")).toBe(0.5);
    expect(rejected("b")).toBe(CONFIG.ruledOutMax);
    // An option already below the cap keeps its lower score.
    expect(rejected("c")).toBe(score("a", "c"));
    // Other options are unaffected.
    expect(issueScore({ ...row("p", "i1", "a"), ruledOut: ["b"] }, "a", grid("i1"), CONFIG)).toBe(
      1,
    );
  });

  it("gives an either option the either value", () => {
    expect(score("a:either,b:either", "a")).toBe(0.85);
    expect(score("a:either,b:either", "b")).toBe(0.85);
  });

  it("gives a secondary option the secondary value", () => {
    expect(score("a:secondary", "a")).toBe(0.6);
  });

  it("multiplies the level value by the closeness to the user's option", () => {
    expect(score("a", "b")).toBe(0.5);
    expect(score("a", "d")).toBe(0);
    expect(score("a:secondary", "b")).toBeCloseTo(0.3);
    expect(score("a:either,b:either", "d")).toBeCloseTo(0.85 * 0.2);
  });

  it("scores an unclear row at the unclear value, whatever the user chose", () => {
    for (const optionId of OPTIONS) expect(score("", optionId)).toBe(0.25);
  });

  it("takes the best of the held options, not the first or the highest level", () => {
    // Main "a" is far from "d" (0); secondary "d" is the user's option (0.6).
    expect(score("a,d:secondary", "d")).toBe(0.6);
    // Main "a" is next to "b" (0.5); secondary "c" is next to it too (0.3).
    expect(score("a,c:secondary", "b")).toBe(0.5);
    expect(score("d:secondary,a", "a")).toBe(1);
  });

  it("uses the configured values", () => {
    const config = { ...CONFIG, levels: { main: 0.9, either: 0.7, secondary: 0.4 }, unclear: 0.1 };
    const s = (spec: string) => issueScore(row("p", "i1", spec), "a", grid("i1"), config);
    expect([s("a"), s("a:either,b:either"), s("a:secondary"), s("")]).toEqual([0.9, 0.7, 0.4, 0.1]);
  });

  it("throws when a needed pair is missing from the grid", () => {
    const g = grid("i1");
    g.pairs = g.pairs.filter((p) => !(p.a === "a" && p.b === "b"));
    expect(() => issueScore(row("p", "i1", "a"), "b", g, CONFIG)).toThrow(MatchDataError);
  });
});

describe("agreementLabel", () => {
  it("applies both cut-offs, each inclusive", () => {
    expect(agreementLabel(1, CONFIG)).toBe("agrees");
    expect(agreementLabel(0.75, CONFIG)).toBe("agrees");
    expect(agreementLabel(0.7499, CONFIG)).toBe("partially");
    expect(agreementLabel(0.35, CONFIG)).toBe("partially");
    expect(agreementLabel(0.3499, CONFIG)).toBe("disagrees");
    expect(agreementLabel(0, CONFIG)).toBe("disagrees");
  });

  it("isn't thrown off by floating-point noise at a cut-off", () => {
    // 0.1 × 3 × 2.5 is 0.75 on paper and a hair above it in floating point; the
    // same can happen just below a cut-off.
    expect(agreementLabel(0.75 - 1e-12, CONFIG)).toBe("agrees");
    expect(agreementLabel(0.35 - 1e-12, CONFIG)).toBe("partially");
    expect(agreementLabel(0.35 - 1e-6, CONFIG)).toBe("disagrees");
  });

  it("follows the configured cut-offs", () => {
    const config = { ...CONFIG, agreement: { agrees: 0.9, partially: 0.6 } };
    expect(agreementLabel(0.85, config)).toBe("partially");
    expect(agreementLabel(0.5, config)).toBe("disagrees");
  });
});

describe("issueAgreement", () => {
  const label = (spec: string, optionId: string) =>
    issueAgreement(row("p", "i1", spec), optionId, grid("i1"), CONFIG);

  it("labels by the score", () => {
    expect(label("a", "a")).toBe("agrees");
    expect(label("a:either,b:either", "a")).toBe("agrees");
    expect(label("a:secondary", "a")).toBe("partially");
    expect(label("a", "b")).toBe("partially");
    expect(label("a", "c")).toBe("disagrees");
  });

  it("labels options a tentative row isn't linked to as unclear, not as disagreement", () => {
    // A row holding only `secondary` options rests on tentative evidence.
    expect(label("a:secondary", "b")).toBe("party-position-unclear");
    expect(label("a:secondary", "c")).toBe("party-position-unclear");
    expect(label("a:secondary,b:secondary", "c")).toBe("party-position-unclear");
    // The options it is linked to keep their score-based label.
    expect(label("a:secondary,b:secondary", "b")).toBe("partially");
    // An option the research says the party rejects stays a disagreement.
    expect(
      issueAgreement(
        { ...row("p", "i1", "a:secondary"), ruledOut: ["c"] },
        "c",
        grid("i1"),
        CONFIG,
      ),
    ).toBe("disagrees");
    // ...on a firm row too, even when the option is near the one held.
    expect(
      issueAgreement({ ...row("p", "i1", "a"), ruledOut: ["b"] }, "b", grid("i1"), CONFIG),
    ).toBe("disagrees");
    // A firm position alongside a secondary one still disagrees with a far option.
    expect(label("a,b:secondary", "c")).toBe("disagrees");
    expect(label("a:either,b:either", "c")).not.toBe("party-position-unclear");
  });

  it("labels an unclear row as unclear, not by its score", () => {
    expect(label("", "a")).toBe("party-position-unclear");
    // Even when the unclear value would clear a cut-off.
    const config = { ...CONFIG, unclear: 0.5 };
    expect(issueAgreement(row("p", "i1", ""), "a", grid("i1"), config)).toBe(
      "party-position-unclear",
    );
  });
});

describe("weights", () => {
  it("shows (n − rank + 1) / n", () => {
    expect([1, 2, 3, 4, 5].map((rank) => displayWeight(rank, 5))).toEqual([1, 0.8, 0.6, 0.4, 0.2]);
    expect(displayWeight(10, 10)).toBe(0.1);
  });

  it("averages issue scores with linear weights: the top of n counts n, the last 1", () => {
    // (3·1 + 2·0 + 1·0) / 6
    expect(partyScore([1, 0, 0])).toBeCloseTo(0.5);
    // (3·0 + 2·0 + 1·1) / 6
    expect(partyScore([0, 0, 1])).toBeCloseTo(1 / 6);
    expect(partyScore([0.4, 0.4, 0.4, 0.4, 0.4])).toBeCloseTo(0.4);
    expect(partyScore([1, 0.5, 0.25, 0, 0.6])).toBeCloseTo((5 + 2 + 0.75 + 0 + 0.6) / 15);
  });

  it("makes a higher-ranked issue count more", () => {
    const data = dataFor({
      "top-issue": { i1: "a", default: "d" },
      "last-issue": { i5: "a", default: "d" },
    });
    const ranked = rankParties(data, allA, ["last-issue", "top-issue"]);
    expect(ranked.map((r) => r.partyId)).toEqual(["top-issue", "last-issue"]);
    expect(ranked[0].score).toBeCloseTo(5 / 15);
    expect(ranked[1].score).toBeCloseTo(1 / 15);
    expect(ranked[0].issueScores).toEqual([1, 0, 0, 0, 0]);
  });
});

describe("scoreMatch", () => {
  const SIX = { p1: "a", p2: "a:either,b:either", p3: "a:secondary", p4: "b", p5: "", p6: "d" };

  it("returns every party in score order, each with its breakdown", () => {
    const result = scoreMatch(dataFor(SIX), allA, Object.keys(SIX));
    // 1, 0.85, 0.6, 0.5, 0.25 (unclear), 0: nothing is cut off after the top few.
    expect(result.entries.map((e) => e.partyId)).toEqual(["p1", "p2", "p3", "p4", "p5", "p6"]);
    expect(result.entries.length).toBeGreaterThan(TOP_ENTRIES);
    for (const e of result.entries) expect(e.breakdown).toHaveLength(allA.ranked.length);
    expect(result.weakMatch).toBe(false);
  });

  it("ranks only the parties it is given", () => {
    const result = scoreMatch(dataFor(SIX), allA, ["p6", "p5", "p4"]);
    expect(result.entries.map((e) => e.partyId)).toEqual(["p4", "p5", "p6"]);
  });

  it("doesn't depend on the order of the party list", () => {
    const data = dataFor(SIX);
    const ids = Object.keys(SIX);
    expect(scoreMatch(data, allA, [...ids].reverse())).toEqual(scoreMatch(data, allA, ids));
  });

  it("builds the breakdown in rank order with rank, weight, label and anchor", () => {
    const data = dataFor({ p: { i1: "a", i2: "b", i3: "c", i4: "", default: "a:secondary" } });
    const [entry] = scoreMatch(data, allA, ["p"]).entries;
    expect(entry.breakdown).toEqual([
      {
        issueId: "i1",
        rank: 1,
        weight: 1,
        agreement: "agrees",
        explanation: "",
        anchor: "issue-i1",
      },
      {
        issueId: "i2",
        rank: 2,
        weight: 0.8,
        agreement: "partially",
        explanation: "",
        anchor: "issue-i2",
      },
      {
        issueId: "i3",
        rank: 3,
        weight: 0.6,
        agreement: "disagrees",
        explanation: "",
        anchor: "issue-i3",
      },
      {
        issueId: "i4",
        rank: 4,
        weight: 0.4,
        agreement: "party-position-unclear",
        explanation: "",
        anchor: "issue-i4",
      },
      {
        issueId: "i5",
        rank: 5,
        weight: 0.2,
        agreement: "partially",
        explanation: "",
        anchor: "issue-i5",
      },
    ]);
    expect(entry.points).toEqual([]);
  });

  it("follows the user's rank order, not the content's issue order", () => {
    const data = dataFor({ p: "a" });
    const reversed = input({ i6: "a", i3: "b", i5: "a", i1: "a", i2: "a" });
    const [entry] = scoreMatch(data, reversed, ["p"]).entries;
    expect(entry.breakdown.map((b) => [b.issueId, b.rank])).toEqual([
      ["i6", 1],
      ["i3", 2],
      ["i5", 3],
      ["i1", 4],
      ["i2", 5],
    ]);
    expect(entry.breakdown[1].agreement).toBe("partially");
  });

  describe("texts", () => {
    const texts: PartyTexts[] = [
      {
        partyId: "p",
        lang: "en",
        issues: {
          i1: {
            anchor: "issue-i1",
            options: {
              a: { agreement: "agrees", text: "You chose a; so did the party." },
              b: { agreement: "partially", text: "You chose b; the party chose a." },
            },
          },
          i2: { anchor: "issue-i2", unclear: { text: "No documented position was found." } },
        },
        points: [
          { text: "Also backs parks.", anchor: "other-environment" },
          { text: "Also backs trains.", anchor: "other-transport" },
        ],
      },
    ];
    const data = dataFor({ p: { i2: "", default: "a" }, q: "b" }, { texts });

    it("attaches the text and anchor for the user's chosen option", () => {
      const result = scoreMatch(data, allA, ["p", "q"]);
      const p = result.entries.find((e) => e.partyId === "p")!;
      expect(p.breakdown[0].explanation).toBe("You chose a; so did the party.");
      expect(p.breakdown[0].anchor).toBe("issue-i1");
      const withB = scoreMatch(data, input({ ...allA.answers, i1: "b" }), ["p"]).entries[0];
      expect(withB.breakdown[0].explanation).toBe("You chose b; the party chose a.");
    });

    it("uses the one unclear text for every option of an unclear issue", () => {
      for (const optionId of OPTIONS) {
        const [p] = scoreMatch(data, input({ ...allA.answers, i2: optionId }), ["p"]).entries;
        expect(p.breakdown[1]).toMatchObject({
          agreement: "party-position-unclear",
          explanation: "No documented position was found.",
          anchor: "issue-i2",
        });
      }
    });

    it("attaches each party's points", () => {
      const result = scoreMatch(data, allA, ["p", "q"]);
      expect(result.entries.find((e) => e.partyId === "p")!.points).toEqual(texts[0].points);
    });

    it("leaves the explanation empty, without failing, where a text is absent", () => {
      const result = scoreMatch(data, allA, ["p", "q"]);
      const p = result.entries.find((e) => e.partyId === "p")!;
      const q = result.entries.find((e) => e.partyId === "q")!;
      // The party has texts, but none for this issue or this option.
      expect(p.breakdown[2]).toMatchObject({ explanation: "", anchor: "issue-i3" });
      expect(
        scoreMatch(data, input({ ...allA.answers, i1: "d" }), ["p"]).entries[0].breakdown[0],
      ).toMatchObject({ explanation: "", anchor: "issue-i1" });
      // The party has no texts at all.
      expect(q.breakdown.every((b) => b.explanation === "")).toBe(true);
      expect(q.points).toEqual([]);
    });

    it("computes the label from the score, never from the text's recorded level", () => {
      const lying = structuredClone(texts);
      lying[0].issues.i1.options!.a.agreement = "disagrees";
      const [p] = scoreMatch({ ...data, texts: lying }, allA, ["p"]).entries;
      expect(p.breakdown[0].agreement).toBe("agrees");
    });
  });

  describe("weak match", () => {
    it("is set when the top score is below the configured level", () => {
      // Best party is unclear everywhere: 0.25.
      expect(scoreMatch(dataFor({ p5: "", p6: "d" }), allA, ["p5", "p6"]).weakMatch).toBe(true);
      // 0.5 everywhere.
      expect(scoreMatch(dataFor({ p4: "b" }), allA, ["p4"]).weakMatch).toBe(true);
    });

    it("is not set at or above the level", () => {
      // Exactly 0.6 on every issue.
      expect(scoreMatch(dataFor({ p3: "a:secondary" }), allA, ["p3"]).weakMatch).toBe(false);
      expect(scoreMatch(dataFor({ p1: "a" }), allA, ["p1"]).weakMatch).toBe(false);
    });

    it("follows the configured level", () => {
      const data = dataFor({ p2: "a:either,b:either" });
      const strict = { ...data, config: { ...CONFIG, weakMatchBelow: 0.9 } };
      expect(scoreMatch(data, allA, ["p2"]).weakMatch).toBe(false);
      expect(scoreMatch(strict, allA, ["p2"]).weakMatch).toBe(true);
      expect(isWeakMatch(0.59, CONFIG)).toBe(true);
      expect(isWeakMatch(0.6, CONFIG)).toBe(false);
    });

    it("looks at the top score only", () => {
      const result = scoreMatch(dataFor({ p1: "a", p6: "d" }), allA, ["p1", "p6"]);
      expect(result.weakMatch).toBe(false);
    });
  });

  describe("tie-break", () => {
    const TIED = ["alef", "bet", "gimel", "dalet", "he", "vav"];
    const tiedData = dataFor(Object.fromEntries(TIED.map((id) => [id, "a"])));

    /** Many different inputs on which every tied party scores the same. */
    function* manyInputs(): Generator<MatchInput> {
      for (let n = 5; n <= 6; n++) {
        for (let shift = 0; shift < ISSUES.length; shift++) {
          for (let variant = 0; variant < 16; variant++) {
            const ranked = Array.from({ length: n }, (_, i) => ISSUES[(i + shift) % ISSUES.length]);
            const answers = Object.fromEntries(
              ranked.map((id, i) => [id, OPTIONS[(variant >> (i % 4)) & 1 ? 1 : 0]]),
            );
            yield { ranked, answers };
          }
        }
      }
    }

    it("gives the same order for the same input, every time", () => {
      const first = scoreMatch(tiedData, allA, TIED);
      for (let i = 0; i < 5; i++) {
        expect(scoreMatch(tiedData, structuredClone(allA), [...TIED].reverse())).toEqual(first);
      }
    });

    it("depends on the answers, so different inputs order tied parties differently", () => {
      const orders = new Set<string>();
      for (const i of manyInputs()) {
        orders.add(
          rankParties(tiedData, i, TIED)
            .map((r) => r.partyId)
            .join(","),
        );
      }
      expect(orders.size).toBeGreaterThan(20);
    });

    it("has no fixed favourite: every tied party comes first for some inputs", () => {
      const firsts = new Map<string, number>(TIED.map((id) => [id, 0]));
      let total = 0;
      for (const i of manyInputs()) {
        const ranked = rankParties(tiedData, i, TIED);
        // All six really are tied.
        expect(new Set(ranked.map((r) => r.score.toFixed(9))).size).toBe(1);
        firsts.set(ranked[0].partyId, firsts.get(ranked[0].partyId)! + 1);
        total++;
      }
      expect(total).toBe(192);
      // An even split is 32 each; a fixed favourite would take all 192.
      for (const [partyId, count] of firsts) {
        expect(count, partyId).toBeGreaterThanOrEqual(12);
        expect(count, partyId).toBeLessThanOrEqual(64);
      }
    });

    it("isn't alphabetical or the order the parties were given in", () => {
      let alphabetical = 0;
      let total = 0;
      const sorted = [...TIED].sort().join(",");
      for (const i of manyInputs()) {
        if (
          rankParties(tiedData, i, TIED)
            .map((r) => r.partyId)
            .join(",") === sorted
        )
          alphabetical++;
        total++;
      }
      expect(alphabetical).toBeLessThan(total / 10);
    });

    it("only orders parties whose scores are equal", () => {
      const data = dataFor({
        ...Object.fromEntries(TIED.map((id) => [id, "a"])),
        zz: "a",
        low: "d",
      });
      data.positions[4].rows.find((r) => r.partyId === "zz")!.held = held("a:either,b:either");
      let checked = 0;
      for (const i of manyInputs()) {
        if (i.answers.i5 !== "a") continue;
        const ranked = rankParties(data, i, ["low", "zz", ...TIED]);
        // "zz" is a little behind the six on i5, and "low" is behind everywhere.
        expect(ranked.slice(6).map((r) => r.partyId)).toEqual(["zz", "low"]);
        checked++;
      }
      expect(checked).toBeGreaterThan(50);
    });

    it("treats scores that differ only by floating-point noise as equal", () => {
      // Issue scores 0, 0, 0.6, 0.5, 0.5 and 0, 0, 0.5, 0.6, 0.6 both average
      // 0.22 on paper; in floating point the second comes out a hair higher.
      const rows = (x: string, y: string) => ({
        [x]: { i3: "a:secondary", default: "b", i1: "d", i2: "d" },
        [y]: { i3: "b", default: "a:secondary", i1: "d", i2: "d" },
      });
      const firsts = { x: 0, y: 0 };
      for (let k = 0; k < 40; k++) {
        const ranked = rankParties(dataFor(rows(`x${k}`, `y${k}`)), allA, [`x${k}`, `y${k}`]);
        const [x, y] = [`x${k}`, `y${k}`].map((id) => ranked.find((r) => r.partyId === id)!);
        expect(y.score).toBeGreaterThan(x.score);
        expect(y.score).toBeCloseTo(x.score, 12);
        firsts[ranked[0].partyId.startsWith("x") ? "x" : "y"]++;
      }
      // Without the tolerance "y" would come first all 40 times.
      expect(firsts.x).toBeGreaterThanOrEqual(10);
      expect(firsts.y).toBeGreaterThanOrEqual(10);
    });

    it("hashes the ranking and the answers together with the party id", () => {
      const other = input({ ...allA.answers, i1: "b" });
      const reordered = { ranked: [...allA.ranked].reverse(), answers: allA.answers };
      expect(tieBreakValue(allA, "alef")).toBe(tieBreakValue(structuredClone(allA), "alef"));
      expect(tieBreakValue(allA, "alef")).not.toBe(tieBreakValue(allA, "bet"));
      expect(tieBreakValue(allA, "alef")).not.toBe(tieBreakValue(other, "alef"));
      expect(tieBreakValue(allA, "alef")).not.toBe(tieBreakValue(reordered, "alef"));
    });

    it("ignores answers to issues that aren't ranked", () => {
      const withExtra = { ranked: allA.ranked, answers: { ...allA.answers, i6: "d" } };
      expect(scoreMatch(tiedData, withExtra, TIED)).toEqual(scoreMatch(tiedData, allA, TIED));
    });
  });

  describe("rejected input", () => {
    const data = dataFor({ p: "a" });
    const details = (i: MatchInput): string[] => {
      try {
        scoreMatch(data, i, ["p"]);
      } catch (e) {
        expect(e).toBeInstanceOf(MatchInputError);
        return (e as MatchInputError).details;
      }
      throw new Error("expected the input to be rejected");
    };

    it("rejects an unknown issue id", () => {
      expect(details(input({ ...allA.answers, nothing: "a" }))).toEqual([
        'unknown issue id "nothing"',
      ]);
    });

    it("rejects an unknown option id", () => {
      expect(details(input({ ...allA.answers, i1: "z" }))).toEqual([
        'unknown option "z" for issue "i1"',
      ]);
    });

    it("rejects an option that belongs to another issue", () => {
      const base = dataFor({ p: "a" });
      const other = { issueId: "i2", pairs: [{ a: "x", b: "y", closeness: 0.5, reason: "test" }] };
      const mixed = { ...base, distances: base.distances.map((d, i) => (i === 1 ? other : d)) };
      expect(() => scoreMatch(mixed, input({ ...allA.answers, i1: "x" }), ["p"])).toThrow(
        MatchInputError,
      );
    });

    it("rejects a ranked issue without an answer", () => {
      const { i3: _dropped, ...answers } = allA.answers;
      expect(details({ ranked: allA.ranked, answers })).toEqual([
        'missing answer for ranked issue "i3"',
      ]);
    });

    it("doesn't take an inherited property for an answer", () => {
      const i = { ranked: ["toString", ...allA.ranked], answers: allA.answers };
      expect(details(i)).toEqual(['unknown issue id "toString"']);
    });

    it("rejects an issue ranked twice", () => {
      expect(details({ ranked: [...allA.ranked, "i1"], answers: allA.answers })).toEqual([
        "ranked issues must be unique",
      ]);
    });

    it("rejects an empty ranking", () => {
      expect(details({ ranked: [], answers: {} })).toEqual(["no ranked issues"]);
    });

    it("reports every problem at once", () => {
      expect(details(input({ ...allA.answers, i1: "z", nothing: "a" }))).toHaveLength(2);
    });
  });

  describe("gaps in the content", () => {
    it("throws when a party has no row for a ranked issue", () => {
      const data = dataFor({ p: "a", q: "b" });
      data.positions[2].rows = data.positions[2].rows.filter((r) => r.partyId !== "q");
      expect(() => scoreMatch(data, allA, ["p", "q"])).toThrow(MatchDataError);
      expect(() => scoreMatch(data, allA, ["p", "q"])).toThrow(/"q".*"i3"/);
      // A party that isn't asked for doesn't matter.
      expect(() => scoreMatch(data, allA, ["p"])).not.toThrow();
    });

    it("throws when a grid lacks a pair the score needs", () => {
      const data = dataFor({ p: "c" });
      data.distances[0].pairs = data.distances[0].pairs.filter(
        (p) => !(p.a === "a" && p.b === "c"),
      );
      expect(() => scoreMatch(data, allA, ["p"])).toThrow(/issue "i1".*"c"\/"a"/);
    });
  });
});

describe("the module", () => {
  it("has no Node-only or server-only imports, in itself or what it loads", () => {
    const files = ["lib/matching/score.ts", "lib/content/schemas.ts", "lib/survey/shuffle.ts"];
    for (const file of files) {
      const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");
      const imports = [...source.matchAll(/^import\s[^;]*?from\s+"([^"]+)"|^import\s+"([^"]+)"/gm)]
        .map((m) => m[1] ?? m[2])
        .sort();
      expect(
        imports.filter((i) => i.startsWith("node:") || i === "server-only"),
        file,
      ).toEqual([]);
      expect(source, file).not.toMatch(/\bprocess\.|\brequire\(/);
    }
  });

  it("works with the constants as the content files hold them", () => {
    for (const rel of [
      "content/matching/config.json",
      "content/placeholder/matching/config.json",
    ]) {
      // The values are content, tuned per corpus; only the shape and order are fixed.
      const config = matchingConfigSchema.parse(
        JSON.parse(fs.readFileSync(path.join(process.cwd(), rel), "utf8")),
      );
      expect(agreementLabel(config.levels.main, config), rel).toBe("agrees");
      expect(agreementLabel(0, config), rel).toBe("disagrees");
    }
  });
});
