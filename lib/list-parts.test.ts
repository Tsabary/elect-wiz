import { describe, expect, it } from "vitest";
import { pairListParts } from "./list-parts";

const items = [
  { id: "agudat-yisrael", name: "A" },
  { id: "degel-hatorah", name: "D" },
  { id: "chomat-torat-yisrael", name: "C" },
];

describe("pairListParts", () => {
  it("pairs Safari's Hebrew parts, whose elements carry bidi isolation marks", () => {
    // What WebKit's Intl.ListFormat("he").formatToParts returns.
    const parts = [
      { type: "element", value: "⁨agudat-yisrael⁩" },
      { type: "literal", value: ", " },
      { type: "element", value: "⁨degel-hatorah⁩" },
      { type: "literal", value: " ו-" },
      { type: "element", value: "⁨chomat-torat-yisrael⁩" },
    ];
    expect(pairListParts(parts, items)).toEqual([
      { kind: "item", item: items[0] },
      { kind: "literal", text: ", " },
      { kind: "item", item: items[1] },
      { kind: "literal", text: " ו-" },
      { kind: "item", item: items[2] },
    ]);
  });

  it("pairs the engine's own output in order", () => {
    const parts = new Intl.ListFormat("he", { type: "conjunction" }).formatToParts(
      items.map((i) => i.id),
    );
    const paired = pairListParts(parts, items).filter((p) => p.kind === "item");
    expect(paired.map((p) => (p.kind === "item" ? p.item.id : ""))).toEqual(items.map((i) => i.id));
  });
});
