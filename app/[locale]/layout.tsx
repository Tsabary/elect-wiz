import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { PreviewBanner } from "@/components/layout/preview-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TimeModesProvider } from "@/components/time/time-modes";
import { DirectionProvider } from "@/components/ui/direction";
import { localeDirection, routing } from "@/i18n/routing";
import { pageMetadata, siteUrl } from "@/lib/site";
import { clientTimeConfig } from "@/lib/time-modes";
import "../globals.css";

// Hebrew-capable font with Latin coverage for the English pages.
const fontSans = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-sans",
  display: "swap",
});

// Noto Serif Hebrew for headings: a contemporary Hebrew serif, with a matching Latin.
// One family per script, each limited to its own characters. Both are preloaded
// (Hebrew pages need the Latin file too, for digits) so headings never flash a fallback.
const fontDisplayHebrew = localFont({
  src: [{ path: "../../assets/fonts/noto-serif-hebrew-hebrew-700-normal.woff2", weight: "700" }],
  variable: "--font-display-he",
  display: "swap",
  preload: true,
  // No generated fallback family: it would catch the Latin letters before the Latin family does.
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F",
    },
  ],
});
const fontDisplayLatin = localFont({
  src: [{ path: "../../assets/fonts/noto-serif-hebrew-latin-700-normal.woff2", weight: "700" }],
  variable: "--font-display-lat",
  display: "swap",
  preload: true,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

/** Message namespaces client components use; the rest stay on the server. */
const CLIENT_NAMESPACES = [
  "Metadata",
  "Nav",
  "LanguageSwitch",
  "Common",
  "Survey",
  "Ranking",
  "Answers",
  "Result",
  "Polls",
  "MatchErrors",
  "Share",
  "TimeModes",
] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f4eb",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    metadataBase: siteUrl(),
    title: { default: t("title"), template: `%s | ${t("siteName")}` },
    applicationName: t("siteName"),
    ...pageMetadata({
      locale,
      description: t("description"),
      siteName: t("siteName"),
      siteImage: false,
    }),
    // Operator anonymity: no author/creator/publisher metadata (plan Security §3).
    robots: { index: true, follow: true },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const dir = localeDirection[locale];
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]),
  );

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fontSans.variable} ${fontDisplayHebrew.variable} ${fontDisplayLatin.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col font-sans">
        <NextIntlClientProvider messages={clientMessages}>
          <DirectionProvider direction={dir}>
            <TimeModesProvider config={clientTimeConfig()}>
              <PreviewBanner />
              <SiteHeader />
              <main
                id="main"
                tabIndex={-1}
                className="page-grid w-full flex-1 pt-8 pb-24 outline-none sm:pt-12 sm:pb-28"
              >
                {children}
              </main>
              <SiteFooter />
            </TimeModesProvider>
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
