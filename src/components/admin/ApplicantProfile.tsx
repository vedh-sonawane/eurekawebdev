import { useState, useEffect } from 'react';
import { Check, X, ListChecks, Star, Save, Loader2, ExternalLink, MapPin, School, Mail, Code2, FolderGit2, Heart } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { StatusBadge } from '../ui/StatusBadge';
import { type Application, type ApplicationStatus } from '../../lib/supabase';

interface ApplicantProfileProps {
  application: Application;
  onClose: () => void;
  onReview: (id: string, updates: { status: ApplicationStatus; score: number; reviewer_notes: string }) => Promise<void>;
}

export function ApplicantProfile({ application, onClose, onReview }: ApplicantProfileProps) {
  const [score, setScore] = useState(application.score ?? 0);
  const [notes, setNotes] = useState(application.reviewer_notes ?? '');
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [confirmAction, setConfirmAction] = useState<ApplicationStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setScore(application.score ?? 0);
    setNotes(application.reviewer_notes ?? '');
    setStatus(application.status);
  }, [application.id, application.score, application.reviewer_notes, application.status]);

  const doReview = async (newStatus: ApplicationStatus) => {
    setSaving(true);
    setSaved(false);
    await onReview(application.id, { status: newStatus, score, reviewer_notes: notes });
    setStatus(newStatus);
    setSaving(false);
    setSaved(true);
    setConfirmAction(null);
    setTimeout(() => setSaved(false), 2500);
  };

  const saveNotes = async () => {
    setSaving(true);
    setSaved(false);
    await onReview(application.id, { status, score, reviewer_notes: notes });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Modal open onClose={onClose} maxWidth="max-w-4xl">
      <div className="max-h-[85vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-forest-900/95 backdrop-blur-sm px-6 py-5 border-b border-forest-700/50 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-full bg-moss-500/20 border border-moss-400/30 flex items-center justify-center font-display text-lg font-semibold text-moss-200 shrink-0">
              {application.full_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-xl font-semibold text-cream-50 truncate">{application.full_name || 'Unknown'}</h2>
              <div className="flex items-center gap-3 mt-1">
                <StatusBadge status={application.status} size="sm" />
                <span className="font-body text-xs text-stone-400">
                  Applied {new Date(application.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
          {saved && (
            <span className="flex items-center gap-1.5 text-moss-300 font-sans text-xs animate-fade-in shrink-0">
              <Check size={14} /> Saved
            </span>
          )}
        </div>

        <div className="p-6 space-y-8">
          {/* Contact */}
          <Section icon={Mail} title="Contact">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email" value={application.email} />
              <Field label="Location" value={application.location} icon={MapPin} />
              <Field label="School" value={application.school} icon={School} />
              <Field label="Grade / Year" value={application.grade} />
            </div>
          </Section>

          {/* Experience */}
          <Section icon={Code2} title="Experience">
            <div className="space-y-4">
              <Field label="Programming experience" value={application.programming_experience} multiline />
              <Field label="Previous hackathons" value={application.previous_hackathons} multiline />
              <Field label="Technologies" value={application.technologies} />
            </div>
          </Section>

          {/* Projects */}
          <Section icon={FolderGit2} title="Project Showcase">
            <div className="space-y-4">
              <Field label="Best project" value={application.best_project} />
              <Field label="Project description" value={application.project_description} multiline />
              <div className="flex flex-wrap gap-3">
                {application.github_link && (
                  <a
                    href={application.github_link.startsWith('http') ? application.github_link : `https://${application.github_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-forest-800/50 border border-forest-700/50 text-sm text-cream-100/80 hover:border-moss-400/40 hover:text-cream-50 transition-colors"
                  >
                    <ExternalLink size={14} /> GitHub
                  </a>
                )}
                {application.portfolio_link && (
                  <a
                    href={application.portfolio_link.startsWith('http') ? application.portfolio_link : `https://${application.portfolio_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-forest-800/50 border border-forest-700/50 text-sm text-cream-100/80 hover:border-moss-400/40 hover:text-cream-50 transition-colors"
                  >
                    <ExternalLink size={14} /> Portfolio
                  </a>
                )}
              </div>
            </div>
          </Section>

          {/* Motivation */}
          <Section icon={Heart} title="Motivation">
            <div className="space-y-4">
              <Field label="Why EurekaHACKS?" value={application.motivation} multiline />
              <Field label="What they'll contribute" value={application.contribution} multiline />
              <Field label="Additional info" value={application.additional_info} multiline />
            </div>
          </Section>

          {/* Review panel */}
          <div className="rounded-xl bg-forest-950/40 border border-forest-700/50 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Star className="text-gold-400" size={18} />
              <h3 className="font-display text-lg font-semibold text-cream-50">Review</h3>
            </div>

            {/* Score */}
            <div className="mb-5">
              <label className="block font-sans text-sm font-medium text-cream-100 mb-2">Score (1–10)</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setScore(n)}
                    className={`w-9 h-9 rounded-lg font-sans text-sm font-medium transition-all ${
                      score === n
                        ? 'bg-gold-500 text-forest-950 scale-110 shadow-md shadow-gold-500/30'
                        : 'bg-forest-800/50 text-cream-100/60 hover:bg-forest-700/50 hover:text-cream-50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-5">
              <Textarea
                name="reviewer_notes"
                label="Reviewer notes"
                placeholder="Your assessment of this applicant…"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={saveNotes}
                disabled={saving}
                icon={saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              >
                Save notes
              </Button>
              <div className="flex-1" />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setConfirmAction('waitlisted')}
                className="text-gold-400 hover:bg-gold-500/10"
                icon={<ListChecks size={15} />}
              >
                Waitlist
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => setConfirmAction('rejected')}
                icon={<X size={15} />}
              >
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => setConfirmAction('accepted')}
                icon={<Check size={15} />}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation dialog */}
      {confirmAction && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-forest-950/70 backdrop-blur-sm animate-fade-in rounded-2xl">
          <div className="max-w-sm w-full mx-6 p-6 rounded-xl bg-forest-900 border border-forest-700/60 shadow-2xl">
            <h3 className="font-display text-lg font-semibold text-cream-50 mb-2">
              {confirmAction === 'accepted' && 'Accept this explorer?'}
              {confirmAction === 'rejected' && 'Reject this applicant?'}
              {confirmAction === 'waitlisted' && 'Add to waitlist?'}
            </h3>
            <p className="font-body text-sm text-cream-100/65 mb-6">
              {confirmAction === 'accepted' && 'They will receive an acceptance email with expedition details.'}
              {confirmAction === 'rejected' && 'They will receive a rejection email. This cannot be undone easily.'}
              {confirmAction === 'waitlisted' && 'They will be placed on the waitlist and notified if a spot opens.'}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setConfirmAction(null)}>Cancel</Button>
              <Button
                size="sm"
                variant={confirmAction === 'rejected' ? 'danger' : 'primary'}
                onClick={() => doReview(confirmAction)}
                disabled={saving}
                icon={saving ? <Loader2 size={15} className="animate-spin" /> : undefined}
              >
                {saving ? 'Saving…' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-moss-400" />
        <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-cream-100/80">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  multiline,
  icon: Icon,
}: {
  label: string;
  value: string | null | undefined;
  multiline?: boolean;
  icon?: React.ElementType;
}) {
  if (!value || !value.trim()) {
    return (
      <div>
        <p className="font-sans text-xs text-stone-500 mb-1">{label}</p>
        <p className="font-body text-sm text-stone-600 italic">Not provided</p>
      </div>
    );
  }
  return (
    <div>
      <p className="font-sans text-xs text-stone-500 mb-1 flex items-center gap-1.5">
        {Icon && <Icon size={12} />}
        {label}
      </p>
      <p className={`font-body text-sm text-cream-100/85 ${multiline ? 'whitespace-pre-wrap leading-relaxed' : ''}`}>
        {value}
      </p>
    </div>
  );
}
