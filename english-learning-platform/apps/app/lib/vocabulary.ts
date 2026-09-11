import { getVocabularyById } from '@elp/content'
import type { CEFRLevel } from '@elp/types'
import { getSpanishPhonetic } from './phonetics'

export interface WordDisplayData {
  id: string
  word: string
  translation: string
  phonetic: string
  spanishPhonetic: string
  partOfSpeech: string
  level: CEFRLevel
  exampleEn: string
  exampleEs: string
  variations?: string[] | undefined
  usageNotes?: string | undefined
}

// Curated colloquial variations and practical contextual usages
const CURATED_VARIATIONS: Record<string, { variations: string[]; usageNotes?: string }> = {
  mother: {
    variations: ['Mom (EUA, familiar)', 'Mum (Reino Unido, familiar)', 'Mommy (Afectivo / niños)'],
    usageNotes: 'Usa "Mother" en contextos formales y "Mom/Mum" en conversaciones cotidianas.',
  },
  father: {
    variations: ['Dad (EUA, familiar)', 'Daddy (Afectivo / niños)', 'Papa (Coloquial)'],
    usageNotes: 'Usa "Father" en documentos o formalidad, y "Dad" para llamar a tu papá a diario.',
  },
  brother: {
    variations: ['Bro (Informal entre amigos o hermanos)', 'Older brother (Hermano mayor)', 'Younger brother (Hermano menor)'],
    usageNotes: '"Bro" es muy popular en inglés estadounidense informal.',
  },
  sister: {
    variations: ['Sis (Coloquial informal)', 'Older sister (Hermana mayor)', 'Younger sister (Hermana menor)'],
    usageNotes: 'Se abrevia cariñosamente como "sis".',
  },
  water: {
    variations: ['Mineral water (Agua con gas)', 'Tap water (Agua del grifo)', 'Bottled water (Agua embotellada)'],
    usageNotes: 'En restaurantes, "Still water" es agua sin gas.',
  },
  bread: {
    variations: ['A loaf of bread (Una barra/hogaza de pan)', 'Slice of bread (Rebanada de pan)', 'Toast (Pan tostado)'],
    usageNotes: '"Bread" es incontable en inglés; para contar se usa "piece" o "slice".',
  },
  house: {
    variations: ['Home (Hogar / donde vives emocionalmente)', 'Townhouse (Casa adosada)'],
    usageNotes: '"House" se refiere a la estructura física; "Home" al hogar personal.',
  },
  chicken: {
    variations: ['Fried chicken (Pollo frito)', 'Roast chicken (Pollo asado)', 'Chicken breast (Pechuga de pollo)'],
    usageNotes: 'Puede referirse tanto al animal vivo como a la comida.',
  },
  weekend: {
    variations: ['On the weekend (EUA)', 'At the weekend (UK)', 'Long weekend (Fin de semana largo / puente)'],
    usageNotes: 'Ambas preposiciones "on" y "at" son correctas según el dialecto.',
  },
  dog: {
    variations: ['Puppy (Cachorro)', 'Doggy (Afectivo infantil)'],
    usageNotes: 'Para animales pequeños siempre se usa "puppy".',
  },
}

const STARTER_WORDS: Record<string, WordDisplayData> = {
  voc_a1_fam_001: {
    id: 'voc_a1_fam_001',
    word: 'Mother',
    translation: 'Madre / Mamá',
    phonetic: '/ˈmʌð.ər/',
    spanishPhonetic: 'má-der',
    partOfSpeech: 'noun',
    level: 'A1',
    exampleEn: 'My mother is a doctor.',
    exampleEs: 'Mi madre es médica.',
    variations: ['Mom (EUA, familiar)', 'Mum (UK, familiar)', 'Mommy (Afectivo / niños)'],
    usageNotes: 'Usa "Mother" en situaciones formales y "Mom" con tu familia.',
  },
  voc_a1_fam_002: {
    id: 'voc_a1_fam_002',
    word: 'Father',
    translation: 'Padre / Papá',
    phonetic: '/ˈfɑː.ðər/',
    spanishPhonetic: 'fá-der',
    partOfSpeech: 'noun',
    level: 'A1',
    exampleEn: 'His father works in a school.',
    exampleEs: 'Su padre trabaja en una escuela.',
    variations: ['Dad (EUA, familiar)', 'Daddy (Afectivo / niños)', 'Papa (Coloquial)'],
    usageNotes: 'Usa "Father" en situaciones formales y "Dad" para el día a día.',
  },
  voc_a1_fam_003: {
    id: 'voc_a1_fam_003',
    word: 'Brother',
    translation: 'Hermano',
    phonetic: '/ˈbrʌð.ər/',
    spanishPhonetic: 'bró-der',
    partOfSpeech: 'noun',
    level: 'A1',
    exampleEn: 'I have an older brother.',
    exampleEs: 'Tengo un hermano mayor.',
    variations: ['Bro (Informal)', 'Older brother (Mayor)', 'Younger brother (Menor)'],
    usageNotes: '"Bro" es común entre jóvenes para referirse a un amigo cercano o hermano.',
  },
  voc_a1_food_001: {
    id: 'voc_a1_food_001',
    word: 'Water',
    translation: 'Agua',
    phonetic: '/ˈwɔː.tər/',
    spanishPhonetic: 'uá-ter',
    partOfSpeech: 'noun',
    level: 'A1',
    exampleEn: 'Drink a glass of water every morning.',
    exampleEs: 'Bebe un vaso de agua cada mañana.',
    variations: ['Bottled water (Agua embotellada)', 'Tap water (Agua del grifo)'],
    usageNotes: 'Sustantivo incontable. Para ordenar pides "a glass of water".',
  },
  voc_a1_food_002: {
    id: 'voc_a1_food_002',
    word: 'Bread',
    translation: 'Pan',
    phonetic: '/bred/',
    spanishPhonetic: 'bred',
    partOfSpeech: 'noun',
    level: 'A1',
    exampleEn: 'We buy fresh bread daily.',
    exampleEs: 'Compramos pan fresco a diario.',
    variations: ['Slice of bread (Rebanada)', 'A loaf of bread (Hogaza entera)'],
    usageNotes: 'Incontable en inglés. Se cuantifica con "slice" o "loaf".',
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
    const cleanWord = item.word.trim().toLowerCase()
    const curated = CURATED_VARIATIONS[cleanWord]
    const spanishPhonetic = getSpanishPhonetic(item.word, item.pronunciation)

    return {
      id: item.id,
      word: item.word,
      translation: item.translation,
      phonetic: item.pronunciation ?? '',
      spanishPhonetic,
      partOfSpeech: item.partOfSpeech,
      level: item.level,
      exampleEn: item.example ?? '',
      exampleEs: item.exampleTranslation ?? '',
      variations: curated?.variations ?? (item.variants ? Array.from(item.variants) : undefined),
      usageNotes: curated?.usageNotes ?? item.notes,
    }
  }

  const starter = STARTER_WORDS[vocabularyItemId]
  if (starter) {
    return starter
  }

  const fallbackWord = vocabularyItemId.split('_')[2] ?? 'Word'
  return {
    id: vocabularyItemId,
    word: fallbackWord,
    translation: 'Traducción pendiente',
    phonetic: '',
    spanishPhonetic: getSpanishPhonetic(fallbackWord),
    partOfSpeech: 'noun',
    level: 'A1',
    exampleEn: 'Example sentence.',
    exampleEs: 'Oración de ejemplo.',
  }
}
