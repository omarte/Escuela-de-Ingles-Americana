import { z } from 'zod'

// ─── CEFR / Status ───────────────────────────────────────────────────────────

export const CEFRLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2'])

export const ContentStatusSchema = z.enum([
  'draft',
  'curated',
  'review',
  'teacher_reviewed',
  'approved',
  'published',
  'deprecated',
])

export const PartOfSpeechSchema = z.enum([
  'noun',
  'verb',
  'adjective',
  'adverb',
  'preposition',
  'conjunction',
  'pronoun',
  'interjection',
  'article',
  'determiner',
  'phrasal-verb',
])

// ─── Vocabulary ID ────────────────────────────────────────────────────────────

/**
 * Validates a vocabulary item ID.
 * Format: voc_{level}_{word-slug}_{3-digit-sequence}
 * Examples: voc_a1_go_001, voc_b1_nevertheless_001
 *
 * Rules:
 * - All lowercase
 * - level: a1, a2, b1, b2
 * - word-slug: letters and hyphens only
 * - sequence: exactly 3 digits
 */
export const VocabularyIdSchema = z
  .string()
  .regex(
    /^voc_(a1|a2|b1|b2)_[a-z][a-z-]*_\d{3}$/,
    'Invalid vocabulary ID. Expected format: voc_{level}_{word-slug}_{3-digit-sequence}',
  )

/**
 * Validates a reading passage ID.
 * Format: rdg_{level}_{3-digit-sequence}
 * Examples: rdg_a1_001, rdg_b2_042
 */
export const ReadingIdSchema = z
  .string()
  .regex(
    /^rdg_(a1|a2|b1|b2)_\d{3}$/,
    'Invalid reading ID. Expected format: rdg_{level}_{3-digit-sequence}',
  )

// ─── Vocabulary Item ──────────────────────────────────────────────────────────

export const IrregularFormsSchema = z.object({
  base: z.string().min(1),
  past: z.string().min(1),
  participle: z.string().min(1),
})

export const VocabularyItemSchema = z.object({
  id: VocabularyIdSchema,
  word: z.string().min(1).max(100),
  translation: z.string().min(1).max(200),
  partOfSpeech: PartOfSpeechSchema,
  level: CEFRLevelSchema,
  week: z.number().int().min(1).max(52),
  topic: z.string().min(1).max(50),
  example: z.string().min(3).max(300).optional(),
  exampleTranslation: z.string().min(3).max(300).optional(),
  pronunciation: z.string().optional(),
  variants: z.array(z.string()).optional(),
  irregularForms: IrregularFormsSchema.optional(),
  notes: z.string().optional(),
  verifiedBy: z.string().min(1),
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'verifiedAt must be YYYY-MM-DD'),
  source: z.string().optional(),
  status: ContentStatusSchema,
})

// ─── Reading Passage ──────────────────────────────────────────────────────────

export const ComprehensionQuestionSchema = z.object({
  question: z.string().min(3),
  options: z.array(z.string().min(1)).min(2).max(4),
  correctOptionIndex: z.number().int().min(0).max(3),
  explanation: z.string().optional(),
})

export const WordMappingSchema = z.object({
  en: z.string().min(1),
  es: z.string().min(1),
  vocabularyId: VocabularyIdSchema.optional(),
})

export const ReadingPassageSchema = z.object({
  id: ReadingIdSchema,
  level: CEFRLevelSchema,
  week: z.number().int().min(1).max(52),
  title: z.string().min(1).max(150),
  text: z.string().min(10).max(5000),
  translation: z.string().min(10).max(5000),
  vocabularyIds: z.array(VocabularyIdSchema).min(1),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  comprehensionQuestions: z.array(ComprehensionQuestionSchema).optional(),
  wordMappings: z.array(WordMappingSchema).optional(),
  verifiedBy: z.string().min(1),
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'verifiedAt must be YYYY-MM-DD'),
  status: ContentStatusSchema,
})

// ─── Content File ─────────────────────────────────────────────────────────────

/**
 * Schema for a content file containing vocabulary items for one level+week.
 * Files live in packages/content/src/{level}/week-{nn}.ts
 */
export const ContentFileSchema = z.object({
  level: CEFRLevelSchema,
  week: z.number().int().min(1).max(52),
  topic: z.string().min(1),
  vocabulary: z.array(VocabularyItemSchema).min(1),
})

// ─── SRS Card ────────────────────────────────────────────────────────────────

export const CardStateSchema = z.enum(['new', 'learning', 'review', 'relearning', 'dominated'])

export const ReviewQualitySchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
])

export const SRSCardSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  vocabularyItemId: VocabularyIdSchema,
  state: CardStateSchema,
  interval: z.number().int().min(0),
  easeFactor: z.number().min(1.3).max(2.5),
  reps: z.number().int().min(0),
  lapses: z.number().int().min(0),
  dueDate: z.string().datetime(),
  lastReviewed: z.string().datetime().nullable(),
})

// ─── Grammar Exercise (B1 Fill-the-Blank) ───────────────────────────────────

export const GrammarDifficultySchema = z.enum(['simple', 'advanced', 'complex'])

export const GrammarExerciseSchema = z
  .object({
    id: z.string().regex(/^grm_[a-z0-9_]+$/, 'id must match pattern grm_<name>'),
    level: CEFRLevelSchema,
    week: z.number().int().min(1).max(52),
    grammarTopic: z.string().min(1),
    difficulty: GrammarDifficultySchema,
    prompt: z.string().min(1).refine((p) => p.includes('___'), {
      message: "prompt must contain at least one gap marked with '___'",
    }),
    promptTranslation: z.string().min(1),
    hint: z.string().optional(),
    correctAnswer: z.string().min(1),
    acceptedAlternatives: z.array(z.string()),
    explanation: z.string().min(10, 'explanation must be substantial (at least 10 chars)'),
    verifiedBy: z.string().min(1),
    verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'verifiedAt must be YYYY-MM-DD'),
    status: ContentStatusSchema,
  })
  .refine(
    (ex) => (ex.prompt.match(/___/g) ?? []).length === ex.correctAnswer.split('/').length,
    {
      message:
        "number of '___' gaps in prompt must match number of answers separated by '/' in correctAnswer",
    },
  )

export const GrammarExerciseBankSchema = z.array(GrammarExerciseSchema)

// ─── Writing Prompt (B2 Free Production with Tutor Review) ──────────────────

export const WritingPromptTypeSchema = z.enum([
  'opinion_essay',
  'formal_email',
  'narrative',
  'argumentative_essay',
  'descriptive',
  'formal_report',
])

export const WritingPromptSchema = z
  .object({
    id: z.string().regex(/^wrt_[a-z0-9_]+$/, 'id must match pattern wrt_<name>'),
    level: CEFRLevelSchema,
    type: WritingPromptTypeSchema,
    topic: z.string().min(1),
    topicTranslation: z.string().min(1),
    instructions: z.string().min(10),
    targetGrammar: z.array(z.string()),
    minWords: z.number().int().positive(),
    maxWords: z.number().int().positive(),
    rubricForTutor: z
      .array(z.string().min(5))
      .min(2, 'rubric must have at least 2 criteria for tutor review'),
    status: ContentStatusSchema,
  })
  .refine((p) => p.maxWords > p.minWords, {
    message: 'maxWords must be strictly greater than minWords',
  })

export const WritingPromptBankSchema = z.array(WritingPromptSchema)

// ─── Duplicate Detection ─────────────────────────────────────────────────────

export interface DuplicateItemInfo {
  id: string
  level: string
  week: number
  word: string
}

export interface DuplicateGroup {
  normalizedWord: string
  items: DuplicateItemInfo[]
}

export interface DuplicateReport {
  sameLevelDuplicates: DuplicateGroup[]
  crossLevelDuplicates: DuplicateGroup[]
}

export function normalizeWord(word: string): string {
  const trimmed = word.toLowerCase().trim()
  if (trimmed.includes('–')) {
    const base = (trimmed.split('–')[0] ?? '').trim()
    return `irregular_triplet:${base}`
  }
  return trimmed
}

export function findDuplicates(
  blocksByLevel: Record<
    string,
    readonly { week: number; vocabulary: readonly { id: string; word: string }[] }[]
  >,
  levels: readonly string[] = ['A1', 'A2', 'B1', 'B2'],
): DuplicateReport {
  const sameLevelDuplicates: DuplicateGroup[] = []
  const crossLevelDuplicates: DuplicateGroup[] = []
  const globalIndex = new Map<string, DuplicateItemInfo[]>()

  for (const level of levels) {
    const levelIndex = new Map<string, { id: string; word: string; week: number }[]>()
    const blocks = blocksByLevel[level]
    if (!blocks) continue

    for (const block of blocks) {
      for (const item of block.vocabulary) {
        const normalized = normalizeWord(item.word)

        const existing = levelIndex.get(normalized) ?? []
        existing.push({ id: item.id, word: item.word, week: block.week })
        levelIndex.set(normalized, existing)

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
            level,
            week: i.week,
            word: i.word,
          })),
        })
      }
    }
  }

  for (const [normalizedWord, items] of globalIndex) {
    const lvls = new Set(items.map((i) => i.level))
    if (lvls.size > 1) {
      crossLevelDuplicates.push({ normalizedWord, items })
    }
  }

  return { sameLevelDuplicates, crossLevelDuplicates }
}

// ─── SRS Telemetry Schemas ────────────────────────────────────────────────────
// References: discusion-pedagogica.md §9 (Telemetría de Latencia Cognitiva)
//             and §10 (Feedback con Cariño y Verdad)

/** Cognitive friction threshold in milliseconds (7 seconds). */
export const FRICTION_THRESHOLD_MS = 7_000

export const FrictionLevelSchema = z.enum(['easy', 'normal', 'hard'])

/**
 * Full Zod schema for a ReviewEvent, including the new telemetry fields.
 * Both latencyMs and frictionFlagged are optional for backward compatibility
 * with events logged before PIAP v1.0.
 */
export const ReviewEventSchema = z.object({
  id: z.string().min(1),
  userId: z.string().uuid(),
  cardId: z.string().min(1),
  vocabularyItemId: VocabularyIdSchema,
  quality: z.number().int().min(0).max(5),
  reviewedAt: z.string().datetime(),
  previousState: CardStateSchema,
  nextState: CardStateSchema,
  previousInterval: z.number().int().min(0),
  nextInterval: z.number().int().min(0),
  /** Undefined for legacy events; present in all events after PIAP v1.0 */
  latencyMs: z.number().int().min(0).optional(),
  /**
   * True when latencyMs > FRICTION_THRESHOLD_MS.
   * Computed at review time; persisted for analytics.
   */
  frictionFlagged: z.boolean().optional(),
})

/**
 * Payload schema for the 1-tap post-session survey.
 * Written to SQLite locally and batch-synced to Supabase.
 */
export const SessionFeedbackSchema = z.object({
  userId: z.string().uuid(),
  /** ISO calendar date YYYY-MM-DD */
  sessionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected ISO date YYYY-MM-DD'),
  frictionLevel: FrictionLevelSchema,
})

export type ReviewEventPayload = z.infer<typeof ReviewEventSchema>
export type SessionFeedbackPayload = z.infer<typeof SessionFeedbackSchema>

// ─── Re-exports ───────────────────────────────────────────────────────────────

export type {
  CEFRLevel,
  ContentStatus,
  PartOfSpeech,
  VocabularyItem,
  ReadingPassage,
  GrammarDifficulty,
  GrammarExercise,
  WritingPromptType,
  WritingPrompt,
  CardState,
  ReviewQuality,
  SRSCard,
  ReviewEvent,
  SessionFeedback,
  FrictionLevel,
} from '@elp/types'

