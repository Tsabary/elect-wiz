/**
 * POST /api/match — the matching route (contract in lib/matching/contract.ts).
 * Delegates to the implementation selected by MATCHING_IMPL (Phase 1: "mock").
 * Never logs request or response bodies.
 */
import { getIssues, getLists, getParties, getVersions } from "@/lib/content/loaders";
import { handleMatchRequest } from "@/lib/matching/handler";
import { selectImplementation } from "@/lib/matching/registry";
import { isElectionOver, isPollBlackout } from "@/lib/time-modes";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const now = new Date();
  const versions = getVersions();
  return handleMatchRequest(request, {
    corpus: { issues: getIssues(), parties: getParties(), lists: getLists() },
    surveyContentVersion: versions.surveyContentVersion,
    researchVersion: versions.researchVersion,
    implementation: selectImplementation(),
    now,
    blackout: isPollBlackout(now),
    electionOver: isElectionOver(now),
    env: process.env,
    mockDelayMs: Number(process.env.MOCK_DELAY_MS ?? 0) || 0,
  });
}
