import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Replaces the survey entry points once polls have closed. */
export function ElectionOverBanner() {
  const t = useTranslations("TimeModes");
  return (
    <div role="status" data-testid="election-over" className="sheet flex flex-col gap-2 p-4 sm:p-5">
      <p className="display text-xl">{t("electionOverTitle")}</p>
      <p className="text-muted-foreground">{t("electionOverBody")}</p>
      <p>
        <Link href="/parties" className="link">
          {t("browseParties")}
        </Link>
      </p>
    </div>
  );
}
