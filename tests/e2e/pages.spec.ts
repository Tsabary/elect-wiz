import { expect, test } from "@playwright/test";
import {
  expectBallotSlip,
  issues,
  listedParties,
  listOf,
  lists,
  LOCALES,
  parties,
  researchedParties,
} from "./helpers";

const HOW_IT_WORKS_SECTIONS = [
  "issues",
  "research",
  "matching",
  "polls",
  "limitations",
  "neutrality",
  "corrections",
];
const PRIVACY_SECTIONS = [
  "summary",
  "answers",
  "device",
  "counts",
  "sharing",
  "cookies",
  "hosting",
  "terms",
];

const STATIC_PATHS = ["", "/how-it-works", "/privacy", "/parties"];

for (const locale of LOCALES) {
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
      await page.getByTestId("start-survey").click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/survey$`));
      await expect(page.getByTestId("survey")).toBeVisible();
    });

    for (const [path, sections] of [
      ["how-it-works", HOW_IT_WORKS_SECTIONS],
      ["privacy", PRIVACY_SECTIONS],
    ] as const) {
      test(`/${path} has its sections, a working table of contents and no placeholders`, async ({
        page,
      }) => {
        await page.goto(`/${locale}/${path}`);
        const article = page.locator("article");
        // Exactly these sections, in this order, each with a heading and text.
        expect(
          await article.locator("section[id]").evaluateAll((els) => els.map((e) => e.id)),
        ).toEqual([...sections]);
        for (const id of sections) {
          const section = article.locator(`section[id="${id}"]`);
          await expect(section.getByRole("heading", { level: 2 })).not.toBeEmpty();
          await expect(section.locator("p").first()).not.toBeEmpty();
        }
        // The table of contents links to every section.
        expect(
          await article
            .locator("nav a")
            .evaluateAll((els) => els.map((e) => e.getAttribute("href"))),
        ).toEqual(sections.map((id) => `#${id}`));
        await article.locator("nav a").last().click();
        await expect(page).toHaveURL(new RegExp(`#${sections[sections.length - 1]}$`));
        await expect(
          article.locator(`section[id="${sections[sections.length - 1]}"] h2`),
        ).toBeInViewport();
        // Nothing is left marked as "to be written".
        await expect(page.locator("[data-placeholder]")).toHaveCount(0);
      });
    }

    test("the sections about the removed AI matching and abuse checks are gone", async ({
      page,
    }) => {
      await page.goto(`/${locale}/privacy`);
      for (const id of ["ai", "abuse", "contact"]) {
        await expect(page.locator(`[id="${id}"]`)).toHaveCount(0);
        await expect(page.locator(`a[href="#${id}"]`)).toHaveCount(0);
      }
      await page.goto(`/${locale}/how-it-works`);
      for (const id of ["ai", "abuse"]) {
        await expect(page.locator(`[id="${id}"]`)).toHaveCount(0);
        await expect(page.locator(`a[href="#${id}"]`)).toHaveCount(0);
      }
    });
  });
}

test.describe("parties", () => {
  for (const locale of LOCALES) {
    test(`index lists every party alphabetically (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}/parties`);
      const shown = await page
        .getByTestId("party-link")
        .evaluateAll((els) =>
          els.map((e) => e.querySelector('[data-testid="party-link-name"]')!.textContent!),
        );
      const expected = parties()
        .map((p) => p.name[locale] as string)
        .sort(new Intl.Collator(locale, { sensitivity: "base", numeric: true }).compare);
      expect(shown).toEqual(expected);
      await expect(page.getByTestId("joint-group").first()).toBeVisible();
      // Each entry carries its list's ballot slip, at the compact size.
      for (const p of parties()) {
        await expectBallotSlip(
          page.locator(`[data-testid="party-link"][data-party-id="${p.id}"]`),
          locale,
          listOf(p.id),
          "compact",
        );
      }
    });

    test(`index shows each party's tier (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}/parties`);
      const shown = await page.getByTestId("party-link").evaluateAll((els) =>
        els.map((e) => ({
          id: e.getAttribute("data-party-id"),
          tier: e.getAttribute("data-tier"),
          labels: e.querySelectorAll('[data-testid="party-tier"]').length,
          label: e.querySelector('[data-testid="party-tier"]')?.textContent?.trim() ?? "",
          href: e.getAttribute("href"),
        })),
      );
      expect(shown).toHaveLength(parties().length);
      for (const row of shown) {
        const party = parties().find((p) => p.id === row.id);
        expect(party, `${row.id} is in the registry`).toBeTruthy();
        expect(row.tier, row.id!).toBe(party.tier);
        expect(row.labels, row.id!).toBe(1);
        expect(row.label, row.id!).not.toBe("");
        expect(row.href).toBe(`/${locale}/parties/${row.id}`);
      }
      // One label per tier, and the two differ.
      const labelsOf = (tier: string) => [
        ...new Set(shown.filter((r) => r.tier === tier).map((r) => r.label)),
      ];
      expect(labelsOf("researched")).toHaveLength(1);
      expect(labelsOf("listed")).toHaveLength(1);
      expect(labelsOf("listed")[0]).not.toBe(labelsOf("researched")[0]);
      expect(shown.filter((r) => r.tier === "listed").map((r) => r.id)).toEqual(
        listedParties().map((p) => p.id),
      );
      // Both tiers are mixed in one alphabetical list, not grouped.
      await expect(page.getByTestId("party-list")).toHaveCount(1);
      for (const tier of ["researched", "listed"]) {
        await expect(
          page.getByTestId("party-list").locator(`[data-testid="party-link"][data-tier="${tier}"]`),
        ).not.toHaveCount(0);
      }
    });

    test(`a listed-only party page shows registry facts and the party's own link, no research (${locale})`, async ({
      page,
    }) => {
      for (const p of listedParties()) {
        const list = listOf(p.id);
        const res = await page.goto(`/${locale}/parties/${p.id}`);
        expect(res?.status()).toBe(200);
        await expect(page.getByTestId("party-name")).toHaveText(p.name[locale]);
        const article = page.locator("article");
        // Registry facts: leader, list, ballot letters, the list's top candidates.
        const facts = article.locator("dl");
        await expect(facts).toContainText(p.leader[locale]);
        await expect(facts).toContainText(list.name[locale]);
        // The ballot letters are on the slip, not repeated as a line of text.
        await expectBallotSlip(article.locator("header"), locale, list, "normal");
        await expect(
          facts.locator("dd").getByText(list.ballotLetters, { exact: true }),
        ).toHaveCount(0);
        expect(
          await page
            .getByTestId("top-candidates")
            .locator("li")
            .evaluateAll((els) => els.map((e) => e.textContent)),
        ).toEqual(list.topCandidates.map((c: any) => c[locale]));
        await expect(page.getByTestId("joint-list-label")).toHaveCount(
          list.memberPartyIds.length > 1 ? 1 : 0,
        );
        // The standard note: not researched in depth, not in the matching. No poll wording.
        const note = page.getByTestId("listed-note");
        await expect(note).toBeVisible();
        await expect(note).not.toBeEmpty();
        expect(await note.innerText()).not.toContain("%");

        // The platform link is the party's own material, opened as an external link.
        const platform = page.getByTestId("platform");
        if (p.platform) {
          await expect(platform.getByTestId("platform-note")).toBeVisible();
          await expect(platform.getByTestId("platform-note")).not.toBeEmpty();
          const link = platform.getByTestId("platform-link");
          await expect(link).toHaveAttribute("href", p.platform.url);
          await expect(link).toHaveAttribute("target", "_blank");
          const rel = ((await link.getAttribute("rel")) ?? "").split(/\s+/);
          expect(rel).toContain("noopener");
          expect(rel).toContain("noreferrer");
          // The only link out of the site on this page.
          await expect(article.locator('a[href^="http"]')).toHaveCount(1);
        } else {
          await expect(platform).toHaveCount(0);
          await expect(article.locator('a[href^="http"]')).toHaveCount(0);
        }

        // No research document.
        await expect(page.getByTestId("researched-as-of")).toHaveCount(0);
        await expect(page.getByTestId("sources")).toHaveCount(0);
        await expect(page.getByTestId("limited-info")).toHaveCount(0);
        await expect(page.locator("a.citation")).toHaveCount(0);
        await expect(page.locator('[id="overview"], [id="issues"], [id^="issue-"]')).toHaveCount(0);
        await expect(page.locator('[id^="other-"]')).toHaveCount(0);
        // No poll information of any kind, and so nothing for the blackout to replace.
        for (const id of [
          "poll-info",
          "polling-line",
          "poll-note-below-threshold",
          "poll-note-not-polled",
          "poll-blackout-notice",
        ]) {
          await expect(page.getByTestId(id)).toHaveCount(0);
        }
        // Reachable from the Parties list, and back.
        await article.locator(`nav a[href="/${locale}/parties"]`).click();
        await expect(page).toHaveURL(new RegExp(`/${locale}/parties$`));
        await page.locator(`[data-testid="party-link"][data-party-id="${p.id}"]`).click();
        await expect(page).toHaveURL(new RegExp(`/${locale}/parties/${p.id}$`));
        await expect(page.getByTestId("listed-note")).toBeVisible();
      }
    });

    test(`every research page renders, with sources and date (${locale})`, async ({ page }) => {
      for (const p of researchedParties()) {
        await page.goto(`/${locale}/parties/${p.id}`);
        await expect(page.getByTestId("party-name")).toHaveText(p.name[locale]);
        await expect(page.getByTestId("researched-as-of")).toBeVisible();
        // The list's ballot slip is in the header; the letters appear nowhere else in it.
        const header = page.locator("article > header");
        await expectBallotSlip(header, locale, listOf(p.id), "normal");
        await expect(
          header.locator("dd").getByText(listOf(p.id).ballotLetters, { exact: true }),
        ).toHaveCount(0);
        if (listOf(p.id).memberPartyIds.length > 1) {
          await expect(header.getByTestId("joint-list-label")).not.toContainText(
            listOf(p.id).ballotLetters,
          );
        }
        await expect(page.getByTestId("sources").locator("li").first()).toHaveAttribute(
          "id",
          "source-1",
        );
        for (const i of issues()) await expect(page.locator(`[id="issue-${i.id}"]`)).toHaveCount(1);
        await expect(page.locator('[id^="other-"]')).not.toHaveCount(0);
        await expect(page.getByTestId("limited-info")).toHaveCount(p.limitedInfo ? 1 : 0);
        // A researched party's page carries none of the listed-only parts.
        for (const id of ["listed-note", "top-candidates", "platform", "platform-link"]) {
          await expect(page.getByTestId(id)).toHaveCount(0);
        }
      }
    });
  }

  test("deep links to issue anchors scroll to the right section", async ({ page }) => {
    const p = researchedParties()[0];
    const issue = issues()[issues().length - 1];
    await page.goto(`/he/parties/${p.id}#issue-${issue.id}`);
    await expect(page.locator(`[id="issue-${issue.id}"]`)).toBeInViewport();
  });

  test("citations link to numbered sources", async ({ page }) => {
    await page.goto(`/en/parties/${researchedParties()[0].id}`);
    const cite = page.locator("a.citation").first();
    await expect(cite).toHaveAttribute("href", /^#source-\d+$/);
  });

  test("joint-list partner links and registry polling line", async ({ page }) => {
    const researched = new Set(researchedParties().map((p) => p.id));
    const ls = lists().filter((l: any) =>
      l.memberPartyIds.every((id: string) => researched.has(id)),
    );
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
    const p = researchedParties()[0];
    await page.goto(`/he/parties/${p.id}`);
    await expect(page.getByTestId("party-name")).toHaveText(p.name.he);
    await expect(page.locator("#overview")).toBeVisible();
    await expect(page.getByTestId("polling-line")).toBeVisible();
    const listed = listedParties()[0];
    await page.goto(`/en/parties/${listed.id}`);
    await expect(page.getByTestId("party-name")).toHaveText(listed.name.en);
    await expect(page.getByTestId("listed-note")).toBeVisible();
    await expect(page.getByTestId("platform-link")).toBeVisible();
    await page.goto(`/en/parties`);
    await expect(page.getByTestId("party-link")).toHaveCount(parties().length);
    await ctx.close();
  });

  test("unknown party and unknown paths render a localized 404", async ({ page }) => {
    const res = await page.goto("/he/parties/does-not-exist");
    expect(res?.status()).toBe(404);
    const res2 = await page.goto("/en/no-such-page");
    expect(res2?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
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
    `/en/parties/${researchedParties()[0].id}`,
    `/he/parties/${listedParties()[0].id}`,
    `/he/share/${researchedParties()[0].id}`,
    "/api/matching/he",
    "/api/matching/en",
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
