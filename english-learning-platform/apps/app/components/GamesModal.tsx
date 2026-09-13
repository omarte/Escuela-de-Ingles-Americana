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
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, typography, radius, Badge } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import type { CEFRLevel, VocabularyItem } from '@elp/types'
import { speakEnglish, speakSpanish } from '../lib/audio'
import { generateQuizOptions, type QuizOption } from '../lib/distractors'
import { getWordDisplayData } from '../lib/vocabulary'

export type GameType = 'typing_rush' | 'lightning_quiz' | 'memory_match' | null

interface GamesModalProps {
  visible: boolean
  onClose: () => void
  level: CEFRLevel
  wordsPool: readonly VocabularyItem[]
  initialGame?: GameType
}

// --------------------------------------------------------------------------
// 1. TYPING RUSH ENGINE
// --------------------------------------------------------------------------
interface TypingWordItem {
  id: string
  word: string
  translation: string
  status: 'pending' | 'current' | 'completed' | 'failed'
  xpEarned: number
}

function TypingRushGame({
  wordsPool,
  onFinish,
  onExit,
}: {
  wordsPool: readonly VocabularyItem[]
  onFinish: (score: { xp: number; completed: number; maxCombo: number }) => void
  onExit: () => void
}): React.JSX.Element {
  const [roundWords, setRoundWords] = useState<TypingWordItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [typedInput, setTypedInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [combo, setCombo] = useState(1)
  const [maxCombo, setMaxCombo] = useState(1)
  const [totalXp, setTotalXp] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize 5 random words
  useEffect(() => {
    const shuffled = [...wordsPool].sort(() => 0.5 - Math.random()).slice(0, 5)
    const items: TypingWordItem[] = shuffled.map((w, idx) => ({
      id: w.id,
      word: w.word,
      translation: w.translation,
      status: idx === 0 ? 'current' : 'pending',
      xpEarned: 0,
    }))
    setRoundWords(items)
    setCurrentIndex(0)
    setTimeLeft(60)
    setCombo(1)
    setMaxCombo(1)
    setTotalXp(0)
    setTypedInput('')
    setShowHint(false)
    setFeedback(null)
  }, [wordsPool])

  // Timer countdown
  useEffect(() => {
    if (roundWords.length === 0) return

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
  }, [roundWords.length])

  // Check game over by timeout
  useEffect(() => {
    if (timeLeft === 0 && roundWords.length > 0) {
      const completedCount = roundWords.filter((w) => w.status === 'completed').length
      onFinish({ xp: totalXp, completed: completedCount, maxCombo })
    }
  }, [timeLeft, roundWords, totalXp, maxCombo, onFinish])

  const currentWord = roundWords[currentIndex]

  const handleCheckWord = (): void => {
    if (!currentWord) return
    const cleanTyped = typedInput.trim().toLowerCase()
    const cleanTarget = currentWord.word.trim().toLowerCase()

    if (cleanTyped === cleanTarget) {
      // Correct!
      const earnedXp = 150 * combo
      const newTotalXp = totalXp + earnedXp
      const newCombo = combo + 1
      const newMaxCombo = Math.max(maxCombo, newCombo)

      setTotalXp(newTotalXp)
      setCombo(newCombo)
      setMaxCombo(newMaxCombo)
      setFeedback(`¡Excelente! +${earnedXp} XP`)
      void speakEnglish(currentWord.word)

      const updated = roundWords.map((w, idx) => {
        if (idx === currentIndex) {
          return { ...w, status: 'completed' as const, xpEarned: earnedXp }
        }
        if (idx === currentIndex + 1) {
          return { ...w, status: 'current' as const }
        }
        return w
      })
      setRoundWords(updated)
      setTypedInput('')
      setShowHint(false)

      if (currentIndex + 1 >= roundWords.length) {
        if (timerRef.current) clearInterval(timerRef.current)
        onFinish({ xp: newTotalXp, completed: 5, maxCombo: newMaxCombo })
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
    } else {
      // Mistake
      setCombo(1)
      setFeedback('Revisa las letras...')
    }
  }

  return (
    <View style={styles.gameInnerContainer}>
      {/* Header bar */}
      <View style={styles.gameTopBar}>
        <TouchableOpacity onPress={onExit} style={styles.exitButton}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.gameBadgeTitle}>🎮 TYPING RUSH</Text>
        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={16} color={timeLeft <= 15 ? colors.danger : colors.primary} />
          <Text style={[styles.timerText, timeLeft <= 15 && { color: colors.danger }]}>
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </Text>
        </View>
      </View>

      {/* Progress & Combo */}
      <View style={styles.statusBar}>
        <Text style={styles.progressText}>
          Palabra {currentIndex + 1} de {roundWords.length}
        </Text>
        <View style={[styles.comboBadge, combo > 1 && styles.comboBadgeActive]}>
          <Text style={styles.comboText}>
            {combo > 1 ? `🔥 Combo x${combo}` : 'Combo x1'}
          </Text>
        </View>
      </View>

      {/* Current word prompt */}
      {currentWord ? (
        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>Escribe en inglés:</Text>
          <Text style={styles.targetSpanish}>"{currentWord.translation}"</Text>

          {/* Action Row: Audio stimulus in Spanish + Letter hint */}
          <View style={styles.hintActionsRow}>
            <TouchableOpacity
              style={styles.listenHintBtn}
              accessibilityRole="button"
              accessibilityLabel={`Escuchar estímulo en español: ${currentWord.translation}`}
              onPress={() => {
                void speakSpanish(currentWord.translation)
              }}
            >
              <Ionicons name="volume-high" size={16} color={colors.primary} />
              <Text style={styles.listenHintText}>Escuchar estímulo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listenHintBtn}
              accessibilityRole="button"
              accessibilityLabel="Alternar pista de letras"
              onPress={() => {
                setShowHint((prev) => !prev)
              }}
            >
              <Ionicons name="bulb-outline" size={16} color={colors.warning} />
              <Text style={styles.listenHintText}>
                {showHint ? 'Ocultar pista' : '💡 Pista'}
              </Text>
            </TouchableOpacity>
          </View>

          {showHint ? (
            <Text style={styles.typingRushHintText}>
              {currentWord.word.charAt(0).toUpperCase()}{' '}
              {'_ '.repeat(Math.max(0, currentWord.word.length - 1))}
              ({currentWord.word.length} letras)
            </Text>
          ) : null}

          {/* Typing input */}
          <View style={styles.typingInputContainer}>
            <TextInput
              style={styles.typingInput}
              value={typedInput}
              onChangeText={(text) => {
                setTypedInput(text)
                if (feedback) setFeedback(null)
              }}
              onSubmitEditing={handleCheckWord}
              placeholder="Escribe aquí..."
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              returnKeyType="done"
            />
            {typedInput.length > 0 ? (
              <TouchableOpacity style={styles.sendButton} onPress={handleCheckWord}>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            ) : null}
          </View>

          {feedback ? (
            <Text
              style={[
                styles.feedbackText,
                feedback.includes('Excelente') ? { color: colors.success } : { color: colors.danger },
              ]}
            >
              {feedback}
            </Text>
          ) : null}
        </View>
      ) : null}

      {/* Words Queue Status (matching user specification) */}
      <View style={styles.queueContainer}>
        <Text style={styles.queueTitle}>Ronda actual:</Text>
        {roundWords.map((item, idx) => {
          const isDone = item.status === 'completed'
          const isCurrent = item.status === 'current'
          return (
            <View key={item.id || idx} style={[styles.queueRow, isCurrent && styles.queueRowActive]}>
              <Text style={styles.queueIcon}>
                {isDone ? '✅' : isCurrent ? '⏳' : '⬜'}
              </Text>
              <Text
                style={[
                  styles.queueWord,
                  isDone && styles.queueWordDone,
                  isCurrent && styles.queueWordActive,
                ]}
              >
                {isDone ? item.word : isCurrent ? `${item.translation} (escribiendo)` : item.translation}
              </Text>
              {isDone ? (
                <Text style={styles.queueXp}>+{item.xpEarned} XP</Text>
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
  const [timeLeft, setTimeLeft] = useState(30)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [currentWord, setCurrentWord] = useState<VocabularyItem | null>(null)
  const [options, setOptions] = useState<QuizOption[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
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

    const displayData = getWordDisplayData(random.id)
    const opts = generateQuizOptions(displayData, level)
    setOptions(opts)
  }

  useEffect(() => {
    pickNextWord()
    setTimeLeft(30)
    setStreak(0)
    setMaxStreak(0)
    setTotalCorrect(0)
    setTotalAnswered(0)

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
  }, [wordsPool, level])

  useEffect(() => {
    if (timeLeft === 0) {
      onFinish({ streak: maxStreak, correct: totalCorrect, total: totalAnswered })
    }
  }, [timeLeft, maxStreak, totalCorrect, totalAnswered, onFinish])

  const handleSelectOption = (opt: QuizOption): void => {
    if (selectedId) return
    setSelectedId(opt.id)
    setTotalAnswered((prev) => prev + 1)

    if (opt.isCorrect) {
      const newStreak = streak + 1
      setStreak(newStreak)
      setMaxStreak((prev) => Math.max(prev, newStreak))
      setTotalCorrect((prev) => prev + 1)
      if (currentWord) void speakEnglish(currentWord.word)

      setTimeout(() => {
        pickNextWord()
      }, 350)
    } else {
      setStreak(0)
      setTimeout(() => {
        pickNextWord()
      }, 500)
    }
  }

  return (
    <View style={styles.gameInnerContainer}>
      <View style={styles.gameTopBar}>
        <TouchableOpacity onPress={onExit} style={styles.exitButton}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.gameBadgeTitle}>⚡ LIGHTNING QUIZ</Text>
        <View style={styles.timerBadge}>
          <Ionicons name="flash" size={16} color={colors.warning} />
          <Text style={styles.timerText}>
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </Text>
        </View>
      </View>

      <View style={styles.statusBar}>
        <Text style={styles.progressText}>Aciertos: {totalCorrect}</Text>
        <View style={[styles.comboBadge, streak > 0 && styles.comboBadgeActive]}>
          <Text style={styles.comboText}>🔥 Racha: {streak}</Text>
        </View>
      </View>

      {currentWord ? (
        <View style={styles.lightningQuestionBox}>
          <Text style={styles.lightningSub}>¿Cómo se dice en español?</Text>
          <Text style={styles.lightningWord}>{currentWord.word}</Text>
          {currentWord.pronunciation ? (
            <Text style={styles.lightningPhonetic}>[{currentWord.pronunciation}]</Text>
          ) : null}

          <TouchableOpacity
            style={styles.lightningAudio}
            onPress={() => {
              void speakEnglish(currentWord.word)
            }}
          >
            <Ionicons name="volume-high" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* 4 Options */}
      <View style={styles.lightningOptionsGrid}>
        {options.map((opt) => {
          const isSelected = selectedId === opt.id

          return (
            <Pressable
              key={opt.id}
              style={({ pressed }) => [
                styles.lightningOptionBtn,
                isSelected && (opt.isCorrect ? styles.lightningOptionCorrect : styles.lightningOptionWrong),
                { transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
              onPress={() => {
                handleSelectOption(opt)
              }}
            >
              <Text
                style={[
                  styles.lightningOptionText,
                  isSelected && (opt.isCorrect ? styles.lightningOptionTextCorrect : styles.lightningOptionTextWrong),
                ]}
              >
                {opt.text}
              </Text>
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

function MemoryMatchGame({
  wordsPool,
  onFinish,
  onExit,
}: {
  wordsPool: readonly VocabularyItem[]
  onFinish: (score: { moves: number; pairsMatched: number }) => void
  onExit: () => void
}): React.JSX.Element {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matchedCount, setMatchedCount] = useState(0)

  useEffect(() => {
    const selectedWords = [...wordsPool].sort(() => 0.5 - Math.random()).slice(0, 6)
    const deck: MemoryCard[] = []

    selectedWords.forEach((w) => {
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
    setMoves(0)
    setMatchedCount(0)
  }, [wordsPool])

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
      setMoves((m) => m + 1)
      const firstCard = cards[nextFlipped[0]!]
      const secondCard = cards[nextFlipped[1]!]

      if (firstCard && secondCard && firstCard.wordId === secondCard.wordId) {
        // MATCH!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.wordId === firstCard.wordId ? { ...c, isMatched: true } : c)),
          )
          setFlippedIndices([])
          setMatchedCount((c) => {
            const next = c + 1
            if (next === 6) {
              onFinish({ moves: moves + 1, pairsMatched: 6 })
            }
            return next
          })
        }, 500)
      } else {
        // NO MATCH -> flip back
        setTimeout(() => {
          setFlippedIndices([])
        }, 1000)
      }
    }
  }

  return (
    <View style={styles.gameInnerContainer}>
      <View style={styles.gameTopBar}>
        <TouchableOpacity onPress={onExit} style={styles.exitButton}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.gameBadgeTitle}>🃏 MEMORY MATCH</Text>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>Intentos: {moves}</Text>
        </View>
      </View>

      <View style={styles.statusBar}>
        <Text style={styles.progressText}>Parejas: {matchedCount} de 6</Text>
        <Text style={styles.hintTextSmall}>Toca una carta en inglés y otra en español</Text>
      </View>

      <View style={styles.memoryGrid}>
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx) || card.isMatched
          return (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.memoryCard,
                isFlipped && styles.memoryCardFlipped,
                card.isMatched && styles.memoryCardMatched,
              ]}
              onPress={() => {
                handleCardPress(idx)
              }}
              activeOpacity={0.8}
            >
              {isFlipped ? (
                <View style={styles.memoryCardContent}>
                  <Text
                    style={[
                      styles.memoryCardText,
                      card.isMatched && styles.memoryCardTextMatched,
                    ]}
                    numberOfLines={2}
                  >
                    {card.text}
                  </Text>
                  <Text style={styles.memoryCardLang}>
                    {card.isEnglish ? '🇺🇸 EN' : '🇪🇸 ES'}
                  </Text>
                </View>
              ) : (
                <Ionicons name="help" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          )
        })}
      </View>
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
  const [gameResult, setGameResult] = useState<{
    game: GameType
    summary: string
    stats: Record<string, number | string>
  } | null>(null)

  useEffect(() => {
    if (visible && initialGame) {
      setActiveGame(initialGame)
      setGameResult(null)
    }
  }, [visible, initialGame])

  const handleFinishTypingRush = (res: { xp: number; completed: number; maxCombo: number }): void => {
    setGameResult({
      game: 'typing_rush',
      summary: res.completed === 5 ? '¡Ronda Impecable! 🏆' : '¡Tiempo Cumplido! ⏱️',
      stats: {
        'Puntos XP': `+${res.xp} XP`,
        'Palabras Correctas': `${res.completed} de 5`,
        'Combo Máximo': `x${res.maxCombo} 🔥`,
      },
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

  const handleFinishMemoryMatch = (res: { moves: number; pairsMatched: number }): void => {
    setGameResult({
      game: 'memory_match',
      summary: '¡Todas las Parejas Encontradas! 🌟',
      stats: {
        'Parejas': `${res.pairsMatched} / 6`,
        'Total Intentos': res.moves,
      },
    })
    setActiveGame(null)
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
        {/* If a game is actively playing */}
        {activeGame === 'typing_rush' ? (
          <TypingRushGame
            wordsPool={wordsPool}
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
                <Ionicons name="trophy" size={36} color={colors.primary} />
                <Text style={styles.resultTitle}>{gameResult.summary}</Text>
                <View style={styles.resultStatsRow}>
                  {Object.entries(gameResult.stats).map(([k, v]) => (
                    <View key={k} style={styles.resultStatItem}>
                      <Text style={styles.resultStatVal}>{v}</Text>
                      <Text style={styles.resultStatKey}>{k}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.replayButton}
                  onPress={() => {
                    setActiveGame(gameResult.game)
                    setGameResult(null)
                  }}
                >
                  <Ionicons name="refresh" size={18} color="#FFFFFF" />
                  <Text style={styles.replayButtonText}>Jugar Otra Ronda</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <Text style={styles.chooseGameLabel}>Selecciona un juego:</Text>

            {/* Game Card 1: TYPING RUSH */}
            <TouchableOpacity
              style={styles.gameMenuCard}
              onPress={() => {
                setActiveGame('typing_rush')
                setGameResult(null)
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.gameIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Text style={styles.gameEmoji}>⌨️</Text>
              </View>
              <View style={styles.gameMenuInfo}>
                <View style={styles.gameMenuTitleRow}>
                  <Text style={styles.gameMenuTitle}>TYPING RUSH</Text>
                  <Badge label="5 palabras • 60s" color={colors.primary} size="sm" />
                </View>
                <Text style={styles.gameMenuDesc}>
                  Escribe en inglés antes de que acabe el tiempo. ¡Encadena combos para ganar más XP!
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Game Card 2: LIGHTNING QUIZ */}
            <TouchableOpacity
              style={styles.gameMenuCard}
              onPress={() => {
                setActiveGame('lightning_quiz')
                setGameResult(null)
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.gameIconWrap, { backgroundColor: '#FEF3C7' }]}>
                <Text style={styles.gameEmoji}>⚡</Text>
              </View>
              <View style={styles.gameMenuInfo}>
                <View style={styles.gameMenuTitleRow}>
                  <Text style={styles.gameMenuTitle}>LIGHTNING QUIZ</Text>
                  <Badge label="30 segundos" color={colors.warning} size="sm" />
                </View>
                <Text style={styles.gameMenuDesc}>
                  Ronda relámpago de selección rápida. ¿Cuántas palabras puedes acertar seguidas?
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Game Card 3: MEMORY MATCH */}
            <TouchableOpacity
              style={styles.gameMenuCard}
              onPress={() => {
                setActiveGame('memory_match')
                setGameResult(null)
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.gameIconWrap, { backgroundColor: '#ECFDF5' }]}>
                <Text style={styles.gameEmoji}>🃏</Text>
              </View>
              <View style={styles.gameMenuInfo}>
                <View style={styles.gameMenuTitleRow}>
                  <Text style={styles.gameMenuTitle}>MEMORY MATCH</Text>
                  <Badge label="Parejas" color={colors.success} size="sm" />
                </View>
                <Text style={styles.gameMenuDesc}>
                  Voltea las cartas y encuentra las parejas inglés ↔ español a tu propio ritmo.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
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
    backgroundColor: colors.card,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timerText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
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
  },
  comboText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  promptCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  promptLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  targetSpanish: {
    fontSize: 28,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginVertical: spacing.sm,
  },
  hintActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  listenHintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
  },
  listenHintText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  typingRushHintText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.bold,
    letterSpacing: 2,
    marginBottom: spacing.md,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textAlign: 'center',
  },
  typingInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: spacing.sm,
  },
  typingInput: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: typography.weights.semibold,
  },
  sendButton: {
    backgroundColor: colors.primary,
    padding: spacing.xs + 2,
    borderRadius: radius.sm,
  },
  feedbackText: {
    marginTop: spacing.sm,
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
  queueTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  queueRowActive: {
    backgroundColor: colors.cardHover,
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
  queueWordActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  queueXp: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
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
  lightningQuestionBox: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  lightningSub: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginBottom: 4,
  },
  lightningWord: {
    fontSize: 32,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  lightningPhonetic: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
    marginTop: 2,
  },
  lightningAudio: {
    marginTop: spacing.sm,
    padding: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
  },
  lightningOptionsGrid: {
    gap: spacing.sm,
  },
  lightningOptionBtn: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  lightningOptionCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: colors.success,
  },
  lightningOptionWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: colors.danger,
  },
  lightningOptionText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  lightningOptionTextCorrect: {
    color: colors.success,
  },
  lightningOptionTextWrong: {
    color: colors.danger,
  },
  hintTextSmall: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  memoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  memoryCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  memoryCardFlipped: {
    backgroundColor: '#EFF6FF',
    borderColor: colors.primary,
  },
  memoryCardMatched: {
    backgroundColor: '#ECFDF5',
    borderColor: colors.success,
  },
  memoryCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoryCardText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    textAlign: 'center',
  },
  memoryCardTextMatched: {
    color: colors.success,
  },
  memoryCardLang: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: typography.weights.semibold,
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
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  replayButtonText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
})
