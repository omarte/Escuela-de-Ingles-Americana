import { create } from 'zustand'
import {
  getLocalCards,
  logLocalReviewEvent,
  saveLocalCards,
  upsertLocalCard,
} from '../lib/db/sqlite'
import { syncUserData } from '../lib/db/syncEngine'
import { useSyncStore } from './useSyncStore'
import { buildStudySessionQueue, calculateNextReview, createCard } from '@elp/srs'
import { getVocabularyForLevel } from '@elp/content'
import type { CEFRLevel, ReviewEvent, ReviewQuality, SRSCard } from '@elp/types'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { STARTER_WORD_IDS } from '../lib/vocabulary'

export interface SessionStats {
  cardsReviewed: number
  cardsCorrect: number
  qualityHistory: number[]
}

export interface SRSState {
  cards: readonly SRSCard[]
  sessionQueue: readonly SRSCard[]
  currentIndex: number
  currentSessionId: string | null
  lastReviewedCardIds: readonly string[]
  sessionStats: SessionStats
  isSessionActive: boolean
  isCompleted: boolean
  isLoading: boolean
  error: string | null

  loadCards: (userId: string) => Promise<void>
  startStudySession: (userId: string, level: CEFRLevel) => Promise<void>
  loadNextBatch: (userId: string, level: CEFRLevel, count?: number) => Promise<void>
  repeatCurrentLesson: (userId: string) => Promise<void>
  startFreePracticeSession: (userId: string, level: CEFRLevel) => Promise<void>
  submitReview: (quality: ReviewQuality) => Promise<void>
  resetSession: () => void
}

function initializeStarterCards(userId: string): SRSCard[] {
  const now = new Date().toISOString()
  return STARTER_WORD_IDS.map((wordId, index) => {
    const card = createCard(`card_${userId}_${wordId}`, userId, wordId)
    // Make first 3 immediately due for study, and the rest new
    if (index < 3) {
      return {
        ...card,
        state: 'learning',
        interval: 1,
        dueDate: now,
      }
    }
    return card
  })
}

export const useSRSStore = create<SRSState>()((set, get) => ({
  cards: [],
  sessionQueue: [],
  currentIndex: 0,
  currentSessionId: null,
  lastReviewedCardIds: [],
  sessionStats: {
    cardsReviewed: 0,
    cardsCorrect: 0,
    qualityHistory: [],
  },
  isSessionActive: false,
  isCompleted: false,
  isLoading: false,
  error: null,

  resetSession: (): void => {
    set({
      sessionQueue: [],
      currentIndex: 0,
      currentSessionId: null,
      isSessionActive: false,
      isCompleted: false,
      sessionStats: {
        cardsReviewed: 0,
        cardsCorrect: 0,
        qualityHistory: [],
      },
      error: null,
    })
  },

  loadCards: async (userId: string): Promise<void> => {
    set({ isLoading: true, error: null })

    try {
      // 1. Always load instantly from local SQLite
      let localCards = await getLocalCards(userId)

      if (localCards.length === 0) {
        // First-time initialization
        const starters = initializeStarterCards(userId)
        await saveLocalCards(starters, 'dirty')
        localCards = starters

        // Background push to remote if connected
        if (isSupabaseConfigured && supabase) {
          void syncUserData(userId, supabase).then(() => {
            void useSyncStore.getState().checkPendingCount(userId)
          })
        }
      } else if (isSupabaseConfigured && supabase) {
        // Opportunistic background sync to pull fresh changes
        void syncUserData(userId, supabase).then(async (result) => {
          if (result.pulledCards > 0) {
            const refreshed = await getLocalCards(userId)
            set({ cards: refreshed })
          }
          void useSyncStore.getState().checkPendingCount(userId)
        })
      }

      void useSyncStore.getState().checkPendingCount(userId)
      set({ cards: localCards, isLoading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar tarjetas'
      set({ error: message, isLoading: false })
    }
  },

  startStudySession: async (userId: string, _level: CEFRLevel): Promise<void> => {
    let currentCards = get().cards
    if (currentCards.length === 0) {
      await get().loadCards(userId)
      currentCards = get().cards
    }

    const { queue } = buildStudySessionQueue(currentCards, {
      now: new Date().toISOString(),
    })

    const sessionId = `session_${Date.now()}`

    set({
      sessionQueue: queue,
      currentIndex: 0,
      currentSessionId: sessionId,
      lastReviewedCardIds: queue.map((c) => c.id),
      isSessionActive: queue.length > 0,
      isCompleted: false,
      sessionStats: {
        cardsReviewed: 0,
        cardsCorrect: 0,
        qualityHistory: [],
      },
    })
  },

  loadNextBatch: async (userId: string, level: CEFRLevel, count: number = 10): Promise<void> => {
    let currentCards = get().cards
    if (currentCards.length === 0) {
      await get().loadCards(userId)
      currentCards = get().cards
    }

    const existingItemIds = new Set(currentCards.map((c) => c.vocabularyItemId))
    const levelVocab = getVocabularyForLevel(level)
    const candidates = levelVocab.filter((v) => !existingItemIds.has(v.id))

    if (candidates.length === 0) {
      // All level words are already in the deck; fallback to practice
      await get().startFreePracticeSession(userId, level)
      return
    }

    const batch = candidates.slice(0, count)
    const now = new Date().toISOString()
    const newCards: SRSCard[] = batch.map((item) => {
      const card = createCard(`card_${userId}_${item.id}`, userId, item.id)
      return {
        ...card,
        state: 'learning',
        interval: 1,
        dueDate: now,
      }
    })

    await saveLocalCards(newCards, 'dirty')
    const merged = [...currentCards, ...newCards]

    set({
      cards: merged,
      sessionQueue: newCards,
      currentIndex: 0,
      currentSessionId: `session_batch_${Date.now()}`,
      lastReviewedCardIds: newCards.map((c) => c.id),
      isSessionActive: true,
      isCompleted: false,
      sessionStats: {
        cardsReviewed: 0,
        cardsCorrect: 0,
        qualityHistory: [],
      },
    })
  },

  repeatCurrentLesson: async (userId: string): Promise<void> => {
    let currentCards = get().cards
    if (currentCards.length === 0) {
      await get().loadCards(userId)
      currentCards = get().cards
    }

    const { lastReviewedCardIds } = get()
    let cardsToRepeat: SRSCard[] = []

    if (lastReviewedCardIds.length > 0) {
      const idSet = new Set(lastReviewedCardIds)
      cardsToRepeat = currentCards.filter((c) => idSet.has(c.id))
    }

    if (cardsToRepeat.length === 0) {
      // Fallback: take recent cards up to 10
      cardsToRepeat = currentCards.slice(-10)
    }

    // Shuffle for active recall testing
    const queue = [...cardsToRepeat].sort(() => 0.5 - Math.random())

    set({
      sessionQueue: queue,
      currentIndex: 0,
      currentSessionId: `session_repeat_${Date.now()}`,
      isSessionActive: queue.length > 0,
      isCompleted: false,
      sessionStats: {
        cardsReviewed: 0,
        cardsCorrect: 0,
        qualityHistory: [],
      },
    })
  },

  startFreePracticeSession: async (userId: string, _level: CEFRLevel): Promise<void> => {
    let currentCards = get().cards
    if (currentCards.length === 0) {
      await get().loadCards(userId)
      currentCards = get().cards
    }

    // Shuffle and pick up to 10 cards for open practice
    const queue = [...currentCards].sort(() => 0.5 - Math.random()).slice(0, 10)

    set({
      sessionQueue: queue,
      currentIndex: 0,
      currentSessionId: `session_practice_${Date.now()}`,
      lastReviewedCardIds: queue.map((c) => c.id),
      isSessionActive: queue.length > 0,
      isCompleted: false,
      sessionStats: {
        cardsReviewed: 0,
        cardsCorrect: 0,
        qualityHistory: [],
      },
    })
  },

  submitReview: async (quality: ReviewQuality): Promise<void> => {
    const { sessionQueue, currentIndex, cards, sessionStats } = get()
    const activeCard = sessionQueue[currentIndex]
    if (!activeCard) return

    const now = new Date().toISOString()
    const result = calculateNextReview({
      currentState: activeCard.state,
      interval: activeCard.interval,
      easeFactor: activeCard.easeFactor,
      reps: activeCard.reps,
      lapses: activeCard.lapses,
      quality,
      reviewedAt: now,
    })

    const updatedCard: SRSCard = {
      ...activeCard,
      state: result.state,
      interval: result.interval,
      easeFactor: result.easeFactor,
      reps: result.reps,
      lapses: result.lapses,
      dueDate: result.dueDate,
      lastReviewed: now,
    }

    const reviewEvent: ReviewEvent = {
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: activeCard.userId,
      cardId: activeCard.id,
      vocabularyItemId: activeCard.vocabularyItemId,
      quality,
      reviewedAt: now,
      previousState: activeCard.state,
      nextState: result.state,
      previousInterval: activeCard.interval,
      nextInterval: result.interval,
    }

    // 1. Update in-memory state immediately for zero-latency UI
    const updatedCards = cards.map((c) => (c.id === updatedCard.id ? updatedCard : c))

    const newReviewedCount = sessionStats.cardsReviewed + 1
    const newCorrectCount = quality >= 3 ? sessionStats.cardsCorrect + 1 : sessionStats.cardsCorrect
    const newQualityHistory = [...sessionStats.qualityHistory, quality]
    const isNextCompleted = currentIndex + 1 >= sessionQueue.length

    set({
      cards: updatedCards,
      currentIndex: currentIndex + 1,
      isCompleted: isNextCompleted,
      isSessionActive: !isNextCompleted,
      sessionStats: {
        cardsReviewed: newReviewedCount,
        cardsCorrect: newCorrectCount,
        qualityHistory: newQualityHistory,
      },
    })

    // 2. Persist to local SQLite offline storage
    try {
      await upsertLocalCard(updatedCard, 'dirty')
      await logLocalReviewEvent(reviewEvent)
      void useSyncStore.getState().checkPendingCount(activeCard.userId)

      // Refresh in-memory progress metrics reactively
      const { useProgressStore } = await import('./useProgressStore')
      void useProgressStore.getState().refreshMetrics(activeCard.userId)

      // 3. Opportunistic background sync if connected
      if (isSupabaseConfigured && supabase) {
        void syncUserData(activeCard.userId, supabase).then(() => {
          void useSyncStore.getState().checkPendingCount(activeCard.userId)
        })
      }
    } catch {
      // Local persistence failure logged silently
    }
  },
}))

