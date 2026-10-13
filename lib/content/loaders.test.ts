/**
 * The "Hebrew content pending" fallback in the server loaders. Each case builds
 * a small content root from the placeholder corpus's files, laid out as the
 * real corpus, so nothing here depends on the state of `content/versions.json`.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CorpusName } from "./config";

const PLACEHOLDER = path.join(process.cwd(), "content/placeholder");
/** Researched placeholder parties: one loses its Hebrew content, one keeps it. */
const [MISSING, KEPT] = fs
  .readdirSync(path.join(PLACEHOLDER, "matching/texts/he"))
  .map((f) => f.replace(/\.json$/, ""))
  .sort();

const roots: string[] = [];

/** Loads the loaders against a temporary content root in the given state. */
async function loaders(corpus: CorpusName, hebrewContent: "pending" | "ready" | undefined) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "elect-loaders-"));
  roots.push(root);
  const base = path.join(root, "content", corpus === "real" ? "" : "placeholder");
  fs.cpSync(PLACEHOLDER, base, { recursive: true });
  fs.rmSync(path.join(base, `research/he/${MISSING}.md`));
  fs.rmSync(path.join(base, `matching/texts/he/${MISSING}.json`));
  fs.writeFileSync(
    path.join(root, "content/versions.json"),
    JSON.stringify({
      surveyContentVersion: "s1",
      researchVersion: "r1",
      matchingVersion: "m1",
      ...(hebrewContent ? { hebrewContent } : {}),
    }),
  );
  vi.resetModules();
  vi.spyOn(process, "cwd").mockReturnValue(root);
  vi.stubEnv("CONTENT_CORPUS", corpus);
  return import("./loaders");
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe("Hebrew content pending (real corpus)", () => {
  it("shows the English research document where the Hebrew one is missing", async () => {
    const { getResearchDocForLocale, getResearchDoc } = await loaders("real", "pending");
    expect(getResearchDoc(MISSING, "he")).toBeNull();
    const fallback = getResearchDocForLocale(MISSING, "he");
    expect(fallback?.lang).toBe("en");
    expect(fallback).toEqual(getResearchDoc(MISSING, "en"));
    // A party that has its Hebrew document keeps it; English never falls back.
    expect(getResearchDocForLocale(KEPT, "he")?.lang).toBe("he");
    expect(getResearchDocForLocale(MISSING, "en")?.lang).toBe("en");
  });

  it("puts the English texts of a party without Hebrew ones in the Hebrew bundle", async () => {
    const { getMatchingBundle } = await loaders("real", "pending");
    const he = getMatchingBundle("he");
    const en = getMatchingBundle("en");
    expect(he.locale).toBe("he");
    expect(he.texts.map((t) => t.partyId)).toEqual(en.texts.map((t) => t.partyId));
    expect(he.texts.find((t) => t.partyId === MISSING)).toEqual(
      en.texts.find((t) => t.partyId === MISSING),
    );
    expect(he.texts.filter((t) => t.lang === "en").map((t) => t.partyId)).toEqual([MISSING]);
    expect(en.texts.every((t) => t.lang === "en")).toBe(true);
  });
});

describe.each([
  ["real", "ready"],
  ["real", undefined],
  // The switch never affects the placeholder corpus.
  ["placeholder", "pending"],
] as const)("no fallback (%s corpus, hebrewContent: %s)", (corpus, hebrewContent) => {
  it("has no research document and no texts for the party in Hebrew", async () => {
    const { getResearchDocForLocale, getMatchingBundle } = await loaders(corpus, hebrewContent);
    expect(getResearchDocForLocale(MISSING, "he")).toBeNull();
    expect(getResearchDocForLocale(KEPT, "he")?.lang).toBe("he");
    const he = getMatchingBundle("he");
    expect(he.texts.every((t) => t.lang === "he")).toBe(true);
    expect(he.texts.map((t) => t.partyId)).not.toContain(MISSING);
    expect(he.texts.map((t) => t.partyId)).toContain(KEPT);
  });
});
