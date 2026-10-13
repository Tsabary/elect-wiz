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
  /** Names the matching bundle for caching. Shown nowhere; never invalidates surveys. */
  matchingVersion: nonEmpty,
  /**
   * `"pending"` while the real corpus's Hebrew research editions and Hebrew
   * result texts are still being written (see `hebrewContentPending` in
   * `config.ts`). Absent means `"ready"`.
   */
  hebrewContent: z.enum(["pending", "ready"]).optional(),
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

/**
 * `researched`: has research documents and takes part in matching.
 * `listed`: on the ballot, shown with registry facts only (owner decision 2026-10-13).
 */
export const PARTY_TIERS = ["researched", "listed"] as const;
export type PartyTier = (typeof PARTY_TIERS)[number];

/** A listed party's own platform page. Unchecked by us beyond the date it was seen. */
export const platformLinkSchema = z.object({
  url: z.url({ protocol: /^https$/, error: "must be an https URL" }),
  checkedOn: isoDate,
});
export type PlatformLink = z.infer<typeof platformLinkSchema>;

export const partySchema = z.object({
  id: idSchema,
  name: localizedTextSchema,
  listId: idSchema,
  leader: localizedTextSchema,
  tier: z.enum(PARTY_TIERS),
  /** Meaningful only for `researched` parties. */
  limitedInfo: z.boolean(),
  /** Set for `researched` parties, null for `listed` ones. */
  researchedAsOf: isoDate.nullable(),
  /** Only on `listed` parties. */
  platform: platformLinkSchema.optional(),
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

// ---------------------------------------------------------------- matching content

/**
 * The matching content (plan-deterministic-matching.md, Data model §2–§6), under
 * `content/matching/` per corpus. Everything here is plain zod with no Node or
 * `server-only` import, because the browser's scoring code uses these types.
 */

/** A value on the 0–1 scale all scoring numbers use. */
const unit = z.number().min(0, "must be between 0 and 1").max(1, "must be between 0 and 1");

/**
 * How firmly a party holds an option:
 * - `main`: the party's position (at most one per row);
 * - `either`: two or more options the evidence can't tell apart;
 * - `secondary`: an option the party also partly holds.
 */
export const POSITION_LEVELS = ["main", "either", "secondary"] as const;
export type PositionLevel = (typeof POSITION_LEVELS)[number];

export const heldOptionSchema = z.object({
  optionId: idSchema,
  level: z.enum(POSITION_LEVELS),
});
export type HeldOption = z.infer<typeof heldOptionSchema>;

export const positionRowSchema = z.object({
  partyId: idSchema,
  /** True when the research has no documented position; `held` is then empty. */
  unclear: z.boolean(),
  held: z.array(heldOptionSchema),
  /**
   * Options the research says the party rejects (it voted against them, or the
   * line rules them out). Only the label uses this, not the score: a rejected
   * option always reads as "disagrees".
   */
  ruledOut: z.array(idSchema).optional(),
  /** The research sub-section the row rests on: `issue-<issueId>`. */
  anchor: nonEmpty,
  /** One-line reason, for the reviewer. Never shown on the site. */
  basis: nonEmpty,
});
export type PositionRow = z.infer<typeof positionRowSchema>;

/** `matching/positions/<issueId>.json`: one row per researched party. */
export const positionsFileSchema = z.object({
  issueId: idSchema,
  rows: z.array(positionRowSchema),
});
export type PositionsFile = z.infer<typeof positionsFileSchema>;

export const distancePairSchema = z.object({
  a: idSchema,
  b: idSchema,
  /** 1 = the same position, 0 = opposite. */
  closeness: unit,
  /** One-line reason, for the reviewer. Never shown on the site. */
  reason: nonEmpty,
});
export type DistancePair = z.infer<typeof distancePairSchema>;

/**
 * `matching/distances/<issueId>.json`: the closeness of each unordered pair of
 * that issue's options, stored once. An option's closeness to itself is 1 and
 * is not stored.
 */
export const distancesFileSchema = z.object({
  issueId: idSchema,
  pairs: z.array(distancePairSchema),
});
export type DistancesFile = z.infer<typeof distancesFileSchema>;

/** Order-independent key of an option pair. */
export const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

/** Every unordered pair of the given option IDs: what a complete grid holds. */
export function optionPairs(optionIds: readonly string[]): [string, string][] {
  const out: [string, string][] = [];
  for (let i = 0; i < optionIds.length; i++)
    for (let j = i + 1; j < optionIds.length; j++) out.push([optionIds[i], optionIds[j]]);
  return out;
}

/** The agreement levels a result text can be written for (an unclear issue has its own text). */
export const TEXT_AGREEMENTS = ["agrees", "partially", "disagrees"] as const;
export type TextAgreement = (typeof TEXT_AGREEMENTS)[number];
/**
 * What an option text may be written for. "party-position-unclear" is the label
 * for an option the party isn't linked to when its whole row is tentative.
 */
export const OPTION_TEXT_AGREEMENTS = [...TEXT_AGREEMENTS, "party-position-unclear"] as const;

export const optionTextSchema = z.object({
  /** The level the author wrote the text for; validation compares it with the computed label. */
  agreement: z.enum(OPTION_TEXT_AGREEMENTS),
  text: nonEmpty,
});
export type OptionText = z.infer<typeof optionTextSchema>;

export const issueTextsSchema = z
  .object({
    /** `issue-<issueId>`. */
    anchor: nonEmpty,
    /** One text per option of the issue, for a user who chose that option. */
    options: z.record(idSchema, optionTextSchema).optional(),
    /** The party's position is unclear: one text serves all of the issue's options. */
    unclear: z.object({ text: nonEmpty }).optional(),
  })
  .refine((v) => (v.options === undefined) !== (v.unclear === undefined), {
    error: 'needs exactly one of "options" or "unclear"',
  });
export type IssueTexts = z.infer<typeof issueTextsSchema>;

export const matchPointSchema = z.object({
  text: nonEmpty,
  /** An `other-…` anchor in the party's research document. */
  anchor: nonEmpty,
});

/** `matching/texts/<lang>/<partyId>.json`: one researched party's result texts in one language. */
export const partyTextsSchema = z.object({
  partyId: idSchema,
  lang: z.enum(["en", "he"]),
  issues: z.record(idSchema, issueTextsSchema),
  /** "Also worth knowing" points. */
  points: z.array(matchPointSchema),
});
export type PartyTexts = z.infer<typeof partyTextsSchema>;

/** `matching/config.json`: the scoring constants, kept as content so they can be tuned without a code change. */
export const matchingConfigSchema = z
  .object({
    /** What a held option of each level is worth before closeness is applied. */
    levels: z.object({ main: unit, either: unit, secondary: unit }),
    /** The issue score of a party whose position is unclear. */
    unclear: unit,
    /** Lowest issue score that still gets each agreement label; below `partially` is "disagrees". */
    agreement: z.object({ agrees: unit, partially: unit }),
    /** A top score below this is a weak match. */
    weakMatchBelow: unit,
    /**
     * The most an option can score for a party the research says rejected it,
     * however close it is to the option the party holds.
     */
    ruledOutMax: unit,
  })
  .refine((v) => v.agreement.partially <= v.agreement.agrees, {
    path: ["agreement"],
    error: '"partially" must not be above "agrees"',
  })
  .refine((v) => v.ruledOutMax < v.agreement.partially, {
    path: ["ruledOutMax"],
    error: '"ruledOutMax" must be below "partially", so a rejected option scores as a disagreement',
  });
export type MatchingConfig = z.infer<typeof matchingConfigSchema>;

/** Survey limits on ranked issues (PRD FR5), repeated here for the profiles. */
const PROFILE_MIN_RANKED = 5;
const PROFILE_MAX_RANKED = 10;

export const voterProfileSchema = z.object({
  id: idSchema,
  description: nonEmpty,
  /** Issue IDs ranked 1 (most important) … n. */
  ranked: z
    .array(idSchema)
    .min(PROFILE_MIN_RANKED, `needs ${PROFILE_MIN_RANKED}–${PROFILE_MAX_RANKED} ranked issues`)
    .max(PROFILE_MAX_RANKED, `needs ${PROFILE_MIN_RANKED}–${PROFILE_MAX_RANKED} ranked issues`),
  /** Issue ID → the chosen option ID, one per ranked issue. */
  answers: z.record(idSchema, idSchema),
  /** The outcome expected, written before any score was seen. */
  expect: z.object({
    /** The top match must be one of these. */
    topAnyOf: z.array(idSchema).min(1),
    inTop4: z.array(idSchema).optional(),
    notInTop4: z.array(idSchema).optional(),
  }),
  reason: nonEmpty,
});
export type VoterProfile = z.infer<typeof voterProfileSchema>;

/** `matching/profiles.json`: invented voters for the profile test (PRD requirement 40). */
export const profilesFileSchema = z.object({ profiles: z.array(voterProfileSchema) });
export type ProfilesFile = z.infer<typeof profilesFileSchema>;
