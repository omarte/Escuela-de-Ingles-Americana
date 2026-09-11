import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  createSupabaseClient,
  type Database,
  type StorageAdapter,
  type SupabaseClient,
} from '@elp/database'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ''

/**
 * Indicates whether valid remote Supabase credentials are configured in environment variables.
 */
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('http'),
)

const asyncStorageAdapter: StorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch {
      // Ignore storage write failures in restricted environments
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key)
    } catch {
      // Ignore storage removal failures
    }
  },
}

/**
 * Singleton Supabase client.
 * Returns null if remote Supabase credentials are not provided.
 */
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      storage: asyncStorageAdapter,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    })
  : null
