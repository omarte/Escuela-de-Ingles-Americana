import { describe, it, expect } from 'vitest'
import {
  calculateStreak,
  calculateRetentionRate,
  evaluateLevelAdvancement,
  calculateWeeklyBreakdown,
  type WeekDefinition,
} from '../src/progress'
import type { SRSCard } from '@elp/types'

describe('Progress Engine: calculateStreak', () => {
  it('returns 0 streak for empty activity dates', () => {
    const result = calculateStreak([], '2026-09-10')
    expect(result.currentStreak).toBe(0)
    expect(result.bestStreak).toBe(0)
    expect(result.studiedToday).toBe(false)
    expect(result.lastStudyDate).toBeNull()
  })

  it('recognizes streak when studied today', () => {
    const dates = ['2026-09-08', '2026-09-09', '2026-09-10']
    const result = calculateStreak(dates, '2026-09-10')

    expect(result.currentStreak).toBe(3)
    expect(result.bestStreak).toBe(3)
    expect(result.studiedToday).toBe(true)
    expect(result.lastStudyDate).toBe('2026-09-10')
  })

  it('preserves streak when studied yesterday but not yet today', () => {
    const dates = ['2026-09-07', '2026-09-08', '2026-09-09']
    const result = calculateStreak(dates, '2026-09-10')

    expect(result.currentStreak).toBe(3)
    expect(result.bestStreak).toBe(3)
    expect(result.studiedToday).toBe(false)
    expect(result.lastStudyDate).toBe('2026-09-09')
  })

  it('resets current streak to 0 if missed yesterday and today', () => {
    const dates = ['2026-09-06', '2026-09-07', '2026-09-08']
    // Reference is 2026-09-10 -> yesterday was 2026-09-09 (missing)
    const result = calculateStreak(dates, '2026-09-10')

    expect(result.currentStreak).toBe(0)
    expect(result.bestStreak).toBe(3) // historical best preserved!
    expect(result.studiedToday).toBe(false)
    expect(result.lastStudyDate).toBe('2026-09-08')
  })

  it('handles multiple reviews on the same day without duplicating streak count', () => {
    const dates = [
      '2026-09-09T08:00:00.000Z',
      '2026-09-09T14:30:00.000Z',
      '2026-09-09T21:15:00.000Z',
      '2026-09-10T09:00:00.000Z',
    ]
    const result = calculateStreak(dates, '2026-09-10')

    expect(result.currentStreak).toBe(2)
    expect(result.bestStreak).toBe(2)
    expect(result.studiedToday).toBe(true)
  })

  it('computes historical best streak when higher than current streak', () => {
    const dates = [
      '2026-08-01',
      '2026-08-02',
      '2026-08-03',
      '2026-08-04',
      '2026-08-05', // 5-day streak
      '2026-08-10', // gap
      '2026-08-11',
      '2026-09-09',
      '2026-09-10', // current 2-day streak
    ]
    const result = calculateStreak(dates, '2026-09-10')

    expect(result.currentStreak).toBe(2)
    expect(result.bestStreak).toBe(5)
  })

  it('handles month boundary transitions cleanly', () => {
    const dates = ['2026-08-31', '2026-09-01']
    const result = calculateStreak(dates, '2026-09-01')

    expect(result.currentStreak).toBe(2)
    expect(result.studiedToday).toBe(true)
  })
})

describe('Progress Engine: calculateRetentionRate', () => {
  it('returns 0 for empty reviews array', () => {
    expect(calculateRetentionRate([])).toBe(0)
  })

  it('returns 100 when all reviews have quality >= 3', () => {
    const reviews = [{ quality: 3 }, { quality: 4 }, { quality: 5 }, { quality: 4 }]
    expect(calculateRetentionRate(reviews)).toBe(100)
  })

  it('returns 0 when all reviews have quality < 3', () => {
    const reviews = [{ quality: 0 }, { quality: 1 }, { quality: 2 }]
    expect(calculateRetentionRate(reviews)).toBe(0)
  })

  it('calculates correct percentage rounded to nearest integer', () => {
    // 3 successful out of 4 = 75%
    const reviews = [{ quality: 1 }, { quality: 3 }, { quality: 4 }, { quality: 5 }]
    expect(calculateRetentionRate(reviews)).toBe(75)

    // 2 successful out of 3 = 66.6% -> 67%
    const reviews2 = [{ quality: 5 }, { quality: 4 }, { quality: 2 }]
    expect(calculateRetentionRate(reviews2)).toBe(67)
  })
})

describe('Progress Engine: evaluateLevelAdvancement', () => {
  function makeCard(id: string, state: SRSCard['state'], reps: number, interval = 1): SRSCard {
    return {
      id: `card_${id}`,
      userId: 'user_1',
      vocabularyItemId: id,
      state,
      interval,
      easeFactor: 2.5,
      reps,
      lapses: 0,
      dueDate: '2026-09-11',
      lastReviewed: '2026-09-10',
    }
  }

  it('detects user is not eligible when below 80% mastery threshold', () => {
    const cards: SRSCard[] = [
      makeCard('voc_1', 'review', 4, 25),
      makeCard('voc_2', 'review', 4, 25),
      makeCard('voc_3', 'learning', 2, 4),
      makeCard('voc_4', 'new', 0, 0),
    ]

    const result = evaluateLevelAdvancement({
      currentLevel: 'A1',
      totalLevelWords: 10,
      cards,
      masteryThresholdRatio: 0.8,
    })

    expect(result.wordsMastered).toBe(2)
    expect(result.wordsStarted).toBe(3)
    expect(result.masteryRatio).toBe(0.2)
    expect(result.isEligible).toBe(false)
    expect(result.nextLevel).toBe('A2')
    expect(result.remainingWordsToMaster).toBe(6) // 8 - 2 = 6
  })

  it('detects eligibility when 80% or more words are mastered', () => {
    const cards: SRSCard[] = [
      makeCard('voc_1', 'review', 4, 25),
      makeCard('voc_2', 'review', 4, 25),
      makeCard('voc_3', 'review', 4, 25),
      makeCard('voc_4', 'review', 4, 25),
      makeCard('voc_5', 'learning', 2, 4),
    ]

    const result = evaluateLevelAdvancement({
      currentLevel: 'A1',
      totalLevelWords: 5,
      cards,
      masteryThresholdRatio: 0.8,
    })

    expect(result.wordsMastered).toBe(4)
    expect(result.masteryRatio).toBe(0.8)
    expect(result.isEligible).toBe(true)
    expect(result.nextLevel).toBe('A2')
    expect(result.remainingWordsToMaster).toBe(0)
  })

  it('returns nextLevel null for highest CEFR level (B2)', () => {
    const cards = [makeCard('voc_1', 'review', 4, 30)]
    const result = evaluateLevelAdvancement({
      currentLevel: 'B2',
      totalLevelWords: 1,
      cards,
    })

    expect(result.nextLevel).toBeNull()
    expect(result.isEligible).toBe(false) // cannot advance beyond B2
  })
})

describe('Progress Engine: calculateWeeklyBreakdown', () => {
  it('correctly categorizes weekly progress and status', () => {
    const weeks: WeekDefinition[] = [
      { week: 1, title: 'Week 1', wordIds: ['w1_1', 'w1_2'] },
      { week: 2, title: 'Week 2', wordIds: ['w2_1', 'w2_2'] },
      { week: 3, title: 'Week 3', wordIds: ['w3_1', 'w3_2'] },
    ]

    const cards: SRSCard[] = [
      // Week 1: 100% mastered
      {
        id: 'c1',
        userId: 'u1',
        vocabularyItemId: 'w1_1',
        state: 'review',
        interval: 25,
        easeFactor: 2.5,
        reps: 5,
        lapses: 0,
        dueDate: '2026-09-12',
        lastReviewed: '2026-09-10',
      },
      {
        id: 'c2',
        userId: 'u1',
        vocabularyItemId: 'w1_2',
        state: 'review',
        interval: 25,
        easeFactor: 2.5,
        reps: 5,
        lapses: 0,
        dueDate: '2026-09-12',
        lastReviewed: '2026-09-10',
      },
      // Week 2: 1 started, 0 mastered
      {
        id: 'c3',
        userId: 'u1',
        vocabularyItemId: 'w2_1',
        state: 'learning',
        interval: 1,
        easeFactor: 2.5,
        reps: 1,
        lapses: 0,
        dueDate: '2026-09-11',
        lastReviewed: '2026-09-10',
      },
      // Week 3: no cards started
    ]

    const breakdown = calculateWeeklyBreakdown(weeks, cards)

    expect(breakdown).toHaveLength(3)

    // Week 1
    expect(breakdown[0]?.status).toBe('completed')
    expect(breakdown[0]?.wordsMastered).toBe(2)
    expect(breakdown[0]?.wordsStarted).toBe(2)

    // Week 2
    expect(breakdown[1]?.status).toBe('in_progress')
    expect(breakdown[1]?.wordsMastered).toBe(0)
    expect(breakdown[1]?.wordsStarted).toBe(1)
    expect(breakdown[1]?.progressRatio).toBe(0.5)

    // Week 3
    expect(breakdown[2]?.status).toBe('not_started')
    expect(breakdown[2]?.wordsMastered).toBe(0)
    expect(breakdown[2]?.wordsStarted).toBe(0)
    expect(breakdown[2]?.progressRatio).toBe(0)
  })
})
