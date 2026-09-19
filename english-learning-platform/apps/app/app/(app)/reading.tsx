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
  Alert,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, typography, Card, Badge, Button } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import { getReadingPassagesByLevel, getVocabularyById } from '@elp/content'
import { canAccessWeek } from '@elp/monetization'
import type { CEFRLevel, ReadingPassage, VocabularyItem, WordMapping } from '@elp/types'
import { usePurchases } from '../../hooks/usePurchases'
import { EMPTY_READINGS_IMG } from '../../lib/assets'
import { AppScreenHeader } from '../../components/AppScreenHeader'
import { useSRSStore } from '../../stores/useSRSStore'
import { speakEnglish } from '../../lib/audio'

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2']

const LEVEL_COLORS: Record<CEFRLevel, { primary: string; light: string; border: string }> = {
  A1: { primary: '#059669', light: '#ECFDF5', border: '#A7F3D0' },
  A2: { primary: '#0284C7', light: '#F0F9FF', border: '#BAE6FD' },
  B1: { primary: '#7C3AED', light: '#F5F3FF', border: '#DDD6FE' },
  B2: { primary: '#D97706', light: '#FFFBEB', border: '#FDE68A' },
  C1: { primary: '#2563EB', light: '#EFF6FF', border: '#BFDBFE' },
  C2: { primary: '#0D9488', light: '#F0FDFA', border: '#99F6E4' },
  D1: { primary: '#EA580C', light: '#FFF7ED', border: '#FFEDD5' },
  D2: { primary: '#9333EA', light: '#FAF5FF', border: '#E9D5FF' },
}

export default function ReadingScreen(): React.JSX.Element {
  const router = useRouter()
  const { isPro } = usePurchases()
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
    if (level !== 'A1' && !isPro) {
      Alert.alert(
        `Nivel ${level} Exclusivo Plan Pro 🔒`,
        `Las lecturas graduadas del nivel ${level} requieren Membresía Pro activa. Tu primera semana de A1 (7 días de prueba) es 100% gratis. ¡Desbloquea el currículo completo para acceder a todos los niveles!`,
        [
          { text: 'Cerrar', style: 'cancel' },
          { text: 'Ver Planes Pro 🚀', onPress: () => router.push('/(app)/paywall') },
        ],
      )
      return
    }
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

  const scrollRef = React.useRef<ScrollView>(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [activeWordItem, setActiveWordItem] = useState<VocabularyItem | null>(null)
  const [activeMappingKey, setActiveMappingKey] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResultsModal, setShowResultsModal] = useState(false)

  const cards = useSRSStore((state) => state.cards)

  const totalQuestions = selectedPassage.comprehensionQuestions?.length ?? 0
  const answeredQuestions = Object.keys(userAnswers).length
  const correctAnswersCount = useMemo(() => {
    if (!selectedPassage.comprehensionQuestions) return 0
    return selectedPassage.comprehensionQuestions.reduce((acc, q, idx) => {
      return userAnswers[idx] === q.correctOptionIndex ? acc + 1 : acc
    }, 0)
  }, [selectedPassage.comprehensionQuestions, userAnswers])

  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 100
  const xpEarned = totalQuestions > 0 ? 40 + correctAnswersCount * 20 : 50

  // Map vocabularyId -> 'mastered' (interval >= 21d) | 'learning' (1-20d) | 'new' (0d / not reviewed)
  const srsStatusMap = useMemo(() => {
    const map = new Map<string, 'mastered' | 'learning' | 'new'>()
    for (const c of cards) {
      if (c.interval >= 21) {
        map.set(c.vocabularyItemId, 'mastered')
      } else if (c.interval > 0 || c.reps > 0) {
        map.set(c.vocabularyItemId, 'learning')
      } else {
        map.set(c.vocabularyItemId, 'new')
      }
    }
    return map
  }, [cards])

  const passageIndex = passages.findIndex((p) => p.id === selectedPassage.id)
  const currentPassageNum = passageIndex >= 0 ? passageIndex + 1 : 1
  const totalPassages = passages.length
  const progressPercent =
    totalPassages > 0 ? Math.round((currentPassageNum / totalPassages) * 100) : 0

  const wordCount = useMemo(
    () => selectedPassage.text.split(/\s+/).filter(Boolean).length,
    [selectedPassage.text],
  )
  const estimatedReadMinutes = Math.max(1, Math.ceil(wordCount / 120))

  const knownPercent = useMemo(() => {
    if (!selectedPassage.vocabularyIds.length) return 100
    const count = selectedPassage.vocabularyIds.filter((id) => {
      const s = srsStatusMap.get(id)
      return s === 'mastered' || s === 'learning'
    }).length
    return Math.round((count / selectedPassage.vocabularyIds.length) * 100)
  }, [selectedPassage.vocabularyIds, srsStatusMap])

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
    setShowResultsModal(false)
  }

  const hasNextPassage = passageIndex >= 0 && passageIndex < passages.length - 1

  const handleNextPassage = (): void => {
    if (hasNextPassage) {
      const nextPassage = passages[passageIndex + 1]
      if (nextPassage) {
        handleSelectPassage(nextPassage)
        scrollRef.current?.scrollTo({ y: 0, animated: true })
      }
    }
  }

  const handleRetryQuiz = (): void => {
    setUserAnswers({})
    setIsCompleted(false)
    setShowResultsModal(false)
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
            const srsStatus = matched.vocabularyId
              ? (srsStatusMap.get(matched.vocabularyId) ?? 'new')
              : 'new'

            return (
              <Text
                key={`tok-${isSpanish ? 'es' : 'en'}-${String(index)}`}
                accessibilityRole="button"
                accessibilityLabel={`Ver significado y escuchar ${token}`}
                onPress={() => {
                  setActiveMappingKey(matched.en.toLowerCase())
                  if (vocItem) {
                    setActiveWordItem(vocItem)
                    void speakEnglish(vocItem.word)
                  }
                }}
                style={[
                  styles.highlightedWord,
                  srsStatus === 'mastered' && styles.wordMastered,
                  srsStatus === 'learning' && styles.wordLearning,
                  srsStatus === 'new' && styles.wordNew,
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
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
              const isLocked = !canAccessWeek(passage.level, passage.week, isPro)
              return (
                <TouchableOpacity
                  key={passage.id}
                  onPress={() => {
                    handleSelectPassage(passage)
                  }}
                  style={[
                    styles.selectorChip,
                    isSelected && styles.selectorChipActive,
                    isLocked && { opacity: 0.75, borderColor: '#F59E0B' },
                  ]}
                >
                  <Text
                    style={[styles.selectorChipText, isSelected && styles.selectorChipTextActive]}
                  >
                    {isLocked ? '🔒 ' : ''}{passage.title}
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
        ) : !canAccessWeek(selectedPassage.level, selectedPassage.week, isPro) ? (
          <Card padding="lg" highlighted style={styles.readerCard}>
            <View style={{ alignItems: 'center', padding: 24 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Ionicons name="lock-closed" size={30} color="#D97706" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary, textAlign: 'center', marginBottom: 8 }}>
                Lectura Exclusiva Plan Pro
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 20, maxWidth: 420 }}>
                Esta lectura contextual pertenece a la {selectedPassage.level} (Semana {selectedPassage.week}). Tu primera semana de A1 (7 días de prueba) es 100% gratuita. Para continuar con lecturas contextuales hacia el hito de las 8 semanas, desbloquea tu Membresía Pro.
              </Text>
              <Button
                title="Desbloquear Membresía Pro 🚀"
                variant="primary"
                size="md"
                onPress={() => router.push('/(app)/paywall')}
              />
            </View>
          </Card>
        ) : (
          <>
            {/* Active Passage Reader Card */}
            <Card padding="lg" highlighted style={styles.readerCard}>
              {/* Level Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeaderRow}>
                  <Text style={styles.progressLabel}>
                    Lectura {currentPassageNum} de {totalPassages} de Nivel {selectedLevel}
                  </Text>
                  <Text style={styles.progressValue}>{progressPercent}%</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                </View>
              </View>

              {/* Passage Metadata Badges */}
              <View style={styles.metadataBar}>
                <View style={styles.metaChip}>
                  <Ionicons name="time-outline" size={13} color="#0D9488" />
                  <Text style={styles.metaChipText}>{estimatedReadMinutes} min</Text>
                </View>
                <View style={styles.metaChip}>
                  <Ionicons name="school-outline" size={13} color="#2563EB" />
                  <Text style={styles.metaChipText}>{knownPercent}% familiar</Text>
                </View>
                <View style={styles.metaChip}>
                  <Ionicons name="flash-outline" size={13} color="#D97706" />
                  <Text style={styles.metaChipText}>Dif. {selectedPassage.difficulty}/5</Text>
                </View>
                <View style={styles.metaChip}>
                  <Ionicons name="text-outline" size={13} color="#64748B" />
                  <Text style={styles.metaChipText}>{wordCount} palabras</Text>
                </View>
              </View>

              <View style={styles.passageHeader}>
                <Text style={styles.passageTitle}>{selectedPassage.title}</Text>
                <View style={styles.badgeRow}>
                  <Badge label={selectedPassage.level} color={colors.primary} size="sm" />
                  <Badge
                    label={`Semana ${String(selectedPassage.week)}`}
                    color={colors.secondary}
                    size="sm"
                  />
                </View>
              </View>

              {/* Semantic SRS Pedagogical Legend */}
              <View style={styles.srsLegendBar}>
                <View style={styles.srsLegendItem}>
                  <View style={[styles.srsDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.srsLegendText}>Dominada (≥21d)</Text>
                </View>
                <View style={styles.srsLegendItem}>
                  <View style={[styles.srsDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.srsLegendText}>En aprendizaje</Text>
                </View>
                <View style={styles.srsLegendItem}>
                  <View style={[styles.srsDot, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.srsLegendText}>Nueva</Text>
                </View>
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

        {/* Reading Completion and Results Section */}
        {isCompleted ? (
          <Card padding="lg" highlighted style={styles.resultsCard}>
            <View style={styles.resultsHeader}>
              <View style={styles.resultsTrophyBadge}>
                <Ionicons name="trophy" size={28} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultsTitle}>¡Lectura Completada!</Text>
                <Text style={styles.resultsSubtitle}>
                  {scorePercentage === 100
                    ? '¡Puntaje perfecto! Dominio total del contexto.'
                    : scorePercentage >= 60
                    ? '¡Gran trabajo de comprensión y asimilación!'
                    : '¡Buen intento! Te recomendamos repasar las palabras clave.'}
                </Text>
              </View>
            </View>

            <View style={styles.resultsStatsRow}>
              <View style={styles.resultsStatBox}>
                <Text style={styles.resultsStatNumber}>
                  {correctAnswersCount} / {totalQuestions}
                </Text>
                <Text style={styles.resultsStatLabel}>Aciertos ({scorePercentage}%)</Text>
              </View>
              <View style={styles.resultsStatBox}>
                <Text style={[styles.resultsStatNumber, { color: '#059669' }]}>+{xpEarned} XP</Text>
                <Text style={styles.resultsStatLabel}>Puntos Ganados</Text>
              </View>
              <View style={styles.resultsStatBox}>
                <Text style={[styles.resultsStatNumber, { color: '#2563EB' }]}>{wordCount}</Text>
                <Text style={styles.resultsStatLabel}>Palabras Leídas</Text>
              </View>
            </View>

            <View style={styles.resultsActionButtons}>
              {hasNextPassage ? (
                <Button
                  title="Siguiente Lectura ➔"
                  variant="primary"
                  size="lg"
                  onPress={handleNextPassage}
                  style={{ flex: 1 }}
                />
              ) : null}
              <Button
                title="Repetir Preguntas 🔄"
                variant={hasNextPassage ? 'outline' : 'primary'}
                size="lg"
                onPress={handleRetryQuiz}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        ) : (
          <Button
            title={
              totalQuestions > 0 && answeredQuestions === totalQuestions
                ? '🎉 Completar y Ver Resultados'
                : 'Marcar Lectura como Completada'
            }
            variant="primary"
            size="lg"
            onPress={() => {
              setIsCompleted(true)
              setShowResultsModal(true)
            }}
            style={styles.completeBtn}
            icon={<Ionicons name="checkmark-done-outline" size={20} color={colors.textPrimary} />}
          />
        )}
        </>
        )}

        {/* Reading Completion Celebration Modal */}
        <Modal
          visible={showResultsModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowResultsModal(false)}
        >
          <Pressable style={styles.resultsModalOverlay} onPress={() => setShowResultsModal(false)}>
            <Pressable style={styles.resultsModalCard} onPress={(e) => e.stopPropagation()}>
              <View style={styles.resultsModalIconContainer}>
                <Ionicons name="sparkles" size={36} color="#059669" />
              </View>

              <Text style={styles.resultsModalTitle}>¡Misión Cumplida! 🎓</Text>
              <Text style={styles.resultsModalPassageName}>"{selectedPassage.title}"</Text>

              <View style={styles.resultsModalScorePill}>
                <Ionicons name="checkmark-circle" size={18} color="#059669" />
                <Text style={styles.resultsModalScoreText}>
                  {correctAnswersCount} de {totalQuestions} respuestas correctas ({scorePercentage}%)
                </Text>
              </View>

              <View style={styles.resultsModalRewardBox}>
                <View style={styles.resultsModalRewardItem}>
                  <Text style={styles.resultsModalRewardValue}>+{xpEarned} XP</Text>
                  <Text style={styles.resultsModalRewardLabel}>Experiencia Académica</Text>
                </View>
                <View style={styles.resultsModalRewardDivider} />
                <View style={styles.resultsModalRewardItem}>
                  <Text style={styles.resultsModalRewardValue}>{estimatedReadMinutes} min</Text>
                  <Text style={styles.resultsModalRewardLabel}>Tiempo en Contexto</Text>
                </View>
              </View>

              <View style={styles.resultsModalButtonsContainer}>
                {hasNextPassage ? (
                  <Button
                    title="Siguiente Lectura ➔"
                    variant="primary"
                    size="lg"
                    onPress={() => {
                      setShowResultsModal(false)
                      handleNextPassage()
                    }}
                    style={{ width: '100%', marginBottom: spacing.xs }}
                  />
                ) : null}
                <Button
                  title="Revisar Texto y Vocabulario"
                  variant="outline"
                  size="md"
                  onPress={() => setShowResultsModal(false)}
                  style={{ width: '100%' }}
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Word Detail Slide-Up Bottom Sheet */}
        <Modal
          visible={activeWordItem !== null}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setActiveWordItem(null)
          }}
        >
          <Pressable
            style={styles.bottomSheetOverlay}
            onPress={() => setActiveWordItem(null)}
          >
            <Pressable
              style={styles.bottomSheetContent}
              onPress={(e) => e.stopPropagation()}
            >
              {activeWordItem ? (
                <>
                  <View style={styles.bottomSheetDragHandle} />

                  <View style={styles.modalHeader}>
                    <View style={styles.modalHeaderBadges}>
                      <Badge label={activeWordItem.level} color={colors.primary} size="sm" />
                      <Badge
                        label={activeWordItem.partOfSpeech}
                        color={colors.textSecondary}
                        backgroundColor={colors.cardHover}
                        size="sm"
                      />
                      {(() => {
                        const status = srsStatusMap.get(activeWordItem.id) ?? 'new'
                        if (status === 'mastered') {
                          return <Badge label="✓ Dominada" color="#059669" backgroundColor="#ECFDF5" size="sm" />
                        }
                        if (status === 'learning') {
                          return <Badge label="⚡ En repaso" color="#D97706" backgroundColor="#FEF3C7" size="sm" />
                        }
                        return <Badge label="✨ Nueva" color="#2563EB" backgroundColor="#EFF6FF" size="sm" />
                      })()}
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setActiveWordItem(null)
                      }}
                      style={styles.modalCloseBtn}
                      accessibilityLabel="Cerrar detalle"
                    >
                      <Ionicons name="close" size={22} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.wordAudioRow}>
                    <View style={styles.wordTitleContainer}>
                      <Text style={styles.modalWord}>{activeWordItem.word}</Text>
                      {activeWordItem.pronunciation ? (
                        <View style={styles.phoneticChip}>
                          <Ionicons name="mic-outline" size={12} color={colors.textSecondary} />
                          <Text style={styles.modalPhonetic}>{activeWordItem.pronunciation}</Text>
                        </View>
                      ) : null}
                    </View>
                    <TouchableOpacity
                      style={styles.audioPlayButton}
                      onPress={() => void speakEnglish(activeWordItem.word)}
                      accessibilityLabel="Escuchar pronunciación nativa"
                    >
                      <Ionicons name="volume-high" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalDivider} />

                  <Text style={styles.modalTranslationLabel}>Significado en español:</Text>
                  <Text style={styles.modalTranslation}>{activeWordItem.translation}</Text>

                  {activeWordItem.example ? (
                    <View style={styles.modalExampleBox}>
                      <Text style={styles.modalExampleLabel}>En contexto:</Text>
                      <Text style={styles.modalExampleEn}>"{activeWordItem.example}"</Text>
                      {activeWordItem.exampleTranslation ? (
                        <Text style={styles.modalExampleEs}>
                          {activeWordItem.exampleTranslation}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}

                  {/* Scientific Retention Pill */}
                  <View style={styles.srsStatusInfoBox}>
                    <Ionicons
                      name={
                        (srsStatusMap.get(activeWordItem.id) ?? 'new') === 'mastered'
                          ? 'shield-checkmark'
                          : (srsStatusMap.get(activeWordItem.id) ?? 'new') === 'learning'
                          ? 'timer-outline'
                          : 'sparkles'
                      }
                      size={15}
                      color={
                        (srsStatusMap.get(activeWordItem.id) ?? 'new') === 'mastered'
                          ? '#059669'
                          : (srsStatusMap.get(activeWordItem.id) ?? 'new') === 'learning'
                          ? '#D97706'
                          : '#2563EB'
                      }
                    />
                    <Text style={styles.srsStatusInfoText}>
                      {(() => {
                        const status = srsStatusMap.get(activeWordItem.id) ?? 'new'
                        if (status === 'mastered') {
                          return 'Retención consolidada a largo plazo (intervalo ≥ 21 días).'
                        }
                        if (status === 'learning') {
                          return 'En afianzamiento activo — programada para tu próximo repaso SRS.'
                        }
                        return 'Vocabulario nuevo introducido en esta lectura.'
                      })()}
                    </Text>
                  </View>

                  <View style={styles.modalActionButtonsRow}>
                    <Button
                      title="Pronunciar 🔊"
                      variant="outline"
                      size="md"
                      onPress={() => void speakEnglish(activeWordItem.word)}
                      style={{ flex: 1 }}
                    />
                    <Button
                      title="Continuar"
                      variant="primary"
                      size="md"
                      onPress={() => setActiveWordItem(null)}
                      style={{ flex: 1 }}
                    />
                  </View>
                </>
              ) : null}
            </Pressable>
          </Pressable>
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
    paddingBottom: 140,
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
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  progressValue: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  metadataBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.cardHover,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaChipText: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  passageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  passageTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  srsLegendBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.backgroundSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  srsLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  srsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  srsLegendText: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
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
  wordMastered: {
    backgroundColor: '#ECFDF5',
    color: '#047857',
    borderBottomWidth: 1.5,
    borderBottomColor: '#10B981',
  },
  wordLearning: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F59E0B',
  },
  wordNew: {
    backgroundColor: '#EFF6FF',
    color: '#1E40AF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#3B82F6',
  },
  highlightedWordActive: {
    color: '#FFFFFF',
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
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    width: '100%',
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
  bottomSheetDragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  modalHeaderBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  modalCloseBtn: {
    padding: spacing.xs,
  },
  wordAudioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  wordTitleContainer: {
    flex: 1,
  },
  modalWord: {
    fontSize: 26,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  phoneticChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  modalPhonetic: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  audioPlayButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
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
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginTop: 2,
  },
  modalExampleBox: {
    backgroundColor: colors.cardHover,
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  modalExampleLabel: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  modalExampleEn: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  modalExampleEs: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },
  srsStatusInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.backgroundSubtle,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.md,
  },
  srsStatusInfoText: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textSecondary,
    flex: 1,
  },
  modalActionButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
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
  resultsCard: {
    marginTop: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: '#059669',
    backgroundColor: colors.card,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  resultsTrophyBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  resultsSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  resultsStatsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.cardHover,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  resultsStatBox: {
    flex: 1,
    alignItems: 'center',
  },
  resultsStatNumber: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  resultsStatLabel: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  resultsActionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  resultsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  resultsModalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  resultsModalIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  resultsModalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  resultsModalPassageName: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  resultsModalScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: spacing.md,
  },
  resultsModalScoreText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: '#059669',
  },
  resultsModalRewardBox: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.cardHover,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  resultsModalRewardItem: {
    flex: 1,
    alignItems: 'center',
  },
  resultsModalRewardValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: '#059669',
  },
  resultsModalRewardLabel: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  resultsModalRewardDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  resultsModalButtonsContainer: {
    width: '100%',
    gap: spacing.xs,
  },
})
