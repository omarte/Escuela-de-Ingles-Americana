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

  -- Insert profile
  INSERT INTO public.profiles (id, display_name, current_level)
  VALUES (
    NEW.id,
    extracted_name,
    extracted_level
  );

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
