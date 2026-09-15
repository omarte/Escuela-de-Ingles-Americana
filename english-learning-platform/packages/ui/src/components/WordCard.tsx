import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  type StyleProp,
  type ViewStyle,
  type GestureResponderEvent,
} from 'react-native'
import { colors, radius, spacing, typography } from '../tokens'

import { Card } from './Card'

export interface WordCardProps {
  word: string
  translation: string
  partOfSpeech: string
  level: 'A1' | 'A2' | 'B1' | 'B2'
  week?: number | undefined
  phonetic?: string | undefined
  example?:
    | {
        en: string
        es: string
      }
    | undefined
  memoryStatus?: 'mastered' | 'learning' | 'new' | undefined
  revealed?: boolean | undefined
  onPress?: (() => void) | undefined
  onPlayAudio?: (() => void) | undefined
  audioIcon?: React.ReactNode | undefined
  style?: StyleProp<ViewStyle> | undefined
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  translation,
  partOfSpeech,
  level,
  week,
  phonetic,
  example,
  memoryStatus,
  revealed = true,
  onPress,
  onPlayAudio,
  audioIcon,
  style,
}) => {
  const levelColor = colors.levels[level]

  const memoryBadge = memoryStatus === 'mastered'
    ? { label: '🟢 Dominada', bg: colors.successLight, color: colors.primaryDark }
    : memoryStatus === 'learning'
      ? { label: '🔵 En estudio', bg: colors.secondaryLight, color: colors.secondary }
      : { label: '⚪ Nueva', bg: colors.backgroundSubtle, color: colors.textSecondary }

  const metadataText = [
    `Nivel ${level}`,
    partOfSpeech,
    week ? `Sem. ${week}` : null,
  ].filter(Boolean).join(' • ')

  return (
    <Card
      onPress={
        onPress
          ? () => {
              onPress()
            }
          : undefined
      }
      padding="lg"
      style={style}
    >
      {/* Enriched Metadata Header */}
      <View style={styles.header}>
        <View style={styles.metadataRow}>
          <View style={[styles.levelDot, { backgroundColor: levelColor }]} />
          <Text style={styles.metadataText}>{metadataText}</Text>
        </View>

        <View style={styles.headerRight}>
          {memoryStatus ? (
            <View style={[styles.memoryBadge, { backgroundColor: memoryBadge.bg }]}>
              <Text style={[styles.memoryBadgeText, { color: memoryBadge.color }]}>
                {memoryBadge.label}
              </Text>
            </View>
          ) : null}

          {onPlayAudio ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Escuchar pronunciación de ${word}`}
              onPress={(e: GestureResponderEvent) => {
                e.stopPropagation()
                onPlayAudio()
              }}
              style={styles.audioBtn}
            >
              {audioIcon ?? <Text style={styles.audioEmoji}>🔊</Text>}
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.word}>{word}</Text>
        {phonetic ? <Text style={styles.phonetic}>[{phonetic}]</Text> : null}

        {revealed ? (
          <View style={styles.translationContainer}>
            <Text style={styles.translation}>{translation}</Text>
          </View>
        ) : (
          <View style={styles.hiddenContainer}>
            <Text style={styles.hiddenText}>Toca para revelar significado</Text>
          </View>
        )}
      </View>

      {revealed && example ? (
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleEn}>"{example.en}"</Text>
          <Text style={styles.exampleEs}>"{example.es}"</Text>
        </View>
      ) : null}
    </Card>
  )
}


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  metadataText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    textTransform: 'capitalize',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  memoryBadgeText: {
    fontSize: typography.sizes.xs - 1,
    fontWeight: typography.weights.bold,
  },
  audioBtn: {
    padding: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
  },
  audioEmoji: {
    fontSize: 14,
  },
  body: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  word: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  phonetic: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  translationContainer: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
  },
  translation: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
  hiddenContainer: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 4,
    backgroundColor: colors.backgroundSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderActive,
  },
  hiddenText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  exampleContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  exampleEn: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  exampleEs: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
})
