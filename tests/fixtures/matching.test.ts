/**
 * Keeps the placeholder answer sets honest: each must produce its result case
 * when the real scoring runs on the placeholder corpus on disk.
 */
import { describe, expect, it } from "vitest";
import { isBelowThreshold } from "@/lib/content/polls";
import { readRawContent } from "@/lib/content/read-raw";
import { parseCorpus } from "@/lib/content/validate";
import { scoreMatch } from "@/lib/matching/score";
import { PLACEHOLDER_CASES, placeholderAnswerSet } from "./matching";

const corpus = parseCorpus(readRawContent(undefined, "placeholder"), "placeholder")!;
const researched = corpus.parties.filter((p) => p.tier === "researched");
const party = (id: string) => corpus.parties.find((p) => p.id === id)!;
const listOf = (id: string) => corpus.lists.find((l) => l.id === party(id).listId)!;

function result(id: (typeof PLACEHOLDER_CASES)[number]) {
  const set = placeholderAnswerSet(id);
  return scoreMatch(
    {
      positions: corpus.matching.positions,
      distances: corpus.matching.distances,
      config: corpus.matching.config!,
      texts: corpus.matching.texts.en,
    },
    { ranked: set.ranked, answers: set.answers },
    researched.map((p) => p.id),
  );
}

describe("placeholder answer sets", () => {
  it.each(PLACEHOLDER_CASES)("%s produces the recorded result", (id) => {
    const set = placeholderAnswerSet(id);
    const r = result(id);
    expect(r.entries.map((e) => e.partyId)).toEqual(set.entries);
    expect(r.weakMatch).toBe(set.weakMatch);
    const unclear = r.entries.flatMap((e) =>
      e.breakdown
        .filter((b) => b.agreement === "party-position-unclear")
        .map((b) => [e.partyId, b.issueId]),
    );
    expect(unclear).toEqual(expect.arrayContaining(set.unclear));
    // Every breakdown item has its text and every entry its points.
    for (const e of r.entries) {
      expect(e.points).toHaveLength(2);
      for (const b of e.breakdown) expect(b.explanation).not.toBe("");
    }
  });

  it("covers a joint list, a list below the threshold and the limited-information party", () => {
    const top = (id: (typeof PLACEHOLDER_CASES)[number]) => placeholderAnswerSet(id).entries[0];
    expect(listOf(top("joint-list-top")).memberPartyIds.length).toBeGreaterThan(1);
    const poll = listOf(top("below-threshold-top")).poll;
    expect(poll.status === "polled" && isBelowThreshold(poll.percent)).toBe(true);
    expect(party(top("limited-information-top")).limitedInfo).toBe(true);
    expect(placeholderAnswerSet("unclear-position").unclear[0][0]).toBe(top("unclear-position"));
  });
});
