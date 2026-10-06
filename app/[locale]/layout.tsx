import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DirectionProvider } from "@/components/ui/direction";
import { SiteHeader } from "@/components/layout/site-header";
import { localeDirection, routing } from "@/i18n/routing";
import "../globals.css";

// Hebrew-capable font with Latin coverage for the English pages.
const fontSans = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: { default: t("title"), template: `%s | ${t("siteName")}` },
    description: t("description"),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const dir = localeDirection[locale];

  return (
    <html lang={locale} dir={dir} className={`${fontSans.variable} h-full antialiased`}>
      <body className="bg-background text-foreground flex min-h-full flex-col font-sans">
        <NextIntlClientProvider>
          <DirectionProvider direction={dir}>
            <SiteHeader />
            <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
              {children}
            </main>
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
