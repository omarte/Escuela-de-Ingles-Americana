import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, typography } from '@elp/ui'

export interface AppScreenHeaderProps {
  /** Screen category or pedagogical layer tag (e.g. "MÉTODO SM-2 ADAPTATIVO") */
  eyebrow: string
  /** Main screen title (e.g. "Entrenamiento Diario") */
  title: string
  /** Clear descriptive subtitle explaining screen purpose */
  subtitle?: string
  /** Ionicons icon name for visual distinction */
  icon: keyof typeof Ionicons.glyphMap
  /** Accent color for icon, border, and eyebrow */
  accentColor?: string
  /** Background tint for icon squircle */
  iconBgColor?: string
  /** Optional right action or status chip (e.g. Level badge, Games button) */
  rightElement?: React.ReactNode
  /** Additional container style */
  style?: ViewStyle
}

/**
 * Structured Screen Header for tier-1 mobile app experience.
 * Delivers immediate visual identity, category eyebrow, and balanced hierarchy.
 */
export function AppScreenHeader({
  eyebrow,
  title,
  subtitle,
  icon,
  accentColor = colors.primary,
  iconBgColor = 'rgba(5, 150, 105, 0.1)',
  rightElement,
  style,
}: AppScreenHeaderProps): React.JSX.Element {
  return (
    <View style={[styles.headerContainer, style]}>
      <View style={styles.topRow}>
        <View style={styles.leftGroup}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: iconBgColor,
                borderColor: accentColor + '30',
              },
            ]}
          >
            <Ionicons name={icon} size={22} color={accentColor} />
          </View>
          <View style={styles.titleColumn}>
            <View style={styles.eyebrowRow}>
              <View style={[styles.eyebrowDot, { backgroundColor: accentColor }]} />
              <Text style={[styles.eyebrowText, { color: accentColor }]}>
                {eyebrow.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
          </View>
        </View>

        {rightElement ? <View style={styles.rightGroup}>{rightElement}</View> : null}
      </View>

      {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: spacing.md,
    paddingBottom: spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.7)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md + 2,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  titleColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  eyebrowDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  eyebrowText: {
    fontSize: 10.5,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.6,
  },
  titleText: {
    fontSize: 22,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  rightGroup: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  subtitleText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 8,
  },
})
