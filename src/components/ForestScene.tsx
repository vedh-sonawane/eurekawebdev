import { useEffect, useRef, useState } from 'react';

/**
 * Animated SVG forest scene with flowing river, swaying trees, drifting clouds,
 * and fireflies. Used as immersive section backgrounds with text overlaid.
 */

interface ForestSceneProps {
  variant?: 'river' | 'canopy' | 'clearing' | 'dusk';
  className?: string;
}

export function ForestScene({ variant = 'river', className = '' }: ForestSceneProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1200 500"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {variant === 'river' && <RiverScene visible={visible} />}
        {variant === 'canopy' && <CanopyScene visible={visible} />}
        {variant === 'clearing' && <ClearingScene visible={visible} />}
        {variant === 'dusk' && <DuskScene visible={visible} />}
      </svg>
    </div>
  );
}

/* ── River Scene ── */
function RiverScene({ visible }: { visible: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="riverSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f3a1d" />
          <stop offset="60%" stopColor="#2d5029" />
          <stop offset="100%" stopColor="#386435" />
        </linearGradient>
        <linearGradient id="riverWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4fa1bd" />
          <stop offset="50%" stopColor="#3485a3" />
          <stop offset="100%" stopColor="#234a5e" />
        </linearGradient>
        <linearGradient id="riverShine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(214,234,241,0)" />
          <stop offset="50%" stopColor="rgba(214,234,241,0.3)" />
          <stop offset="100%" stopColor="rgba(214,234,241,0)" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="1200" height="300" fill="url(#riverSky)" />

      {/* Sun glow */}
      <circle cx="900" cy="120" r="50" fill="#d4a843" opacity="0.15">
        <animate attributeName="r" values="48;55;48" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="900" cy="120" r="25" fill="#d4a843" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Distant mountains */}
      <path d="M0 280 L200 180 L350 240 L500 160 L700 220 L900 170 L1100 230 L1200 200 L1200 300 L0 300 Z" fill="#1f3a1d" opacity="0.5" />

      {/* Distant trees */}
      {Tree(50, 260, 40, '#2d5029', 0.4)}
      {Tree(120, 250, 35, '#2d5029', 0.4)}
      {Tree(250, 255, 45, '#2d5029', 0.4)}
      {Tree(400, 245, 38, '#2d5029', 0.4)}
      {Tree(550, 258, 42, '#2d5029', 0.4)}
      {Tree(700, 250, 36, '#2d5029', 0.4)}
      {Tree(850, 255, 40, '#2d5029', 0.4)}
      {Tree(1000, 248, 44, '#2d5029', 0.4)}
      {Tree(1150, 255, 38, '#2d5029', 0.4)}

      {/* River */}
      <path d="M0 300 Q300 290 600 300 T1200 300 L1200 500 L0 500 Z" fill="url(#riverWater)" />

      {/* River flowing waves */}
      <g opacity="0.4">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M0 ${320 + i * 30} Q300 ${315 + i * 30} 600 ${320 + i * 30} T1200 ${320 + i * 30}`}
            stroke="url(#riverShine)"
            strokeWidth="2"
            fill="none"
          >
            <animate
              attributeName="d"
              values={`M0 ${320 + i * 30} Q300 ${315 + i * 30} 600 ${320 + i * 30} T1200 ${320 + i * 30};M0 ${320 + i * 30} Q300 ${325 + i * 30} 600 ${320 + i * 30} T1200 ${320 + i * 30};M0 ${320 + i * 30} Q300 ${315 + i * 30} 600 ${320 + i * 30} T1200 ${320 + i * 30}`}
              dur={`${5 + i}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}
      </g>

      {/* River shimmer lines */}
      <g opacity="0.3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={i}
            x1={visible ? "-50" : "0"}
            y1={340 + i * 25}
            x2={visible ? "50" : "100"}
            y2={340 + i * 25}
            stroke="rgba(214,234,241,0.4)"
            strokeWidth="1"
          >
            <animate
              attributeName="x1"
              from="-100"
              to="1300"
              dur={`${4 + i * 0.5}s`}
              repeatCount="indefinite"
              begin={`${i * 0.3}s`}
            />
            <animate
              attributeName="x2"
              from="-50"
              to="1350"
              dur={`${4 + i * 0.5}s`}
              repeatCount="indefinite"
              begin={`${i * 0.3}s`}
            />
          </line>
        ))}
      </g>

      {/* Foreground trees */}
      {Tree(80, 320, 70, '#142613', 0.8, visible)}
      {Tree(180, 340, 85, '#142613', 0.8, visible)}
      {Tree(1050, 330, 75, '#142613', 0.8, visible)}
      {Tree(1130, 345, 90, '#142613', 0.8, visible)}

      {/* Fireflies */}
      {Fireflies(visible)}
    </>
  );
}

/* ── Canopy Scene ── */
function CanopyScene({ visible }: { visible: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="canopySky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a160a" />
          <stop offset="40%" stopColor="#142613" />
          <stop offset="100%" stopColor="#1f3a1d" />
        </linearGradient>
        <radialGradient id="canopyLight" cx="0.5" cy="0" r="0.8">
          <stop offset="0%" stopColor="rgba(212,168,67,0.2)" />
          <stop offset="100%" stopColor="rgba(212,168,67,0)" />
        </radialGradient>
      </defs>

      <rect width="1200" height="500" fill="url(#canopySky)" />
      <rect width="1200" height="500" fill="url(#canopyLight)" />

      {/* Light rays through canopy */}
      <g opacity="0.15">
        {[200, 400, 600, 800].map((x, i) => (
          <polygon
            key={i}
            points={`${x},0 ${x - 40},500 ${x + 40},500`}
            fill="#d4a843"
          >
            <animate
              attributeName="opacity"
              values="0.1;0.25;0.1"
              dur={`${5 + i}s`}
              repeatCount="indefinite"
            />
          </polygon>
        ))}
      </g>

      {/* Tree trunks reaching up */}
      {[100, 300, 500, 700, 900, 1100].map((x, i) => (
        <g key={i}>
          <rect x={x - 8} y="0" width="16" height="500" fill="#1f3a1d" opacity="0.6" />
          {/* Leaves clusters */}
          <ellipse cx={x} cy={50 + (i % 3) * 30} rx="60" ry="40" fill="#2d5029" opacity="0.5">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values={`-2 ${x} 50;2 ${x} 50;-2 ${x} 50`}
              dur={`${4 + i}s`}
              repeatCount="indefinite"
            />
          </ellipse>
        </g>
      ))}

      {/* Ground / forest floor */}
      <path d="M0 420 Q300 400 600 420 T1200 420 L1200 500 L0 500 Z" fill="#0a160a" opacity="0.7" />

      {/* Ferns and undergrowth */}
      {[50, 200, 350, 500, 650, 800, 950, 1100].map((x, i) => (
        <path
          key={i}
          d={`M${x} 420 Q${x - 15} 380 ${x - 20} 350 M${x} 420 Q${x + 10} 375 ${x + 15} 345 M${x} 420 Q${x} 380 ${x} 340`}
          stroke="#386435"
          strokeWidth="2"
          opacity="0.5"
          fill="none"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values={`0 ${x} 420;3 ${x} 420;0 ${x} 420;-3 ${x} 420;0 ${x} 420`}
            dur={`${6 + i * 0.5}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}

      {Fireflies(visible)}
    </>
  );
}

/* ── Clearing Scene ── */
function ClearingScene({ visible }: { visible: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="clearingSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d5029" />
          <stop offset="50%" stopColor="#386435" />
          <stop offset="100%" stopColor="#4a7c46" />
        </linearGradient>
      </defs>

      <rect width="1200" height="500" fill="url(#clearingSky)" />

      {/* Sun rays */}
      <g opacity="0.2">
        <circle cx="600" cy="100" r="60" fill="#d4a843" opacity="0.3" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1="600"
            y1="100"
            x2={600 + Math.cos((angle * Math.PI) / 180) * 400}
            y2={100 + Math.sin((angle * Math.PI) / 180) * 400}
            stroke="#d4a843"
            strokeWidth="2"
            opacity="0.15"
          >
            <animate attributeName="opacity" values="0.05;0.2;0.05" dur={`${4 + i}s`} repeatCount="indefinite" />
          </line>
        ))}
      </g>

      {/* Rolling hills */}
      <path d="M0 350 Q300 300 600 340 T1200 330 L1200 500 L0 500 Z" fill="#386435" opacity="0.6" />
      <path d="M0 380 Q200 350 500 370 Q800 390 1200 365 L1200 500 L0 500 Z" fill="#2d5029" opacity="0.7" />

      {/* Trees on hills */}
      {Tree(150, 340, 55, '#1f3a1d', 0.7, visible)}
      {Tree(280, 350, 48, '#1f3a1d', 0.7, visible)}
      {Tree(900, 345, 52, '#1f3a1d', 0.7, visible)}
      {Tree(1050, 355, 58, '#1f3a1d', 0.7, visible)}

      {/* Campfire in clearing */}
      <g transform="translate(600, 400)">
        {/* Stones */}
        <ellipse cx="0" cy="20" rx="30" ry="8" fill="#3a3a35" opacity="0.8" />
        {/* Fire */}
        <path d="M-10 15 Q-15 0 -8 -10 Q-4 -5 0 -15 Q4 -5 8 -10 Q15 0 10 15 Z" fill="#d4a843" opacity="0.8">
          <animateTransform attributeName="transform" type="scale" values="1,1;1,1.15;1,1" dur="0.5s" repeatCount="indefinite" />
        </path>
        <path d="M-6 12 Q-8 2 -4 -5 Q-2 -2 0 -8 Q2 -2 4 -5 Q8 2 6 12 Z" fill="#c0912f" opacity="0.9">
          <animateTransform attributeName="transform" type="scale" values="1,1;1,1.2;1,1" dur="0.4s" repeatCount="indefinite" />
        </path>
        <path d="M-3 8 Q-4 0 -2 -3 Q0 -1 0 -5 Q0 -1 2 -3 Q4 0 3 8 Z" fill="#faf4e8" opacity="0.7">
          <animateTransform attributeName="transform" type="scale" values="1,1;1,1.3;1,1" dur="0.3s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Smoke rising */}
      <g opacity="0.15">
        <circle cx="600" cy="370" r="8" fill="#faf4e8">
          <animate attributeName="cy" values="370;320;370" dur="4s" repeatCount="indefinite" />
          <animate attributeName="r" values="6;14;6" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0;0.15" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="605" cy="380" r="6" fill="#faf4e8">
          <animate attributeName="cy" values="380;330;380" dur="5s" repeatCount="indefinite" begin="1s" />
          <animate attributeName="r" values="5;12;5" dur="5s" repeatCount="indefinite" begin="1s" />
          <animate attributeName="opacity" values="0.1;0;0.1" dur="5s" repeatCount="indefinite" begin="1s" />
        </circle>
      </g>

      {Fireflies(visible, 12)}
    </>
  );
}

/* ── Dusk Scene ── */
function DuskScene({ visible }: { visible: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="duskSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#234a5e" />
          <stop offset="30%" stopColor="#2a6b89" />
          <stop offset="60%" stopColor="#3485a3" />
          <stop offset="100%" stopColor="#1f3a1d" />
        </linearGradient>
      </defs>

      <rect width="1200" height="500" fill="url(#duskSky)" />

      {/* Stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <circle
          key={i}
          cx={(i * 137) % 1200}
          cy={(i * 73) % 200}
          r={Math.random() > 0.7 ? 1.5 : 1}
          fill="#faf4e8"
          opacity={0.3 + Math.random() * 0.4}
        >
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${3 + (i % 5)}s`} repeatCount="indefinite" begin={`${i * 0.1}s`} />
        </circle>
      ))}

      {/* Moon */}
      <circle cx="300" cy="100" r="35" fill="#faf4e8" opacity="0.8" />
      <circle cx="315" cy="92" r="30" fill="#234a5e" opacity="0.9" />

      {/* Distant treeline silhouette */}
      <path d="M0 350 L0 280 L80 220 L140 260 L200 200 L280 250 L360 210 L440 260 L520 200 L600 250 L680 210 L760 260 L840 200 L920 250 L1000 220 L1080 260 L1160 210 L1200 250 L1200 350 Z" fill="#0a160a" opacity="0.6" />

      {/* Lake reflection */}
      <rect x="0" y="350" width="1200" height="150" fill="#162836" opacity="0.6" />
      <ellipse cx="300" cy="380" rx="25" ry="3" fill="#faf4e8" opacity="0.3">
        <animate attributeName="rx" values="25;30;25" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* Water ripples */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={visible ? "-50" : "0"}
          y1={380 + i * 25}
          x2={visible ? "50" : "100"}
          y2={380 + i * 25}
          stroke="rgba(214,234,241,0.2)"
          strokeWidth="1"
        >
          <animate attributeName="x1" from="-100" to="1300" dur={`${6 + i}s`} repeatCount="indefinite" begin={`${i}s`} />
          <animate attributeName="x2" from="-50" to="1350" dur={`${6 + i}s`} repeatCount="indefinite" begin={`${i}s`} />
        </line>
      ))}

      {/* Foreground trees */}
      {Tree(100, 350, 80, '#0a160a', 0.9, visible)}
      {Tree(1100, 350, 85, '#0a160a', 0.9, visible)}

      {Fireflies(visible, 20)}
    </>
  );
}

/* ── Helpers ── */

function Tree(
  x: number,
  y: number,
  size: number,
  color: string,
  opacity: number,
  animate = false
) {
  const sway = animate ? (
    <animateTransform
      attributeName="transform"
      type="rotate"
      values={`0 ${x} ${y};1.5 ${x} ${y};0 ${x} ${y};-1.5 ${x} ${y};0 ${x} ${y}`}
      dur={`${5 + (x % 3)}s`}
      repeatCount="indefinite"
    />
  ) : null;

  return (
    <g key={`${x}-${y}`}>
      {/* Trunk */}
      <rect x={x - size * 0.06} y={y} width={size * 0.12} height={size * 0.5} fill="#3a3a35" opacity={opacity} />
      {/* Foliage layers */}
      <g>
        {sway}
        <ellipse cx={x} cy={y - size * 0.15} rx={size * 0.35} ry={size * 0.4} fill={color} opacity={opacity} />
        <ellipse cx={x - size * 0.2} cy={y - size * 0.05} rx={size * 0.25} ry={size * 0.3} fill={color} opacity={opacity * 0.9} />
        <ellipse cx={x + size * 0.2} cy={y - size * 0.05} rx={size * 0.25} ry={size * 0.3} fill={color} opacity={opacity * 0.9} />
        <ellipse cx={x} cy={y - size * 0.35} rx={size * 0.28} ry={size * 0.32} fill={color} opacity={opacity * 0.95} />
      </g>
    </g>
  );
}

function Fireflies(_visible: boolean, count = 15) {
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const x = (i * 83) % 1200;
        const y = 100 + ((i * 47) % 250);
        return (
          <circle key={i} cx={x} cy={y} r="2" fill="#d4a843" opacity="0.6">
            <animate
              attributeName="cy"
              values={`${y};${y - 20};${y + 10};${y}`}
              dur={`${4 + (i % 4)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.3}s`}
            />
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur={`${3 + (i % 3)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.2}s`}
            />
          </circle>
        );
      })}
    </g>
  );
}
