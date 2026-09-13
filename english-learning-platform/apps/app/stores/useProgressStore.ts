import { create } from 'zustand'
import {
  calculateStreak,
  calculateRetentionRate,
  evaluateLevelAdvancement,
  calculateWeeklyBreakdown,
  type StreakResult,
  type LevelAdvancementResult,
  type WeeklyBreakdownItem,
  type WeekDefinition,
} from '@elp/srs'
import { contentRegistry } from '@elp/content'
import type { CEFRLevel, SRSCard } from '@elp/types'
import { getAllLocalReviewEvents, getLocalReviewDates } from '../lib/db/sqlite'
import { useAuthStore } from './useAuthStore'
import { useSRSStore } from './useSRSStore'

export interface ProgressMetrics {
  streak: StreakResult
  retentionRate: number
  levelAdvancement: LevelAdvancementResult
  weeklyBreakdown: WeeklyBreakdownItem[]
  wordsInMemory: number
  wordsMastered: number
  totalLevelWords: number
  totalReviewsCount: number
  estimatedStudyMinutes: number
}

export interface ProgressState {
  metrics: ProgressMetrics
  isLoading: boolean
  error: string | null

  refreshMetrics: (userId: string) => Promise<void>
  advanceLevel: () => Promise<boolean>
}

export const DEFAULT_METRICS: ProgressMetrics = {
  streak: {
    currentStreak: 0,
    bestStreak: 0,
    studiedToday: false,
    lastStudyDate: null,
    activeDates: [],
  },
  retentionRate: 100,
  levelAdvancement: {
    currentLevel: 'A1',
    nextLevel: 'A2',
    totalLevelWords: 1514,
    wordsStarted: 0,
    wordsMastered: 0,
    masteryRatio: 0,
    startedRatio: 0,
    isEligible: false,
    remainingWordsToMaster: 1211,
  },
  weeklyBreakdown: [],
  wordsInMemory: 0,
  wordsMastered: 0,
  totalLevelWords: 1514,
  totalReviewsCount: 0,
  estimatedStudyMinutes: 0,
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
  metrics: DEFAULT_METRICS,
  isLoading: false,
  error: null,

  refreshMetrics: async (userId: string): Promise<void> => {
    set({ isLoading: true, error: null })

    try {
      // 1. Fetch study dates and review events from SQLite
      const studyDates = await getLocalReviewDates(userId)
      const reviewEvents = await getAllLocalReviewEvents(userId)

      // 2. Fetch cards from SRS store (or load if empty)
      let currentCards: readonly SRSCard[] = useSRSStore.getState().cards
      if (currentCards.length === 0) {
        await useSRSStore.getState().loadCards(userId)
        currentCards = useSRSStore.getState().cards
      }

      // 3. Current level from Auth store profile
      const authProfile = useAuthStore.getState().profile
      const currentLevel: CEFRLevel = authProfile?.currentLevel ?? 'A1'

      // 4. Extract week definitions for current level
      const levelBlocks = contentRegistry[currentLevel].blocks
      const weekDefs: WeekDefinition[] = levelBlocks.map((b) => ({
        week: b.week,
        title: b.topic,
        wordIds: b.vocabulary.map((v) => v.id),
      }))

      const totalLevelWords = levelBlocks.reduce((acc, b) => acc + b.vocabulary.length, 0)

      // 5. Calculate Metrics
      const streak = calculateStreak(studyDates)
      const retentionRate = calculateRetentionRate(reviewEvents)
      const levelAdvancement = evaluateLevelAdvancement({
        currentLevel,
        totalLevelWords,
        cards: currentCards,
      })
      const weeklyBreakdown = calculateWeeklyBreakdown(weekDefs, currentCards)

      const wordsInMemory = currentCards.filter((c) => c.reps > 0 || c.state !== 'new').length
      const wordsMastered = currentCards.filter(
        (c) => c.state === 'review' || c.interval >= 21 || c.reps >= 4,
      ).length

      const totalReviewsCount = reviewEvents.length
      // Estimate ~8 seconds per review card, convert to minutes
      const estimatedStudyMinutes = Math.max(1, Math.round((totalReviewsCount * 8) / 60))

      const computedMetrics: ProgressMetrics = {
        streak,
        retentionRate: totalReviewsCount > 0 ? retentionRate : 100,
        levelAdvancement,
        weeklyBreakdown,
        wordsInMemory,
        wordsMastered,
        totalLevelWords,
        totalReviewsCount,
        estimatedStudyMinutes: totalReviewsCount > 0 ? estimatedStudyMinutes : 0,
      }

      set({ metrics: computedMetrics, isLoading: false })

      // 6. Synchronize streak with profile if updated
      if (authProfile && authProfile.streakDays !== streak.currentStreak) {
        void useAuthStore.getState().updateProfile({
          streakDays: streak.currentStreak,
        })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar métricas'
      set({ error: message, isLoading: false })
    }
  },

  advanceLevel: async (): Promise<boolean> => {
    const { levelAdvancement } = get().metrics
    if (!levelAdvancement.isEligible || !levelAdvancement.nextLevel) {
      return false
    }

    const nextLevel = levelAdvancement.nextLevel
    await useAuthStore.getState().updateProfile({
      currentLevel: nextLevel,
      currentWeek: 1,
    })

    const userId = useAuthStore.getState().user?.id ?? 'demo-user'
    await get().refreshMetrics(userId)
    return true
  },
}))
