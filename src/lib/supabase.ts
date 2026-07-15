import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'waitlisted';

export interface Application {
  id: string;
  full_name: string | null;
  email: string | null;
  school: string | null;
  grade: string | null;
  location: string | null;
  programming_experience: string | null;
  previous_hackathons: string | null;
  technologies: string | null;
  best_project: string | null;
  github_link: string | null;
  portfolio_link: string | null;
  project_description: string | null;
  motivation: string | null;
  contribution: string | null;
  additional_info: string | null;
  status: ApplicationStatus;
  score: number | null;
  reviewer_notes: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ApplicationInput = Partial<Omit<Application, 'id' | 'created_at' | 'updated_at' | 'status' | 'score' | 'reviewer_notes'>>;
