import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  getUserProfile,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
  subscribeToAuthChanges,
  updateUserProfile,
  type Session,
  type User,
} from '@elp/database'
import type { CEFRLevel, UserProfile } from '@elp/types'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const DEMO_STORAGE_KEY = '@elp/auth_session_demo'

export interface RegisterParams {
  email: string
  password: string
  displayName: string
  initialLevel?: CEFRLevel | undefined
}

export interface AuthState {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null

  initSession: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  register: (params: RegisterParams) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  clearError: () => void
}

function createFallbackProfile(
  userId: string,
  email: string,
  displayName: string,
  level: CEFRLevel = 'A1',
): UserProfile {
  return {
    id: userId,
    displayName: displayName || email.split('@')[0] || 'Estudiante',
    currentLevel: level,
    currentWeek: 1,
    streakDays: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  profile: null,
  session: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  clearError: (): void => {
    set({ error: null })
  },

  initSession: async (): Promise<void> => {
    // Avoid double initialization
    if (get().isInitialized) return

    set({ isLoading: true })

    try {
      const client = supabase
      if (isSupabaseConfigured && client) {
        const {
          data: { session },
        } = await client.auth.getSession()

        if (session?.user) {
          const profile = await getUserProfile(client, session.user.id)
          const fallback = createFallbackProfile(
            session.user.id,
            session.user.email ?? '',
            (session.user.user_metadata.display_name as string) ?? '',
            (session.user.user_metadata.current_level as CEFRLevel) ?? 'A1',
          )

          set({
            session,
            user: session.user,
            profile: profile ?? fallback,
            isLoading: false,
            isInitialized: true,
          })
        } else {
          set({
            session: null,
            user: null,
            profile: null,
            isLoading: false,
            isInitialized: true,
          })
        }

        // Listen to live auth changes from Supabase
        subscribeToAuthChanges(client, (_event, updatedSession) => {
          if (updatedSession?.user) {
            void getUserProfile(client, updatedSession.user.id).then((liveProfile) => {
              const fallback = createFallbackProfile(
                updatedSession.user.id,
                updatedSession.user.email ?? '',
                (updatedSession.user.user_metadata.display_name as string) ?? '',
                (updatedSession.user.user_metadata.current_level as CEFRLevel) ?? 'A1',
              )
              set({
                session: updatedSession,
                user: updatedSession.user,
                profile: liveProfile ?? fallback,
              })
            })
          } else {
            set({ session: null, user: null, profile: null })
          }
        })
      } else {
        // Fallback / Offline Demo Mode with AsyncStorage persistence
        const rawDemoData = await AsyncStorage.getItem(DEMO_STORAGE_KEY)
        if (rawDemoData) {
          try {
            const parsed = JSON.parse(rawDemoData) as {
              user: User
              profile: UserProfile
              session: Session
            }
            set({
              user: parsed.user,
              profile: parsed.profile,
              session: parsed.session,
              isLoading: false,
              isInitialized: true,
            })
            return
          } catch {
            await AsyncStorage.removeItem(DEMO_STORAGE_KEY)
          }
        }

        set({
          user: null,
          profile: null,
          session: null,
          isLoading: false,
          isInitialized: true,
        })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al inicializar sesión'
      set({ error: message, isLoading: false, isInitialized: true })
    }
  },

  login: async (email: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null })

    if (!email.trim() || !password.trim()) {
      set({ error: 'Por favor ingresa tu correo y contraseña.', isLoading: false })
      return false
    }

    try {
      const client = supabase
      if (isSupabaseConfigured && client) {
        const { data, error } = await signInWithEmail(client, {
          email: email.trim(),
          password,
        })

        if (error || !data.user || !data.session) {
          set({
            error: error?.message ?? 'Credenciales inválidas.',
            isLoading: false,
          })
          return false
        }

        const profile = await getUserProfile(client, data.user.id)
        const fallback = createFallbackProfile(
          data.user.id,
          data.user.email ?? email,
          (data.user.user_metadata.display_name as string) ?? '',
          (data.user.user_metadata.current_level as CEFRLevel) ?? 'A1',
        )

        set({
          user: data.user,
          session: data.session,
          profile: profile ?? fallback,
          isLoading: false,
          error: null,
        })
        return true
      }

      // Offline Demo Mode Login
      const demoId = 'demo-user-' + email.trim().replace(/[^a-zA-Z0-9]/g, '_')
      const demoProfile: UserProfile = {
        id: demoId,
        displayName: email.split('@')[0] || 'Estudiante',
        currentLevel: 'A1',
        currentWeek: 1,
        streakDays: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const demoUser = {
        id: demoId,
        app_metadata: {},
        user_metadata: { display_name: demoProfile.displayName },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: email.trim(),
      } as unknown as User

      const demoSession = {
        access_token: 'demo-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'demo-refresh-token',
        user: demoUser,
      } as unknown as Session

      await AsyncStorage.setItem(
        DEMO_STORAGE_KEY,
        JSON.stringify({ user: demoUser, profile: demoProfile, session: demoSession }),
      )

      set({
        user: demoUser,
        profile: demoProfile,
        session: demoSession,
        isLoading: false,
        error: null,
      })
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error inesperado al iniciar sesión'
      set({ error: message, isLoading: false })
      return false
    }
  },

  register: async (params: RegisterParams): Promise<boolean> => {
    set({ isLoading: true, error: null })

    if (!params.displayName.trim()) {
      set({ error: 'Por favor ingresa tu nombre de usuario.', isLoading: false })
      return false
    }

    if (!params.email.trim() || !params.password.trim()) {
      set({ error: 'Por favor completa todos los campos requeridos.', isLoading: false })
      return false
    }

    if (params.password.length < 6) {
      set({ error: 'La contraseña debe tener al menos 6 caracteres.', isLoading: false })
      return false
    }

    try {
      const client = supabase
      if (isSupabaseConfigured && client) {
        const { data, error } = await signUpWithEmail(client, {
          email: params.email.trim(),
          password: params.password,
          displayName: params.displayName.trim(),
          initialLevel: params.initialLevel ?? 'A1',
        })

        if (error || !data.user) {
          set({
            error: error?.message ?? 'No se pudo crear la cuenta.',
            isLoading: false,
          })
          return false
        }

        // If email confirmation is disabled or automatic session is issued:
        let profile = await getUserProfile(client, data.user.id)
        if (!profile) {
          profile = createFallbackProfile(
            data.user.id,
            params.email,
            params.displayName,
            params.initialLevel ?? 'A1',
          )
        }

        set({
          user: data.user,
          session: data.session,
          profile,
          isLoading: false,
          error: null,
        })
        return true
      }

      // Offline Demo Mode Register
      const demoId = 'demo-user-' + params.email.trim().replace(/[^a-zA-Z0-9]/g, '_')
      const demoProfile: UserProfile = {
        id: demoId,
        displayName: params.displayName.trim(),
        currentLevel: params.initialLevel ?? 'A1',
        currentWeek: 1,
        streakDays: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const demoUser = {
        id: demoId,
        app_metadata: {},
        user_metadata: {
          display_name: demoProfile.displayName,
          current_level: demoProfile.currentLevel,
        },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: params.email.trim(),
      } as unknown as User

      const demoSession = {
        access_token: 'demo-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'demo-refresh-token',
        user: demoUser,
      } as unknown as Session

      await AsyncStorage.setItem(
        DEMO_STORAGE_KEY,
        JSON.stringify({ user: demoUser, profile: demoProfile, session: demoSession }),
      )

      set({
        user: demoUser,
        profile: demoProfile,
        session: demoSession,
        isLoading: false,
        error: null,
      })
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error inesperado al registrar cuenta'
      set({ error: message, isLoading: false })
      return false
    }
  },

  logout: async (): Promise<void> => {
    set({ isLoading: true })
    try {
      const client = supabase
      if (isSupabaseConfigured && client) {
        await signOutUser(client)
      }
      await AsyncStorage.removeItem(DEMO_STORAGE_KEY)
    } finally {
      set({
        user: null,
        profile: null,
        session: null,
        isLoading: false,
        error: null,
      })
    }
  },

  updateProfile: async (updates: Partial<UserProfile>): Promise<void> => {
    const currentProfile = get().profile
    if (!currentProfile) return

    const updated: UserProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    set({ profile: updated })

    // If Supabase is configured and client exists, persist to cloud
    const client = supabase
    if (isSupabaseConfigured && client && get().user) {
      try {
        await updateUserProfile(client, currentProfile.id, {
          displayName: updates.displayName,
          currentLevel: updates.currentLevel,
          currentWeek: updates.currentWeek,
          streakDays: updates.streakDays,
        })
      } catch {
        // Silently handled in background
      }
    }

    // Also persist in demo storage if active
    try {
      const demoRaw = await AsyncStorage.getItem(DEMO_STORAGE_KEY)
      if (demoRaw) {
        const parsed = JSON.parse(demoRaw) as { user: unknown; profile: unknown; session: unknown }
        await AsyncStorage.setItem(
          DEMO_STORAGE_KEY,
          JSON.stringify({ ...parsed, profile: updated }),
        )
      }
    } catch {
      // ignore
    }
  },
}))
