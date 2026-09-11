import { describe, it, expect, vi } from 'vitest'
import {
  userCardRowToSRSCard,
  getUserCards,
  upsertUserCard,
  logReviewEvent,
  startStudySession,
  finishStudySession,
  type UserCardRow,
  type SupabaseClient,
  type Database,
} from '../src/index'
import type { ReviewEvent, SRSCard } from '@elp/types'

describe('@elp/database SRS Persistence', () => {
  describe('userCardRowToSRSCard', () => {
    it('maps snake_case UserCardRow to camelCase SRSCard', () => {
      const row: UserCardRow = {
        id: 'card-1',
        user_id: 'user-1',
        vocabulary_item_id: 'voc_a1_hello_001',
        state: 'review',
        interval: 10,
        ease_factor: 2.4,
        reps: 3,
        lapses: 1,
        due_date: '2026-09-20T00:00:00Z',
        last_reviewed: '2026-09-10T00:00:00Z',
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-10T00:00:00Z',
      }

      const card = userCardRowToSRSCard(row)

      expect(card).toEqual({
        id: 'card-1',
        userId: 'user-1',
        vocabularyItemId: 'voc_a1_hello_001',
        state: 'review',
        interval: 10,
        easeFactor: 2.4,
        reps: 3,
        lapses: 1,
        dueDate: '2026-09-20T00:00:00Z',
        lastReviewed: '2026-09-10T00:00:00Z',
      })
    })
  })

  describe('getUserCards', () => {
    it('queries user_cards by user_id and maps results', async () => {
      const mockRows: UserCardRow[] = [
        {
          id: 'card-1',
          user_id: 'u1',
          vocabulary_item_id: 'voc_1',
          state: 'learning',
          interval: 1,
          ease_factor: 2.5,
          reps: 1,
          lapses: 0,
          due_date: '2026-09-12T00:00:00Z',
          last_reviewed: null,
          created_at: '2026-09-10T00:00:00Z',
          updated_at: '2026-09-10T00:00:00Z',
        },
      ]

      const mockEq = vi.fn().mockResolvedValue({ data: mockRows, error: null })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      const client = { from: mockFrom } as unknown as SupabaseClient<Database>

      const cards = await getUserCards(client, 'u1')

      expect(mockFrom).toHaveBeenCalledWith('user_cards')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('user_id', 'u1')
      expect(cards).toHaveLength(1)
      expect(cards[0]?.id).toBe('card-1')
    })
  })

  describe('upsertUserCard', () => {
    it('calls upsert with snake_case payload', async () => {
      const card: SRSCard = {
        id: 'card-abc',
        userId: 'user-xyz',
        vocabularyItemId: 'voc_a1_water_001',
        state: 'review',
        interval: 6,
        easeFactor: 2.35,
        reps: 2,
        lapses: 0,
        dueDate: '2026-09-16T00:00:00Z',
        lastReviewed: '2026-09-10T00:00:00Z',
      }

      const mockUpsert = vi.fn().mockResolvedValue({ error: null })
      const mockFrom = vi.fn().mockReturnValue({ upsert: mockUpsert })
      const client = { from: mockFrom } as unknown as SupabaseClient<Database>

      const result = await upsertUserCard(client, card)

      expect(mockFrom).toHaveBeenCalledWith('user_cards')
      expect(mockUpsert).toHaveBeenCalledWith({
        id: 'card-abc',
        user_id: 'user-xyz',
        vocabulary_item_id: 'voc_a1_water_001',
        state: 'review',
        interval: 6,
        ease_factor: 2.35,
        reps: 2,
        lapses: 0,
        due_date: '2026-09-16T00:00:00Z',
        last_reviewed: '2026-09-10T00:00:00Z',
      })
      expect(result.error).toBeNull()
    })
  })

  describe('logReviewEvent', () => {
    it('appends immutable event to review_events', async () => {
      const event: ReviewEvent = {
        id: 'rev-evt-1',
        userId: 'u1',
        cardId: 'c1',
        vocabularyItemId: 'voc_1',
        quality: 4,
        reviewedAt: '2026-09-10T20:00:00Z',
        previousState: 'learning',
        nextState: 'review',
        previousInterval: 4,
        nextInterval: 10,
      }

      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })
      const client = { from: mockFrom } as unknown as SupabaseClient<Database>

      const result = await logReviewEvent(client, event)

      expect(mockFrom).toHaveBeenCalledWith('review_events')
      expect(mockInsert).toHaveBeenCalledWith({
        id: 'rev-evt-1',
        user_id: 'u1',
        card_id: 'c1',
        vocabulary_item_id: 'voc_1',
        quality: 4,
        reviewed_at: '2026-09-10T20:00:00Z',
        previous_state: 'learning',
        next_state: 'review',
        previous_interval: 4,
        next_interval: 10,
      })
      expect(result.error).toBeNull()
    })
  })

  describe('startStudySession & finishStudySession', () => {
    it('creates and finishes study session', async () => {
      const mockSingle = vi.fn().mockResolvedValue({ data: { id: 'sess-123' }, error: null })
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect })

      const mockEq = vi.fn().mockResolvedValue({ error: null })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq })

      const mockFrom = vi.fn((table: string) => {
        if (table === 'study_sessions') {
          return { insert: mockInsert, update: mockUpdate }
        }
        return {}
      })
      const client = { from: mockFrom } as unknown as SupabaseClient<Database>

      const session = await startStudySession(client, { userId: 'u1', level: 'A1' })
      expect(session.id).toBe('sess-123')

      const finishResult = await finishStudySession(client, 'sess-123', {
        cardsReviewed: 15,
        cardsCorrect: 14,
      })
      expect(finishResult.error).toBeNull()
    })
  })
})
