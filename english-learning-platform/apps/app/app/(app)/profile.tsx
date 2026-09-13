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
  restoreLocalCardsWithMerge,
} from '../../lib/db/sqlite'
import { isSupabaseConfigured } from '../../lib/supabase'
import { deleteAccountAndCleanup } from '../../lib/account'
import { APP_LOGO, SCHOOL_LOGO } from '../../lib/assets'
import { OnboardingModal } from '../../components/OnboardingModal'
import {
  useStudyPreferencesStore,
  type PronunciationVariant,
} from '../../stores/useStudyPreferencesStore'

const GOAL_OPTIONS = [
  { value: 10, label: '10 palabras / día', sub: 'Ritmo suave · ~5 min diarios' },
  { value: 15, label: '15 palabras / día', sub: 'Ritmo constante · ~8 min diarios' },
  { value: 20, label: '20 palabras / día (Recomendado)', sub: 'Ritmo académico estándar · ~10 min diarios' },
  { value: 25, label: '25 palabras / día', sub: 'Acelerado · ~15 min diarios' },
  { value: 30, label: '30 palabras / día', sub: 'Intensivo · ~20 min diarios' },
]

const PRONUNCIATION_OPTIONS: Array<{ value: PronunciationVariant; label: string; sub: string }> = [
  {
    value: 'US_STANDARD',
    label: 'Inglés Americano Estándar (0.88x)',
    sub: 'Velocidad fluida con entonación nativa de EE. UU.',
  },
  {
    value: 'US_SLOW',
    label: 'Inglés Americano Fonética Lenta (0.75x)',
    sub: 'Pausado para distinguir fonemas y vocales complejas.',
  },
]

const REMINDER_OPTIONS = [
  { hour: 19, minute: 0, enabled: true, label: '19:00 hrs', sub: 'Tarde · Al finalizar labores' },
  { hour: 20, minute: 0, enabled: true, label: '20:00 hrs (Recomendado)', sub: 'Noche · Antes de cenar' },
  { hour: 21, minute: 0, enabled: true, label: '21:00 hrs', sub: 'Noche · Rutina tranquila de estudio' },
  { hour: 22, minute: 0, enabled: true, label: '22:00 hrs', sub: 'Noche tardía · Antes de descansar' },
  { hour: -1, minute: 0, enabled: false, label: 'Desactivado', sub: 'Sin recordatorios automáticos' },
]

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

  // Study Preferences Store
  const dailyGoal = useStudyPreferencesStore((state) => state.dailyGoal)
  const pronunciationVariant = useStudyPreferencesStore((state) => state.pronunciationVariant)
  const reminderHour = useStudyPreferencesStore((state) => state.reminderHour)
  const notificationsEnabled = useStudyPreferencesStore((state) => state.notificationsEnabled)
  const loadPreferences = useStudyPreferencesStore((state) => state.loadPreferences)
  const setDailyGoal = useStudyPreferencesStore((state) => state.setDailyGoal)
  const setPronunciationVariant = useStudyPreferencesStore((state) => state.setPronunciationVariant)
  const setReminder = useStudyPreferencesStore((state) => state.setReminder)

  const [activeSettingModal, setActiveSettingModal] = useState<
    'dailyGoal' | 'pronunciation' | 'reminder' | null
  >(null)

  useEffect(() => {
    void loadPreferences()
  }, [loadPreferences])

  useEffect(() => {
    if (user?.id) {
      void loadInitialStatus(user.id)
    }
  }, [user?.id, loadInitialStatus])

  const handleLogout = async (): Promise<void> => {
    await logout()
    router.replace('/(auth)/login')
  }

  const [onboardingVisible, setOnboardingVisible] = useState(false)

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

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = async (): Promise<void> => {
    if (confirmationText.trim().toUpperCase() !== 'ELIMINAR') {
      Alert.alert('Confirmación requerida', 'Debes escribir "ELIMINAR" exactamente para confirmar.')
      return
    }

    setIsDeleting(true)
    const result = await deleteAccountAndCleanup()
    setIsDeleting(false)

    if (result.success) {
      setDeleteModalVisible(false)
      setConfirmationText('')
      Alert.alert('Cuenta Eliminada', 'Tu cuenta y todos tus datos han sido eliminados correctamente.')
      router.replace('/(auth)/login')
    } else {
      Alert.alert('Error', result.error ?? 'No se pudo eliminar la cuenta. Intenta de nuevo más tarde.')
    }
  }

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

  const executeRestore = async (parsed: {
    cards: Array<{ vocabularyItemId: string; [key: string]: unknown }>
    reviewEvents?: unknown[]
  }): Promise<void> => {
    if (!user?.id) return
    setIsRestoring(true)
    try {
      // Smart Merge: updates existing cards keeping higher reps/interval, inserts new ones
      const { added, updated } = await restoreLocalCardsWithMerge(
        user.id,
        parsed.cards as any,
      )

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
        '¡Respaldo Fusionado con Éxito!',
        `Se procesaron ${parsed.cards.length} tarjetas (${added} nuevas añadidas, ${updated} tarjetas existentes fusionadas manteniendo su mayor nivel de dominio).`,
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

  const handleRestoreBackup = (): void => {
    if (!user?.id) return
    const raw = backupJsonInput.trim()
    if (!raw) return

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
      Alert.alert('Error de Formato', 'El texto ingresado no es un formato JSON válido.')
      return
    }

    if (!parsed || typeof parsed !== 'object') {
      Alert.alert('Error', 'El archivo de respaldo está vacío o corrupto.')
      return
    }

    if (!parsed.version || !Array.isArray(parsed.cards)) {
      Alert.alert(
        'Estructura Incompatible',
        'El JSON no contiene una estructura de respaldo compatible (falta versión o lista de tarjetas).',
      )
      return
    }

    // Safety Confirmation Dialog before touching SQLite
    Alert.alert(
      '¿Restaurar Copia de Seguridad?',
      `Se procesarán ${parsed.cards.length} tarjetas.\n\nFUSIÓN SEGURA: Si ya tienes avance local en este teléfono, se combinará inteligentemente conservando el estado más avanzado (mayor intervalo y repasos) sin perder nada.\n\n¿Deseas proceder?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar y Fusionar',
          style: 'default',
          onPress: () => {
            void executeRestore(parsed as any)
          },
        },
      ],
    )
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
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setActiveSettingModal('dailyGoal')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Cambiar meta diaria de palabras"
          >
            <View style={styles.settingLeft}>
              <Ionicons name="flag-outline" size={20} color={colors.primary} />
              <View>
                <Text style={styles.settingLabel}>Meta diaria de palabras</Text>
                <Text style={styles.settingSubtext}>Objetivo diario de tarjetas</Text>
              </View>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{dailyGoal} palabras / día</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setActiveSettingModal('pronunciation')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Cambiar variante de pronunciación"
          >
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high-outline" size={20} color={colors.primary} />
              <View>
                <Text style={styles.settingLabel}>Variante de pronunciación</Text>
                <Text style={styles.settingSubtext}>Velocidad del motor de voz</Text>
              </View>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>
                {pronunciationVariant === 'US_SLOW' ? 'Fonética Lenta' : 'Estándar (EE.UU.)'}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setActiveSettingModal('reminder')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Cambiar recordatorio diario"
          >
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              <View>
                <Text style={styles.settingLabel}>Recordatorio diario</Text>
                <Text style={styles.settingSubtext}>Notificación local para tu racha</Text>
              </View>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>
                {notificationsEnabled ? `${String(reminderHour).padStart(2, '0')}:00 hrs` : 'Desactivado'}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Help & Guide */}
        <Text style={styles.sectionTitle}>Guía del Estudiante</Text>
        <Card padding="md" style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              setOnboardingVisible(true)
            }}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="school-outline" size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>Ver Tutorial y Método de la Escuela</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
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

        {/* Zona de Peligro: Eliminación de Cuenta (Apple Guideline 5.1.1(v)) */}
        <View style={styles.dangerZone}>
          <View style={styles.dangerHeader}>
            <Ionicons name="warning-outline" size={18} color={colors.danger} />
            <Text style={styles.dangerTitle}>Zona de Peligro</Text>
          </View>
          <Text style={styles.dangerDescription}>
            Esta acción es permanente e irreversible. Se eliminarán tu progreso, tarjetas de estudio y datos de cuenta de forma definitiva.
          </Text>
          <TouchableOpacity
            style={styles.deleteAccountBtn}
            onPress={() => {
              setConfirmationText('')
              setDeleteModalVisible(true)
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
            <Text style={styles.deleteAccountBtnText}>Eliminar mi cuenta permanentemente</Text>
          </TouchableOpacity>
        </View>

        {/* App Version Info & School Crest */}
        <View style={styles.versionInfo}>
          <Image source={SCHOOL_LOGO} style={styles.versionLogo} resizeMode="contain" />
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

      {/* Modal de Confirmación de Eliminación de Cuenta */}
      <Modal
        visible={isDeleteModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          if (!isDeleting) {
            setDeleteModalVisible(false)
            setConfirmationText('')
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name="alert-circle-outline" size={22} color={colors.danger} />
                <Text style={[styles.modalTitle, { color: colors.danger }]}>¿Eliminar Cuenta?</Text>
              </View>
              {!isDeleting && (
                <TouchableOpacity
                  onPress={() => {
                    setDeleteModalVisible(false)
                    setConfirmationText('')
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.modalSubtitle}>
              Esta acción <Text style={{ fontWeight: '700', color: colors.textPrimary }}>no se puede deshacer</Text>. Se purgarán de inmediato todos tus repasos y tarjetas.
            </Text>
            <Text style={[styles.modalSubtitle, { marginBottom: spacing.md }]}>
              Para confirmar, escribe <Text style={{ fontWeight: '700', color: colors.danger }}>ELIMINAR</Text> en el campo siguiente:
            </Text>

            <TextInput
              style={styles.deleteConfirmInput}
              placeholder="Escribe ELIMINAR"
              placeholderTextColor={colors.textMuted}
              value={confirmationText}
              onChangeText={setConfirmationText}
              autoCapitalize="characters"
              editable={!isDeleting}
            />

            <View style={styles.modalActionRow}>
              <Button
                title="Cancelar"
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onPress={() => {
                  setDeleteModalVisible(false)
                  setConfirmationText('')
                }}
                style={styles.modalCancelBtn}
              />
              <Button
                title={isDeleting ? 'Eliminando...' : 'Confirmar'}
                variant="danger"
                size="sm"
                loading={isDeleting}
                disabled={isDeleting || confirmationText.trim().toUpperCase() !== 'ELIMINAR'}
                onPress={() => {
                  void handleDeleteAccount()
                }}
                style={styles.modalDeleteBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Interactive Settings Selector Modal */}
      <Modal
        visible={activeSettingModal !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveSettingModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons
                  name={
                    activeSettingModal === 'dailyGoal'
                      ? 'flag-outline'
                      : activeSettingModal === 'pronunciation'
                        ? 'volume-high-outline'
                        : 'notifications-outline'
                  }
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.modalTitle}>
                  {activeSettingModal === 'dailyGoal' && 'Meta Diaria de Palabras'}
                  {activeSettingModal === 'pronunciation' && 'Variante de Pronunciación'}
                  {activeSettingModal === 'reminder' && 'Recordatorio Diario de Estudio'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setActiveSettingModal(null)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Cerrar modal"
              >
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {activeSettingModal === 'dailyGoal' &&
                'Selecciona cuántas tarjetas nuevas y de repaso deseas completar cada día para tu racha:'}
              {activeSettingModal === 'pronunciation' &&
                'Ajusta la velocidad del motor de pronunciación nativo de las tarjetas:'}
              {activeSettingModal === 'reminder' &&
                'Configura una notificación local en tu teléfono para proteger tu racha sin depender de internet:'}
            </Text>

            <View style={styles.settingOptionsList}>
              {activeSettingModal === 'dailyGoal' &&
                GOAL_OPTIONS.map((opt) => {
                  const isSelected = dailyGoal === opt.value
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.settingOptionRow,
                        isSelected && styles.settingOptionRowSelected,
                      ]}
                      onPress={async () => {
                        await setDailyGoal(opt.value)
                        setActiveSettingModal(null)
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.settingOptionTextCol}>
                        <Text
                          style={[
                            styles.settingOptionLabel,
                            isSelected && styles.settingOptionLabelSelected,
                          ]}
                        >
                          {opt.label}
                        </Text>
                        <Text style={styles.settingOptionSub}>{opt.sub}</Text>
                      </View>
                      <Ionicons
                        name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                        size={20}
                        color={isSelected ? colors.primary : colors.textMuted}
                      />
                    </TouchableOpacity>
                  )
                })}

              {activeSettingModal === 'pronunciation' &&
                PRONUNCIATION_OPTIONS.map((opt) => {
                  const isSelected = pronunciationVariant === opt.value
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.settingOptionRow,
                        isSelected && styles.settingOptionRowSelected,
                      ]}
                      onPress={async () => {
                        await setPronunciationVariant(opt.value)
                        setActiveSettingModal(null)
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.settingOptionTextCol}>
                        <Text
                          style={[
                            styles.settingOptionLabel,
                            isSelected && styles.settingOptionLabelSelected,
                          ]}
                        >
                          {opt.label}
                        </Text>
                        <Text style={styles.settingOptionSub}>{opt.sub}</Text>
                      </View>
                      <Ionicons
                        name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                        size={20}
                        color={isSelected ? colors.primary : colors.textMuted}
                      />
                    </TouchableOpacity>
                  )
                })}

              {activeSettingModal === 'reminder' &&
                REMINDER_OPTIONS.map((opt, idx) => {
                  const isSelected =
                    (!opt.enabled && !notificationsEnabled) ||
                    (opt.enabled && notificationsEnabled && reminderHour === opt.hour)
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.settingOptionRow,
                        isSelected && styles.settingOptionRowSelected,
                      ]}
                      onPress={async () => {
                        const res = await setReminder(opt.hour, opt.minute, opt.enabled)
                        setActiveSettingModal(null)
                        Alert.alert('Recordatorio', res.message)
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.settingOptionTextCol}>
                        <Text
                          style={[
                            styles.settingOptionLabel,
                            isSelected && styles.settingOptionLabelSelected,
                          ]}
                        >
                          {opt.label}
                        </Text>
                        <Text style={styles.settingOptionSub}>{opt.sub}</Text>
                      </View>
                      <Ionicons
                        name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                        size={20}
                        color={isSelected ? colors.primary : colors.textMuted}
                      />
                    </TouchableOpacity>
                  )
                })}
            </View>
          </View>
        </View>
      </Modal>

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
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  settingSubtext: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textMuted,
    marginTop: 2,
  },
  settingValue: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // Interactive Setting Options Modal Styles
  settingOptionsList: {
    gap: spacing.xs + 2,
    marginTop: spacing.xs,
  },
  settingOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  settingOptionRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  settingOptionTextCol: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  settingOptionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  settingOptionLabelSelected: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  settingOptionSub: {
    fontSize: typography.sizes.xs - 1,
    color: colors.textSecondary,
    marginTop: 2,
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
  dangerZone: {
    padding: spacing.md,
    backgroundColor: '#FEF2F2',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: spacing.xl,
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  dangerTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: '#991B1B',
  },
  dangerDescription: {
    fontSize: typography.sizes.xs,
    color: '#7F1D1D',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  deleteAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  deleteAccountBtnText: {
    color: '#EF4444',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  deleteConfirmInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    fontSize: typography.sizes.sm,
    backgroundColor: colors.background,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  modalDeleteBtn: {
    flex: 1,
  },
})

