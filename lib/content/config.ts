/**
 * Corpus selection.
 *
 * The repository holds two registry+research corpora side by side:
 *
 * - `real`: the CEC-verified registry (`content/registry/`), the party research
 *   (`content/research/{en,he}/`) and the matching content (`content/matching/`).
 *   Filled by the research pipeline (Stage 0, 2–6) and the matching content jobs.
 * - `placeholder`: an obviously fictional corpus (`content/placeholder/...`) so the
 *   website can be built and reviewed before research exists.
 *
 * The issues, glossary and versions (`content/issues/`, `content/glossary.json`,
 * `content/versions.json`) are shared by both.
 *
 * The site renders the ACTIVE corpus. It is validated strictly (every party needs
 * both research documents, every list a poll snapshot). The inactive corpus is
 * validated for schema and consistency, and any research documents it already has
 * are fully checked, so research can land incrementally. The active corpus is
 * `real` unless `CONTENT_CORPUS` says otherwise; the placeholder corpus stays
 * for tests, which select it explicitly (`vitest.config.mts`,
 * `playwright.config.ts`).
 */
export type CorpusName = "real" | "placeholder";

export const DEFAULT_ACTIVE_CORPUS: CorpusName = "real";

export function activeCorpus(env: Record<string, string | undefined> = process.env): CorpusName {
  const v = env.CONTENT_CORPUS;
  return v === "real" || v === "placeholder" ? v : DEFAULT_ACTIVE_CORPUS;
}

export const CORPUS_DIRS: Record<
  CorpusName,
  { registry: string; research: string; matching: string }
> = {
  real: { registry: "registry", research: "research", matching: "matching" },
  placeholder: {
    registry: "placeholder/registry",
    research: "placeholder/research",
    matching: "placeholder/matching",
  },
};

export const RESEARCH_LANGS = ["en", "he"] as const;
export type ResearchLang = (typeof RESEARCH_LANGS)[number];

/**
 * The "Hebrew content pending" switch: `hebrewContent` in `content/versions.json`
 * (owner decision 2026-10-13). While it is `"pending"`, the REAL corpus may lack
 * Hebrew research documents and Hebrew result texts: validation doesn't require
 * them (it still checks any that exist), and the Hebrew site shows the English
 * ones for the parties that lack them, marked as English, under a notice. With
 * `"ready"` or no value, both languages are required and nothing falls back.
 * The placeholder corpus is never affected.
 */
export function hebrewContentPending(
  versions: { hebrewContent?: "pending" | "ready" } | null | undefined,
  corpus: CorpusName,
): boolean {
  return corpus === "real" && versions?.hebrewContent === "pending";
}
