import React, { useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, typography, Card, Button, Badge } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../stores/useAuthStore'
import { useSyncStore } from '../../stores/useSyncStore'
import { useSRSStore } from '../../stores/useSRSStore'
import { isSupabaseConfigured } from '../../lib/supabase'
import { APP_LOGO } from '../../lib/assets'

export default function ProfileScreen(): React.JSX.Element {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const logout = useAuthStore((state) => state.logout)
  const isLoading = useAuthStore((state) => state.isLoading)

  const isSyncing = useSyncStore((state) => state.isSyncing)
  const lastSyncedAt = useSyncStore((state) => state.lastSyncedAt)
  const pendingCardsCount = useSyncStore((state) => state.pendingCardsCount)
  const pendingEventsCount = useSyncStore((state) => state.pendingEventsCount)
  const lastSyncError = useSyncStore((state) => state.lastSyncError)
  const triggerSync = useSyncStore((state) => state.triggerSync)
  const loadInitialStatus = useSyncStore((state) => state.loadInitialStatus)

  useEffect(() => {
    if (user?.id) {
      void loadInitialStatus(user.id)
    }
  }, [user?.id, loadInitialStatus])

  const handleLogout = async (): Promise<void> => {
    await logout()
    router.replace('/(auth)/login')
  }

  const handleManualSync = async (): Promise<void> => {
    if (!user?.id) return
    await triggerSync(user.id)
  }

  const displayName = profile?.displayName ?? 'Estudiante'
  const displayEmail = user?.email ?? 'usuario@plataforma.com'
  const currentLevel = profile?.currentLevel ?? 'A1'
  const avatarInitial = displayName.charAt(0).toUpperCase() || 'E'

  const cards = useSRSStore((state) => state.cards)
  const totalXP = Math.max(
    profile?.streakDays ? profile.streakDays * 25 : 0,
    cards.filter((c) => c.reps > 0).length * 10 + cards.filter((c) => c.interval >= 21).length * 20,
  )

  const totalPending = pendingCardsCount + pendingEventsCount
  const formattedSyncTime = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Aún no sincronizado'

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <Card padding="lg" style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>{avatarInitial}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{displayEmail}</Text>
              <View style={styles.profileBadgesRow}>
                <Badge
                  label={`Nivel ${currentLevel} Activo`}
                  color={colors.primary}
                  size="sm"
                />
                <View style={styles.xpPill}>
                  <Ionicons name="flash" size={13} color="#D97706" />
                  <Text style={styles.xpPillText}>{String(totalXP)} XP</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>


        {/* Offline & Sync Status */}
        <Text style={styles.sectionTitle}>Sincronización & Almacenamiento Local</Text>
        <Card padding="md" style={styles.syncCard}>
          <View style={styles.syncRow}>
            <View style={styles.syncIconBox}>
              {isSyncing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons
                  name={isSupabaseConfigured ? 'cloud-done-outline' : 'phone-portrait-outline'}
                  size={24}
                  color={colors.primary}
                />
              )}
            </View>
            <View style={styles.syncTextInfo}>
              <Text style={styles.syncTitle}>
                {isSupabaseConfigured ? 'Motor de Sincronización Activo' : 'Modo Offline Autónomo'}
              </Text>
              <Text style={styles.syncSubtitle}>
                {isSupabaseConfigured
                  ? `Última sincronización: ${formattedSyncTime}`
                  : 'Tarjetas y repasos persistidos localmente'}
              </Text>
            </View>
            <Badge
              label={isSupabaseConfigured ? 'Cloud Sync' : 'Offline'}
              color={colors.primary}
              size="sm"
            />
          </View>

          <View style={styles.syncStatsRow}>
            <View style={styles.syncStatCol}>
              <Text style={styles.syncStatNumber}>{String(totalPending)}</Text>
              <Text style={styles.syncStatLabel}>Cambios pendientes</Text>
            </View>
            <View style={styles.syncStatDivider} />
            <View style={styles.syncStatCol}>
              <Text style={styles.syncStatNumber}>
                {isSupabaseConfigured ? 'Conectado' : 'Local'}
              </Text>
              <Text style={styles.syncStatLabel}>Estado backend</Text>
            </View>
          </View>

          {lastSyncError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
              <Text style={styles.errorText}>{lastSyncError}</Text>
            </View>
          ) : null}

          <Button
            title={isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
            variant="outline"
            size="sm"
            loading={isSyncing}
            disabled={isSyncing || !isSupabaseConfigured}
            onPress={() => {
              void handleManualSync()
            }}
            style={styles.syncBtn}
            icon={<Ionicons name="sync-outline" size={16} color={colors.primary} />}
          />
        </Card>

        {/* Study Preferences */}
        <Text style={styles.sectionTitle}>Configuración de Estudio</Text>
        <Card padding="md" style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="flag-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Meta diaria de palabras</Text>
            </View>
            <Text style={styles.settingValue}>20 palabras / día</Text>
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Variante de pronunciación</Text>
            </View>
            <Text style={styles.settingValue}>Inglés Americano</Text>
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Recordatorio diario</Text>
            </View>
            <Text style={styles.settingValue}>20:00 hrs</Text>
          </TouchableOpacity>
        </Card>

        {/* Account & Logout */}
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <Button
          title="Cerrar Sesión"
          variant="outline"
          onPress={() => {
            void handleLogout()
          }}
          loading={isLoading}
          disabled={isLoading}
          size="md"
          style={styles.logoutBtn}
          icon={<Ionicons name="log-out-outline" size={18} color={colors.danger} />}
          textStyle={styles.logoutBtnText}
        />

        {/* App Version Info & School Crest */}
        <View style={styles.versionInfo}>
          <Image source={APP_LOGO} style={styles.versionLogo} resizeMode="contain" />
          <Text style={styles.schoolName}>Escuela de Inglés Americana</Text>
          <Text style={styles.schoolMotto}>Formación Académica y Cultural en Inglés</Text>
          <Text style={styles.versionText}>English Learning Platform v0.1.0 • A1 a B2</Text>
          <Text style={styles.versionSubtext}>
            Cero IA en Contenido • Curaduría Humana • Offline-First
          </Text>
        </View>
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
  profileCard: {
    marginBottom: spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  xpPillText: {
    color: '#B45309',
    fontSize: typography.sizes.xs - 1,
    fontWeight: typography.weights.bold,
  },
  profileBadge: {
    marginTop: spacing.xs,
  },

  sectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  syncCard: {
    marginBottom: spacing.lg,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  syncIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncTextInfo: {
    flex: 1,
  },
  syncTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  syncSubtitle: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
    marginTop: 2,
  },
  syncStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  syncStatCol: {
    alignItems: 'center',
  },
  syncStatNumber: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  syncStatLabel: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textSecondary,
    marginTop: 2,
  },
  syncStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.dangerLight,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.danger,
    flex: 1,
  },
  syncBtn: {
    marginTop: spacing.md,
  },
  settingsCard: {
    marginBottom: spacing.xl,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  settingValue: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  logoutBtn: {
    borderColor: colors.danger,
    marginBottom: spacing.xl,
  },
  logoutBtnText: {
    color: colors.danger,
  },
  versionInfo: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.md,
  },
  versionLogo: {
    width: 72,
    height: 72,
    marginBottom: spacing.xs,
  },
  schoolName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  schoolMotto: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    marginBottom: 4,
  },
  versionText: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
  },
  versionSubtext: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textMuted,
  },
})
