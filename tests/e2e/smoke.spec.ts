import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

/** A valid matching request built from the current content files. */
function validMatchRequest(locale: "he" | "en" = "he") {
  const dir = path.join(process.cwd(), "content", "issues");
  const issues = fs
    .readdirSync(dir)
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
  const versions = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content", "versions.json"), "utf8"),
  );
  const ranked = issues.slice(0, 6);
  return {
    locale,
    surveyContentVersion: versions.surveyContentVersion as string,
    ranked: ranked.map((i) => i.id),
    notImportant: issues.slice(6).map((i) => i.id),
    answers: ranked.map((i) => ({
      issueId: i.id,
      text: i.options[0][locale],
      startingOptionId: i.options[0].id,
      edited: false,
    })),
    anythingElse: null,
    token: null,
  };
}

test.describe("locale detection and switching", () => {
  test("Hebrew browser language lands on /he", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "he-IL" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/he$/);
    await ctx.close();
  });

  test("unknown browser language lands on /he (default)", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "fr-FR" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/he$/);
    await ctx.close();
  });

  test("English browser language lands on /en", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "en-US" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await ctx.close();
  });

  test("manual switch overrides detection and persists across visits", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "en-US" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await page.getByTestId("language-switch").click();
    await expect(page).toHaveURL(/\/he$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "he");

    // A later visit to "/" keeps Hebrew despite the English browser language.
    const again = await ctx.newPage();
    await again.goto("/");
    await expect(again).toHaveURL(/\/he$/);
    const cookie = (await ctx.cookies()).find((c) => c.name === "NEXT_LOCALE");
    expect(cookie?.value).toBe("he");
    expect(cookie?.expires ?? 0).toBeGreaterThan(Date.now() / 1000 + 60 * 60 * 24 * 300);

    // And switching back to English persists too.
    await again.getByTestId("language-switch").click();
    await expect(again).toHaveURL(/\/en$/);
    const third = await ctx.newPage();
    await third.goto("/");
    await expect(third).toHaveURL(/\/en$/);
    await ctx.close();
  });
});

test.describe("direction", () => {
  test("Hebrew renders RTL, including shadcn components", async ({ page }) => {
    await page.goto("/he");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "he");
    const button = page.getByTestId("language-switch");
    expect(await button.evaluate((el) => getComputedStyle(el).direction)).toBe("rtl");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("מפלגה");
  });

  test("English renders LTR, including shadcn components", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    const button = page.getByTestId("language-switch");
    expect(await button.evaluate((el) => getComputedStyle(el).direction)).toBe("ltr");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("party");
  });
});

test.describe("matching route (mock)", () => {
  test("rejects an invalid body with a typed validation error", async ({ request }) => {
    const res = await request.post("/api/match", { data: { hello: "world" } });
    expect(res.status()).toBe(400);
    expect(await res.json()).toMatchObject({ error: { code: "validation" } });
  });

  test("can be forced to simulate an error outside production", async ({ request }) => {
    const res = await request.post("/api/match", {
      data: validMatchRequest(),
      headers: { "x-mock-scenario": "error-rate_limited" },
    });
    expect(res.status()).toBe(429);
    expect(await res.json()).toEqual({ error: { code: "rate_limited" } });
  });
});

test("matching route returns a contract-shaped result for a valid request", async ({ request }) => {
  const data = validMatchRequest();
  const res = await request.post("/api/match", { data });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.entries.length).toBeGreaterThanOrEqual(3);
  expect(body.entries[0].metadata.name).toBeTruthy();
  expect(body.meta.surveyContentVersion).toBe(data.surveyContentVersion);
});
