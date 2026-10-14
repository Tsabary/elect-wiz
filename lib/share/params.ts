/**
 * Share URLs (plan APIs §2): `/{locale}/share/{partyIds}` where `partyIds` is the
 * comma-separated top match party IDs, in result order. Nothing else is in the
 * path or query: never answers, never poll data (research/legal-findings.md §3.1).
 * A link the user chose to share with their answers carries them in the fragment
 * only (`answers.ts`), which never reaches the server, the proxy or the cache.
 */
import { TOP_ENTRIES } from "@/lib/matching/contract";

export const SHARE_SEPARATOR = ",";
/** At most this many party IDs are kept from a share URL. */
export const MAX_SHARED_PARTIES = TOP_ENTRIES;

/** Builds the share path for a locale and the result's party IDs. */
export function sharePath(locale: string, partyIds: readonly string[]): string {
  const ids = partyIds.slice(0, MAX_SHARED_PARTIES).map(encodeURIComponent);
  return `/${locale}/share/${ids.join(SHARE_SEPARATOR)}`;
}

/**
 * Parses the `partyIds` path segment. Keeps only the IDs in `knownPartyIds`, in
 * order, without duplicates, up to the cap. Anything else is ignored. Callers
 * pass the researched parties only, so a hand-made link can't present a listed
 * party as someone's match.
 */
export function parseSharedParties(
  segment: string | undefined | null,
  knownPartyIds: Iterable<string>,
): string[] {
  if (!segment || segment.length > 1000) return [];
  let decoded: string;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    return [];
  }
  const known = new Set(knownPartyIds);
  const out: string[] = [];
  for (const raw of decoded.split(SHARE_SEPARATOR)) {
    const id = raw.trim();
    if (known.has(id) && !out.includes(id)) out.push(id);
    if (out.length >= MAX_SHARED_PARTIES) break;
  }
  return out;
}

/** A share page or its preview image: `/{locale}/share/{segment}` and what follows it. */
const SHARE_ROUTE = /^\/([^/]+)\/share\/([^/]+)(\/opengraph-image[^/]*)?\/?$/;

export type ShareRouteCheck =
  /** Not a share page (or one Next answers 404 to anyway): carry on. */
  | { kind: "pass" }
  /** Already the canonical address: render it. */
  | { kind: "canonical" }
  /** Valid parties in a non-canonical form (order kept): send the visitor to this path. */
  | { kind: "redirect"; path: string }
  /** No valid party at all: not found. */
  | { kind: "not-found"; locale: string };

/**
 * Checks a request path against the share-URL format, before anything is
 * rendered. Every share page and preview image is rendered once per distinct
 * address and then cached, so only the canonical address of a valid set of
 * parties may reach the renderer: the IDs as `sharePath` writes them (for the
 * image, as Next writes its address: commas encoded). Anything
 * else is redirected there (unknown, repeated or extra IDs dropped, `%2C`
 * decoded), or is a 404 when no valid party is left. `pathname` is the raw
 * (still percent-encoded) path.
 */
export function checkShareRoute(
  pathname: string,
  knownPartyIds: Iterable<string>,
  locales: readonly string[],
): ShareRouteCheck {
  const match = SHARE_ROUTE.exec(pathname);
  if (!match || !locales.includes(match[1])) return { kind: "pass" };
  const [, locale, segment, image = ""] = match;
  const ids = parseSharedParties(segment, knownPartyIds);
  if (ids.length === 0) return { kind: "not-found", locale };
  // The page's address is `sharePath`'s. Next writes the preview image's address
  // (in the page's metadata) with the comma percent-encoded, so that is its form.
  const path = image
    ? `/${locale}/share/${ids.map(encodeURIComponent).join("%2C")}${image}`
    : sharePath(locale, ids);
  return path === pathname ? { kind: "canonical" } : { kind: "redirect", path };
}
