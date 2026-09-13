/**
 * Design Tokens for English Learning Platform
 * Dark Elite & Modern Clean aesthetic with curated Slate, Emerald and Indigo palettes.
 */

export const colors = {
  // Backgrounds - Positive Contrast Polarity (Light Theme)
  background: '#F8FAFC', // Soft anti-glare canvas (Slate 50)
  backgroundSubtle: '#F1F5F9', // Subtle container background (Slate 100)
  surface: '#FFFFFF', // Pure elevated white card surface
  card: '#FFFFFF', // Pure elevated white card surface
  cardHover: '#F8FAFC', // Crisp highlight surface on hover
  border: '#E2E8F0', // Delicate, crisp border (Slate 200)
  borderActive: '#CBD5E1', // Focus & active border (Slate 300)

  // Primary brand accent: Emerald (cognition, growth, fluency)
  primary: '#059669', // Emerald 600 - High legibility on light
  primaryHover: '#047857', // Emerald 700 - Hover state
  primaryLight: '#E8F5E9', // Soft pastel green for highlights & badges
  primaryDark: '#2E7D32', // Dark contrast emerald for highlighted text
  primaryGlow: 'rgba(5, 150, 105, 0.18)',

  // Secondary accent: Royal Sapphire / Indigo (grammar, study, structure)
  secondary: '#2563EB', // Blue 600
  secondaryHover: '#1D4ED8', // Blue 700
  secondaryLight: '#EFF6FF', // Blue 50

  // Text colors - WCAG AAA 14:1 contrast ratio
  textPrimary: '#0F172A', // Slate 900 - Deep, sharp readability
  textSecondary: '#475569', // Slate 600 - Balanced hierarchy
  textMuted: '#94A3B8', // Slate 400 - Subtle details and phonetics
  textInverse: '#FFFFFF', // High-contrast text on primary buttons

  // Feedback & State colors
  success: '#059669',
  successLight: '#E8F5E9',
  warning: '#D97706', // Amber 600 - Streak fire
  warningLight: '#FEF3C7', // Amber 50
  danger: '#DC2626', // Red 600
  dangerLight: '#FEE2E2', // Red 50
  info: '#0284C7', // Sky 600
  infoLight: '#F0F9FF',

  // CEFR Level accents - Vibrant, scientifically distinct
  levels: {
    A1: '#059669', // Emerald
    A2: '#0284C7', // Sky Blue
    B1: '#4F46E5', // Indigo
    B2: '#DB2777', // Rose Pink
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const

export const shadow = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const

export const shadows = shadow


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
