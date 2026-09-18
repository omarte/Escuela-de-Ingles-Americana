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
import { canAccessWeek } from '@elp/monetization'
import type { CEFRLevel, ReviewEvent, ReviewQuality, SRSCard } from '@elp/types'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { STARTER_WORD_IDS } from '../lib/vocabulary'

export interface BatchLoadResult {
  success: boolean
  blockedByPaywall: boolean
  loadedCount: number
}

export interface SessionStats {
  cardsReviewed: number
  cardsCorrect: number
  qualityHistory: number[]
  /** Total friction events this session (latency > 7s OR quality < 3) */
  frictionCount: number
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
  /**
   * Timestamp (Date.now()) captured when the current card was displayed.
   * Used to compute latencyMs in submitReview.
   * Set to null between sessions or when no card is active.
   */
  cardStartTime: number | null

  loadCards: (userId: string) => Promise<void>
  startStudySession: (userId: string, level: CEFRLevel) => Promise<void>
  loadNextBatch: (
    userId: string,
    level: CEFRLevel,
    count?: number,
    isPro?: boolean,
  ) => Promise<BatchLoadResult>
  repeatCurrentLesson: (userId: string) => Promise<void>
  startFreePracticeSession: (userId: string, level: CEFRLevel) => Promise<void>
  submitReview: (quality: ReviewQuality) => Promise<void>
  resetSession: () => void
  /** Call when a new card is displayed to start latency measurement. */
  recordCardShown: () => void
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

export const INITIAL_SESSION_STATS: SessionStats = {
  cardsReviewed: 0,
  cardsCorrect: 0,
  qualityHistory: [],
  frictionCount: 0,
}

export const useSRSStore = create<SRSState>()((set, get) => ({
  cards: [],
  sessionQueue: [],
  currentIndex: 0,
  currentSessionId: null,
  lastReviewedCardIds: [],
  sessionStats: INITIAL_SESSION_STATS,
  isSessionActive: false,
  isCompleted: false,
  isLoading: false,
  error: null,
  cardStartTime: null,

  resetSession: (): void => {
    set({
      sessionQueue: [],
      currentIndex: 0,
      currentSessionId: null,
      isSessionActive: false,
      isCompleted: false,
      cardStartTime: null,
      sessionStats: INITIAL_SESSION_STATS,
      error: null,
    })
  },

  recordCardShown: (): void => {
    set({ cardStartTime: Date.now() })
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
      sessionStats: INITIAL_SESSION_STATS,
    })
  },

  loadNextBatch: async (
    userId: string,
    level: CEFRLevel,
    count = 10,
    isPro = false,
  ): Promise<BatchLoadResult> => {
    let currentCards = get().cards
    if (currentCards.length === 0) {
      await get().loadCards(userId)
      currentCards = get().cards
    }

    const existingItemIds = new Set(currentCards.map((c) => c.vocabularyItemId))
    const levelVocab = getVocabularyForLevel(level)

    // Filtrar candidatos según los derechos de suscripción del estudiante (canAccessWeek)
    const accessibleCandidates = levelVocab.filter((v) => {
      if (existingItemIds.has(v.id)) return false
      return canAccessWeek(level, v.week, isPro)
    })

    if (accessibleCandidates.length === 0) {
      // Si no hay candidatos accesibles pero todavía existen palabras en el nivel
      // que están bloqueadas por el paywall (ej. Semana 4+ para usuarios free o A2-B2):
      const hasPaywallLockedWords = levelVocab.some(
        (v) => !existingItemIds.has(v.id) && !canAccessWeek(level, v.week, isPro),
      )

      if (hasPaywallLockedWords) {
        return { success: false, blockedByPaywall: true, loadedCount: 0 }
      }

      // Si verdaderamente todas las palabras del nivel fueron aprendidas, fallback a práctica libre
      await get().startFreePracticeSession(userId, level)
      return { success: true, blockedByPaywall: false, loadedCount: 0 }
    }

    const batch = accessibleCandidates.slice(0, count)
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
      sessionStats: INITIAL_SESSION_STATS,
    })

    return { success: true, blockedByPaywall: false, loadedCount: newCards.length }
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
      sessionStats: INITIAL_SESSION_STATS,
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
      sessionStats: INITIAL_SESSION_STATS,
    })
  },

  submitReview: async (quality: ReviewQuality): Promise<void> => {
    const { sessionQueue, currentIndex, cards, sessionStats, cardStartTime } = get()
    const activeCard = sessionQueue[currentIndex]
    if (!activeCard) return

    // ── Latency Measurement ────────────────────────────────────────────────
    // Compute how long the user took to answer. Requires recordCardShown() to
    // have been called when the card was first displayed.
    const latencyMs =
      cardStartTime !== null ? Math.max(0, Date.now() - cardStartTime) : undefined

    // ── Friction & Hot Re-injection Logic ─────────────────────────────────
    // A word requires in-session reinforcement ONLY if the student failed (quality < 3).
    // Correct answers (quality >= 3) should NEVER be re-injected into the queue,
    // avoiding infinite repeating loops during multi-phase learning sessions.
    const isFailed = quality < 3
    const isSlow = latencyMs !== undefined && latencyMs > 7_000
    const frictionFlagged = isFailed || (isSlow && quality < 4)

    const now = new Date().toISOString()
    const result = calculateNextReview({
      currentState: activeCard.state,
      interval: activeCard.interval,
      easeFactor: activeCard.easeFactor,
      reps: activeCard.reps,
      lapses: activeCard.lapses,
      quality,
      reviewedAt: now,
      ...(latencyMs !== undefined ? { latencyMs } : {}),
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
      ...(latencyMs !== undefined ? { latencyMs } : {}),
      frictionFlagged,
    }

    // ── Bucle de Fijación Inmediata (Hot Re-injection) ─────────────────────
    // Re-insert ONLY if the card was failed (quality < 3) AND is not already
    // queued ahead in this session, preventing infinite looping on the same cards.
    const updatedQueue = [...sessionQueue]
    const nextIndex = currentIndex + 1

    if (isFailed) {
      const alreadyQueuedAhead = updatedQueue
        .slice(nextIndex)
        .some((c) => c.vocabularyItemId === activeCard.vocabularyItemId)

      if (!alreadyQueuedAhead) {
        // Place it 3 positions ahead or at the end of the queue
        const reinjectPosition = Math.min(currentIndex + 3, updatedQueue.length)
        updatedQueue.splice(reinjectPosition, 0, activeCard)
      }
    }

    // 1. Update in-memory state immediately for zero-latency UI
    const updatedCards = cards.map((c) => (c.id === updatedCard.id ? updatedCard : c))

    const newReviewedCount = sessionStats.cardsReviewed + 1
    const newCorrectCount = quality >= 3 ? sessionStats.cardsCorrect + 1 : sessionStats.cardsCorrect
    const newQualityHistory = [...sessionStats.qualityHistory, quality]
    const newFrictionCount = frictionFlagged
      ? sessionStats.frictionCount + 1
      : sessionStats.frictionCount
    const isNextCompleted = nextIndex >= updatedQueue.length

    set({
      cards: updatedCards,
      sessionQueue: updatedQueue,
      currentIndex: nextIndex,
      isCompleted: isNextCompleted,
      isSessionActive: !isNextCompleted,
      cardStartTime: null, // Reset; recordCardShown() will set it for the next card
      sessionStats: {
        cardsReviewed: newReviewedCount,
        cardsCorrect: newCorrectCount,
        qualityHistory: newQualityHistory,
        frictionCount: newFrictionCount,
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

