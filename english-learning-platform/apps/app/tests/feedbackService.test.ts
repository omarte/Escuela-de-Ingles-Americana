import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  saveSessionFeedback,
  getSessionFeedbackHistory,
} from '../lib/feedbackService'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: null,
  isSupabaseConfigured: false,
}))

// Mock SQLite
vi.mock('../lib/db/sqlite', () => ({
  upsertLocalSessionFeedback: vi.fn(() => Promise.resolve()),
  markSessionFeedbackSynced: vi.fn(() => Promise.resolve()),
  getPendingSessionFeedback: vi.fn(() => Promise.resolve([])),
}))

describe('feedbackService — 1-Tap Session Feedback', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it('persists friction level locally with accurate metadata', async () => {
    const fixedDate = new Date('2026-09-17T15:00:00.000Z')
    const record = await saveSessionFeedback('student_abc', 'normal', fixedDate)

    expect(record.id).toContain('fb_')
    expect(record.userId).toBe('student_abc')
    expect(record.frictionLevel).toBe('normal')
    expect(record.sessionDate).toBe('2026-09-17')

    const history = await getSessionFeedbackHistory('student_abc')
    expect(history.length).toBe(1)
    expect(history[0]?.frictionLevel).toBe('normal')
  })

  it('updates existing feedback for the same day idempotently', async () => {
    const fixedDate = new Date('2026-09-17T15:00:00.000Z')
    await saveSessionFeedback('student_abc', 'hard', fixedDate)
    await saveSessionFeedback('student_abc', 'easy', fixedDate)

    const history = await getSessionFeedbackHistory('student_abc')
    expect(history.length).toBe(1)
    expect(history[0]?.frictionLevel).toBe('easy')
  })
})
