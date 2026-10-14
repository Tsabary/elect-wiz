import { describe, expect, it } from "vitest";
import { readRawContent } from "@/lib/content/read-raw";
import { parseCorpus } from "@/lib/content/validate";
import { researchedPartyMetadata } from "@/lib/content/party-view";
import { MIN_RANKED, TOP_ENTRIES } from "@/lib/matching/contract";
import { buildMatchingBundle, matchLocally } from "@/lib/matching/data";
import { PLACEHOLDER_CASES, placeholderAnswerSet } from "@/tests/fixtures/matching";
import versions from "@/content/versions.json";
import {
  answersFromHash,
  answersHash,
  contentTag,
  decodeAnswers,
  encodeAnswers,
  sharedTopParties,
  type AnswersContent,
} from "./answers";

const corpus = parseCorpus(readRawContent(undefined, "placeholder"), "placeholder")!;
const CONTENT: AnswersContent = {
  surveyContentVersion: versions.surveyContentVersion,
  issues: corpus.issues,
};
const sortedIssues = [...corpus.issues].sort((a, b) => (a.id < b.id ? -1 : 1));
const optionsOf = (issueId: string) =>
  corpus.issues
    .find((i) => i.id === issueId)!
    .options.map((o) => o.id)
    .sort();

/** A valid ranking of the first `n` issues (sorted), each answered with its first option. */
function input(n = MIN_RANKED) {
  const ranked = sortedIssues.slice(0, n).map((i) => i.id);
  return { ranked, answers: Object.fromEntries(ranked.map((id) => [id, optionsOf(id)[0]])) };
}

const tag = contentTag(CONTENT);
const reasonOf = (value: string) => {
  const res = decodeAnswers(value, CONTENT);
  return res.ok ? "ok" : res.reason;
};

describe("answers in a share link", () => {
  it("round-trip every placeholder answer set, in rank order", () => {
    for (const id of PLACEHOLDER_CASES) {
      const set = placeholderAnswerSet(id);
      const value = encodeAnswers(set, CONTENT)!;
      expect(value, id).toMatch(/^1-[0-9a-z]{4}-(?:[0-9a-z][a-z]){5,10}$/);
      const decoded = decodeAnswers(value, CONTENT);
      expect(decoded.ok, id).toBe(true);
      if (!decoded.ok) continue;
      expect(decoded.input.ranked).toEqual(set.ranked);
      for (const issueId of set.ranked)
        expect(decoded.input.answers[issueId]).toBe(set.answers[issueId]);
      // Only ranked issues travel.
      expect(Object.keys(decoded.input.answers).sort()).toEqual([...set.ranked].sort());
    }
  });

  it("round-trip every option of every issue, and the longest ranking", () => {
    for (const issue of sortedIssues) {
      for (const option of optionsOf(issue.id)) {
        const base = input(sortedIssues.length);
        const value = encodeAnswers(
          { ...base, answers: { ...base.answers, [issue.id]: option } },
          CONTENT,
        )!;
        const decoded = decodeAnswers(value, CONTENT);
        expect(decoded.ok && decoded.input.answers[issue.id]).toBe(option);
      }
    }
  });

  it("refer to options by sorted ID, so it doesn't depend on the order given", () => {
    const shuffled: AnswersContent = {
      ...CONTENT,
      issues: [...CONTENT.issues]
        .reverse()
        .map((i) => ({ ...i, options: [...i.options].reverse() })),
    };
    expect(encodeAnswers(input(), shuffled)).toBe(encodeAnswers(input(), CONTENT));
    expect(contentTag(shuffled)).toBe(tag);
  });

  it("are short", () => {
    expect(encodeAnswers(input(10), CONTENT)!.length).toBeLessThanOrEqual(27);
    expect(encodeAnswers(input(), CONTENT)).toBe(`1-${tag}-0a1a2a3a4a`);
  });

  it("can't be written for input the content doesn't fit", () => {
    const ok = input();
    expect(encodeAnswers(ok, CONTENT)).not.toBeNull();
    expect(encodeAnswers(input(MIN_RANKED - 1), CONTENT)).toBeNull();
    expect(encodeAnswers({ ...ok, ranked: [...ok.ranked, ok.ranked[0]] }, CONTENT)).toBeNull();
    expect(encodeAnswers({ ...ok, ranked: [...ok.ranked.slice(1), "nope"] }, CONTENT)).toBeNull();
    expect(
      encodeAnswers({ ...ok, answers: { ...ok.answers, [ok.ranked[0]]: "nope" } }, CONTENT),
    ).toBeNull();
    const { [ok.ranked[0]]: _, ...missing } = ok.answers;
    expect(encodeAnswers({ ...ok, answers: missing }, CONTENT)).toBeNull();
  });

  it("change the tag with the survey content version and with any issue or option ID", () => {
    expect(contentTag({ ...CONTENT, surveyContentVersion: "2099-01-01.1" })).not.toBe(tag);
    const renamed = CONTENT.issues.map((i, k) =>
      k === 0 ? { ...i, options: [...i.options.slice(1), { id: "renamed" }] } : i,
    );
    expect(contentTag({ ...CONTENT, issues: renamed })).not.toBe(tag);
    expect(contentTag({ ...CONTENT, issues: CONTENT.issues.slice(1) })).not.toBe(tag);
  });
});

describe("reading answers from a link refuses", () => {
  it("anything not in the format", () => {
    for (const value of [
      "",
      "1",
      `1-${tag}-`,
      `1-${tag}-0a1a2a3a4`, // half a pair
      `2-${tag}-0a1a2a3a4a`, // unknown format version
      `1-${tag.toUpperCase()}-0A1A2A3A4A`,
      `1-${tag}x-0a1a2a3a4a`,
      `1-${tag}-0a1a2a3a4a-`,
      ` 1-${tag}-0a1a2a3a4a`,
      `1-${tag}-0a1a2a3a4a5`,
      `1-${tag}-0a1a2a3a44`,
      `1_${tag}_0a1a2a3a4a`,
      `1-${tag}-0%611a2a3a4a`,
      `1-${tag}-${"0a".repeat(100)}`,
      "<script>",
    ])
      expect(reasonOf(value), value).toBe("malformed");
  });

  it("a link made for other survey content", () => {
    const other = tag === "0000" ? "0001" : "0000";
    expect(reasonOf(`1-${other}-0a1a2a3a4a`)).toBe("version");
    const old = encodeAnswers(input(), { ...CONTENT, surveyContentVersion: "2026-01-01.1" })!;
    expect(reasonOf(old)).toBe("version");
  });

  it("an unknown issue or option", () => {
    expect(reasonOf(`1-${tag}-0a1a2a3a4aza`)).toBe("unknown-issue");
    expect(reasonOf(`1-${tag}-0a1a2a3a${sortedIssues.length.toString(36)}a`)).toBe("unknown-issue");
    const options = optionsOf(sortedIssues[0].id).length;
    expect(reasonOf(`1-${tag}-0${"abcdefghijklmnopqrstuvwxyz"[options]}1a2a3a4a`)).toBe(
      "unknown-option",
    );
    expect(reasonOf(`1-${tag}-0z1a2a3a4a`)).toBe("unknown-option");
  });

  it("a repeated issue, even with another option", () => {
    expect(reasonOf(`1-${tag}-0a1a2a3a4a0a`)).toBe("duplicate-issue");
    expect(reasonOf(`1-${tag}-0a1a2a3a4a0b`)).toBe("duplicate-issue");
  });

  it("fewer ranked issues than the survey's minimum", () => {
    expect(reasonOf(`1-${tag}-0a1a2a3a`)).toBe("too-few");
    expect(reasonOf(`1-${tag}-0a`)).toBe("too-few");
  });
});

describe("the answers fragment", () => {
  it("is read back from a location hash", () => {
    expect(answersFromHash(answersHash("1-abcd-0a1a2a3a4a"))).toBe("1-abcd-0a1a2a3a4a");
    expect(answersFromHash("a=x&b=y")).toBe("x");
    expect(answersFromHash("")).toBeNull();
    expect(answersFromHash("#b=1")).toBeNull();
  });
});

describe("the result worked out from shared answers", () => {
  const researched = corpus.parties.filter((p) => p.tier === "researched").map((p) => p.id);
  const bundle = buildMatchingBundle({
    locale: "en",
    versions: { matchingVersion: "m1", surveyContentVersion: "s1" },
    partyIds: researched,
    positions: corpus.matching.positions,
    distances: corpus.matching.distances,
    config: corpus.matching.config!,
    texts: [...corpus.matching.texts.en, ...corpus.matching.texts.he],
  });
  const metadata = researchedPartyMetadata(corpus.parties, corpus.lists, "en", false);

  it("is the survey's own top, for every placeholder answer set", () => {
    for (const id of PLACEHOLDER_CASES) {
      const set = placeholderAnswerSet(id);
      const decoded = decodeAnswers(encodeAnswers(set, CONTENT)!, CONTENT);
      if (!decoded.ok) throw new Error(id);
      const local = matchLocally(bundle, set, metadata);
      if (!local.ok) throw new Error(id);
      const top = local.result.entries.slice(0, TOP_ENTRIES).map((e) => e.partyId);
      expect(sharedTopParties(bundle, decoded.input, researched), id).toEqual(top);
      expect(top, id).toEqual(set.entries.slice(0, TOP_ENTRIES));
    }
  });

  it("is null for answers the bundle doesn't know, or with no party to name", () => {
    const bad = { ranked: ["nope", ...input().ranked], answers: { nope: "x", ...input().answers } };
    expect(sharedTopParties(bundle, bad, researched)).toBeNull();
    expect(sharedTopParties(bundle, input(), [])).toBeNull();
  });
});
