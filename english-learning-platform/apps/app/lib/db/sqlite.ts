import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { ReviewEvent, SRSCard } from '@elp/types'
import {
  CREATE_INDEXES,
  CREATE_LOCAL_REVIEW_EVENTS_TABLE,
  CREATE_LOCAL_USER_CARDS_TABLE,
  CREATE_SYNC_METADATA_TABLE,
  localRowToSRSCard,
  srsCardToLocalRow,
  reviewEventToLocalRow,
  type LocalReviewEventRow,
  type LocalSyncStatus,
  type LocalUserCardRow,
} from './schema'

interface SQLiteModule {
  openDatabaseAsync: (name: string) => Promise<SQLiteDbLike>
}

interface SQLiteDbLike {
  execAsync: (sql: string) => Promise<void>
  getAllAsync: <T>(sql: string, params?: unknown[]) => Promise<T[]>
  getFirstAsync: <T>(sql: string, params?: unknown[]) => Promise<T | null>
  runAsync: (sql: string, params?: unknown[]) => Promise<unknown>
}

const DB_NAME = 'elp_offline.db'
const ASYNC_CARDS_PREFIX = '@elp/sqlite_fallback_cards_'
const ASYNC_EVENTS_PREFIX = '@elp/sqlite_fallback_events_'
const ASYNC_META_PREFIX = '@elp/sqlite_fallback_meta_'

let dbPromise: Promise<SQLiteDbLike | null> | null = null

async function openSQLite(): Promise<SQLiteDbLike | null> {
  // Web or environments without native sqlite fallback gracefully
  if (Platform.OS === 'web') {
    return null
  }

  try {
    const sqlite = (await import('expo-sqlite')) as unknown as SQLiteModule
    if (typeof sqlite.openDatabaseAsync === 'function') {
      const db = await sqlite.openDatabaseAsync(DB_NAME)
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        ${CREATE_LOCAL_USER_CARDS_TABLE}
        ${CREATE_LOCAL_REVIEW_EVENTS_TABLE}
        ${CREATE_SYNC_METADATA_TABLE}
        ${CREATE_INDEXES}
      `)
      return db
    }
  } catch {
    // If native driver fails to load, fallback to storage
  }
  return null
}

export async function getDatabase(): Promise<SQLiteDbLike | null> {
  if (!dbPromise) {
    dbPromise = openSQLite()
  }
  return await dbPromise
}

// ─── AsyncStorage Fallback Implementations ────────────────────────────────────

async function getFallbackCards(userId: string): Promise<LocalUserCardRow[]> {
  try {
    const raw = await AsyncStorage.getItem(`${ASYNC_CARDS_PREFIX}${userId}`)
    return raw ? (JSON.parse(raw) as LocalUserCardRow[]) : []
  } catch {
    return []
  }
}

async function saveFallbackCards(userId: string, cards: LocalUserCardRow[]): Promise<void> {
  try {
    await AsyncStorage.setItem(`${ASYNC_CARDS_PREFIX}${userId}`, JSON.stringify(cards))
  } catch {
    // ignore
  }
}

async function getFallbackEvents(userId: string): Promise<LocalReviewEventRow[]> {
  try {
    const raw = await AsyncStorage.getItem(`${ASYNC_EVENTS_PREFIX}${userId}`)
    return raw ? (JSON.parse(raw) as LocalReviewEventRow[]) : []
  } catch {
    return []
  }
}

async function saveFallbackEvents(userId: string, events: LocalReviewEventRow[]): Promise<void> {
  try {
    await AsyncStorage.setItem(`${ASYNC_EVENTS_PREFIX}${userId}`, JSON.stringify(events))
  } catch {
    // ignore
  }
}

// ─── Public Database Operations ───────────────────────────────────────────────

export async function initLocalDatabase(): Promise<void> {
  await getDatabase()
}

export async function getLocalCards(userId: string): Promise<SRSCard[]> {
  const db = await getDatabase()
  if (db) {
    const rows = await db.getAllAsync<LocalUserCardRow>(
      'SELECT * FROM local_user_cards WHERE user_id = ? ORDER BY due_date ASC',
      [userId],
    )
    return rows.map(localRowToSRSCard)
  }

  const rows = await getFallbackCards(userId)
  return rows.map(localRowToSRSCard)
}

export async function upsertLocalCard(
  card: SRSCard,
  syncStatus: LocalSyncStatus = 'dirty',
): Promise<void> {
  const db = await getDatabase()
  const row = srsCardToLocalRow(card, syncStatus)

  if (db) {
    await db.runAsync(
      `INSERT INTO local_user_cards (
        id, user_id, vocabulary_item_id, state, interval, ease_factor, reps, lapses,
        due_date, last_reviewed, sync_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, vocabulary_item_id) DO UPDATE SET
        state = excluded.state,
        interval = excluded.interval,
        ease_factor = excluded.ease_factor,
        reps = excluded.reps,
        lapses = excluded.lapses,
        due_date = excluded.due_date,
        last_reviewed = excluded.last_reviewed,
        sync_status = excluded.sync_status,
        updated_at = excluded.updated_at`,
      [
        row.id,
        row.user_id,
        row.vocabulary_item_id,
        row.state,
        row.interval,
        row.ease_factor,
        row.reps,
        row.lapses,
        row.due_date,
        row.last_reviewed,
        row.sync_status,
        row.created_at,
        row.updated_at,
      ],
    )
    return
  }

  const existing = await getFallbackCards(card.userId)
  const index = existing.findIndex((c) => c.vocabulary_item_id === card.vocabularyItemId)
  if (index >= 0) {
    existing[index] = { ...existing[index], ...row }
  } else {
    existing.push(row)
  }
  await saveFallbackCards(card.userId, existing)
}

export async function saveLocalCards(
  cards: SRSCard[],
  syncStatus: LocalSyncStatus = 'dirty',
): Promise<void> {
  for (const card of cards) {
    await upsertLocalCard(card, syncStatus)
  }
}

export async function logLocalReviewEvent(event: ReviewEvent): Promise<void> {
  const db = await getDatabase()
  const row = reviewEventToLocalRow(event, 'pending')

  if (db) {
    await db.runAsync(
      `INSERT INTO local_review_events (
        id, user_id, card_id, vocabulary_item_id, quality, reviewed_at,
        previous_state, next_state, previous_interval, next_interval, sync_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        row.id,
        row.user_id,
        row.card_id,
        row.vocabulary_item_id,
        row.quality,
        row.reviewed_at,
        row.previous_state,
        row.next_state,
        row.previous_interval,
        row.next_interval,
        row.sync_status,
      ],
    )
    return
  }

  const existing = await getFallbackEvents(event.userId)
  existing.push(row)
  await saveFallbackEvents(event.userId, existing)
}

export async function getDirtyLocalCards(userId: string): Promise<LocalUserCardRow[]> {
  const db = await getDatabase()
  if (db) {
    return await db.getAllAsync<LocalUserCardRow>(
      'SELECT * FROM local_user_cards WHERE user_id = ? AND sync_status = ?',
      [userId, 'dirty'],
    )
  }
  const all = await getFallbackCards(userId)
  return all.filter((c) => c.sync_status === 'dirty')
}

export async function getPendingReviewEvents(userId: string): Promise<LocalReviewEventRow[]> {
  const db = await getDatabase()
  if (db) {
    return await db.getAllAsync<LocalReviewEventRow>(
      'SELECT * FROM local_review_events WHERE user_id = ? AND sync_status = ? ORDER BY reviewed_at ASC',
      [userId, 'pending'],
    )
  }
  const all = await getFallbackEvents(userId)
  return all.filter((e) => e.sync_status === 'pending')
}

export async function getAllLocalReviewEvents(userId: string): Promise<LocalReviewEventRow[]> {
  const db = await getDatabase()
  if (db) {
    return await db.getAllAsync<LocalReviewEventRow>(
      'SELECT * FROM local_review_events WHERE user_id = ? ORDER BY reviewed_at ASC',
      [userId],
    )
  }
  return await getFallbackEvents(userId)
}

export async function getLocalReviewDates(userId: string): Promise<string[]> {
  const db = await getDatabase()
  if (db) {
    const rows = await db.getAllAsync<{ date_str: string }>(
      'SELECT DISTINCT substr(reviewed_at, 1, 10) as date_str FROM local_review_events WHERE user_id = ? ORDER BY date_str ASC',
      [userId],
    )
    return rows.map((r) => r.date_str)
  }
  const all = await getFallbackEvents(userId)
  const unique = new Set(all.map((e) => e.reviewed_at.slice(0, 10)))
  return Array.from(unique).sort()
}

export async function markCardsSynced(userId: string, cardIds: string[]): Promise<void> {
  if (cardIds.length === 0) return

  const db = await getDatabase()
  if (db) {
    const placeholders = cardIds.map(() => '?').join(',')
    await db.runAsync(
      `UPDATE local_user_cards SET sync_status = 'synced' WHERE id IN (${placeholders})`,
      cardIds,
    )
    return
  }

  const all = await getFallbackCards(userId)
  const updated = all.map((c) =>
    cardIds.includes(c.id) ? { ...c, sync_status: 'synced' as const } : c,
  )
  await saveFallbackCards(userId, updated)
}

export async function markReviewEventsSynced(userId: string, eventIds: string[]): Promise<void> {
  if (eventIds.length === 0) return

  const db = await getDatabase()
  if (db) {
    const placeholders = eventIds.map(() => '?').join(',')
    await db.runAsync(
      `UPDATE local_review_events SET sync_status = 'synced' WHERE id IN (${placeholders})`,
      eventIds,
    )
    return
  }

  const all = await getFallbackEvents(userId)
  const updated = all.map((e) =>
    eventIds.includes(e.id) ? { ...e, sync_status: 'synced' as const } : e,
  )
  await saveFallbackEvents(userId, updated)
}

export async function getSyncMetadata(key: string): Promise<string | null> {
  const db = await getDatabase()
  if (db) {
    const row = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM sync_metadata WHERE key = ?',
      [key],
    )
    return row ? row.value : null
  }
  try {
    return await AsyncStorage.getItem(`${ASYNC_META_PREFIX}${key}`)
  } catch {
    return null
  }
}

export async function setSyncMetadata(key: string, value: string): Promise<void> {
  const now = new Date().toISOString()
  const db = await getDatabase()
  if (db) {
    await db.runAsync(
      `INSERT INTO sync_metadata (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      [key, value, now],
    )
    return
  }
  try {
    await AsyncStorage.setItem(`${ASYNC_META_PREFIX}${key}`, value)
  } catch {
    // ignore
  }
}

export async function getPendingSyncCount(
  userId: string,
): Promise<{ dirtyCards: number; pendingEvents: number }> {
  const dirty = await getDirtyLocalCards(userId)
  const events = await getPendingReviewEvents(userId)
  return {
    dirtyCards: dirty.length,
    pendingEvents: events.length,
  }
}
