import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
  Image,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, typography, radius, Badge } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import type { CEFRLevel, VocabularyItem } from '@elp/types'
import { speakEnglish, speakSpanish } from '../lib/audio'
import { generateQuizOptions, type QuizOption } from '../lib/distractors'
import { getWordDisplayData } from '../lib/vocabulary'
import { CARD_BACK_IMG } from '../lib/assets'
import {
  MATCHING_CATEGORIES,
  SRS_WEEK_CATEGORY_ID,
  getCategoryPairs,
  shuffleArray,
  type MatchingPair,
} from '../lib/matchingCategories'

import { AudioDictationGame, type AudioDictationFinishData } from './AudioDictationGame'

export type GameType =
  | 'typing_rush'
  | 'typing_rush_failed'
  | 'lightning_quiz'
  | 'memory_match'
  | 'word_match'
  | 'audio_dictation'
  | 'audio_dictation_failed'
  | null

interface GamesModalProps {
  visible: boolean
  onClose: () => void
  level: CEFRLevel
  wordsPool: readonly VocabularyItem[]
  initialGame?: GameType
}

// --------------------------------------------------------------------------
// 1. TYPING RUSH ENGINE & PEDAGOGICAL REVIEW
// --------------------------------------------------------------------------
export interface TypingWordReviewItem {
  id: string
  word: string
  translation: string
  userTyped: string
  isCorrect: boolean
  tip: string
}

export interface TypingRushFinishData {
  xp: number
  completed: number
  total: number
  maxCombo: number
  reviewItems: TypingWordReviewItem[]
  failedItems: VocabularyItem[]
}

/**
 * Generador heurístico de tips mnemotécnicos y ortográficos
 */
function generateSpellingTip(target: string, typed: string, translation: string): string {
  const cleanTarget = target.trim().toLowerCase()
  const cleanTyped = typed.trim().toLowerCase()

  if (!cleanTyped) {
    return `"${translation}" se dice y escribe "${cleanTarget}". Repítela mentalmente.`
  }

  // Transposición (letras correctas pero orden cambiado)
  if (
    cleanTyped.length === cleanTarget.length &&
    cleanTyped.split('').sort().join('') === cleanTarget.split('').sort().join('')
  ) {
    return `Mismas letras pero orden invertido. Recuerda la secuencia exacta: "${cleanTarget}".`
  }

  // Patrón -ght
  if (cleanTarget.endsWith('ght') && !cleanTyped.endsWith('ght')) {
    return `Termina con el patrón '-ght' ("${cleanTarget}"). La 'gh' es muda.`
  }

  // k muda
  if (cleanTarget.startsWith('kn') && !cleanTyped.startsWith('kn')) {
    return `En "${cleanTarget}", la 'k' inicial es muda pero obligatoria.`
  }

  // w muda
  if (cleanTarget.startsWith('wr') && !cleanTyped.startsWith('wr')) {
    return `En "${cleanTarget}", la 'w' inicial es muda.`
  }

  // Doble ee
  if (cleanTarget.includes('ee') && cleanTyped.includes('i')) {
    return `Usa doble 'ee' para el sonido /iː/: "${cleanTarget}".`
  }

  // ea
  if (cleanTarget.includes('ea') && !cleanTyped.includes('ea')) {
    return `Atención a la combinación vocálica 'ea': "${cleanTarget}".`
  }

  // -tion vs -cion
  if (cleanTarget.endsWith('tion') && cleanTyped.endsWith('cion')) {
    return `En inglés los sustantivos terminan en '-tion', no con 'c'.`
  }

  // flu vs grip
  if (cleanTarget === 'flu') {
    return `"Flu" viene de 'influenza'. Recuerda no confundir con "grip" (agarrar).`
  }

  // hit
  if (cleanTarget === 'hit') {
    return `"Hit" (golpear) rima con 'sit' y 'fit' (3 letras cortas).`
  }

  // Consonantes dobles
  const hasDoubleTarget = /(.)\1/.test(cleanTarget)
  const hasDoubleTyped = /(.)\1/.test(cleanTyped)
  if (hasDoubleTarget && !hasDoubleTyped) {
    return `Lleva consonante doble. Revisa la ortografía de "${cleanTarget}".`
  }

  return `"${translation}" se traduce como "${cleanTarget}" (${cleanTarget.length} letras).`
}

interface TypingWordItem {
  id: string
  word: string
  translation: string
  phonetic?: string | undefined
  status: 'pending' | 'current' | 'completed' | 'failed'
  xpEarned: number
  userTyped: string
}

function TypingRushGame({
  wordsPool,
  onFinish,
  onExit,
}: {
  wordsPool: readonly VocabularyItem[]
  onFinish: (score: TypingRushFinishData) => void
  onExit: () => void
}): React.JSX.Element {
  const [roundWords, setRoundWords] = useState<TypingWordItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [typedInput, setTypedInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [hasStartedTimer, setHasStartedTimer] = useState(false)
  const [combo, setCombo] = useState(1)
  const [maxCombo, setMaxCombo] = useState(1)
  const [totalXp, setTotalXp] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2 | 3>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<TextInput | null>(null)

  // Initialize up to 5 words
  useEffect(() => {
    const poolSize = Math.min(5, wordsPool.length)
    const shuffled = [...wordsPool].sort(() => 0.5 - Math.random()).slice(0, poolSize)
    const items: TypingWordItem[] = shuffled.map((w, idx) => ({
      id: w.id,
      word: w.word,
      translation: w.translation,
      phonetic: w.pronunciation,
      status: idx === 0 ? 'current' : 'pending',
      xpEarned: 0,
      userTyped: '',
    }))
    setRoundWords(items)
    setCurrentIndex(0)
    setTimeLeft(60)
    setHasStartedTimer(false)
    setCombo(1)
    setMaxCombo(1)
    setTotalXp(0)
    setTypedInput('')
    setHintLevel(0)
    setFeedback(null)

    // Grace period: start timer automatically after 4 seconds if user hasn't typed yet
    const graceTimeout = setTimeout(() => {
      setHasStartedTimer(true)
    }, 4000)

    return () => {
      clearTimeout(graceTimeout)
    }
  }, [wordsPool])

  // Timer countdown
  useEffect(() => {
    if (roundWords.length === 0 || !hasStartedTimer) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [roundWords.length, hasStartedTimer])

  const currentWord = roundWords[currentIndex]

  const finishGame = (finalWords: TypingWordItem[], xp: number, highestCombo: number): void => {
    if (timerRef.current) clearInterval(timerRef.current)
    const completedCount = finalWords.filter((w) => w.status === 'completed').length

    const reviewItems: TypingWordReviewItem[] = finalWords.map((w) => ({
      id: w.id,
      word: w.word,
      translation: w.translation,
      userTyped: w.userTyped || '',
      isCorrect: w.status === 'completed',
      tip: generateSpellingTip(w.word, w.userTyped || '', w.translation),
    }))

    const failedItems: VocabularyItem[] = finalWords
      .filter((w) => w.status !== 'completed')
      .map((w) => {
        const orig = wordsPool.find((item) => item.id === w.id || item.word === w.word)
        if (orig) return orig
        const fallback: VocabularyItem = {
          id: w.id,
          word: w.word,
          translation: w.translation,
          partOfSpeech: 'noun',
          level: 'A1',
          week: 1,
          topic: 'general',
          verifiedBy: 'system',
          verifiedAt: '2026-09-10',
          status: 'published',
          ...(w.phonetic ? { pronunciation: w.phonetic } : {}),
        }
        return fallback
      })

    onFinish({
      xp,
      completed: completedCount,
      total: finalWords.length,
      maxCombo: highestCombo,
      reviewItems,
      failedItems,
    })
  }

  // Timeout detection
  useEffect(() => {
    if (timeLeft === 0 && roundWords.length > 0) {
      const updated = roundWords.map((w, idx) => {
        if (w.status === 'pending' || w.status === 'current') {
          return {
            ...w,
            status: 'failed' as const,
            userTyped: idx === currentIndex ? typedInput : '',
          }
        }
        return w
      })
      finishGame(updated, totalXp, maxCombo)
    }
  }, [timeLeft, roundWords, totalXp, maxCombo])

  const triggerWordSuccess = (matchedText: string): void => {
    if (!currentWord) return
    const penalty = hintLevel === 2 ? 25 : hintLevel === 3 ? 50 : 0
    const baseWordXp = Math.max(30, 150 - penalty)
    const earnedXp = baseWordXp * combo
    const newTotalXp = totalXp + earnedXp
    const newCombo = hintLevel >= 2 ? 1 : combo + 1
    const newMaxCombo = Math.max(maxCombo, newCombo)

    setTotalXp(newTotalXp)
    setCombo(newCombo)
    setMaxCombo(newMaxCombo)
    setFeedback(
      combo > 1 && hintLevel < 2
        ? `¡Excelente! +${baseWordXp} × ${combo} combo = +${earnedXp} XP 🔥`
        : `¡Excelente! +${earnedXp} XP`
    )
    void speakEnglish(currentWord.word)

    const updated = roundWords.map((w, idx) => {
      if (idx === currentIndex) {
        return {
          ...w,
          status: 'completed' as const,
          xpEarned: earnedXp,
          userTyped: matchedText,
        }
      }
      if (idx === currentIndex + 1) {
        return { ...w, status: 'current' as const }
      }
      return w
    })
    setRoundWords(updated)
    setTypedInput('')
    setHintLevel(0)

    if (currentIndex + 1 >= roundWords.length) {
      finishGame(updated, newTotalXp, newMaxCombo)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleInputChange = (text: string): void => {
    if (!hasStartedTimer) {
      setHasStartedTimer(true)
    }

    setTypedInput(text)
    const cleanT = text.trim().toLowerCase()
    const target = currentWord?.word.trim().toLowerCase() ?? ''

    if (!target) return

    // Auto-submit instantáneo al coincidir exactamente
    if (cleanT === target && cleanT.length > 0) {
      triggerWordSuccess(cleanT)
      return
    }

    // Detección de error en tiempo real (mismatch de prefijo)
    if (cleanT.length > 0 && !target.startsWith(cleanT)) {
      setCombo(1)
      setFeedback('Letra incorrecta: revisa la ortografía')
    } else {
      if (feedback) setFeedback(null)
    }
  }

  const handleCheckWord = (): void => {
    if (!currentWord) return
    const cleanT = typedInput.trim().toLowerCase()
    const target = currentWord.word.trim().toLowerCase()
    if (cleanT === target && cleanT.length > 0) {
      triggerWordSuccess(cleanT)
    } else {
      setCombo(1)
      setFeedback('Revisa las letras...')
    }
  }

  const cleanTarget = currentWord ? currentWord.word.trim().toLowerCase() : ''
  const cleanTyped = typedInput.trim().toLowerCase()
  const isPrefixMatch = cleanTarget.startsWith(cleanTyped)
  const isMismatch = cleanTyped.length > 0 && !isPrefixMatch
  const targetChars = cleanTarget.split('')

  return (
    <View style={styles.gameInnerContainer}>
      {/* Barra de progreso superior continua */}
      <View style={styles.topProgressBarTrack}>
        <View
          style={[
            styles.topProgressBarFill,
            { width: `${(currentIndex / Math.max(1, roundWords.length)) * 100}%` },
            currentIndex === roundWords.length && { backgroundColor: '#10B981' },
          ]}
        />
      </View>

      {/* Header bar con salida y reloj */}
      <View style={styles.gameTopBar}>
        <TouchableOpacity onPress={onExit} style={styles.exitButton} accessibilityLabel="Salir del juego">
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.gameBadgeTitle}>⌨️ TYPING RUSH</Text>
        <View
          style={[
            styles.timerBadge,
            timeLeft <= 15 && styles.timerBadgeUrgent,
          ]}
        >
          <Ionicons
            name={timeLeft <= 15 ? 'alert-circle' : 'time-outline'}
            size={15}
            color={timeLeft <= 15 ? '#DC2626' : '#0F172A'}
          />
          <Text
            style={[
              styles.timerText,
              timeLeft <= 15 && styles.timerTextUrgent,
            ]}
          >
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </Text>
        </View>
      </View>

      {/* Status Bar con Progreso, Combo y XP en vivo */}
      <View style={styles.typingStatusBar}>
        <View style={styles.typingProgressPill}>
          <Text style={styles.typingProgressText}>
            Palabra <Text style={{ fontWeight: 'bold' }}>{currentIndex + 1}</Text> de {roundWords.length}
          </Text>
        </View>

        <View
          style={[styles.comboBadge, combo > 1 && styles.comboBadgeActive]}
        >
          <Text style={styles.comboText}>
            {combo > 1 ? `🔥 Combo x${combo}` : 'Combo x1'}
          </Text>
        </View>

        <View style={styles.typingXpBadge}>
          <Ionicons name="sparkles" size={13} color="#059669" />
          <Text style={styles.typingXpText}>{totalXp} XP</Text>
        </View>
      </View>

      {/* Tarjeta interactiva de palabra */}
      {currentWord ? (
        <View style={styles.promptCard}>
          <View style={styles.spanishBadgePill}>
            <Text style={styles.spanishBadgeText}>🇪🇸 TRADUCE AL INGLÉS</Text>
          </View>
          <Text style={styles.targetSpanish}>"{currentWord.translation}"</Text>
          {currentWord.phonetic ? (
            <Text style={styles.targetPhonetic}>{currentWord.phonetic}</Text>
          ) : null}

          {/* Action Row: Pronunciación en inglés + Pista escalonada */}
          <View style={styles.hintActionsRow}>
            <TouchableOpacity
              style={styles.listenHintBtn}
              accessibilityRole="button"
              accessibilityLabel="Escuchar pronunciación en inglés de la palabra"
              onPress={() => {
                void speakEnglish(currentWord.word)
              }}
            >
              <Ionicons name="volume-high" size={15} color={colors.primary} />
              <Text style={styles.listenHintText}>🔊 Pronunciación</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.listenHintBtn,
                hintLevel > 0 && styles.listenHintBtnActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Obtener pista de letras"
              onPress={() => {
                setHintLevel((prev) => {
                  if (prev === 0) return 1
                  if (prev === 1) return 2
                  if (prev === 2) return 3
                  return 0
                })
              }}
            >
              <Ionicons
                name="bulb-outline"
                size={15}
                color={hintLevel > 0 ? '#D97706' : colors.warning}
              />
              <Text style={styles.listenHintText}>
                {hintLevel === 0
                  ? '💡 Pista (Gratis)'
                  : hintLevel === 1
                    ? '💡 1ª letra (-25 XP)'
                    : hintLevel === 2
                      ? '💡 Prefijo (-50 XP)'
                      : 'Ocultar pista'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Casillas de Letras Dinámicas Interactivas (Spelling Tiles) */}
          <Pressable
            style={styles.letterTilesRow}
            onPress={() => inputRef.current?.focus()}
          >
            {targetChars.map((targetChar, i) => {
              if (targetChar === ' ') {
                return <View key={i} style={styles.letterTileSpace} />
              }
              const typedChar = cleanTyped[i]
              const isFilled = typedChar !== undefined && typedChar.length > 0
              const isCharCorrect = isFilled && typedChar === targetChar
              const isCharWrong = isFilled && typedChar !== targetChar
              const isCursor = !isFilled && i === cleanTyped.length
              const isHintChar =
                !isFilled &&
                ((hintLevel === 2 && i === 0) ||
                  (hintLevel === 3 && (i === 0 || i === 1)))

              const charToDisplay = typedChar
                ? typedChar.toUpperCase()
                : isHintChar
                  ? targetChar.toUpperCase()
                  : ''

              return (
                <View
                  key={i}
                  style={[
                    styles.letterTile,
                    targetChars.length > 8 && styles.letterTileSmall,
                    isCharCorrect && styles.letterTileCorrect,
                    isCharWrong && styles.letterTileWrong,
                    isCursor && styles.letterTileCursor,
                    isHintChar && styles.letterTileHint,
                  ]}
                >
                  <Text
                    style={[
                      styles.letterTileText,
                      targetChars.length > 8 && styles.letterTileTextSmall,
                      isCharCorrect && styles.letterTileTextCorrect,
                      isCharWrong && styles.letterTileTextWrong,
                      isHintChar && styles.letterTileTextHint,
                    ]}
                  >
                    {charToDisplay}
                  </Text>
                </View>
              )
            })}
          </Pressable>

          {hintLevel >= 2 ? (
            <Text style={styles.hintPenaltyText}>
              ⚠️ Pista activada (-{hintLevel === 2 ? 25 : 50} XP • Combo x1)
            </Text>
          ) : null}

          {/* Typing input con validación en tiempo real */}
          <View
            style={[
              styles.typingInputContainer,
              isMismatch && styles.typingInputContainerError,
              cleanTyped.length > 0 && isPrefixMatch && styles.typingInputContainerSuccess,
            ]}
          >
            <Ionicons
              name="pencil-outline"
              size={18}
              color={isMismatch ? colors.danger : colors.primary}
              style={{ marginRight: 6 }}
            />
            <TextInput
              ref={inputRef}
              style={[
                styles.typingInput,
                isMismatch && styles.typingInputError,
              ]}
              value={typedInput}
              onChangeText={handleInputChange}
              onSubmitEditing={handleCheckWord}
              placeholder="Escribe la palabra en inglés..."
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              returnKeyType="done"
            />
            {typedInput.length > 0 ? (
              <TouchableOpacity
                style={styles.inputClearBtn}
                onPress={() => {
                  setTypedInput('')
                  setFeedback(null)
                  inputRef.current?.focus()
                }}
                accessibilityRole="button"
                accessibilityLabel="Borrar texto"
              >
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>

          {feedback ? (
            <View
              style={[
                styles.typingFeedbackBadge,
                feedback.includes('Excelente')
                  ? styles.typingFeedbackSuccess
                  : styles.typingFeedbackError,
              ]}
            >
              <Ionicons
                name={feedback.includes('Excelente') ? 'checkmark-circle' : 'alert-circle'}
                size={14}
                color={feedback.includes('Excelente') ? '#047857' : '#DC2626'}
              />
              <Text
                style={[
                  styles.feedbackText,
                  feedback.includes('Excelente')
                    ? { color: '#047857' }
                    : { color: '#DC2626' },
                ]}
              >
                {feedback}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Words Queue Status (palabras futuras ocultas) */}
      <View style={styles.queueContainer}>
        <View style={styles.queueHeaderRow}>
          <Text style={styles.queueTitle}>Progreso de la ronda:</Text>
          <Text style={styles.queueSubtitle}>
            {roundWords.filter((w) => w.status === 'completed').length} / {roundWords.length} listas
          </Text>
        </View>
        {roundWords.map((item, idx) => {
          const isDone = item.status === 'completed'
          const isCurrent = item.status === 'current'
          const isFailed = item.status === 'failed'
          return (
            <View
              key={item.id || idx}
              style={[
                styles.queueRow,
                isCurrent && styles.queueRowActive,
                isDone && styles.queueRowDoneBg,
                isFailed && styles.queueRowFailedBg,
              ]}
            >
              <Text style={styles.queueIcon}>
                {isDone ? '✅' : isFailed ? '❌' : isCurrent ? '⏳' : '⚪'}
              </Text>
              <Text
                style={[
                  styles.queueWord,
                  isDone && styles.queueWordDone,
                  isFailed && styles.queueWordFailed,
                  isCurrent && styles.queueWordActive,
                ]}
              >
                {isDone
                  ? `${item.translation} → ${item.word}`
                  : isCurrent
                    ? `${item.translation} (escribiendo...)`
                    : `● Palabra ${idx + 1}`}
              </Text>
              {isDone ? (
                <View style={styles.queueXpPill}>
                  <Text style={styles.queueXp}>+{item.xpEarned} XP</Text>
                </View>
              ) : isFailed ? (
                <Text style={styles.queueXpFailed}>0 XP</Text>
              ) : null}
            </View>
          )
        })}
      </View>

      {/* Total Score Footer */}
      <View style={styles.scoreFooter}>
        <Text style={styles.totalXpLabel}>Puntos acumulados:</Text>
        <Text style={styles.totalXpValue}>{totalXp} XP</Text>
      </View>
    </View>
  )
}

// --------------------------------------------------------------------------
// 2. LIGHTNING QUIZ ENGINE
// --------------------------------------------------------------------------
function LightningQuizGame({
  wordsPool,
  level,
  onFinish,
  onExit,
}: {
  wordsPool: readonly VocabularyItem[]
  level: CEFRLevel
  onFinish: (score: { streak: number; correct: number; total: number }) => void
  onExit: () => void
}): React.JSX.Element {
  const QUESTION_DURATION = 10
  const ROUND_QUESTIONS = Math.min(10, Math.max(5, wordsPool.length))

  const [questionIndex, setQuestionIndex] = useState(0)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(QUESTION_DURATION)
  const [isAnswering, setIsAnswering] = useState(false)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [currentWord, setCurrentWord] = useState<VocabularyItem | null>(null)
  const [options, setOptions] = useState<QuizOption[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [feedbackTip, setFeedbackTip] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const nonCognatePool = useMemo(() => {
    const filtered = wordsPool.filter((w) => {
      const cleanWord = w.word.trim().toLowerCase()
      const cleanTrans = w.translation.trim().toLowerCase()
      return cleanWord !== cleanTrans
    })
    return filtered.length >= 4 ? filtered : wordsPool
  }, [wordsPool])

  const pickNextWord = (): void => {
    if (nonCognatePool.length === 0) return
    const random = nonCognatePool[Math.floor(Math.random() * nonCognatePool.length)]
    if (!random) return
    setCurrentWord(random)
    setSelectedId(null)
    setFeedbackTip(null)

    const displayData = getWordDisplayData(random.id)
    const opts = generateQuizOptions(displayData, level)
    setOptions(opts)
  }

  // Initialize round
  useEffect(() => {
    pickNextWord()
    setQuestionIndex(0)
    setQuestionTimeLeft(QUESTION_DURATION)
    setIsAnswering(false)
    setStreak(0)
    setMaxStreak(0)
    setTotalCorrect(0)
    setTotalAnswered(0)
    setFeedbackTip(null)
  }, [wordsPool, level])

  const advanceQuestion = (): void => {
    if (questionIndex + 1 >= ROUND_QUESTIONS) {
      if (timerRef.current) clearInterval(timerRef.current)
      onFinish({
        streak: maxStreak,
        correct: totalCorrect,
        total: ROUND_QUESTIONS,
      })
    } else {
      setQuestionIndex((prev) => prev + 1)
      setQuestionTimeLeft(QUESTION_DURATION)
      setSelectedId(null)
      setFeedbackTip(null)
      setIsAnswering(false)
      pickNextWord()
    }
  }

  // Countdown timer per question
  useEffect(() => {
    if (isAnswering) return

    timerRef.current = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          // Timeout handling on current question
          setIsAnswering(true)
          setStreak(0)
          setTotalAnswered((t) => t + 1)
          const correctOpt = options.find((o) => o.isCorrect)
          setFeedbackTip(
            `⏱️ ¡Tiempo agotado! "${currentWord?.word || ''}" significa "${correctOpt?.text || ''}".`
          )
          setTimeout(() => {
            advanceQuestion()
          }, 1400)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isAnswering, questionIndex, options, currentWord])

  const handleSelectOption = (opt: QuizOption): void => {
    if (isAnswering || selectedId) return
    setIsAnswering(true)
    setSelectedId(opt.id)
    setTotalAnswered((prev) => prev + 1)

    if (opt.isCorrect) {
      const newStreak = streak + 1
      setStreak(newStreak)
      setMaxStreak((prev) => Math.max(prev, newStreak))
      setTotalCorrect((prev) => prev + 1)
      if (currentWord) void speakEnglish(currentWord.word)

      setTimeout(() => {
        advanceQuestion()
      }, 450)
    } else {
      setStreak(0)
      const correctOpt = options.find((o) => o.isCorrect)
      setFeedbackTip(
        `Elegiste "${opt.text}". "${currentWord?.word || ''}" significa "${correctOpt?.text || ''}".`
      )
      setTimeout(() => {
        advanceQuestion()
      }, 1400)
    }
  }

  const correctOption = options.find((o) => o.isCorrect)

  return (
    <View style={styles.gameInnerContainer}>
      {/* Barra de progreso de tiempo superior (se vacía de 10s a 0s) */}
      <View style={styles.topProgressBarTrack}>
        <View
          style={[
            styles.topProgressBarFill,
            { width: `${(questionTimeLeft / QUESTION_DURATION) * 100}%` },
            questionTimeLeft <= 3 && styles.topProgressBarFillUrgent,
          ]}
        />
      </View>

      {/* Header bar */}
      <View style={styles.gameTopBar}>
        <TouchableOpacity onPress={onExit} style={styles.exitButton}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.gameBadgeTitle}>⚡ LIGHTNING QUIZ</Text>
        <View
          style={[
            styles.timerBadge,
            questionTimeLeft <= 3 && styles.timerBadgeUrgent,
          ]}
        >
          <Ionicons
            name="flash"
            size={16}
            color={questionTimeLeft <= 3 ? colors.danger : colors.warning}
          />
          <Text
            style={[
              styles.timerText,
              questionTimeLeft <= 3 && { color: colors.danger },
            ]}
          >
            00:{questionTimeLeft < 10 ? `0${questionTimeLeft}` : questionTimeLeft}
          </Text>
        </View>
      </View>

      {/* Progress & Stats Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.progressText}>
          Palabra {questionIndex + 1} de {ROUND_QUESTIONS}
        </Text>
        <View style={styles.lightningStatsHeaderRow}>
          <Text style={styles.lightningAciertosCount}>
            Aciertos: <Text style={{ fontWeight: 'bold' }}>{totalCorrect}</Text>
          </Text>
          <View
            style={[
              styles.comboBadge,
              streak > 0 && styles.comboBadgeActive,
            ]}
          >
            <Text style={styles.comboText}>🔥 Racha: {streak}</Text>
          </View>
        </View>
      </View>

      {/* Main Question Card (Clean Light Theme) */}
      {currentWord ? (
        <View style={styles.lightningQuestionBox}>
          <Text style={styles.lightningSub}>¿CÓMO SE DICE EN ESPAÑOL?</Text>
          <Text style={styles.lightningWord}>{currentWord.word}</Text>
          {currentWord.pronunciation ? (
            <View style={styles.lightningPhoneticPill}>
              <Text style={styles.lightningPhonetic}>
                [{currentWord.pronunciation}]
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.lightningAudio}
            accessibilityRole="button"
            accessibilityLabel={`Escuchar pronunciación de ${currentWord.word}`}
            onPress={() => {
              void speakEnglish(currentWord.word)
            }}
          >
            <Ionicons name="volume-high" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Micro-lección pedagógica de error inmediato */}
      {feedbackTip ? (
        <View style={styles.microLessonCard}>
          <View style={styles.microLessonHeader}>
            <Ionicons name="bulb" size={16} color="#D97706" />
            <Text style={styles.microLessonTitle}>Corrección Rápida</Text>
          </View>
          <Text style={styles.microLessonText}>{feedbackTip}</Text>
        </View>
      ) : null}

      {/* 4 Tactile Option Buttons */}
      <View style={styles.lightningOptionsGrid}>
        {options.map((opt, idx) => {
          const isSelected = selectedId === opt.id
          const showCorrectReveal =
            selectedId && !isSelected && opt.isCorrect

          return (
            <Pressable
              key={opt.id}
              style={({ pressed }) => [
                styles.lightningOptionBtn,
                pressed && !isAnswering && styles.lightningOptionBtnPressed,
                isSelected &&
                (opt.isCorrect
                  ? styles.lightningOptionCorrect
                  : styles.lightningOptionWrong),
                showCorrectReveal && styles.lightningOptionRevealCorrect,
                { transform: [{ scale: pressed && !isAnswering ? 0.98 : 1 }] },
              ]}
              onPress={() => {
                handleSelectOption(opt)
              }}
              disabled={isAnswering}
            >
              <Text
                style={[
                  styles.lightningOptionText,
                  isSelected &&
                  (opt.isCorrect
                    ? styles.lightningOptionTextCorrect
                    : styles.lightningOptionTextWrong),
                  showCorrectReveal && styles.lightningOptionTextReveal,
                ]}
              >
                {opt.text}
              </Text>

              <View
                style={[
                  styles.optionLetterBadge,
                  isSelected &&
                  (opt.isCorrect
                    ? styles.optionLetterBadgeCorrect
                    : styles.optionLetterBadgeWrong),
                  showCorrectReveal && styles.optionLetterBadgeCorrect,
                ]}
              >
                {isSelected ? (
                  <Ionicons
                    name={opt.isCorrect ? 'checkmark' : 'close'}
                    size={14}
                    color="#FFFFFF"
                  />
                ) : showCorrectReveal ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : (
                  <Text style={styles.optionLetterText}>
                    {['A', 'B', 'C', 'D'][idx]}
                  </Text>
                )}
              </View>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

// --------------------------------------------------------------------------
// 3. MEMORY MATCH ENGINE
// --------------------------------------------------------------------------
interface MemoryCard {
  id: string
  wordId: string
  text: string
  isEnglish: boolean
  isMatched: boolean
}

export interface MemoryMatchFinishData {
  moves: number
  pairsMatched: number
  secondsElapsed: number
  matchedWords: readonly VocabularyItem[]
  stars: number
}

interface MemoryCardItemProps {
  card: MemoryCard
  index: number
  isFlipped: boolean
  isMismatched: boolean
  onPress: (index: number) => void
}

function MemoryCardItem({
  card,
  index,
  isFlipped,
  isMismatched,
  onPress,
}: MemoryCardItemProps): React.JSX.Element {
  const flipAnim = useRef(new Animated.Value(1)).current
  const shakeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current
  const [showFront, setShowFront] = useState(isFlipped)

  // Smooth flip animation: scales down to edge, swaps face, springs back
  useEffect(() => {
    if (isFlipped !== showFront) {
      Animated.timing(flipAnim, {
        toValue: 0.05,
        duration: 110,
        useNativeDriver: true,
      }).start(() => {
        setShowFront(isFlipped)
        Animated.spring(flipAnim, {
          toValue: 1,
          friction: 6,
          tension: 45,
          useNativeDriver: true,
        }).start()
      })
    }
  }, [isFlipped])

  // Horizontal wobble / shake on mismatch
  useEffect(() => {
    if (isMismatched) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -6, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -4, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 4, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 45, useNativeDriver: true }),
      ]).start()
    }
  }, [isMismatched])

  // Celebration pulse on match
  useEffect(() => {
    if (card.isMatched) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.07, duration: 140, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]).start()
    }
  }, [card.isMatched])

  const isLongWord = card.text.length > 9

  return (
    <Animated.View
      style={[
        styles.memoryCardWrapper,
        {
          transform: [
            { scale: scaleAnim },
            { scaleX: flipAnim },
            { translateX: shakeAnim },
          ],
        },
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.memoryCard,
          showFront && styles.memoryCardFlipped,
          card.isMatched && styles.memoryCardMatched,
          isMismatched && styles.memoryCardMismatch,
          { opacity: pressed && !card.isMatched && !showFront ? 0.9 : 1 },
        ]}
        onPress={() => onPress(index)}
        disabled={card.isMatched || showFront}
        accessibilityRole="button"
        accessibilityLabel={
          showFront
            ? `${card.isEnglish ? 'Inglés' : 'Español'}: ${card.text}`
            : `Carta de memoria ${index + 1}`
        }
      >
        {showFront ? (
          <View
            style={[
              styles.memoryCardContent,
              card.isMatched && styles.memoryCardContentMatched,
              isMismatched && styles.memoryCardContentMismatch,
            ]}
          >
            <View
              style={[
                styles.langBadgePill,
                card.isEnglish ? styles.langBadgePillEn : styles.langBadgePillEs,
                card.isMatched && styles.langBadgePillMatched,
              ]}
            >
              <Text style={styles.langBadgeText}>
                {card.isEnglish ? '🇺🇸 EN' : '🇪🇸 ES'}
              </Text>
              {card.isEnglish && (
                <Ionicons name="volume-high" size={9} color="#2563EB" style={{ marginLeft: 2 }} />
              )}
            </View>

            <Text
              style={[
                styles.memoryCardText,
                isLongWord && styles.memoryCardTextSmall,
                card.isMatched && styles.memoryCardTextMatched,
                isMismatched && styles.memoryCardTextMismatch,
              ]}
              numberOfLines={2}
            >
              {card.text}
            </Text>

            {card.isMatched ? (
              <View style={styles.matchedCheckIconWrap}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              </View>
            ) : (
              <View style={{ height: 16 }} />
            )}
          </View>
        ) : (
          <View style={styles.memoryCardBack}>
            <Image
              source={CARD_BACK_IMG}
              style={styles.memoryCardBackImage}
              resizeMode="cover"
            />
          </View>
        )}
      </Pressable>
    </Animated.View>
  )
}

function MemoryMatchGame({
  wordsPool,
  onFinish,
  onExit,
}: {
  wordsPool: readonly VocabularyItem[]
  onFinish: (score: MemoryMatchFinishData) => void
  onExit: () => void
}): React.JSX.Element {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [roundWords, setRoundWords] = useState<readonly VocabularyItem[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [mismatchIndices, setMismatchIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matchedCount, setMatchedCount] = useState(0)
  const [combo, setCombo] = useState(0)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const selected = [...wordsPool].sort(() => 0.5 - Math.random()).slice(0, 6)
    setRoundWords(selected)
    const deck: MemoryCard[] = []

    selected.forEach((w) => {
      deck.push({
        id: `en_${w.id}`,
        wordId: w.id,
        text: w.word,
        isEnglish: true,
        isMatched: false,
      })
      deck.push({
        id: `es_${w.id}`,
        wordId: w.id,
        text: w.translation,
        isEnglish: false,
        isMatched: false,
      })
    })

    setCards(deck.sort(() => 0.5 - Math.random()))
    setFlippedIndices([])
    setMismatchIndices([])
    setMoves(0)
    setMatchedCount(0)
    setCombo(0)
    setSecondsElapsed(0)

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setSecondsElapsed((s) => s + 1)
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [wordsPool])

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  // Live star calculation based on efficiency
  const currentStars = moves <= 8 ? 3 : moves <= 12 ? 2 : 1

  const handleCardPress = (index: number): void => {
    if (flippedIndices.length >= 2) return
    if (flippedIndices.includes(index)) return
    if (cards[index]?.isMatched) return

    const card = cards[index]
    if (!card) return

    if (card.isEnglish) {
      void speakEnglish(card.text)
    }

    const nextFlipped = [...flippedIndices, index]
    setFlippedIndices(nextFlipped)

    if (nextFlipped.length === 2) {
      const nextMoves = moves + 1
      setMoves(nextMoves)
      const firstCard = cards[nextFlipped[0]!]
      const secondCard = cards[nextFlipped[1]!]

      if (firstCard && secondCard && firstCard.wordId === secondCard.wordId) {
        // MATCH!
        setCombo((c) => c + 1)
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.wordId === firstCard.wordId ? { ...c, isMatched: true } : c))
          )
          setFlippedIndices([])
          setMatchedCount((c) => {
            const next = c + 1
            if (next === 6) {
              if (timerRef.current) clearInterval(timerRef.current)
              const finalStars = nextMoves <= 8 ? 3 : nextMoves <= 12 ? 2 : 1
              onFinish({
                moves: nextMoves,
                pairsMatched: 6,
                secondsElapsed,
                matchedWords: roundWords,
                stars: finalStars,
              })
            }
            return next
          })
          const enCard = firstCard.isEnglish ? firstCard : secondCard
          void speakEnglish(enCard.text)
        }, 350)
      } else {
        // NO MATCH -> reset combo, highlight mismatch red, then flip back
        setCombo(0)
        setMismatchIndices(nextFlipped)
        setTimeout(() => {
          setFlippedIndices([])
          setMismatchIndices([])
        }, 850)
      }
    }
  }

  return (
    <View style={styles.gameInnerContainer}>
      {/* Barra de progreso de parejas (0% a 100%) */}
      <View style={styles.topProgressBarTrack}>
        <View
          style={[
            styles.topProgressBarFill,
            { width: `${(matchedCount / 6) * 100}%` },
            matchedCount === 6 && { backgroundColor: '#10B981' },
          ]}
        />
      </View>

      {/* Header bar con salida y cronómetro */}
      <View style={styles.gameTopBar}>
        <TouchableOpacity onPress={onExit} style={styles.exitButton} accessibilityLabel="Salir del juego">
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <Text style={styles.gameBadgeTitle}>🃏 MEMORY MATCH</Text>

        <View style={styles.memoryTimerBadge}>
          <Ionicons name="time-outline" size={13} color="#0F172A" />
          <Text style={styles.memoryTimerText}>{formatTime(secondsElapsed)}</Text>
        </View>
      </View>

      {/* Status Bar con Intentos, Parejas, Combo y Calificación en vivo */}
      <View style={styles.memoryStatusBar}>
        <View style={styles.memoryScorePill}>
          <Ionicons name="trophy" size={14} color="#059669" />
          <Text style={styles.memoryScoreText}>
            {matchedCount} / 6
          </Text>
        </View>

        <View style={styles.memoryMovesBadge}>
          <Ionicons name="repeat" size={13} color="#475569" />
          <Text style={styles.memoryMovesText}>{moves} {moves === 1 ? 'intento' : 'intentos'}</Text>
        </View>

        {combo >= 2 ? (
          <View style={styles.memoryComboBadge}>
            <Text style={styles.memoryComboText}>🔥 x{combo}</Text>
          </View>
        ) : null}

        <View style={styles.memoryStarsBadge}>
          <Text style={styles.memoryStarsText}>
            {'⭐'.repeat(currentStars) + '☆'.repeat(3 - currentStars)}
          </Text>
        </View>
      </View>

      {/* Subtítulo orientativo */}
      <View style={styles.memoryInstructionWrap}>
        <Text style={styles.hintTextSmall}>
          {matchedCount === 6
            ? '🎉 ¡Todas las parejas encontradas!'
            : 'Toca una carta en inglés y su traducción en español'}
        </Text>
      </View>

      {/* Grid de 12 cartas con animación física 3D y rebote táctil */}
      <View style={styles.memoryGrid}>
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx) || card.isMatched
          const isMismatched = mismatchIndices.includes(idx)

          return (
            <MemoryCardItem
              key={card.id}
              card={card}
              index={idx}
              isFlipped={isFlipped}
              isMismatched={isMismatched}
              onPress={handleCardPress}
            />
          )
        })}
      </View>
    </View>
  )
}

// --------------------------------------------------------------------------
// 4. WORD MATCH ENGINE & PAIRS LOGIC (COLUMNS MATCHING)
// --------------------------------------------------------------------------
export interface WordMatchFinishData {
  xp: number
  pairsMatched: number
  totalPairs: number
  mistakes: number
  secondsElapsed: number
  maxCombo: number
  categoryName: string
}

interface WordMatchTileProps {
  id: string
  text: string
  subtext?: string | undefined
  isEnglish: boolean
  isMatched: boolean
  isSelected: boolean
  isMismatch: boolean
  isSuccess: boolean
  onPress: () => void
}

function WordMatchTile({
  text,
  subtext,
  isEnglish,
  isMatched,
  isSelected,
  isMismatch,
  isSuccess,
  onPress,
}: WordMatchTileProps): React.JSX.Element {
  const shakeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (isMismatch) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -6, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -4, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 4, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]).start()
    }
  }, [isMismatch])

  useEffect(() => {
    if (isSuccess) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 120, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
      ]).start()
    }
  }, [isSuccess])

  return (
    <Animated.View
      style={{
        transform: [{ translateX: shakeAnim }, { scale: scaleAnim }],
      }}
    >
      <Pressable
        disabled={isMatched}
        onPress={onPress}
        style={({ pressed }) => [
          styles.matchTile,
          isEnglish ? styles.matchTileEnglish : styles.matchTileSpanish,
          isSelected && styles.matchTileSelected,
          isSuccess && styles.matchTileSuccess,
          isMismatch && styles.matchTileMismatch,
          isMatched && styles.matchTileMatched,
          pressed && !isMatched && styles.matchTilePressed,
        ]}
      >
        <View style={styles.matchTileContent}>
          <Text
            style={[
              styles.matchTileText,
              isSelected && styles.matchTileTextSelected,
              isSuccess && styles.matchTileTextSuccess,
              isMismatch && styles.matchTileTextMismatch,
              isMatched && styles.matchTileTextMatched,
            ]}
            numberOfLines={2}
          >
            {text}
          </Text>
          {subtext ? (
            <Text
              style={[
                styles.matchTileSubtext,
                isMatched && styles.matchTileSubtextMatched,
              ]}
              numberOfLines={1}
            >
              {subtext}
            </Text>
          ) : null}
        </View>

        {isEnglish && !isMatched ? (
          <Ionicons
            name="volume-medium-outline"
            size={16}
            color={isSelected ? '#2563EB' : '#64748B'}
            style={styles.matchSpeakerIcon}
          />
        ) : isMatched ? (
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
        ) : null}
      </Pressable>
    </Animated.View>
  )
}

function WordMatchGame({
  wordsPool,
  onFinish,
  onExit,
}: {
  wordsPool: readonly VocabularyItem[]
  onFinish: (data: WordMatchFinishData) => void
  onExit: () => void
}): React.JSX.Element {
  const [selectedCatId, setSelectedCatId] = useState<string>(
    wordsPool.length >= 4 ? SRS_WEEK_CATEGORY_ID : 'numbers'
  )
  const [catModalVisible, setCatModalVisible] = useState(false)
  const [pairs, setPairs] = useState<MatchingPair[]>([])
  const [shuffledEnglish, setShuffledEnglish] = useState<MatchingPair[]>([])
  const [shuffledSpanish, setShuffledSpanish] = useState<MatchingPair[]>([])
  const [matchedIds, setMatchedIds] = useState<string[]>([])
  const [selectedEnglishId, setSelectedEnglishId] = useState<string | null>(null)
  const [selectedSpanishId, setSelectedSpanishId] = useState<string | null>(null)
  const [mismatchPair, setMismatchPair] = useState<{ en: string; es: string } | null>(null)
  const [successPair, setSuccessPair] = useState<{ en: string; es: string } | null>(null)
  const [combo, setCombo] = useState(1)
  const [maxCombo, setMaxCombo] = useState(1)
  const [mistakes, setMistakes] = useState(0)
  const [totalXp, setTotalXp] = useState(0)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRound = (catId: string): void => {
    const newPairs = getCategoryPairs(catId, wordsPool, 6)
    setPairs(newPairs)
    setShuffledEnglish(shuffleArray(newPairs))
    setShuffledSpanish(shuffleArray(newPairs))
    setMatchedIds([])
    setSelectedEnglishId(null)
    setSelectedSpanishId(null)
    setMismatchPair(null)
    setSuccessPair(null)
    setCombo(1)
    setMaxCombo(1)
    setMistakes(0)
    setTotalXp(0)
    setSecondsElapsed(0)
  }

  useEffect(() => {
    startRound(selectedCatId)
  }, [selectedCatId, wordsPool])

  useEffect(() => {
    if (pairs.length === 0) return
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1)
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [pairs.length])

  const currentCategoryName = useMemo(() => {
    if (selectedCatId === SRS_WEEK_CATEGORY_ID) {
      return '⭐ Vocabulario de tu Semana'
    }
    const c = MATCHING_CATEGORIES.find((cat) => cat.id === selectedCatId)
    return c ? `${c.emoji} ${c.name}` : 'Vocabulario A1'
  }, [selectedCatId])

  const evaluateMatch = (enId: string, esId: string): void => {
    if (enId === esId) {
      // MATCH!
      const newCombo = combo + 1
      setCombo(newCombo)
      setMaxCombo((prev) => Math.max(prev, newCombo))
      const gainedXp = 20 * Math.min(newCombo, 3)
      setTotalXp((prev) => prev + gainedXp)
      setSuccessPair({ en: enId, es: esId })

      setTimeout(() => {
        setMatchedIds((prev) => {
          const next = [...prev, enId]
          if (next.length === pairs.length && pairs.length > 0) {
            if (timerRef.current) clearInterval(timerRef.current)
            const speedBonus = Math.max(0, (30 - secondsElapsed) * 2)
            const finalScore = Math.max(25, 100 + speedBonus - mistakes * 10 + gainedXp)
            setTimeout(() => {
              onFinish({
                xp: finalScore,
                pairsMatched: pairs.length,
                totalPairs: pairs.length,
                mistakes,
                secondsElapsed,
                maxCombo: Math.max(maxCombo, newCombo),
                categoryName: currentCategoryName,
              })
            }, 550)
          }
          return next
        })
        setSelectedEnglishId(null)
        setSelectedSpanishId(null)
        setSuccessPair(null)
      }, 350)
    } else {
      // MISMATCH!
      setMistakes((prev) => prev + 1)
      setCombo(1)
      setMismatchPair({ en: enId, es: esId })
      setTimeout(() => {
        setSelectedEnglishId(null)
        setSelectedSpanishId(null)
        setMismatchPair(null)
      }, 450)
    }
  }

  const handleSelectEnglish = (pair: MatchingPair): void => {
    if (matchedIds.includes(pair.id)) return
    if (mismatchPair) return

    void speakEnglish(pair.english)
    setSelectedEnglishId(pair.id)

    if (selectedSpanishId) {
      evaluateMatch(pair.id, selectedSpanishId)
    }
  }

  const handleSelectSpanish = (pair: MatchingPair): void => {
    if (matchedIds.includes(pair.id)) return
    if (mismatchPair) return

    setSelectedSpanishId(pair.id)

    if (selectedEnglishId) {
      evaluateMatch(selectedEnglishId, pair.id)
    }
  }

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <View style={styles.gameInnerContainer}>
      {/* Barra de progreso de pares (0% a 100%) */}
      <View style={styles.topProgressBarTrack}>
        <View
          style={[
            styles.topProgressBarFill,
            { width: `${(matchedIds.length / (pairs.length || 1)) * 100}%` },
            matchedIds.length === pairs.length && { backgroundColor: '#10B981' },
          ]}
        />
      </View>

      {/* Header bar con salida y cronómetro */}
      <View style={styles.gameTopBar}>
        <TouchableOpacity onPress={onExit} style={styles.exitButton} accessibilityLabel="Salir del juego">
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <Text style={styles.gameBadgeTitle}>🔗 WORD MATCH</Text>

        <View style={styles.memoryTimerBadge}>
          <Ionicons name="time-outline" size={13} color="#0F172A" />
          <Text style={styles.memoryTimerText}>{formatTime(secondsElapsed)}</Text>
        </View>
      </View>

      {/* Selector de Categoría Pill */}
      <TouchableOpacity
        style={styles.matchCategoryButton}
        onPress={() => setCatModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Cambiar categoría de emparejamiento"
      >
        <Text style={styles.matchCategoryButtonText} numberOfLines={1}>
          📂 Tema: {currentCategoryName}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#1D4ED8" />
      </TouchableOpacity>

      {/* Status Bar con Pares, Combo y XP */}
      <View style={styles.matchStatusBar}>
        <View style={styles.matchScorePill}>
          <Ionicons name="checkmark-done" size={14} color="#059669" />
          <Text style={styles.matchScoreText}>
            {matchedIds.length} de {pairs.length} pares
          </Text>
        </View>

        {combo >= 2 ? (
          <View style={styles.matchComboBadge}>
            <Text style={styles.matchComboText}>🔥 x{combo}</Text>
          </View>
        ) : null}

        <View style={styles.matchXpBadge}>
          <Ionicons name="sparkles" size={13} color="#7C3AED" />
          <Text style={styles.matchXpText}>+{totalXp} XP</Text>
        </View>
      </View>

      {/* Subtítulo pedagógico */}
      <View style={styles.matchInstructionWrap}>
        <Text style={styles.matchInstructionText}>
          {matchedIds.length === pairs.length
            ? '🎉 ¡Completaste todos los pares!'
            : 'Toca una palabra en inglés y su significado en español'}
        </Text>
      </View>

      {/* Tablero de Dos Columnas Táctiles */}
      <View style={styles.matchBoard}>
        {/* Columna Izquierda: Inglés */}
        <View style={styles.matchColumn}>
          <Text style={styles.matchColumnHeader}>🇬🇧 INGLÉS</Text>
          {shuffledEnglish.map((item) => {
            const isMatched = matchedIds.includes(item.id)
            const isSelected = selectedEnglishId === item.id
            const isMismatch = Boolean(mismatchPair && mismatchPair.en === item.id)
            const isSuccess = Boolean(successPair && successPair.en === item.id)

            return (
              <WordMatchTile
                key={`en_${item.id}`}
                id={item.id}
                text={item.english}
                subtext={item.phonetic}
                isEnglish={true}
                isMatched={isMatched}
                isSelected={isSelected}
                isMismatch={isMismatch}
                isSuccess={isSuccess}
                onPress={() => handleSelectEnglish(item)}
              />
            )
          })}
        </View>

        {/* Columna Derecha: Español */}
        <View style={styles.matchColumn}>
          <Text style={styles.matchColumnHeader}>🇪🇸 ESPAÑOL</Text>
          {shuffledSpanish.map((item) => {
            const isMatched = matchedIds.includes(item.id)
            const isSelected = selectedSpanishId === item.id
            const isMismatch = Boolean(mismatchPair && mismatchPair.es === item.id)
            const isSuccess = Boolean(successPair && successPair.es === item.id)

            return (
              <WordMatchTile
                key={`es_${item.id}`}
                id={item.id}
                text={item.spanish}
                isEnglish={false}
                isMatched={isMatched}
                isSelected={isSelected}
                isMismatch={isMismatch}
                isSuccess={isSuccess}
                onPress={() => handleSelectSpanish(item)}
              />
            )
          })}
        </View>
      </View>

      {/* Modal / Sheet para Selección de Categorías A1 */}
      <Modal
        visible={catModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCatModalVisible(false)}
      >
        <View style={styles.catModalOverlay}>
          <View style={styles.catModalSheet}>
            <View style={styles.catModalHeader}>
              <Text style={styles.catModalTitle}>📚 Categorías de Vocabulario A1</Text>
              <TouchableOpacity onPress={() => setCatModalVisible(false)} style={styles.exitButton}>
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Opción Dinámica SRS */}
              <Text style={styles.catSectionTitle}>RECOMENDADO PARA TI</Text>
              <TouchableOpacity
                style={[
                  styles.catChip,
                  selectedCatId === SRS_WEEK_CATEGORY_ID && styles.catChipActive,
                  { marginBottom: spacing.xs },
                ]}
                onPress={() => {
                  setSelectedCatId(SRS_WEEK_CATEGORY_ID)
                  setCatModalVisible(false)
                }}
              >
                <Text style={styles.catChipEmoji}>⭐</Text>
                <Text
                  style={[
                    styles.catChipText,
                    selectedCatId === SRS_WEEK_CATEGORY_ID && styles.catChipTextActive,
                  ]}
                >
                  Vocabulario de tu Semana ({wordsPool.length} palabras disponibles)
                </Text>
              </TouchableOpacity>

              {/* Categorías Agrupadas por Etapa */}
              {(['Básico (Sem. 1-4)', 'Intermedio (Sem. 5-10)', 'Avanzado (Sem. 11-19)'] as const).map(
                (stage) => {
                  const stageCategories = MATCHING_CATEGORIES.filter((c) => c.stage === stage)
                  return (
                    <View key={stage}>
                      <Text style={styles.catSectionTitle}>{stage.toUpperCase()}</Text>
                      <View style={styles.catGrid}>
                        {stageCategories.map((c) => {
                          const isActive = selectedCatId === c.id
                          return (
                            <TouchableOpacity
                              key={c.id}
                              style={[styles.catChip, isActive && styles.catChipActive]}
                              onPress={() => {
                                setSelectedCatId(c.id)
                                setCatModalVisible(false)
                              }}
                            >
                              <Text style={styles.catChipEmoji}>{c.emoji}</Text>
                              <Text
                                style={[styles.catChipText, isActive && styles.catChipTextActive]}
                              >
                                {c.name}
                              </Text>
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                    </View>
                  )
                }
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

// --------------------------------------------------------------------------
// MAIN COMPONENT & HUB
// --------------------------------------------------------------------------
export function GamesModal({
  visible,
  onClose,
  level,
  wordsPool,
  initialGame = null,
}: GamesModalProps): React.JSX.Element {
  const [activeGame, setActiveGame] = useState<GameType>(initialGame)
  const [failedPool, setFailedPool] = useState<readonly VocabularyItem[] | null>(null)
  const [gameResult, setGameResult] = useState<{
    game: GameType
    summary: string
    stats: Record<string, number | string>
    reviewWords?: TypingWordReviewItem[]
    failedWordsPool?: readonly VocabularyItem[]
  } | null>(null)

  useEffect(() => {
    if (visible && initialGame) {
      setActiveGame(initialGame)
      setGameResult(null)
      setFailedPool(null)
    }
  }, [visible, initialGame])

  const handleFinishTypingRush = (res: TypingRushFinishData): void => {
    setGameResult({
      game: 'typing_rush',
      summary:
        res.completed === res.total
          ? '¡Ronda Impecable! 🏆'
          : res.completed > 0
            ? '¡Buen Entrenamiento! ⏱️'
            : '¡Sigue Practicando! 🎯',
      stats: {
        'Puntos XP': `+${res.xp} XP`,
        'Palabras Correctas': `${res.completed} de ${res.total}`,
        'Combo Máximo': `x${res.maxCombo} 🔥`,
      },
      reviewWords: res.reviewItems,
      failedWordsPool: res.failedItems,
    })
    setActiveGame(null)
  }

  const handleFinishLightningQuiz = (res: { streak: number; correct: number; total: number }): void => {
    setGameResult({
      game: 'lightning_quiz',
      summary: res.streak >= 5 ? '¡Racha Asombrosa! ⚡' : '¡Excelente Entrenamiento! 🎯',
      stats: {
        'Aciertos': res.correct,
        'Racha Máxima': `${res.streak} seguidas 🔥`,
        'Total Respondidas': res.total,
      },
    })
    setActiveGame(null)
  }

  const handleFinishMemoryMatch = (res: MemoryMatchFinishData): void => {
    const starStr = '⭐'.repeat(res.stars) + '☆'.repeat(3 - res.stars)
    const mins = Math.floor(res.secondsElapsed / 60)
    const secs = res.secondsElapsed % 60
    const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`

    setGameResult({
      game: 'memory_match',
      summary:
        res.stars === 3
          ? `¡Memoria Maestra! 🏆 ${starStr}`
          : res.stars === 2
            ? `¡Gran Rendimiento! 🌟 ${starStr}`
            : `¡Buen Entrenamiento! 🎯 ${starStr}`,
      stats: {
        'Parejas': `${res.pairsMatched} / 6`,
        'Intentos': res.moves,
        'Tiempo': timeFormatted,
        'Estrellas': starStr,
      },
      reviewWords: res.matchedWords.map((w) => ({
        id: w.id,
        word: w.word,
        translation: w.translation,
        userTyped: '',
        isCorrect: true,
        tip: 'Emparejada en Memory Match',
      })),
    })
    setActiveGame(null)
  }

  const handleFinishWordMatch = (res: WordMatchFinishData): void => {
    const mins = Math.floor(res.secondsElapsed / 60)
    const secs = res.secondsElapsed % 60
    const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`
    const accuracy =
      res.pairsMatched + res.mistakes > 0
        ? Math.round((res.pairsMatched / (res.pairsMatched + res.mistakes)) * 100)
        : 100

    setGameResult({
      game: 'word_match',
      summary:
        res.mistakes === 0
          ? '¡Emparejamiento Perfecto! 🏆'
          : res.mistakes <= 2
            ? '¡Gran Conexión Mental! ⚡'
            : '¡Buen Entrenamiento Léxico! 🎯',
      stats: {
        'Puntos XP': `+${res.xp} XP`,
        'Categoría': res.categoryName,
        'Pares': `${res.pairsMatched} / ${res.totalPairs}`,
        'Precisión': `${accuracy}%`,
        'Tiempo': timeFormatted,
        'Combo Máximo': `x${res.maxCombo} 🔥`,
      },
    })
    setActiveGame(null)
  }

  const handleFinishAudioDictation = (res: AudioDictationFinishData): void => {
    const mins = Math.floor(res.secondsElapsed / 60)
    const secs = res.secondsElapsed % 60
    const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`

    setGameResult({
      game: 'audio_dictation',
      summary:
        res.completed === res.total
          ? '¡Oído y Ortografía Perfectos! 🎧🏆'
          : res.completed > 0
            ? '¡Buen Entrenamiento Auditivo! 🎯'
            : '¡Sigue Entrenando el Oído! 👂',
      stats: {
        'Puntos XP': `+${res.xp} XP`,
        'Aciertos': `${res.completed} de ${res.total}`,
        'Tiempo': timeFormatted,
        'Combo Máximo': `x${res.maxCombo} 🔥`,
      },
      reviewWords: res.reviewItems,
      failedWordsPool: res.failedItems,
    })
    setActiveGame(null)
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
        {/* If a game is actively playing */}
        {activeGame === 'typing_rush' || activeGame === 'typing_rush_failed' ? (
          <TypingRushGame
            wordsPool={
              activeGame === 'typing_rush_failed' && failedPool && failedPool.length > 0
                ? failedPool
                : wordsPool
            }
            onFinish={handleFinishTypingRush}
            onExit={() => {
              setActiveGame(null)
            }}
          />
        ) : activeGame === 'lightning_quiz' ? (
          <LightningQuizGame
            wordsPool={wordsPool}
            level={level}
            onFinish={handleFinishLightningQuiz}
            onExit={() => {
              setActiveGame(null)
            }}
          />
        ) : activeGame === 'memory_match' ? (
          <MemoryMatchGame
            wordsPool={wordsPool}
            onFinish={handleFinishMemoryMatch}
            onExit={() => {
              setActiveGame(null)
            }}
          />
        ) : activeGame === 'word_match' ? (
          <WordMatchGame
            wordsPool={wordsPool}
            onFinish={handleFinishWordMatch}
            onExit={() => {
              setActiveGame(null)
            }}
          />
        ) : activeGame === 'audio_dictation' || activeGame === 'audio_dictation_failed' ? (
          <AudioDictationGame
            wordsPool={
              activeGame === 'audio_dictation_failed' && failedPool && failedPool.length > 0
                ? failedPool
                : wordsPool
            }
            onFinish={handleFinishAudioDictation}
            onExit={() => {
              setActiveGame(null)
            }}
          />
        ) : (
          /* Hub Menu & Results View */
          <ScrollView contentContainerStyle={styles.hubContainer}>
            <View style={styles.hubHeader}>
              <View>
                <Text style={styles.hubTitle}>🎮 Arcade de Vocabulario</Text>
                <Text style={styles.hubSubtitle}>
                  Practica con palabras de nivel {level}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.exitButton}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Results Card if returning from a finished game */}
            {gameResult ? (
              <View style={styles.resultBox}>
                <Ionicons
                  name={
                    gameResult.stats['Palabras Correctas']?.toString().startsWith('5') ||
                      gameResult.stats['Aciertos'] === 10
                      ? 'trophy'
                      : 'ribbon'
                  }
                  size={36}
                  color={colors.primary}
                />
                <Text style={styles.resultTitle}>{gameResult.summary}</Text>
                <View style={styles.resultStatsRow}>
                  {Object.entries(gameResult.stats).map(([k, v]) => (
                    <View key={k} style={styles.resultStatItem}>
                      <Text style={styles.resultStatVal}>{v}</Text>
                      <Text style={styles.resultStatKey}>{k}</Text>
                    </View>
                  ))}
                </View>

                {/* Contexto de Aprendizaje: Resumen y Tips Mnemotécnicos */}
                {gameResult.reviewWords && gameResult.reviewWords.length > 0 ? (
                  <View style={styles.reviewWordsCard}>
                    <Text style={styles.reviewWordsTitle}>🎯 Contexto de Aprendizaje:</Text>
                    {gameResult.reviewWords.map((item, idx) => (
                      <View
                        key={`${item.word}-${idx}`}
                        style={[
                          styles.reviewWordRow,
                          item.isCorrect ? styles.reviewWordRowCorrect : styles.reviewWordRowFailed,
                        ]}
                      >
                        <View style={styles.reviewWordHeader}>
                          <Text style={styles.reviewWordBadge}>
                            {item.isCorrect ? '✅' : '❌'}
                          </Text>
                          <Text style={styles.reviewWordTranslation}>
                            {item.translation} →{' '}
                            <Text style={styles.reviewWordTarget}>{item.word}</Text>
                          </Text>
                          <TouchableOpacity
                            style={styles.reviewWordSpeakerBtn}
                            onPress={() => {
                              void speakEnglish(item.word)
                            }}
                            accessibilityRole="button"
                            accessibilityLabel={`Escuchar ${item.word}`}
                          >
                            <Ionicons name="volume-high" size={15} color={colors.primary} />
                          </TouchableOpacity>
                        </View>

                        {!item.isCorrect ? (
                          <View style={styles.reviewWordTipBox}>
                            {item.userTyped ? (
                              <Text style={styles.reviewWordTyped}>
                                Escribiste:{' '}
                                <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>
                                  "{item.userTyped}"
                                </Text>
                              </Text>
                            ) : (
                              <Text style={styles.reviewWordTyped}>
                                Tiempo agotado sin respuesta
                              </Text>
                            )}
                            <Text style={styles.reviewWordTipText}>💡 Tip: {item.tip}</Text>
                          </View>
                        ) : null}
                      </View>
                    ))}
                  </View>
                ) : null}

                {/* Botones de acción */}
                <View style={styles.resultActionsCol}>
                    {gameResult.failedWordsPool && gameResult.failedWordsPool.length > 0 ? (
                    <TouchableOpacity
                      style={styles.retryFailedButton}
                      onPress={() => {
                        setFailedPool(gameResult.failedWordsPool!)
                        setActiveGame(
                          gameResult.game === 'audio_dictation'
                            ? 'audio_dictation_failed'
                            : 'typing_rush_failed'
                        )
                        setGameResult(null)
                      }}
                    >
                      <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                      <Text style={styles.retryFailedButtonText}>
                        Repasar {gameResult.failedWordsPool.length}{' '}
                        {gameResult.failedWordsPool.length === 1
                          ? 'palabra fallida'
                          : 'palabras fallidas'}
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    style={styles.replayButton}
                    onPress={() => {
                      setFailedPool(null)
                      setActiveGame(
                        gameResult.game === 'typing_rush_failed'
                          ? 'typing_rush'
                          : gameResult.game === 'audio_dictation_failed'
                            ? 'audio_dictation'
                            : gameResult.game
                      )
                      setGameResult(null)
                    }}
                  >
                    <Ionicons name="refresh" size={18} color="#FFFFFF" />
                    <Text style={styles.replayButtonText}>Jugar Otra Ronda Completa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            <Text style={styles.chooseGameLabel}>Selecciona un juego:</Text>

            {/* Game Card 1: TYPING RUSH */}
            <Pressable
              style={({ pressed }) => [
                styles.gameMenuCard,
                styles.gameMenuCardTyping,
                { transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
              onPress={() => {
                setActiveGame('typing_rush')
                setGameResult(null)
              }}
            >
              <View style={[styles.gameIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Text style={styles.gameEmoji}>⌨️</Text>
              </View>
              <View style={styles.gameMenuInfo}>
                <View style={styles.gameMenuTitleRow}>
                  <Text style={styles.gameMenuTitle}>TYPING RUSH</Text>
                  <Badge label="5 palabras • 60s" color="#059669" size="sm" />
                </View>
                <Text style={styles.gameMenuDesc}>
                  Escribe en inglés antes de que acabe el tiempo. ¡Encadena combos para ganar más XP!
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#059669" />
            </Pressable>

            {/* Game Card 2: LIGHTNING QUIZ */}
            <Pressable
              style={({ pressed }) => [
                styles.gameMenuCard,
                styles.gameMenuCardLightning,
                { transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
              onPress={() => {
                setActiveGame('lightning_quiz')
                setGameResult(null)
              }}
            >
              <View style={[styles.gameIconWrap, { backgroundColor: '#FFFBEB' }]}>
                <Text style={styles.gameEmoji}>⚡</Text>
              </View>
              <View style={styles.gameMenuInfo}>
                <View style={styles.gameMenuTitleRow}>
                  <Text style={styles.gameMenuTitle}>LIGHTNING QUIZ</Text>
                  <Badge label="30 segundos" color="#D97706" size="sm" />
                </View>
                <Text style={styles.gameMenuDesc}>
                  Ronda relámpago de selección rápida. ¿Cuántas palabras puedes acertar seguidas?
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D97706" />
            </Pressable>

            {/* Game Card 3: MEMORY MATCH */}
            <Pressable
              style={({ pressed }) => [
                styles.gameMenuCard,
                styles.gameMenuCardMemory,
                { transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
              onPress={() => {
                setActiveGame('memory_match')
                setGameResult(null)
              }}
            >
              <View style={[styles.gameIconWrap, { backgroundColor: '#F5F3FF' }]}>
                <Text style={styles.gameEmoji}>🃏</Text>
              </View>
              <View style={styles.gameMenuInfo}>
                <View style={styles.gameMenuTitleRow}>
                  <Text style={styles.gameMenuTitle}>MEMORY MATCH</Text>
                  <Badge label="Parejas ↔ Memoria" color="#7C3AED" size="sm" />
                </View>
                <Text style={styles.gameMenuDesc}>
                  Voltea las cartas y encuentra las parejas inglés ↔ español a tu propio ritmo.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#7C3AED" />
            </Pressable>

            {/* Game Card 4: WORD MATCH */}
            <Pressable
              style={({ pressed }) => [
                styles.gameMenuCard,
                styles.gameMenuCardMatch,
                { transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
              onPress={() => {
                setActiveGame('word_match')
                setGameResult(null)
              }}
            >
              <View style={[styles.gameIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Text style={styles.gameEmoji}>🔗</Text>
              </View>
              <View style={styles.gameMenuInfo}>
                <View style={styles.gameMenuTitleRow}>
                  <Text style={styles.gameMenuTitle}>WORD MATCH</Text>
                  <Badge label="25 Categorías A1" color="#2563EB" size="sm" />
                </View>
                <Text style={styles.gameMenuDesc}>
                  Empareja columnas inglés ↔ español sin traducción mental. ¡Entrena asociación directa!
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#2563EB" />
            </Pressable>

            {/* Game Card 5: DICTADO & ORTOGRAFÍA */}
            <Pressable
              style={({ pressed }) => [
                styles.gameMenuCard,
                styles.gameMenuCardDictation,
                { transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
              onPress={() => {
                setActiveGame('audio_dictation')
                setGameResult(null)
              }}
            >
              <View style={[styles.gameIconWrap, { backgroundColor: '#ECFDF5' }]}>
                <Text style={styles.gameEmoji}>🎧</Text>
              </View>
              <View style={styles.gameMenuInfo}>
                <View style={styles.gameMenuTitleRow}>
                  <Text style={styles.gameMenuTitle}>DICTADO & ORTOGRAFÍA</Text>
                  <Badge label="Escucha ➔ Escribe" color="#059669" size="sm" />
                </View>
                <Text style={styles.gameMenuDesc}>
                  Escucha la pronunciación nativa y escribe la palabra en inglés. ¡Entrena oído y ortografía!
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#059669" />
            </Pressable>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalSafe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gameInnerContainer: {
    flex: 1,
    padding: spacing.md,
  },
  gameTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  exitButton: {
    padding: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.cardHover,
  },
  gameBadgeTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timerBadgeUrgent: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECDD3',
  },
  timerText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
    fontVariant: ['tabular-nums'],
  },
  timerTextUrgent: {
    color: '#DC2626',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  typingStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  typingProgressPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typingProgressText: {
    fontSize: typography.sizes.xs,
    color: '#475569',
  },
  typingXpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  typingXpText: {
    fontSize: typography.sizes.xs,
    color: '#059669',
    fontWeight: typography.weights.bold,
  },
  progressText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  comboBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.cardHover,
  },
  comboBadgeActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  comboText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  promptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderTopWidth: 3.5,
    borderTopColor: '#059669',
    marginBottom: spacing.md,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  spanishBadgePill: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginBottom: 4,
  },
  spanishBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  targetSpanish: {
    fontSize: 26,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
    marginVertical: 4,
    textAlign: 'center',
  },
  targetPhonetic: {
    fontSize: typography.sizes.xs,
    color: '#64748B',
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  promptLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hintActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  listenHintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  listenHintBtnActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  listenHintText: {
    fontSize: typography.sizes.xs - 1,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  letterTilesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginVertical: spacing.sm,
    paddingHorizontal: 4,
  },
  letterTile: {
    width: 32,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderBottomWidth: 3,
    borderColor: '#CBD5E1',
    borderBottomColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterTileSmall: {
    width: 26,
    height: 32,
  },
  letterTileCorrect: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
    borderBottomColor: '#047857',
  },
  letterTileWrong: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
    borderBottomColor: '#B91C1C',
  },
  letterTileCursor: {
    borderColor: '#3B82F6',
    borderBottomColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  letterTileHint: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderBottomColor: '#D97706',
  },
  letterTileSpace: {
    width: 10,
  },
  letterTileText: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: '800',
    color: '#0F172A',
  },
  letterTileTextSmall: {
    fontSize: typography.sizes.xs,
  },
  letterTileTextCorrect: {
    color: '#FFFFFF',
  },
  letterTileTextWrong: {
    color: '#FFFFFF',
  },
  letterTileTextHint: {
    color: '#92400E',
  },
  hintContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  hintPenaltyText: {
    fontSize: typography.sizes.xs - 1,
    color: colors.danger,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  typingRushHintText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.bold,
    letterSpacing: 2,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textAlign: 'center',
  },
  typingInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: spacing.sm,
  },
  typingInputContainerSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  typingInputContainerError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  typingInput: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: typography.weights.semibold,
  },
  typingInputError: {
    color: colors.danger,
  },
  inputClearBtn: {
    padding: 4,
    marginLeft: 4,
  },
  sendButton: {
    backgroundColor: colors.primary,
    padding: spacing.xs + 2,
    borderRadius: radius.sm,
  },
  typingFeedbackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  typingFeedbackSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
  },
  typingFeedbackError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECDD3',
    borderWidth: 1,
  },
  feedbackText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  queueContainer: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  queueHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  queueSubtitle: {
    fontSize: typography.sizes.xs - 1,
    color: '#64748B',
    fontWeight: typography.weights.medium,
  },
  queueTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  queueRowActive: {
    backgroundColor: '#EFF6FF',
    borderRadius: radius.sm,
    paddingHorizontal: 4,
  },
  queueRowDoneBg: {
    backgroundColor: '#F0FDF4',
    borderRadius: radius.sm,
    paddingHorizontal: 4,
  },
  queueRowFailedBg: {
    backgroundColor: '#FEF2F2',
    borderRadius: radius.sm,
    paddingHorizontal: 4,
  },
  queueIcon: {
    fontSize: 14,
    marginRight: spacing.sm,
  },
  queueWord: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  queueWordDone: {
    color: colors.success,
    fontWeight: typography.weights.bold,
  },
  queueWordFailed: {
    color: colors.danger,
    fontWeight: typography.weights.semibold,
  },
  queueWordActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  queueXpPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.full,
  },
  queueXp: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#047857',
  },
  queueXpFailed: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  scoreFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  totalXpLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  totalXpValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  topProgressBarTrack: {
    height: 4,
    width: '100%',
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  topProgressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  topProgressBarFillUrgent: {
    backgroundColor: '#EF4444',
  },
  lightningStatsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  lightningAciertosCount: {
    fontSize: typography.sizes.xs,
    color: '#059669',
    fontWeight: typography.weights.medium,
  },
  lightningQuestionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: spacing.md,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  lightningSub: {
    fontSize: typography.sizes.xs,
    color: '#64748B',
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  lightningWord: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  lightningPhoneticPill: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    marginTop: 6,
    marginBottom: 10,
  },
  lightningPhonetic: {
    fontSize: typography.sizes.sm,
    color: '#047857',
    fontWeight: typography.weights.bold,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  lightningAudio: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  microLessonCard: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  microLessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  microLessonTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#92400E',
    textTransform: 'uppercase',
  },
  microLessonText: {
    fontSize: typography.sizes.xs + 1,
    color: '#78350F',
    lineHeight: 18,
  },
  lightningOptionsGrid: {
    gap: spacing.sm,
  },
  lightningOptionBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  lightningOptionBtnPressed: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  lightningOptionCorrect: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  lightningOptionWrong: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
  },
  lightningOptionRevealCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  lightningOptionText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
  },
  lightningOptionTextSelected: {
    color: '#FFFFFF',
  },
  lightningOptionTextCorrect: {
    color: '#FFFFFF',
  },
  lightningOptionTextWrong: {
    color: '#FFFFFF',
  },
  lightningOptionTextReveal: {
    color: '#047857',
  },
  optionLetterBadge: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterBadgeCorrect: {
    backgroundColor: '#059669',
  },
  optionLetterBadgeWrong: {
    backgroundColor: '#DC2626',
  },
  optionLetterText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#64748B',
  },
  hintTextSmall: {
    fontSize: typography.sizes.xs,
    color: '#64748B',
    textAlign: 'center',
  },
  memoryTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  memoryTimerText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
    fontVariant: ['tabular-nums'],
  },
  memoryStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
    marginBottom: spacing.xs,
  },
  memoryMovesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  memoryMovesText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#475569',
  },
  memoryScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  memoryScoreText: {
    fontSize: typography.sizes.xs,
    color: '#047857',
    fontWeight: typography.weights.bold,
  },
  memoryComboBadge: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  memoryComboText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#B45309',
  },
  memoryStarsBadge: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: spacing.sm - 2,
    paddingVertical: spacing.xs - 1,
    borderRadius: radius.full,
  },
  memoryStarsText: {
    fontSize: 11,
    letterSpacing: 1,
  },
  memoryInstructionWrap: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  memoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  memoryCardWrapper: {
    width: '30%',
    aspectRatio: 0.85,
    marginVertical: 2,
  },
  memoryCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#065F46',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    borderColor: '#047857',
    borderBottomColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  memoryCardFlipped: {
    backgroundColor: '#FFFFFF',
    borderColor: '#3B82F6',
    borderBottomColor: '#1D4ED8',
  },
  memoryCardMatched: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderBottomColor: '#059669',
  },
  memoryCardMismatch: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderBottomColor: '#B91C1C',
  },
  memoryCardBack: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#065F46',
    borderRadius: radius.lg - 2,
    overflow: 'hidden',
  },
  memoryCardBackImage: {
    width: '100%',
    height: '100%',
  },
  memoryCardContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 3,
    backgroundColor: '#FFFFFF',
  },
  memoryCardContentMatched: {
    backgroundColor: '#ECFDF5',
  },
  memoryCardContentMismatch: {
    backgroundColor: '#FEF2F2',
  },
  langBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.full,
    backgroundColor: '#F1F5F9',
  },
  langBadgePillEn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  langBadgePillEs: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  langBadgePillMatched: {
    backgroundColor: '#D1FAE5',
    borderColor: '#6EE7B7',
  },
  langBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#334155',
  },
  memoryCardText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    paddingHorizontal: 2,
    lineHeight: typography.sizes.xs + 4,
  },
  memoryCardTextSmall: {
    fontSize: typography.sizes.xs - 1,
    lineHeight: typography.sizes.xs + 2,
  },
  memoryCardTextMatched: {
    color: '#047857',
  },
  memoryCardTextMismatch: {
    color: '#DC2626',
  },
  matchedCheckIconWrap: {
    marginTop: -2,
  },
  hubContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  hubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  hubTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  hubSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chooseGameLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  gameMenuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  gameMenuCardTyping: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  gameMenuCardLightning: {
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
  },
  gameMenuCardMemory: {
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  gameMenuCardMatch: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  gameMenuCardDictation: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  gameIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameEmoji: {
    fontSize: 24,
  },
  gameMenuInfo: {
    flex: 1,
  },
  gameMenuTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  gameMenuTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  gameMenuDesc: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  resultBox: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resultTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  resultStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing.md,
  },
  resultStatItem: {
    alignItems: 'center',
  },
  resultStatVal: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  resultStatKey: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
  },
  replayButtonText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
  reviewWordsCard: {
    width: '100%',
    backgroundColor: colors.cardHover,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  reviewWordsTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  reviewWordRow: {
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewWordRowCorrect: {
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  reviewWordRowFailed: {
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  reviewWordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewWordSpeakerBtn: {
    padding: 4,
    borderRadius: radius.full,
    backgroundColor: '#EFF6FF',
    marginLeft: 'auto',
  },
  reviewWordBadge: {
    fontSize: 14,
  },
  reviewWordTranslation: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  reviewWordTarget: {
    color: colors.textPrimary,
    fontWeight: typography.weights.bold,
  },
  reviewWordTipBox: {
    marginTop: 4,
    paddingLeft: 22,
  },
  reviewWordTyped: {
    fontSize: typography.sizes.xs,
    color: colors.danger,
  },
  reviewWordTipText: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
    marginTop: 2,
  },
  resultActionsCol: {
    width: '100%',
    gap: spacing.sm,
    alignItems: 'center',
  },
  retryFailedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: '#D97706',
    width: '100%',
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
  },
  retryFailedButtonText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
  // Word Match Styles
  matchCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginBottom: spacing.sm,
  },
  matchCategoryButtonText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#1D4ED8',
    flex: 1,
  },
  matchStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  matchScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  matchScoreText: {
    fontSize: typography.sizes.xs,
    color: '#047857',
    fontWeight: typography.weights.bold,
  },
  matchComboBadge: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  matchComboText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#B45309',
  },
  matchXpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  matchXpText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#7C3AED',
  },
  matchInstructionWrap: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  matchInstructionText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  matchBoard: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  matchColumn: {
    flex: 1,
    gap: spacing.xs + 2,
  },
  matchColumnHeader: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  matchTile: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  matchTileEnglish: {
    borderLeftWidth: 3.5,
    borderLeftColor: '#3B82F6',
  },
  matchTileSpanish: {
    borderLeftWidth: 3.5,
    borderLeftColor: '#F59E0B',
  },
  matchTilePressed: {
    backgroundColor: '#F8FAFC',
  },
  matchTileSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    borderWidth: 2,
    elevation: 2,
  },
  matchTileSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 2,
  },
  matchTileMismatch: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  matchTileMatched: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    opacity: 0.5,
  },
  matchTileContent: {
    flex: 1,
    marginRight: 4,
  },
  matchTileText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
  },
  matchTileTextSelected: {
    color: '#1D4ED8',
  },
  matchTileTextSuccess: {
    color: '#047857',
  },
  matchTileTextMismatch: {
    color: '#B91C1C',
  },
  matchTileTextMatched: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  matchTileSubtext: {
    fontSize: typography.sizes.xs - 2,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 1,
  },
  matchTileSubtextMatched: {
    color: '#94A3B8',
  },
  matchSpeakerIcon: {
    marginLeft: 2,
  },
  catModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  catModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '80%',
    padding: spacing.md,
  },
  catModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  catModalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  catSectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.full,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  catChipEmoji: {
    fontSize: 14,
  },
  catChipText: {
    fontSize: typography.sizes.xs,
    color: '#334155',
    fontWeight: typography.weights.medium,
  },
  catChipTextActive: {
    color: '#1D4ED8',
    fontWeight: typography.weights.bold,
  },
})
