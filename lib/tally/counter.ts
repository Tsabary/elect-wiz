/**
 * The anonymous counts (plan-deterministic-matching.md, "APIs & interfaces" §8
 * and Data model §9): per day, how many surveys were started, how many results
 * were shown, per party how often it came 1st, 2nd, 3rd and 4th, per issue how
 * important the people who reached a result ranked it (points by rank, and how
 * often it came 1st), and how many result links were shared, with and without
 * answers.
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
import { MIN_RANKED, TOP_ENTRIES } from "../matching/contract";

// ------------------------------------------------------------------ calls

/** `POST /api/tally`. */
export const TALLY_PATH = "/api/tally";

/** The largest body the route reads. A valid call is smaller. */
export const TALLY_MAX_BODY_BYTES = 1024;

/** A "result" call names the top few parties: at least 3, at most `TOP_ENTRIES`. */
export const TALLY_MIN_PARTIES = 3;
export const TALLY_MAX_PARTIES = TOP_ENTRIES;

/** A "result" call may name the ranked issues, most important first: between these many. */
export const TALLY_MIN_ISSUES = MIN_RANKED;
export const TALLY_MAX_ISSUES = 10;
export type TallyCall =
  /** A new survey was begun. Carries nothing else. */
  | { kind: "started" }
  /**
   * A result was shown: its top parties, in result order, and the issues the user
   * ranked, most important first (never the positions chosen on them). `issues`
   * is absent from a page loaded before it was added.
   */
  | { kind: "result"; parties: string[]; issues?: string[] }
  /** A share link was shared (share sheet completed or link copied): only whether it held answers. */
  | { kind: "shared"; withAnswers: boolean };

const tallyCallSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("started") }),
  z.strictObject({
    kind: z.literal("result"),
    parties: z.array(z.string().min(1).max(100)).min(TALLY_MIN_PARTIES).max(TALLY_MAX_PARTIES),
    issues: z
      .array(z.string().min(1).max(100))
      .min(TALLY_MIN_ISSUES)
      .max(TALLY_MAX_ISSUES)
      .optional(),
  }),
  z.strictObject({ kind: z.literal("shared"), withAnswers: z.boolean() }),
]);

/**
 * Checks a parsed request body. Returns the call, or null for anything that
 * isn't exactly one of the kinds: an unknown kind, an extra field, too few or too
 * many parties or issues, a repeated party or issue, a party that isn't
 * researched, or an issue that isn't one of `issueIds`.
 */
export function parseTallyCall(
  body: unknown,
  researchedPartyIds: Iterable<string>,
  issueIds: Iterable<string> = [],
): TallyCall | null {
  const parsed = tallyCallSchema.safeParse(body);
  if (!parsed.success) return null;
  const call = parsed.data;
  if (call.kind === "started") return { kind: "started" };
  if (call.kind === "shared") return { kind: "shared", withAnswers: call.withAnswers };
  const known = new Set(researchedPartyIds);
  if (new Set(call.parties).size !== call.parties.length) return null;
  if (!call.parties.every((id) => known.has(id))) return null;
  if (!call.issues) return { kind: "result", parties: [...call.parties] };
  const knownIssues = new Set(issueIds);
  if (new Set(call.issues).size !== call.issues.length) return null;
  if (!call.issues.every((id) => knownIssues.has(id))) return null;
  return { kind: "result", parties: [...call.parties], issues: [...call.issues] };
}

/** The same, from the raw request text. Null too when the text is too long or isn't JSON. */
export function parseTallyBody(
  text: string,
  researchedPartyIds: Iterable<string>,
  issueIds: Iterable<string> = [],
): TallyCall | null {
  if (new TextEncoder().encode(text).length > TALLY_MAX_BODY_BYTES) return null;
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return null;
  }
  return parseTallyCall(body, researchedPartyIds, issueIds);
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
/** Share links shared without answers, and with them. */
export const COUNTER_SHARED_PLAIN = "shared:plain";
export const COUNTER_SHARED_ANSWERS = "shared:answers";
/** The places a result counts, in order: the closest party and the next three. */
export const PLACES = ["1st", "2nd", "3rd", "4th"] as const;
export type Place = (typeof PLACES)[number];
/** The counter for a party coming in `place`, e.g. `1st:likud-party`. */
export const placeCounter = (place: Place, partyId: string) => `${place}:${partyId}`;

/** An issue's importance points: 10 for the issue ranked 1st, 9 for 2nd, … 1 for 10th. */
export const issuePointsCounter = (issueId: string) => `issue-points:${issueId}`;
/** How often an issue was ranked the most important. */
export const issueFirstCounter = (issueId: string) => `issue-1st:${issueId}`;
export const pointsForRank = (rank: number) => TALLY_MAX_ISSUES + 1 - rank;

/**
 * The day's counters a call adds to, each by one unless an amount is given. A
 * result counts once, each of its parties in its place, and each ranked issue
 * its points by rank (an issue marked "doesn't matter" gets none), with one
 * more for the issue ranked first.
 */
export function countersFor(call: TallyCall): (string | [string, number])[] {
  if (call.kind === "started") return [COUNTER_STARTED];
  if (call.kind === "shared")
    return [call.withAnswers ? COUNTER_SHARED_ANSWERS : COUNTER_SHARED_PLAIN];
  const issues = call.issues ?? [];
  return [
    COUNTER_RESULTS,
    ...call.parties.map((id, i) => placeCounter(PLACES[i], id)),
    ...issues.map((id, i): [string, number] => [issuePointsCounter(id), pointsForRank(i + 1)]),
    ...issues.slice(0, 1).map(issueFirstCounter),
  ];
}

// ------------------------------------------------------------------ store

export interface CounterStore {
  /** Adds to each named counter under `key` (one, or the amount given), in one round trip. */
  increment(key: string, counters: readonly (string | readonly [string, number])[]): Promise<void>;
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
      for (const c of counters) {
        const [field, by] = typeof c === "string" ? [c, 1] : c;
        day.set(field, (day.get(field) ?? 0) + by);
      }
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
        body: JSON.stringify(
          counters.map((c) =>
            typeof c === "string" ? ["HINCRBY", key, c, 1] : ["HINCRBY", key, c[0], c[1]],
          ),
        ),
        cache: "no-store",
        signal: AbortSignal.timeout(STORE_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`counter store answered ${res.status}`);
    },
  };
}

/**
 * The configured store, or null when either setting is missing (local development, tests).
 * Reads Upstash's own names first, then the `KV_REST_API_*` names that connecting the
 * database through the Vercel Marketplace may set instead.
 */
export function counterStoreFromEnv(
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch,
): CounterStore | null {
  const url = (env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL)?.trim();
  const token = (env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN)?.trim();
  if (!url || !token) return null;
  return createUpstashCounterStore(url, token, fetchImpl);
}
