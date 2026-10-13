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
    <div className="doc-layout" data-testid="research-document" {...docProps}>
      <nav aria-label={t("tocLabel")} className="doc-toc sheet p-4 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <h2 className="eyebrow mb-3" {...pageProps}>
          {t("tocLabel")}
        </h2>
        <ol className="flex flex-col text-[0.9375rem]">
          {doc.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="!text-foreground font-medium">
                {s.title}
              </a>
              {s.id === "issues" && s.subsections.length > 0 && (
                <ul className="border-foreground/15 ms-1 mb-1 flex flex-col border-s ps-3 text-sm">
                  {s.subsections.map((sub) => (
                    <li key={sub.id}>
                      <a href={`#${sub.id}`}>{sub.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex min-w-0 flex-col gap-12">
      {doc.sections.map((s) => (
        <section key={s.id} aria-labelledby={s.id} className="flex flex-col gap-4">
          <h2
            id={s.id}
            className="display border-foreground scroll-mt-28 border-t-2 pt-4 text-3xl sm:text-4xl"
          >
            {s.title}
          </h2>
          {s.id === "sources" ? (
            <ol className="research-prose !gap-0 flex list-decimal flex-col ps-6 !text-sm !leading-relaxed" data-testid="sources">
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
                <section key={sub.id} aria-labelledby={sub.id} className="flex flex-col gap-2 pt-4">
                  <h3 id={sub.id} className="scroll-mt-28 text-xl font-bold">
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
    </div>
  );
}
