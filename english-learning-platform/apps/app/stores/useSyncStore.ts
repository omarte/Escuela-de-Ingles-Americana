import { create } from 'zustand'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { getPendingSyncCount, getSyncMetadata } from '../lib/db/sqlite'
import { syncUserData, type SyncResult } from '../lib/db/syncEngine'

export interface SyncState {
  isOnline: boolean
  isSyncing: boolean
  lastSyncedAt: string | null
  pendingCardsCount: number
  pendingEventsCount: number
  lastSyncError: string | null

  checkPendingCount: (userId: string) => Promise<void>
  triggerSync: (userId: string) => Promise<SyncResult>
  setOnlineStatus: (status: boolean) => void
  loadInitialStatus: (userId: string) => Promise<void>
}

export const useSyncStore = create<SyncState>()((set, get) => ({
  isOnline: isSupabaseConfigured,
  isSyncing: false,
  lastSyncedAt: null,
  pendingCardsCount: 0,
  pendingEventsCount: 0,
  lastSyncError: null,

  setOnlineStatus: (status: boolean): void => {
    set({ isOnline: status })
  },

  checkPendingCount: async (userId: string): Promise<void> => {
    try {
      const counts = await getPendingSyncCount(userId)
      set({
        pendingCardsCount: counts.dirtyCards,
        pendingEventsCount: counts.pendingEvents,
      })
    } catch {
      // Ignore count check failure
    }
  },

  loadInitialStatus: async (userId: string): Promise<void> => {
    try {
      const lastSync = await getSyncMetadata(`last_synced_at_${userId}`)
      const counts = await getPendingSyncCount(userId)
      set({
        lastSyncedAt: lastSync,
        pendingCardsCount: counts.dirtyCards,
        pendingEventsCount: counts.pendingEvents,
      })
    } catch {
      // ignore
    }
  },

  triggerSync: async (userId: string): Promise<SyncResult> => {
    if (get().isSyncing) {
      return {
        success: false,
        pushedEvents: 0,
        pushedCards: 0,
        pulledCards: 0,
        timestamp: new Date().toISOString(),
        error: 'Sincronización ya en curso',
      }
    }

    set({ isSyncing: true, lastSyncError: null })

    const result = await syncUserData(userId, supabase)

    if (result.success) {
      const counts = await getPendingSyncCount(userId)
      set({
        isSyncing: false,
        lastSyncedAt: result.timestamp,
        pendingCardsCount: counts.dirtyCards,
        pendingEventsCount: counts.pendingEvents,
        lastSyncError: null,
      })
    } else {
      set({
        isSyncing: false,
        lastSyncError: result.error ?? 'Fallo de sincronización',
      })
    }

    return result
  },
}))
