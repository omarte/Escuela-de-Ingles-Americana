import { getVocabularyForLevel } from '@elp/content'
import type { CEFRLevel } from '@elp/types'
import type { WordDisplayData } from './vocabulary'

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

// Curated fallbacks in case level pool is small
const BACKUP_DISTRACTORS: Record<string, string[]> = {
  noun: [
    'Hermano',
    'Hermana',
    'Padre',
    'Madre',
    'Agua',
    'Pan',
    'Casa',
    'Jardín',
    'Perro',
    'Gato',
    'Amigo',
    'Comida',
    'Escuela',
    'Ciudad',
    'Carro',
    'Libro',
  ],
  verb: [
    'Hacer',
    'Tener',
    'Ir',
    'Decir',
    'Ver',
    'Comer',
    'Beber',
    'Dormir',
    'Trabajar',
    'Vivir',
    'Saber',
    'Querer',
    'Poder',
    'Dar',
  ],
  adjective: [
    'Grande',
    'Pequeño',
    'Bueno',
    'Malo',
    'Nuevo',
    'Viejo',
    'Fácil',
    'Difícil',
    'Rápido',
    'Lento',
    'Bonito',
    'Feliz',
    'Azul',
    'Rojo',
  ],
}

/**
 * Clean translation to show concise primary Spanish answer
 */
function getCleanTranslation(raw: string): string {
  if (!raw) return 'Traducción'
  // If format is "Madre / Mamá", keep first or clean format
  return raw.trim()
}

/**
 * Generates 4 well-balanced options for the active recall multiple-choice challenge.
 * 1 correct translation + 3 smart distractors of similar category.
 */
export function generateQuizOptions(
  currentWord: WordDisplayData,
  level: CEFRLevel = 'A1',
): QuizOption[] {
  const correctText = getCleanTranslation(currentWord.translation)
  const normalizedCorrect = correctText.toLowerCase()

  // 1. Gather candidate distractors from same level
  let candidateItems: string[] = []
  try {
    const levelVocab = getVocabularyForLevel(level)
    candidateItems = levelVocab
      .filter((v) => v.id !== currentWord.id && v.translation)
      .filter((v) => !v.translation.toLowerCase().includes(normalizedCorrect) && !normalizedCorrect.includes(v.translation.toLowerCase()))
      .map((v) => getCleanTranslation(v.translation))
  } catch {
    candidateItems = []
  }

  // Deduplicate and filter out empty or identical
  const uniqueCandidates = Array.from(new Set(candidateItems)).filter(
    (text) => text.toLowerCase() !== normalizedCorrect,
  )

  // 2. Select 3 distractors
  const distractors: string[] = []
  const shuffledCandidates = [...uniqueCandidates].sort(() => 0.5 - Math.random())

  for (const item of shuffledCandidates) {
    if (distractors.length >= 3) break
    if (!distractors.includes(item)) {
      distractors.push(item)
    }
  }

  // 3. Fallback if not enough candidates from dataset
  if (distractors.length < 3) {
    const pos = currentWord.partOfSpeech.toLowerCase()
    const pool = BACKUP_DISTRACTORS[pos] ?? BACKUP_DISTRACTORS['noun'] ?? []
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random())
    for (const item of shuffledPool) {
      if (distractors.length >= 3) break
      if (item.toLowerCase() !== normalizedCorrect && !distractors.includes(item)) {
        distractors.push(item)
      }
    }
  }

  // 4. Assemble 4 options and shuffle
  const options: QuizOption[] = [
    {
      id: `opt_correct_${currentWord.id}`,
      text: correctText,
      isCorrect: true,
    },
    ...distractors.map((text, idx) => ({
      id: `opt_distractor_${idx}_${currentWord.id}`,
      text,
      isCorrect: false,
    })),
  ]

  // Shuffle so the correct answer is randomly distributed
  return options.sort(() => 0.5 - Math.random())
}
