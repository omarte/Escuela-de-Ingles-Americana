-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 008_add_analytics_profile_fields
-- Purpose:   Adds privacy-preserving, non-sensitive demographic and marketing
--            attribution telemetry to public.profiles.
--            Updates the user signup trigger to automatically extract email_domain
--            and safely grant SELECT permissions to analytics_local_reader.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Extend profiles with analytics columns (all nullable / safe defaults)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS referral_source    VARCHAR(50),
  ADD COLUMN IF NOT EXISTS country_code        VARCHAR(2),
  ADD COLUMN IF NOT EXISTS timezone_offset     INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS learning_goal       VARCHAR(50),
  ADD COLUMN IF NOT EXISTS professional_sector  VARCHAR(50),
  ADD COLUMN IF NOT EXISTS email_domain        VARCHAR(100);

-- 2. Data Quality Constraints (Idempotent check guards)
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

-- 3. Document columns for Data Governance
COMMENT ON COLUMN public.profiles.referral_source IS 
  'Marketing attribution channel (e.g. linkedin, instagram, amigo_familiar, busqueda_google, otro).';

COMMENT ON COLUMN public.profiles.country_code IS 
  'ISO 3166-1 alpha-2 two-letter country code (e.g. MX, PE, CO, ES, AR, US).';

COMMENT ON COLUMN public.profiles.timezone_offset IS 
  'Timezone offset in hours relative to UTC for optimal notification scheduling.';

COMMENT ON COLUMN public.profiles.learning_goal IS 
  'Primary learner motivation (trabajo_ascenso, viajes, academico_examen, crecimiento_personal).';

COMMENT ON COLUMN public.profiles.professional_sector IS 
  'Optional professional industry for D1/D2 specialized tracks (tecnologia, salud, derecho, educacion, etc.).';

COMMENT ON COLUMN public.profiles.email_domain IS 
  'Domain extracted from email (e.g. gmail.com, oracle.com). Distinguishes B2C from B2B prospects.';

-- 4. Update Trigger Function: Auto-populate email_domain and user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_name   TEXT;
  extracted_level  public.cefr_level;
  extracted_domain TEXT;
BEGIN
  -- Extract display_name with safe fallback
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

  -- Extract current_level with fallback to A1
  BEGIN
    extracted_level := (NEW.raw_user_meta_data->>'current_level')::public.cefr_level;
  EXCEPTION WHEN OTHERS THEN
    extracted_level := 'A1'::public.cefr_level;
  END;

  IF extracted_level IS NULL THEN
    extracted_level := 'A1'::public.cefr_level;
  END IF;

  -- Automatically parse email domain in lowercase
  IF NEW.email IS NOT NULL AND POSITION('@' IN NEW.email) > 0 THEN
    extracted_domain := lower(split_part(NEW.email, '@', 2));
  ELSE
    extracted_domain := NULL;
  END IF;

  -- Insert profile with idempotent conflict handling
  INSERT INTO public.profiles (
    id,
    display_name,
    current_level,
    email_domain,
    country_code,
    referral_source,
    learning_goal,
    professional_sector,
    timezone_offset
  )
  VALUES (
    NEW.id,
    extracted_name,
    extracted_level,
    extracted_domain,
    UPPER(NULLIF(NEW.raw_user_meta_data->>'country_code', '')),
    NULLIF(NEW.raw_user_meta_data->>'referral_source', ''),
    NULLIF(NEW.raw_user_meta_data->>'learning_goal', ''),
    NULLIF(NEW.raw_user_meta_data->>'professional_sector', ''),
    COALESCE((NEW.raw_user_meta_data->>'timezone_offset')::INT, 0)
  )
  ON CONFLICT (id) DO UPDATE
    SET display_name        = EXCLUDED.display_name,
        current_level       = EXCLUDED.current_level,
        email_domain        = COALESCE(EXCLUDED.email_domain, profiles.email_domain),
        country_code        = COALESCE(EXCLUDED.country_code, profiles.country_code),
        referral_source     = COALESCE(EXCLUDED.referral_source, profiles.referral_source),
        learning_goal       = COALESCE(EXCLUDED.learning_goal, profiles.learning_goal),
        professional_sector = COALESCE(EXCLUDED.professional_sector, profiles.professional_sector),
        timezone_offset     = COALESCE(EXCLUDED.timezone_offset, profiles.timezone_offset),
        updated_at          = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Grant SELECT permissions to analytics role for Metabase / Local Bunker
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'analytics_local_reader') THEN
    GRANT SELECT (
      id, display_name, current_level, current_week, streak_days,
      created_at, updated_at, referral_source, country_code,
      timezone_offset, learning_goal, professional_sector, email_domain
    ) ON public.profiles TO analytics_local_reader;
  END IF;
END $$;
