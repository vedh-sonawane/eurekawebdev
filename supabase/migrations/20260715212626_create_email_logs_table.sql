/*
# Email notification log for application decisions

1. Overview
   Tracks decision emails sent to applicants when their status changes
   (accepted, rejected, waitlisted). Stores the rendered HTML body so we
   have a full audit trail of exactly what was sent.

2. New Tables
   - `email_logs`
     - id (uuid, pk)
     - application_id (uuid, fk -> applications, cascade delete)
     - recipient_email (text)
     - recipient_name (text)
     - subject (text)
     - body_html (text) — full rendered HTML email content
     - decision (text): accepted | rejected | waitlisted
     - sent_at (timestamptz)

3. Security
   - RLS enabled, anon + authenticated full CRUD (single-tenant prototype).
*/

CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  recipient_name text,
  subject text NOT NULL,
  body_html text,
  decision text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_email_logs" ON email_logs;
CREATE POLICY "anon_select_email_logs" ON email_logs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_email_logs" ON email_logs;
CREATE POLICY "anon_insert_email_logs" ON email_logs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_email_logs" ON email_logs;
CREATE POLICY "anon_update_email_logs" ON email_logs FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_email_logs" ON email_logs;
CREATE POLICY "anon_delete_email_logs" ON email_logs FOR DELETE
  TO anon, authenticated USING (true);
