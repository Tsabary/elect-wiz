/**
 * Pairs `Intl.ListFormat#formatToParts` output with the items that were
 * formatted. Elements come back in input order, so they are matched by
 * position, never by value: Safari wraps each Hebrew element in bidi isolation
 * marks (U+2068 … U+2069), so an element's value is not the string that went in.
 */
export type ListPiece<T> = { kind: "literal"; text: string } | { kind: "item"; item: T };

export function pairListParts<T>(
  parts: readonly { type: string; value: string }[],
  items: readonly T[],
): ListPiece<T>[] {
  let next = 0;
  const pieces: ListPiece<T>[] = [];
  for (const part of parts) {
    if (part.type === "literal") pieces.push({ kind: "literal", text: part.value });
    else if (next < items.length) pieces.push({ kind: "item", item: items[next++] });
  }
  return pieces;
}
