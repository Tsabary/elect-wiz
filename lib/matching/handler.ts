/**
 * The matching route's logic, independent of Next.js so it can be unit-tested.
 *
 * Order: election-over check → body size cap → JSON parse → contract validation
 * → forced mock scenario (non-production only) → implementation → output
 * re-validation → registry metadata (suppressed during blackout).
 *
 * PRIVACY: this module must never log request or response bodies, in any path
 * (PRD FR24, plan Security §1). It contains no logging calls at all.
 */
import { pollNoteFor } from "@/lib/content/polls";
import type { List, Party } from "@/lib/content/schemas";
import { devAffordancesEnabled } from "@/lib/env";
import {
  ERROR_INFO,
  MAX_BODY_BYTES,
  MAX_ENTRIES,
  MIN_ENTRIES,
  validateMatchRequest,
  type MatchEntry,
  type MatchErrorBody,
  type MatchErrorCode,
  type MatchOutputCore,
  type MatchResponse,
  type PartyMetadata,
} from "./contract";
import { isMockScenario, type MockScenario } from "./mock";
import { MatchError, type CorpusView, type MatchingImplementation } from "./types";

export interface HandlerDeps {
  corpus: CorpusView;
  surveyContentVersion: string;
  researchVersion: string;
  implementation: MatchingImplementation | null;
  now: Date;
  blackout: boolean;
  electionOver: boolean;
  env: Record<string, string | undefined>;
  /** Mock only: artificial latency so the loading state is visible. */
  mockDelayMs?: number;
}

/** Header or query parameter that forces a mock scenario outside production. */
export const MOCK_SCENARIO_HEADER = "x-mock-scenario";
export const MOCK_SCENARIO_PARAM = "mockScenario";

export function errorResponse(code: MatchErrorCode, details?: string[]): Response {
  const body: MatchErrorBody = { error: details?.length ? { code, details } : { code } };
  return Response.json(body, {
    status: ERROR_INFO[code].status,
    headers: { "cache-control": "no-store" },
  });
}

function forcedScenario(request: Request, env: HandlerDeps["env"]): MockScenario | undefined {
  if (!devAffordancesEnabled(env)) return undefined;
  const v =
    request.headers.get(MOCK_SCENARIO_HEADER) ??
    new URL(request.url).searchParams.get(MOCK_SCENARIO_PARAM);
  return isMockScenario(v) ? v : undefined;
}

export function partyMetadata(
  party: Party,
  locale: "he" | "en",
  corpus: CorpusView,
  blackout: boolean,
): PartyMetadata | null {
  const list: List | undefined = corpus.lists.find((l) => l.id === party.listId);
  if (!list) return null;
  const partners = list.memberPartyIds
    .filter((id) => id !== party.id)
    .map((id) => corpus.parties.find((p) => p.id === id))
    .filter((p): p is Party => !!p)
    .map((p) => ({ id: p.id, name: p.name[locale] }));
  return {
    name: party.name[locale],
    listId: list.id,
    listName: list.name[locale],
    ballotLetters: list.ballotLetters,
    isJointList: list.memberPartyIds.length > 1,
    partners,
    limitedInfo: party.limitedInfo,
    pollNote: pollNoteFor(list.poll, { blackout }),
  };
}

/** Re-validates implementation output; anything off is an upstream failure. */
function checkOutput(out: MatchOutputCore, corpus: CorpusView, ranked: string[]): boolean {
  if (!out || !Array.isArray(out.entries)) return false;
  if (
    out.entries.length < Math.min(MIN_ENTRIES, corpus.parties.length) ||
    out.entries.length > MAX_ENTRIES
  )
    return false;
  const ids = new Set<string>();
  for (const e of out.entries) {
    if (!corpus.parties.some((p) => p.id === e.partyId) || ids.has(e.partyId)) return false;
    ids.add(e.partyId);
    for (const b of e.breakdown) if (!ranked.includes(b.issueId)) return false;
  }
  return true;
}

export async function handleMatchRequest(request: Request, deps: HandlerDeps): Promise<Response> {
  if (deps.electionOver) return errorResponse("election_over");

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return errorResponse("validation", [`request body exceeds ${MAX_BODY_BYTES} bytes`]);
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return errorResponse("validation", ["request body is not valid JSON"]);
  }

  const scenario = forcedScenario(request, deps.env);
  // Forced validation/version errors are returned as-is, so the UI can exercise them.
  if (scenario === "error-validation") return errorResponse("validation");
  if (scenario === "error-content_version_mismatch")
    return errorResponse("content_version_mismatch");
  if (scenario === "error-election_over") return errorResponse("election_over");

  const outcome = validateMatchRequest(body, {
    surveyContentVersion: deps.surveyContentVersion,
    issues: new Map(deps.corpus.issues.map((i) => [i.id, i.options.map((o) => o.id)])),
  });
  if (!outcome.ok) return errorResponse(outcome.code, outcome.details);
  const req = outcome.request;

  if (!deps.implementation) return errorResponse("upstream_failure");

  let out: MatchOutputCore;
  try {
    out = await deps.implementation.match(req, deps.corpus, {
      scenario,
      delayMs: deps.mockDelayMs,
    });
  } catch (e) {
    return errorResponse(e instanceof MatchError ? e.code : "upstream_failure");
  }
  if (!checkOutput(out, deps.corpus, req.ranked)) return errorResponse("upstream_failure");

  const entries: MatchEntry[] = [];
  for (const e of out.entries) {
    const party = deps.corpus.parties.find((p) => p.id === e.partyId)!;
    const metadata = partyMetadata(party, req.locale, deps.corpus, deps.blackout);
    if (!metadata) return errorResponse("upstream_failure");
    entries.push({
      partyId: e.partyId,
      breakdown: e.breakdown,
      anythingElseNote: e.anythingElseNote ?? null,
      metadata,
    });
  }

  const response: MatchResponse = {
    entries,
    weakMatch: out.weakMatch,
    noUsableAnswers: out.noUsableAnswers,
    meta: {
      surveyContentVersion: deps.surveyContentVersion,
      researchVersion: deps.researchVersion,
      blackout: deps.blackout,
    },
  };
  return Response.json(response, { headers: { "cache-control": "no-store" } });
}
