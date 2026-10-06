import { describe, expect, it } from "vitest";
import { ISSUE_IDS } from "@/tests/fixtures/content";
import { corpusView, SURVEY_VERSION, validRequest } from "@/tests/fixtures/matching";
import {
  ERROR_CODES,
  ERROR_INFO,
  MAX_ANSWER_CHARS,
  MAX_BODY_BYTES,
  validateMatchRequest,
  type MatchRequest,
} from "./contract";

const ctx = {
  surveyContentVersion: SURVEY_VERSION,
  issues: new Map(corpusView().issues.map((i) => [i.id, i.options.map((o) => o.id)])),
};

function check(req: unknown) {
  return validateMatchRequest(req, ctx);
}

function expectInvalid(
  req: unknown,
  code: "validation" | "content_version_mismatch" = "validation",
) {
  const r = check(req);
  expect(r.ok).toBe(false);
  if (!r.ok) expect(r.code).toBe(code);
}

describe("validateMatchRequest", () => {
  it("accepts a valid request", () => {
    expect(check(validRequest())).toEqual({ ok: true, request: validRequest() });
  });

  it("accepts all 10 ranked and no 'doesn't matter'", () => {
    const ranked = ISSUE_IDS;
    const req = validRequest({
      ranked,
      notImportant: [],
      answers: ranked.map((issueId) => ({
        issueId,
        text: "x y",
        startingOptionId: null,
        edited: false,
      })),
    });
    expect(check(req).ok).toBe(true);
  });

  it("accepts a missing or null 'anything else'", () => {
    expect(check(validRequest({ anythingElse: null })).ok).toBe(true);
    const { anythingElse: _omit, ...rest } = validRequest();
    expect(check(rest).ok).toBe(true);
  });

  it("rejects a non-object body and missing fields", () => {
    expectInvalid(null);
    expectInvalid("hello");
    const { ranked: _r, ...noRanked } = validRequest();
    expectInvalid(noRanked);
  });

  it("rejects an unknown locale", () => {
    expectInvalid({ ...validRequest(), locale: "fr" });
  });

  it("rejects a different survey-content version with content_version_mismatch", () => {
    expectInvalid(validRequest({ surveyContentVersion: "old" }), "content_version_mismatch");
  });

  it("reports content_version_mismatch even when a stale payload is otherwise malformed", () => {
    expectInvalid({ surveyContentVersion: "old", ranked: ["gone"] }, "content_version_mismatch");
  });

  it("rejects fewer than 5 ranked issues", () => {
    const ranked = ISSUE_IDS.slice(0, 4);
    expectInvalid(
      validRequest({
        ranked,
        notImportant: ISSUE_IDS.slice(4),
        answers: ranked.map((issueId) => ({
          issueId,
          text: "x",
          startingOptionId: null,
          edited: false,
        })),
      }),
    );
  });

  it("rejects more than 5 'doesn't matter' issues", () => {
    const ranked = ISSUE_IDS.slice(0, 4);
    expectInvalid(validRequest({ ranked, notImportant: ISSUE_IDS.slice(4) }));
  });

  it("rejects unknown issue ids", () => {
    const req = validRequest();
    req.notImportant = [...req.notImportant.slice(1), "not-an-issue"];
    expectInvalid(req);
  });

  it("rejects ties (duplicate ranked ids)", () => {
    const req = validRequest();
    req.ranked = [...req.ranked.slice(0, 6), req.ranked[0]];
    expectInvalid(req);
  });

  it("rejects overlap between ranked and 'doesn't matter'", () => {
    const req = validRequest();
    req.notImportant = [req.ranked[0], ...req.notImportant.slice(1)];
    expectInvalid(req);
  });

  it("rejects when ranked and 'doesn't matter' don't cover all 10", () => {
    expectInvalid(validRequest({ notImportant: ISSUE_IDS.slice(8) }));
  });

  it("rejects duplicate 'doesn't matter' ids", () => {
    const req = validRequest();
    req.notImportant = [req.notImportant[0], req.notImportant[0], req.notImportant[1]];
    expectInvalid(req);
  });

  it("rejects a missing answer for a ranked issue", () => {
    const req = validRequest();
    req.answers.pop();
    expectInvalid(req);
  });

  it("rejects an answer for an issue that isn't ranked", () => {
    const req = validRequest();
    req.answers.push({
      issueId: req.notImportant[0],
      text: "x",
      startingOptionId: null,
      edited: false,
    });
    expectInvalid(req);
  });

  it("rejects two answers for the same issue", () => {
    const req = validRequest();
    req.answers.push({ ...req.answers[0] });
    expectInvalid(req);
  });

  it("rejects an unknown starting option", () => {
    const req = validRequest();
    req.answers[1].startingOptionId = "opt-9";
    expectInvalid(req);
  });

  it("rejects 'edited' without a starting option", () => {
    const req = validRequest();
    req.answers[0] = { ...req.answers[0], startingOptionId: null, edited: true };
    expectInvalid(req);
  });

  it("enforces the per-answer length cap", () => {
    const req = validRequest();
    req.answers[0].text = "x".repeat(MAX_ANSWER_CHARS);
    expect(check(req).ok).toBe(true);
    req.answers[0].text = "x".repeat(MAX_ANSWER_CHARS + 1);
    expectInvalid(req);
  });

  it("enforces the 'anything else' length cap and importance values", () => {
    expectInvalid(
      validRequest({
        anythingElse: { text: "x".repeat(MAX_ANSWER_CHARS + 1), importance: "minor" },
      }),
    );
    expectInvalid({ ...validRequest(), anythingElse: { text: "x", importance: "huge" } });
  });

  it("accepts the largest legitimate request (every text at the cap)", () => {
    const ranked = ISSUE_IDS;
    const req: MatchRequest = validRequest({
      ranked,
      notImportant: [],
      answers: ranked.map((issueId) => ({
        issueId,
        text: "א".repeat(MAX_ANSWER_CHARS),
        startingOptionId: null,
        edited: false,
      })),
      anythingElse: { text: "א".repeat(MAX_ANSWER_CHARS), importance: "minor" },
    });
    expect(check(req).ok).toBe(true);
    expect(new TextEncoder().encode(JSON.stringify(req)).length).toBeLessThan(MAX_BODY_BYTES);
  });

  it("rejects an oversized token", () => {
    expectInvalid(validRequest({ token: "t".repeat(5000) }));
  });
});

describe("error codes", () => {
  it("defines exactly the 7 contract codes with their HTTP statuses", () => {
    expect(Object.fromEntries(ERROR_CODES.map((c) => [c, ERROR_INFO[c].status]))).toEqual({
      validation: 400,
      content_version_mismatch: 409,
      abuse_check_failed: 403,
      rate_limited: 429,
      at_capacity: 503,
      election_over: 410,
      upstream_failure: 502,
    });
  });

  it("offers restart for a version mismatch and no action after the election", () => {
    expect(ERROR_INFO.content_version_mismatch.action).toBe("restart");
    expect(ERROR_INFO.election_over.action).toBe("none");
    expect(ERROR_INFO.upstream_failure.action).toBe("retry");
  });
});
