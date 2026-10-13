import { describe, expect, it } from "vitest";
import type {
  DistancesFile,
  HeldOption,
  MatchingConfig,
  PositionsFile,
} from "@/lib/content/schemas";
import { matchingConfigJson } from "@/tests/fixtures/content";
import { formatSelfMatchReport, runSelfMatch, selfMatchOption } from "./self-match";

const OPTIONS = ["a", "b", "c"];
const config = matchingConfigJson() as MatchingConfig;

/** A grid where neighbours are 0.5 apart and the two ends are opposites. */
const grid = (issueId: string): DistancesFile => ({
  issueId,
  pairs: [
    { a: "a", b: "b", closeness: 0.5, reason: "r" },
    { a: "b", b: "c", closeness: 0.5, reason: "r" },
    { a: "a", b: "c", closeness: 0, reason: "r" },
  ],
});

type Held = [string, HeldOption["level"]][] | null;

/** Positions for one issue: party ID → held options, or null for unclear. */
const positions = (issueId: string, rows: Record<string, Held>): PositionsFile => ({
  issueId,
  rows: Object.entries(rows).map(([partyId, held]) => ({
    partyId,
    unclear: held === null,
    held: (held ?? []).map(([optionId, level]) => ({ optionId, level })),
    anchor: `issue-${issueId}`,
    basis: "b",
  })),
});

function run(files: PositionsFile[], extra: Partial<Parameters<typeof runSelfMatch>[0]> = {}) {
  return runSelfMatch({
    issues: files.map((f) => ({ id: f.issueId, optionIds: OPTIONS })),
    positions: files,
    distances: files.map((f) => grid(f.issueId)),
    config,
    partyIds: [...new Set(files.flatMap((f) => f.rows.map((r) => r.partyId)))],
    ...extra,
  });
}

const row = (held: Held) => positions("x", { p: held }).rows[0];

describe("selfMatchOption", () => {
  it("picks main, else either, else secondary", () => {
    expect(
      selfMatchOption(
        row([
          ["a", "secondary"],
          ["b", "main"],
        ]),
      ),
    ).toEqual({ optionId: "b", level: "main" });
    expect(
      selfMatchOption(
        row([
          ["a", "secondary"],
          ["c", "either"],
          ["b", "either"],
        ]),
      ),
    ).toEqual({ optionId: "b", level: "either" });
    expect(selfMatchOption(row([["c", "secondary"]]))).toEqual({
      optionId: "c",
      level: "secondary",
    });
  });

  it("breaks a tie within a level by option ID", () => {
    expect(
      selfMatchOption(
        row([
          ["c", "secondary"],
          ["a", "secondary"],
        ]),
      )?.optionId,
    ).toBe("a");
  });

  it("has no pick for an unclear row", () => {
    expect(selfMatchOption(row(null))).toBeNull();
  });
});

describe("runSelfMatch", () => {
  it("passes when every party is on top of its own answers", () => {
    const report = run([
      positions("one", { left: [["a", "main"]], right: [["c", "main"]] }),
      positions("two", { left: [["a", "main"]], right: [["c", "main"]] }),
    ]);
    expect(report.failures).toEqual([]);
    expect(report.behind).toEqual([]);
    expect(report.notes).toEqual([]);
    expect(report.parties).toEqual([
      expect.objectContaining({ partyId: "left", score: 1, tiedWith: [] }),
      expect.objectContaining({ partyId: "right", score: 1, tiedWith: [] }),
    ]);
  });

  it("lets a tie pass: parties with identical rows", () => {
    const report = run([positions("one", { left: [["a", "main"]], twin: [["a", "main"]] })]);
    expect(report.failures).toEqual([]);
    expect(report.behind).toEqual([]);
    expect(report.parties.map((p) => p.tiedWith)).toEqual([["twin"], ["left"]]);
  });

  it("uses only the issues where the tested party has a position", () => {
    const report = run([
      positions("one", { few: [["a", "main"]], many: [["c", "main"]] }),
      positions("two", { few: null, many: [["c", "main"]] }),
    ]);
    const few = report.parties.find((p) => p.partyId === "few")!;
    expect(few.issues.map((i) => i.issueId)).toEqual(["one"]);
    expect(few.score).toBe(1);
    expect(report.failures).toEqual([]);
    expect(report.behind).toEqual([]);
  });

  it("weighs the issues equally", () => {
    const report = run([
      positions("one", { p: [["a", "main"]], q: [["a", "main"]] }),
      positions("two", { p: [["a", "main"]], q: [["b", "main"]] }),
      positions("three", { p: [["a", "main"]], q: [["c", "main"]] }),
    ]);
    // q scores 1, 0.5 and 0 on p's answers, whatever the order of the issues.
    expect(report.parties[0]).toMatchObject({ partyId: "p", score: 1 });
    expect(report.parties[1].score).toBe(1);
    expect(report.behind).toEqual([]);
  });

  it("skips a party with no known issue, with a note", () => {
    const report = run([positions("one", { silent: null, other: [["a", "main"]] })]);
    expect(report.parties.map((p) => p.partyId)).toEqual(["other"]);
    expect(report.notes).toEqual(['party "silent" skipped: no known position on any usable issue']);
    expect(report.failures).toEqual([]);
  });

  it("reports, without failing, a party behind because its own row is either", () => {
    const report = run([
      positions("one", {
        unsure: [
          ["a", "either"],
          ["b", "either"],
        ],
        firm: [["a", "main"]],
      }),
    ]);
    expect(report.failures).toEqual([]);
    expect(report.behind).toEqual([
      {
        partyId: "unsure",
        score: 0.85,
        otherPartyId: "firm",
        otherScore: 1,
        issues: [{ issueId: "one", optionId: "a", level: "either", otherScore: 1 }],
      },
    ]);
  });

  it("reports, without failing, a party behind because its own row is secondary", () => {
    const report = run([
      positions("one", { tentative: [["b", "secondary"]], firm: [["b", "main"]] }),
      positions("two", { tentative: [["a", "main"]], firm: [["a", "main"]] }),
    ]);
    expect(report.failures).toEqual([]);
    expect(report.behind).toHaveLength(1);
    expect(report.behind[0]).toMatchObject({
      partyId: "tentative",
      otherPartyId: "firm",
      issues: [{ issueId: "one", level: "secondary" }],
    });
    expect(report.behind[0].score).toBeCloseTo(0.8);
  });

  it("doesn't report a weaker own row when nobody finishes ahead", () => {
    const report = run([
      positions("one", { tentative: [["b", "secondary"]], firm: [["b", "main"]] }),
      positions("two", { tentative: [["a", "main"]], firm: [["c", "main"]] }),
    ]);
    // firm scores 1 and 0, tentative 0.6 and 1.
    expect(report.behind).toEqual([]);
    expect(report.failures).toEqual([]);
  });

  it("fails when another party scores higher on a main issue", () => {
    // Only broken data or code can do this: here a main level worth less than either.
    const broken = { ...config, levels: { main: 0.5, either: 0.85, secondary: 0.6 } };
    const report = run(
      [
        positions("one", {
          tested: [["a", "main"]],
          other: [
            ["a", "either"],
            ["b", "either"],
          ],
        }),
      ],
      { config: broken },
    );
    expect(report.failures).toEqual([
      {
        partyId: "tested",
        issueId: "one",
        optionId: "a",
        score: 0.5,
        otherPartyId: "other",
        otherScore: 0.85,
      },
    ]);
  });

  it("leaves out an issue without positions, without a grid or with an incomplete grid", () => {
    const one = positions("one", { p: [["a", "main"]], q: [["a", "main"]] });
    const two = positions("two", { p: [["a", "main"]], q: [["c", "main"]] });
    const partial = { ...grid("two"), pairs: grid("two").pairs.slice(0, 2) };
    for (const distances of [[grid("one")], [grid("one"), partial]]) {
      const report = run([one, two], { distances });
      expect(report.parties[0].issues.map((i) => i.issueId)).toEqual(["one"]);
      expect(report.notes).toHaveLength(1);
      expect(report.notes[0]).toContain('issue "two" left out');
    }
    const noPositions = run([one], {
      issues: [
        { id: "one", optionIds: OPTIONS },
        { id: "two", optionIds: OPTIONS },
      ],
    });
    expect(noPositions.notes).toEqual(['issue "two" left out: no positions and no distance grid']);
    expect(noPositions.failures).toEqual([]);
  });

  it("leaves a party without a row out of the comparison, with a note", () => {
    const report = run([
      positions("one", { p: [["a", "main"]], q: [["a", "main"]] }),
      positions("two", { p: [["a", "main"]] }),
    ]);
    expect(report.parties.find((x) => x.partyId === "p")!.tiedWith).toEqual([]);
    expect(report.notes).toEqual([expect.stringContaining('party "q" has no row')]);
  });
});

describe("formatSelfMatchReport", () => {
  it("lists failures, review items, parties and notes", () => {
    const report = run([
      positions("one", {
        unsure: [
          ["a", "either"],
          ["b", "either"],
        ],
        firm: [["a", "main"]],
        silent: null,
      }),
    ]);
    const text = formatSelfMatchReport(report, "real");
    expect(text).toContain("# Self-match report (real corpus)");
    expect(text).toContain("## Blocking failures\n\nNone.");
    expect(text).toContain("`unsure` (0.850) finishes behind `firm` (1.000)");
    expect(text).toContain("`one` (own level either, other scores 1.000)");
    expect(text).toContain("| `firm` | 1 | 1.000 |");
    expect(text).toContain('party "silent" skipped');
  });
});
