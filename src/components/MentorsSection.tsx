import { useEffect, useRef, useState } from 'react';

import { Users } from 'lucide-react';

interface Mentor {
  name: string;
  role: string;
  company: string;
  img: string;
}

const MENTORS: Mentor[] = [
  { name: 'Dr. Amara Chen', role: 'AI Research Lead', company: 'DeepForest Labs', img: 'https://images.pexels.com/photos/5212343/pexels-photo-5212343.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Rajesh Kumar', role: 'Principal Engineer', company: 'Riverbed Systems', img: 'https://images.pexels.com/photos/5212703/pexels-photo-5212703.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Sarah Mitchell', role: 'Head of Design', company: 'Canopy Creative', img: 'https://images.pexels.com/photos/5212707/pexels-photo-5212707.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Wei Zhang', role: 'Hardware Lead', company: 'TrailMark IoT', img: 'https://images.pexels.com/photos/5212695/pexels-photo-5212695.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Marcus Johnson', role: 'Full-Stack Architect', company: 'Expedition Tech', img: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Priya Nair', role: 'ML Engineer', company: 'Mossback AI', img: 'https://images.pexels.com/photos/5212704/pexels-photo-5212704.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'James O\'Brien', role: 'DevOps Lead', company: 'CurrentCloud', img: 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Liu Yang', role: 'Product Director', company: 'Northwind Apps', img: 'https://images.pexels.com/photos/5212701/pexels-photo-5212701.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export function MentorsSection() {
  return (
    <section id="mentors" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 text-moss-400 mb-4">
          <Users size={16} strokeWidth={2.2} />
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em]">Trailblazers</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-cream-50 max-w-2xl text-balance">
          Learn from those who've walked the trail before
        </h2>
        <p className="mt-6 font-body text-lg text-cream-100/70 max-w-2xl leading-relaxed">
          Our mentors come from the companies and labs shaping what's next in tech.
          They'll guide you through the wilderness — from your first line of code to your final demo.
        </p>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5">
          {MENTORS.map((m, i) => (
            <PixelatedMentorCard key={m.name} mentor={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PixelatedMentorCard({ mentor, index }: { mentor: Mentor; index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const animRef = useRef<number>(0);

  // Intersection observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Pixelation + movement animation loop
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 300;
    const H = 300;
    canvas.width = W;
    canvas.height = H;

    // Load image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = mentor.img;
    imgRef.current = img;

    let startTime = performance.now();

    const draw = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;

      // Continuous vertical drift
      const driftY = Math.sin(elapsed * 0.5 + index) * 8;
      const driftX = Math.cos(elapsed * 0.3 + index) * 5;

      // Pixelation cycle: clear every 2s, pixelate then resolve
      const cycleDuration = 2; // seconds
      const cyclePos = (elapsed % cycleDuration) / cycleDuration;
      // pixelate at start of cycle, resolve by end
      let pixelSize: number;
      if (cyclePos < 0.15) {
        // ramp up pixelation
        pixelSize = 2 + (cyclePos / 0.15) * 18;
      } else if (cyclePos < 0.5) {
        // hold high pixelation
        pixelSize = 20;
      } else {
        // resolve back to smooth
        pixelSize = Math.max(1, 20 - ((cyclePos - 0.5) / 0.5) * 19);
      }

      if (hovered) pixelSize = Math.max(1, pixelSize * 0.3);

      ctx.clearRect(0, 0, W, H);

      if (img.complete && img.naturalWidth > 0) {
        // Draw image with drift
        ctx.save();
        ctx.filter = `brightness(0.85) saturate(0.8) hue-rotate(${index * 5}deg)`;

        if (pixelSize <= 1) {
          // Draw smooth
          ctx.drawImage(img, driftX, driftY + 20, W, H - 20);
        } else {
          // Draw small then scale up for pixelation
          const sw = Math.max(1, Math.floor(W / pixelSize));
          const sh = Math.max(1, Math.floor(H / pixelSize));
          ctx.imageSmoothingEnabled = false;
          // First draw to offscreen at small size
          const off = document.createElement('canvas');
          off.width = sw;
          off.height = sh;
          const offCtx = off.getContext('2d');
          if (offCtx) {
            offCtx.drawImage(img, 0, 20, W, H - 20, 0, 0, sw, sh);
            ctx.drawImage(off, 0, 0, sw, sh, driftX, driftY, W, H);
          }
        }
        ctx.restore();
      } else {
        // Placeholder while loading
        ctx.fillStyle = '#1f3a1d';
        ctx.fillRect(0, 0, W, H);
      }

      // Dark gradient overlay at bottom
      const grad = ctx.createLinearGradient(0, H * 0.4, 0, H);
      grad.addColorStop(0, 'rgba(10,22,10,0)');
      grad.addColorStop(1, 'rgba(10,22,10,0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      animRef.current = requestAnimationFrame(draw);
    };

    img.onload = () => {
      startTime = performance.now();
      draw();
    };

    // Fallback: start drawing even if image is slow
    const fallback = setTimeout(() => {
      if (!img.complete) {
        startTime = performance.now();
        draw();
      }
    }, 2000);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(fallback);
    };
  }, [visible, mentor.img, index, hovered]);

  return (
    <div
      ref={containerRef}
      className="group relative rounded-xl overflow-hidden border border-forest-700/40 bg-forest-900/30 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="aspect-square relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />
        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="font-display text-lg font-semibold text-cream-50 leading-tight">{mentor.name}</h3>
          <p className="font-sans text-xs text-moss-300 mt-1">{mentor.role}</p>
          <p className="font-body text-xs text-stone-400 mt-0.5">{mentor.company}</p>
        </div>
      </div>
    </div>
  );
}
