import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Button } from "@/components/ui/button";

export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Home");
  return (
    <section className="flex flex-col items-start gap-6">
      <h1 className="text-3xl font-bold">{t("heading")}</h1>
      <p className="text-muted-foreground text-lg">{t("intro")}</p>
      <Button size="lg" disabled>
        {t("start")}
      </Button>
    </section>
  );
}
