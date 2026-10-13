# English texts check: `inPart` on `emergency-powers-shin-bet` (crime-in-arab-society), eight parties

- Checked on 13 October 2026 by an independent checker (not the author of these texts and not the agent that decided the rows)
- Scope: the row decision and the one rewritten text (`crime-in-arab-society` / `emergency-powers-shin-bet`, now `partially`) for byachad-bennett, likud-party, national-union-tkuma, the-democrats-party, the-reservists, yesh-atid, yesodot-yisrael, zehut; plus a one-line look at the three unflagged rows
- Sources: only each party's `{#issue-crime-in-arab-society}` sub-section in `content/research/en/<partyId>.md`; `content/registry/` and the document's leadership section for names and roles; `content/glossary.json`; the option text. Nothing from memory or the web.
- Texts checked: 8 option texts · must-fix: 2 · should-fix: 3 · notes: 5
- Result: pass after fixes

## A. Row decisions

Rule (from `in-part-crime-in-arab-society.md`): `inPart: true` when the Shin Bet / emergency element is documented and holding suspects without trial is not documented or is opposed; no flag when both are documented.

| Party | `inPart` | Verdict | Deciding words in the sub-section |
|---|---|---|---|
| byachad-bennett | yes | right | "bring the Shin Bet into the campaign"; "The plan does not mention holding suspects without trial"; "no position was found on the new power to hold suspects without trial" |
| likud-party | yes | right | Plan "proposed by Prime Minister Netanyahu, Social Equality Minister May Golan (Likud)…" brings in the Shin Bet; "No Likud position specifically on holding crime bosses without trial was found" |
| national-union-tkuma | yes | right | "Smotrich called for involving the Shin Bet in combating illegal weapons"; the sub-section is silent on detention without trial ("terrorism-style powers" there means a terrorism definition and 10-year prison terms) |
| the-democrats-party | yes | right | Task force "including the police, the Shin Bet, the IDF and the Prison Service"; "The platform does not mention holding suspects without trial" |
| the-reservists | yes | right | "a new Shin Bet division to fight crime in Arab society"; "The party's published plans do not mention holding suspects without trial" |
| yesh-atid | yes | right | "bring the Shin Bet into the picture"; "The plans reviewed do not mention detention without trial"; "without the detention-without-trial power that option includes" |
| yesodot-yisrael | yes | right | "setting up a dedicated division in the Shin Bet"; the sub-section is silent on detention without trial |
| zehut | yes | right | "transfer the handling of them to the Shin Bet"; "the use of administrative detention will be abolished"; "it opposes the detention-without-trial power" |
| eretz-yisrael-shelanu | no | stands, but the weakest of the three | Detention without trial is documented directly (Kroizer, June 2023: "one of the aggressive tools we demanded"). The Shin Bet element rests only on the 15 July 2026 decision of "the government, in which Wasserlauf serves", and "The report does not give a minister-by-minister vote"; no candidate's own statement for the Shin Bet is in the sub-section. The Closest line does state both elements. Read strictly, the rule's third case (detention documented, Shin Bet not) could apply; the orchestrator may want to confirm. |
| jewish-national-front | no | right, both documented | "to bring in the Shin Bet … and to allow administrative detention (holding someone without trial)"; the 15 July 2026 plan "led by Netanyahu, … May Golan and Ben Gvir"; the June 2023 Otzma Yehudit bill for "renewable six-month administrative detentions" |
| yisrael-beytenu | no | right, both documented | Platform: "dedicated legislation that will allow administrative detention [detention without trial] of heads of crime organizations"; Liberman proposed "involvement of the Shin Bet" (September 2025) and "a comprehensive apparatus that also includes the Shin Bet" (September 2026) |

All eight computed labels confirmed as `partially` with `scripts/print-computed-labels.ts`; every `agreement` in the eight texts equals it.

## B. Findings on the texts

| # | Party | Severity | Finding | Suggested fix (full replacement text) | Status |
|---|---|---|---|---|---|
| 1 | national-union-tkuma | must-fix | "The research found no position on holding someone without trial." The sub-section never says this: it is silent on detention without trial (the only "no … was found" lines are about a party statement on the July decision and about the investment-first approach). Lesson: "The research found no…" is allowed only where the sub-section says so. Also, unlike the other seven, the text never says it matches only part of the answer. | The party's record matches part of your answer: the government in which it serves approved a plan on 15 July 2026 to bring the Shin Bet (Israel's internal security service) into the fight against crime in Arab society, and on 27 August 2026 party leader Bezalel Smotrich called for involving it against illegal weapons. That record, as documented, does not mention holding suspects without trial. | open |
| 2 | yesodot-yisrael | must-fix | "The research found no position on holding someone without trial." Same fault: the sub-section is silent on detention without trial; its only "No position was found" line is about "investing in Arab communities as a way to fight crime". In the same text "Yoaz Hendel" has no role at first mention (registry: leader of The Reservists; the document: "chairman of The Reservists party"). | The research calls the evidence mixed: the Magen David Plan, presented on 5 August 2026 by party leader Chili Tropper with Yoaz Hendel, leader of The Reservists, proposes a dedicated Shin Bet (Israel's internal security service) division against crime in Arab society, which matches part of your answer. The party's record, as documented, does not mention holding suspects without trial. | open |
| 3 | likud-party | should-fix | "The research found no party position on holding someone without trial" is wider than the research's own wording, "No Likud position specifically on holding crime bosses without trial was found". The earlier text had "holding crime bosses without trial", which also matches the option ("any suspected crime boss"). | The government approved a plan on 15 July 2026, proposed by Prime Minister Benjamin Netanyahu, the party's leader, and others, to bring the Shin Bet (Israel's internal security service) into the fight against organized crime in Arab communities, which matches part of your answer. The research found no party position on holding crime bosses without trial. | open |
| 4 | byachad-bennett | should-fix | "The research found no position on holding someone without trial" is wider than the research's "no position was found on the new power to hold suspects without trial that this option also includes". | The party shares part of your answer: its personal-security plan would define crime as a security threat and bring in the Shin Bet (Israel's internal security service), and its Negev plan adds the Shin Bet to a joint task force. The research found no position on the new power to hold suspects without trial that your answer also includes. | open |
| 5 | zehut | should-fix | Wording only: "that is, ending holding someone without trial" and "hand their handling to the Shin Bet" read badly. The facts are right. The research's own sentences are "transfer the handling of them to the Shin Bet" and "Administrative detention is holding someone without trial." | The party's 2026 platform shares part of your answer: it would define protection rackets as terrorism and transfer the handling of them to the Shin Bet (Israel's internal security service). It opposes the rest: it says "the use of administrative detention will be abolished", and administrative detention is holding someone without trial. | open |

Replacement lengths: #1 396, #2 387, #3 356, #4 339, #5 338 characters; two sentences each.

### Notes (no change needed)

- **the-democrats-party: passes.** Every fact is in the sub-section ("national state of emergency", task force with "broad powers" including the Shin Bet, "The platform does not mention holding suspects without trial"). "a Democrats-led government" uses the party's name where the brief prefers "the party"; it is the research's own phrase and was in the earlier checked text.
- **the-reservists: passes.** "10-point plan", "the eighth front", the new Shin Bet division, the August 2026 plan and "The party's published plans do not mention holding suspects without trial" are all in the sub-section. "what it calls the eighth front" is unquoted but attributed.
- **yesh-atid: passes.** "The evidence is mixed", the party's and the list's 2026 plans, "alongside the police" and "do not mention detention without trial" are all in the sub-section. The text names the Together joint list but does not say the party runs on it; the sibling texts of this issue do the same, so it was left.
- **zehut:** "2026 platform": the sub-section says only "The platform"; the year comes from the document's opening section and was already in the earlier checked text.
- **Wording for the detention element.** All eight texts now use the glossary term "holding someone without trial". That is fine in the three "does not mention" texts (the-democrats-party, the-reservists, yesh-atid) and in zehut, which opposes administrative detention in general. The option's own words are narrower ("hold any suspected crime boss … without trial"); findings 3 and 4 are where the wider wording changes what "the research found". If one wording is wanted everywhere except zehut, "holding suspects without trial" (the research's usual phrase) can replace "holding someone without trial" in the three passing texts with no other change.

## What was verified

1. Complete: n/a beyond scope; the one option entry exists in all eight files.
2. Label recorded correctly: all eight `agreement` values are `partially`, equal to the script output.
3. Text fits the label: seven say "part of your answer" outright; national-union-tkuma does not (finding 1).
4. Grounded: every fact, date, name and attribution compared with the sub-section. Two "research found no position" sentences rest on silence (findings 1, 2); two are wider than the research (3, 4). Government decision of 15 July 2026 is attributed to the government in likud-party and national-union-tkuma, not to the party.
5. Strongest evidence: Action first where one exists (likud-party, national-union-tkuma); platform or plan elsewhere. No dated-background item used.
6. Fair and neutral: no value words, no comparison with other parties; "mixed" appears only where the research says so (yesh-atid, yesodot-yisrael).
7. Glossary: "the Shin Bet (Israel's internal security service)", "Arab society" / "Arab communities", "holding someone without trial"; no `avoid` term.
8. No poll figures.
9. Form: two sentences each, 262 to 351 characters; day-first dates; no IDs, citations or Markdown. People: Netanyahu, Smotrich and Tropper have full name and role; Hendel has no role (finding 2).
10. Unclear texts: none in scope.
11–14. Points: not in scope.
15. Labels: none contradicted by the research. One row for the orchestrator to confirm: eretz-yisrael-shelanu (see A).

## Applied (orchestrator, 2026-10-13)

All five replacements were pasted as given. In the three texts that passed unchanged, "holding someone without trial" was changed to "holding suspects without trial" so the eight texts use one wording (zehut keeps the glossary phrase, where it explains administrative detention). The optional point on eretz-yisrael-shelanu was left as it is: its row follows the research's closest-option line, which states both elements.
