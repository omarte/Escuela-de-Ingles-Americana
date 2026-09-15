import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  Image,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, typography, Card, Badge, Button } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import { getReadingPassagesByLevel, getVocabularyById } from '@elp/content'
import type { CEFRLevel, ReadingPassage, VocabularyItem, WordMapping } from '@elp/types'
import { EMPTY_READINGS_IMG } from '../../lib/assets'
import { AppScreenHeader } from '../../components/AppScreenHeader'

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2']

const LEVEL_COLORS: Record<CEFRLevel, { primary: string; light: string; border: string }> = {
  A1: { primary: '#059669', light: '#ECFDF5', border: '#A7F3D0' },
  A2: { primary: '#0284C7', light: '#F0F9FF', border: '#BAE6FD' },
  B1: { primary: '#7C3AED', light: '#F5F3FF', border: '#DDD6FE' },
  B2: { primary: '#D97706', light: '#FFFBEB', border: '#FDE68A' },
}

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
  const [activeMappingKey, setActiveMappingKey] = useState<string | null>(null)
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

  // Get or compute word mappings between English words and Spanish translation terms
  const passageMappings = useMemo<readonly WordMapping[]>(() => {
    if (selectedPassage.wordMappings && selectedPassage.wordMappings.length > 0) {
      return selectedPassage.wordMappings
    }
    const list: WordMapping[] = []
    for (const vid of selectedPassage.vocabularyIds) {
      const item = getVocabularyById(vid)
      if (item) {
        const transTokens = item.translation.split(/[/,;]+/).map((t) => t.trim())
        for (const tt of transTokens) {
          const clean = tt.replace(/\([^)]*\)/g, '').trim()
          if (
            clean.length > 2 &&
            selectedPassage.translation.toLowerCase().includes(clean.toLowerCase())
          ) {
            list.push({
              en: item.word,
              es: clean,
              vocabularyId: item.id,
            })
            break
          }
        }
      }
    }
    return list
  }, [selectedPassage])

  const handleSelectPassage = (passage: ReadingPassage): void => {
    setSelectedPassage(passage)
    setShowTranslation(false)
    setActiveWordItem(null)
    setActiveMappingKey(null)
    setUserAnswers({})
    setIsCompleted(false)
  }

  const handleSelectOption = (questionIndex: number, optionIndex: number): void => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }))
  }

  // Interactive content renderer for English text and Spanish translation
  const renderInteractiveContent = (isSpanish: boolean): React.JSX.Element => {
    const rawText = isSpanish ? selectedPassage.translation : selectedPassage.text
    if (!passageMappings.length) {
      return (
        <Text style={isSpanish ? styles.passageTextEs : styles.passageTextEn}>{rawText}</Text>
      )
    }

    // Sort by term length descending to match longer multi-word phrases first
    const sorted = [...passageMappings].sort((a, b) => {
      const lenA = (isSpanish ? a.es : a.en).length
      const lenB = (isSpanish ? b.es : b.en).length
      return lenB - lenA
    })

    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = sorted.map((m) => escapeRegex(isSpanish ? m.es : m.en)).join('|')
    const regex = new RegExp(`(${pattern})`, 'gi')
    const tokens = rawText.split(regex)

    return (
      <Text style={isSpanish ? styles.passageTextEs : styles.passageTextEn}>
        {tokens.map((token, index) => {
          const matched = sorted.find(
            (m) => (isSpanish ? m.es : m.en).toLowerCase() === token.toLowerCase(),
          )

          if (matched) {
            const isPairActive = activeMappingKey === matched.en.toLowerCase()
            const vocItem = matched.vocabularyId ? getVocabularyById(matched.vocabularyId) : null

            return (
              <Text
                key={`tok-${isSpanish ? 'es' : 'en'}-${String(index)}`}
                accessibilityRole="button"
                accessibilityLabel={`Ver significado de ${token}`}
                onPress={() => {
                  setActiveMappingKey(matched.en.toLowerCase())
                  if (vocItem) {
                    setActiveWordItem(vocItem)
                  }
                }}
                style={[
                  styles.highlightedWord,
                  isPairActive && styles.highlightedWordActive,
                ]}
              >
                {token}
              </Text>
            )
          }

          return <Text key={`tok-${isSpanish ? 'es' : 'en'}-${String(index)}`}>{token}</Text>
        })}
      </Text>
    )
  }

  const wordCount = selectedPassage.text.split(/\s+/).filter(Boolean).length

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Screen Header */}
        <AppScreenHeader
          icon="reader"
          accentColor="#0D9488"
          iconBgColor="#F0FDFA"
          eyebrow="COMPRENSIÓN NATURAL KRASHEN i+1"
          title="Lectura Contextual"
          subtitle="Lee párrafos graduados construidos con vocabulario hipervinculado y traducción paralela."
          rightElement={
            <Badge label={`Nivel ${selectedLevel}`} color="#0D9488" size="sm" />
          }
        />

        {/* Level Switcher */}
        <View style={styles.levelTabs}>
          {LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl
            const lvlColor = LEVEL_COLORS[lvl]
            return (
              <TouchableOpacity
                key={lvl}
                onPress={() => {
                  handleSelectLevel(lvl)
                }}
                style={[
                  styles.levelTab,
                  isSelected && {
                    backgroundColor: lvlColor.light,
                    borderColor: lvlColor.primary,
                    borderWidth: 1.5,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.levelTabText,
                    isSelected && {
                      color: lvlColor.primary,
                      fontWeight: '700',
                    },
                  ]}
                >
                  {lvl}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Passage Selector Strip */}
        {passages.length > 0 ? (
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
        ) : null}

        {passages.length === 0 ? (
          <Card padding="lg" style={styles.emptyCard}>
            <Image
              source={EMPTY_READINGS_IMG}
              style={styles.emptyImage}
              resizeMode="cover"
            />
            <Text style={styles.emptyTitle}>Lecturas del Nivel {selectedLevel} en preparación</Text>
            <Text style={styles.emptySubtitle}>
              Estamos curando lecturas bilingües graduadas para este nivel. Por ahora, continúa repasando las lecturas disponibles en los niveles A1 y A2.
            </Text>
          </Card>
        ) : (
          <>
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
              Las palabras subrayadas en inglés y español están conectadas. Tócalas para relacionar
              su significado y traducción.
            </Text>
          </View>

          {/* English Interactive Passage */}
          {renderInteractiveContent(false)}

          {/* Translation Section (Tap-to-reveal with synchronized highlighted words) */}
          {showTranslation ? (
            <View style={styles.translationContainer}>
              <View style={styles.translationDivider} />
              <Text style={styles.translationLabel}>Traducción Oficial al Español:</Text>
              {renderInteractiveContent(true)}
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
        </>
        )}

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
    backgroundColor: colors.primaryLight,
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
    color: colors.primaryDark,
    fontWeight: '600',
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
    textDecorationLine: 'none',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  highlightedWordActive: {
    color: colors.textInverse,
    backgroundColor: colors.primary,
    fontWeight: '700',
    borderRadius: 4,
    textDecorationLine: 'none',
    paddingHorizontal: 4,
    paddingVertical: 2,
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
  emptyCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.md,
  },
  emptyImage: {
    width: '100%',
    height: 180,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
})
