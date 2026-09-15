import type { SRSCard, ReviewQuality, CardState } from '@elp/types'

// ─── Result types ─────────────────────────────────────────────────────────────

/**
 * Result of evaluating a card review.
 * Contains the fields that must be updated on the SRSCard after a review.
 */
export interface ReviewResult {
  readonly state: CardState
  readonly interval: number
  readonly easeFactor: number
  readonly reps: number
  readonly lapses: number
  readonly dueDate: string
}

/**
 * Input required to calculate the next review for a card.
 * This type exists so the algorithm can be tested without a full SRSCard object.
 */
export interface ReviewInput {
  readonly currentState: CardState
  readonly interval: number
  readonly easeFactor: number
  readonly reps: number
  readonly lapses: number
  readonly quality: ReviewQuality
  /** ISO timestamp of when the review took place */
  readonly reviewedAt: string
  /**
   * Response latency in milliseconds (time from card display to answer tap).
   * Optional — undefined when not measured (e.g. legacy callers, unit tests).
   *
   * If latencyMs > FRICTION_THRESHOLD_MS (7 000 ms), the algorithm will cap the
   * effective quality at 3 even if the user scored higher, scheduling a closer
   * follow-up review to reinforce the slow-recall word.
   *
   * References: discusion-pedagogica.md §9 (Telemetría de Latencia Cognitiva)
   */
  readonly latencyMs?: number
}

// ─── Configuration ────────────────────────────────────────────────────────────

/**
 * SRS algorithm configuration.
 * All values are tunable per deployment without changing the algorithm code.
 */
export interface SRSConfig {
  /** Minimum ease factor (SM-2 standard: 1.3) */
  readonly minEaseFactor: number
  /** Maximum ease factor (SM-2 standard: 2.5) */
  readonly maxEaseFactor: number
  /** Initial ease factor for new cards */
  readonly initialEaseFactor: number
  /** Interval (days) for cards entering the learning phase */
  readonly learningIntervals: readonly number[]
  /** Minimum quality score to pass a review (i.e. not trigger relearning) */
  readonly passingQuality: ReviewQuality
  /** Interval (days) at which a card is considered "dominated" */
  readonly dominatedThreshold: number
  /** Maximum number of new cards to introduce per session */
  readonly maxNewCardsPerDay: number
  /** Maximum number of review cards per session */
  readonly maxReviewsPerDay: number
}

export const DEFAULT_SRS_CONFIG: SRSConfig = {
  minEaseFactor: 1.3,
  maxEaseFactor: 2.5,
  initialEaseFactor: 2.5,
  learningIntervals: [1, 4] as const,
  passingQuality: 3,
  dominatedThreshold: 90,
  maxNewCardsPerDay: 20,
  maxReviewsPerDay: 100,
}

// ─── Study Session Queue ──────────────────────────────────────────────────────

export interface StudySessionQueue {
  /** Cards currently due for review (overdue and due today) */
  readonly reviewCards: readonly SRSCard[]
  /** New cards introduced in this session, capped by maxNewCardsPerDay */
  readonly newCards: readonly SRSCard[]
  /** Combined ordered queue for the study session */
  readonly queue: readonly SRSCard[]
  /** Total count of cards in the session */
  readonly total: number
}

// ─── Scheduler interface ──────────────────────────────────────────────────────

/**
 * Filters a set of cards into those due for review.
 * Only considers cards with dueDate <= now.
 *
 * @param cards - All SRS cards for a user
 * @param now   - ISO timestamp reference (default: current time)
 * @returns     Cards due, overdue first (oldest dueDate asc), then due today
 */
export type GetDueCards = (cards: readonly SRSCard[], now?: string) => readonly SRSCard[]

// ─── Algorithm interface ──────────────────────────────────────────────────────

/**
 * Pure function interface for the SRS algorithm.
 * Takes the current card state + quality rating → returns updated fields.
 *
 * Implements the SM-2 modified algorithm:
 * - Ease factor: EF' = clamp(EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)), min, max)
 * - Interval progression across learning, review, relearning, and dominated states
 *
 * @throws {Error} If quality is out of range [0, 5]
 */
export type CalculateNextReview = (input: ReviewInput, config?: Partial<SRSConfig>) => ReviewResult
