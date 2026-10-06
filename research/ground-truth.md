# Ground truth: 26th Knesset election (Stage 0)

**Research as of:** 2026-10-06, about 14:00 Asia/Jerusalem (IDT).
**Scope:** election date and poll-closing time, the official set of candidate lists, list composition, approval status, and pending legal proceedings.
**Rule followed:** every fact below comes from a source fetched during this research session (numbered in [Sources](#sources)). Sources are labeled **CEC** (Central Elections Committee, ועדת הבחירות המרכזית) or **non-CEC**.

> **Access note.** The CEC's main content lives on `gov.il` pages (for example `gov.il/he/pages/candidates-lists-26`). Those pages returned Cloudflare blocks / HTTP 403 to every fetch method used in this session, and the Wayback Machine was offline. CEC material was obtained in three ways:
> 1. The CEC's own site `bechirot.gov.il`, read through its CMS API (official election timeline) [1].
> 2. CEC documents served as direct files: the chair's decision on the election date [2] and a CEC decision on a candidate [12].
> 3. **Copies of all 38 CEC candidate-list pages ("רשימת המועמדים הוגשה מטעם…"), printed from gov.il and hosted as PDFs by the Israel Democracy Institute (IDI)** [5]. Each PDF carries the CEC page header, its publication date, the submitting parties and the full ordered candidate list. These count as **CEC content (IDI-hosted copy)**: the CEC is the author and IDI is only the host. If Task 4.1 can reach gov.il directly, these copies should be re-verified against the live CEC pages.
>
> **Not available from any CEC source fetched:** the CEC's own publication of the **ballot letters and the 27.09.2026 approval decision**. Both are taken from two independent outlets, Ynet [6] and Maariv [7], which reproduce the CEC announcement word for word and agree exactly. These facts are therefore marked **non-CEC**.

## 1. Election date and poll-closing time

| Item | Value | Sources |
|---|---|---|
| Election day | **Tuesday, 27 October 2026** (ט"ז בחשוון התשפ"ז) | CEC timeline: "27/10/2026 יום הבחירות" [1]. CEC chair decision ה"ש 1/26 (20.04.2023): "הבחירות לכנסת ה‑26 יתקיימו ביום ט"ז בחשון התשפ"ז (27 באוקטובר 2026)" [2] |
| **General poll closing** | **22:00 Asia/Jerusalem** (polls open 07:00) | Knesset Elections Law s.72(א): "הקלפי תהיה פתוחה… מ‑7 בבוקר עד 10 בלילה" [3] (non-CEC: text of the statute). Election-day guide: "Polls open 07:00 and close 22:00" [4] (non-CEC) |
| Context only | Localities with no more than 350 eligible voters: 08:00–20:00 (s.72(א)) [3]. Guide [4] gives the same 08:00–20:00 hours for hospitals and prisons. Anyone who reaches the polling station during voting hours may vote even after closing time (s.72(ב)) [3]. The CEC timeline lists "25/10/2026 הודעה בדבר שעות ההצבעה בישובים קטנים" [1]. Voting at diplomatic missions and on ships takes place on 15/10/2026 [1]. | |
| Official results | Published by 04/11/2026 [1] | |

The CEC timeline fetched does not itself state the 22:00 hour. That time comes from the statute and a non-CEC guide, which agree with each other.

## 2. Status of the list-approval process

- **Submission deadline has passed.** Lists were submitted on 07/09 and 08/09/2026 [1]. The deadline was 08/09/2026 at 22:00 (statute s.57(ט)(1) [3]; Ynet [18]). **38 lists** were submitted [13][17][19].
- **The CEC approved all 38 lists and their ballot letters on Sunday 27/09/2026** [6][7]. Ra'am and the Joint List were approved **conditionally, pending the Supreme Court**. The CEC had ruled both lists barred under s.7A(a)(1) of Basic Law: The Knesset, and also disqualified two Joint List candidates [6][7][21].
- **Disqualification motions at the CEC.** Requests to bar Otzma Yehudit, Religious Zionism–Zehut and The Democrats were **rejected** [21][8]. A motion to strike Shas candidate #6 Dror Amos was rejected by the CEC chair on 23/09/2026 [12]. Haaretz reported 12 requests in total but did not list them all [20].
- **Supreme Court, Friday 02/10/2026** [8][9][10]:
  - Ra'am: the disqualification was **overturned unanimously**.
  - Joint List: the disqualification was **overturned unanimously**.
  - Ofer Cassif (Joint List #6): the disqualification was overturned by 7–2 (Justices Mintz and Stein dissenting).
  - Sami Abu Shehadeh (Balad chair, Joint List #3): he **withdrew his candidacy**, so the court gave no ruling on him. Candidates below him each move up one place [10].
- **High Court, 04/10/2026 (reported):** the Democrats' appeal against the CEC's refusal to bar Otzma Yehudit was rejected on standing grounds. Requests to bar Ben Gvir and Gotliv individually were rejected for lacking the required signatures [11]. JPost reports **nothing further pending** [9][11].
- **The legal timeline is complete.** Under the CEC timeline, appeals on list approval and disqualification were due 29/09 and Supreme Court judgments 04/10/2026 [1].
- **Still to come (CEC timeline [1]):**
  - 16/10/2026: deadline for surplus-vote agreements.
  - **18/10/2026: official publication of the candidate lists (s.65).** This is the CEC's final, authoritative publication of the ballot and should be the recheck point.
  - 20/10/2026: publication of polling-station locations.

**Result: all 38 lists are currently `approved`.** No list is disqualified, withdrawn, under appeal or pending as of this research.

**Inclusion rule for `lists.json`:** it holds only lists that are approved, pending approval or under appeal, meaning lists that could plausibly appear on the ballot. Disqualified and withdrawn lists are recorded only in this document. No such list exists among the 38. Parties that dropped out **before** submission are listed in §5 for context.

## 3. All 38 lists

The table follows CEC submission order, which matches the CEC list-page numbering (`…_list3` = Sharshar, and so on). "Member parties" are the **registered parties that formally submitted the list according to the CEC filing** (copy at [5]). Several brand names run through registered "shelf" parties with different names (for example, Otzma Yehudit through "חזית יהודית לאומית"). The registered names are kept as filed.

**11 lists are joint lists** submitted by two or three parties: Together, Yashar, Otzma Yehudit, Reservists + Economic Party, The Democrats, Likud, Religious Zionism–Zehut, Tzomet–Beit Yisrael, Joint List, United Torah Judaism, Noam.

| # | id | Hebrew name (approved, per CEC announcement [6][7]) | English name | Letters | Member parties (as submitted to the CEC) | Leader (then next) | Status | Sources |
|---|---|---|---|---|---|---|---|---|
| 1 | `together` | ביחד בראשות נפתלי בנט | Together (B'Yachad) led by Naftali Bennett | רק | ביחד בראשות בנט מחזירים את התקווה — Together led by Bennett – Restoring Hope; יש עתיד - בראשות יאיר לפיד — Yesh Atid – led by Yair Lapid | נפתלי בנט / Naftali Bennett (then: Yair Lapid, Keren Terner Eyal, Meirav Ben-Ari) | approved | [5]01, [6], [7][15] |
| 2 | `yashar` | ישר! עם איזנקוט לראשות הממשלה מאחדים את ישראל | Yashar! with Eisenkot | דרך | ישר לישראל עם איזנקוט — Yashar LeYisrael with Eisenkot; יסודות ישראל — Yesodot Yisrael (Foundations of Israel) | גדי איזנקוט / Gadi Eisenkot (then: Yoram Cohen, Orit Farkash-Hacohen, Adi Altschuler) | approved | [5]02, [6], [7] |
| 3 | `sharshar` | שרשר לאהבה ואחדות העם | Sharshar – for Love and Unity of the People | צדק | שרשר לאהבה ואחדות העם — Sharshar – for Love and Unity of the People | איתן שוילי / Eitan Shvili (then: Tamar Shvili, Ilan Elmakayes, Raya Shirazi) | approved | [5]03, [6], [7] |
| 4 | `partnership-for-all` | השותפות לכולם | Partnership for All | ד | איחוד בני הברית - איתחאד אבנאא אלעהד - בראשות רב חובל בשארה שליאן — Ihud Bnei HaBrit (Union of the Sons of the Covenant) – led by Bishara Shlayan | טלאל אלקרינאוי / Talal Alkrinawi (then: Abdallah Abu Azam, Bishara Shlayan, Eliezer Ofer Cohen) | approved | [5]04, [6], [7] |
| 5 | `pirates` | הפיראטים – צפים לטוב | The Pirates – Floating for Good | צף | הפיראטים — The Pirates | אוהד יעקב שם טוב / Ohad Shem Tov (then: Noam Kozar Weisgerber, Dan Ariely, Meital Rom) | approved | [5]05, [6], [7] |
| 6 | `amcha-yisrael` | עמך ישראל בראשות עופר וינטר | Amcha Yisrael (People of Israel) led by Ofer Winter | ך | עמי חי לעד — Ami Chai La'ad (registered party that submitted the Amcha Yisrael list) | עופר וינטר / Ofer Winter (then: Yoseph Haddad, Netali Shem Tov, Eran Ben-Ari) | approved | [5]06, [6], [7] |
| 7 | `israel-first` | ישראל תחילה בראשות שרן השכל | Israel First led by Sharren Haskel | י | ישראל תחילה - ביטחון, כלכלה, אחדות בעם ישראל — Israel First – Security, Economy, Unity of the People of Israel | שרן מרים השכל / Sharren Haskel (then: Roey Danino, Nir Yoftaro, Wail Mugrabi) | approved | [5]07, [6], [7][16] |
| 8 | `gan-eden` | גן עדן בראשות ישוע ישראל בן דוד | Garden of Eden (Gan Eden) led by Yeshua Israel Ben David | ה | גן עדן — Gan Eden (Garden of Eden) | ישוע ישראל בן דוד / Yeshua Israel Ben David (then: Yaakov Ben Yissachar, Yaakov Lior Cohen, Talia de Rothschild) | approved | [5]08, [6], [7] |
| 9 | `womens-voice` | קול הנשים | Women's Voice | קה | קול הנשים — Women's Voice (Kol HaNashim) | עמיר ישראל שדמי / Amir Israel Shadmi (then: Emma Bohadana, Talia Ben Abu, Gadi Rosner) | approved | [5]09, [6], [7] |
| 10 | `together-we-will-succeed` | מפלגת ביחד נצליח – רשימה משותפת ערבית יהודית בראשות אבי שקד | Together We Will Succeed – Joint Arab-Jewish List led by Avi Shaked | בד | ביחד נצליח — Together We Will Succeed (Beyachad Natzliach) | אבי שקד / Avi Shaked (then: Naim Atauna, Hatem Atalla, Hala Suleiman) | approved | [5]10, [6], [7] |
| 11 | `yisrael-beytenu` | ישראל ביתנו בראשות אביגדור ליברמן | Yisrael Beytenu led by Avigdor Liberman | ל | ישראל ביתנו — Yisrael Beytenu | אביגדור ליברמן / Avigdor Liberman (then: Rafael Ben Shitrit, Talya Lankri, Oded Forer) | approved | [5]11, [6], [7] |
| 12 | `just-law` | משפט צדק | Just Law (Mishpat Tzedek) | קץ | משפט צדק — Just Law (Mishpat Tzedek) | רננה לריסה עמיר / Larissa Amir (then: Geula Amir, Eliezer Yehudi, Yitzhak Cohen) | approved | [5]12, [6], [7] |
| 13 | `shema` | שמע – בראשות נפתלי גולדמן | Shema led by Naftali Goldman | נף | שמע בראשות נפתלי גולדמן — Shema led by Naftali Goldman | נפתלי בורוך גולדמן / Naftali Goldman (then: ) | approved | [5]13, [6], [7] |
| 14 | `otzma-yehudit` | עוצמה יהודית בראשות איתמר בן גביר | Otzma Yehudit led by Itamar Ben Gvir | ב | חזית יהודית לאומית — Jewish National Front (registered party that submitted the Otzma Yehudit list); ארץ ישראל שלנו - מפלגה יהודית מאוחדת לשלמות התורה העם והארץ — Eretz Yisrael Shelanu (Our Land of Israel) | איתמר בן גביר / Itamar Ben Gvir (then: Tally Gotliv, Yitzhak Wasserlauf, Amichai Eliyahu) | approved | [5]14, [6], [7][11][21] |
| 15 | `new-order` | סדר חדש לכינון חוקה, להפרדת רשויות ולבחירות ישירות | New Order – for a Constitution, Separation of Powers and Direct Elections | קך | סדר חדש לשינוי שיטת הבחירות — New Order – for Changing the Electoral System | אביטל חי אופק / Avital Ofek (then: Lavi Naor, Esther Rosen, Daniel Betito) | approved | [5]15, [6], [7] |
| 16 | `reservists-and-economic-party` | המילואימניקים והכלכלית בראשות יועז הנדל וירון זליכה | The Reservists and the Economic Party led by Yoaz Hendel and Yaron Zelekha | די | המילואימניקים — The Reservists; הכלכלית החדשה — The New Economic Party | יועז הנדל / Yoaz Hendel (then: Yaron Zelekha, Einat Wilf, Haviv Volibovich) | approved | [5]16, [6], [7] |
| 17 | `the-democrats` | הדמוקרטים בראשות יאיר גולן | The Democrats led by Yair Golan | אמת | הדמוקרטים מיסודה של תנועת העבודה — The Democrats (founded by the Labor movement); מרצ — Meretz | יאיר גולן / Yair Golan (then: Naama Lazimi, Gilad Kariv, Efrat Rayten) | approved | [5]17, [6], [7][21] |
| 18 | `raam` | רע"ם – הרשימה הערבית המאוחדת | Ra'am – United Arab List | עם | רשימת האיחוד הערבי — United Arab List (Ra'am) | מנסור עבאס / Mansour Abbas (then: Yoav Segalovitz, Walid Taha, Walid Alhwashla) | approved | [5]18, [6], [7][8][9] |
| 19 | `shas` | התאחדות הספרדים שומרי התורה תנועתו של מרן עובדיה יוסף זצ״ל | Shas | שס | ש"ס - התאחדות הספרדים העולמית שומרי תורה — Shas – World Union of Sephardic Torah Guardians | אריה מכלוף דרעי / Aryeh Deri (then: Yinon Azoulay, Michael Malkieli, Yoav Ben-Tzur) | approved | [5]19, [6], [7][12] |
| 20 | `haredi-public` | הציבור החרדי בראשות מוטי ליטנר | The Haredi Public led by Moti Litner | זך | למען אחיי מפלגת כלל ישראל — Lema'an Achai – Party of All Israel (registered party that submitted the Haredi Public list) | פנחס מרדכי (מוטי) ליטנר / Moti Litner (then: Asher Pardi, Miriam Nechama Yaffe, Ziva Ranit Glantz) | approved | [5]20, [6], [7] |
| 21 | `you-and-me` | אני ואתה – מפלגת העם הישראלית | You and Me – the Israeli People's Party | פה | אני ואתה - מפלגת העם הישראלית — You and Me – the Israeli People's Party | אלון גלעדי / Alon Giladi (then: Maya Giladi Zholson, Itzik Zalcha, Ludmila Portnov) | approved | [5]21, [6], [7] |
| 22 | `brit-olam` | ברית עולם לגאולת ישראל | Brit Olam (Eternal Covenant) for the Redemption of Israel | זץ | ברית עולם — Brit Olam (Eternal Covenant) | עופר פינחס ליפשיץ / Ofer Lifshitz (then: Lev Sabo, Hiyam Akasha, Hani Ziada) | approved | [5]22, [6], [7] |
| 23 | `hatikun` | התיקון לשיטת הבחירות והממשל | HaTikun – Fixing the Electoral and Governing System | נקי | התיקון — HaTikun (The Fix) | משה סלומוביץ / Moshe Salomovich (then: Yara Kablan, Yahel Sherman, Sharon Sinai Simoni) | approved | [5]23, [6], [7] |
| 24 | `bible-bloc` | גה״ת – גוש התנ״כי | Gahat – the Bible Bloc | יק | גה"ת-גוש התנ"כי — Gahat – the Bible Bloc | משה ליפקין / Moshe Lipkin (then: Bracha Kal, Hanna Hawwa, Binyamin David Friedman) | approved | [5]24, [6], [7] |
| 25 | `betach` | בטח – ביטחון חברתי בראשות סמיון גרפמן | Betach – Social Security led by Semion Grafman | ז | בט"ח בטחון חברתי — Betach – Social Security | סמיון גרפמן / Semion Grafman (then: Lyubov Hanis, Dmitri Zlatkin) | approved | [5]25, [6], [7] |
| 26 | `orot-hashachar` | אורות השחר בראשות ניסים לוק | Orot HaShachar (Dawn's Light) led by Nissim Louk | בקר | אורות השחר מפלגה של כולם — Orot HaShachar – a Party for Everyone | נסים לוק / Nissim Louk (then: Benayahu Har-Shemesh, Yair Ansbacher, Yitzhak Abukrat) | approved | [5]26, [6], [7] |
| 27 | `personal-security` | ביטחון אישי | Personal Security | נץ | דמוקראטורה – מפלגה להגשמת הציונות וערכי הדמוקראטורה — Demokratura (registered party that submitted the Personal Security list) | מיכאל טופצ'יאשוילי / Michael Topchiashvili (then: Gavriel Kikvazhvili, Ilya Kikvazhvili, Makvala Khundiashvili) | approved | [5]27, [6], [7] |
| 28 | `color-black` | צבע שחור – מגן עולם התורה | The Color Black – Shield of the Torah World | נר | תומכי יהדות בוכרה — Supporters of Bukharan Judaism (registered party that submitted the Color Black list) | אליהו אליעזר באומרינד / Eliyahu Eliezer Baumrind (then: Dror Dagani, Yonatan Yissachar, Yitzhak Chai HaKohen Rabin Haimov) | approved | [5]28, [6], [7] |
| 29 | `likud` | הליכוד בהנהגת בנימין נתניהו לראשות הממשלה | Likud led by Benjamin Netanyahu for Prime Minister | מחל | הליכוד, תנועה לאומית ליברלית — Likud – National Liberal Movement; תקווה חדשה הימין הממלכתי — New Hope – the Statesmanlike Right | בנימין נתניהו / Benjamin Netanyahu (then: Eli Cohen, Amir Ohana, Yariv Levin) | approved | [5]29, [6], [7][14] |
| 30 | `blue-and-white` | כחול לבן בראשות בני גנץ | Blue and White led by Benny Gantz | כן | כחול לבן חוסן לישראל — Blue and White – Israel Resilience | בני גנץ / Benny Gantz (then: Pnina Tamano-Shata, Aliza Bloch, Roy Konkol) | approved | [5]30, [6], [7] |
| 31 | `religious-zionism-zehut` | הציונות הדתית בראשות בצלאל סמוטריץ׳ וזהות בראשות משה פייגלין | Religious Zionism led by Bezalel Smotrich and Zehut led by Moshe Feiglin | ט | האיחוד הלאומי - תקומה — National Union–Tkuma (registered party of Religious Zionism); זהות - תנועה ישראלית יהודית — Zehut – Israeli Jewish Movement; עתיד אחד - עתיד טוב לישראל — Atid Echad – A Good Future for Israel | בצלאל סמוטריץ' / Bezalel Smotrich (then: Moshe Feiglin, Orit Strock, Simcha Rothman) | approved | [5]31, [6], [7][21] |
| 32 | `ahi-movement` | תנועת אחי, תנועתו של הרב יורם אברג׳ל זצ״ל | Ahi Movement (movement of the late Rabbi Yoram Abergel) | צבי | חוזרים לשורשים — Chozrim LaShorashim (registered party that submitted the Ahi list) | יובל אלמלך / Yuval Elmalech (then: Yisrael Avihai Apel, Erez Reuven, Avraham Dayan) | approved | [5]32, [6], [7] |
| 33 | `tzomet-beit-yisrael` | צומת בית ישראל | Tzomet – Beit Yisrael | בי | בית ימני חברתי ציוני לכלל ישראל — Beit Yemini Hevrati Tziyoni (Beit Yisrael's registered party); צומת - התנועה לציונות מתחדשת — Tzomet – Movement for Renewed Zionism | גדי (דסטה) יברקן / Gadi Yevarkan (then: Moshe Green, Yaniv Ashtemker, Ram Topaz Deutsch) | approved | [5]33, [6], [7] |
| 34 | `tekuma` | תקומה | Tekuma | ק | תקומה — Tekuma | אלקנא פדרמן / Elkana Federman (then: Lotem Nagar, Shira Cohen, Miriam Avraham) | approved | [5]34, [6], [7] |
| 35 | `joint-list` | הרשימה המשותפת | The Joint List | ודם | המפלגה הקומוניסטית הישראלית — Israeli Communist Party (Hadash); התנועה הערבית להתחדשות — Arab Movement for Renewal (Ta'al); אלתג'מוע אלווטני אלדמוקרטי — National Democratic Assembly (Balad) | יוסף ג'בארין / Yousef Jabareen (then: Ahmad Tibi, Faten Ghattas, Bakr Awawdeh) | approved | [5]35, [6], [7][8][9][10][13] |
| 36 | `hakahal` | הקהל – מפלגה כלל־חרדית שנציגיה נבחרים על ידי הציבור, בראשות הרב שלמה אלבוים | HaKahal – a pan-Haredi party whose representatives are elected by the public, led by Rabbi Shlomo Elboim | רץ | מחנה ישראל — Machane Yisrael (registered party that submitted the HaKahal list) | שלמה אלבוים / Shlomo Elboim (then: Baruch Mendel Adler, David Gabbai, Yedidya Tzvi Amitai Koben) | approved | [5]36, [6], [7] |
| 37 | `united-torah-judaism` | יהדות התורה והשבת אגודת ישראל – דגל התורה | United Torah Judaism – Agudat Yisrael – Degel HaTorah | ג | אגודת החרדים - דגל התורה — Degel HaTorah; הסתדרות אגודת ישראל בארץ ישראל — Agudat Yisrael; חומת תורת ישראל — Chomat Torat Yisrael | יעקב אשר / Yaakov Asher (then: Yitzhak Goldknopf, Yitzhak Pindrus, Meir Porush) | approved | [5]37, [6], [7] |
| 38 | `noam` | נעם לישראל למען עתיד הילדים בראשות אבי מעוז | Noam for Israel – for the Children's Future, led by Avi Maoz | ני | לזוז — Lazuz (registered party that submitted the Noam list); אחריות לאומית - למען עתיד ילדינו — National Responsibility – for Our Children's Future | אבי (אביגדור) מעוז / Avi Maoz (then: Shimon Tubul, Eliyahu Libman, Liora Alon) | approved | [5]38, [6], [7] |

Full top-5 candidates, both Hebrew and English, for every list are in `content/registry/lists.json`. Party leaders are in `content/registry/parties.json`.

### How "leader" was set for member parties

1. Where the party leader is named in the registered party name or by the list's own name or headline (for example "יש עתיד – בראשות יאיר לפיד"), or is clearly reported by a fetched source (New Hope: Gideon Sa'ar [14]; Balad: Sami Abu Shehadeh [10]), that person is used.
2. Otherwise the leader is the **top-ranked candidate filed on that party's behalf** in the CEC list. This applies to Meretz (Gaby Lasky, #6), Atid Echad (Orit Strock, #3), Eretz Yisrael Shelanu (Yitzhak Wasserlauf, #3), Chomat Torat Yisrael (Meir Porush, #4), National Responsibility (Eliyahu Libman, #3), Yesodot Yisrael (Chili Tropper, #6) and Tzomet (Moshe Green, #2). These are **not confirmed party chairs** and should be checked in fact-check.
3. Each candidate's party attribution was read from the CEC PDFs [5] with automated layout parsing of 3-column right-to-left text. Ranks #1–#6 were checked by eye for every joint list.

### Name conventions and transliteration

- Hebrew candidate names are taken from the CEC filing, which uses "surname firstname" order. They are given here as "firstname surname". Some names wrapped across lines in the PDFs.
- English spellings follow major-press usage where a fetched source used one (ToI, JPost, Ynetnews, NAnews). Otherwise they are plain transliterations, mainly for micro-party candidates #2–#5.

## 4. Uncertainties and conflicts between sources

| Topic | Conflict / doubt | Resolution used |
|---|---|---|
| Ballot letters and approval | Only non-CEC reproductions were available [6][7], because the CEC gov.il page was unreachable | Two independent outlets agree exactly, so the letters are recorded as given. Verify against the CEC's 18/10 publication. |
| Likud list name | The CEC candidate page title [5] reads "הליכוד עם בנימין נתניהו לראשות הממשלה". The 27/09 approved-letters announcement [6][7] reads "הליכוד בהנהגת בנימין נתניהו לראשות הממשלה" | The approved-announcement form is used |
| Yashar leader spelling | The CEC candidate page spells "אינזקוט גדי" (looks like a typo). The list name uses "איזנקוט" | "איזנקוט" is used |
| Women's Voice head | NAnews [22] says "Dr. Mazal Shaul". CEC filing [5] shows Amir Israel Shadmi at #1 | CEC filing is used |
| Orot HaShachar head | NAnews [22] says Benayahu Har-Shemesh. CEC filing and approved name show Nissim Louk at #1 | CEC is used |
| Bible Bloc head | NAnews [22] and English Wikipedia [24] say "Dennis Lipkin". CEC filing shows "ליפקין משה" | CEC is used |
| Color Black head | Press spells "בוימרינד". CEC spells "באומרינד אליהו אליעזר" | CEC spelling is used |
| Ahi head | Press: "Elimelech". CEC: "אלמלך יובל" | CEC spelling is used, with the English "Elmalech" |
| Israel First / Ale Yarok | Kikar HaShabbat [16] reports a joint run with Ale Yarok (Nir Yoftaro is #3). The CEC filing names only "ישראל תחילה" as submitting party | Modelled as a single party, with a note |
| Yashar composition | ToI [13] mentions no merger, and CIE [19] says Tropper "jumped" to Yashar. The CEC filing shows **two** submitting parties (ישר לישראל עם איזנקוט + יסודות ישראל) | CEC is used: joint list |
| The Democrats composition | Often described as a single merged party. The CEC filing shows two submitting parties (הדמוקרטים מיסודה של תנועת העבודה + מרצ) | CEC is used: joint list |
| Joint List order | The CEC PDF [5] still shows Abu Shehadeh at #3, because it predates his withdrawal on 02/10 [10] | Top candidates are given after the withdrawal. Verify on 18/10 |
| Pre-submission dropouts | Only some were confirmed by mainstream press (see §5) | Context only. None are in the registry |

## 5. Withdrawn / did not submit (context only, not in `lists.json`)

These parties dropped out **before** the 7–8 September submission. None appear among the 38 lists.

- **Unity / האחדות** (Gilad Erdan, Yuli Edelstein): withdrew because of poor polling [13][19].
- **Makom LeKulanu / מקום לכולנו** (Jewish-Arab): withdrew shortly before the deadline [13].
- Reported only by Hebrew Wikipedia [24] (pointer, not independently verified): **El HaDegel** (Matan Yaffe), **HaRivon HaRevi'i** (Yoav Heller) and **Brit Achim** (Wajdi Sarhan) each announced on 08/09 that they would not run. An unvetted aggregator [23] lists further dropouts, and some that merged into other lists (Zehut, New Economic Party, Oz).

No list among the 38 has been disqualified or has withdrawn after submission. The only withdrawal after submission was an individual candidate, Sami Abu Shehadeh [10].

## Recheck in Task 4.1

All lists are approved and nothing is known to be pending. The CEC's **official publication of candidate lists is scheduled for 18/10/2026** (s.65) [1], so the whole registry should be confirmed against it. Specifically:

1. **`raam`**: was approved only conditionally until the Supreme Court cleared it on 02/10 [8][9]. Confirm it appears in the 18/10 publication.
2. **`joint-list`**: same as Ra'am. Also confirm the **candidate order after Abu Shehadeh's withdrawal** (Ghattas #3, Awawdeh #4, Cassif #5) and Cassif's inclusion [10].
3. **`otzma-yehudit`**: the Democrats' appeal was rejected 04/10 [11]. Recheck only that no further proceeding reopens.
4. **`shas`**: the motion against #6 Dror Amos was rejected [12]. Recheck only that no appeal was filed.
5. **All 38: ballot letters and approved names.** Re-verify against a CEC source. The gov.il CEC pages were unreachable; letters currently rest on [6][7].
6. **All joint-list member parties and the "leader by top-ranked candidate" entries** in §3: Meretz, Atid Echad, Eretz Yisrael Shelanu, Chomat Torat Yisrael, National Responsibility, Yesodot Yisrael, Tzomet.
7. Re-verify the IDI-hosted CEC page copies [5] against live gov.il pages if they become reachable.

## Sources

All accessed 2026-10-06.

1. **"ציר הזמן לבחירות לכנסת ה‑26"** (official election timeline carousel on the CEC home page). Central Elections Committee. https://www.bechirot.gov.il/home/ , data fetched via the site's API `https://www.bechirot.gov.il/umbraco/api/Carousel/GetCarousel` (query id 176858). **CEC.**
2. **החלטת יו"ר ועדת הבחירות המרכזית ה"ש 1/26: מועד הבחירות לכנסת ה‑26** (20.04.2023). Central Elections Committee. https://www.gov.il/BlobFolder/dynamiccollectorresultitem/hs1-26/he/election-26_decisions_hs1-26.pdf **CEC.**
3. **חוק הבחירות לכנסת [נוסח משולב], ss.57(ט), 72** (statute text). Hebrew Wikisource. https://he.wikisource.org/wiki/חוק_הבחירות_לכנסת **non-CEC** (statute).
4. **Israel election day 2026: a visitor's guide.** My Israeli Guide. https://myisraeliguide.com/israel-election-day/ **non-CEC.**
5. **CEC candidate-list pages for all 38 lists (copies hosted by the Israel Democracy Institute)**, index page "בחירות 2026 | רשימת מפלגות ומועמדים". https://www.idi.org.il/policy/parties-and-elections/elections/2026-1 . **CEC content, IDI-hosted copy.** Per-list PDFs (CEC publication dates 07–09.09.2026), sub-referenced as [5]NN in the table:
   - [5]01 ביחד בראשות נפתלי בנט — https://www.idi.org.il/media/32309/%D7%91%D7%99%D7%97%D7%93.pdf
   - [5]02 ישר! עם איזנקוט לראשות הממשלה מאחדים את ישראל — https://www.idi.org.il/media/32324/%D7%99%D7%A9%D7%A8.pdf
   - [5]03 שרשר לאהבה ואחדות העם — https://www.idi.org.il/media/32340/%D7%A9%D7%A8%D7%A9%D7%A8.pdf
   - [5]04 השותפות לכולם — https://www.idi.org.il/media/32321/%D7%94%D7%A9%D7%95%D7%AA%D7%A4%D7%95%D7%AA-%D7%9C%D7%9B%D7%95%D7%9C%D7%9D.pdf
   - [5]05 הפיראטים – צפים לטוב — https://www.idi.org.il/media/32316/%D7%94%D7%A4%D7%99%D7%A8%D7%90%D7%98%D7%99%D7%9D.pdf
   - [5]06 עמך ישראל בראשות עופר וינטר — https://www.idi.org.il/media/32333/%D7%A2%D7%9E%D7%9A-%D7%99%D7%A9%D7%A8%D7%90%D7%9C.pdf
   - [5]07 ישראל תחילה בראשות שרן השכל — https://www.idi.org.il/media/32326/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-%D7%AA%D7%97%D7%99%D7%9C%D7%94.pdf
   - [5]08 גן עדן בראשות ישוע ישראל בן דוד — https://www.idi.org.il/media/32311/%D7%92%D7%9F-%D7%A2%D7%93%D7%9F.pdf
   - [5]09 קול הנשים — https://www.idi.org.il/media/32336/%D7%A7%D7%95%D7%9C-%D7%94%D7%A0%D7%A9%D7%99%D7%9D.pdf
   - [5]10 מפלגת ביחד נצליח – רשימה משותפת ערבית יהודית בראשות אבי שקד — https://www.idi.org.il/media/32308/%D7%91%D7%99%D7%97%D7%93-%D7%A0%D7%A6%D7%9C%D7%99%D7%97.pdf
   - [5]11 ישראל ביתנו בראשות אביגדור ליברמן — https://www.idi.org.il/media/32325/%D7%99%D7%A9%D7%A8%D7%90%D7%9C-%D7%91%D7%99%D7%AA%D7%A0%D7%95.pdf
   - [5]12 משפט צדק — https://www.idi.org.il/media/32329/%D7%9E%D7%A9%D7%A4%D7%98-%D7%A6%D7%93%D7%A7.pdf
   - [5]13 שמע – בראשות נפתלי גולדמן — https://www.idi.org.il/media/32338/%D7%A9%D7%9E%D7%A2.pdf
   - [5]14 עוצמה יהודית בראשות איתמר בן גביר — https://www.idi.org.il/media/32332/%D7%A2%D7%95%D7%A6%D7%9E%D7%94-%D7%99%D7%94%D7%95%D7%93%D7%99%D7%AA.pdf
   - [5]15 סדר חדש לכינון חוקה, להפרדת רשויות ולבחירות ישירות — https://www.idi.org.il/media/32331/%D7%A1%D7%93%D7%A8-%D7%97%D7%93%D7%A9.pdf
   - [5]16 המילואימניקים והכלכלית בראשות יועז הנדל וירון זליכה — https://www.idi.org.il/media/32315/%D7%94%D7%9E%D7%99%D7%9C%D7%95%D7%90%D7%99%D7%9E%D7%A0%D7%99%D7%A7%D7%99%D7%9D-%D7%95%D7%94%D7%9B%D7%9C%D7%9B%D7%9C%D7%99%D7%AA.pdf
   - [5]17 הדמוקרטים בראשות יאיר גולן — https://www.idi.org.il/media/32313/%D7%94%D7%93%D7%9E%D7%95%D7%A7%D7%A8%D7%98%D7%99%D7%9D.pdf
   - [5]18 רע"ם – הרשימה הערבית המאוחדת — https://www.idi.org.il/media/32337/%D7%A8%D7%A2%D7%9E.pdf
   - [5]19 התאחדות הספרדים שומרי התורה תנועתו של מרן עובדיה יוסף זצ״ל — https://www.idi.org.il/media/32339/%D7%A9%D7%A1.pdf
   - [5]20 הציבור החרדי בראשות מוטי ליטנר — https://www.idi.org.il/media/32317/%D7%94%D7%A6%D7%99%D7%91%D7%95%D7%A8-%D7%94%D7%97%D7%A8%D7%93%D7%99.pdf
   - [5]21 אני ואתה – מפלגת העם הישראלית — https://www.idi.org.il/media/32305/%D7%90%D7%A0%D7%99-%D7%95%D7%90%D7%AA%D7%94.pdf
   - [5]22 ברית עולם לגאולת ישראל — https://www.idi.org.il/media/32310/%D7%91%D7%A8%D7%99%D7%AA-%D7%A2%D7%95%D7%9C%D7%9D.pdf
   - [5]23 התיקון לשיטת הבחירות והממשל — https://www.idi.org.il/media/32322/%D7%94%D7%AA%D7%99%D7%A7%D7%95%D7%9F.pdf
   - [5]24 גה״ת – גוש התנ״כי — https://www.idi.org.il/media/32312/%D7%94%D7%92%D7%95%D7%A9-%D7%94%D7%AA%D7%A0%D7%9B%D7%99.pdf
   - [5]25 בטח – ביטחון חברתי בראשות סמיון גרפמן — https://www.idi.org.il/media/32306/%D7%91%D7%98%D7%97.pdf
   - [5]26 אורות השחר בראשות ניסים לוק — https://www.idi.org.il/media/32304/%D7%90%D7%95%D7%A8%D7%95%D7%AA-%D7%94%D7%A9%D7%97%D7%A8.pdf
   - [5]27 ביטחון אישי — https://www.idi.org.il/media/32307/%D7%91%D7%98%D7%97%D7%95%D7%9F-%D7%90%D7%99%D7%A9%D7%99.pdf
   - [5]28 צבע שחור – מגן עולם התורה — https://www.idi.org.il/media/32334/%D7%A6%D7%91%D7%A2-%D7%A9%D7%97%D7%95%D7%A8.pdf
   - [5]29 הליכוד בהנהגת בנימין נתניהו לראשות הממשלה — https://www.idi.org.il/media/32314/%D7%94%D7%9C%D7%99%D7%9B%D7%95%D7%93.pdf
   - [5]30 כחול לבן בראשות בני גנץ — https://www.idi.org.il/media/32327/%D7%9B%D7%97%D7%95%D7%9C-%D7%9C%D7%91%D7%9F.pdf
   - [5]31 הציונות הדתית בראשות בצלאל סמוטריץ׳ וזהות בראשות משה פייגלין — https://www.idi.org.il/media/32318/%D7%94%D7%A6%D7%99%D7%95%D7%A0%D7%95%D7%AA-%D7%94%D7%93%D7%AA%D7%99%D7%AA.pdf
   - [5]32 תנועת אחי, תנועתו של הרב יורם אברג׳ל זצ״ל — https://www.idi.org.il/media/32341/%D7%AA%D7%A0%D7%95%D7%A2%D7%AA-%D7%90%D7%97%D7%99.pdf
   - [5]33 צומת בית ישראל — https://www.idi.org.il/media/32335/%D7%A6%D7%95%D7%9E%D7%AA-%D7%91%D7%99%D7%AA-%D7%99%D7%A9%D7%A8%D7%90%D7%9C.pdf
   - [5]34 תקומה — https://www.idi.org.il/media/32328/%D7%9E%D7%A4%D7%9C%D7%92%D7%AA-%D7%AA%D7%A7%D7%95%D7%9E%D7%94.pdf
   - [5]35 הרשימה המשותפת — https://www.idi.org.il/media/32320/%D7%94%D7%A8%D7%A9%D7%99%D7%9E%D7%94-%D7%94%D7%9E%D7%A9%D7%95%D7%AA%D7%A4%D7%AA.pdf
   - [5]36 הקהל – מפלגה כלל־חרדית שנציגיה נבחרים על ידי הציבור, בראשות הרב שלמה אלבוים — https://www.idi.org.il/media/32319/%D7%94%D7%A7%D7%94%D7%9C.pdf
   - [5]37 יהדות התורה והשבת אגודת ישראל – דגל התורה — https://www.idi.org.il/media/32323/%D7%99%D7%94%D7%93%D7%95%D7%AA-%D7%94%D7%AA%D7%95%D7%A8%D7%94.pdf
   - [5]38 נעם לישראל למען עתיד הילדים בראשות אבי מעוז — https://www.idi.org.il/media/32330/%D7%A0%D7%A2%D7%9D.pdf
6. **ועדת הבחירות המרכזית פרסמה את הפתקים של כל המפלגות לכנסת ה‑26** (27.09.2026). Ynet. https://www.ynet.co.il/news/article/s1ibdii5fe **non-CEC** (reproduces CEC announcement).
7. **בחירות 2026: אלה האותיות של המפלגות שתשימו בקלפי** (27.09.2026). Maariv. https://www.maariv.co.il/news/politics/article-1371157 **non-CEC** (reproduces CEC announcement).
8. **העליון הפך את החלטת ועדת הבחירות: רע"מ, הרשימה המשותפת וכסיף יוכלו להתמודד** (02.10.2026). Ynet. https://www.ynet.co.il/news/elections2026/article/hjw00hep9mx **non-CEC.**
9. **Supreme Court allows Ofer Cassif, Ra'am, Joint List to run in 26th Knesset election** (02.10.2026). The Jerusalem Post. https://www.jpost.com/israel-election-2026/article-910410 **non-CEC.**
10. **אבו שחאדה בחוץ, בל"ד נשארת: כך נראית הרשימה המשותפת אחרי הפרישה.** Ynet. https://ynet.co.il/news/elections2026/article/s100kfzesze **non-CEC.**
11. **High Court of Justice rejects bid to bar Otzma Yehudit from running in election** (04.10.2026). The Jerusalem Post. https://www.jpost.com/israel-election-2026/article-910555 **non-CEC.**
12. **החלטת יו"ר הוועדה פ"מ 5/26, עתים נ' רשימת ש"ס ודרור עמוס: הבקשה נדחית** (23.09.2026). Central Elections Committee. https://centralelectioncommittee.my.salesforce.com/sfc/dist/version/download/?oid=00D8d000009rrY5&ids=068Jz000015aswE&d=%2Fa%2FJz0000054g5p%2FI8hC1j16xtrYmXwoSZ1JtSlinOg61qUYUx_ogQJAf50&asPdf=false **CEC.**
13. **Israel's election takes shape as 38 parties submit slates, in battle between pro- and anti-Netanyahu blocs** (09.09.2026). The Times of Israel. https://www.timesofisrael.com/israels-election-takes-shape-as-38-parties-submit-slates-from-likud-to-joint-list/ **non-CEC.**
14. **Down to the wire: Knesset election slates take shape as deadline nears.** Ynetnews. https://www.ynetnews.com/article/bjhvtvhpfe **non-CEC.**
15. **Lapid unveils Yesh Atid election slate… ahead of joint run with Bennett** (05.09.2026). Ynetnews. https://www.ynetnews.com/article/hkfdvtkogx **non-CEC.**
16. **ההצגה החלה: שרשר המלך, ״הפיראטים״ ועלה ירוק הגישו את הרשימות לכנסת.** Kikar HaShabbat. https://www.kikar.co.il/political-news/tkzyl4 **non-CEC.**
17. **מסכמים הגשת רשימות: כל המפלגות והמועמדים בבחירות לכנסת ה‑26** (09.09.2026, updated 30.09.2026). Knesset Channel. https://www.knesset.tv/main-articles/61384/94592/ **non-CEC** (cross-check of candidate order for 15 major lists; matches [5]).
18. **השמות והרשימות: אלה המועמדים של בחירות 2026** (07.09.2026). Ynet. https://www.ynet.co.il/news/elections2026/article/hkqbeu3dgx **non-CEC.**
19. **38 Party Lists Qualify for Israel's 2026 Parliamentary Election** (28.09.2026). Center for Israel Education. https://israeled.org/38-party-lists-israels-2026-parliamentary-election/ **non-CEC.**
20. **Parties File Requests to Disqualify Electoral Lists, All Expected to Be Rejected** (15.09.2026). Haaretz. https://www.haaretz.com/israel-news/elections/2026-09-15/ty-article/.premium/parties-file-requests-to-disqualify-electoral-lists-all-expected-to-be-rejected/000001a0-a562-dab0-afb4-fd77d9870000 **non-CEC** (paywalled; summary only).
21. **בנט ביקש – אבל בן גביר קיבל את האות המיתולוגית: אלה הפתקים של כל המפלגות.** Ynet. https://www.ynet.co.il/news/elections2026/article/sjmed8uqgx **non-CEC.**
22. **Crown, 'Pirates', and 38 Lists: Which Parties and Lists Are Running in the 2026 Elections in Israel.** NAnews. https://news.nikk.co.il/en/crown-pirates-and-38-lists/ **non-CEC** (low authority; used only to flag conflicts).
23. **כל המפלגות בבחירות 2026** (independent aggregator). מצפן הבחירה. https://bhirot26.online/party **non-CEC** (low authority, unvetted; context only).
24. **Wikipedia (pointers only, not relied on for registry facts):** "Party lists for the 2026 Israeli legislative election" https://en.wikipedia.org/wiki/Party_lists_for_the_2026_Israeli_legislative_election and "הבחירות לכנסת העשרים ושש" https://he.wikipedia.org/wiki/הבחירות_לכנסת_העשרים_ושש **non-CEC.**
