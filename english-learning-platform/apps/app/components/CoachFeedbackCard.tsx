import React, { useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { spacing, typography, radius } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import type { CEFRLevel, VocabularyItem } from '@elp/types'
import { getSpanishPhonetic } from '../lib/phonetics'
import { playDualReinforcement } from '../lib/audio'

export interface FrictionWordData {
  item: VocabularyItem
  lapses?: number
  userMistake?: string
}

export interface CoachFeedbackCardProps {
  level: CEFRLevel
  accuracy: number
  cardsReviewed: number
  frictionWords?: readonly FrictionWordData[]
  streak?: number
  avgLatencyMs?: number
  onApplyAdvice?: () => void
}

/**
 * Matriz de 5 variantes dinámicas de análisis pedagógico por nivel (A1 - B2)
 * Basada en métricas reales de precisión, racha y velocidad cognitiva.
 */
interface PedagogicalMessageTemplate {
  quote: string
  strengthHighlight: string
  krashenPrinciple: string
}

const LEVEL_FEEDBACK_MATRIX: Partial<
  Record<
    CEFRLevel,
    {
      highAccuracy: PedagogicalMessageTemplate[] // >= 85%
      moderateAccuracy: PedagogicalMessageTemplate[] // 65% - 84%
      needsReinforcement: PedagogicalMessageTemplate[] // < 65%
    }
  >
> = {
  A1: {
    highAccuracy: [
      {
        quote:
          'Tu oído está reconociendo los sonidos base del inglés sin dudar. Estás automatizando el puente entre la palabra hablada y su significado.',
        strengthHighlight: 'Discriminación auditiva inmediata en vocabulario esencial y objetos cotidianos.',
        krashenPrinciple: 'Input Comprensible: Tu cerebro absorbe las estructuras básicas sin traducir palabra por palabra.',
      },
      {
        quote:
          'Excelente velocidad de respuesta. Cada acierto refuerza las conexiones neuronales que te permitirán hablar con naturalidad.',
        strengthHighlight: 'Fijación de patrones ortográficos cortos y fonemas vocálicos básicos.',
        krashenPrinciple: 'Filtro Afectivo Bajo: La confianza en palabras conocidas acelera la adquisición de vocabulario nuevo.',
      },
      {
        quote:
          'Precisión sobresaliente. Has consolidado el bloque léxico fundamental para construir tus primeras oraciones.',
        strengthHighlight: 'Retención de sustantivos y verbos de alta frecuencia sin fricción.',
        krashenPrinciple: 'Adquisición Natural: Escuchar antes de producir garantiza una pronunciación limpia desde el inicio.',
      },
      {
        quote:
          'Gran agilidad mental. El tiempo de respuesta demuestra que no estás traduciendo mentalmente en español.',
        strengthHighlight: 'Reconocimiento instantáneo de vocabulario de uso diario.',
        krashenPrinciple: 'Monitoreo Eficiente: Menos pausa mental significa mayor fluidez en conversaciones reales.',
      },
      {
        quote:
          'Sesión impecable. Estás fijando las bases fonéticas indispensables para todo el nivel principiante.',
        strengthHighlight: 'Memoria auditiva estable en términos de tiempo, familia y entorno.',
        krashenPrinciple: 'Orden Natural: El vocabulario base se interioriza primero para dar paso a la gramática espontánea.',
      },
    ],
    moderateAccuracy: [
      {
        quote:
          'Buen progreso. Tu cerebro está procesando nuevos sonidos; es natural que ciertas consonantes mudas requieran una segunda pasada.',
        strengthHighlight: 'Comprensión global de las palabras principales de la lección.',
        krashenPrinciple: 'Hipótesis i+1: El reto justo por encima de tu nivel actual es el que genera nuevo aprendizaje.',
      },
      {
        quote:
          'Vas por buen camino. Enfócate en las terminaciones y en el sonido de las vocales en las palabras marcadas.',
        strengthHighlight: 'Identificación correcta de significados centrales.',
        krashenPrinciple: 'Noticing Hypothesis: Identificar dónde fallaste es el primer paso para fijar la forma correcta.',
      },
      {
        quote:
          'Constancia sólida. Las palabras que presentaron dudas hoy serán las más fáciles en el repaso de mañana.',
        strengthHighlight: 'Asociación auditiva-visual en la mayoría de los reactivos.',
        krashenPrinciple: 'Efecto de Espaciado (SRS): La memoria a largo plazo se construye superando pequeños lapsos.',
      },
      {
        quote:
          'Sesión de ajuste. Tu oído ya discrimina el 75% de las palabras; con un breve repaso cerraremos las brechas.',
        strengthHighlight: 'Detección rápida de opciones correctas en vocabulario frecuente.',
        krashenPrinciple: 'Interlenguaje: Los errores temporales son evidencia de que tu sistema lingüístico se está calibrando.',
      },
      {
        quote:
          'Buen esfuerzo. Presta atención a las diferencias sutiles de escritura en palabras de 4 o más letras.',
        strengthHighlight: 'Reconocimiento visual inmediato en la primera mitad del ejercicio.',
        krashenPrinciple: 'Procesamiento de Forma y Significado: Vincular la ortografía con el audio previene vicios.',
      },
    ],
    needsReinforcement: [
      {
        quote:
          'Esta lección introdujo términos con patrones ortográficos nuevos. Conviene escuchar el audio 2 veces antes de responder.',
        strengthHighlight: 'Comprensión inicial de la estructura general de la lección.',
        krashenPrinciple: 'Comprensión Previa: El oído necesita familiarizarse con el sonido antes de exigir velocidad.',
      },
      {
        quote:
          'No te preocupes por los fallos: indican exactamente qué términos necesitan refuerzo antes de avanzar.',
        strengthHighlight: 'Diagnóstico claro de las palabras que requieren repetición espaciada.',
        krashenPrinciple: 'Zona de Desarrollo Próximo: Desglosar la lección en bloques de 5 palabras maximiza la retención.',
      },
    ],
  },
  A2: {
    highAccuracy: [
      {
        quote:
          'Tu capacidad para procesar frases y vocabulario descriptivo está en un nivel muy alto. Transición fluida hacia A2 consolidado.',
        strengthHighlight: 'Dominio de conectores, adjetivos y verbos en contexto temporal.',
        krashenPrinciple: 'Consolidación Estructural: Tu mente ya no procesa palabras aisladas, sino unidades de significado.',
      },
      {
        quote:
          'Gran agilidad léxica. Estás identificando modismos y colocaciones simples con precisión nativa.',
        strengthHighlight: 'Discriminación de preposiciones y verbos de acción cotidiana.',
        krashenPrinciple: 'Automatización: Menos esfuerzo cognitivo en vocabulario libera espacio para la gramática.',
      },
      {
        quote:
          'Excelente desempeño. Las estructuras de rutina, profesiones y lugares quedan grabadas en tu memoria activa.',
        strengthHighlight: 'Velocidad de procesamiento superior al promedio del nivel A2.',
        krashenPrinciple: 'Input Enriquecido: La exposición variada previene la fosilización de errores.',
      },
      {
        quote:
          'Puntuación sobresaliente. Tu banco de vocabulario activo te permitirá formar párrafos completos con naturalidad.',
        strengthHighlight: 'Ortografía exacta en palabras con combinaciones vocálicas compuestas.',
        krashenPrinciple: 'Producción Temprana: Con este vocabulario puedes participar en diálogos cotidianos.',
      },
      {
        quote:
          'Precisión impecable. Has superado distractores gramaticales sin dudar en el significado real.',
        strengthHighlight: 'Comprensión contextual en situaciones de compras, viajes y descripciones.',
        krashenPrinciple: 'Fijación Mnemotécnica: Las asociaciones semánticas directas garantizan retención duradera.',
      },
    ],
    moderateAccuracy: [
      {
        quote:
          'Buen rendimiento. Presta especial atención a los pares mínimos y preposiciones de lugar que suelen generar confusión.',
        strengthHighlight: 'Buen agarre del vocabulario principal de la unidad.',
        krashenPrinciple: 'Hipótesis de Salience: Destacar los detalles gramaticales difíciles acelera su asimilación.',
      },
      {
        quote:
          'Progreso constante. En A2 el reto es diferenciar palabras similares; repasar los puntos marcados afinará tu puntería.',
        strengthHighlight: 'Capacidad de respuesta rápida en términos concretos.',
        krashenPrinciple: 'Ajuste de Precisión: La práctica deliberada en palabras dudosas evita confusiones futuras.',
      },
      {
        quote:
          'Sesión productiva. Has asimilado la mayoría de los conceptos; ajustemos los verbos irregulares para alcanzar el 100%.',
        strengthHighlight: 'Retención de vocabulario funcional de la semana.',
        krashenPrinciple: 'Repetición Espaciada Inteligente: Los términos con fricción vuelven automáticamente al intervalo óptimo.',
      },
      {
        quote:
          'Buen avance. Observa cómo cambia la pronunciación cuando una palabra funciona como verbo vs sustantivo.',
        strengthHighlight: 'Interpretación correcta del contexto general de la sesión.',
        krashenPrinciple: 'Categorización Léxica: Entender la función de cada palabra fortalece la sintaxis.',
      },
      {
        quote:
          'Práctica sólida. Te recomendamos pronunciar en voz alta las palabras con combinaciones como "th", "sh" y "ch".',
        strengthHighlight: 'Acierto consistente en palabras de raíz conocida.',
        krashenPrinciple: 'Refuerzo Motor: La articulación vocal refuerza la memoria auditiva en el córtex cerebral.',
      },
    ],
    needsReinforcement: [
      {
        quote:
          'Nivel A2 exige mayor diferenciación entre términos parecidos. Tómate un segundo extra para analizar la raíz.',
        strengthHighlight: 'Identificación de conceptos clave.',
        krashenPrinciple: 'Andamiaje Pedagógico: Reforzar el vocabulario A1 previo facilita absorber el bloque A2.',
      },
      {
        quote:
          'Sesión de diagnóstico. Repasar las palabras marcadas con fricción te dará la base firme que necesitas para avanzar.',
        strengthHighlight: 'Detección de los puntos exactos a calibrar.',
        krashenPrinciple: 'Micro-pasos de Aprendizaje: La maestría se logra consolidando pequeñas unidades.',
      },
    ],
  },
  B1: {
    highAccuracy: [
      {
        quote:
          'Sesión de nivel intermedio ejecutada con maestría. Tu procesamiento en inglés es fluido y contextual.',
        strengthHighlight: 'Comprensión de phrasal verbs, expresiones idiomáticas y registros estándar.',
        krashenPrinciple: 'Pensamiento Directo en Inglés: Tu mente ya no requiere traducción bidireccional.',
      },
      {
        quote:
          'Gran dominio de matices abstractos. Diferencias sin problemas entre sinónimos cercanos y términos formales.',
        strengthHighlight: 'Precisión léxica en contextos laborales, sociales y académicos.',
        krashenPrinciple: 'Adquisición de Segundo Orden: El vocabulario se aprende por contexto e inferencia directa.',
      },
      {
        quote:
          'Excelente velocidad de inferencia. Captas la connotación de cada palabra dentro del texto.',
        strengthHighlight: 'Resolución de reactivos complejos con mínimo tiempo de vacilación.',
        krashenPrinciple: 'Competencia Estratégica: Capacidad de inferir significado por contexto global.',
      },
      {
        quote:
          'Rendimiento sobresaliente. Tu léxico B1 está listo para sostener debates y argumentaciones claras.',
        strengthHighlight: 'Uso de conectores discursivos y vocabulario de causa-efecto.',
        krashenPrinciple: 'Fluidez Operativa: El vocabulario pasivo se transforma exitosamente en vocabulario activo.',
      },
      {
        quote:
          'Precisión impecable en estructuras intermedias. Has superado trampas léxicas sofisticadas.',
        strengthHighlight: 'Dominio de colocaciones naturales y modismos frecuentes.',
        krashenPrinciple: 'Sensibilidad Estilística: Reconocimiento natural de lo que "suena bien" en inglés.',
      },
    ],
    moderateAccuracy: [
      {
        quote:
          'Buen trabajo en un bloque exigente. El nivel B1 requiere distinguir matices entre sinónimos; revisa los tips fonéticos.',
        strengthHighlight: 'Comprensión de la idea central y de la mayoría de términos especializados.',
        krashenPrinciple: 'Ampliación de Registro: Diferenciar registros formales de informales toma práctica constante.',
      },
      {
        quote:
          'Buen análisis. Atención a los Phrasal Verbs con múltiples significados según la preposición acompañante.',
        strengthHighlight: 'Identificación rápida de sustantivos abstractos y adjetivos.',
        krashenPrinciple: 'Colocaciones: Aprender verbos compuestos como bloques integrados acelera la retención.',
      },
      {
        quote:
          'Sesión valiosa. Tu base B1 está creciendo; los errores de hoy son el combustible para el dominio de mañana.',
        strengthHighlight: 'Resolución acertada en la mayoría de preguntas de contexto.',
        krashenPrinciple: 'Hipótesis del Output Comprensible: Probar hipótesis léxicas afina tu criterio lingüístico.',
      },
      {
        quote:
          'Buen esfuerzo. Revisa las palabras con sufijos derivados (-ment, -tion, -ness) para deducir familias de palabras.',
        strengthHighlight: 'Agilidad en vocabulario temático de actualidad y trabajo.',
        krashenPrinciple: 'Morfología Léxica: Dominar prefijos y sufijos multiplica tu vocabulario por 4.',
      },
      {
        quote:
          'Progreso constante. Enfoca tu repaso en los términos donde hubo más de 4 segundos de latencia.',
        strengthHighlight: 'Excelente detección del sentido global en oraciones compuestas.',
        krashenPrinciple: 'Latencia Cognitiva: Reducir el tiempo de recuperación consolida la memoria de trabajo.',
      },
    ],
    needsReinforcement: [
      {
        quote:
          'El nivel B1 presenta conceptos abstractos más densos. Divide la sesión en dos repasos cortos para maximizar retención.',
        strengthHighlight: 'Asimilación de términos clave de la unidad.',
        krashenPrinciple: 'Carga Cognitiva Controlada: Pequeñas dosis espaciadas superan a las sesiones maratónicas.',
      },
      {
        quote:
          'Diagnóstico claro: los Phrasal Verbs y colocaciones abstractas requieren fijación auditiva previa.',
        strengthHighlight: 'Detección exacta de áreas de oportunidad.',
        krashenPrinciple: 'Consolidación Intermedia: Los cimientos se aseguran revisando ejemplos en contexto real.',
      },
    ],
  },
  B2: {
    highAccuracy: [
      {
        quote:
          'Dominio profesional avanzado. Tu capacidad para seleccionar el término exacto con el matiz adecuado es sobresaliente.',
        strengthHighlight: 'Léxico académico, corporativo y colocaciones idiomáticas nativas.',
        krashenPrinciple: 'Competencia Pragmática Plena: Comunicación precisa, persuasiva y sin esfuerzo mental.',
      },
      {
        quote:
          'Sesión de nivel C1 preliminar. Demuestras control sobre vocabulario técnico y sutilezas semánticas complejas.',
        strengthHighlight: 'Resolución de términos con alto grado de abstracción y especificidad.',
        krashenPrinciple: 'Input Auténtico Avanzado: Tu comprensión auditiva y lectora iguala el estándar profesional internacional.',
      },
      {
        quote:
          'Excelente agudeza lingüística. Identificas connotaciones formales vs coloquiales con absoluta naturalidad.',
        strengthHighlight: 'Manejo impecable de estructuras idiomáticas de nivel avanzado.',
        krashenPrinciple: 'Maestría Léxica: El vocabulario especializado se integra directamente a tu repertorio activo.',
      },
      {
        quote:
          'Puntuación perfecta en un set desafiante. Tu precisión verbal está lista para certificaciones TOEFL / IELTS.',
        strengthHighlight: 'Uso de conectores lógicos avanzados y terminología especializada.',
        krashenPrinciple: 'Autonomía Lingüística: Eres capaz de autoevaluar y corregir cualquier desviación sutil.',
      },
      {
        quote:
          'Rendimiento de élite. Tu agilidad para procesar textos técnicos y formales refleja un entrenamiento disciplinado.',
        strengthHighlight: 'Retención de colocaciones complejas y expresiones de registro alto.',
        krashenPrinciple: 'Fijación Permanente: Has alcanzado el umbral donde el idioma se convierte en una herramienta natural.',
      },
    ],
    moderateAccuracy: [
      {
        quote:
          'Buen desempeño en vocabulario de alta complejidad. Los matices entre sinónimos formales son el último escalón hacia C1.',
        strengthHighlight: 'Comprensión de terminología abstracta y técnica.',
        krashenPrinciple: 'Refinamiento Estilístico: Afinar la precisión léxica distingue a un hablante avanzado.',
      },
      {
        quote:
          'Sesión exigente y muy productiva. Presta atención a las colocaciones fijas donde ciertas palabras solo combinan con un verbo.',
        strengthHighlight: 'Identificación de conceptos avanzados en contexto profesional.',
        krashenPrinciple: 'Patrones Colocacionales: En B2, las palabras se aprenden en bloques de colocación fija.',
      },
      {
        quote:
          'Gran avance. El nivel B2 desafía la intuición lingüística; tus aciertos superan ampliamente la media.',
        strengthHighlight: 'Manejo de vocabulario analítico y descriptivo avanzado.',
        krashenPrinciple: 'Inmersión Cognitiva: Analizar la raíz etimológica facilita la memorización de términos cultos.',
      },
      {
        quote:
          'Buen análisis crítico. Revisa los términos marcados para asegurar su uso correcto en composiciones escritas.',
        strengthHighlight: 'Capacidad de discernir entre opciones con distractores semánticos sutiles.',
        krashenPrinciple: 'Calibración de Registro: Dominar el registro formal abre puertas profesionales globales.',
      },
      {
        quote:
          'Constancia de alto nivel. Las palabras dudosas de hoy serán tu ventaja competitiva en tu próxima reunión o examen.',
        strengthHighlight: 'Resolución de reactivos de alta densidad léxica.',
        krashenPrinciple: 'Consolidación B2: Cada término perfeccionado amplía tu capacidad de argumentación.',
      },
    ],
    needsReinforcement: [
      {
        quote:
          'El nivel B2 introduce vocabulario denso con múltiples acepciones. Conviene revisar los ejemplos en oraciones completas.',
        strengthHighlight: 'Comprensión general de textos complejos.',
        krashenPrinciple: 'Contextualización Profunda: Las palabras avanzadas se fijan mejor leyendo su uso en textos reales.',
      },
      {
        quote:
          'Diagnóstico de precisión: identificar las colocaciones con preposición te permitirá dominar este bloque.',
        strengthHighlight: 'Detección de áreas específicas para certificación.',
        krashenPrinciple: 'Andamiaje Superior: El repaso focalizado garantiza que ningún detalle quede al azar.',
      },
    ],
  },
}

export function CoachFeedbackCard({
  level,
  accuracy,
  cardsReviewed,
  frictionWords = [],
  streak = 1,
  onApplyAdvice,
}: CoachFeedbackCardProps): React.JSX.Element {
  // Selección rotativa determinística de la plantilla según el día y nivel
  const template = useMemo(() => {
    const levelMatrix = LEVEL_FEEDBACK_MATRIX[level] || LEVEL_FEEDBACK_MATRIX.A1!
    const pool =
      accuracy >= 85
        ? levelMatrix.highAccuracy
        : accuracy >= 65
          ? levelMatrix.moderateAccuracy
          : levelMatrix.needsReinforcement

    const daySeed = new Date().getDate() + new Date().getMonth() * 31 + cardsReviewed
    const index = daySeed % pool.length
    return pool[index] || pool[0]!
  }, [level, accuracy, cardsReviewed])

  const topFriction = useMemo(() => {
    return frictionWords.slice(0, 2)
  }, [frictionWords])

  return (
    <View style={styles.cardContainer}>
      {/* Header Institucional de Diagnóstico */}
      <View style={styles.headerRow}>
        <View style={styles.analyticsIconCircle}>
          <Ionicons name="analytics" size={18} color="#059669" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTag}>ANÁLISIS PEDAGÓGICO</Text>
          <Text style={styles.headerSub}>
            Nivel {level} • Escuela de Inglés Americana
          </Text>
        </View>
        {streak > 1 ? (
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={12} color="#D97706" />
            <Text style={styles.streakText}>{streak} días</Text>
          </View>
        ) : null}
      </View>

      {/* Cita de Diagnóstico Dinámica */}
      <View style={styles.quoteWrapper}>
        <Text style={styles.quoteText}>"{template.quote}"</Text>
      </View>

      {/* 🌟 LO QUE DOMINASTE HOY */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="checkmark-done-circle" size={16} color="#059669" />
          <Text style={styles.sectionTitleGreen}>LO QUE DOMINASTE HOY</Text>
        </View>
        <Text style={styles.sectionContentText}>{template.strengthHighlight}</Text>
      </View>

      {/* 🎯 PUNTOS DE REFUERZO PRIORITARIO (Si hubo palabras con fricción) */}
      {topFriction.length > 0 ? (
        <View style={styles.frictionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="bulb" size={16} color="#D97706" />
            <Text style={styles.sectionTitleAmber}>PUNTOS DE REFUERZO PRIORITARIO</Text>
          </View>

          {topFriction.map((fw, idx) => {
            const word = fw.item.word
            const translation = fw.item.translation
            const phonetic = getSpanishPhonetic(word)

            return (
              <View key={`${word}-${idx}`} style={styles.frictionItemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.frictionWordName}>
                    {word}{' '}
                    <Text style={styles.frictionPhonetic}>[ {phonetic} ]</Text>
                    <Text style={styles.frictionTranslation}> → {translation}</Text>
                  </Text>
                  <Text style={styles.frictionTipText}>
                    💡 Consejo: Escucha el audio y pronuncia en voz alta para fijar su memoria motora.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.speakerBtn}
                  onPress={() => {
                    void playDualReinforcement(word, translation, true, 1800)
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Escuchar pronunciación de ${word}`}
                >
                  <Ionicons name="volume-high" size={16} color="#059669" />
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
      ) : (
        <View style={styles.masteryBlock}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="shield-checkmark" size={16} color="#059669" />
            <Text style={styles.sectionTitleGreen}>RETENCIÓN TOTAL</Text>
          </View>
          <Text style={styles.sectionContentText}>
            Sin palabras con fricción en esta sesión. Tu tasa de retención es del 100%.
          </Text>
        </View>
      )}

      {/* 🧠 Principio de Neuroaprendizaje (Krashen i+1) */}
      <View style={styles.krashenBox}>
        <Ionicons name="school-outline" size={16} color="#4F46E5" style={{ marginTop: 1 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.krashenTitle}>Principio de Neuroaprendizaje (i+1):</Text>
          <Text style={styles.krashenText}>{template.krashenPrinciple}</Text>
        </View>
      </View>

      {/* CTA: Aplicar recomendación */}
      {onApplyAdvice ? (
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={onApplyAdvice}
          accessibilityRole="button"
          accessibilityLabel="Aplicar recomendación en la próxima sesión"
        >
          <Text style={styles.applyBtnText}>Aplicar recomendación en próxima sesión →</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  analyticsIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  streakText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  quoteWrapper: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    borderLeftWidth: 3.5,
    borderLeftColor: '#059669',
    marginBottom: spacing.sm + 2,
  },
  quoteText: {
    fontSize: 13,
    color: '#1E293B',
    fontStyle: 'italic',
    lineHeight: 19,
    fontWeight: '500',
  },
  sectionBlock: {
    backgroundColor: '#F0FDF4',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  masteryBlock: {
    backgroundColor: '#F0FDF4',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  sectionTitleGreen: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5,
  },
  sectionTitleAmber: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  sectionContentText: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
  },
  frictionBlock: {
    backgroundColor: '#FFFBEB',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  frictionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.sm,
    padding: spacing.xs + 3,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  frictionWordName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  frictionPhonetic: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  frictionTranslation: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '400',
  },
  frictionTipText: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 2,
    lineHeight: 15,
  },
  speakerBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  krashenBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  krashenTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4338CA',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  krashenText: {
    fontSize: 11,
    color: '#3730A3',
    lineHeight: 16,
    marginTop: 1,
  },
  applyBtn: {
    backgroundColor: '#059669',
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
})
