import React from 'react'
import {
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  TouchableOpacity,
  type GestureResponderEvent,
} from 'react-native'
import { colors, radius, spacing } from '../tokens'

export interface CardProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle> | undefined
  padding?: 'none' | 'sm' | 'md' | 'lg' | undefined
  onPress?: ((event: GestureResponderEvent) => void) | undefined
  highlighted?: boolean | undefined
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  onPress,
  highlighted = false,
}) => {
  const cardStyles = [
    styles.card,
    styles[`padding_${padding}`],
    highlighted && styles.highlighted,
    style,
  ]

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={cardStyles}
        accessibilityRole="button"
      >
        {children}
      </TouchableOpacity>
    )
  }

  return <View style={cardStyles}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  highlighted: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: spacing.sm,
  },
  padding_md: {
    padding: spacing.md,
  },
  padding_lg: {
    padding: spacing.lg,
  },
})
