import type { CEFRLevel } from './index'

export type CheckpointId =
  | 'a1_cp1'
  | 'a1_cp2'
  | 'a1_cp3'
  | 'a1_cp4'
  | 'a2_cp1'
  | 'a2_cp2'
  | 'b1_grad'
  | 'b2_grad'

export interface CheckpointDefinition {
  readonly id: CheckpointId
  readonly level: CEFRLevel
  readonly title: string
  readonly subtitle: string
  readonly requiredWords: number
  readonly maxWeekScope: number
  readonly badgeEmoji: string
  readonly isGraduation: boolean
}

export type ExamQuestionType = 'cloze' | 'audio_meaning' | 'direct_translation'

export interface ExamQuestion {
  readonly id: string
  readonly vocabularyItemId: string
  readonly type: ExamQuestionType
  readonly prompt: string
  readonly promptTranslation?: string | undefined
  readonly audioText?: string | undefined
  readonly clozePrefix?: string | undefined
  readonly clozeSuffix?: string | undefined
  readonly options: readonly string[]
  readonly correctOptionIndex: number
  readonly explanation: string
}

export interface QuestionAnswerRecord {
  readonly questionId: string
  readonly vocabularyItemId: string
  readonly selectedIndex: number
  readonly isCorrect: boolean
  readonly latencyMs: number
  readonly isFriction: boolean // latencyMs > 7000ms
  readonly isAutomated: boolean // latencyMs < 3000ms
}

export interface CheckpointAttemptRecord {
  readonly id: string
  readonly checkpointId: CheckpointId
  readonly userId: string
  readonly scorePercentage: number
  readonly totalQuestions: number
  readonly correctCount: number
  readonly passed: boolean
  readonly averageLatencyMs: number
  readonly fastAnswersCount: number
  readonly frictionCount: number
  readonly completedAt: string
  readonly answers: readonly QuestionAnswerRecord[]
  readonly certificateHash?: string | undefined
}

export type CheckpointStatus = 'locked' | 'available' | 'passed' | 'failed'

export interface CheckpointProgressState {
  readonly checkpoint: CheckpointDefinition
  readonly status: CheckpointStatus
  readonly bestScorePercentage?: number | undefined
  readonly passedAt?: string | undefined
  readonly averageLatencyMs?: number | undefined
  readonly certificateHash?: string | undefined
}
