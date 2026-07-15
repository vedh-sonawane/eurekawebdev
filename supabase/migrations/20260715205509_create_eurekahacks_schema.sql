/*
# EurekaHACKS Application Portal Schema

1. Overview
   Single-tenant prototype. No auth/sign-in. Applications are submitted by anonymous
   hackers and reviewed by organizers. The admin "access code" is a frontend-only
   simulation (localStorage), NOT real security — documented as such.

2. New Tables
   - `applications`: A hacker's application to EurekaHACKS.
     - id (uuid, pk)
     - full_name, email, school, grade, location (text)
     - programming_experience (text), previous_hackathons (text), technologies (text)
     - best_project (text), github_link (text), portfolio_link (text), project_description (text)
     - motivation (text), contribution (text), additional_info (text)
     - status (text, default 'pending'): pending | accepted | rejected | waitlisted
     - score (int, default null): 1-10 reviewer score
     - reviewer_notes (text, default null)
     - submitted_at (timestamptz): when the application was finalized (null = draft)
     - created_at, updated_at (timestamptz)

3. Security
   - RLS enabled on `applications`.
   - Policies allow anon + authenticated full CRUD because this is a single-tenant
     prototype with no real auth layer. The admin access code is a frontend simulation
     documented as NOT real security.

4. Notes
   - `submitted_at IS NOT NULL` distinguishes submitted applications from in-progress drafts.
   - Score is nullable until a reviewer scores the application.
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  email text,
  school text,
  grade text,
  location text,
  programming_experience text,
  previous_hackathons text,
  technologies text,
  best_project text,
  github_link text,
  portfolio_link text,
  project_description text,
  motivation text,
  contribution text,
  additional_info text,
  status text NOT NULL DEFAULT 'pending',
  score int,
  reviewer_notes text,
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_applications" ON applications;
CREATE POLICY "anon_select_applications" ON applications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_applications" ON applications;
CREATE POLICY "anon_insert_applications" ON applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_applications" ON applications;
CREATE POLICY "anon_update_applications" ON applications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_applications" ON applications;
CREATE POLICY "anon_delete_applications" ON applications FOR DELETE
  TO anon, authenticated USING (true);
