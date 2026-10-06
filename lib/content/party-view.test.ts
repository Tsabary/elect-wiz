import { describe, expect, it } from "vitest";
import { corpusView } from "@/tests/fixtures/matching";
import { partySummaries, sortByName } from "./party-view";

describe("party views", () => {
  it("sorts alphabetically per locale", () => {
    const items = [{ name: "zeta" }, { name: "Alpha" }, { name: "beta" }];
    expect(sortByName(items, "en").map((i) => i.name)).toEqual(["Alpha", "beta", "zeta"]);
    const he = [{ name: "תמר" }, { name: "אבן" }, { name: "גשר" }];
    expect(sortByName(he, "he").map((i) => i.name)).toEqual(["אבן", "גשר", "תמר"]);
  });

  it("labels joint lists with their partners", () => {
    const { parties, lists } = corpusView();
    const summaries = partySummaries(parties, lists, "en");
    const left = summaries.find((s) => s.id === "left-half")!;
    expect(left.list.isJoint).toBe(true);
    expect(left.partners.map((p) => p.id)).toEqual(["right-half"]);
    const big = summaries.find((s) => s.id === "big")!;
    expect(big.list.isJoint).toBe(false);
    expect(big.partners).toEqual([]);
    expect(summaries.map((s) => s.name)).toEqual([...summaries.map((s) => s.name)].sort());
  });
});
