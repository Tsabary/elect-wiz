import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
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

/** Message namespaces client components use; the rest stay on the server. */
const CLIENT_NAMESPACES = [
  "Metadata",
  "Nav",
  "LanguageSwitch",
  "Common",
  "Survey",
  "Ranking",
  "Answers",
  "AnythingElse",
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
  themeColor: "#ffffff",
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
    <html lang={locale} dir={dir} className={`${fontSans.variable} h-full antialiased`}>
      <body className="bg-background text-foreground flex min-h-full flex-col font-sans">
        <NextIntlClientProvider messages={clientMessages}>
          <DirectionProvider direction={dir}>
            <TimeModesProvider config={clientTimeConfig()}>
              <PreviewBanner />
              <SiteHeader />
              <main
                id="main"
                tabIndex={-1}
                className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 outline-none sm:py-10"
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
