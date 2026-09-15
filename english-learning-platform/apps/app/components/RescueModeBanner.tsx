import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, typography, radius } from '@elp/ui'

interface RescueModeBannerProps {
  /** Number of SRS cards currently pending review */
  pendingCount: number
  /** Threshold above which Rescue Mode activates. Defaults to 30. */
  threshold?: number
}

/**
 * RescueModeBanner — Anti-backlog strategy (Modo Rescate).
 *
 * When the learner's pending review count exceeds the threshold, this banner
 * appears to signal that the session is using a reduced, recovery-focused
 * configuration (max 10 cards, easier targets).
 *
 * Intentionally HIDES the raw pending count to avoid overwhelming the learner
 * with large numbers (the "Large Counter" aversion described in
 * discusion-pedagogica.md §11 — Modo Rescate).
 *
 * Usage: render inside the session header when isSessionActive is true.
 */
export function RescueModeBanner({
  pendingCount,
  threshold = 30,
}: RescueModeBannerProps): React.JSX.Element | null {
  if (pendingCount <= threshold) return null

  return (
    <View style={styles.container} accessibilityRole="status" accessibilityLabel="Modo Rescate activo: sesión enfocada en recuperación">
      <Ionicons name="shield-checkmark" size={16} color={colors.warning} />
      <View style={styles.textBlock}>
        <Text style={styles.title}>🛡️ Modo Rescate activo</Text>
        <Text style={styles.subtitle}>
          Sesión corta enfocada · Solo 10 palabras · Sin presión
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 119, 6, 0.10)',
    borderColor: 'rgba(217, 119, 6, 0.30)',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.warning,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
})
