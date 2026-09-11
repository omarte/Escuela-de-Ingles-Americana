import { describe, it, expect, vi } from 'vitest'
import {
  createSupabaseClient,
  profileRowToUserProfile,
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  getCurrentSession,
  getUserProfile,
  updateUserProfile,
  subscribeToAuthChanges,
  type ProfileRow,
  type StorageAdapter,
  type SupabaseClient,
  type Database,
} from '../src/index'

describe('@elp/database Auth & Profiles', () => {
  describe('createSupabaseClient', () => {
    it('throws when URL is missing', () => {
      expect(() => createSupabaseClient('', 'anon-key')).toThrow('Missing Supabase credentials')
    })

    it('throws when anonKey is missing', () => {
      expect(() => createSupabaseClient('https://example.supabase.co', '')).toThrow(
        'Missing Supabase credentials',
      )
    })

    it('creates client with custom storage adapter', () => {
      const mockStorage: StorageAdapter = {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      }

      const client = createSupabaseClient('https://mock.supabase.co', 'mock-key', {
        storage: mockStorage,
        persistSession: true,
      })

      expect(client).toBeDefined()
      expect(client.auth).toBeDefined()
    })
  })

  describe('profileRowToUserProfile', () => {
    it('maps snake_case database row to camelCase domain UserProfile', () => {
      const row: ProfileRow = {
        id: 'usr_123',
        display_name: 'Carlos Mendoza',
        current_level: 'A2',
        current_week: 3,
        streak_days: 7,
        created_at: '2026-09-01T10:00:00Z',
        updated_at: '2026-09-10T12:00:00Z',
      }

      const profile = profileRowToUserProfile(row)

      expect(profile).toEqual({
        id: 'usr_123',
        displayName: 'Carlos Mendoza',
        currentLevel: 'A2',
        currentWeek: 3,
        streakDays: 7,
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-09-10T12:00:00Z',
      })
    })
  })

  describe('Auth helper methods', () => {
    it('signUpWithEmail passes metadata correctly', async () => {
      const mockSignUp = vi.fn().mockResolvedValue({
        data: { user: { id: 'u1' }, session: null },
        error: null,
      })
      const mockClient = {
        auth: {
          signUp: mockSignUp,
        },
      } as unknown as SupabaseClient<Database>

      await signUpWithEmail(mockClient, {
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Ana Lopez',
        initialLevel: 'B1',
      })

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            display_name: 'Ana Lopez',
            current_level: 'B1',
          },
        },
      })
    })

    it('signInWithEmail passes credentials to signInWithPassword', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({
        data: { user: { id: 'u1' }, session: {} },
        error: null,
      })
      const mockClient = {
        auth: {
          signInWithPassword: mockSignIn,
        },
      } as unknown as SupabaseClient<Database>

      await signInWithEmail(mockClient, {
        email: 'test@example.com',
        password: 'securePassword!',
      })

      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'securePassword!',
      })
    })

    it('signOutUser triggers auth.signOut', async () => {
      const mockSignOut = vi.fn().mockResolvedValue({ error: null })
      const mockClient = {
        auth: {
          signOut: mockSignOut,
        },
      } as unknown as SupabaseClient<Database>

      await signOutUser(mockClient)
      expect(mockSignOut).toHaveBeenCalled()
    })

    it('getCurrentSession triggers auth.getSession', async () => {
      const mockGetSession = vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      })
      const mockClient = {
        auth: {
          getSession: mockGetSession,
        },
      } as unknown as SupabaseClient<Database>

      await getCurrentSession(mockClient)
      expect(mockGetSession).toHaveBeenCalled()
    })

    it('getUserProfile returns mapped profile when query succeeds', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'u99',
          display_name: 'David Ortiz',
          current_level: 'A1',
          current_week: 1,
          streak_days: 0,
          created_at: '2026-09-01T00:00:00Z',
          updated_at: '2026-09-01T00:00:00Z',
        },
        error: null,
      })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      const mockClient = {
        from: mockFrom,
      } as unknown as SupabaseClient<Database>

      const profile = await getUserProfile(mockClient, 'u99')

      expect(mockFrom).toHaveBeenCalledWith('profiles')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', 'u99')
      expect(profile).toEqual({
        id: 'u99',
        displayName: 'David Ortiz',
        currentLevel: 'A1',
        currentWeek: 1,
        streakDays: 0,
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-01T00:00:00Z',
      })
    })

    it('getUserProfile returns null when query encounters an error', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Row not found' },
      })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })

      const mockClient = {
        from: mockFrom,
      } as unknown as SupabaseClient<Database>

      const profile = await getUserProfile(mockClient, 'non-existent')
      expect(profile).toBeNull()
    })

    it('subscribeToAuthChanges connects listener callback', () => {
      const mockSubscription = { unsubscribe: vi.fn() }
      const mockOnAuthStateChange = vi.fn().mockReturnValue({
        data: { subscription: mockSubscription },
      })
      const mockClient = {
        auth: {
          onAuthStateChange: mockOnAuthStateChange,
        },
      } as unknown as SupabaseClient<Database>

      const callback = vi.fn()
      const result = subscribeToAuthChanges(mockClient, callback)

      expect(mockOnAuthStateChange).toHaveBeenCalledWith(callback)
      expect(result.data.subscription).toBe(mockSubscription)
    })

    it('updateUserProfile successfully updates user profile attributes', async () => {
      const updatedRow = {
        id: 'u99',
        display_name: 'David Ortiz Updated',
        current_level: 'A2',
        current_week: 2,
        streak_days: 5,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-10T12:00:00Z',
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: updatedRow,
        error: null,
      })
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate })

      const mockClient = {
        from: mockFrom,
      } as unknown as SupabaseClient<Database>

      const { data, error } = await updateUserProfile(mockClient, 'u99', {
        displayName: 'David Ortiz Updated',
        currentLevel: 'A2',
        currentWeek: 2,
        streakDays: 5,
      })

      expect(error).toBeNull()
      expect(data?.displayName).toBe('David Ortiz Updated')
      expect(data?.currentLevel).toBe('A2')
      expect(data?.streakDays).toBe(5)
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          display_name: 'David Ortiz Updated',
          current_level: 'A2',
          current_week: 2,
          streak_days: 5,
        }),
      )
    })

    it('updateUserProfile returns error when update fails', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' },
      })
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate })

      const mockClient = {
        from: mockFrom,
      } as unknown as SupabaseClient<Database>

      const { data, error } = await updateUserProfile(mockClient, 'u99', {
        streakDays: 10,
      })

      expect(data).toBeNull()
      expect(error?.message).toBe('Database connection failed')
    })
  })
})
