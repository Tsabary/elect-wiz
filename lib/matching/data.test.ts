import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { getMatchingBundle } from "@/lib/content/loaders";
import { findPollFigures } from "@/lib/content/poll-figures";
import { readRawContent } from "@/lib/content/read-raw";
import { parseCorpus } from "@/lib/content/validate";
import { partyMetadata, researchedPartyMetadata } from "@/lib/content/party-view";
import { PLACEHOLDER_CASES, placeholderAnswerSet } from "@/tests/fixtures/matching";
import {
  buildMatchingBundle,
  loadMatchingBundle,
  matchingBundleSchema,
  matchingBundleUrl,
  matchLocally,
  type MatchingBundle,
} from "./data";
import { scoreMatch } from "./score";

const corpus = parseCorpus(readRawContent(undefined, "placeholder"), "placeholder")!;
const researched = corpus.parties.filter((p) => p.tier === "researched").map((p) => p.id);
const VERSIONS = { matchingVersion: "m1", surveyContentVersion: "s1" };

function bundle(locale: "he" | "en" = "en", partyIds: readonly string[] = researched) {
  return buildMatchingBundle({
    locale,
    versions: VERSIONS,
    partyIds,
    positions: corpus.matching.positions,
    distances: corpus.matching.distances,
    config: corpus.matching.config!,
    texts: [...corpus.matching.texts.en, ...corpus.matching.texts.he],
  });
}

const parties = (blackout = false) =>
  researchedPartyMetadata(corpus.parties, corpus.lists, "en", blackout);

describe("buildMatchingBundle", () => {
  it("holds positions, grids, constants and one language's texts, stamped with both versions", () => {
    const b = bundle("he");
    expect(Object.keys(b).sort()).toEqual([
      "config",
      "distances",
      "locale",
      "matchingVersion",
      "positions",
      "surveyContentVersion",
      "texts",
    ]);
    expect(b).toMatchObject({ ...VERSIONS, locale: "he", config: corpus.matching.config });
    expect(b.positions.map((p) => p.issueId)).toEqual(corpus.issues.map((i) => i.id).sort());
    expect(b.distances.map((d) => d.issueId)).toEqual(b.positions.map((p) => p.issueId));
    expect(b.texts.map((t) => t.partyId)).toEqual([...researched].sort());
    expect(b.texts.every((t) => t.lang === "he")).toBe(true);
    expect(matchingBundleSchema.safeParse(b).success).toBe(true);
  });

  it("fills in another language's texts only for a party that has none in the bundle's", () => {
    const [first, ...others] = corpus.matching.texts.he;
    const b = buildMatchingBundle({
      locale: "he",
      versions: VERSIONS,
      partyIds: researched,
      positions: corpus.matching.positions,
      distances: corpus.matching.distances,
      config: corpus.matching.config!,
      texts: others,
      fallbackTexts: corpus.matching.texts.en,
    });
    expect(b.locale).toBe("he");
    expect(b.texts.map((t) => t.partyId)).toEqual([...researched].sort());
    expect(b.texts.filter((t) => t.lang === "en")).toEqual([
      corpus.matching.texts.en.find((t) => t.partyId === first.partyId),
    ]);
    expect(matchingBundleSchema.safeParse(b).success).toBe(true);
    // Without fallback texts the party is simply not in the bundle.
    expect(bundle("he").texts.every((t) => t.lang === "he")).toBe(true);
  });

  it("carries only what the scoring reads from a row and a grid pair", () => {
    const b = bundle();
    for (const row of b.positions.flatMap((p) => p.rows)) {
      expect(
        Object.keys(row)
          .filter((k) => k !== "ruledOut")
          .sort(),
      ).toEqual(["held", "partyId", "unclear"]);
    }
    for (const pair of b.distances.flatMap((d) => d.pairs)) {
      expect(Object.keys(pair).sort()).toEqual(["a", "b", "closeness"]);
    }
  });

  it("keeps ruled-out options, which the labels need", () => {
    const [first, ...others] = corpus.matching.positions;
    const [row, ...rows] = first.rows;
    const withRuledOut = { ...first, rows: [{ ...row, ruledOut: ["some-option"] }, ...rows] };
    const b = buildMatchingBundle({
      locale: "en",
      versions: VERSIONS,
      partyIds: researched,
      positions: [withRuledOut, ...others],
      distances: corpus.matching.distances,
      config: corpus.matching.config!,
      texts: corpus.matching.texts.en,
    });
    const built = b.positions.find((p) => p.issueId === first.issueId)!;
    expect(built.rows.find((r) => r.partyId === row.partyId)!.ruledOut).toEqual(["some-option"]);
    expect(built.rows.filter((r) => r.ruledOut)).toHaveLength(1);
  });

  it("holds no registry facts and no poll data", () => {
    const text = JSON.stringify(bundle("en")) + JSON.stringify(bundle("he"));
    for (const party of corpus.parties) {
      expect(text).not.toContain(JSON.stringify(party.leader.en));
      expect(text).not.toContain(JSON.stringify(party.leader.he));
    }
    for (const list of corpus.lists) {
      if (list.ballotLetters) expect(text).not.toContain(`"${list.ballotLetters}"`);
    }
    expect(text).not.toMatch(/"poll"|"percent"|"ballotLetters"|"listId"|"limitedInfo"|"leader"/);
    for (const b of [bundle("en"), bundle("he")]) {
      const shown = b.texts.flatMap((t) => [
        ...t.points.map((p) => p.text),
        ...Object.values(t.issues).flatMap((i) => [
          ...(i.unclear ? [i.unclear.text] : []),
          ...Object.values(i.options ?? {}).map((o) => o.text),
        ]),
      ]);
      expect(shown.flatMap((s) => findPollFigures(s))).toEqual([]);
    }
  });

  it("leaves out the rows and texts of parties that aren't researched", () => {
    const b = bundle("en", researched.slice(0, 2));
    const kept = [...researched.slice(0, 2)].sort();
    expect(b.texts.map((t) => t.partyId)).toEqual(kept);
    for (const p of b.positions) expect(p.rows.map((r) => r.partyId)).toEqual(kept);
  });

  it("doesn't depend on the order of its input", () => {
    const reversed = buildMatchingBundle({
      locale: "en",
      versions: VERSIONS,
      partyIds: [...researched].reverse(),
      positions: [...corpus.matching.positions].reverse(),
      distances: [...corpus.matching.distances].reverse(),
      config: corpus.matching.config!,
      texts: [...corpus.matching.texts.en].reverse(),
    });
    expect(reversed).toEqual(bundle("en"));
  });

  it("scores exactly like the content files it was built from", () => {
    for (const id of PLACEHOLDER_CASES) {
      const input = placeholderAnswerSet(id);
      const fromFiles = scoreMatch(
        {
          positions: corpus.matching.positions,
          distances: corpus.matching.distances,
          config: corpus.matching.config!,
          texts: corpus.matching.texts.en,
        },
        input,
        researched,
      );
      expect(scoreMatch(bundle("en"), input, researched), id).toEqual(fromFiles);
    }
  });
});

describe("getMatchingBundle (server loader)", () => {
  it.each(["he", "en"] as const)("builds the active corpus's %s bundle from disk", (locale) => {
    const versions = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "content/versions.json"), "utf8"),
    );
    const b = getMatchingBundle(locale);
    expect(matchingBundleSchema.safeParse(b).success).toBe(true);
    expect(b.locale).toBe(locale);
    expect(b.matchingVersion).toBe(versions.matchingVersion);
    expect(b.surveyContentVersion).toBe(versions.surveyContentVersion);
    // The placeholder corpus is the active one in tests.
    expect(b).toEqual(
      buildMatchingBundle({
        locale,
        versions,
        partyIds: researched,
        positions: corpus.matching.positions,
        distances: corpus.matching.distances,
        config: corpus.matching.config!,
        texts: corpus.matching.texts[locale],
      }),
    );
  });
});

describe("loadMatchingBundle", () => {
  const opts = { locale: "en" as const, ...VERSIONS };
  const respond = (body: unknown, status = 200) =>
    vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

  it("fetches the locale's bundle, with the version only as a cache-busting parameter", async () => {
    const fetchImpl = respond(bundle());
    const res = await loadMatchingBundle({ ...opts, matchingVersion: "m 1/x", fetchImpl });
    expect(res).toEqual({ ok: true, bundle: bundle() });
    expect(vi.mocked(fetchImpl).mock.calls[0][0]).toBe("/api/matching/en?v=m%201%2Fx");
    expect(matchingBundleUrl("he", "m1")).toBe("/api/matching/he?v=m1");
  });

  it("uses a newer matchingVersion than the page expected without error", async () => {
    const newer: MatchingBundle = { ...bundle(), matchingVersion: "m2" };
    const res = await loadMatchingBundle({ ...opts, fetchImpl: respond(newer) });
    expect(res.ok && res.bundle.matchingVersion).toBe("m2");
  });

  it("reports a bundle built for other survey content as a version mismatch", async () => {
    const other: MatchingBundle = { ...bundle(), surveyContentVersion: "s2" };
    expect(await loadMatchingBundle({ ...opts, fetchImpl: respond(other) })).toEqual({
      ok: false,
      code: "content_version_mismatch",
    });
  });

  it("reports a network failure, an error status and an unreadable body as a failed load", async () => {
    const failed = { ok: false, code: "bundle_load_failed" };
    const offline = vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;
    expect(await loadMatchingBundle({ ...opts, fetchImpl: offline })).toEqual(failed);
    expect(await loadMatchingBundle({ ...opts, fetchImpl: respond(bundle(), 500) })).toEqual(
      failed,
    );
    expect(await loadMatchingBundle({ ...opts, fetchImpl: respond({ hello: 1 }) })).toEqual(failed);
    const html = vi.fn(async () => new Response("<html>")) as unknown as typeof fetch;
    expect(await loadMatchingBundle({ ...opts, fetchImpl: html })).toEqual(failed);
    // The other language's bundle is not this page's bundle.
    expect(await loadMatchingBundle({ ...opts, fetchImpl: respond(bundle("he")) })).toEqual(failed);
  });

  it("gives up after the timeout", async () => {
    const hanging = vi.fn(
      (_url: unknown, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
        }),
    ) as unknown as typeof fetch;
    expect(await loadMatchingBundle({ ...opts, fetchImpl: hanging, timeoutMs: 5 })).toEqual({
      ok: false,
      code: "bundle_load_failed",
    });
  });
});

describe("matchLocally", () => {
  it("returns every researched party in score order with its registry facts", () => {
    for (const id of PLACEHOLDER_CASES) {
      const set = placeholderAnswerSet(id);
      const res = matchLocally(bundle(), set, parties());
      if (!res.ok) throw new Error(`${id}: ${res.code}`);
      expect(
        res.result.entries.map((e) => e.partyId),
        id,
      ).toEqual(set.entries);
      expect(res.result.weakMatch, id).toBe(set.weakMatch);
      expect(res.result.meta).toEqual(VERSIONS);
      for (const e of res.result.entries) {
        const party = corpus.parties.find((p) => p.id === e.partyId)!;
        expect(e.metadata).toEqual(partyMetadata(party, corpus.parties, corpus.lists, "en", false));
        expect(e.breakdown).toHaveLength(set.ranked.length);
        expect(e.points.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("marks the entries whose texts are in another language than the bundle's", () => {
    const set = placeholderAnswerSet("joint-list-top");
    const [first, ...others] = corpus.matching.texts.he;
    const mixed = buildMatchingBundle({
      locale: "he",
      versions: VERSIONS,
      partyIds: researched,
      positions: corpus.matching.positions,
      distances: corpus.matching.distances,
      config: corpus.matching.config!,
      texts: others,
      fallbackTexts: corpus.matching.texts.en,
    });
    const res = matchLocally(mixed, set, parties());
    const plain = matchLocally(bundle("he"), set, parties());
    if (!res.ok || !plain.ok) throw new Error("unexpected");
    expect(res.result.entries.map((e) => e.partyId)).toEqual(set.entries);
    for (const e of res.result.entries) {
      expect(e.textsLang).toBe(e.partyId === first.partyId ? "en" : undefined);
    }
    const english = matchLocally(bundle("en"), set, parties());
    if (!english.ok) throw new Error("unexpected");
    const pick = (r: typeof res.result) => r.entries.find((e) => e.partyId === first.partyId)!;
    expect(pick(res.result).breakdown).toEqual(pick(english.result).breakdown);
    expect(pick(res.result).points).toEqual(pick(english.result).points);
    expect(plain.result.entries.some((e) => "textsLang" in e)).toBe(false);
  });

  it("is deterministic for identical answers", () => {
    const set = placeholderAnswerSet("joint-list-top");
    expect(matchLocally(bundle(), structuredClone(set), parties())).toEqual(
      matchLocally(bundle(), set, parties()),
    );
  });

  it("shows no poll note when the facts were built during the blackout", () => {
    const set = placeholderAnswerSet("below-threshold-top");
    const open = matchLocally(bundle(), set, parties(false));
    const dark = matchLocally(bundle(), set, parties(true));
    if (!open.ok || !dark.ok) throw new Error("unexpected");
    expect(open.result.entries[0].metadata.pollNote?.kind).toBe("below-threshold");
    for (const e of dark.result.entries) expect(e.metadata.pollNote).toBeNull();
  });

  it("leaves out a party the page has no facts for", () => {
    const set = placeholderAnswerSet("joint-list-top");
    const { [set.entries[0]]: _dropped, ...rest } = parties();
    const res = matchLocally(bundle(), set, rest);
    expect(res.ok && res.result.entries.map((e) => e.partyId)).toEqual(set.entries.slice(1));
  });

  it("reports answers the bundle doesn't know as a version mismatch, and never throws", () => {
    const set = placeholderAnswerSet("joint-list-top");
    const unknownOption = { ...set, answers: { ...set.answers, [set.ranked[0]]: "nope" } };
    expect(matchLocally(bundle(), unknownOption, parties())).toEqual({
      ok: false,
      code: "content_version_mismatch",
    });
    const unknownIssue = {
      ranked: [...set.ranked, "nope"],
      answers: { ...set.answers, nope: "x" },
    };
    expect(matchLocally(bundle(), unknownIssue, parties())).toEqual({
      ok: false,
      code: "content_version_mismatch",
    });
  });

  it("reports a bundle it can't score from as a failed load", () => {
    const set = placeholderAnswerSet("joint-list-top");
    const full = bundle();
    // A party with texts but no row on a ranked issue.
    const gap: MatchingBundle = {
      ...full,
      positions: full.positions.map((p) =>
        p.issueId === set.ranked[0] ? { ...p, rows: p.rows.slice(1) } : p,
      ),
    };
    expect(matchLocally(gap, set, parties())).toEqual({ ok: false, code: "bundle_load_failed" });
    expect(matchLocally({ ...full, texts: [] }, set, parties())).toEqual({
      ok: false,
      code: "bundle_load_failed",
    });
  });
});

describe("the module", () => {
  it("has no Node-only or server-only imports, so it can run in the browser", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "lib/matching/data.ts"), "utf8");
    expect(source).not.toMatch(/from "node:|import "server-only"|\bprocess\.|\brequire\(/);
  });
});
