import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitch } from "./language-switch";

export function SiteHeader() {
  const t = useTranslations("Nav");
  return (
    <header className="border-b">
      <a
        href="#main"
        className="focus:bg-background sr-only focus:not-sr-only focus:absolute focus:p-2"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <nav aria-label={t("home")}>
          <Link href="/" className="font-semibold">
            {t("home")}
          </Link>
        </nav>
        <LanguageSwitch />
      </div>
    </header>
  );
}
