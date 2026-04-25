-- ===========================================
-- narendrapandrinki.com — Contracts & E-signing
-- ===========================================
-- Adds contract templates and contracts tables.
-- Public signing access is performed via service-role on the server-side
-- /sign/[token] route handler. RLS therefore stays strict (auth-only).

-- =====================
-- Contract templates
-- =====================
CREATE TABLE IF NOT EXISTS contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contract_templates_slug ON contract_templates(slug);
CREATE INDEX IF NOT EXISTS idx_contract_templates_category ON contract_templates(category);

DROP TRIGGER IF EXISTS trg_contract_templates_updated_at ON contract_templates;
CREATE TRIGGER trg_contract_templates_updated_at
  BEFORE UPDATE ON contract_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- Contracts
-- =====================
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'declined', 'cancelled')),
  signing_token TEXT UNIQUE NOT NULL,
  sender_name TEXT NOT NULL DEFAULT 'Narendra Pandrinki',
  sender_email TEXT NOT NULL DEFAULT 'hello@narendrapandrinki.com',
  recipient_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signer_name TEXT,
  signer_ip TEXT,
  signer_user_agent TEXT,
  signature_data TEXT,
  decline_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_signing_token ON contracts(signing_token);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_recipient_email ON contracts(recipient_email);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON contracts(created_at DESC);

DROP TRIGGER IF EXISTS trg_contracts_updated_at ON contracts;
CREATE TRIGGER trg_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- Row Level Security
-- =====================
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_access_contract_templates" ON contract_templates;
CREATE POLICY "admin_access_contract_templates" ON contract_templates
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_access_contracts" ON contracts;
CREATE POLICY "admin_access_contracts" ON contracts
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
