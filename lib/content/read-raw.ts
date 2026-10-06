import fs from "node:fs";
import path from "node:path";
import { activeCorpus, CORPUS_DIRS, RESEARCH_LANGS, type CorpusName } from "./config";
import type { RawContent, RawCorpusSet, RawFile } from "./validate";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

function readIfExists(root: string, rel: string): RawFile | null {
  const abs = path.join(root, rel);
  return fs.existsSync(abs) ? { file: rel, raw: fs.readFileSync(abs, "utf8") } : null;
}

function readDir(root: string, relDir: string, ext: string): RawFile[] {
  const abs = path.join(root, relDir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter((f) => f.endsWith(ext))
    .sort()
    .map((f) => ({ file: `${relDir}/${f}`, raw: fs.readFileSync(path.join(abs, f), "utf8") }));
}

export function readCorpusSet(root: string, name: CorpusName, active: boolean): RawCorpusSet {
  const dirs = CORPUS_DIRS[name];
  return {
    name,
    active,
    lists: readIfExists(root, `${dirs.registry}/lists.json`),
    parties: readIfExists(root, `${dirs.registry}/parties.json`),
    research: Object.fromEntries(
      RESEARCH_LANGS.map((lang) => [lang, readDir(root, `${dirs.research}/${lang}`, ".md")]),
    ) as RawCorpusSet["research"],
  };
}

/** Reads everything validation needs from a content root (default: ./content). */
export function readRawContent(
  root: string = CONTENT_ROOT,
  active: CorpusName = activeCorpus(),
): RawContent {
  return {
    issues: readDir(root, "issues", ".json"),
    glossary: readIfExists(root, "glossary.json"),
    versions: readIfExists(root, "versions.json"),
    corpora: (["real", "placeholder"] as const).map((name) =>
      readCorpusSet(root, name, name === active),
    ),
  };
}
