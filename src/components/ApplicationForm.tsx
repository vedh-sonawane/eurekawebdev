import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, AlertCircle, Save } from 'lucide-react';
import { Button } from './ui/Button';
import { Input, Textarea } from './ui/Input';
import { ProgressTrail, type TrailStep } from './ProgressTrail';
import { supabase, type ApplicationInput } from '../lib/supabase';
import { ApplicationComplete } from './ApplicationComplete';

interface ApplicationFormProps {
  onBack: () => void;
}

const STEPS: TrailStep[] = [
  { id: 'trailhead', name: 'Trailhead', subtitle: 'Where your journey begins' },
  { id: 'profile', name: 'Explorer Profile', subtitle: 'Tell us who you are' },
  { id: 'adventures', name: 'Previous Adventures', subtitle: 'Your experience so far' },
  { id: 'showcase', name: 'Project Showcase', subtitle: 'What you\'ve built' },
  { id: 'final', name: 'Final Submission', subtitle: 'Why EurekaHACKS' },
];

const EMPTY: ApplicationInput = {
  full_name: '',
  email: '',
  school: '',
  grade: '',
  location: '',
  programming_experience: '',
  previous_hackathons: '',
  technologies: '',
  best_project: '',
  github_link: '',
  portfolio_link: '',
  project_description: '',
  motivation: '',
  contribution: '',
  additional_info: '',
};

export function ApplicationForm({ onBack }: ApplicationFormProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ApplicationInput>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('eurekahacks_draft');
      if (stored) {
        const parsed = JSON.parse(stored);
        setData({ ...EMPTY, ...parsed.data });
        setRecordId(parsed.id || null);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Autosave to localStorage + Supabase (debounced)
  useEffect(() => {
    const t = setTimeout(async () => {
      const hasData = Object.values(data).some((v) => v && String(v).trim());
      if (!hasData) return;

      setSaving(true);
      try {
        localStorage.setItem('eurekahacks_draft', JSON.stringify({ data, id: recordId }));

        if (recordId) {
          await supabase.from('applications').update({ ...data, updated_at: new Date().toISOString() }).eq('id', recordId);
        } else {
          const { data: inserted } = await supabase
            .from('applications')
            .insert({ ...data, submitted_at: null })
            .select('id')
            .maybeSingle();
          if (inserted) setRecordId(inserted.id);
        }
        setSavedAt(new Date());
      } catch {
        /* localStorage-only fallback is fine */
      } finally {
        setSaving(false);
      }
    }, 1500);

    return () => clearTimeout(t);
  }, [data, recordId]);

  const set = useCallback((key: keyof ApplicationInput, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!data.full_name?.trim()) e.full_name = 'Your name is required';
      if (!data.email?.trim()) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Please enter a valid email';
    }
    if (s === 1) {
      if (!data.school?.trim()) e.school = 'School is required';
      if (!data.grade?.trim()) e.grade = 'Grade or year is required';
      if (!data.location?.trim()) e.location = 'Location helps us plan travel support';
    }
    if (s === 2) {
      if (!data.programming_experience?.trim()) e.programming_experience = 'Tell us about your experience';
    }
    if (s === 3) {
      if (!data.best_project?.trim()) e.best_project = 'Describe at least one project';
      if (!data.project_description?.trim()) e.project_description = 'A short description helps us understand your work';
    }
    if (s === 4) {
      if (!data.motivation?.trim()) e.motivation = 'Tell us why you want to attend';
      if (!data.contribution?.trim()) e.contribution = 'What will you bring to the expedition?';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prev = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goTo = (i: number) => {
    // allow going back freely, forward only if current valid
    if (i < step) {
      setStep(i);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (validateStep(step)) {
      setStep(i);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submit = async () => {
    if (!validateStep(step)) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = { ...data, submitted_at: new Date().toISOString() };
      let result;
      if (recordId) {
        result = await supabase.from('applications').update(payload).eq('id', recordId).select('id').maybeSingle();
      } else {
        result = await supabase.from('applications').insert(payload).select('id').maybeSingle();
      }
      if (result.error) throw result.error;
      localStorage.removeItem('eurekahacks_draft');
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitError('Something went wrong submitting your application. Your draft is saved. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return <ApplicationComplete onBack={onBack} />;

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 font-sans text-sm text-cream-100/70 hover:text-cream-50 transition-colors"
          >
            <ArrowLeft size={16} /> Back to home
          </button>
          <div className="flex items-center gap-2 font-sans text-xs text-stone-400">
            {saving ? (
              <><Loader2 size={13} className="animate-spin" /> Saving draft…</>
            ) : savedAt ? (
              <><Save size={13} className="text-moss-400" /> Draft saved {savedAt.toLocaleTimeString()}</>
            ) : (
              <>Autosave enabled</>
            )}
          </div>
        </div>

        {/* Trail */}
        <div className="mb-12">
          <ProgressTrail steps={STEPS} current={step} onStepClick={goTo} />
        </div>

        {/* Step content */}
        <div key={step} className="animate-fade-in">
          <div className="mb-8">
            <span className="font-sans text-xs text-moss-400 uppercase tracking-[0.2em] font-semibold">
              {STEPS[step].name}
            </span>
            <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold text-cream-50">
              {STEPS[step].subtitle}
            </h1>
          </div>

          {step === 0 && (
            <div className="space-y-5">
              <Input
                name="full_name"
                label="Full name"
                value={data.full_name || ''}
                onChange={(e) => set('full_name', e.target.value)}
                error={errors.full_name}
                placeholder="Ada Lovelace"
              />
              <Input
                name="email"
                type="email"
                label="Email address"
                hint="We'll send your application updates here."
                value={data.email || ''}
                onChange={(e) => set('email', e.target.value)}
                error={errors.email}
                placeholder="ada@example.com"
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <Input
                name="school"
                label="School or university"
                value={data.school || ''}
                onChange={(e) => set('school', e.target.value)}
                error={errors.school}
                placeholder="University of the Pacific"
              />
              <Input
                name="grade"
                label="Grade or year"
                hint="e.g. 2nd year undergraduate, high school senior"
                value={data.grade || ''}
                onChange={(e) => set('grade', e.target.value)}
                error={errors.grade}
                placeholder="3rd year undergraduate"
              />
              <Input
                name="location"
                label="Location"
                hint="City, Province/State: helps us plan travel support."
                value={data.location || ''}
                onChange={(e) => set('location', e.target.value)}
                error={errors.location}
                placeholder="Vancouver, BC"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <Textarea
                name="programming_experience"
                label="Programming experience"
                hint="How many years have you been coding? What languages and frameworks are you comfortable with?"
                rows={4}
                value={data.programming_experience || ''}
                onChange={(e) => set('programming_experience', e.target.value)}
                error={errors.programming_experience}
                placeholder="I've been coding for 3 years, primarily in Python and JavaScript…"
              />
              <Textarea
                name="previous_hackathons"
                label="Previous hackathons"
                optional
                hint="List any hackathons you've attended and what you built."
                rows={3}
                value={data.previous_hackathons || ''}
                onChange={(e) => set('previous_hackathons', e.target.value)}
                placeholder="Hack the North 2025. Built a real-time forest monitoring app…"
              />
              <Input
                name="technologies"
                label="Technologies you use"
                optional
                hint="Comma-separated list of tools, languages, frameworks."
                value={data.technologies || ''}
                onChange={(e) => set('technologies', e.target.value)}
                placeholder="React, Python, TensorFlow, Arduino, Figma"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <Input
                name="best_project"
                label="Best project you've built"
                hint="Name the project and tell us what it does."
                value={data.best_project || ''}
                onChange={(e) => set('best_project', e.target.value)}
                error={errors.best_project}
                placeholder="Canopy, which is a drone-based forest canopy analyzer"
              />
              <Textarea
                name="project_description"
                label="Project description"
                hint="What problem does it solve? What was your role? What did you learn?"
                rows={5}
                value={data.project_description || ''}
                onChange={(e) => set('project_description', e.target.value)}
                error={errors.project_description}
                placeholder="Canopy uses drone imagery and a custom CNN to identify tree species…"
              />
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  name="github_link"
                  label="GitHub"
                  optional
                  value={data.github_link || ''}
                  onChange={(e) => set('github_link', e.target.value)}
                  placeholder="github.com/username"
                />
                <Input
                  name="portfolio_link"
                  label="Portfolio"
                  optional
                  value={data.portfolio_link || ''}
                  onChange={(e) => set('portfolio_link', e.target.value)}
                  placeholder="your-portfolio.com"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <Textarea
                name="motivation"
                label="Why do you want to attend EurekaHACKS?"
                hint="What draws you to this expedition? What do you hope to discover?"
                rows={4}
                value={data.motivation || ''}
                onChange={(e) => set('motivation', e.target.value)}
                error={errors.motivation}
                placeholder="I want to build something that connects technology with environmental conservation…"
              />
              <Textarea
                name="contribution"
                label="What can you contribute to the community?"
                hint="Skills, perspectives, energy, experience: what do you bring to the trail?"
                rows={4}
                value={data.contribution || ''}
                onChange={(e) => set('contribution', e.target.value)}
                error={errors.contribution}
                placeholder="I bring deep experience with hardware and a love for mentoring beginners…"
              />
              <Textarea
                name="additional_info"
                label="Anything else we should know?"
                optional
                rows={3}
                value={data.additional_info || ''}
                onChange={(e) => set('additional_info', e.target.value)}
                placeholder="Dietary restrictions, accessibility needs, team preferences…"
              />
            </div>
          )}
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="mt-6 flex items-start gap-3 p-4 rounded-lg bg-red-900/30 border border-red-500/30">
            <AlertCircle className="text-red-300 shrink-0 mt-0.5" size={18} />
            <p className="font-body text-sm text-red-200">{submitError}</p>
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-12 flex items-center justify-between">
          <Button variant="ghost" onClick={prev} disabled={step === 0} icon={<ArrowLeft size={16} />}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next} iconRight={<ArrowRight size={16} />}>
              Continue
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting} icon={submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}>
              {submitting ? 'Submitting…' : 'Submit Application'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
