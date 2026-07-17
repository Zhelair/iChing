# Content contract — Yi Canon

The ancient text, a translator's wording, our editorial explanation and an AI response are not the same thing. The application must never blend them invisibly.

## Four visible content layers

1. **Structural facts** — King Wen number, Chinese name, pinyin, trigrams, yin/yang lines, transformations. Deterministic data, checked against multiple references.
2. **Classical source** — original Chinese passage and passage-level source reference.
3. **Translation pack** — a named translator, edition/year, licence/rights status and language. Never display an unverified web transcription as our own text.
4. **Yi Path editorial / AI reflection** — our original modern explanatory prose, labelled and versioned.

For traditional commentaries use careful attribution: `Ten Wings — traditional commentary, historically attributed to Confucius`. Do not write “Confucius said” as settled historical fact.

## Required hexagram content schema

```ts
type Hexagram = {
  id: number;                 // 1–64, King Wen order
  chinese: string;
  pinyin: string;
  symbols: { linesBottomUp: ('yin' | 'yang')[] };
  trigrams: { upper: string; lower: string };
  resultingByMovingMask: Record<string, number>;
  editorial: {
    version: string;
    en: ReadingCard;
    bg: ReadingCard;
    ru: ReadingCard;
  };
  sources: SourceReference[];
};

type ReadingCard = {
  title: string;
  orientation: string;
  coreThread: string;
  whenItAppears: string;
  reflectionQuestions: string[];
  lineReflections: Record<'1'|'2'|'3'|'4'|'5'|'6', string>;
};
```

The existing detailed drafts are preserved in `content/final`. Treat them as AI-assisted editorial drafts, not publication-ready scholarly translations. Any imported app content should retain its editorial version and source metadata.

## Editorial workflow for each card

1. Verify structural data and original Chinese passage against independent sources.
2. Check interpretive claims against approved English/Russian/Bulgarian references without copying their prose.
3. Write the English editorial master in original language.
4. Produce natural Bulgarian and Russian editorial versions; review terminology and tone with native editors.
5. Record ambiguities, source references, reviewer and version in the editorial ledger.
6. Only mark the release `reviewed` after a qualified editorial/source pass.

## User-facing attribution example

```text
Classical source: Zhouyi, Chinese text
Translation: [translator / edition / licence]
Interpretation: Yi Path Editorial v1.0
AI reflection: generated for this reading, using the passages listed above
```
