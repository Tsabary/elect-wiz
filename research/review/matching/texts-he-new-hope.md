# Hebrew texts parity check: new-hope

- Checked on 14/10/2026 by a Stage 7d parity checker (not the author of the Hebrew file)
- Hebrew texts by: Stage 7d author (Sonnet) · Parity check by: Stage 7d parity checker (Opus) (different)
- Structure, agreement values and anchors: identical ✔
- Texts compared: 41 option texts + 0 unclear + 3 points · must-fix: 0 · should-fix: 6 (6 fixed, 0 open) · notes: 5
- Result: pass after fixes (no must-fix; all six should-fix items applied and verified on 14/10/2026, including the English revert in finding 6)

## Findings

| # | Issue / option, or point | Severity | English says | Hebrew says | Suggested Hebrew | Status (open / fixed / not applied: reason) |
|---|---|---|---|---|---|---|
| 1 | cost-of-living / direct-support-for-households | should-fix (loaded wording, mild) | "…would have liked to vote for such bills but was bound by coalition discipline and budget constraints." | "…הייתה רוצה להצביע בעד הצעות כאלה, אבל היא כבולה למשמעת קואליציונית ולמגבלות תקציב." | Replace "אבל היא כבולה למשמעת קואליציונית ולמגבלות תקציב" with "אבל היא מחויבת למשמעת קואליציונית ולמגבלות התקציב" ("כבולה", "shackled", is stronger than the neutral "bound by"). | fixed (verified 14/10/2026) |
| 2 | crime-in-arab-society / invest-in-arab-communities-first | should-fix (meaning drift) | "The party's documented record is about enforcement, such as tougher sentences and wider police powers." | "מה שמתועד בעמדת המפלגה נוגע לאכיפה, כמו עונשים חמורים יותר וסמכויות רחבות יותר למשטרה." | "מה שמתועד לגבי המפלגה נוגע לאכיפה, כמו עונשים חמורים יותר וסמכויות רחבות יותר למשטרה." (The English speaks of a record, not a position.) | fixed (verified 14/10/2026) |
| 3 | housing / develop-periphery-and-transport | should-fix (meaning drift, minor) | "…the Golan plan is not presented as a housing-price policy." | "…שתוכנית הגולן אינה מוצגת כמדיניות להורדת מחירי דיור." | "…שתוכנית הגולן אינה מוצגת כמדיניות בנושא מחירי הדיור." ("להורדת", "for lowering", is not in the English.) | fixed (verified 14/10/2026) |
| 4 | iran-and-regional-security / prioritize-ending-multifront-war | should-fix (meaning drift, minor) | "…until Israel and its partners think it appropriate to stop." | "…עד שישראל ובעלות בריתה יחשבו שראוי לעצור." | "…עד שישראל ושותפותיה יחשבו שראוי לעצור." ("partners", not "allies".) | fixed (verified 14/10/2026) |
| 5 | october-7-inquiry / commission-appointed-by-knesset-balance | should-fix (naturalness) | "…objected to a design that lets the coalition pick all members." | "…התנגד לעיצוב שמאפשר לקואליציה לבחור את כל החברים." | "…התנגד למבנה שמאפשר לקואליציה לבחור את כל החברים." ("עיצוב" reads as a word-for-word rendering of "design".) | fixed (verified 14/10/2026) |
| 6 | iran-and-regional-security / military-pressure-until-threats-removed (ENGLISH) | should-fix (English edit outside the allowed scope; structure) | Second mention in the same text: "…in July 2026 Foreign Minister Gideon Sa'ar announced further talks with Lebanon…" (the full name and role were already added at the first mention, at the start of the text). | "…ובחודש יולי 2026 הודיע סער על סבב שיחות נוסף…" (correct: surname only at second mention). | English: revert the second mention to "in July 2026 Sa'ar announced further talks with Lebanon under a US-brokered framework." Hebrew: no change. The role is correct for the date, so this is not a factual error, but the allowed edit is name and role at FIRST mention only; the caller may treat it as must-fix under the "any other English change" rule. | fixed (verified 14/10/2026) |

## English names completed

Every English edit in `git diff HEAD -- content/matching/texts/en/new-hope.json` is a name-and-role addition. Each was checked against `content/registry/parties.json` (leader: גדעון סער / Gideon Sa'ar) and `content/research/en/new-hope.md` (overview, "Leadership and key candidates", and the issue section the text is about), for the date the text speaks of. All roles are supported for their dates; the Hebrew carries the same name and role in each text.

| Text | Added | Date in text | Support | Hebrew |
|---|---|---|---|---|
| cost-of-living / direct-support-for-households | Justice Minister Gideon Sa'ar | June 2022 | Justice minister 2021–2022 (leadership; quote sourced to ToI 13 June 2022) | שר המשפטים גדעון סער ✔ |
| crime / emergency-powers-shin-bet | MKs Ze'ev Elkin, Sharren Haskel, Akram Hasson; party leader Gideon Sa'ar | 10 Dec 2025; undated (no proposal found) | All three were MKs (Hasson since July 2025; Haskel resigned as deputy FM only in July 2026 and remains an MK of the faction); Sa'ar is party leader | ✔ |
| crime / more-police-resources-normal-law | Gideon Sa'ar (role "as justice minister" already there) | 2021–2022 | ✔ | כשר המשפטים … גדעון סער ✔ |
| gaza / resume-fighting-full-control | Gideon Sa'ar (as foreign minister); Ze'ev Elkin, a minister in the Finance Ministry | 14 July / 23 Oct 2025; present-tense "no statement found" | FM since Nov 2024; Elkin minister in the Finance Ministry since late 2024 | שר החוץ גדעון סער; זאב אלקין, שר במשרד האוצר ✔ |
| gaza / hold-positions, end-war, defeat-hamas | Foreign Minister Gideon Sa'ar | 14 July 2025, 23 Oct 2025 | ✔ | ✔ |
| gaza / advance-international-arrangement | Gideon Sa'ar ("as foreign minister" already there) | 23 Oct 2025 | ✔ | ✔ |
| haredi-enlistment / anchor-torah-study-exemption, gradual-targets | MKs Ze'ev Elkin, Michel Buskila, Akram Hasson | 13–14 July 2026 | All three MKs then | ✔ |
| haredi-enlistment / universal-service-with-sanctions | party leader Gideon Sa'ar | June 2024, "in opposition" | Party leader (founder, chairman); New Hope left the coalition 25 March 2024 | ראש המפלגה גדעון סער ✔ |
| housing / state-led-affordable-rental | former housing minister Ze'ev Elkin | 2023 | Housing minister June 2021–Dec 2022 (housing section; source 111, 24 Sept 2023) | שר הבינוי והשיכון לשעבר זאב אלקין ✔ |
| housing / direct-help-for-buyers | housing minister Ze'ev Elkin | 9 Sept 2021 | ✔ | שר הבינוי והשיכון זאב אלקין ✔ |
| housing / develop-periphery-and-transport | Ze'ev Elkin, a minister in the Finance Ministry | 16 April 2026 | Housing section: "As the Finance Ministry minister for rebuilding the north and south, Elkin led a government plan approved on 16 April 2026" | ✔ |
| iran / three texts | Foreign Minister Gideon Sa'ar | 10 March, July, 2 Sept 2026 | ✔ (see finding 6 for the repeated second mention) | ✔ |
| iran / end-military-operations-regional-peace | Gideon Sa'ar, then a minister without portfolio | 30 Sept 2024 | Leadership: minister without portfolio "again from September to November 2024"; ToI 30 Sept 2024 "As he officially rejoins government" | גדעון סער, שהיה אז שר בלי תיק ✔ |
| judea-samaria / six texts | Foreign Minister Gideon Sa'ar; MK Michel Buskila; MKs Ze'ev Elkin and Akram Hasson; Ze'ev Elkin (as housing minister) | 30 April 2026, July 2025; 22 Jan 2025; 31 Dec 2025; Nov 2021 | Buskila MK since 5 July 2024; Hasson MK since July 2025; Elkin housing minister in Nov 2021 | ✔ |
| judicial-system / three texts | MKs Ze'ev Elkin, Akram Hasson, Michel Buskila, Sharren Haskel; Foreign Minister Gideon Sa'ar | 15 July 2026; 27 March 2025 (and Jan 2025 compromise) | All MKs then; leadership: "In January 2025, as foreign minister, he and Justice Minister Yariv Levin presented a compromise… law in March 2025" | ✔ |
| october-7-inquiry / state-commission-under-existing-law | party leader Gideon Sa'ar and MKs Ze'ev Elkin, Sharren Haskel, Michel Buskila | 17 July 2024, in opposition | Sa'ar still an MK until July 2025; Buskila MK since 5 July 2024 | ראש המפלגה גדעון סער וחברי הכנסת… ✔ |
| october-7-inquiry / two texts | Ze'ev Elkin, a minister in the Finance Ministry; MK Michel Buskila | Dec 2025 (Ministerial Committee for Legislation); 24 Dec 2025 | Elkin a minister since late 2024 (and so on the ministerial committee); Buskila MK | ✔ |
| religion-and-state / four texts | MKs Ze'ev Elkin, Michel Buskila, Akram Hasson, Sharren Haskel; party leader Gideon Sa'ar | 19 Nov 2025, 2026; January 2021 | All MKs then; Sa'ar party leader in Jan 2021 | ✔ |
| point other-medical-cannabis | Foreign Minister Gideon Sa'ar and MKs Ze'ev Elkin, Michel Buskila, Sharren Haskel | 5 March 2025 | Sa'ar was FM and still an MK (left the Knesset July 2025), so his vote is consistent | שר החוץ גדעון סער וחברי הכנסת… ✔ |

Inserted roles that start a sentence are capitalised ("Foreign Minister Gideon Sa'ar …"). No other English change was found apart from finding 6.

## English texts questioned

None on content or labels. Two English-only style points: finding 6 (repeated full name and role at a second mention), and note N1 below (lower-case "housing minister" before a name, while "Justice Minister" and "Foreign Minister" are capitalised).

## Notes

- N1 (English style, no Hebrew change): housing / direct-help-for-buyers says "housing minister Ze'ev Elkin's" and state-led-affordable-rental says "former housing minister Ze'ev Elkin", in lower case, while the other texts use "Justice Minister Gideon Sa'ar" and "Foreign Minister Gideon Sa'ar". If the owner wants consistency: "Housing Minister Ze'ev Elkin's" and "former Housing Minister Ze'ev Elkin". Not a factual issue.
- N2 (names): זאב אלקין, מישל בוסקילה and אכרם חסון appear in no other Hebrew content file (searched content/ for אלקין, בוסקילה/בוסקילא, חסון/חסאן). The forms used are the standard Hebrew spellings these people use, and they are consistent across all 44 texts. שרן השכל and גדעון סער match the registry.
- N3 (veto): "זכות וטו" matches the rendering in yesh-atid, yashar-leyisrael, zehut and byachad-bennett Hebrew texts.
- N4: Elkin, Haskel and Buskila are called "MK(s)" in votes from 2025–2026 while Elkin is a minister and Haskel was deputy foreign minister. This is correct: the research's overview lists all four as the faction's sitting MKs.
- N5: "tentative" is rendered "בהסתייגות" / "אינה ודאית" / "הלא ודאית", always about the research's placement and never about the party; no "זמני/זמנית". "סגר" occurs only inside "במסגרת".

## What was verified

1. Structure: a script compared partyId, lang (he), issue keys, option IDs and their order, options/unclear, and 3 points in order. Identical.
2. agreement values: compared for all 41 options. Identical and in English.
3. Anchors: compared for all 9 issues and 3 points. Identical.
4. Meaning: all 41 option texts and 3 points read side by side. Dates, numbers (20%, NIS 300,000, 100,000, 5,000, 45 hours, 30→32 months, June 2029), names and vote directions match. Small drifts are listed as findings 2–4.
5. Strength and hedging: every "tentative" and "mixed" kept ("בהסתייגות", "אינה ודאית", "התמונה אינה אחידה"), and no hedge was added to a plain statement.
6. Fits the label: each Hebrew text read alone matches its agreement value. The two party-position-unclear texts imply no stance.
7. Glossary: a script checked every avoid.he term (none found). Glossary terms are used: יהודה ושומרון, החלת ריבונות, ועדת חקירה ממלכתית, ועדה שתמונה באמצעות הכנסת, בג״ץ, היועץ המשפטי לממשלה, השב״כ, מעצר בלי משפט, היישובים הערביים, תלמידי ישיבות, חוק יסוד, נישואים אזרחיים.
8. Neutral: one mildly loaded word ("כבולה", finding 1). Nothing else reads as loaded. "נחקרה"/"שנחקרו" do not occur.
9. Natural Hebrew: generally idiomatic; one translationese word (finding 5). The user is addressed as "תשובתך" (gender-neutral) throughout.
10. Form: 1–2 sentences per text, one per point. No poll figures, option IDs, citations, links or Markdown. Dates are day first. Quoted phrases stay quoted (straight quotes), including the quotation of the option text "בלי סמכויות מיוחדות", which matches content/issues/crime-in-arab-society.json. No article inside law names; "first reading"/"preliminary reading" are rendered "קריאה ראשונה"/"קריאה טרומית".

Validation: `CONTENT_CORPUS=real pnpm validate:content` passed. The Hebrew new-hope file raises no error, and research/review/matching/self-match-report.md was not left modified.

Fix round (14/10/2026): `git diff HEAD` on both texts files shows exactly the six suggested changes and nothing else (Hebrew: מחויבת…התקציב, לגבי, בנושא מחירי הדיור, ושותפותיה, למבנה; English: second mention back to "in July 2026 Sa'ar announced"). Re-ran `CONTENT_CORPUS=real pnpm validate:content`: passed, no errors from new-hope.
