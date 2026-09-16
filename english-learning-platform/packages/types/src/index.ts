/**
 * CEFR & Specialized Curriculum Levels supported by the platform.
 * IDs are permanent — never change a level code after content is published.
 * - A1: Acceso / Principiante
 * - A2: Plataforma / Elemental
 * - B1: Umbral / Intermedio
 * - B2: Avanzado / Fluidez Profesional
 * - C1: Pronunciación & Fonética Avanzada (Reducción de acento, connected speech)
 * - C2: Club de Conversación General (Debates, role-play, idioms)
 * - D1: Inglés Profesional Especializado por Ramas (Tecnología, Derecho, Medicina, etc.)
 * - D2: Club de Conversación Laboral Vitalicio por Rama Especializada
 */
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'D1' | 'D2'

/**
 * Specialized professional branches for levels D1 (Vocabulario Técnico) and D2 (Club Laboral).
 */
export type ProfessionalTrack =
  | 'technology'
  | 'law'
  | 'foreign_trade'
  | 'medicine'
  | 'teaching'
  | 'business'
  | 'general'

/**
 * Metadata descriptor for a professional track.
 */
export interface ProfessionalTrackInfo {
  readonly id: ProfessionalTrack
  readonly title: string
  readonly subtitle: string
  readonly icon: string
  readonly description: string
  readonly isVitalicioClub: boolean
}

/**
 * Lifecycle status of any educational content item.
 * Content must follow: draft → review → approved → published
 * 'deprecated' marks content that is no longer active but must not be deleted
 * (SRS history references may exist).
 */
export type ContentStatus =
  | 'draft'
  | 'curated'
  | 'review'
  | 'teacher_reviewed'
  | 'approved'
  | 'published'
  | 'deprecated'

/**
 * Part of speech values used to classify vocabulary items.
 */
export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'pronoun'
  | 'interjection'
  | 'article'
  | 'determiner'
  | 'phrasal-verb'

/**
 * Irregular verb forms for verbs that don't follow standard -ed pattern.
 */
export interface IrregularForms {
  readonly base: string
  readonly past: string
  readonly participle: string
}

/**
 * Core vocabulary item.
 *
 * The `id` field is PERMANENT. Once a vocabulary item is published, its ID
 * must never change. SRS history, user progress records, and reading
 * annotations all reference this ID. Changing it breaks user data.
 *
 * ID format: voc_{level}_{word-slug}_{sequence}
 * Example:   voc_a1_go_001
 */
export interface VocabularyItem {
  /** Permanent unique identifier. Never change after publication. */
  readonly id: string
  /** English word or phrase */
  readonly word: string
  /** Spanish translation (most common usage) */
  readonly translation: string
  readonly partOfSpeech: PartOfSpeech
  readonly level: CEFRLevel
  /** Week number within the level (1-based) */
  readonly week: number
  /** Thematic topic slug for grouping */
  readonly topic: string
  /** Example sentence in English (optional) */
  readonly example?: string
  /** Spanish translation of the example sentence (optional) */
  readonly exampleTranslation?: string
  /** IPA or simplified pronunciation guide (optional) */
  readonly pronunciation?: string
  /** Spelling variants (e.g. color / colour) */
  readonly variants?: readonly string[]
  /** For irregular verbs: base, past, participle forms */
  readonly irregularForms?: IrregularForms
  /** Curator notes — never shown to learners */
  readonly notes?: string
  /** Slug identifier of the human curator who verified this item */
  readonly verifiedBy: string
  /** ISO date string of verification (YYYY-MM-DD) */
  readonly verifiedAt: string
  /** Original source reference (optional) */
  readonly source?: string
  readonly status: ContentStatus
}

/**
 * A reading comprehension question associated with a passage.
 */
export interface ComprehensionQuestion {
  readonly question: string
  readonly options: readonly string[]
  readonly correctOptionIndex: number
  readonly explanation?: string
}

/**
 * A word-level mapping between English passage terms and Spanish translation terms.
 */
export interface WordMapping {
  readonly en: string
  readonly es: string
  readonly vocabularyId?: string
}

/**
 * A reading passage associated with a level and week.
 *
 * The `id` field is PERMANENT — same rules as VocabularyItem.id apply.
 *
 * ID format: rdg_{level}_{sequence}
 * Example:   rdg_a1_001
 */
export interface ReadingPassage {
  readonly id: string
  readonly level: CEFRLevel
  readonly week: number
  readonly title: string
  readonly text: string
  /** Full Spanish translation of the passage for tap-to-reveal */
  readonly translation: string
  /** IDs of vocabulary items that appear in this passage */
  readonly vocabularyIds: readonly string[]
  /** Difficulty score 1–5 within the level */
  readonly difficulty: 1 | 2 | 3 | 4 | 5
  /** Curated reading comprehension questions */
  readonly comprehensionQuestions?: readonly ComprehensionQuestion[]
  /** Curated word mappings between English words and Spanish translations */
  readonly wordMappings?: readonly WordMapping[]
  readonly verifiedBy: string
  readonly verifiedAt: string
  readonly status: ContentStatus
}

// ─── Grammar Exercise (B1 Fill-the-Blank) ───────────────────────────────────

export type GrammarDifficulty = 'simple' | 'advanced' | 'complex'

/**
 * A grammar exercise of type Fill the Blank (introduced in B1).
 */
export interface GrammarExercise {
  readonly id: string
  readonly level: CEFRLevel
  readonly week: number
  readonly grammarTopic: string
  readonly difficulty: GrammarDifficulty
  /** Sentence with placeholder token, e.g. "If I ___ (have) more time, I would travel more." */
  readonly prompt: string
  readonly promptTranslation: string
  readonly hint?: string
  readonly correctAnswer: string
  readonly acceptedAlternatives: readonly string[]
  readonly explanation: string
  readonly verifiedBy: string
  readonly verifiedAt: string // ISO date (YYYY-MM-DD)
  readonly status: ContentStatus
}

// ─── Writing Prompt (B2 Free Production with Tutor Review) ──────────────────

export type WritingPromptType =
  | 'opinion_essay'
  | 'formal_email'
  | 'narrative'
  | 'argumentative_essay'
  | 'descriptive'
  | 'formal_report'

/**
 * A free writing prompt evaluated by a human tutor/teacher (not algorithmically autocorrected).
 */
export interface WritingPrompt {
  readonly id: string
  readonly level: CEFRLevel
  readonly type: WritingPromptType
  readonly topic: string
  readonly topicTranslation: string
  readonly instructions: string
  readonly targetGrammar: readonly string[]
  readonly minWords: number
  readonly maxWords: number
  /** Specific criteria for the tutor to review */
  readonly rubricForTutor: readonly string[]
  readonly status: ContentStatus
}

// ─── SRS Types ──────────────────────────────────────────────────────────────

/**
 * Self-reported session difficulty from the 1-tap post-session survey.
 * 'easy'   → user felt fluent, no friction.
 * 'normal' → average effort, minor hesitations.
 * 'hard'   → significant friction; triggers honest-mentor feedback message.
 * References: discusion-pedagogica.md §10 (Feedback con Cariño y Verdad)
 */
export type FrictionLevel = 'easy' | 'normal' | 'hard'

/**
 * State machine for a single spaced repetition card.
 *
 * new        → Card has never been studied
 * learning   → Card is in the initial learning phase (short intervals)
 * review     → Card is in the long-term review phase (growing intervals)
 * relearning → Card was forgotten during review; short-interval rescue phase
 * dominated  → Card has very long intervals; considered consolidated
 */
export type CardState = 'new' | 'learning' | 'review' | 'relearning' | 'dominated'

/**
 * Review quality rating provided by the learner (0–5 scale, SM-2 convention).
 * 0 = complete failure; 5 = perfect recall with no hesitation
 */
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5

/**
 * A single SRS card tracking the study state of one vocabulary item
 * for one specific user.
 *
 * NOTE: The `vocabularyItemId` references a permanent VocabularyItem.id.
 * Do NOT store word text here — always look it up from the content package.
 */
export interface SRSCard {
  readonly id: string
  readonly userId: string
  readonly vocabularyItemId: string
  state: CardState
  /** Interval in days until next review */
  interval: number
  /** Ease factor controlling interval growth rate (min 1.3, max 2.5) */
  easeFactor: number
  /** Number of consecutive successful reviews */
  reps: number
  /** Number of times this card was forgotten (quality < 3) */
  lapses: number
  /** ISO timestamp for next scheduled review */
  dueDate: string
  /** ISO timestamp of last review, or null if never reviewed */
  lastReviewed: string | null
}

/**
 * A single review event — one card answered with a specific quality rating.
 * Immutable log: never update or delete review events.
 */
export interface ReviewEvent {
  readonly id: string
  readonly userId: string
  readonly cardId: string
  readonly vocabularyItemId: string
  readonly quality: ReviewQuality
  readonly reviewedAt: string
  /** State of the card BEFORE this review */
  readonly previousState: CardState
  /** State of the card AFTER this review */
  readonly nextState: CardState
  readonly previousInterval: number
  readonly nextInterval: number
  /**
   * Response latency in milliseconds (time from card display to answer tap).
   * Undefined for legacy events recorded before PIAP v1.0.
   * A value > 7000ms indicates cognitive friction even if the answer was correct.
   * References: discusion-pedagogica.md §9 (Telemetría de Latencia Cognitiva)
   */
  readonly latencyMs?: number
  /**
   * True when latencyMs exceeded the 7-second friction threshold.
   * When true, the SM-2 algorithm caps effective quality at 3 regardless of
   * the user's tapped quality, scheduling an earlier review interval.
   */
  readonly frictionFlagged?: boolean
}

/**
 * A post-session 1-tap self-report persisted locally (SQLite) and
 * batch-synced to Supabase. One row per user per calendar day.
 * References: discusion-pedagogica.md §10 (Feedback con Cariño y Verdad)
 */
export interface SessionFeedback {
  readonly id: string
  readonly userId: string
  /** ISO calendar date (YYYY-MM-DD) */
  readonly sessionDate: string
  readonly frictionLevel: FrictionLevel
  readonly createdAt: string
}

/**
 * A study session groups a sequence of review events.
 */
export interface StudySession {
  readonly id: string
  readonly userId: string
  readonly startedAt: string
  readonly endedAt: string | null
  readonly cardsReviewed: number
  readonly cardsCorrect: number
  readonly level: CEFRLevel
}

// ─── User Types ──────────────────────────────────────────────────────────────

/**
 * Public user profile stored in the database.
 * Auth details (email, password hash) are managed exclusively by Supabase Auth.
 */
export interface UserProfile {
  readonly id: string
  readonly displayName: string
  readonly currentLevel: CEFRLevel
  /** Current week within the active level (1-based) */
  readonly currentWeek: number
  /** Consecutive study days */
  readonly streakDays: number
  readonly createdAt: string
  readonly updatedAt: string
  /** Marketing attribution source */
  readonly referralSource?: string | null | undefined
  /** ISO 3166-1 alpha-2 country code */
  readonly countryCode?: string | null | undefined
  /** Timezone offset in hours relative to UTC */
  readonly timezoneOffset?: number | null | undefined
  /** Primary learning goal */
  readonly learningGoal?: string | null | undefined
  /** Optional professional track industry */
  readonly professionalSector?: string | null | undefined
  /** Extracted domain from email (e.g. gmail.com) */
  readonly emailDomain?: string | null | undefined
}
