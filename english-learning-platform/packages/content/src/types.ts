import type { VocabularyItem, CEFRLevel } from '@elp/types'

/**
 * A content block represents vocabulary for one week within a level.
 */
export interface ContentBlock {
  readonly level: CEFRLevel
  readonly week: number
  readonly topic: string
  /** Human-readable description of the week's theme (optional) */
  readonly description?: string
  readonly vocabulary: readonly VocabularyItem[]
}

/**
 * The full content index for one CEFR level.
 */
export interface LevelContent {
  readonly level: CEFRLevel
  readonly totalWeeks: number
  readonly blocks: readonly ContentBlock[]
}

/**
 * Registry of all content blocks across all levels.
 * Populated at build time by each level's index.ts.
 */
export interface ContentRegistry {
  readonly A1: LevelContent
  readonly A2: LevelContent
  readonly B1: LevelContent
  readonly B2: LevelContent
  readonly C1?: LevelContent
  readonly C2?: LevelContent
  readonly D1?: LevelContent
  readonly D2?: LevelContent
}
