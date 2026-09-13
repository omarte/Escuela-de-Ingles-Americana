import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { scheduleDailyStudyReminder, cancelDailyStudyReminder } from '../lib/notifications'

export type PronunciationVariant = 'US_STANDARD' | 'US_SLOW'

export interface StudyPreferences {
  dailyGoal: number
  pronunciationVariant: PronunciationVariant
  reminderHour: number
  reminderMinute: number
  notificationsEnabled: boolean
}

export interface StudyPreferencesState extends StudyPreferences {
  isLoaded: boolean
  loadPreferences: () => Promise<void>
  setDailyGoal: (goal: number) => Promise<void>
  setPronunciationVariant: (variant: PronunciationVariant) => Promise<void>
  setReminder: (hour: number, minute: number, enabled: boolean) => Promise<{ success: boolean; message: string }>
}

const STORAGE_KEY = '@elp/study_preferences_v1'

const DEFAULT_PREFERENCES: StudyPreferences = {
  dailyGoal: 20,
  pronunciationVariant: 'US_STANDARD',
  reminderHour: 20,
  reminderMinute: 0,
  notificationsEnabled: true,
}

export const useStudyPreferencesStore = create<StudyPreferencesState>()((set, get) => ({
  ...DEFAULT_PREFERENCES,
  isLoaded: false,

  loadPreferences: async (): Promise<void> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StudyPreferences>
        set({
          dailyGoal: typeof parsed.dailyGoal === 'number' ? parsed.dailyGoal : DEFAULT_PREFERENCES.dailyGoal,
          pronunciationVariant:
            parsed.pronunciationVariant === 'US_SLOW' ? 'US_SLOW' : DEFAULT_PREFERENCES.pronunciationVariant,
          reminderHour:
            typeof parsed.reminderHour === 'number' ? parsed.reminderHour : DEFAULT_PREFERENCES.reminderHour,
          reminderMinute:
            typeof parsed.reminderMinute === 'number' ? parsed.reminderMinute : DEFAULT_PREFERENCES.reminderMinute,
          notificationsEnabled:
            typeof parsed.notificationsEnabled === 'boolean'
              ? parsed.notificationsEnabled
              : DEFAULT_PREFERENCES.notificationsEnabled,
          isLoaded: true,
        })
      } else {
        set({ isLoaded: true })
      }
    } catch {
      set({ isLoaded: true })
    }
  },

  setDailyGoal: async (goal: number): Promise<void> => {
    const current = get()
    const updated: StudyPreferences = {
      dailyGoal: goal,
      pronunciationVariant: current.pronunciationVariant,
      reminderHour: current.reminderHour,
      reminderMinute: current.reminderMinute,
      notificationsEnabled: current.notificationsEnabled,
    }
    set({ dailyGoal: goal })
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      if (current.notificationsEnabled && current.reminderHour >= 0) {
        void scheduleDailyStudyReminder(current.reminderHour, current.reminderMinute, goal)
      }
    } catch {
      // Ignore storage error
    }
  },

  setPronunciationVariant: async (variant: PronunciationVariant): Promise<void> => {
    const current = get()
    const updated: StudyPreferences = {
      dailyGoal: current.dailyGoal,
      pronunciationVariant: variant,
      reminderHour: current.reminderHour,
      reminderMinute: current.reminderMinute,
      notificationsEnabled: current.notificationsEnabled,
    }
    set({ pronunciationVariant: variant })
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignore storage error
    }
  },

  setReminder: async (
    hour: number,
    minute: number,
    enabled: boolean,
  ): Promise<{ success: boolean; message: string }> => {
    const current = get()
    const updated: StudyPreferences = {
      dailyGoal: current.dailyGoal,
      pronunciationVariant: current.pronunciationVariant,
      reminderHour: hour,
      reminderMinute: minute,
      notificationsEnabled: enabled,
    }
    set({
      reminderHour: hour,
      reminderMinute: minute,
      notificationsEnabled: enabled,
    })

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignore storage error
    }

    if (!enabled) {
      await cancelDailyStudyReminder()
      return { success: true, message: 'Recordatorio diario desactivado.' }
    } else {
      return await scheduleDailyStudyReminder(hour, minute, current.dailyGoal)
    }
  },
}))
