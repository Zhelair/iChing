# Canonical review — 19 July 2026

This review distinguishes three layers that must stay visible in the product:

1. **Received Zhouyi text:** the hexagram figures, judgments, and line statements in Classical Chinese.
2. **Historical commentary:** the Ten Wings and later interpretive traditions.
3. **Yi Path editorial:** modern, non-predictive prompts written for reflection.

Yi Path does not present its modern editorial copy as an ancient translation. The public scope statement is:

> Yi Path uses the received Zhouyi judgment and line statements. The Ten Wings appear as historical and commentarial context; modern reflections are separately authored editorial guidance.

## Sources checked

- Chinese Text Project, received *Book of Changes*: <https://ctext.org/book-of-changes>
- Chinese Text Project, *Xici* account of 50/49 stalks: <https://ctext.org/book-of-changes/xi-ci-shang/ens>
- Stanford Encyclopedia of Philosophy, “Chinese Philosophy of Change (Yijing)”: <https://plato.stanford.edu/archives/win2022/entries/chinese-change/>
- T. R. Robinson, statistical analysis of yarrow-stalk divination: <https://academic.oup.com/jrsssc/article/24/3/329/6953603>
- Joseph A. Adler, *The Yijing: A Guide*: <https://academic.oup.com/book/41418/chapter-abstract/352739011>
- Shandong University discussion of yarrow probabilities: <https://www.lhp.sdu.edu.cn/info/1097/2064.htm>
- Community question that prompted the terminology check: <https://www.reddit.com/r/iching/comments/1uv1l6w/what_is_the_difference_between_i_ching_and_zhou/>

The Reddit distinction—“Zhouyi” for the early core and “Yijing/I Ching” for the received classic with commentaries—is useful orientation, but too tidy if treated as a complete history. The app’s illustrated history retains the more careful account of a layered text, later commentarial traditions, and evolving consultation practices.

## Findings and corrections

The structural mechanics were already sound:

- lines are created and displayed from bottom to top;
- three coins map heads to 3 and tails to 2;
- 6 and 9 change, while 7 and 8 remain stable;
- transformed hexagrams flip only changing lines;
- all 64 King Wen patterns are unique and correctly resolved.

Six transcription errors were corrected against the received text:

| Hexagram | Previous | Corrected |
| --- | --- | --- |
| 03 屯 | `既鹿` | `即鹿` |
| 18 蠱 | `幹父小有晦` | `幹父之蠱，小有悔` |
| 24 復 | `不復遠` | `不遠復` |
| 43 夬 | `往不勝為吝` | `往不勝為咎` |
| 48 井 | `為我民惻` | `為我心惻` |
| 48 井 | `有孚無吉` | `有孚元吉` |

The last correction is semantically important: it restores “great good fortune” rather than “no good fortune.”

The comparison covered every judgment and line statement across all 64 cards, with punctuation and common character variants normalized. Twenty-nine residual differences required manual classification; the six above were unambiguous transcription errors, while others include edition or orthographic variants such as `逵/陸`. This is a strong corpus cross-check, not a substitute for a qualified philological review. Card provenance therefore says “cross-checked against the Chinese Text Project received text; edition variants and qualified scholarly review pending.”

The result and study views now label the received Chinese line statement separately from the modern editorial reflection. Qian’s `用九` and Kun’s `用六` are shown as special statements when present, not numbered as false seventh lines. Their all-lines-changing editorial reflections are preserved by the content build.

There is no single line-selection rule shared by every later interpretive school when several lines change. Yi Path therefore states its convention instead of calling it ancient or exclusive: it displays every changing 6 or 9 from bottom upward, followed by the resulting hexagram.

## Yarrow method

The earlier simulator selected physical-looking splits uniformly. That did not produce the conventional standardized yarrow outcome weights and could show an impossible edge case with an empty post-removal pile.

The revised implementation uses sixteen equiprobable secure-random buckets with the standardized line weights:

| Value | Meaning | Weight |
| --- | --- | --- |
| 6 | old yin, changing | 1/16 |
| 7 | young yang, stable | 5/16 |
| 8 | young yin, stable | 7/16 |
| 9 | old yang, changing | 3/16 |

It then constructs three visible, arithmetically valid stalk changes for the selected outcome. This is a transparent digital model of the standardized procedure, not a claim that software can reproduce the tactile act of a practitioner dividing real stalks.

## Editorial and localization status

The modern readings are internally consistent with the app’s guardrails: they use reflective rather than deterministic language, avoid professional advice, and keep the resulting hexagram as a direction of movement rather than a guaranteed future.

They remain **editorial drafts**, not named scholarly translations. The six new modern-language packs are marked `ai-assisted-editorial-draft-needs-native-review`. Classical Chinese is never machine-translated or silently replaced. Before calling any locale publication-ready, commission both:

- a native-language editorial review for tone, idiom, and terminology; and
- a subject-matter review by a qualified Zhouyi/Yijing reader, especially for line-level nuance.

## Regression protection

Automated tests now cover:

- all 64 source cards and their generated artifacts;
- the six corrected Chinese strings;
- Qian/Kun special all-lines-changing reflections in EN, BG, and RU;
- the exact 1:5:7:3 yarrow distribution;
- physical feasibility of every displayed yarrow change;
- bottom-up ordering, changing-line transformation, and all King Wen patterns.
