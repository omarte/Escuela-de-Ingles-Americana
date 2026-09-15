import { describe, it, expect } from 'vitest'
import {
  getDueCards,
  createCard,
  calculateNextReview,
  buildStudySessionQueue,
  DEFAULT_SRS_CONFIG,
} from '../src/index'
import type { SRSCard } from '@elp/types'

// ─────────────────────────────────────────────────────────────────────────────
// Synthetic test data
// ─────────────────────────────────────────────────────────────────────────────

function makeTestCard(overrides: Partial<SRSCard> = {}): SRSCard {
  return {
    id: 'test-card-id-001',
    userId: 'test-user-id-001',
    vocabularyItemId: 'voc_a1_aaa_001',
    state: 'new',
    interval: 0,
    easeFactor: 2.5,
    reps: 0,
    lapses: 0,
    dueDate: '2024-01-01T00:00:00.000Z',
    lastReviewed: null,
    ...overrides,
  }
}

const PAST = '2024-01-01T00:00:00.000Z'
const OVERDUE_OLDER = '2023-12-01T00:00:00.000Z'
const FUTURE = '2099-12-31T00:00:00.000Z'
const NOW = '2024-06-15T12:00:00.000Z'

// ─── createCard ───────────────────────────────────────────────────────────────

describe('createCard', () => {
  it('creates a card in new state with correct defaults', () => {
    const card = createCard('card-001', 'user-001', 'voc_a1_aaa_001')
    expect(card.state).toBe('new')
    expect(card.interval).toBe(0)
    expect(card.reps).toBe(0)
    expect(card.lapses).toBe(0)
    expect(card.lastReviewed).toBeNull()
    expect(card.easeFactor).toBe(DEFAULT_SRS_CONFIG.initialEaseFactor)
  })

  it('assigns custom initialEaseFactor when provided', () => {
    const card = createCard('card-002', 'user-001', 'voc_a1_aaa_002', {
      initialEaseFactor: 2.1,
    })
    expect(card.easeFactor).toBe(2.1)
  })

  it('assigns provided IDs correctly', () => {
    const card = createCard('card-xyz', 'user-abc', 'voc_b1_bbb_001')
    expect(card.id).toBe('card-xyz')
    expect(card.userId).toBe('user-abc')
    expect(card.vocabularyItemId).toBe('voc_b1_bbb_001')
  })
})

// ─── getDueCards & buildStudySessionQueue ─────────────────────────────────────

describe('getDueCards', () => {
  it('returns empty array when no cards are due', () => {
    const cards = [makeTestCard({ state: 'review', dueDate: FUTURE })]
    expect(getDueCards(cards, NOW)).toHaveLength(0)
  })

  it('returns review cards whose dueDate <= now', () => {
    const due = makeTestCard({ id: 'c1', dueDate: PAST, state: 'review' })
    const notDue = makeTestCard({ id: 'c2', dueDate: FUTURE, state: 'review' })
    const result = getDueCards([due, notDue], NOW)
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('c1')
  })

  it('sorts overdue cards oldest first', () => {
    const cardRecent = makeTestCard({ id: 'recent', state: 'review', dueDate: PAST })
    const cardOlder = makeTestCard({ id: 'older', state: 'review', dueDate: OVERDUE_OLDER })

    const result = getDueCards([cardRecent, cardOlder], NOW)
    expect(result[0]?.id).toBe('older')
    expect(result[1]?.id).toBe('recent')
  })

  it('excludes new cards from getDueCards', () => {
    const newCard = makeTestCard({ id: 'new', state: 'new', dueDate: PAST })
    const reviewCard = makeTestCard({ id: 'review', state: 'review', dueDate: PAST })

    const result = getDueCards([newCard, reviewCard], NOW)
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('review')
  })
})

describe('buildStudySessionQueue', () => {
  it('caps review cards according to maxReviewsPerDay', () => {
    const cards: SRSCard[] = Array.from({ length: 15 }, (_, i) =>
      makeTestCard({
        id: `card-${i}`,
        state: 'review',
        dueDate: PAST,
      }),
    )

    const queue = buildStudySessionQueue(cards, {
      now: NOW,
      config: { maxReviewsPerDay: 5 },
    })

    expect(queue.reviewCards).toHaveLength(5)
    expect(queue.total).toBe(5)
  })

  it('caps new cards according to maxNewCardsPerDay', () => {
    const newCards: SRSCard[] = Array.from({ length: 10 }, (_, i) =>
      makeTestCard({
        id: `new-${i}`,
        state: 'new',
      }),
    )

    const queue = buildStudySessionQueue(newCards, {
      now: NOW,
      config: { maxNewCardsPerDay: 3 },
    })

    expect(queue.newCards).toHaveLength(3)
    expect(queue.total).toBe(3)
  })

  it('combines due review cards and new cards in order', () => {
    const reviewCard = makeTestCard({ id: 'rev-1', state: 'review', dueDate: PAST })
    const newCard = makeTestCard({ id: 'new-1', state: 'new' })

    const session = buildStudySessionQueue([newCard, reviewCard], { now: NOW })
    expect(session.queue[0]?.id).toBe('rev-1')
    expect(session.queue[1]?.id).toBe('new-1')
    expect(session.total).toBe(2)
  })
})

// ─── calculateNextReview (SM-2 Full Implementation) ───────────────────────────

describe('calculateNextReview (SM-2 Algorithm)', () => {
  it('throws error for invalid quality ratings', () => {
    expect(() =>
      calculateNextReview({
        currentState: 'new',
        interval: 0,
        easeFactor: 2.5,
        reps: 0,
        lapses: 0,
        // @ts-expect-error Testing invalid input
        quality: -1,
        reviewedAt: NOW,
      }),
    ).toThrow('Review quality must be an integer between 0 and 5')

    expect(() =>
      calculateNextReview({
        currentState: 'new',
        interval: 0,
        easeFactor: 2.5,
        reps: 0,
        lapses: 0,
        // @ts-expect-error Testing invalid input
        quality: 6,
        reviewedAt: NOW,
      }),
    ).toThrow('Review quality must be an integer between 0 and 5')
  })

  describe('Ease Factor Calculations', () => {
    it('quality 5 increases ease factor by 0.10 (capped at maxEaseFactor 2.5)', () => {
      const result = calculateNextReview({
        currentState: 'review',
        interval: 10,
        easeFactor: 2.3,
        reps: 3,
        lapses: 0,
        quality: 5,
        reviewedAt: NOW,
      })
      // 2.3 + 0.10 = 2.40
      expect(result.easeFactor).toBe(2.4)
    })

    it('quality 4 maintains ease factor (delta = 0)', () => {
      const result = calculateNextReview({
        currentState: 'review',
        interval: 10,
        easeFactor: 2.2,
        reps: 3,
        lapses: 0,
        quality: 4,
        reviewedAt: NOW,
      })
      expect(result.easeFactor).toBe(2.2)
    })

    it('quality 3 decreases ease factor by 0.14', () => {
      const result = calculateNextReview({
        currentState: 'review',
        interval: 10,
        easeFactor: 2.0,
        reps: 3,
        lapses: 0,
        quality: 3,
        reviewedAt: NOW,
      })
      // 2.0 - 0.14 = 1.86
      expect(result.easeFactor).toBe(1.86)
    })

    it('clamps ease factor to minEaseFactor (1.30)', () => {
      const result = calculateNextReview({
        currentState: 'review',
        interval: 10,
        easeFactor: 1.4,
        reps: 3,
        lapses: 0,
        quality: 0, // delta is -0.80 -> 1.4 - 0.8 = 0.6 -> clamped to 1.3
        reviewedAt: NOW,
      })
      expect(result.easeFactor).toBe(1.3)
    })

    it('clamps ease factor to maxEaseFactor (2.50)', () => {
      const result = calculateNextReview({
        currentState: 'review',
        interval: 10,
        easeFactor: 2.5,
        reps: 3,
        lapses: 0,
        quality: 5, // 2.5 + 0.10 = 2.60 -> clamped to 2.5
        reviewedAt: NOW,
      })
      expect(result.easeFactor).toBe(2.5)
    })
  })

  describe('Learning Phase State Transitions', () => {
    it('moves new card to learning with interval = 1 on pass', () => {
      const result = calculateNextReview({
        currentState: 'new',
        interval: 0,
        easeFactor: 2.5,
        reps: 0,
        lapses: 0,
        quality: 4,
        reviewedAt: NOW,
      })
      expect(result.state).toBe('learning')
      expect(result.interval).toBe(1)
      expect(result.reps).toBe(1)
      expect(result.lapses).toBe(0)
    })

    it('progresses in learning from rep 1 to rep 2 with interval = 4', () => {
      const result = calculateNextReview({
        currentState: 'learning',
        interval: 1,
        easeFactor: 2.5,
        reps: 1,
        lapses: 0,
        quality: 4,
        reviewedAt: NOW,
      })
      expect(result.state).toBe('learning')
      expect(result.interval).toBe(4)
      expect(result.reps).toBe(2)
    })

    it('graduates from learning to review on rep 3 with calculated interval', () => {
      const result = calculateNextReview({
        currentState: 'learning',
        interval: 4,
        easeFactor: 2.5,
        reps: 2,
        lapses: 0,
        quality: 4,
        reviewedAt: NOW,
      })
      expect(result.state).toBe('review')
      // Step 2 (4) * EF (2.5) = 10
      expect(result.interval).toBe(10)
      expect(result.reps).toBe(3)
    })
  })

  describe('Review Phase and Interval Growth', () => {
    it('multiplies previous interval by ease factor on pass', () => {
      const result = calculateNextReview({
        currentState: 'review',
        interval: 10,
        easeFactor: 2.2,
        reps: 3,
        lapses: 0,
        quality: 4,
        reviewedAt: NOW,
      })
      expect(result.state).toBe('review')
      // 10 * 2.2 = 22
      expect(result.interval).toBe(22)
      expect(result.reps).toBe(4)
    })

    it('transitions to dominated when interval reaches dominatedThreshold (90 days)', () => {
      const result = calculateNextReview({
        currentState: 'review',
        interval: 45,
        easeFactor: 2.5,
        reps: 5,
        lapses: 0,
        quality: 4,
        reviewedAt: NOW,
      })
      // 45 * 2.5 = 112.5 -> 113 days >= 90
      expect(result.interval).toBe(113)
      expect(result.state).toBe('dominated')
    })
  })

  describe('Lapse and Relearning Handling', () => {
    it('transitions review card to relearning on failure (quality < 3)', () => {
      const result = calculateNextReview({
        currentState: 'review',
        interval: 25,
        easeFactor: 2.3,
        reps: 4,
        lapses: 1,
        quality: 1,
        reviewedAt: NOW,
      })
      expect(result.state).toBe('relearning')
      expect(result.interval).toBe(1)
      expect(result.reps).toBe(0)
      expect(result.lapses).toBe(2)
    })

    it('transitions dominated card to relearning on failure', () => {
      const result = calculateNextReview({
        currentState: 'dominated',
        interval: 120,
        easeFactor: 2.4,
        reps: 8,
        lapses: 0,
        quality: 2,
        reviewedAt: NOW,
      })
      expect(result.state).toBe('relearning')
      expect(result.interval).toBe(1)
      expect(result.reps).toBe(0)
      expect(result.lapses).toBe(1)
    })

    it('resets reps to 0 on failure during learning', () => {
      const result = calculateNextReview({
        currentState: 'learning',
        interval: 4,
        easeFactor: 2.5,
        reps: 2,
        lapses: 0,
        quality: 0,
        reviewedAt: NOW,
      })
      expect(result.state).toBe('learning')
      expect(result.interval).toBe(1)
      expect(result.reps).toBe(0)
      expect(result.lapses).toBe(1)
    })
  })

  describe('Due Date Calculation', () => {
    it('sets dueDate exactly interval days in the future', () => {
      const result = calculateNextReview({
        currentState: 'review',
        interval: 5,
        easeFactor: 2.0,
        reps: 2,
        lapses: 0,
        quality: 4,
        reviewedAt: '2026-06-01T12:00:00.000Z',
      })
      // 5 * 2.0 = 10 days
      expect(result.interval).toBe(10)
      expect(result.dueDate).toBe('2026-06-11T12:00:00.000Z')
    })
  })

  describe('Cognitive Latency Degradation', () => {
    it('caps effective quality at 3 when latency exceeds 7000ms', () => {
      // Normal review with quality 5 without latency
      const fastResult = calculateNextReview({
        currentState: 'review',
        interval: 10,
        easeFactor: 2.5,
        reps: 2,
        lapses: 0,
        quality: 5,
        reviewedAt: NOW,
        latencyMs: 2000,
      })

      // Review with quality 5 but latency > 7000ms (should behave like quality 3)
      const slowResult = calculateNextReview({
        currentState: 'review',
        interval: 10,
        easeFactor: 2.5,
        reps: 2,
        lapses: 0,
        quality: 5,
        reviewedAt: NOW,
        latencyMs: 8500,
      })

      // Standard quality 3 result
      const quality3Result = calculateNextReview({
        currentState: 'review',
        interval: 10,
        easeFactor: 2.5,
        reps: 2,
        lapses: 0,
        quality: 3,
        reviewedAt: NOW,
      })

      // Slow result should match quality 3 easeFactor (degraded from 5), not fastResult
      expect(slowResult.easeFactor).toBe(quality3Result.easeFactor)
      expect(slowResult.easeFactor).toBeLessThan(fastResult.easeFactor)
    })

    it('does not degrade quality when latency is at or under 7000ms threshold', () => {
      const result = calculateNextReview({
        currentState: 'review',
        interval: 10,
        easeFactor: 2.2,
        reps: 2,
        lapses: 0,
        quality: 5,
        reviewedAt: NOW,
        latencyMs: 7000,
      })
      // Quality 5 increases easeFactor: 2.2 + 0.1 = 2.3 (under maxEaseFactor 2.5)
      expect(result.easeFactor).toBe(2.3)
    })

    it('does not degrade quality when latencyMs is undefined (legacy behavior)', () => {
      const result = calculateNextReview({
        currentState: 'review',
        interval: 10,
        easeFactor: 2.2,
        reps: 2,
        lapses: 0,
        quality: 5,
        reviewedAt: NOW,
      })
      expect(result.easeFactor).toBe(2.3)
    })

    it('retains failure state when quality < 3 even with high latency', () => {
      const result = calculateNextReview({
        currentState: 'review',
        interval: 20,
        easeFactor: 2.5,
        reps: 3,
        lapses: 0,
        quality: 1,
        reviewedAt: NOW,
        latencyMs: 9000,
      })
      expect(result.state).toBe('relearning')
      expect(result.interval).toBe(1)
      expect(result.reps).toBe(0)
      expect(result.lapses).toBe(1)
    })
  })
})
