import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type {
  CheckpointAttemptRecord,
  CheckpointId,
  CheckpointProgressState,
  CheckpointStatus,
} from '@elp/types'
import {
  MILESTONE_CHECKPOINTS,
  generateCertificateHash,
} from '../lib/evaluationEngine'

const EVALUATION_STORAGE_KEY = '@elp_evaluation_attempts'

export interface EvaluationState {
  attempts: CheckpointAttemptRecord[]
  isLoading: boolean

  loadAttempts: () => Promise<void>
  recordAttempt: (attempt: Omit<CheckpointAttemptRecord, 'id' | 'certificateHash'>) => Promise<CheckpointAttemptRecord>
  getCheckpointState: (checkpointId: CheckpointId, wordsMasteredCount: number) => CheckpointProgressState
  getAllCheckpointsState: (wordsMasteredCount: number) => CheckpointProgressState[]
  getAcademicSummary: (wordsMasteredCount: number) => {
    totalCheckpoints: number
    passedCount: number
    averageScore: number
    averageLatencyMs: number
    certificatesCount: number
    readinessRatio: number
  }
}

export const useEvaluationStore = create<EvaluationState>()((set, get) => ({
  attempts: [],
  isLoading: false,

  loadAttempts: async () => {
    set({ isLoading: true })
    try {
      const raw = await AsyncStorage.getItem(EVALUATION_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CheckpointAttemptRecord[]
        set({ attempts: parsed, isLoading: false })
      } else {
        set({ attempts: [], isLoading: false })
      }
    } catch {
      set({ attempts: [], isLoading: false })
    }
  },

  recordAttempt: async (data) => {
    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    let certHash: string | undefined = undefined

    if (data.passed) {
      certHash = generateCertificateHash(
        data.userId,
        data.checkpointId,
        data.scorePercentage,
        data.completedAt
      )
    }

    const newRecord: CheckpointAttemptRecord = {
      ...data,
      id: attemptId,
      ...(certHash ? { certificateHash: certHash } : {}),
    }

    const current = get().attempts
    const updated = [newRecord, ...current]
    set({ attempts: updated })

    try {
      await AsyncStorage.setItem(EVALUATION_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignored for non-blocking UI
    }

    return newRecord
  },

  getCheckpointState: (checkpointId, wordsMasteredCount) => {
    const def = MILESTONE_CHECKPOINTS.find((c) => c.id === checkpointId)
    if (!def) {
      throw new Error(`Checkpoint ${checkpointId} no encontrado`)
    }

    const attemptsForCp = get().attempts.filter((a) => a.checkpointId === checkpointId)
    const passedAttempt = attemptsForCp.find((a) => a.passed)

    if (passedAttempt) {
      const bestScore = Math.max(...attemptsForCp.map((a) => a.scorePercentage))
      return {
        checkpoint: def,
        status: 'passed' as CheckpointStatus,
        bestScorePercentage: bestScore,
        passedAt: passedAttempt.completedAt,
        averageLatencyMs: passedAttempt.averageLatencyMs,
        ...(passedAttempt.certificateHash ? { certificateHash: passedAttempt.certificateHash } : {}),
      }
    }

    if (attemptsForCp.length > 0) {
      const latest = attemptsForCp[0]
      return {
        checkpoint: def,
        status: 'failed' as CheckpointStatus,
        bestScorePercentage: latest?.scorePercentage,
        averageLatencyMs: latest?.averageLatencyMs,
      }
    }

    // Si aún no tiene intentos, ver si está disponible o bloqueado por palabras
    if (wordsMasteredCount >= def.requiredWords) {
      return {
        checkpoint: def,
        status: 'available' as CheckpointStatus,
      }
    }

    return {
      checkpoint: def,
      status: 'locked' as CheckpointStatus,
    }
  },

  getAllCheckpointsState: (wordsMasteredCount) => {
    return MILESTONE_CHECKPOINTS.map((cp) => get().getCheckpointState(cp.id, wordsMasteredCount))
  },

  getAcademicSummary: (wordsMasteredCount) => {
    const allStates = get().getAllCheckpointsState(wordsMasteredCount)
    const passed = allStates.filter((s) => s.status === 'passed')
    const passedCount = passed.length
    const totalCheckpoints = MILESTONE_CHECKPOINTS.length

    let totalScore = 0
    let totalLatency = 0
    passed.forEach((p) => {
      totalScore += p.bestScorePercentage ?? 0
      totalLatency += p.averageLatencyMs ?? 0
    })

    const averageScore = passedCount > 0 ? Math.round(totalScore / passedCount) : 0
    const averageLatencyMs = passedCount > 0 ? Math.round(totalLatency / passedCount) : 0
    const certificatesCount = passed.filter((p) => Boolean(p.certificateHash)).length
    const readinessRatio = totalCheckpoints > 0 ? passedCount / totalCheckpoints : 0

    return {
      totalCheckpoints,
      passedCount,
      averageScore,
      averageLatencyMs,
      certificatesCount,
      readinessRatio,
    }
  },
}))
