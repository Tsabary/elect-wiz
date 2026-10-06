/**
 * The matching contract (plan "APIs & interfaces", Phase 1 §1). Fixed now; the
 * mock implements it in Phase 1 and the real backend replaces the
 * implementation in Phase 2 without UI changes.
 */
import { z } from "zod";
import type { PollNote } from "@/lib/content/polls";

// ------------------------------------------------------------------ limits

export const MIN_RANKED = 5;
export const MAX_RANKED = 10;
export const MAX_NOT_IMPORTANT = 5;
/** Per free-text answer (and the "anything else" text). */
export const MAX_ANSWER_CHARS = 1000;
/**
 * Total size cap: the raw request body, checked before parsing. Sized to fit
 * the largest legitimate request (10 answers + "anything else" at the
 * per-answer cap, in Hebrew at 2 bytes per character) with headroom.
 */
export const MAX_BODY_BYTES = 32 * 1024;
/** Client-side timeout; a timeout is shown as `upstream_failure`. */
export const CLIENT_TIMEOUT_MS = 60_000;

// ------------------------------------------------------------------ errors

export const ERROR_CODES = [
  "validation",
  "content_version_mismatch",
  "abuse_check_failed",
  "rate_limited",
  "at_capacity",
  "election_over",
  "upstream_failure",
] as const;
export type MatchErrorCode = (typeof ERROR_CODES)[number];

export interface ErrorInfo {
  status: number;
  /** What the UI offers: "retry" calls the token hook and resubmits; "restart" starts a new survey. */
  action: "retry" | "restart" | "none";
}

export const ERROR_INFO: Record<MatchErrorCode, ErrorInfo> = {
  validation: { status: 400, action: "restart" },
  content_version_mismatch: { status: 409, action: "restart" },
  abuse_check_failed: { status: 403, action: "retry" },
  rate_limited: { status: 429, action: "retry" },
  at_capacity: { status: 503, action: "retry" },
  election_over: { status: 410, action: "none" },
  upstream_failure: { status: 502, action: "retry" },
};

export function isMatchErrorCode(v: unknown): v is MatchErrorCode {
  return typeof v === "string" && (ERROR_CODES as readonly string[]).includes(v);
}

export interface MatchErrorBody {
  error: { code: MatchErrorCode; details?: string[] };
}

// ------------------------------------------------------------------ request

export const ANYTHING_ELSE_IMPORTANCE = ["above-top", "middle", "minor"] as const;
export type AnythingElseImportance = (typeof ANYTHING_ELSE_IMPORTANCE)[number];

export const answerSchema = z.object({
  issueId: z.string(),
  /** The user's final answer text (a preset as written, an edited preset, or their own text). */
  text: z.string().max(MAX_ANSWER_CHARS, `answer exceeds ${MAX_ANSWER_CHARS} characters`),
  /** The preset option the answer started from, or null for a write-your-own answer. */
  startingOptionId: z.string().nullable(),
  edited: z.boolean(),
});
export type MatchAnswer = z.infer<typeof answerSchema>;

export const matchRequestSchema = z.object({
  locale: z.enum(["he", "en"]),
  surveyContentVersion: z.string().min(1),
  /** Issue IDs ranked 1 (most important) … n. */
  ranked: z.array(z.string()).min(MIN_RANKED).max(MAX_RANKED),
  /** "Doesn't matter to me" issue IDs. */
  notImportant: z.array(z.string()).max(MAX_NOT_IMPORTANT),
  answers: z.array(answerSchema),
  anythingElse: z
    .object({
      text: z
        .string()
        .max(MAX_ANSWER_CHARS, `"anything else" exceeds ${MAX_ANSWER_CHARS} characters`),
      importance: z.enum(ANYTHING_ELSE_IMPORTANCE),
    })
    .nullable()
    .optional(),
  /** Abuse-protection token from the token-provider hook. Null under the mock. */
  token: z.string().max(4096).nullable(),
});
export type MatchRequest = z.infer<typeof matchRequestSchema>;

export interface ValidationContext {
  surveyContentVersion: string;
  /** Issue ID → its option IDs. */
  issues: ReadonlyMap<string, readonly string[]>;
}

export type ValidationOutcome =
  | { ok: true; request: MatchRequest }
  | { ok: false; code: "validation" | "content_version_mismatch"; details: string[] };

/** Validates a parsed JSON body against the contract and the current survey content. */
export function validateMatchRequest(body: unknown, ctx: ValidationContext): ValidationOutcome {
  const parsed = matchRequestSchema.safeParse(body);
  if (!parsed.success) {
    // A stale client is told to restart even if the rest of its payload is off.
    const version = (body as { surveyContentVersion?: unknown } | null)?.surveyContentVersion;
    if (typeof version === "string" && version !== ctx.surveyContentVersion) {
      return {
        ok: false,
        code: "content_version_mismatch",
        details: ["survey content was updated"],
      };
    }
    return {
      ok: false,
      code: "validation",
      details: parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`),
    };
  }
  const req = parsed.data;
  if (req.surveyContentVersion !== ctx.surveyContentVersion) {
    return { ok: false, code: "content_version_mismatch", details: ["survey content was updated"] };
  }

  const details: string[] = [];
  const known = ctx.issues;
  const ranked = new Set(req.ranked);
  const notImportant = new Set(req.notImportant);

  for (const id of [...req.ranked, ...req.notImportant]) {
    if (!known.has(id)) details.push(`unknown issue id "${id}"`);
  }
  if (ranked.size !== req.ranked.length) details.push("ranked issues must be unique (no ties)");
  if (notImportant.size !== req.notImportant.length)
    details.push('"doesn\'t matter" issues must be unique');
  for (const id of notImportant)
    if (ranked.has(id)) details.push(`issue "${id}" is both ranked and "doesn't matter"`);
  const covered = new Set([...ranked, ...notImportant]);
  for (const id of known.keys())
    if (!covered.has(id)) details.push(`issue "${id}" is neither ranked nor "doesn't matter"`);

  const answered = new Set<string>();
  for (const a of req.answers) {
    if (!ranked.has(a.issueId)) {
      details.push(`answer for issue "${a.issueId}", which isn't ranked`);
      continue;
    }
    if (answered.has(a.issueId)) details.push(`more than one answer for issue "${a.issueId}"`);
    answered.add(a.issueId);
    if (a.startingOptionId !== null && !known.get(a.issueId)?.includes(a.startingOptionId)) {
      details.push(`unknown option "${a.startingOptionId}" for issue "${a.issueId}"`);
    }
    if (a.startingOptionId === null && a.edited) {
      details.push(`answer for "${a.issueId}" is marked edited but has no starting option`);
    }
  }
  for (const id of ranked)
    if (!answered.has(id)) details.push(`missing answer for ranked issue "${id}"`);

  return details.length ? { ok: false, code: "validation", details } : { ok: true, request: req };
}

// ------------------------------------------------------------------ response

export const AGREEMENT_LEVELS = [
  "agrees",
  "partially",
  "disagrees",
  "party-position-unclear",
] as const;
export type AgreementLevel = (typeof AGREEMENT_LEVELS)[number];

export interface IssueBreakdown {
  issueId: string;
  /** The user's rank for this issue (1 = most important). */
  rank: number;
  /** Computed weight, if the matching architecture produces one. */
  weight?: number;
  agreement: AgreementLevel;
  /** Explanation in the request's UI language. */
  explanation: string;
  /** Anchor in the party's research document (e.g. "issue-cost-of-living"). */
  anchor: string;
}

export interface AnythingElseNote {
  explanation: string;
  /** A section-3 or section-4 anchor. */
  anchor: string;
}

/** What a matching implementation produces. Contains no registry facts. */
export interface MatchEntryCore {
  partyId: string;
  breakdown: IssueBreakdown[];
  anythingElseNote?: AnythingElseNote | null;
}

export interface MatchOutputCore {
  /** Top match first, then 2–3 runners-up. */
  entries: MatchEntryCore[];
  weakMatch: boolean;
  /** True when no answer was usable: the entries are the closest matches and weakMatch is set. */
  noUsableAnswers: boolean;
}

/** Factual metadata attached by the route from the registry, never by the matcher. */
export interface PartyMetadata {
  name: string;
  listId: string;
  listName: string;
  ballotLetters: string;
  isJointList: boolean;
  partners: { id: string; name: string }[];
  limitedInfo: boolean;
  /** Threshold or not-polled note; always null during the poll blackout. */
  pollNote: PollNote | null;
}

export interface MatchEntry extends MatchEntryCore {
  metadata: PartyMetadata;
}

export interface MatchResponse {
  entries: MatchEntry[];
  weakMatch: boolean;
  noUsableAnswers: boolean;
  meta: { surveyContentVersion: string; researchVersion: string; blackout: boolean };
}

export const MIN_ENTRIES = 3;
export const MAX_ENTRIES = 4;
