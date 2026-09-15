#!/usr/bin/env tsx
/**
 * validate-cumulative-lexicon.ts
 *
 * Enforces the Krashen i+1 Rule: every vocabulary ID referenced in a reading
 * passage MUST have been introduced in a week equal to or earlier than the
 * passage's own week assignment.
 *
 * If any passage contains a "future" vocabulary item, the script prints a
 * detailed report and exits with code 1 (failing CI).
 *
 * Usage:
 *   pnpm validate:cumulative
 *
 * References:
 *   discusion-pedagogica.md §6  — "Síndrome del Choque Nivel Cero"
 *   discusion-pedagogica.md §7  — "Ley Inquebrantable: Input Comprensible i+1"
 *   discusion-pedagogica.md §13.1 — "Calibrador de Lecturas (Regla del 70/30)"
 */

import { contentRegistry, readingPassagesRegistry } from '../packages/content/src/index'
import type { CEFRLevel } from '../packages/types/src/index'

// ─── Build vocabulary ID → week map ──────────────────────────────────────────

/**
 * Maps every vocabulary ID to the week it was introduced within its level.
 * Structure: Map<vocabularyId, { level, week }>
 */
function buildVocabWeekMap(): Map<string, { level: CEFRLevel; week: number }> {
  const map = new Map<string, { level: CEFRLevel; week: number }>()

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2']
  for (const level of levels) {
    const levelContent = contentRegistry[level]
    for (const block of levelContent.blocks) {
      for (const item of block.vocabulary) {
        if (map.has(item.id)) {
          // Should never happen given the duplicate validator, but guard anyway
          console.warn(`⚠️  Duplicate vocabulary ID detected: ${item.id} (level ${level}, week ${block.week})`)
        }
        map.set(item.id, { level, week: block.week })
      }
    }
  }

  return map
}

// ─── Violation types ──────────────────────────────────────────────────────────

interface Violation {
  passageId: string
  passageLevel: CEFRLevel
  passageWeek: number
  violatingVocabId: string
  vocabLevel: CEFRLevel
  vocabIntroducedWeek: number
  weeksAhead: number // how many weeks too early this passage uses the word
}

// ─── Validate ─────────────────────────────────────────────────────────────────

function validateCumulativeLexicon(): void {
  console.log('🔍  validate-cumulative-lexicon — Krashen i+1 Rule Checker')
  console.log('─'.repeat(60))

  const vocabWeekMap = buildVocabWeekMap()
  const violations: Violation[] = []
  const unknownIds: { passageId: string; vocabId: string }[] = []

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2']

  for (const level of levels) {
    const passages = readingPassagesRegistry[level]
    for (const passage of passages) {
      for (const vocabId of passage.vocabularyIds) {
        const vocabEntry = vocabWeekMap.get(vocabId)

        if (vocabEntry === undefined) {
          // ID references a word that doesn't exist in the content package
          unknownIds.push({ passageId: passage.id, vocabId })
          continue
        }

        // Cross-level check: passages can only reference same-level or lower
        // For simplicity, we use level order: A1 < A2 < B1 < B2
        const levelOrder: Record<CEFRLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4 }
        const passageLevelOrder = levelOrder[level]
        const vocabLevelOrder = levelOrder[vocabEntry.level]

        // A reading can reference vocabulary from lower CEFR levels (cumulative)
        if (vocabLevelOrder > passageLevelOrder) {
          violations.push({
            passageId: passage.id,
            passageLevel: level,
            passageWeek: passage.week,
            violatingVocabId: vocabId,
            vocabLevel: vocabEntry.level,
            vocabIntroducedWeek: vocabEntry.week,
            weeksAhead: 0, // Cross-level violation
          })
          continue
        }

        // Same-level check: vocab must be introduced in week ≤ passage week
        if (vocabEntry.level === level && vocabEntry.week > passage.week) {
          violations.push({
            passageId: passage.id,
            passageLevel: level,
            passageWeek: passage.week,
            violatingVocabId: vocabId,
            vocabLevel: vocabEntry.level,
            vocabIntroducedWeek: vocabEntry.week,
            weeksAhead: vocabEntry.week - passage.week,
          })
        }
      }
    }
  }

  // ─── Report ──────────────────────────────────────────────────────────────

  let hasErrors = false

  if (unknownIds.length > 0) {
    hasErrors = true
    console.error(`\n❌  UNKNOWN VOCABULARY IDs (${unknownIds.length} found)`)
    console.error('   These IDs appear in reading passages but do not exist in the content package.')
    for (const { passageId, vocabId } of unknownIds) {
      console.error(`     Passage ${passageId}  →  ${vocabId}  (NOT FOUND)`)
    }
  }

  if (violations.length > 0) {
    hasErrors = true
    console.error(`\n❌  KRASHEN i+1 VIOLATIONS (${violations.length} found)`)
    console.error('   A reading passage references vocabulary not yet introduced at that week.')
    console.error('')

    // Group by passage for readability
    const byPassage = new Map<string, Violation[]>()
    for (const v of violations) {
      const list = byPassage.get(v.passageId) ?? []
      list.push(v)
      byPassage.set(v.passageId, list)
    }

    for (const [passageId, passageViolations] of byPassage) {
      const first = passageViolations[0]
      if (!first) continue
      console.error(
        `  📖  ${passageId}  (${first.passageLevel} — Week ${first.passageWeek})`,
      )
      for (const v of passageViolations) {
        if (v.weeksAhead === 0) {
          console.error(
            `       ⛔  ${v.violatingVocabId}  →  from ${v.vocabLevel} Week ${v.vocabIntroducedWeek}  [CROSS-LEVEL]`,
          )
        } else {
          console.error(
            `       ⛔  ${v.violatingVocabId}  →  introduced in Week ${v.vocabIntroducedWeek}  (+${v.weeksAhead} weeks ahead)`,
          )
        }
      }
      console.error('')
    }

    console.error('💡  Fix options:')
    console.error('   A) Move the passage to the week when all its vocabulary has been taught.')
    console.error('   B) Replace future-vocabulary words with same-week alternatives (human curation required).')
  }

  // ─── Summary ─────────────────────────────────────────────────────────────

  console.log('')
  const totalPassages = (['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).reduce(
    (sum, l) => sum + readingPassagesRegistry[l].length,
    0,
  )
  console.log(`📊  Passages checked: ${totalPassages}`)
  console.log(`📊  Vocabulary IDs checked: ${[...new Set((['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).flatMap(l => readingPassagesRegistry[l].flatMap(p => p.vocabularyIds)))].length}`)

  if (hasErrors) {
    console.error(`\n❌  validate-cumulative-lexicon FAILED — fix violations before merging.\n`)
    process.exit(1)
  } else {
    console.log(`\n✅  All passages comply with the Krashen i+1 Cumulative Lexicon Rule.\n`)
    process.exit(0)
  }
}

validateCumulativeLexicon()
