import { describe, expect, it } from "vitest";
import { corpusView } from "@/tests/fixtures/matching";
import {
  listedPartyView,
  partyMetadata,
  partySummaries,
  researchedPartyIds,
  researchedPartyMetadata,
  sortByName,
} from "./party-view";
import { partiesFileSchema } from "./schemas";

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

describe("tier-aware party views", () => {
  const { parties: researched, lists: baseLists } = corpusView();
  const lists = baseLists.map((l) =>
    l.id === "small"
      ? {
          ...l,
          topCandidates: [
            { he: "ראשונה", en: "First" },
            { he: "שני", en: "Second" },
          ],
        }
      : l,
  );
  /** `small` and `right-half` become listed parties; `small` optionally with a platform link. */
  const withListed = (platform?: { url: string; checkedOn: string }) =>
    partiesFileSchema.parse({
      parties: researched.map((p) =>
        p.id === "small" || p.id === "right-half"
          ? {
              ...p,
              tier: "listed",
              researchedAsOf: null,
              // Meaningless on a listed party; the views must not show it.
              limitedInfo: true,
              ...(p.id === "small" && platform ? { platform } : {}),
            }
          : p,
      ),
    }).parties;
  const view = (id: string, parties = withListed(), locale: "he" | "en" = "en") =>
    listedPartyView(parties.find((p) => p.id === id)!, parties, lists, locale);

  it("give every entry its tier and keep both tiers in one alphabetical list", () => {
    const summaries = partySummaries(withListed(), lists, "en");
    expect(Object.fromEntries(summaries.map((s) => [s.id, s.tier]))).toEqual({
      big: "researched",
      "left-half": "researched",
      "right-half": "listed",
      small: "listed",
      unpolled: "researched",
    });
    expect(summaries.map((s) => s.name)).toEqual([...summaries.map((s) => s.name)].sort());
  });

  it("never flag a listed party as limited information", () => {
    const summaries = partySummaries(withListed(), lists, "en");
    expect(summaries.find((s) => s.id === "small")!.limitedInfo).toBe(false);
    expect(summaries.find((s) => s.id === "unpolled")!.limitedInfo).toBe(true);
  });

  it("show a listed party's registry facts: name, list, letters, leader and top candidates", () => {
    expect(view("small")).toEqual({
      id: "small",
      name: "small-en",
      leader: "L",
      tier: "listed",
      limitedInfo: false,
      list: { id: "small", name: "Small", ballotLetters: "טז", isJoint: false },
      partners: [],
      topCandidates: ["First", "Second"],
      platformUrl: null,
    });
    expect(view("small", withListed(), "he")).toMatchObject({
      name: "small-he",
      list: { name: "קטנה" },
      topCandidates: ["ראשונה", "שני"],
    });
  });

  it("keep the joint-list label for a listed party", () => {
    const right = view("right-half");
    expect(right.list).toMatchObject({ name: "Joint List", isJoint: true });
    expect(right.partners).toEqual([{ id: "left-half", name: "left-half-en" }]);
  });

  it("carry the platform link when one exists, and none otherwise", () => {
    const platform = { url: "https://example.org/small/platform", checkedOn: "2026-10-13" };
    expect(view("small", withListed(platform)).platformUrl).toBe(platform.url);
    expect(view("small").platformUrl).toBeNull();
    expect(view("right-half", withListed(platform)).platformUrl).toBeNull();
  });

  it("hold no poll information", () => {
    expect(JSON.stringify(view("small"))).not.toMatch(/poll|percent|2\.1/);
  });

  it("name the researched parties only", () => {
    expect(researchedPartyIds(withListed())).toEqual(["big", "left-half", "unpolled"]);
    expect(researchedPartyIds(researched)).toHaveLength(researched.length);
  });
});

describe("party metadata for results", () => {
  const { parties, lists } = corpusView();
  const meta = (id: string, locale: "he" | "en" = "en", blackout = false) =>
    partyMetadata(parties.find((p) => p.id === id)!, parties, lists, locale, blackout)!;

  it("gives the name, list and ballot letters in the requested language", () => {
    expect(meta("big")).toEqual({
      name: "big-en",
      listId: "big",
      listName: "Big",
      ballotLetters: "זץ",
      isJointList: false,
      partners: [],
      limitedInfo: false,
      pollNote: null,
    });
    expect(meta("big", "he")).toMatchObject({ name: "big-he", listName: "גדולה" });
  });

  it("labels a joint list with its partners", () => {
    const left = meta("left-half");
    expect(left.isJointList).toBe(true);
    expect(left.listName).toBe("Joint List");
    expect(left.ballotLetters).toBe("קט");
    expect(left.partners).toEqual([{ id: "right-half", name: "right-half-en" }]);
  });

  it("carries the below-threshold and not-polled notes and the limited-information flag", () => {
    expect(meta("small").pollNote).toMatchObject({
      kind: "below-threshold",
      percent: 2.1,
      asOf: "2026-10-01",
    });
    expect(meta("unpolled").pollNote).toEqual({ kind: "not-polled", asOf: "2026-10-01" });
    expect(meta("unpolled").limitedInfo).toBe(true);
  });

  it("drops every poll note during the blackout but keeps the other facts", () => {
    for (const id of ["small", "unpolled"]) {
      expect(meta(id, "en", true)).toEqual({ ...meta(id), pollNote: null });
    }
  });

  it("returns null for a party whose list is missing", () => {
    const orphan = { ...parties[0], listId: "nope" };
    expect(partyMetadata(orphan, parties, lists, "en", false)).toBeNull();
  });

  it("covers researched parties only", () => {
    const withListed = parties.map((p) =>
      p.id === "small"
        ? { ...p, tier: "listed" as const, researchedAsOf: null, limitedInfo: false }
        : p,
    );
    const all = researchedPartyMetadata(withListed, lists, "en", false);
    expect(Object.keys(all).sort()).toEqual(["big", "left-half", "right-half", "unpolled"]);
    expect(all.big).toEqual(meta("big"));
  });
});
