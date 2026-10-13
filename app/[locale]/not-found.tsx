import { useTranslations } from "next-intl";
import { BallotArt } from "@/components/brand/ballot-art";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <section className="flex flex-col items-start gap-5 py-6 sm:flex-row-reverse sm:items-center sm:justify-end sm:gap-12 sm:py-12">
      <BallotArt className="text-[12px] sm:text-[16px]" />
      <div className="flex flex-col items-start gap-4">
        <h1 className="display text-4xl sm:text-6xl">{t("title")}</h1>
        <p className="text-muted-foreground text-lg">{t("body")}</p>
        <div className="flex gap-6">
          <Link href="/" className="link inline-flex min-h-11 items-center">
            {t("home")}
          </Link>
          <Link href="/parties" className="link inline-flex min-h-11 items-center">
            {t("parties")}
          </Link>
        </div>
      </div>
    </section>
  );
}
