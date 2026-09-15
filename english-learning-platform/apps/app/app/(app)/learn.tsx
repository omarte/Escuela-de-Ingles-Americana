import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, typography, radius, Card, Button, Badge, ProgressBar } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import type { FrictionLevel, ReviewQuality } from '@elp/types'
import { getDueCards } from '@elp/srs'
import { useSRSStore } from '../../stores/useSRSStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { getWordDisplayData } from '../../lib/vocabulary'
import { generateQuizOptions, type QuizOption } from '../../lib/distractors'
import { speakEnglish } from '../../lib/audio'
import { EMPTY_REVIEWS_IMG } from '../../lib/assets'
import { RescueModeBanner } from '../../components/RescueModeBanner'
import { SessionFeedbackModal } from '../../components/SessionFeedbackModal'
import { MicroExamModal } from '../../components/MicroExamModal'

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
  const loadNextBatch = useSRSStore((state) => state.loadNextBatch)
  const repeatCurrentLesson = useSRSStore((state) => state.repeatCurrentLesson)
  const startFreePracticeSession = useSRSStore((state) => state.startFreePracticeSession)
  const submitReview = useSRSStore((state) => state.submitReview)
  const resetSession = useSRSStore((state) => state.resetSession)
  const recordCardShown = useSRSStore((state) => state.recordCardShown)

  // Quiz & Two-Phase State
  const [studyPhase, setStudyPhase] = useState<'recognition' | 'spelling'>('recognition')
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([])
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState<boolean>(false)
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean>(false)

  // Spelling Phase State
  const [typedWord, setTypedWord] = useState<string>('')
  const [hasCheckedSpelling, setHasCheckedSpelling] = useState<boolean>(false)
  const [isSpellingCorrect, setIsSpellingCorrect] = useState<boolean>(false)

  // Post-Session Modal Flow State
  // Sequence: session completes → MicroExam → SessionFeedback → summary screen
  const [showMicroExam, setShowMicroExam] = useState<boolean>(false)
  const [showFeedback, setShowFeedback] = useState<boolean>(false)
  const [microExamVocabId, setMicroExamVocabId] = useState<string | null>(null)
  const [sessionFrozen, setSessionFrozen] = useState<boolean>(false)

  const userId = user?.id ?? 'demo-user'
  const currentLevel = profile?.currentLevel ?? 'A1'

  const dueCards = getDueCards(cards)
  const dueCount = dueCards.length

  useEffect(() => {
    void loadCards(userId)
  }, [loadCards, userId])

  const activeCard = sessionQueue[currentIndex]
  const wordData = activeCard ? getWordDisplayData(activeCard.vocabularyItemId) : null

  // Regenerate options & reset phase whenever moving to a new card
  useEffect(() => {
    if (wordData) {
      setStudyPhase('recognition')
      setSelectedOptionId(null)
      setHasAnswered(false)
      setIsCorrectSelection(false)
      setTypedWord('')
      setHasCheckedSpelling(false)
      setIsSpellingCorrect(false)
      const opts = generateQuizOptions(wordData, currentLevel)
      setQuizOptions(opts)

      // Automatically speak the English word
      void speakEnglish(wordData.word)

      // Start latency measurement for this card
      recordCardShown()
    }
  }, [activeCard?.vocabularyItemId, currentIndex, currentLevel, recordCardShown])

  const handleSelectOption = (option: QuizOption): void => {
    if (hasAnswered) return
    setSelectedOptionId(option.id)
    setHasAnswered(true)
    setIsCorrectSelection(option.isCorrect)

    // Repeat voice on answer
    if (wordData) {
      void speakEnglish(wordData.word)
    }
  }

  const handleGoToSpellingPhase = (): void => {
    setStudyPhase('spelling')
    setTypedWord('')
    setHasCheckedSpelling(false)
    setIsSpellingCorrect(false)
    if (wordData) {
      void speakEnglish(wordData.word)
    }
  }

  const handleCheckSpelling = (): void => {
    if (!wordData || !typedWord.trim()) return
    const target = wordData.word.trim().toLowerCase()
    const input = typedWord.trim().toLowerCase()
    const correct = input === target
    setHasCheckedSpelling(true)
    setIsSpellingCorrect(correct)

    if (correct) {
      void speakEnglish(wordData.word)
    }
  }

  const handleAdvance = (quality?: ReviewQuality): void => {
    const finalQuality: ReviewQuality =
      quality ?? (isCorrectSelection && isSpellingCorrect ? 5 : isCorrectSelection ? 4 : 1)
    setSelectedOptionId(null)
    setHasAnswered(false)
    setIsCorrectSelection(false)
    setTypedWord('')
    setHasCheckedSpelling(false)
    setIsSpellingCorrect(false)
    setStudyPhase('recognition')
    void submitReview(finalQuality)
  }

  // ── Post-session modal trigger ──────────────────────────────────────────────
  useEffect(() => {
    if (isCompleted && !sessionFrozen) {
      // Pick a word from the last session for the micro-exam (first card reviewed)
      const lastCard = sessionQueue[0]
      if (lastCard) {
        setMicroExamVocabId(lastCard.vocabularyItemId)
        setShowMicroExam(true)
      } else {
        setShowFeedback(true)
      }
      setSessionFrozen(true)
    }
  }, [isCompleted, sessionFrozen, sessionQueue])

  const handleMicroExamComplete = useCallback((): void => {
    setShowMicroExam(false)
    setShowFeedback(true)
  }, [])

  const handleFeedbackSubmit = useCallback((_level: FrictionLevel): void => {
    // TODO Sprint D: persist to SQLite via localFeedbackService
    setShowFeedback(false)
    setSessionFrozen(false)
  }, [])

  const handleFeedbackSkip = useCallback((): void => {
    setShowFeedback(false)
    setSessionFrozen(false)
  }, [])

  // ── Completion View ────────────────────────────────────────────────────────
  if (isCompleted) {
    const accuracy =
      sessionStats.cardsReviewed > 0
        ? Math.round((sessionStats.cardsCorrect / sessionStats.cardsReviewed) * 100)
        : 100

    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Post-session modals: MicroExam first, then SessionFeedback */}
        {microExamVocabId ? (
          <MicroExamModal
            visible={showMicroExam}
            vocabularyItemId={microExamVocabId}
            level={currentLevel}
            maxWeek={19}
            onComplete={handleMicroExamComplete}
          />
        ) : null}
        <SessionFeedbackModal
          visible={showFeedback}
          accuracy={accuracy}
          frictionCount={sessionStats.frictionCount}
          cardsReviewed={sessionStats.cardsReviewed}
          onSubmit={handleFeedbackSubmit}
          onSkip={handleFeedbackSkip}
        />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.completedContainer}>
            <View style={styles.completedIconBox}>
              <Ionicons name="trophy" size={48} color={colors.primary} />
            </View>
            <Text style={styles.completedTitle}>¡Sesión Completada!</Text>
            <Text style={styles.completedSubtitle}>
              Excelente entrenamiento de reconocimiento auditivo, significado y ortografía.
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
                  <Text style={styles.statLabel}>Aciertos</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  {sessionStats.frictionCount > 0 ? (
                    <>
                      <Text style={[styles.statNumber, { color: colors.warning }]}>
                        {sessionStats.frictionCount}
                      </Text>
                      <Text style={styles.statLabel}>Con fricción</Text>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.statNumber, { color: colors.success }]}>✨</Text>
                      <Text style={styles.statLabel}>Sin fricción</Text>
                    </>
                  )}
                </View>
              </View>
            </Card>

            {/* 1 + 2 + 1 CTA Hierarchy */}
            <View style={styles.completedActions}>
              {/* 1. Large Primary Action */}
              <Button
                title={
                  dueCount > 0
                    ? `Repasar SRS (${String(dueCount)} pendientes)`
                    : '➕ Aprender 10 Palabras Nuevas'
                }
                variant="primary"
                onPress={() => {
                  if (dueCount > 0) {
                    void startStudySession(userId, currentLevel)
                  } else {
                    void loadNextBatch(userId, currentLevel, 10)
                  }
                }}
                size="lg"
                style={styles.completedBtn}
              />

              {/* 2. Two Medium Buttons Side by Side */}
              <View style={styles.secondaryCtaRow}>
                <Button
                  title="🔁 Repetir lección"
                  variant="secondary"
                  onPress={() => {
                    void repeatCurrentLesson(userId)
                  }}
                  size="md"
                  style={styles.halfBtn}
                />

                <Button
                  title="🎯 Práctica libre"
                  variant="outline"
                  onPress={() => {
                    void startFreePracticeSession(userId, currentLevel)
                  }}
                  size="md"
                  style={styles.halfBtn}
                />
              </View>

              {/* 1. Subtle Link Button */}
              <Button
                title="Volver al Inicio"
                variant="ghost"
                onPress={() => {
                  resetSession()
                  router.replace('/(app)')
                }}
                size="sm"
                style={styles.subtleLinkBtn}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }


  // ── Session Intro View (When Queue is Empty) ───────────────────────────────
  if (!isSessionActive || !activeCard || !wordData) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Entrenamiento Diario</Text>
            <Text style={styles.subtitle}>
              Domina el vocabulario en dos fases: reconocimiento y escritura con voz nativa
            </Text>
          </View>

          <Card padding="lg" style={styles.sessionIntroCard}>
            <View style={styles.introHeader}>
              <View style={styles.introIcon}>
                <Ionicons name="sparkles" size={30} color={colors.primary} />
              </View>
              <View style={styles.introText}>
                <Text style={styles.introTitle}>Centro de Aprendizaje</Text>
                <Text style={styles.introSubtitle}>
                  Nivel {currentLevel} • Total en tu banco: {cards.length} palabras
                </Text>
              </View>
            </View>

            <View style={styles.featureHighlights}>
              <View style={styles.highlightItem}>
                <Ionicons name="volume-high" size={20} color={colors.primary} />
                <Text style={styles.highlightText}>
                  Audio nativo en inglés y fonética amigable en español
                </Text>
              </View>
              <View style={styles.highlightItem}>
                <Ionicons name="create-outline" size={20} color={colors.secondary} />
                <Text style={styles.highlightText}>
                  Práctica de escritura activa para fijar la ortografía
                </Text>
              </View>
              <View style={styles.highlightItem}>
                <Ionicons name="infinite-outline" size={20} color={colors.info} />
                <Text style={styles.highlightText}>
                  Sin bloqueos: avanza a tu propio ritmo cuando quieras
                </Text>
              </View>
            </View>

            {dueCount === 0 ? (
              <View style={styles.emptyIntroBox}>
                <Image
                  source={EMPTY_REVIEWS_IMG}
                  style={styles.emptyIntroImage}
                  resizeMode="cover"
                />
                <Text style={styles.emptyIntroTitle}>¡Sin repasos pendientes!</Text>
                <Text style={styles.emptyIntroSub}>
                  Has completado tus repasos de hoy. Aprende un nuevo lote de 10 palabras o haz práctica libre.
                </Text>
              </View>
            ) : null}

            {/* The 1 + 2 + 1 CTA Hierarchy */}
            <View style={styles.introActions}>
              {/* 1. Large Primary Button */}
              <Button
                title={
                  dueCount > 0
                    ? `Repasar SRS (${String(dueCount)} pendientes)`
                    : '➕ Aprender 10 Palabras Nuevas'
                }
                variant="primary"
                onPress={() => {
                  if (dueCount > 0) {
                    void startStudySession(userId, currentLevel)
                  } else {
                    void loadNextBatch(userId, currentLevel, 10)
                  }
                }}
                size="lg"
                style={styles.introBtn}
              />

              {/* 2. Two Medium Buttons Side by Side */}
              <View style={styles.secondaryCtaRow}>
                <Button
                  title="🔁 Repetir lección"
                  variant="secondary"
                  onPress={() => {
                    void repeatCurrentLesson(userId)
                  }}
                  size="md"
                  style={styles.halfBtn}
                />

                <Button
                  title="🎯 Práctica libre"
                  variant="outline"
                  onPress={() => {
                    void startFreePracticeSession(userId, currentLevel)
                  }}
                  size="md"
                  style={styles.halfBtn}
                />
              </View>

              {/* 1. Subtle Link Button */}
              <Button
                title="Volver al Inicio"
                variant="ghost"
                onPress={() => {
                  router.replace('/(app)')
                }}
                size="sm"
                style={styles.subtleLinkBtn}
              />
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // ── Active Challenge View (Phase 1 & Phase 2) ──────────────────────────────
  const total = sessionQueue.length
  const progressRatio = total > 0 ? (currentIndex + 1) / total : 0

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with Progress Bar */}
        <View style={styles.sessionHeader}>
          {/* Rescue Mode Banner — shown when pending reviews > 30 */}
          <RescueModeBanner pendingCount={dueCount} threshold={30} />
          <View style={styles.sessionHeaderTop}>
            <View style={styles.badgeRow}>
              <Badge label={`Nivel ${wordData.level}`} color={colors.primary} size="sm" />
              <Badge label="Repaso SRS" color={colors.success} size="sm" />
              <Badge
                label={studyPhase === 'recognition' ? 'Fase 1: Reconocimiento' : 'Fase 2: Escritura ✍️'}
                color={studyPhase === 'recognition' ? colors.secondary : colors.info}
                size="sm"
              />
            </View>
            <Text style={styles.counterText}>
              Palabra {currentIndex + 1} de {sessionQueue.length}
            </Text>
          </View>
          <ProgressBar
            progress={progressRatio}
            color={colors.primary}
            height={7}
            style={styles.sessionProgress}
          />
        </View>

        {/* ── FASE 1: RECONOCIMIENTO (OPCIÓN MÚLTIPLE) ─────────────────────── */}
        {studyPhase === 'recognition' ? (
          <>
            {/* English Challenge Card with Native Audio Button */}
            <Card padding="lg" style={styles.challengeCard}>
              <View style={styles.wordHeader}>
                <Text style={styles.partOfSpeechBadge}>
                  {wordData.partOfSpeech.toUpperCase()}
                </Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Escuchar pronunciación"
                  onPress={() => {
                    void speakEnglish(wordData.word)
                  }}
                  style={styles.speakerBtn}
                >
                  <Ionicons name="volume-high" size={22} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Large Clear English Word */}
              <Text style={styles.englishWord}>{wordData.word}</Text>

              {/* Spanish-Adapted Phonetic Guide */}
              <TouchableOpacity
                onPress={() => {
                  void speakEnglish(wordData.word)
                }}
                activeOpacity={0.8}
                style={styles.phoneticPill}
              >
                <Ionicons name="volume-medium-outline" size={18} color={colors.primary} />
                <Text style={styles.phoneticLabel}>Suena en español:</Text>
                <Text style={styles.phoneticValue}>[ {wordData.spanishPhonetic} ]</Text>
              </TouchableOpacity>
            </Card>

            {/* Multiple Choice Section */}
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

            {/* Immediate Feedback & Meaning Variations */}
            {hasAnswered ? (
              <View style={styles.feedbackSection}>
                {/* Banner */}
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
                      ? `Has identificado "${wordData.word}" con precisión.`
                      : `"${wordData.word}" significa "${wordData.translation}".`}
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
                      <Text style={styles.variationsTitle}>Variaciones de Uso Cotidiano:</Text>
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

                  {/* Usage Notes */}
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

                {/* Transition Button */}
                <View style={styles.actionControls}>
                  {isCorrectSelection ? (
                    <Button
                      title="Fase 2: Escribir la Palabra ✍️ →"
                      variant="primary"
                      onPress={handleGoToSpellingPhase}
                      size="lg"
                      style={styles.continueBtn}
                    />
                  ) : (
                    <Button
                      title="Entendido, continuar →"
                      variant="secondary"
                      onPress={() => {
                        handleAdvance(1)
                      }}
                      size="lg"
                      style={styles.continueBtn}
                    />
                  )}
                </View>
              </View>
            ) : null}
          </>
        ) : (
          /* ── FASE 2: FIJACIÓN POR ESCRITURA (SPELLING & DICTADO) ────────── */
          <View style={styles.spellingSection}>
            <Card padding="lg" style={styles.spellingCard}>
              <View style={styles.spellingPromptBox}>
                <Ionicons name="create" size={32} color={colors.primary} />
                <Text style={styles.spellingTitle}>Escribe la palabra en inglés</Text>
                <Text style={styles.spellingSubtitle}>
                  Fija la memoria ortográfica y muscular escribiéndola con tu teclado:
                </Text>
              </View>

              {/* Clue card */}
              <View style={styles.spellingClueBox}>
                <Text style={styles.spellingClueLabel}>Significado en español:</Text>
                <Text style={styles.spellingClueWord}>{wordData.translation}</Text>

                <TouchableOpacity
                  onPress={() => {
                    void speakEnglish(wordData.word)
                  }}
                  activeOpacity={0.8}
                  style={styles.listenAgainBtn}
                >
                  <Ionicons name="volume-high" size={20} color={colors.primary} />
                  <Text style={styles.listenAgainText}>
                    Escuchar pronunciación: [ {wordData.spanishPhonetic} ]
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Text Input */}
              <View style={styles.inputWrapper}>
                <TextInput
                  value={typedWord}
                  onChangeText={(val) => {
                    setTypedWord(val)
                    if (hasCheckedSpelling) {
                      setHasCheckedSpelling(false)
                    }
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                  placeholder="Escribe la palabra aquí..."
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.textInput,
                    hasCheckedSpelling && isSpellingCorrect && styles.textInputCorrect,
                    hasCheckedSpelling && !isSpellingCorrect && styles.textInputWrong,
                  ]}
                />
              </View>

              {/* Spelling Feedback Banner */}
              {hasCheckedSpelling ? (
                <View
                  style={[
                    styles.feedbackBanner,
                    isSpellingCorrect
                      ? styles.feedbackBannerSuccess
                      : styles.feedbackBannerConstructive,
                    { width: '100%', marginTop: spacing.md },
                  ]}
                >
                  <View style={styles.feedbackBannerHeader}>
                    <Ionicons
                      name={isSpellingCorrect ? 'checkmark-circle' : 'alert-circle'}
                      size={24}
                      color={isSpellingCorrect ? colors.primary : colors.warning}
                    />
                    <Text
                      style={[
                        styles.feedbackBannerTitle,
                        { color: isSpellingCorrect ? colors.primary : '#B45309' },
                      ]}
                    >
                      {isSpellingCorrect
                        ? '¡Ortografía Perfecta! 🌟'
                        : '¡Casi! Revisa las letras:'}
                    </Text>
                  </View>
                  <Text style={styles.feedbackBannerMessage}>
                    {isSpellingCorrect
                      ? `Has dominado "${wordData.word}" tanto en significado como en escritura.`
                      : `La forma correcta es "${wordData.word}". Escríbela nuevamente para fijarla.`}
                  </Text>
                </View>
              ) : null}

              {/* Action Buttons */}
              <View style={styles.spellingActions}>
                {!hasCheckedSpelling || !isSpellingCorrect ? (
                  <Button
                    title="Comprobar Escritura"
                    onPress={handleCheckSpelling}
                    disabled={typedWord.trim().length === 0}
                    size="lg"
                    style={styles.continueBtn}
                  />
                ) : (
                  <Button
                    title="Siguiente Palabra →"
                    variant="primary"
                    onPress={() => {
                      handleAdvance(5)
                    }}
                    size="lg"
                    style={styles.continueBtn}
                  />
                )}
              </View>
            </Card>
          </View>
        )}
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
  introActions: {
    gap: spacing.sm,
  },
  introBtn: {
    width: '100%',
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
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
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
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.xs,
  },
  partOfSpeechBadge: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  speakerBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  englishWord: {
    fontSize: 40,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginVertical: spacing.xs,
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
    marginTop: spacing.xs,
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
  spellingSection: {
    marginTop: spacing.xs,
  },
  spellingCard: {
    backgroundColor: colors.card,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  spellingPromptBox: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  spellingTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  spellingSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  spellingClueBox: {
    backgroundColor: colors.backgroundSubtle,
    padding: spacing.md,
    borderRadius: radius.md,
    width: '100%',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  spellingClueLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  spellingClueWord: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  listenAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginTop: spacing.xs,
  },
  listenAgainText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  inputWrapper: {
    width: '100%',
    marginTop: spacing.sm,
  },
  textInput: {
    width: '100%',
    height: 56,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  textInputCorrect: {
    borderColor: '#059669',
    backgroundColor: colors.primaryLight,
  },
  textInputWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  spellingActions: {
    width: '100%',
    marginTop: spacing.sm,
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
  secondaryCtaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  halfBtn: {
    flex: 1,
  },
  subtleLinkBtn: {
    marginTop: spacing.xs,
  },
  emptyIntroBox: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.cardHover,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyIntroImage: {
    width: '100%',
    height: 120,
  },
  emptyIntroTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  emptyIntroSub: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    lineHeight: 18,
  },
})

