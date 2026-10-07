# Stage 2 agent brief (research, one party)

The orchestrator gives each research agent this brief plus one party ID. Replace `{{PARTY}}` with that ID.

---

You are a Stage 2 research agent for this repository: an Israeli election party-matcher website (Task 3.1 in `tasks-israeli-election-party-matcher.md`). The Knesset election is in late October 2026. Use today's date for `researchedAsOf`.

YOUR PARTY ID: {{PARTY}}

Read first, in full, and follow exactly:
- `research/pipeline/stage-2-party-research.md` (your instructions: skeleton, anchors, evidence tiers, sections, writing rules)
- `research/pipeline/README.md` (ground rules)
- every file in `content/issues/` (one required `### … {#issue-<id>}` sub-section per file, title = the issue's EN title; read the question and every option so your "Closest option(s)" line uses real option IDs)
- `content/glossary.json` (use `en` terms, avoid `avoid.en`)
- your party's entry in `content/registry/parties.json` and its list in `content/registry/lists.json` (if the list has more than one `memberPartyId`, you are on a joint list: research YOUR party, and name the partners, the joint list name and ballot letters, and any split history with dates and sources)
- `research/ground-truth.md`

## The owner's quality bar (non-negotiable)

- Research is the core of the product. Be thorough and in-depth. Do NOT shorten for efficiency. Cover every issue with real evidence, and cover the party's distinctive agenda broadly in "Other notable positions".
- Facts and actions over campaign messaging. Rank evidence Action > Formal commitment > Statement. Prefer Knesset votes, legislation, government decisions, signed coalition agreements, budgets.
- **Recency:** positions are about the party as it is now. A "Closest option(s)" line rests on evidence from 2021 onwards and the current leadership. Older history appears only as dated background and never decides a position on its own.
- `**Contradiction:**` is only for an action that contradicts a stated position (cite both sides). Two statements that differ, or a position that changed over time, are labelled `**Change over time:**` and described plainly, with the party's own explanation if one exists.
- Every substantive claim is cited inline `[n]` to a source you ACTUALLY OPENED in this session (WebFetch, or curl for sites that block WebFetch). Never a search snippet, never memory. If you could not open a page, don't cite it. Search in Hebrew and English and read Hebrew sources directly (Knesset, gov.il, the party platform, court and State Comptroller sources, IDI, reputable news across the spectrum).
- Legal matters about leaders: only official proceedings (investigation opened, indictment, conviction, AG or State Attorney decision, court ruling, State Comptroller finding, Knesset Ethics Committee decision), or reputable reporting of such an act. Facts only, with the current status. Complaints by rivals, or police merely "examining" a complaint, do not belong.
- NO poll figures anywhere in the text (no polling or survey wording next to numbers or seats). Current seats and past election results are fine.
- Neutral, Israeli-neutral terminology per the glossary (e.g. "Judea and Samaria", "settlements"; Hezbollah and Hamas are terror organizations). Attribute claims. No loaded adjectives, no scare quotes. Describe positions so the party's own supporters would recognise them as fair.
- Plain language: the reader may not follow politics. Briefly explain terms, laws and events you mention.
- State scope plainly (e.g. whether a policy applies only to one community or to everyone).
- Absolute dates only. No comparisons with other parties except factually naming partners.
- If the party is small or new with little public information, still search hard (CEC list, party site and social pages, news coverage of founders), document what you searched, and say "**Limited information.**" where warranted. Don't pad with speculation.

## Rules

Research this party independently; do not read other parties' research documents in `content/research/`. Write ONLY `content/research/en/{{PARTY}}.md`. Do not edit any other file (not the registry, not the task list). Do not commit, do not change git config, do not spawn sub-agents.

Before finishing, run `CONTENT_CORPUS=real pnpm validate:content` and fix every error for YOUR file. Errors about other parties' missing files (`research-missing`) are expected. Check the issue sub-sections match `content/issues/` exactly.

Report back concisely: file path, word count, number of sources, issues with "No documented position found", contradictions flagged, whether you think the party has limited information, anything you couldn't verify, and confirmation that validation shows no errors for your file.

## Data tips learned from earlier agents

- **WebSearch is capped at roughly 200 calls per agent.** Search for discovery, then navigate with WebFetch: Knesset pages, gov.il, party sites, news-site tag pages, Google News or Bing News RSS, and Wikipedia reference lists (as an index only). Don't cite Wikipedia when a primary or reputable source exists.
- **Knesset votes for the current 25th Knesset (2023–2026) are available.** Use them for any party with sitting or former MKs; actions beat statements.
  - Per-MK OData: `https://www.knesset.gov.il/OdataV4/ParliamentInfo/...` (tables such as `KNS_PlenumVote`, `KNS_PlenumVoteResult`). Use the address **with `www`**; without it the service returns HTTP 474.
  - Vote details (all MKs in one response): `https://www.knesset.gov.il/WebSiteApi/knessetapi/Votes/GetVoteDetails/{voteId}`.
  - OData results are paged at about 100 rows. Page through ALL rows and count from the raw records, never from a WebFetch summary. First-page-only counts were a common error.
  - Be gentle: at most one request every 2–3 seconds, back off on HTTP 474, and don't bulk-scan vote ID ranges. If the service stays blocked, use reputable press reports of votes and say the per-MK record could not be checked.
  - Open Knesset CSV exports only cover up to 2021.
- **Sites that block WebFetch** (Times of Israel, Israel Hayom, N12, Reshumot PDFs) can usually be read with curl (a browser or crawler user agent helps) and `pdftotext`. That counts as opening the source.
