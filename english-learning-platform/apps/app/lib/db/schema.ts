import type { CardState, ReviewQuality, SRSCard, ReviewEvent } from '@elp/types'

export type LocalSyncStatus = 'synced' | 'dirty'
export type LocalEventSyncStatus = 'pending' | 'synced'

export interface LocalUserCardRow {
  id: string
  user_id: string
  vocabulary_item_id: string
  state: CardState
  interval: number
  ease_factor: number
  reps: number
  lapses: number
  due_date: string
  last_reviewed: string | null
  sync_status: LocalSyncStatus
  created_at: string
  updated_at: string
}

export interface LocalReviewEventRow {
  id: string
  user_id: string
  card_id: string
  vocabulary_item_id: string
  quality: ReviewQuality
  reviewed_at: string
  previous_state: CardState
  next_state: CardState
  previous_interval: number
  next_interval: number
  sync_status: LocalEventSyncStatus
}

export interface SyncMetadataRow {
  key: string
  value: string
  updated_at: string
}

export const CREATE_LOCAL_USER_CARDS_TABLE = `
CREATE TABLE IF NOT EXISTS local_user_cards (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  vocabulary_item_id TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'new',
  interval INTEGER NOT NULL DEFAULT 0,
  ease_factor REAL NOT NULL DEFAULT 2.50,
  reps INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  due_date TEXT NOT NULL,
  last_reviewed TEXT,
  sync_status TEXT NOT NULL DEFAULT 'synced',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CONSTRAINT uq_local_user_vocab UNIQUE (user_id, vocabulary_item_id)
);
`

export const CREATE_LOCAL_REVIEW_EVENTS_TABLE = `
CREATE TABLE IF NOT EXISTS local_review_events (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  vocabulary_item_id TEXT NOT NULL,
  quality INTEGER NOT NULL,
  reviewed_at TEXT NOT NULL,
  previous_state TEXT NOT NULL,
  next_state TEXT NOT NULL,
  previous_interval INTEGER NOT NULL,
  next_interval INTEGER NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'pending'
);
`

export const CREATE_SYNC_METADATA_TABLE = `
CREATE TABLE IF NOT EXISTS sync_metadata (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`

export const CREATE_INDEXES = `
CREATE INDEX IF NOT EXISTS idx_luc_user ON local_user_cards (user_id);
CREATE INDEX IF NOT EXISTS idx_luc_due ON local_user_cards (user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_luc_sync ON local_user_cards (sync_status);
CREATE INDEX IF NOT EXISTS idx_lre_sync ON local_review_events (sync_status);
`

export function localRowToSRSCard(row: LocalUserCardRow): SRSCard {
  return {
    id: row.id,
    userId: row.user_id,
    vocabularyItemId: row.vocabulary_item_id,
    state: row.state,
    interval: row.interval,
    easeFactor: row.ease_factor,
    reps: row.reps,
    lapses: row.lapses,
    dueDate: row.due_date,
    lastReviewed: row.last_reviewed,
  }
}

export function srsCardToLocalRow(
  card: SRSCard,
  syncStatus: LocalSyncStatus = 'dirty',
): LocalUserCardRow {
  const now = new Date().toISOString()
  return {
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
    sync_status: syncStatus,
    created_at: now,
    updated_at: now,
  }
}

export function reviewEventToLocalRow(
  event: ReviewEvent,
  syncStatus: LocalEventSyncStatus = 'pending',
): LocalReviewEventRow {
  return {
    id: event.id,
    user_id: event.userId,
    card_id: event.cardId,
    vocabulary_item_id: event.vocabularyItemId,
    quality: event.quality,
    reviewed_at: event.reviewedAt,
    previous_state: event.previousState,
    next_state: event.nextState,
    previous_interval: event.previousInterval,
    next_interval: event.nextInterval,
    sync_status: syncStatus,
  }
}

export function localRowToReviewEvent(row: LocalReviewEventRow): ReviewEvent {
  return {
    id: row.id,
    userId: row.user_id,
    cardId: row.card_id,
    vocabularyItemId: row.vocabulary_item_id,
    quality: row.quality as ReviewEvent['quality'],
    reviewedAt: row.reviewed_at,
    previousState: row.previous_state as ReviewEvent['previousState'],
    nextState: row.next_state as ReviewEvent['nextState'],
    previousInterval: row.previous_interval,
    nextInterval: row.next_interval,
  }
}

