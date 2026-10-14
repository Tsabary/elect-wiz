import { expect, test } from "@playwright/test";
import {
  AFTER_CLOSE,
  BEFORE_BLACKOUT,
  completeCase,
  IN_BLACKOUT,
  issues,
  listedParties,
  lists,
  LOCALES,
  openSurvey,
  rankWithButtons,
  recheckClock,
  researchedParties,
  resultEntry,
  setClock,
} from "./helpers";

/** Lists of researched parties: the ones with a research page and a place in the result. */
const researchedLists = () => {
  const ids = new Set(researchedParties().map((p) => p.id));
  return lists().filter((l: any) => l.memberPartyIds.every((id: string) => ids.has(id)));
};
const belowList = () =>
  researchedLists().find((l: any) => l.poll.status === "polled" && l.poll.percent < 3.25);
const notPolledList = () => researchedLists().find((l: any) => l.poll.status === "not_polled");
const polledParty = () =>
  researchedLists().find((l: any) => l.poll.status === "polled" && l.poll.percent >= 3.25)
    .memberPartyIds[0];

const POLL_NOTES = ["poll-note-below-threshold", "poll-note-not-polled"];

test.describe("poll blackout (clock override)", () => {
  test("before the instant, poll information shows on research pages", async ({ page }) => {
    await setClock(page, BEFORE_BLACKOUT);
    await page.goto(`/en/parties/${belowList().memberPartyIds[0]}`);
    await expect(page.getByTestId("polling-line")).toBeVisible();
    await expect(page.getByTestId("poll-note-below-threshold")).toBeVisible();
    await expect(page.getByTestId("poll-blackout-notice")).toHaveCount(0);
  });

  for (const locale of LOCALES) {
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
    await recheckClock(page);
    await expect(page.getByTestId("polling-line")).toHaveCount(0);
    await expect(page.getByTestId("poll-blackout-notice")).toBeVisible();
  });

  for (const locale of LOCALES) {
    test(`a listed-only page is the same before and during the blackout (${locale})`, async ({
      page,
    }) => {
      const [listed] = listedParties();
      const snapshot = async () => {
        await page.goto(`/${locale}/parties/${listed.id}`);
        await expect(page.getByTestId("listed-note")).toBeVisible();
        for (const id of ["poll-info", "polling-line", "poll-blackout-notice", ...POLL_NOTES]) {
          await expect(page.getByTestId(id)).toHaveCount(0);
        }
        return page.locator("article").innerText();
      };
      await setClock(page, BEFORE_BLACKOUT);
      const before = await snapshot();
      await setClock(page, IN_BLACKOUT);
      expect(await snapshot()).toBe(before);
    });

    test(`results show poll notes before the blackout and none during it (${locale})`, async ({
      page,
    }) => {
      // Before: the below-threshold top match and the not-polled party both carry their note.
      await setClock(page, BEFORE_BLACKOUT);
      const set = await completeCase(page, locale, "below-threshold-top");
      const below = belowList().memberPartyIds[0];
      const notPolled = notPolledList().memberPartyIds[0];
      expect(set.entries[0]).toBe(below);
      await expect(
        page.getByTestId("result-entry").first().getByTestId("poll-note-below-threshold"),
      ).toBeVisible();
      await expect(resultEntry(page, notPolled).getByTestId("poll-note-not-polled")).toHaveCount(1);

      // During: the same answers give the same parties, with every poll note gone,
      // in the cards and in the rows behind "show all".
      await setClock(page, IN_BLACKOUT);
      await completeCase(page, locale, "below-threshold-top");
      await expect(page.getByTestId("result-entry").first()).toHaveAttribute(
        "data-party-id",
        below,
      );
      await page.getByTestId("show-all").click();
      await expect(page.getByTestId("result-row").first()).toBeVisible();
      for (const id of POLL_NOTES) await expect(page.getByTestId(id)).toHaveCount(0);
      // No poll figure anywhere in the result. Issue option text is approved survey
      // content and may contain percentages, and each party's match percentage is
      // not poll information, so strip both first.
      const percents = page.getByTestId("match-percent");
      await expect(percents).not.toHaveCount(0);
      await percents.evaluateAll((els) => els.forEach((e) => e.remove()));
      let resultText = await page.getByTestId("result").innerText();
      for (const issue of issues()) {
        for (const o of issue.options) resultText = resultText.split(o[locale]).join("");
      }
      expect(resultText).not.toContain("%");
      // What isn't poll information stays: the "not all lists" note, the
      // limited-information flag, the joint-list labels.
      await expect(page.getByTestId("not-all-lists")).toBeVisible();
      await expect(resultEntry(page, notPolled).getByTestId("result-limited-info")).toHaveCount(1);
      await expect(page.getByTestId("joint-list-label")).not.toHaveCount(0);
    });

    test(`How this works never says which lists polled at what level (${locale})`, async ({
      page,
    }) => {
      // Owner decision 2026-10-13: the criterion for researching a list is not
      // published, so the page is the same before, during and after the blackout.
      await setClock(page, BEFORE_BLACKOUT);
      await page.goto(`/${locale}/how-it-works`);
      await expect(page.locator("[data-poll-derived]")).toHaveCount(0);
      const before = await page.locator("#research").innerText();
      expect(before).not.toContain("%");

      await setClock(page, IN_BLACKOUT);
      await page.goto(`/${locale}/how-it-works`);
      expect(await page.locator("#research").innerText()).toBe(before);

      await setClock(page, AFTER_CLOSE);
      await page.goto(`/${locale}/how-it-works`);
      expect(await page.locator("#research").innerText()).toBe(before);
    });
  }

  test("Privacy has no poll-derived text at any time", async ({ page }) => {
    await setClock(page, BEFORE_BLACKOUT);
    await page.goto("/en/privacy");
    await expect(page.locator("[data-poll-derived]")).toHaveCount(0);
    const before = await page.locator("article").innerText();
    await setClock(page, IN_BLACKOUT);
    await page.goto("/en/privacy");
    expect(await page.locator("article").innerText()).toBe(before);
  });

  test("a result left open drops its poll notes when the instant passes", async ({ page }) => {
    await setClock(page, BEFORE_BLACKOUT);
    await completeCase(page, "en", "below-threshold-top");
    await expect(page.getByTestId("poll-note-below-threshold")).toBeVisible();
    await setClock(page, IN_BLACKOUT);
    await recheckClock(page);
    for (const id of POLL_NOTES) await expect(page.getByTestId(id)).toHaveCount(0);
    await expect(page.getByTestId("result-entry")).toHaveCount(5);
  });

  test("the matching bundle carries no poll data, so it is the same at any time", async ({
    request,
  }) => {
    for (const locale of LOCALES) {
      const before = await request.get(`/api/matching/${locale}`, {
        headers: { "x-clock-override": BEFORE_BLACKOUT },
      });
      const during = await request.get(`/api/matching/${locale}`, {
        headers: { "x-clock-override": IN_BLACKOUT },
      });
      expect(before.status()).toBe(200);
      const text = await before.text();
      expect(await during.text()).toBe(text);
      expect(text).not.toMatch(/"(poll|pollNote|percent|constituentPolls|asOf)"\s*:/);
    }
  });
});

test.describe("election over (clock override)", () => {
  for (const locale of LOCALES) {
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
    await page.goto(`/he/share/${researchedParties()[0].id}`);
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

  test("a survey left open closes when the polls do", async ({ page }) => {
    await setClock(page, IN_BLACKOUT);
    await openSurvey(page, "en");
    await rankWithButtons(page, 5);
    await page.getByTestId("ranking-continue").click();
    await expect(page.getByTestId("answer-step")).toBeVisible();
    await setClock(page, AFTER_CLOSE);
    await recheckClock(page);
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByTestId("election-over")).toBeVisible();
    await expect(page.getByTestId("start-survey")).toHaveCount(0);
    await expect(page.getByTestId("survey")).toHaveCount(0);
  });

  test("the tally route rejects every call after close", async ({ request }) => {
    const ids = researchedParties().map((p) => p.id);
    const calls = [{ kind: "started" }, { kind: "result", parties: ids.slice(0, 4) }];
    for (const data of calls) {
      const before = await request.post("/api/tally", {
        data,
        headers: { "x-clock-override": IN_BLACKOUT },
      });
      expect(before.status()).toBe(204);
      const after = await request.post("/api/tally", {
        data,
        headers: { "x-clock-override": AFTER_CLOSE },
      });
      expect(after.status()).toBe(410);
      expect(await after.text()).toBe("");
    }
    // Closed comes first: a malformed call gets the same answer.
    const malformed = await request.post("/api/tally", {
      data: { hello: "world" },
      headers: { "x-clock-override": AFTER_CLOSE },
    });
    expect(malformed.status()).toBe(410);
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
