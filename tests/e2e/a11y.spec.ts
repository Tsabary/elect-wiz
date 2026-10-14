import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import {
  completeCase,
  completeSurvey,
  listedParties,
  LOCALES,
  MATCHING_BUNDLE_URL,
  openSurvey,
  rankWithButtons,
  researchedParties,
} from "./helpers";

/** Fails on serious or critical WCAG 2.x A/AA violations. */
async function expectNoSeriousViolations(page: Page, label: string) {
  // Let CSS transitions (button enable, dialog fade-in) settle so contrast is measured at rest.
  // Scroll to the top: elements scrolled underneath the sticky header are otherwise
  // reported as "obscured" depending on where the previous step left the page.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(400);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    // Base UI adds invisible focus sentinels around an open dialog in WebKit only
    // (empty `role="button"` spans that just bounce focus back inside); axe reads
    // them as unnamed buttons. They are the library's focus trap, not page content.
    .exclude("[data-base-ui-focus-guard]")
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(
    serious.map(
      (v) =>
        `${v.id}: ${v.help} (${v.nodes.map((n) => `${n.target.join(" ")} ${n.failureSummary ?? ""} ${n.html.slice(0, 160)}`).join(", ")})`,
    ),
    label,
  ).toEqual([]);
}

for (const locale of LOCALES) {
  test.describe(`accessibility (${locale})`, () => {
    for (const path of ["", "/how-it-works", "/privacy", "/parties"]) {
      test(`${path || "/"} has no serious violations`, async ({ page }) => {
        await page.goto(`/${locale}${path}`);
        await expectNoSeriousViolations(page, path || "/");
      });
    }

    test("intro with saved progress (continue + start over) has no serious violations", async ({
      page,
    }) => {
      await openSurvey(page, locale);
      await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
      await expect(page.getByTestId("ranked-item")).toHaveCount(1);
      await page.goto(`/${locale}`);
      await expect(page.getByTestId("home-start-over")).toBeVisible();
      await expectNoSeriousViolations(page, "intro with saved progress");
      // Its confirmation dialog too.
      await page.getByTestId("home-start-over").click();
      await expect(page.getByRole("alertdialog")).toBeVisible();
      await expectNoSeriousViolations(page, "intro start-over dialog");
    });

    test("research page has no serious violations", async ({ page }) => {
      await page.goto(`/${locale}/parties/${researchedParties()[1].id}`);
      await expectNoSeriousViolations(page, "research");
    });

    test("listed-only party page has no serious violations", async ({ page }) => {
      await page.goto(`/${locale}/parties/${listedParties()[0].id}`);
      await expect(page.getByTestId("listed-note")).toBeVisible();
      await expect(page.getByTestId("platform-link")).toBeVisible();
      await expectNoSeriousViolations(page, "listed-only");
    });

    test("share landing page has no serious violations", async ({ page }) => {
      await page.goto(`/${locale}/share/${researchedParties()[0].id},${researchedParties()[1].id}`);
      await expectNoSeriousViolations(page, "share");
    });

    test("survey steps have no serious violations", async ({ page }) => {
      await openSurvey(page, locale);
      await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
      await expectNoSeriousViolations(page, "ranking");
      await page.getByTestId("pool-item").first().locator('[aria-haspopup="dialog"]').click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expectNoSeriousViolations(page, "more-info dialog");
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      // The "start over" confirmation, opened and then cancelled.
      await page.getByTestId("survey-start-over").click();
      await expect(page.getByRole("alertdialog")).toBeVisible();
      await expectNoSeriousViolations(page, "start-over confirmation");
      await page.getByTestId("start-over-cancel").click();
      await expect(page.getByRole("alertdialog")).toHaveCount(0);
      await rankWithButtons(page, 2);
      await page.getByTestId("ranking-continue").click();

      // The answer screen: nothing chosen yet (the hint shows, "next" is disabled) …
      await expect(page.getByTestId("answer-step")).toBeVisible();
      await expect(page.getByTestId("step-next")).toBeDisabled();
      await expectNoSeriousViolations(page, "answer, nothing chosen");
      // … with an option chosen …
      await page.getByTestId("answer-option").nth(1).locator("input").check();
      await expect(page.getByTestId("step-next")).toBeEnabled();
      await expectNoSeriousViolations(page, "answer, option chosen");
      // … and the last one, where the primary button submits.
      for (let i = 0; i < 7; i++) {
        await expect(page.getByTestId("survey")).toHaveAttribute("data-step", `answer-${i}`);
        await page.getByTestId("answer-option").first().locator("input").check();
        await page.getByTestId("step-next").click();
      }
      await expect(page.getByTestId("submit-survey")).toBeDisabled();
      await expectNoSeriousViolations(page, "last answer, nothing chosen");
      await page.getByTestId("answer-option").first().locator("input").check();
      await expect(page.getByTestId("submit-survey")).toBeEnabled();
      await expectNoSeriousViolations(page, "last answer, option chosen");
    });

    test("result has no serious violations, with 'show all' closed and open", async ({ page }) => {
      // This result has a joint-list label, both poll notes, the limited-information
      // flag and an unclear-position item among its parties.
      await completeCase(page, locale, "below-threshold-top");
      await expectNoSeriousViolations(page, "result, show-all closed");
      await expect(page.getByTestId("start-over")).toBeVisible();
      // A runner-up's collapsed breakdown and points, opened.
      await page.getByTestId("result-entry").nth(1).locator("summary").click();
      await expect(
        page.getByTestId("result-entry").nth(1).getByTestId("breakdown-item").first(),
      ).toBeVisible();
      await expectNoSeriousViolations(page, "result, runner-up open");
      // "Show all" open, and then one of its rows open.
      await page.getByTestId("show-all").click();
      await expect(page.getByTestId("result-row").first()).toBeVisible();
      await expectNoSeriousViolations(page, "result, show-all open");
      await page.getByTestId("result-row").first().locator("summary").click();
      await expect(
        page.getByTestId("result-row").first().getByTestId("breakdown-item").first(),
      ).toBeVisible();
      await expectNoSeriousViolations(page, "result, show-all row open");
    });

    test("weak-match result has no serious violations", async ({ page }) => {
      await completeCase(page, locale, "weak-match");
      await expect(page.getByTestId("weak-match")).toBeVisible();
      await expectNoSeriousViolations(page, "result, weak match");
    });

    test("loading and error views have no serious violations", async ({ page }) => {
      let mode: "hold" | "fail" | "mismatch" = "hold";
      let release!: () => void;
      const held = new Promise<void>((resolve) => (release = resolve));
      await page.route(MATCHING_BUNDLE_URL, async (route) => {
        if (mode === "hold") {
          await held;
          return route.abort("failed");
        }
        if (mode === "fail") return route.abort("failed");
        const res = await route.fetch();
        return route.fulfill({
          response: res,
          json: { ...(await res.json()), surveyContentVersion: "some-other-version" },
        });
      });
      await completeSurvey(page, locale);
      await expect(page.getByTestId("result-loading")).toBeVisible();
      await expectNoSeriousViolations(page, "loading");
      mode = "fail";
      release();
      await expect(page.getByTestId("result-error")).toHaveAttribute(
        "data-error-code",
        "bundle_load_failed",
      );
      await expectNoSeriousViolations(page, "error with retry");
      mode = "mismatch";
      await page.getByTestId("error-retry").click();
      await expect(page.getByTestId("result-error")).toHaveAttribute(
        "data-error-code",
        "content_version_mismatch",
      );
      await expectNoSeriousViolations(page, "error with restart");
    });
  });
}

test("keyboard: focus moves to each new step's heading", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow is checked on desktop");
  await openSurvey(page, "en");
  await rankWithButtons(page, 5);
  await page.getByTestId("ranking-continue").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("answer-step").getByRole("heading", { level: 1 })).toBeFocused();
  // Radio choice by keyboard: Tab into the group, arrow to change selection.
  await page.getByTestId("answer-option").first().locator("input").focus();
  await page.keyboard.press("Space");
  await expect(page.getByTestId("answer-option").first()).toHaveAttribute("data-selected", "true");
  await page.keyboard.press("ArrowDown");
  await expect(page.getByTestId("answer-option").nth(1)).toHaveAttribute("data-selected", "true");
});

test("skip link moves focus to main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow is checked on desktop");
  await page.goto("/he");
  await page.keyboard.press("Tab");
  const skip = page.locator('a[href="#main"]');
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});
