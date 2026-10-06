/**
 * Browser client for the matching route.
 *
 * - 60 s timeout, reported as `upstream_failure`.
 * - Every submission attempt (first submit and each "try again") calls the
 *   token-provider hook for a fresh abuse-protection token. Under the mock the
 *   hook returns null; Phase 2 plugs in e.g. a Turnstile token fetch.
 * - Maps error codes to message keys and the action the UI should offer.
 */
import {
  CLIENT_TIMEOUT_MS,
  ERROR_INFO,
  isMatchErrorCode,
  type ErrorInfo,
  type MatchErrorCode,
  type MatchRequest,
  type MatchResponse,
} from "./contract";

export type TokenProvider = () => Promise<string | null>;

/** Phase 1: no abuse protection. */
export const noopTokenProvider: TokenProvider = async () => null;

export const MATCH_ENDPOINT = "/api/match";

export type SubmitResult =
  { ok: true; result: MatchResponse } | { ok: false; code: MatchErrorCode };

export interface SubmitOptions {
  tokenProvider?: TokenProvider;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  endpoint?: string;
  /** Development/preview only: forces a mock scenario (ignored by the server in production). */
  mockScenario?: string;
}

export async function submitMatch(
  request: Omit<MatchRequest, "token">,
  opts: SubmitOptions = {},
): Promise<SubmitResult> {
  const {
    tokenProvider = noopTokenProvider,
    timeoutMs = CLIENT_TIMEOUT_MS,
    fetchImpl = fetch,
    endpoint = MATCH_ENDPOINT,
  } = opts;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let token: string | null;
    try {
      token = await tokenProvider();
    } catch {
      return { ok: false, code: "abuse_check_failed" };
    }
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (opts.mockScenario) headers["x-mock-scenario"] = opts.mockScenario;
    const res = await fetchImpl(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...request, token } satisfies MatchRequest),
      signal: controller.signal,
      cache: "no-store",
    });
    let data: unknown;
    try {
      data = await res.json();
    } catch {
      return { ok: false, code: "upstream_failure" };
    }
    if (res.ok) return { ok: true, result: data as MatchResponse };
    const code = (data as { error?: { code?: unknown } } | null)?.error?.code;
    return { ok: false, code: isMatchErrorCode(code) ? code : "upstream_failure" };
  } catch {
    // Network failure or timeout (abort).
    return { ok: false, code: "upstream_failure" };
  } finally {
    clearTimeout(timer);
  }
}

/** next-intl message key for an error code, under the `MatchErrors` namespace. */
export function errorMessageKey(code: MatchErrorCode): `MatchErrors.${MatchErrorCode}` {
  return `MatchErrors.${code}`;
}

export function errorInfo(code: MatchErrorCode): ErrorInfo {
  return ERROR_INFO[code];
}
