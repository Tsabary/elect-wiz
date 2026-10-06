import { useTranslations } from "next-intl";
import { activeCorpus } from "@/lib/content/config";
import { selectImplementation } from "@/lib/matching/registry";

/**
 * Shown while the site runs on the fictional placeholder corpus and/or the mock
 * matcher, so nobody mistakes sample content or simulated results for real ones.
 */
export function PreviewBanner() {
  const t = useTranslations("Preview");
  const fictional = activeCorpus() === "placeholder";
  const simulated = selectImplementation()?.name === "mock";
  if (!fictional && !simulated) return null;
  return (
    <div
      role="note"
      data-testid="preview-banner"
      className="bg-muted text-muted-foreground border-b px-4 py-2 text-center text-xs"
    >
      {fictional && simulated ? t("both") : fictional ? t("fictional") : t("simulated")}
    </div>
  );
}
