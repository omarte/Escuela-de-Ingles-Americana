import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, typography, radius, Card, Button, Badge, ProgressBar } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import type { ReviewQuality } from '@elp/types'
import { useSRSStore } from '../../stores/useSRSStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { getWordDisplayData } from '../../lib/vocabulary'

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

  const [isRevealed, setIsRevealed] = useState(false)

  const userId = user?.id ?? 'demo-user'
  const currentLevel = profile?.currentLevel ?? 'A1'

  useEffect(() => {
    void loadCards(userId)
  }, [loadCards, userId])

  const activeCard = sessionQueue[currentIndex]
  const wordData = activeCard ? getWordDisplayData(activeCard.vocabularyItemId) : null

  const handleStart = (): void => {
    setIsRevealed(false)
    void startStudySession(userId, currentLevel)
  }

  const handleAnswer = (quality: ReviewQuality): void => {
    setIsRevealed(false)
    void submitReview(quality)
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
            Excelente trabajo. Tus intervalos de repetición se han actualizado según el algoritmo
            SM-2.
          </Text>

          <Card padding="lg" style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{sessionStats.cardsReviewed}</Text>
                <Text style={styles.statLabel}>Repasadas</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>{accuracy}%</Text>
                <Text style={styles.statLabel}>Aciertos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.warning }]}>+15</Text>
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
              title="Repasar de Nuevo"
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
              Repetición Espaciada inteligente con el algoritmo SM-2
            </Text>
          </View>

          <Card padding="lg" style={styles.sessionIntroCard}>
            <View style={styles.introHeader}>
              <View style={styles.introIcon}>
                <Ionicons name="flash-outline" size={32} color={colors.primary} />
              </View>
              <View style={styles.introText}>
                <Text style={styles.introTitle}>Sesión de Repaso Activa</Text>
                <Text style={styles.introSubtitle}>
                  Nivel {currentLevel} • Total en mazo: {cards.length} tarjetas
                </Text>
              </View>
            </View>

            <View style={styles.cardsInfoRow}>
              <View style={styles.infoBadge}>
                <Text style={styles.infoNumber}>
                  {cards.filter((c) => c.state === 'learning' || c.state === 'review').length}
                </Text>
                <Text style={styles.infoLabel}>En aprendizaje</Text>
              </View>
              <View style={styles.infoBadge}>
                <Text style={styles.infoNumber}>
                  {cards.filter((c) => c.state === 'dominated').length}
                </Text>
                <Text style={styles.infoLabel}>Dominadas</Text>
              </View>
            </View>

            <Button
              title="Iniciar Sesión de Repaso"
              onPress={handleStart}
              size="lg"
              style={styles.startBtn}
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // ── Active Card View ───────────────────────────────────────────────────────
  const total = sessionQueue.length
  const progressRatio = total > 0 ? (currentIndex + 1) / total : 0

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Progress Bar */}
        <View style={styles.sessionHeader}>
          <View style={styles.sessionHeaderTop}>
            <Badge label={`Nivel ${wordData.level}`} color={colors.primary} size="sm" />
            <Text style={styles.counterText}>
              {currentIndex + 1} de {total}
            </Text>
          </View>
          <ProgressBar
            progress={progressRatio}
            color={colors.primary}
            height={6}
            style={styles.sessionProgress}
          />
        </View>

        {/* Flashcard Area */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => {
            setIsRevealed(!isRevealed)
          }}
          style={styles.flashcardWrapper}
        >
          <Card padding="lg" style={styles.flashcard}>
            {/* Word Front */}
            <View style={styles.wordHeader}>
              <Text style={styles.partOfSpeechBadge}>{wordData.partOfSpeech}</Text>
              <Text style={styles.stateBadge}>{activeCard.state.toUpperCase()}</Text>
            </View>

            <Text style={styles.englishWord}>{wordData.word}</Text>
            {wordData.phonetic ? (
              <Text style={styles.phoneticText}>{wordData.phonetic}</Text>
            ) : null}

            {/* Tap Hint or Revealed Back */}
            {!isRevealed ? (
              <View style={styles.tapHintContainer}>
                <Ionicons name="hand-left-outline" size={20} color={colors.textMuted} />
                <Text style={styles.tapHintText}>Toca para voltear tarjeta</Text>
              </View>
            ) : (
              <View style={styles.revealedContent}>
                <View style={styles.divider} />
                <Text style={styles.translationText}>{wordData.translation}</Text>

                <View style={styles.exampleContainer}>
                  <Text style={styles.exampleEn}>"{wordData.exampleEn}"</Text>
                  <Text style={styles.exampleEs}>{wordData.exampleEs}</Text>
                </View>
              </View>
            )}
          </Card>
        </TouchableOpacity>

        {/* Action Controls */}
        <View style={styles.controlsContainer}>
          {!isRevealed ? (
            <Button
              title="Mostrar Respuesta"
              variant="secondary"
              onPress={() => {
                setIsRevealed(true)
              }}
              size="lg"
              style={styles.revealBtn}
            />
          ) : (
            <View style={styles.ratingsContainer}>
              <Text style={styles.ratingTitle}>¿Cómo recordaste esta palabra?</Text>
              <View style={styles.ratingButtonsRow}>
                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.ratingBtn,
                    styles.ratingBtnHard,
                    {
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                  onPress={() => {
                    handleAnswer(1)
                  }}
                >
                  <Text style={[styles.ratingBtnText, { color: colors.danger }]}>Difícil</Text>
                  <Text style={[styles.ratingBtnSub, { color: colors.danger }]}>1d</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.ratingBtn,
                    styles.ratingBtnGood,
                    {
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                  onPress={() => {
                    handleAnswer(3)
                  }}
                >
                  <Text style={[styles.ratingBtnText, { color: colors.primary }]}>Bueno</Text>
                  <Text style={[styles.ratingBtnSub, { color: colors.primary }]}>
                    {activeCard.interval > 0 ? `${String(activeCard.interval)}d` : '4d'}
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.ratingBtn,
                    styles.ratingBtnEasy,
                    {
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                  onPress={() => {
                    handleAnswer(5)
                  }}
                >
                  <Text style={[styles.ratingBtnText, { color: colors.info }]}>Fácil</Text>
                  <Text style={[styles.ratingBtnSub, { color: colors.info }]}>
                    {activeCard.interval > 0
                      ? `${String(Math.round(activeCard.interval * activeCard.easeFactor))}d`
                      : '7d'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
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
  cardsInfoRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  infoBadge: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.backgroundSubtle,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  infoNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  infoLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
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
  flashcardWrapper: {
    marginVertical: spacing.md,
  },
  flashcard: {
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.sm,
  },
  partOfSpeechBadge: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: typography.weights.semibold,
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
    fontSize: typography.sizes.hero,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginVertical: spacing.xs,
  },
  phoneticText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.md,
  },
  tapHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  tapHintText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  revealedContent: {
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  translationText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  exampleContainer: {
    backgroundColor: colors.backgroundSubtle,
    padding: spacing.md,
    borderRadius: radius.md,
    width: '100%',
    alignItems: 'center',
  },
  exampleEn: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  exampleEs: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  controlsContainer: {
    marginTop: spacing.lg,
  },
  revealBtn: {
    width: '100%',
  },
  ratingsContainer: {
    width: '100%',
  },
  ratingTitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ratingBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBtnHard: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  ratingBtnGood: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ratingBtnEasy: {
    backgroundColor: colors.infoLight,
    borderWidth: 1,
    borderColor: colors.info,
  },
  ratingBtnText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  ratingBtnSub: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textMuted,
    marginTop: 2,
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
