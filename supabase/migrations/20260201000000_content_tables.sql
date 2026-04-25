-- ===========================================
-- narendrapandrinki.com — Managed Content Tables
-- ===========================================
-- Adds CMS-style tables for services, solutions, case studies, industries,
-- a technology stack matrix, testimonials, and blog posts.

-- =====================
-- Helper: updated_at trigger function
-- =====================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================
-- Services
-- =====================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  short_description TEXT,
  description TEXT,
  content TEXT,
  icon TEXT,
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_index INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_published ON services(published);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_index);

DROP TRIGGER IF EXISTS trg_services_updated_at ON services;
CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- Solutions
-- =====================
CREATE TABLE IF NOT EXISTS solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  short_description TEXT,
  outcomes JSONB NOT NULL DEFAULT '[]'::jsonb,
  content TEXT,
  order_index INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_solutions_slug ON solutions(slug);
CREATE INDEX IF NOT EXISTS idx_solutions_published ON solutions(published);
CREATE INDEX IF NOT EXISTS idx_solutions_order ON solutions(order_index);

DROP TRIGGER IF EXISTS trg_solutions_updated_at ON solutions;
CREATE TRIGGER trg_solutions_updated_at
  BEFORE UPDATE ON solutions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- Case studies
-- =====================
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  client TEXT,
  industry TEXT,
  duration TEXT,
  team TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  outcome TEXT,
  metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
  problem TEXT,
  approach JSONB NOT NULL DEFAULT '[]'::jsonb,
  result TEXT,
  stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(published);
CREATE INDEX IF NOT EXISTS idx_case_studies_order ON case_studies(order_index);

DROP TRIGGER IF EXISTS trg_case_studies_updated_at ON case_studies;
CREATE TRIGGER trg_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- Industries
-- =====================
CREATE TABLE IF NOT EXISTS industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  short_description TEXT,
  pain_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  how_i_help TEXT,
  common_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  typical_engagement TEXT,
  content TEXT,
  order_index INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_industries_slug ON industries(slug);
CREATE INDEX IF NOT EXISTS idx_industries_published ON industries(published);
CREATE INDEX IF NOT EXISTS idx_industries_order ON industries(order_index);

DROP TRIGGER IF EXISTS trg_industries_updated_at ON industries;
CREATE TRIGGER trg_industries_updated_at
  BEFORE UPDATE ON industries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- Technology categories
-- =====================
CREATE TABLE IF NOT EXISTS technology_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_technology_categories_slug ON technology_categories(slug);
CREATE INDEX IF NOT EXISTS idx_technology_categories_order ON technology_categories(order_index);

DROP TRIGGER IF EXISTS trg_technology_categories_updated_at ON technology_categories;
CREATE TRIGGER trg_technology_categories_updated_at
  BEFORE UPDATE ON technology_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- Technology items
-- =====================
CREATE TABLE IF NOT EXISTS technology_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES technology_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'core'
    CHECK (role IN ('core', 'fluent', 'familiar')),
  note TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_technology_items_category ON technology_items(category_id);
CREATE INDEX IF NOT EXISTS idx_technology_items_order ON technology_items(order_index);

DROP TRIGGER IF EXISTS trg_technology_items_updated_at ON technology_items;
CREATE TRIGGER trg_technology_items_updated_at
  BEFORE UPDATE ON technology_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- Testimonials
-- =====================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  role TEXT,
  company TEXT,
  industry TEXT,
  order_index INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(published);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(order_index);

DROP TRIGGER IF EXISTS trg_testimonials_updated_at ON testimonials;
CREATE TRIGGER trg_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- Blog posts
-- =====================
-- Note: blog_posts did not exist in the initial schema, so create it fresh.
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  reading_time INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- Row Level Security
-- =====================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE technology_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE technology_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public SELECT for published rows
CREATE POLICY "public_select_services_published" ON services
  FOR SELECT USING (published = TRUE);

CREATE POLICY "public_select_solutions_published" ON solutions
  FOR SELECT USING (published = TRUE);

CREATE POLICY "public_select_case_studies_published" ON case_studies
  FOR SELECT USING (published = TRUE);

CREATE POLICY "public_select_industries_published" ON industries
  FOR SELECT USING (published = TRUE);

CREATE POLICY "public_select_testimonials_published" ON testimonials
  FOR SELECT USING (published = TRUE);

CREATE POLICY "public_select_blog_posts_published" ON blog_posts
  FOR SELECT USING (published = TRUE);

-- Technology categories/items: public read of all (no published flag)
CREATE POLICY "public_select_technology_categories" ON technology_categories
  FOR SELECT USING (TRUE);

CREATE POLICY "public_select_technology_items" ON technology_items
  FOR SELECT USING (TRUE);

-- Authenticated full access
CREATE POLICY "admin_access_services" ON services
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_solutions" ON solutions
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_case_studies" ON case_studies
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_industries" ON industries
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_technology_categories" ON technology_categories
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_technology_items" ON technology_items
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_blog_posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
