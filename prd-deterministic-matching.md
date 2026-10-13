# PRD: Deterministic matching and two party tiers

Decided in the owner discussion of 2026-10-12. This document changes parts of `prd-israeli-election-party-matcher.md` (the "original PRD"). Everything in the original PRD that this document doesn't mention stays as it is. Where the two disagree, this document wins.

## Goal & motivation
The original PRD has an AI model read each user's answers and produce the match when they submit. That costs money per result (the plan estimated about $0.03–0.17 each, so $3k–17k for 100,000 results), needs abuse protection and a spending cap, and sends users' answers to a third-party AI provider.

This change removes AI from the live site. The match is worked out by fixed rules from content prepared and reviewed before launch.

- **No cost per result**, however many people use the site.
- **The same answers always give the same result.**
- **Every sentence a user reads in a result was written and independently checked before launch.**
- **Any result can be explained exactly:** which answers and which reviewed values produced it.

The owner accepts what this costs: users can no longer write their own answers, and the result explanations are fixed texts instead of text written for each user.

A second change comes with it. Only the 28 parties researched so far are matched. The other 24 parties on the ballot are listed on the site but are not researched and not matched.

## User-facing behavior

### Survey flow
- The flow becomes: ranking → answers → result. **The "Anything else?" step is removed.**
- Step 1 (ranking) is unchanged.

### Step 2: Answering each issue
- For each issue the user **picks exactly one of the preset options**. Options can't be edited, and there is no write-your-own field.
- Unchanged: one issue at a time in ranked order, "doesn't matter" issues skipped, shuffled option order, progress indicator, back button.

### Result
- **The top five parties are shown in full, and a "show all" control opens the rest of the researched parties in order (owner decision 2026-10-13).** The rest appear as compact rows, each of which opens to the same per-issue breakdown. A short line says that parties close together in the list are about equally near. The weak-match message refers to the top result only. Share links still carry only the top few.
- Unchanged (apart from "start over", below): the per-issue breakdown with how much each issue weighed, links to research pages, joint-list labelling, the limited-information flag, the weak-match message, the poll notes and their blackout rules, the disclaimer and sharing.
- **Per-issue explanations are fixed texts.** For a given party, issue and chosen option, every user sees the same 1–2 neutral sentences, saying whether the party agrees, partly agrees or disagrees, or that its position is unclear. "Position unclear" is also shown, instead of "disagrees", when the research has only a tentative indication of the party's position and the user chose an option that indication doesn't point to (owner decision 2026-10-13). Each links to the relevant part of the party's research page.
- **New: "also worth knowing" points.** Each recommended party shows 2–3 short points about its most notable positions outside the 10 issues: the things the party stands out for (for example, a party that strongly pushes to legalise cannabis). They are the same for every user, they link to the research page, and they don't affect the score.
- **New: a note that not every list is matched.** The result states plainly that some lists on the ballot were not included in the matching, with a link to them.
- The result appears without a noticeable wait.
- **"Start over" is offered (owner decision 2026-10-13).** The original product offered no "try again" on the result page because every result cost AI money. Matching now costs nothing, so the result page has a secondary "Start over" button near sharing, the intro shows "Start over" next to "Continue where you left off" when there is saved progress, and the survey screens have a small "Start over" control that asks for confirmation first. Starting over discards the saved survey and opens a new, empty one at the ranking step; it is counted as a new survey in the anonymous counts. The intro treats a saved survey as progress only if the user actually did something in it. The result page still has no "edit answers". This replaces the original PRD's rule that the result page doesn't offer "try again".

### Parties section: two tiers
- **Researched and matched (28 parties):** as in the original PRD, with a full research page.
- **Listed only (24 parties):** the party page shows the official details already held (name, list, ballot letters, leader, top candidates) and a link to the party's own platform or website where one exists. The link is labelled as the party's own material that the site has not checked. The platform text is not reproduced on the site.
- Every listed-only page carries the same standard note: this party was not researched in depth and is not included in the matching. The note doesn't mention polls or the threshold, so it can stay up through the poll blackout.
- The Parties list stays alphabetical with both tiers together. Each entry makes clear which tier it is in.
- The tiers are simply "researched" and "not researched". There is no polling cut-off that moves a researched party out of the matching.

### Site copy
- **How this works** explains the new matching method in plain language. It also says plainly that not every list was researched in depth and that the others are shown with official details only. **It does not state the criterion (owner decision 2026-10-13):** the lists were chosen by their polling level when the research was done, and publishing that would let the "official details only" label be read as a poll result during the poll blackout.
- **Privacy & Terms** no longer mentions a third-party AI provider.
- All copy that mentions AI matching, free-text answers or "anything else" is updated, with Hebrew and English kept in parity.

## Functional requirements

Numbers continue from the original PRD.

### Changes to original requirements
- **FR8 is replaced.** The 28 parties researched as of 2026-10-08 are the matched set. Every party in it can be recommended. The other 24 parties are listed only and can never be recommended.
- **FR15 is changed.** Issues ranked higher carry more weight and "doesn't matter" issues carry none. The "anything else" part is removed.
- **FR19 becomes a hard requirement.** Identical answers against identical content always produce the identical result, including the order of runners-up.
- **FR20 is removed.** There are no free-text answers.
- FR16 (only the published research), FR17 (actions outweigh words) and FR18 (polls, size and threshold play no role) still apply. They are now met when the matching content is prepared, not when a user submits.

### Matching content prepared before launch
29. **Party positions.** For every matched party and every issue, the content records which option the party holds as its main position, any secondary position, or that its position is unclear. This comes only from that party's research document and follows its evidence ranking and the recency rule (evidence from 2021 onwards and the current leadership).
30. **Distance between options.** For every issue, the content records how close each option is to each other option. This is one judgement per pair of options, shared by all parties.
31. **Scores are derived, not hand-assigned.** How well a party fits a user's chosen option follows from requirements 29 and 30. Two parties recorded with the same position on an issue always get the same score on it. Nobody sets a party's score on an option directly.
32. **Positions are placed issue by issue.** All matched parties are placed on one issue together, side by side, so the same label means the same thing for every party. A separate reviewer, who didn't do the placing, checks each issue.
33. **Explanation texts.** Every explanation is neutral, in both languages, and grounded only in that party's research section for that issue.
34. **"Also worth knowing" points** come from the "Other notable positions" section of the party's research page. They are the 2–3 positions the party is most distinctively known for, preferring ones backed by actions, chosen by the same rule for every party. Legal matters and coalition statements are not used. A separate reviewer, who didn't write them, checks each for neutrality and that it traces back to the research page. The owner does not review these (owner decision 2026-10-13).
35. **Independent review, not owner review (owner decision 2026-10-13).** The owner does not review any content: party positions, option-distance grids, explanation texts or "also worth knowing" points. The owner has no special knowledge of the parties, and the content must not carry anyone's personal view. Instead, every piece of content is checked by a separate reviewer that didn't produce it, against the research documents. The owner decides product and user-experience questions only. This also replaces the owner's review of the research corpus planned in the original plan.

### Matching rules
36. A party's result is the weighted combination of its per-issue scores, using the user's ranking as weights.
    - **Explicitly rejected options (owner decision 2026-10-13):** where the research records that a party rejected the option the user chose, for example by voting against it, the result shows "disagrees" and the party's score on that issue is limited to the level of a disagreement, even if the option is close to the one the party holds.
    - **Unclear positions (owner decision 2026-10-13):** where a party's position on an issue is unclear, it gets a small fixed partial score, about a quarter of a full match, and the explanation says the position is unclear. The issue is not skipped, because skipping would let a party with few known positions reach a perfect score on those alone. It is not zero, because zero would treat "unknown" the same as "known to disagree". The exact value is settled in the profile test.
37. Ties are broken by a fixed, documented rule that has nothing to do with polls or party size.
38. The weak-match message appears when the best score is below a set level. The level is settled during pre-launch testing.

### Pre-launch checks
39. **Self-match test.** For every matched party, an invented voter who answers exactly as that party is recorded must get that party as the top match.
40. **Profile test.** A small set of typical voter profiles is written, each with the result the research says it should get, before the scores are seen. The profiles are then run, and a separate reviewer checks every mismatch.
41. **Completeness check.** The site can't be published if any party, issue or option is missing a position, a score or an explanation in either language.

### Listed-only parties
42. Listed-only pages show only registry facts and the labelled link. They make no claims about the party's positions. A party with no platform or website shows the registry facts and the standard note only.

### Where matching runs
43. **Matching runs on the user's own device (owner decision 2026-10-13).** The user's answers never leave it. The only things sent are anonymous counts for the owner: that a survey was started, and which parties came out as top match and runners-up (original FR26, extended by the owner on 2026-10-13 to include a count of surveys started). Neither contains answers or anything that identifies the user. The count is of surveys started, not of unique people.

## Non-functional requirements
- **Cost protection** (original PRD): no longer needed for matching, because no result costs money.
- **Perceived latency:** the result appears immediately.
- **Trust and privacy:** unchanged, and stronger. Answers are not sent anywhere; they stay on the user's device.

## Scope & impact on existing product
- The survey loses option editing, the write-your-own field and the "Anything else?" step, all of which are built today.
- The result page gains the "also worth knowing" points, the note about lists that aren't matched, and "Start over"; the intro and the survey screens gain "Start over" too.
- The Parties section and party pages gain the listed-only tier.
- Site copy approved by the owner (How this works, Privacy & Terms, intro and survey texts) changes in both languages. The owner approves the new copy, as a product decision.
- The planned AI matching, the choice of AI provider and model (decision gate D1), and the abuse and spending protections tied to AI cost are dropped.
- Research still owed for the 28 matched parties is unchanged: the cross-party consistency review, the Hebrew editions and the audits. The research of the 24 small parties is cancelled.

## Out of scope
- Free-text answers, edited options and the "Anything else?" step.
- "Edit answers" on the result page: going back into the answers of a survey whose result has been shown. ("Start over", a new empty survey, is in scope: owner decision 2026-10-13.)
- Any AI call when a user takes the survey or views a result.
- Result explanations written for an individual user.
- Researching or matching the 24 listed-only parties.
- Reproducing any party's platform text on the site.
- A polling cut-off that decides which researched parties are matched.

## Open questions
None. All questions raised in the discussion were decided by the owner on 2026-10-12 and 2026-10-13.
