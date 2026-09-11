/**
 * Design Tokens for English Learning Platform
 * Dark Elite & Modern Clean aesthetic with curated Slate, Emerald and Indigo palettes.
 */

export const colors = {
  // Backgrounds
  background: '#0B0F17', // Deep obsidian slate
  backgroundSubtle: '#111827', // Slate 900
  card: '#161F30', // Elevated slate card surface
  cardHover: '#1E293B', // Slate 800
  border: '#1F2937', // Border subtle
  borderActive: '#374151',

  // Primary brand accent: Emerald (represents growth, progress, fluency)
  primary: '#10B981', // Emerald 500
  primaryHover: '#059669', // Emerald 600
  primaryLight: 'rgba(16, 185, 129, 0.15)',
  primaryGlow: 'rgba(16, 185, 129, 0.35)',

  // Secondary accent: Indigo / Violet (represents study, deep learning)
  secondary: '#6366F1', // Indigo 500
  secondaryLight: 'rgba(99, 102, 241, 0.15)',

  // Text colors
  textPrimary: '#F9FAFB', // Slate 50
  textSecondary: '#9CA3AF', // Slate 400
  textMuted: '#6B7280', // Slate 500
  textInverse: '#0B0F17',

  // Feedback & State colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  dangerLight: 'rgba(239, 68, 68, 0.15)',
  info: '#3B82F6',

  // CEFR Level accents
  levels: {
    A1: '#10B981', // Emerald
    A2: '#06B6D4', // Cyan
    B1: '#6366F1', // Indigo
    B2: '#EC4899', // Pink
  },
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const

export type FontWeight =
  'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    hero: 36,
  },
  weights: {
    regular: '400' as FontWeight,
    medium: '500' as FontWeight,
    semibold: '600' as FontWeight,
    bold: '700' as FontWeight,
    black: '800' as FontWeight,
  },
} as const
