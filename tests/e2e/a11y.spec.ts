import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { answerAll, completeSurvey, openSurvey, parties, rankWithButtons } from "./helpers";

/** Fails on serious or critical WCAG 2.x A/AA violations. */
async function expectNoSeriousViolations(page: Page, label: string) {
  // Let CSS transitions (button enable, dialog fade-in) settle so contrast is measured at rest.
  // Scroll to the top: elements scrolled underneath the sticky header are otherwise
  // reported as "obscured" depending on where the previous step left the page.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(400);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
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

for (const locale of ["he", "en"] as const) {
  test.describe(`accessibility (${locale})`, () => {
    for (const path of ["", "/how-it-works", "/privacy", "/parties"]) {
      test(`${path || "/"} has no serious violations`, async ({ page }) => {
        await page.goto(`/${locale}${path}`);
        await expectNoSeriousViolations(page, path || "/");
      });
    }

    test("research page has no serious violations", async ({ page }) => {
      await page.goto(`/${locale}/parties/${parties()[1].id}`);
      await expectNoSeriousViolations(page, "research");
    });

    test("share landing page has no serious violations", async ({ page }) => {
      await page.goto(`/${locale}/share/${parties()[0].id},${parties()[1].id}`);
      await expectNoSeriousViolations(page, "share");
    });

    test("survey steps have no serious violations", async ({ page }) => {
      await openSurvey(page, locale);
      await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
      await expectNoSeriousViolations(page, "ranking");
      await page
        .getByRole("button", { name: /More info|מידע נוסף/ })
        .first()
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expectNoSeriousViolations(page, "more-info dialog");
      await page.keyboard.press("Escape");
      await rankWithButtons(page, 2);
      await page.getByTestId("ranking-continue").click();
      await page.getByTestId("answer-option").first().getByTestId("option-text").fill("edited");
      await expectNoSeriousViolations(page, "answer");
      await page.getByTestId("step-back").click();
      await answerAll(page);
      await page.getByTestId("anything-else-text").fill("x y");
      await expectNoSeriousViolations(page, "anything else");
    });

    test("result and error views have no serious violations", async ({ page }) => {
      await completeSurvey(page, locale, "?mockScenario=joint-list");
      await expect(page.getByTestId("result")).toBeVisible();
      await page.getByTestId("result-entry").nth(1).locator("summary").click();
      await expectNoSeriousViolations(page, "result");
      await completeSurvey(page, locale, "?mockScenario=error-rate_limited");
      await expect(page.getByTestId("result-error")).toBeVisible();
      await expectNoSeriousViolations(page, "error");
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
  const skip = page.getByRole("link", { name: "דילוג לתוכן" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});
