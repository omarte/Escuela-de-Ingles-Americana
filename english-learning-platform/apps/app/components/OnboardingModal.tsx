import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native'
import { colors, spacing, radius, typography, Button } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import {
  ONBOARDING_METODO,
  ONBOARDING_READING,
  ONBOARDING_OFFLINE,
  ONBOARDING_LEVELS,
} from '../lib/assets'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

interface OnboardingModalProps {
  visible: boolean
  onClose: () => void
}

const ONBOARDING_SLIDES = [
  {
    id: 'metodo',
    image: ONBOARDING_METODO,
    tag: 'CIENCIA COGNITIVA',
    title: 'Método Científico de Repetición Espaciada',
    description:
      'Nuestro algoritmo SM-2 programa tus repasos en el momento exacto antes de que olvides, consolidando cada palabra en tu memoria a largo plazo.',
  },
  {
    id: 'lecturas',
    image: ONBOARDING_READING,
    tag: 'CONTEXTO INMERSIVO',
    title: 'Lecturas Graduadas con Audio Nativo',
    description:
      'Aprende vocabulario real dentro de historias y artículos bilingües. Toca cualquier palabra para escuchar su pronunciación y ver su significado.',
  },
  {
    id: 'offline',
    image: ONBOARDING_OFFLINE,
    tag: 'LIBERTAD TOTAL',
    title: 'Estudia Sin Conexión a Internet',
    description:
      'Lleva tu escuela a cualquier parte. Toda tu base de datos de palabras, progreso y algoritmos funcionan al 100% offline.',
  },
  {
    id: 'niveles',
    image: ONBOARDING_LEVELS,
    tag: 'CERTIFICACIÓN CEFR',
    title: 'De Cero a B2 con Diplomas Oficiales',
    description:
      'Recorre la escalera del Marco Común Europeo: A1, A2, B1 y B2 con más de 2,500 palabras y certificaciones que puedes compartir.',
  },
]

export function OnboardingModal({ visible, onClose }: OnboardingModalProps): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentSlide = ONBOARDING_SLIDES[currentIndex] ?? ONBOARDING_SLIDES[0]!
  const isLast = currentIndex === ONBOARDING_SLIDES.length - 1

  const handleNext = () => {
    if (isLast) {
      onClose()
      setCurrentIndex(0)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    onClose()
    setCurrentIndex(0)
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleSkip}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Top Controls */}
        <View style={styles.topNav}>
          {currentIndex > 0 ? (
            <TouchableOpacity onPress={handlePrev} style={styles.navIconBtn}>
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.navPlaceholder} />
          )}

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {ONBOARDING_SLIDES.map((slide, idx) => (
              <View
                key={slide.id}
                style={[
                  styles.dot,
                  idx === currentIndex ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>{isLast ? 'Cerrar' : 'Saltar'}</Text>
          </TouchableOpacity>
        </View>

        {/* Slide Content */}
        <View style={styles.slideContainer}>
          {/* Main Visual Artwork */}
          <View style={styles.imageCard}>
            <Image
              source={currentSlide.image}
              style={styles.slideImage}
              resizeMode="contain"
            />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{currentSlide.tag}</Text>
            </View>
            <Text style={styles.slideTitle}>{currentSlide.title}</Text>
            <Text style={styles.slideDescription}>{currentSlide.description}</Text>
          </View>
        </View>

        {/* Bottom CTA */}
        <View style={styles.bottomBar}>
          <Button
            title={isLast ? '¡Comenzar a Aprender!' : 'Siguiente'}
            variant="primary"
            size="lg"
            onPress={handleNext}
            style={styles.actionBtn}
            icon={
              isLast ? (
                <Ionicons name="rocket-outline" size={20} color={colors.textInverse} />
              ) : (
                <Ionicons name="arrow-forward" size={20} color={colors.textInverse} />
              )
            }
          />
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0F17',
    justifyContent: 'space-between',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  navIconBtn: {
    padding: spacing.xs,
    width: 44,
  },
  navPlaceholder: {
    width: 44,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipBtn: {
    padding: spacing.xs,
    width: 60,
    alignItems: 'flex-end',
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  imageCard: {
    width: SCREEN_WIDTH * 0.85,
    height: Math.min(SCREEN_HEIGHT * 0.45, 360),
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  tagBadge: {
    backgroundColor: 'rgba(5, 150, 105, 0.15)',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  tagText: {
    color: colors.primaryLight ?? '#A7F3D0',
    fontSize: typography.sizes.xs - 1,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
  },
  slideTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    lineHeight: 28,
  },
  slideDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 340,
  },
  bottomBar: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xs,
  },
  actionBtn: {
    width: '100%',
  },
})
