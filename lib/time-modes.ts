/**
 * Time-based modes: poll blackout and election over.
 *
 * Phase 1 minimal version used by the matching route. Task 2.8 extends it
 * (clock override, client-side checks, page wiring).
 *
 * Instants come from research/legal-findings.md (Task 1.7) and
 * research/ground-truth.md (Task 1.4). Stored as absolute UTC instants; Israel
 * leaves daylight saving time on 2026-10-25, between the two.
 */

/** Recommended poll-blackout start: Fri 2026-10-23 12:00 Asia/Jerusalem (+03:00), 12 h before the statutory ban. */
export const DEFAULT_POLL_BLACKOUT_START = "2026-10-23T09:00:00Z";
/** Polls close: Tue 2026-10-27 22:00 Asia/Jerusalem (+02:00). */
export const DEFAULT_ELECTION_CLOSE = "2026-10-27T20:00:00Z";

function instant(value: string | undefined, fallback: string): number {
  const t = Date.parse(value ?? "");
  return Number.isFinite(t) ? t : Date.parse(fallback);
}

export interface TimeConfig {
  pollBlackoutStart: number;
  electionClose: number;
}

export function timeConfig(env: Record<string, string | undefined> = process.env): TimeConfig {
  return {
    pollBlackoutStart: instant(env.POLL_BLACKOUT_START, DEFAULT_POLL_BLACKOUT_START),
    electionClose: instant(env.ELECTION_CLOSE, DEFAULT_ELECTION_CLOSE),
  };
}

export function isPollBlackout(now: Date, cfg: TimeConfig = timeConfig()): boolean {
  return now.getTime() >= cfg.pollBlackoutStart;
}

export function isElectionOver(now: Date, cfg: TimeConfig = timeConfig()): boolean {
  return now.getTime() >= cfg.electionClose;
}
