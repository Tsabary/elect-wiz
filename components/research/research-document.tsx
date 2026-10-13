import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { ResearchDoc } from "@/lib/content/loaders";
import { renderInlineMarkdown, renderMarkdown } from "@/lib/content/markdown";

/**
 * Renders a parsed research document with stable, deep-linkable anchors for
 * every section and sub-section (identical across languages), and numbered
 * sources (`#source-N`) that inline citations link to.
 */
const dirOf = (lang: string) => (lang === "he" ? "rtl" : "ltr");

export async function ResearchDocument({
  doc,
  pageLocale,
  afterOverview,
}: {
  doc: ResearchDoc;
  /**
   * The page's language. When the document is in another one (the "Hebrew
   * content pending" fallback), the document is marked with its own language
   * and direction, and the interface parts inside it with the page's.
   */
  pageLocale?: string;
  /** Rendered at the end of the Overview section (the registry polling block). */
  afterOverview?: ReactNode;
}) {
  const t = await getTranslations("Research");
  const foreign = !!pageLocale && pageLocale !== doc.lang;
  const docProps = foreign ? { lang: doc.lang, dir: dirOf(doc.lang) } : {};
  const pageProps = foreign ? { lang: pageLocale, dir: dirOf(pageLocale) } : {};
  return (
    <div className="flex flex-col gap-10" data-testid="research-document" {...docProps}>
      <nav aria-label={t("tocLabel")} className="rounded-xl border p-4">
        <h2 className="mb-2 text-sm font-semibold" {...pageProps}>
          {t("tocLabel")}
        </h2>
        <ol className="flex flex-col gap-1.5 text-sm">
          {doc.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="underline underline-offset-4">
                {s.title}
              </a>
              {s.id === "issues" && s.subsections.length > 0 && (
                <ul className="ms-4 mt-1.5 flex flex-col gap-1.5">
                  {s.subsections.map((sub) => (
                    <li key={sub.id}>
                      <a href={`#${sub.id}`} className="text-muted-foreground underline underline-offset-4">
                        {sub.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {doc.sections.map((s) => (
        <section key={s.id} aria-labelledby={s.id} className="flex flex-col gap-3">
          <h2 id={s.id} className="scroll-mt-28 text-2xl font-semibold">
            {s.title}
          </h2>
          {s.id === "sources" ? (
            <ol className="research-prose flex list-decimal flex-col gap-2 ps-6 text-sm" data-testid="sources">
              {doc.sources.map((src) => (
                <li
                  key={src.n}
                  id={`source-${src.n}`}
                  value={src.n}
                  className="scroll-mt-28 break-words"
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(src.text) }}
                />
              ))}
            </ol>
          ) : (
            <>
              {s.body.trim() && (
                <div className="research-prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(s.body) }} />
              )}
              {s.id === "overview" &&
                afterOverview &&
                (foreign ? <div {...pageProps}>{afterOverview}</div> : afterOverview)}
              {s.subsections.map((sub) => (
                <section key={sub.id} aria-labelledby={sub.id} className="flex flex-col gap-2 pt-2">
                  <h3 id={sub.id} className="scroll-mt-28 text-lg font-semibold">
                    {sub.title}
                  </h3>
                  <div className="research-prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(sub.body) }} />
                </section>
              ))}
            </>
          )}
        </section>
      ))}
    </div>
  );
}
