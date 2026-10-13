/**
 * The matching bundle (plan-deterministic-matching.md, "APIs & interfaces" §5):
 * everything the scoring needs for one language, as one JSON file. It holds
 * positions, grids, constants and that language's result texts and points. It
 * holds no poll data and no registry facts: those come from the server-rendered
 * survey page, so nothing blackout-sensitive sits in a long-cached file.
 *
 * The builder runs on the server (`getMatchingBundle` in
 * `lib/content/loaders.ts`), the loader and `matchLocally` in the browser, so
 * this module must stay free of Node-only APIs and of `server-only` imports.
 */
import { z } from "zod";
import {
  heldOptionSchema,
  idSchema,
  matchingConfigSchema,
  partyTextsSchema,
  type DistancesFile,
  type MatchingConfig,
  type PartyTexts,
  type PositionsFile,
} from "../content/schemas";
import type { MatchEntry, MatchErrorCode, MatchResponse, PartyMetadata } from "./contract";
import { MatchInputError, scoreMatch, type MatchInput } from "./score";

export type BundleLocale = "he" | "en";

// ------------------------------------------------------------------ shape

/**
 * A positions row and a grid pair as the bundle carries them: what the scoring
 * reads, without the reviewer notes (`basis`, `reason`), which are checked by
 * no rule and shown nowhere.
 */
const bundleRowSchema = z.object({
  partyId: idSchema,
  unclear: z.boolean(),
  held: z.array(heldOptionSchema),
  ruledOut: z.array(idSchema).optional(),
});
const bundlePairSchema = z.object({
  a: idSchema,
  b: idSchema,
  closeness: z.number().min(0).max(1),
});

export const matchingBundleSchema = z.object({
  /** Names this bundle for caching. A newer one than the page expected is simply used. */
  matchingVersion: z.string().min(1),
  /** The survey content the bundle was built for; must equal the survey's. */
  surveyContentVersion: z.string().min(1),
  locale: z.enum(["he", "en"]),
  /** One entry per issue, rows for the researched parties only. */
  positions: z.array(z.object({ issueId: idSchema, rows: z.array(bundleRowSchema) })),
  /** One grid per issue. */
  distances: z.array(z.object({ issueId: idSchema, pairs: z.array(bundlePairSchema) })),
  config: matchingConfigSchema,
  /**
   * One entry per researched party: the parties the bundle matches. In `locale`,
   * except for a party whose texts fell back to another language (see
   * `BundleSource.fallbackTexts`); each entry's own `lang` says which.
   */
  texts: z.array(partyTextsSchema),
});
export type MatchingBundle = z.infer<typeof matchingBundleSchema>;

// ------------------------------------------------------------------ builder

export interface BundleSource {
  locale: BundleLocale;
  versions: { matchingVersion: string; surveyContentVersion: string };
  /** The researched parties. Rows and texts of any other party are left out. */
  partyIds: readonly string[];
  positions: readonly PositionsFile[];
  distances: readonly DistancesFile[];
  config: MatchingConfig;
  /** Result texts in `locale`. */
  texts: readonly PartyTexts[];
  /**
   * Texts in another language, used only for a party that has none in `locale`
   * (the "Hebrew content pending" state). They keep their own `lang`.
   */
  fallbackTexts?: readonly PartyTexts[];
}

const byString = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** Builds one language's bundle. Pure; the output order doesn't depend on the input order. */
export function buildMatchingBundle(source: BundleSource): MatchingBundle {
  const parties = new Set(source.partyIds);
  const own = source.texts.filter((t) => t.lang === source.locale && parties.has(t.partyId));
  const covered = new Set(own.map((t) => t.partyId));
  const fallback = (source.fallbackTexts ?? []).filter(
    (t) => t.lang !== source.locale && parties.has(t.partyId) && !covered.has(t.partyId),
  );
  return {
    matchingVersion: source.versions.matchingVersion,
    surveyContentVersion: source.versions.surveyContentVersion,
    locale: source.locale,
    positions: [...source.positions]
      .sort((a, b) => byString(a.issueId, b.issueId))
      .map(({ issueId, rows }) => ({
        issueId,
        rows: rows
          .filter((r) => parties.has(r.partyId))
          .sort((a, b) => byString(a.partyId, b.partyId))
          .map(({ partyId, unclear, held, ruledOut }) => ({
            partyId,
            unclear,
            held: held.map(({ optionId, level, inPart }) =>
              inPart ? { optionId, level, inPart } : { optionId, level },
            ),
            ...(ruledOut?.length ? { ruledOut: [...ruledOut] } : {}),
          })),
      })),
    distances: [...source.distances]
      .sort((a, b) => byString(a.issueId, b.issueId))
      .map(({ issueId, pairs }) => ({
        issueId,
        pairs: pairs.map(({ a, b, closeness }) => ({ a, b, closeness })),
      })),
    config: source.config,
    texts: [...own, ...fallback].sort((a, b) => byString(a.partyId, b.partyId)),
  };
}

// ------------------------------------------------------------------ loader

/** The bundle route: `GET /api/matching/<locale>`. It always serves the current bundle. */
export const MATCHING_BUNDLE_PATH = "/api/matching";

/** The bundle's address. The version is only a cache-busting parameter; the route ignores it. */
export function matchingBundleUrl(locale: BundleLocale, matchingVersion: string): string {
  return `${MATCHING_BUNDLE_PATH}/${locale}?v=${encodeURIComponent(matchingVersion)}`;
}

/** Client-side timeout for the bundle; a timeout is shown as `bundle_load_failed`. */
export const BUNDLE_TIMEOUT_MS = 30_000;

export type BundleLoadResult =
  { ok: true; bundle: MatchingBundle } | { ok: false; code: MatchErrorCode };

export interface BundleLoadOptions {
  locale: BundleLocale;
  /** The version the page was rendered with: used for the cache-busting parameter only. */
  matchingVersion: string;
  /** The survey's content version, which the bundle's must equal. */
  surveyContentVersion: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

/**
 * Fetches and checks the bundle. A network failure, a timeout, a non-200 answer
 * or a file that isn't a bundle is `bundle_load_failed` (the user can retry). A
 * bundle built for other survey content is `content_version_mismatch` (the user
 * restarts). A `matchingVersion` other than the expected one is not an error.
 */
export async function loadMatchingBundle(opts: BundleLoadOptions): Promise<BundleLoadResult> {
  const { fetchImpl = fetch, timeoutMs = BUNDLE_TIMEOUT_MS } = opts;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(matchingBundleUrl(opts.locale, opts.matchingVersion), {
      signal: controller.signal,
    });
    if (!res.ok) return { ok: false, code: "bundle_load_failed" };
    const parsed = matchingBundleSchema.safeParse(await res.json());
    if (!parsed.success || parsed.data.locale !== opts.locale) {
      return { ok: false, code: "bundle_load_failed" };
    }
    if (parsed.data.surveyContentVersion !== opts.surveyContentVersion) {
      return { ok: false, code: "content_version_mismatch" };
    }
    return { ok: true, bundle: parsed.data };
  } catch {
    // Network failure, timeout (abort) or a body that isn't JSON.
    return { ok: false, code: "bundle_load_failed" };
  } finally {
    clearTimeout(timer);
  }
}

// ------------------------------------------------------------------ local matching

export type LocalMatchResult =
  { ok: true; result: MatchResponse } | { ok: false; code: MatchErrorCode };

/**
 * Computes a user's result in the browser: scores every party the bundle has
 * texts for and attaches the registry facts the survey page was rendered with.
 * A party without facts (it joined the bundle after the page was rendered) is
 * left out, since it couldn't be shown.
 *
 * Never throws: input the bundle doesn't know (an issue or option of other
 * survey content) is `content_version_mismatch`; a gap in the bundle's own data
 * is `bundle_load_failed`.
 */
export function matchLocally(
  bundle: MatchingBundle,
  input: MatchInput,
  parties: Readonly<Record<string, PartyMetadata>>,
): LocalMatchResult {
  try {
    const scored = scoreMatch(
      bundle,
      input,
      bundle.texts.map((t) => t.partyId).filter((id) => Object.hasOwn(parties, id)),
    );
    const fallbackLang = new Map(
      bundle.texts.filter((t) => t.lang !== bundle.locale).map((t) => [t.partyId, t.lang]),
    );
    const entries = scored.entries.map((e): MatchEntry => {
      const textsLang = fallbackLang.get(e.partyId);
      return { ...e, metadata: parties[e.partyId], ...(textsLang ? { textsLang } : {}) };
    });
    if (entries.length === 0) return { ok: false, code: "bundle_load_failed" };
    return {
      ok: true,
      result: {
        entries,
        weakMatch: scored.weakMatch,
        meta: {
          surveyContentVersion: bundle.surveyContentVersion,
          matchingVersion: bundle.matchingVersion,
        },
      },
    };
  } catch (e) {
    return {
      ok: false,
      code: e instanceof MatchInputError ? "content_version_mismatch" : "bundle_load_failed",
    };
  }
}
