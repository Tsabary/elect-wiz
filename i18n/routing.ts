import { defineRouting } from "next-intl/routing";

export const locales = ["he", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";

/** Text direction per locale. Hebrew is RTL, English LTR. */
export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  he: "rtl",
  en: "ltr",
};

/**
 * The language picked with the switch (components/layout/language-switch.tsx),
 * remembered for a year so `/` opens in it. Only the switch writes it: visiting
 * a page in either language sets nothing (owner decision, 2026-10-14).
 */
export const LOCALE_CHOICE_COOKIE = "locale-choice";
export const LOCALE_CHOICE_MAX_AGE = 60 * 60 * 24 * 365;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  // Unprefixed paths: Hebrew, or the language picked with the switch. proxy.ts puts
  // that choice where next-intl reads the browser language, which it hides.
  localeDetection: true,
  // next-intl's own cookie is off: it would remember every page visited, not a choice.
  localeCookie: false,
});

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
