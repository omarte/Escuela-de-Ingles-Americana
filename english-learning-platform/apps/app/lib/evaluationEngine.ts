import type {
  CheckpointDefinition,
  CheckpointId,
  ExamQuestion,
  ExamQuestionType,
  QuestionAnswerRecord,
} from '@elp/types'
import { getVocabularyForWeek, contentRegistry } from '@elp/content'
import type { VocabularyItem } from '@elp/types'
import { shuffleArray } from './matchingCategories'

export const MILESTONE_CHECKPOINTS: readonly CheckpointDefinition[] = [
  // --- A1 CHECKPOINTS ---
  {
    id: 'a1_cp1',
    level: 'A1',
    title: 'Checkpoint 1: Primeros Pasos A1',
    subtitle: 'Vocabulario esencial, saludos, números y familia inmediata',
    requiredWords: 100,
    maxWeekScope: 3,
    badgeEmoji: '🥉',
    isGraduation: false,
  },
  {
    id: 'a1_cp2',
    level: 'A1',
    title: 'Checkpoint 2: Consolidación Básica',
    subtitle: 'Rutinas, colores, comida, cuerpo y entorno cotidiano',
    requiredWords: 500,
    maxWeekScope: 8,
    badgeEmoji: '🥈',
    isGraduation: false,
  },
  {
    id: 'a1_cp3',
    level: 'A1',
    title: 'Checkpoint 3: Autonomía Comunicativa',
    subtitle: 'Verbos clave, lugares, adjetivos y conectores simples',
    requiredWords: 1000,
    maxWeekScope: 14,
    badgeEmoji: '🥇',
    isGraduation: false,
  },
  {
    id: 'a1_cp4',
    level: 'A1',
    title: 'Examen de Graduación A1',
    subtitle: 'Evaluación integral de 1.512 palabras • Certificación oficial de nivel',
    requiredWords: 1512,
    maxWeekScope: 19,
    badgeEmoji: '🎓',
    isGraduation: true,
  },

  // --- A2 CHECKPOINTS ---
  {
    id: 'a2_cp1',
    level: 'A2',
    title: 'Checkpoint Mid-Term A2',
    subtitle: 'Expresiones intermedias, tiempos pasados y descripción social',
    requiredWords: 350,
    maxWeekScope: 8,
    badgeEmoji: '🥈',
    isGraduation: false,
  },
  {
    id: 'a2_cp2',
    level: 'A2',
    title: 'Examen de Graduación A2',
    subtitle: 'Certificación oficial de Plataforma Elemental (734 palabras curadas)',
    requiredWords: 734,
    maxWeekScope: 15,
    badgeEmoji: '🎓',
    isGraduation: true,
  },

  // --- B1 & B2 EXAMS ---
  {
    id: 'b1_grad',
    level: 'B1',
    title: 'Examen de Egreso B1',
    subtitle: 'Umbral intermedio: fluidez conversacional y comprensión compleja',
    requiredWords: 203,
    maxWeekScope: 6,
    badgeEmoji: '🏆',
    isGraduation: true,
  },
  {
    id: 'b2_grad',
    level: 'B2',
    title: 'Certificación de Maestría B2',
    subtitle: 'Fluidez profesional avanzada y registro formal',
    requiredWords: 111,
    maxWeekScope: 4,
    badgeEmoji: '👑',
    isGraduation: true,
  },
]

/**
 * Obtiene la definición de un checkpoint por su ID
 */
export function getCheckpointById(id: CheckpointId): CheckpointDefinition | undefined {
  return MILESTONE_CHECKPOINTS.find((cp) => cp.id === id)
}

/**
 * Obtiene el pool de vocabulario curado para un checkpoint específico
 */
export function getCheckpointVocabularyPool(
  checkpoint: CheckpointDefinition,
  userCardsPool: readonly VocabularyItem[] = []
): VocabularyItem[] {
  const pool: VocabularyItem[] = []

  // 1. Añadir vocabulario del currículo oficial para el nivel y semanas permitidas
  for (let w = 1; w <= checkpoint.maxWeekScope; w++) {
    const weekItems = getVocabularyForWeek(checkpoint.level, w)
    pool.push(...weekItems)
  }

  // 2. Si el usuario tiene tarjetas estudiadas en este nivel, priorizarlas
  if (userCardsPool.length > 0) {
    const matchingUserItems = userCardsPool.filter(
      (item) => item.level === checkpoint.level && item.week <= checkpoint.maxWeekScope
    )
    if (matchingUserItems.length >= 10) {
      return matchingUserItems
    }
  }

  return pool
}

/**
 * Genera un examen estructurado de 10 preguntas pedagógicas para el checkpoint
 */
export function generateCheckpointExam(
  checkpoint: CheckpointDefinition,
  userCardsPool: readonly VocabularyItem[] = []
): ExamQuestion[] {
  const pool = getCheckpointVocabularyPool(checkpoint, userCardsPool)
  if (pool.length === 0) return []

  // Seleccionar 10 palabras aleatorias representativas
  const selectedTargets = shuffleArray(pool).slice(0, 10)
  const questions: ExamQuestion[] = []

  selectedTargets.forEach((target, index) => {
    // Alternar tipos de reactivos para evaluar múltiples canales cognitivos
    // 0 = Cloze (si tiene ejemplo), 1 = Audio, 2 = Traducción directa
    const canDoCloze = Boolean(target.example && target.example.includes(target.word))
    let qType: ExamQuestionType = 'direct_translation'

    if (index % 3 === 0 && canDoCloze) {
      qType = 'cloze'
    } else if (index % 3 === 1 || (index % 3 === 0 && !canDoCloze)) {
      qType = 'audio_meaning'
    }

    // Generar 3 distractores del mismo partOfSpeech siempre que sea posible
    const samePosDistractors = pool.filter(
      (item) => item.id !== target.id && item.partOfSpeech === target.partOfSpeech
    )
    const fallbackDistractors = pool.filter((item) => item.id !== target.id)

    const distractorSource = samePosDistractors.length >= 3 ? samePosDistractors : fallbackDistractors
    const chosenDistractors = shuffleArray(distractorSource).slice(0, 3)

    if (qType === 'cloze' && target.example) {
      // Ejercicio Cloze
      const escaped = target.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`\\b${escaped}\\b`, 'i')
      const promptSentence = target.example.replace(regex, '______')

      const rawOptions = [target.word, ...chosenDistractors.map((d) => d.word)]
      const shuffledOptions = shuffleArray(rawOptions)
      const correctIdx = shuffledOptions.indexOf(target.word)

      questions.push({
        id: `q_${checkpoint.id}_${target.id}_${index}`,
        vocabularyItemId: target.id,
        type: 'cloze',
        prompt: promptSentence,
        promptTranslation: target.exampleTranslation,
        audioText: target.word,
        options: shuffledOptions,
        correctOptionIndex: correctIdx >= 0 ? correctIdx : 0,
        explanation: `"${target.word}" significa "${target.translation}". Ejemplo: ${target.example}`,
      })
    } else if (qType === 'audio_meaning') {
      // Ejercicio Auditivo
      const rawOptions = [target.translation, ...chosenDistractors.map((d) => d.translation)]
      const shuffledOptions = shuffleArray(rawOptions)
      const correctIdx = shuffledOptions.indexOf(target.translation)

      questions.push({
        id: `q_${checkpoint.id}_${target.id}_${index}`,
        vocabularyItemId: target.id,
        type: 'audio_meaning',
        prompt: '🔊 Escucha la pronunciación en inglés y selecciona el significado correcto:',
        audioText: target.word,
        options: shuffledOptions,
        correctOptionIndex: correctIdx >= 0 ? correctIdx : 0,
        explanation: `La palabra en inglés es "${target.word}" y significa "${target.translation}".`,
      })
    } else {
      // Traducción directa / Asociación léxica
      const rawOptions = [target.word, ...chosenDistractors.map((d) => d.word)]
      const shuffledOptions = shuffleArray(rawOptions)
      const correctIdx = shuffledOptions.indexOf(target.word)

      questions.push({
        id: `q_${checkpoint.id}_${target.id}_${index}`,
        vocabularyItemId: target.id,
        type: 'direct_translation',
        prompt: `¿Cómo se dice en inglés: "${target.translation}"?`,
        audioText: target.word,
        options: shuffledOptions,
        correctOptionIndex: correctIdx >= 0 ? correctIdx : 0,
        explanation: `"${target.translation}" se dice "${target.word}".`,
      })
    }
  })

  return questions
}

/**
 * Genera un código hash único institucional para diplomas y certificados
 */
export function generateCertificateHash(
  userId: string,
  checkpointId: CheckpointId,
  score: number,
  timestamp: string
): string {
  const seed = `${userId}:${checkpointId}:${score}:${timestamp}`
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const chr = seed.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  const hexPart = Math.abs(hash).toString(16).toUpperCase().padStart(6, '0').slice(-6)
  const cpSlug = checkpointId.toUpperCase().replace('_', '-')
  return `EIA-${cpSlug}-${hexPart}`
}

/**
 * Calcula métricas de latencia cognitiva y precisión a partir de respuestas
 */
export function evaluateExamAnswers(answers: readonly QuestionAnswerRecord[]): {
  scorePercentage: number
  correctCount: number
  totalQuestions: number
  passed: boolean
  averageLatencyMs: number
  fastAnswersCount: number
  frictionCount: number
} {
  const total = answers.length
  if (total === 0) {
    return {
      scorePercentage: 0,
      correctCount: 0,
      totalQuestions: 0,
      passed: false,
      averageLatencyMs: 0,
      fastAnswersCount: 0,
      frictionCount: 0,
    }
  }

  const correctCount = answers.filter((a) => a.isCorrect).length
  const scorePercentage = Math.round((correctCount / total) * 100)
  const passed = scorePercentage >= 80

  const totalLatency = answers.reduce((acc, a) => acc + a.latencyMs, 0)
  const averageLatencyMs = Math.round(totalLatency / total)

  const fastAnswersCount = answers.filter((a) => a.isAutomated).length
  const frictionCount = answers.filter((a) => a.isFriction).length

  return {
    scorePercentage,
    correctCount,
    totalQuestions: total,
    passed,
    averageLatencyMs,
    fastAnswersCount,
    frictionCount,
  }
}
