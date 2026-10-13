/**
 * POST /api/tally — the anonymous daily counts (lib/tally/counter.ts): that a
 * survey was started, or which parties a result put on top. The only server
 * call the survey makes; it carries no answers.
 *
 * Never logs request bodies, stores nothing about the visitor, and has no
 * per-IP limit. Rejects everything once the election is over.
 */
import { getParties } from "@/lib/content/loaders";
import { researchedPartyIds } from "@/lib/content/party-view";
import { counterStoreFromEnv } from "@/lib/tally/counter";
import { handleTallyRequest } from "@/lib/tally/handler";
import { isElectionOver, requestClockOverride, resolveNow } from "@/lib/time-modes";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  // Non-production only: a clock-override cookie/header lets tests and reviewers
  // exercise the election-over mode (ignored in production).
  const now = resolveNow({ env: process.env, override: requestClockOverride(request) });
  return handleTallyRequest(request, {
    store: counterStoreFromEnv(),
    researchedPartyIds: researchedPartyIds(getParties()),
    now,
    electionOver: isElectionOver(now),
  });
}
