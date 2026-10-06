# PRD: Israeli Election Party Matcher

## Goal & motivation
A non-partisan web app that helps Israeli voters find the party whose positions best match their own in the upcoming Knesset election (due by late October 2026).

The voter ranks the most pressing issues in Israeli society by personal importance and states their position on each. They then get a recommendation: their best-matching party, plus the closest alternatives, with a clear explanation of why.

- **Scope in time:** a one-off product for this election only. The issues and party research are compiled once for this election. Reuse in future elections is not a goal.
- **Timeline:** ready to launch within about 2 days, in Hebrew and English.
- **Who it's for:** any eligible Israeli voter, including users who are not tech-savvy. Most will be on mobile.
- **Success:** users find the result understandable and fair, whichever party it lands on. Credibility and neutrality matter more than traffic.
- **Neutrality stance:** the tool is strictly non-partisan. It has no party affiliation and no ads, and no party pays for or influences anything. It presents results as "the best match to your stated positions," not "who you should vote for," with a disclaimer that it is a decision aid, not an endorsement.

## User-facing behavior

### Site sections
- **Intro screen:** explains what the tool is, the neutrality stance, a short plain-language privacy note ("We don't save your answers. We only count anonymous results."), the approximate time to complete (about 5–10 minutes), and a prominent start button. The note links to a Privacy & Terms page.
- **Survey flow:** ranking → answers → "anything else" → result.
- **Parties section:** reachable from anywhere on the site. Lists every party on the ballot alphabetically (in the current language). Each entry links to that party's full research page. Open to everyone, no survey needed.
- **Privacy & Terms page:** states that answers are not stored, that only anonymous result counts are kept, and that answers are processed by a third-party AI provider (named once chosen).
- **"How this works" page:** explains how the 10 issues were chosen, how the parties were researched, how matching works, and the tool's limitations, stated honestly.
- **Language switch** on every page (Hebrew / English).

### Step 1: Ranking issues
- The user sees 10 issues. These are the most pressing issues in Israeli society right now, chosen by importance rather than limited to any topic area (e.g., approach to Gaza/Palestinians, cost of living, Haredi military enlistment, religion and state).
- The issues start in an unranked pool, in a **random order shuffled freshly for each user**, so no default order influences the choice.
- The user moves issues into a ranked list from 1 (most important) to 10. On desktop this is drag-and-drop. On mobile, an equally easy interaction (e.g., tap to add, drag to reorder).
- Each issue card shows a one-line neutral description and an optional "more info" with a short neutral explanation of what the issue is about.
- The user can mark **up to 5** issues as "doesn't matter to me". These are excluded from the ranking, and the user isn't asked about them.
- Every remaining issue must be ranked, with no ties. The user can reorder freely until they continue.

### Step 2: Answering each issue
- The user answers their issues one at a time, in their ranked order. "Doesn't matter" issues are skipped.
- A progress indicator is shown (e.g., "4 of 8"), with a back button to revise earlier answers within the survey.
- Each issue shows a short neutral framing of the question and the **3–4 most common real-world positions** on it. Where the issue naturally lies on a spectrum (e.g., hawkish to dovish), the options reflect that. Where it doesn't, they are distinct approaches.
- Option order is shuffled for each user.
- **Each preset option is already an editable text field**, with no separate "edit" action needed. The user can pick an option as written, adjust its wording directly (e.g., "option B but with this change"), or write their own answer in a free-text field.
- What gets submitted for each issue is simply the user's final text answer. Since edited options are just text, there is no letter-based referencing, and the shuffling causes no ambiguity.
- Answers that are gibberish or unrelated are **silently ignored** for matching. The user is not blocked and gets no feedback about them.

### Step 3: "Anything else?"
- One final optional step asks: "Is there anything else important to you that wasn't covered here?" with a free-text field.
- If the user writes something, they also indicate how important it is compared with their ranked issues (e.g., more important than my top issue / about the middle / minor).
- Skipping this step has no effect on the result. Unusable text is silently ignored.

### Step 4: Result
- **Top match plus the next 2–3 closest parties.**
- For each recommended party, an explanation broken down by issue: where the party agrees with the user, where it doesn't, and how much the user's ranking weighted each issue. If the user filled in "anything else", the explanation addresses how the parties relate to it where the research has relevant information.
- Each recommended party links to its full research page.
- **Below-threshold note:** a purely factual note when a party's list is polling below the electoral threshold (3.25%), shown with the date of the polling data and with no "don't vote for them" framing. The threshold applies to the list as a whole.
- **Not-polled note:** for lists that don't appear in any published poll, a purely factual note: "This list doesn't appear in published polls."
- **Joint lists:** if a recommended party runs on a joint list, it is clearly labelled (e.g., "Running on a joint list with [Party B] as [list name], ballot letters [XX]"). The partner party is shown clearly with a link to its research page, but gets no separate match score or explanation. A partner party can also appear among the recommendations on its own merits, labelled the same way.
- **Weak matches:** if no party matches the user well, the result says so honestly (e.g., "No party closely matches your positions. These are the closest."), rather than presenting a weak match as strong.
- A clear disclaimer that this is a decision aid, not an endorsement.
- **Actions available on the result:** read party research pages and **share**. The share content shows only the top match(es) and an invitation to take the survey, never the user's answers.
- The result page does **not** offer or suggest "edit answers" or "try again". A user who really wants to can restart by refreshing, but the product doesn't encourage it.
- While the result is being prepared, the user sees a clear loading state.

### After the election
- Once polls close on election day, the survey is turned off. The site shows that the election is over, and the Parties section and research pages remain available as an archive.

## Functional requirements

### Issues and answer options
1. The 10 issues are compiled through research into what is currently most pressing in Israeli society. They are not restricted by topic.
2. Each issue has a one-line neutral description, a short neutral "more info" explanation, a neutral question framing, and 3–4 options representing the most common real-world positions.
3. **Israeli-neutral terminology:** wording uses the terms mainstream Israelis treat as normal and neutral (e.g., "Judea and Samaria", "settlements"), in both Hebrew and English, since the English version also serves Israeli voters.
4. Options describe a policy approach and its stated rationale, not a value judgment. Each option is written so that its own supporters would recognise it as fair.
5. Hebrew and English versions are written as equivalents, each phrased to read as neutral to its audience while keeping the same meaning, not as literal translations.
6. The owner reviews the 10 issues and their options (both languages), along with why each issue was chosen, and approves them before they are locked. Party research starts only after approval.
7. Before launch, an independent neutrality review (separate from the drafting) checks issues, descriptions and options for language loaded within Israeli discourse and for missing major positions.

### Party research
8. Every list on the ballot is researched, roughly 30-something lists, including micro-parties. Every researched party can be recommended.
9. Parties running together on a joint list are researched and matched **separately**, each with its own research page, and labelled with their joint list, partners and ballot letters.
10. Research is in-depth. It must not be shortened for efficiency, because it is the core of the product's quality. Each party is researched independently of the others.
11. Research focuses on facts, not pre-election propaganda. Evidence is ranked by reliability: **actions** (votes, actions in government, legislation) > **formal commitments** (platform) > **statements** (campaign rhetoric). Where actions contradict statements, this is stated explicitly. Campaign slogans and ads are not treated as evidence of a position unless backed by action or the formal platform.
12. Every party research page follows this structure:
    1. **Overview:** founding, ideology, base of support, current Knesset seats, polling average (with date), joint-list status and partners.
    2. **Leadership and key candidates:** leader and top of the candidate list, with relevant background.
    3. **Position on each of the 10 issues**, with evidence ranked as above.
    4. **Other notable positions** outside the 10 issues.
    5. **Coalition stance:** who they've said they will or won't sit with, and their track record on keeping that.
    6. **Track record:** promises vs. delivery, for parties that have been in government.
    7. **Legal or ethical matters involving leaders:** facts only, such as indictments, convictions or official inquiries, from court or official sources, with no allegations from opinion pieces.
    8. **Sources** for every substantive claim, and a "researched as of [date]" stamp.
    9. **Limited-information flag** where too little public information exists (e.g., no voting record, no published platform). The flag also appears on the result if that party is recommended.
13. For joint-list members, the research page notes the partner(s) and any history of the parties splitting up after elections.
14. Research documents are fixed once compiled. They are corrected or updated only when the owner requests it.

### Matching
15. Issues ranked higher carry more weight. "Doesn't matter" issues carry none. The "anything else" answer carries the importance the user selected.
16. Matching is based **only** on the published research documents. Every claim in a result explanation must trace back to that party's research page, so what users read in results is consistent with what they can verify on the site.
17. Actions outweigh words in matching, consistent with the research evidence ranking.
18. Polling, party size and the threshold play **no role** in the match itself. The threshold appears only as a factual note on the result.
19. Identical answers against identical research data are expected to produce the same recommendation. This is an expected property of a well-built system, not a hard requirement.
20. The matching understands free-text answers in the context of that issue's preset options, including edited versions of them.

### Polling data
21. Polling figures are a snapshot taken at research time. They are refreshed only when the owner requests it, never automatically.
22. Poll numbers, the "below threshold" label and the "not polled" note can be hidden automatically from a configurable date onward, to comply with Israel's restrictions on publishing polls close to election day (see Open questions).

### Privacy and statistics
23. No accounts, no login, no personal details collected.
24. User answers are **never stored**. They are used only to generate the result.
25. Survey progress is kept only on the user's own device, so that closing the tab mid-survey lets them resume. Nothing is sent until they submit.
26. The only data kept is **anonymous tallies of results**: which parties came out as top match and runners-up. These tallies are visible only to the owner and never shown on the site.

### Navigation and content
27. The Parties section lists every party alphabetically in the current language, with no ordering by polls or size.
28. The "How this works" page explains methodology, how the issues were chosen, how research was done, and limitations.

## Non-functional requirements
- **Languages:** Hebrew (default, fully right-to-left) and English, with complete parity of content. English is selected automatically based on browser language, or manually via the switch.
- **Mobile-first:** all interactions, especially ranking, must be easy on phones and usable by non-tech-savvy users.
- **Accessibility:** ranking and answering must be operable without drag-and-drop (e.g., by keyboard or tap alternatives), with readable text and sufficient contrast.
- **Cost protection:** the owner pays for AI usage by default. The product must be protected against abuse (e.g., scripted or repeated submissions) running up AI costs, without adding friction for normal users.
- **Perceived latency:** generating a result may take some seconds. The user sees a clear loading state, and the wait should feel reasonable.
- **Operator anonymity:** the operator is not named anywhere on the site.
- **Trust and privacy:** nothing in the product contradicts the privacy note. Answers are not logged in any form linkable to an individual.

## Scope & impact on existing product
New standalone product. No existing product, users or data are affected.

## Out of scope
- Use in other elections or ongoing reuse across election cycles.
- User accounts, login (apart from the exploratory AI sign-in idea), and saved results or history.
- Storing user answers in any form.
- "Edit answers" or "try again" prompts on the result page.
- A separate match score or explanation for joint-list partner parties.
- Public display of usage or result statistics.
- Automatic, periodic refresh of polling data or research documents.
- Ads, sponsorships, or any party involvement.
- Ordering or filtering parties by polling or size.
- Feedback to users about the quality or usability of their free-text answers.

## Open questions
1. **Users paying for their own AI usage — checked, not viable.** OpenAI's "Sign in with ChatGPT" plan usage (launched 2026-09-29) works only for paid ChatGPT subscribers, requires OpenAI approval for hosted apps, and restricts the kind of AI requests allowed. Default stands: the owner pays.
2. **Poll-publication restrictions.** Israeli election law restricts publishing poll results in the days before election day. Research the exact rules, and the date from which poll numbers and the "below threshold" label must be hidden. Also check whether election-day campaigning rules affect the tool at all.
