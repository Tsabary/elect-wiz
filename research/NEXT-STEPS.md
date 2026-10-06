# Next steps (paused 2026-10-06)

Work was paused by the owner. Nothing is running.

## Where things stand
- Phases 1 and 2 are done, audited and committed.
- Task 1.5 (the 10 issues) is approved and locked: `surveyContentVersion` = `2026-10-06.1`. The final text is in `content/issues/`, and the approved English is in `research/review/issues-final-approved-en.md`.
- The issue-locking work is saved in a WIP commit. Steps 1–2 below were done on 2026-10-06; those changes are in the working tree, not committed.

## To resume
1. ~~Run `npm run lint`, `npm run test`, `npm run build` and `npm run test:e2e`, and fix any failures. The last changes allowed 3–6 options per issue, updated Hebrew wording, and changed `lib/content/schemas.ts`, its tests and `tests/e2e/survey.spec.ts`.~~ **Done 2026-10-06.** Lint, unit (183), build and e2e (220 passed, 6 skipped) all pass. The only failure was `tests/e2e/time-modes.spec.ts`: the blackout test asserted no "%" anywhere on party pages, and the approved Judea and Samaria text "Area C, about 60%" broke it. The test now removes issue option text before the check. The 5–6 option answer step was checked on mobile: no overflow, and the e2e test covers it.
2. ~~Confirm the parity-check Hebrew fixes were applied (list in the orchestrator's message; e.g. "ולא על ידי צד אחד", "מנהלה פלסטינית", "ההיפרדות נכשלה").~~ **Done 2026-10-06.** All fixes were present except two. October 7 moreInfo "עדיין לא הוקמה אף ועדה כזו." is applied. The Gaza moreInfo parity fix "מחזיקה מעמד הפסקת אש" ("has held") was applied and then reverted after audit, because it undid fact-check correction R1 (the English says "has been in place" because strikes continue). The Hebrew is back to "מאז אוקטובר 2025 נמצאת בתוקף הפסקת אש". `surveyContentVersion` stays `2026-10-06.1`.
3. ✅ Done: audited (pass after one Hebrew fix), re-audited, and committed as `824284b`.
4. ~~Owner: answer the 4 low-severity wording questions at the top of `research/review/issues-review.md`.~~ **Done 2026-10-06.** Applied in `content/issues/` (EN and HE), `content/glossary.json`, `issues-final-approved-en.md`, `issues-review.md` and `issues-fact-check.md` (C3): "Haredi (ultra-Orthodox)" kept as an approved one-time gloss; "most never served"; the government's stated reason added to the October 7 more info; Hezbollah is "the Iran-backed terror organization in Lebanon". `surveyContentVersion` stays `2026-10-06.1`. Lint, unit, build and e2e pass.
5. **Only when the owner says go:** Phase 3, research of all 52 parties (long job).
