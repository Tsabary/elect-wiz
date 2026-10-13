import { describe, expect, it } from "vitest";
import type { MatchingConfig, VoterProfile } from "@/lib/content/schemas";
import { matchingConfigJson } from "@/tests/fixtures/content";
import { formatProfileReport, runProfiles } from "./profile-check";
import type { MatchingData } from "./score";

const ISSUES = ["one", "two", "three", "four", "five"];
/** Each party holds the same option on every issue. */
const PARTIES = [
  { id: "first", listId: "first", option: "a" },
  { id: "twin", listId: "joint", option: "a" },
  { id: "partner", listId: "joint", option: "a" },
  { id: "middle", listId: "middle", option: "b" },
  { id: "last", listId: "last", option: "c" },
];

const data: MatchingData = {
  config: matchingConfigJson() as MatchingConfig,
  positions: ISSUES.map((issueId) => ({
    issueId,
    rows: PARTIES.map((p) => ({
      partyId: p.id,
      unclear: false,
      held: [{ optionId: p.option, level: "main" as const }],
      anchor: `issue-${issueId}`,
      basis: "b",
    })),
  })),
  distances: ISSUES.map((issueId) => ({
    issueId,
    pairs: [
      { a: "a", b: "b", closeness: 0.5, reason: "r" },
      { a: "b", b: "c", closeness: 0.5, reason: "r" },
      { a: "a", b: "c", closeness: 0, reason: "r" },
    ],
  })),
};

const profile = (option: string, expect: VoterProfile["expect"]): VoterProfile => ({
  id: `picks-${option}`,
  description: `Picks ${option} everywhere.`,
  ranked: ISSUES,
  answers: Object.fromEntries(ISSUES.map((id) => [id, option])),
  expect,
  reason: "r",
});

const check = (profiles: VoterProfile[], d = data) =>
  runProfiles({ data: d, profiles, parties: PARTIES });

describe("runProfiles", () => {
  it("passes a profile whose expectations hold, and reports the top 4 with scores", () => {
    const { outcomes } = check([
      profile("c", { topAnyOf: ["last"], inTop4: ["middle"], notInTop4: [] }),
    ]);
    expect(outcomes[0].pass).toBe(true);
    expect(outcomes[0].problems).toEqual([]);
    expect(outcomes[0].top).toHaveLength(4);
    expect(outcomes[0].top.slice(0, 2)).toEqual([
      { partyId: "last", score: 1 },
      { partyId: "middle", score: 0.5 },
    ]);
  });

  it("fails on a wrong top party, a party missing from the top 4 and one that shouldn't be there", () => {
    const { outcomes } = check([
      profile("c", { topAnyOf: ["first"] }),
      profile("b", { topAnyOf: ["middle"], inTop4: ["first", "twin", "partner", "last"] }),
      profile("c", { topAnyOf: ["last"], notInTop4: ["middle"] }),
    ]);
    expect(outcomes.map((o) => o.pass)).toEqual([false, false, false]);
    expect(outcomes[0].problems).toEqual(['top is "last", expected one of: first']);
    expect(outcomes[1].problems).toHaveLength(1);
    expect(outcomes[2].problems).toEqual(['"middle" is in the top 4']);
  });

  it("accepts any of the listed top parties", () => {
    const { outcomes } = check([profile("a", { topAnyOf: ["first", "twin", "partner"] })]);
    expect(outcomes[0].pass).toBe(true);
  });

  it("counts the profiles where parties of one list share the top 4", () => {
    const report = check([
      profile("a", { topAnyOf: ["first", "twin", "partner"] }),
      profile("c", { topAnyOf: ["last"] }),
    ]);
    expect(report.outcomes[0].sameList).toEqual([
      { listId: "joint", partyIds: expect.arrayContaining(["twin", "partner"]) },
    ]);
    // Both tops hold 4 of the 5 parties, so both joint-list parties are in at least one of them.
    expect(report.sameListProfiles).toBeGreaterThanOrEqual(1);
    expect(report.sameListProfiles).toBe(
      report.outcomes.filter((o) => o.sameList.length > 0).length,
    );
  });

  it("works without result texts and fails a profile the content can't score", () => {
    expect(data.texts).toBeUndefined();
    const partial = { ...data, positions: data.positions.slice(1) };
    const { outcomes } = check([profile("a", { topAnyOf: ["first"] })], partial);
    expect(outcomes[0].pass).toBe(false);
    expect(outcomes[0].top).toEqual([]);
    expect(outcomes[0].problems[0]).toContain('unknown issue id "one"');
  });
});

describe("formatProfileReport", () => {
  it("prints expected and actual per profile, and the totals", () => {
    const text = formatProfileReport(
      check([
        profile("c", { topAnyOf: ["last"], inTop4: ["middle"] }),
        profile("a", { topAnyOf: ["last"] }),
      ]),
    );
    expect(text).toContain("PASS  picks-c: Picks c everywhere.");
    expect(text).toContain("expected: top one of [last]; in top 4: [middle]");
    expect(text).toContain("actual:   top last; top 4: last 1.000, middle 0.500");
    expect(text).toContain("FAIL  picks-a");
    expect(text).toContain("1 of 2 profiles pass.");
    expect(text).toMatch(/share a top 4 in \d of 2 profiles\./);
  });
});
