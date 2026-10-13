# Stage 7a agent brief (party positions, one issue, all 28 parties)

The orchestrator gives each positions author this brief plus one issue ID. Replace `{{ISSUE}}` with that ID. One author places all 28 researched parties on that issue in a single pass. Use Opus. The 10 authors can run in parallel.

---

You are a Stage 7a positions author for this repository: an Israeli election party-matcher (Task 3.1 in `tasks-deterministic-matching.md`).

YOUR ISSUE ID: {{ISSUE}}

## What this is for

The site matches a voter to parties by fixed rules, with no AI at run time. For each issue it needs to know which option each party holds. You record that for one issue, for all 28 researched parties, from their research documents. These rows decide who gets recommended, and anyone can inspect them, so each row must follow from the research by a rule that was applied the same way to every party. You are not judging the parties. You are reading what the research already concluded and recording it in a fixed form.

A different agent will check your file. The owner does not review it.

## Read

- `content/issues/{{ISSUE}}.json`: the option IDs and their English texts.
- `ls content/research/en/`: the 28 researched parties. The file name is the party ID.
- In each of the 28 documents: **only** the sub-section headed `{#issue-{{ISSUE}}}`, ending in its "**Closest option(s):**" line (or stating "**No documented position found.**").

Work from that sub-section and its "Closest option(s)" line only. **Never from memory or outside knowledge**, and not from other sections of the document, other parties' documents, or the web. If you know something about a party that the sub-section doesn't say, it doesn't exist for this task.

## Write: `content/matching/positions/{{ISSUE}}.json`

The format is fixed. Code is written against it. Don't add, rename or drop a field.

```json
{ "issueId": "gaza",
  "rows": [
    { "partyId": "likud-party", "unclear": false,
      "held": [ { "optionId": "<option id of that issue>", "level": "main" | "either" | "secondary", "inPart": true } ],
      "anchor": "issue-gaza", "basis": "one-line reason for the reviewer" },
    { "partyId": "some-party", "unclear": true, "held": [], "anchor": "issue-gaza", "basis": "No documented position found." }
  ] }
```

- One row for each of the 28 researched parties, **sorted by `partyId`**.
- `anchor` is always `issue-{{ISSUE}}`.
- `optionId` is an option ID of this issue, exactly as in the issue file.
- `inPart` is optional and comes after `level`. Leave it out unless the "Held only in part" rule below applies. Never write `"inPart": false`.

**Format rules** (validation rejects a file that breaks them):
- at most one `main` in a row;
- `either` only on two or more options of a row;
- never `main` together with `either` in a row;
- `unclear: true` exactly when `held` is empty.

## Placement rules

One rule per case. Apply each one identically to every party. The "Closest option(s)" line decides; read the rest of the sub-section only to understand the line.

| # | What the research says | Placement |
|---|---|---|
| 1 | "**No documented position found.**" and no "Closest option(s)" line | `unclear: true`, `held: []`, basis "No documented position found." |
| 2 | The line calls itself tentative, or says it rests on indirect evidence, or calls its own evidence thin | every option the line points to as closest is `secondary`. Never `main`, never `either` |
| 3 | One option, stated clearly, and nothing else held | `main` |
| 4 | "X or Y", and the line says the evidence can't tell which | `either` on both. No `main` in that row |
| 5 | A clearly stated first option plus a named second option: "with elements of…", "together with…", "also matches…", "leans towards…", "partly like…", "the evidence is mixed" | the first is `main`, the second is `secondary`. A third named option is also `secondary` |
| 6 | A clearly stated first option, then "X or Y" as the second element | the first is `main`, X and Y are both `secondary` |
| 7 | An option named only to rule it out: "does not support…", "rules out…", "no evidence was found for…", "does not propose…" | not held. Leave it out |
| 8 | A held option with a caveat ("but without that option's funding cuts") | the level doesn't change. Put the caveat in `basis` |

Check rule 2 first: a tentative line is `secondary` even when it names a single option.

Further rules:

- **Unclear means exactly rule 1, and only rule 1.** The unclear rows of your file must be the same set as the parties whose sub-section says "No documented position found". A validation rule enforces this in both directions. A thin, mixed or tentative line is never unclear.
- **Every "Closest option(s)" line gives at least one held option.** If no rule fits cleanly, place the option the line names as closest as `secondary`, and list the row in your report.
- **An option ID appearing in the line is not automatically held.** Lines often name an option to exclude it (rule 7).
- **Evidence ranking: actions > formal commitments > statements.** Where a line sets what the party did against what it says, the option backed by actions is the first option, and the option backed only by statements is the second (rule 5). Don't promote a statement over an action.
- **Recency (owner decision):** a position rests on evidence from **2021 onwards** and on the **current leadership**. Older evidence, and the record of someone who no longer leads or runs for the party, is dated background and never decides a placement. Don't hold an option that the sub-section supports only with such material. If the "Closest option(s)" line itself seems to rest on it, follow the line and report it.
- **`basis`** is one line that quotes or paraphrases the deciding words of the research line, so the checker can see which rule you applied. Example: `"with elements of" cut-taxes; first option stated plainly (rule 5)`. Nothing in `basis` may come from outside the sub-section.

**Held only in part.** A held option may carry `"inPart": true`. It means the research shows the party holds only part of what the option proposes: it backs one of the option's measures and not another. Such an option counts for less in the score, and a voter who chose it sees "partly agrees" instead of "agrees". The flag doesn't change the level: place the option by the rules above first, then decide the flag.

By owner decision (2026-10-13) the flag is used for **one option only**: `emergency-powers-shin-bet` on `crime-in-arab-society`. Don't use it on any other option or issue; everywhere else a partly held option is rule 8 (a caveat in `basis`). That option proposes two separable measures: treating the crime organisations as a national emergency handled with the Shin Bet, and a new power to hold suspected crime bosses without trial. For every row that holds it, apply this rule identically to every party, from the whole sub-section:

- **`inPart: true`** when the research documents the party backing the Shin Bet / emergency element but not holding suspects without trial, whether because the research found nothing on detention without trial or because the party opposes it.
- **No `inPart`** when the research documents the party backing both elements, so also detention without trial (administrative detention) for crime suspects, from 2021 onwards. "The party" here means its platform, its MKs or ministers acting for it, its leader, or, for a party whose evidence is its candidates' record, those candidates.
- **`inPart: true`** also when the research documents the detention element but not the Shin Bet element.
- **Never on a `secondary` option.** A `secondary` level already says the party's hold is weak or tentative; adding the flag would count the same weakness twice. Use it only on `main` and `either`.

Say in `basis` why the option is held in part, and list in your report any row where the research documents neither element.

## Method

Place all 28 parties in **one pass, side by side**, so that the same level means the same thing for each party.

1. Read the issue file.
2. Read all 28 sub-sections. Copy each "Closest option(s)" line into your working notes before you place anyone.
3. Place each party, noting the rule number.
4. **When all rows are placed, re-read them together.** Lines worded the same way must have the same levels. Parties on one joint list are placed from their own lines: the same where the lines say the same, different where they differ. Fix any inconsistency.
5. Run `CONTENT_CORPUS=real pnpm validate:content`. Your file must raise no error. Errors about files that don't exist yet are expected.

## Limits

- Write only `content/matching/positions/{{ISSUE}}.json`.
- The research is frozen. Don't edit any research document, even to fix an obvious slip. Report it.
- Don't read `content/matching/distances/`.
- Don't commit, don't change git config, don't spawn sub-agents.

## Report back (concise)

- The file path and the number of rows.
- How many rows have a `main`, how many are `either`, how many are `secondary` only, how many are unclear.
- The unclear party IDs.
- Rows where no rule fit cleanly, with the line's wording and what you chose.
- Any research line that looked wrong or seemed to rest on pre-2021 evidence (you left it unchanged).
