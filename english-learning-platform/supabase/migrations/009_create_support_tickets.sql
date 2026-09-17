-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 009_create_support_tickets
-- Purpose:   Unified customer support ticketing engine with support for:
--            - Screenshot attachment (base64 data URI or storage URL)
--            - Telemetry & device diagnostic logs (JSONB)
--            - Row-Level Security (RLS) policies for anonymous & authenticated users
--            - Realtime publication for the live administrative monitoring console
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number SERIAL UNIQUE,
  user_email TEXT NOT NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  screenshot_data TEXT,           -- Base64 image data URI or public Supabase Storage URL
  device_logs JSONB DEFAULT '{}', -- Telemetry snapshot: { app_version, os, is_pro, current_level, sync_pending }
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Indexes for rapid filtering and queries
CREATE INDEX IF NOT EXISTS idx_support_tickets_email ON public.support_tickets(user_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_category ON public.support_tickets(category);

-- 3. Row-Level Security
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- 4. Allow any user (authenticated or unauthenticated student) to submit a ticket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'support_tickets' 
      AND policyname = 'Allow public ticket submission'
  ) THEN
    CREATE POLICY "Allow public ticket submission" 
    ON public.support_tickets 
    FOR INSERT 
    WITH CHECK (true);
  END IF;
END $$;

-- 5. Allow reading tickets for support operations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'support_tickets' 
      AND policyname = 'Allow reading support tickets'
  ) THEN
    CREATE POLICY "Allow reading support tickets" 
    ON public.support_tickets 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

-- 6. Allow updating ticket status and notes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'support_tickets' 
      AND policyname = 'Allow updating support tickets'
  ) THEN
    CREATE POLICY "Allow updating support tickets" 
    ON public.support_tickets 
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- 7. Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_support_ticket_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_support_ticket_updated_at ON public.support_tickets;
CREATE TRIGGER trg_support_ticket_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW EXECUTE FUNCTION public.handle_support_ticket_updated_at();

-- 8. Enable Supabase Realtime broadcast for live monitoring
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'support_tickets'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
  END IF;
END $$;

-- 9. Anti-Bot & Anti-DDoS Protection (Database Rate-Limiting & Payload Security)
CREATE OR REPLACE FUNCTION public.check_support_ticket_security()
RETURNS TRIGGER AS $$
DECLARE
  recent_tickets_count INTEGER;
BEGIN
  -- A. Protección contra cargas de datos excesivas (Max 6.5MB para screenshot Base64)
  IF NEW.screenshot_data IS NOT NULL AND length(NEW.screenshot_data) > 6500000 THEN
    RAISE EXCEPTION 'La captura de pantalla supera el límite máximo de almacenamiento permitido (5 MB).';
  END IF;

  -- B. Validación de campos no vacíos
  IF length(trim(NEW.subject)) < 3 THEN
    RAISE EXCEPTION 'El asunto del ticket debe tener al menos 3 caracteres.';
  END IF;

  IF length(trim(NEW.message)) < 10 THEN
    RAISE EXCEPTION 'La descripción del ticket debe tener al menos 10 caracteres.';
  END IF;

  -- C. Rate Limiting por Correo Electrónico (Máx 3 tickets por email cada 10 minutos)
  SELECT COUNT(*) INTO recent_tickets_count
  FROM public.support_tickets
  WHERE LOWER(user_email) = LOWER(NEW.user_email)
    AND created_at > (now() - INTERVAL '10 minutes');

  IF recent_tickets_count >= 3 THEN
    RAISE EXCEPTION 'Límite de envíos alcanzado: Has creado 3 tickets recientemente. Por seguridad contra spam, espera 10 minutos antes de enviar otro ticket.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_support_ticket_security ON public.support_tickets;
CREATE TRIGGER trg_check_support_ticket_security
BEFORE INSERT ON public.support_tickets
FOR EACH ROW EXECUTE FUNCTION public.check_support_ticket_security();

