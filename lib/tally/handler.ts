/**
 * The tally route's logic, apart from the route file so it can be tested with a
 * stand-in store: `POST /api/tally` (plan "Security" → "Tally endpoint").
 *
 * Never logs the request or its body, keeps nothing about the visitor, and has
 * no per-IP limit (that would mean keeping something derived from the address).
 */
import { parseTallyBody, recordTally, TALLY_MAX_BODY_BYTES, type CounterStore } from "./counter";

export interface TallyContext {
  /** The store, or null when none is configured: the call is checked and nothing is counted. */
  store: CounterStore | null;
  researchedPartyIds: readonly string[];
  now: Date;
  electionOver: boolean;
}

const empty = (status: number) =>
  new Response(null, { status, headers: { "cache-control": "no-store" } });

/**
 * 204 for a valid call (counted, or accepted with no store); 410 once the
 * election is over; 413 for a body over the cap; 400 for anything else that
 * isn't a valid call; 503 when the store failed. No response has a body.
 */
export async function handleTallyRequest(request: Request, ctx: TallyContext): Promise<Response> {
  if (ctx.electionOver) return empty(410);

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
