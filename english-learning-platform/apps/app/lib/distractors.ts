import { getVocabularyForLevel } from '@elp/content'
import type { CEFRLevel } from '@elp/types'
import type { WordDisplayData } from './vocabulary'

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

// Curated specific confusions for high-frequency pitfalls (false friends, phonetic similarity, lexical confusion)
const SPECIFIC_CONFUSIONS: Record<string, string[]> = {
  daughter: ['Hijo', 'Hermana', 'Duda', 'Madre', 'Sobrina'],
  son: ['Hija', 'Hermano', 'Sol', 'Padre'],
  doubt: ['Hija', 'Deuda', 'Duda', 'Temor'],
  actually: ['Actualmente', 'De hecho', 'En realidad', 'Ahora'],
  current: ['Corriente', 'Actual', 'Pasado', 'Común'],
  success: ['Suceso', 'Éxito', 'Salida', 'Acontecimiento'],
  exit: ['Éxito', 'Salida', 'Entrada', 'Escape'],
  library: ['Librería', 'Biblioteca', 'Lugar', 'Libro'],
  bookstore: ['Biblioteca', 'Librería', 'Estudio', 'Tienda'],
  large: ['Largo', 'Grande', 'Amplio', 'Pesado'],
  long: ['Grande', 'Largo', 'Alto', 'Bajo'],
  embarrassed: ['Embarazada', 'Avergonzado', 'Confundido', 'Cansado'],
  carpet: ['Carpeta', 'Alfombra', 'Cortina', 'Manta'],
  folder: ['Alfombra', 'Carpeta', 'Cuaderno', 'Sobre'],
  advice: ['Aviso', 'Consejo', 'Noticia', 'Advertencia'],
  notice: ['Consejo', 'Aviso', 'Nota', 'Anuncio'],
  soap: ['Sopa', 'Jabón', 'Espuma', 'Toalla'],
  soup: ['Jabón', 'Sopa', 'Caldo', 'Bebida'],
  hit: ['Golpear', 'Atrapar', 'Herir', 'Tirar'],
  flu: ['Gripe', 'Gripa', 'Agarre', 'Resfriado'],
  sensible: ['Sensible', 'Sensato', 'Sencillo', 'Simple'],
  sensitive: ['Sensato', 'Sensible', 'Atento', 'Cuidadoso'],
}

// Semantic category clusters for natural category-level distractors
const SEMANTIC_CLUSTERS: Record<string, string[]> = {
  family: ['Padre', 'Madre', 'Hijo', 'Hija', 'Hermano', 'Hermana', 'Abuelo', 'Abuela', 'Tío', 'Tía', 'Primo', 'Prima', 'Sobrino', 'Sobrina', 'Esposo', 'Esposa'],
  time: ['Hoy', 'Mañana', 'Ayer', 'Semana', 'Mes', 'Año', 'Hora', 'Minuto', 'Segundo', 'Tarde', 'Noche', 'Día', 'Siglo'],
  emotions: ['Feliz', 'Triste', 'Enojado', 'Cansado', 'Sorprendido', 'Asustado', 'Tranquilo', 'Nervioso', 'Orgulloso'],
  body: ['Cabeza', 'Brazo', 'Pierna', 'Mano', 'Pie', 'Ojo', 'Oreja', 'Boca', 'Nariz', 'Dedo', 'Espalda', 'Corazón'],
  food: ['Comida', 'Pan', 'Agua', 'Leche', 'Carne', 'Fruta', 'Verdura', 'Arroz', 'Huevo', 'Queso', 'Manzana', 'Pescado'],
  places: ['Casa', 'Escuela', 'Hospital', 'Parque', 'Tienda', 'Ciudad', 'Calle', 'Playa', 'Oficina', 'Restaurante'],
  weather: ['Lluvia', 'Sol', 'Nieve', 'Viento', 'Nube', 'Tormenta', 'Frío', 'Calor', 'Clima'],
  colors: ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Blanco', 'Negro', 'Gris', 'Marrón', 'Naranja', 'Morado'],
}

// Curated fallbacks by part of speech
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
  return raw.trim()
}

/**
 * Generates 4 well-balanced options for the active recall multiple-choice challenge.
 * Priorities:
 * 1. Specific curated lexical/phonetic/false-friend confusions
 * 2. Semantic cluster matches (family, body, time, food, etc.)
 * 3. Same part of speech from the active CEFR level
 * 4. Fallback from curated part of speech pool
 */
export function generateQuizOptions(
  currentWord: WordDisplayData,
  level: CEFRLevel = 'A1',
): QuizOption[] {
  const correctText = getCleanTranslation(currentWord.translation)
  const normalizedCorrect = correctText.toLowerCase()
  const lowerWord = currentWord.word.trim().toLowerCase()
  const currentPos = (currentWord.partOfSpeech || 'noun').toLowerCase()

  const selectedDistractors: string[] = []

  const addIfValid = (item: string) => {
    if (selectedDistractors.length >= 3) return
    const clean = getCleanTranslation(item)
    const norm = clean.toLowerCase()
    if (
      norm !== normalizedCorrect &&
      !selectedDistractors.some((d) => d.toLowerCase() === norm) &&
      !norm.includes(normalizedCorrect) &&
      !normalizedCorrect.includes(norm)
    ) {
      selectedDistractors.push(clean)
    }
  }

  // Priority 1: Specific confusions for this word
  if (SPECIFIC_CONFUSIONS[lowerWord]) {
    const specific = [...SPECIFIC_CONFUSIONS[lowerWord]!].sort(() => 0.5 - Math.random())
    for (const item of specific) {
      addIfValid(item)
    }
  }

  // Priority 2: Semantic cluster match
  if (selectedDistractors.length < 3) {
    for (const cluster of Object.values(SEMANTIC_CLUSTERS)) {
      const isWordInCluster = cluster.some(
        (c) => c.toLowerCase() === normalizedCorrect || normalizedCorrect.includes(c.toLowerCase())
      )
      if (isWordInCluster) {
        const shuffledCluster = [...cluster].sort(() => 0.5 - Math.random())
        for (const item of shuffledCluster) {
          addIfValid(item)
        }
        break
      }
    }
  }

  // Priority 3: Same level and EXACT SAME part of speech
  if (selectedDistractors.length < 3) {
    try {
      const levelVocab = getVocabularyForLevel(level)
      const samePosVocab = levelVocab
        .filter(
          (v) =>
            v.id !== currentWord.id &&
            v.translation &&
            (v.partOfSpeech || '').toLowerCase() === currentPos
        )
        .map((v) => getCleanTranslation(v.translation))
        .sort(() => 0.5 - Math.random())

      for (const item of samePosVocab) {
        addIfValid(item)
      }
    } catch {
      // ignore
    }
  }

  // Priority 4: Any word from level with same part of speech or fallback
  if (selectedDistractors.length < 3) {
    const pool = BACKUP_DISTRACTORS[currentPos] ?? BACKUP_DISTRACTORS['noun'] ?? []
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random())
    for (const item of shuffledPool) {
      addIfValid(item)
    }
  }

  // Priority 5: Generic emergency fallback
  if (selectedDistractors.length < 3) {
    const generic = ['Opción', 'Respuesta', 'Palabra', 'Término']
    for (const item of generic) {
      addIfValid(item)
    }
  }

  // 4. Assemble 4 options with distinct IDs and shuffle
  const options: QuizOption[] = [
    {
      id: `opt_correct_${currentWord.id}`,
      text: correctText,
      isCorrect: true,
    },
    ...selectedDistractors.slice(0, 3).map((text, idx) => ({
      id: `opt_distractor_${idx}_${currentWord.id}`,
      text,
      isCorrect: false,
    })),
  ]

  return options.sort(() => 0.5 - Math.random())
}
