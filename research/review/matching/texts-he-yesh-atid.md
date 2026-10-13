# Hebrew texts parity check: yesh-atid

- Checked on 13 October 2026 by a Stage 7d parity checker (not the author of the Hebrew file)
- Hebrew texts by: Stage 7d author (Sonnet) · Parity check by: Stage 7d parity checker (Opus) (different)
- Structure, agreement values and anchors: identical ✔
- Texts compared: 41 option texts + 0 unclear + 3 points · must-fix: 0 · should-fix: 11 (F1 covers 23 texts), all fixed · notes: 10
- Result: pass (all 11 findings fixed; fix round re-checked on 13 October 2026)

## English names completed

| Text | Edit | Verified against | Status |
|---|---|---|---|
| gaza / defeat-hamas-then-security-control | "Bennett, the joint list's leader" → "Naftali Bennett, the joint list's leader" (the only change in `git diff HEAD -- content/matching/texts/en/yesh-atid.json`) | `content/registry/lists.json`: list "together", name "Together (B'Yachad) led by Naftali Bennett", first top candidate Naftali Bennett. Research "Leadership and key candidates": "The list is headed by Naftali Bennett (No. 1)". Name and role supported. Hebrew matches: "נפתלי בנט, ראש רשימת ביחד". | confirmed |

| F1.1–F1.23 (the 23 texts in the F1 table) | ", Yair Lapid," added at the first mention of the party's leader. In the four possessive cases ("Its leader's / the party leader's March 2025 plan") the phrase becomes "the March 2025 plan of its leader / the party's leader, Yair Lapid,". | `content/registry/parties.json` yesh-atid `leader` "Yair Lapid"; research leadership section: "Leader: Yair Lapid". Role "the party's leader" supported. In separation-two-states, "As prime minister, the party's leader, Yair Lapid," is also supported: the leadership section says he was "prime minister from mid-2022 until the next government took office". | confirmed |

Verified by script: once these insertions are removed, every English text equals the committed version. `agreement` values, anchors and points are unchanged. There is no other change to the English file.

## Findings

| # | Issue / option, or point | Severity | English says | Hebrew says | Suggested Hebrew | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|---|
| F1 | 23 texts (listed in the table "F1: missing name" below) | should-fix (names and roles) | "the party's leader" / "its leader" / "the party leader's", with no name | "ראש המפלגה", with no name | Add Yair Lapid's name at first mention in each text, in English and Hebrew, exactly as in the F1 table. Name from `content/registry/parties.json` (yesh-atid `leader`: "Yair Lapid" / "יאיר לפיד") and the research leadership section ("Leader: Yair Lapid"). Each text is shown alone, so a role without a name leaves the voter not knowing who is meant. | fixed (all 23 texts, both languages; re-read in full) |
| F2 | gaza / resume-fighting-full-control | should-fix (meaning drift) | "the joint list's plan says Israel has no interest in running Gaza" | "שלישראל אין עניין לשלוט ברצועה" ("control/rule", which echoes the option's "full control" more than "running" does) | "התוכנית של רשימת ביחד קובעת שלישראל אין עניין לנהל את הרצועה." | fixed (re-read in full, applied as suggested) |
| F3 | haredi-enlistment / gradual-targets-by-agreement | should-fix (naturalness) | "The party shares the aim … but not the gradual, agreed route." | "המפלגה מסכימה למטרה … אבל לא את המסלול ההדרגתי והמוסכם." (the prepositions don't match: "מסכימה ל…" / "לא את …") | "המפלגה שותפה למטרה לשלב חרדים בשירות ולקצץ בכספי המדינה למי שלא מתגייס, אבל לא למסלול ההדרגתי והמוסכם." | fixed (re-read in full, applied as suggested) |
| F4 | housing / direct-help-for-buyers | should-fix (meaning drift) | "housing programs for young families" | "תוכניות דיור לזוגות צעירים" ("young couples") | "…כללה תוכניות דיור למשפחות צעירות." | fixed (re-read in full, applied as suggested) |
| F5 | iran-and-regional-security / prioritize-ending-multifront-war | should-fix (meaning drift: concession lost) | "In June 2026 he did say that war alone cannot become the automatic response to every problem." ("did" marks this as a concession against the label) | "ביוני 2026 הוא אמר שמלחמה לבדה לא יכולה להיות התגובה האוטומטית לכל בעיה." | "ביוני 2026 הוא אמנם אמר שמלחמה לבדה לא יכולה להפוך לתגובה האוטומטית לכל בעיה." | fixed (re-read in full, applied as suggested) |
| F6 | judea-samaria / separation-two-states, two-states-pre-1967-border, one-equal-state | should-fix (naturalness / meaning drift) | "on condition that the Palestinian state be peaceful" | "בתנאי שהמדינה הפלסטינית תהיה שלווה" ("calm, tranquil") | In all three texts: "בתנאי שהמדינה הפלסטינית תהיה שוחרת שלום" | fixed (re-read in full, applied as suggested) |
| F7 | judicial-system / broad-agreed-constitutional-framework | should-fix (naturalness / glossary) | "a constitution including a Basic Law: Legislation" | "לחוקה שכוללת חוק יסוד (חוק במעמד חוקתי): החקיקה" (the explanation splits the law's name) | "המצע של המפלגה מתחייב לחוקה שכוללת את חוק יסוד: החקיקה (חוק במעמד חוקתי), ורשימת ביחד אמרה…" | fixed (re-read in full, applied as suggested) |
| F8 | religion-and-state / keep-status-quo | should-fix (glossary) | "The party would keep the Rabbinate" | "המפלגה תשאיר את הרבנות" | "המפלגה תשאיר את הרבנות הראשית, וזה חופף לתשובה שבחרת…" (glossary `chief-rabbinate`) | fixed (re-read in full, applied as suggested) |
| F9 | religion-and-state / separate-religion-and-state | should-fix (glossary) | "state Orthodox conversion according to Torah law" | "גיור אורתודוקסי ממלכתי לפי ההלכה" | "…תומכת גם בגיור אורתודוקסי ממלכתי לפי ההלכה (החוק הדתי היהודי)." (glossary `jewish-religious-law`) | fixed (re-read in full, applied as suggested) |
| F10 | point other-reservists | should-fix (meaning drift) | "The joint list's 'Those Who Serve Law' would give …" (a proposal) | "״חוק המשרתים״ של רשימת ביחד היה נותן …" (reads as counterfactual, "would have given") | "״חוק המשרתים״ של רשימת ביחד ייתן למשרתי מילואים ולמי ששירתו הטבות שכוללות …" (rest unchanged) | fixed (re-read in full, applied as suggested) |
| F11 | iran-and-regional-security / military-pressure-until-threats-removed | should-fix (naturalness: unclear referent) | "It differs on deals: the joint list also pledges …" ("It" = the party) | "היא שונה בעניין הסכמים: רשימת ביחד מתחייבת…" ("היא" can be read as the list just mentioned) | "המפלגה שונה בעניין הסכמים: רשימת ביחד מתחייבת גם לחזק את הסכמי אברהם ולקדם נורמליזציה עם סעודיה." | fixed (re-read in full, applied as suggested) |
| N1 | gaza / defeat-hamas-then-security-control | note | English names edit (see above) | "נפתלי בנט, ראש רשימת ביחד" | none | — |
| N2 | all texts that mention the joint list | note | "the joint list" / "the Together joint list" | "רשימת ביחד" | none. It is the same referent (registry list "together", Hebrew name "ביחד בראשות נפתלי בנט"), it adds no claim, and it avoids confusion with the party "הרשימה המשותפת". | — |
| N3 | law names | note | "Those Who Serve Law", "Judicial Selection Law", "reasonableness amendment", "Judicial Selection Committee amendment", "the Basic Law declaring Torah study a foundational value" | "״חוק המשרתים״", "חוק בחירת שופטים", "התיקון בעניין עילת הסבירות", "התיקון בעניין הוועדה לבחירת שופטים", "חוק היסוד … שקובע שלימוד תורה הוא ערך יסוד" | none. The meaning is the same, there is no article inside a law's name, and the quotation marks are kept on the quoted name. | — |
| N4 | crime-in-arab-society (3 texts), haredi-enlistment (2 texts) | note | "the Shin Bet" / "the Basic Law", with no explanation in some texts | Each Hebrew text gives the glossary's explanation in parentheses | none. The glossary explains the term at first use, and each text is shown alone. | — |
| N5 | judea-samaria (sovereignty texts) | note | "apply sovereignty" | "החלת ריבונות ישראלית" | none. This is the glossary term. | — |
| N6 | religion-and-state / keep-status-quo | note | "'dead, buried'" | "״מת וקבור״" | none. The quotation is kept, and the "ו" is natural Hebrew. | — |
| N7 | gaza / resume-fighting-full-control | note | one sentence | two sentences | none. The text is within the 2-sentence limit. | — |
| N8 | crime-in-arab-society / more-police-resources-normal-law | note | "the party's record in government included large investment in Arab communities" | "בתקופה שבה הייתה בממשלה המפלגה השקיעה סכומים גדולים ביישובים הערביים" | none. The meaning is the same. | — |
| N9 | point other-education | note | "compulsory core studies" | "לימודי ליבה חובה" | optional: "לימודי ליבה כחובה" | — |
| N10 | judea-samaria / separation-two-states | note | "As prime minister … on 22 September 2022" | "כראש ממשלה … ב־22 בספטמבר 2022" | none. The role is supported (see "English texts questioned"). | — |

### F1: missing name (English and Hebrew replacements)

Change the first mention only. Leave the rest of each text as it is.

| # | Text | English: replace → with | Hebrew: replace → with |
|---|---|---|---|
| F1.1 | cost-of-living / cut-taxes-and-government-spending | "Its leader's March 2025 economic plan called for" → "The March 2025 economic plan of its leader, Yair Lapid, called for" | "בתוכנית הכלכלית של ראש המפלגה ממרץ 2025" → "בתוכנית הכלכלית של ראש המפלגה, יאיר לפיד, ממרץ 2025" |
| F1.2 | cost-of-living / direct-support-for-households | "in its leader's March 2025 plan" → "in the March 2025 plan of its leader, Yair Lapid" | "בתוכנית של ראש המפלגה ממרץ 2025" → "בתוכנית של ראש המפלגה, יאיר לפיד, ממרץ 2025" |
| F1.3 | gaza / resume-fighting-full-control | "its leader sponsored" → "its leader, Yair Lapid, sponsored" | "ראש המפלגה יזם" → "ראש המפלגה, יאיר לפיד, יזם" |
| F1.4 | gaza / advance-international-arrangement | "the party's leader sponsored" → "the party's leader, Yair Lapid, sponsored" | "ראש המפלגה יזם" → "ראש המפלגה, יאיר לפיד, יזם" |
| F1.5 | gaza / end-war-full-withdrawal | "its leader said in February 2025" → "its leader, Yair Lapid, said in February 2025" | "וראש המפלגה אמר בפברואר 2025" → "וראש המפלגה, יאיר לפיד, אמר בפברואר 2025" |
| F1.6 | gaza / defeat-hamas-then-security-control | "a proposal by its leader in February 2025" → "a proposal by its leader, Yair Lapid, in February 2025" | "והצעה של ראש המפלגה מפברואר 2025" → "והצעה של ראש המפלגה, יאיר לפיד, מפברואר 2025" |
| F1.7 | haredi-enlistment / gradual-targets-by-agreement | "in May 2026 its leader called" → "in May 2026 its leader, Yair Lapid, called" | "ובמאי 2026 ראש המפלגה כינה" → "ובמאי 2026 ראש המפלגה, יאיר לפיד, כינה" |
| F1.8 | haredi-enlistment / voluntary-service-for-all | "Its leader said the same" → "Its leader, Yair Lapid, said the same" | "ראש המפלגה אמר את אותו הדבר" → "ראש המפלגה, יאיר לפיד, אמר את אותו הדבר" |
| F1.9 | housing / direct-help-for-buyers | "the party leader's March 2025 plan included" → "the March 2025 plan of the party's leader, Yair Lapid, included" | "והתוכנית של ראש המפלגה ממרץ 2025 כללה" → "והתוכנית של ראש המפלגה, יאיר לפיד, ממרץ 2025 כללה" |
| F1.10 | housing / develop-periphery-and-transport | "The party leader's March 2025 plan also included" → "The March 2025 plan of the party's leader, Yair Lapid, also included" | "התוכנית של ראש המפלגה ממרץ 2025 כללה גם" → "התוכנית של ראש המפלגה, יאיר לפיד, ממרץ 2025 כללה גם" |
| F1.11 | iran-and-regional-security / military-pressure-until-threats-removed | "The party's leader backed" → "The party's leader, Yair Lapid, backed" | "ראש המפלגה תמך" → "ראש המפלגה, יאיר לפיד, תמך" |
| F1.12 | iran-and-regional-security / force-plus-us-backed-agreements | "which the party's leader called" → "which the party's leader, Yair Lapid, called" | "מה שראש המפלגה כינה" → "מה שראש המפלגה, יאיר לפיד, כינה" |
| F1.13 | iran-and-regional-security / prioritize-ending-multifront-war | "The party's leader backed" → "The party's leader, Yair Lapid, backed" | "ראש המפלגה תמך" → "ראש המפלגה, יאיר לפיד, תמך" |
| F1.14 | iran-and-regional-security / end-military-operations-regional-peace | "The party's leader backed" → "The party's leader, Yair Lapid, backed" | "ראש המפלגה תמך" → "ראש המפלגה, יאיר לפיד, תמך" |
| F1.15 | judea-samaria / full-sovereignty | "the party's leader and ten other MKs" → "the party's leader, Yair Lapid, and ten other MKs" | "ראש המפלגה ועוד עשרה חברי כנסת" → "ראש המפלגה, יאיר לפיד, ועוד עשרה חברי כנסת" |
| F1.16 | judea-samaria / partial-sovereignty-area-c | "its leader and 15 other MKs" → "its leader, Yair Lapid, and 15 other MKs" | "ראש המפלגה ועוד 15 חברי כנסת" → "ראש המפלגה, יאיר לפיד, ועוד 15 חברי כנסת" |
| F1.17 | judea-samaria / maintain-current-situation | "the party's leader and ten other MKs" → "the party's leader, Yair Lapid, and ten other MKs" | "ראש המפלגה ועוד עשרה חברי כנסת" → "ראש המפלגה, יאיר לפיד, ועוד עשרה חברי כנסת" |
| F1.18 | judea-samaria / separation-two-states | "As prime minister, the party's leader told" → "As prime minister, the party's leader, Yair Lapid, told" | "כראש ממשלה, ראש המפלגה אמר באו״ם ב־22 בספטמבר 2022 ש" → "ב־22 בספטמבר 2022, כשכיהן כראש ממשלה, אמר ראש המפלגה, יאיר לפיד, באו״ם ש" (this avoids "ראש ממשלה, ראש המפלגה" back to back; apply F6 too) |
| F1.19 | judea-samaria / two-states-pre-1967-border | "its leader said on 26 May 2026" → "its leader, Yair Lapid, said on 26 May 2026" | "ראש המפלגה אמר ב־26 במאי 2026" → "ראש המפלגה, יאיר לפיד, אמר ב־26 במאי 2026" |
| F1.20 | judea-samaria / one-equal-state | "its leader said in 2022" → "its leader, Yair Lapid, said in 2022" | "ראש המפלגה אמר ב־2022" → "ראש המפלגה, יאיר לפיד, אמר ב־2022" |
| F1.21 | october-7-inquiry / state-commission-under-existing-law | "The party's leader and its MKs who voted" → "The party's leader, Yair Lapid, and its MKs who voted" | "ראש המפלגה וחברי הכנסת שלה" → "ראש המפלגה, יאיר לפיד, וחברי הכנסת שלה" |
| F1.22 | october-7-inquiry / commission-chosen-by-neutral-mechanism | "its leader and its MKs who voted" → "its leader, Yair Lapid, and its MKs who voted" | "ראש המפלגה וחברי הכנסת שלה" → "ראש המפלגה, יאיר לפיד, וחברי הכנסת שלה" |
| F1.23 | religion-and-state / keep-status-quo | "its leader said the status quo" → "its leader, Yair Lapid, said the status quo" | "ראש המפלגה אמר שהסטטוס קוו" → "ראש המפלגה, יאיר לפיד, אמר שהסטטוס קוו" |

These English edits fall under the permitted names-and-roles exception. The author should list them under "English names completed" when applying them.

## Fix round (13 October 2026)

I re-read all 24 changed Hebrew texts (23 for F1, plus judicial-system / broad-agreed-constitutional-framework for F7, religion-and-state / separate-religion-and-state for F9, and the other-reservists point for F10) and all 23 changed English texts, in full. The grammar around each inserted name is correct, with the apposition commas closed in both languages. F1.18 uses the suggested reordering ("ב־22 בספטמבר 2022, כשכיהן כראש ממשלה, אמר ראש המפלגה, יאיר לפיד, באו״ם…"). F2–F11 are applied exactly as suggested. No text is longer than 2 sentences, and the structure, agreement values and anchors are still identical between en and he. `CONTENT_CORPUS=real pnpm validate:content` passed again.

## English texts questioned

None. judea-samaria / separation-two-states says the leader spoke "as prime minister" on 22 September 2022. The research leadership section says Lapid was "prime minister from mid-2022 until the next government took office", which covers that date, so the role is supported.

## What was verified

1. Structure: checked by script (everything except `lang`/`text` is identical). Same partyId, `lang: he`, 10 issues, 41 options, 0 unclear, 3 points in the same order.
2. Agreement values: identical and in English (checked by the same script).
3. Anchors: identical for all issues and points (checked by the same script).
4. Meaning: all 44 texts compared side by side. Facts, dates, numbers (39-0, 66-48, NIS 2 bn / 27 bn, 100,000, 40%/30%, 18 months, 0-3, 50%), names and vote directions match. Drift found in F2, F4, F5 and F10.
5. Strength and hedging: "recorded position", "mixed" evidence, "secondary element" and "does not single out" are all kept. The concession was lost in F5, and the modality changed in F10.
6. Label fit: each Hebrew text read alone. All match their agreement value.
7. Glossary: terms checked against `content/glossary.json`, and the file was searched for `avoid.he` terms (none found). Gaps are F7, F8 and F9.
8. Neutral: no loaded wording found. "החרימה" is plain Hebrew for "boycotted", and "פארסה" and "אסון מדיני" are attributed quotes.
9. Natural Hebrew: mostly natural. F3, F6, F7 and F11 need fixing. "שבחרת" reads the same for men and women.
10. Form: every text is at most 2 sentences (checked by script) and each point is one sentence. There are no poll figures, option IDs or links. Registry names are used (נפתלי בנט; יאיר לפיד once F1 is applied). Dates are day first. Quoted phrases stay quoted. "נחקרה"/"שנחקרו" and "זמני/זמנית" do not appear.

Validation: `CONTENT_CORPUS=real pnpm validate:content` passed, with no error from `content/matching/texts/he/yesh-atid.json`.
