import { z } from 'zod'

// ─── CEFR / Status ───────────────────────────────────────────────────────────

export const CEFRLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2'])

export const ContentStatusSchema = z.enum([
  'draft',
  'review',
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

// ─── Re-exports ───────────────────────────────────────────────────────────────

export type {
  CEFRLevel,
  ContentStatus,
  PartOfSpeech,
  VocabularyItem,
  ReadingPassage,
  CardState,
  ReviewQuality,
  SRSCard,
} from '@elp/types'
