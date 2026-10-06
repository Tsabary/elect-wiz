import { describe, expect, it } from "vitest";
import { hasRtl, visualRtl } from "./bidi";
import { MAX_SHARED_PARTIES, parseSharedParties, sharePath } from "./params";

const KNOWN = ["blue-horizon", "lighthouse", "cedar-tradition", "olive-branch", "green-valley"];

describe("share URLs", () => {
  it("encode only party IDs and the locale", () => {
    expect(sharePath("he", ["blue-horizon", "lighthouse"])).toBe(
      "/he/share/blue-horizon,lighthouse",
    );
  });

  it("cap the number of parties", () => {
    expect(sharePath("en", KNOWN).split("/").pop()!.split(",")).toHaveLength(MAX_SHARED_PARTIES);
  });

  it("keep only registry IDs, in order, without duplicates", () => {
    expect(parseSharedParties("lighthouse,blue-horizon", KNOWN)).toEqual([
      "lighthouse",
      "blue-horizon",
    ]);
    expect(parseSharedParties("lighthouse,unknown,lighthouse,<script>", KNOWN)).toEqual([
      "lighthouse",
    ]);
    expect(parseSharedParties("lighthouse%2Cblue-horizon", KNOWN)).toEqual([
      "lighthouse",
      "blue-horizon",
    ]);
  });

  it("ignore malformed or oversized input", () => {
    expect(parseSharedParties("%E0%A4%A", KNOWN)).toEqual([]);
    expect(parseSharedParties("", KNOWN)).toEqual([]);
    expect(parseSharedParties(undefined, KNOWN)).toEqual([]);
    expect(parseSharedParties("a".repeat(2000), KNOWN)).toEqual([]);
    expect(parseSharedParties(KNOWN.join(","), KNOWN)).toHaveLength(MAX_SHARED_PARTIES);
  });
});

describe("visualRtl", () => {
  it("leaves LTR text alone", () => {
    expect(visualRtl("Blue Horizon (fictional)")).toBe("Blue Horizon (fictional)");
    expect(hasRtl("Blue")).toBe(false);
  });

  it("reverses Hebrew and mirrors brackets", () => {
    expect(visualRtl("שלום עולם")).toBe("םלוע םולש");
    expect(visualRtl("האופק (בדיונית)")).toBe("(תינוידב) קפואה");
  });

  it("keeps embedded Latin words and numbers readable", () => {
    expect(visualRtl("רשימה ABC 12 כאן")).toBe("ןאכ ABC 12 המישר");
    expect(visualRtl("3.25% סף")).toBe("ףס 3.25%");
  });
});
