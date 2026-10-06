import { expect, test, type Page } from "@playwright/test";
import { answerAll, completeSurvey, issues, openSurvey, rankWithButtons } from "./helpers";

for (const locale of ["he", "en"] as const) {
  test(`full flow in ${locale}: ranking → answers → anything else → result`, async ({ page }) => {
    await openSurvey(page, locale);
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "he" ? "rtl" : "ltr");
    await expect(page.getByTestId("pool-item")).toHaveCount(10);
    await rankWithButtons(page, 3);
    await expect(page.getByTestId("ranked-item")).toHaveCount(7);
    await answerAll(page);
    await page
      .getByTestId("anything-else-text")
      .fill(locale === "he" ? "תחבורה ציבורית" : "Public transport");
    await expect(page.getByTestId("submit-survey")).toBeDisabled();
    await page.getByTestId("anything-else-importance").locator('input[value="middle"]').check();
    await page.getByTestId("submit-survey").click();
    await expect(page.getByTestId("result-loading")).toBeVisible();
    await expect(page.getByTestId("result")).toBeVisible();
    const entries = page.getByTestId("result-entry");
    expect(await entries.count()).toBeGreaterThanOrEqual(3);
    await expect(page.getByTestId("disclaimer")).toBeVisible();
    // The top match shows its breakdown, one item per ranked issue.
    await expect(entries.first().getByTestId("breakdown-item")).toHaveCount(7);
    await expect(entries.first().getByTestId("anything-else-note")).toBeVisible();
    // No edit or re-run affordances on the result.
    await expect(page.getByTestId("step-back")).toHaveCount(0);
    await expect(page.getByTestId("error-retry")).toHaveCount(0);
  });
}

test("breakdown links land on the cited research anchor", async ({ page }) => {
  await completeSurvey(page, "en");
  const link = page.getByTestId("result-entry").first().getByTestId("breakdown-link").first();
  const href = await link.getAttribute("href");
  expect(href).toMatch(/^\/en\/parties\/[a-z0-9-]+#issue-[a-z0-9-]+$/);
  const anchor = href!.split("#")[1];
  await link.click();
  await expect(page).toHaveURL(new RegExp(`#${anchor}$`));
  const heading = page.locator(`[id="${anchor}"]`);
  await expect(heading).toBeVisible();
  await expect(heading).toBeInViewport();
});

test("a refresh after the result starts a new survey", async ({ page }) => {
  await completeSurvey(page, "en");
  await expect(page.getByTestId("result")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("elect.survey"))).toBeNull();
  await page.reload();
  await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
  await expect(page.getByTestId("ranked-item")).toHaveCount(0);
});

test.describe("ranking", () => {
  test("by tap or click, with arrows to reorder and remove", async ({ page, isMobile }) => {
    await openSurvey(page, "he");
    const press = (l: ReturnType<Page["locator"]>) => (isMobile ? l.tap() : l.click());
    const firstPool = await page.getByTestId("pool-item").first().getAttribute("data-issue-id");
    const secondPool = await page.getByTestId("pool-item").nth(1).getAttribute("data-issue-id");
    await press(page.getByTestId("pool-item").first().getByTestId("add-to-ranking"));
    await press(page.getByTestId("pool-item").first().getByTestId("add-to-ranking"));
    const ranked = page.getByTestId("ranked-item");
    await expect(ranked.nth(0)).toHaveAttribute("data-issue-id", firstPool!);
    await press(ranked.nth(1).getByTestId("move-up"));
    await expect(ranked.nth(0)).toHaveAttribute("data-issue-id", secondPool!);
    await expect(ranked.nth(0).getByTestId("rank-badge")).toContainText("1");
    await press(ranked.nth(0).getByTestId("remove-from-ranking"));
    await expect(ranked).toHaveCount(1);
    await expect(page.getByTestId("pool-item")).toHaveCount(9);
  });

  test("Continue is enabled only when every non-excluded issue is ranked", async ({ page }) => {
    await openSurvey(page, "en");
    await expect(page.getByTestId("ranking-continue")).toBeDisabled();
    await rankWithButtons(page, 5);
    await expect(page.getByTestId("ranked-item")).toHaveCount(5);
    await expect(page.getByTestId("ranking-continue")).toBeEnabled();
    await page.getByTestId("ranked-item").first().getByTestId("remove-from-ranking").click();
    await expect(page.getByTestId("ranking-continue")).toBeDisabled();
  });

  test("the sixth 'doesn't matter' is prevented with a clear message", async ({ page }) => {
    await openSurvey(page, "en");
    for (let i = 0; i < 5; i++) {
      await page.getByTestId("pool-item").first().getByTestId("mark-not-important").click();
    }
    await expect(page.getByTestId("not-important-item")).toHaveCount(5);
    await page.getByTestId("pool-item").first().getByTestId("mark-not-important").click();
    await expect(page.getByTestId("limit-message")).toBeVisible();
    await expect(page.getByTestId("not-important-item")).toHaveCount(5);
    await expect(page.getByTestId("pool-item")).toHaveCount(5);
    // Putting one back allows marking another.
    await page.getByTestId("not-important-item").first().getByTestId("restore-issue").click();
    await expect(page.getByTestId("not-important-item")).toHaveCount(4);
  });

  test("by mouse drag and drop", async ({ page, isMobile }) => {
    test.skip(isMobile, "mouse drag is a desktop interaction");
    // Keep source and target on screen (synthetic mouse events don't autoscroll).
    await page.setViewportSize({ width: 1280, height: 1100 });
    await openSurvey(page, "en");
    const dragTo = async (
      source: ReturnType<Page["locator"]>,
      target: ReturnType<Page["locator"]>,
      after = false,
    ) => {
      const s = (await source.boundingBox())!;
      const t = (await target.boundingBox())!;
      await page.mouse.move(s.x + s.width / 2, s.y + s.height / 2);
      await page.mouse.down();
      await page.mouse.move(s.x + s.width / 2, s.y + s.height / 2 + 8, { steps: 3 });
      const ty = after ? t.y + t.height - 4 : t.y + 4;
      await page.mouse.move(t.x + t.width / 2, ty, { steps: 15 });
      await page.mouse.up();
      await page.waitForTimeout(350); // drop animation
    };
    const first = await page.getByTestId("pool-item").nth(2).getAttribute("data-issue-id");
    await dragTo(
      page.getByTestId("pool-item").nth(2).getByTestId("drag-handle"),
      page.getByTestId("ranked-list"),
    );
    await expect(page.getByTestId("ranked-item")).toHaveCount(1);
    await expect(page.getByTestId("ranked-item").first()).toHaveAttribute("data-issue-id", first!);
    // Add a second by button, then drag it above the first.
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
    await expect(page.getByTestId("ranked-item")).toHaveCount(2);
    await page.waitForTimeout(200);
    const second = await page.getByTestId("ranked-item").nth(1).getAttribute("data-issue-id");
    await dragTo(
      page.getByTestId("ranked-item").nth(1).getByTestId("drag-handle"),
      page.getByTestId("ranked-item").nth(0),
    );
    await expect(page.getByTestId("ranked-item").first()).toHaveAttribute("data-issue-id", second!);
  });

  test("by touch drag and drop", async ({ page, isMobile }) => {
    test.skip(!isMobile, "touch drag is a mobile interaction");
    await page.setViewportSize({ width: 412, height: 1300 });
    await openSurvey(page, "he");
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").tap();
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").tap();
    const second = await page.getByTestId("ranked-item").nth(1).getAttribute("data-issue-id");
    const s = (await page
      .getByTestId("ranked-item")
      .nth(1)
      .getByTestId("drag-handle")
      .boundingBox())!;
    const t = (await page.getByTestId("ranked-item").nth(0).boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    const point = (x: number, y: number) => [{ x, y, id: 1, radiusX: 2, radiusY: 2, force: 1 }];
    const sx = s.x + s.width / 2;
    const sy = s.y + s.height / 2;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: point(sx, sy) });
    await page.waitForTimeout(300); // press and hold (touch sensor delay)
    const steps = 12;
    for (let i = 1; i <= steps; i++) {
      const y = sy + ((t.y + 4 - sy) * i) / steps;
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: point(sx, y) });
      await page.waitForTimeout(16);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(page.getByTestId("ranked-item").first()).toHaveAttribute("data-issue-id", second!);
  });

  test("by keyboard only: buttons and keyboard drag and drop", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard interaction is covered on desktop");
    await openSurvey(page, "en");
    // Add two issues with the keyboard.
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").focus();
    await page.keyboard.press("Enter");
    // Focus moves to the next pool item's Add button, so Enter again adds it.
    await page.keyboard.press("Enter");
    const ranked = page.getByTestId("ranked-item");
    await expect(ranked).toHaveCount(2);
    const second = await ranked.nth(1).getAttribute("data-issue-id");
    // Keyboard drag: pick up the second, move it up, drop.
    await page.waitForTimeout(200);
    await ranked.nth(1).getByTestId("drag-handle").focus();
    await page.keyboard.press("Space");
    await page.waitForTimeout(300);
    await page.keyboard.press("ArrowUp");
    await page.waitForTimeout(300);
    await page.keyboard.press("Space");
    await page.waitForTimeout(350);
    await expect(ranked.first()).toHaveAttribute("data-issue-id", second!);
    // Move it back down with the arrow button via the keyboard; focus stays usable.
    await ranked.first().getByTestId("move-down").focus();
    await page.keyboard.press("Enter");
    await expect(ranked.nth(1)).toHaveAttribute("data-issue-id", second!);
    await expect(page.getByTestId("ranking-live")).toContainText("2");
  });

  test("the order differs between new sessions but is identical on resume", async ({ page }) => {
    const order = () =>
      page
        .getByTestId("pool-item")
        .evaluateAll((els) => els.map((e) => e.getAttribute("data-issue-id")).join(","));
    const seen = new Set<string>();
    for (let i = 0; i < 4; i++) {
      await openSurvey(page, "en");
      const o = await order();
      seen.add(o);
      await page.reload();
      await expect(page.getByTestId("pool-item")).toHaveCount(10);
      expect(await order()).toBe(o);
    }
    expect(seen.size).toBeGreaterThan(1);
  });
});

test.describe("answers", () => {
  test("resume after reload mid-survey restores answers, edits and position", async ({ page }) => {
    await openSurvey(page, "en");
    await rankWithButtons(page, 2);
    await page.getByTestId("ranking-continue").click();
    const optionOrder = await page
      .getByTestId("answer-option")
      .evaluateAll((els) => els.map((e) => e.getAttribute("data-option-id")).join(","));
    // Edit the second option in place.
    const option = page.getByTestId("answer-option").nth(1);
    await option.getByTestId("option-text").fill("My edited wording");
    await expect(option).toHaveAttribute("data-selected", "true");
    await expect(option.getByTestId("edited-badge")).toBeVisible();
    await page.getByTestId("step-next").click();
    await expect(page.getByTestId("answer-progress")).toContainText("2");
    await page.getByTestId("own-text").fill("My own answer");

    await page.reload();
    await expect(page.getByTestId("answer-progress")).toContainText("2");
    await expect(page.getByTestId("own-text")).toHaveValue("My own answer");
    await page.getByTestId("step-back").click();
    await expect(page.getByTestId("answer-progress")).toContainText("1");
    expect(
      await page
        .getByTestId("answer-option")
        .evaluateAll((els) => els.map((e) => e.getAttribute("data-option-id")).join(",")),
    ).toBe(optionOrder);
    await expect(page.getByTestId("answer-option").nth(1).getByTestId("option-text")).toHaveValue(
      "My edited wording",
    );
  });

  test("submits final text, the starting option ID and the edited flag", async ({ page }) => {
    await openSurvey(page, "en");
    await rankWithButtons(page, 5);
    await page.getByTestId("ranking-continue").click();
    const option = page.getByTestId("answer-option").first();
    const optionId = await option.getAttribute("data-option-id");
    const issueId = await page.getByTestId("answer-step").getAttribute("data-issue-id");
    await option.getByTestId("option-text").fill("Edited preset");
    await page.getByTestId("step-next").click();
    await page.getByTestId("own-text").fill("Written from scratch");
    await page.getByTestId("step-next").click();
    for (let i = 0; i < 3; i++) {
      await page.getByTestId("answer-option").nth(2).locator("input").check();
      await page.getByTestId("step-next").click();
    }
    const [req] = await Promise.all([
      page.waitForRequest((r) => r.url().endsWith("/api/match") && r.method() === "POST"),
      page.getByTestId("submit-survey").click(),
    ]);
    const body = req.postDataJSON();
    expect(body.answers[0]).toEqual({
      issueId,
      text: "Edited preset",
      startingOptionId: optionId,
      edited: true,
    });
    expect(body.answers[1]).toMatchObject({
      text: "Written from scratch",
      startingOptionId: null,
      edited: false,
    });
    expect(body.answers[2].edited).toBe(false);
    expect(body.anythingElse).toBeNull();
    expect(body.ranked).toHaveLength(5);
    expect(body.notImportant).toHaveLength(5);
  });

  test("shows progress and needs an answer before continuing", async ({ page }) => {
    await openSurvey(page, "he");
    await rankWithButtons(page, 4);
    await page.getByTestId("ranking-continue").click();
    await expect(page.getByTestId("answer-progress")).toContainText("1");
    await expect(page.getByTestId("answer-progress")).toContainText("6");
    await expect(page.getByTestId("step-next")).toBeDisabled();
    await expect(page.getByTestId("answer-option")).toHaveCount(
      issues()[0].options.length > 0 ? await page.getByTestId("answer-option").count() : 0,
    );
    await page.getByTestId("answer-option").first().locator("input").check();
    await expect(page.getByTestId("step-next")).toBeEnabled();
  });
});
