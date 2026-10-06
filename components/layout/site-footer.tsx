import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  return (
    <footer className="text-muted-foreground mt-12 border-t text-sm">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-6">
        <p>{t("neutrality")}</p>
        <nav aria-label={nav("footerLabel")}>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li>
              <Link href="/privacy" className="hover:text-foreground underline underline-offset-4">
                {nav("privacy")}
              </Link>
            </li>
            <li>
              <Link
                href="/how-it-works"
                className="hover:text-foreground underline underline-offset-4"
              >
                {nav("howItWorks")}
              </Link>
            </li>
            <li>
              <Link href="/parties" className="hover:text-foreground underline underline-offset-4">
                {nav("parties")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
