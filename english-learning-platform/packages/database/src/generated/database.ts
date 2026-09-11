/**
 * ─────────────────────────────────────────────────────────────────────────────
 * GENERATED DATABASE TYPES — PLACEHOLDER
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * This file will be REPLACED by types generated from the Supabase schema.
 *
 * HOW TO REGENERATE:
 *   Option A — Local Supabase:
 *     npx supabase gen types typescript --local > src/generated/database.ts
 *
 *   Option B — Supabase Cloud project:
 *     npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/generated/database.ts
 *
 *   Option C — From schema file:
 *     npx supabase gen types typescript --schema supabase/schema.sql > src/generated/database.ts
 *
 * WHEN TO REGENERATE:
 *   - After every migration in supabase/migrations/
 *   - Add `pnpm --filter @elp/database generate-types` to your migration workflow
 *
 * CI NOTE:
 *   The CI pipeline does NOT auto-regenerate types. A developer must run
 *   `generate-types` after applying migrations and commit the result.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TEMPORARY HAND-WRITTEN TYPES — TO BE DELETED WHEN SUPABASE CLI IS CONFIGURED
 * These exist only to allow TypeScript to compile during development.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          current_level: 'A1' | 'A2' | 'B1' | 'B2'
          current_week: number
          streak_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          current_level?: 'A1' | 'A2' | 'B1' | 'B2'
          current_week?: number
          streak_days?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string
          current_level?: 'A1' | 'A2' | 'B1' | 'B2'
          current_week?: number
          streak_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_cards: {
        Row: {
          id: string
          user_id: string
          vocabulary_item_id: string
          state: 'new' | 'learning' | 'review' | 'relearning' | 'dominated'
          interval: number
          ease_factor: number
          reps: number
          lapses: number
          due_date: string
          last_reviewed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vocabulary_item_id: string
          state?: 'new' | 'learning' | 'review' | 'relearning' | 'dominated'
          interval?: number
          ease_factor?: number
          reps?: number
          lapses?: number
          due_date?: string
          last_reviewed?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          state?: 'new' | 'learning' | 'review' | 'relearning' | 'dominated'
          interval?: number
          ease_factor?: number
          reps?: number
          lapses?: number
          due_date?: string
          last_reviewed?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      review_events: {
        Row: {
          id: string
          user_id: string
          card_id: string
          vocabulary_item_id: string
          quality: 0 | 1 | 2 | 3 | 4 | 5
          reviewed_at: string
          previous_state: 'new' | 'learning' | 'review' | 'relearning' | 'dominated'
          next_state: 'new' | 'learning' | 'review' | 'relearning' | 'dominated'
          previous_interval: number
          next_interval: number
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          vocabulary_item_id: string
          quality: 0 | 1 | 2 | 3 | 4 | 5
          reviewed_at?: string
          previous_state: 'new' | 'learning' | 'review' | 'relearning' | 'dominated'
          next_state: 'new' | 'learning' | 'review' | 'relearning' | 'dominated'
          previous_interval: number
          next_interval: number
        }
        Update: Record<string, never>
        Relationships: []
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          started_at: string
          ended_at: string | null
          cards_reviewed: number
          cards_correct: number
          level: 'A1' | 'A2' | 'B1' | 'B2'
        }
        Insert: {
          id?: string
          user_id: string
          started_at?: string
          ended_at?: string | null
          cards_reviewed?: number
          cards_correct?: number
          level: 'A1' | 'A2' | 'B1' | 'B2'
        }
        Update: {
          ended_at?: string | null
          cards_reviewed?: number
          cards_correct?: number
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      cefr_level: 'A1' | 'A2' | 'B1' | 'B2'
      content_status: 'draft' | 'review' | 'approved' | 'published' | 'deprecated'
      card_state: 'new' | 'learning' | 'review' | 'relearning' | 'dominated'
    }
  }
}
