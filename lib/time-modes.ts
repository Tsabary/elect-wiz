/**
 * Time-based modes: poll blackout and election over (plan "Time-based modes").
 *
 * - **Poll blackout:** from the configured instant onward, poll numbers, the
 *   below-threshold note and the not-polled note are hidden everywhere. It never
 *   switches off again: research/legal-findings.md recommends keeping poll
 *   figures hidden in the post-election archive too.
 * - **Election over:** from poll close onward, the survey is disabled (start
 *   button replaced by a banner, survey routes redirect, the match route returns
 *   `election_over`). Research stays available as an archive.
 *
 * Instants come from research/legal-findings.md (Task 1.7) and
 * research/ground-truth.md (Task 1.4). They are stored as absolute UTC instants
 * because Israel leaves daylight saving time on 2026-10-25, between the two.
 *
 * Clock override (non-production only, for testing and owner review):
 * - server: `CLOCK_OVERRIDE` environment variable (affects server rendering);
 * - per browser: the `clock-override` cookie (or `?clock=` on any page, which
 *   sets the cookie). The client-side guards and the match route honour it.
 *
 * This module is pure (no Node or browser APIs) so it can run on both sides.
 */
import { devAffordancesEnabled } from "./env";

/** Recommended poll-blackout start: Fri 2026-10-23 12:00 Asia/Jerusalem (+03:00), 12 h before the statutory ban. */
export const DEFAULT_POLL_BLACKOUT_START = "2026-10-23T09:00:00Z";
/** Polls close: Tue 2026-10-27 22:00 Asia/Jerusalem (+02:00). */
export const DEFAULT_ELECTION_CLOSE = "2026-10-27T20:00:00Z";

/** Cookie and header names for the non-production clock override. */
export const CLOCK_OVERRIDE_COOKIE = "clock-override";
export const CLOCK_OVERRIDE_HEADER = "x-clock-override";
export const CLOCK_OVERRIDE_PARAM = "clock";

type Env = Record<string, string | undefined>;

function instant(value: string | undefined, fallback: string): number {
  const t = Date.parse(value ?? "");
  return Number.isFinite(t) ? t : Date.parse(fallback);
}

export interface TimeConfig {
  pollBlackoutStart: number;
  electionClose: number;
}

export function timeConfig(env: Env = process.env): TimeConfig {
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

export interface TimeModes {
  blackout: boolean;
  electionOver: boolean;
}

export function timeModes(now: Date, cfg: TimeConfig = timeConfig()): TimeModes {
  return { blackout: isPollBlackout(now, cfg), electionOver: isElectionOver(now, cfg) };
}

/** Parses an override value (ISO-8601 instant). Returns null when absent or invalid. */
export function parseClockOverride(value: string | null | undefined): Date | null {
  if (!value) return null;
  const t = Date.parse(decodeURIComponent(value.trim()));
  return Number.isFinite(t) ? new Date(t) : null;
}

/**
 * The current time, honouring a clock override outside production.
 * `override` (cookie/header value) wins over the `CLOCK_OVERRIDE` env var.
 * In production both are ignored.
 */
export function resolveNow(
  opts: { env?: Env; override?: string | null; realNow?: Date } = {},
): Date {
  const env = opts.env ?? process.env;
  const real = opts.realNow ?? new Date();
  if (!devAffordancesEnabled(env)) return real;
  return parseClockOverride(opts.override) ?? parseClockOverride(env.CLOCK_OVERRIDE) ?? real;
}

/** Reads one cookie value from a Cookie header string. */
export function readCookie(cookieHeader: string | null | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

/** The override a request carries (header first, then cookie). */
export function requestClockOverride(request: Request): string | null {
  return (
    request.headers.get(CLOCK_OVERRIDE_HEADER) ??
    readCookie(request.headers.get("cookie"), CLOCK_OVERRIDE_COOKIE)
  );
}

/** What client components need to re-check the modes in the browser. */
export interface ClientTimeConfig extends TimeConfig {
  /** Whether the browser may apply the clock-override cookie (non-production only). */
  overrideAllowed: boolean;
  /** Server-side override in force when the page was rendered (CLOCK_OVERRIDE), if any. */
  serverOverride: number | null;
}

export function clientTimeConfig(env: Env = process.env): ClientTimeConfig {
  const allowed = devAffordancesEnabled(env);
  return {
    ...timeConfig(env),
    overrideAllowed: allowed,
    serverOverride: allowed ? (parseClockOverride(env.CLOCK_OVERRIDE)?.getTime() ?? null) : null,
  };
}

/** Revalidation window for time-sensitive pages, in seconds (plan Performance §1). */
export const TIME_SENSITIVE_REVALIDATE_SECONDS = 300;
