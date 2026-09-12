import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, typography, WordCard, Badge } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import { contentRegistry, getVocabularyForLevel } from '@elp/content'
import type { CEFRLevel, VocabularyItem } from '@elp/types'
import { speakEnglish } from '../../lib/audio'
import { getSpanishPhonetic } from '../../lib/phonetics'
import { GamesModal, type GameType } from '../../components/GamesModal'

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2']

type CategoryFilter = 'all' | 'noun' | 'verb' | 'adjective' | 'adverb' | 'other'

const CATEGORIES: { id: CategoryFilter; label: string; icon: string }[] = [
  { id: 'all', label: 'Todos', icon: 'apps-outline' },
  { id: 'noun', label: 'Sustantivos', icon: 'cube-outline' },
  { id: 'verb', label: 'Verbos', icon: 'walk-outline' },
  { id: 'adjective', label: 'Adjetivos', icon: 'color-palette-outline' },
  { id: 'adverb', label: 'Adverbios', icon: 'flash-outline' },
  { id: 'other', label: 'Otros', icon: 'extension-puzzle-outline' },
]

export default function VocabularyScreen(): React.JSX.Element {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all')
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Games Modal state
  const [isGamesModalVisible, setIsGamesModalVisible] = useState(false)
  const [initialGame, setInitialGame] = useState<GameType>(null)

  // Interactive Card Detail & Practice Modal
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null)
  const [isTranslationRevealed, setIsTranslationRevealed] = useState(false)
  const [typedSpelling, setTypedSpelling] = useState('')
  const [hasCheckedSpelling, setHasCheckedSpelling] = useState(false)
  const [isSpellingCorrect, setIsSpellingCorrect] = useState(false)
  const [showSpellingHint, setShowSpellingHint] = useState(false)

  const wordsForLevel = useMemo(() => getVocabularyForLevel(selectedLevel), [selectedLevel])

  // Available weeks for the level
  const availableWeeks = useMemo(() => {
    const blocks = contentRegistry[selectedLevel]?.blocks ?? []
    return blocks.map((b) => ({
      week: b.week,
      topic: b.topic,
    }))
  }, [selectedLevel])

  // Filtered words by category, week, and search query
  const filteredWords = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return wordsForLevel.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const pos = item.partOfSpeech.toLowerCase()
        if (selectedCategory === 'noun' && pos !== 'noun') return false
        if (selectedCategory === 'verb' && pos !== 'verb' && pos !== 'phrasal-verb') return false
        if (selectedCategory === 'adjective' && pos !== 'adjective') return false
        if (selectedCategory === 'adverb' && pos !== 'adverb') return false
        if (
          selectedCategory === 'other' &&
          ['noun', 'verb', 'phrasal-verb', 'adjective', 'adverb'].includes(pos)
        ) {
          return false
        }
      }

      // Week filter
      if (selectedWeek !== null && item.week !== selectedWeek) {
        return false
      }

      // Search query filter
      if (query) {
        const matchesWord = item.word.toLowerCase().includes(query)
        const matchesTrans = item.translation.toLowerCase().includes(query)
        const matchesPhonetic = item.pronunciation?.toLowerCase().includes(query) ?? false
        if (!matchesWord && !matchesTrans && !matchesPhonetic) return false
      }

      return true
    })
  }, [wordsForLevel, selectedCategory, selectedWeek, searchQuery])

  // Active word in modal
  const activeWord: VocabularyItem | undefined =
    activeWordIndex !== null ? filteredWords[activeWordIndex] : undefined

  // Open word detail modal
  const openWordModal = (index: number): void => {
    setActiveWordIndex(index)
    setIsTranslationRevealed(false)
    setTypedSpelling('')
    setHasCheckedSpelling(false)
    setIsSpellingCorrect(false)
    setShowSpellingHint(false)

    const wordItem = filteredWords[index]
    if (wordItem) {
      void speakEnglish(wordItem.word)
    }
  }

  const closeWordModal = (): void => {
    setActiveWordIndex(null)
  }

  // Navigate next/prev word inside modal
  const goToNextWord = (): void => {
    if (activeWordIndex === null) return
    const nextIdx = (activeWordIndex + 1) % filteredWords.length
    openWordModal(nextIdx)
  }

  const goToPrevWord = (): void => {
    if (activeWordIndex === null) return
    const prevIdx = (activeWordIndex - 1 + filteredWords.length) % filteredWords.length
    openWordModal(prevIdx)
  }

  // Check spelling
  const handleCheckSpelling = (): void => {
    if (!activeWord) return
    const cleanTyped = typedSpelling.trim().toLowerCase()
    const cleanTarget = activeWord.word.trim().toLowerCase()

    if (cleanTyped === cleanTarget) {
      setIsSpellingCorrect(true)
      setHasCheckedSpelling(true)
      void speakEnglish(activeWord.word)
    } else {
      setIsSpellingCorrect(false)
      setHasCheckedSpelling(true)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ----------------- HEADER & CONTROLS ----------------- */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.title}>Banco de Vocabulario</Text>
            <Text style={styles.subtitle}>Explora, escucha, repasa y juega con las palabras</Text>
          </View>
          {/* Arcade Launcher Button */}
          <TouchableOpacity
            style={styles.arcadeBadgeBtn}
            onPress={() => {
              setInitialGame(null)
              setIsGamesModalVisible(true)
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="game-controller" size={18} color="#FFFFFF" />
            <Text style={styles.arcadeBadgeBtnText}>Juegos</Text>
          </TouchableOpacity>
        </View>

        {/* Level Switcher */}
        <View style={styles.levelTabs}>
          {LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl
            return (
              <Pressable
                key={lvl}
                accessibilityRole="button"
                onPress={() => {
                  setSelectedLevel(lvl)
                  setSelectedWeek(null)
                }}
                style={({ pressed }) => [
                  styles.levelTab,
                  isSelected && styles.levelTabActive,
                  {
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  },
                ]}
              >
                <Text style={[styles.levelTabText, isSelected && styles.levelTabTextActive]}>
                  {lvl}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {/* Quick Tags: Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChipsContainer}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => {
                  setSelectedCategory(cat.id)
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={14}
                  color={isSelected ? '#FFFFFF' : colors.textSecondary}
                />
                <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Quick Tags: Week Selector Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekChipsContainer}
        >
          <TouchableOpacity
            style={[styles.weekChip, selectedWeek === null && styles.weekChipActive]}
            onPress={() => {
              setSelectedWeek(null)
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.weekChipText, selectedWeek === null && styles.weekChipTextActive]}>
              Todas las semanas
            </Text>
          </TouchableOpacity>

          {availableWeeks.map((item) => {
            const isSelected = selectedWeek === item.week
            return (
              <TouchableOpacity
                key={item.week}
                style={[styles.weekChip, isSelected && styles.weekChipActive]}
                onPress={() => {
                  setSelectedWeek(isSelected ? null : item.week)
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.weekChipText, isSelected && styles.weekChipTextActive]}>
                  Sem. {item.week}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar palabra o traducción..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('')
              }}
            >
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* ----------------- VOCABULARY LIST ----------------- */}
      <ScrollView contentContainerStyle={styles.scrollList}>
        {/* Arcade Feature Banner */}
        <TouchableOpacity
          style={styles.arcadeBanner}
          onPress={() => {
            setInitialGame('typing_rush')
            setIsGamesModalVisible(true)
          }}
          activeOpacity={0.85}
        >
          <View style={styles.arcadeBannerIcon}>
            <Text style={{ fontSize: 24 }}>🎮</Text>
          </View>
          <View style={styles.arcadeBannerInfo}>
            <Text style={styles.arcadeBannerTitle}>TYPING RUSH & Minijuegos</Text>
            <Text style={styles.arcadeBannerSub}>
              Pon a prueba tus reflejos, escribe rápido y gana XP
            </Text>
          </View>
          <View style={styles.arcadeBannerArrow}>
            <Ionicons name="flash" size={18} color={colors.warning} />
          </View>
        </TouchableOpacity>

        {/* Count & Active Filter Indicator */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {filteredWords.length === wordsForLevel.length
              ? `${String(filteredWords.length)} palabras en total`
              : `${String(filteredWords.length)} palabras encontradas`}
          </Text>
          <Badge label={`Nivel ${selectedLevel}`} color={colors.primary} size="sm" />
        </View>

        {/* Empty state */}
        {filteredWords.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No se encontraron palabras</Text>
            <Text style={styles.emptySubtitle}>
              Intenta cambiar los filtros de categoría o semana, o ingresa otro término de búsqueda.
            </Text>
          </View>
        ) : (
          /* Cards list */
          filteredWords.slice(0, 100).map((item, index) => (
            <View key={item.id} style={styles.wordCardWrapper}>
              <WordCard
                word={item.word}
                translation={item.translation}
                partOfSpeech={item.partOfSpeech}
                level={item.level}
                phonetic={item.pronunciation}
                example={
                  item.example
                    ? {
                        en: item.example,
                        es: item.exampleTranslation ?? '',
                      }
                    : undefined
                }
                revealed
                onPress={() => {
                  openWordModal(index)
                }}
                style={styles.wordCardItem}
              />
              {/* Quick Practice Pill */}
              <TouchableOpacity
                style={styles.quickPracticePill}
                onPress={() => {
                  openWordModal(index)
                }}
              >
                <Ionicons name="create-outline" size={14} color={colors.primary} />
                <Text style={styles.quickPracticePillText}>Tocar para practicar (Escuchar + Escribir)</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* ----------------- INTERACTIVE CARD DETAIL & PRACTICE MODAL ----------------- */}
      {activeWord ? (
        <Modal
          visible={activeWordIndex !== null}
          animationType="slide"
          transparent={false}
          onRequestClose={closeWordModal}
        >
          <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              {/* Modal Top Bar */}
              <View style={styles.modalTopBar}>
                <View style={styles.modalBadgesRow}>
                  <Badge label={`Nivel ${activeWord.level}`} color={colors.primary} size="sm" />
                  <Badge label={activeWord.partOfSpeech} color={colors.textSecondary} size="sm" />
                  <Badge label={`Sem. ${activeWord.week}`} color={colors.textMuted} size="sm" />
                </View>
                <TouchableOpacity onPress={closeWordModal} style={styles.modalCloseBtn}>
                  <Ionicons name="close" size={22} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Word & Phonetics & Audio */}
              <View style={styles.modalWordCard}>
                {/* English Word (Tap to reveal Spanish translation) */}
                <TouchableOpacity
                  style={styles.englishWordTouchable}
                  onPress={() => {
                    setIsTranslationRevealed((prev) => !prev)
                    void speakEnglish(activeWord.word)
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalWordEn}>{activeWord.word}</Text>
                  <View style={styles.tapToRevealTag}>
                    <Ionicons
                      name={isTranslationRevealed ? 'eye-outline' : 'eye-off-outline'}
                      size={14}
                      color={colors.primary}
                    />
                    <Text style={styles.tapToRevealTagText}>
                      {isTranslationRevealed ? 'Ocultar traducción' : 'Toca la palabra para ver en español'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Spanish Phonetics */}
                <Text style={styles.modalPhonetic}>
                  [{getSpanishPhonetic(activeWord.word, activeWord.pronunciation)}]
                </Text>

                {/* Audio Button */}
                <TouchableOpacity
                  style={styles.modalAudioButton}
                  onPress={() => {
                    void speakEnglish(activeWord.word)
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="volume-high" size={22} color="#FFFFFF" />
                  <Text style={styles.modalAudioButtonText}>Escuchar pronunciación</Text>
                </TouchableOpacity>

                {/* Tap to Reveal Translation Display Area */}
                {isTranslationRevealed ? (
                  <View style={styles.revealedTranslationBox}>
                    <Text style={styles.revealedTranslationText}>
                      {activeWord.translation}
                    </Text>
                    {activeWord.variants && activeWord.variants.length > 0 ? (
                      <Text style={styles.revealedVariantsText}>
                        Variaciones: {activeWord.variants.join(', ')}
                      </Text>
                    ) : null}
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.hiddenTranslationPrompt}
                    onPress={() => {
                      setIsTranslationRevealed(true)
                    }}
                  >
                    <Ionicons name="help-circle-outline" size={20} color={colors.textMuted} />
                    <Text style={styles.hiddenTranslationPromptText}>
                      ¿Recuerdas el significado? Toca para comprobar
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Context Example */}
                {activeWord.example ? (
                  <View style={styles.modalExampleBox}>
                    <Text style={styles.modalExampleLabel}>Ejemplo:</Text>
                    <Text style={styles.modalExampleEn}>"{activeWord.example}"</Text>
                    {activeWord.exampleTranslation ? (
                      <Text style={styles.modalExampleEs}>"{activeWord.exampleTranslation}"</Text>
                    ) : null}
                  </View>
                ) : null}
              </View>

              {/* ----------------- UNLIMITED SPELLING PRACTICE ----------------- */}
              <View style={styles.spellingSection}>
                <View style={styles.spellingHeaderRow}>
                  <Text style={styles.spellingTitle}>✍️ Práctica de Escritura Libre</Text>
                  <Badge label="Repaso Ilimitado" color={colors.success} size="sm" />
                </View>
                <Text style={styles.spellingDesc}>
                  Escribe la palabra en inglés las veces que desees para afianzar la ortografía:
                </Text>

                <View style={styles.spellingInputBox}>
                  <TextInput
                    style={styles.spellingTextInput}
                    value={typedSpelling}
                    onChangeText={(text) => {
                      setTypedSpelling(text)
                      if (hasCheckedSpelling) setHasCheckedSpelling(false)
                    }}
                    placeholder="Escribe en inglés..."
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={handleCheckSpelling}
                  />
                  <TouchableOpacity
                    style={[
                      styles.checkSpellingBtn,
                      typedSpelling.trim().length === 0 && styles.checkSpellingBtnDisabled,
                    ]}
                    onPress={handleCheckSpelling}
                    disabled={typedSpelling.trim().length === 0}
                  >
                    <Text style={styles.checkSpellingBtnText}>Comprobar</Text>
                  </TouchableOpacity>
                </View>

                {/* Feedback Message */}
                {hasCheckedSpelling ? (
                  <View
                    style={[
                      styles.spellingFeedbackBox,
                      isSpellingCorrect
                        ? styles.spellingFeedbackCorrect
                        : styles.spellingFeedbackIncorrect,
                    ]}
                  >
                    <Ionicons
                      name={isSpellingCorrect ? 'checkmark-circle' : 'alert-circle'}
                      size={20}
                      color={isSpellingCorrect ? colors.success : colors.danger}
                    />
                    <Text
                      style={[
                        styles.spellingFeedbackText,
                        isSpellingCorrect
                          ? styles.spellingFeedbackTextCorrect
                          : styles.spellingFeedbackTextIncorrect,
                      ]}
                    >
                      {isSpellingCorrect
                        ? '¡Ortografía Perfecta! 🌟'
                        : 'Revisa las letras e inténtalo de nuevo.'}
                    </Text>
                  </View>
                ) : null}

                {/* Hint Button if incorrect */}
                {hasCheckedSpelling && !isSpellingCorrect ? (
                  <View style={styles.hintContainer}>
                    <TouchableOpacity
                      style={styles.hintToggleBtn}
                      onPress={() => {
                        setShowSpellingHint((prev) => !prev)
                      }}
                    >
                      <Ionicons name="bulb-outline" size={16} color={colors.warning} />
                      <Text style={styles.hintToggleText}>
                        {showSpellingHint ? 'Ocultar pista' : 'Ver pista ortográfica'}
                      </Text>
                    </TouchableOpacity>

                    {showSpellingHint ? (
                      <Text style={styles.hintDisplay}>
                        Tiene {activeWord.word.length} letras y empieza con "
                        {activeWord.word.charAt(0).toUpperCase()}".
                      </Text>
                    ) : null}
                  </View>
                ) : null}

                {/* Success Next Steps */}
                {hasCheckedSpelling && isSpellingCorrect ? (
                  <View style={styles.successActionsRow}>
                    <TouchableOpacity
                      style={styles.nextWordActionBtn}
                      onPress={goToNextWord}
                    >
                      <Text style={styles.nextWordActionBtnText}>Siguiente Palabra ➡</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.finishWordActionBtn}
                      onPress={closeWordModal}
                    >
                      <Text style={styles.finishWordActionBtnText}>Volver al Banco</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>

              {/* ----------------- BOTTOM NAVIGATION CONTROLS ----------------- */}
              <View style={styles.modalNavigationRow}>
                <TouchableOpacity
                  style={styles.navWordBtn}
                  onPress={goToPrevWord}
                >
                  <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
                  <Text style={styles.navWordBtnText}>Anterior</Text>
                </TouchableOpacity>

                <Text style={styles.navCounterText}>
                  {(activeWordIndex ?? 0) + 1} de {filteredWords.length}
                </Text>

                <TouchableOpacity
                  style={styles.navWordBtn}
                  onPress={goToNextWord}
                >
                  <Text style={styles.navWordBtnText}>Siguiente</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      ) : null}

      {/* ----------------- ARCADE GAMES MODAL (TYPING RUSH, QUIZ, MEMORY) ----------------- */}
      <GamesModal
        visible={isGamesModalVisible}
        onClose={() => {
          setIsGamesModalVisible(false)
        }}
        level={selectedLevel}
        wordsPool={filteredWords.length >= 6 ? filteredWords : wordsForLevel}
        initialGame={initialGame}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
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
    marginBottom: spacing.sm,
  },
  arcadeBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  arcadeBadgeBtnText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
  },
  levelTabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
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
  categoryChipsContainer: {
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
  },
  weekChipsContainer: {
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  weekChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.cardHover,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weekChipActive: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
  },
  weekChipText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  weekChipTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
  },
  scrollList: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  arcadeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  arcadeBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arcadeBannerInfo: {
    flex: 1,
  },
  arcadeBannerTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  arcadeBannerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  arcadeBannerArrow: {
    padding: spacing.xs,
    backgroundColor: '#FEF3C7',
    borderRadius: radius.full,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  countText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  wordCardWrapper: {
    marginBottom: spacing.md,
  },
  wordCardItem: {
    marginBottom: 4,
  },
  quickPracticePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.cardHover,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickPracticePillText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },

  // Modal styles
  modalSafe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalScroll: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  modalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalBadgesRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  modalCloseBtn: {
    padding: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.cardHover,
  },
  modalWordCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  englishWordTouchable: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  modalWordEn: {
    fontSize: 34,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  tapToRevealTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  tapToRevealTagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  modalPhonetic: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
    marginTop: 6,
    marginBottom: spacing.md,
  },
  modalAudioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  modalAudioButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  revealedTranslationBox: {
    width: '100%',
    backgroundColor: '#ECFDF5',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.success,
    marginBottom: spacing.md,
  },
  revealedTranslationText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  revealedVariantsText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  hiddenTranslationPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cardHover,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  hiddenTranslationPromptText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  modalExampleBox: {
    width: '100%',
    backgroundColor: colors.cardHover,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  modalExampleLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    marginBottom: 2,
  },
  modalExampleEn: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
  modalExampleEs: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Spelling Section
  spellingSection: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  spellingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  spellingTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  spellingDesc: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 16,
  },
  spellingInputBox: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  spellingTextInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  checkSpellingBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSpellingBtnDisabled: {
    opacity: 0.5,
  },
  checkSpellingBtnText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
  spellingFeedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },
  spellingFeedbackCorrect: {
    backgroundColor: '#ECFDF5',
  },
  spellingFeedbackIncorrect: {
    backgroundColor: '#FEF2F2',
  },
  spellingFeedbackText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  spellingFeedbackTextCorrect: {
    color: colors.success,
  },
  spellingFeedbackTextIncorrect: {
    color: colors.danger,
  },
  hintContainer: {
    marginTop: spacing.xs,
  },
  hintToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  hintToggleText: {
    fontSize: 11,
    color: colors.warning,
    fontWeight: typography.weights.semibold,
  },
  hintDisplay: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  successActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  nextWordActionBtn: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  nextWordActionBtnText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
  finishWordActionBtn: {
    flex: 1,
    backgroundColor: colors.cardHover,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  finishWordActionBtnText: {
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.sm,
  },

  // Modal Navigation
  modalNavigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  navWordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navWordBtnText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  navCounterText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
})
