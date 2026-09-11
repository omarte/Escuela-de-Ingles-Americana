-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 001_create_content_tables
-- Purpose:   Reference tables that define content vocabulary IDs.
--            These are reference data — app reads them, but content is
--            mastered in the content package (packages/content/).
-- ─────────────────────────────────────────────────────────────────────────────

-- CEFR levels enum
CREATE TYPE cefr_level AS ENUM ('A1', 'A2', 'B1', 'B2');

-- Content status enum
CREATE TYPE content_status AS ENUM (
  'draft',
  'review',
  'approved',
  'published',
  'deprecated'
);

-- Part of speech enum
CREATE TYPE part_of_speech AS ENUM (
  'noun',
  'verb',
  'adjective',
  'adverb',
  'preposition',
  'conjunction',
  'pronoun',
  'interjection',
  'article',
  'determiner',
  'phrasal-verb'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- content_words: Reference table for vocabulary item IDs.
-- The ID column stores the permanent vocabulary item ID (e.g. voc_a1_go_001).
-- This table does NOT store the full word content — that lives in packages/content/.
-- It exists so user_cards.vocabulary_item_id has a foreign key target.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE content_words (
  id            TEXT PRIMARY KEY CHECK (id ~ '^voc_(a1|a2|b1|b2)_[a-z][a-z-]*_[0-9]{3}$'),
  level         cefr_level NOT NULL,
  week          SMALLINT NOT NULL CHECK (week >= 1 AND week <= 52),
  topic         TEXT NOT NULL,
  status        content_status NOT NULL DEFAULT 'draft',
  verified_by   TEXT NOT NULL,
  verified_at   DATE NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_content_words_level ON content_words (level);
CREATE INDEX idx_content_words_level_week ON content_words (level, week);
CREATE INDEX idx_content_words_status ON content_words (status);

COMMENT ON TABLE content_words IS
  'Vocabulary item reference table. Full word content (word, translation, example) lives in packages/content/. This table stores only the ID and metadata needed for SRS card foreign keys and queries.';
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
-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 003_create_srs_tables
-- Purpose:   SRS card state and immutable review event log.
-- ─────────────────────────────────────────────────────────────────────────────

-- Card state machine enum
CREATE TYPE card_state AS ENUM (
  'new',
  'learning',
  'review',
  'relearning',
  'dominated'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- user_cards: One row per (user, vocabulary_item) pair.
-- Tracks the current SRS state. Updated after every review.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE user_cards (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vocabulary_item_id  TEXT NOT NULL REFERENCES content_words(id),
  state               card_state NOT NULL DEFAULT 'new',
  interval            INT NOT NULL DEFAULT 0 CHECK (interval >= 0),
  ease_factor         NUMERIC(4,2) NOT NULL DEFAULT 2.50 CHECK (ease_factor BETWEEN 1.30 AND 2.50),
  reps                INT NOT NULL DEFAULT 0 CHECK (reps >= 0),
  lapses              INT NOT NULL DEFAULT 0 CHECK (lapses >= 0),
  due_date            TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_reviewed       TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_vocabulary UNIQUE (user_id, vocabulary_item_id)
);

CREATE INDEX idx_user_cards_user_id ON user_cards (user_id);
CREATE INDEX idx_user_cards_due_date ON user_cards (user_id, due_date) WHERE state != 'dominated';
CREATE INDEX idx_user_cards_state ON user_cards (user_id, state);

CREATE TRIGGER trg_user_cards_updated_at
  BEFORE UPDATE ON user_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE user_cards IS
  'Current SRS state for each (user, vocabulary item) pair. Updated after every review event. The review_events table stores the immutable history.';

-- ─────────────────────────────────────────────────────────────────────────────
-- review_events: Immutable log of every review action.
-- NEVER update or delete rows in this table.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE review_events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  card_id             UUID NOT NULL REFERENCES user_cards(id) ON DELETE CASCADE,
  vocabulary_item_id  TEXT NOT NULL REFERENCES content_words(id),
  quality             SMALLINT NOT NULL CHECK (quality BETWEEN 0 AND 5),
  reviewed_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  previous_state      card_state NOT NULL,
  next_state          card_state NOT NULL,
  previous_interval   INT NOT NULL,
  next_interval       INT NOT NULL
);

-- Partition hint: future partitioning by reviewed_at month is recommended
-- when review_events exceeds 10M rows.
CREATE INDEX idx_review_events_user_id ON review_events (user_id, reviewed_at DESC);
CREATE INDEX idx_review_events_card_id ON review_events (card_id, reviewed_at DESC);

COMMENT ON TABLE review_events IS
  'Append-only log of every review. Never update or delete. Used for analytics, progress history, and SRS debugging.';
-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 004_enable_rls
-- Purpose:   Enable Row Level Security on all user-facing tables.
--            Every table that contains user data MUST have RLS enabled.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_words ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- profiles policies
-- ─────────────────────────────────────────────────────────────────────────────

-- Users can only read their own profile
CREATE POLICY "profiles: users read own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "profiles: users update own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profiles are inserted via a trigger on auth.users (see: 005_auth_trigger.sql)
-- Direct inserts are blocked except by service role

-- ─────────────────────────────────────────────────────────────────────────────
-- user_cards policies
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "user_cards: users read own"
  ON user_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_cards: users insert own"
  ON user_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_cards: users update own"
  ON user_cards FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Deletion is not permitted through the client
-- Cards are only deprecated via state transitions

-- ─────────────────────────────────────────────────────────────────────────────
-- review_events policies
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "review_events: users read own"
  ON review_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "review_events: users insert own"
  ON review_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- No UPDATE or DELETE policies — review_events is immutable

-- ─────────────────────────────────────────────────────────────────────────────
-- study_sessions policies
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "study_sessions: users read own"
  ON study_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "study_sessions: users insert own"
  ON study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "study_sessions: users update own"
  ON study_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- content_words policies
-- content_words is public read-only data — all authenticated users can read
-- Only service role can insert/update/delete
-- ─────────────────────────────────────────────────────────────────────────────

CREATE POLICY "content_words: authenticated users read all"
  ON content_words FOR SELECT
  TO authenticated
  USING (true);

-- Mutations are allowed only to service role (via Edge Functions or migrations)
-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 005_create_profile_trigger
-- Purpose:   Automatically create a public.profiles record when a new user
--            registers via Supabase Auth (auth.users).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_name TEXT;
  extracted_level public.cefr_level;
BEGIN
  -- Extract display_name with fallbacks ensuring it satisfies 2..50 length constraints
  extracted_name := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    split_part(NEW.email, '@', 1),
    'Estudiante'
  );

  IF char_length(extracted_name) < 2 THEN
    extracted_name := 'Estudiante';
  ELSIF char_length(extracted_name) > 50 THEN
    extracted_name := substring(extracted_name FROM 1 FOR 50);
  END IF;

  -- Extract current_level with fallback to 'A1'
  BEGIN
    extracted_level := (NEW.raw_user_meta_data->>'current_level')::public.cefr_level;
  EXCEPTION WHEN OTHERS THEN
    extracted_level := 'A1'::public.cefr_level;
  END;

  IF extracted_level IS NULL THEN
    extracted_level := 'A1'::public.cefr_level;
  END IF;

  -- Insert profile with idempotent conflict handling
  INSERT INTO public.profiles (id, display_name, current_level)
  VALUES (
    NEW.id,
    extracted_name,
    extracted_level
  )
  ON CONFLICT (id) DO UPDATE
    SET display_name = EXCLUDED.display_name,
        current_level = EXCLUDED.current_level,
        updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution AFTER INSERT on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS
  'Trigger function to automatically populate public.profiles when an auth.users record is created.';
