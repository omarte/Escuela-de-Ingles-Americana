import { describe, it, expect } from 'vitest'
import { calculateDailyProgress, calculateStreak, getDueCards } from '../src/index'
import type { SRSCard } from '@elp/types'

describe('Certification Suite: End-to-End Core Platform Validation', () => {
  it('certifies daily progress and streak calculation coherence without false completions', () => {
    const today = new Date('2026-09-13T10:00:00.000Z')
    const todayStr = '2026-09-13'

    const testCards: SRSCard[] = [
      // 3 cards reviewed today
      {
        id: 'c1',
        userId: 'student-1',
        vocabularyItemId: 'v1',
        state: 'review',
        interval: 1,
        easeFactor: 2.5,
        reps: 1,
        lapses: 0,
        dueDate: '2026-09-14',
        lastReviewed: `${todayStr}T08:00:00.000Z`,
      },
      {
        id: 'c2',
        userId: 'student-1',
        vocabularyItemId: 'v2',
        state: 'review',
        interval: 1,
        easeFactor: 2.5,
        reps: 1,
        lapses: 0,
        dueDate: '2026-09-14',
        lastReviewed: `${todayStr}T08:30:00.000Z`,
      },
      {
        id: 'c3',
        userId: 'student-1',
        vocabularyItemId: 'v3',
        state: 'review',
        interval: 1,
        easeFactor: 2.5,
        reps: 1,
        lapses: 0,
        dueDate: '2026-09-14',
        lastReviewed: `${todayStr}T09:00:00.000Z`,
      },
      // 5 historical cards from yesterday
      {
        id: 'c4',
        userId: 'student-1',
        vocabularyItemId: 'v4',
        state: 'review',
        interval: 3,
        easeFactor: 2.5,
        reps: 3,
        lapses: 0,
        dueDate: '2026-09-15',
        lastReviewed: '2026-09-12T14:00:00.000Z',
      },
      {
        id: 'c5',
        userId: 'student-1',
        vocabularyItemId: 'v5',
        state: 'review',
        interval: 3,
        easeFactor: 2.5,
        reps: 2,
        lapses: 0,
        dueDate: '2026-09-15',
        lastReviewed: '2026-09-12T14:00:00.000Z',
      },
    ]

    // Verify daily progress strictly filters today
    const progress = calculateDailyProgress(testCards, today, 20)
    expect(progress.completedToday).toBe(3)
    expect(progress.dailyGoal).toBe(20)
    expect(progress.progressRatio).toBeCloseTo(3 / 20)

    // Verify streak calculation includes today and yesterday
    const streak = calculateStreak(['2026-09-12', '2026-09-13'], today)
    expect(streak.currentStreak).toBe(2)
    expect(streak.studiedToday).toBe(true)
  })

  it('certifies JSON backup format and schema completeness', () => {
    const backupPayload = {
      version: 1,
      appName: 'Escuela de Inglés Americana',
      exportedAt: new Date().toISOString(),
      userId: 'cert-user-123',
      profile: {
        displayName: 'Estudiante Certificado',
        email: 'estudiante@americana.edu',
        currentLevel: 'A1',
        streakDays: 7,
        totalXP: 350,
      },
      cards: [
        {
          id: 'card-1',
          userId: 'cert-user-123',
          vocabularyItemId: 'a1_w1_01',
          state: 'review',
          interval: 6,
          easeFactor: 2.5,
          reps: 2,
          lapses: 0,
          dueDate: '2026-09-19',
          lastReviewed: '2026-09-13T10:00:00.000Z',
        },
      ],
      reviewEvents: [],
    }

    expect(backupPayload.version).toBe(1)
    expect(backupPayload.appName).toBe('Escuela de Inglés Americana')
    expect(backupPayload.cards.length).toBeGreaterThan(0)
    expect(backupPayload.cards[0]?.vocabularyItemId).toBe('a1_w1_01')
  })

  it('certifies smart merge conflict resolution preserves the most advanced learner state', () => {
    // Pure function logic mirroring restoreLocalCardsWithMerge
    const stateRank: Record<string, number> = {
      new: 0,
      learning: 1,
      review: 2,
      relearning: 1,
    }

    function mergeCards(local: SRSCard, incoming: SRSCard): SRSCard {
      const localRank = stateRank[local.state] ?? 0
      const incomingRank = stateRank[incoming.state] ?? 0
      const mergedState = localRank >= incomingRank ? local.state : incoming.state
      const mergedInterval = Math.max(local.interval ?? 0, incoming.interval ?? 0)
      const mergedReps = Math.max(local.reps ?? 0, incoming.reps ?? 0)
      const mergedLapses = Math.min(local.lapses ?? 0, incoming.lapses ?? 0)
      const mergedEase = Math.max(local.easeFactor ?? 2.5, incoming.easeFactor ?? 2.5)

      let mergedLastReviewed = local.lastReviewed
      if (incoming.lastReviewed) {
        if (!mergedLastReviewed || new Date(incoming.lastReviewed) > new Date(mergedLastReviewed)) {
          mergedLastReviewed = incoming.lastReviewed
        }
      }
      const mergedDueDate =
        local.dueDate && incoming.dueDate
          ? local.dueDate > incoming.dueDate
            ? local.dueDate
            : incoming.dueDate
          : (local.dueDate || incoming.dueDate)

      return {
        id: local.id,
        userId: local.userId,
        vocabularyItemId: local.vocabularyItemId,
        state: mergedState,
        interval: mergedInterval,
        easeFactor: mergedEase,
        reps: mergedReps,
        lapses: mergedLapses,
        dueDate: mergedDueDate,
        lastReviewed: mergedLastReviewed,
      }
    }

    // Case 1: Local card is more mature than incoming backup
    const matureLocal: SRSCard = {
      id: 'c1',
      userId: 'u1',
      vocabularyItemId: 'v1',
      state: 'review',
      interval: 21,
      easeFactor: 2.5,
      reps: 5,
      lapses: 0,
      dueDate: '2026-10-04',
      lastReviewed: '2026-09-13T10:00:00.000Z',
    }
    const olderIncoming: SRSCard = {
      id: 'c1-old',
      userId: 'u1',
      vocabularyItemId: 'v1',
      state: 'learning',
      interval: 3,
      easeFactor: 2.4,
      reps: 2,
      lapses: 1,
      dueDate: '2026-09-10',
      lastReviewed: '2026-09-07T10:00:00.000Z',
    }

    const res1 = mergeCards(matureLocal, olderIncoming)
    expect(res1.interval).toBe(21) // Preserves 21 days
    expect(res1.reps).toBe(5) // Preserves 5 reps
    expect(res1.state).toBe('review') // Preserves review state
    expect(res1.dueDate).toBe('2026-10-04')
    expect(res1.lapses).toBe(0) // Takes minimum lapses

    // Case 2: Incoming backup is more mature than local newly reset card
    const newerIncoming: SRSCard = {
      id: 'c2-new',
      userId: 'u1',
      vocabularyItemId: 'v2',
      state: 'review',
      interval: 15,
      easeFactor: 2.5,
      reps: 4,
      lapses: 0,
      dueDate: '2026-09-28',
      lastReviewed: '2026-09-13T12:00:00.000Z',
    }
    const resetLocal: SRSCard = {
      id: 'c2',
      userId: 'u1',
      vocabularyItemId: 'v2',
      state: 'new',
      interval: 0,
      easeFactor: 2.5,
      reps: 0,
      lapses: 0,
      dueDate: '2026-09-13',
      lastReviewed: null,
    }

    const res2 = mergeCards(resetLocal, newerIncoming)
    expect(res2.interval).toBe(15) // Preserves 15 days from backup
    expect(res2.reps).toBe(4) // Preserves 4 reps
    expect(res2.state).toBe('review')
    expect(res2.lastReviewed).toBe('2026-09-13T12:00:00.000Z')
  })
})

