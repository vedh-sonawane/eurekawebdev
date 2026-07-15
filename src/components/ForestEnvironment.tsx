import { useEffect, useRef, type CSSProperties } from 'react';

/**
 * Living forest-river environment.
 * Layered: deep gradient sky, distant treeline silhouettes, drifting fog,
 * slow sunlight rays, floating particles (fireflies), topographic contour lines.
 * Parallax reacts to scroll and pointer for depth.
 */
export function ForestEnvironment({ variant = 'applicant' }: { variant?: 'applicant' | 'admin' }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        container.style.setProperty('--scroll', `${y}`);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const admin = variant === 'admin';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ '--scroll': '0' } as CSSProperties}
      aria-hidden="true"
    >
      {/* Base gradient — deep forest to river dusk */}
      <div
        className="absolute inset-0"
        style={{
          background: admin
            ? 'linear-gradient(170deg, #0a160a 0%, #142613 35%, #1f3a1d 70%, #2d5029 100%)'
            : 'linear-gradient(165deg, #0a160a 0%, #142613 25%, #1f3a1d 55%, #2a6b89 100%)',
        }}
      />

      {/* Topographic contour lines */}
      <div className="absolute inset-0 topo-pattern opacity-40" />

      {/* Sunlight rays through canopy */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-20 left-1/4 w-[140%] h-[120%] opacity-30"
          style={{
            background:
              'conic-gradient(from 200deg at 35% 0%, transparent 0deg, rgba(212,168,67,0.08) 12deg, transparent 24deg, rgba(212,168,67,0.06) 40deg, transparent 52deg, rgba(212,168,67,0.05) 70deg, transparent 90deg)',
            filter: 'blur(20px)',
          }}
        />
        <div
          className="absolute -top-10 right-1/4 w-[100%] h-[100%] opacity-20 animate-fog"
          style={{
            background:
              'conic-gradient(from 340deg at 70% 0%, transparent 0deg, rgba(212,168,67,0.06) 8deg, transparent 16deg, rgba(212,168,67,0.04) 30deg, transparent 44deg)',
            filter: 'blur(30px)',
          }}
        />
      </div>

      {/* Distant treeline — far layer */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-20"
        style={{ height: '45%', transform: 'translateY(calc(var(--scroll) * 0.05px))' }}
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 400 L0 280 L60 240 L100 260 L160 200 L220 250 L280 210 L340 260 L400 220 L460 250 L520 190 L580 240 L640 210 L700 250 L760 200 L820 240 L880 220 L940 250 L1000 200 L1060 240 L1120 210 L1180 250 L1240 220 L1300 250 L1360 200 L1420 240 L1440 220 L1440 400 Z"
          fill="#0a160a"
        />
      </svg>

      {/* Mid treeline */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-30"
        style={{ height: '32%', transform: 'translateY(calc(var(--scroll) * 0.12px))' }}
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 300 L0 180 L40 140 L80 170 L130 120 L170 160 L210 130 L260 170 L300 140 L350 160 L390 110 L440 150 L490 130 L540 170 L580 140 L630 160 L680 120 L730 150 L780 130 L830 170 L880 140 L930 160 L980 120 L1030 150 L1080 130 L1130 170 L1180 140 L1230 160 L1280 120 L1330 150 L1380 130 L1440 170 L1440 300 Z"
          fill="#142613"
        />
      </svg>

      {/* Near treeline — darkest */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-50"
        style={{ height: '22%', transform: 'translateY(calc(var(--scroll) * 0.2px))' }}
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 220 L0 120 L30 80 L60 100 L100 60 L140 90 L180 70 L220 100 L260 80 L300 60 L340 90 L380 70 L420 100 L460 80 L500 60 L540 90 L580 70 L620 100 L660 80 L700 60 L740 90 L780 70 L820 100 L860 80 L900 60 L940 90 L980 70 L1020 100 L1060 80 L1100 60 L1140 90 L1180 70 L1220 100 L1260 80 L1300 60 L1340 90 L1380 70 L1420 100 L1440 80 L1440 220 Z"
          fill="#0a160a"
        />
      </svg>

      {/* River shimmer at bottom */}
      {!admin && (
        <div
          className="absolute bottom-0 left-0 w-full opacity-25"
          style={{ height: '18%' }}
        >
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(79,161,189,0.15) 20%, rgba(133,192,212,0.2) 50%, rgba(79,161,189,0.15) 80%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                'repeating-linear-gradient(90deg, transparent 0px, transparent 40px, rgba(214,234,241,0.06) 40px, rgba(214,234,241,0.06) 42px)',
            }}
          />
        </div>
      )}

      {/* Fog layers */}
      <div
        className="absolute bottom-0 left-0 w-[140%] h-1/3 opacity-25 animate-fog"
        style={{
          background:
            'radial-gradient(ellipse at 30% 100%, rgba(250,244,232,0.08) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[120%] h-1/4 opacity-20 animate-fog"
        style={{
          animationDelay: '-12s',
          background:
            'radial-gradient(ellipse at 70% 100%, rgba(250,244,232,0.06) 0%, transparent 50%)',
        }}
      />

      {/* Floating particles / fireflies */}
      <div className="absolute inset-0">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.gold ? 'rgba(212,168,67,0.7)' : 'rgba(214,234,241,0.5)',
              boxShadow: p.gold
                ? '0 0 8px rgba(212,168,67,0.5)'
                : '0 0 6px rgba(214,234,241,0.3)',
              animation: `floatSlow ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,22,10,0.5) 100%)',
        }}
      />
    </div>
  );
}

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 37) % 100,
  y: (i * 53) % 90,
  size: 2 + ((i * 7) % 4),
  dur: 6 + ((i * 3) % 8),
  delay: -(i * 0.7),
  gold: i % 3 === 0,
}));
