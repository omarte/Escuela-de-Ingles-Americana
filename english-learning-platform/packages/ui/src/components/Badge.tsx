import React from 'react'
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import { colors, radius, spacing, typography } from '../tokens'

export interface BadgeProps {
  label: string
  color?: string | undefined
  backgroundColor?: string | undefined
  size?: 'sm' | 'md' | undefined
  style?: StyleProp<ViewStyle> | undefined
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = colors.primary,
  backgroundColor,
  size = 'md',
  style,
}) => {
  const bg = backgroundColor ?? `${color}15` // Soft pastel tint for light canvas

  return (
    <View style={[styles.badge, styles[size], { backgroundColor: bg }, style]}>
      <Text style={[styles.text, styles[`${size}Text`], { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: spacing.md - 4,
    paddingVertical: spacing.xs,
  },
  text: {
    fontWeight: typography.weights.bold,
  },
  smText: {
    fontSize: typography.sizes.xs - 2,
    letterSpacing: 0.5,
  },
  mdText: {
    fontSize: typography.sizes.xs,
    letterSpacing: 0.5,
  },
})
