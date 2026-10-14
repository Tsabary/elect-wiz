/**
 * The owner's view of the anonymous counts: every day's counters added up into
 * one table of all researched parties, ranked by how often each came 1st (then
 * 2nd, 3rd and 4th). Pure, so the arithmetic can be unit-tested; the store is
 * read by `scripts/tally-report.ts`.
 */
import { COUNTER_RESULTS, COUNTER_STARTED, PLACES, placeCounter, type Place } from "./counter";

/** One day's counters as stored: field name → count. */
export type DayCounts = Record<string, number>;

export interface PartyRow {
  partyId: string;
  /** How often the party came in each place. */
  places: Record<Place, number>;
  /** Times in a result's top four. */
  inTopFour: number;
  /** Share of all results in which the party came 1st, 0–1. */
  firstShare: number;
}

export interface TallyReport {
  /** The days with any counts, oldest first. */
  days: { day: string; started: number; results: number }[];
  started: number;
  results: number;
  /** Every researched party, best first. */
  parties: PartyRow[];
}

/**
 * Adds up the days. Parties are ordered by 1st places, then 2nd, 3rd and 4th,
 * then by ID, so equal counts always print in the same order. Every party in
 * `partyIds` is listed, including those never counted; a counted ID not in the
 * list (a party removed later) is listed too, so no count is lost.
 */
export function buildTallyReport(
  byDay: Record<string, DayCounts>,
  partyIds: readonly string[],
): TallyReport {
  const days = Object.keys(byDay)
    .sort()
    .map((day) => ({
      day,
      started: byDay[day][COUNTER_STARTED] ?? 0,
      results: byDay[day][COUNTER_RESULTS] ?? 0,
    }));
  const started = days.reduce((n, d) => n + d.started, 0);
  const results = days.reduce((n, d) => n + d.results, 0);

  const ids = new Set(partyIds);
  for (const counts of Object.values(byDay)) {
    for (const field of Object.keys(counts)) {
      const [place, ...rest] = field.split(":");
      if ((PLACES as readonly string[]).includes(place) && rest.length) ids.add(rest.join(":"));
    }
  }

  const parties = [...ids].map((partyId): PartyRow => {
    const places = Object.fromEntries(
      PLACES.map((p) => [
        p,
        Object.values(byDay).reduce((n, c) => n + (c[placeCounter(p, partyId)] ?? 0), 0),
      ]),
    ) as Record<Place, number>;
    const inTopFour = PLACES.reduce((n, p) => n + places[p], 0);
    return { partyId, places, inTopFour, firstShare: results ? places["1st"] / results : 0 };
  });
  parties.sort((a, b) => {
    for (const p of PLACES) if (a.places[p] !== b.places[p]) return b.places[p] - a.places[p];
    return a.partyId < b.partyId ? -1 : a.partyId > b.partyId ? 1 : 0;
  });
  return { days, started, results, parties };
}

/** Plain-text table for the terminal. `nameOf` gives a party's display name. */
export function formatTallyReport(
  report: TallyReport,
  nameOf: (partyId: string) => string,
  { showDays = false }: { showDays?: boolean } = {},
): string {
  const lines: string[] = [];
  const first = report.days[0]?.day;
  const last = report.days.at(-1)?.day;
  lines.push(
    first ? `Anonymous counts, ${first} to ${last} (Israel dates)` : "No counts recorded yet.",
  );
  if (!first) return lines.join("\n");
  const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
  lines.push(
    `Surveys started: ${report.started}   Results shown: ${report.results}` +
      (report.started ? `   (${pct(report.results / report.started)} reached a result)` : ""),
    "",
  );

  const head = ["#", "Party", "1st", "2nd", "3rd", "4th", "Top 4", "1st share"];
  const rows = report.parties.map((p, i) => [
    String(i + 1),
    nameOf(p.partyId),
    ...PLACES.map((pl) => String(p.places[pl])),
    String(p.inTopFour),
    pct(p.firstShare),
  ]);
  const widths = head.map((h, c) => Math.max(h.length, ...rows.map((r) => r[c].length)));
  const fmt = (r: string[]) =>
    r.map((cell, c) => (c === 1 ? cell.padEnd(widths[c]) : cell.padStart(widths[c]))).join("  ");
  lines.push(fmt(head), widths.map((w) => "-".repeat(w)).join("  "), ...rows.map(fmt));

  if (showDays) {
    lines.push("", "Per day:", "Day         Started  Results");
    for (const d of report.days) {
      lines.push(`${d.day}  ${String(d.started).padStart(7)}  ${String(d.results).padStart(7)}`);
    }
  }
  lines.push(
    "",
    "Counts are of surveys and results, not people, and the endpoint is public, so treat them as approximate.",
  );
  return lines.join("\n");
}
