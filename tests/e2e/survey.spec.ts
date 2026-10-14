import { expect, test, type Page } from "@playwright/test";
import {
  AFTER_CLOSE,
  answerIssues,
  completeSurvey,
  isTallyRequest,
  issues,
  LOCALES,
  openSurvey,
  rankWithButtons,
  recheckClock,
  setClock,
  versions,
} from "./helpers";

const optionIds = (page: Page) =>
  page
    .getByTestId("answer-option")
    .evaluateAll((els) => els.map((e) => e.getAttribute("data-option-id")));

for (const locale of LOCALES) {
  test(`full flow in ${locale}: ranking → answers → result`, async ({ page }) => {
    await openSurvey(page, locale);
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "he" ? "rtl" : "ltr");
    await expect(page.getByTestId("pool-item")).toHaveCount(10);
    await rankWithButtons(page, 3);
    await expect(page.getByTestId("ranked-item")).toHaveCount(7);
    await answerIssues(page);
    await expect(page.getByTestId("result")).toBeVisible();
    await expect(page.getByTestId("result-entry").first()).toBeVisible();
    await expect(page.getByTestId("disclaimer")).toBeVisible();
    // The top match shows its breakdown, one item per ranked issue.
    await expect(
      page.getByTestId("result-entry").first().getByTestId("breakdown-item"),
    ).toHaveCount(7);
    // The survey screens are gone.
    await expect(page.getByTestId("survey")).toHaveCount(0);
    await expect(page.getByTestId("result-error")).toHaveCount(0);
  });
}

test("a refresh after the result shows the same result again, until 'start over'", async ({
  page,
}) => {
  await completeSurvey(page, "en");
  await expect(page.getByTestId("result")).toBeVisible();
  const shown = await page
    .getByTestId("result-entry")
    .evaluateAll((els) => els.map((el) => el.getAttribute("data-party-id")));
  const saved = JSON.parse((await page.evaluate(() => localStorage.getItem("elect.survey")))!);
  expect(saved.finished).toBe(true);

  await page.reload();
  await expect(page.getByTestId("result")).toBeVisible();
  await expect(page.getByTestId("survey")).toHaveCount(0);
  expect(
    await page
      .getByTestId("result-entry")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-party-id"))),
  ).toEqual(shown);

  await page.getByTestId("start-over").click();
  await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
  await page.reload();
  await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
  await expect(page.getByTestId("ranked-item")).toHaveCount(0);
});

test.describe("how long a saved survey is kept", () => {
  const saved = (page: Page) =>
    page.evaluate(() => {
      const raw = localStorage.getItem("elect.survey");
      return raw ? JSON.parse(raw) : null;
    });

  test("a result is saved with the time it was first shown, and dropped once 7 days old", async ({
    page,
  }) => {
    await completeSurvey(page, "en");
    await expect(page.getByTestId("result")).toBeVisible();
    const finished = await saved(page);
    expect(finished.finished).toBe(true);
    expect(Math.abs(finished.finishedAt - Date.now())).toBeLessThan(60_000);

    // Six days on, coming back still shows it.
    const DAY = 24 * 60 * 60 * 1000;
    await page.evaluate((v) => localStorage.setItem("elect.survey", JSON.stringify(v)), {
      ...finished,
      finishedAt: Date.now() - 6 * DAY,
    });
    await page.goto("/en");
    await expect(page.getByTestId("start-survey")).toHaveAttribute("data-status", "finished");

    // Seven days on, it is gone: the intro offers a new survey and nothing is left saved.
    await page.evaluate((v) => localStorage.setItem("elect.survey", JSON.stringify(v)), {
      ...finished,
      finishedAt: Date.now() - 7 * DAY - 1000,
    });
    await page.reload();
    await expect(page.getByTestId("start-survey")).toHaveAttribute("data-status", "new");
    await expect.poll(() => saved(page)).toBeNull();

    // Any page deletes it, not only the intro and the survey.
    await page.evaluate((v) => localStorage.setItem("elect.survey", JSON.stringify(v)), {
      ...finished,
      finishedAt: Date.now() - 7 * DAY - 1000,
    });
    await page.goto("/en/privacy");
    await expect.poll(() => saved(page)).toBeNull();
  });

  test("once polls close, the saved survey is deleted on the next page load", async ({ page }) => {
    await completeSurvey(page, "he");
    await expect(page.getByTestId("result")).toBeVisible();
    expect(await saved(page)).not.toBeNull();
    // A page that says nothing about the survey is enough.
    await page.goto(`/he/privacy?clock=${encodeURIComponent(AFTER_CLOSE)}`);
    await expect.poll(() => saved(page)).toBeNull();
    await page.goto("/he");
    await expect(page.getByTestId("election-over")).toBeVisible();
    expect(await saved(page)).toBeNull();
  });

  test("a tab left open across the close deletes it when its own check flips", async ({ page }) => {
    await openSurvey(page, "en");
    await rankWithButtons(page, 2);
    expect(await saved(page)).not.toBeNull();
    await page.goto("/en/how-it-works");
    await setClock(page, AFTER_CLOSE);
    await recheckClock(page);
    await expect.poll(() => saved(page)).toBeNull();
  });
});

test.describe("another tab", () => {
  test("a 'start over' in one tab is not undone by a stale tab", async ({ page, context }) => {
    await openSurvey(page, "en");
    await rankWithButtons(page, 2);
    await page.getByTestId("ranking-continue").click();
    await page.getByTestId("answer-option").first().locator("input").check();
    await page.getByTestId("step-next").click();
    await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "answer-1");
    const before = JSON.parse((await page.evaluate(() => localStorage.getItem("elect.survey")))!);

    // The other tab starts over from the intro.
    const other = await context.newPage();
    await other.goto("/en");
    await other.getByTestId("home-start-over").click();
    await other.getByTestId("start-over-confirm").click();
    await expect(other.getByTestId("survey")).toHaveAttribute("data-step", "ranking");

    // The stale tab is back at an empty ranking step …
    await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
    await expect(page.getByTestId("ranked-item")).toHaveCount(0);
    // … and what it saves next is a new survey, never the deleted answers.
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
    const after = JSON.parse((await page.evaluate(() => localStorage.getItem("elect.survey")))!);
    expect(after.optionSeed).not.toBe(before.optionSeed);
    expect(after.ranked).toHaveLength(1);
    expect(after.answers).toEqual({});
  });

  test("the intro follows a result shown or deleted in another tab", async ({ page, context }) => {
    await page.goto("/en");
    await expect(page.getByTestId("start-survey")).toHaveAttribute("data-status", "new");
    const other = await context.newPage();
    await completeSurvey(other, "en");
    await expect(other.getByTestId("result")).toBeVisible();
    await expect(page.getByTestId("start-survey")).toHaveAttribute("data-status", "finished");
    await other.getByTestId("start-over").click();
    await expect(page.getByTestId("start-survey")).toHaveAttribute("data-status", "new");
  });
});

test("a saved survey from the old format (schema 1) is discarded", async ({ page }) => {
  const all = issues();
  const ranked = all.slice(0, 6).map((i: any) => i.id);
  // What the previous version of the site saved: free-text answers and an "anything else" step.
  const old = {
    schemaVersion: 1,
    surveyContentVersion: versions().surveyContentVersion,
    issueSeed: 1,
    optionSeed: 2,
    ranked,
    notImportant: all.slice(6).map((i: any) => i.id),
    answers: Object.fromEntries(
      all
        .slice(0, 6)
        .map((i: any) => [
          i.id,
          { selected: i.options[0].id, optionTexts: {}, ownText: "", chosen: "option" },
        ]),
    ),
    anythingElse: { text: "Public transport", importance: "middle" },
    step: { kind: "anything-else" },
  };
  await page.goto("/en/survey");
  await page.evaluate((v) => localStorage.setItem("elect.survey", JSON.stringify(v)), old);
  await page.reload();
  await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
  await expect(page.getByTestId("ranked-item")).toHaveCount(0);
  await expect(page.getByTestId("not-important-item")).toHaveCount(0);
  await expect(page.getByTestId("pool-item")).toHaveCount(all.length);
  const saved = JSON.parse((await page.evaluate(() => localStorage.getItem("elect.survey")))!);
  expect(saved.schemaVersion).toBe(2);
  expect(saved.ranked).toEqual([]);
  expect(saved.answers).toEqual({});
  expect(saved).not.toHaveProperty("anythingElse");
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

  test("the pool order is reshuffled on every reload", async ({ page }) => {
    const order = () =>
      page
        .getByTestId("pool-item")
        .evaluateAll((els) => els.map((e) => e.getAttribute("data-issue-id")).join(","));
    await openSurvey(page, "en");
    const seen = new Set<string>([await order()]);
    for (let i = 0; i < 4; i++) {
      await page.reload();
      await expect(page.getByTestId("pool-item")).toHaveCount(10);
      seen.add(await order());
    }
    expect(seen.size).toBeGreaterThan(1);
  });
});

test.describe("answers", () => {
  test("each issue takes exactly one of its preset options, with nothing to edit or write", async ({
    page,
  }) => {
    await openSurvey(page, "en");
    await rankWithButtons(page, 2);
    await page.getByTestId("ranking-continue").click();
    const step = page.getByTestId("answer-step");
    const issueId = (await step.getAttribute("data-issue-id"))!;
    const expected = issues().find((i: any) => i.id === issueId);
    const options = step.getByTestId("answer-option");
    await expect(options).toHaveCount(expected.options.length);
    // One radio per option, in one group; no text fields of any kind.
    await expect(step.getByRole("radiogroup")).toHaveCount(1);
    await expect(step.getByRole("radio")).toHaveCount(expected.options.length);
    await expect(
      step.locator('textarea, input:not([type="radio"]), [contenteditable]'),
    ).toHaveCount(0);
    for (const gone of ["own-text", "edited-badge", "anything-else-step", "anything-else-text"]) {
      await expect(page.getByTestId(gone)).toHaveCount(0);
    }
    await expect(step.locator('[data-selected="true"]')).toHaveCount(0);

    // Tapping anywhere on a card selects it; picking another replaces the choice.
    await options.nth(0).click();
    await expect(options.nth(0)).toHaveAttribute("data-selected", "true");
    await expect(options.nth(0).getByRole("radio")).toBeChecked();
    await options.nth(1).click();
    await expect(options.nth(1)).toHaveAttribute("data-selected", "true");
    await expect(options.nth(0)).toHaveAttribute("data-selected", "false");
    await expect(step.locator('[data-selected="true"]')).toHaveCount(1);
    await expect(step.getByRole("radio", { checked: true })).toHaveCount(1);
  });

  test("shows progress and needs an answer before continuing", async ({ page }) => {
    await openSurvey(page, "he");
    await rankWithButtons(page, 4);
    await page.getByTestId("ranking-continue").click();
    await expect(page.getByTestId("answer-progress")).toContainText("1");
    await expect(page.getByTestId("answer-progress")).toContainText("6");
    await expect(page.getByTestId("step-next")).toBeDisabled();
    const issueId = await page.getByTestId("answer-step").getAttribute("data-issue-id");
    const issue = issues().find((i) => i.id === issueId);
    await expect(page.getByTestId("answer-option")).toHaveCount(issue.options.length);
    await page.getByTestId("answer-option").first().locator("input").check();
    await expect(page.getByTestId("step-next")).toBeEnabled();
  });

  test("answer screens follow the ranking order", async ({ page }) => {
    await openSurvey(page, "en");
    await rankWithButtons(page, 5);
    const ranked = await page
      .getByTestId("ranked-item")
      .evaluateAll((els) => els.map((e) => e.getAttribute("data-issue-id")));
    const seen: (string | null)[] = [];
    await answerIssues(page, {
      submit: false,
      pick: (issueId) => {
        seen.push(issueId);
        return issues().find((i: any) => i.id === issueId).options[0].id;
      },
    });
    expect(seen).toEqual(ranked);
  });

  test("back navigation keeps the answers and the ranking", async ({ page }) => {
    await openSurvey(page, "en");
    await rankWithButtons(page, 5);
    const ranked = await page
      .getByTestId("ranked-item")
      .evaluateAll((els) => els.map((e) => e.getAttribute("data-issue-id")));
    await page.getByTestId("ranking-continue").click();
    const survey = page.getByTestId("survey");
    const step = page.getByTestId("answer-step");

    await expect(survey).toHaveAttribute("data-step", "answer-0");
    const firstOrder = await optionIds(page);
    await page.getByTestId("answer-option").nth(1).locator("input").check();
    await page.getByTestId("step-next").click();
    await expect(survey).toHaveAttribute("data-step", "answer-1");
    await expect(step).toHaveAttribute("data-issue-id", ranked[1]!);
    await page.getByTestId("answer-option").nth(2).locator("input").check();

    // Back to the first answer: same options in the same order, same choice.
    await page.getByTestId("step-back").click();
    await expect(survey).toHaveAttribute("data-step", "answer-0");
    await expect(step).toHaveAttribute("data-issue-id", ranked[0]!);
    expect(await optionIds(page)).toEqual(firstOrder);
    await expect(page.getByTestId("answer-option").nth(1)).toHaveAttribute("data-selected", "true");
    await expect(page.getByTestId("step-next")).toBeEnabled();

    // Back again: the ranking, as it was left.
    await page.getByTestId("step-back").click();
    await expect(survey).toHaveAttribute("data-step", "ranking");
    expect(
      await page
        .getByTestId("ranked-item")
        .evaluateAll((els) => els.map((e) => e.getAttribute("data-issue-id"))),
    ).toEqual(ranked);
    await expect(page.getByTestId("not-important-item")).toHaveCount(5);

    // Forward again: both answers are still there.
    await page.getByTestId("ranking-continue").click();
    await expect(page.getByTestId("answer-option").nth(1)).toHaveAttribute("data-selected", "true");
    await page.getByTestId("step-next").click();
    await expect(survey).toHaveAttribute("data-step", "answer-1");
    await expect(page.getByTestId("answer-option").nth(2)).toHaveAttribute("data-selected", "true");
  });

  test("resume after reload mid-survey restores the answers and the position", async ({ page }) => {
    await openSurvey(page, "en");
    await rankWithButtons(page, 2);
    await page.getByTestId("ranking-continue").click();
    const survey = page.getByTestId("survey");
    const firstOrder = await optionIds(page);
    await page.getByTestId("answer-option").nth(1).locator("input").check();
    await page.getByTestId("step-next").click();
    await expect(survey).toHaveAttribute("data-step", "answer-1");
    const secondIssue = await page.getByTestId("answer-step").getAttribute("data-issue-id");
    const secondOrder = await optionIds(page);
    await page.getByTestId("answer-option").nth(0).locator("input").check();

    await page.reload();
    await expect(survey).toHaveAttribute("data-step", "answer-1");
    await expect(page.getByTestId("answer-step")).toHaveAttribute("data-issue-id", secondIssue!);
    expect(await optionIds(page)).toEqual(secondOrder);
    await expect(page.getByTestId("answer-option").nth(0)).toHaveAttribute("data-selected", "true");
    await page.getByTestId("step-back").click();
    await expect(survey).toHaveAttribute("data-step", "answer-0");
    expect(await optionIds(page)).toEqual(firstOrder);
    await expect(page.getByTestId("answer-option").nth(1)).toHaveAttribute("data-selected", "true");

    // The intro offers the saved survey, and it opens where it was left.
    await page.goto("/en");
    await page.getByTestId("start-survey").click();
    await expect(survey).toHaveAttribute("data-step", "answer-0");
    await page.getByTestId("step-back").click();
    await expect(page.getByTestId("ranked-item")).toHaveCount(8);
    await expect(page.getByTestId("not-important-item")).toHaveCount(2);
  });

  test("the last answer screen submits directly, and the answers stay on the device", async ({
    page,
  }) => {
    await openSurvey(page, "en");
    // Everything the page sends from here on, other than plain page and asset loads.
    const sent: { url: string; body: string }[] = [];
    page.on("request", (r) => {
      if (r.method() !== "GET") sent.push({ url: r.url(), body: r.postData() ?? "" });
    });
    await rankWithButtons(page, 5);
    const chosen: string[] = [];
    await answerIssues(page, {
      submit: false,
      pick: (issueId) => {
        const id = issues().find((i: any) => i.id === issueId).options[1].id as string;
        chosen.push(id);
        return id;
      },
    });
    // Every screen but the last has "next"; the last has "submit" in its place.
    await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "answer-4");
    await expect(page.getByTestId("step-next")).toHaveCount(0);
    await expect(page.getByTestId("submit-survey")).toBeEnabled();
    await page.getByTestId("step-back").click();
    await expect(page.getByTestId("step-next")).toBeEnabled();
    await expect(page.getByTestId("submit-survey")).toHaveCount(0);
    await page.getByTestId("step-next").click();

    await page.getByTestId("submit-survey").click();
    // Straight to the result: no further step in between.
    await expect(page.getByTestId("result")).toBeVisible();
    await expect(
      page.getByTestId("result-entry").first().getByTestId("breakdown-item"),
    ).toHaveCount(5);
    await expect(page.getByTestId("anything-else-step")).toHaveCount(0);
    await expect(page.getByTestId("anything-else-note")).toHaveCount(0);

    // The only calls out are the anonymous counts, and they carry no answers.
    await expect.poll(() => sent.length).toBe(2);
    for (const s of sent) {
      expect(isTallyRequest({ url: () => s.url } as any), s.url).toBe(true);
      for (const id of chosen) expect(s.body).not.toContain(id);
      for (const i of issues()) expect(s.body).not.toContain(i.id);
    }
  });

  test("the last answer screen needs an answer before it can be submitted", async ({ page }) => {
    await openSurvey(page, "he");
    await rankWithButtons(page, 5);
    await page.getByTestId("ranking-continue").click();
    for (let i = 0; i < 4; i++) {
      await expect(page.getByTestId("survey")).toHaveAttribute("data-step", `answer-${i}`);
      await page.getByTestId("answer-option").first().locator("input").check();
      await page.getByTestId("step-next").click();
    }
    await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "answer-4");
    await expect(page.getByTestId("submit-survey")).toBeDisabled();
    await page.getByTestId("answer-option").last().locator("input").check();
    await expect(page.getByTestId("submit-survey")).toBeEnabled();
  });

  // Issues have 3–6 options; the largest must stay usable on a phone.
  for (const locale of LOCALES) {
    test(`shows every option of the largest issue without overflow (${locale})`, async ({
      page,
    }) => {
      const largest = issues().reduce((a, b) => (b.options.length > a.options.length ? b : a));
      expect(largest.options.length).toBeGreaterThanOrEqual(5);
      await openSurvey(page, locale);
      await page
        .locator(`[data-testid="pool-item"][data-issue-id="${largest.id}"]`)
        .getByTestId("add-to-ranking")
        .click();
      await rankWithButtons(page, 0);
      await page.getByTestId("ranking-continue").click();
      await expect(page.getByTestId("answer-step")).toHaveAttribute("data-issue-id", largest.id);
      const options = page.getByTestId("answer-option");
      await expect(options).toHaveCount(largest.options.length);
      const shown = await options.evaluateAll((els) =>
        els.map((el) => el.getAttribute("data-option-id")).sort(),
      );
      expect(shown).toEqual(largest.options.map((o: { id: string }) => o.id).sort());
      // No horizontal page scroll.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      // The last option can be reached and selected.
      const last = options.last();
      await last.scrollIntoViewIfNeeded();
      await last.locator("input").check();
      await expect(last).toHaveAttribute("data-selected", "true");
      await expect(page.getByTestId("step-next")).toBeEnabled();
    });
  }
});
