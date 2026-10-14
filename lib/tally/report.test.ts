import { describe, expect, it } from "vitest";
import { buildTallyReport, formatTallyReport } from "./report";

const byDay = {
  "2026-10-25": { started: 10, results: 6, "1st:a": 3, "1st:b": 3, "2nd:a": 2, "2nd:c": 4 },
  "2026-10-24": { started: 4, results: 2, "1st:c": 2, "3rd:a": 1, "4th:b": 2 },
};

describe("tally report", () => {
  it("adds up every day and keeps days in order", () => {
    const r = buildTallyReport(byDay, ["a", "b", "c", "d"]);
    expect(r.days.map((d) => d.day)).toEqual(["2026-10-24", "2026-10-25"]);
    expect([r.started, r.results]).toEqual([14, 8]);
  });

  it("ranks by 1st places, then 2nd, 3rd and 4th, and lists every party", () => {
    const r = buildTallyReport(byDay, ["a", "b", "c", "d"]);
    // a and b both came 1st three times; a has more 2nd places.
    expect(r.parties.map((p) => p.partyId)).toEqual(["a", "b", "c", "d"]);
    expect(r.parties[0].places).toEqual({ "1st": 3, "2nd": 2, "3rd": 1, "4th": 0 });
    expect(r.parties[0].inTopFour).toBe(6);
    expect(r.parties[0].firstShare).toBeCloseTo(3 / 8);
    expect(r.parties[3]).toMatchObject({ partyId: "d", inTopFour: 0, firstShare: 0 });
  });

  it("keeps counts for a party that is no longer in the list", () => {
    const r = buildTallyReport({ "2026-10-25": { results: 1, "1st:gone": 1 } }, ["a"]);
    expect(r.parties.map((p) => p.partyId)).toEqual(["gone", "a"]);
  });

  it("prints a table, and says so when there is nothing yet", () => {
    expect(formatTallyReport(buildTallyReport({}, ["a"]), (id) => id)).toBe(
      "No counts recorded yet.",
    );
    const text = formatTallyReport(buildTallyReport(byDay, ["a", "b"]), (id) => id.toUpperCase(), {
      showDays: true,
    });
    expect(text).toContain("Surveys started: 14   Results shown: 8");
    expect(text).toMatch(/1\s+A\s+3\s+2\s+1\s+0\s+6\s+37\.5%/);
    expect(text).toContain("2026-10-24        4        2");
  });
});
