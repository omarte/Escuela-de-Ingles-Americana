import React from 'react'
import { View, StyleSheet, type StyleProp, type ViewStyle, type DimensionValue } from 'react-native'
import { colors, radius } from '../tokens'

export interface ProgressBarProps {
  progress: number // between 0 and 1
  color?: string | undefined
  trackColor?: string | undefined
  height?: number | undefined
  style?: StyleProp<ViewStyle> | undefined
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = colors.primary,
  trackColor = colors.cardHover,
  height = 8,
  style,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1)
  const widthPercent: DimensionValue =
    `${String(Math.round(clampedProgress * 100))}%` as DimensionValue

  return (
    <View style={[styles.track, { backgroundColor: trackColor, height }, style]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: widthPercent,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
})
