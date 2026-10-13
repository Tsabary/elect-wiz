/**
 * Display-ready views of registry parties: for the Parties section, and the
 * per-party facts a result shows.
 * Ordering is alphabetical in the current language only (PRD FR27): never by
 * polls or size.
 */
import type { Locale } from "@/i18n/routing";
import type { PartyMetadata } from "@/lib/matching/contract";
import { pollNoteFor } from "./polls";
import type { List, Party, PartyTier } from "./schemas";

export interface PartySummary {
  id: string;
  name: string;
  leader: string;
  /** `researched` parties have a research page and are matched; `listed` ones show registry facts only. */
  tier: PartyTier;
  /** Always false for a listed party: the flag describes research. */
  limitedInfo: boolean;
  list: { id: string; name: string; ballotLetters: string; isJoint: boolean };
  partners: { id: string; name: string }[];
}

export function sortByName<T extends { name: string }>(items: readonly T[], locale: Locale): T[] {
  const collator = new Intl.Collator(locale, { sensitivity: "base", numeric: true });
  return [...items].sort((a, b) => collator.compare(a.name, b.name));
}

export function partySummary(
  party: Party,
  parties: readonly Party[],
  lists: readonly List[],
  locale: Locale,
): PartySummary {
  const list = lists.find((l) => l.id === party.listId);
  const partners = (list?.memberPartyIds ?? [])
    .filter((id) => id !== party.id)
    .map((id) => parties.find((p) => p.id === id))
    .filter((p): p is Party => !!p)
    .map((p) => ({ id: p.id, name: p.name[locale] }));
  return {
    id: party.id,
    name: party.name[locale],
    leader: party.leader[locale],
    tier: party.tier,
    limitedInfo: party.tier === "researched" && party.limitedInfo,
    list: {
      id: list?.id ?? party.listId,
      name: list?.name[locale] ?? "",
      ballotLetters: list?.ballotLetters ?? "",
      isJoint: (list?.memberPartyIds.length ?? 1) > 1,
    },
    partners: sortByName(partners, locale),
  };
}

export function partySummaries(
  parties: readonly Party[],
  lists: readonly List[],
  locale: Locale,
): PartySummary[] {
  return sortByName(
    parties.map((p) => partySummary(p, parties, lists, locale)),
    locale,
  );
}

/** What a listed party's page shows: registry facts and, when one exists, its own platform link. */
export interface ListedPartyView extends PartySummary {
  /** The list's top candidates, in list order. */
  topCandidates: string[];
  /** The party's own platform page (https only), or null. Unchecked by us. */
  platformUrl: string | null;
}

export function listedPartyView(
  party: Party,
  parties: readonly Party[],
  lists: readonly List[],
  locale: Locale,
): ListedPartyView {
  const list = lists.find((l) => l.id === party.listId);
  const url = party.tier === "listed" ? party.platform?.url : undefined;
  return {
    ...partySummary(party, parties, lists, locale),
    topCandidates: (list?.topCandidates ?? []).map((c) => c[locale]),
    platformUrl: url?.startsWith("https://") ? url : null,
  };
}

/** The parties that can be someone's match, and so may appear in a share link. */
export function researchedPartyIds(parties: readonly Party[]): string[] {
  return parties.filter((p) => p.tier === "researched").map((p) => p.id);
}

/**
 * The registry facts a result shows about a party, or null when its list is
 * missing. The poll note is left out during the blackout, so it must be built
 * with the server's blackout state.
 */
export function partyMetadata(
  party: Party,
  parties: readonly Party[],
  lists: readonly List[],
  locale: Locale,
  blackout: boolean,
): PartyMetadata | null {
  const list = lists.find((l) => l.id === party.listId);
  if (!list) return null;
  const partners = list.memberPartyIds
    .filter((id) => id !== party.id)
    .map((id) => parties.find((p) => p.id === id))
    .filter((p): p is Party => !!p)
    .map((p) => ({ id: p.id, name: p.name[locale] }));
  return {
    name: party.name[locale],
    listId: list.id,
    listName: list.name[locale],
    ballotLetters: list.ballotLetters,
    isJointList: list.memberPartyIds.length > 1,
    partners,
    limitedInfo: party.limitedInfo,
    pollNote: pollNoteFor(list.poll, { blackout }),
  };
}

/** The facts for every researched party, by party ID: what the survey page hands the result. */
export function researchedPartyMetadata(
  parties: readonly Party[],
  lists: readonly List[],
  locale: Locale,
  blackout: boolean,
): Record<string, PartyMetadata> {
  const out: Record<string, PartyMetadata> = {};
  for (const party of parties) {
    if (party.tier !== "researched") continue;
    const metadata = partyMetadata(party, parties, lists, locale, blackout);
    if (metadata) out[party.id] = metadata;
  }
  return out;
}
