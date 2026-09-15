import { describe, it, expect } from 'vitest'
import {
  VocabularyIdSchema,
  ReadingIdSchema,
  VocabularyItemSchema,
  ReadingPassageSchema,
  GrammarExerciseSchema,
  WritingPromptSchema,
  FrictionLevelSchema,
  ReviewEventSchema,
  SessionFeedbackSchema,
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

describe('GrammarExerciseSchema', () => {
  const validExercise = {
    id: 'grm_b1_pres_perfect_001',
    level: 'B1' as const,
    week: 1,
    grammarTopic: 'Present Perfect vs. Past Simple',
    difficulty: 'simple' as const,
    prompt: 'I ___ (visit) London twice in my life.',
    promptTranslation: 'He visitado Londres dos veces en mi vida.',
    hint: 'visit',
    correctAnswer: 'have visited',
    acceptedAlternatives: ["'ve visited"],
    explanation: 'Usamos Present Perfect para experiencias de vida sin un momento específico en el tiempo.',
    verifiedBy: 'claude-content-review',
    verifiedAt: '2026-09-13',
    status: 'curated' as const,
  }

  it('accepts a valid grammar exercise', () => {
    expect(GrammarExerciseSchema.safeParse(validExercise).success).toBe(true)
  })

  it('accepts a valid multi-blank grammar exercise with aligned slash answers', () => {
    const multiBlank = {
      ...validExercise,
      id: 'grm_b1_cond1_001',
      prompt: 'If it ___ (rain) tomorrow, we ___ (stay) home.',
      correctAnswer: 'rains / will stay',
      acceptedAlternatives: ["rains / 'll stay"],
    }
    expect(GrammarExerciseSchema.safeParse(multiBlank).success).toBe(true)
  })

  it('rejects an exercise when gap count does not match answer count', () => {
    const misaligned = {
      ...validExercise,
      prompt: 'I ___ (go) to the store.', // 1 gap
      correctAnswer: 'went / extra', // 2 answers
    }
    const result = GrammarExerciseSchema.safeParse(misaligned)
    expect(result.success).toBe(false)
  })

  it('rejects an exercise with short or trivial explanation', () => {
    const shortExp = {
      ...validExercise,
      explanation: 'Short', // < 10 chars
    }
    expect(GrammarExerciseSchema.safeParse(shortExp).success).toBe(false)
  })

  it('rejects non-ISO date format in verifiedAt', () => {
    const badDate = {
      ...validExercise,
      verifiedAt: '13-09-2026',
    }
    expect(GrammarExerciseSchema.safeParse(badDate).success).toBe(false)
  })
})

describe('WritingPromptSchema', () => {
  const validPrompt = {
    id: 'wrt_b2_opinion_001',
    level: 'B2' as const,
    type: 'opinion_essay' as const,
    topic: 'Should social media companies be responsible for mental health?',
    topicTranslation: '¿Deberían las redes sociales ser responsables de la salud mental?',
    instructions: 'Write a structured opinion essay of 150-200 words with arguments.',
    targetGrammar: ['Present Perfect', 'Passive Voice'],
    minWords: 150,
    maxWords: 220,
    rubricForTutor: [
      'Estructura: ¿tiene introducción, desarrollo y conclusión claros?',
      'Gramática: ¿hay errores recurrentes de tiempo verbal o concordancia?',
    ],
    status: 'curated' as const,
  }

  it('accepts a valid writing prompt', () => {
    expect(WritingPromptSchema.safeParse(validPrompt).success).toBe(true)
  })

  it('rejects when maxWords is less than or equal to minWords', () => {
    const badWordRange = {
      ...validPrompt,
      minWords: 200,
      maxWords: 150,
    }
    expect(WritingPromptSchema.safeParse(badWordRange).success).toBe(false)
  })

  it('rejects a rubric with fewer than 2 evaluation criteria', () => {
    const singleRubric = {
      ...validPrompt,
      rubricForTutor: ['Solo un criterio'],
    }
    expect(WritingPromptSchema.safeParse(singleRubric).success).toBe(false)
  })
})

describe('FrictionLevelSchema', () => {
  it('accepts valid friction levels', () => {
    expect(FrictionLevelSchema.safeParse('easy').success).toBe(true)
    expect(FrictionLevelSchema.safeParse('normal').success).toBe(true)
    expect(FrictionLevelSchema.safeParse('hard').success).toBe(true)
  })

  it('rejects invalid friction levels', () => {
    expect(FrictionLevelSchema.safeParse('extreme').success).toBe(false)
    expect(FrictionLevelSchema.safeParse('').success).toBe(false)
  })
})

describe('ReviewEventSchema', () => {
  const validEvent = {
    id: 'rev-001',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    cardId: 'card-001',
    vocabularyItemId: 'voc_a1_hello_001',
    quality: 4,
    reviewedAt: '2026-09-15T12:00:00.000Z',
    previousState: 'learning',
    nextState: 'review',
    previousInterval: 1,
    nextInterval: 6,
    latencyMs: 3200,
    frictionFlagged: false,
  }

  it('accepts a valid review event with telemetry', () => {
    expect(ReviewEventSchema.safeParse(validEvent).success).toBe(true)
  })

  it('accepts legacy review event without latencyMs or frictionFlagged', () => {
    const { latencyMs: _, frictionFlagged: __, ...legacyEvent } = validEvent
    expect(ReviewEventSchema.safeParse(legacyEvent).success).toBe(true)
  })

  it('rejects negative latencyMs', () => {
    expect(ReviewEventSchema.safeParse({ ...validEvent, latencyMs: -100 }).success).toBe(false)
  })

  it('rejects non-integer latencyMs', () => {
    expect(ReviewEventSchema.safeParse({ ...validEvent, latencyMs: 12.5 }).success).toBe(false)
  })

  it('rejects invalid vocabularyItemId', () => {
    expect(ReviewEventSchema.safeParse({ ...validEvent, vocabularyItemId: 'invalid_id' }).success).toBe(false)
  })
})

describe('SessionFeedbackSchema', () => {
  const validFeedback = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    sessionDate: '2026-09-15',
    frictionLevel: 'easy' as const,
  }

  it('accepts valid session feedback', () => {
    expect(SessionFeedbackSchema.safeParse(validFeedback).success).toBe(true)
  })

  it('rejects invalid sessionDate format', () => {
    expect(SessionFeedbackSchema.safeParse({ ...validFeedback, sessionDate: '15/09/2026' }).success).toBe(false)
    expect(SessionFeedbackSchema.safeParse({ ...validFeedback, sessionDate: '2026-9-15' }).success).toBe(false)
  })

  it('rejects non-uuid userId', () => {
    expect(SessionFeedbackSchema.safeParse({ ...validFeedback, userId: 'not-a-uuid' }).success).toBe(false)
  })
})

