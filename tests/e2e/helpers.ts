import fs from "node:fs";
import path from "node:path";
import { expect, type Locator, type Page, type Request } from "@playwright/test";
import {
  placeholderAnswerSet,
  type PlaceholderAnswerSet,
  type PlaceholderCase,
} from "../fixtures/matching";

export { PLACEHOLDER_CASES, placeholderAnswerSet } from "../fixtures/matching";
export type { PlaceholderAnswerSet, PlaceholderCase } from "../fixtures/matching";

export type AppLocale = "he" | "en";
export const LOCALES = ["he", "en"] as const;

export const CONTENT = path.join(process.cwd(), "content");

export function readJson<T = any>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.join(CONTENT, rel), "utf8"));
}

export const issues = () =>
  fs
    .readdirSync(path.join(CONTENT, "issues"))
    .sort()
    .map((f) => readJson(`issues/${f}`));

export const versions = (): {
  surveyContentVersion: string;
  researchVersion: string;
  matchingVersion: string;
} => readJson("versions.json");

/** The suite runs on the placeholder corpus (see playwright.config.ts). */
const registryDir = () =>
  process.env.CONTENT_CORPUS === "real" ? "registry" : "placeholder/registry";

/** Active-corpus registry: every party, researched and listed. */
export const parties = (): any[] => readJson(`${registryDir()}/parties.json`).parties;
export const lists = (): any[] => readJson(`${registryDir()}/lists.json`).lists;

/** Parties with a research document, which are the ones the matching covers. */
export const researchedParties = () => parties().filter((p) => p.tier === "researched");
/** Parties on the ballot that were not researched: registry facts only, never matched. */
export const listedParties = () => parties().filter((p) => p.tier === "listed");
export const listOf = (partyId: string) => lists().find((l) => l.memberPartyIds.includes(partyId));

// ------------------------------------------------------------------ survey

/** Opens the survey with a fresh session. */
export async function openSurvey(page: Page, locale: AppLocale = "en") {
  await page.goto(`/${locale}/survey`);
  await page.evaluate(() => localStorage.clear());
  await page.goto(`/${locale}/survey`);
  await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
}

export const poolItem = (page: Page, issueId: string) =>
  page.locator(`[data-testid="pool-item"][data-issue-id="${issueId}"]`);

/** Ranks every issue with buttons: marks `skip` as "doesn't matter", adds the rest. */
export async function rankWithButtons(page: Page, skip = 2, tap = false) {
  const press = async (loc: Locator) => (tap ? loc.tap() : loc.click());
  for (let i = 0; i < skip; i++) {
    await press(page.getByTestId("pool-item").first().getByTestId("mark-not-important"));
  }
  while ((await page.getByTestId("pool-item").count()) > 0) {
    await press(page.getByTestId("pool-item").first().getByTestId("add-to-ranking"));
  }
  await expect(page.getByTestId("ranking-continue")).toBeEnabled();
}

/**
 * Ranks exactly the given issues, in the given order, and marks every other
 * issue "doesn't matter". `from` skips the leading issues that are ranked already.
 */
export async function rankIssues(page: Page, ranked: readonly string[], from = 0) {
  for (const [i, id] of ranked.entries()) {
    if (i < from) continue;
    await poolItem(page, id).getByTestId("add-to-ranking").click();
    await expect(page.getByTestId("ranked-item").nth(i)).toHaveAttribute("data-issue-id", id);
  }
  while ((await page.getByTestId("pool-item").count()) > 0) {
    const before = await page.getByTestId("pool-item").count();
    await page.getByTestId("pool-item").first().getByTestId("mark-not-important").click();
    await expect(page.getByTestId("pool-item")).toHaveCount(before - 1);
  }
  await expect(page.getByTestId("ranking-continue")).toBeEnabled();
}

export const answerOption = (page: Page, optionId: string) =>
  page.locator(`[data-testid="answer-option"][data-option-id="${optionId}"]`);

/**
 * From the ranking screen: goes through one answer screen per ranked issue and
 * picks an option on each. `pick` names the option for an issue; without it the
 * first displayed option is picked. Stops on the last screen with its answer
 * given, unless `submit` is set (the default), which sends the survey.
 */
export async function answerIssues(
  page: Page,
  opts: { pick?: (issueId: string) => string; submit?: boolean } = {},
) {
  const { pick, submit = true } = opts;
  const total = await page.getByTestId("ranked-item").count();
  await page.getByTestId("ranking-continue").click();
  for (let i = 0; i < total; i++) {
    await expect(page.getByTestId("survey")).toHaveAttribute("data-step", `answer-${i}`);
    const step = page.getByTestId("answer-step");
    const issueId = (await step.getAttribute("data-issue-id"))!;
    const option = pick
      ? answerOption(page, pick(issueId))
      : step.getByTestId("answer-option").first();
    await option.locator('input[type="radio"]').check();
    await expect(option).toHaveAttribute("data-selected", "true");
    if (i < total - 1) await page.getByTestId("step-next").click();
    else if (submit) await page.getByTestId("submit-survey").click();
  }
}

/** Runs the whole survey (first option everywhere) through to the result. */
export async function completeSurvey(page: Page, locale: AppLocale = "en", skip = 2) {
  await openSurvey(page, locale);
  await rankWithButtons(page, skip);
  await answerIssues(page);
}

/**
 * Answers the survey with one of the placeholder answer sets, by driving the
 * UI, and returns the set with its recorded expected result.
 */
export async function completeCase(
  page: Page,
  locale: AppLocale,
  id: PlaceholderCase,
): Promise<PlaceholderAnswerSet> {
  const set = placeholderAnswerSet(id);
  await openSurvey(page, locale);
  await rankIssues(page, set.ranked);
  await answerIssues(page, { pick: (issueId) => set.answers[issueId] });
  await expect(page.getByTestId("result")).toBeVisible();
  return set;
}

// ------------------------------------------------------------------ result

/** A full result card or a "show all" row, whichever shows this party. */
export const resultEntry = (page: Page, partyId: string) =>
  page.locator(
    `[data-testid="result-entry"][data-party-id="${partyId}"], [data-testid="result-row"][data-party-id="${partyId}"]`,
  );

export const partyIdsOf = (loc: Locator) =>
  loc.evaluateAll((els) => els.map((e) => e.getAttribute("data-party-id")));

// ------------------------------------------------------------------ ballot slip

const siteCopy = (locale: AppLocale) =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), "messages", `${locale}.json`), "utf8"));

/**
 * Checks the one ballot slip inside `scope`: the list's letters, drawn in
 * Hebrew right to left whatever the page language, named once for a screen
 * reader, and (at the normal size) the list's name beneath.
 */
export async function expectBallotSlip(
  scope: Locator,
  locale: AppLocale,
  list: { ballotLetters: string; name: Record<AppLocale, string> },
  size: "normal" | "compact",
) {
  const slip = scope.getByTestId("ballot-slip");
  await expect(slip).toHaveCount(1);
  await expect(slip).toBeVisible();
  await expect(slip).toHaveAttribute("data-letters", list.ballotLetters);
  await expect(slip).toHaveAttribute("data-size", size);
  // One accessible name; the drawn letters themselves are hidden from it.
  const name = siteCopy(locale).Common.ballotLetters.replace("{letters}", list.ballotLetters);
  const named = slip.getByRole("img", { name, exact: true });
  await expect(named).toHaveCount(1);
  const drawn = named.locator("[aria-hidden='true']");
  await expect(drawn).toHaveText(list.ballotLetters);
  await expect(drawn).toHaveAttribute("lang", "he");
  await expect(drawn).toHaveAttribute("dir", "rtl");
  await expect(drawn).toHaveCSS("direction", "rtl");
  // Paper: white with black type, whatever the page's theme.
  await expect(slip).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(slip).toHaveCSS("color", "rgb(0, 0, 0)");
  // The letters fit on the paper.
  expect(
    await slip.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    "letters fit the slip",
  ).toBe(true);
  const listName = slip.getByTestId("ballot-slip-name");
  if (size === "normal") await expect(listName).toHaveText(list.name[locale]);
  else await expect(listName).toHaveCount(0);
}

// ------------------------------------------------------------------ requests

export const MATCHING_BUNDLE_URL = /\/api\/matching\//;
export const isTallyRequest = (r: Request) => new URL(r.url()).pathname === "/api/tally";

/** Collects the bodies of every tally call the page makes from now on. */
export function recordTally(page: Page): { calls: any[] } {
  const record = { calls: [] as any[] };
  page.on("request", (r) => {
    if (isTallyRequest(r)) record.calls.push({ method: r.method(), body: r.postDataJSON() });
  });
  return record;
}

// ------------------------------------------------------------------ clock

/** Sets the non-production clock override for this browser context. */
export async function setClock(page: Page, iso: string) {
  await page
    .context()
    .addCookies([{ name: "clock-override", value: encodeURIComponent(iso), url: baseUrl() }]);
}

/** Makes an open page re-check the time-based modes now (it otherwise does so every 15 seconds). */
export async function recheckClock(page: Page) {
  await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
}

export function baseUrl() {
  return process.env.E2E_BASE_URL ?? `http://localhost:${process.env.E2E_PORT ?? 3100}`;
}

export const BEFORE_BLACKOUT = "2026-10-20T12:00:00Z";
export const IN_BLACKOUT = "2026-10-24T12:00:00Z";
export const AFTER_CLOSE = "2026-10-28T12:00:00Z";
