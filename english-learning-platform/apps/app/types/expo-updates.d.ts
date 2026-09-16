declare module 'expo-updates' {
  export const isEnabled: boolean
  export const channel: string | null
  export const runtimeVersion: string | null
  export const updateId: string | null
  export const createdAt: Date | null
  export const isEmbeddedLaunch: boolean
  export const isEmergencyLaunch: boolean
  export const checkAutomatically: string

  export interface UpdateCheckResult {
    isAvailable: boolean
    manifest?: Record<string, unknown>
  }

  export interface UpdateFetchResult {
    isNew: boolean
    manifest?: Record<string, unknown>
  }

  export function checkForUpdateAsync(): Promise<UpdateCheckResult>
  export function fetchUpdateAsync(): Promise<UpdateFetchResult>
  export function reloadAsync(): Promise<void>
}
