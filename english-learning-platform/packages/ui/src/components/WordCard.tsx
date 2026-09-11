import React from 'react'
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import { colors, radius, spacing, typography } from '../tokens'
import { Card } from './Card'
import { Badge } from './Badge'

export interface WordCardProps {
  word: string
  translation: string
  partOfSpeech: string
  level: 'A1' | 'A2' | 'B1' | 'B2'
  phonetic?: string | undefined
  example?:
    | {
        en: string
        es: string
      }
    | undefined
  revealed?: boolean | undefined
  onPress?: (() => void) | undefined
  style?: StyleProp<ViewStyle> | undefined
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  translation,
  partOfSpeech,
  level,
  phonetic,
  example,
  revealed = true,
  onPress,
  style,
}) => {
  const levelColor = colors.levels[level]

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
      <View style={styles.header}>
        <Badge label={level} color={levelColor} size="sm" />
        <Badge
          label={partOfSpeech}
          color={colors.textSecondary}
          backgroundColor={colors.cardHover}
          size="sm"
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.word}>{word}</Text>
        {phonetic ? <Text style={styles.phonetic}>{phonetic}</Text> : null}

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
          <Text style={styles.exampleEn}>{example.en}</Text>
          <Text style={styles.exampleEs}>{example.es}</Text>
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
    marginBottom: spacing.md,
  },
  body: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  word: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  phonetic: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  translationContainer: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
  },
  translation: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  hiddenContainer: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.cardHover,
    borderRadius: radius.md,
  },
  hiddenText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
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
