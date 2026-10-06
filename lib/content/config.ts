/**
 * Corpus selection.
 *
 * The repository holds two registry+research corpora side by side:
 *
 * - `real`: the CEC-verified registry (`content/registry/`) and the party research
 *   (`content/research/{en,he}/`). Filled by the research pipeline (Stage 0, 2–6).
 * - `placeholder`: an obviously fictional corpus (`content/placeholder/...`) so the
 *   website can be built and reviewed before research exists.
 *
 * The issues, glossary and versions (`content/issues/`, `content/glossary.json`,
 * `content/versions.json`) are shared by both.
 *
 * The site renders the ACTIVE corpus. It is validated strictly (every party needs
 * both research documents, every list a poll snapshot). The inactive corpus is
 * validated for schema and consistency, and any research documents it already has
 * are fully checked, so research can land incrementally. Task 4.1 switches the
 * active corpus to `real` and deletes the placeholder corpus.
 */
export type CorpusName = "real" | "placeholder";

export const DEFAULT_ACTIVE_CORPUS: CorpusName = "placeholder";

export function activeCorpus(env: Record<string, string | undefined> = process.env): CorpusName {
  const v = env.CONTENT_CORPUS;
  return v === "real" || v === "placeholder" ? v : DEFAULT_ACTIVE_CORPUS;
}

export const CORPUS_DIRS: Record<CorpusName, { registry: string; research: string }> = {
  real: { registry: "registry", research: "research" },
  placeholder: { registry: "placeholder/registry", research: "placeholder/research" },
};

export const RESEARCH_LANGS = ["en", "he"] as const;
export type ResearchLang = (typeof RESEARCH_LANGS)[number];
