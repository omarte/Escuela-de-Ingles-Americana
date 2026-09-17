import { describe, it, expect } from 'vitest'
import {
  MILESTONE_CHECKPOINTS,
  getCheckpointById,
  generateCheckpointExam,
  generateCertificateHash,
  evaluateExamAnswers,
} from '../lib/evaluationEngine'
import type { QuestionAnswerRecord } from '@elp/types'

describe('Evaluation Engine & Milestone Checkpoints (Fase 12)', () => {
  it('defines the complete milestone checkpoints catalog across CEFR levels', () => {
    expect(MILESTONE_CHECKPOINTS.length).toBe(8)

    const a1Checkpoints = MILESTONE_CHECKPOINTS.filter((cp) => cp.level === 'A1')
    expect(a1Checkpoints.length).toBe(4)
    expect(a1Checkpoints.map((cp) => cp.requiredWords)).toEqual([100, 500, 1000, 1512])

    const a2Checkpoints = MILESTONE_CHECKPOINTS.filter((cp) => cp.level === 'A2')
    expect(a2Checkpoints.length).toBe(2)
    expect(a2Checkpoints.map((cp) => cp.requiredWords)).toEqual([350, 734])

    const b1Checkpoints = MILESTONE_CHECKPOINTS.filter((cp) => cp.level === 'B1')
    expect(b1Checkpoints.length).toBe(1)

    const b2Checkpoints = MILESTONE_CHECKPOINTS.filter((cp) => cp.level === 'B2')
    expect(b2Checkpoints.length).toBe(1)
  })

  it('retrieves checkpoint by valid id and handles invalid id gracefully', () => {
    const cp = getCheckpointById('a1_cp1')
    expect(cp).toBeDefined()
    expect(cp?.title).toContain('Primeros Pasos A1')

    // @ts-expect-error test non-existent id
    const nonExistent = getCheckpointById('invalid_cp')
    expect(nonExistent).toBeUndefined()
  })

  it('generates a 10-question structured exam deterministically from curriculum content', () => {
    const cp = getCheckpointById('a1_cp1')!
    const questions = generateCheckpointExam(cp)

    expect(questions.length).toBe(10)
    for (const q of questions) {
      expect(q.options.length).toBe(4)
      expect(q.correctOptionIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctOptionIndex).toBeLessThan(4)
      expect(q.options[q.correctOptionIndex]).toBeDefined()
      expect(q.prompt.length).toBeGreaterThan(5)
      expect(['cloze', 'audio_meaning', 'direct_translation']).toContain(q.type)
    }
  })

  it('generates consistent and formatted certificate hashes for credentials', () => {
    const hash1 = generateCertificateHash('user_123', 'a1_cp1', 90, '2026-09-17T12:00:00.000Z')
    const hash2 = generateCertificateHash('user_123', 'a1_cp1', 90, '2026-09-17T12:00:00.000Z')
    const hashDifferent = generateCertificateHash('user_456', 'a1_cp1', 90, '2026-09-17T12:00:00.000Z')

    expect(hash1).toBe(hash2)
    expect(hash1).toMatch(/^EIA-A1-CP1-[0-9A-F]{6}$/)
    expect(hash1).not.toBe(hashDifferent)
  })

  it('evaluates answers and calculates cognitive latency metrics and passing threshold', () => {
    // Case 1: 9 out of 10 correct with low latency (automated)
    const passedAnswers: QuestionAnswerRecord[] = Array.from({ length: 10 }, (_, i) => ({
      questionId: `q_${i}`,
      vocabularyItemId: `v_${i}`,
      selectedIndex: i === 0 ? 1 : 0, // 1 error at index 0
      correctOptionIndex: 0,
      isCorrect: i !== 0,
      latencyMs: i < 5 ? 2100 : 2500, // < 3000ms -> automated
      isAutomated: true,
      isFriction: false,
      timestamp: '2026-09-17T12:00:00.000Z',
    }))

    const resultPassed = evaluateExamAnswers(passedAnswers)
    expect(resultPassed.scorePercentage).toBe(90)
    expect(resultPassed.correctCount).toBe(9)
    expect(resultPassed.passed).toBe(true) // >= 80%
    expect(resultPassed.fastAnswersCount).toBe(10)
    expect(resultPassed.frictionCount).toBe(0)
    expect(resultPassed.averageLatencyMs).toBe(2300)

    // Case 2: 7 out of 10 correct with high latency (friction)
    const failedAnswers: QuestionAnswerRecord[] = Array.from({ length: 10 }, (_, i) => ({
      questionId: `q_${i}`,
      vocabularyItemId: `v_${i}`,
      selectedIndex: i < 3 ? 1 : 0, // 3 errors
      correctOptionIndex: 0,
      isCorrect: i >= 3,
      latencyMs: 8500, // > 7000ms -> friction
      isAutomated: false,
      isFriction: true,
      timestamp: '2026-09-17T12:00:00.000Z',
    }))

    const resultFailed = evaluateExamAnswers(failedAnswers)
    expect(resultFailed.scorePercentage).toBe(70)
    expect(resultFailed.correctCount).toBe(7)
    expect(resultFailed.passed).toBe(false) // < 80%
    expect(resultFailed.frictionCount).toBe(10)
    expect(resultFailed.fastAnswersCount).toBe(0)
  })
})
