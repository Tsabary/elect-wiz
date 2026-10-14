import { describe, expect, it, vi } from "vitest";
import { tallyResult, tallySurveyStarted } from "./client";
import {
  counterStoreFromEnv,
  countersFor,
  createMemoryCounterStore,
  createUpstashCounterStore,
  dayKey,
  israelDay,
  parseTallyBody,
  parseTallyCall,
  recordTally,
  TALLY_MAX_BODY_BYTES,
  TALLY_PATH,
  type CounterStore,
} from "./counter";
import { handleTallyRequest, type TallyContext } from "./handler";

const RESEARCHED = ["alpha", "beta", "gamma", "delta", "epsilon"];
const NOW = new Date("2026-10-14T09:00:00Z");

describe("tally body validation", () => {
  const parse = (body: unknown) => parseTallyCall(body, RESEARCHED);

  it("accepts a survey-started call that carries nothing else", () => {
    expect(parse({ kind: "started" })).toEqual({ kind: "started" });
    expect(parse({ kind: "started", parties: ["alpha", "beta", "gamma"] })).toBeNull();
    expect(parse({ kind: "started", answers: {} })).toBeNull();
  });

  it("accepts a result call with 3 or 4 distinct researched parties, in order", () => {
    expect(parse({ kind: "result", parties: ["gamma", "alpha", "beta"] })).toEqual({
      kind: "result",
      parties: ["gamma", "alpha", "beta"],
    });
    expect(parse({ kind: "result", parties: ["delta", "gamma", "alpha", "beta"] })).toEqual({
      kind: "result",
      parties: ["delta", "gamma", "alpha", "beta"],
    });
  });

  it("rejects too few, too many, repeated, unknown or listed parties", () => {
    expect(parse({ kind: "result", parties: ["alpha", "beta"] })).toBeNull();
    expect(parse({ kind: "result", parties: RESEARCHED })).toBeNull();
    expect(parse({ kind: "result", parties: ["alpha", "beta", "alpha"] })).toBeNull();
    expect(parse({ kind: "result", parties: ["alpha", "beta", "nobody"] })).toBeNull();
    // A listed party is simply not among the researched IDs.
    expect(parse({ kind: "result", parties: ["alpha", "beta", "listed-only"] })).toBeNull();
    expect(parse({ kind: "result", parties: ["alpha", "beta", 3] })).toBeNull();
    expect(parse({ kind: "result" })).toBeNull();
  });

  it("rejects anything else", () => {
    for (const body of [null, undefined, 1, "started", [], {}, { kind: "other" }]) {
      expect(parse(body), JSON.stringify(body)).toBeNull();
    }
    expect(parse({ kind: "result", parties: ["alpha", "beta", "gamma"], answers: [] })).toBeNull();
    expect(parse({ kind: "result", parties: ["alpha", "beta", "gamma"], score: 1 })).toBeNull();
  });

  it("rejects text that isn't JSON or is over the size cap", () => {
    expect(parseTallyBody('{"kind":"started"}', RESEARCHED)).toEqual({ kind: "started" });
    expect(parseTallyBody("", RESEARCHED)).toBeNull();
    expect(parseTallyBody("{kind:started}", RESEARCHED)).toBeNull();
    const padded = `{"kind":"started"${" ".repeat(TALLY_MAX_BODY_BYTES)}}`;
    expect(JSON.parse(padded)).toEqual({ kind: "started" });
    expect(parseTallyBody(padded, RESEARCHED)).toBeNull();
  });
});

describe("day keys", () => {
  it("use the calendar date in Israel", () => {
    expect(israelDay(new Date("2026-10-14T09:00:00Z"))).toBe("2026-10-14");
    expect(dayKey("2026-10-14")).toBe("tally:2026-10-14");
  });

  it("roll over at midnight in Israel, while it is still the previous day in UTC", () => {
    // Summer time (+03:00): 00:30 on the 14th in Israel is 21:30 on the 13th in UTC.
    expect(israelDay(new Date("2026-10-13T20:59:59Z"))).toBe("2026-10-13");
    expect(israelDay(new Date("2026-10-13T21:00:00Z"))).toBe("2026-10-14");
    expect(israelDay(new Date("2026-10-13T21:30:00Z"))).toBe("2026-10-14");
  });

  it("follow the change to winter time on 25 October", () => {
    // Winter time (+02:00): midnight in Israel is 22:00 UTC.
    expect(israelDay(new Date("2026-10-26T21:30:00Z"))).toBe("2026-10-26");
    expect(israelDay(new Date("2026-10-26T22:00:00Z"))).toBe("2026-10-27");
  });

  it("put a call just after midnight in Israel under the new day", async () => {
    const store = createMemoryCounterStore();
    await recordTally(store, { kind: "started" }, new Date("2026-10-13T20:30:00Z"));
    await recordTally(store, { kind: "started" }, new Date("2026-10-13T21:30:00Z"));
    await recordTally(store, { kind: "started" }, new Date("2026-10-14T10:00:00Z"));
    expect(store.keys()).toEqual(["tally:2026-10-13", "tally:2026-10-14"]);
    expect(store.counts("tally:2026-10-13")).toEqual({ started: 1 });
    expect(store.counts("tally:2026-10-14")).toEqual({ started: 2 });
  });
});

describe("counters", () => {
  it("count a started survey and nothing else", () => {
    expect(countersFor({ kind: "started" })).toEqual(["started"]);
  });

  it("count a result once, and each party in its place", () => {
    expect(countersFor({ kind: "result", parties: ["gamma", "alpha", "beta", "delta"] })).toEqual([
      "results",
      "1st:gamma",
      "2nd:alpha",
      "3rd:beta",
      "4th:delta",
    ]);
    expect(countersFor({ kind: "result", parties: ["gamma", "alpha", "beta"] })).toHaveLength(4);
  });

  it("add up per party over a day", async () => {
    const store = createMemoryCounterStore();
    await recordTally(store, { kind: "started" }, NOW);
    await recordTally(store, { kind: "started" }, NOW);
    await recordTally(store, { kind: "result", parties: ["alpha", "beta", "gamma", "delta"] }, NOW);
    await recordTally(store, { kind: "result", parties: ["alpha", "gamma", "beta"] }, NOW);
    await recordTally(store, { kind: "result", parties: ["beta", "alpha", "epsilon"] }, NOW);
    expect(store.counts("tally:2026-10-14")).toEqual({
      started: 2,
      results: 3,
      "1st:alpha": 2,
      "1st:beta": 1,
      "2nd:beta": 1,
      "2nd:gamma": 1,
      "2nd:alpha": 1,
      "3rd:gamma": 1,
      "3rd:beta": 1,
      "3rd:epsilon": 1,
      "4th:delta": 1,
    });
  });
});

describe("Upstash store", () => {
  it("is absent unless both settings are present", () => {
    expect(counterStoreFromEnv({})).toBeNull();
    expect(counterStoreFromEnv({ UPSTASH_REDIS_REST_URL: "https://x.upstash.io" })).toBeNull();
    expect(counterStoreFromEnv({ UPSTASH_REDIS_REST_TOKEN: "t" })).toBeNull();
    expect(
      counterStoreFromEnv({ UPSTASH_REDIS_REST_URL: " ", UPSTASH_REDIS_REST_TOKEN: "t" }),
    ).toBeNull();
    expect(
      counterStoreFromEnv({
        UPSTASH_REDIS_REST_URL: "https://x.upstash.io",
        UPSTASH_REDIS_REST_TOKEN: "t",
      }),
    ).not.toBeNull();
  });

  it("also reads the names the Vercel Marketplace sets", () => {
    expect(
      counterStoreFromEnv({ KV_REST_API_URL: "https://x.upstash.io", KV_REST_API_TOKEN: "t" }),
    ).not.toBeNull();
    expect(counterStoreFromEnv({ KV_REST_API_URL: "https://x.upstash.io" })).toBeNull();
  });

  it("increments a day's counters in one transaction", async () => {
    const fetchImpl = vi.fn(async () => new Response("[]", { status: 200 }));
    const store = createUpstashCounterStore("https://x.upstash.io/", "secret", fetchImpl);
    await recordTally(store, { kind: "result", parties: ["alpha", "beta", "gamma"] }, NOW);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://x.upstash.io/multi-exec");
    expect(init.method).toBe("POST");
    expect(new Headers(init.headers).get("authorization")).toBe("Bearer secret");
    expect(JSON.parse(String(init.body))).toEqual([
      ["HINCRBY", "tally:2026-10-14", "results", 1],
      ["HINCRBY", "tally:2026-10-14", "1st:alpha", 1],
      ["HINCRBY", "tally:2026-10-14", "2nd:beta", 1],
      ["HINCRBY", "tally:2026-10-14", "3rd:gamma", 1],
    ]);
  });

  it("fails when the store refuses", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 401 }));
    const store = createUpstashCounterStore("https://x.upstash.io", "bad", fetchImpl);
    await expect(recordTally(store, { kind: "started" }, NOW)).rejects.toThrow();
  });
});

describe("POST /api/tally", () => {
  const post = (body: string, headers: Record<string, string> = {}) =>
    new Request(`https://site.test${TALLY_PATH}`, { method: "POST", body, headers });
  const ctx = (over: Partial<TallyContext> = {}): TallyContext => ({
    store: createMemoryCounterStore(),
    researchedPartyIds: RESEARCHED,
    now: NOW,
    electionOver: false,
    ...over,
  });

  it("counts a valid call and returns no content", async () => {
    const store = createMemoryCounterStore();
    const started = await handleTallyRequest(post('{"kind":"started"}'), ctx({ store }));
    expect(started.status).toBe(204);
    expect(await started.text()).toBe("");
    const result = await handleTallyRequest(
      post('{"kind":"result","parties":["beta","alpha","gamma","delta"]}'),
      ctx({ store }),
    );
    expect(result.status).toBe(204);
    expect(store.counts("tally:2026-10-14")).toEqual({
      started: 1,
      results: 1,
      "1st:beta": 1,
      "2nd:alpha": 1,
      "3rd:gamma": 1,
      "4th:delta": 1,
    });
  });

  it("accepts a valid call and does nothing when no store is configured", async () => {
    const res = await handleTallyRequest(post('{"kind":"started"}'), ctx({ store: null }));
    expect(res.status).toBe(204);
    // Validation still applies.
    expect((await handleTallyRequest(post("{}"), ctx({ store: null }))).status).toBe(400);
  });

  it("rejects a malformed call and counts nothing", async () => {
    const store = createMemoryCounterStore();
    for (const body of [
      "",
      "not json",
      '{"kind":"other"}',
      '{"kind":"started","extra":1}',
      '{"kind":"result","parties":["alpha","beta"]}',
      '{"kind":"result","parties":["alpha","beta","listed-only"]}',
    ]) {
      expect((await handleTallyRequest(post(body), ctx({ store }))).status, body).toBe(400);
    }
    expect(store.keys()).toEqual([]);
  });

  it("rejects a body over the size cap", async () => {
    const store = createMemoryCounterStore();
    const big = `{"kind":"started"${" ".repeat(TALLY_MAX_BODY_BYTES)}}`;
    expect((await handleTallyRequest(post(big), ctx({ store }))).status).toBe(413);
    const declared = post('{"kind":"started"}', { "content-length": "100000" });
    expect((await handleTallyRequest(declared, ctx({ store }))).status).toBe(413);
    expect(store.keys()).toEqual([]);
  });

  it("rejects everything once the election is over", async () => {
    const store = createMemoryCounterStore();
    const res = await handleTallyRequest(
      post('{"kind":"started"}'),
      ctx({ store, electionOver: true }),
    );
    expect(res.status).toBe(410);
    expect(store.keys()).toEqual([]);
  });

  it("answers 503 with no body when the store fails", async () => {
    const store: CounterStore = {
      increment: async () => {
        throw new Error("down");
      },
    };
    const res = await handleTallyRequest(post('{"kind":"started"}'), ctx({ store }));
    expect(res.status).toBe(503);
    expect(await res.text()).toBe("");
  });
});

describe("tally calls from the survey", () => {
  const ok = () => vi.fn(async () => new Response(null, { status: 204 }));
  const sent = (fetchImpl: ReturnType<typeof ok>) => {
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    return { url, init, body: JSON.parse(String(init.body)) as unknown };
  };

  it("send survey-started with nothing else", () => {
    const fetchImpl = ok();
    tallySurveyStarted(fetchImpl);
    const { url, init, body } = sent(fetchImpl);
    expect(url).toBe(TALLY_PATH);
    expect(init.method).toBe("POST");
    expect(init.keepalive).toBe(true);
    expect(body).toEqual({ kind: "started" });
  });

  it("send only the top four party IDs of a result, in order", () => {
    const fetchImpl = ok();
    tallyResult(["epsilon", "alpha", "beta", "gamma", "delta"], fetchImpl);
    const { body } = sent(fetchImpl);
    expect(body).toEqual({ kind: "result", parties: ["epsilon", "alpha", "beta", "gamma"] });
    expect(parseTallyCall(body, RESEARCHED)).not.toBeNull();
  });

  it("send nothing for a result with fewer than three parties", () => {
    const fetchImpl = ok();
    tallyResult(["alpha", "beta"], fetchImpl);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("swallow every failure", async () => {
    const rejecting = vi.fn(async () => {
      throw new Error("offline");
    });
    expect(() => tallySurveyStarted(rejecting)).not.toThrow();
    const throwing = vi.fn(() => {
      throw new Error("blocked");
    }) as unknown as typeof fetch;
    expect(() => tallyResult(["alpha", "beta", "gamma"], throwing)).not.toThrow();
    // Give the rejected promise a turn: an unhandled rejection would fail the run.
    await new Promise((r) => setTimeout(r, 0));
  });
});
