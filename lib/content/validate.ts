/**
 * Content validation (plan Testing §1). Pure: takes the raw corpus as read from
 * disk (see `read-raw.ts`) and returns every rule violation. Run at build time by
 * `scripts/validate-content.ts`; any error blocks the build.
 */
import type { z } from "zod";
import { issueAgreement, MatchDataError } from "../matching/score";
import { CORPUS_DIRS, RESEARCH_LANGS, type CorpusName, type ResearchLang } from "./config";
import { findPollFigures } from "./poll-figures";
import {
  hasClosestOptionsLine,
  parseResearchDoc,
  researchProse,
  type ParsedResearchDoc,
} from "./research-parser";
import {
  distancesFileSchema,
  glossarySchema,
  ISSUE_ANCHOR_PREFIX,
  ISSUE_COUNT,
  issueAnchor,
  issueSchema,
  listsFileSchema,
  matchingConfigSchema,
  optionPairs,
  OTHER_ANCHOR_PREFIX,
  pairKey,
  partiesFileSchema,
  partyTextsSchema,
  positionsFileSchema,
  profilesFileSchema,
  RESEARCH_SECTIONS,
  versionsSchema,
  type DistancesFile,
  type Issue,
  type List,
  type MatchingConfig,
  type Party,
  type PartyTexts,
  type PositionRow,
  type PositionsFile,
  type VoterProfile,
} from "./schemas";

export type RuleId =
  | "json-parse"
  | "issue-schema"
  | "issue-count"
  | "issue-id-filename"
  | "issue-duplicate"
  | "option-duplicate"
  | "glossary-schema"
  | "glossary-duplicate"
  | "versions-schema"
  | "registry-missing"
  | "registry-schema"
  | "registry-duplicate"
  | "registry-unknown-list"
  | "registry-membership"
  | "registry-tier"
  | "poll-snapshot-missing"
  | "research-missing"
  | "research-orphan"
  | "research-listed"
  | "research-frontmatter"
  | "research-structure"
  | "research-sections"
  | "research-issue-subsections"
  | "research-other-subsections"
  | "research-duplicate-anchor"
  | "research-anchor-parity"
  | "research-sources"
  | "research-citations"
  | "research-date"
  | "poll-figure"
  | "positions-schema"
  | "positions-issue"
  | "positions-party"
  | "positions-option"
  | "positions-levels"
  | "positions-anchor"
  | "positions-missing"
  | "positions-research"
  | "distances-schema"
  | "distances-issue"
  | "distances-option"
  | "distances-duplicate"
  | "distances-missing"
  | "texts-schema"
  | "texts-file"
  | "texts-party"
  | "texts-issue"
  | "texts-option"
  | "texts-anchor"
  | "texts-missing"
  | "texts-parity"
  | "texts-points"
  | "texts-agreement"
  | "matching-config-schema"
  | "matching-config-missing"
  | "profiles-schema"
  | "profiles-content";

export interface ValidationError {
  rule: RuleId;
  file: string;
  message: string;
}

export interface RawFile {
  /** Path relative to the content root, for messages. */
  file: string;
  raw: string;
}

export interface RawCorpusSet {
  name: CorpusName;
  active: boolean;
  lists: RawFile | null;
  parties: RawFile | null;
  /** Research documents keyed by language. */
  research: Record<ResearchLang, RawFile[]>;
  matching: RawMatching;
}

/** The matching content of one corpus (plan-deterministic-matching.md, Data model §2–§6). */
export interface RawMatching {
  /** One file per issue. */
  positions: RawFile[];
  /** One file per issue. */
  distances: RawFile[];
  /** One file per party, keyed by language. */
  texts: Record<ResearchLang, RawFile[]>;
  config: RawFile | null;
  profiles: RawFile | null;
}

/** A corpus with no matching content yet. */
export const emptyMatching = (): RawMatching => ({
  positions: [],
  distances: [],
  texts: { en: [], he: [] },
  config: null,
  profiles: null,
});

export interface RawContent {
  issues: RawFile[];
  glossary: RawFile | null;
  versions: RawFile | null;
  corpora: RawCorpusSet[];
}

const basename = (file: string) =>
  file
    .split("/")
    .pop()!
    .replace(/\.(json|md)$/, "");

function formatZod(err: z.ZodError): string {
  return err.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ");
}

function parseJson(f: RawFile, errors: ValidationError[]): unknown | undefined {
  try {
    return JSON.parse(f.raw);
  } catch (e) {
    errors.push({
      rule: "json-parse",
      file: f.file,
      message: `invalid JSON: ${(e as Error).message}`,
    });
    return undefined;
  }
}

function duplicates(ids: string[]): string[] {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const id of ids) (seen.has(id) ? dup : seen).add(id);
  return [...dup];
}

// ------------------------------------------------------------------ issues

export function validateIssues(files: RawFile[], errors: ValidationError[]): Issue[] {
  const issues: Issue[] = [];
  for (const f of files) {
    const data = parseJson(f, errors);
    if (data === undefined) continue;
    const r = issueSchema.safeParse(data);
    if (!r.success) {
      errors.push({ rule: "issue-schema", file: f.file, message: formatZod(r.error) });
      continue;
    }
    if (r.data.id !== basename(f.file)) {
      errors.push({
        rule: "issue-id-filename",
        file: f.file,
        message: `issue id "${r.data.id}" must match the file name "${basename(f.file)}.json"`,
      });
    }
    for (const d of duplicates(r.data.options.map((o) => o.id))) {
      errors.push({
        rule: "option-duplicate",
        file: f.file,
        message: `duplicate option id "${d}"`,
      });
    }
    issues.push(r.data);
  }
  for (const d of duplicates(issues.map((i) => i.id))) {
    errors.push({ rule: "issue-duplicate", file: "issues/", message: `duplicate issue id "${d}"` });
  }
  if (files.length !== ISSUE_COUNT) {
    errors.push({
      rule: "issue-count",
      file: "issues/",
      message: `expected exactly ${ISSUE_COUNT} issue files, found ${files.length}`,
    });
  }
  return issues;
}

// ------------------------------------------------------------------ registry

export function validateRegistry(
  set: RawCorpusSet,
  errors: ValidationError[],
): { lists: List[]; parties: Party[] } | null {
  if (!set.lists || !set.parties) {
    if (set.active) {
      errors.push({
        rule: "registry-missing",
        file: `${set.name} registry`,
        message: `the active corpus "${set.name}" needs lists.json and parties.json`,
      });
    }
    return null;
  }
  const listsData = parseJson(set.lists, errors);
  const partiesData = parseJson(set.parties, errors);
  if (listsData === undefined || partiesData === undefined) return null;
  const lr = listsFileSchema.safeParse(listsData);
  const pr = partiesFileSchema.safeParse(partiesData);
  if (!lr.success)
    errors.push({ rule: "registry-schema", file: set.lists.file, message: formatZod(lr.error) });
  if (!pr.success)
    errors.push({ rule: "registry-schema", file: set.parties.file, message: formatZod(pr.error) });
  if (!lr.success || !pr.success) return null;
  const { lists } = lr.data;
  const { parties } = pr.data;

  for (const d of duplicates(lists.map((l) => l.id))) {
    errors.push({
      rule: "registry-duplicate",
      file: set.lists.file,
      message: `duplicate list id "${d}"`,
    });
  }
  for (const d of duplicates(parties.map((p) => p.id))) {
    errors.push({
      rule: "registry-duplicate",
      file: set.parties.file,
      message: `duplicate party id "${d}"`,
    });
  }

  const listById = new Map(lists.map((l) => [l.id, l]));
  const partyById = new Map(parties.map((p) => [p.id, p]));

  // Joint-list references must be symmetric: party.listId ⇔ list.memberPartyIds.
  for (const p of parties) {
    const list = listById.get(p.listId);
    if (!list) {
      errors.push({
        rule: "registry-unknown-list",
        file: set.parties.file,
        message: `party "${p.id}" references unknown list "${p.listId}"`,
      });
    } else if (!list.memberPartyIds.includes(p.id)) {
      errors.push({
        rule: "registry-membership",
        file: set.parties.file,
        message: `party "${p.id}" says it runs on "${list.id}", but that list's memberPartyIds doesn't include it`,
      });
    }
  }
  // Tier rules: only researched parties carry research facts, only listed ones a platform link.
  for (const p of parties) {
    const tierError = (message: string) =>
      errors.push({ rule: "registry-tier", file: set.parties!.file, message });
    if (p.tier === "listed" && p.researchedAsOf !== null) {
      tierError(`listed party "${p.id}" must have researchedAsOf: null`);
    }
    if (p.tier === "researched" && p.researchedAsOf === null) {
      tierError(`researched party "${p.id}" needs a researchedAsOf date`);
    }
    if (p.tier === "researched" && p.platform) {
      tierError(`researched party "${p.id}" must not have a platform link (listed parties only)`);
    }
  }
  for (const l of lists) {
    for (const d of duplicates(l.memberPartyIds)) {
      errors.push({
        rule: "registry-membership",
        file: set.lists.file,
        message: `list "${l.id}" lists member "${d}" twice`,
      });
    }
    for (const memberId of l.memberPartyIds) {
      const p = partyById.get(memberId);
      if (!p) {
        errors.push({
          rule: "registry-membership",
          file: set.lists.file,
          message: `list "${l.id}" has unknown member party "${memberId}"`,
        });
      } else if (p.listId !== l.id) {
        errors.push({
          rule: "registry-membership",
          file: set.lists.file,
          message: `list "${l.id}" includes "${memberId}", but that party runs on "${p.listId}"`,
        });
      }
    }
    if (set.active && l.poll.status === "pending") {
      errors.push({
        rule: "poll-snapshot-missing",
        file: set.lists.file,
        message: `list "${l.id}" needs a poll snapshot or "not_polled" (status is "pending")`,
      });
    }
  }
  return { lists, parties };
}

// ------------------------------------------------------------------ research

/** Parsed research documents of one corpus: party ID → language → document. */
type ParsedResearch = Record<string, Partial<Record<ResearchLang, ParsedResearchDoc>>>;

export function validateResearchDoc(
  f: RawFile,
  expected: { partyId: string; lang: string; issueIds: string[] },
  errors: ValidationError[],
): ParsedResearchDoc {
  const doc = parseResearchDoc(f.raw);
  const fm = doc.frontmatter;

  if (fm.partyId !== expected.partyId) {
    errors.push({
      rule: "research-frontmatter",
      file: f.file,
      message: `frontmatter partyId "${fm.partyId ?? ""}" must be "${expected.partyId}"`,
    });
  }
  if (fm.lang !== expected.lang) {
    errors.push({
      rule: "research-frontmatter",
      file: f.file,
      message: `frontmatter lang "${fm.lang ?? ""}" must be "${expected.lang}"`,
    });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fm.researchedAsOf ?? "")) {
    errors.push({
      rule: "research-date",
      file: f.file,
      message: `frontmatter researchedAsOf must be an ISO date (YYYY-MM-DD)`,
    });
  }
  for (const p of doc.problems)
    errors.push({ rule: "research-structure", file: f.file, message: p });

  const sectionIds = doc.sections.map((s) => s.id);
  if (sectionIds.join(",") !== RESEARCH_SECTIONS.join(",")) {
    errors.push({
      rule: "research-sections",
      file: f.file,
      message: `sections must be exactly, in order: ${RESEARCH_SECTIONS.join(", ")}; found: ${sectionIds.join(", ") || "(none)"}`,
    });
  }
  for (const s of doc.sections) {
    const empty = !s.body.trim() && s.subsections.length === 0;
    if (empty)
      errors.push({
        rule: "research-sections",
        file: f.file,
        message: `section "${s.id}" is empty`,
      });
    if (s.id !== "issues" && s.id !== "other-positions" && s.subsections.length > 0) {
      errors.push({
        rule: "research-structure",
        file: f.file,
        message: `section "${s.id}" must not have sub-sections`,
      });
    }
  }

  const issuesSection = doc.sections.find((s) => s.id === "issues");
  if (issuesSection) {
    const got = issuesSection.subsections.map((s) => s.id);
    const want = expected.issueIds.map(issueAnchor);
    const missing = want.filter((a) => !got.includes(a));
    const extra = got.filter((a) => !want.includes(a));
    if (missing.length || extra.length || got.length !== want.length) {
      errors.push({
        rule: "research-issue-subsections",
        file: f.file,
        message:
          `section "issues" needs exactly one sub-section per issue (${ISSUE_ANCHOR_PREFIX}<issue-id>)` +
          (missing.length ? `; missing: ${missing.join(", ")}` : "") +
          (extra.length ? `; unexpected: ${extra.join(", ")}` : ""),
      });
    }
    for (const sub of issuesSection.subsections) {
      if (!sub.body.trim()) {
        errors.push({
          rule: "research-issue-subsections",
          file: f.file,
          message: `sub-section "${sub.id}" is empty`,
        });
      }
    }
  }
  const other = doc.sections.find((s) => s.id === "other-positions");
  if (other) {
    if (other.subsections.length === 0) {
      errors.push({
        rule: "research-other-subsections",
        file: f.file,
        message: `section "other-positions" needs at least one per-topic sub-section (${OTHER_ANCHOR_PREFIX}<topic>)`,
      });
    }
    for (const sub of other.subsections) {
      if (!sub.id.startsWith(OTHER_ANCHOR_PREFIX)) {
        errors.push({
          rule: "research-other-subsections",
          file: f.file,
          message: `sub-section anchor "${sub.id}" in "other-positions" must start with "${OTHER_ANCHOR_PREFIX}"`,
        });
      }
    }
  }

  for (const d of duplicates(doc.anchors)) {
    errors.push({
      rule: "research-duplicate-anchor",
      file: f.file,
      message: `duplicate anchor "${d}"`,
    });
  }

  if (doc.sources.length === 0) {
    errors.push({
      rule: "research-sources",
      file: f.file,
      message: `the Sources section needs a numbered list of sources`,
    });
  } else {
    const nums = doc.sources.map((s) => s.n);
    nums.forEach((n, i) => {
      if (n !== i + 1) {
        errors.push({
          rule: "research-sources",
          file: f.file,
          message: `sources must be numbered 1, 2, 3… in order (found ${n} at position ${i + 1})`,
        });
      }
    });
  }
  const sourceNums = new Set(doc.sources.map((s) => s.n));
  const dangling = [...new Set(doc.citations.filter((n) => !sourceNums.has(n)))];
  if (dangling.length) {
    errors.push({
      rule: "research-citations",
      file: f.file,
      message: `citations refer to missing sources: ${dangling.map((n) => `[${n}]`).join(", ")}`,
    });
  }
  if (doc.sources.length > 0 && doc.citations.length === 0) {
    errors.push({ rule: "research-citations", file: f.file, message: `no inline citations found` });
  }

  for (const { anchor, text } of researchProse(doc)) {
    for (const hit of findPollFigures(text)) {
      errors.push({
        rule: "poll-figure",
        file: f.file,
        message: `possible poll figure in "${anchor}": "${hit.sentence.slice(0, 160)}" (research must not contain poll figures; the polling line comes from the registry)`,
      });
    }
  }
  return doc;
}

function validateResearch(
  set: RawCorpusSet,
  registry: { parties: Party[] } | null,
  issueIds: string[],
  errors: ValidationError[],
): ParsedResearch {
  const partyById = new Map(registry?.parties.map((p) => [p.id, p]) ?? []);
  const parsed: ParsedResearch = {};

  for (const lang of RESEARCH_LANGS) {
    for (const f of set.research[lang]) {
      const partyId = basename(f.file);
      const party = partyById.get(partyId);
      if (!party) {
        errors.push({
          rule: "research-orphan",
          file: f.file,
          message: `research document for "${partyId}", which isn't in the ${set.name} registry`,
        });
        continue;
      }
      if (party.tier === "listed") {
        errors.push({
          rule: "research-listed",
          file: f.file,
          message: `research document for "${partyId}", which is a listed party (only researched parties have research documents)`,
        });
        continue;
      }
      const doc = validateResearchDoc(f, { partyId, lang, issueIds }, errors);
      (parsed[partyId] ??= {})[lang] = doc;
    }
  }

  if (set.active && registry) {
    for (const p of registry.parties) {
      if (p.tier !== "researched") continue;
      for (const lang of RESEARCH_LANGS) {
        if (!parsed[p.id]?.[lang]) {
          errors.push({
            rule: "research-missing",
            file: `${set.name} research/${lang}/${p.id}.md`,
            message: `party "${p.id}" has no ${lang} research document`,
          });
        }
      }
    }
  }

  // Anchors must be identical (same set, same order) across languages.
  for (const [partyId, docs] of Object.entries(parsed)) {
    const en = docs.en;
    const he = docs.he;
    if (en && he && en.anchors.join(",") !== he.anchors.join(",")) {
      const onlyEn = en.anchors.filter((a) => !he.anchors.includes(a));
      const onlyHe = he.anchors.filter((a) => !en.anchors.includes(a));
      errors.push({
        rule: "research-anchor-parity",
        file: `${set.name} research/*/${partyId}.md`,
        message:
          `anchors differ between en and he` +
          (onlyEn.length ? `; only in en: ${onlyEn.join(", ")}` : "") +
          (onlyHe.length ? `; only in he: ${onlyHe.join(", ")}` : "") +
          (!onlyEn.length && !onlyHe.length ? "; same anchors in a different order" : ""),
      });
    }
  }
  return parsed;
}

// ------------------------------------------------------------------ matching content

/**
 * The checks that judge one positions row on its own: `unclear` and `held`
 * agree, and the levels follow the vocabulary's rules.
 */
export function positionRowProblems(row: PositionRow): string[] {
  const problems: string[] = [];
  if (row.unclear) {
    if (row.held.length > 0) problems.push(`is marked unclear but holds options`);
    return problems;
  }
  if (row.held.length === 0) {
    problems.push(`holds no option (mark it "unclear": true if there is no documented position)`);
    return problems;
  }
  const count = (level: string) => row.held.filter((h) => h.level === level).length;
  const main = count("main");
  const either = count("either");
  if (main > 1) problems.push(`has ${main} "main" options (at most one)`);
  if (either === 1) problems.push(`uses "either" on one option (it needs at least two)`);
  if (main > 0 && either > 0) problems.push(`mixes "main" and "either"`);
  const heldIds = new Set(row.held.map((h) => h.optionId));
  for (const id of row.ruledOut ?? [])
    if (heldIds.has(id)) problems.push(`both holds and rules out "${id}"`);
  return problems;
}

/**
 * The matching content of one corpus after the single-file rules: what the
 * completeness rules, the self-match test and the profile test work from.
 */
export interface ParsedMatching {
  /** One per issue with a usable file; rows that broke a single-file rule are left out. */
  positions: PositionsFile[];
  /** One per issue with a usable grid. */
  distances: DistancesFile[];
  texts: Record<ResearchLang, PartyTexts[]>;
  config: MatchingConfig | null;
  profiles: VoterProfile[] | null;
  /**
   * What exists on disk, usable or not, so a file or row already reported by a
   * single-file rule isn't reported again as missing.
   */
  present: {
    /** Issue IDs. */
    positions: Set<string>;
    /** `<issueId>/<partyId>`. */
    rows: Set<string>;
    /** Issue IDs. */
    distances: Set<string>;
    /** Party IDs, per language. */
    texts: Record<ResearchLang, Set<string>>;
  };
}

const rowKey = (issueId: string, partyId: string) => `${issueId}/${partyId}`;

/**
 * Single-file rules for the matching content. They run on both corpora, so real
 * content is checked as it lands; completeness rules (every party has a row,
 * every pair is present, both languages exist) are separate and active-corpus only.
 */
function validateMatching(
  set: RawCorpusSet,
  registry: { parties: Party[] } | null,
  issues: Issue[],
  research: ParsedResearch,
  errors: ValidationError[],
): ParsedMatching {
  const { matching } = set;
  const parsed: ParsedMatching = {
    positions: [],
    distances: [],
    texts: { en: [], he: [] },
    config: null,
    profiles: null,
    present: {
      positions: new Set(),
      rows: new Set(),
      distances: new Set(),
      texts: { en: new Set(), he: new Set() },
    },
  };
  const optionsByIssue = new Map(issues.map((i) => [i.id, new Set(i.options.map((o) => o.id))]));
  const partyById = new Map(registry?.parties.map((p) => [p.id, p]) ?? []);

  /** Why a party can't appear in matching content, or null when it can. */
  const partyProblem = (partyId: string): string | null => {
    const party = partyById.get(partyId);
    if (!party) return `unknown party "${partyId}" (not in the ${set.name} registry)`;
    if (party.tier !== "researched")
      return `party "${partyId}" is a listed party (matching content is for researched parties only)`;
    return null;
  };

  /** The file's issue, when its `issueId` is known and matches the file name. */
  const fileIssue = (
    f: RawFile,
    issueId: string,
    rule: "positions-issue" | "distances-issue",
  ): Set<string> | null => {
    if (issueId !== basename(f.file)) {
      errors.push({
        rule,
        file: f.file,
        message: `issueId "${issueId}" must match the file name "${basename(f.file)}.json"`,
      });
    }
    const options = optionsByIssue.get(issueId);
    if (!options) errors.push({ rule, file: f.file, message: `unknown issue "${issueId}"` });
    return options ?? null;
  };

  for (const f of matching.positions) {
    parsed.present.positions.add(basename(f.file));
    const data = parseJson(f, errors);
    if (data === undefined) continue;
    const r = positionsFileSchema.safeParse(data);
    if (!r.success) {
      errors.push({ rule: "positions-schema", file: f.file, message: formatZod(r.error) });
      continue;
    }
    const { issueId, rows } = r.data;
    const before = errors.length;
    const options = fileIssue(f, issueId, "positions-issue");
    const fileUsable = errors.length === before;
    const repeated = duplicates(rows.map((row) => row.partyId));
    for (const d of repeated) {
      errors.push({
        rule: "positions-party",
        file: f.file,
        message: `more than one row for party "${d}"`,
      });
    }
    const usableRows: PositionRow[] = [];
    for (const row of rows) {
      parsed.present.rows.add(rowKey(issueId, row.partyId));
      const rowErrors = errors.length;
      const problem = registry && partyProblem(row.partyId);
      if (problem) errors.push({ rule: "positions-party", file: f.file, message: problem });
      const held = row.held.map((h) => h.optionId);
      if (options) {
        for (const id of new Set([...held, ...(row.ruledOut ?? [])].filter((o) => !options.has(o)))) {
          errors.push({
            rule: "positions-option",
            file: f.file,
            message: `row "${row.partyId}": unknown option "${id}" for issue "${issueId}"`,
          });
        }
      }
      for (const d of duplicates(held)) {
        errors.push({
          rule: "positions-option",
          file: f.file,
          message: `row "${row.partyId}": option "${d}" is held twice`,
        });
      }
      for (const p of positionRowProblems(row)) {
        errors.push({
          rule: "positions-levels",
          file: f.file,
          message: `row "${row.partyId}" ${p}`,
        });
      }
      // A wrong anchor doesn't change what the row says, so the row stays usable.
      if (errors.length === rowErrors && !repeated.includes(row.partyId)) usableRows.push(row);
      if (row.anchor !== issueAnchor(issueId)) {
        errors.push({
          rule: "positions-anchor",
          file: f.file,
          message: `row "${row.partyId}": anchor "${row.anchor}" must be "${issueAnchor(issueId)}"`,
        });
      }
    }
    if (fileUsable) parsed.positions.push({ issueId, rows: usableRows });
  }

  for (const f of matching.distances) {
    parsed.present.distances.add(basename(f.file));
    const data = parseJson(f, errors);
    if (data === undefined) continue;
    const r = distancesFileSchema.safeParse(data);
    if (!r.success) {
      errors.push({ rule: "distances-schema", file: f.file, message: formatZod(r.error) });
      continue;
    }
    const { issueId, pairs } = r.data;
    const before = errors.length;
    const options = fileIssue(f, issueId, "distances-issue");
    for (const { a, b } of pairs) {
      if (a === b) {
        errors.push({
          rule: "distances-option",
          file: f.file,
          message: `pair "${a}"/"${b}" joins an option with itself (the diagonal is always 1 and isn't stored)`,
        });
      }
      if (options) {
        for (const id of new Set([a, b].filter((o) => !options.has(o)))) {
          errors.push({
            rule: "distances-option",
            file: f.file,
            message: `unknown option "${id}" for issue "${issueId}"`,
          });
        }
      }
    }
    // A pair is unordered, so a/b and b/a are the same entry.
    for (const d of duplicates(pairs.map((p) => pairKey(p.a, p.b)))) {
      errors.push({
        rule: "distances-duplicate",
        file: f.file,
        message: `pair "${d.replace("|", '"/"')}" appears more than once (each pair is stored once, in either order)`,
      });
    }
    if (errors.length === before) parsed.distances.push(r.data);
  }

  for (const lang of RESEARCH_LANGS) {
    for (const f of matching.texts[lang]) {
      parsed.present.texts[lang].add(basename(f.file));
      const data = parseJson(f, errors);
      if (data === undefined) continue;
      const r = partyTextsSchema.safeParse(data);
      if (!r.success) {
        errors.push({ rule: "texts-schema", file: f.file, message: formatZod(r.error) });
        continue;
      }
      const texts = r.data;
      const before = errors.length;
      if (texts.partyId !== basename(f.file)) {
        errors.push({
          rule: "texts-file",
          file: f.file,
          message: `partyId "${texts.partyId}" must match the file name "${basename(f.file)}.json"`,
        });
      }
      if (texts.lang !== lang) {
        errors.push({
          rule: "texts-file",
          file: f.file,
          message: `lang "${texts.lang}" must be "${lang}" (the file is under texts/${lang}/)`,
        });
      }
      const problem = registry && partyProblem(texts.partyId);
      if (problem) errors.push({ rule: "texts-party", file: f.file, message: problem });
      // Problems inside the file (below) are reported per entry; the file stays usable.
      if (errors.length === before) parsed.texts[lang].push(texts);

      // Anchors are checked against the research document when it exists; a missing
      // document of the active corpus is already reported as `research-missing`.
      const doc = research[texts.partyId]?.[lang];
      const checkAnchor = (anchor: string, where: string, expected: string | null) => {
        if (expected !== null ? anchor !== expected : !anchor.startsWith(OTHER_ANCHOR_PREFIX)) {
          errors.push({
            rule: "texts-anchor",
            file: f.file,
            message:
              `${where}: anchor "${anchor}" must ` +
              (expected !== null ? `be "${expected}"` : `start with "${OTHER_ANCHOR_PREFIX}"`),
          });
        } else if (doc && !doc.anchors.includes(anchor)) {
          errors.push({
            rule: "texts-anchor",
            file: f.file,
            message: `${where}: anchor "${anchor}" isn't in the party's ${lang} research document`,
          });
        }
      };
      const checkText = (text: string, where: string) => {
        for (const hit of findPollFigures(text)) {
          errors.push({
            rule: "poll-figure",
            file: f.file,
            message: `possible poll figure in ${where}: "${hit.sentence.slice(0, 160)}" (matching texts must not contain poll figures)`,
          });
        }
      };

      for (const [issueId, entry] of Object.entries(texts.issues)) {
        const options = optionsByIssue.get(issueId);
        if (!options) {
          errors.push({ rule: "texts-issue", file: f.file, message: `unknown issue "${issueId}"` });
          continue;
        }
        checkAnchor(entry.anchor, `issue "${issueId}"`, issueAnchor(issueId));
        if (entry.unclear) checkText(entry.unclear.text, `issue "${issueId}" (unclear)`);
        for (const [optionId, option] of Object.entries(entry.options ?? {})) {
          if (!options.has(optionId)) {
            errors.push({
              rule: "texts-option",
              file: f.file,
              message: `unknown option "${optionId}" for issue "${issueId}"`,
            });
          }
          checkText(option.text, `issue "${issueId}", option "${optionId}"`);
        }
      }
      texts.points.forEach((point, i) => {
        checkAnchor(point.anchor, `point ${i + 1}`, null);
        checkText(point.text, `point ${i + 1}`);
      });
    }
  }

  if (matching.config) {
    const data = parseJson(matching.config, errors);
    if (data !== undefined) {
      const r = matchingConfigSchema.safeParse(data);
      if (r.success) parsed.config = r.data;
      else
        errors.push({
          rule: "matching-config-schema",
          file: matching.config.file,
          message: formatZod(r.error),
        });
    }
  }

  if (matching.profiles) {
    parsed.profiles = validateProfiles(matching.profiles, optionsByIssue, errors, (id) =>
      registry ? partyProblem(id) : null,
    );
  }
  return parsed;
}

function validateProfiles(
  f: RawFile,
  optionsByIssue: Map<string, Set<string>>,
  errors: ValidationError[],
  partyProblem: (partyId: string) => string | null,
): VoterProfile[] | null {
  const data = parseJson(f, errors);
  if (data === undefined) return null;
  const r = profilesFileSchema.safeParse(data);
  if (!r.success) {
    errors.push({ rule: "profiles-schema", file: f.file, message: formatZod(r.error) });
    return null;
  }
  const { profiles } = r.data;
  const problem = (message: string) =>
    errors.push({ rule: "profiles-content", file: f.file, message });

  for (const d of duplicates(profiles.map((p) => p.id))) problem(`duplicate profile id "${d}"`);
  for (const p of profiles) {
    const at = `profile "${p.id}"`;
    for (const d of duplicates(p.ranked)) problem(`${at}: issue "${d}" is ranked twice`);
    for (const issueId of new Set(p.ranked)) {
      if (!optionsByIssue.has(issueId)) problem(`${at}: unknown issue "${issueId}"`);
      else if (!(issueId in p.answers)) problem(`${at}: no answer for ranked issue "${issueId}"`);
    }
    for (const [issueId, optionId] of Object.entries(p.answers)) {
      const options = optionsByIssue.get(issueId);
      if (!options) {
        if (!p.ranked.includes(issueId)) problem(`${at}: answer for unknown issue "${issueId}"`);
      } else if (!options.has(optionId)) {
        problem(`${at}: unknown option "${optionId}" for issue "${issueId}"`);
      }
    }
    const expected = [
      ...p.expect.topAnyOf,
      ...(p.expect.inTop4 ?? []),
      ...(p.expect.notInTop4 ?? []),
    ];
    for (const partyId of new Set(expected)) {
      const why = partyProblem(partyId);
      if (why) problem(`${at}: ${why}`);
    }
    for (const partyId of p.expect.notInTop4 ?? []) {
      if (p.expect.topAnyOf.includes(partyId) || p.expect.inTop4?.includes(partyId))
        problem(`${at}: party "${partyId}" is expected both in and out of the top 4`);
    }
  }
  return profiles;
}

/** How many "also worth knowing" points a party's texts hold. */
export const MIN_POINTS = 2;
export const MAX_POINTS = 3;

/**
 * Completeness rules for the matching content: the set as a whole covers every
 * researched party, issue, option and language, and its parts agree with each
 * other and with the research. Active corpus only, so the build doesn't break
 * while the other corpus is half-finished. A file or row a single-file rule
 * already rejected is not reported again as missing.
 */
function validateMatchingCompleteness(
  set: RawCorpusSet,
  registry: { parties: Party[] },
  issues: Issue[],
  research: ParsedResearch,
  parsed: ParsedMatching,
  errors: ValidationError[],
) {
  const dir = CORPUS_DIRS[set.name].matching;
  const researched = registry.parties.filter((p) => p.tier === "researched");
  const { present, config } = parsed;

  if (!set.matching.config) {
    errors.push({
      rule: "matching-config-missing",
      file: `${dir}/config.json`,
      message: `the active corpus "${set.name}" needs the scoring constants`,
    });
  }

  const rows = new Map<string, PositionRow>();
  const grids = new Map(parsed.distances.map((d) => [d.issueId, d]));
  for (const issue of issues) {
    const file = `${dir}/positions/${issue.id}.json`;
    const positions = parsed.positions.find((p) => p.issueId === issue.id);
    if (!present.positions.has(issue.id)) {
      errors.push({
        rule: "positions-missing",
        file,
        message: `no positions file for issue "${issue.id}"`,
      });
    }
    for (const row of positions?.rows ?? []) rows.set(rowKey(issue.id, row.partyId), row);
    for (const p of positions ? researched : []) {
      if (!present.rows.has(rowKey(issue.id, p.id))) {
        errors.push({
          rule: "positions-missing",
          file,
          message: `researched party "${p.id}" has no row`,
        });
      }
    }

    const gridFile = `${dir}/distances/${issue.id}.json`;
    const grid = grids.get(issue.id);
    if (!present.distances.has(issue.id)) {
      errors.push({
        rule: "distances-missing",
        file: gridFile,
        message: `no distance grid for issue "${issue.id}"`,
      });
    }
    if (grid) {
      const have = new Set(grid.pairs.map((p) => pairKey(p.a, p.b)));
      for (const [a, b] of optionPairs(issue.options.map((o) => o.id))) {
        if (!have.has(pairKey(a, b))) {
          errors.push({
            rule: "distances-missing",
            file: gridFile,
            message: `no closeness for the pair "${a}"/"${b}"`,
          });
        }
      }
    }

    // "Unclear" in the positions and "no documented position" in the research must
    // say the same thing. The English document is the canonical one.
    for (const row of positions?.rows ?? []) {
      const section = research[row.partyId]?.en?.sections.find((s) => s.id === "issues");
      const sub = section?.subsections.find((s) => s.id === issueAnchor(issue.id));
      if (!sub) continue;
      const documented = hasClosestOptionsLine(sub.body);
      if (row.unclear && documented) {
        errors.push({
          rule: "positions-research",
          file,
          message: `row "${row.partyId}" is unclear, but the research has a "Closest option(s)" line for this issue`,
        });
      } else if (!row.unclear && !documented) {
        errors.push({
          rule: "positions-research",
          file,
          message: `row "${row.partyId}" holds a position, but the research has no "Closest option(s)" line for this issue ("No documented position found")`,
        });
      }
    }
  }

  for (const party of researched) {
    for (const lang of RESEARCH_LANGS) {
      const file = `${dir}/texts/${lang}/${party.id}.json`;
      const missing = (message: string) => errors.push({ rule: "texts-missing", file, message });
      if (!present.texts[lang].has(party.id)) {
        missing(`researched party "${party.id}" has no ${lang} result texts`);
        continue;
      }
      const texts = parsed.texts[lang].find((t) => t.partyId === party.id);
      if (!texts) continue;

      if (texts.points.length < MIN_POINTS || texts.points.length > MAX_POINTS) {
        errors.push({
          rule: "texts-points",
          file,
          message: `needs ${MIN_POINTS}–${MAX_POINTS} "also worth knowing" points, found ${texts.points.length}`,
        });
      }

      for (const issue of issues) {
        const entry = texts.issues[issue.id];
        if (!entry) {
          missing(`no texts for issue "${issue.id}"`);
          continue;
        }
        const row = rows.get(rowKey(issue.id, party.id));
        if (row?.unclear) {
          if (entry.options) {
            errors.push({
              rule: "texts-agreement",
              file,
              message: `issue "${issue.id}": the positions record no documented position, so it needs the one "unclear" text, not a text per option`,
            });
          }
          continue;
        }
        if (entry.unclear) {
          // Without a row the shape can't be judged; the missing row is reported above.
          if (row)
            missing(
              `issue "${issue.id}": has only an "unclear" text, but the positions record a position (it needs a text per option)`,
            );
          continue;
        }
        const grid = grids.get(issue.id);
        for (const option of issue.options) {
          const text = entry.options?.[option.id];
          if (!text) {
            missing(`issue "${issue.id}": no text for option "${option.id}"`);
            continue;
          }
          if (!row || !grid || !config) continue;
          let computed;
          try {
            computed = issueAgreement(row, option.id, grid, config);
          } catch (e) {
            // A pair missing from the grid is reported above as `distances-missing`.
            if (e instanceof MatchDataError) continue;
            throw e;
          }
          if (text.agreement !== computed) {
            errors.push({
              rule: "texts-agreement",
              file,
              message: `issue "${issue.id}", option "${option.id}": the text was written for "${text.agreement}", but the score gives "${computed}" (either the text or the party's row is wrong)`,
            });
          }
        }
      }
    }

    // The two languages must hold the same entries. Unknown issues and options
    // are left out: single-file rules report them.
    const [en, he] = RESEARCH_LANGS.map((lang) =>
      parsed.texts[lang].find((t) => t.partyId === party.id),
    );
    if (en && he) {
      const keys = (texts: PartyTexts) => {
        const out: string[] = [];
        for (const issue of issues) {
          const entry = texts.issues[issue.id];
          if (entry?.unclear) out.push(`${issue.id} (unclear)`);
          for (const o of issue.options) if (entry?.options?.[o.id]) out.push(`${issue.id}/${o.id}`);
        }
        texts.points.forEach((p, i) => out.push(`point ${i + 1} (${p.anchor})`));
        return out;
      };
      const [enKeys, heKeys] = [keys(en), keys(he)];
      const onlyEn = enKeys.filter((k) => !heKeys.includes(k));
      const onlyHe = heKeys.filter((k) => !enKeys.includes(k));
      if (onlyEn.length || onlyHe.length) {
        errors.push({
          rule: "texts-parity",
          file: `${dir}/texts/*/${party.id}.json`,
          message:
            `entries differ between en and he` +
            (onlyEn.length ? `; only in en: ${onlyEn.join(", ")}` : "") +
            (onlyHe.length ? `; only in he: ${onlyHe.join(", ")}` : ""),
        });
      }
    }
  }
}

// ------------------------------------------------------------------ entry point

export function validateContent(content: RawContent): ValidationError[] {
  const errors: ValidationError[] = [];
  const issues = validateIssues(content.issues, errors);
  const issueIds = issues.map((i) => i.id);

  if (!content.glossary) {
    errors.push({
      rule: "glossary-schema",
      file: "glossary.json",
      message: "glossary.json is missing",
    });
  } else {
    const data = parseJson(content.glossary, errors);
    if (data !== undefined) {
      const r = glossarySchema.safeParse(data);
      if (!r.success)
        errors.push({
          rule: "glossary-schema",
          file: content.glossary.file,
          message: formatZod(r.error),
        });
      else
        for (const d of duplicates(r.data.terms.map((t) => t.id))) {
          errors.push({
            rule: "glossary-duplicate",
            file: content.glossary.file,
            message: `duplicate term id "${d}"`,
          });
        }
    }
  }

  if (!content.versions) {
    errors.push({
      rule: "versions-schema",
      file: "versions.json",
      message: "versions.json is missing",
    });
  } else {
    const data = parseJson(content.versions, errors);
    if (data !== undefined) {
      const r = versionsSchema.safeParse(data);
      if (!r.success)
        errors.push({
          rule: "versions-schema",
          file: content.versions.file,
          message: formatZod(r.error),
        });
    }
  }

  for (const set of content.corpora) {
    const registry = validateRegistry(set, errors);
    const research = validateResearch(set, registry, issueIds, errors);
    const matching = validateMatching(set, registry, issues, research, errors);
    if (set.active && registry)
      validateMatchingCompleteness(set, registry, issues, research, matching, errors);
  }
  return errors;
}

/** One corpus as the self-match and profile checks need it. */
export interface ParsedCorpus {
  name: CorpusName;
  issues: Issue[];
  parties: Party[];
  lists: List[];
  matching: ParsedMatching;
}

/**
 * Parses one corpus without judging it: whatever passes the single-file rules is
 * returned, and nothing is reported. For checks that must run on a corpus that
 * is still incomplete (positions and grids before any texts exist). Returns null
 * when the corpus has no usable registry.
 */
export function parseCorpus(content: RawContent, name: CorpusName): ParsedCorpus | null {
  const set = content.corpora.find((c) => c.name === name);
  if (!set) return null;
  const ignored: ValidationError[] = [];
  const issues = validateIssues(content.issues, ignored);
  const registry = validateRegistry(set, ignored);
  if (!registry) return null;
  const research = validateResearch(
    set,
    registry,
    issues.map((i) => i.id),
    ignored,
  );
  const matching = validateMatching(set, registry, issues, research, ignored);
  return { name, issues, ...registry, matching };
}
