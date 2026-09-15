/**
 * localNotificationService.ts
 *
 * Drip Campaign Notification Service for the Escuela de Inglés Americana app.
 *
 * Strategy:
 * - Schedule up to 3 push notifications per day (non-intrusive Drip Campaign).
 * - Each notification carries 1–3 curated vocabulary words + their example sentences.
 * - A notification is NOT scheduled if the user opened the app in the last 4 hours
 *   (silence-if-active rule) to avoid interrupting an already-engaged learner.
 * - Deep link: /learn?quick_review=true&ids=<vocId1>,<vocId2>
 * - Content source: curated `example` and `word` fields from @elp/content. ZERO AI.
 *
 * References: discusion-pedagogica.md §12 (Campaña de Goteo — Drip Campaign)
 */

import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getVocabularyById } from '@elp/content'

// ─── Constants ─────────────────────────────────────────────────────────────────

/** Maximum notifications per day */
const MAX_DAILY_NOTIFICATIONS = 3

/** Silence window: don't schedule if the user was active within this period (ms) */
const SILENCE_WINDOW_MS = 4 * 60 * 60 * 1000 // 4 hours

/** AsyncStorage keys */
const KEY_LAST_ACTIVE = '@elp/notification/lastActiveMs'
const KEY_SCHEDULED_TODAY = '@elp/notification/scheduledToday'

// ─── Types ──────────────────────────────────────────────────────────────────────

interface DrillNotificationPayload {
  title: string
  body: string
  deepLink: string
}

// ─── Permission ────────────────────────────────────────────────────────────────

/**
 * Requests notification permission if not already granted.
 * Must be called from a React component context (or useEffect).
 * Returns true if permission was granted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false

  const { status: existing } = await Notifications.getPermissionsAsync()
  if (existing === Notifications.PermissionStatus.GRANTED) return true

  const { status } = await Notifications.requestPermissionsAsync()
  return status === Notifications.PermissionStatus.GRANTED
}

// ─── Silence Gate ──────────────────────────────────────────────────────────────

/**
 * Record the current timestamp as the user's last active time.
 * Call this whenever the user opens the app or starts a session.
 */
export async function recordUserActivity(): Promise<void> {
  await AsyncStorage.setItem(KEY_LAST_ACTIVE, String(Date.now()))
}

/**
 * Returns true if the learner was active within SILENCE_WINDOW_MS.
 * When true, no notification should be scheduled.
 */
async function isUserRecentlyActive(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEY_LAST_ACTIVE)
  if (!raw) return false
  const lastActive = parseInt(raw, 10)
  return Date.now() - lastActive < SILENCE_WINDOW_MS
}

// ─── Daily Limit ───────────────────────────────────────────────────────────────

/**
 * Returns the number of notifications already scheduled today.
 */
async function getScheduledCountToday(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const raw = await AsyncStorage.getItem(KEY_SCHEDULED_TODAY)
  if (!raw) return 0
  const parsed = JSON.parse(raw) as { date: string; count: number }
  return parsed.date === today ? parsed.count : 0
}

/**
 * Increments the scheduled-today counter.
 */
async function incrementScheduledCount(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10)
  const count = await getScheduledCountToday()
  await AsyncStorage.setItem(
    KEY_SCHEDULED_TODAY,
    JSON.stringify({ date: today, count: count + 1 }),
  )
}

// ─── Payload Builder ───────────────────────────────────────────────────────────

/**
 * Builds a notification payload from 1–3 vocabulary item IDs.
 * Uses only curated `word` and `example` fields — ZERO AI.
 */
function buildPayload(vocabularyIds: string[]): DrillNotificationPayload {
  const items = vocabularyIds
    .slice(0, 3)
    .map((id) => getVocabularyById(id))
    .filter(Boolean)

  if (items.length === 0) {
    return {
      title: '📚 ¿Listo para practicar?',
      body: 'Tienes palabras pendientes que reforzar.',
      deepLink: '/learn',
    }
  }

  const firstItem = items[0]
  if (!firstItem) {
    return {
      title: 'Momento de repasar',
      body: 'Tienes palabras pendientes que reforzar.',
      deepLink: '/learn',
    }
  }
  const wordList = items.map((i) => i.word).join(', ')
  const idsParam = vocabularyIds.slice(0, 3).join(',')

  const title =
    items.length === 1
      ? `💡 ¿Recuerdas "${firstItem.word}"?`
      : `💡 Repaso rápido: ${wordList}`

  const body =
    items.length === 1 && firstItem.example
      ? firstItem.example
      : `Tienes ${String(items.length)} palabra${items.length > 1 ? 's' : ''} para repasar hoy.`

  return {
    title,
    body,
    deepLink: `/learn?quick_review=true&ids=${idsParam}`,
  }
}

// ─── Main API ──────────────────────────────────────────────────────────────────

/**
 * Schedules a drill reminder notification if all conditions are met:
 * 1. Permission has been granted.
 * 2. User was NOT active in the last 4 hours.
 * 3. Fewer than MAX_DAILY_NOTIFICATIONS have been scheduled today.
 *
 * @param vocabularyIds - IDs of words to include in the notification
 * @param triggerSeconds - Seconds from now to fire the notification (default: 3 hours)
 * @returns The notification identifier, or null if scheduling was skipped.
 */
export async function scheduleDrillReminder(
  vocabularyIds: string[],
  triggerSeconds: number = 3 * 60 * 60,
): Promise<string | null> {
  if (Platform.OS === 'web') return null

  // Gate 1: silence if active recently
  if (await isUserRecentlyActive()) return null

  // Gate 2: daily cap
  const todayCount = await getScheduledCountToday()
  if (todayCount >= MAX_DAILY_NOTIFICATIONS) return null

  // Gate 3: permission
  const hasPermission = await requestNotificationPermission()
  if (!hasPermission) return null

  const { title, body, deepLink } = buildPayload(vocabularyIds)

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { deepLink, vocabularyIds },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: triggerSeconds,
      repeats: false,
    },
  })

  await incrementScheduledCount()
  return notificationId
}

/**
 * Cancels all pending notifications scheduled by this service.
 * Call on sign-out or when the user opts out of notifications.
 */
export async function cancelAllDrillReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

/**
 * Configures the global notification handler behavior.
 * Call this once at app startup (e.g., in _layout.tsx).
 */
export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: () =>
      Promise.resolve({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
  })
}
