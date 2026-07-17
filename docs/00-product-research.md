# I Ching web app — product notes

## Working idea

**Working name:** `Yi Path` / `Пътят на Промяната`.

Position it as a beautiful, private **reflection ritual and learning companion** for the *Yijing* (I Ching / Book of Changes), not as a machine that predicts or promises outcomes. Launch in **English, Bulgarian, and Russian** together; the interface, editorial material, search, dates and onboarding must all be proper localisations, not machine-translated strings. Bulgarian content is still a valuable early differentiator, but the product should be international from day one.

The important correction: this should not be marketed as “Confucius’s original book.” The Yijing is a composite Chinese classic; the Ten Wings were traditionally attributed to Confucius, but modern scholarship does not accept that he wrote them. See [Oxford Academic](https://academic.oup.com/book/8934/chapter-abstract/155245419) and the [Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/archives/win2022/entries/chinese-change/index.html).

## The product promise

> Take a quiet moment. Ask an honest question. Receive the symbols faithfully. Make your own meaning.

That is more differentiated than another instant “AI fortune teller.” It builds trust with serious users and remains inviting to curious beginners.

## MVP — the smallest version worth shipping

1. **Choose a consultation method**
   - **I cast real coins** — enter each throw as 6, 7, 8, or 9, bottom line first; include a tiny illustrated helper.
   - **Guide my cast** — six intentional press-and-release interactions, with optional soft sound/haptic feedback; use a true random source and the authentic three-coin distribution (6: 1/8, 7: 3/8, 8: 3/8, 9: 1/8).
   - **I already have a hexagram** — select it and its changing lines.
2. **A short pause before casting** — optional private question, with examples of open questions and a reminder that the user can skip it.
3. **Reading result** — primary hexagram, changing lines, relating hexagram, a clear “read in this order” path, and plain-language interpretation.
4. **Reflection journal** — save the question, result, notes, tags and date. Local-first by default; export to Markdown/PDF.
5. **Learn** — a friendly 64-hexagram library, three-coin method, changing-lines explainer, and a small glossary.
6. **Languages from day one** — interface is fully internationalised. Start with Bulgarian and English; do not translate sacred/classical content automatically.

## The moment that should feel special

The virtual casting flow should be **six calm, deliberate throws**, not a casino-like coin animation:

`intention → press/hold → release → one line settles → repeat ×6 → hexagram reveals`

Every throw must have an ordinary visible control as an alternative. Make motion optional, short (150–300 ms), and respect reduced-motion preferences.

## Content and rights — do this carefully

- The ancient Chinese source is old, but **modern translations, annotations, and editorial structure can be protected**. US Copyright Office guidance explicitly treats translations as derivative works. Do not copy a Wilhelm, Baynes, Barrett, Legge display edition, or anyone’s app copy without verifying rights; do not scrape a source site because it is viewable online. See [Copyright Office guidance](https://www.copyright.gov/eco/help-limitation.html).
- A safe MVP content route: commission a Bulgarian sinologist to create original modern explanations, clearly distinguish them from translated classical passages, and retain a written rights agreement. For English, start with a demonstrably public-domain translation only after a territory-specific rights check, or license a contemporary one.
- There is a particularly promising local partnership lead: Iztok-Zapad sells a recent scholarly Bulgarian translation from classical Chinese by Dr. Teodora Kutsarova. Ask the publisher and translator about a digital excerpt/licensing collaboration; do not assume the book text is reusable. [Publisher page](https://iztok-zapad.eu/idzin-kniga-na-promenite-kniga-parva)
- Show source/translator/version on every reading. Let users compare approved translations later, but never blend them invisibly.
- This is product-direction research, not legal advice. Get a Bulgarian/EU IP lawyer to clear the final content and AI workflow.

## What existing products teach us

| Product / pattern | What it proves | Better direction for us |
| --- | --- | --- |
| [I Ching with Clarity](https://www.onlineclarity.co.uk/reading/) | Trust grows from authentic commentary, community and a serious journal. Its journal supports casting, hand entry, history and text comparison. | Private reflection and a beautiful reading flow first; community only after strong moderation and safeguards. |
| [Clarity’s membership](https://www.onlineclarity.co.uk/shop-2/) | Serious users will pay for learning, interpretation support and community—not merely a random cast. | Sell a learning/journal practice, not access to the oracle itself. |
| [I Ching app on Google Play](https://play.google.com/store/apps/details?id=com.iching.app) | A simple daily ritual and clean, low-friction experience attracts casual users. | Use a non-pushy daily “contemplation,” never addictive streak pressure or deterministic predictions. |
| [Hexagram Dreams](https://www.hexagramdreams.com/) | Current products already combine 3-coin casting, AI, journaling, voice and analytics. | Avoid competing on generic AI; win with Bulgarian editorial quality, ritual design and user agency. |

## Paid layer that feels fair

Keep every person able to cast, enter real coins, see the primary/relating hexagram, read a basic interpretation and save a few readings for free. Paywalls on the actual oracle will feel extractive.

- **Free:** unlimited casting, core 64 library, three saved readings, local notes, Bulgarian/English UI.
- **Plus — about 6–8 BGN/month or 49–59 BGN/year:** unlimited journal, encrypted sync, exports, tags/search, personal pattern view, extra licensed commentary/translation, audio reflections, custom practice reminders.
- **Courses / seasonal packs — one-off:** a beginner course, “how to ask” workshop, classical context, or partner-led Bulgarian content. This may be stronger than an expensive subscription in a small first market.
- **Later:** a carefully moderated reading circle or live sessions with qualified teachers. Never sell “certainty” or crisis guidance.

Avoid ads in the consultation flow; they would immediately destroy the atmosphere and credibility.

## A better monetisation model — pay for depth, never for the oracle

An I Ching app has a real retention problem: people do not necessarily consult it every day. A single subscription is therefore a poor fit for everyone. Use a **hybrid model**:

| Offer | Pricing shape | What the user receives | Why it is fair |
| --- | --- | --- | --- |
| **Free foundation** | Free forever | Unlimited manual/digital casting, method transparency, basic source text, a small journal, all 64 hexagram basics | Access to the core practice should not be held hostage. |
| **Library packs** | One-off purchase, by language or topic | A licensed translation, expert commentary, beginner course, audio guide or historical context | The payment directly funds authors, translators and scholarship. |
| **Practice Plus** | Low annual plan, with monthly optional | Unlimited encrypted journal/sync, search, exports, pattern links, reminders and multi-device use | It pays for ongoing private storage and convenience, not wisdom itself. |
| **Reflection credits** | Small, optional credit packs | A source-citing AI reflection session, voice-to-journal cleanup or a guided spread | It prevents expensive AI usage being subsidised by people who never use it. |
| **Later: practitioner studio** | Higher monthly professional tier | Client-safe readings, branded PDF exports, consented client records, source/version controls | A distinct paid user with genuine work value—only after the consumer app has earned trust. |

Do not launch all five. Launch free + one library pack + Practice Plus. Test whether users buy a course/commentary once or value private journaling every year. Existing apps commonly charge for unlimited AI interpretation, custom readings, cloud backup, advanced statistics, and question suggestions; those features are valid, but they are not a sufficient identity by themselves. See [Hexagram Dreams](https://apps.apple.com/us/app/i-ching-app-hexagram-dreams/id6480458200) and [I Ching Oracle Advisor](https://play.google.com/store/apps/details?id=com.fedeapps.iching).

## Source of truth — a content system, not a single borrowed website

The source of truth should be a versioned, reviewable **Yi Canon** maintained in your own repository/database. It must separate facts, source texts, translations and our editorial interpretation.

```text
Yi Canon v1.0
├─ Structure: 8 trigrams, 64 King Wen hexagrams, six lines, transformations
├─ Classical corpus: Chinese source text, passage-level references
├─ Translation packs: English / Bulgarian / Russian, each with explicit licence
├─ Editorial packs: original beginner explanations, glossary, course content
├─ Calculation rules: coin/yarrow probabilities and changing-line mapping
└─ Provenance: source, author/translator, licence, reviewer, revision and date
```

**1. Structural facts:** hand-curate the 64 hexagrams, trigrams, line positions and transformations in `hexagrams.v1.json`. These are finite, deterministic data—not something an AI should invent. Validate every entry against at least two independent references and protect the casting engine with test cases.

**2. Classical Chinese text:** use an authoritative scholarly reference to check it, but do not treat a website as a content API. The [Chinese Text Project](https://ctext.org/book-of-changes/ens) is excellent for research and parallel viewing, but its terms say the site and content may not be republished without permission, and translations remain the translators’ copyright. Cite it in research; do not scrape or copy it into the product. [Their terms](https://ctext.org/faq)

**3. Translation packs:** launch only when the exact text and territory have been cleared. A public-domain English edition can be a temporary baseline after jurisdiction-specific review; modern English, Bulgarian and Russian translations should be licensed or newly commissioned. The UI should always display: `Translator · edition/year · source · licence · passage ID`. A user must always know what they are reading.

**4. Original editorial layer:** commission an English/Russian/Bulgarian editorial team (ideally including a sinologist and native editor for each language) to write clear, original explanations. Every editorial claim points back to a passage and source. Do not let AI translate classical passages or silently merge several translations.

**5. Release discipline:** changes happen in named content releases—e.g. `bg-kutsarova-licensed-1.0`, `en-legge-verified-1.0`, `editorial-bg-1.0`—with a changelog. This makes corrections, citations, re-licensing and user trust manageable.

This becomes your defensible asset: a clean multilingual, source-labelled corpus and editorial voice, rather than a copy of whichever I Ching site is easiest to find.

### Copyright in plain language

Ancient Chinese cultural knowledge is not owned by a modern publisher. The **ancient underlying work** can be public domain. But a translation is a new author’s particular choice of words, rhythm, interpretation and explanatory material; copyright protects that new expression, not ownership of the Yijing itself. International copyright practice treats translations as protected derivative works. [WIPO guide](https://www.wipo.int/edocs/pubdocs/en/copyright/615/wipo_pub_615)

There are three valid content routes:

1. **Public-domain translation** — use an exact, verified historical translation such as an old James Legge edition as a clearly labelled baseline. Project Gutenberg hosts a Chinese Yijing edition as public domain **in the USA**, but its label alone is not an international commercial clearance. In Bulgaria/EU, the usual term is life of the author plus 70 years; confirm the exact edition, added notes and every launch territory with a copyright lawyer before shipping. [EU term directive](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32006L0116+), [Gutenberg record](https://www.gutenberg.org/ebooks/25501)
2. **Licensed translation** — negotiate written digital rights with a publisher/translator. This is likely the strongest Bulgarian and Russian experience, and can be sold as a transparent library pack.
3. **Commissioned original translation** — engage a qualified classical-Chinese translator under a carefully drafted agreement that assigns the relevant digital, worldwide, multilingual and derivative-use rights to the company, while preserving agreed credit and moral-rights treatment. The translator normally owns their original expression unless the contract says otherwise.

Never copy an online transcription or a book edition just because the ancient work is public domain. Its transcription, translation, annotations and design can have separate rights.

### Lean no-licensing MVP route (recommended for this project)

You do **not** need to pay a publisher or sign a contract to use the ancient Yijing itself. The first version can be built this way:

1. Use a verified **public-domain Chinese source text** as the classical source. Do not copy a website's translation or its HTML/design; preserve your own canonical text file and source references.
2. Implement the hexagram/trigram/line rules yourself from the finite structural data; this has no need for a paid content provider.
3. Generate a new **AI-assisted contemporary interpretation** in English, Bulgarian or Russian from the resulting hexagram/lines and the classical Chinese passage. It must be labelled as interpretation/paraphrase—not as an authoritative human translation.
4. Add a source drawer: `Classical source: Zhouyi (Chinese text) · Interpretation: AI-assisted, generated for this reading · Methodology`.
5. Never ask an AI to “take the translation from [website]”, scrape a site, or reproduce a named translator. That is exactly how the app could accidentally emit protected wording.

AI is not a magic copyright shield: an output that reproduces a modern translation too closely can still be a problem. But using only a public-domain classical source as input, asking for an original reflective paraphrase, avoiding web scraping, and not presenting it as another author's translation is the straightforward, low-cost path. DeepSeek's terms say users retain input rights and DeepSeek assigns any rights it has in outputs, while also warning outputs may not be unique and that users remain responsible for inputs. [Terms](https://cdn.deepseek.com/policies/en-US/deepseek-terms-of-use.html)

## Should it become broader than I Ching?

**Yes as a long-term vision; no as a launch scope.** The best umbrella is not “a bag of fortune-telling tools.” It is:

> **A private practice for meeting change — through the Yijing, seasons and reflection.**

Build this sequence:

1. **V1 — Yi Path:** consultation, source-labelled reading, journal and learning library.
2. **V1.5 — Seasons:** Chinese solar terms, a calm seasonal calendar, and optional prompts that connect daily life with cycles. This is culturally coherent and useful even without deterministic personal predictions.
3. **V2 — Five Elements as learning:** interactive educational maps of Wu Xing, trigrams and correspondences. Clearly label schools/traditions and sources; do not present it as scientific diagnosis.
4. **V3 — BaZi only with a named expert partner:** a fully transparent calculation engine, birth-data consent, time-zone/true-solar-time methodology, plain-language learning and clear uncertainty. It is a substantial product in its own right, not an “add it next weekend” feature.

Avoid starting with Feng Shui camera scans, face/palm reading, compatibility scores, “lucky day” push notifications, or a generic AI psychic chat. Those are crowded, hard to source responsibly, and pull the product away from its strongest feeling: thoughtful agency.

There is market proof for the expansion route: [The Origin](https://play.google.com/store/apps/details?hl=en_US&id=com.understandiching.ichingdivination) combines I Ching and BaZi while making its methodology visible; other products bundle calendars, BaZi and Feng Shui as well. Our lesson is **transparency and sequencing**, not copying the whole catalogue on day one.

### BaZi: the right boundary for this product

Do **not** make a personal BaZi “what today is good for” card part of V1. The calculation is deterministic, but the interpretive rules, time-zone/true-solar-time decisions, school differences and AI explanation are not trivial. A wrong answer breaks trust much faster than a missing feature—especially because you already know from the earlier BaZi app/RAG work how easily plausible outputs can be wrong.

When it returns, make it an opt-in **personal calendar beta** with all of these: named methodology, precise birth-time uncertainty setting, transparent intermediate calculation, expert-reviewed rules, no high-stakes claims, and a feedback/report-wrong-result control. Start with educational framing (solar terms, your chart symbols, “topics to reflect on”), not “today you must invest / marry / travel.”

## AI layer — the simplest paid idea worth testing

Yes: AI is the cleanest first premium feature, as long as it is a **reflection companion**, not an oracle that invents fortunes.

**Keep the app itself free:** unlimited casting, manual entry, core text and basic reading.

**Offer three free AI reflections** per person. Then one clear plan: **AI Companion** — perhaps €3.99/month or €29/year, with a generous fair-use cap (for example 100 reflections/month). Include a “Support the project” Buy Me a Coffee link in Settings for people who simply want to help; do not make it the business model or put it in the middle of a reading. Do not promise lifetime unlimited AI because inference prices and usage can change.

Each AI reflection should receive only: the user’s optional current question, the calculated lines, the selected source-labelled passages and the user’s desired language. It returns:

1. a short, tentative synthesis;
2. two or three reflection questions;
3. exactly which passages/source pack it used;
4. a clear note that it is AI-assisted reflection, not factual prediction or professional advice.

This does not need a big RAG system at first: one reading involves a small, known packet of source text. Retrieve that deterministic packet by hexagram/line IDs and pass it to the model. Build RAG later only for free-form questions in the learning library.

DeepSeek is a technically viable cost option: its official current V4 Flash price is $0.14 per million uncached input tokens and $0.28 per million output tokens, so a concise reflection is very inexpensive. Pricing is not the main risk; quality, privacy and source control are. [Official pricing](https://api-docs.deepseek.com/quick_start/pricing/)

For privacy, do not send the whole journal to an AI provider. AI must be off by default for local-only users, and turning it on needs an explicit disclosure/consent step. DeepSeek’s policy says it collects user inputs, and it tells developers of downstream apps to disclose their own data-protection rules. That needs proper EU/GDPR review before launch. [Privacy policy](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html?os=___)

### Simplest launch pricing decision

Make the offer one sentence: **“Three AI reflections every month are free. Yi Path Pro is €3.99/month for unlimited personal AI reflections.”**

To make Pro feel like an actual product, without adding fluff, it includes only:

- unlimited AI interpretations (subject to reasonable personal use);
- follow-up chat about the current reading;
- unlimited saved readings, notes, tags and search;
- links to related past readings/patterns.

Everything else—casting, manual entry, the core library, source view, and basic local journal—stays free. A Buy Me a Coffee link is optional and quiet; it is a tip jar, not the plan.

## Competitor lessons worth taking

| Take the lesson | Do not copy the superficial feature |
| --- | --- |
| **Open methodology:** show each coin result, its value, line order and resulting transformation. Users should be able to reproduce a reading with physical coins. | A black-box “the algorithm has spoken” reveal. |
| **Comparison is premium knowledge:** serious users value seeing interpretations side by side. The Yi Jing Library advertises 12+ works and passage comparison. | Dumping six long texts onto a beginner’s first result. |
| **Privacy is a feature:** offer local-first storage and a no-AI mode. One current app markets on-device AI, no tracking and ownership of readings. | Making users create an account before their first consultation. |
| **Question coaching helps beginners:** suggest open, non-leading questions and let users skip the question entirely. | Promising answers about health, money, legal outcomes or other high-stakes decisions. |
| **Journal links create real long-term value:** “You received this hexagram before” is more useful than a generic daily prediction. | Streaks, guilt notifications or addictive engagement loops. |


## A very useful v2, after real usage data

- Private recurring-pattern view: “You met Hexagram 29 again—open the earlier reflections,” not a mystical claim.
- On-device AI *reflection companion*: it may ask gentle questions based on the user’s notes and the licensed/approved text. It should cite the exact source, never invent a quotation, never replace the underlying reading, and offer an off switch.
- Optional physical yarrow-stalk mode/tutorial.
- Read-aloud and accessible large-type mode.
- Share a beautiful, redacted reading card that contains no private question by default.

## Trust and safety rules

- Use “reflection,” “symbol,” “interpretation,” and “practice”; avoid claims of guaranteed prediction, medical/legal/financial advice, or supernatural certainty.
- Put journal text under the user’s control: local-only as the default, clear export/delete, no training on journal content without an explicit opt-in.
- Include a gentle support route when someone writes about immediate danger or a crisis; this app is not a substitute for professional help.
- If community arrives, it needs rules, reporting, moderation and a ban on diagnosing / giving high-stakes instructions from a reading.

## UX/UI design direction (ui-ux-pro-max)

I used the `ui-ux-pro-max` skill for this concept. Its proposed foundation is: **spacious, mobile-first, single-column ritual flow**, calm premium stone/ink surfaces with a restrained gold accent, and Lora + Raleway. Treat glass effects as very subtle—readability wins over decoration.

Suggested tokens from the first pass:

```css
--ink: #1C1917;
--paper: #FAFAF9;
--gold: #A16207;
--muted: #E8ECF0;
--line: #D6D3D1;
```

Non-negotiables for implementation: one primary action per screen, 44px+ targets, WCAG 4.5:1 text contrast, full keyboard navigation, labelled controls, reduced-motion support, and a tested light/dark pair. Use a single SVG icon family—no structural emoji icons. Avoid mystical clichés, black-and-purple neon, fake parchment textures, gambling-style coin effects, cluttered hexagram dashboards, and forced social features.

## Recommended build sequence for the coding chat

1. Build the six-line casting engine and test it thoroughly: line order, changing-line mapping, probabilities, reproducible deterministic tests.
2. Make the manual-entry and virtual-casting flows feel excellent on a 375px phone before building a desktop-heavy interface.
3. Ship the result screen and a tiny licensed/original content set first; structure content so all 64 entries and languages can be added safely later.
4. Add local journal + export before accounts/sync.
5. Test the Bulgarian landing page with 10–15 target users and potential partners before building AI, social, or advanced analytics.

## Validation questions to answer this week

- Can we license the Bulgarian scholarly text or commission original explanations within budget?
- Which audience responds most: existing spiritual-practice users, curious self-reflection users, or students of Chinese philosophy?
- Do people value manual coin-entry enough to choose it over one-tap casting?
- Will Bulgarian users pay more readily for a one-off course/content pack or a low annual membership?
