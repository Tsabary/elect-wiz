# Grids check: cost-of-living

- Checked on 2026-10-13 by the Stage 7b checker (not the author of this grid)
- Author: Stage 7b grids author (label not supplied by the orchestrator)
- Pairs checked: 6 · must-fix: 0 · should-fix: 0 · notes: 1
- Result: pass

## Findings

| # | Pair (a – b) | Author's value | Checker's value | Severity | Finding | Suggested value and reason | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|---|---|
| 1 | active-state-regulation – direct-support-for-households | 0.6 | 0.5 | note | Inside the band. The checker read supervising prices and helping households as two major elements, one shared (the state acts) and one not. | No change needed. 0.6 matches the same description in housing (state-led rental vs help for buyers). | no change needed |

## What was verified

1. Coverage: done by script and by eye. 4 options, 6 pairs expected, 6 present; no pair missing or doubled in either order; every ID belongs to the issue.
2. Values: done by script. All are from 0, 0.2, 0.4, 0.5, 0.6, 0.8.
3. Each value against the scale: done. The checker wrote its own 6 values from the option texts before opening the grid, then compared by band. No cross-band difference; one in-band difference.
4. Not a line: done. The two "less state" options and the two "more state" options are each 0.6, but open market vs regulation (0.4) is closer than tax cuts vs household support (0.2) and tax cuts vs regulation (0), which a single ranking would not give.
5. Triples: done. No pair is 0.8, so the rule has nothing to apply to.
6. Consistency across issues: done. Compared against the other nine grids by reason pattern: "neither rules the other out" pairs are 0.4 everywhere; "both have the state act directly, differ on target/goal" is 0.6 in cost of living and housing; "both keep X, differ on one element" is 0.6; "shares one major element, differs on another" is 0.5; direct contradiction with no shared element is 0. The 0.4 for open market vs household support, 0.2 for tax cuts vs household support and 0 for tax cuts vs regulation follow from the texts: the first pair has no stated conflict, the second conflicts on government spending, the third on the size and role of the state.
7. Reasons: done. Each is one line, names what is shared and what differs, fits its value, and names no party, politician or camp.
8. Gaza and Judea and Samaria second read: Not applicable to this issue.
