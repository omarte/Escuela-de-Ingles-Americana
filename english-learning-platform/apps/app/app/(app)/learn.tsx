import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, typography, radius, Card, Button, Badge, ProgressBar } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import type { ReviewQuality } from '@elp/types'
import { useSRSStore } from '../../stores/useSRSStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { getWordDisplayData } from '../../lib/vocabulary'
import { generateQuizOptions, type QuizOption } from '../../lib/distractors'

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

export default function LearnScreen(): React.JSX.Element {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)

  const cards = useSRSStore((state) => state.cards)
  const sessionQueue = useSRSStore((state) => state.sessionQueue)
  const currentIndex = useSRSStore((state) => state.currentIndex)
  const isSessionActive = useSRSStore((state) => state.isSessionActive)
  const isCompleted = useSRSStore((state) => state.isCompleted)
  const sessionStats = useSRSStore((state) => state.sessionStats)

  const loadCards = useSRSStore((state) => state.loadCards)
  const startStudySession = useSRSStore((state) => state.startStudySession)
  const submitReview = useSRSStore((state) => state.submitReview)
  const resetSession = useSRSStore((state) => state.resetSession)

  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([])
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState<boolean>(false)
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean>(false)

  const userId = user?.id ?? 'demo-user'
  const currentLevel = profile?.currentLevel ?? 'A1'

  useEffect(() => {
    void loadCards(userId)
  }, [loadCards, userId])

  const activeCard = sessionQueue[currentIndex]
  const wordData = activeCard ? getWordDisplayData(activeCard.vocabularyItemId) : null

  // Regenerate options whenever moving to a new card
  useEffect(() => {
    if (wordData) {
      setSelectedOptionId(null)
      setHasAnswered(false)
      setIsCorrectSelection(false)
      const opts = generateQuizOptions(wordData, currentLevel)
      setQuizOptions(opts)
    }
  }, [activeCard?.vocabularyItemId, currentIndex, currentLevel])

  const handleStart = (): void => {
    setSelectedOptionId(null)
    setHasAnswered(false)
    setIsCorrectSelection(false)
    void startStudySession(userId, currentLevel)
  }

  const handleSelectOption = (option: QuizOption): void => {
    if (hasAnswered) return
    setSelectedOptionId(option.id)
    setHasAnswered(true)
    setIsCorrectSelection(option.isCorrect)
  }

  const handleAdvance = (quality?: ReviewQuality): void => {
    const finalQuality: ReviewQuality = quality ?? (isCorrectSelection ? 5 : 1)
    setSelectedOptionId(null)
    setHasAnswered(false)
    setIsCorrectSelection(false)
    void submitReview(finalQuality)
  }

  const handleRestart = (): void => {
    resetSession()
    handleStart()
  }

  // ── Completion View ────────────────────────────────────────────────────────
  if (isCompleted) {
    const accuracy =
      sessionStats.cardsReviewed > 0
        ? Math.round((sessionStats.cardsCorrect / sessionStats.cardsReviewed) * 100)
        : 100

    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.completedContainer}>
          <View style={styles.completedIconBox}>
            <Ionicons name="trophy" size={48} color={colors.primary} />
          </View>
          <Text style={styles.completedTitle}>¡Sesión Completada!</Text>
          <Text style={styles.completedSubtitle}>
            Excelente entrenamiento. Has fortalecido tu memoria léxica y tus intervalos se han
            actualizado con el algoritmo SM-2.
          </Text>

          <Card padding="lg" style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{sessionStats.cardsReviewed}</Text>
                <Text style={styles.statLabel}>Palabras</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>{accuracy}%</Text>
                <Text style={styles.statLabel}>Precisión</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.warning }]}>+25</Text>
                <Text style={styles.statLabel}>XP Ganados</Text>
              </View>
            </View>
          </Card>

          <View style={styles.completedActions}>
            <Button
              title="Volver al Inicio"
              onPress={() => {
                resetSession()
                router.replace('/(app)')
              }}
              size="lg"
              style={styles.completedBtn}
            />
            <Button
              title="Entrenar Otra Sesión"
              variant="outline"
              onPress={handleRestart}
              size="md"
              style={styles.completedBtn}
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  // ── Session Intro View ─────────────────────────────────────────────────────
  if (!isSessionActive || !activeCard || !wordData) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Entrenamiento Diario</Text>
            <Text style={styles.subtitle}>
              Aprende mediante identificación activa, aciertos y errores guiados
            </Text>
          </View>

          <Card padding="lg" style={styles.sessionIntroCard}>
            <View style={styles.introHeader}>
              <View style={styles.introIcon}>
                <Ionicons name="sparkles" size={30} color={colors.primary} />
              </View>
              <View style={styles.introText}>
                <Text style={styles.introTitle}>Modo Aprendizaje Activo</Text>
                <Text style={styles.introSubtitle}>
                  Nivel {currentLevel} • Total en tu banco: {cards.length} palabras
                </Text>
              </View>
            </View>

            <View style={styles.featureHighlights}>
              <View style={styles.highlightItem}>
                <Ionicons name="checkmark-done-circle" size={20} color={colors.primary} />
                <Text style={styles.highlightText}>
                  Identifica palabras en inglés y elige su significado
                </Text>
              </View>
              <View style={styles.highlightItem}>
                <Ionicons name="volume-medium" size={20} color={colors.secondary} />
                <Text style={styles.highlightText}>
                  Pronunciación fonética clara adaptada al español
                </Text>
              </View>
              <View style={styles.highlightItem}>
                <Ionicons name="bulb-outline" size={20} color={colors.info} />
                <Text style={styles.highlightText}>
                  Descubre variaciones cotidianas y ejemplos de uso
                </Text>
              </View>
            </View>

            <Button
              title="Comenzar Entrenamiento"
              onPress={handleStart}
              size="lg"
              style={styles.startBtn}
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // ── Active Quiz Challenge View ─────────────────────────────────────────────
  const total = sessionQueue.length
  const progressRatio = total > 0 ? (currentIndex + 1) / total : 0

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with Progress Bar */}
        <View style={styles.sessionHeader}>
          <View style={styles.sessionHeaderTop}>
            <Badge label={`Nivel ${wordData.level}`} color={colors.primary} size="sm" />
            <Text style={styles.counterText}>
              Palabra {currentIndex + 1} de {total}
            </Text>
          </View>
          <ProgressBar
            progress={progressRatio}
            color={colors.primary}
            height={7}
            style={styles.sessionProgress}
          />
        </View>

        {/* English Challenge Card */}
        <Card padding="lg" style={styles.challengeCard}>
          <View style={styles.wordHeader}>
            <Text style={styles.partOfSpeechBadge}>
              {wordData.partOfSpeech.toUpperCase()}
            </Text>
            <Text style={styles.stateBadge}>{activeCard.state.toUpperCase()}</Text>
          </View>

          {/* Large Clear English Word */}
          <Text style={styles.englishWord}>{wordData.word}</Text>

          {/* Spanish-Adapted Phonetic Guide (Replaces abstract IPA) */}
          <View style={styles.phoneticContainer}>
            <View style={styles.phoneticPill}>
              <Ionicons name="volume-high-outline" size={18} color={colors.primary} />
              <Text style={styles.phoneticLabel}>Suena en español:</Text>
              <Text style={styles.phoneticValue}>[ {wordData.spanishPhonetic} ]</Text>
            </View>
            {wordData.phonetic ? (
              <Text style={styles.ipaSubtleText}>IPA: {wordData.phonetic}</Text>
            ) : null}
          </View>
        </Card>

        {/* Multiple Choice Instruction */}
        <View style={styles.optionsSection}>
          <Text style={styles.optionsPrompt}>
            {hasAnswered
              ? 'Resultado del reto:'
              : '¿Cuál es el significado correcto en español?'}
          </Text>

          {/* 4 Interactive Option Cards */}
          <View style={styles.optionsList}>
            {quizOptions.map((opt, idx) => {
              const isSelected = selectedOptionId === opt.id
              const isCorrectOption = opt.isCorrect

              const isHighlightedCorrect = hasAnswered && isCorrectOption
              const isHighlightedWrong = hasAnswered && isSelected && !isCorrectOption
              const isDimmed = hasAnswered && !isCorrectOption && !isSelected

              const iconName: keyof typeof Ionicons.glyphMap | null = isHighlightedCorrect
                ? 'checkmark-circle'
                : isHighlightedWrong
                  ? 'close-circle'
                  : null
              const iconColor: string = isHighlightedCorrect
                ? '#FFFFFF'
                : isHighlightedWrong
                  ? '#DC2626'
                  : colors.primary

              return (
                <Pressable
                  key={opt.id}
                  disabled={hasAnswered}
                  onPress={() => {
                    handleSelectOption(opt)
                  }}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.optionItem,
                    isHighlightedCorrect && styles.optionItemCorrect,
                    isHighlightedWrong && styles.optionItemWrong,
                    isDimmed && styles.optionItemDimmed,
                    {
                      opacity: pressed && !hasAnswered ? 0.88 : 1,
                      transform: [{ scale: pressed && !hasAnswered ? 0.985 : 1 }],
                    },
                  ]}
                >
                  <View style={styles.optionContentLeft}>
                    <View
                      style={[
                        styles.optionLetter,
                        isHighlightedCorrect && styles.optionLetterCorrect,
                        isHighlightedWrong && styles.optionLetterWrong,
                      ]}
                    >
                      <Text style={styles.optionLetterText}>{OPTION_LETTERS[idx]}</Text>
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        isHighlightedCorrect && styles.optionTextCorrect,
                        isHighlightedWrong && styles.optionTextWrong,
                      ]}
                    >
                      {opt.text}
                    </Text>
                  </View>

                  {iconName ? (
                    <Ionicons name={iconName} size={22} color={iconColor} />
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={hasAnswered ? 'transparent' : colors.textMuted}
                    />
                  )}
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* Immediate Feedback & Meaning Variations (Revealed on Answer) */}
        {hasAnswered ? (
          <View style={styles.feedbackSection}>
            {/* Congratulatory or Helpful Banner */}
            <View
              style={[
                styles.feedbackBanner,
                isCorrectSelection
                  ? styles.feedbackBannerSuccess
                  : styles.feedbackBannerConstructive,
              ]}
            >
              <View style={styles.feedbackBannerHeader}>
                <Ionicons
                  name={isCorrectSelection ? 'ribbon' : 'bulb'}
                  size={26}
                  color={isCorrectSelection ? colors.primary : colors.warning}
                />
                <Text
                  style={[
                    styles.feedbackBannerTitle,
                    { color: isCorrectSelection ? colors.primary : '#B45309' },
                  ]}
                >
                  {isCorrectSelection
                    ? '¡Excelente Acierto! 🎉'
                    : '¡Buen intento! Aprende del error:'}
                </Text>
              </View>
              <Text style={styles.feedbackBannerMessage}>
                {isCorrectSelection
                  ? `Has relacionado "${wordData.word}" con su traducción de manera exacta.`
                  : `"${wordData.word}" significa "${wordData.translation}". Al repasarla ahora la recordarás mejor.`}
              </Text>
            </View>

            {/* Meaning & Variations Detail Card */}
            <Card padding="lg" style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Traducción Principal:</Text>
                <Text style={styles.detailTranslation}>{wordData.translation}</Text>
              </View>

              {/* Variations (e.g. Mom, Mum, Mommy) */}
              {wordData.variations && wordData.variations.length > 0 ? (
                <View style={styles.variationsBox}>
                  <Text style={styles.variationsTitle}>Variaciones y Formas Comunes:</Text>
                  <View style={styles.variationsTagsRow}>
                    {wordData.variations.map((v, i) => (
                      <View key={i} style={styles.variationTag}>
                        <Ionicons name="chatbubble-ellipses-outline" size={13} color={colors.primary} />
                        <Text style={styles.variationTagText}>{v}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {/* Usage Notes if available */}
              {wordData.usageNotes ? (
                <View style={styles.usageNoteBox}>
                  <Ionicons name="information-circle-outline" size={16} color={colors.secondary} />
                  <Text style={styles.usageNoteText}>{wordData.usageNotes}</Text>
                </View>
              ) : null}

              {/* Context Example */}
              {wordData.exampleEn ? (
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleLabel}>Ejemplo en oración:</Text>
                  <Text style={styles.exampleEnText}>"{wordData.exampleEn}"</Text>
                  <Text style={styles.exampleEsText}>{wordData.exampleEs}</Text>
                </View>
              ) : null}
            </Card>

            {/* Main Advance Button */}
            <View style={styles.actionControls}>
              <Button
                title={isCorrectSelection ? 'Continuar al Siguiente Reto →' : 'Entendido, continuar →'}
                variant={isCorrectSelection ? 'primary' : 'secondary'}
                onPress={() => {
                  handleAdvance()
                }}
                size="lg"
                style={styles.continueBtn}
              />
            </View>
          </View>
        ) : null}
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
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sessionIntroCard: {
    marginBottom: spacing.xl,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  introIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introText: {
    flex: 1,
  },
  introTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  introSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  featureHighlights: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.backgroundSubtle,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  highlightText: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
    flex: 1,
  },
  startBtn: {
    marginTop: spacing.xs,
  },
  sessionHeader: {
    marginBottom: spacing.md,
  },
  sessionHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  counterText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.semibold,
  },
  sessionProgress: {
    marginTop: spacing.xs,
  },
  challengeCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.card,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.xs,
  },
  partOfSpeechBadge: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  stateBadge: {
    fontSize: typography.sizes.xs - 2,
    color: colors.secondary,
    backgroundColor: colors.backgroundSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    fontWeight: typography.weights.bold,
  },
  englishWord: {
    fontSize: 38,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginVertical: spacing.xs,
  },
  phoneticContainer: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  phoneticPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  phoneticLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  phoneticValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  ipaSubtleText: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textMuted,
    marginTop: 4,
  },
  optionsSection: {
    marginBottom: spacing.md,
  },
  optionsPrompt: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 56,
  },
  optionItemCorrect: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  optionItemWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  optionItemDimmed: {
    opacity: 0.5,
  },
  optionContentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  optionLetter: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterCorrect: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  optionLetterWrong: {
    backgroundColor: '#FCA5A5',
  },
  optionLetterText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  optionText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  optionTextCorrect: {
    color: '#FFFFFF',
  },
  optionTextWrong: {
    color: '#991B1B',
  },
  feedbackSection: {
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  feedbackBanner: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  feedbackBannerSuccess: {
    backgroundColor: colors.primaryLight,
    borderColor: '#6EE7B7',
  },
  feedbackBannerConstructive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  feedbackBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  feedbackBannerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  feedbackBannerMessage: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  detailCard: {
    backgroundColor: colors.card,
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.semibold,
  },
  detailTranslation: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  variationsBox: {
    gap: spacing.xs,
  },
  variationsTitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.bold,
  },
  variationsTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  variationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  variationTagText: {
    fontSize: typography.sizes.xs - 1,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  usageNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.backgroundSubtle,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  usageNoteText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    flex: 1,
    fontStyle: 'italic',
  },
  exampleBox: {
    backgroundColor: colors.backgroundSubtle,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  exampleLabel: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textMuted,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  exampleEnText: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
    fontStyle: 'italic',
  },
  exampleEsText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionControls: {
    marginTop: spacing.xs,
  },
  continueBtn: {
    width: '100%',
  },
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  completedIconBox: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  completedTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  completedSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    maxWidth: 320,
  },
  statsCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  completedActions: {
    width: '100%',
    gap: spacing.sm,
  },
  completedBtn: {
    width: '100%',
  },
})
