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
