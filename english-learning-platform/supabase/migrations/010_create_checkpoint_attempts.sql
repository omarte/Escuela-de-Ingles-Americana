-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 010_create_checkpoint_attempts
-- Purpose:   Stores milestone evaluation attempts, cognitive latency telemetry,
--            and official digital certificate hashes for student academic records.
--            Synchronizes local Phase 12 evaluation store with Supabase Cloud.
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

-- Indexes for efficient lookups and profile summaries
CREATE INDEX IF NOT EXISTS idx_checkpoint_attempts_user_id 
  ON public.checkpoint_attempts(user_id);

CREATE INDEX IF NOT EXISTS idx_checkpoint_attempts_checkpoint_id 
  ON public.checkpoint_attempts(user_id, checkpoint_id);

CREATE INDEX IF NOT EXISTS idx_checkpoint_attempts_created_at 
  ON public.checkpoint_attempts(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_checkpoint_attempts_cert_hash 
  ON public.checkpoint_attempts(certificate_hash) 
  WHERE certificate_hash IS NOT NULL;

COMMENT ON TABLE public.checkpoint_attempts IS
  'Historial inmutable de evaluaciones de hitos y exámenes de graduación presentados por los alumnos con telemetría de latencia cognitiva y hashes de certificación oficial.';

-- ─────────────────────────────────────────────────────────────────────────────
-- Row-Level Security (RLS)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.checkpoint_attempts ENABLE ROW LEVEL SECURITY;

-- 1. Users can read their own evaluation records
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'checkpoint_attempts' 
      AND policyname = 'checkpoint_attempts: users read own'
  ) THEN
    CREATE POLICY "checkpoint_attempts: users read own"
      ON public.checkpoint_attempts FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- 2. Users can insert their own evaluation records
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'checkpoint_attempts' 
      AND policyname = 'checkpoint_attempts: users insert own'
  ) THEN
    CREATE POLICY "checkpoint_attempts: users insert own"
      ON public.checkpoint_attempts FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 3. Public / verification read for valid certificates (allows verifying hashes by QR or external code)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'checkpoint_attempts' 
      AND policyname = 'checkpoint_attempts: verify certificate by hash'
  ) THEN
    CREATE POLICY "checkpoint_attempts: verify certificate by hash"
      ON public.checkpoint_attempts FOR SELECT
      USING (certificate_hash IS NOT NULL);
  END IF;
END $$;
