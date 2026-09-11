#!/usr/bin/env tsx
/**
 * check-duplicates.ts
 *
 * Detects lexical duplicates in the content registry.
 * A lexical duplicate is defined as two vocabulary items with the same
 * normalized word form (lowercase, trimmed) within the same level.
 *
 * Cross-level duplicates are reported as warnings (same word appearing in
 * A1 and A2 for reinforcement is intentional) but same-level duplicates
 * are reported as errors.
 *
 * Run with: pnpm content:duplicates
 *
 * Exit codes:
 *   0 - No errors (warnings may still be printed)
 *   1 - Errors found (same-level duplicates)
 */

import { contentRegistry } from '../packages/content/src/index'
import type { CEFRLevel, VocabularyItem } from '../packages/types/src/index'

const LEVELS: readonly CEFRLevel[] = ['A1', 'A2', 'B1', 'B2']

interface DuplicateEntry {
  normalizedWord: string
  items: Array<{ id: string; level: CEFRLevel; week: number; word: string }>
}

const sameLevelDuplicates: DuplicateEntry[] = []
const crossLevelDuplicates: DuplicateEntry[] = []

// Build a cross-level index: normalizedWord → all items
const globalIndex = new Map<
  string,
  Array<{ id: string; level: CEFRLevel; week: number; word: string }>
>()

for (const level of LEVELS) {
  // Same-level check
  const levelIndex = new Map<string, VocabularyItem[]>()

  for (const block of contentRegistry[level].blocks) {
    for (const item of block.vocabulary) {
      const normalized = item.word.toLowerCase().trim()

      // Within-level
      const existing = levelIndex.get(normalized) ?? []
      existing.push(item)
      levelIndex.set(normalized, existing)

      // Global
      const globalEntry = globalIndex.get(normalized) ?? []
      globalEntry.push({ id: item.id, level, week: block.week, word: item.word })
      globalIndex.set(normalized, globalEntry)
    }
  }

  for (const [normalizedWord, items] of levelIndex) {
    if (items.length > 1) {
      sameLevelDuplicates.push({
        normalizedWord,
        items: items.map((i) => ({
          id: i.id,
          level: i.level,
          week: i.week,
          word: i.word,
        })),
      })
    }
  }
}

// Cross-level duplicates
for (const [normalizedWord, items] of globalIndex) {
  const levels = new Set(items.map((i) => i.level))
  if (levels.size > 1) {
    crossLevelDuplicates.push({ normalizedWord, items })
  }
}

console.log('\n🔍  Checking for lexical duplicates...\n')

if (crossLevelDuplicates.length > 0) {
  console.warn(
    `⚠️   ${crossLevelDuplicates.length} cross-level duplicate(s) (may be intentional):\n`,
  )
  for (const dup of crossLevelDuplicates) {
    console.warn(`  "${dup.normalizedWord}":`)
    for (const item of dup.items) {
      console.warn(`    [${item.level} W${item.week}] ${item.id} — "${item.word}"`)
    }
    console.warn()
  }
}

if (sameLevelDuplicates.length === 0) {
  console.log('✅  No same-level duplicates found.\n')
  process.exit(0)
} else {
  console.error(`❌  ${sameLevelDuplicates.length} same-level duplicate(s) found (must fix):\n`)
  for (const dup of sameLevelDuplicates) {
    console.error(`  "${dup.normalizedWord}":`)
    for (const item of dup.items) {
      console.error(`    [${item.level} W${item.week}] ${item.id} — "${item.word}"`)
    }
    console.error()
  }
  process.exit(1)
}
