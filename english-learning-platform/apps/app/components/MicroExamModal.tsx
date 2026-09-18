import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, typography, radius } from '@elp/ui'
import { getVocabularyById, getVocabularyForWeek } from '@elp/content'
import type { CEFRLevel, PartOfSpeech } from '@elp/types'
import { speakEnglish, playDualReinforcement } from '../lib/audio'

interface MicroExamModalProps {
  visible: boolean
  /** Array of vocabularyItemIds for the sequence of micro-challenges */
  vocabularyItemIds?: string[]
  /** Legacy single vocabularyItemId */
  vocabularyItemId?: string
  /** CEFR level of the session (used to pull distractors from same level/week) */
  level: CEFRLevel
  /** The highest week number the user has studied (for distractor pool scope) */
  maxWeek: number
  /** Called when the user finishes or skips the micro-exam sequence */
  onComplete: () => void
}

const PART_OF_SPEECH_HINTS: Record<PartOfSpeech, string> = {
  noun: 'Sustantivo (persona, objeto o concepto)',
  verb: 'Verbo (acción, estado o proceso)',
  adjective: 'Adjetivo (cualidad o característica)',
  adverb: 'Adverbio (modo, tiempo o intensidad)',
  pronoun: 'Pronombre (sujeto o referencia)',
  preposition: 'Preposición (relación espacial o temporal)',
  conjunction: 'Conjunción (conector gramatical)',
  interjection: 'Expresión común o exclamación',
  determiner: 'Determinante o artículo',
  phrase: 'Frase o locución idiomática',
}

/**
 * MicroExamModal — Contextual Cloze micro-exam sequence with progressive scaffolding.
 *
 * Pedagogical features:
 * - 3 micro-challenges per 5 words reviewed.
 * - Cognitive difficulty: hint hidden by default.
 * - Progressive 3-level hint system (Grammar -> Translation).
 * - High-contrast visual blank highlight.
 * - Full sentence audio playback.
 * - Comprehensive post-answer feedback with sentence meaning.
 */
export function MicroExamModal({
  visible,
  vocabularyItemIds,
  vocabularyItemId,
  level,
  maxWeek,
  onComplete,
}: MicroExamModalProps): React.JSX.Element | null {
  const itemIds = useMemo(() => {
    if (vocabularyItemIds && vocabularyItemIds.length > 0) {
      return vocabularyItemIds
    }
    if (vocabularyItemId) {
      return [vocabularyItemId]
    }
    return []
  }, [vocabularyItemIds, vocabularyItemId])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [hintLevel, setHintLevel] = useState(0) // 0: hidden, 1: grammatical, 2: translation

  // Tactile feedback animations
  const shakeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current

  // Reset state whenever the modal opens
  useEffect(() => {
    if (visible) {
      setCurrentIndex(0)
      setSelectedId(null)
      setHasAnswered(false)
      setHintLevel(0)
    }
  }, [visible])

  // Reset question-specific state on card change
  useEffect(() => {
    setSelectedId(null)
    setHasAnswered(false)
    setHintLevel(0)
  }, [currentIndex])

  const totalCount = itemIds.length
  const currentVocabId = itemIds[currentIndex] ?? ''
  const targetItem = getVocabularyById(currentVocabId)

  // Build the Cloze sentence: replace the target word with ______
  const clozeParts = useMemo(() => {
    if (!targetItem?.example) return null
    const word = targetItem.word
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'i')
    const parts = targetItem.example.split(regex)
    return {
      before: parts[0] ?? '',
      after: parts.slice(2).join('') || (parts[2] ?? ''),
      full: targetItem.example,
    }
  }, [targetItem])

  // Build distractor pool: same level, weeks 1..maxWeek, same partOfSpeech
  const distractors = useMemo(() => {
    if (!targetItem) return []

    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 0)
    const dayOfYear = Math.floor(
      (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
    )
    const seedBase =
      currentVocabId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + dayOfYear + currentIndex

    // Collect same partOfSpeech words from all weeks up to maxWeek
    const pool: { id: string; word: string }[] = []
    for (let w = 1; w <= maxWeek; w++) {
      const weekVocab = getVocabularyForWeek(level, w)
      for (const item of weekVocab) {
        if (item.id !== targetItem.id && item.partOfSpeech === targetItem.partOfSpeech) {
          pool.push({ id: item.id, word: item.word })
        }
      }
    }

    // Fallback if not enough words with same partOfSpeech
    if (pool.length < 2) {
      for (let w = 1; w <= maxWeek; w++) {
        const weekVocab = getVocabularyForWeek(level, w)
        for (const item of weekVocab) {
          if (item.id !== targetItem.id) {
            pool.push({ id: item.id, word: item.word })
          }
        }
      }
    }

    if (pool.length < 2) return []

    // Seeded Fisher-Yates shuffle
    const shuffled = [...pool]
    let seed = seedBase
    const lcg = (): number => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff
      return Math.abs(seed) / 0xffffffff
    }
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(lcg() * (i + 1))
      const itemI = shuffled[i]
      const itemJ = shuffled[j]
      if (itemI && itemJ) {
        shuffled[i] = itemJ
        shuffled[j] = itemI
      }
    }
    return shuffled.slice(0, 2)
  }, [targetItem, level, maxWeek, currentVocabId, currentIndex])

  // Build final options (correct + 2 distractors)
  const options = useMemo(() => {
    if (!targetItem || distractors.length < 2) return []
    const d0 = distractors[0]
    const d1 = distractors[1]
    if (!d0 || !d1) return []
    const allOptions = [
      { id: `correct_${targetItem.id}`, word: targetItem.word, isCorrect: true },
      { id: `dist_${d0.id}`, word: d0.word, isCorrect: false },
      { id: `dist_${d1.id}`, word: d1.word, isCorrect: false },
    ]
    return allOptions.sort((a, b) => a.id.localeCompare(b.id))
  }, [targetItem, distractors])

  const handleSelect = useCallback(
    (optionId: string) => {
      if (hasAnswered || !targetItem) return
      setSelectedId(optionId)
      setHasAnswered(true)

      const selected = options.find((o) => o.id === optionId)
      const isCorrect = selected?.isCorrect ?? false

      if (isCorrect) {
        // Success celebration scale pulse
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.05, duration: 140, useNativeDriver: true }),
          Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
        ]).start()
        void speakEnglish(targetItem.word)
      } else {
        // Error shake
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -5, duration: 40, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 5, duration: 40, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
        ]).start()
        playDualReinforcement(targetItem.word, targetItem.translation, false, 1800)
      }
    },
    [hasAnswered, options, targetItem, scaleAnim, shakeAnim],
  )

  const handleNext = useCallback(() => {
    if (currentIndex + 1 < totalCount) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      onComplete()
    }
  }, [currentIndex, totalCount, onComplete])

  const handleHint = useCallback(() => {
    if (hintLevel < 2) {
      setHintLevel((lvl) => lvl + 1)
    }
  }, [hintLevel])

  const handlePlaySentenceAudio = useCallback(() => {
    if (targetItem?.example) {
      void speakEnglish(targetItem.example)
    } else if (targetItem?.word) {
      void speakEnglish(targetItem.word)
    }
  }, [targetItem])

  // Guards: handle invalid state gracefully
  if (totalCount === 0) {
    if (visible) onComplete()
    return null
  }

  if (!targetItem || !clozeParts || options.length < 3) {
    if (visible) {
      if (currentIndex + 1 < totalCount) {
        setCurrentIndex((prev) => prev + 1)
      } else {
        onComplete()
      }
    }
    return null
  }

  const correctOption = options.find((o) => o.isCorrect)
  const isCorrect = selectedId ? options.find((o) => o.id === selectedId)?.isCorrect : false
  const isLastQuestion = currentIndex + 1 >= totalCount

  // Dynamic hint resolution
  const hintText =
    hintLevel === 1
      ? `💡 Pista gramatical: ${PART_OF_SPEECH_HINTS[targetItem.partOfSpeech] ?? targetItem.partOfSpeech}`
      : hintLevel === 2
        ? `💡 Traducción contextual: "${targetItem.translation}"`
        : null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleNext}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
            },
          ]}
        >
          {/* HEADER: Brain Icon + Title */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="brain-outline" size={28} color="#059669" />
            </View>
            <Text style={styles.title}>Micro-reto</Text>
            <Text style={styles.subtitle}>Completa la oración con la palabra correcta</Text>
          </View>

          {/* PROGRESS BAR */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((currentIndex + 1) / totalCount) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentIndex + 1} de {totalCount}
            </Text>
          </View>

          {/* ORACIÓN CON ESPACIO EN BLANCO DESTACADO */}
          <View style={styles.sentenceContainer}>
            <Text style={styles.sentence}>
              <Text>{clozeParts.before}</Text>
              <Text style={styles.blank}>
                {hasAnswered ? ` ${correctOption?.word ?? targetItem.word} ` : ' ______ '}
              </Text>
              <Text>{clozeParts.after}</Text>
            </Text>

            {/* Audio Button */}
            <TouchableOpacity
              onPress={handlePlaySentenceAudio}
              style={styles.audioButton}
              accessibilityRole="button"
              accessibilityLabel="Escuchar oración completa"
              activeOpacity={0.7}
            >
              <Ionicons name="volume-high" size={20} color="#059669" />
            </TouchableOpacity>
          </View>

          {/* PISTA PROGRESIVA (Nivel 1 o Nivel 2) */}
          {hintText && !hasAnswered ? (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>{hintText}</Text>
            </View>
          ) : null}

          {/* OPCIONES DE RESPUESTA */}
          <View style={styles.optionsContainer}>
            {options.map((opt) => {
              const isSelected = selectedId === opt.id
              const isRight = isSelected && opt.isCorrect
              const isWrong = isSelected && !opt.isCorrect
              const isReveal = hasAnswered && opt.isCorrect && !isSelected

              let backgroundColor = '#FFFFFF'
              let borderColor = '#E2E8F0'
              let textColor = '#0F172A'

              if (isRight) {
                backgroundColor = '#ECFDF5'
                borderColor = '#10B981'
                textColor = '#065F46'
              } else if (isWrong) {
                backgroundColor = '#FEF2F2'
                borderColor = '#EF4444'
                textColor = '#991B1B'
              } else if (isReveal) {
                backgroundColor = '#ECFDF5'
                borderColor = '#34D399'
                textColor = '#065F46'
              }

              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.optionButton,
                    { backgroundColor, borderColor },
                    (isRight || isReveal) && styles.correctOption,
                    isWrong && styles.wrongOption,
                  ]}
                  onPress={() => handleSelect(opt.id)}
                  disabled={hasAnswered}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel={opt.word}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={[styles.optionText, { color: textColor }]}>
                    {opt.word}
                  </Text>
                  {isRight && <Ionicons name="checkmark-circle" size={22} color="#10B981" />}
                  {isWrong && <Ionicons name="close-circle" size={22} color="#EF4444" />}
                  {isReveal && <Ionicons name="checkmark-circle-outline" size={22} color="#10B981" />}
                </TouchableOpacity>
              )
            })}
          </View>

          {/* FEEDBACK EXPLICATIVO POST-RESPUESTA */}
          {hasAnswered && (
            <View
              style={[
                styles.feedbackBox,
                {
                  borderColor: isCorrect ? '#10B981' : '#EF4444',
                  backgroundColor: isCorrect ? '#F0FDF4' : '#FEF2F2',
                },
              ]}
            >
              <Text
                style={[
                  styles.feedbackTitle,
                  { color: isCorrect ? '#065F46' : '#991B1B' },
                ]}
              >
                {isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}
              </Text>
              <Text style={styles.feedbackSentence}>
                "{clozeParts.full}"
              </Text>
              {targetItem.exampleEs ? (
                <Text style={styles.feedbackTranslation}>
                  ({targetItem.exampleEs})
                </Text>
              ) : null}
            </View>
          )}

          {/* BOTONES INFERIORES */}
          {hasAnswered ? (
            <Pressable
              style={styles.continueBtn}
              onPress={handleNext}
              accessibilityRole="button"
              accessibilityLabel={isLastQuestion ? 'Finalizar micro-retos' : 'Siguiente micro-reto'}
            >
              <Text style={styles.continueBtnText}>
                {isLastQuestion
                  ? 'Finalizar micro-retos →'
                  : `Siguiente micro-reto (${currentIndex + 2}/${totalCount}) →`}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.footer}>
              {hintLevel < 2 ? (
                <TouchableOpacity
                  style={styles.hintButton}
                  onPress={handleHint}
                  activeOpacity={0.7}
                >
                  <Ionicons name="bulb-outline" size={17} color="#D97706" />
                  <Text style={styles.hintButtonText}>
                    {hintLevel === 0 ? 'Necesito pista' : 'Más ayuda'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={{ width: 10 }} />
              )}

              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleNext}
                activeOpacity={0.7}
              >
                <Text style={styles.skipButtonText}>
                  {isLastQuestion ? 'Saltar' : 'Saltar micro-reto'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    minWidth: 55,
    textAlign: 'right',
  },
  sentenceContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    paddingRight: 48,
    marginBottom: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 74,
    justifyContent: 'center',
  },
  sentence: {
    fontSize: 17,
    color: '#1E293B',
    lineHeight: 25,
    fontWeight: '500',
  },
  blank: {
    color: '#059669',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  audioButton: {
    position: 'absolute',
    top: 14,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  hintContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  hintText: {
    fontSize: 12.5,
    color: '#92400E',
    fontWeight: '600',
    lineHeight: 17,
  },
  optionsContainer: {
    gap: 10,
    marginBottom: 14,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
  },
  correctOption: {
    borderWidth: 2,
  },
  wrongOption: {
    borderWidth: 2,
  },
  feedbackBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 14,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  feedbackSentence: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    fontStyle: 'italic',
  },
  feedbackTranslation: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  continueBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  continueBtnText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  hintButtonText: {
    fontSize: 13,
    color: '#D97706',
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  skipButtonText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
})
