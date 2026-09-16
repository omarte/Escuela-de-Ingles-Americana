import {
  createClient,
  type AuthChangeEvent,
  type AuthError,
  type AuthResponse,
  type AuthTokenResponsePassword,
  type Session,
  type Subscription,
  type SupabaseClient,
  type User,
} from '@supabase/supabase-js'
import type { Database } from './generated/database'
import type { CEFRLevel, ReviewEvent, SRSCard, UserProfile } from '@elp/types'

export type { Database } from './generated/database'
export type {
  AuthChangeEvent,
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
  Subscription,
  SupabaseClient,
  User,
}

export interface StorageAdapter {
  getItem: (key: string) => Promise<string | null> | string | null
  setItem: (key: string, value: string) => Promise<void> | void
  removeItem: (key: string) => Promise<void> | void
}

export interface SupabaseClientConfig {
  storage?: StorageAdapter
  persistSession?: boolean
  autoRefreshToken?: boolean
  detectSessionInUrl?: boolean
}

/**
 * Creates a typed Supabase client with optional custom storage adapter.
 *
 * @param supabaseUrl - Supabase project URL
 * @param supabaseAnonKey - Supabase anon/public key
 * @param config - Optional configuration for storage, session persistence, etc.
 */
export function createSupabaseClient(
  supabaseUrl: string,
  supabaseAnonKey: string,
  config?: SupabaseClientConfig,
): SupabaseClient<Database> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase credentials. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
    )
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: config?.storage,
      autoRefreshToken: config?.autoRefreshToken ?? true,
      persistSession: config?.persistSession ?? true,
      detectSessionInUrl: config?.detectSessionInUrl ?? false,
    },
  })
}

// ─── High-Level Auth Helpers ──────────────────────────────────────────────────

export interface SignUpParams {
  email: string
  password: string
  displayName: string
  initialLevel?: CEFRLevel | undefined
  referralSource?: string | undefined
  countryCode?: string | undefined
  timezoneOffset?: number | undefined
  learningGoal?: string | undefined
  professionalSector?: string | undefined
}

export interface SignInParams {
  email: string
  password: string
}

export async function signUpWithEmail(
  client: SupabaseClient<Database>,
  params: SignUpParams,
): Promise<AuthResponse> {
  return await client.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        display_name: params.displayName,
        current_level: params.initialLevel ?? 'A1',
        ...(params.referralSource ? { referral_source: params.referralSource } : {}),
        ...(params.countryCode ? { country_code: params.countryCode } : {}),
        ...(params.timezoneOffset !== undefined ? { timezone_offset: params.timezoneOffset } : {}),
        ...(params.learningGoal ? { learning_goal: params.learningGoal } : {}),
        ...(params.professionalSector ? { professional_sector: params.professionalSector } : {}),
      },
    },
  })
}

export async function signInWithEmail(
  client: SupabaseClient<Database>,
  params: SignInParams,
): Promise<AuthTokenResponsePassword> {
  return await client.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  })
}

export async function signOutUser(
  client: SupabaseClient<Database>,
): Promise<{ error: AuthError | null }> {
  return await client.auth.signOut()
}

export async function getCurrentSession(
  client: SupabaseClient<Database>,
): Promise<{ data: { session: Session | null }; error: AuthError | null }> {
  return await client.auth.getSession()
}

export async function getUserProfile(
  client: SupabaseClient<Database>,
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await client.from('profiles').select('*').eq('id', userId).single()

  if (error) {
    return null
  }

  return profileRowToUserProfile(data)
}

export async function updateUserProfile(
  client: SupabaseClient<Database>,
  userId: string,
  updates: {
    displayName?: string | undefined
    currentLevel?: CEFRLevel | undefined
    currentWeek?: number | undefined
    streakDays?: number | undefined
  },
): Promise<{ data: UserProfile | null; error: Error | null }> {
  const updatePayload: Database['public']['Tables']['profiles']['Update'] = {}
  if (updates.displayName !== undefined) updatePayload.display_name = updates.displayName
  if (updates.currentLevel !== undefined) updatePayload.current_level = updates.currentLevel
  if (updates.currentWeek !== undefined) updatePayload.current_week = updates.currentWeek
  if (updates.streakDays !== undefined) updatePayload.streak_days = updates.streakDays
  updatePayload.updated_at = new Date().toISOString()

  const { data, error } = await client
    .from('profiles')
    .update(updatePayload)
    .eq('id', userId)
    .select('*')
    .single()

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  return { data: profileRowToUserProfile(data), error: null }
}

export function subscribeToAuthChanges(
  client: SupabaseClient<Database>,
  callback: (event: AuthChangeEvent, session: Session | null) => void,
): { data: { subscription: Subscription } } {
  return client.auth.onAuthStateChange(callback)
}

// ─── SRS Persistence Helpers ──────────────────────────────────────────────────

export function userCardRowToSRSCard(row: UserCardRow): SRSCard {
  return {
    id: row.id,
    userId: row.user_id,
    vocabularyItemId: row.vocabulary_item_id,
    state: row.state,
    interval: row.interval,
    easeFactor: row.ease_factor,
    reps: row.reps,
    lapses: row.lapses,
    dueDate: row.due_date,
    lastReviewed: row.last_reviewed,
  }
}

export async function getUserCards(
  client: SupabaseClient<Database>,
  userId: string,
): Promise<SRSCard[]> {
  const { data, error } = await client.from('user_cards').select('*').eq('user_id', userId)

  if (error) {
    return []
  }

  return data.map(userCardRowToSRSCard)
}

export async function upsertUserCard(
  client: SupabaseClient<Database>,
  card: SRSCard,
): Promise<{ error: Error | null }> {
  const { error } = await client.from('user_cards').upsert({
    id: card.id,
    user_id: card.userId,
    vocabulary_item_id: card.vocabularyItemId,
    state: card.state,
    interval: card.interval,
    ease_factor: card.easeFactor,
    reps: card.reps,
    lapses: card.lapses,
    due_date: card.dueDate,
    last_reviewed: card.lastReviewed,
  })

  return { error }
}

export async function logReviewEvent(
  client: SupabaseClient<Database>,
  event: ReviewEvent,
): Promise<{ error: Error | null }> {
  const { error } = await client.from('review_events').insert({
    id: event.id,
    user_id: event.userId,
    card_id: event.cardId,
    vocabulary_item_id: event.vocabularyItemId,
    quality: event.quality,
    reviewed_at: event.reviewedAt,
    previous_state: event.previousState,
    next_state: event.nextState,
    previous_interval: event.previousInterval,
    next_interval: event.nextInterval,
  })

  return { error }
}

export async function startStudySession(
  client: SupabaseClient<Database>,
  params: { userId: string; level: CEFRLevel },
): Promise<{ id: string | null; error: Error | null }> {
  const response = await client
    .from('study_sessions')
    .insert({
      user_id: params.userId,
      level: params.level,
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (response.error) {
    return { id: null, error: response.error }
  }

  return { id: response.data.id, error: null }
}

export async function finishStudySession(
  client: SupabaseClient<Database>,
  sessionId: string,
  stats: { cardsReviewed: number; cardsCorrect: number },
): Promise<{ error: Error | null }> {
  const { error } = await client
    .from('study_sessions')
    .update({
      ended_at: new Date().toISOString(),
      cards_reviewed: stats.cardsReviewed,
      cards_correct: stats.cardsCorrect,
    })
    .eq('id', sessionId)

  return { error }
}

// ─── Typed row helpers ────────────────────────────────────────────────────────

export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export function profileRowToUserProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    displayName: row.display_name,
    currentLevel: row.current_level,
    currentWeek: row.current_week,
    streakDays: row.streak_days,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    referralSource: row.referral_source ?? null,
    countryCode: row.country_code ?? null,
    timezoneOffset: row.timezone_offset ?? null,
    learningGoal: row.learning_goal ?? null,
    professionalSector: row.professional_sector ?? null,
    emailDomain: row.email_domain ?? null,
  }
}

export type UserCardRow = Database['public']['Tables']['user_cards']['Row']
export type UserCardInsert = Database['public']['Tables']['user_cards']['Insert']
export type UserCardUpdate = Database['public']['Tables']['user_cards']['Update']

export type ReviewEventRow = Database['public']['Tables']['review_events']['Row']
export type ReviewEventInsert = Database['public']['Tables']['review_events']['Insert']

export type StudySessionRow = Database['public']['Tables']['study_sessions']['Row']
export type StudySessionInsert = Database['public']['Tables']['study_sessions']['Insert']
export type StudySessionUpdate = Database['public']['Tables']['study_sessions']['Update']

export * from './sync'
