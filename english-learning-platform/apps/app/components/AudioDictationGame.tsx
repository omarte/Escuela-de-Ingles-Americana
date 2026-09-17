import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, typography, radius, Badge, Button } from '@elp/ui'
import type { VocabularyItem } from '@elp/types'
import { speakEnglish } from '../lib/audio'
import { getSpanishPhonetic } from '../lib/phonetics'
import { shuffleArray } from '../lib/matchingCategories'
import { generateSpellingTip } from '../lib/spellingTips'
import type { TypingWordReviewItem } from './GamesModal'

export interface AudioDictationFinishData {
  completed: number
  total: number
  xp: number
  maxCombo: number
  reviewItems: TypingWordReviewItem[]
  failedItems: VocabularyItem[]
  secondsElapsed: number
}

interface AudioDictationGameProps {
  wordsPool: readonly VocabularyItem[]
  onFinish: (data: AudioDictationFinishData) => void
  onExit: () => void
}

interface DictationWordItem {
  vocab: VocabularyItem
  userTyped: string
  isCorrect: boolean | null
  usedHint: boolean
  tip: string
}

export function AudioDictationGame({
  wordsPool,
  onFinish,
  onExit,
}: AudioDictationGameProps): React.JSX.Element {
  const [roundWords, setRoundWords] = useState<VocabularyItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [typedInput, setTypedInput] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [speechRate, setSpeechRate] = useState<number>(0.85) // 0.85 natural, 0.72 lento
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [totalXp, setTotalXp] = useState(0)
  const [history, setHistory] = useState<DictationWordItem[]>([])

  const pulseAnim = useRef(new Animated.Value(1)).current
  const inputRef = useRef<TextInput>(null)
  const startTimeRef = useRef<number>(Date.now())

  // 1. Inicializar 5 palabras aleatorias para la ronda
  useEffect(() => {
    if (wordsPool.length > 0) {
      const selected = shuffleArray(wordsPool).slice(0, 5)
      setRoundWords(selected)
      setCurrentIndex(0)
      setTypedInput('')
      setIsSubmitted(false)
      setShowHint(false)
      setCombo(0)
      setMaxCombo(0)
      setTotalXp(0)
      setHistory([])
      startTimeRef.current = Date.now()
    }
  }, [wordsPool])

  const currentWord = roundWords[currentIndex]

  // 2. Reproducir audio automáticamente al cambiar de palabra
  useEffect(() => {
    if (currentWord) {
      void speakCurrentWord(speechRate)
      setTypedInput('')
      setIsSubmitted(false)
      setShowHint(false)
      // Focus suave al input
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [currentIndex, currentWord])

  const speakCurrentWord = async (rate: number): Promise<void> => {
    if (!currentWord) return
    triggerPulse()
    await speakEnglish(currentWord.word, rate)
  }

  const triggerPulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.15, duration: 150, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start()
  }

  // 3. Comprobar ortografía
  const handleCheckSpelling = (): void => {
    if (!currentWord || isSubmitted) return
    const cleanTyped = typedInput.trim().toLowerCase()
    const cleanTarget = currentWord.word.trim().toLowerCase()
    const isMatch = cleanTyped === cleanTarget

    const tip = generateSpellingTip(currentWord.word, typedInput, currentWord.translation)

    let earnedXp = 0
    if (isMatch) {
      const basePoints = showHint ? 15 : 25
      const comboBonus = combo * 5
      earnedXp = basePoints + comboBonus
      setTotalXp((prev) => prev + earnedXp)
      const nextCombo = combo + 1
      setCombo(nextCombo)
      if (nextCombo > maxCombo) setMaxCombo(nextCombo)
      // Sonido de confirmación con audio de la palabra
      void speakCurrentWord(0.85)
    } else {
      setCombo(0)
    }

    const itemRecord: DictationWordItem = {
      vocab: currentWord,
      userTyped: typedInput.trim(),
      isCorrect: isMatch,
      usedHint: showHint,
      tip,
    }

    setHistory((prev) => [...prev, itemRecord])
    setIsSubmitted(true)
  }

  // 4. Avanzar a la siguiente palabra o finalizar
  const handleNextWord = (): void => {
    if (currentIndex + 1 < roundWords.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      // Fin de la ronda
      const secondsElapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
      const completedCount = history.filter((h) => h.isCorrect).length

      const reviewItems: TypingWordReviewItem[] = history.map((h) => ({
        id: h.vocab.id,
        word: h.vocab.word,
        translation: h.vocab.translation,
        userTyped: h.userTyped,
        isCorrect: Boolean(h.isCorrect),
        tip: h.tip,
      }))

      const failedItems: VocabularyItem[] = history
        .filter((h) => !h.isCorrect)
        .map((h) => h.vocab)

      onFinish({
        completed: completedCount,
        total: roundWords.length,
        xp: totalXp,
        maxCombo,
        reviewItems,
        failedItems,
        secondsElapsed,
      })
    }
  }

  if (!currentWord) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Preparando audio y vocabulario...</Text>
      </View>
    )
  }

  const phonetic = getSpanishPhonetic(currentWord.word)
  const isCorrect = history[currentIndex]?.isCorrect ?? false

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onExit} style={styles.exitBtn} accessibilityLabel="Salir del dictado">
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.progressPill}>
            <Text style={styles.progressPillText}>
              Palabra {currentIndex + 1} de {roundWords.length}
            </Text>
          </View>

          <View style={styles.statsRight}>
            <Text style={styles.xpBadge}>+{totalXp} XP</Text>
            {combo > 1 ? <Text style={styles.comboBadge}>x{combo} 🔥</Text> : null}
          </View>
        </View>

        {/* Level & Phonics Tag */}
        <View style={styles.tagsRow}>
          <Badge label={`NIVEL ${currentWord.level}`} color="#2563EB" size="sm" />
          <Badge label={currentWord.topic.toUpperCase()} color="#64748B" size="sm" />
          <Badge label={`${currentWord.word.length} LETRAS`} color="#059669" size="sm" />
        </View>

        {/* Central Audio Stimulus Card */}
        <View style={styles.audioCard}>
          <Text style={styles.audioCardEyebrow}>DICTADO AUDITIVO 🎧</Text>
          <Text style={styles.audioCardTitle}>Escucha con atención y escribe la palabra en inglés</Text>

          {/* Big Animated Speaker Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={styles.mainSpeakerBtn}
              onPress={() => void speakCurrentWord(speechRate)}
              accessibilityLabel="Reproducir audio de la palabra"
            >
              <Ionicons name="volume-high" size={42} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>

          {/* Speed Rate Toggles */}
          <View style={styles.speedControlsRow}>
            <TouchableOpacity
              style={[styles.speedChip, speechRate === 0.85 && styles.speedChipActive]}
              onPress={() => {
                setSpeechRate(0.85)
                void speakCurrentWord(0.85)
              }}
            >
              <Ionicons name="play" size={12} color={speechRate === 0.85 ? '#FFFFFF' : '#475569'} />
              <Text style={[styles.speedChipText, speechRate === 0.85 && styles.speedChipTextActive]}>
                Natural (1.0x)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.speedChip, speechRate === 0.72 && styles.speedChipActive]}
              onPress={() => {
                setSpeechRate(0.72)
                void speakCurrentWord(0.72)
              }}
            >
              <Text style={{ fontSize: 13 }}>🐢</Text>
              <Text style={[styles.speedChipText, speechRate === 0.72 && styles.speedChipTextActive]}>
                Lento Fonético (0.7x)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Word Length Blueprint Indicator */}
          <View style={styles.letterSlotsRow}>
            {currentWord.word.split('').map((char, i) => (
              <View
                key={i}
                style={[
                  styles.letterSlot,
                  isSubmitted && isCorrect && styles.letterSlotCorrect,
                  isSubmitted && !isCorrect && styles.letterSlotWrong,
                ]}
              >
                <Text style={styles.letterSlotText}>
                  {isSubmitted ? char : typedInput[i] ? typedInput[i] : '•'}
                </Text>
              </View>
            ))}
          </View>

          {/* Optional Hint (Spanish Meaning) */}
          {showHint ? (
            <View style={styles.revealedHintBox}>
              <Text style={styles.hintTranslationLabel}>Significado en español:</Text>
              <Text style={styles.hintTranslationText}>"{currentWord.translation}"</Text>
              <Text style={styles.hintPhoneticText}>Guía fonética: /{phonetic}/</Text>
            </View>
          ) : !isSubmitted ? (
            <TouchableOpacity
              style={styles.showHintBtn}
              onPress={() => setShowHint(true)}
            >
              <Ionicons name="bulb-outline" size={15} color="#D97706" />
              <Text style={styles.showHintBtnText}>Ver pista en español (-10 XP)</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Input Field Section */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Tu respuesta en inglés:</Text>
          <View
            style={[
              styles.inputWrapper,
              isSubmitted && isCorrect && styles.inputWrapperCorrect,
              isSubmitted && !isCorrect && styles.inputWrapperWrong,
            ]}
          >
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              value={typedInput}
              onChangeText={setTypedInput}
              placeholder="Escribe la palabra que escuchaste..."
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              editable={!isSubmitted}
              onSubmitEditing={handleCheckSpelling}
              returnKeyType={isSubmitted ? 'next' : 'done'}
            />
            {typedInput.length > 0 && !isSubmitted ? (
              <TouchableOpacity onPress={() => setTypedInput('')} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Feedback Card after Submission */}
          {isSubmitted ? (
            <View
              style={[
                styles.feedbackResultBox,
                isCorrect ? styles.feedbackResultCorrect : styles.feedbackResultWrong,
              ]}
            >
              <View style={styles.feedbackHeaderRow}>
                <Ionicons
                  name={isCorrect ? 'checkmark-circle' : 'alert-circle'}
                  size={24}
                  color={isCorrect ? '#059669' : '#DC2626'}
                />
                <Text style={[styles.feedbackResultTitle, isCorrect ? { color: '#059669' } : { color: '#DC2626' }]}>
                  {isCorrect ? '¡Ortografía Correcta! 🏆' : '¡Casi! Revisa el detalle 🎯'}
                </Text>
              </View>

              <Text style={styles.feedbackCorrectWord}>
                Palabra correcta: <Text style={{ fontWeight: 'bold' }}>{currentWord.word}</Text>
              </Text>
              <Text style={styles.feedbackTranslation}>
                Significado: {currentWord.translation} • /{phonetic}/
              </Text>

              {currentWord.example ? (
                <View style={styles.feedbackExampleBox}>
                  <Text style={styles.feedbackExampleEn}>"{currentWord.example}"</Text>
                  {currentWord.exampleTranslation ? (
                    <Text style={styles.feedbackExampleEs}>{currentWord.exampleTranslation}</Text>
                  ) : null}
                </View>
              ) : null}

              {!isCorrect ? (
                <View style={styles.spellingTipBox}>
                  <Text style={styles.spellingTipTitle}>💡 Consejo Ortográfico:</Text>
                  <Text style={styles.spellingTipText}>
                    {generateSpellingTip(currentWord.word, typedInput, currentWord.translation)}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* Action Button */}
          {!isSubmitted ? (
            <Button
              title="Comprobar Ortografía"
              variant="primary"
              size="lg"
              onPress={handleCheckSpelling}
              disabled={typedInput.trim().length === 0}
              style={styles.actionBtn}
            />
          ) : (
            <Button
              title={currentIndex + 1 < roundWords.length ? 'Siguiente Palabra ➔' : 'Ver Resultados 🏆'}
              variant="primary"
              size="lg"
              onPress={handleNextWord}
              style={styles.actionBtn}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: typography.sizes.sm,
    color: '#64748B',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  exitBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  progressPillText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#1D4ED8',
  },
  statsRight: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
  },
  xpBadge: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  comboBadge: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#D97706',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  audioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: spacing.md,
  },
  audioCardEyebrow: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#2563EB',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  audioCardTitle: {
    fontSize: typography.sizes.xs,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  mainSpeakerBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: spacing.md,
  },
  speedControlsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  speedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  speedChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  speedChipText: {
    fontSize: 11,
    fontWeight: typography.weights.medium,
    color: '#475569',
  },
  speedChipTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
  },
  letterSlotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  letterSlot: {
    width: 32,
    height: 38,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterSlotCorrect: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  letterSlotWrong: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  letterSlotText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: '#1E293B',
  },
  showHintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: spacing.xs,
  },
  showHintBtnText: {
    fontSize: 11,
    fontWeight: typography.weights.medium,
    color: '#B45309',
  },
  revealedHintBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: spacing.xs,
    width: '100%',
  },
  hintTranslationLabel: {
    fontSize: 10,
    color: '#92400E',
  },
  hintTranslationText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: '#78350F',
  },
  hintPhoneticText: {
    fontSize: 11,
    color: '#B45309',
    fontStyle: 'italic',
    marginTop: 2,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  inputLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#334155',
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  inputWrapperCorrect: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  inputWrapperWrong: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: typography.sizes.md,
    color: '#0F172A',
    fontWeight: typography.weights.semibold,
  },
  clearBtn: {
    padding: 4,
  },
  feedbackResultBox: {
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  feedbackResultCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  feedbackResultWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECDD3',
  },
  feedbackHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  feedbackResultTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  feedbackCorrectWord: {
    fontSize: typography.sizes.xs + 1,
    color: '#1E293B',
  },
  feedbackTranslation: {
    fontSize: typography.sizes.xs,
    color: '#64748B',
    marginTop: 2,
  },
  feedbackExampleBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: radius.sm,
    padding: spacing.xs,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  feedbackExampleEn: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#0F172A',
  },
  feedbackExampleEs: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  spellingTipBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: radius.sm,
    padding: spacing.xs,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  spellingTipTitle: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#92400E',
  },
  spellingTipText: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 2,
    lineHeight: 16,
  },
  actionBtn: {
    width: '100%',
  },
})
