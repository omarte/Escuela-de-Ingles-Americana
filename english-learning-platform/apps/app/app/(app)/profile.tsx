import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Share,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, typography, Card, Button, Badge } from '@elp/ui'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../stores/useAuthStore'
import { useSyncStore } from '../../stores/useSyncStore'
import { useSRSStore } from '../../stores/useSRSStore'
import { useProgressStore } from '../../stores/useProgressStore'
import {
  getLocalCards,
  getAllLocalReviewEventsAsEvents,
  upsertLocalCard,
  restoreLocalReviewEvents,
} from '../../lib/db/sqlite'
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

  const [isExporting, setIsExporting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isRestoreModalVisible, setIsRestoreModalVisible] = useState(false)
  const [backupJsonInput, setBackupJsonInput] = useState('')

  const handleExportBackup = async (): Promise<void> => {
    if (!user?.id) return
    setIsExporting(true)
    try {
      const userCards = await getLocalCards(user.id)
      const events = await getAllLocalReviewEventsAsEvents(user.id)
      const backupData = {
        version: 1,
        appName: 'Escuela de Inglés Americana',
        exportedAt: new Date().toISOString(),
        userId: user.id,
        profile: {
          displayName,
          email: displayEmail,
          currentLevel,
          streakDays: profile?.streakDays ?? 0,
          totalXP,
        },
        cards: userCards,
        reviewEvents: events,
      }
      const jsonPayload = JSON.stringify(backupData, null, 2)
      await Share.share({
        message: jsonPayload,
        title: `Respaldo_InglesAmericana_${new Date().toISOString().slice(0, 10)}.json`,
      })
    } catch (error) {
      Alert.alert(
        'Error al exportar',
        error instanceof Error ? error.message : 'No se pudo generar el archivo de respaldo.',
      )
    } finally {
      setIsExporting(false)
    }
  }

  const handleRestoreBackup = async (): Promise<void> => {
    if (!user?.id) return
    const raw = backupJsonInput.trim()
    if (!raw) return

    setIsRestoring(true)
    try {
      let parsed: {
        version?: number
        cards?: Array<{ vocabularyItemId: string; [key: string]: unknown }>
        reviewEvents?: unknown[]
      }
      try {
        parsed = JSON.parse(raw) as {
          version?: number
          cards?: Array<{ vocabularyItemId: string; [key: string]: unknown }>
          reviewEvents?: unknown[]
        }
      } catch {
        throw new Error('El texto ingresado no es un formato JSON válido.')
      }

      if (!parsed || typeof parsed !== 'object') {
        throw new Error('El archivo de respaldo está vacío o corrupto.')
      }

      if (!parsed.version || !Array.isArray(parsed.cards)) {
        throw new Error(
          'El JSON no contiene una estructura de respaldo compatible (falta versión o tarjetas).',
        )
      }

      // Restore cards
      for (const card of parsed.cards) {
        if (card.vocabularyItemId) {
          await upsertLocalCard(
            {
              ...(card as any),
              userId: user.id,
            },
            'dirty',
          )
        }
      }

      // Restore review events if present
      if (Array.isArray(parsed.reviewEvents) && parsed.reviewEvents.length > 0) {
        const boundEvents = parsed.reviewEvents.map((evt: any) => ({
          ...evt,
          userId: user.id,
        }))
        await restoreLocalReviewEvents(user.id, boundEvents)
      }

      // Reload stores
      await useSRSStore.getState().loadCards(user.id)
      await useProgressStore.getState().refreshMetrics(user.id)

      setIsRestoreModalVisible(false)
      setBackupJsonInput('')
      Alert.alert(
        '¡Respaldo Restaurado!',
        `Se han importado exitosamente ${parsed.cards.length} tarjetas y sus registros de estudio al dispositivo.`,
      )
    } catch (error) {
      Alert.alert(
        'Error al restaurar',
        error instanceof Error ? error.message : 'Error desconocido al importar el respaldo.',
      )
    } finally {
      setIsRestoring(false)
    }
  }

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

        {/* Backup & Restore Section */}
        <Text style={styles.sectionTitle}>Copia de Seguridad & Respaldo</Text>
        <Card padding="md" style={styles.backupCard}>
          <View style={styles.backupHeaderRow}>
            <View style={styles.backupIconBox}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.backupHeaderInfo}>
              <Text style={styles.backupCardTitle}>Respaldo Portátil (JSON)</Text>
              <Text style={styles.backupCardSubtitle}>
                Exporta tu progreso para guardarlo en Drive o envíalo a otro teléfono sin depender de internet.
              </Text>
            </View>
          </View>

          <View style={styles.backupBtnRow}>
            <Button
              title={isExporting ? 'Exportando...' : 'Exportar Respaldo'}
              variant="outline"
              size="sm"
              loading={isExporting}
              disabled={isExporting || !user?.id}
              onPress={() => {
                void handleExportBackup()
              }}
              style={styles.backupActionBtn}
              icon={<Ionicons name="share-outline" size={16} color={colors.primary} />}
            />
            <Button
              title="Restaurar Respaldo"
              variant="ghost"
              size="sm"
              onPress={() => {
                setIsRestoreModalVisible(true)
              }}
              style={styles.backupActionBtn}
              icon={<Ionicons name="download-outline" size={16} color={colors.textPrimary} />}
            />
          </View>
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

      {/* Restore Backup Modal */}
      <Modal
        visible={isRestoreModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsRestoreModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
                <Text style={styles.modalTitle}>Restaurar Copia</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsRestoreModalVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Pega aquí el contenido JSON de tu respaldo previo para reincorporar tus tarjetas y estadísticas locales:
            </Text>

            <TextInput
              style={styles.jsonInput}
              multiline
              numberOfLines={7}
              value={backupJsonInput}
              onChangeText={setBackupJsonInput}
              placeholder='{"version": 1, "cards": [...]}'
              placeholderTextColor={colors.textMuted}
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalActionRow}>
              <Button
                title="Cancelar"
                variant="ghost"
                size="sm"
                onPress={() => {
                  setBackupJsonInput('')
                  setIsRestoreModalVisible(false)
                }}
                style={styles.modalCancelBtn}
              />
              <Button
                title={isRestoring ? 'Restaurando...' : 'Restaurar Ahora'}
                variant="primary"
                size="sm"
                loading={isRestoring}
                disabled={isRestoring || !backupJsonInput.trim()}
                onPress={() => {
                  void handleRestoreBackup()
                }}
                style={styles.modalRestoreBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  backupCard: {
    marginBottom: spacing.lg,
  },
  backupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backupIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backupHeaderInfo: {
    flex: 1,
  },
  backupCardTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  backupCardSubtitle: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  backupBtnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  backupActionBtn: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 480,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  modalTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  jsonInput: {
    height: 140,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: spacing.md,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  modalCancelBtn: {
    flex: 1,
  },
  modalRestoreBtn: {
    flex: 1,
  },
})

