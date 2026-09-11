import type { CEFRLevel, ReadingPassage } from '@elp/types'
import { a1ReadingPassages } from './a1'
import { a2ReadingPassages } from './a2'
import { b1ReadingPassages } from './b1'
import { b2ReadingPassages } from './b2'

export { a1ReadingPassages } from './a1'
export { a2ReadingPassages } from './a2'
export { b1ReadingPassages } from './b1'
export { b2ReadingPassages } from './b2'

export const readingPassagesRegistry: Record<CEFRLevel, readonly ReadingPassage[]> = {
  A1: a1ReadingPassages,
  A2: a2ReadingPassages,
  B1: b1ReadingPassages,
  B2: b2ReadingPassages,
}

/**
 * Retrieves all reading passages for a given CEFR level.
 */
export function getReadingPassagesByLevel(level: CEFRLevel): readonly ReadingPassage[] {
  return readingPassagesRegistry[level]
}

/**
 * Retrieves a single reading passage by its permanent ID.
 */
export function getReadingPassageById(id: string): ReadingPassage | undefined {
  for (const level of ['A1', 'A2', 'B1', 'B2'] as const) {
    const found = readingPassagesRegistry[level].find((p) => p.id === id)
    if (found) return found
  }
  return undefined
}
