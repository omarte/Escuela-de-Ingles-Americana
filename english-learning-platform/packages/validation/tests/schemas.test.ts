import { describe, it, expect } from 'vitest'
import {
  VocabularyIdSchema,
  ReadingIdSchema,
  VocabularyItemSchema,
  ReadingPassageSchema,
} from '../src/index'

// ─────────────────────────────────────────────────────────────────────────────
// TEST-ONLY fixtures — not educational content, not for production use
// These IDs and values are synthetic identifiers for schema validation tests only
// ─────────────────────────────────────────────────────────────────────────────

const TEST_ONLY_VALID_VOCAB_ID = 'voc_a1_aaa_001'
const TEST_ONLY_VALID_READING_ID = 'rdg_a1_001'

const TEST_ONLY_MINIMAL_VOCAB_ITEM = {
  id: TEST_ONLY_VALID_VOCAB_ID,
  word: 'test-word',
  translation: 'test-translation',
  partOfSpeech: 'noun' as const,
  level: 'A1' as const,
  week: 1,
  topic: 'test-topic',
  example: 'This is a test example sentence.',
  exampleTranslation: 'Esta es una oración de ejemplo de prueba.',
  verifiedBy: 'TEST_ONLY',
  verifiedAt: '2024-01-01',
  status: 'draft' as const,
}

describe('VocabularyIdSchema', () => {
  it('accepts valid IDs', () => {
    expect(VocabularyIdSchema.safeParse('voc_a1_go_001').success).toBe(true)
    expect(VocabularyIdSchema.safeParse('voc_a2_run-away_001').success).toBe(true)
    expect(VocabularyIdSchema.safeParse('voc_b1_nevertheless_042').success).toBe(true)
    expect(VocabularyIdSchema.safeParse('voc_b2_paradigm_099').success).toBe(true)
  })

  it('rejects IDs with wrong prefix', () => {
    expect(VocabularyIdSchema.safeParse('word_a1_go_001').success).toBe(false)
  })

  it('rejects IDs with unknown level', () => {
    expect(VocabularyIdSchema.safeParse('voc_c1_go_001').success).toBe(false)
    expect(VocabularyIdSchema.safeParse('voc_A1_go_001').success).toBe(false)
  })

  it('rejects IDs with uppercase letters', () => {
    expect(VocabularyIdSchema.safeParse('voc_a1_GO_001').success).toBe(false)
  })

  it('rejects IDs with sequence not 3 digits', () => {
    expect(VocabularyIdSchema.safeParse('voc_a1_go_01').success).toBe(false)
    expect(VocabularyIdSchema.safeParse('voc_a1_go_1000').success).toBe(false)
  })

  it('rejects IDs with numbers in word slug', () => {
    expect(VocabularyIdSchema.safeParse('voc_a1_g0_001').success).toBe(false)
  })
})

describe('ReadingIdSchema', () => {
  it('accepts valid reading IDs', () => {
    expect(ReadingIdSchema.safeParse(TEST_ONLY_VALID_READING_ID).success).toBe(true)
    expect(ReadingIdSchema.safeParse('rdg_b2_099').success).toBe(true)
  })

  it('rejects invalid reading IDs', () => {
    expect(ReadingIdSchema.safeParse('rdg_c1_001').success).toBe(false)
    expect(ReadingIdSchema.safeParse('reading_a1_001').success).toBe(false)
  })
})

describe('VocabularyItemSchema', () => {
  it('accepts a valid minimal vocabulary item (TEST_ONLY fixture)', () => {
    const result = VocabularyItemSchema.safeParse(TEST_ONLY_MINIMAL_VOCAB_ITEM)
    expect(result.success).toBe(true)
  })

  it('rejects an item with invalid id', () => {
    const result = VocabularyItemSchema.safeParse({
      ...TEST_ONLY_MINIMAL_VOCAB_ITEM,
      id: 'invalid-id',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an item with missing required fields', () => {
    const { translation, ...withoutTranslation } = TEST_ONLY_MINIMAL_VOCAB_ITEM
    const result = VocabularyItemSchema.safeParse(withoutTranslation)
    expect(result.success).toBe(false)
  })

  it('rejects an item with invalid verifiedAt date format', () => {
    const result = VocabularyItemSchema.safeParse({
      ...TEST_ONLY_MINIMAL_VOCAB_ITEM,
      verifiedAt: '01/01/2024',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an item with invalid partOfSpeech', () => {
    const result = VocabularyItemSchema.safeParse({
      ...TEST_ONLY_MINIMAL_VOCAB_ITEM,
      partOfSpeech: 'particle',
    })
    expect(result.success).toBe(false)
  })
})

describe('ReadingPassageSchema', () => {
  const TEST_ONLY_PASSAGE = {
    id: 'rdg_a1_001',
    level: 'A1' as const,
    week: 1,
    title: 'Test Passage',
    text: 'This is a test reading passage with some words.',
    translation: 'Este es un pasaje de lectura de prueba con algunas palabras.',
    vocabularyIds: ['voc_a1_hello_001', 'voc_a1_word_001'],
    difficulty: 1 as const,
    comprehensionQuestions: [
      {
        question: 'What is this?',
        options: ['A test', 'A car', 'A dog'],
        correctOptionIndex: 0,
        explanation: 'The text states it is a test.',
      },
    ],
    verifiedBy: 'TEST_ONLY',
    verifiedAt: '2024-01-01',
    status: 'draft' as const,
  }

  it('accepts a valid reading passage', () => {
    const result = ReadingPassageSchema.safeParse(TEST_ONLY_PASSAGE)
    expect(result.success).toBe(true)
  })

  it('rejects a passage without translation', () => {
    const { translation, ...noTranslation } = TEST_ONLY_PASSAGE
    const result = ReadingPassageSchema.safeParse(noTranslation)
    expect(result.success).toBe(false)
  })

  it('rejects a passage with empty vocabularyIds', () => {
    const result = ReadingPassageSchema.safeParse({
      ...TEST_ONLY_PASSAGE,
      vocabularyIds: [],
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid question with only 1 option', () => {
    const result = ReadingPassageSchema.safeParse({
      ...TEST_ONLY_PASSAGE,
      comprehensionQuestions: [
        {
          question: 'Invalid question',
          options: ['Only one'],
          correctOptionIndex: 0,
        },
      ],
    })
    expect(result.success).toBe(false)
  })
})
