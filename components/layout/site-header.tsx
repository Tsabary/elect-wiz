import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitch } from "./language-switch";
import { MainNav } from "./main-nav";

export function SiteHeader() {
  const t = useTranslations("Nav");
  const m = useTranslations("Metadata");
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-40 backdrop-blur">
      <a
        href="#main"
        className="focus:bg-background focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-50 focus:rounded-md focus:p-2 focus:ring-2"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 sm:flex-nowrap">
        <Link
          href="/"
          className="focus-visible:ring-ring/50 flex min-h-11 items-center gap-2 rounded-md font-semibold outline-none focus-visible:ring-3"
        >
          <LogoMark />
          <span>{m("siteName")}</span>
        </Link>
        <div className="order-2 ms-auto sm:order-3">
          <LanguageSwitch />
        </div>
        <MainNav className="order-3 w-full sm:order-2 sm:ms-auto sm:w-auto" />
      </div>
      <FlagStripes />
    </header>
  );
}

/** Two thin bands echoing the flag's stripes; the national palette, not a party's. */
function FlagStripes() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-0.5">
      <div className="bg-primary h-1" />
      <div className="bg-primary h-1" />
    </div>
  );
}

/** A neutral, abstract mark in the flag's blue: no party colours or symbols. */
function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 shrink-0">
      <rect x="2" y="2" width="20" height="20" rx="6" className="fill-primary" />
      <path
        d="M7 12.5l3.2 3.2L17 8.8"
        fill="none"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary-foreground"
      />
    </svg>
  );
}
