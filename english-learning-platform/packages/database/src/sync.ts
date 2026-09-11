import type { SRSCard, CardState } from '@elp/types'
import type { UserCardRow } from './index'

export interface SyncCandidateLocal {
  id: string
  userId: string
  vocabularyItemId: string
  state: CardState
  interval: number
  easeFactor: number
  reps: number
  lapses: number
  dueDate: string
  lastReviewed: string | null
  syncStatus: 'synced' | 'dirty'
  updatedAt: string
}

export interface ReconcileResult {
  winner: 'remote' | 'local'
  card: SRSCard
}

/**
 * Reconciles local and remote card states using Last-Write-Wins.
 *
 * Rules:
 * 1. If local card does not exist, remote wins.
 * 2. If local card is marked 'synced' (clean), remote wins.
 * 3. If local card is marked 'dirty' (modified offline), compare updated timestamps:
 *    - remote wins if remote.updated_at >= local.updatedAt
 *    - local wins if local.updatedAt > remote.updated_at
 */
export function reconcileCardState(
  local: SyncCandidateLocal | undefined,
  remote: UserCardRow,
): ReconcileResult {
  const remoteCard: SRSCard = {
    id: remote.id,
    userId: remote.user_id,
    vocabularyItemId: remote.vocabulary_item_id,
    state: remote.state,
    interval: remote.interval,
    easeFactor: remote.ease_factor,
    reps: remote.reps,
    lapses: remote.lapses,
    dueDate: remote.due_date,
    lastReviewed: remote.last_reviewed,
  }

  if (!local || local.syncStatus === 'synced') {
    return { winner: 'remote', card: remoteCard }
  }

  const localTime = new Date(local.updatedAt).getTime()
  const remoteTime = new Date(remote.updated_at).getTime()

  if (remoteTime >= localTime) {
    return { winner: 'remote', card: remoteCard }
  }

  const localCard: SRSCard = {
    id: local.id,
    userId: local.userId,
    vocabularyItemId: local.vocabularyItemId,
    state: local.state,
    interval: local.interval,
    easeFactor: local.easeFactor,
    reps: local.reps,
    lapses: local.lapses,
    dueDate: local.dueDate,
    lastReviewed: local.lastReviewed,
  }

  return { winner: 'local', card: localCard }
}
