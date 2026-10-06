/**
 * Hebrew/English parity of the site copy: identical key structure and identical
 * ICU arguments/tags in every message, so neither language can miss a string.
 */
import { describe, expect, it } from "vitest";
import en from "./en.json";
import he from "./he.json";

type Tree = { [k: string]: string | string[] | Tree };

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else if (Array.isArray(v)) v.forEach((s, i) => (out[`${key}[${i}]`] = s));
    else Object.assign(out, flatten(v, key));
  }
  return out;
}

/** Top-level ICU argument names and rich-text tags in a message. */
function args(message: string): string[] {
  const names = new Set<string>();
  for (const m of message.matchAll(/\{\s*([A-Za-z_]\w*)\s*[,}]/g)) names.add(m[1]);
  for (const m of message.matchAll(/<([A-Za-z_]\w*)>/g)) names.add(`<${m[1]}>`);
  return [...names].sort();
}

const flatEn = flatten(en as Tree);
const flatHe = flatten(he as Tree);

describe("site copy parity", () => {
  it("has the same keys in Hebrew and English", () => {
    expect(Object.keys(flatHe).sort()).toEqual(Object.keys(flatEn).sort());
  });

  it("uses the same arguments and tags in both languages", () => {
    for (const key of Object.keys(flatEn)) {
      expect(args(flatHe[key] ?? ""), key).toEqual(args(flatEn[key]));
    }
  });

  it("has no empty messages", () => {
    for (const [key, v] of Object.entries({ ...flatEn, ...flatHe })) {
      expect(v.trim().length, key).toBeGreaterThan(0);
    }
  });

  it("names no operator: no email addresses or personal contact details", () => {
    for (const v of [...Object.values(flatEn), ...Object.values(flatHe)]) {
      expect(v).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
      expect(v).not.toMatch(/\+?972[\d -]{7,}|\b0\d{1,2}-?\d{7}\b/);
    }
  });

  it("offers no contact channel (owner decision, 2026-10-06)", () => {
    for (const tree of [en, he] as Tree[]) {
      const privacy = (tree.Privacy as Tree).sections as Tree;
      expect(privacy).not.toHaveProperty("contact");
    }
    for (const v of Object.values(flatEn)) {
      expect(v).not.toMatch(/contact address|get in touch|let us know/i);
    }
  });
});
