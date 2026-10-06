import { expect, test } from "@playwright/test";
import { issues, lists, parties } from "./helpers";

const STATIC_PATHS = ["", "/how-it-works", "/privacy", "/parties"];

for (const locale of ["he", "en"] as const) {
  test.describe(`static pages (${locale})`, () => {
    for (const p of STATIC_PATHS) {
      test(`${p || "/"} renders with direction, navigation and locale alternates`, async ({
        page,
      }) => {
        await page.goto(`/${locale}${p}`);
        await expect(page.locator("html")).toHaveAttribute("dir", locale === "he" ? "rtl" : "ltr");
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.getByTestId("language-switch")).toBeVisible();
        // hreflang alternates for both languages plus x-default.
        for (const l of ["he", "en", "x-default"]) {
          await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveCount(1);
        }
        await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
          "href",
          new RegExp(`/en${p}$`),
        );
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          "href",
          new RegExp(`/${locale}${p}$`),
        );
        await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{20,}/);
        await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      });
    }

    test("navigation works from every page", async ({ page }) => {
      for (const p of STATIC_PATHS) {
        await page.goto(`/${locale}${p}`);
        await page.getByRole("navigation").first().locator(`a[href="/${locale}/parties"]`).click();
        await expect(page).toHaveURL(new RegExp(`/${locale}/parties$`));
        await page.goto(`/${locale}${p}`);
        await page.locator(`footer a[href="/${locale}/privacy"]`).click();
        await expect(page).toHaveURL(new RegExp(`/${locale}/privacy$`));
      }
      await page.locator(`header a[href="/${locale}/how-it-works"]`).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/how-it-works$`));
      await page.locator(`header a[href="/${locale}"]`).first().click();
      await expect(page).toHaveURL(new RegExp(`/${locale}$`));
    });

    test("the intro has the privacy note, duration and start button", async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(
        page.getByTestId("privacy-note").locator(`a[href="/${locale}/privacy"]`),
      ).toBeVisible();
      await expect(page.getByText(/5–10/)).toBeVisible();
      await page.getByTestId("start-survey").click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/survey$`));
      await expect(page.getByTestId("survey")).toBeVisible();
    });

    test("post-D1 placeholders are clearly marked", async ({ page }) => {
      await page.goto(`/${locale}/how-it-works`);
      await expect(page.locator('#matching [data-placeholder="post-d1"]')).toBeVisible();
      await page.goto(`/${locale}/privacy`);
      await expect(page.locator('#ai [data-placeholder="post-d1"]')).toBeVisible();
    });
  });
}

test.describe("parties", () => {
  for (const locale of ["he", "en"] as const) {
    test(`index lists every party alphabetically (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}/parties`);
      const shown = await page
        .getByTestId("party-link")
        .evaluateAll((els) => els.map((e) => e.querySelector("span")!.textContent!));
      const expected = parties()
        .map((p) => p.name[locale] as string)
        .sort(new Intl.Collator(locale, { sensitivity: "base", numeric: true }).compare);
      expect(shown).toEqual(expected);
      await expect(page.getByTestId("joint-group").first()).toBeVisible();
    });

    test(`every research page renders, with sources and date (${locale})`, async ({ page }) => {
      for (const p of parties()) {
        await page.goto(`/${locale}/parties/${p.id}`);
        await expect(page.getByTestId("party-name")).toHaveText(p.name[locale]);
        await expect(page.getByTestId("researched-as-of")).toBeVisible();
        await expect(page.getByTestId("sources").locator("li").first()).toHaveAttribute(
          "id",
          "source-1",
        );
        for (const i of issues()) await expect(page.locator(`[id="issue-${i.id}"]`)).toHaveCount(1);
        if (p.limitedInfo) await expect(page.getByTestId("limited-info")).toBeVisible();
      }
    });
  }

  test("deep links to issue anchors scroll to the right section", async ({ page }) => {
    const p = parties()[0];
    const issue = issues()[issues().length - 1];
    await page.goto(`/he/parties/${p.id}#issue-${issue.id}`);
    await expect(page.locator(`[id="issue-${issue.id}"]`)).toBeInViewport();
  });

  test("citations link to numbered sources", async ({ page }) => {
    await page.goto(`/en/parties/${parties()[0].id}`);
    const cite = page.locator("a.citation").first();
    await expect(cite).toHaveAttribute("href", /^#source-\d+$/);
  });

  test("joint-list partner links and registry polling line", async ({ page }) => {
    const ls = lists();
    const joint = ls.find((l: any) => l.memberPartyIds.length > 1);
    const [a, b] = joint.memberPartyIds;
    await page.goto(`/en/parties/${a}`);
    await expect(
      page.getByTestId("joint-list-label").locator(`a[href="/en/parties/${b}"]`),
    ).toBeVisible();
    await expect(page.getByTestId("polling-line")).toBeVisible();

    const below = ls.find((l: any) => l.poll.status === "polled" && l.poll.percent < 3.25);
    await page.goto(`/en/parties/${below.memberPartyIds[0]}`);
    await expect(page.getByTestId("poll-note-below-threshold")).toBeVisible();
    const notPolled = ls.find((l: any) => l.poll.status === "not_polled");
    await page.goto(`/he/parties/${notPolled.memberPartyIds[0]}`);
    await expect(page.getByTestId("poll-note-not-polled")).toBeVisible();
  });

  test("research pages are server-rendered (content visible without JavaScript)", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    const p = parties()[0];
    await page.goto(`/he/parties/${p.id}`);
    await expect(page.getByTestId("party-name")).toHaveText(p.name.he);
    await expect(page.locator("#overview")).toBeVisible();
    await expect(page.getByTestId("polling-line")).toBeVisible();
    await page.goto(`/en/parties`);
    await expect(page.getByTestId("party-link")).toHaveCount(parties().length);
    await ctx.close();
  });

  test("unknown party and unknown paths render a localized 404", async ({ page }) => {
    const res = await page.goto("/he/parties/does-not-exist");
    expect(res?.status()).toBe(404);
    const res2 = await page.goto("/en/no-such-page");
    expect(res2?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  });
});

test.describe("operator anonymity", () => {
  // Extra identity terms can be supplied (never committed) via OPERATOR_IDENTITY_TERMS="a,b".
  const extra = (process.env.OPERATOR_IDENTITY_TERMS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const paths = [
    "/he",
    "/en",
    "/he/how-it-works",
    "/en/privacy",
    "/he/parties",
    `/en/parties/${parties()[0].id}`,
    `/he/share/${parties()[0].id}`,
    "/en/survey",
  ];

  test("rendered HTML and metadata carry no operator identity", async ({ request }) => {
    for (const p of paths) {
      const html = (await (await request.get(p)).text()).toLowerCase();
      expect(html, p).not.toMatch(/<meta[^>]+name="(author|creator|publisher)"/);
      expect(html, p).not.toMatch(/rel="author"/);
      expect(html, p).not.toMatch(/mailto:/);
      // No email addresses (allowing asset filenames like x@2x.png).
      expect(
        html.match(/[a-z0-9._%+-]+@[a-z0-9-]+\.(com|net|org|io|co|il|dev|me)\b/g),
        p,
      ).toBeNull();
      for (const term of extra) expect(html, `${p} contains an identity term`).not.toContain(term);
    }
  });
});
