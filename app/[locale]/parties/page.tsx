import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getLists, getParties } from "@/lib/content/loaders";
import { partySummaries } from "@/lib/content/party-view";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/parties">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Parties" });
  const m = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    locale,
    path: "parties",
    title: t("title"),
    description: t("description"),
    siteName: m("siteName"),
  });
}

export default async function PartiesPage({ params }: PageProps<"/[locale]/parties">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Parties");
  const parties = partySummaries(getParties(), getLists(), locale);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground max-w-prose">{t("intro")}</p>
        <p className="text-muted-foreground text-sm">{t("count", { count: parties.length })}</p>
      </header>
      <ul className="flex flex-col gap-3" data-testid="party-list">
        {parties.map((p) => (
          <li key={p.id}>
            <Link
              href={`/parties/${p.id}`}
              data-testid="party-link"
              data-party-id={p.id}
              className="hover:bg-muted/50 focus-visible:ring-ring/50 flex flex-col gap-1 rounded-xl border p-4 outline-none focus-visible:ring-3"
            >
              <span className="text-lg font-semibold">{p.name}</span>
              <span className="text-muted-foreground text-sm">
                {t("leader", { name: p.leader })}
              </span>
              {p.list.isJoint ? (
                <span className="text-sm" data-testid="joint-group">
                  {t("jointGroup", {
                    list: p.list.name,
                    partners: new Intl.ListFormat(locale, { type: "conjunction" }).format(
                      p.partners.map((x) => x.name),
                    ),
                  })}
                </span>
              ) : null}
              {p.list.ballotLetters ? (
                <span className="text-muted-foreground text-sm">
                  {t("ballotLetters", { letters: p.list.ballotLetters })}
                </span>
              ) : null}
              {p.limitedInfo ? (
                <span className="text-muted-foreground text-xs font-medium">
                  {t("limitedInfoBadge")}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
