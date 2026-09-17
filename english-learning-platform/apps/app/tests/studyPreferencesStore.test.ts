import { describe, it, expect, beforeEach, vi } from 'vitest'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useStudyPreferencesStore } from '../stores/useStudyPreferencesStore'
import * as notifications from '../lib/notifications'

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => {
  let store: Record<string, string> = {}
  return {
    default: {
      getItem: vi.fn((key: string) => Promise.resolve(store[key] ?? null)),
      setItem: vi.fn((key: string, val: string) => {
        store[key] = val
        return Promise.resolve()
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key]
        return Promise.resolve()
      }),
      clear: vi.fn(() => {
        store = {}
        return Promise.resolve()
      }),
    },
  }
})

// Mock notifications
vi.mock('../lib/notifications', () => ({
  scheduleDailyStudyReminder: vi.fn((hour: number, minute: number, goal: number) =>
    Promise.resolve({
      success: true,
      message: `Recordatorio programado todos los días a las ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} hrs.`,
    }),
  ),
  cancelDailyStudyReminder: vi.fn(() => Promise.resolve()),
  requestNotificationPermissions: vi.fn(() => Promise.resolve(true)),
}))

describe('useStudyPreferencesStore & Daily Reminders', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
    vi.clearAllMocks()
    useStudyPreferencesStore.setState({
      dailyGoal: 20,
      pronunciationVariant: 'US_STANDARD',
      reminderHour: 20,
      reminderMinute: 0,
      notificationsEnabled: true,
      isLoaded: false,
    })
  })

  it('loads default academic preferences correctly', () => {
    const state = useStudyPreferencesStore.getState()
    expect(state.dailyGoal).toBe(20)
    expect(state.pronunciationVariant).toBe('US_STANDARD')
    expect(state.reminderHour).toBe(20)
    expect(state.notificationsEnabled).toBe(true)
  })

  it('schedules reminder with updated goal when daily goal changes', async () => {
    await useStudyPreferencesStore.getState().setDailyGoal(25)

    expect(useStudyPreferencesStore.getState().dailyGoal).toBe(25)
    expect(notifications.scheduleDailyStudyReminder).toHaveBeenCalledWith(20, 0, 25)
  })

  it('cancels scheduled reminder when notifications are disabled', async () => {
    const res = await useStudyPreferencesStore.getState().setReminder(-1, 0, false)

    expect(useStudyPreferencesStore.getState().notificationsEnabled).toBe(false)
    expect(notifications.cancelDailyStudyReminder).toHaveBeenCalledTimes(1)
    expect(res.success).toBe(true)
    expect(res.message).toBe('Recordatorio diario desactivado.')
  })

  it('schedules reminder at chosen time when enabled', async () => {
    const res = await useStudyPreferencesStore.getState().setReminder(21, 30, true)

    expect(useStudyPreferencesStore.getState().reminderHour).toBe(21)
    expect(useStudyPreferencesStore.getState().reminderMinute).toBe(30)
    expect(useStudyPreferencesStore.getState().notificationsEnabled).toBe(true)
    expect(notifications.scheduleDailyStudyReminder).toHaveBeenCalledWith(21, 30, 20)
    expect(res.success).toBe(true)
    expect(res.message).toContain('21:30')
  })

  it('persists pronunciation speed preference', async () => {
    await useStudyPreferencesStore.getState().setPronunciationVariant('US_SLOW')

    expect(useStudyPreferencesStore.getState().pronunciationVariant).toBe('US_SLOW')
    const raw = await AsyncStorage.getItem('@elp/study_preferences_v1')
    expect(raw).toContain('US_SLOW')
  })
})
