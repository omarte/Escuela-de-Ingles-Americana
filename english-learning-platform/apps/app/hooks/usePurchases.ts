// apps/app/hooks/usePurchases.ts
//
// IMPORTANTE: este archivo requiere el módulo nativo react-native-purchases.
// NO funciona en Expo Go — necesita un development build (EAS Build).
// No se puede probar con `vitest` porque depende de código nativo real;
// por eso la lógica de negocio (qué desbloquea qué) vive separada en
// packages/monetization/src/entitlements.ts, que sí tiene tests reales.

import { useCallback, useEffect, useState } from 'react'
import Purchases, {
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases'
import { Platform } from 'react-native'
import { PRO_ENTITLEMENT_ID } from '@elp/monetization'
import { systemsWhitelistService } from '../lib/systemsWhitelistService'
import { useAuthStore } from '../stores/useAuthStore'

interface PurchasesState {
  isLoading: boolean
  isPro: boolean
  isInstitutionalPro: boolean
  customerInfo: CustomerInfo | null
  currentOffering: PurchasesOffering | null
  error: string | null
}

const IOS_API_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ??
  process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ??
  ''
const ANDROID_API_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ??
  process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ??
  ''

/**
 * Configura el SDK una sola vez al arrancar la app, vinculando el
 * appUserID de RevenueCat al ID de usuario que YA existe en el sistema
 * de auth local (SQLite). Esto evita el problema clásico de "compré en
 * un dispositivo, reinstalé, y perdí mi Pro" que ocurre si se deja que
 * RevenueCat genere un ID anónimo desacoplado del usuario real.
 */
export async function configurePurchases(existingUserId: string): Promise<void> {
  const apiKey = Platform.select({ ios: IOS_API_KEY, android: ANDROID_API_KEY, default: '' })
  if (!apiKey) {
    throw new Error(
      'Falta la API key de RevenueCat para esta plataforma. Revisa EXPO_PUBLIC_REVENUECAT_IOS_API_KEY / _ANDROID_API_KEY.',
    )
  }

  if (__DEV__) {
    void Purchases.setLogLevel(LOG_LEVEL.DEBUG)
  }

  Purchases.configure({ apiKey, appUserID: existingUserId })
}

function hasProEntitlement(customerInfo: CustomerInfo | null): boolean {
  return customerInfo?.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined
}

export function usePurchases() {
  const userEmail = useAuthStore((state) => state.user?.email)
  const [state, setState] = useState<PurchasesState>({
    isLoading: true,
    isPro: false,
    isInstitutionalPro: false,
    customerInfo: null,
    currentOffering: null,
    error: null,
  })

  const refresh = useCallback(async () => {
    try {
      const [customerInfo, offerings, institutionalActive] = await Promise.all([
        Purchases.getCustomerInfo(),
        Purchases.getOfferings(),
        systemsWhitelistService.isInstitutionalProActive(userEmail),
      ]);
      const hasNativePro = hasProEntitlement(customerInfo)
      const isEffectivePro = hasNativePro || institutionalActive

      setState({
        isLoading: false,
        isPro: isEffectivePro,
        isInstitutionalPro: institutionalActive,
        customerInfo,
        currentOffering: offerings.current ?? null,
        error: null,
      })
    } catch (err) {
      // Si falla la red de la tienda, aún verificamos la lista blanca local institucional
      const institutionalActive = await systemsWhitelistService.isInstitutionalProActive(userEmail).catch(() => false)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isPro: prev.isPro || institutionalActive,
        isInstitutionalPro: institutionalActive,
        error: err instanceof Error ? err.message : 'Error desconocido al consultar compras',
      }))
    }
  }, [userEmail])

  useEffect(() => {
    void refresh()

    const listener = (customerInfo: CustomerInfo) => {
      setState((prev) => {
        const hasNative = hasProEntitlement(customerInfo)
        return {
          ...prev,
          customerInfo,
          isPro: hasNative || prev.isInstitutionalPro,
        }
      })
    }
    Purchases.addCustomerInfoUpdateListener(listener)

    // Listener para activaciones de lista blanca / sistemas en tiempo real
    const unsubscribeWhitelist = systemsWhitelistService.subscribe((isInstitutional) => {
      setState((prev) => ({
        ...prev,
        isInstitutionalPro: isInstitutional,
        isPro: prev.isPro || isInstitutional,
      }))
    })

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener)
      unsubscribeWhitelist()
    }
  }, [refresh])

  const purchase = useCallback(async (pkg: PurchasesPackage) => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg)
      setState((prev) => ({ ...prev, customerInfo, isPro: hasProEntitlement(customerInfo) || prev.isInstitutionalPro }))
      return { success: true as const }
    } catch (err: any) {
      if (err?.userCancelled) {
        return { success: false as const, userCancelled: true }
      }
      return { success: false as const, error: err?.message ?? 'No se pudo completar la compra' }
    }
  }, [])

  // Obligatorio para Apple: todo paywall debe ofrecer "Restaurar compras".
  const restore = useCallback(async () => {
    try {
      const customerInfo = await Purchases.restorePurchases()
      const institutionalActive = await systemsWhitelistService.isInstitutionalProActive(userEmail)
      const hasNative = hasProEntitlement(customerInfo)
      const isEffective = hasNative || institutionalActive

      setState((prev) => ({ ...prev, customerInfo, isPro: isEffective, isInstitutionalPro: institutionalActive }))
      return { success: true as const, isPro: isEffective }
    } catch (err) {
      return { success: false as const, error: err instanceof Error ? err.message : 'No se pudo restaurar' }
    }
  }, [userEmail])

  return { ...state, refresh, purchase, restore }
}

