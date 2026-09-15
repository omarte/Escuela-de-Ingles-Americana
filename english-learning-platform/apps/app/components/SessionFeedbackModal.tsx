import React, { useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, typography, radius } from '@elp/ui'
import type { FrictionLevel } from '@elp/types'

interface SessionFeedbackModalProps {
  visible: boolean
  /** Accuracy percentage (0-100) calculated by the caller */
  accuracy: number
  /** Number of friction events detected this session */
  frictionCount: number
  /** Number of cards reviewed this session */
  cardsReviewed: number
  /** Called when the user picks a friction level and dismisses the modal */
  onSubmit: (level: FrictionLevel) => void
  /** Called when the user skips without rating */
  onSkip: () => void
}

interface FeedbackOption {
  level: FrictionLevel
  emoji: string
  label: string
  sublabel: string
  borderColor: string
  bgColor: string
  textColor: string
}

const FEEDBACK_OPTIONS: FeedbackOption[] = [
  {
    level: 'easy',
    emoji: '👍',
    label: 'Me resultó fácil',
    sublabel: 'Fluidez y confianza',
    borderColor: colors.success,
    bgColor: 'rgba(5, 150, 105, 0.08)',
    textColor: colors.success,
  },
  {
    level: 'normal',
    emoji: '💡',
    label: 'Ritmo normal',
    sublabel: 'Alguna duda menor',
    borderColor: colors.primary,
    bgColor: 'rgba(5, 150, 105, 0.06)',
    textColor: colors.primary,
  },
  {
    level: 'hard',
    emoji: '⚠️',
    label: 'Me costó trabajo',
    sublabel: 'Necesito más práctica',
    borderColor: colors.warning,
    bgColor: 'rgba(217, 119, 6, 0.08)',
    textColor: colors.warning,
  },
]

/**
 * SessionFeedbackModal — 1-tap post-session self-report survey.
 *
 * Renders after every study session completes. The user rates their perceived
 * difficulty with a single tap. This data feeds the Honest Mentor Feedback
 * dashboard and helps curriculum curators identify friction points.
 *
 * References: discusion-pedagogica.md §10 (Feedback con Cariño y Verdad)
 *
 * Design: Light Elite palette matching @elp/ui tokens. Accessible via
 * accessibilityRole="button" on each option.
 */
export function SessionFeedbackModal({
  visible,
  accuracy,
  frictionCount,
  cardsReviewed,
  onSubmit,
  onSkip,
}: SessionFeedbackModalProps): React.JSX.Element {
  const handleSelect = useCallback(
    (level: FrictionLevel) => {
      onSubmit(level)
    },
    [onSubmit],
  )

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onSkip}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconRow}>
              <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} />
            </View>
            <Text style={styles.title}>¿Cómo estuvo la sesión?</Text>
            <Text style={styles.subtitle}>Tu opinión mejora el currículo</Text>
          </View>

          {/* Session summary (honest metrics) */}
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={styles.statValue}>{cardsReviewed}</Text>
              <Text style={styles.statLabel}>Palabras</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statChip}>
              <Text style={[styles.statValue, { color: colors.success }]}>{accuracy}%</Text>
              <Text style={styles.statLabel}>Aciertos</Text>
            </View>
            {frictionCount > 0 && (
              <>
                <View style={styles.statDivider} />
                <View style={styles.statChip}>
                  <Text style={[styles.statValue, { color: colors.warning }]}>{frictionCount}</Text>
                  <Text style={styles.statLabel}>Con fricción</Text>
                </View>
              </>
            )}
          </View>

          {/* Feedback options */}
          <View style={styles.optionsContainer}>
            {FEEDBACK_OPTIONS.map((opt) => (
              <Pressable
                key={opt.level}
                style={({ pressed }) => [
                  styles.optionBtn,
                  { backgroundColor: opt.bgColor, borderColor: opt.borderColor },
                  pressed && styles.optionBtnPressed,
                ]}
                onPress={() => { handleSelect(opt.level) }}
                accessibilityRole="button"
                accessibilityLabel={`${opt.label}: ${opt.sublabel}`}
              >
                <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                <View style={styles.optionTextBlock}>
                  <Text style={[styles.optionLabel, { color: opt.textColor }]}>{opt.label}</Text>
                  <Text style={styles.optionSublabel}>{opt.sublabel}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={opt.textColor} style={styles.optionArrow} />
              </Pressable>
            ))}
          </View>

          {/* Skip link */}
          <TouchableOpacity
            onPress={onSkip}
            style={styles.skipBtn}
            accessibilityRole="button"
            accessibilityLabel="Saltar encuesta"
          >
            <Text style={styles.skipText}>Saltar por ahora</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconRow: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSubtle,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  statChip: {
    alignItems: 'center',
    minWidth: 60,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  optionsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  optionBtnPressed: {
    opacity: 0.75,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionTextBlock: {
    flex: 1,
  },
  optionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  optionSublabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  optionArrow: {
    opacity: 0.6,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
    color: colors.textMuted,
  },
})
