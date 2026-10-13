/**
 * Build-blocking content validation. Runs as `pnpm validate:content` and
 * automatically as part of `pnpm build`.
 *
 * Usage: tsx scripts/validate-content.ts [contentRoot]
 * Set CONTENT_CORPUS=real|placeholder to choose the active corpus.
 *
 * Once the content is valid, the self-match test runs on the active corpus
 * (plan-deterministic-matching.md, Testing strategy). `pnpm check:self-match`
 * runs it alone, also on a corpus that is still incomplete.
 */
import path from "node:path";
import { activeCorpus } from "../lib/content/config";
import { readRawContent } from "../lib/content/read-raw";
import { validateContent } from "../lib/content/validate";
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
