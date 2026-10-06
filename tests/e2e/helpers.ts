import fs from "node:fs";
import path from "node:path";
import { expect, type Page } from "@playwright/test";

export const CONTENT = path.join(process.cwd(), "content");

export function readJson<T = any>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.join(CONTENT, rel), "utf8"));
}

export const issues = () =>
  fs
    .readdirSync(path.join(CONTENT, "issues"))
    .sort()
    .map((f) => readJson(`issues/${f}`));

/** Active-corpus registry (placeholder until Task 4.1). */
export const parties = (): any[] => {
  const corpus = process.env.CONTENT_CORPUS === "real" ? "registry" : "placeholder/registry";
  return readJson(`${corpus}/parties.json`).parties;
};
export const lists = (): any[] => {
  const corpus = process.env.CONTENT_CORPUS === "real" ? "registry" : "placeholder/registry";
  return readJson(`${corpus}/lists.json`).lists;
};

/** Opens the survey with a fresh session. */
export async function openSurvey(page: Page, locale: "he" | "en" = "en", query = "") {
  await page.goto(`/${locale}/survey${query}`);
  await page.evaluate(() => localStorage.clear());
  await page.goto(`/${locale}/survey${query}`);
  await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
}

/** Ranks every issue with buttons: marks `skip` as "doesn't matter", adds the rest. */
export async function rankWithButtons(page: Page, skip = 2, tap = false) {
  const press = async (loc: ReturnType<Page["locator"]>) => (tap ? loc.tap() : loc.click());
  for (let i = 0; i < skip; i++) {
    await press(page.getByTestId("pool-item").first().getByTestId("mark-not-important"));
  }
  while ((await page.getByTestId("pool-item").count()) > 0) {
    await press(page.getByTestId("pool-item").first().getByTestId("add-to-ranking"));
  }
  await expect(page.getByTestId("ranking-continue")).toBeEnabled();
}

/** Answers every issue with its first displayed option and goes to "anything else". */
export async function answerAll(page: Page) {
  await page.getByTestId("ranking-continue").click();
  for (;;) {
    const step = page.getByTestId("answer-step");
    await expect(step).toBeVisible();
    await step.getByTestId("answer-option").first().locator('input[type="radio"]').check();
    await page.getByTestId("step-next").click();
    if (await page.getByTestId("anything-else-step").isVisible()) break;
  }
}

/** Runs the whole survey through to the result. */
export async function completeSurvey(page: Page, locale: "he" | "en" = "en", query = "") {
  await openSurvey(page, locale, query);
  await rankWithButtons(page);
  await answerAll(page);
  await page.getByTestId("submit-survey").click();
}

/** A valid matching request built from the content files. */
export function validMatchRequest(locale: "he" | "en" = "he") {
  const all = issues();
  const versions = readJson("versions.json");
  const ranked = all.slice(0, 6);
  return {
    locale,
    surveyContentVersion: versions.surveyContentVersion as string,
    ranked: ranked.map((i: any) => i.id),
    notImportant: all.slice(6).map((i: any) => i.id),
    answers: ranked.map((i: any) => ({
      issueId: i.id,
      text: i.options[0][locale],
      startingOptionId: i.options[0].id,
      edited: false,
    })),
    anythingElse: null,
    token: null,
  };
}

/** Sets the non-production clock override for this browser context. */
export async function setClock(page: Page, iso: string) {
  await page
    .context()
    .addCookies([{ name: "clock-override", value: encodeURIComponent(iso), url: baseUrl() }]);
}

export function baseUrl() {
  return process.env.E2E_BASE_URL ?? `http://localhost:${process.env.E2E_PORT ?? 3100}`;
}

export const BEFORE_BLACKOUT = "2026-10-20T12:00:00Z";
export const IN_BLACKOUT = "2026-10-24T12:00:00Z";
export const AFTER_CLOSE = "2026-10-28T12:00:00Z";
