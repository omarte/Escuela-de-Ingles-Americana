import type { SRSCard } from '@elp/types'
import type { GetDueCards, SRSConfig, StudySessionQueue } from './types'
import { DEFAULT_SRS_CONFIG } from './types'

/**
 * Returns all SRS cards that are due for review at or before `now`.
 *
 * Excludes 'new' cards (which are handled separately in session queues).
 * Cards are sorted by overdue priority:
 * - Oldest dueDate first (most overdue)
 *
 * @param cards - All SRS cards for a user
 * @param now   - ISO timestamp reference (default: current time)
 */
export const getDueCards: GetDueCards = (cards, now) => {
  const referenceTime = now ?? new Date().toISOString()

  const due = cards.filter((card) => card.state !== 'new' && card.dueDate <= referenceTime)

  return [...due].sort((a, b) => {
    return a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0
  })
}

/**
 * Creates a new SRS card for a vocabulary item.
 * New cards start with state 'new', interval 0, and configured initial ease factor.
 */
export function createCard(
  cardId: string,
  userId: string,
  vocabularyItemId: string,
  config: { initialEaseFactor?: number } = {},
): SRSCard {
  return {
    id: cardId,
    userId,
    vocabularyItemId,
    state: 'new',
    interval: 0,
    easeFactor: config.initialEaseFactor ?? DEFAULT_SRS_CONFIG.initialEaseFactor,
    reps: 0,
    lapses: 0,
    dueDate: new Date().toISOString(),
    lastReviewed: null,
  }
}

/**
 * Builds a balanced study session queue respecting daily card limits.
 *
 * Queue structure:
 * 1. Due review cards (overdue first), capped at maxReviewsPerDay.
 * 2. New cards, capped at maxNewCardsPerDay.
 *
 * @param cards - All cards associated with the user
 * @param options - Custom now reference and config overrides
 */
export function buildStudySessionQueue(
  cards: readonly SRSCard[],
  options?: {
    now?: string
    config?: Partial<SRSConfig>
  },
): StudySessionQueue {
  const config = { ...DEFAULT_SRS_CONFIG, ...options?.config }
  const now = options?.now ?? new Date().toISOString()

  // 1. Get due review cards (overdue + due today)
  const dueReviews = getDueCards(cards, now).slice(0, config.maxReviewsPerDay)

  // 2. Get new cards
  const newCards = cards.filter((card) => card.state === 'new').slice(0, config.maxNewCardsPerDay)

  const queue = [...dueReviews, ...newCards]

  return {
    reviewCards: dueReviews,
    newCards,
    queue,
    total: queue.length,
  }
}
