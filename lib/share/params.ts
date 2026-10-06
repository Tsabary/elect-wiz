/**
 * Share URLs (plan APIs §2): `/{locale}/share/{partyIds}` where `partyIds` is the
 * comma-separated top match party IDs, in result order. Nothing else is encoded:
 * never answers (PRD), never poll data (research/legal-findings.md §3.1).
 */
import { MAX_ENTRIES } from "@/lib/matching/contract";

export const SHARE_SEPARATOR = ",";
/** At most this many party IDs are kept from a share URL. */
export const MAX_SHARED_PARTIES = MAX_ENTRIES;

/** Builds the share path for a locale and the result's party IDs. */
export function sharePath(locale: string, partyIds: readonly string[]): string {
  const ids = partyIds.slice(0, MAX_SHARED_PARTIES).map(encodeURIComponent);
  return `/${locale}/share/${ids.join(SHARE_SEPARATOR)}`;
}

/**
 * Parses the `partyIds` path segment. Keeps only IDs present in the registry, in
 * order, without duplicates, up to the cap. Anything else is ignored.
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
