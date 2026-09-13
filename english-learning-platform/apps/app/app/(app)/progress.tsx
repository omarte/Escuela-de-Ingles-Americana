import React, { useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Image,
  TouchableOpacity,
  Share,
  type ImageSourcePropType,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, typography, Card, ProgressBar, Badge, Button } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import { contentRegistry } from '@elp/content'
import { useAuthStore } from '../../stores/useAuthStore'
import { useProgressStore } from '../../stores/useProgressStore'
import { useSRSStore } from '../../stores/useSRSStore'
import {
  LEVEL_A1_COMPLETED,
  LEVEL_A2_COMPLETED,
  LEVEL_B1_COMPLETED,
  LEVEL_B2_COMPLETED,
  STREAK_7_DAYS,
  STREAK_30_DAYS,
  STREAK_100_DAYS,
  VOCAB_100_WORDS,
  VOCAB_500_WORDS,
  VOCAB_1000_WORDS,
  VOCAB_2500_WORDS,
  MASTERED_100_WORDS,
  MASTERED_1000_WORDS,
} from '../../lib/assets'

export default function ProgressScreen(): React.JSX.Element {
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const cards = useSRSStore((state) => state.cards)

  const metrics = useProgressStore((state) => state.metrics)
  const refreshMetrics = useProgressStore((state) => state.refreshMetrics)
  const advanceLevel = useProgressStore((state) => state.advanceLevel)

  const [advancingModalVisible, setAdvancingModalVisible] = useState(false)
  const [showAllWeeks, setShowAllWeeks] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<{
    id: string
    title: string
    category: string
    image: ImageSourcePropType
    current: number
    target: number
    unit: string
    description: string
    unlocked: boolean
  } | null>(null)
  const [selectedDiploma, setSelectedDiploma] = useState<{
    level: string
    title: string
    image: ImageSourcePropType
    isCompleted: boolean
    wordsText: string
  } | null>(null)

  const handleShareBadge = async (badgeItem: { title: string }): Promise<void> => {
    try {
      await Share.share({
        message: `🎓 ¡Acabo de desbloquear el logro "${badgeItem.title}" en la Escuela de Inglés Americana! 🚀 Estudiando inglés con repetición espaciada.`,
      })
    } catch {
      // User dismissed
    }
  }

  const handleShareDiploma = async (diplomaItem: { level: string; title: string }): Promise<void> => {
    try {
      await Share.share({
        message: `🏆 ¡He completado exitosamente el Nivel ${diplomaItem.level} de Inglés en la Escuela de Inglés Americana! 🎓 Certificación oficial y vocabulario consolidado.`,
      })
    } catch {
      // User dismissed
    }
  }

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

  // 7-day visual activity chart
  const last7Days = useMemo(() => {
    const days: { label: string; dateStr: string; active: boolean; isToday: boolean }[] = []
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    const activeDateSet = new Set(streak.activeDates ?? [])

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`
      const isToday = i === 0
      const active = activeDateSet.has(dateStr) || (isToday && streak.studiedToday)

      days.push({
        label: dayNames[d.getDay()] ?? '',
        dateStr,
        active,
        isToday,
      })
    }
    return days
  }, [streak.activeDates, streak.studiedToday])

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

  const currentStreak = streak.currentStreak
  const totalCardsCount = cards.length
  const masteredCardsCount = cards.filter((c) => c.interval >= 21).length

  const badgesList = [
    {
      id: 'streak-7',
      title: 'Racha de 7 Días',
      category: 'Racha',
      image: STREAK_7_DAYS,
      current: currentStreak,
      target: 7,
      unit: 'días',
      description: 'Estudia 7 días consecutivos para afianzar el hábito.',
      unlocked: currentStreak >= 7,
    },
    {
      id: 'streak-30',
      title: 'Hábito de 30 Días',
      category: 'Racha',
      image: STREAK_30_DAYS,
      current: currentStreak,
      target: 30,
      unit: 'días',
      description: 'Un mes completo de estudio continuo sin interrupciones.',
      unlocked: currentStreak >= 30,
    },
    {
      id: 'streak-100',
      title: 'Leyenda de 100 Días',
      category: 'Racha',
      image: STREAK_100_DAYS,
      current: currentStreak,
      target: 100,
      unit: 'días',
      description: 'Dedicación inquebrantable en tu camino a la fluidez.',
      unlocked: currentStreak >= 100,
    },
    {
      id: 'vocab-100',
      title: '100 Palabras',
      category: 'Vocabulario',
      image: VOCAB_100_WORDS,
      current: totalCardsCount,
      target: 100,
      unit: 'palabras',
      description: 'Primer centenar de palabras activas en tu mazo de estudio.',
      unlocked: totalCardsCount >= 100,
    },
    {
      id: 'vocab-500',
      title: '500 Palabras',
      category: 'Vocabulario',
      image: VOCAB_500_WORDS,
      current: totalCardsCount,
      target: 500,
      unit: 'palabras',
      description: 'Léxico fundamental para comprender conversaciones cotidianas.',
      unlocked: totalCardsCount >= 500,
    },
    {
      id: 'vocab-1000',
      title: '1,000 Palabras',
      category: 'Vocabulario',
      image: VOCAB_1000_WORDS,
      current: totalCardsCount,
      target: 1000,
      unit: 'palabras',
      description: 'Vocabulario avanzado para comprender textos reales y conferencias.',
      unlocked: totalCardsCount >= 1000,
    },
    {
      id: 'vocab-2500',
      title: '2,500 Palabras',
      category: 'Vocabulario',
      image: VOCAB_2500_WORDS,
      current: totalCardsCount,
      target: 2500,
      unit: 'palabras',
      description: 'Dominio completo de todo el léxico del programa A1 a B2.',
      unlocked: totalCardsCount >= 2500,
    },
    {
      id: 'mastered-100',
      title: '100 Dominadas',
      category: 'Dominio',
      image: MASTERED_100_WORDS,
      current: masteredCardsCount,
      target: 100,
      unit: 'palabras',
      description: '100 palabras con intervalo de memoria a largo plazo (21+ días).',
      unlocked: masteredCardsCount >= 100,
    },
    {
      id: 'mastered-1000',
      title: '1,000 Dominadas',
      category: 'Dominio',
      image: MASTERED_1000_WORDS,
      current: masteredCardsCount,
      target: 1000,
      unit: 'palabras',
      description: 'Memoria de acero: 1,000 palabras consolidadas permanentemente.',
      unlocked: masteredCardsCount >= 1000,
    },
  ]

  const diplomasList = [
    {
      level: 'A1',
      title: 'Certificado de Inglés Inicial (Nivel A1)',
      image: LEVEL_A1_COMPLETED,
      isCompleted: currentLevel !== 'A1' || levelAdvancement.isEligible,
      wordsText: '1,514 palabras del nivel',
    },
    {
      level: 'A2',
      title: 'Certificado de Inglés Elemental (Nivel A2)',
      image: LEVEL_A2_COMPLETED,
      isCompleted: currentLevel === 'B1' || currentLevel === 'B2',
      wordsText: '734 palabras del nivel',
    },
    {
      level: 'B1',
      title: 'Certificado de Inglés Intermedio (Nivel B1)',
      image: LEVEL_B1_COMPLETED,
      isCompleted: currentLevel === 'B2',
      wordsText: 'Vocabulario Intermedio B1',
    },
    {
      level: 'B2',
      title: 'Certificado de Inglés Profesional (Nivel B2)',
      image: LEVEL_B2_COMPLETED,
      isCompleted: false,
      wordsText: 'Vocabulario Avanzado B2',
    },
  ]

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

        {/* 7-Day Activity Mini-Chart */}
        <Card padding="md" style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <View style={styles.activityTitleRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              <Text style={styles.activityTitle}>Actividad de los Últimos 7 Días</Text>
            </View>
            <Text style={styles.activitySubtitle}>
              {last7Days.filter((d) => d.active).length} de 7 días activos
            </Text>
          </View>

          <View style={styles.activityBarsRow}>
            {last7Days.map((d) => (
              <View key={d.dateStr} style={styles.dayCol}>
                <View
                  style={[
                    styles.dayBar,
                    d.active ? styles.dayBarActive : styles.dayBarInactive,
                    d.isToday && styles.dayBarToday,
                  ]}
                >
                  {d.active ? (
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.dayLabel,
                    d.isToday && styles.dayLabelToday,
                  ]}
                >
                  {d.label}
                </Text>
              </View>
            ))}
          </View>
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

        {/* Gamification Badges Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>🏆 Insignias y Logros</Text>
          <Text style={styles.sectionBadgeText}>
            {String(badgesList.filter((b) => b.unlocked).length)} / {String(badgesList.length)}
          </Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Desbloquea insignias oficiales conforme avanzas tu racha y dominas vocabulario
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.badgesScroll}
          contentContainerStyle={styles.badgesScrollContent}
        >
          {badgesList.map((badgeItem) => {
            const progress = Math.min(1, badgeItem.current / badgeItem.target)
            return (
              <TouchableOpacity
                key={badgeItem.id}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedBadge(badgeItem)
                }}
                style={[
                  styles.badgeCard,
                  badgeItem.unlocked ? styles.badgeCardUnlocked : styles.badgeCardLocked,
                ]}
              >
                <View style={styles.badgeImageWrapper}>
                  <Image
                    source={badgeItem.image}
                    style={[
                      styles.badgeThumbImage,
                      !badgeItem.unlocked && styles.badgeThumbImageLocked,
                    ]}
                    resizeMode="cover"
                  />
                  {badgeItem.unlocked ? (
                    <View style={styles.unlockedIconCircle}>
                      <Ionicons name="checkmark-circle" size={20} color="#F59E0B" />
                    </View>
                  ) : (
                    <View style={styles.lockedIconCircle}>
                      <Ionicons name="lock-closed" size={14} color="#94A3B8" />
                    </View>
                  )}
                </View>

                <Text style={styles.badgeCardTitle} numberOfLines={1}>
                  {badgeItem.title}
                </Text>
                <Text style={styles.badgeCardCategory}>{badgeItem.category}</Text>

                <ProgressBar
                  progress={progress}
                  height={5}
                  color={badgeItem.unlocked ? '#F59E0B' : colors.primary}
                  style={styles.badgeProgressBar}
                />
                <Text style={styles.badgeCardCount}>
                  {String(Math.min(badgeItem.current, badgeItem.target))} / {String(badgeItem.target)}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Diplomas & Official Certifications Gallery (Social Sharing Cards) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>📜 Certificados Oficiales</Text>
          <Text style={styles.sectionBadgeText}>A1 a B2</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Diplomas avalados por la Escuela de Inglés Americana listos para compartir
        </Text>

        <View style={styles.diplomasContainer}>
          {diplomasList.map((diplomaItem) => (
            <Card
              key={diplomaItem.level}
              padding="none"
              style={[
                styles.diplomaCard,
                diplomaItem.isCompleted && styles.diplomaCardCompleted,
              ]}
            >
              <Image
                source={diplomaItem.image}
                style={styles.diplomaBannerImage}
                resizeMode="cover"
              />
              <View style={styles.diplomaCardBody}>
                <View style={styles.diplomaHeaderRow}>
                  <View style={styles.diplomaTitleBox}>
                    <Badge
                      label={diplomaItem.level}
                      color={diplomaItem.isCompleted ? '#F59E0B' : colors.primary}
                      size="sm"
                    />
                    <Text style={styles.diplomaCardTitle}>{diplomaItem.title}</Text>
                  </View>
                  <Badge
                    label={diplomaItem.isCompleted ? '✓ Certificado' : 'En curso'}
                    color={diplomaItem.isCompleted ? '#F59E0B' : colors.textMuted}
                    size="sm"
                  />
                </View>

                <Text style={styles.diplomaWordsText}>{diplomaItem.wordsText}</Text>

                <Button
                  title={
                    diplomaItem.isCompleted
                      ? '📢 Ver Diploma y Compartir'
                      : '🔍 Ver Requisitos del Diploma'
                  }
                  variant={diplomaItem.isCompleted ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => {
                    setSelectedDiploma(diplomaItem)
                  }}
                  style={styles.diplomaActionBtn}
                  icon={
                    <Ionicons
                      name={diplomaItem.isCompleted ? 'share-social-outline' : 'eye-outline'}
                      size={16}
                      color={diplomaItem.isCompleted ? colors.textInverse : colors.primary}
                    />
                  }
                />
              </View>
            </Card>
          ))}
        </View>

        {/* Badge Detail & Share Modal */}
        <Modal
          visible={selectedBadge !== null}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setSelectedBadge(null)
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.badgeModalCard}>
              {selectedBadge ? (
                <>
                  <Image
                    source={selectedBadge.image}
                    style={styles.badgeModalImage}
                    resizeMode="cover"
                  />
                  <View style={styles.badgeModalStatusRow}>
                    <Badge
                      label={selectedBadge.category}
                      color={colors.primary}
                      size="sm"
                    />
                    <Badge
                      label={selectedBadge.unlocked ? '🏆 Desbloqueado' : '🔒 En Progreso'}
                      color={selectedBadge.unlocked ? '#F59E0B' : colors.textMuted}
                      size="sm"
                    />
                  </View>
                  <Text style={styles.badgeModalTitle}>{selectedBadge.title}</Text>
                  <Text style={styles.badgeModalDesc}>{selectedBadge.description}</Text>

                  <View style={styles.badgeModalProgressBox}>
                    <View style={styles.badgeModalProgressHeader}>
                      <Text style={styles.badgeModalProgressLabel}>Progreso hacia la meta</Text>
                      <Text style={styles.badgeModalProgressVal}>
                        {String(Math.min(selectedBadge.current, selectedBadge.target))} /{' '}
                        {String(selectedBadge.target)} {selectedBadge.unit}
                      </Text>
                    </View>
                    <ProgressBar
                      progress={Math.min(1, selectedBadge.current / selectedBadge.target)}
                      height={8}
                      color={selectedBadge.unlocked ? '#F59E0B' : colors.primary}
                    />
                  </View>

                  <View style={styles.badgeModalButtons}>
                    <Button
                      title="Cerrar"
                      variant="outline"
                      size="md"
                      onPress={() => {
                        setSelectedBadge(null)
                      }}
                      style={styles.modalCancelBtn}
                    />
                    {selectedBadge.unlocked ? (
                      <Button
                        title="🎉 Compartir"
                        variant="primary"
                        size="md"
                        onPress={() => {
                          void handleShareBadge(selectedBadge)
                        }}
                        style={styles.modalConfirmBtn}
                        icon={<Ionicons name="share-social-outline" size={16} color={colors.textInverse} />}
                      />
                    ) : null}
                  </View>
                </>
              ) : null}
            </View>
          </View>
        </Modal>

        {/* Diploma Preview & Social Share Modal */}
        <Modal
          visible={selectedDiploma !== null}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setSelectedDiploma(null)
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.diplomaModalCard}>
              {selectedDiploma ? (
                <>
                  <Image
                    source={selectedDiploma.image}
                    style={styles.diplomaModalImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.diplomaModalTitle}>{selectedDiploma.title}</Text>
                  <Text style={styles.diplomaModalSub}>
                    Otorgado a: {profile?.displayName ?? user?.email ?? 'Estudiante'} • Escuela de Inglés Americana
                  </Text>
                  <Text style={styles.diplomaModalBody}>
                    {selectedDiploma.isCompleted
                      ? '¡Diploma Oficial acreditado! Demuestra tu dominio de comprensión lectora, vocabulario bilingüe y fluidez según el Marco Común Europeo (MCER).'
                      : `Este diploma se acredita automáticamente al completar todas las semanas de estudio y alcanzar el 80% de retención en el Nivel ${selectedDiploma.level}.`}
                  </Text>

                  <View style={styles.diplomaModalButtons}>
                    <Button
                      title="Cerrar"
                      variant="outline"
                      size="md"
                      onPress={() => {
                        setSelectedDiploma(null)
                      }}
                      style={styles.modalCancelBtn}
                    />
                    <Button
                      title="📢 Compartir Diploma"
                      variant="primary"
                      size="md"
                      onPress={() => {
                        void handleShareDiploma(selectedDiploma)
                      }}
                      style={styles.modalConfirmBtn}
                      icon={<Ionicons name="share-social" size={16} color={colors.textInverse} />}
                    />
                  </View>
                </>
              ) : null}
            </View>
          </View>
        </Modal>

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
              <Image
                source={
                  currentLevel === 'A1'
                    ? LEVEL_A1_COMPLETED
                    : currentLevel === 'A2'
                      ? LEVEL_A2_COMPLETED
                      : currentLevel === 'B1'
                        ? LEVEL_B1_COMPLETED
                        : LEVEL_B2_COMPLETED
                }
                style={styles.modalDiplomaImage}
                resizeMode="contain"
              />
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
  activityCard: {
    marginBottom: spacing.lg,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  activitySubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  activityBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayBar: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBarActive: {
    backgroundColor: colors.primary,
  },
  dayBarInactive: {
    backgroundColor: colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayBarToday: {
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  dayLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  dayLabelToday: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
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
  modalDiplomaImage: {
    width: '100%',
    height: 160,
    borderRadius: radius.md,
    marginBottom: spacing.md,
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
  sectionSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: -spacing.xs,
  },
  badgesScroll: {
    marginHorizontal: -spacing.md,
    marginBottom: spacing.lg,
  },
  badgesScrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  badgeCard: {
    width: 140,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeCardUnlocked: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
  },
  badgeCardLocked: {
    opacity: 0.85,
  },
  badgeImageWrapper: {
    width: 70,
    height: 70,
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing.xs,
  },
  badgeThumbImage: {
    width: '100%',
    height: '100%',
  },
  badgeThumbImageLocked: {
    opacity: 0.45,
  },
  unlockedIconCircle: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#0B0F17',
    borderRadius: radius.full,
  },
  lockedIconCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCardTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  badgeCardCategory: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  badgeProgressBar: {
    width: '100%',
    marginBottom: 4,
  },
  badgeCardCount: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  diplomasContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  diplomaCard: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  diplomaCardCompleted: {
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  diplomaBannerImage: {
    width: '100%',
    height: 120,
  },
  diplomaCardBody: {
    padding: spacing.md,
  },
  diplomaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  diplomaTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    marginRight: spacing.sm,
  },
  diplomaCardTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  diplomaWordsText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  diplomaActionBtn: {
    width: '100%',
  },
  badgeModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeModalImage: {
    width: 130,
    height: 130,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  badgeModalStatusRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  badgeModalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  badgeModalDesc: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  badgeModalProgressBox: {
    width: '100%',
    backgroundColor: colors.cardHover,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  badgeModalProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  badgeModalProgressLabel: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
  },
  badgeModalProgressVal: {
    fontSize: typography.sizes.xs - 1,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  badgeModalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  diplomaModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  diplomaModalImage: {
    width: '100%',
    height: 180,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  diplomaModalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  diplomaModalSub: {
    fontSize: typography.sizes.xs,
    color: '#F59E0B',
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  diplomaModalBody: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  diplomaModalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
})
