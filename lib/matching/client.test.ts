import { describe, expect, it, vi } from "vitest";
import { validRequest } from "@/tests/fixtures/matching";
import { CLIENT_TIMEOUT_MS, ERROR_CODES } from "./contract";
import { errorInfo, errorMessageKey, submitMatch } from "./client";

const { token: _t, ...request } = validRequest();

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("submitMatch", () => {
  it("uses a 60 s default timeout", () => {
    expect(CLIENT_TIMEOUT_MS).toBe(60_000);
  });

  it("returns the result on success and sends the token from the hook", async () => {
    const fetchImpl = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse(200, { entries: [], weakMatch: false, noUsableAnswers: false, meta: {} }),
    );
    const tokenProvider = vi.fn(async () => "tok-1");
    const r = await submitMatch(request, { fetchImpl: fetchImpl as typeof fetch, tokenProvider });
    expect(r.ok).toBe(true);
    const sent = JSON.parse(fetchImpl.mock.calls[0][1]!.body as string);
    expect(sent.token).toBe("tok-1");
    expect(fetchImpl.mock.calls[0][0]).toBe("/api/match");
    expect(fetchImpl.mock.calls[0][1]!.method).toBe("POST");
  });

  it("calls the token-provider hook on every submission attempt (submit and each retry)", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(502, { error: { code: "upstream_failure" } }));
    let n = 0;
    const tokenProvider = vi.fn(async () => `tok-${++n}`);
    await submitMatch(request, { fetchImpl: fetchImpl as typeof fetch, tokenProvider });
    await submitMatch(request, { fetchImpl: fetchImpl as typeof fetch, tokenProvider });
    await submitMatch(request, { fetchImpl: fetchImpl as typeof fetch, tokenProvider });
    expect(tokenProvider).toHaveBeenCalledTimes(3);
    const tokens = (fetchImpl.mock.calls as unknown as [string, RequestInit][]).map(
      (c) => JSON.parse(c[1].body as string).token,
    );
    expect(tokens).toEqual(["tok-1", "tok-2", "tok-3"]);
  });

  it("sends a null token with the default no-op hook", async () => {
    const fetchImpl = vi.fn(async (_u: RequestInfo | URL, _i?: RequestInit) =>
      jsonResponse(200, { entries: [] }),
    );
    await submitMatch(request, { fetchImpl: fetchImpl as typeof fetch });
    expect(JSON.parse(fetchImpl.mock.calls[0][1]!.body as string).token).toBeNull();
  });

  it("maps a timeout to upstream_failure", async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn(
      (_url: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject(new DOMException("aborted", "AbortError")),
          );
        }),
    );
    const p = submitMatch(request, { fetchImpl: fetchImpl as typeof fetch });
    await vi.advanceTimersByTimeAsync(CLIENT_TIMEOUT_MS - 1);
    let settled = false;
    p.then(() => (settled = true));
    await Promise.resolve();
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(await p).toEqual({ ok: false, code: "upstream_failure" });
    vi.useRealTimers();
  });

  it("maps network errors and non-JSON bodies to upstream_failure", async () => {
    const failing = vi.fn(async () => {
      throw new TypeError("network");
    });
    expect(await submitMatch(request, { fetchImpl: failing as typeof fetch })).toEqual({
      ok: false,
      code: "upstream_failure",
    });
    const html = vi.fn(async () => new Response("<html>", { status: 500 }));
    expect(await submitMatch(request, { fetchImpl: html as typeof fetch })).toEqual({
      ok: false,
      code: "upstream_failure",
    });
  });

  it.each(ERROR_CODES)("passes through error code %s", async (code) => {
    const fetchImpl = vi.fn(async () => jsonResponse(400, { error: { code } }));
    expect(await submitMatch(request, { fetchImpl: fetchImpl as typeof fetch })).toEqual({
      ok: false,
      code,
    });
  });

  it("maps unknown error codes to upstream_failure", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(418, { error: { code: "teapot" } }));
    expect(await submitMatch(request, { fetchImpl: fetchImpl as typeof fetch })).toEqual({
      ok: false,
      code: "upstream_failure",
    });
  });

  it("reports abuse_check_failed when the token hook throws", async () => {
    const fetchImpl = vi.fn();
    const r = await submitMatch(request, {
      fetchImpl: fetchImpl as unknown as typeof fetch,
      tokenProvider: async () => {
        throw new Error("no token");
      },
    });
    expect(r).toEqual({ ok: false, code: "abuse_check_failed" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe("error mapping", () => {
  it.each(ERROR_CODES)("maps %s to a message key and an action", (code) => {
    expect(errorMessageKey(code)).toBe(`MatchErrors.${code}`);
    expect(["retry", "restart", "none"]).toContain(errorInfo(code).action);
  });

  it("has a localized message for every error code in both languages", async () => {
    for (const locale of ["he", "en"]) {
      const messages = (await import(`@/messages/${locale}.json`)).default as {
        MatchErrors: Record<string, string>;
      };
      for (const code of ERROR_CODES)
        expect(messages.MatchErrors[code], `${locale}:${code}`).toBeTruthy();
    }
  });
});
