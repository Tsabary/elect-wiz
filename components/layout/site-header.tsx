import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitch } from "./language-switch";
import { MainNav } from "./main-nav";

export function SiteHeader() {
  const t = useTranslations("Nav");
  const m = useTranslations("Metadata");
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/85 border-foreground/15 sticky top-0 z-40 border-b backdrop-blur">
      <a
        href="#main"
        className="focus:bg-background focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-3 focus:z-50 focus:rounded-md focus:p-2 focus:ring-2"
      >
        {t("skipToContent")}
      </a>
      <FlagStripes />
      <div className="mx-auto flex w-full max-w-[70rem] flex-wrap items-center gap-x-6 px-4 pt-1.5 sm:flex-nowrap sm:py-1.5">
        <Link
          href="/"
          className="focus-visible:ring-ring/50 display flex min-h-11 items-center gap-2.5 rounded-md text-xl outline-none focus-visible:ring-3"
        >
          <LogoMark />
          <span>{m("siteName")}</span>
        </Link>
        <div className="order-2 ms-auto sm:order-3">
          <LanguageSwitch />
        </div>
        <MainNav className="order-3 w-full sm:order-2 sm:ms-auto sm:w-auto" />
      </div>
    </header>
  );
}

/** Two thin bands echoing the flag's stripes; the national palette, not a party's. */
function FlagStripes() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-[3px] pt-[3px]">
      <div className="bg-primary h-[3px]" />
      <div className="bg-primary h-[3px]" />
    </div>
  );
}

/** A slip going into the ballot box: the act of voting, with no party's colours or symbols. */
function LogoMark() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" className="size-7 shrink-0">
      <g transform="rotate(-8 14 11)">
        <rect
          x="7.5"
          y="1.5"
          width="13"
          height="18"
          rx="1"
          fill="#fff"
          strokeWidth="1.6"
          className="stroke-foreground"
        />
        <path
          d="M10.8 8.6l2.4 2.5 4.2-4.9"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-foreground"
        />
      </g>
      <path d="M2 15h24v9.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" className="fill-primary" />
      <rect x="6.5" y="17.6" width="15" height="1.9" rx="0.95" fill="#fff" fillOpacity="0.9" />
    </svg>
  );
}
