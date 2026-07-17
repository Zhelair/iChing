import type { Reading } from '../domain/types'

const CURRENT_READING_KEY = 'yi-path:current-reading:v1'
const QUESTION_KEY = 'yi-path:question:v1'

export function setCurrentReading(reading: Reading) {
  sessionStorage.setItem(CURRENT_READING_KEY, JSON.stringify(reading))
}

export function getCurrentReading(): Reading | null {
  try {
    const raw = sessionStorage.getItem(CURRENT_READING_KEY)
    return raw ? JSON.parse(raw) as Reading : null
  } catch {
    return null
  }
}

export function setDraftQuestion(question: string) {
  sessionStorage.setItem(QUESTION_KEY, question)
}

export function getDraftQuestion() {
  return sessionStorage.getItem(QUESTION_KEY) ?? ''
}
