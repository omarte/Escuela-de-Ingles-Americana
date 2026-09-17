import type { VocabularyItem, CEFRLevel } from '@elp/types'
import { a1Content } from './a1/index'
import { a2Content } from './a2/index'
import { b1Content } from './b1/index'
import { b2Content } from './b2/index'
import type { ContentRegistry } from './types'

export type { ContentBlock, LevelContent, ContentRegistry } from './types'
export { a1Content } from './a1/index'
export { a2Content } from './a2/index'
export { b1Content } from './b1/index'
export { b2Content } from './b2/index'

/**
 * The full content registry.
 * This object is the single source of truth for all educational content
 * loaded at runtime.
 */
export const contentRegistry: ContentRegistry = {
  A1: a1Content,
  A2: a2Content,
  B1: b1Content,
  B2: b2Content,
}

/**
 * Retrieves all published vocabulary items for a given CEFR level.
 * Filters out items that are not yet in 'published' status.
 */
export function getVocabularyForLevel(level: CEFRLevel): readonly VocabularyItem[] {
  const levelContent = contentRegistry[level]
  if (!levelContent) return []
  return levelContent.blocks.flatMap((block) =>
    block.vocabulary.filter((item) => item.status === 'published' || item.status === 'approved'),
  )
}

/**
 * Retrieves a single vocabulary item by its permanent ID.
 * Returns undefined if not found.
 *
 * NOTE: This searches all levels linearly — acceptable for Phase 01 content
 * volumes. If content grows beyond ~10,000 items, replace with a Map index.
 */
export function getVocabularyById(id: string): VocabularyItem | undefined {
  for (const level of ['A1', 'A2', 'B1', 'B2'] as const) {
    for (const block of contentRegistry[level].blocks) {
      const item = block.vocabulary.find((v) => v.id === id)
      if (item !== undefined) return item
    }
  }
  return undefined
}

/**
 * Retrieves all vocabulary for a specific week within a level.
 */
export function getVocabularyForWeek(level: CEFRLevel, week: number): readonly VocabularyItem[] {
  const levelContent = contentRegistry[level]
  if (!levelContent) return []
  const block = levelContent.blocks.find((b) => b.week === week)
  return block?.vocabulary ?? []
}

/**
 * Returns a flat list of ALL vocabulary items across all levels.
 * Only published items are included.
 */
export function getAllVocabulary(): readonly VocabularyItem[] {
  return (['A1', 'A2', 'B1', 'B2'] as const).flatMap(getVocabularyForLevel)
}

export * from './passages/index'
