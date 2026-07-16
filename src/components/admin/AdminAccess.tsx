import { useState, useEffect } from 'react';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2, Compass } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AdminAccessProps {
  onAccess: () => void;
}

const ACCESS_CODE = 'eureka2026';

export function AdminAccess({ onAccess }: AdminAccessProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Check if already authenticated
  useEffect(() => {
    if (localStorage.getItem('isExecutive') === 'true') {
      onAccess();
    }
  }, [onAccess]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (code.trim().toLowerCase() === ACCESS_CODE) {
        localStorage.setItem('isExecutive', 'true');
        onAccess();
      } else {
        setError('Invalid access code. Please verify and try again.');
        setAttempts((a) => a + 1);
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <Compass className="text-moss-400" size={22} strokeWidth={2.2} />
          <span className="font-display text-base font-semibold tracking-tight text-cream-50">
            Eureka<span className="text-moss-400">HACKS</span>
          </span>
        </div>

        <div className="relative">
          {/* Wooden trail marker card */}
          <div className="rounded-2xl bg-forest-900/80 border border-forest-700/60 shadow-2xl shadow-forest-950/50 overflow-hidden">
            {/* Wood grain top bar */}
            <div className="h-2 wood-texture opacity-60" />

            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-wood-700/30 border border-wood-500/30 flex items-center justify-center">
                  <Lock className="text-wood-300" size={18} />
                </div>
                <div>
                  <h1 className="font-display text-xl font-semibold text-cream-50">Executive Access</h1>
                  <p className="font-sans text-xs text-stone-400">Restricted organizer portal</p>
                </div>
              </div>

              <p className="font-body text-sm text-cream-100/60 leading-relaxed mb-6">
                This portal is for EurekaHACKS organizers only. Enter your access code to review
                applications, manage admissions, and coordinate the expedition.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="accessCode"
                  type="password"
                  label="Access code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(null);
                  }}
                  error={error || undefined}
                  icon={<ShieldCheck size={16} />}
                  placeholder="Enter organizer code"
                  autoFocus
                />

                {attempts >= 2 && !error && (
                  <p className="font-body text-xs text-stone-400">
                    Hint: the demo code is <code className="text-gold-400">eureka2026</code>
                  </p>
                )}

                <Button type="submit" fullWidth size="lg" disabled={loading || !code} iconRight={loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}>
                  {loading ? 'Verifying…' : 'Continue'}
                </Button>
              </form>

              {error && (
                <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-red-900/20 border border-red-500/20">
                  <AlertCircle className="text-red-300 shrink-0 mt-0.5" size={15} />
                  <p className="font-body text-xs text-red-200">{error}</p>
                </div>
              )}
            </div>

            <div className="px-8 md:px-10 pb-6">
              <p className="font-body text-[11px] text-stone-500 text-center leading-relaxed">
                This is a prototype access layer for demonstration purposes only.
                It is not a substitute for real authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
