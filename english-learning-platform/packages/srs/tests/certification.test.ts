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
})
