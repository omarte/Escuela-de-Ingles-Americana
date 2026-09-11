import {
  reconcileCardState,
  type Database,
  type SupabaseClient,
  type SyncCandidateLocal,
  type UserCardRow,
} from '@elp/database'
import type { ReviewEvent, SRSCard } from '@elp/types'
import {
  getDirtyLocalCards,
  getPendingReviewEvents,
  getSyncMetadata,
  markCardsSynced,
  markReviewEventsSynced,
  setSyncMetadata,
  upsertLocalCard,
} from './sqlite'
import { localRowToSRSCard, type LocalUserCardRow } from './schema'

export interface SyncResult {
  success: boolean
  pushedEvents: number
  pushedCards: number
  pulledCards: number
  timestamp: string
  error?: string
}

/**
 * Reconciles local and remote card states using Last-Write-Wins.
 * Delegates to the pure domain logic in @elp/database.
 */
export function reconcileCard(
  local: LocalUserCardRow | undefined,
  remote: UserCardRow,
): { winner: 'remote' | 'local'; card: SRSCard } {
  const candidate: SyncCandidateLocal | undefined = local
    ? {
        id: local.id,
        userId: local.user_id,
        vocabularyItemId: local.vocabulary_item_id,
        state: local.state,
        interval: local.interval,
        easeFactor: local.ease_factor,
        reps: local.reps,
        lapses: local.lapses,
        dueDate: local.due_date,
        lastReviewed: local.last_reviewed,
        syncStatus: local.sync_status,
        updatedAt: local.updated_at,
      }
    : undefined

  return reconcileCardState(candidate, remote)
}

export async function syncUserData(
  userId: string,
  client: SupabaseClient<Database> | null,
): Promise<SyncResult> {
  const syncStartTime = new Date().toISOString()

  if (!client) {
    return {
      success: false,
      pushedEvents: 0,
      pushedCards: 0,
      pulledCards: 0,
      timestamp: syncStartTime,
      error: 'Cliente Supabase no disponible o sin conexión',
    }
  }

  try {
    // ─── Step 1: Push pending review events ──────────────────────────────────
    const pendingEvents = await getPendingReviewEvents(userId)
    const syncedEventIds: string[] = []

    for (const evt of pendingEvents) {
      const reviewEvent: ReviewEvent = {
        id: evt.id,
        userId: evt.user_id,
        cardId: evt.card_id,
        vocabularyItemId: evt.vocabulary_item_id,
        quality: evt.quality,
        reviewedAt: evt.reviewed_at,
        previousState: evt.previous_state,
        nextState: evt.next_state,
        previousInterval: evt.previous_interval,
        nextInterval: evt.next_interval,
      }

      const { error } = await client.from('review_events').insert({
        id: reviewEvent.id,
        user_id: reviewEvent.userId,
        card_id: reviewEvent.cardId,
        vocabulary_item_id: reviewEvent.vocabularyItemId,
        quality: reviewEvent.quality,
        reviewed_at: reviewEvent.reviewedAt,
        previous_state: reviewEvent.previousState,
        next_state: reviewEvent.nextState,
        previous_interval: reviewEvent.previousInterval,
        next_interval: reviewEvent.nextInterval,
      })

      if (!error) {
        syncedEventIds.push(evt.id)
      }
    }

    if (syncedEventIds.length > 0) {
      await markReviewEventsSynced(userId, syncedEventIds)
    }

    // ─── Step 2: Push dirty local cards ─────────────────────────────────────
    const dirtyCards = await getDirtyLocalCards(userId)
    const syncedCardIds: string[] = []

    for (const row of dirtyCards) {
      const card = localRowToSRSCard(row)
      const { error } = await client.from('user_cards').upsert({
        id: card.id,
        user_id: card.userId,
        vocabulary_item_id: card.vocabularyItemId,
        state: card.state,
        interval: card.interval,
        ease_factor: card.easeFactor,
        reps: card.reps,
        lapses: card.lapses,
        due_date: card.dueDate,
        last_reviewed: card.lastReviewed,
      })

      if (!error) {
        syncedCardIds.push(row.id)
      }
    }

    if (syncedCardIds.length > 0) {
      await markCardsSynced(userId, syncedCardIds)
    }

    // ─── Step 3: Pull remote cards modified since last_synced_at ────────────
    const lastSyncKey = `last_synced_at_${userId}`
    const lastSyncedAt = await getSyncMetadata(lastSyncKey)

    let query = client.from('user_cards').select('*').eq('user_id', userId)
    if (lastSyncedAt) {
      query = query.gt('updated_at', lastSyncedAt)
    }

    const { data: remoteCards, error: pullError } = await query
    let pulledCount = 0

    if (!pullError && remoteCards && remoteCards.length > 0) {
      for (const remote of remoteCards) {
        const reconciliation = reconcileCard(
          dirtyCards.find((c) => c.vocabulary_item_id === remote.vocabulary_item_id),
          remote,
        )

        if (reconciliation.winner === 'remote') {
          await upsertLocalCard(reconciliation.card, 'synced')
          pulledCount++
        }
      }
    }

    // ─── Step 4: Record new sync checkpoint ──────────────────────────────────
    await setSyncMetadata(lastSyncKey, syncStartTime)

    return {
      success: true,
      pushedEvents: syncedEventIds.length,
      pushedCards: syncedCardIds.length,
      pulledCards: pulledCount,
      timestamp: syncStartTime,
    }
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : 'Error desconocido durante la sincronización'
    return {
      success: false,
      pushedEvents: 0,
      pushedCards: 0,
      pulledCards: 0,
      timestamp: syncStartTime,
      error: errorMsg,
    }
  }
}
