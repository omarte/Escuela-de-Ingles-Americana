import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { ReviewEvent, SRSCard } from '@elp/types'
import { toLocalDateString } from '@elp/srs'
import {
  CREATE_INDEXES,
  CREATE_LOCAL_REVIEW_EVENTS_TABLE,
  CREATE_LOCAL_USER_CARDS_TABLE,
  CREATE_SYNC_METADATA_TABLE,
  CREATE_LOCAL_SESSION_FEEDBACK_TABLE,
  localRowToSRSCard,
  srsCardToLocalRow,
  reviewEventToLocalRow,
  localRowToReviewEvent,
} from './schema'
import type {
  LocalReviewEventRow,
  LocalSyncStatus,
  LocalUserCardRow,
  LocalSessionFeedbackRow,
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
const ASYNC_FEEDBACK_PREFIX = '@elp/sqlite_fallback_feedback_'

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
        ${CREATE_LOCAL_SESSION_FEEDBACK_TABLE}
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

export async function getAllLocalReviewEventsAsEvents(userId: string): Promise<ReviewEvent[]> {
  const rows = await getAllLocalReviewEvents(userId)
  return rows.map(localRowToReviewEvent)
}

export async function restoreLocalReviewEvents(
  userId: string,
  events: ReviewEvent[],
): Promise<void> {
  const db = await getDatabase()
  if (db) {
    for (const event of events) {
      const row = reviewEventToLocalRow(event, 'pending')
      await db.runAsync(
        `INSERT OR REPLACE INTO local_review_events (
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
    }
    return
  }

  const existing = await getFallbackEvents(userId)
  const existingIds = new Set(existing.map((e) => e.id))
  for (const event of events) {
    const row = reviewEventToLocalRow(event, 'pending')
    if (!existingIds.has(row.id)) {
      existing.push(row)
    }
  }
  await saveFallbackEvents(userId, existing)
}


export async function getLocalReviewDates(userId: string): Promise<string[]> {
  const db = await getDatabase()
  if (db) {
    const rows = await db.getAllAsync<{ reviewed_at: string }>(
      'SELECT reviewed_at FROM local_review_events WHERE user_id = ? ORDER BY reviewed_at ASC',
      [userId],
    )
    const unique = new Set(rows.map((r) => toLocalDateString(r.reviewed_at)))
    return Array.from(unique).sort()
  }
  const all = await getFallbackEvents(userId)
  const unique = new Set(all.map((e) => toLocalDateString(e.reviewed_at)))
  return Array.from(unique).sort()
}

/**
 * Restores cards from backup by merging with existing local cards.
 * If a card already exists on this device, takes the higher progress (reps, interval, state)
 * to avoid ever losing local progress during restoration.
 */
export async function restoreLocalCardsWithMerge(
  userId: string,
  incomingCards: SRSCard[],
): Promise<{ added: number; updated: number }> {
  const existingCards = await getLocalCards(userId)
  const existingMap = new Map(existingCards.map((c) => [c.vocabularyItemId, c]))

  let added = 0
  let updated = 0

  const stateRank: Record<string, number> = {
    new: 0,
    learning: 1,
    review: 2,
    relearning: 1,
  }

  for (const card of incomingCards) {
    if (!card.vocabularyItemId) continue

    const local = existingMap.get(card.vocabularyItemId)
    if (!local) {
      await upsertLocalCard({ ...card, userId }, 'dirty')
      added++
    } else {
      const localRank = stateRank[local.state] ?? 0
      const incomingRank = stateRank[card.state] ?? 0
      const mergedState = localRank >= incomingRank ? local.state : card.state
      const mergedInterval = Math.max(local.interval ?? 0, card.interval ?? 0)
      const mergedReps = Math.max(local.reps ?? 0, card.reps ?? 0)
      const mergedLapses = Math.min(local.lapses ?? 0, card.lapses ?? 0)
      const mergedEase = Math.max(local.easeFactor ?? 2.5, card.easeFactor ?? 2.5)

      let mergedLastReviewed = local.lastReviewed
      if (card.lastReviewed) {
        if (!mergedLastReviewed || new Date(card.lastReviewed) > new Date(mergedLastReviewed)) {
          mergedLastReviewed = card.lastReviewed
        }
      }
      const mergedDueDate =
        local.dueDate && card.dueDate
          ? local.dueDate > card.dueDate
            ? local.dueDate
            : card.dueDate
          : (local.dueDate || card.dueDate)

      const mergedCard: SRSCard = {
        id: local.id,
        userId,
        vocabularyItemId: card.vocabularyItemId,
        state: mergedState,
        interval: mergedInterval,
        easeFactor: mergedEase,
        reps: mergedReps,
        lapses: mergedLapses,
        dueDate: mergedDueDate,
        lastReviewed: mergedLastReviewed,
      }
      await upsertLocalCard(mergedCard, 'dirty')
      updated++
    }
  }

  return { added, updated }
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

/**
 * Elimina todos los datos locales asociados a un usuario (SQLite y fallback AsyncStorage).
 * Invocado durante el flujo de eliminación de cuenta para no dejar datos residuales.
 */
export async function clearLocalUserData(userId: string): Promise<void> {
  const db = await getDatabase()
  if (db) {
    try {
      await db.runAsync('DELETE FROM local_user_cards WHERE user_id = ?', [userId])
      await db.runAsync('DELETE FROM local_review_events WHERE user_id = ?', [userId])
      await db.runAsync('DELETE FROM local_session_feedback WHERE user_id = ?', [userId])
      await db.runAsync('DELETE FROM sync_metadata WHERE key LIKE ?', [`%${userId}%`])
    } catch {
      // Ignorar errores si la tabla aún no fue creada
    }
  }
  try {
    await AsyncStorage.removeItem(`${ASYNC_CARDS_PREFIX}${userId}`)
    await AsyncStorage.removeItem(`${ASYNC_EVENTS_PREFIX}${userId}`)
    await AsyncStorage.removeItem(`${ASYNC_META_PREFIX}${userId}`)
    await AsyncStorage.removeItem(`${ASYNC_FEEDBACK_PREFIX}${userId}`)
  } catch {
    // ignore
  }
}

/**
 * Inserta o actualiza un reporte de dificultad post-sesión en SQLite local.
 */
export async function upsertLocalSessionFeedback(
  userId: string,
  sessionDate: string,
  frictionLevel: string,
  syncStatus: 'pending' | 'synced' = 'pending',
): Promise<void> {
  const db = await getDatabase()
  const id = `fb_${sessionDate}_${userId.substring(0, 8)}`
  const now = new Date().toISOString()

  if (db) {
    await db.runAsync(
      `INSERT INTO local_session_feedback (id, user_id, session_date, friction_level, sync_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, session_date) DO UPDATE SET
         friction_level = excluded.friction_level,
         sync_status = excluded.sync_status,
         created_at = excluded.created_at`,
      [id, userId, sessionDate, frictionLevel, syncStatus, now],
    )
    return
  }

  // Fallback AsyncStorage
  try {
    const raw = await AsyncStorage.getItem(`${ASYNC_FEEDBACK_PREFIX}${userId}`)
    const list: LocalSessionFeedbackRow[] = raw ? JSON.parse(raw) : []
    const filtered = list.filter((item) => item.session_date !== sessionDate)
    const newRow: LocalSessionFeedbackRow = {
      id,
      user_id: userId,
      session_date: sessionDate,
      friction_level: frictionLevel,
      sync_status: syncStatus,
      created_at: now,
    }
    await AsyncStorage.setItem(
      `${ASYNC_FEEDBACK_PREFIX}${userId}`,
      JSON.stringify([newRow, ...filtered]),
    )
  } catch {
    // ignore
  }
}

/**
 * Obtiene las encuestas post-sesión pendientes de sincronizar con Supabase.
 */
export async function getPendingSessionFeedback(
  userId: string,
): Promise<LocalSessionFeedbackRow[]> {
  const db = await getDatabase()
  if (db) {
    return await db.getAllAsync<LocalSessionFeedbackRow>(
      `SELECT * FROM local_session_feedback WHERE user_id = ? AND sync_status = 'pending'`,
      [userId],
    )
  }

  try {
    const raw = await AsyncStorage.getItem(`${ASYNC_FEEDBACK_PREFIX}${userId}`)
    const list: LocalSessionFeedbackRow[] = raw ? JSON.parse(raw) : []
    return list.filter((item) => item.sync_status === 'pending')
  } catch {
    return []
  }
}

/**
 * Marca una encuesta de sesión como sincronizada con Supabase.
 */
export async function markSessionFeedbackSynced(
  userId: string,
  sessionDate: string,
): Promise<void> {
  const db = await getDatabase()
  if (db) {
    await db.runAsync(
      `UPDATE local_session_feedback SET sync_status = 'synced' WHERE user_id = ? AND session_date = ?`,
      [userId, sessionDate],
    )
    return
  }

  try {
    const raw = await AsyncStorage.getItem(`${ASYNC_FEEDBACK_PREFIX}${userId}`)
    if (raw) {
      const list: LocalSessionFeedbackRow[] = JSON.parse(raw)
      const updated = list.map((item) =>
        item.session_date === sessionDate ? { ...item, sync_status: 'synced' as const } : item,
      )
      await AsyncStorage.setItem(`${ASYNC_FEEDBACK_PREFIX}${userId}`, JSON.stringify(updated))
    }
  } catch {
    // ignore
  }
}


