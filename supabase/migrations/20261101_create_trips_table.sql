-- Multi-Trip Architecture Migration
-- Table: public.trips
-- Additive DDL compliant with ecc-evolution.json (SCHEMA_STABILITY_LOCK)

CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  cover_image TEXT,
  is_active BOOLEAN DEFAULT false,
  itinerary JSONB DEFAULT '[]'::jsonb,
  trains JSONB DEFAULT '[]'::jsonb,
  hotels JSONB DEFAULT '[]'::jsonb,
  places JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Allow read access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Allow public read access on trips'
  ) THEN
    CREATE POLICY "Allow public read access on trips"
      ON public.trips FOR SELECT USING (true);
  END IF;
END $$;

-- Allow insert/update/delete for authenticated/service/anon clients
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'trips' AND policyname = 'Allow write access on trips'
  ) THEN
    CREATE POLICY "Allow write access on trips"
      ON public.trips FOR ALL USING (true);
  END IF;
END $$;

-- Seed default Ancient Maharashtra Tour
INSERT INTO public.trips (slug, title, description, start_date, end_date, is_active)
VALUES (
  'maharashtra-2026',
  'Ancient Maharashtra Tour',
  'A sacred 10-day journey across Ellora, Ajanta, Shirdi, and Jyotirlingas.',
  '2026-10-16',
  '2026-10-26',
  true
)
ON CONFLICT (slug) DO NOTHING;

