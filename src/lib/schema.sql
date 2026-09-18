-- -----------------------------------------------------------------------------
-- VORTEX FITNESS CLUB - SUPABASE SQL SCHEMA & ADMIN SETUP
-- Execute this SQL script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- -----------------------------------------------------------------------------

-- =============================================================================
-- 1. CREATE TABLES (registrations & packages)
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

CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  tagline TEXT NOT NULL,
  price NUMERIC NOT NULL,
  features TEXT[] NOT NULL
);

-- =============================================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS) & POLICIES
-- =============================================================================

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to registrations" ON public.registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select of registrations" ON public.registrations FOR SELECT USING (true);
CREATE POLICY "Allow public update of registrations" ON public.registrations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete of registrations" ON public.registrations FOR DELETE USING (true);

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select of packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Allow public update of packages" ON public.packages FOR UPDATE USING (true);
CREATE POLICY "Allow public insert of packages" ON public.packages FOR INSERT WITH CHECK (true);

-- =============================================================================
-- 3. INSERT / UPDATE DEFAULT PACKAGES (Prices in BDT)
-- =============================================================================

INSERT INTO public.packages (id, name, duration, tagline, price, features)
VALUES
  ('starter', 'Starter', '1 Month', 'Ideal for small businesses & beginners', 2900, ARRAY['Unified dashboard', 'Finance management module', 'Inventory control', 'Basic reporting and analytics', '10 user accounts']),
  ('growth', 'Growth', '3 Months', 'Perfect for growing teams & athletes', 7900, ARRAY['All Basic Plan features', 'Advanced analytics & insights', 'Custom workflow automation', 'Priority email & chat support', '25 user accounts']),
  ('advance', 'Advance', '6 Months', 'Designed for scaling enterprises', 14900, ARRAY['All Growth Plan features', 'Dedicated account manager', 'Custom API integrations', '24/7 SLA uptime guarantee', '50 user accounts']),
  ('professional', 'Professional', '12 Months', 'Full power for large organizations', 24900, ARRAY['Unlimited user accounts', 'Custom infrastructure setup', 'Dedicated strategy sessions', 'White-glove onboarding', 'Unlimited data retention'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  duration = EXCLUDED.duration,
  tagline = EXCLUDED.tagline,
  price = EXCLUDED.price,
  features = EXCLUDED.features;

-- =============================================================================
-- 4. MAKE AN EXISTING SUPABASE AUTH USER AN ADMIN
-- If you created a user in Supabase Authentication -> Users, run this SQL to give them the admin role:
-- (Replace 'your-email@example.com' with your actual user email)
-- =============================================================================

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'your-email@example.com';


