import { getTranslations } from "next-intl/server";

interface Section {
  title: string;
  paragraphs: string[];
}

/**
 * Renders a static copy page from a message namespace shaped as
 * `{ title, intro, sections: { [key]: Section } }`.
 */
export async function ProsePage({
  namespace,
  sectionKeys,
}: {
  namespace: string;
  sectionKeys: string[];
}) {
  const t = await getTranslations(namespace);
  const sections = t.raw("sections") as Record<string, Section>;
  return (
    <article className="col-wide flex flex-col gap-10">
      <header className="border-foreground flex flex-col gap-4 border-b-2 pb-8">
        <h1 className="display text-4xl sm:text-6xl">{t("title")}</h1>
        <p className="max-w-prose text-lg leading-relaxed sm:text-xl">{t("intro")}</p>
      </header>
      <div className="doc-layout">
        <nav
          aria-label={t("tocLabel")}
          className="doc-toc sheet p-4 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
        >
          <ol className="flex flex-col text-[0.9375rem]">
            {sectionKeys.map((key, i) => (
              <li key={key} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="text-muted-foreground w-4 shrink-0 py-1 font-bold tabular-nums"
                >
                  {i + 1}
                </span>
                <a href={`#${key}`} className="!text-foreground font-medium">
                  {sections[key].title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="flex min-w-0 flex-col gap-12">
          {sectionKeys.map((key, i) => {
            const s = sections[key];
            return (
              <section
                key={key}
                id={key}
                aria-labelledby={`${key}-h`}
                className="flex scroll-mt-24 flex-col gap-4"
              >
                <h2
                  id={`${key}-h`}
                  className="display flex items-baseline gap-4 text-2xl sm:text-3xl"
                >
                  <span aria-hidden="true" className="text-primary text-4xl sm:text-5xl">
                    {i + 1}
                  </span>
                  {s.title}
                </h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="max-w-prose text-[1.0625rem] leading-[1.75]">
                    {p}
                  </p>
                ))}
              </section>
            );
          })}
        </div>
      </div>
    </article>
  );
}
