/**
 * Build-blocking content validation. Runs as `npm run validate:content` and
 * automatically before `npm run build` (the `prebuild` script).
 *
 * Usage: tsx scripts/validate-content.ts [contentRoot]
 * Set CONTENT_CORPUS=real|placeholder to choose the active corpus.
 */
import path from "node:path";
import { activeCorpus } from "../lib/content/config";
import { readRawContent } from "../lib/content/read-raw";
import { validateContent } from "../lib/content/validate";

const root = path.resolve(process.argv[2] ?? path.join(process.cwd(), "content"));
const active = activeCorpus();
const errors = validateContent(readRawContent(root, active));

if (errors.length > 0) {
  console.error(
    `\n✖ Content validation failed with ${errors.length} error(s) (active corpus: ${active}):\n`,
  );
  for (const e of errors) console.error(`  [${e.rule}] ${e.file}: ${e.message}`);
  console.error("\nFix the content above; the build is blocked until validation passes.\n");
  process.exit(1);
}
console.log(`✓ Content validation passed (active corpus: ${active}).`);
