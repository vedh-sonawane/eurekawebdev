import type { ApplicationStatus } from '../../lib/supabase';

const config: Record<ApplicationStatus, { label: string; classes: string; dot: string }> = {
  pending: {
    label: 'Pending',
    classes: 'bg-cream-200/15 text-cream-200 border-cream-300/25',
    dot: 'bg-cream-300',
  },
  accepted: {
    label: 'Accepted',
    classes: 'bg-moss-500/15 text-moss-300 border-moss-400/30',
    dot: 'bg-moss-400',
  },
  rejected: {
    label: 'Rejected',
    classes: 'bg-red-900/30 text-red-300 border-red-500/30',
    dot: 'bg-red-400',
  },
  waitlisted: {
    label: 'Waitlisted',
    classes: 'bg-gold-500/15 text-gold-400 border-gold-500/30',
    dot: 'bg-gold-400',
  },
};

export function StatusBadge({ status, size = 'md' }: { status: ApplicationStatus; size?: 'sm' | 'md' }) {
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-sans font-medium ${c.classes} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === 'pending' ? 'animate-pulse-soft' : ''}`} />
      {c.label}
    </span>
  );
}
