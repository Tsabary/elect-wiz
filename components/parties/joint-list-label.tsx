import { useLocale, useTranslations } from "next-intl";
import { Fragment } from "react";
import { Link } from "@/i18n/navigation";

/** Joins React nodes with the locale's list conjunction ("A, B and C" / "A, B ו-C"). */
export function ListOfLinks({ items }: { items: { id: string; name: string }[] }) {
  const locale = useLocale();
  const parts = new Intl.ListFormat(locale, { type: "conjunction" }).formatToParts(
    items.map((i) => i.id),
  );
  return (
    <>
      {parts.map((part, idx) => {
        if (part.type === "literal") return <Fragment key={idx}>{part.value}</Fragment>;
        const item = items.find((i) => i.id === part.value)!;
        return (
          <Link
            key={idx}
            href={`/parties/${item.id}`}
            className="font-medium underline underline-offset-4"
          >
            {item.name}
          </Link>
        );
      })}
    </>
  );
}

/**
 * "Running on a joint list with [Party B] as [list name]" (PRD "Joint lists").
 * Partners link to their research pages. The list's ballot letters are not in
 * the sentence: the ballot slip shown beside it carries them.
 */
export function JointListLabel({
  partners,
  listName,
}: {
  partners: { id: string; name: string }[];
  listName: string;
}) {
  const t = useTranslations("Common");
  return (
    <span data-testid="joint-list-label">
      {t.rich("jointList", {
        partners: () => <ListOfLinks items={partners} />,
        list: listName,
      })}
    </span>
  );
}
