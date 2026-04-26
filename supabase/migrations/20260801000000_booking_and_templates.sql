-- Bookings — public can create, admin manages
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Visitor info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  -- Slot
  starts_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 15,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  -- Project context
  project_summary TEXT,
  meeting_link TEXT,
  -- Operational
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested','confirmed','rescheduled','cancelled','completed','no-show')),
  source TEXT NOT NULL DEFAULT 'site',
  notes TEXT,
  ip TEXT,
  user_agent TEXT,
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bookings_starts_at ON bookings(starts_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
DROP TRIGGER IF EXISTS trg_bookings_updated_at ON bookings;
CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_all_bookings" ON bookings;
CREATE POLICY "admin_all_bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "public_insert_bookings" ON bookings;
CREATE POLICY "public_insert_bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Availability — admin defines weekly recurring availability windows in IST
CREATE TABLE IF NOT EXISTS availability_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE availability_windows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_availability" ON availability_windows;
CREATE POLICY "admin_availability" ON availability_windows FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "public_read_availability" ON availability_windows;
CREATE POLICY "public_read_availability" ON availability_windows FOR SELECT USING (active = true);

-- Email templates — admin manages, used in /control/email composer
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  body_html TEXT,
  category TEXT DEFAULT 'general',
  variables JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS trg_email_templates_updated_at ON email_templates;
CREATE TRIGGER trg_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_email_templates" ON email_templates;
CREATE POLICY "admin_email_templates" ON email_templates FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Page views — lightweight visitor analytics
CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  device TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_country ON page_views(country);
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_read_page_views" ON page_views;
CREATE POLICY "admin_read_page_views" ON page_views FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "public_insert_page_views" ON page_views;
CREATE POLICY "public_insert_page_views" ON page_views FOR INSERT WITH CHECK (true);
