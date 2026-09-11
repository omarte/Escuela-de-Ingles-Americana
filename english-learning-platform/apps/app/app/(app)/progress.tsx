import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Modal, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, typography, Card, ProgressBar, Badge, Button } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import { contentRegistry } from '@elp/content'
import { useAuthStore } from '../../stores/useAuthStore'
import { useProgressStore } from '../../stores/useProgressStore'
import { useSRSStore } from '../../stores/useSRSStore'

export default function ProgressScreen(): React.JSX.Element {
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const cards = useSRSStore((state) => state.cards)

  const metrics = useProgressStore((state) => state.metrics)
  const refreshMetrics = useProgressStore((state) => state.refreshMetrics)
  const advanceLevel = useProgressStore((state) => state.advanceLevel)

  const [advancingModalVisible, setAdvancingModalVisible] = useState(false)
  const [showAllWeeks, setShowAllWeeks] = useState(false)

  const userId = user?.id ?? 'demo-user'

  useEffect(() => {
    void refreshMetrics(userId)
  }, [userId, cards.length, refreshMetrics])

  const {
    streak,
    retentionRate,
    levelAdvancement,
    weeklyBreakdown,
    wordsInMemory,
    totalLevelWords,
    estimatedStudyMinutes,
  } = metrics

  const currentLevel = profile?.currentLevel ?? 'A1'
  const masteryPercentage = Math.round(levelAdvancement.masteryRatio * 100)

  const a1Total = 1514
  const a2Total = 734
  const b1Total = contentRegistry.B1.blocks.reduce((acc, b) => acc + b.vocabulary.length, 0)
  const b2Total = contentRegistry.B2.blocks.reduce((acc, b) => acc + b.vocabulary.length, 0)

  const cefrLevels = [
    {
      level: 'A1',
      name: 'Acceso / Principiante',
      totalWords: a1Total,
      wordsText: `${String(wordsInMemory)} / ${String(a1Total)}`,
      progress: currentLevel === 'A1' ? wordsInMemory / a1Total : 1.0,
      active: currentLevel === 'A1',
      completed: currentLevel !== 'A1',
    },
    {
      level: 'A2',
      name: 'Plataforma / Básico',
      totalWords: a2Total,
      wordsText:
        currentLevel === 'A2'
          ? `${String(wordsInMemory)} / ${String(a2Total)}`
          : currentLevel === 'B1' || currentLevel === 'B2'
            ? `${String(a2Total)} / ${String(a2Total)}`
            : `0 / ${String(a2Total)}`,
      progress:
        currentLevel === 'A2'
          ? wordsInMemory / a2Total
          : currentLevel === 'B1' || currentLevel === 'B2'
            ? 1.0
            : 0.0,
      active: currentLevel === 'A2',
      completed: currentLevel === 'B1' || currentLevel === 'B2',
    },
    {
      level: 'B1',
      name: 'Umbral / Intermedio',
      totalWords: b1Total,
      wordsText:
        currentLevel === 'B1'
          ? `${String(wordsInMemory)} / ${String(b1Total)}`
          : currentLevel === 'B2'
            ? `${String(b1Total)} / ${String(b1Total)}`
            : `0 / ${String(b1Total)}`,
      progress: currentLevel === 'B1' ? wordsInMemory / b1Total : currentLevel === 'B2' ? 1.0 : 0.0,
      active: currentLevel === 'B1',
      completed: currentLevel === 'B2',
    },
    {
      level: 'B2',
      name: 'Avanzado / Independiente',
      totalWords: b2Total,
      wordsText:
        currentLevel === 'B2'
          ? `${String(wordsInMemory)} / ${String(b2Total)}`
          : `0 / ${String(b2Total)}`,
      progress: currentLevel === 'B2' ? wordsInMemory / b2Total : 0.0,
      active: currentLevel === 'B2',
      completed: false,
    },
  ]

  const handleAdvanceLevel = async (): Promise<void> => {
    setAdvancingModalVisible(false)
    const success = await advanceLevel()
    if (success) {
      Alert.alert(
        '¡Felicitaciones!',
        `Has avanzado exitosamente al Nivel ${levelAdvancement.nextLevel ?? ''}. ¡Nuevas semanas de estudio desbloqueadas!`,
      )
    }
  }

  // Display initial 5 weeks or all 19 weeks
  const visibleWeeks = showAllWeeks ? weeklyBreakdown : weeklyBreakdown.slice(0, 5)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tu Progreso</Text>
          <Text style={styles.subtitle}>
            Estadísticas y avance en tiempo real del método nivel por nivel
          </Text>
        </View>

        {/* Global Level Mastery Card */}
        <Card padding="lg" highlighted style={styles.levelCard}>
          <View style={styles.levelCardTop}>
            <View style={styles.levelHeadingContainer}>
              <Text style={styles.levelLabel}>NIVEL ACTUAL</Text>
              <Text style={styles.levelHeading}>
                {currentLevel} — {cefrLevels.find((l) => l.level === currentLevel)?.name}
              </Text>
            </View>
            <Badge
              label={`${String(masteryPercentage)}% dominado`}
              color={colors.primary}
              size="md"
            />
          </View>

          <ProgressBar
            progress={levelAdvancement.masteryRatio}
            height={12}
            style={styles.levelProgressBar}
          />
          <Text style={styles.levelProgressStats}>
            {String(levelAdvancement.wordsMastered)} de {String(totalLevelWords)} palabras dominadas
            (intervalo $\ge$ 21 días)
          </Text>

          {/* Level Advancement Banner if Eligible */}
          {levelAdvancement.isEligible && levelAdvancement.nextLevel ? (
            <View style={styles.advancementBanner}>
              <View style={styles.advancementBannerHeader}>
                <Ionicons name="trophy" size={20} color="#F59E0B" />
                <Text style={styles.advancementBannerTitle}>
                  ¡Cumpliste el 80% de dominio en Nivel {currentLevel}!
                </Text>
              </View>
              <Text style={styles.advancementBannerText}>
                Has alcanzado la maestría necesaria para ascender formalmente al Nivel{' '}
                {levelAdvancement.nextLevel}.
              </Text>
              <Button
                title={`Avanzar a Nivel ${levelAdvancement.nextLevel}`}
                variant="primary"
                size="md"
                onPress={() => {
                  setAdvancingModalVisible(true)
                }}
                style={styles.advanceBtn}
                icon={
                  <Ionicons name="arrow-up-circle-outline" size={18} color={colors.textPrimary} />
                }
              />
            </View>
          ) : (
            <Text style={styles.remainingTargetText}>
              Faltan {String(levelAdvancement.remainingWordsToMaster)} palabras por dominar para
              alcanzar el 80% y desbloquear el Nivel {levelAdvancement.nextLevel ?? 'superior'}.
            </Text>
          )}
        </Card>

        {/* Quick Stats Grid (4 Live Cards) */}
        <View style={styles.statsGrid}>
          {/* 1. Words in Memory */}
          <Card padding="md" style={styles.statCard}>
            <Ionicons name="checkmark-done-circle" size={24} color={colors.primary} />
            <Text style={styles.statNumber}>{String(wordsInMemory)}</Text>
            <Text style={styles.statLabel}>Palabras en Memoria</Text>
          </Card>

          {/* 2. Current Streak */}
          <Card padding="md" style={styles.statCard}>
            <Ionicons name="flame" size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>{String(streak.currentStreak)} días</Text>
            <Text style={styles.statLabel}>
              {streak.studiedToday ? 'Completado hoy 🔥' : 'Pendiente hoy ⏳'}
            </Text>
          </Card>

          {/* 3. Estimated Study Time */}
          <Card padding="md" style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color={colors.secondary} />
            <Text style={styles.statNumber}>
              {estimatedStudyMinutes >= 60
                ? `${(estimatedStudyMinutes / 60).toFixed(1)} hrs`
                : `${String(estimatedStudyMinutes)} min`}
            </Text>
            <Text style={styles.statLabel}>Tiempo de Repaso</Text>
          </Card>

          {/* 4. Retention Rate */}
          <Card padding="md" style={styles.statCard}>
            <Ionicons name="pulse-outline" size={24} color="#06B6D4" />
            <Text style={styles.statNumber}>{String(retentionRate)}%</Text>
            <Text style={styles.statLabel}>Tasa de Retención</Text>
          </Card>
        </View>

        {/* Week-by-Week Vocabulary Mastery Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Desglose Semanal ({currentLevel})</Text>
          <Text style={styles.sectionBadgeText}>{String(weeklyBreakdown.length)} semanas</Text>
        </View>

        <View style={styles.weeksContainer}>
          {visibleWeeks.map((weekItem) => {
            const isCompleted = weekItem.status === 'completed'
            const isInProgress = weekItem.status === 'in_progress'

            const statusBadgeColor = isCompleted
              ? colors.primary
              : isInProgress
                ? colors.secondary
                : colors.textMuted
            const statusLabel = isCompleted
              ? 'Dominada'
              : isInProgress
                ? 'En estudio'
                : 'Por iniciar'

            return (
              <Card key={`week-${String(weekItem.week)}`} padding="md" style={styles.weekCard}>
                <View style={styles.weekCardHeader}>
                  <View style={styles.weekTitleRow}>
                    <Text style={styles.weekNumberBadge}>Semana {String(weekItem.week)}</Text>
                    <Text style={styles.weekTopicTitle} numberOfLines={1}>
                      {weekItem.title ?? `Semana ${String(weekItem.week)}`}
                    </Text>
                  </View>
                  <Badge label={statusLabel} color={statusBadgeColor} size="sm" />
                </View>

                <ProgressBar
                  progress={weekItem.progressRatio}
                  height={6}
                  color={statusBadgeColor}
                  style={styles.weekProgressBar}
                />

                <View style={styles.weekStatsRow}>
                  <Text style={styles.weekWordsCount}>
                    {String(weekItem.wordsStarted)} / {String(weekItem.totalWords)} palabras
                    iniciadas
                  </Text>
                  <Text style={styles.weekMasteredCount}>
                    {String(weekItem.wordsMastered)} dominadas
                  </Text>
                </View>
              </Card>
            )
          })}

          {weeklyBreakdown.length > 5 ? (
            <Button
              title={
                showAllWeeks
                  ? 'Ver menos semanas'
                  : `Ver las ${String(weeklyBreakdown.length)} semanas`
              }
              variant="outline"
              size="md"
              onPress={() => {
                setShowAllWeeks(!showAllWeeks)
              }}
              style={styles.toggleWeeksBtn}
              icon={
                <Ionicons
                  name={showAllWeeks ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={16}
                  color={colors.primary}
                />
              }
            />
          ) : null}
        </View>

        {/* CEFR Roadmap Ladder */}
        <Text style={styles.sectionTitle}>Ruta Completa CEFR</Text>
        <View style={styles.ladderContainer}>
          {cefrLevels.map((lvl) => (
            <Card
              key={lvl.level}
              padding="md"
              style={[styles.ladderCard, lvl.active && styles.ladderCardActive]}
            >
              <View style={styles.ladderRow}>
                <View style={[styles.ladderIcon, lvl.active && styles.ladderIconActive]}>
                  <Text
                    style={[styles.ladderLevelText, lvl.active && styles.ladderLevelTextActive]}
                  >
                    {lvl.level}
                  </Text>
                </View>
                <View style={styles.ladderInfo}>
                  <View style={styles.ladderTextRow}>
                    <View>
                      <Text style={styles.ladderTitle}>Nivel {lvl.level}</Text>
                      <Text style={styles.ladderSubname}>{lvl.name}</Text>
                    </View>
                    <Text style={styles.ladderWords}>{lvl.wordsText}</Text>
                  </View>
                  <ProgressBar
                    progress={lvl.progress}
                    height={6}
                    color={
                      lvl.active
                        ? colors.primary
                        : lvl.completed
                          ? colors.primary
                          : colors.textMuted
                    }
                  />
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Level Advancement Modal */}
        <Modal
          visible={advancingModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setAdvancingModalVisible(false)
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalIconWrapper}>
                <Ionicons name="ribbon" size={48} color={colors.primary} />
              </View>
              <Text style={styles.modalTitle}>¡Felicitaciones!</Text>
              <Text style={styles.modalBody}>
                Has alcanzado el dominio requerido en el Nivel {currentLevel}. ¿Deseas ascender al
                Nivel {levelAdvancement.nextLevel} ahora?
              </Text>
              <View style={styles.modalButtonsRow}>
                <Button
                  title="Cancelar"
                  variant="outline"
                  size="md"
                  onPress={() => {
                    setAdvancingModalVisible(false)
                  }}
                  style={styles.modalCancelBtn}
                />
                <Button
                  title="¡Sí, avanzar!"
                  variant="primary"
                  size="md"
                  onPress={() => {
                    void handleAdvanceLevel()
                  }}
                  style={styles.modalConfirmBtn}
                />
              </View>
            </View>
          </View>
        </Modal>
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
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  levelCard: {
    marginBottom: spacing.lg,
  },
  levelCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  levelHeadingContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  levelLabel: {
    fontSize: typography.sizes.xs - 2,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  levelHeading: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  levelProgressBar: {
    marginBottom: spacing.xs,
  },
  levelProgressStats: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  advancementBanner: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  advancementBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  advancementBannerTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: '#F59E0B',
  },
  advancementBannerText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  advanceBtn: {
    marginTop: spacing.md,
  },
  remainingTargetText: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '47%',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statNumber: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  sectionBadgeText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  weeksContainer: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  weekCard: {
    backgroundColor: colors.card,
  },
  weekCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  weekTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginRight: spacing.sm,
  },
  weekNumberBadge: {
    fontSize: typography.sizes.xs - 1,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  weekTopicTitle: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
    flex: 1,
  },
  weekProgressBar: {
    marginVertical: spacing.xs,
  },
  weekStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekWordsCount: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textSecondary,
  },
  weekMasteredCount: {
    fontSize: typography.sizes.xs - 2,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  toggleWeeksBtn: {
    marginTop: spacing.xs,
  },
  ladderContainer: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  ladderCard: {
    backgroundColor: colors.backgroundSubtle,
  },
  ladderCardActive: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
  },
  ladderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ladderIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.cardHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ladderIconActive: {
    backgroundColor: colors.primaryLight,
  },
  ladderLevelText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
  },
  ladderLevelTextActive: {
    color: colors.primary,
  },
  ladderInfo: {
    flex: 1,
    gap: 4,
  },
  ladderTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ladderTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  ladderSubname: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textMuted,
  },
  ladderWords: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  modalBody: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
  },
  modalConfirmBtn: {
    flex: 1,
  },
})
