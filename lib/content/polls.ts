import type { List, PollSnapshot } from "./schemas";

/** Israel's electoral threshold, percent of valid votes. Applies to the list. */
export const ELECTORAL_THRESHOLD_PERCENT = 3.25;

export function isBelowThreshold(percent: number): boolean {
  return percent < ELECTORAL_THRESHOLD_PERCENT;
}

export type PollNote =
  | {
      kind: "below-threshold";
      percent: number;
      asOf: string;
      sourceTitle: string;
      sourceUrl: string;
    }
  | { kind: "not-polled"; asOf: string };

/**
 * The factual poll note for a list, or null when none applies.
 * - polled under 3.25% → "below threshold" (with the poll date)
 * - not tracked by polls → "doesn't appear in published polls"
 * - polled at/above threshold, or snapshot pending → no note
 * During the poll blackout every note is suppressed.
 */
export function pollNoteFor(poll: PollSnapshot, opts: { blackout: boolean }): PollNote | null {
  if (opts.blackout) return null;
  switch (poll.status) {
    case "polled":
      return isBelowThreshold(poll.percent)
        ? {
            kind: "below-threshold",
            percent: poll.percent,
            asOf: poll.asOf,
            sourceTitle: poll.source.title,
            sourceUrl: poll.source.url,
          }
        : null;
    case "not_polled":
      return { kind: "not-polled", asOf: poll.asOf };
    case "pending":
      return null;
  }
}

export function isNotPolled(list: Pick<List, "poll">): boolean {
  return list.poll.status === "not_polled";
}

/** The polling-average line for research pages; null when hidden or unavailable. */
export function pollingLineFor(
  poll: PollSnapshot,
  opts: { blackout: boolean },
): { percent: number; asOf: string; sourceTitle: string; sourceUrl: string } | null {
  if (opts.blackout || poll.status !== "polled") return null;
  return {
    percent: poll.percent,
    asOf: poll.asOf,
    sourceTitle: poll.source.title,
    sourceUrl: poll.source.url,
  };
}
