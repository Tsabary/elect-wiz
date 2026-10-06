# Accessibility pass: ranking and answering (Task 2.10)

Date: 2026-10-06. Build: production build against the mock (`APP_ENV=test`), Chromium, Hebrew and English, desktop (1280 px) and mobile (Pixel 7).

## Automated checks

`tests/e2e/a11y.spec.ts` runs axe-core (WCAG 2.0/2.1/2.2 A and AA rules) on: intro, How this works, Privacy & Terms, Parties index, a research page, the share landing page, every survey step (ranking, the "more info" dialog, an answer screen with an edited option, "anything else"), the result (with a runner-up breakdown expanded) and an error state. Both languages, both viewports. It fails on any **serious** or **critical** violation. Current result: none.

## Manual keyboard-only pass

Walked through the whole survey with the keyboard only (Tab / Shift+Tab / Enter / Space / arrows / Escape).

| Area | Check | Result |
|---|---|---|
| Skip link | First Tab focuses "Skip to content"; Enter moves to `#main` | OK (covered by an e2e test) |
| Ranking: add | "Add" buttons reachable by Tab; after adding, focus moves to the next pool item's "Add", so repeated Enter ranks issues in sequence | OK (e2e test) |
| Ranking: reorder | Up/down buttons; focus stays on the moved item's button (switches to the other arrow at the list edge, where the pressed one becomes disabled) | OK (e2e test) |
| Ranking: keyboard drag | Drag handle: Space picks up, arrows move, Space drops, Escape cancels; instructions and live announcements are localized | OK (e2e test) |
| Ranking: "doesn't matter" | Limit message is a `role="alert"`; "Put back" focusable | OK |
| More info | Opens a modal dialog; focus is trapped; Escape closes and returns focus to the trigger | OK |
| Step changes | Focus moves to the new screen's `<h1>` and the page scrolls to the top | OK (e2e test) |
| Answers | Native radio group: Space selects, arrows move between positions; each position's text area is editable directly; typing selects that position | OK (e2e test) |
| Disabled "Next"/"Continue" | Hint text explains why, linked with `aria-describedby` | OK |
| Result | Headings per party, links to research anchors, `<details>` breakdown for runners-up operable with Enter/Space | OK |

## Screen-reader pass (accessibility tree)

No physical screen reader was available in this environment. The pass was done by reviewing the computed accessibility tree (Playwright `ariaSnapshot`) of the ranking and answer screens in Hebrew and English, and the live-region output during button and keyboard-drag actions. **A real VoiceOver (iOS) / TalkBack or NVDA spot check by the owner before launch is still recommended.**

## Findings and fixes

| # | Finding | Fix |
|---|---|---|
| 1 | Muted text (`--muted-foreground`) failed 4.5:1 contrast on the muted background (preview banner, hints, card descriptions). | Darkened the token from `oklch(0.556)` to `oklch(0.47)`. |
| 2 | "See this in the research" links in the result breakdown were smaller than the 24 px target size. | Gave them a minimum 32 px hit area. |
| 3 | Repeated "See this in the research" links had identical accessible names. | Added `aria-label` naming the issue. |
| 4 | Several Hebrew `aria-label`s didn't contain the visible label text (WCAG 2.5.3 Label in Name), e.g. visible "הוספה" vs label "הוספת …". Same for English "Put back". | Reworded the labels so they start with the visible text ("הוספה לדירוג: …", "Put back … "). |
| 5 | Radio buttons on the answer screen were announced only as "Position 1/2/3", without the position's text. | Each radio is now described by the current (possibly edited) text of its position. |
| 6 | dnd-kit's default role description ("sortable") and corner "Close" text in the dialog were hard-coded English. | Localized via message files; the dialog close label is now passed in by the caller. |
| 7 | Smooth scrolling interfered with step-change focus and scroll position. | Step changes scroll instantly; smooth scrolling only applies to in-page anchor links and respects `prefers-reduced-motion`. |

All findings above are resolved. The automated suite passes after the fixes.
