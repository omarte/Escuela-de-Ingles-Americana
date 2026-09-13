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
import type { PurchasesPackage } from 'react-native-purchases'
import { usePurchases } from '../../hooks/usePurchases'
import { darkColors, radius, spacing } from '@elp/ui' // mismos tokens usados en LiquidTabBar

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
      Alert.alert('Listo', 'Tu acceso Pro fue restaurado.')
      router.back()
    } else if (result.success) {
      Alert.alert('Sin compras activas', 'No encontramos una suscripción Pro asociada a esta cuenta.')
    } else {
      Alert.alert('No se pudo restaurar', result.error ?? 'Intenta de nuevo más tarde.')
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={darkColors.primaryHover} />
      </View>
    )
  }

  const packages = currentOffering?.availablePackages ?? []

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Desbloquea tu progreso</Text>
      <Text style={styles.subtitle}>
        A1 es y seguirá siendo gratis. Con Pro avanzas a A2 hoy, y a B1/B2 automáticamente en cuanto
        el equipo docente los publique — sin pagar de nuevo.
      </Text>

      {packages.length === 0 && (
        <Text style={styles.emptyState}>
          No hay planes disponibles en este momento. Verifica tu conexión e inténtalo de nuevo.
        </Text>
      )}

      {packages.map((pkg) => (
        <TouchableOpacity
          key={pkg.identifier}
          style={styles.packageCard}
          disabled={busyPackageId !== null}
          onPress={() => handlePurchase(pkg)}
        >
          <View style={styles.packageInfo}>
            <Text style={styles.packageTitle}>{pkg.product.title}</Text>
            <Text style={styles.packagePrice}>{pkg.product.priceString}</Text>
          </View>
          {busyPackageId === pkg.identifier && <ActivityIndicator color={darkColors.primaryHover} />}
        </TouchableOpacity>
      ))}

      {/* Obligatorio por las guías de Apple: todo paywall debe ofrecer restaurar compras */}
      <TouchableOpacity onPress={handleRestore} disabled={isRestoring} style={styles.restoreButton}>
        {isRestoring ? (
          <ActivityIndicator color={darkColors.textMuted} />
        ) : (
          <Text style={styles.restoreText}>Restaurar compras</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.legalText}>
        La suscripción se renueva automáticamente. Puedes cancelarla cuando quieras desde los ajustes
        de tu tienda de aplicaciones.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: darkColors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: darkColors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xl * 2 },
  title: { fontSize: 26, fontWeight: '800', color: darkColors.textPrimary, marginBottom: spacing.sm },
  subtitle: { fontSize: 15, color: darkColors.textMuted, marginBottom: spacing.lg, lineHeight: 21 },
  emptyState: { color: darkColors.textMuted, textAlign: 'center', marginVertical: spacing.lg },
  packageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: darkColors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: darkColors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  packageInfo: { flex: 1 },
  packageTitle: { fontSize: 16, fontWeight: '700', color: darkColors.textPrimary },
  packagePrice: { fontSize: 14, color: darkColors.primaryHover, marginTop: 2 },
  restoreButton: { alignItems: 'center', paddingVertical: spacing.md, marginTop: spacing.sm },
  restoreText: { color: darkColors.textMuted, fontSize: 14, textDecorationLine: 'underline' },
  legalText: { fontSize: 11, color: darkColors.textMuted, textAlign: 'center', marginTop: spacing.lg, lineHeight: 16 },
})
