import { describe, it, expect } from 'vitest'
import { reconcileCardState, type SyncCandidateLocal, type UserCardRow } from '../src/index'

describe('reconcileCardState (Last-Write-Wins)', () => {
  const remoteCard: UserCardRow = {
    id: 'card-1',
    user_id: 'user-1',
    vocabulary_item_id: 'voc_a1_hello_001',
    state: 'review',
    interval: 6,
    ease_factor: 2.5,
    reps: 2,
    lapses: 0,
    due_date: '2026-09-20T12:00:00.000Z',
    last_reviewed: '2026-09-14T12:00:00.000Z',
    created_at: '2026-09-10T00:00:00.000Z',
    updated_at: '2026-09-14T12:00:00.000Z',
  }

  it('remote wins when local card does not exist', () => {
    const result = reconcileCardState(undefined, remoteCard)
    expect(result.winner).toBe('remote')
    expect(result.card.id).toBe('card-1')
    expect(result.card.state).toBe('review')
    expect(result.card.interval).toBe(6)
  })

  it('remote wins when local card is marked synced (no local modifications)', () => {
    const localSynced: SyncCandidateLocal = {
      id: 'card-1',
      userId: 'user-1',
      vocabularyItemId: 'voc_a1_hello_001',
      state: 'learning',
      interval: 1,
      easeFactor: 2.5,
      reps: 1,
      lapses: 0,
      dueDate: '2026-09-11T12:00:00.000Z',
      lastReviewed: '2026-09-10T12:00:00.000Z',
      syncStatus: 'synced',
      updatedAt: '2026-09-10T12:00:00.000Z',
    }

    const result = reconcileCardState(localSynced, remoteCard)
    expect(result.winner).toBe('remote')
    expect(result.card.state).toBe('review')
    expect(result.card.interval).toBe(6)
  })

  it('remote wins when local card is dirty but remote has newer updated_at', () => {
    const localStaleDirty: SyncCandidateLocal = {
      id: 'card-1',
      userId: 'user-1',
      vocabularyItemId: 'voc_a1_hello_001',
      state: 'learning',
      interval: 3,
      easeFactor: 2.4,
      reps: 2,
      lapses: 0,
      dueDate: '2026-09-13T08:00:00.000Z',
      lastReviewed: '2026-09-10T08:00:00.000Z',
      syncStatus: 'dirty',
      updatedAt: '2026-09-10T08:00:00.000Z', // older than remoteCard.updated_at (Sept 14)
    }

    const result = reconcileCardState(localStaleDirty, remoteCard)
    expect(result.winner).toBe('remote')
    expect(result.card.state).toBe('review')
    expect(result.card.interval).toBe(6)
  })

  it('local wins when local card is dirty and local has newer updated_at', () => {
    const localNewerDirty: SyncCandidateLocal = {
      id: 'card-1',
      userId: 'user-1',
      vocabularyItemId: 'voc_a1_hello_001',
      state: 'dominated',
      interval: 90,
      easeFactor: 2.5,
      reps: 10,
      lapses: 0,
      dueDate: '2026-12-15T12:00:00.000Z',
      lastReviewed: '2026-09-16T12:00:00.000Z',
      syncStatus: 'dirty',
      updatedAt: '2026-09-16T12:00:00.000Z', // newer than remoteCard.updated_at (Sept 14)
    }

    const result = reconcileCardState(localNewerDirty, remoteCard)
    expect(result.winner).toBe('local')
    expect(result.card.state).toBe('dominated')
    expect(result.card.interval).toBe(90)
    expect(result.card.reps).toBe(10)
  })

  it('remote wins when local card is dirty and timestamps are identical', () => {
    const localEqualTimeDirty: SyncCandidateLocal = {
      id: 'card-1',
      userId: 'user-1',
      vocabularyItemId: 'voc_a1_hello_001',
      state: 'learning',
      interval: 2,
      easeFactor: 2.3,
      reps: 1,
      lapses: 1,
      dueDate: '2026-09-15T00:00:00.000Z',
      lastReviewed: '2026-09-14T12:00:00.000Z',
      syncStatus: 'dirty',
      updatedAt: '2026-09-14T12:00:00.000Z', // identical timestamp
    }

    const result = reconcileCardState(localEqualTimeDirty, remoteCard)
    expect(result.winner).toBe('remote')
    expect(result.card.state).toBe('review')
  })
})
