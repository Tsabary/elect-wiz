import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Replaces the survey entry points once polls have closed. */
export function ElectionOverBanner() {
  const t = useTranslations("TimeModes");
  return (
    <div
      role="status"
      data-testid="election-over"
      className="bg-muted flex flex-col gap-2 rounded-xl border p-4 sm:p-5"
    >
      <p className="font-semibold">{t("electionOverTitle")}</p>
      <p className="text-muted-foreground">{t("electionOverBody")}</p>
      <p>
        <Link href="/parties" className="font-medium underline underline-offset-4">
          {t("browseParties")}
        </Link>
      </p>
    </div>
  );
}
