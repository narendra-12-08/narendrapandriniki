-- ===========================================
-- narendrapandrinki.com — Editable static sections
-- ===========================================
-- Adds CMS tables for the remaining static sections of the site:
-- about (bio + availability), principles, timeline, pricing tiers, FAQs,
-- process steps, skills (groups + items), and certifications.

-- =====================
-- pages_content (singleton key/value text store)
-- =====================
CREATE TABLE IF NOT EXISTS pages_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pages_content_key ON pages_content(key);

DROP TRIGGER IF EXISTS trg_pages_content_updated_at ON pages_content;
CREATE TRIGGER trg_pages_content_updated_at
  BEFORE UPDATE ON pages_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- principles
-- =====================
CREATE TABLE IF NOT EXISTS principles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_principles_order ON principles(order_index);

DROP TRIGGER IF EXISTS trg_principles_updated_at ON principles;
CREATE TRIGGER trg_principles_updated_at
  BEFORE UPDATE ON principles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- timeline_entries
-- =====================
CREATE TABLE IF NOT EXISTS timeline_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timeline_entries_order ON timeline_entries(order_index);

DROP TRIGGER IF EXISTS trg_timeline_entries_updated_at ON timeline_entries;
CREATE TRIGGER trg_timeline_entries_updated_at
  BEFORE UPDATE ON timeline_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- pricing_tiers
-- =====================
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  price_label TEXT,
  price_note TEXT,
  description TEXT,
  ideal_for TEXT,
  includes JSONB NOT NULL DEFAULT '[]'::jsonb,
  not_included JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta TEXT,
  order_index INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pricing_tiers_slug ON pricing_tiers(slug);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_order ON pricing_tiers(order_index);

DROP TRIGGER IF EXISTS trg_pricing_tiers_updated_at ON pricing_tiers;
CREATE TRIGGER trg_pricing_tiers_updated_at
  BEFORE UPDATE ON pricing_tiers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- faqs
-- =====================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('engagement', 'technical', 'pricing', 'general')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(order_index);

DROP TRIGGER IF EXISTS trg_faqs_updated_at ON faqs;
CREATE TRIGGER trg_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- process_steps
-- =====================
CREATE TABLE IF NOT EXISTS process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number INT NOT NULL,
  title TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_process_steps_step_number ON process_steps(step_number);
CREATE INDEX IF NOT EXISTS idx_process_steps_order ON process_steps(order_index);

DROP TRIGGER IF EXISTS trg_process_steps_updated_at ON process_steps;
CREATE TRIGGER trg_process_steps_updated_at
  BEFORE UPDATE ON process_steps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- skill_groups
-- =====================
CREATE TABLE IF NOT EXISTS skill_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skill_groups_slug ON skill_groups(slug);
CREATE INDEX IF NOT EXISTS idx_skill_groups_order ON skill_groups(order_index);

DROP TRIGGER IF EXISTS trg_skill_groups_updated_at ON skill_groups;
CREATE TRIGGER trg_skill_groups_updated_at
  BEFORE UPDATE ON skill_groups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- skill_items
-- =====================
CREATE TABLE IF NOT EXISTS skill_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES skill_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INT NOT NULL CHECK (level BETWEEN 1 AND 5),
  years INT NOT NULL DEFAULT 0,
  note TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skill_items_group ON skill_items(group_id);
CREATE INDEX IF NOT EXISTS idx_skill_items_order ON skill_items(order_index);

DROP TRIGGER IF EXISTS trg_skill_items_updated_at ON skill_items;
CREATE TRIGGER trg_skill_items_updated_at
  BEFORE UPDATE ON skill_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- certifications
-- =====================
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  year INT,
  credential_id TEXT,
  url TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'expired')),
  order_index INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certifications_year ON certifications(year);
CREATE INDEX IF NOT EXISTS idx_certifications_order ON certifications(order_index);

DROP TRIGGER IF EXISTS trg_certifications_updated_at ON certifications;
CREATE TRIGGER trg_certifications_updated_at
  BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- Row Level Security
-- =====================
ALTER TABLE pages_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE principles ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Public SELECT: pages_content has no published flag, but it's intentionally
-- public-readable; admin-only mutation via the authenticated policy.
CREATE POLICY "public_select_pages_content" ON pages_content
  FOR SELECT USING (TRUE);

CREATE POLICY "public_select_principles_published" ON principles
  FOR SELECT USING (published = TRUE);

CREATE POLICY "public_select_timeline_entries" ON timeline_entries
  FOR SELECT USING (TRUE);

CREATE POLICY "public_select_pricing_tiers_published" ON pricing_tiers
  FOR SELECT USING (published = TRUE);

CREATE POLICY "public_select_faqs_published" ON faqs
  FOR SELECT USING (published = TRUE);

CREATE POLICY "public_select_process_steps" ON process_steps
  FOR SELECT USING (TRUE);

CREATE POLICY "public_select_skill_groups" ON skill_groups
  FOR SELECT USING (TRUE);

CREATE POLICY "public_select_skill_items" ON skill_items
  FOR SELECT USING (TRUE);

CREATE POLICY "public_select_certifications_published" ON certifications
  FOR SELECT USING (published = TRUE);

-- Authenticated full access
CREATE POLICY "admin_access_pages_content" ON pages_content
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_principles" ON principles
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_timeline_entries" ON timeline_entries
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_pricing_tiers" ON pricing_tiers
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_faqs" ON faqs
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_process_steps" ON process_steps
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_skill_groups" ON skill_groups
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_skill_items" ON skill_items
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_access_certifications" ON certifications
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
