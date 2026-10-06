import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("body")}</p>
      <div className="flex gap-4">
        <Link href="/" className="font-medium underline underline-offset-4">
          {t("home")}
        </Link>
        <Link href="/parties" className="font-medium underline underline-offset-4">
          {t("parties")}
        </Link>
      </div>
    </section>
  );
}
