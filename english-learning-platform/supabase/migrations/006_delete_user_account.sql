-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 006_delete_user_account
-- Purpose:   Allow authenticated users to securely delete their own account
--            and cascade all associated profile and SRS records.
--            Fulfills Apple Guideline 5.1.1(v) & GDPR "Right to be Forgotten".
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

  -- Borrar directamente de auth.users; los ON DELETE CASCADE configurados en
  -- public.profiles, public.user_cards, public.review_events y
  -- public.study_sessions purgan automáticamente todas las filas hijas.
  DELETE FROM auth.users WHERE id = calling_user_id;
END;
$$;

-- Otorgar permiso de ejecución solo a usuarios autenticados
REVOKE ALL ON FUNCTION public.delete_user_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;

COMMENT ON FUNCTION public.delete_user_account IS
  'Permite a un usuario autenticado eliminar su propia cuenta y todos sus datos en cascada.';
