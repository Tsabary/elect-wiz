/**
 * Profile test: runs a corpus's `matching/profiles.json` through the scoring and
 * prints, per profile, the expected and the actual outcome. It needs only
 * positions, grids, constants and the profiles, so it runs on the real corpus
 * before any result texts exist.
 *
 * Usage: pnpm check:profiles
 * Set CONTENT_CORPUS=real|placeholder to choose the corpus.
 * Exits non-zero when a profile's outcome differs from what it expects, or when
 * there is nothing to run.
 */
import { activeCorpus } from "../lib/content/config";
import { readRawContent } from "../lib/content/read-raw";
import { parseCorpus } from "../lib/content/validate";
import { formatProfileReport, runProfiles } from "../lib/matching/profile-check";

const name = activeCorpus();
const corpus = parseCorpus(readRawContent(undefined, name), name);
const { config, profiles } = corpus?.matching ?? {};

if (!corpus || !config || !profiles) {
  console.error(
    `✖ Profile test: the ${name} corpus has no usable ` +
      (!corpus ? "registry" : !config ? "matching/config.json" : "matching/profiles.json") +
      ".",
  );
  process.exit(1);
}

const report = runProfiles({
  data: { positions: corpus.matching.positions, distances: corpus.matching.distances, config },
  profiles,
  parties: corpus.parties.filter((p) => p.tier === "researched"),
});
console.log(`Profile test (corpus: ${name})\n`);
console.log(formatProfileReport(report));
process.exit(report.outcomes.every((o) => o.pass) ? 0 : 1);
