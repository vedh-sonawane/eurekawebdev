import { useEffect, useRef } from 'react';

export function WaterfallScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let t = 0;

    // Resize handler
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // --- Waterfall particles ---
    type Particle = { x: number; y: number; vy: number; vx: number; alpha: number; r: number; isMist: boolean };
    const particles: Particle[] = [];

    const spawnParticle = (W: number) => {
      const fallX = W * 0.04 + Math.random() * W * 0.09;
      particles.push({
        x: fallX,
        y: 0,
        vy: 4 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 0.6,
        alpha: 0.55 + Math.random() * 0.35,
        r: 1 + Math.random() * 2.5,
        isMist: false,
      });
    };

    const spawnMist = (W: number, H: number) => {
      const poolY = H * 0.72;
      const fallX = W * 0.04 + Math.random() * W * 0.09;
      particles.push({
        x: fallX + (Math.random() - 0.5) * W * 0.12,
        y: poolY,
        vy: -(0.3 + Math.random() * 1.2),
        vx: (Math.random() - 0.5) * 1.5,
        alpha: 0.18 + Math.random() * 0.22,
        r: 3 + Math.random() * 7,
        isMist: true,
      });
    };

    // --- Duck state ---
    let duckX = 0;
    let duckDir = 1;
    let duckBob = 0;

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      t += 1;

      ctx.clearRect(0, 0, W, H);

      const cliffTop = H * 0.08;
      const cliffBot = H * 0.72;
      const fallLeft = W * 0.03;
      const fallRight = W * 0.14;
      const fallMid = (fallLeft + fallRight) / 2;

      // Initialize duck position
      if (duckX === 0) duckX = fallRight + W * 0.06;

      // --- Rocky cliff face ---
      ctx.save();
      const cliffGrad = ctx.createLinearGradient(fallLeft, cliffTop, fallRight + W * 0.04, cliffBot);
      cliffGrad.addColorStop(0, '#3d3028');
      cliffGrad.addColorStop(0.3, '#2e2318');
      cliffGrad.addColorStop(0.7, '#4a3a28');
      cliffGrad.addColorStop(1, '#1a1208');
      ctx.fillStyle = cliffGrad;
      ctx.beginPath();
      ctx.moveTo(fallLeft - W * 0.01, 0);
      ctx.lineTo(fallRight + W * 0.04, 0);
      ctx.lineTo(fallRight + W * 0.02, cliffBot * 0.4);
      ctx.lineTo(fallRight - W * 0.01, cliffBot * 0.75);
      ctx.lineTo(fallLeft - W * 0.02, cliffBot * 0.8);
      ctx.lineTo(fallLeft - W * 0.03, 0);
      ctx.closePath();
      ctx.fill();

      // Rock texture lines
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 8; i++) {
        const rx = fallLeft + (i / 8) * (fallRight - fallLeft);
        ctx.beginPath();
        ctx.moveTo(rx, cliffTop + i * 12);
        ctx.lineTo(rx + (Math.random() > 0.5 ? 4 : -4), cliffBot * 0.6 + i * 8);
        ctx.stroke();
      }
      ctx.restore();

      // --- Waterfall stream ---
      // Main water body
      const waterGrad = ctx.createLinearGradient(fallLeft, cliffTop, fallRight, cliffBot);
      waterGrad.addColorStop(0, 'rgba(200,235,255,0.90)');
      waterGrad.addColorStop(0.2, 'rgba(160,210,240,0.80)');
      waterGrad.addColorStop(0.5, 'rgba(120,185,225,0.75)');
      waterGrad.addColorStop(0.8, 'rgba(100,170,215,0.80)');
      waterGrad.addColorStop(1, 'rgba(180,225,250,0.85)');

      ctx.save();
      ctx.fillStyle = waterGrad;
      const waveOffset = Math.sin(t * 0.04) * 2;
      ctx.beginPath();
      ctx.moveTo(fallLeft + waveOffset, cliffTop);
      ctx.bezierCurveTo(
        fallLeft - 2 + waveOffset, cliffTop + (cliffBot - cliffTop) * 0.3,
        fallLeft + 3 + waveOffset, cliffTop + (cliffBot - cliffTop) * 0.6,
        fallLeft - 1 + waveOffset, cliffBot
      );
      ctx.lineTo(fallRight - 1 - waveOffset, cliffBot);
      ctx.bezierCurveTo(
        fallRight + 2 - waveOffset, cliffTop + (cliffBot - cliffTop) * 0.6,
        fallRight - 3 - waveOffset, cliffTop + (cliffBot - cliffTop) * 0.3,
        fallRight - waveOffset, cliffTop
      );
      ctx.closePath();
      ctx.fill();

      // Water shimmer streaks
      for (let i = 0; i < 6; i++) {
        const sx = fallLeft + (i / 6) * (fallRight - fallLeft) + Math.sin(t * 0.05 + i) * 1.5;
        const shimmerAlpha = 0.3 + 0.4 * Math.abs(Math.sin(t * 0.07 + i * 1.3));
        ctx.strokeStyle = `rgba(230,250,255,${shimmerAlpha})`;
        ctx.lineWidth = 0.8 + Math.sin(t * 0.03 + i) * 0.4;
        ctx.beginPath();
        ctx.moveTo(sx, cliffTop + 10);
        ctx.bezierCurveTo(
          sx + Math.sin(t * 0.05 + i) * 3, cliffTop + (cliffBot - cliffTop) * 0.35,
          sx - Math.sin(t * 0.06 + i) * 2, cliffTop + (cliffBot - cliffTop) * 0.65,
          sx + Math.sin(t * 0.04 + i) * 2, cliffBot - 5
        );
        ctx.stroke();
      }
      ctx.restore();

      // --- Pool at base ---
      const poolH = H * 0.28;
      const poolGrad = ctx.createLinearGradient(0, cliffBot, 0, cliffBot + poolH);
      poolGrad.addColorStop(0, 'rgba(60,140,180,0.70)');
      poolGrad.addColorStop(0.3, 'rgba(40,110,155,0.60)');
      poolGrad.addColorStop(0.7, 'rgba(30,90,130,0.55)');
      poolGrad.addColorStop(1, 'rgba(20,70,110,0.40)');

      ctx.save();
      ctx.fillStyle = poolGrad;
      ctx.beginPath();
      ctx.moveTo(0, cliffBot);
      ctx.lineTo(W, cliffBot);
      ctx.lineTo(W, cliffBot + poolH);
      ctx.lineTo(0, cliffBot + poolH);
      ctx.closePath();
      ctx.fill();

      // Pool ripples from waterfall impact
      const impactX = fallMid;
      const impactY = cliffBot + 8;
      for (let r = 0; r < 5; r++) {
        const phase = ((t * 0.04 + r * 0.4) % 1);
        const radius = phase * W * 0.12;
        const alpha = (1 - phase) * 0.35;
        ctx.strokeStyle = `rgba(180,230,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(impactX, impactY + radius * 0.3, radius, radius * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Pool surface shimmer
      for (let i = 0; i < 12; i++) {
        const sx = W * 0.15 + (i / 12) * W * 0.8;
        const sy = cliffBot + 20 + Math.sin(t * 0.03 + i * 0.7) * 6;
        const sw = 8 + Math.sin(t * 0.05 + i) * 4;
        const salpha = 0.15 + 0.2 * Math.abs(Math.sin(t * 0.06 + i));
        ctx.strokeStyle = `rgba(200,240,255,${salpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(sx - sw / 2, sy);
        ctx.quadraticCurveTo(sx, sy - 2, sx + sw / 2, sy);
        ctx.stroke();
      }
      ctx.restore();

      // --- Water particles ---
      if (t % 2 === 0) spawnParticle(W);
      if (t % 4 === 0) spawnMist(W, H);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.isMist) {
          p.vy *= 0.98;
          p.vx *= 0.97;
          p.alpha *= 0.985;
          if (p.alpha < 0.01) { particles.splice(i, 1); continue; }
          ctx.fillStyle = `rgba(200,235,255,${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          if (p.y > cliffBot + 15) { particles.splice(i, 1); continue; }
          ctx.fillStyle = `rgba(220,245,255,${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- Duck ---
      duckBob = Math.sin(t * 0.045) * 4;
      const waterSurface = cliffBot + 18 + duckBob;

      // Duck slow swim
      duckX += duckDir * 0.18;
      const duckMinX = fallRight + W * 0.05;
      const duckMaxX = W * 0.72;
      if (duckX > duckMaxX) duckDir = -1;
      if (duckX < duckMinX) duckDir = 1;

      const duckScale = W * 0.0008;
      const ds = Math.max(0.7, duckScale);

      ctx.save();
      ctx.translate(duckX, waterSurface);
      if (duckDir < 0) ctx.scale(-1, 1);

      // Body shadow/reflection
      ctx.fillStyle = 'rgba(20,60,90,0.18)';
      ctx.beginPath();
      ctx.ellipse(0, 14 * ds, 28 * ds, 6 * ds, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body
      const bodyGrad = ctx.createRadialGradient(-4 * ds, -4 * ds, 2 * ds, 0, 0, 28 * ds);
      bodyGrad.addColorStop(0, '#f5f0e0');
      bodyGrad.addColorStop(0.4, '#e8e0c8');
      bodyGrad.addColorStop(0.8, '#c8bc98');
      bodyGrad.addColorStop(1, '#a89870');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(0, 2 * ds, 26 * ds, 14 * ds, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Wing detail
      ctx.strokeStyle = 'rgba(160,145,110,0.6)';
      ctx.lineWidth = 0.8 * ds;
      ctx.beginPath();
      ctx.moveTo(-8 * ds, -2 * ds);
      ctx.bezierCurveTo(2 * ds, 4 * ds, 12 * ds, 6 * ds, 18 * ds, 2 * ds);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4 * ds, 0 * ds);
      ctx.bezierCurveTo(6 * ds, 6 * ds, 14 * ds, 7 * ds, 20 * ds, 4 * ds);
      ctx.stroke();

      // Tail feathers
      ctx.fillStyle = '#d4c89a';
      ctx.beginPath();
      ctx.moveTo(-20 * ds, -2 * ds);
      ctx.bezierCurveTo(-28 * ds, -8 * ds, -30 * ds, -2 * ds, -26 * ds, 4 * ds);
      ctx.bezierCurveTo(-24 * ds, 8 * ds, -18 * ds, 6 * ds, -16 * ds, 2 * ds);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(150,135,95,0.5)';
      ctx.lineWidth = 0.5 * ds;
      ctx.stroke();

      // Neck
      ctx.fillStyle = '#b8a870';
      ctx.beginPath();
      ctx.ellipse(16 * ds, -8 * ds, 7 * ds, 9 * ds, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Head - mallard green
      const headGrad = ctx.createRadialGradient(18 * ds, -16 * ds, 1 * ds, 18 * ds, -16 * ds, 9 * ds);
      headGrad.addColorStop(0, '#4a9060');
      headGrad.addColorStop(0.5, '#2d7040');
      headGrad.addColorStop(1, '#1a5028');
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.arc(18 * ds, -17 * ds, 9 * ds, 0, Math.PI * 2);
      ctx.fill();

      // White neck ring
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 2.5 * ds;
      ctx.beginPath();
      ctx.ellipse(16 * ds, -8 * ds, 6 * ds, 3 * ds, 0.3, 0, Math.PI * 2);
      ctx.stroke();

      // Bill
      ctx.fillStyle = '#e8a830';
      ctx.strokeStyle = '#c48820';
      ctx.lineWidth = 0.5 * ds;
      ctx.beginPath();
      ctx.moveTo(25 * ds, -17 * ds);
      ctx.bezierCurveTo(32 * ds, -17 * ds, 34 * ds, -15 * ds, 32 * ds, -13 * ds);
      ctx.bezierCurveTo(30 * ds, -11 * ds, 25 * ds, -13 * ds, 25 * ds, -15 * ds);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Nostril
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(28 * ds, -15.5 * ds, 1.5 * ds, 0.8 * ds, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(21 * ds, -19 * ds, 2 * ds, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(21.8 * ds, -19.8 * ds, 0.7 * ds, 0, Math.PI * 2);
      ctx.fill();

      // Water line ripple around duck
      ctx.strokeStyle = 'rgba(180,225,250,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 10 * ds, 32 * ds, 5 * ds, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute left-0 top-0 w-[22%] h-full"
      style={{ pointerEvents: 'none', zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

interface ForestEnvironmentProps {
  variant?: 'applicant' | 'admin';
}

export function ForestEnvironment({ variant: _variant }: ForestEnvironmentProps) {
  return <WaterfallScene />;
}