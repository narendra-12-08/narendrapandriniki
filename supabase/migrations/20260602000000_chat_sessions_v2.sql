ALTER TABLE chat_sessions
  ADD COLUMN IF NOT EXISTS visitor_phone text,
  ADD COLUMN IF NOT EXISTS budget_range text,
  ADD COLUMN IF NOT EXISTS timeline text,
  ADD COLUMN IF NOT EXISTS project_type text,
  ADD COLUMN IF NOT EXISTS features_required text,
  ADD COLUMN IF NOT EXISTS business_goal text,
  ADD COLUMN IF NOT EXISTS target_users text,
  ADD COLUMN IF NOT EXISTS current_website text,
  ADD COLUMN IF NOT EXISTS preferred_tech text,
  ADD COLUMN IF NOT EXISTS extra_notes text,
  ADD COLUMN IF NOT EXISTS lead_quality_score integer,
  ADD COLUMN IF NOT EXISTS lead_quality_label text,
  ADD COLUMN IF NOT EXISTS page_source text;
