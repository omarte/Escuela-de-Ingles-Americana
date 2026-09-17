import { describe, it, expect } from 'vitest'
import { generateSpellingTip } from '../lib/spellingTips'

describe('spellingTips — Pedagogical Spelling & Orthography Heuristics', () => {
  it('handles empty typed input with pronunciation and exact spelling guidance', () => {
    const tip = generateSpellingTip('knight', '', 'caballero')
    expect(tip).toContain('"caballero" se pronuncia')
    expect(tip).toContain('"knight"')
  })

  it('detects transposed letters (anagrams/anagrammatic order)', () => {
    const tip = generateSpellingTip('from', 'form', 'desde')
    expect(tip).toContain('letras correctas pero en orden invertido')
    expect(tip).toContain('"from"')
  })

  it('detects missing silent -ght pattern', () => {
    const tip = generateSpellingTip('night', 'nait', 'noche')
    expect(tip).toContain("patrón mudo '-ght'")
    expect(tip).toContain('"night"')
  })

  it('detects missing initial silent k in kn- words', () => {
    const tip = generateSpellingTip('knife', 'nife', 'cuchillo')
    expect(tip).toContain("'k' inicial es muda")
    expect(tip).toContain('"knife"')
  })

  it('detects missing initial silent w in wr- words', () => {
    const tip = generateSpellingTip('write', 'rite', 'escribir')
    expect(tip).toContain("'w' inicial es muda")
    expect(tip).toContain('"write"')
  })

  it('detects double ee pattern confusion with single i', () => {
    const tip = generateSpellingTip('feel', 'fil', 'sentir')
    expect(tip).toContain("doble 'ee'")
  })

  it('detects missing ea vowel combination', () => {
    const tip = generateSpellingTip('speak', 'spik', 'hablar')
    expect(tip).toContain("combinación vocálica 'ea'")
  })

  it('detects Spanish -cion vs English -tion suffix', () => {
    const tip = generateSpellingTip('station', 'stacion', 'estación')
    expect(tip).toContain("'-tion', no con 'c'")
  })

  it('detects missing double consonants', () => {
    const tip = generateSpellingTip('coffee', 'cofe', 'café')
    expect(tip).toContain('Lleva consonante doble')
  })

  it('detects missing characters count', () => {
    const tip = generateSpellingTip('market', 'mar', 'mercado')
    expect(tip).toContain('Te faltaron 3 letras')
  })

  it('detects extra characters count', () => {
    const tip = generateSpellingTip('cat', 'catttt', 'gato')
    expect(tip).toContain('Escribiste letras de más')
  })
})
