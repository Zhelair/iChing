# Russian localization review

**Locale:** Russian (`ru`)  
**Review date:** 2026-07-20  
**Scope:** Complete editorial and interface review  
**Status:** High-confidence editorial review complete; optional native-editor sign-off remains

## What was reviewed

- all 64 hexagram titles;
- all 64 modern editorial cards, including core threads, context, reflection questions, and changing-line reflections;
- primary navigation and common actions;
- home, method selection, casting, reading result, library, learning, and settings copy;
- digital coins, ordinary coins, yarrow-stalk practice, and direct entry;
- journal, history, privacy, support, image export, and PDF export copy;
- accessibility labels, empty states, errors, and backup/restore language.

The English editorial source was used to verify meaning. Existing Russian text was preserved whenever it was accurate and natural. Changes were limited to clear mistranslations, omissions, grammatical problems, inconsistent terminology, English-shaped syntax, unnecessary jargon, and phrases that did not fit Yi Path's calm voice.

## Approved language standard

- Address the reader consistently with respectful plural forms (`вы`).
- Prefer natural Russian verbs and concrete phrasing over chains of abstract nouns.
- Preserve contemplative imagery without reproducing English syntax mechanically.
- Keep suggestions invitational and non-dogmatic; never turn them into predictions.
- Use `ё` where it belongs in edited prose.
- Use Russian quotation marks (`«…»`) and em dashes where appropriate.
- Keep canonical Chinese characters and tone-marked pinyin in the shared source fields.
- Use established Russian transliteration in localized titles.

## Approved recurring terminology

| English concept | Russian term |
|---|---|
| primary hexagram | основная гексаграмма |
| resulting hexagram | результирующая гексаграмма |
| changing line | изменяющаяся линия |
| stable line | стабильная линия |
| reading | чтение |
| digital coins | цифровые монеты |
| physical coins | обычные монеты |
| yarrow stalks | стебли тысячелистника |
| yarrow method | практика с тысячелистником |
| direct entry | прямой ввод / введено вручную |
| backup | резервная копия |
| Xi Ci | «Си цы» |

`Результирующая гексаграмма` is preferred over `итоговая гексаграмма`: it accurately describes the structural transformation without implying a promised final outcome.

## Representative title decisions

- `Kūn` — `Восприимчивая земля`
- `Sòng` — `Конфликт и его границы`
- `Shī` — `Общее усилие и дисциплина`
- `Tóng Rén` — `Содружество под открытым небом`
- `Gǔ` — `Исправление давнего ущерба`
- `Wú Wàng` — `Невинность`
- `Dà Guò` — `Великое преобладание`
- `Lí` — `Сияющее пламя`
- `Dà Zhuàng` — `Великая мощь`
- `Cuì` — `Воссоединение`
- `Shēng` — `Подъём`
- `Kùn` — `Истощение`
- `Zhèn` — `Пробуждающий гром`
- `Gèn` — `Неподвижность`
- `Guī Mèi` — `Невеста`
- `Duì` — `Радость общения`
- `Xiǎo Guò` — `Малое преобладание`
- `Wèi Jì` — `Ещё не завершено`

The complete approved list is protected by the regression test in `src/data/content.test.ts`.

## Reference hierarchy

The modern titles remain Yi Path editorial titles, not copied translations of a classical edition. Established Russian terminology and transliteration were cross-checked against:

- A. E. Lukyanov, *I Ching (Canon of Changes)*, Institute of Far Eastern Studies RAS / Sichuan University, 2018: <https://www.iccaras.ru/files/abook_file/book-2018-book_of_changes.pdf>
- Russian Yijing reference overview: <https://yijing.narod.ru/b_64hexs.htm>
- Canonical received-text identity and King Wen sequence: <https://ctext.org/book-of-changes>

These references informed terminology and identity only. Yi Path's modern explanatory prose remains original editorial material.

## Technical protection

- Russian content is edited in `content/final/*.md`, then regenerated with `npm.cmd run content:build`.
- Generated full and browser-sharded JSON files must remain synchronized.
- The test suite locks all 64 approved Russian titles.
- Interface tests lock critical recurring terminology and reject a return to `итоговая гексаграмма`.
- Structural tests continue to require 64 complete cards and all changing-line reflections.

## Verification completed

- `npm.cmd test`: 57 tests passed across 7 test files.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: production build passed.
- Mobile viewport review at 390 × 844: Home, Reading, digital-coin preparation and third-line attention cue, Library, a complete hexagram card, Journal, Learn, Settings, and Support.
- No horizontal overflow, framework error overlay, console warning, or console error was found in the reviewed mobile flows.

## Optional final assurance

The locale has received a complete high-confidence language and meaning audit. A professional native Russian editor may still provide publication-level sign-off or taste-level adjustments, but the locale no longer depends on that review for basic correctness, consistency, or natural readability.
