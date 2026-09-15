import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import type { PurchasesPackage } from 'react-native-purchases'
import { colors, radius, spacing, typography, shadow, Card, Badge, Button } from '@elp/ui'
import { usePurchases } from '../../hooks/usePurchases'
import { AppScreenHeader } from '../../components/AppScreenHeader'

export default function PaywallScreen(): React.JSX.Element {
  const router = useRouter()
  const { isLoading, currentOffering, purchase, restore } = usePurchases()
  const [busyPackageId, setBusyPackageId] = useState<string | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setBusyPackageId(pkg.identifier)
    const result = await purchase(pkg)
    setBusyPackageId(null)

    if (result.success) {
      Alert.alert('¡Membresía Activada!', 'Tu acceso Pro ha sido desbloqueado con éxito. ¡Bienvenido!')
      router.back()
    } else if (!result.userCancelled) {
      Alert.alert('No se pudo completar la compra', result.error ?? 'Intenta de nuevo más tarde.')
    }
  }

  const handleRestore = async () => {
    setIsRestoring(true)
    const result = await restore()
    setIsRestoring(false)

    if (result.success && result.isPro) {
      Alert.alert('¡Listo!', 'Tu acceso Pro fue restaurado con éxito.')
      router.back()
    } else if (result.success) {
      Alert.alert('Sin compras activas', 'No encontramos una suscripción Pro activa asociada a esta cuenta.')
    } else {
      Alert.alert('No se pudo restaurar', result.error ?? 'Intenta de nuevo más tarde.')
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando opciones de suscripción...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const packages = currentOffering?.availablePackages ?? []

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Screen Header */}
        <AppScreenHeader
          icon="diamond-outline"
          accentColor="#D97706"
          iconBgColor="#FEF3C7"
          eyebrow="SUSCRIPCIÓN & ACCESO COMPLETO"
          title="Membresía Pro"
          subtitle="El Nivel A1 es y seguirá siendo 100% gratuito. Con Pro desbloqueas el Nivel A2 hoy, y B1/B2 automáticamente sin pagar de nuevo."
          rightElement={<Badge label="Plan Pro" color="#D97706" size="sm" />}
        />

        {/* Benefits & Value Proposition Card */}
        <Card padding="lg" highlighted style={styles.benefitsCard}>
          <View style={styles.benefitsHeader}>
            <View style={styles.benefitsIconBox}>
              <Ionicons name="sparkles" size={20} color={colors.primary} />
            </View>
            <View style={styles.benefitsTitleCol}>
              <Text style={styles.benefitsTitle}>Todo Incluido en tu Membresía</Text>
              <Text style={styles.benefitsSubtitle}>Aceleración científica sin restricciones</Text>
            </View>
          </View>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitCheck}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              </View>
              <View style={styles.benefitTextCol}>
                <Text style={styles.benefitItemTitle}>Nivel A2 Completo Desbloqueado</Text>
                <Text style={styles.benefitItemDesc}>
                  20 semanas de vocabulario intermedio inicial y 1,000+ nuevas palabras.
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.benefitCheck}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              </View>
              <View style={styles.benefitTextCol}>
                <Text style={styles.benefitItemTitle}>Pase Vitalicio a B1 y B2</Text>
                <Text style={styles.benefitItemDesc}>
                  Acceso garantizado a las semanas avanzadas en cuanto se publiquen.
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.benefitCheck}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              </View>
              <View style={styles.benefitTextCol}>
                <Text style={styles.benefitItemTitle}>Estudio 100% Offline</Text>
                <Text style={styles.benefitItemDesc}>
                  Sin depender de conexión a internet: en viajes, metro u obra.
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.benefitCheck}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              </View>
              <View style={styles.benefitTextCol}>
                <Text style={styles.benefitItemTitle}>Certificados y Diplomas CEFR</Text>
                <Text style={styles.benefitItemDesc}>
                  Descarga tus certificados de superación de nivel avalados por la escuela.
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Packages / Available Plans */}
        {packages.length === 0 ? (
          <Card padding="lg" style={styles.emptyCard}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="storefront-outline" size={32} color={colors.secondary} />
            </View>
            <Text style={styles.emptyTitle}>Suscripciones en Verificación</Text>
            <Text style={styles.emptyText}>
              Los productos de suscripción se están sincronizando con Google Play Console.
              Mientras tanto, puedes seguir aprendiendo el Nivel A1 con acceso libre y completo.
            </Text>
          </Card>
        ) : (
          packages.map((pkg) => {
            const isBusy = busyPackageId === pkg.identifier
            return (
              <Card key={pkg.identifier} padding="lg" style={styles.packageCard}>
                <View style={styles.packageHeader}>
                  <View style={styles.packageInfo}>
                    <Text style={styles.packageTitle}>{pkg.product.title}</Text>
                    <Text style={styles.packageDesc} numberOfLines={2}>
                      {pkg.product.description || 'Acceso completo a todos los niveles A1–B2'}
                    </Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.packagePrice}>{pkg.product.priceString}</Text>
                  </View>
                </View>

                <Button
                  title={isBusy ? 'Procesando...' : 'Desbloquear Membresía Pro'}
                  variant="primary"
                  size="md"
                  disabled={busyPackageId !== null}
                  loading={isBusy}
                  onPress={() => handlePurchase(pkg)}
                  style={styles.purchaseBtn}
                />
              </Card>
            )
          })
        )}

        {/* Restore Purchases Button (Mandatory for Store Guidelines) */}
        <TouchableOpacity
          onPress={handleRestore}
          disabled={isRestoring}
          style={styles.restoreBtn}
          activeOpacity={0.7}
        >
          {isRestoring ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <View style={styles.restoreRow}>
              <Ionicons name="refresh-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.restoreText}>Restaurar compras anteriores</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Legal Disclaimer */}
        <Text style={styles.legalNotice}>
          La suscripción se renueva automáticamente a menos que se cancele al menos 24 horas antes
          del final del período actual. Puedes administrar o cancelar tu suscripción en cualquier
          momento desde la configuración de tu cuenta de Google Play Store / App Store.
        </Text>
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
    paddingBottom: 130,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  benefitsCard: {
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  benefitsIconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: 'rgba(5, 150, 105, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitsTitleCol: {
    flex: 1,
  },
  benefitsTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  benefitsSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  benefitsList: {
    gap: spacing.sm + 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
  },
  benefitCheck: {
    marginTop: 1,
  },
  benefitTextCol: {
    flex: 1,
  },
  benefitItemTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  benefitItemDesc: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 1,
  },
  emptyCard: {
    alignItems: 'center',
    textAlign: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyIconBox: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm + 2,
  },
  emptyTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 300,
  },
  packageCard: {
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    ...shadow.sm,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  packageInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  packageTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  packageDesc: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  priceContainer: {
    backgroundColor: 'rgba(5, 150, 105, 0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.md,
  },
  packagePrice: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  purchaseBtn: {
    marginTop: spacing.xs,
  },
  restoreBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginVertical: spacing.xs,
  },
  restoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  restoreText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    textDecorationLine: 'underline',
  },
  legalNotice: {
    fontSize: typography.sizes.xs - 2,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 15,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
})
