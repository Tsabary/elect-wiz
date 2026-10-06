import { getTranslations } from "next-intl/server";

interface Section {
  title: string;
  paragraphs: string[];
  /** Copy that can only be finalized later (e.g. after the D1 decision). Shown as a marked placeholder. */
  placeholder?: string;
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
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-balance">{t("title")}</h1>
        <p className="text-muted-foreground max-w-prose text-lg">{t("intro")}</p>
      </header>
      <nav aria-label={t("tocLabel")} className="rounded-xl border p-4">
        <ul className="flex flex-col gap-2 text-sm">
          {sectionKeys.map((key) => (
            <li key={key}>
              <a href={`#${key}`} className="underline underline-offset-4">
                {sections[key].title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {sectionKeys.map((key) => {
        const s = sections[key];
        return (
          <section
            key={key}
            id={key}
            aria-labelledby={`${key}-h`}
            className="flex scroll-mt-24 flex-col gap-3"
          >
            <h2 id={`${key}-h`} className="text-xl font-semibold">
              {s.title}
            </h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="max-w-prose leading-relaxed">
                {p}
              </p>
            ))}
            {s.placeholder && (
              <p
                data-placeholder="post-d1"
                className="text-muted-foreground max-w-prose rounded-lg border border-dashed px-4 py-3 text-sm"
              >
                {s.placeholder}
              </p>
            )}
          </section>
        );
      })}
    </article>
  );
}
