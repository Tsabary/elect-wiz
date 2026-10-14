import { describe, expect, it } from "vitest";
import { researchedPartyIds } from "@/lib/content/party-view";
import { partiesFileSchema } from "@/lib/content/schemas";
import placeholderParties from "@/content/placeholder/registry/parties.json";
import { hasRtl, visualRtl } from "./bidi";
import { checkShareRoute, MAX_SHARED_PARTIES, parseSharedParties, sharePath } from "./params";

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

describe("share route check (before rendering)", () => {
  const check = (path: string) => checkShareRoute(path, KNOWN, ["he", "en"]);

  it("lets the canonical address of a valid set, and its preview image, through", () => {
    expect(check("/he/share/blue-horizon,lighthouse")).toEqual({ kind: "canonical" });
    expect(check("/en/share/lighthouse")).toEqual({ kind: "canonical" });
    // The image in the form Next writes into the page's metadata: commas encoded.
    expect(check("/en/share/lighthouse%2Colive-branch/opengraph-image")).toEqual({
      kind: "canonical",
    });
  });

  it("redirects any other spelling of a valid set to the canonical one", () => {
    const cases: [string, string][] = [
      ["/en/share/lighthouse,nope", "/en/share/lighthouse"],
      ["/en/share/nope,lighthouse,lighthouse,%3Cscript%3E", "/en/share/lighthouse"],
      ["/he/share/lighthouse%2Cblue-horizon", "/he/share/lighthouse,blue-horizon"],
      ["/he/share/lighthouse,blue-horizon,", "/he/share/lighthouse,blue-horizon"],
      ["/he/share/lighthouse,%20blue-horizon", "/he/share/lighthouse,blue-horizon"],
      ["/he/share/lighthouse/", "/he/share/lighthouse"],
      [`/en/share/${KNOWN.join(",")}`, `/en/share/${KNOWN.slice(0, MAX_SHARED_PARTIES).join(",")}`],
      ["/en/share/x,lighthouse/opengraph-image", "/en/share/lighthouse/opengraph-image"],
      [
        "/en/share/lighthouse,olive-branch/opengraph-image",
        "/en/share/lighthouse%2Colive-branch/opengraph-image",
      ],
    ];
    for (const [from, to] of cases)
      expect(check(from), from).toEqual({ kind: "redirect", path: to });
  });

  it("is a 404 when no valid party is left", () => {
    for (const path of [
      "/en/share/garbage",
      "/he/share/%E0%A4%A",
      "/he/share/,,",
      "/en/share/x/opengraph-image",
    ]) {
      expect(check(path), path).toEqual({ kind: "not-found", locale: path.split("/")[1] });
    }
  });

  it("leaves every other path alone", () => {
    for (const path of [
      "/en",
      "/en/share",
      "/fr/share/lighthouse",
      "/en/parties/lighthouse",
      "/en/share/lighthouse/other",
    ]) {
      expect(check(path), path).toEqual({ kind: "pass" });
    }
  });
});

describe("share links and party tiers", () => {
  const parties = partiesFileSchema.parse(placeholderParties).parties;
  const shareable = researchedPartyIds(parties);

  it("ignore a listed party's ID", () => {
    expect(parties.find((p) => p.id === "quiet-harbor")?.tier).toBe("listed");
    expect(parseSharedParties("quiet-harbor", shareable)).toEqual([]);
    expect(parseSharedParties("quiet-harbor,lighthouse,blue-horizon", shareable)).toEqual([
      "lighthouse",
      "blue-horizon",
    ]);
  });

  it("keep every researched party's ID", () => {
    for (const id of shareable) expect(parseSharedParties(id, shareable)).toEqual([id]);
    expect(shareable).toHaveLength(parties.length - 1);
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
