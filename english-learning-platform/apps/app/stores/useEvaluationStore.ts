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
import { supabase } from '../lib/supabase'

const EVALUATION_STORAGE_KEY = '@elp_evaluation_attempts'

export interface EvaluationState {
  attempts: CheckpointAttemptRecord[]
  isLoading: boolean

  loadAttempts: (userId?: string) => Promise<void>
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

  loadAttempts: async (userId?: string) => {
    set({ isLoading: true })

    // 1. Carga inmediata desde AsyncStorage local (Offline-first)
    let localAttempts: CheckpointAttemptRecord[] = []
    try {
      const raw = await AsyncStorage.getItem(EVALUATION_STORAGE_KEY)
      if (raw) {
        localAttempts = JSON.parse(raw) as CheckpointAttemptRecord[]
        set({ attempts: localAttempts, isLoading: false })
      }
    } catch {
      // Continuar a sincronización remota si falla AsyncStorage
    }

    // 2. Si Supabase está disponible y tenemos usuario autenticado, sincronizar desde la nube
    if (supabase) {
      try {
        const targetUserId = userId ?? (await supabase.auth.getUser()).data.user?.id
        if (targetUserId) {
          const { data, error } = await supabase
            .from('checkpoint_attempts')
            .select('*')
            .eq('user_id', targetUserId)
            .order('created_at', { ascending: false })

          if (!error && data && Array.isArray(data)) {
            const remoteAttempts: CheckpointAttemptRecord[] = data.map((row) => ({
              id: row.id,
              checkpointId: row.checkpoint_id as CheckpointId,
              userId: row.user_id,
              scorePercentage: row.score_percentage,
              totalQuestions: row.total_questions,
              correctCount: row.correct_count,
              passed: row.passed,
              averageLatencyMs: row.average_latency_ms,
              fastAnswersCount: row.fast_answers_count,
              frictionCount: row.friction_count,
              completedAt: row.created_at,
              answers: [],
              ...(row.certificate_hash ? { certificateHash: row.certificate_hash } : {}),
            }))

            // Fusión inteligente por ID y hash para evitar duplicados
            const knownIds = new Set(remoteAttempts.map((r) => r.id))
            const knownHashes = new Set(
              remoteAttempts.map((r) => r.certificateHash).filter(Boolean)
            )

            const unsyncedLocals = localAttempts.filter(
              (l) =>
                !knownIds.has(l.id) &&
                (!l.certificateHash || !knownHashes.has(l.certificateHash))
            )

            const merged = [...remoteAttempts, ...unsyncedLocals]
            set({ attempts: merged, isLoading: false })

            try {
              await AsyncStorage.setItem(EVALUATION_STORAGE_KEY, JSON.stringify(merged))
            } catch {
              // Ignore local write failure
            }
          }
        }
      } catch {
        // Red no disponible o tabla no migrada aún — se preservan los registros locales
      }
    }

    set({ isLoading: false })
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

    // 1. Guardado local inmediato
    try {
      await AsyncStorage.setItem(EVALUATION_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignored for non-blocking UI
    }

    // 2. Respaldo asíncrono en Supabase Cloud si está disponible
    if (supabase && data.userId) {
      void (async () => {
        try {
          await supabase.from('checkpoint_attempts').insert({
            user_id: data.userId,
            checkpoint_id: data.checkpointId,
            score_percentage: data.scorePercentage,
            total_questions: data.totalQuestions,
            correct_count: data.correctCount,
            passed: data.passed,
            average_latency_ms: data.averageLatencyMs,
            fast_answers_count: data.fastAnswersCount,
            friction_count: data.frictionCount,
            certificate_hash: certHash ?? null,
          })
        } catch {
          // Si falla la red, el intento permanece a salvo en el almacenamiento local
        }
      })()
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
