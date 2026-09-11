import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, typography, Card, Badge, Button } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import { getReadingPassagesByLevel, getVocabularyById } from '@elp/content'
import type { CEFRLevel, ReadingPassage, VocabularyItem } from '@elp/types'

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2']

export default function ReadingScreen(): React.JSX.Element {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1')
  const passages = useMemo(() => getReadingPassagesByLevel(selectedLevel), [selectedLevel])
  const [selectedPassage, setSelectedPassage] = useState<ReadingPassage>(() => {
    const initialPassages = getReadingPassagesByLevel('A1')
    return (
      initialPassages[0] ?? {
        id: 'rdg_a1_fallback',
        level: 'A1',
        week: 1,
        title: 'Lectura no disponible',
        text: 'Cargando contenido...',
        translation: 'Cargando contenido...',
        vocabularyIds: [],
        difficulty: 1,
        verifiedBy: 'system',
        verifiedAt: '2026-09-10',
        status: 'published',
      }
    )
  })

  const handleSelectLevel = (level: CEFRLevel): void => {
    setSelectedLevel(level)
    const newPassages = getReadingPassagesByLevel(level)
    const firstPassage = newPassages[0]
    if (firstPassage) {
      handleSelectPassage(firstPassage)
    } else {
      handleSelectPassage({
        id: `rdg_${level.toLowerCase()}_fallback`,
        level,
        week: 1,
        title: `Lectura no disponible para ${level}`,
        text: 'Próximamente contenido curado para este nivel...',
        translation: 'Próximamente contenido curado para este nivel...',
        vocabularyIds: [],
        difficulty: 1,
        verifiedBy: 'system',
        verifiedAt: '2026-09-10',
        status: 'published',
      })
    }
  }

  const [showTranslation, setShowTranslation] = useState(false)
  const [activeWordItem, setActiveWordItem] = useState<VocabularyItem | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  // Map of normalized word string -> VocabularyItem
  const vocabMap = useMemo(() => {
    const map = new Map<string, VocabularyItem>()
    for (const vid of selectedPassage.vocabularyIds) {
      const item = getVocabularyById(vid)
      if (item) {
        map.set(item.word.toLowerCase().trim(), item)
        // Also map single words if multi-word term like 'mother / mom'
        const parts = item.word.toLowerCase().split(/[\s/]+/)
        for (const p of parts) {
          if (p.length > 2 && !map.has(p)) {
            map.set(p, item)
          }
        }
      }
    }
    return map
  }, [selectedPassage.vocabularyIds])

  const handleSelectPassage = (passage: ReadingPassage): void => {
    setSelectedPassage(passage)
    setShowTranslation(false)
    setActiveWordItem(null)
    setUserAnswers({})
    setIsCompleted(false)
  }

  const handleSelectOption = (questionIndex: number, optionIndex: number): void => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }))
  }

  // Tokenize text into words and punctuation
  const renderInteractiveText = (): React.JSX.Element => {
    const tokens = selectedPassage.text.split(/(\s+)/)

    return (
      <Text style={styles.passageTextEn}>
        {tokens.map((token, index) => {
          // If whitespace token, render directly
          if (/^\s+$/.test(token)) {
            return <Text key={`ws-${String(index)}`}>{token}</Text>
          }

          // Strip punctuation to match against vocabMap
          const cleanWord = token.toLowerCase().replace(/[^a-z0-9]/g, '')
          const matchedItem = vocabMap.get(cleanWord)

          if (matchedItem) {
            return (
              <Text
                key={`tok-${String(index)}`}
                onPress={() => {
                  setActiveWordItem(matchedItem)
                }}
                style={styles.highlightedWord}
              >
                {token}
              </Text>
            )
          }

          return <Text key={`tok-${String(index)}`}>{token}</Text>
        })}
      </Text>
    )
  }

  const wordCount = selectedPassage.text.split(/\s+/).filter(Boolean).length

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lectura Contextual</Text>
          <Text style={styles.subtitle}>
            Lee párrafos graduados construidos con el vocabulario curado de tu nivel
          </Text>
        </View>

        {/* Level Switcher */}
        <View style={styles.levelTabs}>
          {LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl
            return (
              <TouchableOpacity
                key={lvl}
                onPress={() => {
                  handleSelectLevel(lvl)
                }}
                style={[styles.levelTab, isSelected && styles.levelTabActive]}
              >
                <Text style={[styles.levelTabText, isSelected && styles.levelTabTextActive]}>
                  {lvl}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Passage Selector Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.selectorStrip}
          contentContainerStyle={styles.selectorContent}
        >
          {passages.map((passage) => {
            const isSelected = selectedPassage.id === passage.id
            return (
              <TouchableOpacity
                key={passage.id}
                onPress={() => {
                  handleSelectPassage(passage)
                }}
                style={[styles.selectorChip, isSelected && styles.selectorChipActive]}
              >
                <Text
                  style={[styles.selectorChipText, isSelected && styles.selectorChipTextActive]}
                >
                  {passage.title}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Active Passage Reader Card */}
        <Card padding="lg" highlighted style={styles.readerCard}>
          <View style={styles.passageHeader}>
            <View style={styles.badgeRow}>
              <Badge label={selectedPassage.level} color={colors.primary} size="sm" />
              <Badge
                label={`Semana ${String(selectedPassage.week)}`}
                color={colors.secondary}
                size="sm"
              />
              <Badge
                label={`Dificultad ${String(selectedPassage.difficulty)}/5`}
                color={colors.warning}
                size="sm"
              />
            </View>
            <Text style={styles.wordCountBadge}>{String(wordCount)} palabras</Text>
          </View>

          <Text style={styles.passageTitle}>{selectedPassage.title}</Text>

          <View style={styles.instructionBanner}>
            <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
            <Text style={styles.instructionText}>
              Las palabras resaltadas pertenecen a tu banco de estudio. Tócalas para ver su
              traducción.
            </Text>
          </View>

          {/* English Interactive Passage */}
          {renderInteractiveText()}

          {/* Translation Section (Tap-to-reveal) */}
          {showTranslation ? (
            <View style={styles.translationContainer}>
              <View style={styles.translationDivider} />
              <Text style={styles.translationLabel}>Traducción Oficial al Español:</Text>
              <Text style={styles.passageTextEs}>{selectedPassage.translation}</Text>
            </View>
          ) : null}

          {/* Toggle Translation Button */}
          <Button
            title={showTranslation ? 'Ocultar Traducción' : 'Mostrar Traducción'}
            onPress={() => {
              setShowTranslation(!showTranslation)
            }}
            variant={showTranslation ? 'ghost' : 'outline'}
            size="md"
            style={styles.toggleBtn}
            icon={
              <Ionicons
                name={showTranslation ? 'eye-off-outline' : 'language-outline'}
                size={18}
                color={colors.primary}
              />
            }
          />
        </Card>

        {/* Reading Comprehension Quiz Section */}
        {selectedPassage.comprehensionQuestions &&
        selectedPassage.comprehensionQuestions.length > 0 ? (
          <Card padding="md" style={styles.quizCard}>
            <View style={styles.quizHeader}>
              <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.quizTitle}>Comprueba tu Comprensión</Text>
            </View>

            {selectedPassage.comprehensionQuestions.map((q, qIndex) => {
              const selectedOpt = userAnswers[qIndex]
              const hasAnswered = selectedOpt !== undefined

              return (
                <View key={`q-${String(qIndex)}`} style={styles.questionBlock}>
                  <Text style={styles.questionText}>
                    {String(qIndex + 1)}. {q.question}
                  </Text>

                  <View style={styles.optionsList}>
                    {q.options.map((opt, optIndex) => {
                      const isOptionSelected = selectedOpt === optIndex
                      const isCorrect = optIndex === q.correctOptionIndex

                      let optionStyle: StyleProp<ViewStyle> = styles.optionItem
                      let optionTextStyle: StyleProp<TextStyle> = styles.optionText

                      if (hasAnswered) {
                        if (isCorrect) {
                          optionStyle = styles.optionCorrect
                          optionTextStyle = styles.optionTextCorrect
                        } else if (isOptionSelected) {
                          optionStyle = styles.optionWrong
                          optionTextStyle = styles.optionTextWrong
                        }
                      } else if (isOptionSelected) {
                        optionStyle = styles.optionSelected
                        optionTextStyle = styles.optionTextSelected
                      }

                      return (
                        <Pressable
                          key={`opt-${String(optIndex)}`}
                          disabled={hasAnswered}
                          accessibilityRole="button"
                          onPress={() => {
                            handleSelectOption(qIndex, optIndex)
                          }}
                          style={({ pressed }) => [
                            optionStyle,
                            {
                              transform: [{ scale: pressed && !hasAnswered ? 0.98 : 1 }],
                            },
                          ]}
                        >
                          <Text style={optionTextStyle}>{opt}</Text>
                          {hasAnswered && isCorrect ? (
                            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                          ) : null}
                          {hasAnswered && isOptionSelected && !isCorrect ? (
                            <Ionicons name="close-circle" size={18} color={colors.danger} />
                          ) : null}
                        </Pressable>
                      )
                    })}
                  </View>

                  {hasAnswered && q.explanation ? (
                    <View style={styles.explanationBox}>
                      <Text style={styles.explanationText}>{q.explanation}</Text>
                    </View>
                  ) : null}
                </View>
              )
            })}
          </Card>
        ) : null}

        {/* Mark as read button */}
        <Button
          title={isCompleted ? '✓ Lectura Completada' : 'Marcar Lectura como Completada'}
          variant={isCompleted ? 'secondary' : 'primary'}
          size="lg"
          onPress={() => {
            setIsCompleted(true)
          }}
          disabled={isCompleted}
          style={styles.completeBtn}
          icon={<Ionicons name="checkmark-done-outline" size={20} color={colors.textPrimary} />}
        />

        {/* Word Detail Modal */}
        <Modal
          visible={activeWordItem !== null}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setActiveWordItem(null)
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {activeWordItem ? (
                <>
                  <View style={styles.modalHeader}>
                    <Badge label={activeWordItem.level} color={colors.primary} size="sm" />
                    <Badge
                      label={activeWordItem.partOfSpeech}
                      color={colors.textSecondary}
                      backgroundColor={colors.cardHover}
                      size="sm"
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setActiveWordItem(null)
                      }}
                      style={styles.modalCloseBtn}
                    >
                      <Ionicons name="close" size={22} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.modalWord}>{activeWordItem.word}</Text>
                  {activeWordItem.pronunciation ? (
                    <Text style={styles.modalPhonetic}>{activeWordItem.pronunciation}</Text>
                  ) : null}

                  <View style={styles.modalDivider} />

                  <Text style={styles.modalTranslationLabel}>Significado en español:</Text>
                  <Text style={styles.modalTranslation}>{activeWordItem.translation}</Text>

                  {activeWordItem.example ? (
                    <View style={styles.modalExampleBox}>
                      <Text style={styles.modalExampleEn}>{activeWordItem.example}</Text>
                      {activeWordItem.exampleTranslation ? (
                        <Text style={styles.modalExampleEs}>
                          {activeWordItem.exampleTranslation}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}

                  <Button
                    title="Entendido"
                    variant="primary"
                    size="md"
                    onPress={() => {
                      setActiveWordItem(null)
                    }}
                    style={styles.modalBtn}
                  />
                </>
              ) : null}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  levelTabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  levelTab: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelTabActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  levelTabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  levelTabTextActive: {
    color: colors.primary,
  },
  selectorStrip: {
    marginBottom: spacing.md,
  },
  selectorContent: {
    gap: spacing.sm,
  },
  selectorChip: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  selectorChipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  selectorChipTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  readerCard: {
    marginBottom: spacing.lg,
  },
  passageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  wordCountBadge: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textMuted,
  },
  passageTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  instructionText: {
    fontSize: typography.sizes.xs - 1,
    color: colors.primary,
    flex: 1,
  },
  passageTextEn: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  highlightedWord: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderRadius: radius.sm,
    textDecorationLine: 'underline',
  },
  translationContainer: {
    marginTop: spacing.lg,
  },
  translationDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  translationLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  passageTextEs: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  toggleBtn: {
    marginTop: spacing.lg,
  },
  quizCard: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  quizTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  questionBlock: {
    gap: spacing.sm,
  },
  questionText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  optionsList: {
    gap: spacing.xs,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardHover,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  optionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  optionWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.dangerLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  optionText: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  optionTextCorrect: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  optionTextWrong: {
    fontSize: typography.sizes.xs,
    color: colors.danger,
    fontWeight: typography.weights.bold,
  },
  explanationBox: {
    backgroundColor: colors.backgroundSubtle,
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  explanationText: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  completeBtn: {
    marginBottom: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  modalCloseBtn: {
    padding: spacing.xs,
  },
  modalWord: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  modalPhonetic: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  modalTranslationLabel: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalTranslation: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginTop: 2,
  },
  modalExampleBox: {
    backgroundColor: colors.cardHover,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.md,
  },
  modalExampleEn: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
  modalExampleEs: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalBtn: {
    marginTop: spacing.lg,
  },
})
