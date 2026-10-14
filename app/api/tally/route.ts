/**
 * POST /api/tally — the anonymous daily counts (lib/tally/counter.ts): that a
 * survey was started, which parties a result put on top, or that a result link
 * was shared (and whether with answers). The only server call the survey makes;
 * it carries no answers.
 *
 * Never logs request bodies, stores nothing about the visitor, and has no
 * per-IP limit. Rejects everything once the election is over, and counts only
 * in production (lib/tally/handler.ts, `tallyContext`).
 */
import { getParties } from "@/lib/content/loaders";
import { researchedPartyIds } from "@/lib/content/party-view";
import { handleTallyRequest, tallyContext } from "@/lib/tally/handler";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleTallyRequest(
    request,
    tallyContext(request, { researchedPartyIds: researchedPartyIds(getParties()) }),
  );
}
