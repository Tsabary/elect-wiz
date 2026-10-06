/**
 * Content validation (plan Testing §1). Pure: takes the raw corpus as read from
 * disk (see `read-raw.ts`) and returns every rule violation. Run at build time by
 * `scripts/validate-content.ts`; any error blocks the build.
 */
import type { z } from "zod";
import { RESEARCH_LANGS, type CorpusName } from "./config";
import { findPollFigures } from "./poll-figures";
import { parseResearchDoc, researchProse, type ParsedResearchDoc } from "./research-parser";
import {
  glossarySchema,
  ISSUE_ANCHOR_PREFIX,
  ISSUE_COUNT,
  issueAnchor,
  issueSchema,
  listsFileSchema,
  OTHER_ANCHOR_PREFIX,
  partiesFileSchema,
  RESEARCH_SECTIONS,
  versionsSchema,
  type Issue,
  type List,
  type Party,
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
  | "poll-snapshot-missing"
  | "research-missing"
  | "research-orphan"
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
  | "poll-figure";

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
  research: Record<(typeof RESEARCH_LANGS)[number], RawFile[]>;
}

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
) {
  const partyIds = new Set(registry?.parties.map((p) => p.id) ?? []);
  const parsed: Record<string, Partial<Record<string, ParsedResearchDoc>>> = {};

  for (const lang of RESEARCH_LANGS) {
    for (const f of set.research[lang]) {
      const partyId = basename(f.file);
      if (!partyIds.has(partyId)) {
        errors.push({
          rule: "research-orphan",
          file: f.file,
          message: `research document for "${partyId}", which isn't in the ${set.name} registry`,
        });
        continue;
      }
      const doc = validateResearchDoc(f, { partyId, lang, issueIds }, errors);
      (parsed[partyId] ??= {})[lang] = doc;
    }
  }

  if (set.active && registry) {
    for (const p of registry.parties) {
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
    validateResearch(set, registry, issueIds, errors);
  }
  return errors;
}
