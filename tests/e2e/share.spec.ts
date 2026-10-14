import { expect, test, type Page } from "@playwright/test";
import { encodeAnswers } from "@/lib/share/answers";
import {
  AFTER_CLOSE,
  completeCase,
  IN_BLACKOUT,
  issues,
  isTallyRequest,
  LOCALES,
  placeholderAnswerSet,
  researchedParties,
  setClock,
  versions,
  type AppLocale,
} from "./helpers";

/** The `#a=…` value for a placeholder answer set, as the result's second share button writes it. */
const answersOf = (set: { ranked: string[]; answers: Record<string, string> }) =>
  encodeAnswers(set, {
    surveyContentVersion: versions().surveyContentVersion,
    issues: issues(),
  })!;

const nameOf = (id: string, locale: AppLocale) =>
  researchedParties().find((p) => p.id === id)!.name[locale];

const restHrefs = (page: Page) =>
  page
    .getByTestId("shared-rest")
    .locator("a")
    .evaluateAll((els) => els.map((e) => e.getAttribute("href")));

/** Every request for a party page or the tally the page makes from now on. */
function watchRequests(page: Page) {
  const urls: string[] = [];
  page.on("request", (r) => {
    if (new URL(r.url()).pathname.includes("/parties/") || isTallyRequest(r)) urls.push(r.url());
  });
  return urls;
}

test.describe("sharing with answers", () => {
  test("the result offers both links; the one with answers opens elsewhere with the same result and the answers", async ({
    page,
    context,
    browser,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      "the native share sheet can't be driven in tests; copy-link is tested on desktop",
    );
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const set = await completeCase(page, "en", "below-threshold-top");
    const ids = set.entries.slice(0, 4);
    const share = page.getByTestId("share");
    await expect(share.getByTestId("share-answers-note")).toBeVisible();

    // Without answers: exactly as before.
    await share.getByTestId("share-button").click();
    await expect(page.getByTestId("share-status")).not.toBeEmpty();
    const plain = new URL((await page.getByTestId("share-url-value").textContent())!);
    expect(plain.pathname).toBe(`/en/share/${ids.join(",")}`);
    expect(plain.search + plain.hash).toBe("");

    // With answers: the same address plus the answers in the fragment.
    await share.getByTestId("share-answers-button").click();
    await expect(page.getByTestId("share-url-value")).not.toHaveText(plain.toString());
    const withAnswers = new URL((await page.getByTestId("share-url-value").textContent())!);
    expect(withAnswers.pathname).toBe(plain.pathname);
    expect(withAnswers.search).toBe("");
    expect(withAnswers.hash).toBe(`#a=${answersOf(set)}`);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(withAnswers.toString());

    // Opened in a fresh browser with nothing saved.
    const other = await browser.newContext();
    const recipient = await other.newPage();
    const requests = watchRequests(recipient);
    await recipient.goto(withAnswers.toString());
    await expect(recipient.getByTestId("shared-with-answers")).toBeVisible();
    await expect(recipient.getByTestId("shared-top")).toHaveAttribute(
      "href",
      `/en/parties/${ids[0]}`,
    );
    await expect(recipient.getByTestId("shared-top")).toHaveText(nameOf(ids[0], "en"));
    expect(await restHrefs(recipient)).toEqual(ids.slice(1).map((id) => `/en/parties/${id}`));
    const answers = recipient.getByTestId("shared-answer");
    expect(await answers.evaluateAll((els) => els.map((e) => e.dataset.issueId))).toEqual(
      set.ranked,
    );
    expect(await answers.evaluateAll((els) => els.map((e) => e.dataset.optionId))).toEqual(
      set.ranked.map((id) => set.answers[id]),
    );
    const first = issues().find((i) => i.id === set.ranked[0]);
    await expect(answers.first()).toContainText(first.en.title);
    await expect(answers.first()).toContainText(
      first.options.find((o: any) => o.id === set.answers[set.ranked[0]]).en,
    );
    // No per-party breakdown, the invitation stays.
    await expect(recipient.getByTestId("breakdown")).toHaveCount(0);
    await expect(recipient.getByTestId("start-survey")).toBeVisible();
    await expect(recipient).toHaveURL(withAnswers.toString());

    // The page's metadata and preview image are the plain link's.
    const meta = (p: Page) =>
      p.evaluate(() =>
        [...document.querySelectorAll("head title, head meta")].map((e) => e.outerHTML).join("\n"),
      );
    const plainPage = await other.newPage();
    await plainPage.goto(plain.toString());
    await expect(plainPage.getByTestId("shared-note")).toBeVisible();
    expect(await meta(recipient)).toBe(await meta(plainPage));
    expect(await meta(recipient)).not.toContain(first.en.title);

    // Viewing a shared link counts nothing and fetches no party page.
    await recipient.getByTestId("shared-top").hover();
    await recipient.waitForTimeout(500);
    expect(requests).toEqual([]);
    await other.close();
  });

  for (const locale of LOCALES) {
    test(`the parties are worked out from the answers, whatever the address says (${locale})`, async ({
      page,
    }) => {
      const set = placeholderAnswerSet("limited-information-top");
      const ids = set.entries.slice(0, 4);
      const [wrong] = researchedParties().filter((p) => p.id !== ids[0]);
      const requests = watchRequests(page);
      await page.goto(`/${locale}/share/${wrong.id}#a=${answersOf(set)}`);
      await expect(page.getByTestId("shared-with-answers")).toBeVisible();
      await expect(page.getByTestId("shared-top")).toHaveText(nameOf(ids[0], locale));
      expect(await restHrefs(page)).toEqual(ids.slice(1).map((id) => `/${locale}/parties/${id}`));
      // The address is corrected to match, answers kept.
      await expect(page).toHaveURL(
        new RegExp(`/${locale}/share/${ids.join(",")}#a=${answersOf(set)}$`),
      );
      await expect(page.getByTestId("shared-answer")).toHaveCount(set.ranked.length);
      await expect(page.getByTestId("shared-answer").first()).toContainText(
        issues().find((i) => i.id === set.ranked[0])[locale].title,
      );
      expect(requests).toEqual([]);
    });

    test(`switching language keeps the shared answers (${locale})`, async ({ page }) => {
      const set = placeholderAnswerSet("joint-list-top");
      const ids = set.entries.slice(0, 4);
      const other = locale === "he" ? "en" : "he";
      await page.goto(`/${locale}/share/${ids.join(",")}#a=${answersOf(set)}`);
      await expect(page.getByTestId("shared-answer")).toHaveCount(set.ranked.length);
      await page.getByTestId("language-switch").click();
      await expect(page).toHaveURL(new RegExp(`/${other}/share/[^#]+#a=${answersOf(set)}$`));
      await expect(page.getByTestId("shared-answer")).toHaveCount(set.ranked.length);
    });

    test(`a link whose answers can't be read shows the plain result with a note (${locale})`, async ({
      page,
    }) => {
      const set = placeholderAnswerSet("joint-list-top");
      const valid = answersOf(set);
      const [a, b] = researchedParties();
      const errors: Error[] = [];
      page.on("pageerror", (e) => errors.push(e));
      for (const value of [
        "garbage",
        valid.replace(/^1-[0-9a-z]{4}/, "1-zzzz"), // other survey content
        valid.slice(0, 2 * 4 + 7), // four issues: fewer than the minimum
        `${valid}${valid.slice(7, 9)}`, // a repeated issue
        `${valid.slice(0, -1)}z`, // an unknown option
        `${valid}%3Cscript%3E`,
      ]) {
        await page.goto(`/${locale}/share/${a.id},${b.id}#a=${value}`);
        await expect(page.getByTestId("shared-answers-unavailable"), value).toBeVisible();
        await expect(page.getByTestId("shared-top")).toHaveText(a.name[locale]);
        await expect(page.getByTestId("shared-answer")).toHaveCount(0);
        await expect(page).toHaveURL(new RegExp(`/${locale}/share/${a.id},${b.id}#`));
        // A fresh document for the next value: a fragment change alone doesn't reload.
        await page.goto("about:blank");
      }
      expect(errors).toEqual([]);
    });
  }

  test("a link with answers follows the poll blackout and the election-over rules", async ({
    page,
  }) => {
    const set = placeholderAnswerSet("joint-list-top");
    const path = `/he/share/${set.entries.slice(0, 4).join(",")}#a=${answersOf(set)}`;

    await setClock(page, IN_BLACKOUT);
    await page.goto(path);
    await expect(page.getByTestId("shared-with-answers")).toBeVisible();
    await expect(page.locator("[data-testid*='poll']")).toHaveCount(0);
    await expect(page.getByTestId("start-survey")).toBeVisible();

    await setClock(page, AFTER_CLOSE);
    await page.goto("about:blank");
    await page.goto(path);
    await expect(page.getByTestId("shared-with-answers")).toBeVisible();
    await expect(page.getByTestId("election-over")).toBeVisible();
    await expect(page.getByTestId("start-survey")).toHaveCount(0);
  });
});
