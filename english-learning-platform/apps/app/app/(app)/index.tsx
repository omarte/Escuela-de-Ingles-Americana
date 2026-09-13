import React, { useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, typography, radius, Card, Button, Badge, ProgressBar } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../stores/useAuthStore'
import { useSRSStore } from '../../stores/useSRSStore'
import { useProgressStore } from '../../stores/useProgressStore'
import { getDueCards } from '@elp/srs'
import { APP_LOGO } from '../../lib/assets'

/**
 * Normalizes an ISO timestamp or date to YYYY-MM-DD in the user's local timezone.
 * Avoids timezone drift bugs where reviews done late evening UTC-4 fall into tomorrow in UTC.
 */
function toLocalDateString(d: Date | string = new Date()): string {
  const date = typeof d === 'string' ? new Date(d) : d
  if (isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function HomeScreen(): React.JSX.Element {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)

  const cards = useSRSStore((state) => state.cards)
  const loadCards = useSRSStore((state) => state.loadCards)
  const streak = useProgressStore((state) => state.metrics.streak)
  const refreshMetrics = useProgressStore((state) => state.refreshMetrics)

  const repeatCurrentLesson = useSRSStore((state) => state.repeatCurrentLesson)
  const loadNextBatch = useSRSStore((state) => state.loadNextBatch)
  const startStudySession = useSRSStore((state) => state.startStudySession)

  const userId = user?.id ?? 'demo-user'
  const displayName = profile?.displayName ?? 'Estudiante'
  const currentLevel = profile?.currentLevel ?? 'A1'

  // Timezone-safe check: only count cards reviewed on the local calendar day
  const todayStr = toLocalDateString(new Date())
  const cardsReviewedToday = cards.filter((c) => {
    if (!c.lastReviewed) return false
    return toLocalDateString(c.lastReviewed) === todayStr
  }).length

  const dailyGoal = 20
  const completedToday = Math.min(dailyGoal, Math.max(0, cardsReviewedToday))
  const progressRatio = completedToday / dailyGoal
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
  } else if (hasStudiedToday) {
    heroSubtitle = '¡Excelente! Has cumplido tu meta diaria de hoy 🎉'
  } else {
    heroSubtitle = 'No tienes repasos pendientes hoy. ¡Aprende o repite lecciones para encender tu racha!'
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.brandingRow}>
            <Image source={APP_LOGO} style={styles.headerLogo} resizeMode="contain" />
            <View>
              <Text style={styles.greeting}>Hola, {displayName} 👋</Text>
              <Text style={styles.subgreeting}>Escuela de Inglés Americana</Text>
            </View>
          </View>
          <View style={styles.topBarRight}>
            <View style={styles.xpBadge}>
              <Ionicons name="flash" size={14} color="#F59E0B" />
              <Text style={styles.xpBadgeText}>{String(totalXP)} XP</Text>
            </View>
            <Badge label={`Nivel ${currentLevel}`} color={colors.primary} size="md" />
          </View>
        </View>

        {/* Daily Goal & Streak Hero Card */}
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

          <Text style={styles.heroTitle}>Meta Diaria de Estudio</Text>
          <ProgressBar progress={progressRatio} height={10} style={styles.heroProgress} />
          <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>

          {/* Primary Action */}
          <Button
            title={
              dueCount > 0
                ? `Repasar SRS (${String(dueCount)} pendientes)`
                : 'Aprender 10 Palabras Nuevas'
            }
            onPress={async () => {
              if (dueCount > 0) {
                await startStudySession(userId, currentLevel)
              } else {
                await loadNextBatch(userId, currentLevel, 10)
              }
              router.push('/(app)/learn')
            }}
            size="lg"
            style={styles.heroBtn}
            icon={<Ionicons name="play" size={18} color={colors.textInverse} />}
          />

          {/* Repetición de Lección para fijar formación */}
          <TouchableOpacity
            style={styles.repeatHeroBtn}
            onPress={async () => {
              await repeatCurrentLesson(userId)
              router.push('/(app)/learn')
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="repeat" size={16} color={colors.primary} />
            <Text style={styles.repeatHeroBtnText}>
              🔁 Repetir lección actual para fijar formación
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Current Week Focus */}
        <Text style={styles.sectionTitle}>Enfocado Esta Semana</Text>
        <Card
          padding="md"
          style={styles.weekCard}
          onPress={() => {
            router.push('/(app)/learn')
          }}
        >
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
    paddingBottom: spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  xpBadgeText: {
    color: '#B45309',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerLogo: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
  },
  greeting: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  subgreeting: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
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
  heroBtn: {
    marginTop: spacing.xs,
  },
  repeatHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    backgroundColor: colors.cardHover,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  repeatHeroBtnText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
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
