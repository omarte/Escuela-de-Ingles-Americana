import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, typography, Button, Card, Badge } from '@elp/ui'
import type { CEFRLevel } from '@elp/types'
import { useAuthStore } from '../../stores/useAuthStore'
import { APP_LOGO } from '../../lib/assets'

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2']

const REFERRAL_OPTIONS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'amigo_familiar', label: 'Amigo / Familia' },
  { id: 'busqueda_google', label: 'Google' },
  { id: 'otro', label: 'Otro' },
]

const GOAL_OPTIONS = [
  { id: 'trabajo_ascenso', label: '💼 Trabajo' },
  { id: 'viajes', label: '✈️ Viajes' },
  { id: 'academico_examen', label: '🎓 Exámenes' },
  { id: 'crecimiento_personal', label: '🚀 Crecimiento' },
]

const COUNTRY_OPTIONS = [
  { id: 'PE', label: '🇵🇪 PE' },
  { id: 'MX', label: '🇲🇽 MX' },
  { id: 'CO', label: '🇨🇴 CO' },
  { id: 'ES', label: '🇪🇸 ES' },
  { id: 'AR', label: '🇦🇷 AR' },
  { id: 'US', label: '🇺🇸 US' },
]

export default function RegisterScreen(): React.JSX.Element {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1')
  const [selectedGoal, setSelectedGoal] = useState<string>('trabajo_ascenso')
  const [selectedReferral, setSelectedReferral] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [showExtraFields, setShowExtraFields] = useState(false)

  const register = useAuthStore((state) => state.register)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)

  const handleRegister = async (): Promise<void> => {
    clearError()
    const timezoneOffset = Math.round(new Date().getTimezoneOffset() / -60)
    const success = await register({
      displayName,
      email,
      password,
      initialLevel: selectedLevel,
      referralSource: selectedReferral || undefined,
      countryCode: selectedCountry || undefined,
      timezoneOffset,
      learningGoal: selectedGoal || undefined,
    })
    if (success) {
      router.replace('/(app)')
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image source={APP_LOGO} style={styles.logoImage} resizeMode="contain" />
            <Text style={styles.title}>Crea tu Cuenta</Text>
            <Text style={styles.subtitle}>Escuela de Inglés Americana</Text>
          </View>

          <Card padding="lg" style={styles.formCard}>
            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre de Usuario</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Juan Pérez"
                placeholderTextColor={colors.textMuted}
                value={displayName}
                onChangeText={(text) => {
                  if (error) clearError()
                  setDisplayName(text)
                }}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={(text) => {
                  if (error) clearError()
                  setEmail(text)
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={(text) => {
                  if (error) clearError()
                  setPassword(text)
                }}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nivel Inicial</Text>
              <View style={styles.levelsRow}>
                {LEVELS.map((level) => {
                  const isSelected = selectedLevel === level
                  return (
                    <Pressable
                      key={level}
                      disabled={isLoading}
                      accessibilityRole="button"
                      onPress={() => {
                        setSelectedLevel(level)
                      }}
                      style={({ pressed }) => [
                        styles.levelOption,
                        isSelected && styles.levelOptionSelected,
                        {
                          transform: [{ scale: pressed ? 0.95 : 1 }],
                        },
                      ]}
                    >
                      <Badge
                        label={level}
                        color={isSelected ? colors.primary : colors.textSecondary}
                        size="md"
                      />
                    </Pressable>
                  )
                })}
              </View>
            </View>

            {/* Selector de Objetivo Principal */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Objetivo de Aprendizaje</Text>
              <View style={styles.chipsRow}>
                {GOAL_OPTIONS.map((g) => {
                  const isSelected = selectedGoal === g.id
                  return (
                    <TouchableOpacity
                      key={g.id}
                      disabled={isLoading}
                      onPress={() => setSelectedGoal(g.id)}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {g.label}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            {/* Botón para expandir preguntas opcionales de personalización */}
            <TouchableOpacity
              onPress={() => setShowExtraFields(!showExtraFields)}
              style={styles.toggleExtraBtn}
            >
              <Text style={styles.toggleExtraText}>
                {showExtraFields ? '▲ Ocultar datos opcionales' : '▼ ¿Cómo nos conociste? / País (Opcional)'}
              </Text>
            </TouchableOpacity>

            {showExtraFields && (
              <View style={styles.extraContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>¿Cómo te enteraste de nosotros?</Text>
                  <View style={styles.chipsRow}>
                    {REFERRAL_OPTIONS.map((r) => {
                      const isSelected = selectedReferral === r.id
                      return (
                        <TouchableOpacity
                          key={r.id}
                          disabled={isLoading}
                          onPress={() => setSelectedReferral(isSelected ? '' : r.id)}
                          style={[styles.chip, isSelected && styles.chipSelected]}
                        >
                          <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                            {r.label}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>País</Text>
                  <View style={styles.chipsRow}>
                    {COUNTRY_OPTIONS.map((c) => {
                      const isSelected = selectedCountry === c.id
                      return (
                        <TouchableOpacity
                          key={c.id}
                          disabled={isLoading}
                          onPress={() => setSelectedCountry(isSelected ? '' : c.id)}
                          style={[styles.chip, isSelected && styles.chipSelected]}
                        >
                          <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                            {c.label}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </View>
              </View>
            )}

            <Button
              title="Registrarme"
              onPress={() => {
                void handleRegister()
              }}
              size="lg"
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitBtn}
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity
                disabled={isLoading}
                onPress={() => {
                  clearError()
                  router.push('/(auth)/login')
                }}
              >
                <Text style={styles.switchLink}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  errorBanner: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.xs,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
  },
  levelsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  levelOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  levelOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.backgroundSubtle,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  chipTextSelected: {
    color: colors.textInverse,
    fontWeight: typography.weights.semibold,
  },
  toggleExtraBtn: {
    paddingVertical: spacing.xs,
    marginVertical: spacing.xs,
    alignItems: 'center',
  },
  toggleExtraText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  extraContainer: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: spacing.xs,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  switchText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
  switchLink: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
})
