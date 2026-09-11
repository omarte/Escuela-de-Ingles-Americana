import { getVocabularyById } from '@elp/content'
import type { CEFRLevel } from '@elp/types'

export interface WordDisplayData {
  id: string
  word: string
  translation: string
  phonetic: string
  partOfSpeech: string
  level: CEFRLevel
  exampleEn: string
  exampleEs: string
}

const STARTER_WORDS: Record<string, WordDisplayData> = {
  voc_a1_fam_001: {
    id: 'voc_a1_fam_001',
    word: 'Mother',
    translation: 'Madre / Mamá',
    phonetic: '/ˈmʌð.ər/',
    partOfSpeech: 'noun',
    level: 'A1',
    exampleEn: 'My mother is a doctor.',
    exampleEs: 'Mi madre es médica.',
  },
  voc_a1_fam_002: {
    id: 'voc_a1_fam_002',
    word: 'Father',
    translation: 'Padre / Papá',
    phonetic: '/ˈfɑː.ðər/',
    partOfSpeech: 'noun',
    level: 'A1',
    exampleEn: 'His father works in a school.',
    exampleEs: 'Su padre trabaja en una escuela.',
  },
  voc_a1_fam_003: {
    id: 'voc_a1_fam_003',
    word: 'Brother',
    translation: 'Hermano',
    phonetic: '/ˈbrʌð.ər/',
    partOfSpeech: 'noun',
    level: 'A1',
    exampleEn: 'I have an older brother.',
    exampleEs: 'Tengo un hermano mayor.',
  },
  voc_a1_food_001: {
    id: 'voc_a1_food_001',
    word: 'Water',
    translation: 'Agua',
    phonetic: '/ˈwɔː.tər/',
    partOfSpeech: 'noun',
    level: 'A1',
    exampleEn: 'Drink a glass of water every morning.',
    exampleEs: 'Bebe un vaso de agua cada mañana.',
  },
  voc_a1_food_002: {
    id: 'voc_a1_food_002',
    word: 'Bread',
    translation: 'Pan',
    phonetic: '/bred/',
    partOfSpeech: 'noun',
    level: 'A1',
    exampleEn: 'We buy fresh bread daily.',
    exampleEs: 'Compramos pan fresco a diario.',
  },
}

export const STARTER_WORD_IDS = Object.keys(STARTER_WORDS)

/**
 * Resolves full presentation details for a vocabulary ID.
 * Queries @elp/content registry first, falling back to starter vocabulary items.
 */
export function getWordDisplayData(vocabularyItemId: string): WordDisplayData {
  const item = getVocabularyById(vocabularyItemId)
  if (item) {
    return {
      id: item.id,
      word: item.word,
      translation: item.translation,
      phonetic: item.pronunciation ?? '',
      partOfSpeech: item.partOfSpeech,
      level: item.level,
      exampleEn: item.example ?? '',
      exampleEs: item.exampleTranslation ?? '',
    }
  }

  const starter = STARTER_WORDS[vocabularyItemId]
  if (starter) {
    return starter
  }

  return {
    id: vocabularyItemId,
    word: vocabularyItemId.split('_')[2] ?? 'Word',
    translation: 'Traducción pendiente',
    phonetic: '',
    partOfSpeech: 'noun',
    level: 'A1',
    exampleEn: 'Example sentence.',
    exampleEs: 'Oración de ejemplo.',
  }
}
