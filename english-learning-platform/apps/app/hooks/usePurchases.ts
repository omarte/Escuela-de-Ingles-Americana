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

interface PurchasesState {
  isLoading: boolean
  isPro: boolean
  customerInfo: CustomerInfo | null
  currentOffering: PurchasesOffering | null
  error: string | null
}

const IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? ''
const ANDROID_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? ''

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
    Purchases.setLogLevel(LOG_LEVEL.DEBUG)
  }

  await Purchases.configure({ apiKey, appUserID: existingUserId })
}

function hasProEntitlement(customerInfo: CustomerInfo | null): boolean {
  return customerInfo?.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined
}

export function usePurchases() {
  const [state, setState] = useState<PurchasesState>({
    isLoading: true,
    isPro: false,
    customerInfo: null,
    currentOffering: null,
    error: null,
  })

  const refresh = useCallback(async () => {
    try {
      const [customerInfo, offerings] = await Promise.all([
        Purchases.getCustomerInfo(),
        Purchases.getOfferings(),
      ]);
      setState({
        isLoading: false,
        isPro: hasProEntitlement(customerInfo),
        customerInfo,
        currentOffering: offerings.current ?? null,
        error: null,
      })
    } catch (err) {
      // Si falla la red, mantenemos el último CustomerInfo cacheado por el SDK
      // en vez de asumir que el usuario perdió su Pro — RevenueCat cachea
      // localmente, así que esto solo debería fallar en el primer arranque
      // sin conexión NUNCA antes exitoso.
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Error desconocido al consultar compras',
      }))
    }
  }, [])

  useEffect(() => {
    void refresh()

    const listener = (customerInfo: CustomerInfo) => {
      setState((prev) => ({ ...prev, customerInfo, isPro: hasProEntitlement(customerInfo) }))
    }
    Purchases.addCustomerInfoUpdateListener(listener)
    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener)
    }
  }, [refresh])

  const purchase = useCallback(async (pkg: PurchasesPackage) => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg)
      setState((prev) => ({ ...prev, customerInfo, isPro: hasProEntitlement(customerInfo) }))
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
      setState((prev) => ({ ...prev, customerInfo, isPro: hasProEntitlement(customerInfo) }))
      return { success: true as const, isPro: hasProEntitlement(customerInfo) }
    } catch (err) {
      return { success: false as const, error: err instanceof Error ? err.message : 'No se pudo restaurar' }
    }
  }, [])

  return { ...state, refresh, purchase, restore }
}
