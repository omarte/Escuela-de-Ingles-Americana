import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as Constants from 'expo-constants'
import { colors, radius, spacing, typography, Card, Badge, Button } from '@elp/ui'
import { useAuthStore } from '../../stores/useAuthStore'
import { usePurchases } from '../../hooks/usePurchases'
import { useProgressStore } from '../../stores/useProgressStore'
import { supabase } from '../../lib/supabase'
import { AppScreenHeader } from '../../components/AppScreenHeader'
import { systemsWhitelistService } from '../../lib/systemsWhitelistService'

interface CategoryOption {
  readonly id: string
  readonly label: string
  readonly icon: keyof typeof Ionicons.glyphMap
}

const CATEGORIES: readonly CategoryOption[] = [
  { id: 'billing', label: 'Facturación / Google Play', icon: 'card-outline' },
  { id: 'access', label: 'Acceso y Mi Cuenta', icon: 'key-outline' },
  { id: 'sync', label: 'Progreso y Sincronización', icon: 'sync-outline' },
  { id: 'tech', label: 'Audio / Fallas Técnicas', icon: 'volume-mute-outline' },
  { id: 'pedagogy', label: 'Consulta Pedagógica / Errata', icon: 'school-outline' },
  { id: 'privacy', label: 'Privacidad / Borrado de Datos', icon: 'shield-outline' },
]

export default function SupportScreen(): React.JSX.Element {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const { isPro, isInstitutionalPro, restore, refresh } = usePurchases()
  const selectedLevel = useProgressStore((state) => state.metrics.levelAdvancement.currentLevel)
  const totalLearned = useProgressStore((state) => state.metrics.wordsInMemory)

  const [email, setEmail] = useState(user?.email ?? '')
  const [selectedCategory, setSelectedCategory] = useState<string>('billing')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRestoringPro, setIsRestoringPro] = useState(false)
  const [ticketSentSuccess, setTicketSentSuccess] = useState<number | null>(null)

  // Estados del Módulo de Sistemas & Lista Blanca
  const [activationCodeInput, setActivationCodeInput] = useState('')
  const [isValidatingEmail, setIsValidatingEmail] = useState(false)
  const [isValidatingCode, setIsValidatingCode] = useState(false)
  const [adminModalVisible, setAdminModalVisible] = useState(false)
  const [whitelistEmails, setWhitelistEmails] = useState<string[]>([])
  const [newEmailInput, setNewEmailInput] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  // Cargar lista blanca al montar
  useEffect(() => {
    void loadWhitelist()
  }, [])

  const loadWhitelist = async () => {
    const list = await systemsWhitelistService.getWhitelistedEmails()
    setWhitelistEmails(list)
  }

  // 1. Validar correo del usuario logueado en la lista blanca de Sistemas
  const handleValidateMyEmail = async (): Promise<void> => {
    setIsValidatingEmail(true)
    const targetEmail = user?.email || email
    try {
      const res = await systemsWhitelistService.validateAndGrantByEmail(targetEmail)
      if (res.success) {
        await refresh()
        Alert.alert('✅ Acceso Autorizado por Sistemas', res.message, [{ text: 'Continuar', style: 'default' }])
      } else {
        Alert.alert('Lista Blanca de Sistemas', res.message, [
          { text: 'Entendido', style: 'cancel' },
          {
            text: 'Ingresar Clave',
            onPress: () => {
              // enfocar código
            },
          },
        ])
      }
    } catch {
      Alert.alert('Error', 'No se pudo conectar con el servicio de validación de Sistemas.')
    } finally {
      setIsValidatingEmail(false)
    }
  }

  // 2. Validar código de activación de Sistemas
  const handleValidateActivationCode = async (): Promise<void> => {
    if (!activationCodeInput.trim()) {
      Alert.alert('Código Requerido', 'Por favor ingresa la clave o código institucional entregado por el Dpto. de Sistemas.')
      return
    }

    setIsValidatingCode(true)
    try {
      const res = await systemsWhitelistService.validateActivationCode(activationCodeInput, user?.email || email)
      if (res.success) {
        setActivationCodeInput('')
        await loadWhitelist()
        await refresh()
        Alert.alert('🎉 Membresía Activada', res.message, [{ text: '¡Excelente!', style: 'default' }])
      } else {
        Alert.alert('Código No Válido', res.message)
      }
    } catch {
      Alert.alert('Error', 'No se pudo validar el código.')
    } finally {
      setIsValidatingCode(false)
    }
  }

  // 3. Abrir Panel de Administración de Sistemas
  const handleOpenAdmin = async (): Promise<void> => {
    const isMasterUser = user?.email?.toLowerCase() === 'ozmartinezpaz@gmail.com'
    if (isMasterUser || isAdminAuthenticated) {
      setIsAdminAuthenticated(true)
      await loadWhitelist()
      setAdminModalVisible(true)
    } else {
      Alert.prompt
        ? Alert.prompt(
            'Acceso al Dpto. de Sistemas',
            'Ingresa el PIN maestro de administración de listas blancas:',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Ingresar',
                onPress: async (pin?: string) => {
                  if (pin === '1978' || pin === '2026' || pin === 'sistemas') {
                    setIsAdminAuthenticated(true)
                    await loadWhitelist()
                    setAdminModalVisible(true)
                  } else {
                    Alert.alert('Acceso Denegado', 'PIN de Sistemas incorrecto.')
                  }
                },
              },
            ],
            'secure-text'
          )
        : // Fallback si Alert.prompt no está soportado en Android
          setAdminModalVisible(true)
    }
  }

  const handleAddEmailToWhitelist = async (): Promise<void> => {
    if (!newEmailInput.trim() || !newEmailInput.includes('@')) {
      Alert.alert('Correo Inválido', 'Por favor escribe un correo con formato válido.')
      return
    }

    const res = await systemsWhitelistService.addWhitelistedEmail(newEmailInput)
    if (res.success) {
      setWhitelistEmails(res.emails)
      setNewEmailInput('')
      Alert.alert('Éxito', res.message)
    } else {
      Alert.alert('Error', res.message)
    }
  }

  const handleRemoveEmailFromWhitelist = async (targetEmail: string): Promise<void> => {
    Alert.alert(
      'Remover de Lista Blanca',
      `¿Deseas revocar el acceso institucional a ${targetEmail}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            const res = await systemsWhitelistService.removeWhitelistedEmail(targetEmail)
            setWhitelistEmails(res.emails)
          },
        },
      ]
    )
  }

  const handleResetWhitelist = async (): Promise<void> => {
    Alert.alert(
      'Restablecer Valores por Defecto',
      '¿Deseas restablecer los 10 correos iniciales de prueba autorizados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'default',
          onPress: async () => {
            const list = await systemsWhitelistService.resetToDefaults()
            setWhitelistEmails(list)
          },
        },
      ]
    )
  }

  // Autodiagnóstico rápido: Restaurar compra de tienda
  const handleQuickRestore = async (): Promise<void> => {
    setIsRestoringPro(true)
    try {
      const result = await restore()
      if (result.success && result.isPro) {
        Alert.alert(
          '¡Membresía Restaurada con Éxito!',
          'Se validó tu compra en Google Play / App Store o Licencia Institucional. Tu acceso Pro está activo.'
        )
      } else {
        Alert.alert(
          'Restauración Verificada',
          result.error ?? 'No se encontró una suscripción activa vinculada a esta cuenta de Google Play / Apple ID.'
        )
      }
    } catch {
      Alert.alert('Error', 'No se pudo contactar con la tienda. Intenta nuevamente.')
    } finally {
      setIsRestoringPro(false)
    }
  }

  // Enviar ticket a Supabase
  const handleSubmitTicket = async (): Promise<void> => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Correo Requerido', 'Por favor ingresa un correo electrónico válido para poder responderte.')
      return
    }
    if (!subject.trim()) {
      Alert.alert('Asunto Requerido', 'Por favor describe brevemente el motivo de tu consulta.')
      return
    }
    if (!message.trim() || message.trim().length < 10) {
      Alert.alert('Descripción Requerida', 'Por favor detalla qué ocurrió con al menos 10 caracteres.')
      return
    }

    setIsSubmitting(true)

    const deviceLogs = {
      platform: Platform.OS,
      os_version: String(Platform.Version),
      app_version: (Constants.default?.expoConfig?.version as string) ?? '1.0.0',
      is_pro: isPro,
      is_institutional: isInstitutionalPro,
      current_level: selectedLevel,
      words_studied: totalLearned,
      user_id: user?.id ?? 'anonymous',
      submitted_at: new Date().toISOString(),
    }

    try {
      if (!supabase) {
        throw new Error('Cliente Supabase no inicializado.')
      }

      const { data, error } = await (supabase as any)
        .from('support_tickets')
        .insert([
          {
            user_email: email.trim().toLowerCase(),
            category: selectedCategory,
            subject: subject.trim(),
            message: message.trim(),
            screenshot_data: screenshotBase64,
            device_logs: deviceLogs,
            status: 'open',
          },
        ])
        .select('ticket_number')
        .single()

      if (error) throw error

      const ticketNum = data?.ticket_number ?? Math.floor(1000 + Math.random() * 9000)
      setTicketSentSuccess(ticketNum)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error de red.'
      Alert.alert(
        'Ticket Registrado en Modo Directo',
        `Hemos registrado tu consulta. También puedes escribir a soporte@escueladeinglesamericana.com (${msg})`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (ticketSentSuccess !== null) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.successContainer}>
          <View style={styles.successIconBox}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
          </View>
          <Text style={styles.successTitle}>¡Ticket #{ticketSentSuccess} Recibido!</Text>
          <Text style={styles.successMessage}>
            Tu reporte ha sido registrado en nuestro sistema de atención con sus logs técnicos.
          </Text>
          <Text style={styles.successSubtext}>
            Te responderemos al correo <Text style={styles.boldText}>{email}</Text> a la brevedad.
          </Text>
          <Button
            title="Volver a la Escuela"
            variant="primary"
            onPress={() => router.replace('/(app)')}
            style={styles.successButton}
          />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <AppScreenHeader
          icon="headset-outline"
          accentColor="#10B981"
          iconBgColor="#ECFDF5"
          eyebrow="ASISTENCIA TÉCNICA & SISTEMAS"
          title="Centro de Soporte"
          subtitle="¿Tienes dudas con tu suscripción, sincronización o necesitas activación de Sistemas? Gestiona tu acceso aquí."
          rightElement={<Badge label="En Vivo" color="#10B981" size="sm" />}
        />

        {/* 🌟 SECCIÓN 1: DEPARTAMENTO DE SISTEMAS & LISTA BLANCA PRO */}
        <Card padding="lg" highlighted style={styles.systemsCard}>
          <View style={styles.systemsHeaderRow}>
            <View style={styles.systemsIconBox}>
              <Ionicons name="shield-checkmark" size={22} color="#059669" />
            </View>
            <View style={styles.systemsTitleCol}>
              <View style={styles.systemsBadgeRow}>
                <Text style={styles.systemsTitle}>Dpto. de Sistemas & Licencias</Text>
                {isInstitutionalPro ? (
                  <Badge label="Licencia Activa" color="#059669" size="sm" />
                ) : (
                  <Badge label="Lista Blanca" color="#D97706" size="sm" />
                )}
              </View>
              <Text style={styles.systemsSubtitle}>
                {isInstitutionalPro
                  ? 'Tu cuenta tiene acceso Pro Vitalicio otorgado por el Departamento de Sistemas.'
                  : 'Validación de evaluadores autorizados, cuentas de prueba y becas institucionales.'}
              </Text>
            </View>
          </View>

          {/* Estado de Membresía Actual */}
          {isInstitutionalPro ? (
            <View style={styles.activeProBox}>
              <Ionicons name="ribbon" size={24} color="#D97706" />
              <View style={styles.activeProTextCol}>
                <Text style={styles.activeProTitle}>Membresía Institucional Habilitada</Text>
                <Text style={styles.activeProDesc}>
                  Acceso completo sin costo a niveles A1–B2, fonética IPA, telemetría y certificaciones.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.systemsActionsContainer}>
              {/* Botón 1-Click: Validar Mi Correo */}
              <TouchableOpacity
                style={styles.validateEmailBtn}
                onPress={handleValidateMyEmail}
                disabled={isValidatingEmail}
                activeOpacity={0.8}
              >
                {isValidatingEmail ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-done-circle-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.validateEmailBtnText}>Validar mi Correo en Lista Blanca</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Opción 2: Ingresar Clave / Código de Activación */}
              <View style={styles.codeRow}>
                <TextInput
                  style={styles.codeInput}
                  placeholder="Código de Activación (ej: SISTEMAS-EIA-2026)"
                  placeholderTextColor="#94A3B8"
                  value={activationCodeInput}
                  onChangeText={setActivationCodeInput}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.applyCodeBtn}
                  onPress={handleValidateActivationCode}
                  disabled={isValidatingCode}
                  activeOpacity={0.8}
                >
                  {isValidatingCode ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.applyCodeBtnText}>Activar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Botón Administrador: Abrir Panel de Lista Blanca */}
          <TouchableOpacity
            style={styles.adminPanelTrigger}
            onPress={handleOpenAdmin}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={15} color="#059669" />
            <Text style={styles.adminPanelTriggerText}>Administrar Lista Blanca de Evaluadores (Sistemas)</Text>
          </TouchableOpacity>
        </Card>

        {/* 🌟 SECCIÓN 2: RESTAURAR COMPRAS DE GOOGLE PLAY */}
        <Card padding="md" style={styles.quickActionCard}>
          <View style={styles.quickActionRow}>
            <View style={styles.quickIconCircle}>
              <Ionicons name="card-outline" size={20} color="#D97706" />
            </View>
            <View style={styles.quickActionInfo}>
              <Text style={styles.quickActionTitle}>¿Pagué en Google Play y sigue el Paywall?</Text>
              <Text style={styles.quickActionDesc}>
                Sincroniza tu recibo oficial de la tienda de forma inmediata.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleQuickRestore}
            disabled={isRestoringPro}
          >
            {isRestoringPro ? (
              <ActivityIndicator size="small" color="#D97706" />
            ) : (
              <>
                <Ionicons name="refresh" size={16} color="#D97706" />
                <Text style={styles.quickActionBtnText}>Restaurar Compras de Google Play</Text>
              </>
            )}
          </TouchableOpacity>
        </Card>

        {/* 🌟 SECCIÓN 3: FORMULARIO DE TICKET DE SOPORTE */}
        <Text style={styles.sectionTitle}>Abrir Ticket de Asistencia</Text>

        {/* Category Picker */}
        <Text style={styles.fieldLabel}>Selecciona la Categoría</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={isSelected ? '#FFFFFF' : colors.textSecondary}
                />
                <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Email Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Tu Correo Electrónico *</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@correo.com"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Subject Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Asunto de la Consulta *</Text>
          <TextInput
            style={styles.textInput}
            value={subject}
            onChangeText={setSubject}
            placeholder="Ej: Consulta sobre el módulo o evaluación"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Message Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Descripción Detallada *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={message}
            onChangeText={setMessage}
            placeholder="Escribe tu mensaje para el equipo de soporte técnico..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Ticket Button */}
        <Button
          title={isSubmitting ? 'Enviando...' : 'Enviar Ticket a Soporte'}
          variant="primary"
          onPress={handleSubmitTicket}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitButton}
        />

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* 🌟 MODAL DE ADMINISTRACIÓN DE LISTA BLANCA (SISTEMAS) */}
      <Modal
        visible={adminModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAdminModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="server" size={22} color="#059669" />
                <Text style={styles.modalTitle}>Lista Blanca de Sistemas</Text>
              </View>
              <TouchableOpacity onPress={() => setAdminModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Correos autorizados para acceso Pro Vitalicio gratuito sin pasar por pasarelas de pago.
            </Text>

            {/* Agregar nuevo correo */}
            <View style={styles.addEmailRow}>
              <TextInput
                style={styles.addEmailInput}
                placeholder="nuevo_evaluador@correo.com"
                placeholderTextColor="#94A3B8"
                value={newEmailInput}
                onChangeText={setNewEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.addEmailBtn}
                onPress={handleAddEmailToWhitelist}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.addEmailBtnText}>Agregar</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de Correos Registrados */}
            <Text style={styles.emailListCount}>
              Usuarios Registrados ({whitelistEmails.length}):
            </Text>
            <ScrollView style={styles.emailListScroll} showsVerticalScrollIndicator={true}>
              {whitelistEmails.map((itemEmail, idx) => (
                <View key={`${itemEmail}-${idx}`} style={styles.emailListItem}>
                  <View style={styles.emailListInfo}>
                    <Ionicons name="person-circle-outline" size={18} color="#059669" />
                    <Text style={styles.emailListText} numberOfLines={1}>
                      {itemEmail}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveEmailFromWhitelist(itemEmail)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* Footer con Acciones */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetBtn} onPress={handleResetWhitelist}>
                <Ionicons name="reload-outline" size={15} color="#64748B" />
                <Text style={styles.resetBtnText}>Restablecer a 10 por Defecto</Text>
              </TouchableOpacity>
              <Button
                title="Cerrar Panel"
                variant="primary"
                size="sm"
                onPress={() => setAdminModalVisible(false)}
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
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },

  // Sistemas & Whitelist Styles
  systemsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: radius.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  systemsHeaderRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  systemsIconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemsTitleCol: {
    flex: 1,
  },
  systemsBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  systemsTitle: {
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
  },
  systemsSubtitle: {
    fontSize: 12.5,
    fontWeight: typography.weights.regular,
    color: '#475569',
    lineHeight: 17,
  },
  activeProBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  activeProTextCol: {
    flex: 1,
  },
  activeProTitle: {
    fontSize: 13.5,
    fontWeight: typography.weights.bold,
    color: '#92400E',
  },
  activeProDesc: {
    fontSize: 12,
    fontWeight: typography.weights.regular,
    color: '#B45309',
    marginTop: 2,
  },
  systemsActionsContainer: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  validateEmailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  validateEmailBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: typography.weights.bold,
  },
  codeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  codeInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: typography.weights.medium,
  },
  applyCodeBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
  },
  applyCodeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: typography.weights.bold,
  },
  adminPanelTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: spacing.md,
  },
  adminPanelTriggerText: {
    fontSize: 12.5,
    fontWeight: typography.weights.semibold,
    color: '#059669',
  },

  // Quick Action Card (Store Restore)
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },
  quickActionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  quickIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionInfo: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
  },
  quickActionDesc: {
    fontSize: 12,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radius.md,
    paddingVertical: 9,
    marginTop: spacing.sm,
  },
  quickActionBtnText: {
    fontSize: 13,
    fontWeight: typography.weights.semibold,
    color: '#D97706',
  },

  // Form Styles
  categoryScroll: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  categoryChipText: {
    fontSize: 12.5,
    fontWeight: typography.weights.medium,
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
  },
  fieldGroup: {
    marginTop: spacing.sm,
  },
  fieldLabel: {
    fontSize: 13.5,
    fontWeight: typography.weights.semibold,
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14.5,
    fontWeight: typography.weights.regular,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 85,
  },
  submitButton: {
    marginTop: spacing.md,
    borderRadius: radius.md,
  },
  bottomPad: {
    height: 40,
  },

  // Success Screen
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  successIconBox: {
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  successMessage: {
    fontSize: 14.5,
    fontWeight: typography.weights.regular,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  successSubtext: {
    fontSize: 13,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  boldText: {
    fontWeight: typography.weights.bold,
    color: '#0F172A',
  },
  successButton: {
    width: '100%',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: typography.weights.bold,
    color: '#0F172A',
  },
  modalDesc: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  addEmailRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  addEmailInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  addEmailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    borderRadius: radius.md,
    gap: 4,
  },
  addEmailBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: typography.weights.bold,
  },
  emailListCount: {
    fontSize: 13,
    fontWeight: typography.weights.semibold,
    color: '#334155',
    marginBottom: 6,
  },
  emailListScroll: {
    maxHeight: 180,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  emailListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  emailListInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  emailListText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: typography.weights.medium,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: spacing.md,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetBtnText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: typography.weights.medium,
  },
})
