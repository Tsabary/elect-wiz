# Stage 7b agent brief (option-distance grids, author)

The orchestrator gives the grids author this brief plus the issue IDs. Replace `{{ISSUES}}` with the list (normally all 10, so one agent uses the scale the same way everywhere). Use Opus. Start this agent in a fresh session that has not read any party research or positions file.

---

You are the Stage 7b grids author for this repository: an Israeli election party-matcher (Task 3.2 in `tasks-deterministic-matching.md`).

YOUR ISSUES: {{ISSUES}}

## What this is for

The site matches a voter to parties by fixed rules. On each issue the voter picks one option, and each party is recorded as holding one or more options. To score the party, the site needs to know how close the voter's option is to the party's option. You write that: for each issue, one closeness value for every pair of options. The same grid is used for every party.

The values are public and anyone can inspect them, so each must be defensible from the wording of the two options alone.

A different agent will check your grids. The owner does not review them.

## Read, and what you must not read

- `content/issues/<issueId>.json` for each of your issues: the option IDs and their texts. Read the description and question too.
- `content/glossary.json`, for what the terms mean.

**Judge only from the option texts.** You must NOT read `content/matching/positions/`, anything in `content/research/`, or any review log about parties, and you must not think about which party holds which option. If a grid were written with parties in mind, it could be bent toward one of them. Nothing from memory about how these positions sit in Israeli politics: only what the two texts say.

## Write: `content/matching/distances/<issueId>.json`, one file per issue

The format is fixed. Code is written against it. Don't add, rename or drop a field.

```json
{ "issueId": "gaza",
  "pairs": [ { "a": "<optionId>", "b": "<optionId>", "closeness": 0.4, "reason": "one line" } ] }
```

- **Every unordered pair of that issue's options exactly once.** The pair of an option with itself is implied to be 1 and is not listed. Never list a pair twice (A–B and B–A are the same pair).
- An issue with 3 options has 3 pairs, 4 has 6, 5 has 10, 6 has 15.
- List the pairs in the order of the issue file, with `a` the option that comes first in the file.
- `closeness` runs from 0 (opposite) to 1 (the same position).

## How to judge closeness

**The question to ask for each pair:** "how satisfied would a voter who chose A be with a party that holds B?"

**Use this scale, and only these six values,** so that the same number means the same thing in every issue:

| Value | Meaning |
|---|---|
| 0.8 | Same direction; differs in degree or pace |
| 0.6 | Same broad direction; differs on one significant element |
| 0.5 | Shares one major element and differs on another major element |
| 0.4 | Some real common ground, but the main thrust differs |
| 0.2 | Mostly opposed, with a minor shared element |
| 0 | Opposite |

For orientation: with the site's starting settings, a voter facing a party at 0.8 sees "agrees", at 0.4–0.6 "partly agrees", and at 0.2 or 0 "disagrees". Those settings may be tuned later, so choose each value by the description in the table, not by the label you would like to appear.

Rules:

- **One value per pair.** Ask the question in both directions (A's voter facing B, and B's voter facing A). If the answers differ, use the lower one and say so in `reason`.
- **Options are not assumed to lie on one line.** Don't rank the options from one end to the other and read distances off the ranking. Break each option into its elements: what it would do, who is in control afterwards, what it rules out, and the reason it gives. Compare the two options element by element. The first and last options in the file are not automatically the furthest apart, and neighbours in the file are not automatically close.
- **Gaza (5 options) and Judea and Samaria (6 options) need particular care,** because their options differ on several things at once:
  - Gaza: whether to go back to war; who holds security afterwards; whether the army withdraws; rebuilding Israeli communities and encouraging residents to leave; who governs daily life; a Palestinian state.
  - Judea and Samaria: applying sovereignty and to how much; the future of the settlements; a Palestinian state; where the border runs; one state with equal citizenship.
  Two options can share one of these and be opposed on another. Write the elements down for each option of these two issues before you set any value.
- **`reason`** is one line naming what the two options share and where they differ. It never mentions a party, a politician or a camp.

## Before you finish

1. **Triples:** if A–B and B–C are both 0.8, A–C should not be 0 or 0.2. Re-read any such triple and correct whichever value is off.
2. **Across issues:** read all your values together. Pairs you described the same way must have the same value.
3. **Count:** each file has exactly the right number of pairs, none missing, none doubled.
4. Run `CONTENT_CORPUS=real pnpm validate:content`. Your files must raise no error. Errors about files that don't exist yet are expected.

## Limits

- Write only `content/matching/distances/<issueId>.json` for your issues.
- Don't edit the issue files. They are frozen.
- Don't commit, don't change git config, don't spawn sub-agents.

## Report back (concise)

- The files written and the number of pairs in each.
- How many pairs got each value.
- Pairs where the two directions differed.
- The pairs you found hardest, with one line each on why.
