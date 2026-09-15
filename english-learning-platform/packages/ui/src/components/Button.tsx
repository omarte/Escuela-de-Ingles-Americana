import React, { useState } from 'react'
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import { colors, radius, spacing, typography } from '../tokens'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  title: string
  onPress?: ((event: GestureResponderEvent) => void) | undefined
  variant?: ButtonVariant | undefined
  size?: ButtonSize | undefined
  disabled?: boolean | undefined
  loading?: boolean | undefined
  style?: StyleProp<ViewStyle> | undefined
  textStyle?: StyleProp<TextStyle> | undefined
  icon?: React.ReactNode | undefined
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const getVariantStyle = (hovered: boolean): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: hovered ? colors.primaryHover : colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: hovered ? 4 : 2 },
          shadowOpacity: hovered ? 0.25 : 0.15,
          shadowRadius: hovered ? 8 : 4,
          elevation: hovered ? 4 : 2,
        }
      case 'secondary':
        return {
          backgroundColor: hovered ? colors.secondaryHover : colors.secondary,
          shadowColor: colors.secondary,
          shadowOffset: { width: 0, height: hovered ? 4 : 2 },
          shadowOpacity: hovered ? 0.25 : 0.15,
          shadowRadius: hovered ? 8 : 4,
          elevation: hovered ? 4 : 2,
        }
      case 'outline':
        return {
          backgroundColor: hovered ? colors.primaryLight : 'transparent',
          borderWidth: 1.5,
          borderColor: hovered ? colors.primary : colors.borderActive,
        }
      case 'ghost':
        return {
          backgroundColor: hovered ? colors.backgroundSubtle : 'transparent',
        }
      case 'danger':
        return {
          backgroundColor: hovered ? '#B91C1C' : colors.danger,
          shadowColor: colors.danger,
          shadowOffset: { width: 0, height: hovered ? 4 : 2 },
          shadowOpacity: hovered ? 0.25 : 0.15,
          shadowRadius: hovered ? 8 : 4,
          elevation: hovered ? 4 : 2,
        }
    }
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      onHoverIn={() => {
        setIsHovered(true)
      }}
      onHoverOut={() => {
        setIsHovered(false)
      }}
      accessibilityRole="button"
      style={({ pressed }): StyleProp<ViewStyle> => {
        const activeHover = isHovered && !disabled && !loading
        return [
          styles.base,
          styles[size],
          getVariantStyle(activeHover),
          {
            transform: [
              {
                scale: pressed ? 0.98 : activeHover ? 1.02 : 1,
              },
            ],
            ...(Platform.OS === 'web' ? ({ cursor: disabled ? 'not-allowed' : 'pointer' } as unknown as ViewStyle) : {}),
          },
          disabled && styles.disabled,
          style,
        ]
      }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'secondary' || variant === 'danger' ? colors.textInverse : colors.primary}
        />
      ) : (
        <>
          {icon ? <>{icon}</> : null}
          <Text
            style={[
              styles.textBase,
              styles[`${size}Text`],
              styles[`${variant}Text`],
              variant === 'outline' && isHovered && { color: colors.primary },
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
  },
  // Sizes
  sm: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  md: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
  },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  // Text Styles
  textBase: {
    fontWeight: typography.weights.semibold,
  },
  smText: {
    fontSize: typography.sizes.xs,
  },
  mdText: {
    fontSize: typography.sizes.sm,
  },
  lgText: {
    fontSize: typography.sizes.md,
  },
  primaryText: {
    color: colors.textInverse,
  },
  secondaryText: {
    color: colors.textInverse,
  },
  outlineText: {
    color: colors.textPrimary,
  },
  ghostText: {
    color: colors.textSecondary,
  },
  dangerText: {
    color: colors.textInverse,
  },
  disabledText: {
    color: colors.textMuted,
  },
})
