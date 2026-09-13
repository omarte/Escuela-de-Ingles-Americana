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
      expect(result.data).toHaveLength(27)
      // All items must be B1 and explicitly flagged as 'curated'
      for (const exercise of result.data) {
        expect(exercise.level).toBe('B1')
        expect(exercise.status).toBe('curated')
        expect(exercise.explanation.length).toBeGreaterThanOrEqual(10)
      }
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
      expect(result.data).toHaveLength(7)
      for (const prompt of result.data) {
        expect(prompt.level).toBe('B2')
        expect(prompt.status).toBe('curated')
        expect(prompt.maxWords).toBeGreaterThan(prompt.minWords)
        expect(prompt.rubricForTutor.length).toBeGreaterThanOrEqual(2)
      }
    }
  })
})
