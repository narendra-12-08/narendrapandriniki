-- ===========================================
-- narendrapandrinki.com — Sent emails log
-- ===========================================
-- Tracks emails composed and sent via the admin Compose Email panel
-- (and any other authenticated origin). The table holds the rendered
-- payload + the Resend message id so failed sends can be inspected
-- and retried, and successful sends can be audited.

CREATE TABLE IF NOT EXISTS sent_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT,
  body_text TEXT,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('sent', 'failed', 'queued')),
  resend_id TEXT,
  error_message TEXT,
  sent_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sent_emails_created_at ON sent_emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sent_emails_status ON sent_emails(status);

-- Row Level Security: only authenticated users (the admin) can see / write.
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_access_sent_emails" ON sent_emails
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
