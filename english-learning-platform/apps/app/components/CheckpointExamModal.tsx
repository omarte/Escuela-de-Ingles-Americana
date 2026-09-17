import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, typography, radius, Badge, Button } from '@elp/ui'
import type {
  CheckpointDefinition,
  ExamQuestion,
  QuestionAnswerRecord,
  VocabularyItem,
} from '@elp/types'
import { speakEnglish } from '../lib/audio'
import {
  generateCheckpointExam,
  evaluateExamAnswers,
} from '../lib/evaluationEngine'
import { useEvaluationStore } from '../stores/useEvaluationStore'
import { useAuthStore } from '../stores/useAuthStore'

interface CheckpointExamModalProps {
  visible: boolean
  checkpoint: CheckpointDefinition | null
  userCardsPool: readonly VocabularyItem[]
  onClose: () => void
  onPassed?: () => void
}

export function CheckpointExamModal({
  visible,
  checkpoint,
  userCardsPool,
  onClose,
  onPassed,
}: CheckpointExamModalProps): React.JSX.Element | null {
  const user = useAuthStore((state) => state.user)
  const recordAttempt = useEvaluationStore((state) => state.recordAttempt)

  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false)
  const [answers, setAnswers] = useState<QuestionAnswerRecord[]>([])
  const [isFinished, setIsFinished] = useState(false)
  const [examResult, setExamResult] = useState<ReturnType<typeof evaluateExamAnswers> | null>(null)
  const [certHash, setCertHash] = useState<string | null>(null)

  const questionStartTimeRef = useRef<number>(Date.now())
  const scaleAnim = useRef(new Animated.Value(1)).current

  // Inicializar preguntas del examen
  useEffect(() => {
    if (visible && checkpoint) {
      const generated = generateCheckpointExam(checkpoint, userCardsPool)
      setQuestions(generated)
      setCurrentIndex(0)
      setSelectedOptionIndex(null)
      setHasSubmittedAnswer(false)
      setAnswers([])
      setIsFinished(false)
      setExamResult(null)
      setCertHash(null)
      questionStartTimeRef.current = Date.now()
    }
  }, [visible, checkpoint, userCardsPool])

  const currentQuestion = questions[currentIndex]

  // Reproducir audio automáticamente en preguntas auditivas
  useEffect(() => {
    if (currentQuestion?.type === 'audio_meaning' && currentQuestion.audioText) {
      const t = setTimeout(() => {
        void speakEnglish(currentQuestion.audioText!)
      }, 300)
      return () => clearTimeout(t)
    }
    return undefined
  }, [currentIndex, currentQuestion])

  if (!visible || !checkpoint) return null

  const handleSelectOption = (index: number): void => {
    if (hasSubmittedAnswer || !currentQuestion) return

    const latencyMs = Math.max(100, Date.now() - questionStartTimeRef.current)
    const isCorrect = index === currentQuestion.correctOptionIndex
    const isFriction = latencyMs > 7000
    const isAutomated = latencyMs < 3000

    setSelectedOptionIndex(index)
    setHasSubmittedAnswer(true)

    const record: QuestionAnswerRecord = {
      questionId: currentQuestion.id,
      vocabularyItemId: currentQuestion.vocabularyItemId,
      selectedIndex: index,
      isCorrect,
      latencyMs,
      isFriction,
      isAutomated,
    }

    const nextAnswers = [...answers, record]
    setAnswers(nextAnswers)

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.03, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start()
  }

  const handleNext = async (): Promise<void> => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOptionIndex(null)
      setHasSubmittedAnswer(false)
      questionStartTimeRef.current = Date.now()
    } else {
      // Fin del examen
      const evaluation = evaluateExamAnswers(answers)
      setExamResult(evaluation)
      setIsFinished(true)

      const savedAttempt = await recordAttempt({
        checkpointId: checkpoint.id,
        userId: user?.id ?? 'demo-user',
        scorePercentage: evaluation.scorePercentage,
        totalQuestions: evaluation.totalQuestions,
        correctCount: evaluation.correctCount,
        passed: evaluation.passed,
        averageLatencyMs: evaluation.averageLatencyMs,
        fastAnswersCount: evaluation.fastAnswersCount,
        frictionCount: evaluation.frictionCount,
        completedAt: new Date().toISOString(),
        answers,
      })

      if (savedAttempt.certificateHash) {
        setCertHash(savedAttempt.certificateHash)
      }

      if (evaluation.passed && onPassed) {
        onPassed()
      }
    }
  }

  const handleCancel = (): void => {
    if (!isFinished && answers.length > 0) {
      Alert.alert(
        '¿Abandonar Evaluación?',
        'Si sales ahora, tu progreso en este examen no quedará registrado.',
        [
          { text: 'Continuar Examen', style: 'cancel' },
          { text: 'Salir', style: 'destructive', onPress: onClose },
        ]
      )
    } else {
      onClose()
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={handleCancel}>
      <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
        {/* Header Superior */}
        <View style={styles.examHeader}>
          <TouchableOpacity onPress={handleCancel} style={styles.exitButton} accessibilityLabel="Cerrar examen">
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {checkpoint.badgeEmoji} {checkpoint.title}
            </Text>
            <Text style={styles.headerCounter}>
              {isFinished ? 'Resultados' : `Pregunta ${currentIndex + 1} de ${questions.length}`}
            </Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        {/* Barra de progreso de preguntas */}
        {!isFinished && questions.length > 0 ? (
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((currentIndex + 1) / questions.length) * 100}%` },
              ]}
            />
          </View>
        ) : null}

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {!isFinished && currentQuestion ? (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              {/* Question Card */}
              <View style={styles.questionCard}>
                <View style={styles.questionTypeBadge}>
                  <Text style={styles.questionTypeBadgeText}>
                    {currentQuestion.type === 'cloze'
                      ? 'COMPLETA LA ORACIÓN (CLOZE)'
                      : currentQuestion.type === 'audio_meaning'
                        ? 'DISCRIMINACIÓN AUDITIVA'
                        : 'ASOCIACIÓN LÉXICA'}
                  </Text>
                </View>

                {currentQuestion.audioText ? (
                  <TouchableOpacity
                    style={styles.speakerBtn}
                    onPress={() => void speakEnglish(currentQuestion.audioText!)}
                    accessibilityRole="button"
                    accessibilityLabel="Escuchar pronunciación"
                  >
                    <Ionicons name="volume-high" size={20} color="#2563EB" />
                    <Text style={styles.speakerBtnText}>🔊 Escuchar palabra</Text>
                  </TouchableOpacity>
                ) : null}

                <Text style={styles.questionPromptText}>{currentQuestion.prompt}</Text>

                {currentQuestion.promptTranslation ? (
                  <Text style={styles.promptTranslationText}>
                    "{currentQuestion.promptTranslation}"
                  </Text>
                ) : null}
              </View>

              {/* Opciones Múltiples */}
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOptionIndex === idx
                  const isCorrectAnswer = idx === currentQuestion.correctOptionIndex
                  const showFeedback = hasSubmittedAnswer

                  let optionStyle = styles.optionBtn
                  let textStyle = styles.optionText
                  let badgeStyle = styles.optionBadge
                  let badgeTextStyle = styles.optionBadgeText

                  if (showFeedback) {
                    if (isCorrectAnswer) {
                      optionStyle = { ...optionStyle, ...styles.optionBtnCorrect }
                      textStyle = { ...textStyle, ...styles.optionTextCorrect }
                      badgeStyle = { ...badgeStyle, ...styles.optionBadgeCorrect }
                      badgeTextStyle = { ...badgeTextStyle, ...styles.optionBadgeTextCorrect }
                    } else if (isSelected) {
                      optionStyle = { ...optionStyle, ...styles.optionBtnWrong }
                      textStyle = { ...textStyle, ...styles.optionTextWrong }
                      badgeStyle = { ...badgeStyle, ...styles.optionBadgeWrong }
                      badgeTextStyle = { ...badgeTextStyle, ...styles.optionBadgeTextWrong }
                    }
                  } else if (isSelected) {
                    optionStyle = { ...optionStyle, ...styles.optionBtnSelected }
                  }

                  const letter = String.fromCharCode(65 + idx) // A, B, C, D

                  return (
                    <Pressable
                      key={idx}
                      disabled={hasSubmittedAnswer}
                      style={optionStyle}
                      onPress={() => handleSelectOption(idx)}
                    >
                      <View style={badgeStyle}>
                        <Text style={badgeTextStyle}>{letter}</Text>
                      </View>
                      <Text style={textStyle} numberOfLines={2}>
                        {option}
                      </Text>
                      {showFeedback && isCorrectAnswer ? (
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      ) : showFeedback && isSelected ? (
                        <Ionicons name="close-circle" size={20} color="#EF4444" />
                      ) : null}
                    </Pressable>
                  )
                })}
              </View>

              {/* Feedback y Explicación Pedagógica */}
              {hasSubmittedAnswer ? (
                <View style={styles.feedbackCard}>
                  <View style={styles.feedbackHeaderRow}>
                    <Ionicons
                      name={
                        selectedOptionIndex === currentQuestion.correctOptionIndex
                          ? 'checkmark-circle'
                          : 'alert-circle'
                      }
                      size={20}
                      color={
                        selectedOptionIndex === currentQuestion.correctOptionIndex
                          ? '#059669'
                          : '#DC2626'
                      }
                    />
                    <Text
                      style={[
                        styles.feedbackTitle,
                        selectedOptionIndex === currentQuestion.correctOptionIndex
                          ? { color: '#059669' }
                          : { color: '#DC2626' },
                      ]}
                    >
                      {selectedOptionIndex === currentQuestion.correctOptionIndex
                        ? '¡Excelente respuesta!'
                        : 'Atención a este término:'}
                    </Text>
                  </View>
                  <Text style={styles.feedbackExplanationText}>
                    {currentQuestion.explanation}
                  </Text>

                  <TouchableOpacity style={styles.nextQuestionBtn} onPress={handleNext}>
                    <Text style={styles.nextQuestionBtnText}>
                      {currentIndex + 1 < questions.length ? 'Siguiente Pregunta →' : 'Ver Resultados Finales 🏆'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </Animated.View>
          ) : isFinished && examResult ? (
            /* Pantalla de Resultados Finales */
            <View style={styles.resultsCard}>
              <View style={styles.resultIconWrap}>
                <Text style={styles.resultEmoji}>{examResult.passed ? '🏆' : '🎯'}</Text>
              </View>

              <Text style={styles.resultHeading}>
                {examResult.passed ? '¡Checkpoint Aprobado!' : 'Buen Entrenamiento'}
              </Text>
              <Text style={styles.resultSubheading}>
                {examResult.passed
                  ? `Has superado con éxito el ${checkpoint.title}`
                  : 'Para aprobar se requiere un mínimo del 80% de aciertos.'}
              </Text>

              {/* Métricas Principales */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricVal}>{examResult.scorePercentage}%</Text>
                  <Text style={styles.metricLabel}>Aciertos ({examResult.correctCount}/{examResult.totalQuestions})</Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={styles.metricVal}>
                    {(examResult.averageLatencyMs / 1000).toFixed(1)}s
                  </Text>
                  <Text style={styles.metricLabel}>Latencia Media</Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={[styles.metricVal, { color: '#059669' }]}>
                    {examResult.fastAnswersCount}
                  </Text>
                  <Text style={styles.metricLabel}>Respuestas Ágiles (&lt;3s)</Text>
                </View>
              </View>

              {/* Certificado Hash si aprobó */}
              {certHash ? (
                <View style={styles.certCodeBox}>
                  <Ionicons name="ribbon" size={20} color="#B45309" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.certCodeLabel}>CÓDIGO DE CREDENCIAL OFICIAL</Text>
                    <Text style={styles.certCodeValue}>{certHash}</Text>
                  </View>
                </View>
              ) : null}

              {/* Botones de acción final */}
              <View style={styles.resultActions}>
                {!examResult.passed ? (
                  <TouchableOpacity
                    style={styles.retryBtn}
                    onPress={() => {
                      const generated = generateCheckpointExam(checkpoint, userCardsPool)
                      setQuestions(generated)
                      setCurrentIndex(0)
                      setSelectedOptionIndex(null)
                      setHasSubmittedAnswer(false)
                      setAnswers([])
                      setIsFinished(false)
                      setExamResult(null)
                      questionStartTimeRef.current = Date.now()
                    }}
                  >
                    <Ionicons name="refresh" size={18} color="#FFFFFF" />
                    <Text style={styles.retryBtnText}>Reintentar Checkpoint</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                  <Text style={styles.closeBtnText}>Volver al Panel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalSafe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  examHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  exitButton: {
    padding: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: '#F1F5F9',
  },
  headerTitleWrap: {
    alignItems: 'center',
    flex: 1,
  },
  headerSubtitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
  },
  headerCounter: {
    fontSize: typography.sizes.xs - 1,
    color: '#64748B',
    marginTop: 1,
  },
  progressBarTrack: {
    height: 4,
    width: '100%',
    backgroundColor: '#E2E8F0',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  questionTypeBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginBottom: spacing.sm,
  },
  questionTypeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  speakerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    marginBottom: spacing.sm,
  },
  speakerBtnText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#1D4ED8',
  },
  questionPromptText: {
    fontSize: typography.sizes.md + 1,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 4,
  },
  promptTranslationText: {
    fontSize: typography.sizes.xs,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  optionBtnSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  optionBtnCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 2,
  },
  optionBtnWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  optionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  optionBadgeCorrect: {
    backgroundColor: '#10B981',
  },
  optionBadgeWrong: {
    backgroundColor: '#EF4444',
  },
  optionBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  optionBadgeTextCorrect: {
    color: '#FFFFFF',
  },
  optionBadgeTextWrong: {
    color: '#FFFFFF',
  },
  optionText: {
    flex: 1,
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.semibold,
    color: '#0F172A',
  },
  optionTextCorrect: {
    color: '#065F46',
    fontWeight: typography.weights.bold,
  },
  optionTextWrong: {
    color: '#991B1B',
  },
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
  },
  feedbackHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  feedbackTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  feedbackExplanationText: {
    fontSize: typography.sizes.xs + 1,
    color: '#475569',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  nextQuestionBtn: {
    backgroundColor: '#2563EB',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  nextQuestionBtnText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  // Results View
  resultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  resultIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  resultEmoji: {
    fontSize: 36,
  },
  resultHeading: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  resultSubheading: {
    fontSize: typography.sizes.sm,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: typography.weights.medium,
    marginTop: 2,
    textAlign: 'center',
  },
  certCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    width: '100%',
    marginBottom: spacing.lg,
  },
  certCodeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  certCodeValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: '#78350F',
    letterSpacing: 1,
  },
  resultActions: {
    width: '100%',
    gap: spacing.sm,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#D97706',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  closeBtnText: {
    color: '#64748B',
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.sm,
  },
})
