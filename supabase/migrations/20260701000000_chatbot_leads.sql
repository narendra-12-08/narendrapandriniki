-- Rich lead profile from chatbot conversations.
-- Distinct from the existing 'leads' CRM table — this is the inbound funnel.
-- Each row is a captured conversation with structured + unstructured detail.

CREATE TABLE IF NOT EXISTS chatbot_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,

  -- Contact
  visitor_name TEXT NOT NULL,
  visitor_email TEXT NOT NULL,
  visitor_phone TEXT,
  visitor_company TEXT,
  visitor_role TEXT,

  -- Project picture
  project_type TEXT,
  what_to_build TEXT,
  business_goal TEXT,
  features_required TEXT,
  target_users TEXT,
  budget_range TEXT,
  timeline TEXT,
  current_website TEXT,
  preferred_tech TEXT,

  -- Qualification + summary
  lead_quality_score INT,
  lead_quality_label TEXT,
  conversation_summary TEXT,
  suggested_approach TEXT,
  suggested_tech_stack TEXT,
  next_recommended_action TEXT,
  full_transcript TEXT,
  extra_notes TEXT,

  -- Operational
  source TEXT NOT NULL DEFAULT 'chatbot',
  page_source TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  emailed_admin BOOLEAN NOT NULL DEFAULT false,
  emailed_visitor BOOLEAN NOT NULL DEFAULT false,
  ip TEXT,
  user_agent TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_leads_session_id ON chatbot_leads(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_leads_email ON chatbot_leads(visitor_email);
CREATE INDEX IF NOT EXISTS idx_chatbot_leads_status ON chatbot_leads(status);
CREATE INDEX IF NOT EXISTS idx_chatbot_leads_score ON chatbot_leads(lead_quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_leads_created ON chatbot_leads(created_at DESC);

DROP TRIGGER IF EXISTS trg_chatbot_leads_updated_at ON chatbot_leads;
CREATE TRIGGER trg_chatbot_leads_updated_at
  BEFORE UPDATE ON chatbot_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE chatbot_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_access_chatbot_leads" ON chatbot_leads;
CREATE POLICY "admin_access_chatbot_leads" ON chatbot_leads
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
