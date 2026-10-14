"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_CHOICE_COOKIE, LOCALE_CHOICE_MAX_AGE, type Locale } from "@/i18n/routing";

/**
 * Toggles between Hebrew and English, and remembers the choice in the
 * language-choice cookie, so that `/` opens in that language on later visits
 * (proxy.ts). This button is the only thing that writes the cookie.
 */
export function LanguageSwitch() {
  const locale = useLocale() as Locale;
  const t = useTranslations("LanguageSwitch");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const other: Locale = locale === "he" ? "en" : "he";

  return (
    <Button
      variant="outline"
      className="border-foreground/25 h-10 px-3 text-sm"
      lang={other}
      aria-label={t("switchTo")}
      data-testid="language-switch"
      disabled={isPending}
      onClick={() => {
        document.cookie = `${LOCALE_CHOICE_COOKIE}=${other}; path=/; max-age=${LOCALE_CHOICE_MAX_AGE}; samesite=lax`;
        // Keep the fragment: a shared link's answers (`#a=…`) live there.
        const hash = window.location.hash;
        startTransition(() => router.replace(`${pathname}${hash}`, { locale: other }));
      }}
    >
      {t(other)}
    </Button>
  );
}
