# Grids check: judea-samaria

- Checked on 2026-10-13 by the Stage 7b checker (not the author of this grid)
- Author: Stage 7b grids author (label not supplied by the orchestrator)
- Pairs checked: 15 · must-fix: 0 · should-fix: 2 · notes: 5
- Result: pass after fixes (2 should-fix open)

## Findings

| # | Pair (a – b) | Author's value | Checker's value | Severity | Finding | Suggested value and reason | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|---|---|
| 1 | two-states-pre-1967-border – one-equal-state | 0.4 | 0.2 | should-fix | Cross-band; both readings arguable. One option is two states by full withdrawal; the other says "instead of two separate states" and "separation has failed". They are opposed on a Palestinian state, the border and the settlements (every settlement evacuated vs everyone staying in one state). What is shared is ending Israeli control over Palestinians without equal rights and the word "just". The grid gives negotiated two states vs one equal state 0.2 on nearly the same description ("give Palestinians full political rights"); the only addition here is the shared appeal to justice, which is not enough to move a band, and the 1967 option is the fuller form of the separation the one-state option rejects. | 0.2: mostly opposed (two states vs one state, the border, the settlements) with a shared element (ending unequal Israeli control, justice as the reason). Same value as negotiated two states vs one equal state. | open |
| 2 | maintain-current-situation – separation-two-states | 0.4 | 0.2 | should-fix | Cross-band; both readings arguable. Opposed on a Palestinian state (none for now vs agreed), on sovereignty (none applied vs the blocs made part of Israel), on evacuating settlements (strengthen them vs evacuate the remote ones), on the army's freedom to act anywhere, and on "any dramatic move is too risky". The shared ground is that most settlers stay, plus a reading of "for now" as not ruling a state out, which is an absence rather than a shared element. At 0.4 the pair sits one step below current situation vs full sovereignty (0.5), which shares strengthening the settlements and no Palestinian state. | 0.2: mostly opposed (Palestinian state, evacuation, sovereignty over the blocs, a dramatic move) with a minor shared element (most settlers stay). | open |
| 3 | full-sovereignty – separation-two-states | 0.2 | 0 | note | Inside the band. Shared: the large blocs become part of Israel. | No change needed. | no change needed |
| 4 | partial-sovereignty-area-c – maintain-current-situation | 0.6 | 0.5 | note | Inside the band. Applying sovereignty is the move the current-situation option explicitly avoids. | No change needed. | no change needed |
| 5 | partial-sovereignty-area-c – two-states-pre-1967-border | 0.2 | 0 | note | Inside the band. Shared: Palestinians govern themselves in some territory. | No change needed. | no change needed |
| 6 | maintain-current-situation – two-states-pre-1967-border | 0.2 | 0 | note | Inside the band. The shared element (no Israeli sovereignty applied) is thin. | No change needed. | no change needed |
| 7 | maintain-current-situation – one-equal-state | 0.2 | 0 | note | Inside the band. The shared element (no division into two states now) is thin; 0 is equally defensible. | No change needed. | no change needed |

## What was verified

1. Coverage: done by script and by eye. 6 options, 15 pairs expected, 15 present; no pair missing or doubled in either order; every ID belongs to the issue.
2. Values: done by script. All are from 0, 0.2, 0.4, 0.5, 0.6, 0.8.
3. Each value against the scale: done. The checker wrote its own 15 values from the option texts before opening the grid, then compared by band. Two cross-band differences (rows 1 and 2); five in-band differences. Full sovereignty vs one equal state at 0.2 and negotiated two states vs one equal state at 0.2 match the checker's values.
4. Not a line: done. One equal state is placed off the sovereignty-to-withdrawal line: 0.2 from full sovereignty, 0 from partial sovereignty, 0.2 from both middle options. The grid is not read off a ranking.
5. Triples: done. No pair is 0.8, so the rule has nothing to apply to.
6. Consistency across issues: done. Compared against the other nine grids by reason pattern: "neither rules the other out" pairs are 0.4 everywhere; "both have the state act directly, differ on target/goal" is 0.6 in cost of living and housing; "both keep X, differ on one element" is 0.6; "shares one major element, differs on another" is 0.5; direct contradiction with no shared element is 0. Status-quo options are valued by their own texts in each issue (here the current-situation option also strengthens the settlements, so it is closer to the sovereignty options than to the two-state ones); no conflict with religion and state or the judicial system.
7. Reasons: done. Each is one line, names what is shared and what differs, fits its value, and names no party, politician or camp.
8. Gaza and Judea and Samaria second read: Done. Elements per option. full-sovereignty: sovereignty over all; settlements expanded; no Palestinian state, Authority dismantled; no border; one state, equal citizenship not stated. partial-sovereignty: sovereignty over about 60% or key areas; settlements kept and annexed; no state, Palestinians run daily affairs in the rest; avoids taking in a large Palestinian population. current-situation: no sovereignty applied; settlements strengthened; no state for now; army acts anywhere; no dramatic move. negotiated two states: sovereignty over the blocs; most settlers stay, remote settlements evacuated; Palestinian state yes; border by land swaps; Jewish majority as the reason. 1967 border: no sovereignty beyond the 1967 line; every settlement evacuated; Palestinian state yes with East Jerusalem as capital; exact 1967 border. one equal state: one state on all the land with an equal vote; no separate Palestinian state; no border; settlements not addressed. All 15 pairs checked against this list; 13 hold and 2 are the should-fix rows above.

## Fixes applied (orchestrator, 2026-10-13)

- two-states-pre-1967-border – one-equal-state: 0.4 → 0.2 (applied).
- maintain-current-situation – separation-two-states: 0.4 → 0.2 (applied).

- Orchestrator (2026-10-13): maintain-current-situation – full-sovereignty changed 0.5 → 0.4, on the finding of the yesh-atid texts checker (`texts-en-yesh-atid.md`, must-fix 1): the pair is two steps apart on a scale where each adjacent step is 0.6, and a party that voted against full sovereignty was being labelled as partly agreeing with it.
