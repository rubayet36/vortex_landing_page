-- -----------------------------------------------------------------------------
-- VORTEX FITNESS CLUB - ATOMIC & IDEMPOTENT PRODUCTION DATABASE MIGRATION
-- -----------------------------------------------------------------------------
-- SAFE & REPEATABLE:
-- 1. Explicit transaction block (BEGIN ... COMMIT) ensures atomic execution.
-- 2. Preflights existing table structures and adds any missing columns.
-- 3. Preflights data validity without deleting or altering legitimate records.
-- 4. Dynamically purges all existing policies on target tables before recreating.
-- 5. Enforces exact 11-digit phone check constraint and RLS check.
-- 6. Synchronizes confirmed packages via ON CONFLICT DO UPDATE.
-- -----------------------------------------------------------------------------

BEGIN;

-- =============================================================================
-- 1. PREFLIGHT TABLE STRUCTURES & COLUMNS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  package TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL
);

-- Ensure all required columns exist even if tables were created with legacy schema
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS package TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  tagline TEXT NOT NULL,
  price NUMERIC NOT NULL,
  features TEXT[] NOT NULL
);

ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS price NUMERIC;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS features TEXT[];

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- 2. PREFLIGHT DATA VALIDITY (No silent row rewriting or record loss)
-- =============================================================================

DO $$
DECLARE
  v_invalid_status_count INTEGER;
  v_invalid_pkg_count INTEGER;
  v_invalid_phone_count INTEGER;
BEGIN
  -- Check for unexpected status values in existing data
  SELECT COUNT(*) INTO v_invalid_status_count
  FROM public.registrations
  WHERE status IS NOT NULL AND status NOT IN ('pending', 'approved', 'contacted');

  IF v_invalid_status_count > 0 THEN
    RAISE EXCEPTION 'Migration aborted: % registration(s) contain unexpected status values. Please review data before applying constraints.', v_invalid_status_count;
  END IF;

  -- Check for unexpected package values in existing data
  SELECT COUNT(*) INTO v_invalid_pkg_count
  FROM public.registrations
  WHERE package IS NOT NULL AND package NOT IN ('starter', 'growth', 'advance', 'professional');

  IF v_invalid_pkg_count > 0 THEN
    RAISE EXCEPTION 'Migration aborted: % registration(s) contain invalid package identifiers. Please review data before applying constraints.', v_invalid_pkg_count;
  END IF;

  -- Notice if any pre-existing rows have non-11 digit phone numbers
  SELECT COUNT(*) INTO v_invalid_phone_count
  FROM public.registrations
  WHERE phone IS NOT NULL AND phone !~ '^[0-9]{11}$';

  IF v_invalid_phone_count > 0 THEN
    RAISE NOTICE 'Notice: % legacy registration(s) have non-11-digit phone numbers. Constraints will apply to new/updated rows.', v_invalid_phone_count;
  END IF;
END $$;

-- Normalize NULL status only (safe default initialization for rows created prior to status column)
UPDATE public.registrations
SET status = 'pending'
WHERE status IS NULL;

-- =============================================================================
-- 3. APPLY DATA INTEGRITY CONSTRAINTS
-- =============================================================================

ALTER TABLE public.registrations DROP CONSTRAINT IF EXISTS registrations_status_check;
ALTER TABLE public.registrations ADD CONSTRAINT registrations_status_check
  CHECK (status IN ('pending', 'approved', 'contacted'));

ALTER TABLE public.registrations DROP CONSTRAINT IF EXISTS registrations_package_check;
ALTER TABLE public.registrations ADD CONSTRAINT registrations_package_check
  CHECK (package IN ('starter', 'growth', 'advance', 'professional'));

-- Enforce exact 11-digit phone numbers (matching Bangladesh standard & frontend form)
ALTER TABLE public.registrations DROP CONSTRAINT IF EXISTS registrations_phone_check;
ALTER TABLE public.registrations ADD CONSTRAINT registrations_phone_check
  CHECK (phone ~ '^[0-9]{11}$');

-- =============================================================================
-- 4. AUTHORIZATION HELPER FUNCTION (Prevents Recursive RLS & Enforces Admin Checks)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  ) OR COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- =============================================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 6. DYNAMIC POLICY PURGE (Ensures Clean, Repeatable Execution)
-- =============================================================================
-- Dynamically finds and drops ALL policies on target tables so no matching
-- or legacy policies cause duplicate errors or permissive loopholes.

DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('registrations', 'packages', 'admin_users')
  ) LOOP
    RAISE NOTICE 'Dropping existing policy: "%" on %.%', pol.policyname, pol.schemaname, pol.tablename;
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- =============================================================================
-- 7. RECREATE SECURE RLS POLICIES FOR registrations
-- =============================================================================

-- Anonymous visitors may ONLY insert.
-- Database engine strictly enforces 'pending' status, valid package, valid email, and exact 11-digit phone.
CREATE POLICY "Public insert pending registrations only"
ON public.registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND package IN ('starter', 'growth', 'advance', 'professional')
  AND length(trim(user_name)) >= 2
  AND phone ~ '^[0-9]{11}$'
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Only verified admins may view registrations
CREATE POLICY "Admin select registrations"
ON public.registrations
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Only verified admins may update registration status
CREATE POLICY "Admin update registrations"
ON public.registrations
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Only verified admins may delete registrations
CREATE POLICY "Admin delete registrations"
ON public.registrations
FOR DELETE
TO authenticated
USING (public.is_admin());

-- =============================================================================
-- 8. RECREATE SECURE RLS POLICIES FOR packages & admin_users
-- =============================================================================

-- Anyone may view membership packages
CREATE POLICY "Public read packages"
ON public.packages
FOR SELECT
TO anon, authenticated
USING (true);

-- Only verified admins may insert, update, or delete packages
CREATE POLICY "Admin manage packages"
ON public.packages
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Deny all client-side inserts, updates, and deletes on admin_users table
REVOKE INSERT, UPDATE, DELETE ON public.admin_users FROM anon, authenticated;

-- Only verified admins can view the admin_users roster
CREATE POLICY "Admin view admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin());

-- =============================================================================
-- 9. SYNC OWNER-CONFIRMED MEMBERSHIP PACKAGES & PRICING
-- =============================================================================

INSERT INTO public.packages (id, name, duration, tagline, price, features)
VALUES
  (
    'starter',
    'Starter',
    '1 Month',
    'Essential access for beginners',
    3500,
    ARRAY['Admission 2000/-', 'Monthly 1500/-']
  ),
  (
    'growth',
    'Growth',
    '3 Months',
    'Ideal for steady progress & results',
    5000,
    ARRAY['Admission 2000/-', 'Monthly 4500/-', 'Discount 1500/-']
  ),
  (
    'advance',
    'Advance',
    '6 Months',
    'Comprehensive training & conditioning',
    8000,
    ARRAY['Admission 2000/-', 'Monthly 9000/-', 'Discount 3000/-']
  ),
  (
    'professional',
    'Professional',
    '12 Months',
    'Year-round peak performance & perks',
    12000,
    ARRAY['Admission 2000/-', 'Monthly 18000/-', 'Discount 8000/-']
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  duration = EXCLUDED.duration,
  tagline = EXCLUDED.tagline,
  price = EXCLUDED.price,
  features = EXCLUDED.features;

COMMIT;

-- =============================================================================
-- 10. AUTHORIZING AN INITIAL ADMIN ACCOUNT (Run after creating user in Auth)
-- =============================================================================
-- 1. Create your admin user in Supabase Dashboard -> Authentication -> Users.
-- 2. Copy the user's UUID from the dashboard.
-- 3. Run:
--
-- INSERT INTO public.admin_users (user_id, email)
-- VALUES ('<PASTE-USER-UUID-HERE>', 'admin@example.com')
-- ON CONFLICT (user_id) DO NOTHING;
-- =============================================================================
