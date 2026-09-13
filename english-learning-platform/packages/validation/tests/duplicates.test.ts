import { describe, it, expect } from 'vitest'
import { findDuplicates, normalizeWord } from '../src/index'

describe('Deduplicación Léxica y Namespacing de Excepciones', () => {
  it('normaliza palabras estándar a minúsculas y sin espacios externos', () => {
    expect(normalizeWord('  Environment ')).toBe('environment')
    expect(normalizeWord('Apple')).toBe('apple')
  })

  it('namespacea tripletas de verbos irregulares (delimitadas por –)', () => {
    expect(normalizeWord('go – went – gone')).toBe('irregular_triplet:go')
    expect(normalizeWord('take – took – taken')).toBe('irregular_triplet:take')
  })

  it('preserva notas y homónimos legítimos entre paréntesis', () => {
    expect(normalizeWord('cook (person)')).toBe('cook (person)')
    expect(normalizeWord('cook (verb)')).toBe('cook (verb)')
    expect(normalizeWord('cook')).toBe('cook')
  })

  it('detecta duplicados dentro del mismo nivel', () => {
    const fixture = {
      A1: [
        {
          week: 1,
          vocabulary: [
            { id: 'voc_a1_apple_001', word: 'apple' },
            { id: 'voc_a1_apple_002', word: 'apple' },
          ],
        },
      ],
    }
    const report = findDuplicates(fixture, ['A1'])
    expect(report.sameLevelDuplicates).toHaveLength(1)
    expect(report.sameLevelDuplicates[0]?.normalizedWord).toBe('apple')
    expect(report.crossLevelDuplicates).toHaveLength(0)
  })

  it('falla y detecta duplicados cruzados no namespaceados entre niveles (ej. environment en A1 y B1)', () => {
    const fixtureWithCrossDuplicate = {
      A1: [
        {
          week: 17,
          vocabulary: [{ id: 'voc_a1_environment_001', word: 'environment' }],
        },
      ],
      B1: [
        {
          week: 1,
          vocabulary: [{ id: 'voc_b1_environment_001', word: 'environment' }],
        },
      ],
    }
    const report = findDuplicates(fixtureWithCrossDuplicate, ['A1', 'B1'])
    expect(report.crossLevelDuplicates).toHaveLength(1)
    expect(report.crossLevelDuplicates[0]?.normalizedWord).toBe('environment')
    expect(report.crossLevelDuplicates[0]?.items).toHaveLength(2)
  })

  it('no detecta colisión entre un verbo base y su tripleta de conjugación irregular (Semana 19)', () => {
    const fixtureWithIrregular = {
      A1: [
        {
          week: 1,
          vocabulary: [{ id: 'voc_a1_go_001', word: 'go' }],
        },
        {
          week: 19,
          vocabulary: [{ id: 'voc_a1_go-triplet_019', word: 'go – went – gone' }],
        },
      ],
    }
    const report = findDuplicates(fixtureWithIrregular, ['A1'])
    expect(report.sameLevelDuplicates).toHaveLength(0)
    expect(report.crossLevelDuplicates).toHaveLength(0)
  })

  it('no detecta colisión entre homónimos diferenciados por contexto', () => {
    const fixtureWithHomonyms = {
      A1: [
        {
          week: 2,
          vocabulary: [
            { id: 'voc_a1_cook-person_001', word: 'cook (person)' },
            { id: 'voc_a1_cook-verb_002', word: 'cook (verb)' },
          ],
        },
      ],
    }
    const report = findDuplicates(fixtureWithHomonyms, ['A1'])
    expect(report.sameLevelDuplicates).toHaveLength(0)
    expect(report.crossLevelDuplicates).toHaveLength(0)
  })
})
