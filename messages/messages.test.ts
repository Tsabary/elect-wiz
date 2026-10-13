/**
 * Hebrew/English parity of the site copy: identical key structure and identical
 * ICU arguments/tags in every message, so neither language can miss a string.
 */
import { describe, expect, it } from "vitest";
import en from "./en.json";
import he from "./he.json";

type Tree = { [k: string]: string | (string | Tree)[] | Tree };

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else if (Array.isArray(v)) {
      // An entry is a string, or an object (a poll-derived paragraph with its neutral replacement).
      v.forEach((s, i) => {
        if (typeof s === "string") out[`${key}[${i}]`] = s;
        else Object.assign(out, flatten(s, `${key}[${i}]`));
      });
    } else Object.assign(out, flatten(v, key));
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

const flatEn = flatten(en as unknown as Tree);
const flatHe = flatten(he as unknown as Tree);

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

  it("never says which lists polled at what level (the criterion for researching a list is not published)", () => {
    // Owner decision 2026-10-13: the copy doesn't state the polling level used to
    // choose the researched lists, so the "official details only" label can never
    // be read as a poll result (research/legal-findings.md §3.1).
    for (const [key, v] of Object.entries({ ...flatEn, ...flatHe })) {
      expect(v, key).not.toMatch(
        /\b1%|polling at \d|בסקרים \d|measurable public presence|נוכחות ציבורית/,
      );
    }
  });

  it("names no operator: no email addresses or personal contact details", () => {
    for (const v of [...Object.values(flatEn), ...Object.values(flatHe)]) {
      expect(v).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
      expect(v).not.toMatch(/\+?972[\d -]{7,}|\b0\d{1,2}-?\d{7}\b/);
    }
  });

  it("offers no contact channel (owner decision, 2026-10-06)", () => {
    for (const tree of [en, he] as unknown as Tree[]) {
      const privacy = (tree.Privacy as Tree).sections as Tree;
      expect(privacy).not.toHaveProperty("contact");
    }
    for (const v of Object.values(flatEn)) {
      expect(v).not.toMatch(/contact address|get in touch|let us know/i);
    }
  });

  it("describes the site without AI at use time (deterministic matching, 2026-10-13)", () => {
    for (const tree of [en, he] as unknown as Tree[]) {
      const privacy = (tree.Privacy as Tree).sections as Tree;
      expect(privacy).not.toHaveProperty("ai");
      expect(privacy).not.toHaveProperty("abuse");
      expect(tree).not.toHaveProperty("AnythingElse");
    }
    // No leftover "to be completed" placeholders.
    expect(Object.keys(flatEn).filter((k) => k.endsWith(".placeholder"))).toEqual([]);
    for (const [key, v] of Object.entries({ ...flatEn, ...flatHe })) {
      expect(v.trim().startsWith("["), key).toBe(false);
    }
    for (const v of Object.values(flatEn)) {
      expect(v).not.toMatch(/AI provider|anything else|write your own|adjust its wording/i);
      expect(v).not.toMatch(/every party on the ballot is researched|can take a little while/i);
    }
    for (const v of Object.values(flatHe)) {
      expect(v).not.toMatch(/ספק בינה מלאכותית|עוד משהו|כותבים עמדה משלך|זה עשוי לקחת/);
    }
  });
});
