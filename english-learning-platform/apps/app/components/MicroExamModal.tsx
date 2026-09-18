import React, { useState, useCallback, useMemo, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, typography, radius } from '@elp/ui'
import { getVocabularyById, getVocabularyForWeek } from '@elp/content'
import type { CEFRLevel } from '@elp/types'

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

/**
 * MicroExamModal — Contextual Cloze micro-exam sequence shown after session completion.
 *
 * Proportion: 3 micro-challenges per 5 words reviewed.
 * Shows a Cloze sentence from the curated `example` field of a VocabularyItem,
 * with one correct answer and 2 seeded distractors from the same level/week pool.
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
  const [correctCount, setCorrectCount] = useState(0)

  // Reset state on sequence start
  useEffect(() => {
    if (visible) {
      setCurrentIndex(0)
      setSelectedId(null)
      setHasAnswered(false)
      setCorrectCount(0)
    }
  }, [visible])

  const totalCount = itemIds.length
  const currentVocabId = itemIds[currentIndex] ?? ''
  const targetItem = getVocabularyById(currentVocabId)

  // Build the Cloze sentence: replace the word in the example with ______
  const clozeSentence = useMemo(() => {
    if (!targetItem?.example) return null
    const word = targetItem.word
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return targetItem.example.replace(new RegExp(escaped, 'i'), '______')
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
      if (hasAnswered) return
      setSelectedId(optionId)
      setHasAnswered(true)
      const selected = options.find((o) => o.id === optionId)
      if (selected?.isCorrect) {
        setCorrectCount((c) => c + 1)
      }
    },
    [hasAnswered, options],
  )

  const handleNext = useCallback(() => {
    if (currentIndex + 1 < totalCount) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedId(null)
      setHasAnswered(false)
    } else {
      setSelectedId(null)
      setHasAnswered(false)
      onComplete()
    }
  }, [currentIndex, totalCount, onComplete])

  // Guards: handle invalid state gracefully
  if (totalCount === 0) {
    if (visible) {
      onComplete()
    }
    return null
  }

  if (!targetItem || !clozeSentence || options.length < 3) {
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleNext}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header with Counter & Progress */}
          <View style={styles.header}>
            <View style={styles.iconRow}>
              <Ionicons name="flash" size={20} color={colors.primary} />
            </View>

            <View style={styles.counterBadge}>
              <Text style={styles.counterBadgeText}>
                Micro-reto {currentIndex + 1} de {totalCount}
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${((currentIndex + 1) / totalCount) * 100}%` },
                ]}
              />
            </View>

            <Text style={styles.title}>Micro-reto Contextual</Text>
            <Text style={styles.subtitle}>Completa la oración con la palabra correcta</Text>
          </View>

          {/* Cloze sentence */}
          <View style={styles.sentenceBox}>
            <Text style={styles.sentence}>{clozeSentence}</Text>
            {targetItem.translation && (
              <Text style={styles.sentenceHint}>
                💬 {targetItem.translation}
              </Text>
            )}
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {options.map((opt) => {
              const isSelected = selectedId === opt.id
              const isRight = isSelected && opt.isCorrect
              const isWrong = isSelected && !opt.isCorrect
              const isReveal = hasAnswered && opt.isCorrect && !isSelected

              let borderColor: string = colors.border
              let bgColor = 'transparent'
              let textColor: string = colors.textPrimary

              if (isRight) {
                borderColor = colors.success
                bgColor = 'rgba(34, 197, 94, 0.12)'
                textColor = colors.success
              } else if (isWrong) {
                borderColor = colors.danger
                bgColor = 'rgba(239, 68, 68, 0.10)'
                textColor = colors.danger
              } else if (isReveal) {
                borderColor = colors.success
                bgColor = 'rgba(34, 197, 94, 0.08)'
                textColor = colors.success
              }

              return (
                <Pressable
                  key={opt.id}
                  style={[
                    styles.optionBtn,
                    { borderColor, backgroundColor: bgColor },
                  ]}
                  onPress={() => { handleSelect(opt.id) }}
                  disabled={hasAnswered}
                  accessibilityRole="button"
                  accessibilityLabel={opt.word}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={[styles.optionWord, { color: textColor }]}>{opt.word}</Text>
                  {isRight && <Ionicons name="checkmark-circle" size={20} color={colors.success} />}
                  {isWrong && <Ionicons name="close-circle" size={20} color={colors.danger} />}
                  {isReveal && <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />}
                </Pressable>
              )
            })}
          </View>

          {/* Feedback message */}
          {hasAnswered && (
            <View style={[
              styles.feedbackBox,
              { borderColor: isCorrect ? colors.success : colors.danger },
            ]}>
              <Text style={[
                styles.feedbackText,
                { color: isCorrect ? colors.success : colors.danger },
              ]}>
                {isCorrect
                  ? `✅ ¡Correcto! "${targetItem.word}" encaja perfectamente.`
                  : `💡 La palabra correcta es "${correctOption?.word ?? targetItem.word}".`}
              </Text>
            </View>
          )}

          {/* CTA */}
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
            <TouchableOpacity
              onPress={handleNext}
              style={styles.skipBtn}
              accessibilityRole="button"
            >
              <Text style={styles.skipText}>
                {isLastQuestion ? 'Saltar micro-reto' : 'Saltar este micro-reto'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconRow: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderRadius: radius.full,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  counterBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: spacing.xs,
  },
  counterBadgeText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginVertical: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  sentenceBox: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  sentence: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sentenceHint: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  optionWord: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    flex: 1,
  },
  feedbackBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  feedbackText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },
  continueBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  continueBtnText: {
    fontSize: typography.sizes.md,
    color: '#fff',
    fontWeight: typography.weights.bold,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
  },
})
