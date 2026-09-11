-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 002_create_user_tables
-- Purpose:   User profiles and study sessions.
--            Extends Supabase auth.users with app-specific fields.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────────────────
-- profiles: App-level user data (extends auth.users)
-- auth.users (managed by Supabase Auth) → profiles (app-managed)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 50),
  current_level   cefr_level NOT NULL DEFAULT 'A1',
  current_week    SMALLINT NOT NULL DEFAULT 1 CHECK (current_week >= 1),
  streak_days     INT NOT NULL DEFAULT 0 CHECK (streak_days >= 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE profiles IS
  'App-level user profile. One row per authenticated user. Auth data (email, password) is managed exclusively by Supabase Auth.';

-- ─────────────────────────────────────────────────────────────────────────────
-- study_sessions: Tracks each study session start/end and aggregate stats
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE study_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at        TIMESTAMPTZ,
  cards_reviewed  INT NOT NULL DEFAULT 0 CHECK (cards_reviewed >= 0),
  cards_correct   INT NOT NULL DEFAULT 0 CHECK (cards_correct >= 0),
  level           cefr_level NOT NULL,
  CONSTRAINT valid_session_end CHECK (ended_at IS NULL OR ended_at > started_at),
  CONSTRAINT correct_le_reviewed CHECK (cards_correct <= cards_reviewed)
);

CREATE INDEX idx_study_sessions_user_id ON study_sessions (user_id);
CREATE INDEX idx_study_sessions_started_at ON study_sessions (user_id, started_at DESC);

COMMENT ON TABLE study_sessions IS
  'One row per study session. Immutable once ended_at is set.';
