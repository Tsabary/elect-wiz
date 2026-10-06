import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { corpusView, SURVEY_VERSION, validRequest } from "@/tests/fixtures/matching";
import { ERROR_CODES, MAX_BODY_BYTES, type MatchResponse } from "./contract";
import { handleMatchRequest, type HandlerDeps } from "./handler";
import { MOCK_SCENARIOS, mockImplementation } from "./mock";
import type { MatchingImplementation } from "./types";

function deps(overrides: Partial<HandlerDeps> = {}): HandlerDeps {
  return {
    corpus: corpusView(),
    surveyContentVersion: SURVEY_VERSION,
    researchVersion: "r1",
    implementation: mockImplementation,
    now: new Date("2026-10-10T10:00:00Z"),
    blackout: false,
    electionOver: false,
    env: { APP_ENV: "test" },
    ...overrides,
  };
}

function post(
  body: unknown,
  opts: { scenario?: string; raw?: string; query?: string } = {},
): Request {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.scenario) headers["x-mock-scenario"] = opts.scenario;
  return new Request(`http://localhost/api/match${opts.query ?? ""}`, {
    method: "POST",
    headers,
    body: opts.raw ?? JSON.stringify(body),
  });
}

async function run(req: Request, d = deps()) {
  const res = await handleMatchRequest(req, d);
  return { status: res.status, body: await res.json() };
}

afterEach(() => vi.restoreAllMocks());

describe("handleMatchRequest", () => {
  it("returns 3–4 entries with registry metadata", async () => {
    const { status, body } = await run(post(validRequest()));
    expect(status).toBe(200);
    const r = body as MatchResponse;
    expect(r.entries.length).toBeGreaterThanOrEqual(3);
    expect(r.entries.length).toBeLessThanOrEqual(4);
    for (const e of r.entries) {
      expect(e.metadata.name).toBe(`${e.partyId}-en`);
      expect(e.breakdown.length).toBeGreaterThan(0);
      for (const b of e.breakdown) expect(b.anchor).toBe(`issue-${b.issueId}`);
    }
    expect(r.meta).toEqual({
      surveyContentVersion: SURVEY_VERSION,
      researchVersion: "r1",
      blackout: false,
    });
  });

  it("is deterministic for identical answers", async () => {
    const a = await run(post(validRequest()));
    const b = await run(post(validRequest()));
    expect(a.body).toEqual(b.body);
  });

  it("localizes explanations and names to the request locale", async () => {
    const { body } = await run(post(validRequest({ locale: "he" })));
    const e = (body as MatchResponse).entries[0];
    expect(e.metadata.name).toBe(`${e.partyId}-he`);
    expect(e.breakdown[0].explanation).toMatch(/[֐-׿]/);
  });

  it("orders breakdown by the user's rank and includes the 'anything else' note", async () => {
    const { body } = await run(post(validRequest()));
    const e = (body as MatchResponse).entries[0];
    expect(e.breakdown.map((b) => b.rank)).toEqual(
      [...e.breakdown.map((b) => b.rank)].sort((x, y) => x - y),
    );
    expect(e.anythingElseNote?.anchor).toBeTruthy();
  });

  describe("mock result cases", () => {
    it("joint-list entry, with partners and no partner score", async () => {
      const { body } = await run(post(validRequest(), { scenario: "joint-list" }));
      const r = body as MatchResponse;
      const top = r.entries[0];
      expect(top.metadata.isJointList).toBe(true);
      expect(top.metadata.listName).toBe("Joint List");
      expect(top.metadata.ballotLetters).toBe("קט");
      expect(top.metadata.partners).toHaveLength(1);
      expect(["left-half", "right-half"]).toContain(top.metadata.partners[0].id);
    });

    it("below-threshold note", async () => {
      const { body } = await run(post(validRequest(), { scenario: "below-threshold" }));
      const top = (body as MatchResponse).entries[0];
      expect(top.partyId).toBe("small");
      expect(top.metadata.pollNote).toMatchObject({
        kind: "below-threshold",
        percent: 2.1,
        asOf: "2026-10-01",
      });
    });

    it("not-polled note", async () => {
      const { body } = await run(post(validRequest(), { scenario: "not-polled" }));
      const top = (body as MatchResponse).entries[0];
      expect(top.metadata.pollNote).toEqual({ kind: "not-polled", asOf: "2026-10-01" });
    });

    it("limited-info flag", async () => {
      const { body } = await run(post(validRequest(), { scenario: "limited-info" }));
      expect((body as MatchResponse).entries[0].metadata.limitedInfo).toBe(true);
    });

    it("weak match", async () => {
      const { body } = await run(post(validRequest(), { scenario: "weak-match" }));
      const r = body as MatchResponse;
      expect(r.weakMatch).toBe(true);
      expect(r.noUsableAnswers).toBe(false);
    });

    it("no usable answers (forced)", async () => {
      const { body } = await run(post(validRequest(), { scenario: "no-usable-answers" }));
      const r = body as MatchResponse;
      expect(r.noUsableAnswers).toBe(true);
      expect(r.weakMatch).toBe(true);
      expect(r.entries.length).toBeGreaterThanOrEqual(3);
      for (const e of r.entries) expect(e.breakdown).toEqual([]);
    });

    it("no usable answers (all answers blank)", async () => {
      const req = validRequest();
      req.answers = req.answers.map((a) => ({ ...a, text: "  ", startingOptionId: null }));
      const { body } = await run(post(req));
      expect((body as MatchResponse).noUsableAnswers).toBe(true);
    });

    it("omits unusable answers from the breakdown", async () => {
      const req = validRequest();
      req.answers[0] = { ...req.answers[0], text: "" };
      const { body } = await run(post(req));
      for (const e of (body as MatchResponse).entries) {
        expect(e.breakdown.some((b) => b.issueId === req.answers[0].issueId)).toBe(false);
      }
    });

    it.each(ERROR_CODES)("simulates error %s with its status", async (code) => {
      const { ERROR_INFO } = await import("./contract");
      const { status, body } = await run(post(validRequest(), { scenario: `error-${code}` }));
      expect(status).toBe(ERROR_INFO[code].status);
      expect(body).toEqual({ error: { code } });
    });

    it("accepts the scenario as a query parameter", async () => {
      const { status } = await run(
        post(validRequest(), { query: "?mockScenario=error-rate_limited" }),
      );
      expect(status).toBe(429);
    });

    it("lists a scenario for every result case and error code", () => {
      expect(MOCK_SCENARIOS).toHaveLength(7 + ERROR_CODES.length);
    });
  });

  it("ignores forced scenarios in production", async () => {
    for (const env of [{ VERCEL_ENV: "production" }, { NODE_ENV: "production" }]) {
      const { status, body } = await run(
        post(validRequest(), { scenario: "error-at_capacity" }),
        deps({ env }),
      );
      expect(status).toBe(200);
      expect((body as MatchResponse).entries.length).toBeGreaterThan(0);
    }
  });

  it("returns validation (400) for invalid JSON, invalid payloads and oversized bodies", async () => {
    expect((await run(post(null, { raw: "{oops" }))).status).toBe(400);
    expect((await run(post({ hello: 1 }))).body).toMatchObject({ error: { code: "validation" } });
    expect((await run(post(null, { raw: "x".repeat(MAX_BODY_BYTES + 1) }))).status).toBe(400);
  });

  it("returns content_version_mismatch (409) for a stale survey version", async () => {
    const { status, body } = await run(post(validRequest({ surveyContentVersion: "old" })));
    expect(status).toBe(409);
    expect(body).toMatchObject({ error: { code: "content_version_mismatch" } });
  });

  it("returns election_over (410) after polls close", async () => {
    const { status } = await run(post(validRequest()), deps({ electionOver: true }));
    expect(status).toBe(410);
  });

  it("suppresses poll notes during the blackout but keeps other metadata", async () => {
    for (const scenario of ["below-threshold", "not-polled"]) {
      const { body } = await run(post(validRequest(), { scenario }), deps({ blackout: true }));
      const r = body as MatchResponse;
      expect(r.meta.blackout).toBe(true);
      for (const e of r.entries) {
        expect(e.metadata.pollNote).toBeNull();
        expect(e.metadata.name).toBeTruthy();
      }
    }
  });

  it("returns upstream_failure (502) when the implementation throws, is missing, or returns invalid output", async () => {
    const throwing: MatchingImplementation = {
      name: "x",
      match: async () => {
        throw new Error("boom");
      },
    };
    expect((await run(post(validRequest()), deps({ implementation: throwing }))).status).toBe(502);
    expect((await run(post(validRequest()), deps({ implementation: null }))).status).toBe(502);
    const bogus: MatchingImplementation = {
      name: "y",
      match: async () => ({
        entries: [{ partyId: "ghost", breakdown: [] }],
        weakMatch: false,
        noUsableAnswers: false,
      }),
    };
    expect((await run(post(validRequest()), deps({ implementation: bogus }))).status).toBe(502);
  });

  it("never logs request or response bodies", async () => {
    const spies = (["log", "info", "warn", "error", "debug", "trace"] as const).map((m) =>
      vi.spyOn(console, m).mockImplementation(() => {}),
    );
    const secret = "SECRET-ANSWER-TEXT";
    const req = validRequest();
    req.answers[0].text = secret;
    await run(post(req));
    await run(post(req, { scenario: "error-upstream_failure" }));
    await run(post(null, { raw: `{"bad": "${secret}"` }));
    const throwing: MatchingImplementation = {
      name: "x",
      match: async () => {
        throw new Error(secret);
      },
    };
    await run(post(req), deps({ implementation: throwing }));
    for (const s of spies) expect(s).not.toHaveBeenCalled();
  });

  it("contains no logging calls in the route or matching modules (static check)", () => {
    const files = [
      "lib/matching/handler.ts",
      "lib/matching/mock.ts",
      "lib/matching/contract.ts",
      "lib/matching/registry.ts",
      "app/api/match/route.ts",
    ];
    for (const f of files) {
      const src = fs.readFileSync(path.join(process.cwd(), f), "utf8");
      expect(src, f).not.toMatch(/console\.\w+\(/);
    }
  });
});
