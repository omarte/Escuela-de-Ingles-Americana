import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import {
  GrammarExerciseBankSchema,
  WritingPromptBankSchema,
} from '../src/index'

describe('Primer Lote Curated Content - Regression & Integrity', () => {
  // Resolve primer lote folder reliably across different execution working directories
  const possiblePaths = [
    path.resolve(__dirname, '../../../../docs/archive/primer-lote-2026-09'),
    path.resolve(process.cwd(), '../docs/archive/primer-lote-2026-09'),
    path.resolve(process.cwd(), 'docs/archive/primer-lote-2026-09'),
    path.resolve(__dirname, '../../../../primer lote'),
    path.resolve(process.cwd(), '../primer lote'),
    path.resolve(process.cwd(), '../../primer lote'),
    path.resolve(process.cwd(), 'primer lote'),
  ]
  const primerLoteDir = possiblePaths.find((p) => fs.existsSync(p))

  it('encuentra el directorio de primer lote en el repositorio', () => {
    expect(primerLoteDir).toBeDefined()
    expect(fs.existsSync(primerLoteDir!)).toBe(true)
  })

  it('valida el contenido real de grammar_b1.json contra GrammarExerciseBankSchema', () => {
    const filePath = path.join(primerLoteDir!, 'grammar_b1.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw)
    const result = GrammarExerciseBankSchema.safeParse(parsed)

    if (!result.success) {
      console.error('Validation errors in grammar_b1.json:', result.error.issues)
    }

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toHaveLength(45)
      // All items must be B1 and explicitly flagged as 'curated'
      for (const exercise of result.data) {
        expect(exercise.level).toBe('B1')
        expect(exercise.status).toBe('curated')
        expect(exercise.explanation.length).toBeGreaterThanOrEqual(10)
      }
      const uniqueTopics = new Set(result.data.map((e) => e.grammarTopic))
      expect(uniqueTopics.size).toBe(15)
    }
  })

  it('valida el contenido real de writing_prompts_b2.json contra WritingPromptBankSchema', () => {
    const filePath = path.join(primerLoteDir!, 'writing_prompts_b2.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw)
    const result = WritingPromptBankSchema.safeParse(parsed)

    if (!result.success) {
      console.error('Validation errors in writing_prompts_b2.json:', result.error.issues)
    }

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toHaveLength(13)
      for (const prompt of result.data) {
        expect(prompt.level).toBe('B2')
        expect(prompt.status).toBe('curated')
        expect(prompt.maxWords).toBeGreaterThan(prompt.minWords)
        expect(prompt.rubricForTutor.length).toBeGreaterThanOrEqual(2)
      }
      const uniqueTypes = new Set(result.data.map((p) => p.type))
      expect(uniqueTypes.size).toBe(6)
    }
  })

  it('valida el contenido real de readings_b1.json (8 lecturas con comprensión)', () => {
    const filePath = path.join(primerLoteDir!, 'readings_b1.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw) as Array<{
      id: string
      level: string
      title: string
      text: string
      comprehensionQuestions: Array<{ question: string; options: string[]; correctIndex: number }>
      status: string
    }>

    expect(parsed).toHaveLength(8)
    for (const reading of parsed) {
      expect(reading.level).toBe('B1')
      expect(reading.status).toBe('curated')
      expect(reading.text.length).toBeGreaterThan(50)
      expect(reading.comprehensionQuestions.length).toBeGreaterThanOrEqual(3)
      for (const q of reading.comprehensionQuestions) {
        expect(q.options.length).toBeGreaterThanOrEqual(2)
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(q.options.length)
      }
    }
  })
})
