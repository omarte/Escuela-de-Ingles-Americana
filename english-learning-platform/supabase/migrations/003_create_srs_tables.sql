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
