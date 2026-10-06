/**
 * Typed, server-side access to the ACTIVE corpus. Content is validated at build
 * time, so loaders parse without re-running the full rule set and throw if the
 * files are malformed.
 */
import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { activeCorpus, CORPUS_DIRS, type ResearchLang } from "./config";
import { CONTENT_ROOT } from "./read-raw";
import { parseResearchDoc, type ParsedResearchDoc } from "./research-parser";
import {
  glossarySchema,
  issueSchema,
  listsFileSchema,
  partiesFileSchema,
  versionsSchema,
  type Glossary,
  type Issue,
  type List,
  type Party,
  type Versions,
} from "./schemas";

const readJson = (rel: string): unknown =>
  JSON.parse(fs.readFileSync(path.join(CONTENT_ROOT, rel), "utf8"));

export const getIssues = cache((): Issue[] => {
  const dir = path.join(CONTENT_ROOT, "issues");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => issueSchema.parse(readJson(`issues/${f}`)));
});

export const getIssue = (id: string): Issue | undefined => getIssues().find((i) => i.id === id);

export const getGlossary = cache((): Glossary => glossarySchema.parse(readJson("glossary.json")));

export const getVersions = cache((): Versions => versionsSchema.parse(readJson("versions.json")));

const registryDir = () => CORPUS_DIRS[activeCorpus()].registry;

export const getLists = cache(
  (): List[] => listsFileSchema.parse(readJson(`${registryDir()}/lists.json`)).lists,
);

export const getParties = cache(
  (): Party[] => partiesFileSchema.parse(readJson(`${registryDir()}/parties.json`)).parties,
);

export const getParty = (id: string): Party | undefined => getParties().find((p) => p.id === id);

export const getList = (id: string): List | undefined => getLists().find((l) => l.id === id);

/** The other parties running on the same list (empty for a single-party list). */
export function getPartners(partyId: string): Party[] {
  const party = getParty(partyId);
  if (!party) return [];
  const list = getList(party.listId);
  return (list?.memberPartyIds ?? [])
    .filter((id) => id !== partyId)
    .map((id) => getParty(id))
    .filter((p): p is Party => !!p);
}

export interface ResearchDoc extends ParsedResearchDoc {
  partyId: string;
  lang: ResearchLang;
  researchedAsOf: string;
}

export const getResearchDoc = cache((partyId: string, lang: ResearchLang): ResearchDoc | null => {
  const rel = `${CORPUS_DIRS[activeCorpus()].research}/${lang}/${partyId}.md`;
  const abs = path.join(CONTENT_ROOT, rel);
  if (!fs.existsSync(abs)) return null;
  const doc = parseResearchDoc(fs.readFileSync(abs, "utf8"));
  return { ...doc, partyId, lang, researchedAsOf: doc.frontmatter.researchedAsOf ?? "" };
});
