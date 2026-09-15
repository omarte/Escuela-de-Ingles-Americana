import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  type StyleProp,
  type ViewStyle,
  type GestureResponderEvent,
} from 'react-native'
import { colors, radius, spacing, shadow } from '../tokens'

export interface CardProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle> | undefined
  padding?: 'none' | 'sm' | 'md' | 'lg' | undefined
  onPress?: ((event: GestureResponderEvent) => void) | undefined
  highlighted?: boolean | undefined
  interactive?: boolean | undefined
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  onPress,
  highlighted = false,
  interactive,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const isClickable = Boolean(onPress ?? interactive)

  if (isClickable) {
    return (
      <Pressable
        onPress={onPress}
        onHoverIn={() => {
          setIsHovered(true)
        }}
        onHoverOut={() => {
          setIsHovered(false)
        }}
        accessibilityRole="button"
        style={({ pressed }): StyleProp<ViewStyle> => [
          styles.card,
          styles[`padding_${padding}`],
          highlighted && styles.highlighted,
          isHovered && styles.hovered,
          {
            transform: [
              {
                scale: pressed ? 0.99 : isHovered ? 1.012 : 1,
              },
            ],
            ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as unknown as ViewStyle) : {}),
          },
          style,
        ]}
      >
        {children}
      </Pressable>
    )
  }

  return (
    <View
      style={[
        styles.card,
        styles[`padding_${padding}`],
        highlighted && styles.highlighted,
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.md,
  },
  hovered: {
    borderColor: colors.primary,
    backgroundColor: colors.cardHover,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  highlighted: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
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
