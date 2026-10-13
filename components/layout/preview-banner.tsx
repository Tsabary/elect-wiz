import { useTranslations } from "next-intl";
import { activeCorpus } from "@/lib/content/config";

/**
 * Shown while the site runs on the fictional placeholder corpus, so nobody
 * mistakes sample content for real parties.
 */
export function PreviewBanner() {
  const t = useTranslations("Preview");
  if (activeCorpus() !== "placeholder") return null;
  return (
    <div
      role="note"
      data-testid="preview-banner"
      className="bg-muted text-muted-foreground border-b px-4 py-2 text-center text-xs"
    >
      {t("fictional")}
    </div>
  );
}
