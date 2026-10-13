import { expect, test } from "@playwright/test";
import {
  answerIssues,
  completeCase,
  isTallyRequest,
  listedParties,
  openSurvey,
  partyIdsOf,
  placeholderAnswerSet,
  poolItem,
  rankIssues,
  rankWithButtons,
  recordTally,
  researchedParties,
} from "./helpers";

/** Long enough for a fire-and-forget call to have left the page, had one been made. */
const SETTLE_MS = 500;

test.describe("anonymous counts sent by the survey", () => {
  test("nothing on opening; 'started' once at the first ranking change; 'result' once with the top four", async ({
    page,
  }) => {
    const tally = recordTally(page);
    const set = placeholderAnswerSet("below-threshold-top");

    // Opening the survey (or the intro, or a research page) counts nothing.
    await page.goto("/en");
    await page.goto(`/en/parties/${researchedParties()[0].id}`);
    await openSurvey(page, "en");
    await page.waitForTimeout(SETTLE_MS);
    expect(tally.calls).toEqual([]);

    // The first ranking change reports the survey as started, with nothing else in the body.
    const [first] = await Promise.all([
      page.waitForResponse((r) => isTallyRequest(r.request())),
      poolItem(page, set.ranked[0]).getByTestId("add-to-ranking").click(),
    ]);
    expect(first.status()).toBe(204);
    expect(tally.calls).toEqual([{ method: "POST", body: { kind: "started" } }]);

    // Further changes, a reload and more changes after it report nothing more.
    await page.getByTestId("ranked-item").first().getByTestId("remove-from-ranking").click();
    await expect(page.getByTestId("ranked-item")).toHaveCount(0);
    await poolItem(page, set.ranked[0]).getByTestId("add-to-ranking").click();
    await expect(page.getByTestId("ranked-item")).toHaveCount(1);
    await page.reload();
    await expect(page.getByTestId("ranked-item")).toHaveCount(1);
    await rankIssues(page, set.ranked, 1);
    await page.reload();
    await expect(page.getByTestId("ranked-item")).toHaveCount(set.ranked.length);
    await page.getByTestId("ranked-item").nth(1).getByTestId("move-up").click();
    await page.getByTestId("ranked-item").nth(1).getByTestId("move-up").click();
    await page.waitForTimeout(SETTLE_MS);
    expect(tally.calls).toHaveLength(1);

    // Answering reports nothing; the result reports its top four party IDs, once.
    await answerIssues(page, { pick: (issueId) => set.answers[issueId], submit: false });
    await page.waitForTimeout(SETTLE_MS);
    expect(tally.calls).toHaveLength(1);
    const [second] = await Promise.all([
      page.waitForResponse((r) => isTallyRequest(r.request())),
      page.getByTestId("submit-survey").click(),
    ]);
    expect(second.status()).toBe(204);
    await expect(page.getByTestId("result")).toBeVisible();
    const shown = await partyIdsOf(page.getByTestId("result-entry"));
    expect(shown.slice(0, 4)).toEqual(set.entries.slice(0, 4));
    expect(tally.calls[1]).toEqual({
      method: "POST",
      body: { kind: "result", parties: set.entries.slice(0, 4) },
    });

    // Looking around the result reports nothing more.
    await page.getByTestId("show-all").click();
    await page.getByTestId("result-entry").nth(1).locator("summary").click();
    await page.waitForTimeout(SETTLE_MS);
    expect(tally.calls).toHaveLength(2);
  });

  test("marking an issue 'doesn't matter' first also counts as the start", async ({ page }) => {
    const tally = recordTally(page);
    await openSurvey(page, "he");
    await page.getByTestId("pool-item").first().getByTestId("mark-not-important").click();
    await expect.poll(() => tally.calls).toEqual([{ method: "POST", body: { kind: "started" } }]);
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
    await page.waitForTimeout(SETTLE_MS);
    expect(tally.calls).toHaveLength(1);
  });

  test("a survey begun after a result is a new survey, counted again", async ({ page }) => {
    const tally = recordTally(page);
    await completeCase(page, "en", "joint-list-top");
    await expect.poll(() => tally.calls.map((c) => c.body.kind)).toEqual(["started", "result"]);
    await page.reload();
    await expect(page.getByTestId("survey")).toHaveAttribute("data-step", "ranking");
    await page.waitForTimeout(SETTLE_MS);
    expect(tally.calls).toHaveLength(2);
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
    await expect
      .poll(() => tally.calls.map((c) => c.body.kind))
      .toEqual(["started", "result", "started"]);
  });

  test("undoing the first ranking change and reloading does not count the survey twice", async ({
    page,
  }) => {
    const tally = recordTally(page);
    await openSurvey(page, "en");
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
    await page.getByTestId("ranked-item").first().getByTestId("remove-from-ranking").click();
    await expect(page.getByTestId("ranked-item")).toHaveCount(0);
    await page.reload();
    await expect(page.getByTestId("pool-item")).toHaveCount(10);
    await page.getByTestId("pool-item").first().getByTestId("add-to-ranking").click();
    await page.waitForTimeout(SETTLE_MS);
    expect(tally.calls).toEqual([{ method: "POST", body: { kind: "started" } }]);
  });

  test("a failed or rejected count changes nothing the user sees", async ({ page }) => {
    let calls = 0;
    await page.route("**/api/tally", (route) => {
      calls++;
      return calls === 1 ? route.abort("failed") : route.fulfill({ status: 503, body: "" });
    });
    await openSurvey(page, "en");
    await rankWithButtons(page, 5);
    await answerIssues(page);
    await expect(page.getByTestId("result")).toBeVisible();
    await expect(page.getByTestId("result-entry")).toHaveCount(5);
    await expect(page.getByTestId("result-error")).toHaveCount(0);
    await expect.poll(() => calls).toBe(2);
  });
});

test.describe("POST /api/tally", () => {
  const ids = () => researchedParties().map((p) => p.id as string);

  test("accepts the two kinds of call with no content in return", async ({ request }) => {
    const calls = [
      { kind: "started" },
      { kind: "result", parties: ids().slice(0, 3) },
      { kind: "result", parties: ids().slice(0, 4) },
      { kind: "result", parties: ids().slice(2, 6).reverse() },
    ];
    for (const data of calls) {
      const res = await request.post("/api/tally", { data });
      expect(res.status(), JSON.stringify(data)).toBe(204);
      expect(await res.text()).toBe("");
      expect(res.headers()["cache-control"]).toContain("no-store");
    }
  });

  test("rejects everything else", async ({ request }) => {
    const [a, b, c, d, e] = ids();
    const listed = listedParties()[0].id as string;
    const bad: [string, unknown][] = [
      ["empty object", {}],
      ["unknown kind", { kind: "finished" }],
      ["an array", [{ kind: "started" }]],
      ["a string", "started"],
      ["extra field on started", { kind: "started", parties: [a, b, c] }],
      ["extra field on result", { kind: "result", parties: [a, b, c], locale: "he" }],
      ["answers smuggled in", { kind: "result", parties: [a, b, c], answers: { gaza: "x" } }],
      ["no parties", { kind: "result" }],
      ["two parties", { kind: "result", parties: [a, b] }],
      ["five parties", { kind: "result", parties: [a, b, c, d, e] }],
      ["a repeated party", { kind: "result", parties: [a, b, a] }],
      ["a listed party", { kind: "result", parties: [a, b, listed] }],
      ["a listed party on top", { kind: "result", parties: [listed, a, b, c] }],
      ["an unknown party", { kind: "result", parties: [a, b, "does-not-exist"] }],
      ["parties that aren't strings", { kind: "result", parties: [1, 2, 3] }],
      ["parties as a string", { kind: "result", parties: `${a},${b},${c}` }],
    ];
    for (const [label, data] of bad) {
      const res = await request.post("/api/tally", { data });
      expect(res.status(), label).toBe(400);
      expect(await res.text(), label).toBe("");
    }
    const notJson = await request.post("/api/tally", {
      headers: { "content-type": "application/json" },
      data: "{not json",
    });
    expect(notJson.status()).toBe(400);
    const empty = await request.post("/api/tally");
    expect(empty.status()).toBe(400);
  });

  test("rejects an oversized body", async ({ request }) => {
    const res = await request.post("/api/tally", {
      data: { kind: "started", padding: "x".repeat(2000) },
    });
    expect(res.status()).toBe(413);
  });

  test("answers only POST", async ({ request }) => {
    expect((await request.get("/api/tally")).status()).toBe(405);
  });
});
