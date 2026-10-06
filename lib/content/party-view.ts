/**
 * Display-ready views of registry parties for the Parties section.
 * Ordering is alphabetical in the current language only (PRD FR27): never by
 * polls or size.
 */
import type { Locale } from "@/i18n/routing";
import type { List, Party } from "./schemas";

export interface PartySummary {
  id: string;
  name: string;
  leader: string;
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
    limitedInfo: party.limitedInfo,
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
