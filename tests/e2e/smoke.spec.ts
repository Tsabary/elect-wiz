import { expect, test } from "@playwright/test";
import { issues, listedParties, LOCALES, researchedParties, versions } from "./helpers";

test.describe("locale detection and switching", () => {
  for (const locale of ["he-IL", "en-US", "fr-FR"]) {
    test(`a first visit lands on /he whatever the browser language (${locale})`, async ({
      browser,
    }) => {
      const ctx = await browser.newContext({ locale });
      const page = await ctx.newPage();
      await page.goto("/");
      await expect(page).toHaveURL(/\/he$/);
      await ctx.close();
    });
  }

  test("a manual switch persists across visits", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "he-IL" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/he$/);
    expect(await ctx.cookies()).toEqual([]);
    await page.getByTestId("language-switch").click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // A later visit to "/" keeps English.
    const again = await ctx.newPage();
    await again.goto("/");
    await expect(again).toHaveURL(/\/en$/);
    const cookies = await ctx.cookies();
    expect(cookies.map((c) => c.name)).toEqual(["locale-choice"]);
    expect(cookies[0].value).toBe("en");
    expect(cookies[0].sameSite).toBe("Lax");
    expect(cookies[0].expires).toBeGreaterThan(Date.now() / 1000 + 60 * 60 * 24 * 300);

    // Opening a Hebrew page directly doesn't undo the choice …
    await again.goto("/he/privacy");
    await again.goto("/");
    await expect(again).toHaveURL(/\/en$/);

    // … but switching back to Hebrew does, and persists too.
    await again.getByTestId("language-switch").click();
    await expect(again).toHaveURL(/\/he$/);
    const third = await ctx.newPage();
    await third.goto("/");
    await expect(third).toHaveURL(/\/he$/);
    expect((await ctx.cookies()).find((c) => c.name === "locale-choice")?.value).toBe("he");
    await ctx.close();
  });

  test("visiting an English page directly remembers nothing", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "en-US" });
    const page = await ctx.newPage();
    await page.goto("/en/privacy");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.goto("/en");
    await page.goto(`/en/parties/${researchedParties()[0].id}`);
    expect(await ctx.cookies()).toEqual([]);
    // The next visit to "/" is Hebrew, as for anyone who never used the switch.
    await page.goto("/");
    await expect(page).toHaveURL(/\/he$/);
    expect(await ctx.cookies()).toEqual([]);
    await ctx.close();
  });

  test("next-intl's old cookie is ignored and deleted", async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ locale: "he-IL" });
    await ctx.addCookies([{ name: "NEXT_LOCALE", value: "en", url: baseURL! }]);
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/he$/);
    expect(await ctx.cookies()).toEqual([]);
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
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("English renders LTR, including shadcn components", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    const button = page.getByTestId("language-switch");
    expect(await button.evaluate((el) => getComputedStyle(el).direction)).toBe("ltr");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("matching bundle route", () => {
  for (const locale of LOCALES) {
    test(`GET /api/matching/${locale} serves that language's bundle`, async ({ request }) => {
      const res = await request.get(`/api/matching/${locale}`);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("application/json");
      const bundle = JSON.parse(await res.text());
      expect(Object.keys(bundle).sort()).toEqual([
        "config",
        "distances",
        "locale",
        "matchingVersion",
        "positions",
        "surveyContentVersion",
        "texts",
      ]);
      expect(bundle.locale).toBe(locale);
      expect(bundle.surveyContentVersion).toBe(versions().surveyContentVersion);
      expect(bundle.matchingVersion).toBe(versions().matchingVersion);

      // One positions entry and one grid per issue; rows and texts for the researched parties only.
      const issueIds = issues()
        .map((i: any) => i.id as string)
        .sort();
      const researched = researchedParties()
        .map((p) => p.id as string)
        .sort();
      expect(bundle.positions.map((p: any) => p.issueId)).toEqual(issueIds);
      expect(bundle.distances.map((d: any) => d.issueId)).toEqual(issueIds);
      for (const p of bundle.positions) {
        expect(p.rows.map((r: any) => r.partyId)).toEqual(researched);
      }
      expect(bundle.texts.map((t: any) => t.partyId)).toEqual(researched);
      for (const t of bundle.texts) {
        expect(t.lang).toBe(locale);
        expect(Object.keys(t.issues).sort()).toEqual(issueIds);
      }
      const text = JSON.stringify(bundle);
      for (const p of listedParties()) expect(text).not.toContain(`"${p.id}"`);
      expect(typeof bundle.config).toBe("object");

      // The version parameter only busts caches: any value gets the current bundle.
      const versioned = await request.get(`/api/matching/${locale}?v=anything-at-all`);
      expect(versioned.status()).toBe(200);
      expect(await versioned.json()).toEqual(bundle);
    });
  }

  test("the two languages differ only in their texts", async ({ request }) => {
    const [he, en] = await Promise.all(
      LOCALES.map(async (l) => (await request.get(`/api/matching/${l}`)).json()),
    );
    expect(he.positions).toEqual(en.positions);
    expect(he.distances).toEqual(en.distances);
    expect(he.config).toEqual(en.config);
    expect(he.texts).not.toEqual(en.texts);
  });

  test("an unknown locale is a 404", async ({ request }) => {
    for (const path of ["/api/matching/fr", "/api/matching/xx", "/api/matching/he/extra"]) {
      expect((await request.get(path)).status(), path).toBe(404);
    }
  });
});

test.describe("tally route", () => {
  test("accepts a 'started' call and a 'result' call, with no content", async ({ request }) => {
    const ids = researchedParties().map((p) => p.id);
    for (const data of [{ kind: "started" }, { kind: "result", parties: ids.slice(0, 4) }]) {
      const res = await request.post("/api/tally", { data });
      expect(res.status()).toBe(204);
      expect(await res.text()).toBe("");
    }
  });

  test("rejects a malformed call", async ({ request }) => {
    const res = await request.post("/api/tally", { data: { hello: "world" } });
    expect(res.status()).toBe(400);
    expect(await res.text()).toBe("");
  });
});

test.describe("security headers", () => {
  test("every kind of response forbids framing, sniffing and full-URL referrers", async ({
    request,
  }) => {
    const [party] = researchedParties();
    for (const path of [
      "/he",
      "/en/privacy",
      `/en/parties/${party.id}`,
      "/he/survey",
      "/api/matching/en",
      "/he/no-such-page",
    ]) {
      const res = await request.get(path);
      const h = res.headers();
      expect(h["content-security-policy"], path).toBe("frame-ancestors 'none'");
      expect(h["x-frame-options"], path).toBe("DENY");
      expect(h["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
      expect(h["x-content-type-options"], path).toBe("nosniff");
    }
    const tally = await request.post("/api/tally", { data: { kind: "started" } });
    expect(tally.headers()["x-frame-options"]).toBe("DENY");
  });
});
