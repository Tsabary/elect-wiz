# Hebrew content session: what to do

This note is for the session that writes the Hebrew party content. It says what the job is, the order to do it in, and how to know it is finished. Read `research/NEXT-STEPS.md` section 0 first for the state of the project.

## The job

The site runs on the real content and works in English. The Hebrew site (the default language) currently shows the party content in English under a notice, because two things are missing:

1. **Hebrew research editions:** `content/research/he/<partyId>.md` for each of the 28 researched parties.
2. **Hebrew result texts:** `content/matching/texts/he/<partyId>.json` for the same 28 parties.

The 28 parties are exactly the files in `content/research/en/`. The other 24 parties in the registry are listed only; they get no research and no texts.

The two jobs don't depend on each other and can run in parallel. Everything else on the site, including the Hebrew interface strings in `messages/he.json`, is done. Don't change it.

## Rules that apply to both jobs

- **English is canonical and frozen, with one narrow exception (names and roles in the result texts, see Job 2).** Never edit `content/research/en/`, and never edit `content/matching/texts/en/` beyond that exception; never edit `content/matching/positions/`, `content/matching/distances/`, `content/matching/config.json` or `content/registry/`. If the English looks wrong, record it in the parity log and tell the owner; don't fix it.
- **The agent that writes a Hebrew file never checks it.** Writing and parity-checking are done by different agents.
- **Equivalents, not literal translations.** Natural, plain, neutral Israeli Hebrew that says exactly what the English says: the same claims, strength, hedging, dates, numbers and names.
- **Glossary:** `content/glossary.json` Hebrew terms are mandatory; nothing listed under `avoid.he`.
- **One wording rule from the owner:** don't write that a party "נחקרה" or parties "שנחקרו". In Hebrew that reads as "was interrogated". Say that research was carried out about the party ("נערך עליה מחקר").
- **No poll figures** anywhere in the Hebrew text.
- **The owner reviews no content.** Don't ask the owner to read or approve the Hebrew. Bring the owner only decisions about the product.
- **Models:** Sonnet writes, Opus checks parity. Run one party first as a trial and read its parity log before starting the rest; if it shows meaning drift or loaded wording, move the writing to Opus.
- **Batches:** about 3–6 agents at a time.
- **Commits:** work on this session's own branch; the owner merges. Never change git config. End commit messages with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Job 1: Hebrew research editions

Instructions: `research/pipeline/stage-5-hebrew-edition.md` (5a writes, 5b checks). Read it in full; it fixes the Hebrew section headings, the evidence-tier tags and the anchor rules.

- **Input:** `content/research/en/<partyId>.md`. About 281,000 English words in total; the documents run from about 6,400 words (`haredi-public`) to about 15,300 (`new-hope`).
- **Output:** `content/research/he/<partyId>.md`, with the same frontmatter except `lang: he`, the same anchors in the same order, and the same `[n]` citations and Sources list.
- **Parity log:** `research/review/parity-check.md`, one section per party, with no unresolved differences.
- **Long documents:** a document must be written whole, not summarised. If one is too long for a single pass, write it section by section into the same file, in order, and have the parity check cover every section.
- **Check as you go:** `pnpm validate:content` must show no error naming the file you wrote. It checks the structure, the anchors against the English document, the citations and the poll-figure rule.

## Job 2: Hebrew result texts

Instructions: sub-stage 7d of `research/pipeline/stage-7-matching-content.md`, with the briefs `research/pipeline/agent-briefs/stage-7d-hebrew-texts-brief.md` (author) and `stage-7d-hebrew-parity-brief.md` (checker).

- **Input:** `content/matching/texts/en/<partyId>.json` (checked and final), plus the Hebrew option texts in `content/issues/*.json` and Hebrew names in `content/registry/`.
- **Output:** `content/matching/texts/he/<partyId>.json`: the same keys, the same `agreement` values and the same anchors as the English file. Only `lang` and the `text` values differ.
- **Parity log:** `research/review/matching/texts-he-<partyId>.md`.
- **Lessons from the English texts that apply to the Hebrew too:** dates are written day first; a label or phrase the English puts in quotation marks stays in quotation marks.
- **Names and roles: the one English change this session may make (owner decision 2026-10-13).** Each text is shown to a voter on its own, so every person needs their full name and role at first mention in each text ("party leader Yoaz Hendel", not "Hendel"). The English texts of 18 parties were written before that rule was enforced, so some name people by surname only. When the Hebrew writer meets one:
  - it fixes the **English** text too, adding only the full name and the role, and writes the Hebrew to match;
  - the name and role come from `content/registry/` and from the "Leadership and key candidates" section of the party's English research document, and from nowhere else; if neither gives the role as it was on the date the text speaks of, the text gets the full name only and the case is logged;
  - nothing else in the English text may change, and its `agreement` value never changes;
  - the parity checker confirms each such edit against those two sources and lists them in its log under "English names completed".
  This is done party by party as the Hebrew texts are written. There is no separate pass over the English for it.
- **Check as you go:** `pnpm validate:content` must show no error naming the file. It checks that the keys match the English file and that each text's `agreement` equals the label the scoring computes.

## While the work is in progress

`content/versions.json` has `"hebrewContent": "pending"`. While it is set:

- missing Hebrew files are not validation errors, so the build keeps passing with the work half done;
- every Hebrew file that exists is fully validated;
- the Hebrew site falls back to English party by party, so finished parties already show in Hebrew.

## Finishing

When all 28 Hebrew research editions and all 28 Hebrew texts files exist and both parity logs show nothing unresolved:

1. In `content/versions.json`, set `"hebrewContent": "ready"` (or delete the field), and bump `researchVersion` and `matchingVersion` (for example to the day's date with `.1`).
2. Run `pnpm install` if needed, then `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build`. The build runs the content validation, the self-match test and the 16 voter profiles on the real content; all must pass with no missing-Hebrew error.
3. If the environment has browsers for Playwright, run `pnpm test:e2e` too (it uses the placeholder content and should be unaffected). If it doesn't, say so in the report; don't treat it as a failure.
4. Update `research/NEXT-STEPS.md` section 0 and tick the Hebrew items in `tasks-deterministic-matching.md` ("Owner's work outside this document" and Task 5.1).
5. Report to the owner: what was written, the models used, the trial party's outcome, the number of differences each parity check found and fixed, anything in the English that looked wrong (left unchanged), and the results of the commands in step 2 as they actually came out.

What remains after that is Task 5.2, the pre-launch check of the whole site in both languages.
