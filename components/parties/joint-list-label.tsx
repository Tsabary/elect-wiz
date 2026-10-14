import { useLocale, useTranslations } from "next-intl";
import { Fragment } from "react";
import { Link } from "@/i18n/navigation";
import { pairListParts } from "@/lib/list-parts";

/**
 * Joins React nodes with the locale's list conjunction ("A, B and C" / "A, B ו-C").
 * `prefetch={false}` where the links say something about the visitor (a result).
 */
export function ListOfLinks({
  items,
  prefetch,
}: {
  items: { id: string; name: string }[];
  prefetch?: false;
}) {
  const locale = useLocale();
  const parts = new Intl.ListFormat(locale, { type: "conjunction" }).formatToParts(
    items.map((i) => i.id),
  );
  return (
    <>
      {pairListParts(parts, items).map((piece, idx) => {
        if (piece.kind === "literal") return <Fragment key={idx}>{piece.text}</Fragment>;
        const item = piece.item;
        return (
          <Link
            key={idx}
            href={`/parties/${item.id}`}
            prefetch={prefetch}
            className="font-medium underline decoration-current/40 decoration-1 underline-offset-4 hover:decoration-current"
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
  prefetch,
}: {
  partners: { id: string; name: string }[];
  listName: string;
  /** False inside a result, whose parties must not be fetched before a click (privacy). */
  prefetch?: false;
}) {
  const t = useTranslations("Common");
  return (
    <span data-testid="joint-list-label">
      {t.rich("jointList", {
        partners: () => <ListOfLinks items={partners} prefetch={prefetch} />,
        list: listName,
      })}
    </span>
  );
}
