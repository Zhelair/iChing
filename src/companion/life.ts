const LIFE_STORAGE = 'yi-path:companion-life:v1'

export type CompanionLife = {
  interactions: number
  pawPractices: number
  completedPawPractices: number
  lastInteractionAt: string | null
}

const emptyLife: CompanionLife = { interactions: 0, pawPractices: 0, completedPawPractices: 0, lastInteractionAt: null }

export function readCompanionLife(): CompanionLife {
  try {
    return { ...emptyLife, ...JSON.parse(localStorage.getItem(LIFE_STORAGE) ?? '{}') as Partial<CompanionLife> }
  } catch {
    return { ...emptyLife }
  }
}

export function recordCompanionMoment(kind: 'interaction' | 'paw-start' | 'paw-complete'): CompanionLife {
  const current = readCompanionLife()
  const next: CompanionLife = {
    interactions: current.interactions + (kind === 'interaction' ? 1 : 0),
    pawPractices: current.pawPractices + (kind === 'paw-start' ? 1 : 0),
    completedPawPractices: current.completedPawPractices + (kind === 'paw-complete' ? 1 : 0),
    lastInteractionAt: new Date().toISOString(),
  }
  localStorage.setItem(LIFE_STORAGE, JSON.stringify(next))
  return next
}
