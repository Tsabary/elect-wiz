/**
 * The browser side of the anonymous counts: fire-and-forget calls. Nothing
 * waits for them and a failed call changes nothing the user sees. They carry no
 * answers: a "result" call names only the result's top parties, a "shared" call
 * only whether the shared link held answers.
 */
import {
  TALLY_MAX_ISSUES,
  TALLY_MAX_PARTIES,
  TALLY_MIN_ISSUES,
  TALLY_MIN_PARTIES,
  TALLY_PATH,
  type TallyCall,
} from "./counter";

export function sendTally(call: TallyCall, fetchImpl: typeof fetch = fetch): void {
  try {
    void fetchImpl(TALLY_PATH, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(call),
      // Lets the call finish even if the user leaves the page right away.
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* counting is best-effort */
  }
}

/** Sent once when a new survey begins (not when a saved one is resumed). */
export function tallySurveyStarted(fetchImpl?: typeof fetch): void {
  sendTally({ kind: "started" }, fetchImpl);
}

/**
 * Sent once per result shown, with the result's party IDs in order (only the top
 * few go out) and the ranked issue IDs, most important first. Never the positions.
 */
export function tallyResult(
  partyIds: readonly string[],
  rankedIssueIds: readonly string[] = [],
  fetchImpl?: typeof fetch,
): void {
  const parties = partyIds.slice(0, TALLY_MAX_PARTIES);
  if (parties.length < TALLY_MIN_PARTIES) return;
  const issues = rankedIssueIds.slice(0, TALLY_MAX_ISSUES);
  sendTally(
    issues.length >= TALLY_MIN_ISSUES
      ? { kind: "result", parties, issues }
      : { kind: "result", parties },
    fetchImpl,
  );
}

/** Sent once per completed share (share sheet finished or link copied), never when cancelled. */
export function tallyShared(withAnswers: boolean, fetchImpl?: typeof fetch): void {
  sendTally({ kind: "shared", withAnswers }, fetchImpl);
}
