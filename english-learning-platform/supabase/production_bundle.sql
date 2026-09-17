-- ═══════════════════════════════════════════════════════════════════════════════
-- ESCUELA DE INGLÉS AMERICANA — SCRIPT MAESTRO DE MIGRACIONES (PRODUCCIÓN)
-- ═══════════════════════════════════════════════════════════════════════════════
-- Archivo:   supabase/production_bundle.sql
-- Propósito: Consolida de forma 100% IDEMPOTENTE las migraciones 001 a 010
--            para su ejecución sin fricción en el SQL Editor de Supabase Cloud.
-- Tablas:    content_words, profiles, study_sessions, user_cards, review_events,
--            session_feedback, support_tickets, checkpoint_attempts
-- ═══════════════════════════════════════════════════════════════════════════════

-- Habilitar extensión pgcrypto para generación de UUIDs si no está habilitada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. TIPOS ENUM (Idempotentes)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cefr_level') THEN
    CREATE TYPE cefr_level AS ENUM ('A1', 'A2', 'B1', 'B2');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
    CREATE TYPE content_status AS ENUM (
      'draft', 'review', 'approved', 'published', 'deprecated'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'part_of_speech') THEN
    CREATE TYPE part_of_speech AS ENUM (
      'noun', 'verb', 'adjective', 'adverb', 'preposition',
      'conjunction', 'pronoun', 'interjection', 'article',
      'determiner', 'phrasal-verb'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'card_state') THEN
    CREATE TYPE card_state AS ENUM (
      'new', 'learning', 'review', 'relearning', 'dominated'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'friction_level') THEN
    CREATE TYPE friction_level AS ENUM ('easy', 'normal', 'hard');
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. TABLA: content_words (Vocabulario de referencia)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.content_words (
  id            TEXT PRIMARY KEY CHECK (id ~ '^voc_(a1|a2|b1|b2)_[a-z][a-z-]*_[0-9]{3}$'),
  level         cefr_level NOT NULL,
  week          SMALLINT NOT NULL CHECK (week >= 1 AND week <= 52),
  topic         TEXT NOT NULL,
  status        content_status NOT NULL DEFAULT 'draft',
  verified_by   TEXT NOT NULL,
  verified_at   DATE NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_words_level ON public.content_words (level);
CREATE INDEX IF NOT EXISTS idx_content_words_level_week ON public.content_words (level, week);
CREATE INDEX IF NOT EXISTS idx_content_words_status ON public.content_words (status);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. TABLA: profiles (Perfil del estudiante vinculado a auth.users)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name         TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 50),
  current_level        cefr_level NOT NULL DEFAULT 'A1',
  current_week         SMALLINT NOT NULL DEFAULT 1 CHECK (current_week >= 1),
  streak_days          INT NOT NULL DEFAULT 0 CHECK (streak_days >= 0),
  referral_source      VARCHAR(50),
  country_code         VARCHAR(2),
  timezone_offset      INT DEFAULT 0,
  learning_goal        VARCHAR(50),
  professional_sector  VARCHAR(50),
  email_domain         VARCHAR(100),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Constraints de perfiles para datos analíticos
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_profiles_referral_source') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT chk_profiles_referral_source 
      CHECK (referral_source IS NULL OR referral_source IN (
        'linkedin', 'instagram', 'facebook', 'amigo_familiar', 
        'busqueda_google', 'trabajo_universidad', 'otro'
      ));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_profiles_learning_goal') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT chk_profiles_learning_goal 
      CHECK (learning_goal IS NULL OR learning_goal IN (
        'trabajo_ascenso', 'viajes', 'academico_examen', 'crecimiento_personal'
      ));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_profiles_country_code') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT chk_profiles_country_code 
      CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{2}$');
  END IF;
END $$;

-- Función de actualización automática de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. TABLA: study_sessions (Sesiones de estudio)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at        TIMESTAMPTZ,
  cards_reviewed  INT NOT NULL DEFAULT 0 CHECK (cards_reviewed >= 0),
  cards_correct   INT NOT NULL DEFAULT 0 CHECK (cards_correct >= 0),
  level           cefr_level NOT NULL,
  CONSTRAINT valid_session_end CHECK (ended_at IS NULL OR ended_at > started_at),
  CONSTRAINT correct_le_reviewed CHECK (cards_correct <= cards_reviewed)
);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON public.study_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_started_at ON public.study_sessions (user_id, started_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. TABLA: user_cards (Estado del algoritmo SRS por tarjeta)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_cards (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vocabulary_item_id  TEXT NOT NULL REFERENCES public.content_words(id),
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

CREATE INDEX IF NOT EXISTS idx_user_cards_user_id ON public.user_cards (user_id);
CREATE INDEX IF NOT EXISTS idx_user_cards_due_date ON public.user_cards (user_id, due_date) WHERE state != 'dominated';
CREATE INDEX IF NOT EXISTS idx_user_cards_state ON public.user_cards (user_id, state);

DROP TRIGGER IF EXISTS trg_user_cards_updated_at ON public.user_cards;
CREATE TRIGGER trg_user_cards_updated_at
  BEFORE UPDATE ON public.user_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. TABLA: review_events (Registro inmutable de revisiones con telemetría)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.review_events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_id             UUID NOT NULL REFERENCES public.user_cards(id) ON DELETE CASCADE,
  vocabulary_item_id  TEXT NOT NULL REFERENCES public.content_words(id),
  quality             SMALLINT NOT NULL CHECK (quality BETWEEN 0 AND 5),
  reviewed_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  previous_state      card_state NOT NULL,
  next_state          card_state NOT NULL,
  previous_interval   INT NOT NULL,
  next_interval       INT NOT NULL,
  latency_ms          INTEGER CHECK (latency_ms >= 0),
  friction_flagged    BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_review_events_user_id ON public.review_events (user_id, reviewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_events_card_id ON public.review_events (card_id, reviewed_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. TABLA: session_feedback (Encuesta post-sesión de 1 toque)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.session_feedback (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  friction_level friction_level NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_session_feedback_user_date UNIQUE (user_id, session_date)
);

CREATE INDEX IF NOT EXISTS idx_session_feedback_user ON public.session_feedback (user_id, session_date DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. TABLA: support_tickets (Mesa de ayuda y telemetría de soporte)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number   SERIAL UNIQUE,
  user_email      TEXT NOT NULL,
  category        TEXT NOT NULL,
  subject         TEXT NOT NULL,
  message         TEXT NOT NULL,
  screenshot_data TEXT,
  device_logs     JSONB DEFAULT '{}',
  status          TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_notes     TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_email ON public.support_tickets(user_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_category ON public.support_tickets(category);

DROP TRIGGER IF EXISTS trg_support_ticket_updated_at ON public.support_tickets;
CREATE TRIGGER trg_support_ticket_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. TABLA: checkpoint_attempts (Evaluaciones, Checkpoints y Certificados Fase 12)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.checkpoint_attempts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  checkpoint_id       TEXT NOT NULL CHECK (
                        checkpoint_id IN (
                          'a1_cp1', 'a1_cp2', 'a1_cp3', 'a1_cp4',
                          'a2_cp1', 'a2_cp2',
                          'b1_grad', 'b2_grad'
                        )
                      ),
  score_percentage    SMALLINT NOT NULL CHECK (score_percentage BETWEEN 0 AND 100),
  total_questions     SMALLINT NOT NULL CHECK (total_questions > 0),
  correct_count       SMALLINT NOT NULL CHECK (correct_count >= 0 AND correct_count <= total_questions),
  passed              BOOLEAN NOT NULL,
  average_latency_ms  INTEGER NOT NULL CHECK (average_latency_ms >= 0),
  fast_answers_count  SMALLINT NOT NULL DEFAULT 0 CHECK (fast_answers_count >= 0),
  friction_count      SMALLINT NOT NULL DEFAULT 0 CHECK (friction_count >= 0),
  certificate_hash    TEXT UNIQUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_checkpoint_attempts_user_id ON public.checkpoint_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_checkpoint_attempts_checkpoint_id ON public.checkpoint_attempts(user_id, checkpoint_id);
CREATE INDEX IF NOT EXISTS idx_checkpoint_attempts_created_at ON public.checkpoint_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkpoint_attempts_cert_hash ON public.checkpoint_attempts(certificate_hash) WHERE certificate_hash IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. ROW-LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.content_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkpoint_attempts ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
DO $$
BEGIN
  -- content_words: lectura para autenticados
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'content_words' AND policyname = 'content_words: authenticated users read all') THEN
    CREATE POLICY "content_words: authenticated users read all" ON public.content_words FOR SELECT TO authenticated USING (true);
  END IF;

  -- profiles: lectura y actualización de su propio registro
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles: users read own') THEN
    CREATE POLICY "profiles: users read own" ON public.profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles: users update own') THEN
    CREATE POLICY "profiles: users update own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;

  -- user_cards: lectura, inserción y actualización
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_cards' AND policyname = 'user_cards: users read own') THEN
    CREATE POLICY "user_cards: users read own" ON public.user_cards FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_cards' AND policyname = 'user_cards: users insert own') THEN
    CREATE POLICY "user_cards: users insert own" ON public.user_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_cards' AND policyname = 'user_cards: users update own') THEN
    CREATE POLICY "user_cards: users update own" ON public.user_cards FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- review_events: append-only (lectura e inserción)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'review_events' AND policyname = 'review_events: users read own') THEN
    CREATE POLICY "review_events: users read own" ON public.review_events FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'review_events' AND policyname = 'review_events: users insert own') THEN
    CREATE POLICY "review_events: users insert own" ON public.review_events FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- study_sessions: lectura, inserción y actualización
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'study_sessions' AND policyname = 'study_sessions: users read own') THEN
    CREATE POLICY "study_sessions: users read own" ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'study_sessions' AND policyname = 'study_sessions: users insert own') THEN
    CREATE POLICY "study_sessions: users insert own" ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'study_sessions' AND policyname = 'study_sessions: users update own') THEN
    CREATE POLICY "study_sessions: users update own" ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- session_feedback: lectura e inserción
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'session_feedback' AND policyname = 'session_feedback: users insert own') THEN
    CREATE POLICY "session_feedback: users insert own" ON public.session_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'session_feedback' AND policyname = 'session_feedback: users read own') THEN
    CREATE POLICY "session_feedback: users read own" ON public.session_feedback FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- support_tickets: inserción pública, lectura y actualización
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'support_tickets' AND policyname = 'Allow public ticket submission') THEN
    CREATE POLICY "Allow public ticket submission" ON public.support_tickets FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'support_tickets' AND policyname = 'Allow reading support tickets') THEN
    CREATE POLICY "Allow reading support tickets" ON public.support_tickets FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'support_tickets' AND policyname = 'Allow updating support tickets') THEN
    CREATE POLICY "Allow updating support tickets" ON public.support_tickets FOR UPDATE USING (true) WITH CHECK (true);
  END IF;

  -- checkpoint_attempts: lectura e inserción de usuario, más validación pública de certificado
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'checkpoint_attempts' AND policyname = 'checkpoint_attempts: users read own') THEN
    CREATE POLICY "checkpoint_attempts: users read own" ON public.checkpoint_attempts FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'checkpoint_attempts' AND policyname = 'checkpoint_attempts: users insert own') THEN
    CREATE POLICY "checkpoint_attempts: users insert own" ON public.checkpoint_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'checkpoint_attempts' AND policyname = 'checkpoint_attempts: verify certificate by hash') THEN
    CREATE POLICY "checkpoint_attempts: verify certificate by hash" ON public.checkpoint_attempts FOR SELECT USING (certificate_hash IS NOT NULL);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. TRIGGER AUTOMÁTICO: Creación de Perfil al Registrarse (auth.users)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_name   TEXT;
  extracted_level  public.cefr_level;
  extracted_domain TEXT;
BEGIN
  -- Extraer display_name con fallback seguro (2 a 50 caracteres)
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

  -- Extraer current_level con fallback a A1
  BEGIN
    extracted_level := (NEW.raw_user_meta_data->>'current_level')::public.cefr_level;
  EXCEPTION WHEN OTHERS THEN
    extracted_level := 'A1'::public.cefr_level;
  END;

  IF extracted_level IS NULL THEN
    extracted_level := 'A1'::public.cefr_level;
  END IF;

  -- Extraer dominio de email en minúsculas
  IF NEW.email IS NOT NULL AND POSITION('@' IN NEW.email) > 0 THEN
    extracted_domain := lower(split_part(NEW.email, '@', 2));
  ELSE
    extracted_domain := NULL;
  END IF;

  -- Insertar perfil con manejo de conflicto idempotente
  INSERT INTO public.profiles (
    id, display_name, current_level, email_domain
  )
  VALUES (
    NEW.id,
    extracted_name,
    extracted_level,
    extracted_domain
  )
  ON CONFLICT (id) DO UPDATE
    SET display_name = EXCLUDED.display_name,
        current_level = EXCLUDED.current_level,
        email_domain  = COALESCE(EXCLUDED.email_domain, public.profiles.email_domain),
        updated_at    = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. RPC DE PRIVACIDAD: delete_user_account (Derecho al olvido / Apple 5.1.1)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  calling_user_id UUID;
BEGIN
  calling_user_id := auth.uid();
  
  IF calling_user_id IS NULL THEN
    RAISE EXCEPTION 'Acceso denegado: Usuario no autenticado';
  END IF;

  DELETE FROM auth.users WHERE id = calling_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_user_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 13. PUBLICACIÓN REALTIME (Mesa de Ayuda y Soporte)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'support_tickets'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
    END IF;
  END IF;
END $$;
