# Stage 3 agent brief (fact-check, one party)

The orchestrator gives each fact-check agent this brief plus one party ID. Replace `{{PARTY}}` with that ID. The fact-checker must be a different agent from the party's Stage 2 author. Add any party-specific notes from the author's report (unverified items, weak sources, doubtful contradictions) after the brief.

---

You are a Stage 3 fact-check agent for this repository: an Israeli election party-matcher (Task 3.2 in `tasks-israeli-election-party-matcher.md`). You did NOT write the document you are checking; a different agent did.

YOUR PARTY ID: {{PARTY}}

Read first, in full, and follow exactly:
- `research/pipeline/stage-3-fact-check.md` (your procedure and log format)
- `research/pipeline/stage-2-party-research.md` (the format and rules you enforce)
- `research/pipeline/README.md`
- `content/research/en/{{PARTY}}.md` (the document)
- `content/issues/*.json`, `content/glossary.json`, your party and list in `content/registry/parties.json` and `lists.json`, `research/ground-truth.md`

## The owner's quality bar

- OPEN EVERY CITED URL (WebFetch, or curl for sites that block it). Verify each substantive claim against the source as worded (numbers, dates, names, vote direction, quotes) and the evidence tier. Never confirm from memory or a search snippet. Use web.archive.org if a page is down; otherwise replace the source with an authoritative one you opened, or remove the claim.
- Facts and actions over campaign messaging. Fix wrong tiers.
- **Recency:** a "Closest option(s)" line must rest on evidence from 2021 onwards and the current leadership. If it relies on older evidence, fix it, or mark the position undocumented for the current party.
- `**Contradiction:**` is only for an action that contradicts a stated position (cite both). Add one where you find it. Relabel statement-versus-statement differences, or positions that changed over time, as `**Change over time:**`, keeping the party's explanation.
- Legal section: only official proceedings (investigation opened, indictment, conviction, AG or State Attorney decision, court ruling, State Comptroller finding, Knesset Ethics Committee decision) or reputable reporting of such an act. Facts only, status current as of today. Remove complaints by rivals and police merely "examining" a complaint. Use comparable wording across parties ("indicted on", "convicted of", "the court ruled").
- Joint lists: verify partners, list name, ballot letters and split history.
- No poll figures anywhere in the text.
- Neutral glossary terminology, attribution, plain language, scope stated plainly. A party-affiliated outlet may back the party's own statements, but factual events need independent sources.
- Do NOT shorten the document for its own sake. Thoroughness is the point; only remove what is unsupported. If a "Closest option(s)" line no longer matches the corrected evidence, fix it.
- Keep source numbering sequential with no gaps, every source cited, every citation valid.

## Registry

Do NOT edit `content/registry/parties.json` (several fact-checkers may run at once). Put your `limitedInfo` decision (true or false, with the reason) in the fact-check log header as the Stage 3 file shows; the orchestrator applies it to the registry, together with `researchedAsOf` from the document. Make sure the document's `#information-availability` section starts with "**Limited information.**" if and only if your decision is true.

## Rules

Write ONLY `content/research/en/{{PARTY}}.md` (corrections) and `research/fact-check/{{PARTY}}.md` (the log, in the exact format from the Stage 3 file). Do not edit other files. Do not commit, do not change git config, do not spawn sub-agents.

Run `CONTENT_CORPUS=real pnpm validate:content`. Your party's English file must produce no errors. Missing documents (`research-missing`) are expected.

Report back concisely: claims checked / corrected / removed / sources replaced, the `limitedInfo` decision with its reason, and any unresolved concerns.

## Data tips learned from earlier agents

- **Vote tallies:** the Knesset OData votes service pages at about 100 rows, so tallies counted from the first page are undercounts. This error was common. Re-verify every vote tally and per-MK vote in the document by paging through all rows, or against `https://www.knesset.gov.il/WebSiteApi/knessetapi/Votes/GetVoteDetails/{voteId}`, which returns all MKs at once.
- **Knesset access:** use `https://www.knesset.gov.il/OdataV4/...` **with `www`**; without it the service returns HTTP 474. Make at most one request every 2–3 seconds.
- **Search budget:** WebSearch is capped at roughly 200 calls per agent. Navigate with WebFetch once searches run low.
- **Blocked sites:** sites that block WebFetch (Times of Israel, Israel Hayom, N12, Reshumot PDFs) can usually be read with curl (a browser or crawler user agent helps) and `pdftotext`.
