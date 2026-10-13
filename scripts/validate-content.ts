/**
 * Build-blocking content validation. Runs as `pnpm validate:content` and
 * automatically as part of `pnpm build`.
 *
 * Usage: tsx scripts/validate-content.ts [contentRoot]
 * Set CONTENT_CORPUS=real|placeholder to choose the active corpus.
 *
 * Once the content is valid, the self-match test runs on the active corpus
 * (plan-deterministic-matching.md, Testing strategy), and then the profile test
 * when the corpus has a `matching/profiles.json`. `pnpm check:self-match` and
 * `pnpm check:profiles` run them alone, also on a corpus that is still incomplete.
 */
import path from "node:path";
import { activeCorpus, hebrewContentPending } from "../lib/content/config";
import { readRawContent } from "../lib/content/read-raw";
import { validateContent } from "../lib/content/validate";
import { profileCheck } from "./profiles";
import { DEFAULT_SELF_MATCH_REPORT, selfMatch } from "./self-match";

const root = path.resolve(process.argv[2] ?? path.join(process.cwd(), "content"));
const active = activeCorpus();
const content = readRawContent(root, active);
const errors = validateContent(content);

if (errors.length > 0) {
  console.error(
    `\n✖ Content validation failed with ${errors.length} error(s) (active corpus: ${active}):\n`,
  );
  for (const e of errors) console.error(`  [${e.rule}] ${e.file}: ${e.message}`);
  console.error("\nFix the content above; the build is blocked until validation passes.\n");
  process.exit(1);
}
console.log(`✓ Content validation passed (active corpus: ${active}).`);

if (!selfMatch(content, active, DEFAULT_SELF_MATCH_REPORT[active])) {
  console.error(
    "\nFix the positions or grids above; the build is blocked until self-match passes.\n",
  );
  process.exit(1);
}

const set = content.corpora.find((c) => c.name === active);
if (set?.matching.profiles && !profileCheck(content, active, false)) {
  console.error(
    "\nFix the positions, grids or profiles above; the build is blocked until every profile passes.\n",
  );
  process.exit(1);
}

// Say so while the Hebrew site runs on English party content.
let versions: { hebrewContent?: "pending" | "ready" } | null = null;
try {
  versions = JSON.parse(content.versions?.raw ?? "null");
} catch {
  // Unreadable versions are reported by the validation above.
}
if (set && hebrewContentPending(versions, active)) {
  const lacking = (en: { file: string }[], he: { file: string }[]) =>
    en.length -
    en.filter((f) => he.some((h) => path.basename(h.file) === path.basename(f.file))).length;
  console.log(
    `  note: Hebrew content is pending (content/versions.json): the Hebrew site shows English for ` +
      `${lacking(set.research.en, set.research.he)} research document(s) and ` +
      `${lacking(set.matching.texts.en, set.matching.texts.he)} result-text file(s). ` +
      `Set "hebrewContent" to "ready" once the Hebrew content has landed.`,
  );
}
