import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Share, Alert } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors, spacing, typography, radius, Card, Button, Badge, ProgressBar } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../stores/useAuthStore'
import { useSRSStore } from '../../stores/useSRSStore'
import { useProgressStore } from '../../stores/useProgressStore'
import { getDueCards, calculateDailyProgress } from '@elp/srs'
import { useStudyPreferencesStore } from '../../stores/useStudyPreferencesStore'
import { usePurchases } from '../../hooks/usePurchases'
import { SCHOOL_LOGO, EMPTY_REVIEWS_IMG } from '../../lib/assets'
import { OnboardingModal } from '../../components/OnboardingModal'


export default function HomeScreen(): React.JSX.Element {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)

  const cards = useSRSStore((state) => state.cards)
  const loadCards = useSRSStore((state) => state.loadCards)
  const streak = useProgressStore((state) => state.metrics.streak)
  const refreshMetrics = useProgressStore((state) => state.refreshMetrics)

  const configuredDailyGoal = useStudyPreferencesStore((state) => state.dailyGoal)
  const loadPreferences = useStudyPreferencesStore((state) => state.loadPreferences)

  const repeatCurrentLesson = useSRSStore((state) => state.repeatCurrentLesson)
  const loadNextBatch = useSRSStore((state) => state.loadNextBatch)
  const startStudySession = useSRSStore((state) => state.startStudySession)

  const { isPro } = usePurchases()
  const userId = user?.id ?? 'demo-user'
  const displayName = profile?.displayName ?? 'Estudiante'
  const currentLevel = profile?.currentLevel ?? 'A1'

  useEffect(() => {
    void loadPreferences()
  }, [loadPreferences])

  // Timezone-safe check: only count cards reviewed on the local calendar day
  const dailyProgress = calculateDailyProgress(cards, new Date(), configuredDailyGoal || 20)
  const completedToday = dailyProgress.completedToday
  const dailyGoal = dailyProgress.dailyGoal
  const progressRatio = dailyProgress.progressRatio
  const hasStudiedToday = streak.studiedToday || completedToday > 0
  const streakDays = streak.currentStreak > 0 ? streak.currentStreak : (hasStudiedToday ? 1 : (profile?.streakDays ?? 0))

  // Calculated Gamification XP
  const totalXP = Math.max(
    profile?.streakDays ? profile.streakDays * 25 : 0,
    cards.filter((c) => c.reps > 0).length * 10 + cards.filter((c) => c.interval >= 21).length * 20,
  )

  // Stable focus refresh: refreshes whenever the student navigates back to Home
  useFocusEffect(
    useCallback(() => {
      void loadCards(userId)
      void refreshMetrics(userId)
    }, [loadCards, refreshMetrics, userId]),
  )

  const dueCards = getDueCards(cards)
  const dueCount = dueCards.length

  let heroSubtitle = ''
  if (dueCount > 0) {
    heroSubtitle = `Tienes ${String(dueCount)} tarjeta${dueCount > 1 ? 's' : ''} pendiente${dueCount > 1 ? 's' : ''} de repaso hoy`
  } else if (completedToday >= dailyGoal) {
    heroSubtitle = '¡Excelente! Has cumplido tu meta diaria de hoy 🎉'
  } else if (completedToday > 0) {
    const remaining = dailyGoal - completedToday
    heroSubtitle = `Llevas ${String(completedToday)} de ${String(dailyGoal)} palabras hoy. ¡Te faltan ${String(remaining)} para tu meta diaria!`
  } else {
    heroSubtitle = 'No tienes repasos pendientes hoy. ¡Aprende o repite lecciones para encender tu racha!'
  }

  // 14-day Activity Heatmap computation (GitHub-style intensity)
  const heatmapDays = React.useMemo(() => {
    const days = []
    const today = new Date()
    const activeDatesSet = new Set(streak.activeDates || [])
    const todayStr = today.toISOString().slice(0, 10)
    const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const isToday = dateStr === todayStr
      const dayOfWeek = dayNames[d.getDay()] ?? 'D'

      let count = 0
      if (isToday) {
        count = completedToday
      } else if (activeDatesSet.has(dateStr)) {
        count = 10
      }

      const reviewsOnDate = cards.filter((c) => {
        if (!c.lastReviewed) return false
        return c.lastReviewed.startsWith(dateStr)
      }).length
      if (reviewsOnDate > count) {
        count = reviewsOnDate
      }

      let level: 0 | 1 | 2 | 3 = 0
      if (count >= 16) level = 3
      else if (count >= 6) level = 2
      else if (count > 0) level = 1

      days.push({
        dateStr,
        dayOfWeek,
        dayNum: d.getDate(),
        isToday,
        level,
        count,
      })
    }
    return days
  }, [streak.activeDates, completedToday, cards])

  const [onboardingVisible, setOnboardingVisible] = useState(false)

  useEffect(() => {
    void AsyncStorage.getItem('@elp/has_seen_onboarding_v1').then((seen) => {
      if (!seen) {
        setOnboardingVisible(true)
        void AsyncStorage.setItem('@elp/has_seen_onboarding_v1', 'true')
      }
    })
  }, [])

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tier 1: Institutional Bar with School Branding & Global Status Pills */}
        <View style={styles.institutionBar}>
          <View style={styles.institutionBrand}>
            <Image source={SCHOOL_LOGO} style={styles.institutionLogo} resizeMode="contain" />
            <View style={styles.institutionTextCol}>
              <Text style={styles.institutionTitle} numberOfLines={1}>Escuela de Inglés Americana</Text>
              <Text style={styles.institutionTag}>CIENCIA COGNITIVA · MÉTODO B2</Text>
            </View>
          </View>

          <View style={styles.institutionPills}>
            {/* Quick Sync Button */}
            <TouchableOpacity
              style={styles.syncIconButton}
              onPress={async () => {
                const { useSyncStore } = await import('../../stores/useSyncStore')
                await useSyncStore.getState().triggerSync(userId)
              }}
              accessibilityLabel="Sincronizar progreso"
            >
              <Ionicons name="sync-outline" size={15} color={colors.primary} />
            </TouchableOpacity>

            <View style={styles.xpBadge}>
              <Ionicons name="flash" size={12} color="#F59E0B" />
              <Text style={styles.xpBadgeText}>{String(totalXP)} XP</Text>
            </View>

            <Badge label={`Nivel ${currentLevel}`} color={colors.primary} size="sm" />
          </View>
        </View>

        {/* Tier 2: Welcome Greeting & Context Card */}
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeTextCol}>
            <View style={styles.welcomeEyebrowRow}>
              <View style={styles.welcomeEyebrowDot} />
              <Text style={styles.welcomeEyebrow}>SESIÓN ACTIVA</Text>
            </View>
            <Text style={styles.welcomeTitle} numberOfLines={1} ellipsizeMode="tail">
              Hola, {displayName} 👋
            </Text>
            <Text style={styles.welcomeSub} numberOfLines={1}>
              {dueCount > 0
                ? `${String(dueCount)} tarjeta${dueCount > 1 ? 's' : ''} pendiente${dueCount > 1 ? 's' : ''} de repaso hoy`
                : 'Todo al día. Aprende o repasa para fijar vocabulario'}
            </Text>
          </View>
          <View style={styles.welcomeStreakChip}>
            <Ionicons name="flame" size={16} color="#F59E0B" />
            <Text style={styles.welcomeStreakText}>{String(streakDays)}d</Text>
          </View>
        </View>

        {/* Onboarding / Method Guide Banner */}
        <TouchableOpacity
          style={styles.onboardingBanner}
          activeOpacity={0.8}
          onPress={() => {
            setOnboardingVisible(true)
          }}
        >
          <View style={styles.onboardingBannerIcon}>
            <Ionicons name="school-outline" size={22} color={colors.primary} />
          </View>
          <View style={styles.onboardingBannerText}>
            <Text style={styles.onboardingBannerTitle}>Guía del Alumno y Método B2</Text>
            <Text style={styles.onboardingBannerSub}>
              Descubre cómo funciona la repetición espaciada y los diplomas
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* State Card 1: Repasos Pendientes (SRS Status) */}
        {dueCount > 0 ? (
          <Card padding="lg" highlighted style={styles.urgentReviewCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardEyebrowRow}>
                <View style={[styles.cardEyebrowDot, { backgroundColor: '#D97706' }]} />
                <Text style={[styles.cardEyebrowText, { color: '#D97706' }]}>REPASO ESPACIADO SM-2</Text>
              </View>
              <Badge label={`${String(dueCount)} pendientes`} color="#D97706" backgroundColor="#FEF3C7" size="sm" />
            </View>

            <Text style={styles.urgentReviewTitle}>
              {String(dueCount)} palabra{dueCount > 1 ? 's' : ''} listas para consolidar
            </Text>
            <Text style={styles.urgentReviewSub}>
              Tu cerebro necesita afianzar estos términos hoy para transferirlos a la memoria de largo plazo según los intervalos SM-2.
            </Text>

            {/* Primary Action Button (High visual hierarchy) */}
            <Button
              title={`Repasar SRS Ahora (${String(dueCount)})`}
              variant="primary"
              size="lg"
              onPress={async () => {
                await startStudySession(userId, currentLevel)
                router.push('/(app)/learn')
              }}
              icon={<Ionicons name="play" size={18} color={colors.textInverse} />}
              style={styles.primaryActionButton}
            />
          </Card>
        ) : (
          <Card padding="md" style={styles.allDoneCard}>
            <View style={styles.allDoneRow}>
              <View style={styles.allDoneIconBox}>
                <Ionicons name="checkmark-circle" size={26} color="#059669" />
              </View>
              <View style={styles.allDoneTextCol}>
                <Text style={styles.allDoneTitle}>Mazo al día · 0 repasos pendientes</Text>
                <Text style={styles.allDoneSub}>
                  Has consolidado todo tu vocabulario programado para hoy. Tu memoria está al 100% 🎉
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* State Card 2: Meta Diaria & Consistencia con GitHub Heatmap */}
        <Card padding="lg" highlighted style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={20} color="#F59E0B" />
              <Text style={styles.streakText}>{String(streakDays)} días de racha</Text>
            </View>
            <Text style={styles.goalCounter}>
              {String(completedToday)} / {String(dailyGoal)} palabras
            </Text>
          </View>

          <Text style={styles.heroTitle}>Meta Diaria y Consistencia</Text>
          <ProgressBar progress={progressRatio} height={10} style={styles.heroProgress} />
          <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>

          {/* GitHub-Style 14-Day Activity Heatmap */}
          <View style={styles.heatmapSection}>
            <View style={styles.heatmapHeaderRow}>
              <Text style={styles.heatmapTitle}>Actividad (Últimas 2 semanas)</Text>
              <View style={styles.heatmapLegend}>
                <Text style={styles.heatmapLegendLabel}>Menos</Text>
                <View style={[styles.heatmapLegendDot, { backgroundColor: '#F1F5F9' }]} />
                <View style={[styles.heatmapLegendDot, { backgroundColor: '#A7F3D0' }]} />
                <View style={[styles.heatmapLegendDot, { backgroundColor: '#34D399' }]} />
                <View style={[styles.heatmapLegendDot, { backgroundColor: '#059669' }]} />
                <Text style={styles.heatmapLegendLabel}>Más</Text>
              </View>
            </View>

            <View style={styles.heatmapGrid}>
              {heatmapDays.map((d) => {
                let cellColor = '#F1F5F9'
                if (d.level === 1) cellColor = '#A7F3D0'
                if (d.level === 2) cellColor = '#34D399'
                if (d.level === 3) cellColor = '#059669'

                return (
                  <View key={d.dateStr} style={styles.heatmapDayCol}>
                    <Text style={styles.heatmapDayName}>{d.dayOfWeek}</Text>
                    <View
                      style={[
                        styles.heatmapSquare,
                        { backgroundColor: cellColor },
                        d.isToday && styles.heatmapSquareToday,
                      ]}
                    />
                    <Text style={[styles.heatmapDayNum, d.isToday && styles.heatmapDayNumToday]}>
                      {d.dayNum}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>

          {/* Secondary Action (Hierarchy tier 2: Outlined) */}
          <TouchableOpacity
            style={styles.secondaryHeroBtn}
            onPress={async () => {
              await repeatCurrentLesson(userId)
              router.push('/(app)/learn')
            }}
            activeOpacity={0.8}
            accessibilityLabel="Repetir lección actual"
          >
            <Ionicons name="repeat" size={16} color={colors.primary} />
            <Text style={styles.secondaryHeroBtnText}>
              Repetir lección actual para afianzar
            </Text>
          </TouchableOpacity>

          {/* Tertiary Action (Hierarchy tier 3: Ghost/Share) */}
          <TouchableOpacity
            style={styles.shareStreakBtn}
            onPress={async () => {
              try {
                await Share.share({
                  message: `🔥 ¡Llevo ${streakDays} días de racha estudiando inglés en la Escuela de Inglés Americana! 🇺🇸📚 ${completedToday} palabras repasadas hoy. ¡Aprende con repetición espaciada!`,
                })
              } catch {
                // dismissed
              }
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.shareStreakBtnText}>Compartir mi racha de estudio</Text>
          </TouchableOpacity>
        </Card>

        {/* State Card 3: Enfocado Esta Semana (Próximo Avance) */}
        <Text style={styles.sectionTitle}>Enfocado Esta Semana</Text>
        <Card padding="md" style={styles.weekCard}>
          <View style={styles.weekRow}>
            <View style={styles.weekIconBox}>
              <Ionicons name="people-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.weekInfo}>
              <View style={styles.weekTagRow}>
                <Text style={styles.weekTag}>SEMANA 1</Text>
                <Text style={styles.weekWordsCount}>{String(cards.length)} tarjetas en mazo</Text>
              </View>
              <Text style={styles.weekName}>Familia y Relaciones Personales</Text>
              <ProgressBar progress={0.65} height={6} style={styles.weekProgress} />
            </View>
          </View>

          {/* Action button: Primary if no reviews pending, Outline if reviews pending */}
          <Button
            title="Aprender 10 Palabras Nuevas"
            variant={dueCount === 0 ? 'primary' : 'outline'}
            size="md"
            onPress={async () => {
              const res = await loadNextBatch(userId, currentLevel, 10, isPro)
              if (res?.blockedByPaywall) {
                Alert.alert(
                  '¡Primera Semana Completada! 🏆',
                  'Has completado tu primera semana 100% gratuita (7 días de prueba con fonética IPA). Para continuar a la Semana 2 y avanzar hacia el hito de 2 meses, desbloquea tu Plan Pro.',
                  [
                    { text: 'Tal vez luego', style: 'cancel' },
                    { text: 'Ver Planes Pro 🚀', onPress: () => router.push('/(app)/paywall') },
                  ],
                )
                return
              }
              router.push('/(app)/learn')
            }}
            icon={<Ionicons name="sparkles" size={16} color={dueCount === 0 ? colors.textInverse : colors.primary} />}
            style={{ marginTop: spacing.md }}
          />
        </Card>

        {/* Quick Access Grid */}
        <Text style={styles.sectionTitle}>Módulos de Práctica</Text>
        <View style={styles.grid}>
          <Card
            padding="md"
            style={styles.gridCard}
            onPress={() => {
              router.push('/(app)/vocabulary')
            }}
          >
            <Ionicons name="library-outline" size={28} color={colors.primary} />
            <Text style={styles.gridCardTitle}>Banco de Palabras</Text>
            <Text style={styles.gridCardSubtitle}>Términos A1-B2</Text>
          </Card>

          <Card
            padding="md"
            style={styles.gridCard}
            onPress={() => {
              router.push('/(app)/reading')
            }}
          >
            <Ionicons name="book-outline" size={28} color={colors.secondary} />
            <Text style={styles.gridCardTitle}>Lecturas {currentLevel}</Text>
            <Text style={styles.gridCardSubtitle}>Textos contextuales</Text>
          </Card>
        </View>

        {/* Methodology Reminder Card */}
        <Card padding="md" style={styles.methodCard}>
          <View style={styles.methodHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.methodTitle}>Método de Aprendizaje</Text>
          </View>
          <Text style={styles.methodText}>
            1. Repasa tarjetas diariamente según los intervalos de SM-2.{'\n'}
            2. Lee párrafos contextuales para asimilar el vocabulario en uso real.{'\n'}
            3. Consolida 90 días para dominar permanentemente cada término.
          </Text>
        </Card>
      </ScrollView>

      <OnboardingModal
        visible={onboardingVisible}
        onClose={() => {
          setOnboardingVisible(false)
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 120,
  },
  institutionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.7)',
  },
  institutionBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 3,
    flex: 1,
    marginRight: spacing.xs,
  },
  institutionLogo: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
  },
  institutionTextCol: {
    flex: 1,
  },
  institutionTitle: {
    fontSize: 12.5,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    lineHeight: 15,
  },
  institutionTag: {
    fontSize: 8.5,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 0.5,
    marginTop: 1,
  },
  institutionPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  syncIconButton: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: 'rgba(5, 150, 105, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  xpBadgeText: {
    color: '#B45309',
    fontSize: typography.sizes.xs - 1,
    fontWeight: typography.weights.bold,
  },
  welcomeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  welcomeTextCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  welcomeEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  welcomeEyebrowDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  welcomeEyebrow: {
    fontSize: 9.5,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  welcomeSub: {
    fontSize: typography.sizes.xs - 0.5,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  welcomeStreakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  welcomeStreakText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#B45309',
  },
  onboardingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 150, 105, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.25)',
    borderRadius: radius.lg,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  onboardingBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: 'rgba(5, 150, 105, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingBannerText: {
    flex: 1,
  },
  onboardingBannerTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  onboardingBannerSub: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textSecondary,
    marginTop: 1,
  },
  emptyHeroBox: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.cardHover,
    marginVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyHeroImage: {
    width: '100%',
    height: 120,
  },
  emptyHeroText: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    padding: spacing.sm,
  },
  heroCard: {
    marginBottom: spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  streakText: {
    color: '#F59E0B',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  goalCounter: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  heroTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  heroProgress: {
    marginVertical: spacing.xs,
  },
  heroSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  urgentReviewCard: {
    marginBottom: spacing.md,
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1.5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardEyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardEyebrowText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  urgentReviewTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    marginBottom: 4,
  },
  urgentReviewSub: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  primaryActionButton: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  allDoneCard: {
    marginBottom: spacing.md,
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
  },
  allDoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  allDoneIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(5, 150, 105, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allDoneTextCol: {
    flex: 1,
  },
  allDoneTitle: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: '#065F46',
  },
  allDoneSub: {
    fontSize: typography.sizes.xs - 2,
    color: '#047857',
    marginTop: 1,
  },
  heatmapSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundSubtle,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heatmapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  heatmapTitle: {
    fontSize: typography.sizes.xs - 2,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  heatmapLegendLabel: {
    fontSize: 9,
    color: colors.textMuted,
  },
  heatmapLegendDot: {
    width: 7,
    height: 7,
    borderRadius: 2,
  },
  heatmapGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  heatmapDayCol: {
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  heatmapDayName: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  heatmapSquare: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 22,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  heatmapSquareToday: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  heatmapDayNum: {
    fontSize: 8,
    color: colors.textMuted,
  },
  heatmapDayNumToday: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  secondaryHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginTop: spacing.xs,
  },
  secondaryHeroBtnText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  shareStreakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.xs + 3,
    marginTop: spacing.xs,
  },
  shareStreakBtnText: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  sectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weekCard: {
    marginBottom: spacing.lg,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  weekIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekInfo: {
    flex: 1,
  },
  weekTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  weekTag: {
    fontSize: typography.sizes.xs - 2,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  weekWordsCount: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textMuted,
  },
  weekName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  weekProgress: {
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  gridCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  gridCardTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  gridCardSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  methodCard: {
    backgroundColor: colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  methodTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  methodText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    lineHeight: 18,
  },
})
