import { expect, test, type Page } from "@playwright/test";
import {
  answerIssues,
  completeCase,
  LOCALES,
  openSurvey,
  rankWithButtons,
  recordTally,
} from "./helpers";

/** Owner decision 2026-10-13: matching costs nothing now, so the user can start over. */

const savedSurvey = (page: Page) =>
  page.evaluate(() => {
    const raw = localStorage.getItem("elect.survey");
    return raw ? JSON.parse(raw) : null;
  });

const poolOrder = (page: Page) =>
  page
    .getByTestId("pool-item")
    .evaluateAll((els) => els.map((e) => e.getAttribute("data-issue-id")));

async function expectEmptyRanking(page: Page) {
  await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
  await expect(page.getByTestId("ranked-item")).toHaveCount(0);
  await expect(page.getByTestId("not-important-item")).toHaveCount(0);
  await expect(page.getByTestId("pool-item")).toHaveCount(10);
  await expect(page.getByTestId("ranking-continue")).toBeDisabled();
}

for (const locale of LOCALES) {
  test.describe(`start over (${locale})`, () => {
    test("on the result: straight to an empty ranking step, with nothing saved", async ({
      page,
    }) => {
      await completeCase(page, locale, "joint-list-top");
      const startOver = page.getByTestId("start-over");
      await expect(startOver).toBeVisible();
      // It comes after sharing, and asks nothing.
      expect(
        await page
          .getByTestId("share-button")
          .evaluate(
            (share, other) =>
              !!(share.compareDocumentPosition(other!) & Node.DOCUMENT_POSITION_FOLLOWING),
            await startOver.elementHandle(),
          ),
      ).toBe(true);
      await startOver.click();
      await expect(page.getByRole("alertdialog")).toHaveCount(0);
      await expect(page.getByTestId("result")).toHaveCount(0);
      await expectEmptyRanking(page);
      await expect(page).toHaveURL(new RegExp(`/${locale}/survey$`));
      // Nothing to discard yet, so the in-survey control isn't offered.
      await expect(page.getByTestId("survey-start-over")).toHaveCount(0);
      expect(await savedSurvey(page)).toBeNull();
      await expect(page.locator("#ranking-heading")).toBeFocused();

      // The new survey works through to a result of its own.
      await rankWithButtons(page, 2);
      await answerIssues(page);
      await expect(page.getByTestId("result")).toBeVisible();
    });

    test("on the intro: 'continue' and 'start over' only when there is real progress", async ({
      page,
    }) => {
      // A survey that was only opened is not progress.
      await openSurvey(page, locale);
      expect(await savedSurvey(page)).not.toBeNull();
      await page.goto(`/${locale}`);
      const start = page.getByTestId("start-survey");
      await expect(start).toHaveAttribute("data-resume", "false");
      await expect(page.getByTestId("home-start-over")).toHaveCount(0);
      const plainLabel = await start.innerText();

      // One ranked issue is.
      await start.click();
      await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
      await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
      await expect(page.getByTestId("ranked-item")).toHaveCount(1);
      await page.goto(`/${locale}`);
      await expect(start).toHaveAttribute("data-resume", "true");
      expect(await start.innerText()).not.toBe(plainLabel);
      const startOver = page.getByTestId("home-start-over");
      await expect(startOver).toBeVisible();

      // "Continue" keeps it …
      await start.click();
      await expect(page.getByTestId("ranked-item")).toHaveCount(1);

      // … "start over" clears it and opens a new survey.
      await page.goto(`/${locale}`);
      await startOver.click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/survey$`));
      await expectEmptyRanking(page);
      expect((await savedSurvey(page))?.ranked ?? []).toEqual([]);
      expect((await savedSurvey(page))?.started).toBeFalsy();

      // And the intro is back to the plain start button.
      await page.goto(`/${locale}`);
      await expect(start).toHaveAttribute("data-resume", "false");
      await expect(page.getByTestId("home-start-over")).toHaveCount(0);
      expect(await start.innerText()).toBe(plainLabel);
    });

    test("in the survey: asks first; cancel keeps the progress, confirm discards it", async ({
      page,
    }) => {
      await openSurvey(page, locale);
      // Nothing done yet: nothing to start over.
      await expect(page.getByTestId("survey-start-over")).toHaveCount(0);
      await rankWithButtons(page, 2);

      // On the ranking step.
      await page.getByTestId("survey-start-over").click();
      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAccessibleName(/\S/);
      await expect(dialog).toHaveAccessibleDescription(/\S/);
      await page.getByTestId("start-over-cancel").click();
      await expect(dialog).toHaveCount(0);
      await expect(page.getByTestId("ranked-item")).toHaveCount(8);
      await expect(page.getByTestId("not-important-item")).toHaveCount(2);

      // On an answer step, with an answer given.
      await page.getByTestId("ranking-continue").click();
      await page.getByTestId("answer-option").nth(1).locator("input").check();
      await page.getByTestId("step-next").click();
      await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "answer-1");
      const before = await savedSurvey(page);
      await page.getByTestId("survey-start-over").click();
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "answer-1");
      expect(await savedSurvey(page)).toEqual(before);

      // Confirmed: a new survey at the ranking step, and a reload doesn't bring the old one back.
      await page.getByTestId("survey-start-over").click();
      await page.getByTestId("start-over-confirm").click();
      await expect(dialog).toHaveCount(0);
      await expectEmptyRanking(page);
      expect(await savedSurvey(page)).toBeNull();
      await page.reload();
      await expectEmptyRanking(page);
      const after = await savedSurvey(page);
      expect(after.optionSeed).not.toBe(before.optionSeed);
      expect(after.answers).toEqual({});
    });
  });
}

test("keyboard: the in-survey control opens, cancels and confirms, and focus lands sensibly", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "keyboard flow is checked on desktop");
  await openSurvey(page, "he");
  await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
  const control = page.getByTestId("survey-start-over");
  await control.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("alertdialog")).toBeVisible();
  // Focus is held inside the dialog; Escape cancels and hands it back to the control.
  await expect(page.getByRole("alertdialog").locator(":focus")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(control).toBeFocused();
  await expect(page.getByTestId("ranked-item")).toHaveCount(1);

  await page.keyboard.press("Enter");
  await page.getByTestId("start-over-confirm").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page.getByTestId("ranked-item")).toHaveCount(0);
  await expect(page.locator("#ranking-heading")).toBeFocused();
});

test("the result's start-over button works by keyboard and moves focus to the survey heading", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "keyboard flow is checked on desktop");
  await completeCase(page, "en", "joint-list-top");
  await page.getByTestId("start-over").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
  await expect(page.locator("#ranking-heading")).toBeFocused();
});

test("a restarted survey gets a new shuffle", async ({ page }) => {
  // The pool order is one of 10! orderings; five restarts all landing on the same one is not chance.
  await openSurvey(page, "en");
  const orders = new Set<string>();
  for (let i = 0; i < 5; i++) {
    orders.add((await poolOrder(page)).join());
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
    await page.getByTestId("survey-start-over").click();
    await page.getByTestId("start-over-confirm").click();
    await expect(page.getByTestId("ranked-item")).toHaveCount(0);
  }
  expect(orders.size).toBeGreaterThan(1);
});

test.describe("anonymous counts across a start-over", () => {
  test("from the result: the restarted survey is counted as started, and its result as a result", async ({
    page,
  }) => {
    const tally = recordTally(page);
    await completeCase(page, "en", "joint-list-top");
    await expect.poll(() => tally.calls.map((c) => c.body.kind)).toEqual(["started", "result"]);

    // Starting over counts nothing by itself …
    await page.getByTestId("start-over").click();
    await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
    await page.waitForTimeout(500);
    expect(tally.calls).toHaveLength(2);

    // … the first ranking change of the new survey does, once …
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
    await expect
      .poll(() => tally.calls.map((c) => c.body.kind))
      .toEqual(["started", "result", "started"]);
    expect(tally.calls[2].body).toEqual({ kind: "started" });
    await rankWithButtons(page, 2);
    await page.waitForTimeout(500);
    expect(tally.calls).toHaveLength(3);

    // … and so does its result.
    await answerIssues(page);
    await expect(page.getByTestId("result")).toBeVisible();
    await expect
      .poll(() => tally.calls.map((c) => c.body.kind))
      .toEqual(["started", "result", "started", "result"]);
  });

  test("from inside the survey: a second 'started' at the new survey's first ranking change", async ({
    page,
  }) => {
    const tally = recordTally(page);
    await openSurvey(page, "he");
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
    await expect.poll(() => tally.calls.map((c) => c.body.kind)).toEqual(["started"]);

    // A cancelled start-over changes nothing.
    await page.getByTestId("survey-start-over").click();
    await page.getByTestId("start-over-cancel").click();
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
    await page.waitForTimeout(500);
    expect(tally.calls).toHaveLength(1);

    await page.getByTestId("survey-start-over").click();
    await page.getByTestId("start-over-confirm").click();
    await expect(page.getByTestId("ranked-item")).toHaveCount(0);
    await page.waitForTimeout(500);
    expect(tally.calls).toHaveLength(1);
    await page.getByTestId("pool-item").first().getByTestId("mark-not-important").click();
    await expect.poll(() => tally.calls.map((c) => c.body.kind)).toEqual(["started", "started"]);
  });

  test("from the intro: the survey opened by 'start over' is counted as started again", async ({
    page,
  }) => {
    const tally = recordTally(page);
    await openSurvey(page, "en");
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
    await expect.poll(() => tally.calls.map((c) => c.body.kind)).toEqual(["started"]);
    await page.goto("/en");
    await page.getByTestId("home-start-over").click();
    await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
    await expect(page.getByTestId("ranked-item")).toHaveCount(0);
    await page.waitForTimeout(500);
    expect(tally.calls).toHaveLength(1);
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
    await expect.poll(() => tally.calls.map((c) => c.body.kind)).toEqual(["started", "started"]);
  });
});
