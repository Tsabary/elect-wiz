/**
 * Runs the profile test on one corpus and prints the outcome. Shared by
 * `validate-content.ts` (active corpus, build-blocking, when the corpus has a
 * `matching/profiles.json`) and `check-profiles.ts` (any corpus, on demand).
 */
import type { CorpusName } from "../lib/content/config";
import { parseCorpus, type RawContent } from "../lib/content/validate";
import { formatProfileReport, runProfiles } from "../lib/matching/profile-check";

/**
 * Returns true when every profile's outcome is what it expects. With
 * `verbose`, prints the expected and the actual outcome of every profile;
 * otherwise the full report only on a failure, and a summary line.
 */
export function profileCheck(content: RawContent, name: CorpusName, verbose: boolean): boolean {
  const corpus = parseCorpus(content, name);
  const { config, profiles } = corpus?.matching ?? {};
  if (!corpus || !config || !profiles) {
    console.error(
      `✖ Profile test: the ${name} corpus has no usable ` +
        (!corpus ? "registry" : !config ? "matching/config.json" : "matching/profiles.json") +
        ".",
    );
    return false;
  }
  const report = runProfiles({
    data: { positions: corpus.matching.positions, distances: corpus.matching.distances, config },
    profiles,
    parties: corpus.parties.filter((p) => p.tier === "researched"),
  });
  const failed = report.outcomes.filter((o) => !o.pass);
  if (verbose) {
    console.log(`Profile test (corpus: ${name})\n`);
    console.log(formatProfileReport(report));
  } else if (failed.length > 0) {
    console.error(formatProfileReport(report));
  }
  const summary = `${report.outcomes.length - failed.length} of ${report.outcomes.length} profiles pass (corpus: ${name})`;
  if (failed.length > 0) {
    console.error(`✖ Profile test failed: ${summary}.`);
    return false;
  }
  if (!verbose) console.log(`✓ Profile test passed: ${summary}.`);
  return true;
}
