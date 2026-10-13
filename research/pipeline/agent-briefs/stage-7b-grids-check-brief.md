# Stage 7b agent brief (option-distance grids, checker)

The orchestrator gives the grids checker this brief plus the issue IDs. Replace `{{ISSUES}}`. **The checker must be a different agent from the grids author.** Use Opus. Start this agent in a fresh session that has not read any party research or positions file.

---

You are the Stage 7b grids checker for this repository: an Israeli election party-matcher (Task 3.2 in `tasks-deterministic-matching.md`). You did NOT write the grids you are checking; a different agent did. If you did write them, stop and tell the orchestrator.

YOUR ISSUES: {{ISSUES}}

## What this is for

The site matches voters to parties by fixed rules. For each issue, a grid records how close each option is to each other option; the same grid is used for every party. The values are public and decide how parties score, and the owner does not review them: your check is the review. A value is right when it can be defended from the wording of the two options alone.

## Read, and what you must not read

- `content/issues/<issueId>.json` for each of your issues: option IDs and texts, description and question.
- `content/glossary.json`.
- `content/matching/distances/<issueId>.json`: the grids under check, **after** you have formed your own values (see below).

Like the author, you must NOT read `content/matching/positions/`, anything in `content/research/`, or any review log about parties, and you must not consider which party holds which option. Nothing from memory about how these positions sit in Israeli politics.

## The format each grid must have

```json
{ "issueId": "gaza",
  "pairs": [ { "a": "<optionId>", "b": "<optionId>", "closeness": 0.4, "reason": "one line" } ] }
```

Every unordered pair of that issue's options exactly once; the pair of an option with itself is implied to be 1 and is not listed. 3 options give 3 pairs, 4 give 6, 5 give 10, 6 give 15. `closeness` is from 0 (opposite) to 1 (the same position).

## The scale the author had to use

The meaning of closeness: "how satisfied would a voter who chose A be with a party that holds B?" Only these six values:

| Value | Meaning |
|---|---|
| 0.8 | Same direction; differs in degree or pace |
| 0.6 | Same broad direction; differs on one significant element |
| 0.5 | Shares one major element and differs on another major element |
| 0.4 | Some real common ground, but the main thrust differs |
| 0.2 | Mostly opposed, with a minor shared element |
| 0 | Opposite |

One value per pair; where the two directions differ, the lower one. Options are not assumed to lie on one line: each is compared element by element (what it would do, who is in control afterwards, what it rules out, its stated reason).

## What you verify

**Judge first, compare second.** For each issue, read the option texts and write down your own value for every pair, from the scale, before you open the author's file. Then compare.

1. **Coverage:** every pair once; none missing; none listed twice in either order; every option ID belongs to the issue.
2. **Values:** only 0, 0.2, 0.4, 0.5, 0.6 or 0.8.
3. **Each value against the scale:** compare with your own. Treat the values as three bands: 0.8; 0.4–0.6; 0–0.2. A difference inside a band is a note. A difference across bands is a finding: re-read both texts, decide which value the scale supports, and say why.
4. **Not a line:** no sign that the options were ranked end to end and the distances read off the ranking.
5. **Triples:** where A–B and B–C are both 0.8, A–C is not 0 or 0.2.
6. **Consistency across issues:** pairs described the same way have the same value.
7. **Reasons:** each is one line, names shared and differing elements, matches its value, and mentions no party, politician or camp.
8. **Gaza and Judea and Samaria: a second full read.** For each of their options, list the elements (Gaza: return to war, who holds security, withdrawal, rebuilding communities and emigration, who governs, a Palestinian state; Judea and Samaria: sovereignty and its extent, the settlements, a Palestinian state, the border, one state with equal citizenship), and check every pair against that list.

## How to report

Write one log per issue to `research/review/matching/grids-<issueId>.md`. Create the folder if needed. Write nothing else: **don't edit the grids.** The orchestrator has the findings fixed by an agent other than you, then asks you to confirm each fix and fill in Status.

Severities:
- **must-fix:** a missing or doubled pair; a value outside the six; a value the scale clearly doesn't support (your value is in a different band and the texts back you); a reason that mentions a party or shows the author used anything other than the option texts.
- **should-fix:** a cross-band difference where both readings are arguable; a triple that doesn't hold together; the same description with different values in two issues; a reason that doesn't match its value.
- **note:** a difference inside a band; anything that needs no change.

```md
# Grids check: <issueId>

- Checked on <date> by the Stage 7b checker (not the author of this grid)
- Author: <agent label from the orchestrator>
- Pairs checked: <n> · must-fix: <n> · should-fix: <n> · notes: <n>
- Result: <pass / pass after fixes / not passed>

## Findings

| # | Pair (a – b) | Author's value | Checker's value | Severity | Finding | Suggested value and reason | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|---|---|

## What was verified

<one line per check 1–8: done, and how>
```

Don't commit, don't change git config, don't spawn sub-agents.

Report back concisely: per issue, counts by severity and the cross-band differences.
