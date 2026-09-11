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

export default function RegisterScreen(): React.JSX.Element {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1')

  const register = useAuthStore((state) => state.register)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)

  const handleRegister = async (): Promise<void> => {
    clearError()
    const success = await register({
      displayName,
      email,
      password,
      initialLevel: selectedLevel,
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
