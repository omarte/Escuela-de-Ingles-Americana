#!/usr/bin/env tsx
/**
 * validate-content.ts
 *
 * Validates all vocabulary content and reading passages in packages/content/
 * against their respective schemas.
 * Run with: pnpm content:validate
 *
 * Exit codes:
 *   0 - All validations passed
 *   1 - Validation errors found
 *
 * Validates:
 *   - All vocabulary item IDs match the required format
 *   - All IDs are unique across the entire content registry
 *   - All required fields are present and valid (via Zod schema)
 *   - ID level prefix matches the item.level field
 *   - verifiedAt is a valid date
 *   - week numbers are consistent with the containing level block
 *   - All reading passages match ReadingPassageSchema
 *   - All vocabularyIds referenced in reading passages exist in the vocabulary registry
 */

import {
  contentRegistry,
  getVocabularyById,
  readingPassagesRegistry,
} from '../packages/content/src/index'
import { ReadingPassageSchema, VocabularyItemSchema } from '../packages/validation/src/index'
import type { CEFRLevel, VocabularyItem } from '../packages/types/src/index'

const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const
const CEFR_ORDER: Record<CEFRLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6, D1: 7, D2: 8 }

interface ValidationError {
  itemId: string
  level: CEFRLevel
  week: number
  message: string
}

const errors: ValidationError[] = []
const seenIds = new Map<string, { level: CEFRLevel; week: number }>()
const seenReadingIds = new Map<string, { level: CEFRLevel; week: number }>()

function error(item: Pick<VocabularyItem, 'id' | 'level' | 'week'>, message: string): void {
  errors.push({ itemId: item.id, level: item.level, week: item.week, message })
}

console.log('\n🔍  Validating content registry...\n')

let totalItems = 0
let totalPassages = 0

// ─── 1. Vocabulary Validation ────────────────────────────────────────────────
for (const level of LEVELS) {
  const levelContent = contentRegistry[level]
  if (!levelContent) continue

  for (const block of levelContent.blocks) {
    for (const item of block.vocabulary) {
      totalItems++
      const context = { id: item.id, level, week: block.week }

      // 1. Zod schema validation
      const result = VocabularyItemSchema.safeParse(item)
      if (!result.success) {
        for (const issue of result.error.issues) {
          error(context, `Schema: ${issue.path.join('.')} — ${issue.message}`)
        }
      }

      // 2. Unique ID check
      const existing = seenIds.get(item.id)
      if (existing !== undefined) {
        error(
          context,
          `Duplicate ID: ${item.id} already exists in ${existing.level} week ${String(existing.week)}`,
        )
      } else {
        seenIds.set(item.id, { level, week: block.week })
      }

      // 3. ID level prefix must match actual level
      const expectedPrefix = `voc_${level.toLowerCase()}_`
      if (!item.id.startsWith(expectedPrefix)) {
        error(
          context,
          `ID prefix mismatch: "${item.id}" should start with "${expectedPrefix}" for level ${level}`,
        )
      }

      // 4. Week consistency: item.week must match block.week
      if (item.week !== block.week) {
        error(
          context,
          `Week mismatch: item.week (${String(item.week)}) doesn't match block.week (${String(block.week)})`,
        )
      }

      // 5. Item level must match block's level
      if (item.level !== level) {
        error(
          context,
          `Level mismatch: item.level (${item.level}) doesn't match block level (${level})`,
        )
      }
    }
  }

  const blockCount = levelContent.blocks.length
  const itemCount = levelContent.blocks.reduce((sum, b) => sum + b.vocabulary.length, 0)
  console.log(`  ${level} Vocabulary: ${String(blockCount)} weeks, ${String(itemCount)} items`)
}

// ─── 2. Reading Passages Validation ──────────────────────────────────────────
console.log('\n📖  Validating reading passages...\n')

for (const level of LEVELS) {
  const passages = readingPassagesRegistry[level]

  for (const passage of passages) {
    totalPassages++
    const context = { id: passage.id, level, week: passage.week }

    // 1. Zod Schema Validation
    const result = ReadingPassageSchema.safeParse(passage)
    if (!result.success) {
      for (const issue of result.error.issues) {
        error(context, `Reading Schema: ${issue.path.join('.')} — ${issue.message}`)
      }
    }

    // 2. Unique Reading ID check
    const existing = seenReadingIds.get(passage.id)
    if (existing !== undefined) {
      error(
        context,
        `Duplicate Reading ID: ${passage.id} already exists in ${existing.level} week ${String(existing.week)}`,
      )
    } else {
      seenReadingIds.set(passage.id, { level, week: passage.week })
    }

    // 3. Prefix match
    const expectedPrefix = `rdg_${level.toLowerCase()}_`
    if (!passage.id.startsWith(expectedPrefix)) {
      error(
        context,
        `Reading ID prefix mismatch: "${passage.id}" should start with "${expectedPrefix}" for level ${level}`,
      )
    }

    // 4. Vocabulary cross-reference verification
    for (const vocabId of passage.vocabularyIds) {
      const vocabItem = getVocabularyById(vocabId)
      if (!vocabItem) {
        error(context, `Broken reference: vocabularyId "${vocabId}" not found in content registry`)
      } else if (CEFR_ORDER[vocabItem.level] > CEFR_ORDER[level]) {
        error(
          context,
          `Level mismatch in reference: vocabularyId "${vocabId}" is ${vocabItem.level}, which exceeds passage level ${level}`,
        )
      }
    }
  }

  console.log(`  ${level} Passages: ${String(passages.length)} reading passages`)
}

console.log(
  `\n  Total: ${String(totalItems)} vocabulary items, ${String(totalPassages)} reading passages across ${String(LEVELS.length)} levels\n`,
)

if (errors.length === 0) {
  console.log('✅  All validations passed.\n')
  process.exit(0)
} else {
  console.error(`❌  ${String(errors.length)} validation error(s) found:\n`)
  for (const err of errors) {
    console.error(`  [${err.level} W${String(err.week)}] ${err.itemId}`)
    console.error(`    → ${err.message}\n`)
  }
  process.exit(1)
}
