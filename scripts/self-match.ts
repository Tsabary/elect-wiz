/**
 * Runs the self-match test on one corpus and prints the outcome. Shared by
 * `validate-content.ts` (active corpus, build-blocking) and
 * `check-self-match.ts` (any corpus, on demand).
 */
import fs from "node:fs";
import path from "node:path";
import type { CorpusName } from "../lib/content/config";
import { parseCorpus, type RawContent } from "../lib/content/validate";
import { formatSelfMatchReport, runSelfMatch } from "../lib/matching/self-match";

/** Where the report for the positions reviewer goes. The placeholder corpus writes none by default. */
export const DEFAULT_SELF_MATCH_REPORT: Record<CorpusName, string | null> = {
  real: "research/review/matching/self-match-report.md",
  placeholder: null,
};

/**
 * Returns true when no party is outscored on one of its `main` issues. Cases
 * that are reported but don't block are printed and written to `reportPath`.
 */
export function selfMatch(content: RawContent, name: CorpusName, reportPath: string | null) {
  const corpus = parseCorpus(content, name);
  if (!corpus || !corpus.matching.config) {
    console.error(`✖ Self-match: the ${name} corpus has no usable registry or scoring constants.`);
    return false;
  }
  const report = runSelfMatch({
    issues: corpus.issues.map((i) => ({ id: i.id, optionIds: i.options.map((o) => o.id) })),
    positions: corpus.matching.positions,
    distances: corpus.matching.distances,
    config: corpus.matching.config,
    partyIds: corpus.parties.filter((p) => p.tier === "researched").map((p) => p.id),
  });

  for (const note of report.notes) console.log(`  note: ${note}`);
  for (const b of report.behind) {
    const where = b.issues.map((i) => `${i.issueId} (own level ${i.level})`).join(", ");
    console.log(
      `  for review: "${b.partyId}" (${b.score.toFixed(3)}) finishes behind "${b.otherPartyId}" (${b.otherScore.toFixed(3)})` +
        (where ? `; outscored on ${where}` : ""),
    );
  }
  for (const f of report.failures) {
    console.error(
      `  [self-match] "${f.partyId}" holds "${f.optionId}" as main on "${f.issueId}" and scores ${f.score.toFixed(3)}, but "${f.otherPartyId}" scores ${f.otherScore.toFixed(3)}`,
    );
  }
  if (reportPath) {
    const abs = path.resolve(reportPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, formatSelfMatchReport(report, name));
    console.log(`  report written to ${reportPath}`);
  }
  const summary = `${report.parties.length} parties tested, ${report.behind.length} reported for review, ${report.failures.length} blocking (corpus: ${name})`;
  if (report.failures.length > 0) {
    console.error(`✖ Self-match failed: ${summary}.`);
    return false;
  }
  console.log(`✓ Self-match passed: ${summary}.`);
  return true;
}
