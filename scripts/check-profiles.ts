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
import { profileCheck } from "./profiles";

const name = activeCorpus();
process.exit(profileCheck(readRawContent(undefined, name), name, true) ? 0 : 1);
