import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BallotSlip } from "@/components/parties/ballot-slip";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getLists, getParties } from "@/lib/content/loaders";
import { partySummaries } from "@/lib/content/party-view";
import { pageMetadata } from "@/lib/site";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <p className="eyebrow">{t("count", { count: parties.length })}</p>
        <h1 className="display text-4xl sm:text-6xl">{t("title")}</h1>
        <p className="text-muted-foreground max-w-prose text-lg leading-relaxed">{t("intro")}</p>
      </header>
      <ul className="border-foreground flex flex-col border-t-2" data-testid="party-list">
        {parties.map((p) => (
          <li key={p.id} className="border-foreground/15 border-b">
            <Link
              href={`/parties/${p.id}`}
              data-testid="party-link"
              data-party-id={p.id}
              data-tier={p.tier}
              className="group hover:bg-card focus-visible:ring-ring/50 -mx-2 flex items-start gap-4 rounded-sm px-2 py-4 outline-none focus-visible:ring-3"
            >
              <BallotSlip
                letters={p.list.ballotLetters}
                size="compact"
                className="mt-0.5 transition-transform group-hover:-rotate-3 motion-reduce:transition-none"
              />
              <span className="flex min-w-0 grow flex-col gap-1">
                <span
                  className="display text-xl underline-offset-4 group-hover:underline sm:text-2xl"
                  data-testid="party-link-name"
                >
                  {p.name}
                </span>
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
                <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span
                    className="inline-flex items-center gap-2 text-sm font-medium"
                    data-testid="party-tier"
                  >
                    {/* Filled for a researched party, hollow for a listed one. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "border-foreground size-2 shrink-0 rounded-full border-[1.5px]",
                        p.tier === "researched" && "bg-foreground",
                      )}
                    />
                    {t(`tier.${p.tier}`)}
                  </span>
                  {p.limitedInfo ? (
                    <span className="bg-kraft rounded-sm px-1.5 py-0.5 text-xs font-medium">
                      {t("limitedInfoBadge")}
                    </span>
                  ) : null}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
