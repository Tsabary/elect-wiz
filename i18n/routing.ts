import { defineRouting } from "next-intl/routing";

export const locales = ["he", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";

/** Text direction per locale. Hebrew is RTL, English LTR. */
export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  he: "rtl",
  en: "ltr",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  // First visit: detect from Accept-Language (unknown languages fall back to Hebrew).
  localeDetection: true,
  // A manual switch is remembered across visits for a year.
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  },
});

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
