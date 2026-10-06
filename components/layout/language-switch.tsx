"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/**
 * Toggles between Hebrew and English. Navigating to the other locale prefix makes
 * next-intl's proxy store the choice in the NEXT_LOCALE cookie, which then
 * overrides Accept-Language detection on later visits.
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
      className="h-10 px-3 text-sm"
      lang={other}
      aria-label={t("switchTo")}
      data-testid="language-switch"
      disabled={isPending}
      onClick={() => {
        // Set the cookie explicitly too, so the choice persists even if detection would differ.
        document.cookie = `NEXT_LOCALE=${other}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
        startTransition(() => router.replace(pathname, { locale: other }));
      }}
    >
      {t(other)}
    </Button>
  );
}
