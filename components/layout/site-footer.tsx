import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CreditDialog } from "./credit-dialog";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  const m = useTranslations("Metadata");
  const link =
    "text-ink-foreground decoration-ink-foreground/40 hover:decoration-ink-foreground inline-flex min-h-11 items-center underline decoration-1 underline-offset-4";
  return (
    <footer className="bg-ink text-ink-muted text-sm">
      <div aria-hidden="true" className="flex flex-col gap-[3px] pt-[3px]">
        <div className="bg-background h-[3px]" />
        <div className="bg-background h-[3px]" />
      </div>
      <div className="mx-auto grid w-full max-w-[70rem] gap-x-12 gap-y-4 px-4 py-10 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-3">
          <p className="display text-ink-foreground text-xl">{m("siteName")}</p>
          <p className="max-w-prose leading-relaxed">{t("neutrality")}</p>
          <CreditDialog
            className={link}
            labels={{
              open: t("credit.open"),
              builtBy: t("credit.builtBy"),
              name: t("credit.name"),
              linksLabel: t("credit.linksLabel"),
              close: t("credit.close"),
            }}
          />
        </div>
        <nav aria-label={nav("footerLabel")}>
          <ul className="flex flex-wrap gap-x-6 sm:flex-col">
            <li>
              <Link href="/parties" className={link}>
                {nav("parties")}
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className={link}>
                {nav("howItWorks")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={link}>
                {nav("privacy")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
