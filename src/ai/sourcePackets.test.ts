import { describe, expect, it } from 'vitest'
import { getHexagram } from '../data/hexagrams'
import { createReading, linesFromKnownHexagram } from '../domain/reading'
import { buildRequestPreview } from './deepseek'
import { buildMonthlyPacket, buildReadingPacket } from './sourcePackets'

const editorialFor = (id: number) => getHexagram(id).editorial.en

describe('AI source packets', () => {
  it('includes only the selected reading sources and builds an exact provider preview', () => {
    const reading = createReading({ method: 'beads', locale: 'en', question: 'What needs patience?', lines: linesFromKnownHexagram(24, [1, 4]) })
    reading.note = 'This private note must not be sent.'
    const packet = buildReadingPacket(reading, 'en', editorialFor)
    const preview = buildRequestPreview(packet, 'deepseek-v4-flash')

    expect(packet.question).toBe('What needs patience?')
    expect(packet.movingLines.map((line) => line.position)).toEqual([1, 4])
    expect(JSON.stringify(packet)).not.toContain(reading.note)
    expect(JSON.parse(preview.messages[1].content)).toEqual(packet)
    expect(preview.endpoint).toBe('https://api.deepseek.com/chat/completions')
  })

  it('reduces monthly readings to counts and excludes questions and journal notes', () => {
    const first = createReading({ method: 'digital', locale: 'en', question: 'Private question one', lines: linesFromKnownHexagram(24, [1]) })
    const second = createReading({ method: 'beads', locale: 'en', question: 'Private question two', lines: linesFromKnownHexagram(24, [6]) })
    first.createdAt = '2026-07-05T10:00:00.000Z'; first.note = 'Private journal one'
    second.createdAt = '2026-07-20T10:00:00.000Z'; second.note = 'Private journal two'
    const packet = buildMonthlyPacket([first, second], 'en', new Date('2026-07-01T00:00:00.000Z'), new Date('2026-07-31T23:59:59.999Z'), (id) => editorialFor(id).title)
    const serialized = JSON.stringify(packet)

    expect(packet.readingCount).toBe(2)
    expect(packet.recurringHexagrams[0]).toMatchObject({ id: 24, count: 2 })
    expect(packet.questionsIncluded).toBe(false)
    expect(packet.journalNotesIncluded).toBe(false)
    expect(serialized).not.toContain('Private question')
    expect(serialized).not.toContain('Private journal')
  })
})
