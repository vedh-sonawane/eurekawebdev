import { useEffect, useState, useMemo, useCallback } from 'react';
import { Search, SlidersHorizontal, LogOut, Compass, Users, CheckCircle2, XCircle, Clock, ListChecks, Loader2, Inbox } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StatusBadge } from '../ui/StatusBadge';
import { ApplicantProfile } from './ApplicantProfile';
import { supabase, type Application, type ApplicationStatus } from '../../lib/supabase';
import { sendDecisionEmail } from '../../lib/emailSender';
import { EmailPreviewModal } from './EmailPreviewModal';

interface AdminDashboardProps {
  onLogout: () => void;
}

type SortKey = 'newest' | 'oldest' | 'score-high' | 'score-low' | 'name';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [selected, setSelected] = useState<Application | null>(null);
  const [emailPreview, setEmailPreview] = useState<{ html: string; subject: string; name: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const loadApps = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .not('submitted_at', 'is', null)
      .order('created_at', { ascending: false });
    if (!error && data) setApps(data as Application[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const filtered = useMemo(() => {
    let list = [...apps];
    if (statusFilter !== 'all') list = list.filter((a) => a.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.full_name?.toLowerCase().includes(q) ||
          a.email?.toLowerCase().includes(q) ||
          a.school?.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case 'newest': list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)); break;
      case 'oldest': list.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at)); break;
      case 'score-high': list.sort((a, b) => (b.score || 0) - (a.score || 0)); break;
      case 'score-low': list.sort((a, b) => (a.score || 11) - (b.score || 11)); break;
      case 'name': list.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || '')); break;
    }
    return list;
  }, [apps, statusFilter, search, sort]);

  const stats = useMemo(() => {
    const total = apps.length;
    const pending = apps.filter((a) => a.status === 'pending').length;
    const accepted = apps.filter((a) => a.status === 'accepted').length;
    const rejected = apps.filter((a) => a.status === 'rejected').length;
    const waitlisted = apps.filter((a) => a.status === 'waitlisted').length;
    const reviewed = apps.filter((a) => a.score !== null).length;
    const avgScore = reviewed > 0 ? apps.reduce((s, a) => s + (a.score || 0), 0) / reviewed : 0;
    return { total, pending, accepted, rejected, waitlisted, reviewed, avgScore };
  }, [apps]);

  const handleReview = useCallback(
    async (id: string, updates: { status: ApplicationStatus; score: number; reviewer_notes: string }) => {
      const { error } = await supabase
        .from('applications')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (!error) {
        setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
        setSelected((prev) => (prev?.id === id ? { ...prev, ...updates } : prev));

        // Send decision email if status changed to a decision state
        const app = apps.find((a) => a.id === id);
        if (app && app.status !== updates.status && updates.status !== 'pending') {
          const result = await sendDecisionEmail(id, app.full_name || 'Explorer', app.email || '', updates.status);
          if (result.success && result.email) {
            setEmailPreview({
              html: result.email.bodyHtml,
              subject: result.email.subject,
              name: app.full_name || 'Explorer',
            });
            setNotification(`Decision email sent to ${app.full_name || 'applicant'}`);
            setTimeout(() => setNotification(null), 4000);
          }
        }
      }
    },
    [apps]
  );

  const handleLogout = () => {
    localStorage.removeItem('isExecutive');
    onLogout();
  };

  return (
    <div className="relative min-h-screen">
      {/* Admin top bar */}
      <header className="sticky top-0 z-30 glass-forest border-b border-forest-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-wood-700/30 border border-wood-500/30 flex items-center justify-center">
              <Compass className="text-wood-300" size={18} />
            </div>
            <div>
              <h1 className="font-display text-base font-semibold text-cream-50">Expedition HQ</h1>
              <p className="font-sans text-[11px] text-stone-400">EurekaHACKS Organizer Portal</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} icon={<LogOut size={15} />}>
            Sign out
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          <StatCard icon={Users} label="Total" value={stats.total} />
          <StatCard icon={Clock} label="Pending" value={stats.pending} accent="cream" />
          <StatCard icon={CheckCircle2} label="Accepted" value={stats.accepted} accent="moss" />
          <StatCard icon={ListChecks} label="Waitlisted" value={stats.waitlisted} accent="gold" />
          <StatCard icon={XCircle} label="Rejected" value={stats.rejected} accent="red" />
          <StatCard icon={SlidersHorizontal} label="Avg Score" value={stats.avgScore.toFixed(1)} accent="river" />
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              name="search"
              type="search"
              placeholder="Search by name, email, or school…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
              className="rounded-lg bg-forest-950/40 border border-forest-600/50 px-4 py-3 font-body text-sm text-cream-50 focus:outline-none focus:border-moss-400/60 cursor-pointer"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="waitlisted">Waitlisted</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg bg-forest-950/40 border border-forest-600/50 px-4 py-3 font-body text-sm text-cream-50 focus:outline-none focus:border-moss-400/60 cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="score-high">Score: high to low</option>
              <option value="score-low">Score: low to high</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-moss-400 mb-3" size={28} />
            <p className="font-body text-sm text-stone-400">Loading applications…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Inbox className="text-stone-500 mb-4" size={40} strokeWidth={1.5} />
            <h3 className="font-display text-lg font-semibold text-cream-50 mb-1">No applications found</h3>
            <p className="font-body text-sm text-stone-400">
              {apps.length === 0 ? 'Applications will appear here once explorers submit them.' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <>
            {/* Table header (desktop) */}
            <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.2fr_1fr_0.8fr_0.8fr] gap-4 px-4 py-2 font-sans text-[11px] uppercase tracking-wider text-stone-500 border-b border-forest-800/50">
              <span>Explorer</span>
              <span>School</span>
              <span>Experience</span>
              <span>Submitted</span>
              <span>Score</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-forest-800/40">
              {filtered.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelected(app)}
                  className="w-full text-left grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.2fr_1fr_0.8fr_0.8fr] gap-4 px-4 py-4 hover:bg-forest-800/30 transition-colors rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-forest-700/50 border border-forest-600/40 flex items-center justify-center font-sans text-sm text-cream-100 shrink-0">
                      {app.full_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-medium text-cream-50 truncate group-hover:text-moss-200 transition-colors">
                        {app.full_name || 'Unknown'}
                      </p>
                      <p className="font-body text-xs text-stone-400 truncate">{app.email}</p>
                    </div>
                  </div>
                  <div className="font-body text-sm text-cream-100/70 truncate flex items-center">
                    {app.school || '—'}
                  </div>
                  <div className="font-body text-sm text-cream-100/70 truncate flex items-center">
                    {app.programming_experience ? `${app.programming_experience.slice(0, 40)}…` : '—'}
                  </div>
                  <div className="font-body text-xs text-stone-400 flex items-center">
                    {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center">
                    {app.score !== null ? (
                      <span className="font-display text-sm font-semibold text-cream-50">{app.score}<span className="text-stone-500">/10</span></span>
                    ) : (
                      <span className="font-body text-xs text-stone-500">Unscored</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <StatusBadge status={app.status} size="sm" />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Review modal */}
      {selected && (
        <ApplicantProfile
          application={selected}
          onClose={() => setSelected(null)}
          onReview={handleReview}
        />
      )}

      {/* Email preview modal */}
      {emailPreview && (
        <EmailPreviewModal
          html={emailPreview.html}
          subject={emailPreview.subject}
          name={emailPreview.name}
          onClose={() => setEmailPreview(null)}
        />
      )}

      {/* Notification toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-up">
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl glass-forest border border-moss-400/30 shadow-xl">
            <CheckCircle2 className="text-moss-400 shrink-0" size={18} />
            <span className="font-sans text-sm text-cream-50">{notification}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = 'neutral',
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: 'neutral' | 'cream' | 'moss' | 'gold' | 'red' | 'river';
}) {
  const accents: Record<string, string> = {
    neutral: 'text-stone-400',
    cream: 'text-cream-300',
    moss: 'text-moss-300',
    gold: 'text-gold-400',
    red: 'text-red-300',
    river: 'text-river-300',
  };
  return (
    <div className="p-4 rounded-xl bg-forest-900/40 border border-forest-700/40">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className={accents[accent]} />
        <span className="font-sans text-[11px] uppercase tracking-wider text-stone-500">{label}</span>
      </div>
      <span className="font-display text-2xl font-semibold text-cream-50">{value}</span>
    </div>
  );
}
