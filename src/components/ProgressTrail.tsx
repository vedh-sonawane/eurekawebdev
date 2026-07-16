import { Check } from 'lucide-react';

export interface TrailStep {
  id: string;
  name: string;
  subtitle: string;
}

interface ProgressTrailProps {
  steps: TrailStep[];
  current: number;
  onStepClick?: (index: number) => void;
}

/**
 * A trail-map style progress indicator.
 * Renders a winding SVG path with waypoints for each step.
 * Completed waypoints are filled moss, the current one pulses gold, future ones are stone.
 */
export function ProgressTrail({ steps, current, onStepClick }: ProgressTrailProps) {
  return (
    <div className="w-full">
      {/* Desktop: winding trail */}
      <div className="hidden md:block">
        <div className="relative">
          <svg
            viewBox="0 0 800 120"
            className="w-full h-auto"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Dashed trail path */}
            <path
              d="M 40 60 Q 160 20, 240 60 T 440 60 Q 560 100, 640 60 T 760 60"
              stroke="rgba(151,184,149,0.25)"
              strokeWidth="2"
              strokeDasharray="6 6"
              fill="none"
            />
            {/* Progress overlay */}
            <path
              d="M 40 60 Q 160 20, 240 60 T 440 60 Q 560 100, 640 60 T 760 60"
              stroke="rgba(107,138,79,0.6)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset={1000 - (1000 * current) / (steps.length - 1)}
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            {/* Waypoints */}
            {steps.map((step, i) => {
              const pos = waypointPos(i, steps.length);
              const completed = i < current;
              const isCurrent = i === current;
              return (
                <g key={step.id} onClick={() => onStepClick?.(i)} style={{ cursor: onStepClick ? 'pointer' : 'default' }}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isCurrent ? 14 : 11}
                    fill={completed ? '#6b8a4f' : isCurrent ? '#c0912f' : '#2d5029'}
                    stroke={completed ? '#86a36a' : isCurrent ? '#d4a843' : '#494942'}
                    strokeWidth="2"
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {isCurrent && (
                    <circle cx={pos.x} cy={pos.y} r="20" fill="none" stroke="#d4a843" strokeWidth="1.5" opacity="0.4">
                      <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {completed && (
                    <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize="11" fill="#0a160a" fontWeight="700">
                      ✓
                    </text>
                  )}
                  <text
                    x={pos.x}
                    y={pos.y - 24}
                    textAnchor="middle"
                    fontSize="11"
                    fill={isCurrent || completed ? '#faf4e8' : '#727265'}
                    fontFamily="Space Grotesk, sans-serif"
                    fontWeight={isCurrent ? '600' : '400'}
                  >
                    {step.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Mobile: compact stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-xs text-stone-400">
            Step {current + 1} of {steps.length}
          </span>
          <span className="font-display text-sm text-cream-100">{steps[current].name}</span>
        </div>
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => onStepClick?.(i)}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i < current ? 'bg-moss-500' : i === current ? 'bg-gold-500' : 'bg-forest-700'
              }`}
              aria-label={s.name}
            />
          ))}
        </div>
        <p className="mt-2 font-body text-sm text-moss-300">{steps[current].subtitle}</p>
      </div>
    </div>
  );
}

function waypointPos(i: number, total: number) {
  const x = 40 + (i * 720) / (total - 1);
  // gentle wave
  const y = 60 + Math.sin((i / (total - 1)) * Math.PI * 2) * 28;
  return { x, y };
}

export { Check };
