import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useEvaluationStore } from '../stores/useEvaluationStore'
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

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: null,
  isSupabaseConfigured: false,
}))

describe('useEvaluationStore — Remote & Local Sync', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
    useEvaluationStore.setState({ attempts: [], isLoading: false })
  })

  it('records an attempt locally and generates a certificate hash if passed', async () => {
    const record = await useEvaluationStore.getState().recordAttempt({
      checkpointId: 'a1_cp1',
      userId: 'test_user_1',
      scorePercentage: 90,
      totalQuestions: 10,
      correctCount: 9,
      passed: true,
      averageLatencyMs: 2400,
      fastAnswersCount: 8,
      frictionCount: 0,
      completedAt: '2026-09-17T12:00:00.000Z',
      answers: [],
    })

    expect(record.id).toBeDefined()
    expect(record.passed).toBe(true)
    expect(record.certificateHash).toMatch(/^EIA-A1-CP1-[0-9A-F]{6}$/)

    const state = useEvaluationStore.getState()
    expect(state.attempts.length).toBe(1)
    expect(state.attempts[0]?.certificateHash).toBe(record.certificateHash)
  })

  it('calculates checkpoint progress state dynamically based on user words mastered', () => {
    const stateBefore = useEvaluationStore.getState().getCheckpointState('a1_cp1', 50)
    expect(stateBefore.status).toBe('locked')

    const stateAvailable = useEvaluationStore.getState().getCheckpointState('a1_cp1', 100)
    expect(stateAvailable.status).toBe('available')
  })

  it('computes academic summary metrics accurately across checkpoints', async () => {
    await useEvaluationStore.getState().recordAttempt({
      checkpointId: 'a1_cp1',
      userId: 'test_user_1',
      scorePercentage: 85,
      totalQuestions: 10,
      correctCount: 9,
      passed: true,
      averageLatencyMs: 2200,
      fastAnswersCount: 9,
      frictionCount: 0,
      completedAt: '2026-09-17T12:00:00.000Z',
      answers: [],
    })

    const summary = useEvaluationStore.getState().getAcademicSummary(150)
    expect(summary.totalCheckpoints).toBe(8)
    expect(summary.passedCount).toBe(1)
    expect(summary.certificatesCount).toBe(1)
    expect(summary.averageScore).toBe(85)
    expect(summary.averageLatencyMs).toBe(2200)
  })
})
