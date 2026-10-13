# Stage 7: Matching content

The site no longer asks an AI model for a match. It works the match out from fixed content prepared here, before launch (`prd-deterministic-matching.md`, requirements 29–35 and 42). This stage produces that content from the **frozen English research** of the 28 researched parties. It has five sub-stages. Each has an **author** and a **separate checker**:

| Sub-stage | Unit of work | Output | Author brief | Checker brief |
|---|---|---|---|---|
| 7a. Party positions | one issue, all 28 parties | `content/matching/positions/<issueId>.json` | [`stage-7a-positions-brief.md`](agent-briefs/stage-7a-positions-brief.md) | [`stage-7a-positions-check-brief.md`](agent-briefs/stage-7a-positions-check-brief.md) |
| 7b. Option-distance grids | all 10 issues, one agent | `content/matching/distances/<issueId>.json` | [`stage-7b-grids-brief.md`](agent-briefs/stage-7b-grids-brief.md) | [`stage-7b-grids-check-brief.md`](agent-briefs/stage-7b-grids-check-brief.md) |
| 7c. English result texts and points | one party | `content/matching/texts/en/<partyId>.json` | [`stage-7c-texts-brief.md`](agent-briefs/stage-7c-texts-brief.md) | [`stage-7c-texts-check-brief.md`](agent-briefs/stage-7c-texts-check-brief.md) |
| 7d. Hebrew result texts and points (**run by the owner**) | one party | `content/matching/texts/he/<partyId>.json` | [`stage-7d-hebrew-texts-brief.md`](agent-briefs/stage-7d-hebrew-texts-brief.md) | [`stage-7d-hebrew-parity-brief.md`](agent-briefs/stage-7d-hebrew-parity-brief.md) |
| 7e. Platform links for listed parties | the 24 listed parties | `platform` field in `content/registry/parties.json` | [`stage-7e-platform-links-brief.md`](agent-briefs/stage-7e-platform-links-brief.md) | [`stage-7e-platform-links-check-brief.md`](agent-briefs/stage-7e-platform-links-check-brief.md) |

The file formats are fixed. The site's code and validation are written against them. Don't add, rename or drop a field.

## Rules for every sub-stage

1. **Separate agents.** No agent checks content it wrote. The orchestrator records who did what in each log.
2. **Nothing from memory.** In 7a, 7c and 7d every statement comes from the research document or the checked English text the agent read in that session. In 7b it comes from the option texts. Only 7e uses the web. No agent adds what it knows about a party from anywhere else.
3. **The research is frozen.** No agent in this stage edits `content/research/`. An agent that thinks a research line is wrong follows the line anyway and reports it. The orchestrator takes it to the owner.
4. **The owner reviews none of this content.** The checker is the review. Bring the owner only product questions.
5. **Neutrality and glossary.** Every text a user reads uses the terms in `content/glossary.json`, avoids its `avoid` terms, makes no value judgment, and describes a position the way the party's own supporters would recognise as fair.
6. **No poll figures** in any text: no polling or survey wording next to a number, seat count or percentage.
7. **Recency.** A position rests on evidence from **2021 onwards** and on the **current leadership**. Older material is dated background and never decides a placement or carries a text.
8. **Evidence ranking.** Actions > formal commitments > statements.
9. **Validation.** After any change run `CONTENT_CORPUS=real pnpm validate:content`. Your files must raise no error. Errors about files that don't exist yet (other issues, other parties, Hebrew, `research-missing`) are expected while the content is incomplete.
10. **Don't commit**, don't change git config, don't spawn sub-agents. The orchestrator owns commits.

**Models (decided in the task breakdown):** Opus for positions, grids and every checker. Sonnet for writing result texts, unless the trial party or the owner says otherwise.

## How checkers report

Every checker writes a log under `research/review/matching/` and edits nothing else. It does not fix the content itself. The orchestrator sends the findings to the author (or another agent that is not the checker), and the checker then confirms each fix and fills in the Status column.

Each finding has a severity:

- **must-fix:** the content is wrong, ungrounded, not neutral, or breaks a rule or the format. The file can't be used until it is fixed.
- **should-fix:** the content is defensible but inconsistent, unclear or weaker than it should be. It is applied unless a reason not to is recorded in the log.
- **note:** an observation that needs no change.

Log format (the same for every sub-stage):

```md
# <Sub-stage> check: <issue id / party id / "all">

- Checked on <date> by a Stage <7x> checker (not the author of this content)
- Author: <agent label from the orchestrator>
- Items checked: <n> · must-fix: <n> · should-fix: <n> · notes: <n>
- Result: <pass / pass after fixes / not passed>

## Findings

| # | Where (party / option / pair / field) | Severity | Finding | Suggested fix | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|

## What was verified

<one line per check in the brief: done, and how>
```

A sub-stage is finished for a file when its log shows no open must-fix or should-fix finding.

---

## 7a: Party positions (one author per issue, all 28 parties)

Records which option each researched party holds on each issue. These rows decide who gets recommended.

### Inputs
- The issue ID, from the orchestrator.
- `content/issues/<issueId>.json`: the option IDs and texts.
- For each of the 28 parties with a file in `content/research/en/`: that party's `{#issue-<issueId>}` sub-section and its "**Closest option(s):**" line. Nothing else from the document, and nothing from outside it.

### Output: `content/matching/positions/<issueId>.json`

```json
{ "issueId": "gaza",
  "rows": [
    { "partyId": "likud-party", "unclear": false,
      "held": [ { "optionId": "<option id of that issue>", "level": "main" | "either" | "secondary", "inPart": true } ],
      "anchor": "issue-gaza", "basis": "one-line reason for the reviewer" },
    { "partyId": "some-party", "unclear": true, "held": [], "anchor": "issue-gaza", "basis": "No documented position found." }
  ] }
```

One row for each of the 28 researched parties, sorted by `partyId`. `anchor` is always `issue-<issueId>`.

`inPart` is optional and is left out unless it is true. It marks a held option of which the research shows the party holds only part: the option then counts for less, and a voter who chose it sees "partly agrees" instead of "agrees". By owner decision (2026-10-13) it is used for one option only, `emergency-powers-shin-bet` on `crime-in-arab-society`, when the research documents the Shin Bet / emergency element but not holding suspects without trial (or the reverse). The full rule is in the brief, under "Held only in part".

**Format rules** (validation enforces them):
- at most one `main` in a row;
- `either` only on two or more options of a row;
- never `main` together with `either` in a row;
- `unclear: true` exactly when `held` is empty.

### Placement rules

One rule per case, applied the same way to every party. The "Closest option(s)" line decides. The rest of the sub-section is read only to understand the line.

| # | What the research says | Placement |
|---|---|---|
| 1 | "**No documented position found.**" and no "Closest option(s)" line | `unclear: true`, `held: []`, basis "No documented position found." |
| 2 | The line calls itself tentative, or says it rests on indirect evidence, or calls its own evidence thin | every option the line points to as closest is `secondary`. Never `main`, never `either` |
| 3 | One option, stated clearly, and nothing else held | `main` |
| 4 | "X or Y", and the line says the evidence can't tell which | `either` on both. No `main` in that row |
| 5 | A clearly stated first option plus a named second option: "with elements of…", "together with…", "also matches…", "leans towards…", "partly like…", "the evidence is mixed" | the first is `main`, the second is `secondary`. A third named option is also `secondary` |
| 6 | A clearly stated first option, then "X or Y" as the second element | the first is `main`, X and Y are both `secondary` |
| 7 | An option named only to rule it out: "does not support…", "rules out…", "no evidence was found for…", "does not propose…" | not held. Leave it out |
| 8 | A held option with a caveat: "but without that option's funding cuts" | the level doesn't change. Put the caveat in `basis` |

More rules:
- **Unclear means exactly rule 1.** The unclear rows of an issue must be the same set as the parties whose research says "No documented position found" for it. Validation enforces this in both directions. A thin or tentative line is never unclear: it is rule 2.
- **Every "Closest option(s)" line gives at least one held option.** If no rule fits cleanly, place the option the line names as closest as `secondary` and report the row.
- **Actions over words.** Where a line sets what the party did against what it says, the option backed by actions is the first option and the option backed only by statements is the second (rule 5).
- **Recency.** Don't hold an option that the section supports only with evidence from before 2021 or with a former leader's record. If the line itself seems to rest on such evidence, follow the line and report it.
- **`basis`** quotes or paraphrases the deciding words of the line, in one line, so the checker can see which rule was applied. For example: `"with elements of" cut-taxes; first option stated plainly (rule 5)`.

### Method
1. Read the issue file. Know each option's ID and text.
2. Read all 28 sub-sections and write down each "Closest option(s)" line before placing anyone.
3. Place every party, with the rule number in mind.
4. **Re-read all 28 rows together.** Lines worded the same way must have the same levels. Fix any pair that doesn't.
5. Validate and report: counts of each kind of row, the unclear parties, rows where no rule fit cleanly, and any research line that looked wrong (unchanged).

### Check (a different agent)
Log: `research/review/matching/positions-<issueId>.md`. The checker re-reads every party's sub-section, applies the rules itself, and compares. It verifies: 28 rows, sorted; the format rules; every row against its rule; the unclear set equals the research's set exactly; same wording gives the same levels across parties; every `basis` traces to the line. When the self-match report exists (Task 3.3), an agent that wrote neither positions nor grids reviews the parties it lists and appends to these logs.

---

## 7b: Option-distance grids (one author for all 10 issues)

Records, for each issue, how close each option is to each other option. One judgement per pair, shared by all parties.

### Inputs
- `content/issues/*.json` (option IDs and texts) and `content/glossary.json`. **Nothing else.**
- The author and the checker **must not read** `content/matching/positions/`, any research document, or any review log about parties. Closeness is judged from the option texts alone, so it isn't bent toward any party.

### Output: `content/matching/distances/<issueId>.json`

```json
{ "issueId": "gaza",
  "pairs": [ { "a": "<optionId>", "b": "<optionId>", "closeness": 0.4, "reason": "one line" } ] }
```

Every unordered pair of that issue's options exactly once. The pair of an option with itself is implied to be 1 and is not listed. An issue with 3 options has 3 pairs, 4 has 6, 5 has 10, 6 has 15: 67 pairs in all. List the pairs in the order of the issue file, with `a` the option that comes first.

### Rules
- **What closeness means:** "how satisfied would a voter who chose A be with a party that holds B?" 0 is opposite, 1 is the same position.
- **One shared scale, six values only,** so the same number means the same thing in every issue:

| Value | Meaning |
|---|---|
| 0.8 | Same direction; differs in degree or pace |
| 0.6 | Same broad direction; differs on one significant element |
| 0.5 | Shares one major element and differs on another major element |
| 0.4 | Some real common ground, but the main thrust differs |
| 0.2 | Mostly opposed, with a minor shared element |
| 0 | Opposite |

- **One value per pair.** Judge it in both directions (A's voter facing B, B's voter facing A). If they differ, use the lower and say so in `reason`.
- **Options are not assumed to lie on one line.** Break each option into its elements (what it does, who is in control afterwards, what it rules out, its stated reason) and compare element by element. The first and last options in the file are not automatically the furthest apart.
- **Gaza (5 options) and Judea and Samaria (6) need particular care.** Their options differ on several things at once: in Gaza, returning to war, who holds security afterwards, withdrawal, rebuilding communities and emigration, and who governs; in Judea and Samaria, sovereignty, the settlements, a Palestinian state, the border, and equal citizenship in one state. Two options can share one of these and be opposed on another.
- **`reason`** names the shared and the differing elements in one line. It never mentions a party.
- **Sanity check before finishing:** if A–B and B–C are both 0.8, A–C should not be 0 or 0.2. Re-read any such triple. Then read all 67 values together and check that pairs you described the same way have the same value.

### Check (a different agent)
Log: `research/review/matching/grids-<issueId>.md`. The checker judges every pair from the option texts before looking at the author's value, then compares. It verifies: every pair once, none missing or doubled; only the six values; each value against the scale; the triples; consistency across issues; no reason mentions a party. Gaza and Judea and Samaria get a second full read.

---

## 7c: English result texts and "also worth knowing" points (one author per party)

Runs after 7a and 7b are checked and the scoring constants are settled (Task 3.3). One party is run first as a trial and its token cost reported to the owner; the rest start only on the owner's go-ahead (Tasks 3.4 and 3.5).

### Inputs
- The party ID and **the computed labels**, from the orchestrator: for every issue and every option, the agreement label the scoring gives this party (`agrees`, `partially`, `disagrees`, `party-position-unclear`), or "unclear" for the issue, together with the party's positions rows.
- `content/research/en/<partyId>.md`: for each issue text, only that issue's `{#issue-<issueId>}` sub-section; for the points, only the `{#other-positions}` section.
- `content/issues/*.json`, `content/glossary.json`.

### Output: `content/matching/texts/en/<partyId>.json`

```json
{ "partyId": "likud-party", "lang": "en",
  "issues": {
    "gaza": { "anchor": "issue-gaza",
              "options": { "<optionId>": { "agreement": "agrees" | "partially" | "disagrees" | "party-position-unclear", "text": "1–2 sentences" }, … one entry for EVERY option of the issue } },
    "housing": { "anchor": "issue-housing", "unclear": { "text": "…" } }
  },
  "points": [ { "text": "…", "anchor": "other-…" } ] }
```

All 10 issues are present. An issue has either `options` (one entry for every option of the issue) or `unclear`, never both.

### Rules for the issue texts
- **Each text is 1–2 neutral sentences addressed to a user who chose that option.** It says how the party's documented position compares with that option and cites the party's strongest evidence, actions first. "You chose …" is fine, but keep it short: the user already sees their own answer.
- **Only that party's research sub-section for that issue.** No fact from another section, another party's document, or memory. No comparison with other parties.
- **The `agreement` value is not the author's choice.** Copy the computed label, and write the text to fit it. If you believe a computed label is wrong given the research, **write the text to the label anyway** and flag it in your report.
- **`partially` has two causes; say which.** Either the party holds a neighbouring option (say what is shared and what differs), or it holds this option only weakly (say the research's placement is tentative, or that this is a secondary element of its position).
- **`disagrees`:** say what the party holds instead and its strongest evidence. Don't soften or sharpen it.
- **`party-position-unclear`** (on an option, not a whole issue): the scoring gives this label when the party's position on the issue rests only on tentative evidence and the voter chose an option the party isn't linked to. Say what the research found and didn't find: that it found no documented party position on what this option proposes, and where the tentative indication points. Never assert opposition the research doesn't show.
- **Unclear issue:** one `unclear` text says the research found no documented position of the party on the issue. It must not imply agreement or disagreement.
- Glossary terms; no poll figures; no value judgments; no option IDs, citation numbers or links in the text; absolute dates.

### Rules for the points
- **2–3 items from the "Other notable positions" section:** the positions the party is most distinctively known for, outside the 10 issues. The owner's example of a good point: a party that strongly advocates legalising cannabis.
- **The same selection rule for every party:** most distinctive first; among those, prefer positions backed by actions, then formal commitments, then statements; evidence from 2021 onwards.
- **Never legal matters or coalition statements,** wherever they appear.
- Each point is one neutral sentence, with the `other-…` anchor of the sub-section it comes from. Prefer a different sub-section for each point.

### Check (a different agent)
Log: `research/review/matching/texts-en-<partyId>.md`. The checker gets the same computed labels. It verifies, for every text: the recorded `agreement` equals the computed label; the text reads as that label; every fact is in the party's sub-section for that issue; the strongest evidence is the one cited; neutrality, glossary, no poll figures, length; an unclear text implies nothing. For the points: each traces to its sub-section, the anchor is right, the selection rule was followed, none is a legal matter or coalition statement. It also gives its own view on every label the author flagged. A label is never changed by hand: if the checker agrees it is wrong, the positions row or the grid goes back through 7a or 7b, and the party's affected texts are then rewritten and rechecked.

---

## 7d: Hebrew result texts and points (one author per party, then a parity check)

> **This sub-stage is run by the owner in a separate cloud session** (owner decision 2026-10-13). The orchestrator of 7a, 7b, 7c and 7e does not run it. It can start only when 7c is finished and checked for the party.
>
> **Suggested models:** Sonnet writes the Hebrew; Opus does the parity check. **Run one party first as a trial** and read its parity log before starting the rest. If the log shows meaning drift or loaded wording, move the writing to Opus.

### Inputs
- `content/matching/texts/en/<partyId>.json`: the **checked** English texts. They are canonical.
- `content/glossary.json`: **mandatory** Hebrew terms (`he`). Nothing listed under `avoid.he`.
- `content/issues/*.json`: each option's `he` text, so the Hebrew refers to the option in the words the user saw.
- `content/registry/`: Hebrew names of parties and people.
- Not the Hebrew research editions, and not the English research. The Hebrew text says what the English text says, nothing more.

### Output: `content/matching/texts/he/<partyId>.json`

The same format as 7c, with `"lang": "he"`:

```json
{ "partyId": "likud-party", "lang": "he",
  "issues": {
    "gaza": { "anchor": "issue-gaza",
              "options": { "<optionId>": { "agreement": "agrees" | "partially" | "disagrees" | "party-position-unclear", "text": "משפט אחד או שניים" }, … one entry for EVERY option of the issue } },
    "housing": { "anchor": "issue-housing", "unclear": { "text": "…" } }
  },
  "points": [ { "text": "…", "anchor": "other-…" } ] }
```

### Rules
- **Write an equivalent, not a literal translation.** It reads naturally and neutrally to a Hebrew-speaking Israeli voter and keeps exactly the same meaning, facts, dates, hedging and strength. Don't add or drop a claim.
- **Same keys, same `agreement` values, same anchors.** The same issues, the same option IDs, `options` or `unclear` exactly as in English, the same number of points in the same order with the same anchors. Only the `text` values and `lang` differ.
- 1–2 sentences per text, one sentence per point. Address the user in a form that reads the same for men and women where Hebrew allows it (for example "בחרת").
- No poll figures. No value judgments.

### Check: parity (a different agent)
Log: `research/review/matching/texts-he-<partyId>.md`. The checker compares the two files text by text. It verifies: identical keys, `agreement` values and anchors; every text says the same thing as its English text, with the same strength, hedging, dates, numbers and names; nothing added or dropped; the Hebrew reads as the same agreement level; glossary terms, and nothing that reads as loaded in Hebrew even though it is equivalent to the English. If a discrepancy suggests the **English** is wrong, the checker doesn't touch it and reports it, and the English goes back through 7c.

---

## 7e: Platform links for the listed parties

A listed-only party's page shows registry facts and, where one exists, a link to the party's own platform or website, labelled as the party's own material that the site has not checked. Nothing from the platform is reproduced or summarised. This sub-stage can run at any time.

### Inputs
- `content/registry/parties.json`: the 24 parties with `"tier": "listed"` (the ones with no file in `content/research/en/`), and `content/registry/lists.json` for their list names, ballot letters, leaders and top candidates.
- `research/ground-truth.md`.

### Tools
WebSearch and WebFetch (curl for sites that block WebFetch). Search in Hebrew and English.

### Output

In `content/registry/parties.json`, on the party's entry:

```json
"platform": { "url": "…", "checkedOn": "YYYY-MM-DD" }
```

or no `platform` field at all, with "none found" and what was searched recorded in the log.

To keep unverified links out of the registry, the **finder writes only the log**, the **verifier checks every entry**, and the **orchestrator writes the verified links** into the registry, with `checkedOn` set to the date the verifier loaded the page.

### Rules
- **The party's own official website or platform page.** Prefer the platform (מצע) page on the party's own site; otherwise its home page.
- **`https` only.** If only an `http` address works, record no link and say so in the log.
- **It must belong to the party itself.** Not a news article, not Wikipedia, not a third-party profile or candidate directory. A party whose only presence is a social-media account gets no link; the account is noted in the log as "social account only".
- **Show that it belongs to the party** with at least two signs you saw: the party's name as in the registry, its leader or candidates, its ballot letters, or a link to the site from an official source (the Central Elections Committee, the Party Registrar, the party's own account).
- Record the final address after redirects, without tracking parameters.
- **None found** is a valid result. Record the searches made (queries, in both languages, and the official pages opened).

Finder's log: `research/review/matching/platform-links.md`, one row per party:

```md
| Party ID | Result (link / none found / social account only / http only) | URL | Signs it belongs to the party | Searched |
|---|---|---|---|---|
```

### Check (a different agent)
Log: `research/review/matching/platform-links-check.md`. The verifier opens every proposed link itself. It verifies: the address is `https` and loads; the page is the party's own (two signs, seen by the verifier); it is not a news article, Wikipedia or a third-party profile; it is not a parked or taken-over domain. For every "none found" it runs one search of its own in Hebrew to confirm. Only links with no open finding go into the registry.

---

## After this stage

- The orchestrator bumps `matchingVersion` in `content/versions.json`. `surveyContentVersion` is never changed by this stage.
- **If a researched party's English research is ever corrected** (owner's say-so only), re-run for that party, in this order: its positions rows on the affected issues (7a, with check), its English texts for those issues (7c, with check), its Hebrew texts (7d, with parity check).
- **If a positions row, a grid value or a scoring constant changes,** every text whose computed label changed is rewritten and rechecked, in English and then in Hebrew.
