import * as Updates from 'expo-updates'

export interface UpdateCheckResult {
  isAvailable: boolean
  manifest?: Record<string, unknown> | null
  error?: string | null
  isDevelopmentEnvironment: boolean
}

/**
 * Service to safely check and apply Over-The-Air (OTA) updates.
 * In development / web / Expo Go, it degrades gracefully without crashing.
 */
export const updatesService = {
  /**
   * Check whether OTA updates are supported in the current runtime.
   */
  isSupported(): boolean {
    return Updates.isEnabled
  },

  /**
   * Get the current update release channel or runtime info.
   */
  getRuntimeInfo() {
    return {
      isEnabled: Updates.isEnabled,
      channel: Updates.channel ?? 'local',
      runtimeVersion: Updates.runtimeVersion ?? '0.1.0',
      updateId: Updates.updateId ?? 'initial',
      createdAt: Updates.createdAt ? new Date(Updates.createdAt).toLocaleString() : null,
    }
  },

  /**
   * Check if a new version/content update is available on EAS.
   */
  async checkForUpdates(): Promise<UpdateCheckResult> {
    if (!Updates.isEnabled) {
      return {
        isAvailable: false,
        isDevelopmentEnvironment: true,
      }
    }

    try {
      const update = await Updates.checkForUpdateAsync()
      return {
        isAvailable: update.isAvailable,
        manifest: (update.manifest as Record<string, unknown>) ?? null,
        isDevelopmentEnvironment: false,
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al verificar actualizaciones'
      return {
        isAvailable: false,
        error: msg,
        isDevelopmentEnvironment: false,
      }
    }
  },

  /**
   * Download and restart the app with the new bundle.
   */
  async fetchAndReload(): Promise<{ success: boolean; error?: string }> {
    if (!Updates.isEnabled) {
      return { success: false, error: 'Actualizaciones no disponibles en este entorno' }
    }

    try {
      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()
      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al descargar la actualización'
      return { success: false, error: msg }
    }
  },
}
