import AsyncStorage from '@react-native-async-storage/async-storage'
import { isSupabaseConfigured, supabase } from './supabase'
import { clearLocalUserData } from './db/sqlite'
import { useAuthStore } from '../stores/useAuthStore'
import { useSRSStore } from '../stores/useSRSStore'
import { useProgressStore, DEFAULT_METRICS } from '../stores/useProgressStore'
import { useSyncStore } from '../stores/useSyncStore'

export interface DeleteAccountResult {
  success: boolean
  error?: string
}

/**
 * Flujo completo de eliminación de cuenta y purga de datos locales y remotos
 * (Cumplimiento de Apple App Store Guideline 5.1.1(v) y Google Play Data Safety).
 */
export async function deleteAccountAndCleanup(): Promise<DeleteAccountResult> {
  const authState = useAuthStore.getState()
  const userId = authState.user?.id

  try {
    // 1. Si Supabase está configurado y hay sesión activa, eliminar en el servidor
    if (isSupabaseConfigured && supabase && authState.session) {
      let serverDeleted = false

      // Intentar primero mediante RPC nativo de base de datos
      try {
        const { error: rpcError } = await supabase.rpc('delete_user_account')
        if (!rpcError) {
          serverDeleted = true
        }
      } catch {
        // RPC no instalado o error de red, intentar Edge Function
      }

      // Si el RPC no procesó la solicitud, intentar mediante la Edge Function
      if (!serverDeleted) {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        const accessToken = session?.access_token ?? authState.session.access_token

        if (accessToken) {
          const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? ''
          const response = await fetch(`${supabaseUrl}/functions/v1/delete-account`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          })

          if (!response.ok) {
            const result = (await response.json().catch(() => ({}))) as { error?: string }
            const errorMsg =
              result?.error ??
              'No se pudo procesar la eliminación en el servidor. Verifica tu conexión o contacta a soporte.'
            throw new Error(errorMsg)
          }
        }
      }
    }

    // 2. Limpieza de base de datos local SQLite y caché del usuario
    if (userId) {
      await clearLocalUserData(userId)
    }

    // 3. Limpieza de almacenamiento persistente en AsyncStorage
    await AsyncStorage.clear()

    // 4. Resetear stores de Zustand a su estado inicial
    useSRSStore.setState({
      cards: [],
      sessionQueue: [],
      currentIndex: 0,
      currentSessionId: null,
      lastReviewedCardIds: [],
      sessionStats: { cardsReviewed: 0, cardsCorrect: 0, qualityHistory: [], frictionCount: 0 },
      isSessionActive: false,
      isCompleted: false,
      isLoading: false,
      error: null,
    })

    useProgressStore.setState({
      metrics: DEFAULT_METRICS,
      isLoading: false,
      error: null,
    })

    useSyncStore.setState({
      isSyncing: false,
      lastSyncedAt: null,
      pendingCardsCount: 0,
      pendingEventsCount: 0,
      lastSyncError: null,
    })

    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      isLoading: false,
      isInitialized: true,
      error: null,
    })

    return { success: true }
  } catch (error) {
    console.error('Error en deleteAccountAndCleanup:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al eliminar la cuenta',
    }
  }
}
