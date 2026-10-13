/**
 * Runs the self-match test on a corpus on demand, also when the corpus is
 * incomplete: it needs only positions, grids and the constants, so it can run
 * on the real corpus before any result texts exist. Issues without positions or
 * a full grid are left out and listed.
 *
 * Usage: pnpm check:self-match [--report <path> | --no-report]
 * Set CONTENT_CORPUS=real|placeholder to choose the corpus. The real corpus
 * writes its report to research/review/matching/self-match-report.md unless
 * told otherwise; the placeholder corpus writes one only with --report.
 * Exits non-zero when a party is outscored on one of its `main` issues.
 */
import { activeCorpus } from "../lib/content/config";
import { readRawContent } from "../lib/content/read-raw";
import { DEFAULT_SELF_MATCH_REPORT, selfMatch } from "./self-match";

const args = process.argv.slice(2);
const corpus = activeCorpus();
const at = args.indexOf("--report");
const reportPath = args.includes("--no-report")
  ? null
  : at >= 0 && args[at + 1]
    ? args[at + 1]
    : DEFAULT_SELF_MATCH_REPORT[corpus];

process.exit(selfMatch(readRawContent(undefined, corpus), corpus, reportPath) ? 0 : 1);
