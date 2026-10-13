/**
 * The anonymous counts (plan-deterministic-matching.md, "APIs & interfaces" §8
 * and Data model §9): per day, how many surveys were started, how many results
 * were shown, and per party how often it was the top match and a runner-up.
 *
 * Nothing else is kept: no answers, no identifiers, nothing derived from the
 * visitor's address, and no time finer than the day. The counts are for the
 * owner only and approximate by nature (the endpoint is public).
 *
 * The counting is written against `CounterStore`, with an in-memory version for
 * tests and an Upstash Redis version (REST API, no client library) for the site.
 * With no store configured the route validates the call and counts nothing.
 */
import { z } from "zod";
import { TOP_ENTRIES } from "../matching/contract";

// ------------------------------------------------------------------ calls

/** `POST /api/tally`. */
export const TALLY_PATH = "/api/tally";

/** The largest body the route reads. A valid call is far smaller. */
export const TALLY_MAX_BODY_BYTES = 512;

/** A "result" call names the top few parties: at least 3, at most `TOP_ENTRIES`. */
export const TALLY_MIN_PARTIES = 3;
export const TALLY_MAX_PARTIES = TOP_ENTRIES;

export type TallyCall =
  /** A new survey was begun. Carries nothing else. */
  | { kind: "started" }
  /** A result was shown: its top parties, in result order. */
  | { kind: "result"; parties: string[] };

const tallyCallSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("started") }),
  z.strictObject({
    kind: z.literal("result"),
    parties: z.array(z.string().min(1).max(100)).min(TALLY_MIN_PARTIES).max(TALLY_MAX_PARTIES),
  }),
]);

/**
 * Checks a parsed request body. Returns the call, or null for anything that
 * isn't exactly one of the two: an unknown kind, an extra field, too few or too
 * many parties, a repeated party, or a party that isn't researched.
 */
export function parseTallyCall(
  body: unknown,
  researchedPartyIds: Iterable<string>,
): TallyCall | null {
  const parsed = tallyCallSchema.safeParse(body);
  if (!parsed.success) return null;
  const call = parsed.data;
  if (call.kind === "started") return { kind: "started" };
  const known = new Set(researchedPartyIds);
  if (new Set(call.parties).size !== call.parties.length) return null;
  if (!call.parties.every((id) => known.has(id))) return null;
  return { kind: "result", parties: [...call.parties] };
}

/** The same, from the raw request text. Null too when the text is too long or isn't JSON. */
export function parseTallyBody(
  text: string,
  researchedPartyIds: Iterable<string>,
): TallyCall | null {
  if (new TextEncoder().encode(text).length > TALLY_MAX_BODY_BYTES) return null;
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return null;
  }
  return parseTallyCall(body, researchedPartyIds);
}

// ------------------------------------------------------------------ day keys

const ISRAEL_DATE = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jerusalem",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** The calendar date in Israel at `now`, as YYYY-MM-DD: a day in the counts is a day for the owner. */
export function israelDay(now: Date): string {
  const parts = Object.fromEntries(ISRAEL_DATE.formatToParts(now).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** The store key holding one day's counters. */
export function dayKey(day: string): string {
  return `tally:${day}`;
}

// ------------------------------------------------------------------ counters

export const COUNTER_STARTED = "started";
export const COUNTER_RESULTS = "results";
export const topCounter = (partyId: string) => `top:${partyId}`;
export const runnerUpCounter = (partyId: string) => `runner-up:${partyId}`;

/**
 * The day's counters a call adds one to. A result counts once, its first party
 * as the top match and the others (positions 2–4) as runners-up.
 */
export function countersFor(call: TallyCall): string[] {
  if (call.kind === "started") return [COUNTER_STARTED];
  const [top, ...runnersUp] = call.parties;
  return [COUNTER_RESULTS, topCounter(top), ...runnersUp.map(runnerUpCounter)];
}

// ------------------------------------------------------------------ store

export interface CounterStore {
  /** Adds one to each named counter under `key`, in one round trip. */
  increment(key: string, counters: readonly string[]): Promise<void>;
}

/** Records a valid call under the Israel day of `now`. */
export async function recordTally(store: CounterStore, call: TallyCall, now: Date): Promise<void> {
  await store.increment(dayKey(israelDay(now)), countersFor(call));
}

export interface MemoryCounterStore extends CounterStore {
  /** Every counter of one key, e.g. `counts("tally:2026-10-14")`. */
  counts(key: string): Record<string, number>;
  keys(): string[];
}

/** A store that lives in memory, for tests. */
export function createMemoryCounterStore(): MemoryCounterStore {
  const data = new Map<string, Map<string, number>>();
  return {
    async increment(key, counters) {
      const day = data.get(key) ?? new Map<string, number>();
      data.set(key, day);
      for (const c of counters) day.set(c, (day.get(c) ?? 0) + 1);
    },
    counts: (key) => Object.fromEntries(data.get(key) ?? []),
    keys: () => [...data.keys()].sort(),
  };
}

/** How long the route waits for the store before giving up on a count. */
export const STORE_TIMEOUT_MS = 3_000;

/**
 * Upstash Redis through its REST API: each day is one hash, each counter a
 * field, and a call is one transaction (`/multi-exec`) of `HINCRBY`s.
 */
export function createUpstashCounterStore(
  url: string,
  token: string,
  fetchImpl: typeof fetch = fetch,
): CounterStore {
  const endpoint = `${url.replace(/\/+$/, "")}/multi-exec`;
  return {
    async increment(key, counters) {
      const res = await fetchImpl(endpoint, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify(counters.map((c) => ["HINCRBY", key, c, 1])),
        cache: "no-store",
        signal: AbortSignal.timeout(STORE_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`counter store answered ${res.status}`);
    },
  };
}

/** The configured store, or null when either setting is missing (local development, tests). */
export function counterStoreFromEnv(
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch,
): CounterStore | null {
  const url = env.UPSTASH_REDIS_REST_URL?.trim();
  const token = env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return createUpstashCounterStore(url, token, fetchImpl);
}
