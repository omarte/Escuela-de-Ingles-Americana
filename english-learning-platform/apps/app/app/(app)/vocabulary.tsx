import React, { useMemo, useState } from 'react'
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, typography, WordCard, Badge } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import { getVocabularyForLevel } from '@elp/content'
import type { CEFRLevel } from '@elp/types'

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2']

export default function VocabularyScreen(): React.JSX.Element {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1')
  const [searchQuery, setSearchQuery] = useState('')

  const wordsForLevel = useMemo(() => getVocabularyForLevel(selectedLevel), [selectedLevel])

  const filteredWords = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) {
      return wordsForLevel.slice(0, 100)
    }
    return wordsForLevel
      .filter(
        (item) =>
          item.word.toLowerCase().includes(query) || item.translation.toLowerCase().includes(query),
      )
      .slice(0, 100)
  }, [wordsForLevel, searchQuery])

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Banco de Vocabulario</Text>
        <Text style={styles.subtitle}>Explora palabras organizadas por nivel y frecuencia</Text>

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

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en inglés o español..."
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

      <ScrollView contentContainerStyle={styles.scrollList}>
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {wordsForLevel.length > 100 && !searchQuery
              ? `Mostrando 100 de ${String(wordsForLevel.length)} palabras`
              : `${String(filteredWords.length)} palabras encontradas`}
          </Text>
          <Badge label={`Nivel ${selectedLevel}`} color={colors.primary} size="sm" />
        </View>

        {filteredWords.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>
              {wordsForLevel.length === 0
                ? `Nivel ${selectedLevel} en preparación`
                : 'No se encontraron palabras'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {wordsForLevel.length === 0
                ? 'El contenido curado para este nivel estará disponible próximamente.'
                : 'Intenta con otro término de búsqueda.'}
            </Text>
          </View>
        ) : (
          filteredWords.map((item) => (
            <WordCard
              key={item.id}
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
              style={styles.wordCardItem}
            />
          ))
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
  header: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    marginBottom: spacing.md,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
  },
  scrollList: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
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
  wordCardItem: {
    marginBottom: spacing.md,
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
})
