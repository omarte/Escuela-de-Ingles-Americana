-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 007_add_srs_telemetry
-- Purpose:   Adds cognitive latency telemetry to review_events (retrocompatible)
--            and a new session_feedback table for the 1-tap post-session survey.
-- References: docs/discusion-pedagogica.md — Section 9 (Telemetría de Latencia)
--             and Section 10 (Feedback con Cariño y Verdad)
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Extend review_events with latency telemetry columns.
--    Both columns are nullable for backward compatibility with existing rows.
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE review_events
  ADD COLUMN IF NOT EXISTS latency_ms       INTEGER CHECK (latency_ms >= 0),
  ADD COLUMN IF NOT EXISTS friction_flagged BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN review_events.latency_ms IS
  'Response latency in milliseconds. NULL for legacy events recorded before v1.1. '
  'A value > 7000ms indicates cognitive friction even when the answer was correct (SM-2 quality is capped at 3).';

COMMENT ON COLUMN review_events.friction_flagged IS
  'TRUE when latency_ms exceeded the 7-second cognitive friction threshold. '
  'Used to drive the Cumulative Heat Map for curriculum improvement.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. ENUM for the 1-tap post-session self-report.
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'friction_level') THEN
    CREATE TYPE friction_level AS ENUM ('easy', 'normal', 'hard');
  END IF;
END
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. session_feedback: one row per user per session date.
--    Captures the learner's perceived difficulty (Feedback Honesto y Cálido).
--    Synced from SQLite on the device via the existing batch-sync engine.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS session_feedback (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_date   DATE          NOT NULL DEFAULT CURRENT_DATE,
  friction_level friction_level NOT NULL,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
  -- Prevent duplicate entries for the same user on the same day
  CONSTRAINT uq_session_feedback_user_date UNIQUE (user_id, session_date)
);

CREATE INDEX IF NOT EXISTS idx_session_feedback_user
  ON session_feedback (user_id, session_date DESC);

COMMENT ON TABLE session_feedback IS
  'One-tap post-session self-report (easy / normal / hard). '
  'Written locally to SQLite and batch-synced to Supabase. '
  'Feeds the Honest Mentor Feedback dashboard (discusion-pedagogica.md §10).';

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS: session_feedback follows the same policy as review_events.
-- Users can only read/write their own rows.
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE session_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own session feedback"
  ON session_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own session feedback"
  ON session_feedback FOR SELECT
  USING (auth.uid() = user_id);
