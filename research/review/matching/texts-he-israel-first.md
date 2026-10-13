# Hebrew texts parity check: israel-first

- Checked on 13 October 2026 by a Stage 7d parity checker (not the author of the Hebrew file)
- Hebrew texts by: Stage 7d author (Sonnet) · Parity check by: Stage 7d parity checker (Opus) (different)
- Structure, agreement values and anchors: identical ✔ (checked by script: both files equal once `lang` and every `text` are removed; `lang` is `he`)
- Texts compared: 34 option texts + 2 unclear + 3 points · must-fix: 0 · should-fix: 7, all fixed · notes: 6
- Result: pass after fixes (all 7 findings fixed; fix round re-checked on 13 October 2026)

## Findings

| # | Issue / option, or point | Severity | English says | Hebrew says | Suggested Hebrew | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|---|
| 1 | whole file (15 quoted passages: cost-of-living / open-market-competition-imports; gaza / resume-fighting-full-control; haredi-enlistment / anchor-torah-study-exemption, gradual-targets-by-agreement, universal-service-with-sanctions, voluntary-service-for-all; iran-and-regional-security / military-pressure-until-threats-removed, force-plus-us-backed-agreements, prioritize-ending-multifront-war, end-military-operations-regional-peace; judea-samaria / full-sovereignty, partial-sovereignty-area-c, separation-two-states, two-states-pre-1967-border; point other-reservists-veterans-and-war-injured) | should-fix (structure: quotation-mark style) | straight "…" | curly “…” (30 marks; israel-first is the only Hebrew texts file using curly quotes) | Replace every `“` and every `”` in the file with a straight `"` (written `\"` inside the JSON string). Straight quotes are what 11 of the other Hebrew texts files use (the other 4 that quote use ״…״, none use curly). The quoted words themselves stay unchanged. | fixed: all 30 curly marks replaced with straight \" (0 curly left); quoted words unchanged |
| 2 | gaza / resume-fighting-full-control | should-fix (names and roles; both languages) | "…the position of Jonathan Pollard, who has joined the party but is not on its list, to remove…" | "…שעמדתו של ג׳ונתן פולארד, שהצטרף למפלגה אך אינו ברשימתה, להוציא…" | The research's leadership section supports a role: "Jonathan Pollard, a former US Navy civilian intelligence analyst, announced on 23 August 2026 that he was joining Israel First". English: replace "the position of Jonathan Pollard, who has joined the party but is not on its list," with "the position of Jonathan Pollard, a former US Navy civilian intelligence analyst who has joined the party but is not on its list,". Hebrew: replace "שעמדתו של ג׳ונתן פולארד, שהצטרף למפלגה אך אינו ברשימתה," with "שעמדתו של ג׳ונתן פולארד, לשעבר אנליסט מודיעין אזרחי בצי האמריקאי, שהצטרף למפלגה אך אינו ברשימתה,". (Spelling ג׳ונתן פולארד is confirmed: `content/research/he/israel-first.md` writes "ג'ונתן פולארד"; keep ׳ as the file does elsewhere.) | fixed: suggested text applied exactly in both languages (see "English names completed") |
| 3 | gaza / advance-international-arrangement, defeat-hamas-then-security-control; iran-and-regional-security / prioritize-ending-multifront-war, end-military-operations-regional-peace; judicial-system / broad-agreed-constitutional-framework, repeal-changes-protect-independence, keep-current-system-stability | should-fix (naturalness) | "The tentative indication is…" / "its tentative indication is…" | "הסימן לא ודאי לעמדתה הוא…" (reads as "the sign is uncertain to its position is…"; the adjective lacks its article) | In all 7 texts replace "הסימן לא ודאי לעמדתה הוא" with "הסימן הלא ודאי לעמדתה הוא". Nothing else changes. | fixed: suggested text applied exactly |
| 4 | religion-and-state / strengthen-jewish-character, separate-religion-and-state | should-fix (naturalness; hedging attached to the inference) | "the tentative indications are…" / "The tentative indications are…" | "הסימנים לא ודאיים: …" (a sentence of its own saying "the indications are uncertain") | In both texts replace "הסימנים לא ודאיים:" with "הסימנים הלא ודאיים לעמדתה הם:". | fixed: suggested text applied exactly |
| 5 | cost-of-living / cut-taxes-and-government-spending | should-fix (meaning drift, minor) | "a budget law freezing tax updates and setting a surtax" | "חוק תקציב שהקפיא עדכוני מסים והטיל היטל" ("היטל" is a levy, not a surtax) | Replace "והטיל היטל" with "והטיל מס יסף". | fixed: suggested text applied exactly |
| 6 | october-7-inquiry / commission-chosen-by-neutral-mechanism | should-fix (naturalness) | "and three members chosen by survivors and bereaved families" | "ושלושה חברים שייבחרו ניצולים ומשפחות שכולות" (passive verb with no agent marker) | Replace "ושלושה חברים שייבחרו ניצולים ומשפחות שכולות" with "ושלושה חברים שייבחרו בידי ניצולים ומשפחות שכולות" (as the knesset-balance text already says). | fixed: suggested text applied exactly |
| 7 | point other-reservists-veterans-and-war-injured | should-fix (meaning drift: tense) | "a voice for people who serve" | "כקול של מי ששירתו" ("those who served", past) | Replace "המפלגה מציגה את עצמה כקול של מי ששירתו:" with "המפלגה מציגה את עצמה כקולם של מי שמשרתים:". | fixed: suggested text applied exactly |
| N1 | religion-and-state / more-choice-local-decisions | note | "the party's leader, Sharren Haskel, then a coalition MK, voted against Shabbat transport bills in November 2025" | "וראש המפלגה, שרן השכל, אז חברת כנסת בקואליציה, הצביעה נגד הצעות חוק לתחבורה בשבת בנובמבר 2025" | none; matches (see "English names completed"). | — |
| N2 | religion-and-state / more-choice-local-decisions | note | "because nothing covers marriage or kosher certification" | "משום שאין מידע בנושא נישואים או תעודות כשרות" | none needed; same meaning in context. | — |
| N3 | judicial-system / continue-judicial-changes | note (hedging) | "places it here only tentatively" | "ממקם אותה כאן רק בהסתייגות" | none; the subject is the research, so the hedge describes the inference, and no "זמני". | — |
| N4 | cost-of-living / cut-taxes-and-government-spending | note | "and before these statements" | "וטרם הדברים האלה" | none needed ("ולפני הדברים האלה" would be plainer). | — |
| N5 | crime-in-arab-society (unclear) | note (glossary) | "crime in Arab communities" | "הפשיעה בחברה הערבית" | none; "החברה הערבית" is a glossary form for Arab society / communities. | — |
| N6 | all texts | note | — | — | Every "tentative" kept as "לא ודאי" or "בהסתייגות", never "זמני/זמנית"; no "ככל הנראה"; dates day first; every English quotation (15) is quoted in Hebrew; no "נחקרה"/"שנחקרו". | — |

## English names completed

`git diff HEAD -- content/matching/texts/en/israel-first.json` shows exactly one change, and it is a names-and-roles edit:

| Text | Edit | Date the text speaks of | Verified against | Hebrew | Status |
|---|---|---|---|---|---|
| religion-and-state / more-choice-local-decisions | "the party's leader voted against…" → "the party's leader, Sharren Haskel, then a coalition MK, voted against…" | November 2025 (19 November 2025 votes) | `content/registry/parties.json`: israel-first leader "Sharren Haskel" / "שרן השכל"; `lists.json`: list No. 1 Sharren Haskel. Research leadership section: New Hope rejoined the government in September 2024; she was deputy foreign minister from 2024 until she resigned on 14 July 2026. Religion and state section: "Action (19 November 2025): As a coalition MK, Haskel voted against two bills to run public transport on Shabbat". Role supported for that date. | "ראש המפלגה, שרן השכל, אז חברת כנסת בקואליציה" | confirmed |

| gaza / resume-fighting-full-control (fix round, finding 2) | "Jonathan Pollard, who has joined the party but is not on its list," → "Jonathan Pollard, a former US Navy civilian intelligence analyst who has joined the party but is not on its list," | August 2026 statement | Research leadership section: "Jonathan Pollard, a former US Navy civilian intelligence analyst, announced on 23 August 2026 that he was joining Israel First"; he is not on the CEC list (`lists.json` top candidates do not include him). The role is a former one, so it holds for August 2026. Hebrew spelling ג׳ונתן פולארד matches `content/research/he/israel-first.md`. | "ג׳ונתן פולארד, לשעבר אנליסט מודיעין אזרחי בצי האמריקאי, שהצטרף למפלגה אך אינו ברשימתה" | confirmed |

The fix-round diff of the English file contains only the Pollard edit. No other English change. All other texts already name "party leader MK Sharren Haskel" / "ראש המפלגה, חברת הכנסת שרן השכל" at first mention, and "Prime Minister Benjamin Netanyahu" / "ראש הממשלה בנימין נתניהו" has its role. Jonathan Pollard, the one person without a role in the first round, now has one (finding 2).

## English texts questioned

None.

## What was verified

1. Structure: done by script; partyId, issue order, option IDs, `options`/`unclear` (crime-in-arab-society and housing unclear), 3 points in the same order, `lang` "he".
2. `agreement` values: identical for all 34 options, in English (script comparison).
3. Anchors: identical for all 10 issues and 3 points (script comparison).
4. Meaning: every text read side by side with its English; facts, dates, numbers, names and vote directions match, except the surtax term (5) and the tense in one point (7).
5. Strength and hedging: "tentative", "secondary", "partial", "only partial" kept everywhere; no hedge added; no "זמני".
6. Fits the label: each Hebrew text read alone; agrees/partially/disagrees/unclear texts read as their label; unclear texts imply no stance.
7. Glossary: script check of every `avoid.he` term (no hits); glossary terms used (יהודה ושומרון, החלת ריבונות, ועדת חקירה ממלכתית, היועץ המשפטי לממשלה, בג״ץ, צה״ל, חרדים, שבת).
8. Neutral: no loaded wording found; Pollard's Gaza position rendered as in the research ("להוציא", "להחיל ריבונות").
9. Natural Hebrew: findings 3, 4, 6; user addressed as "בחירתך" throughout (gender-neutral).
10. Form: every text at most 2 sentences (script), points 1 sentence; no poll figures, IDs, citations, links or Markdown; names match the registry (ישראל תחילה, שרן השכל); quotation-mark style inconsistent with the other files (1).

Validation (first round and again after the fix round): `CONTENT_CORPUS=real pnpm validate:content` passed (content validation, self-match and profile tests); no error from the israel-first Hebrew file.
