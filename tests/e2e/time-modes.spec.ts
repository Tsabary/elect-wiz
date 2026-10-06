import { expect, test } from "@playwright/test";
import {
  AFTER_CLOSE,
  BEFORE_BLACKOUT,
  completeSurvey,
  IN_BLACKOUT,
  issues,
  lists,
  parties,
  setClock,
  validMatchRequest,
} from "./helpers";

const belowList = () =>
  lists().find((l: any) => l.poll.status === "polled" && l.poll.percent < 3.25);
const notPolledList = () => lists().find((l: any) => l.poll.status === "not_polled");
const polledParty = () =>
  lists().find((l: any) => l.poll.status === "polled" && l.poll.percent >= 3.25).memberPartyIds[0];

test.describe("poll blackout (clock override)", () => {
  test("before the instant, poll information shows on research pages", async ({ page }) => {
    await setClock(page, BEFORE_BLACKOUT);
    await page.goto(`/en/parties/${belowList().memberPartyIds[0]}`);
    await expect(page.getByTestId("polling-line")).toBeVisible();
    await expect(page.getByTestId("poll-note-below-threshold")).toBeVisible();
    await expect(page.getByTestId("poll-blackout-notice")).toHaveCount(0);
  });

  for (const locale of ["he", "en"] as const) {
    test(`during blackout, every research page hides poll numbers and notes (${locale})`, async ({
      page,
    }) => {
      await setClock(page, IN_BLACKOUT);
      const optionTexts: string[] = issues().flatMap((issue: any) =>
        issue.options.map((o: any) => o[locale] as string),
      );
      for (const id of [
        polledParty(),
        belowList().memberPartyIds[0],
        notPolledList().memberPartyIds[0],
      ]) {
        await page.goto(`/${locale}/parties/${id}`);
        await expect(page.getByTestId("poll-blackout-notice")).toBeVisible();
        await expect(page.getByTestId("polling-line")).toHaveCount(0);
        await expect(page.getByTestId("poll-note-below-threshold")).toHaveCount(0);
        await expect(page.getByTestId("poll-note-not-polled")).toHaveCount(0);
        // No poll figure anywhere. Issue option text is approved survey content
        // and may contain percentages (e.g. "Area C, about 60%"), so strip it first.
        let bodyText = await page.locator("body").innerText();
        for (const option of optionTexts) bodyText = bodyText.split(option).join("");
        expect(bodyText).not.toContain("%");
      }
    });
  }

  test("a page left open switches to blackout when the instant passes", async ({ page }) => {
    await setClock(page, BEFORE_BLACKOUT);
    await page.goto(`/en/parties/${polledParty()}`);
    await expect(page.getByTestId("polling-line")).toBeVisible();
    await setClock(page, IN_BLACKOUT);
    await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
    await expect(page.getByTestId("polling-line")).toHaveCount(0);
    await expect(page.getByTestId("poll-blackout-notice")).toBeVisible();
  });

  test("result metadata carries no poll notes during blackout", async ({ page }) => {
    await setClock(page, IN_BLACKOUT);
    await completeSurvey(page, "en", "?mockScenario=below-threshold");
    await expect(page.getByTestId("result")).toBeVisible();
    await expect(page.getByTestId("poll-note-below-threshold")).toHaveCount(0);
    await expect(page.getByTestId("poll-note-not-polled")).toHaveCount(0);
  });

  test("the match route omits poll notes during blackout", async ({ request }) => {
    const res = await request.post("/api/match?mockScenario=not-polled", {
      data: validMatchRequest("en"),
      headers: { "x-clock-override": IN_BLACKOUT },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.meta.blackout).toBe(true);
    for (const e of body.entries) expect(e.metadata.pollNote).toBeNull();
  });
});

test.describe("election over (clock override)", () => {
  for (const locale of ["he", "en"] as const) {
    test(`intro replaces the start button with a banner (${locale})`, async ({ page }) => {
      await setClock(page, AFTER_CLOSE);
      await page.goto(`/${locale}`);
      await expect(page.getByTestId("election-over")).toBeVisible();
      await expect(page.getByTestId("start-survey")).toHaveCount(0);
    });
  }

  test("before poll close the start button shows", async ({ page }) => {
    await setClock(page, IN_BLACKOUT);
    await page.goto("/he");
    await expect(page.getByTestId("start-survey")).toBeVisible();
    await expect(page.getByTestId("election-over")).toHaveCount(0);
  });

  test("survey route redirects to the intro", async ({ page }) => {
    await setClock(page, AFTER_CLOSE);
    await page.goto("/en/survey");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByTestId("election-over")).toBeVisible();
  });

  test("share landing page shows the banner instead of the invitation", async ({ page }) => {
    await setClock(page, AFTER_CLOSE);
    await page.goto(`/he/share/${parties()[0].id}`);
    await expect(page.getByTestId("election-over")).toBeVisible();
    await expect(page.getByTestId("start-survey")).toHaveCount(0);
  });

  test("research stays available as an archive, without poll information", async ({ page }) => {
    await setClock(page, AFTER_CLOSE);
    await page.goto(`/en/parties/${polledParty()}`);
    await expect(page.getByTestId("party-name")).toBeVisible();
    await expect(page.getByTestId("poll-blackout-notice")).toBeVisible();
    await expect(page.getByTestId("polling-line")).toHaveCount(0);
  });

  test("the match route rejects with election_over after close", async ({ request }) => {
    const before = await request.post("/api/match", {
      data: validMatchRequest(),
      headers: { "x-clock-override": IN_BLACKOUT },
    });
    expect(before.status()).toBe(200);
    const after = await request.post("/api/match", {
      data: validMatchRequest(),
      headers: { "x-clock-override": AFTER_CLOSE },
    });
    expect(after.status()).toBe(410);
    expect(await after.json()).toEqual({ error: { code: "election_over" } });
  });

  test("`?clock=` sets the override cookie and `?clock=off` clears it", async ({
    page,
    context,
  }) => {
    await page.goto(`/en?clock=${AFTER_CLOSE}`);
    await expect(page.getByTestId("election-over")).toBeVisible();
    expect((await context.cookies()).some((c) => c.name === "clock-override")).toBe(true);
    await page.goto("/en?clock=off");
    await expect(page.getByTestId("start-survey")).toBeVisible();
  });
});
