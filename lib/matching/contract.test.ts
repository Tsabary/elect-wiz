import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ERROR_CODES,
  ERROR_INFO,
  errorInfo,
  errorMessageKey,
  MAX_NOT_IMPORTANT,
  MAX_RANKED,
  MIN_RANKED,
  TOP_ENTRIES,
} from "./contract";

describe("error codes", () => {
  it("defines exactly the two failures that can still happen", () => {
    expect([...ERROR_CODES]).toEqual(["bundle_load_failed", "content_version_mismatch"]);
    expect(Object.keys(ERROR_INFO).sort()).toEqual([...ERROR_CODES].sort());
  });

  it("offers retry for a failed bundle load and restart for a version mismatch", () => {
    expect(errorInfo("bundle_load_failed").action).toBe("retry");
    expect(errorInfo("content_version_mismatch").action).toBe("restart");
  });

  it.each(ERROR_CODES)("maps %s to a message key", (code) => {
    expect(errorMessageKey(code)).toBe(`MatchErrors.${code}`);
  });

  it("has a localized message for every error code, and for no other, in both languages", async () => {
    const fixed = ["title", "retry", "restart"];
    for (const locale of ["he", "en"]) {
      const messages = (await import(`@/messages/${locale}.json`)).default as {
        MatchErrors: Record<string, string>;
      };
      for (const code of ERROR_CODES)
        expect(messages.MatchErrors[code], `${locale}:${code}`).toBeTruthy();
      expect(Object.keys(messages.MatchErrors).sort(), locale).toEqual(
        [...fixed, ...ERROR_CODES].sort(),
      );
    }
  });
});

describe("limits", () => {
  it("keeps the survey limits and the size of 'the top few'", () => {
    expect([MIN_RANKED, MAX_RANKED, MAX_NOT_IMPORTANT]).toEqual([5, 10, 5]);
    expect(TOP_ENTRIES).toBe(4);
  });
});

describe("the module", () => {
  it("has no request validation and no server-only imports left", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "lib/matching/contract.ts"), "utf8");
    expect(source).not.toMatch(/from "zod"|server-only|node:/);
    expect(source).not.toMatch(/matchRequestSchema|validateMatchRequest|anythingElse/i);
  });
});
