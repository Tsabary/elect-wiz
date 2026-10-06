import { z } from "zod";

/** Lowercase ASCII kebab-case identifier used for issues, options, parties, lists. */
export const idSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase ascii kebab-case ([a-z0-9-])");

const nonEmpty = z.string().trim().min(1, "must not be empty");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be an ISO date YYYY-MM-DD");

export const localizedTextSchema = z.object({ he: nonEmpty, en: nonEmpty });
export type LocalizedText = z.infer<typeof localizedTextSchema>;

// ---------------------------------------------------------------- issues

const issueTextSchema = z.object({
  title: nonEmpty,
  description: nonEmpty,
  moreInfo: nonEmpty,
  question: nonEmpty,
});

export const issueOptionSchema = z.object({
  id: idSchema,
  en: nonEmpty,
  he: nonEmpty,
});

/** Allowed preset options per issue (owner decision 2026-10-06: Gaza has 5, Judea and Samaria 6). */
export const MIN_OPTIONS = 3;
export const MAX_OPTIONS = 6;

export const issueSchema = z.object({
  id: idSchema,
  en: issueTextSchema,
  he: issueTextSchema,
  options: z
    .array(issueOptionSchema)
    .min(MIN_OPTIONS, `needs ${MIN_OPTIONS}–${MAX_OPTIONS} options`)
    .max(MAX_OPTIONS, `needs ${MIN_OPTIONS}–${MAX_OPTIONS} options`),
});
export type Issue = z.infer<typeof issueSchema>;
export type IssueOption = z.infer<typeof issueOptionSchema>;

/** The survey always has exactly this many issues. */
export const ISSUE_COUNT = 10;

// ---------------------------------------------------------------- glossary

export const glossarySchema = z.object({
  terms: z.array(
    z.object({
      id: idSchema,
      en: nonEmpty,
      he: nonEmpty,
      avoid: z.object({ en: z.array(z.string()), he: z.array(z.string()) }).optional(),
      note: z.string().optional(),
    }),
  ),
});
export type Glossary = z.infer<typeof glossarySchema>;

// ---------------------------------------------------------------- versions

export const versionsSchema = z.object({
  /** Covers issues and options. Changing it invalidates in-progress surveys. */
  surveyContentVersion: nonEmpty,
  /** Covers research documents and poll snapshots. Never invalidates surveys. */
  researchVersion: nonEmpty,
});
export type Versions = z.infer<typeof versionsSchema>;

// ---------------------------------------------------------------- registry

export const sourceRefSchema = z.object({
  title: nonEmpty,
  url: z.url(),
  publisher: z.string().optional(),
  accessed: isoDate.optional(),
  authority: z.enum(["cec", "non-cec"]).optional(),
});
export type SourceRef = z.infer<typeof sourceRefSchema>;

/**
 * One poll contributing to an average. Israeli law (Elections (Modes of
 * Propaganda) Law s.16ה(ב)–(ג)) requires poll publications to disclose these
 * details; see research/legal-findings.md.
 */
export const constituentPollSchema = z.object({
  pollster: nonEmpty,
  commissionedBy: z.string().optional(),
  media: z.string().optional(),
  fieldworkDates: z.string().optional(),
  publishedOn: isoDate,
  population: z.string().optional(),
  sampleSize: z.number().int().positive().optional(),
  marginOfError: z.string().optional(),
  percent: z.number().min(0).max(100).optional(),
  url: z.url(),
});
export type ConstituentPoll = z.infer<typeof constituentPollSchema>;

export const pollSnapshotSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("polled"),
    /** Polling average, percent of the vote (0–100). */
    percent: z.number().min(0).max(100),
    source: sourceRefSchema,
    asOf: isoDate,
    /** How the average was formed, e.g. "mean of the last 5 polls". */
    method: z.string().optional(),
    constituentPolls: z.array(constituentPollSchema).optional(),
  }),
  z.object({
    status: z.literal("not_polled"),
    source: sourceRefSchema,
    asOf: isoDate,
  }),
  /** Not yet recorded (Stage 6 pending). Invalid in the active corpus. */
  z.object({ status: z.literal("pending") }),
]);
export type PollSnapshot = z.infer<typeof pollSnapshotSchema>;

export const listStatusSchema = z.enum([
  "approved",
  "pending_approval",
  "under_appeal",
  "disqualified",
  "withdrawn",
]);

export const listSchema = z.object({
  id: idSchema,
  name: localizedTextSchema,
  /** Hebrew letters exactly as on the ballot slip; empty if not yet assigned. */
  ballotLetters: z.string(),
  memberPartyIds: z.array(idSchema).min(1),
  topCandidates: z.array(localizedTextSchema).default([]),
  status: listStatusSchema.default("approved"),
  poll: pollSnapshotSchema,
  sources: z.array(sourceRefSchema).min(1, "every list needs at least one source"),
  notes: z.string().optional(),
});
export type List = z.infer<typeof listSchema>;

export const partySchema = z.object({
  id: idSchema,
  name: localizedTextSchema,
  listId: idSchema,
  leader: localizedTextSchema,
  limitedInfo: z.boolean(),
  researchedAsOf: isoDate.nullable(),
  sources: z.array(sourceRefSchema).optional(),
});
export type Party = z.infer<typeof partySchema>;

export const listsFileSchema = z.object({ lists: z.array(listSchema) });
export const partiesFileSchema = z.object({ parties: z.array(partySchema) });

// ---------------------------------------------------------------- research documents

/**
 * The fixed 9-section skeleton (PRD FR12), in order. Anchors are stable and
 * identical across languages.
 */
export const RESEARCH_SECTIONS = [
  "overview",
  "leadership",
  "issues",
  "other-positions",
  "coalition",
  "track-record",
  "legal",
  "sources",
  "information-availability",
] as const;
export type ResearchSectionId = (typeof RESEARCH_SECTIONS)[number];

export const ISSUE_ANCHOR_PREFIX = "issue-";
export const OTHER_ANCHOR_PREFIX = "other-";
export const issueAnchor = (issueId: string) => `${ISSUE_ANCHOR_PREFIX}${issueId}`;
