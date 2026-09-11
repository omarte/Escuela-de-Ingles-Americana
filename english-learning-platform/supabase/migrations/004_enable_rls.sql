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
