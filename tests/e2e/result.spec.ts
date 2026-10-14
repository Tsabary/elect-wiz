import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  answerIssues,
  completeCase,
  completeSurvey,
  expectBallotSlip,
  listOf,
  listedParties,
  LOCALES,
  MATCHING_BUNDLE_URL,
  openSurvey,
  parties,
  partyIdsOf,
  PLACEHOLDER_CASES,
  rankWithButtons,
  researchedParties,
  resultEntry,
  type AppLocale,
} from "./helpers";

/** How many parties the result shows as full cards; the rest sit behind "show all". */
const FULL = 5;

const issueIdsOf = (loc: Locator) =>
  loc.evaluateAll((els) => els.map((e) => e.getAttribute("data-issue-id")));

/** The `id` attributes present in a party page's server-rendered HTML. */
async function partyPageIds(page: Page, locale: AppLocale, partyId: string): Promise<Set<string>> {
  const res = await page.request.get(`/${locale}/parties/${partyId}`);
  expect(res.status(), `party page of ${partyId}`).toBe(200);
  return new Set([...(await res.text()).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
}

for (const locale of LOCALES) {
  test.describe(`result cases from the placeholder answer sets (${locale})`, () => {
    // What every answer set must produce: the recorded order, split into the
    // five full cards and the rest behind "show all", and the recorded labels.
    for (const id of PLACEHOLDER_CASES) {
      test(`${id}: the recorded parties, in the recorded order`, async ({ page }) => {
        const set = await completeCase(page, locale, id);
        expect(set.entries).toHaveLength(researchedParties().length);

        const cards = page.getByTestId("result-entry");
        await expect(cards).toHaveCount(FULL);
        expect(await partyIdsOf(cards)).toEqual(set.entries.slice(0, FULL));
        await expect(page.getByTestId("weak-match")).toHaveCount(set.weakMatch ? 1 : 0);

        // The top match's breakdown is open: one item per ranked issue, in rank order.
        const top = cards.first();
        await expect(top.getByTestId("breakdown")).toBeVisible();
        expect(await issueIdsOf(top.getByTestId("breakdown-item"))).toEqual(set.ranked);

        // The rest of the researched parties are behind "show all", in order.
        const rows = page.getByTestId("result-row");
        await expect(page.getByTestId("all-parties")).not.toHaveAttribute("open", /.*/);
        await expect(rows.first()).toBeHidden();
        await page.getByTestId("show-all").click();
        await expect(page.getByTestId("all-parties-note")).toBeVisible();
        await expect(page.getByTestId("all-parties-list")).toBeVisible();
        expect(await partyIdsOf(rows)).toEqual(set.entries.slice(FULL));
        await expect(rows.first()).toBeVisible();

        // Every researched party appears exactly once; a listed party never does.
        const shown = [...(await partyIdsOf(cards)), ...(await partyIdsOf(rows))];
        expect([...shown].sort()).toEqual(
          researchedParties()
            .map((p) => p.id)
            .sort(),
        );
        for (const p of listedParties()) expect(shown).not.toContain(p.id);

        // Every full card and every "show all" row carries its list's ballot slip.
        for (const [i, partyId] of set.entries.entries()) {
          await expectBallotSlip(
            resultEntry(page, partyId),
            locale,
            listOf(partyId),
            i < FULL ? "normal" : "compact",
          );
        }

        // Each party has one breakdown item per ranked issue, and the recorded
        // "party position unclear" items are labelled so.
        for (const partyId of set.entries) {
          const entry = resultEntry(page, partyId);
          await expect(entry.getByTestId("breakdown-item")).toHaveCount(set.ranked.length);
        }
        for (const [partyId, issueId] of set.unclear) {
          await expect(
            resultEntry(page, partyId).locator(
              `[data-testid="breakdown-item"][data-issue-id="${issueId}"]`,
            ),
          ).toHaveAttribute("data-agreement", "party-position-unclear");
        }
      });
    }

    test("joint list: the top match is labelled with its list and a link to its partner", async ({
      page,
    }) => {
      const set = await completeCase(page, locale, "joint-list-top");
      const [topId] = set.entries;
      const list = listOf(topId);
      expect(list.memberPartyIds.length).toBeGreaterThan(1);
      const top = page.getByTestId("result-entry").first();
      await expect(top).toHaveAttribute("data-party-id", topId);
      const label = top.getByTestId("joint-list-label");
      await expect(label).toBeVisible();
      await expect(label).toContainText(list.name[locale]);
      // The letters are on the slip beside the label, once, and not in the sentence too.
      await expect(label).not.toContainText(list.ballotLetters);
      await expectBallotSlip(top, locale, list, "normal");
      const partnerId = list.memberPartyIds.find((x: string) => x !== topId);
      const partnerName = parties().find((p) => p.id === partnerId).name[locale];
      await expect(label.getByRole("link", { name: partnerName })).toHaveAttribute(
        "href",
        `/${locale}/parties/${partnerId}`,
      );
      // The partner is a runner-up on its own merits, with its own entry and label.
      expect(set.entries.slice(1, FULL)).toContain(partnerId);
      const partner = resultEntry(page, partnerId);
      await expect(partner).toHaveCount(1);
      // Both parties of the list show the same letters, each on its own slip.
      await expectBallotSlip(partner, locale, list, "normal");
      await expect(
        partner.getByTestId("joint-list-label").locator(`a[href="/${locale}/parties/${topId}"]`),
      ).toBeVisible();
      // A party running alone carries no joint-list label.
      const alone = set.entries.find((x) => listOf(x).memberPartyIds.length === 1)!;
      await expect(resultEntry(page, alone).getByTestId("joint-list-label")).toHaveCount(0);
    });

    test("below threshold: the top match carries the note, other parties don't", async ({
      page,
    }) => {
      const set = await completeCase(page, locale, "below-threshold-top");
      const [topId] = set.entries;
      const poll = listOf(topId).poll;
      expect(poll.status).toBe("polled");
      expect(poll.percent).toBeLessThan(3.25);
      const top = page.getByTestId("result-entry").first();
      const note = top.getByTestId("poll-note-below-threshold");
      await expect(note).toBeVisible();
      // The registry's own figure, not a rounded or invented one.
      await expect(note).toContainText(String(poll.percent));
      await expect(page.getByTestId("poll-note-below-threshold")).toHaveCount(1);
    });

    test("limited information: the top match is flagged, and so is no fully researched party", async ({
      page,
    }) => {
      const set = await completeCase(page, locale, "limited-information-top");
      const [topId] = set.entries;
      expect(parties().find((p) => p.id === topId).limitedInfo).toBe(true);
      const top = page.getByTestId("result-entry").first();
      await expect(top.getByTestId("result-limited-info")).toBeVisible();
      // This list was also not polled, which is said on the same card.
      expect(listOf(topId).poll.status).toBe("not_polled");
      await expect(top.getByTestId("poll-note-not-polled")).toBeVisible();
      for (const partyId of set.entries) {
        const limited = parties().find((p) => p.id === partyId).limitedInfo;
        await expect(resultEntry(page, partyId).getByTestId("result-limited-info")).toHaveCount(
          limited ? 1 : 0,
        );
      }
    });

    test("weak match: the message shows above a normal result", async ({ page }) => {
      await completeCase(page, locale, "weak-match");
      const message = page.getByTestId("weak-match");
      await expect(message).toBeVisible();
      await expect(message).not.toBeEmpty();
      // It sits outside the party cards: it is about the result, not one party.
      await expect(page.getByTestId("result-entry").getByTestId("weak-match")).toHaveCount(0);
      const top = page.getByTestId("result-entry").first();
      await expect(top.getByTestId("breakdown-item").first()).toBeVisible();
      await expect(top.getByTestId("points")).toBeVisible();
    });

    test("unclear position: the breakdown says so on that issue, and still links to the research", async ({
      page,
    }) => {
      const set = await completeCase(page, locale, "unclear-position");
      const [[partyId, issueId]] = set.unclear;
      expect(partyId).toBe(set.entries[0]);
      const top = page.getByTestId("result-entry").first();
      const item = top.locator(`[data-testid="breakdown-item"][data-issue-id="${issueId}"]`);
      await expect(item).toBeVisible();
      await expect(item).toHaveAttribute("data-agreement", "party-position-unclear");
      await expect(item.getByTestId("breakdown-link")).toHaveAttribute(
        "href",
        `/${locale}/parties/${partyId}#issue-${issueId}`,
      );
      // The other issues got a real comparison.
      const levels = await top
        .getByTestId("breakdown-item")
        .evaluateAll((els) => els.map((e) => e.getAttribute("data-agreement")));
      expect(levels.filter((l) => l === "party-position-unclear")).toHaveLength(set.unclear.length);
      for (const l of levels) {
        expect(["agrees", "partially", "disagrees", "party-position-unclear"]).toContain(l);
      }
    });

    test("every party shows 2–3 points, each linked to an existing `other-…` section of its research", async ({
      page,
    }) => {
      const set = await completeCase(page, locale, "joint-list-top");
      // The top match's points are in view without opening anything.
      const top = page.getByTestId("result-entry").first();
      await expect(top.getByTestId("points")).toBeVisible();
      await expect(top.getByTestId("point").first()).toBeVisible();

      for (const partyId of set.entries) {
        const entry = resultEntry(page, partyId);
        await expect(entry.getByTestId("points")).toHaveCount(1);
        const hrefs = await entry
          .getByTestId("point-link")
          .evaluateAll((els) => els.map((e) => e.getAttribute("href")!));
        expect(hrefs.length, partyId).toBeGreaterThanOrEqual(2);
        expect(hrefs.length, partyId).toBeLessThanOrEqual(3);
        await expect(entry.getByTestId("point")).toHaveCount(hrefs.length);
        expect(new Set(hrefs).size, `${partyId}: distinct anchors`).toBe(hrefs.length);
        const ids = await partyPageIds(page, locale, partyId);
        for (const href of hrefs) {
          const [path, anchor] = href.split("#");
          expect(path).toBe(`/${locale}/parties/${partyId}`);
          expect(anchor).toMatch(/^other-[a-z0-9-]+$/);
          expect(ids.has(anchor), `${href} exists on the party page`).toBe(true);
        }
      }

      // A runner-up's points sit inside its collapsed details.
      const runnerUp = page.getByTestId("result-entry").nth(1);
      await expect(runnerUp.getByTestId("points")).toBeHidden();
      await runnerUp.locator("summary").click();
      await expect(runnerUp.getByTestId("points")).toBeVisible();
      await expect(runnerUp.getByTestId("breakdown-item").first()).toBeVisible();

      // Following a point lands on that section of the research page.
      const link = top.getByTestId("point-link").first();
      const anchor = (await link.getAttribute("href"))!.split("#")[1];
      await link.click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/parties/${set.entries[0]}#${anchor}$`));
      await expect(page.locator(`[id="${anchor}"]`)).toBeInViewport();
    });

    test("a closed 'show all' row shows its joint list or poll note under the name", async ({
      page,
    }) => {
      // Here the list polling below the threshold ("lighthouse") is the one behind "show all".
      await completeCase(page, locale, "weak-match");
      await page.getByTestId("show-all").click();
      const row = page.getByTestId("result-row").filter({ has: page.getByTestId("row-facts") });
      await expect(row.first()).toBeVisible();
      await expect(row.first().getByTestId("row-facts")).toBeVisible();
      // Once open, the same facts lead the details instead.
      await row.first().locator("summary").click();
      await expect(row.first().getByTestId("row-facts")).toBeHidden();
      await expect(row.first().getByTestId("breakdown")).toBeVisible();
    });

    test("a 'show all' row opens to the same facts, breakdown and points as a card", async ({
      page,
    }) => {
      // Here the limited-information party is the one behind "show all".
      const set = await completeCase(page, locale, "below-threshold-top");
      const lastId = set.entries[set.entries.length - 1];
      await page.getByTestId("show-all").click();
      const row = page.locator(`[data-testid="result-row"][data-party-id="${lastId}"]`);
      await expect(row).toBeVisible();
      await expect(row.getByTestId("breakdown")).toBeHidden();
      await row.locator("summary").click();
      await expect(row.getByTestId("breakdown")).toBeVisible();
      await expect(row.getByTestId("breakdown-item")).toHaveCount(set.ranked.length);
      await expect(row.getByTestId("points")).toBeVisible();
      await expect(row.getByTestId("research-link")).toHaveAttribute(
        "href",
        `/${locale}/parties/${lastId}`,
      );
      // "Show all" closes again.
      await page.getByTestId("show-all").click();
      await expect(row).toBeHidden();
    });

    test("the 'not all lists' note links to the Parties page", async ({ page }) => {
      await completeCase(page, locale, "weak-match");
      const note = page.getByTestId("not-all-lists");
      await expect(note).toBeVisible();
      await expect(note.getByRole("link")).toHaveCount(1);
      await expect(note.getByRole("link")).toHaveAttribute("href", `/${locale}/parties`);
      // It names no poll figure.
      expect(await note.innerText()).not.toContain("%");
      await note.getByRole("link").click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/parties$`));
      // That page does list the parties the matching left out.
      await expect(page.locator('[data-testid="party-link"][data-tier="listed"]')).toHaveCount(
        listedParties().length,
      );
    });

    test("breakdown and research links lead to existing places in the research", async ({
      page,
    }) => {
      const set = await completeCase(page, locale, "unclear-position");
      for (const partyId of set.entries) {
        const entry = resultEntry(page, partyId);
        await expect(entry.getByTestId("research-link")).toHaveAttribute(
          "href",
          `/${locale}/parties/${partyId}`,
        );
        const hrefs = await entry
          .getByTestId("breakdown-link")
          .evaluateAll((els) => els.map((e) => e.getAttribute("href")!));
        expect(hrefs).toEqual(set.ranked.map((i) => `/${locale}/parties/${partyId}#issue-${i}`));
        const ids = await partyPageIds(page, locale, partyId);
        for (const href of hrefs) expect(ids.has(href.split("#")[1]), href).toBe(true);
      }
      // Following one scrolls to that issue's section.
      const link = page.getByTestId("result-entry").first().getByTestId("breakdown-link").nth(2);
      const anchor = (await link.getAttribute("href"))!.split("#")[1];
      await link.click();
      await expect(page).toHaveURL(new RegExp(`#${anchor}$`));
      const heading = page.locator(`[id="${anchor}"]`);
      await expect(heading).toBeVisible();
      await expect(heading).toBeInViewport();
    });

    test("the result offers no way to edit the answers; the only way on is to start over", async ({
      page,
    }) => {
      await completeCase(page, locale, "joint-list-top");
      const result = page.getByTestId("result");
      for (const gone of [
        "step-back",
        "step-next",
        "submit-survey",
        "ranking-continue",
        "answer-step",
        "answer-option",
        "error-retry",
        "error-restart",
        "anything-else-note",
      ]) {
        await expect(page.getByTestId(gone)).toHaveCount(0);
      }
      // The only buttons on the result are the two share buttons and, after them, starting over;
      // nothing links back into the survey that was answered.
      await page.getByTestId("show-all").click();
      await expect(result.getByRole("button")).toHaveCount(3);
      await expect(result.getByTestId("share-button")).toBeVisible();
      await expect(result.getByTestId("share-answers-button")).toBeVisible();
      await expect(result.getByTestId("start-over")).toBeVisible();
      expect(
        await result
          .getByRole("button")
          .evaluateAll((els) => els.map((e) => e.getAttribute("data-testid"))),
      ).toEqual(["share-button", "share-answers-button", "start-over"]);
      await expect(result.locator(`a[href*="/survey"]`)).toHaveCount(0);
      await expect(result.locator("form, input, textarea, select")).toHaveCount(0);
      await expect(page.getByTestId("disclaimer")).toBeVisible();
    });
  });
}

for (const locale of LOCALES) {
  test.describe(`error states (${locale})`, () => {
    test("the matching data fails to load: 'try again' loads it and shows the result", async ({
      page,
    }) => {
      let fail = true;
      let requests = 0;
      await page.route(MATCHING_BUNDLE_URL, (route) => {
        requests++;
        return fail ? route.abort("failed") : route.continue();
      });
      await completeSurvey(page, locale);
      const error = page.getByTestId("result-error");
      await expect(error).toHaveAttribute("data-error-code", "bundle_load_failed");
      await expect(error).toHaveAttribute("role", "alert");
      await expect(error.getByRole("heading", { level: 1 })).toBeFocused();
      await expect(page.getByTestId("error-retry")).toBeVisible();
      await expect(page.getByTestId("error-restart")).toHaveCount(0);
      await expect(page.getByTestId("result")).toHaveCount(0);
      // The answers are kept while the error shows.
      const saved = JSON.parse((await page.evaluate(() => localStorage.getItem("elect.survey")))!);
      expect(saved.ranked).toHaveLength(8);
      expect(Object.keys(saved.answers)).toHaveLength(8);

      // Still failing: the same error again, after a new request.
      const before = requests;
      await page.getByTestId("error-retry").click();
      await expect.poll(() => requests).toBeGreaterThan(before);
      await expect(error).toHaveAttribute("data-error-code", "bundle_load_failed");

      // Back up: the result, with the answers given before.
      fail = false;
      await page.getByTestId("error-retry").click();
      await expect(page.getByTestId("result")).toBeVisible();
      await expect(page.getByTestId("result-error")).toHaveCount(0);
      await expect(
        page.getByTestId("result-entry").first().getByTestId("breakdown-item"),
      ).toHaveCount(8);
    });

    test("the matching data is not a usable file: the same error, with 'try again'", async ({
      page,
    }) => {
      let mode: "status" | "garbage" | "wrong-shape" = "status";
      await page.route(MATCHING_BUNDLE_URL, (route) =>
        mode === "status"
          ? route.fulfill({ status: 500, body: "" })
          : mode === "garbage"
            ? route.fulfill({ status: 200, contentType: "application/json", body: "<html>" })
            : route.fulfill({ status: 200, json: { hello: "world" } }),
      );
      await completeSurvey(page, locale);
      const error = page.getByTestId("result-error");
      for (const next of ["garbage", "wrong-shape"] as const) {
        await expect(error).toHaveAttribute("data-error-code", "bundle_load_failed");
        mode = next;
        const [req] = await Promise.all([
          page.waitForRequest(MATCHING_BUNDLE_URL),
          page.getByTestId("error-retry").click(),
        ]);
        expect(req.method()).toBe("GET");
        await page.waitForLoadState("networkidle");
      }
      await expect(error).toHaveAttribute("data-error-code", "bundle_load_failed");
      await expect(page.getByTestId("error-retry")).toBeVisible();
    });

    test("the matching data was built for other survey content: restart, not retry", async ({
      page,
    }) => {
      await page.route(MATCHING_BUNDLE_URL, async (route) => {
        const res = await route.fetch();
        const bundle = await res.json();
        await route.fulfill({
          response: res,
          json: { ...bundle, surveyContentVersion: "some-other-version" },
        });
      });
      await completeSurvey(page, locale);
      const error = page.getByTestId("result-error");
      await expect(error).toHaveAttribute("data-error-code", "content_version_mismatch");
      await expect(page.getByTestId("error-retry")).toHaveCount(0);
      await expect(page.getByTestId("result")).toHaveCount(0);
      await page.getByTestId("error-restart").click();
      await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
      await expect(page.getByTestId("ranked-item")).toHaveCount(0);
      await expect(page.getByTestId("not-important-item")).toHaveCount(0);
      await expect(page.getByTestId("pool-item")).toHaveCount(10);
    });
  });
}

test("a newer matching version than the page expected is simply used", async ({ page }) => {
  await page.route(MATCHING_BUNDLE_URL, async (route) => {
    const res = await route.fetch();
    await route.fulfill({
      response: res,
      json: { ...(await res.json()), matchingVersion: "a-later-version" },
    });
  });
  await completeSurvey(page, "en");
  await expect(page.getByTestId("result")).toBeVisible();
  await expect(page.getByTestId("result-error")).toHaveCount(0);
});

test("the matching data is fetched once, ahead of the submit, from the versioned address", async ({
  page,
}) => {
  const urls: string[] = [];
  page.on("request", (r) => {
    if (MATCHING_BUNDLE_URL.test(r.url())) urls.push(r.url());
  });
  await openSurvey(page, "he");
  await rankWithButtons(page, 5);
  expect(urls).toHaveLength(0);
  await answerIssues(page, { submit: false });
  await expect.poll(() => urls.length).toBe(1);
  const url = new URL(urls[0]);
  expect(url.pathname).toBe("/api/matching/he");
  expect(url.searchParams.get("v")).toBeTruthy();
  await page.getByTestId("submit-survey").click();
  await expect(page.getByTestId("result")).toBeVisible();
  // No waiting screen, and no second request.
  await expect(page.getByTestId("result-loading")).toHaveCount(0);
  expect(urls).toHaveLength(1);
});

test("submitting before the matching data arrives shows the loading state, then the result", async ({
  page,
}) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => (release = resolve));
  await page.route(MATCHING_BUNDLE_URL, async (route) => {
    await held;
    await route.continue();
  });
  await openSurvey(page, "en");
  await rankWithButtons(page, 5);
  await answerIssues(page);
  const loading = page.getByTestId("result-loading");
  await expect(loading).toBeVisible();
  await expect(loading).toHaveAttribute("aria-busy", "true");
  await expect(loading.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(page.getByTestId("result")).toHaveCount(0);
  release();
  await expect(page.getByTestId("result")).toBeVisible();
  await expect(loading).toHaveCount(0);
  await expect(page.getByTestId("result").getByRole("heading", { level: 1 })).toBeFocused();
});

test.describe("sharing", () => {
  test("share link carries only the top four party IDs and opens the landing page", async ({
    page,
    context,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      "the native share sheet can't be driven in tests; copy-link is tested on desktop",
    );
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const set = await completeCase(page, "en", "joint-list-top");
    const ids = set.entries.slice(0, 4);
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
    expect(
      await page
        .getByTestId("shared-rest")
        .locator("a")
        .evaluateAll((els) => els.map((e) => e.getAttribute("href"))),
    ).toEqual(ids.slice(1).map((id) => `/en/parties/${id}`));
    await expect(page.getByTestId("start-survey")).toBeVisible();
  });

  for (const locale of LOCALES) {
    test(`landing page: any other spelling redirects to the canonical address (${locale})`, async ({
      page,
      request,
    }) => {
      const [valid, other] = researchedParties();
      await page.goto(
        `/${locale}/share/nope,${valid.id},${valid.id},%3Cscript%3E?answers=secret&x=1`,
      );
      await expect(page).toHaveURL(
        new RegExp(`/${locale}/share/${valid.id}\\?answers=secret&x=1$`),
      );
      await expect(page.getByTestId("shared-top")).toHaveText(valid.name[locale]);
      await expect(page.getByTestId("shared-rest")).toHaveCount(0);
      expect(await page.locator("body").innerText()).not.toContain("secret");

      // Redirected before anything is rendered, so junk addresses never become cached pages.
      for (const [from, to] of [
        [`${valid.id}%2C${other.id}`, `${valid.id},${other.id}`],
        [`${valid.id},${other.id},`, `${valid.id},${other.id}`],
        [`${valid.id},junk.1`, `${valid.id}`],
        [`${valid.id},j.9/opengraph-image`, `${valid.id}/opengraph-image`],
        [`x,${valid.id}/opengraph-image`, `${valid.id}/opengraph-image`],
        [`${valid.id},${other.id}/opengraph-image`, `${valid.id}%2C${other.id}/opengraph-image`],
      ]) {
        const res = await request.get(`/${locale}/share/${from}`, { maxRedirects: 0 });
        expect(res.status(), from).toBe(308);
        expect(new URL(res.headers().location, "http://x").pathname).toBe(`/${locale}/share/${to}`);
      }
      const canonical = await request.get(`/${locale}/share/${valid.id},${other.id}`, {
        maxRedirects: 0,
      });
      expect(canonical.status()).toBe(200);
    });

    test(`landing page: a link with no valid party is not found (${locale})`, async ({
      page,
      request,
    }) => {
      // (A malformed escape such as %E0%A4%A fails in Next itself, on any path, before rendering.)
      // With a dot too: the proxy's general matcher skips paths that look like files.
      for (const segment of ["garbage", ",,", `${listedParties()[0].id}`, "junk.3"]) {
        const res = await request.get(`/${locale}/share/${segment}`, { maxRedirects: 0 });
        expect(res.status(), segment).toBe(404);
      }
      const image = await request.get(`/${locale}/share/garbage/opengraph-image`, {
        maxRedirects: 0,
      });
      expect(image.status()).toBe(404);
      await page.goto(`/${locale}/share/garbage`);
      await expect(page.getByTestId("share-landing")).toHaveCount(0);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });

    test(`landing page ignores a listed party's ID (${locale})`, async ({ page }) => {
      const [listed] = listedParties();
      const [a, b] = researchedParties();
      // A listed party can't be presented as someone's match, wherever it sits in the link.
      await page.goto(`/${locale}/share/${listed.id},${a.id},${b.id}`);
      await expect(page).toHaveURL(new RegExp(`/${locale}/share/${a.id},${b.id}$`));
      await expect(page.getByTestId("shared-top")).toHaveAttribute(
        "href",
        `/${locale}/parties/${a.id}`,
      );
      await expect(page.getByTestId("shared-top")).toHaveText(a.name[locale]);
      await expect(page.getByTestId("shared-rest").locator("a")).toHaveCount(1);
      const landing = page.getByTestId("share-landing");
      await expect(landing.locator(`a[href$="/parties/${listed.id}"]`)).toHaveCount(0);
      expect(await landing.innerText()).not.toContain(listed.name[locale]);
      // Nor in the page's metadata or its preview image address.
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new RegExp(`/${locale}/share/${a.id},${b.id}$`),
      );
      for (const sel of ['meta[property="og:title"]', 'meta[property="og:image"]']) {
        const content = (await page.locator(sel).getAttribute("content"))!;
        expect(content).not.toContain(listed.name[locale]);
      }
    });

    test(`landing page metadata and preview image (${locale})`, async ({ page, request }) => {
      const [a, b] = researchedParties();
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

test.describe("privacy of the result", () => {
  /** Every request for a party page (document, RSC payload or prefetch) the page makes from now on. */
  const partyPageRequests = (page: Page) => {
    const urls: string[] = [];
    page.on("request", (r) => {
      if (new URL(r.url()).pathname.includes("/parties/")) urls.push(r.url());
    });
    return urls;
  };

  test("no party page is fetched until a link is clicked", async ({ page }) => {
    const set = await completeCase(page, "en", "joint-list-top");
    const requests = partyPageRequests(page);
    // Every party link on the result is on screen at some point: the cards, the
    // joint-list partners, the breakdown and point links, and the "show all" rows.
    await page.getByTestId("result-entry").nth(1).locator("summary").click();
    await page.getByTestId("show-all").click();
    await page.getByTestId("result-row").first().locator("summary").click();
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo({ top: 0 }));
    for (const link of await page.getByTestId("research-link").all()) await link.hover();
    await page.waitForTimeout(1000);
    expect(requests).toEqual([]);

    // A click fetches the page it leads to, and only that one.
    await page.getByTestId("research-link").first().click();
    await expect(page).toHaveURL(new RegExp(`/en/parties/${set.entries[0]}$`));
    expect(requests.length).toBeGreaterThan(0);
    expect(requests.every((u) => u.includes(`/parties/${set.entries[0]}`))).toBe(true);
  });

  test("the share landing page fetches no party page either", async ({ page }) => {
    const [a, b, c] = researchedParties();
    const requests = partyPageRequests(page);
    await page.goto(`/he/share/${a.id},${b.id},${c.id}`);
    await page.getByTestId("shared-top").hover();
    await page.waitForTimeout(1000);
    expect(requests).toEqual([]);
  });
});
