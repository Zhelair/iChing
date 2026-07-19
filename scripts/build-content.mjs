import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectDir = resolve(scriptDir, '..')
const sourceDir = resolve(projectDir, 'content', 'final')
const outputDir = join(projectDir, 'src', 'data')
const outputFile = join(outputDir, 'hexagrams.v1.json')
const firstShardFile = join(outputDir, 'hexagrams.v1.01-32.json')
const secondShardFile = join(outputDir, 'hexagrams.v1.33-64.json')
const contentVersion = '2026.07.19-draft.3'

const localeHeadings = {
  en: /^## English(?:\s|—|$)/m,
  bg: /^## Български(?:\s|—|$)/m,
  ru: /^## Русский(?:\s|—|$)/m,
}

const allChangingLineLabels = {
  en: new Set(['All lines changing']),
  bg: new Set(['Всички линии се променят']),
  ru: new Set(['Все линии меняются', 'Все линии изменяются']),
}

function tableValue(markdown, field) {
  const match = markdown.match(new RegExp(`^\\| ${field} \\| ([^|]+) \\|`, 'm'))
  if (!match) throw new Error(`Missing canonical field: ${field}`)
  return match[1].trim()
}

function frontMatterValue(markdown, field) {
  const match = markdown.match(new RegExp(`^\\*\\*${field}:\\*\\* (.+?)\\s*$`, 'm'))
  return match?.[1].replaceAll('`', '').trim() ?? ''
}

function localeSection(markdown, locale) {
  const start = markdown.search(localeHeadings[locale])
  if (start < 0) throw new Error(`Missing ${locale} section`)

  const laterStarts = Object.entries(localeHeadings)
    .filter(([key]) => key !== locale)
    .map(([, pattern]) => {
      const relative = markdown.slice(start + 1).search(pattern)
      return relative < 0 ? Number.POSITIVE_INFINITY : start + 1 + relative
    })
  const end = Math.min(...laterStarts, markdown.length)
  return markdown.slice(start, end)
}

function cleanBlock(block) {
  return block.replace(/^---\s*$/gm, '').trim()
}

function parseLocale(markdown, locale) {
  const section = localeSection(markdown, locale)
  const title = section.match(/^### (.+)$/m)?.[1].trim()
  if (!title) throw new Error(`Missing ${locale} title`)

  const blockSource = `${section}\n**__END__**\n`
  const blocks = [...blockSource.matchAll(/^\*\*(.+?)\*\*\s*\r?\n([\s\S]*?)(?=^\*\*)/gm)]
    .map((match) => ({ heading: match[1].trim(), body: cleanBlock(match[2]) }))
    .filter((block) => block.heading !== '__END__')

  if (blocks.length < 4) {
    throw new Error(`Expected four editorial blocks in ${locale}; found ${blocks.length}`)
  }

  const questions = [...blocks[2].body.matchAll(/^- (.+)$/gm)].map((match) => match[1].trim())
  const lineReflections = Object.fromEntries(
    [...blocks[3].body.matchAll(/^\|\s*([^|]+?)\s*\|\s*(.+?)\s*\|$/gm)]
      .flatMap((match) => {
        const label = match[1].trim()
        if (/^[1-6]$/.test(label)) return [[label, match[2].trim()]]
        if (allChangingLineLabels[locale].has(label)) return [['all', match[2].trim()]]
        return []
      }),
  )

  if (questions.length < 2 || Object.keys(lineReflections).length < 6) {
    throw new Error(`Incomplete ${locale} questions or line reflections`)
  }

  return {
    title,
    coreThread: blocks[0].body,
    whenItAppears: blocks[1].body,
    reflectionQuestions: questions,
    lineReflections,
  }
}

function parseCard(markdown, filename) {
  const classicalBlock = markdown.match(/## Classical Chinese source\s*\r?\n\s*```text\s*\r?\n([\s\S]*?)```/)
  if (!classicalBlock) throw new Error(`Missing classical source in ${filename}`)

  const classicalLines = classicalBlock[1].trim().split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const upper = tableValue(markdown, 'Upper trigram').split('/').at(-1).trim().toLowerCase()
  const lower = tableValue(markdown, 'Lower trigram').split('/').at(-1).trim().toLowerCase()

  return {
    id: Number(tableValue(markdown, 'King Wen number')),
    chinese: tableValue(markdown, 'Chinese'),
    pinyin: tableValue(markdown, 'Pinyin'),
    symbol: tableValue(markdown, 'Hexagram symbol'),
    trigrams: { upper, lower },
    provenance: {
      status: frontMatterValue(markdown, 'Status'),
      classicalSource: frontMatterValue(markdown, 'Classical source'),
      textReference: frontMatterValue(markdown, 'Text reference') || frontMatterValue(markdown, 'Provisional text reference'),
      contentType: frontMatterValue(markdown, 'Content type'),
      sourceFile: filename,
    },
    classical: {
      judgment: classicalLines[0],
      lines: classicalLines.slice(1),
    },
    locales: {
      en: parseLocale(markdown, 'en'),
      bg: parseLocale(markdown, 'bg'),
      ru: parseLocale(markdown, 'ru'),
    },
  }
}

const filenames = (await readdir(sourceDir))
  .filter((filename) => /^hexagram-\d{2}-.*\.md$/.test(filename))

const cards = []
for (const filename of filenames) {
  const markdown = await readFile(join(sourceDir, filename), 'utf8')
  try {
    cards.push(parseCard(markdown, filename))
  } catch (error) {
    throw new Error(`${filename}: ${error.message}`)
  }
}

cards.sort((a, b) => a.id - b.id)

if (cards.length !== 64 || cards.some((card, index) => card.id !== index + 1)) {
  throw new Error('Expected one complete card for each King Wen number 1–64.')
}

for (const id of [1, 2]) {
  const card = cards[id - 1]
  for (const locale of Object.keys(localeHeadings)) {
    if (!card.locales[locale].lineReflections.all) {
      throw new Error(`Hexagram ${id} is missing the ${locale} all-lines-changing reflection.`)
    }
  }
}

const artifact = (artifactCards) => ({
  contentVersion,
  generatedFrom: 'content/final',
  cards: artifactCards,
})

await Promise.all([
  writeFile(outputFile, `${JSON.stringify(artifact(cards), null, 2)}\n`, 'utf8'),
  writeFile(firstShardFile, `${JSON.stringify(artifact(cards.slice(0, 32)), null, 2)}\n`, 'utf8'),
  writeFile(secondShardFile, `${JSON.stringify(artifact(cards.slice(32)), null, 2)}\n`, 'utf8'),
])

console.log(`Built ${cards.length} cards → full release + two browser shards`)
