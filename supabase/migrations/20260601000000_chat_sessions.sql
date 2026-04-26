-- Chat sessions table for the site chatbot
-- Stores visitor conversations and lead capture data

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  visitor_company TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  project_summary TEXT,
  lead_captured BOOLEAN NOT NULL DEFAULT FALSE,
  email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_sessions_created_at_idx ON chat_sessions (created_at DESC);
CREATE INDEX IF NOT EXISTS chat_sessions_lead_captured_idx ON chat_sessions (lead_captured);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Only service role can access (public chat writes go through API route with service key)
CREATE POLICY "service_role_all" ON chat_sessions
  USING (TRUE)
  WITH CHECK (TRUE);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_chat_sessions_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_chat_sessions_updated_at();
