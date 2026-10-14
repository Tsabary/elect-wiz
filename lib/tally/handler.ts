/**
 * The tally route's logic, apart from the route file so it can be tested with a
 * stand-in store: `POST /api/tally` (plan "Security" → "Tally endpoint").
 *
 * Never logs the request or its body, keeps nothing about the visitor, and has
 * no per-IP limit (that would mean keeping something derived from the address).
 */
import { isElectionOver, requestClockOverride, resolveNow, timeConfig } from "../time-modes";
import {
  counterStoreFromEnv,
  parseTallyBody,
  recordTally,
  TALLY_MAX_BODY_BYTES,
  type CounterStore,
} from "./counter";

export interface TallyContext {
  /** The store, or null when none is configured: the call is checked and nothing is counted. */
  store: CounterStore | null;
  researchedPartyIds: readonly string[];
  /** The real time: it picks the day a call is counted under. */
  now: Date;
  electionOver: boolean;
}

/**
 * The route's context for one request.
 *
 * - Only production counts: previews, local runs and the end-to-end tests check
 *   each call and answer as production would, but never write, even when the
 *   store's settings are present (`.env.local`, a preview connected to the store).
 * - The day a call is counted under always comes from the real clock. The
 *   clock override (non-production only) moves just the after-close rejection,
 *   so tests and reviewers can exercise it.
 */
export function tallyContext(
  request: Request,
  opts: {
    researchedPartyIds: readonly string[];
    env?: Record<string, string | undefined>;
    realNow?: Date;
    fetchImpl?: typeof fetch;
  },
): TallyContext {
  const env = opts.env ?? process.env;
  const realNow = opts.realNow ?? new Date();
  const clock = resolveNow({ env, override: requestClockOverride(request), realNow });
  return {
    // Only the real deployment counts. Not `deploymentEnv`, which also calls a local
    // `next start` production: with .env.local's store settings it would count too.
    store: env.VERCEL_ENV === "production" ? counterStoreFromEnv(env, opts.fetchImpl) : null,
    researchedPartyIds: opts.researchedPartyIds,
    now: realNow,
    electionOver: isElectionOver(clock, timeConfig(env)),
  };
}

const empty = (status: number) =>
  new Response(null, { status, headers: { "cache-control": "no-store" } });

/**
 * Only the site's own pages may call. A form or a `text/plain` fetch from another
 * site is a "simple" request that the browser sends without asking first, so the
 * route insists on JSON (which another site can't send without a CORS preflight,
 * which this route never answers) and, when the browser says where the call came
 * from (`Sec-Fetch-Site`), on the same origin.
 */
function fromAnotherSite(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  return site !== null && site !== "same-origin";
}

function isJson(request: Request): boolean {
  const type = request.headers.get("content-type") ?? "";
  return type.split(";")[0].trim().toLowerCase() === "application/json";
}

/**
 * 204 for a valid call (counted, or accepted with no store); 410 once the
 * election is over; 403 for a call another site's page made; 415 for a body
 * that isn't declared JSON; 413 for a body over the cap; 400 for anything else
 * that isn't a valid call; 503 when the store failed. No response has a body.
 */
export async function handleTallyRequest(request: Request, ctx: TallyContext): Promise<Response> {
  if (ctx.electionOver) return empty(410);
  if (fromAnotherSite(request)) return empty(403);
  if (!isJson(request)) return empty(415);

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > TALLY_MAX_BODY_BYTES) return empty(413);
  let text: string;
  try {
    text = await request.text();
  } catch {
    return empty(400);
  }
  if (new TextEncoder().encode(text).length > TALLY_MAX_BODY_BYTES) return empty(413);

  const call = parseTallyBody(text, ctx.researchedPartyIds);
  if (!call) return empty(400);
  if (!ctx.store) return empty(204);

  try {
    await recordTally(ctx.store, call, ctx.now);
  } catch {
    // Swallowed: the platform's function log shows the status and nothing else.
    return empty(503);
  }
  return empty(204);
}
