import { Compass, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { useEffect, useState } from 'react';

interface ApplicationCompleteProps {
  onBack: () => void;
}

export function ApplicationComplete({ onBack }: ApplicationCompleteProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated compass check */}
        <div className={`relative mx-auto w-28 h-28 mb-10 transition-all duration-700 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="absolute inset-0 rounded-full bg-moss-500/15 animate-pulse-soft" />
          <div className="absolute inset-2 rounded-full border-2 border-moss-400/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-moss-500 flex items-center justify-center shadow-lg shadow-moss-500/30">
              <Check className="text-forest-950" size={36} strokeWidth={3} />
            </div>
          </div>
          {/* Radiating particles */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <span
              key={angle}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-gold-400"
              style={{
                transform: `rotate(${angle}deg) translateY(-64px)`,
                animation: 'pulseSoft 2s ease-in-out infinite',
                animationDelay: `${angle / 60 * 0.2}s`,
              }}
            />
          ))}
        </div>

        <div className={`transition-all duration-700 delay-200 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-cream mb-6">
            <Sparkles className="text-gold-400" size={14} />
            <span className="font-sans text-xs text-cream-100/90 tracking-wide">Application received</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-semibold text-cream-50 text-balance">
            The journey begins.
            <br />
            <span className="italic text-moss-300">Your application has reached Eureka.</span>
          </h1>

          <p className="mt-8 font-body text-lg text-cream-100/70 max-w-xl mx-auto leading-relaxed text-balance">
            Thank you for taking the first step. Our expedition team will review your application
            carefully, and you'll hear back within two weeks. Keep an eye on your inbox:
            the trail ahead is full of possibility.
          </p>

          <div className="mt-10 p-6 rounded-xl glass-cream text-left max-w-md mx-auto">
            <h3 className="font-sans text-sm font-semibold text-cream-50 mb-3">What happens next</h3>
            <div className="space-y-3">
              {[
                'We review your application within 2 weeks',
                'You\'ll receive an email with our decision',
                'If accepted, you\'ll get travel and lodging details',
                'Pack your gear. The expedition awaits.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-moss-500/20 border border-moss-400/30 flex items-center justify-center text-xs font-sans text-moss-300 shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-body text-sm text-cream-100/70">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <Button onClick={onBack} variant="outline" iconRight={<ArrowRight size={16} />}>
              Return to the Trailhead
            </Button>
          </div>
        </div>

        <p className="mt-16 font-display text-sm italic text-stone-400">
          <Compass className="inline mr-1.5" size={14} />
          "Not all those who wander are lost."
        </p>
      </div>
    </div>
  );
}
