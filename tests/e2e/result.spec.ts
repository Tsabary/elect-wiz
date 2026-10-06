import { expect, test } from "@playwright/test";
import { completeSurvey, lists, parties } from "./helpers";

for (const locale of ["he", "en"] as const) {
  test.describe(`result cases (${locale})`, () => {
    test("joint list: labelled with partner links and no partner score", async ({ page }) => {
      await completeSurvey(page, locale, "?mockScenario=joint-list");
      const top = page.getByTestId("result-entry").first();
      const partyId = (await top.getAttribute("data-party-id"))!;
      const list = lists().find((l: any) => l.memberPartyIds.includes(partyId));
      expect(list.memberPartyIds.length).toBeGreaterThan(1);
      const label = top.getByTestId("joint-list-label");
      await expect(label).toContainText(list.name[locale]);
      await expect(label).toContainText(list.ballotLetters);
      const partnerId = list.memberPartyIds.find((id: string) => id !== partyId);
      const partnerName = parties().find((p) => p.id === partnerId).name[locale];
      await expect(label.getByRole("link", { name: partnerName })).toHaveAttribute(
        "href",
        `/${locale}/parties/${partnerId}`,
      );
      // The partner gets no separate entry unless it was matched on its own merits.
      const entryIds = await page
        .getByTestId("result-entry")
        .evaluateAll((els) => els.map((e) => e.getAttribute("data-party-id")));
      expect(entryIds.filter((id) => id === partyId)).toHaveLength(1);
    });

    test("below-threshold note, with the poll date", async ({ page }) => {
      await completeSurvey(page, locale, "?mockScenario=below-threshold");
      const note = page
        .getByTestId("result-entry")
        .first()
        .getByTestId("poll-note-below-threshold");
      await expect(note).toBeVisible();
      await expect(note).toContainText("3.25");
      await expect(note).toContainText("2026");
    });

    test("not-polled note", async ({ page }) => {
      await completeSurvey(page, locale, "?mockScenario=not-polled");
      await expect(
        page.getByTestId("result-entry").first().getByTestId("poll-note-not-polled"),
      ).toBeVisible();
    });

    test("limited-information flag", async ({ page }) => {
      await completeSurvey(page, locale, "?mockScenario=limited-info");
      await expect(
        page.getByTestId("result-entry").first().getByTestId("result-limited-info"),
      ).toBeVisible();
    });

    test("weak match message", async ({ page }) => {
      await completeSurvey(page, locale, "?mockScenario=weak-match");
      await expect(page.getByTestId("weak-match")).toBeVisible();
      await expect(
        page.getByTestId("result-entry").first().getByTestId("breakdown-item").first(),
      ).toBeVisible();
    });

    test("no usable answers: closest matches with the weak-match message, no breakdown", async ({
      page,
    }) => {
      await completeSurvey(page, locale, "?mockScenario=no-usable-answers");
      await expect(page.getByTestId("weak-match")).toBeVisible();
      expect(await page.getByTestId("result-entry").count()).toBeGreaterThanOrEqual(3);
      await expect(page.getByTestId("breakdown-item")).toHaveCount(0);
    });
  });
}

const RETRY = ["abuse_check_failed", "rate_limited", "at_capacity", "upstream_failure"];
const RESTART = ["validation", "content_version_mismatch"];

for (const locale of ["he", "en"] as const) {
  test.describe(`error states (${locale})`, () => {
    for (const code of RETRY) {
      test(`${code}: localized message and "try again" resubmits`, async ({ page }) => {
        await completeSurvey(page, locale, `?mockScenario=error-${code}`);
        const error = page.getByTestId("result-error");
        await expect(error).toHaveAttribute("data-error-code", code);
        await expect(page.getByTestId("error-restart")).toHaveCount(0);
        // Survey progress is kept while an error is shown.
        expect(await page.evaluate(() => localStorage.getItem("elect.survey"))).not.toBeNull();
        const [req] = await Promise.all([
          page.waitForRequest((r) => r.url().endsWith("/api/match")),
          page.getByTestId("error-retry").click(),
        ]);
        expect(req.method()).toBe("POST");
        await expect(page.getByTestId("result-error")).toBeVisible();
      });
    }

    for (const code of RESTART) {
      test(`${code}: offers a restart, not a retry`, async ({ page }) => {
        await completeSurvey(page, locale, `?mockScenario=error-${code}`);
        await expect(page.getByTestId("result-error")).toHaveAttribute("data-error-code", code);
        await expect(page.getByTestId("error-retry")).toHaveCount(0);
        await page.getByTestId("error-restart").click();
        await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
        await expect(page.getByTestId("ranked-item")).toHaveCount(0);
      });
    }

    test("election_over: no retry or restart", async ({ page }) => {
      await completeSurvey(page, locale, "?mockScenario=error-election_over");
      await expect(page.getByTestId("result-error")).toHaveAttribute(
        "data-error-code",
        "election_over",
      );
      await expect(page.getByTestId("error-retry")).toHaveCount(0);
      await expect(page.getByTestId("error-restart")).toHaveCount(0);
    });
  });
}

test("a network timeout or failure shows upstream_failure", async ({ page }) => {
  await page.route("**/api/match", (route) => route.abort("failed"));
  await completeSurvey(page, "en");
  await expect(page.getByTestId("result-error")).toHaveAttribute(
    "data-error-code",
    "upstream_failure",
  );
});

test.describe("sharing", () => {
  test("share link carries only party IDs and opens the landing page", async ({
    page,
    context,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      "the native share sheet can't be driven in tests; copy-link is tested on desktop",
    );
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await completeSurvey(page, "en");
    await expect(page.getByTestId("result")).toBeVisible();
    const ids = await page
      .getByTestId("result-entry")
      .evaluateAll((els) => els.map((e) => e.getAttribute("data-party-id")));
    await page.getByTestId("share-button").click();
    await expect(page.getByTestId("share-status")).not.toBeEmpty();
    const url = new URL((await page.getByTestId("share-url-value").textContent())!);
    expect(url.pathname).toBe(`/en/share/${ids.join(",")}`);
    expect(url.search).toBe("");
    expect(url.hash).toBe("");
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe(url.toString());

    await page.goto(url.pathname);
    await expect(page.getByTestId("share-landing")).toBeVisible();
    await expect(page.getByTestId("shared-top")).toHaveAttribute("href", `/en/parties/${ids[0]}`);
    await expect(page.getByTestId("start-survey")).toBeVisible();
  });

  for (const locale of ["he", "en"] as const) {
    test(`landing page ignores invalid and extra parameters (${locale})`, async ({ page }) => {
      const valid = parties()[0];
      await page.goto(
        `/${locale}/share/nope,${valid.id},${valid.id},%3Cscript%3E?answers=secret&x=1`,
      );
      await expect(page.getByTestId("shared-top")).toHaveText(valid.name[locale]);
      await expect(page.getByTestId("shared-rest")).toHaveCount(0);
      expect(await page.locator("body").innerText()).not.toContain("secret");
      await page.goto(`/${locale}/share/garbage`);
      await expect(page.getByTestId("share-landing")).toBeVisible();
      await expect(page.getByTestId("shared-top")).toHaveCount(0);
    });

    test(`landing page metadata and preview image (${locale})`, async ({ page, request }) => {
      const [a, b] = parties();
      await page.goto(`/${locale}/share/${a.id},${b.id}`);
      const og = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(og).toBeTruthy();
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        new RegExp(a.name[locale].replace(/[()]/g, ".")),
      );
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        "content",
        locale === "he" ? "he_IL" : "en_US",
      );
      const res = await request.get(new URL(og!).pathname);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
      expect((await res.body()).length).toBeGreaterThan(5000);
    });
  }
});
