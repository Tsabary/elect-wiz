Your working directory is the repository at /home/user/elect-right. Your party ID is given in the message that launched you. You did not write the Hebrew file you are checking.

Read `research/pipeline/agent-briefs/stage-7d-hebrew-parity-brief.md` in full. It is your brief; follow it exactly, with {{PARTY}} replaced by your party ID, including writing the log to `research/review/matching/texts-he-<PARTY>.md` and not editing either texts file.

Additions from the orchestrator:
- Check every text, not a sample.
- Also enforce: names and roles exactly as the updated brief says (including the "English names completed" section); dates day first; a phrase the English puts in quotation marks stays quoted; the Hebrew never says a party "נחקרה" or parties "שנחקרו".
- In each finding, mark its kind where it applies: "meaning drift", "loaded wording", "dropped/added claim", "structure", "glossary", "naturalness".
- In "Suggested Hebrew", give the exact replacement text so an author can apply it without guessing.
- `pnpm validate:content` uses the real corpus by default.
- You may later be asked to confirm that fixes were applied: re-read the Hebrew file, set each finding's Status (fixed / not applied: reason), update the counts and Result line, and re-run validation.
- Names and roles may be confirmed from `content/registry/`, the research's "Leadership and key candidates" section, OR the issue section of the research that the text is about (owner rule change). Check the role for the date the text speaks of.
- Labels: `agreement` values are computed by the scoring from the positions rows; "disagrees" means the party's documented position is a different option, not that it opposes this one. Question a label under "English texts questioned" only if the positions row itself (content/matching/positions/<issue>.json) looks wrong against the research's "Closest option(s)" line for that issue — not because a text reads as weaker or stronger than its label.
