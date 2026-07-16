import { useEffect, useRef } from 'react';

interface WaterfallSceneProps {
  /**
   * Where the pool surface sits, as a fraction of the container height.
   * Tune this so the river lands just under your CTA buttons.
   */
  waterline?: number;
  /** How far the river reaches to the right, as a fraction of width. */
  reach?: number;
  className?: string;
}

export function WaterfallScene({
  waterline = 0.64,
  reach = 0.72,
  className = 'absolute inset-0 w-full h-full',
}: WaterfallSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cfg = useRef({ waterline, reach });
  cfg.current = { waterline, reach };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let t = 0;
    let W = 0;
    let H = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      // setTransform, not scale() — scale() compounds on every resize
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ---- helpers ----------------------------------------------------------
    const TAU = Math.PI * 2;
    const lerp = (a: number, b: number, m: number) => a + (b - a) * m;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const frac = (n: number) => {
      const x = Math.sin(n * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    // cheap layered noise, roughly -1..1
    const noise = (x: number) =>
      Math.sin(x) * 0.5 + Math.sin(x * 2.17 + 1.3) * 0.32 + Math.sin(x * 4.63 + 3.9) * 0.18;

    // 0 = falling droplet, 1 = splash, 2 = mist
    type Drop = { x: number; y: number; vx: number; vy: number; r: number; a: number; kind: 0 | 1 | 2 };
    const drops: Drop[] = [];
    const MAX_DROPS = 460;
    const GRAVITY = 0.16;

    let duckX = -1;
    let duckDir = 1;

    // ---- frame ------------------------------------------------------------
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (W < 4 || H < 4) return;
      t += 1;

      ctx.clearRect(0, 0, W, H);

      const poolY = H * cfg.current.waterline;
      const riverBot = Math.min(H, poolY + H * 0.18);

      // fall geometry: narrow at the lip, flaring open as it falls
      const topL = W * 0.052;
      const topR = W * 0.112;
      const flare = W * 0.022;
      const sway = (p: number) => noise(p * 2.6 + t * 0.011) * W * 0.005 * (0.25 + p);
      const edgeL = (p: number) => topL - flare * p * p + sway(p);
      const edgeR = (p: number) => topR + flare * 1.4 * p * p + sway(p);
      const impactX = (edgeL(1) + edgeR(1)) / 2;

      // =====================================================================
      // 1. rock face (behind the water)
      // =====================================================================
      const rockX = (y: number) =>
        W * 0.155 + noise(y * 0.032) * W * 0.014 + noise(y * 0.13) * W * 0.005;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-2, -2);
      ctx.lineTo(rockX(0), -2);
      for (let y = 0; y <= poolY; y += 6) ctx.lineTo(rockX(y), y);
      ctx.lineTo(-2, poolY + 2);
      ctx.closePath();
      ctx.clip();

      const rg = ctx.createLinearGradient(0, 0, W * 0.18, poolY);
      rg.addColorStop(0, '#3c3830');
      rg.addColorStop(0.35, '#282520');
      rg.addColorStop(0.62, '#413a2e');
      rg.addColorStop(1, '#15130e');
      ctx.fillStyle = rg;
      ctx.fillRect(-2, -2, W * 0.2, poolY + 4);

      // horizontal strata
      for (let i = 0; i < 20; i++) {
        const y = (i / 20) * poolY + noise(i * 3.1) * 9;
        ctx.strokeStyle = `rgba(0,0,0,${0.14 + frac(i) * 0.14})`;
        ctx.lineWidth = 1 + frac(i * 2.7) * 2.4;
        ctx.beginPath();
        ctx.moveTo(-2, y);
        ctx.bezierCurveTo(W * 0.05, y + noise(i) * 7, W * 0.11, y + noise(i * 1.7) * 9, W * 0.18, y + noise(i * 2.3) * 5);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(190,175,150,0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-2, y + 2);
        ctx.bezierCurveTo(W * 0.05, y + 2 + noise(i) * 7, W * 0.11, y + 2 + noise(i * 1.7) * 9, W * 0.18, y + 2 + noise(i * 2.3) * 5);
        ctx.stroke();
      }

      // vertical crevices
      for (let i = 0; i < 7; i++) {
        const x = W * 0.02 + frac(i * 5.3) * W * 0.14;
        ctx.strokeStyle = 'rgba(0,0,0,0.22)';
        ctx.lineWidth = 0.8 + frac(i) * 1.6;
        ctx.beginPath();
        ctx.moveTo(x, poolY * frac(i * 1.9) * 0.5);
        ctx.quadraticCurveTo(x + noise(i * 2) * 8, poolY * 0.6, x + noise(i * 3) * 14, poolY);
        ctx.stroke();
      }

      // moss creeping down the dry side
      for (let i = 0; i < 9; i++) {
        const x = W * 0.125 + frac(i * 7.1) * W * 0.035;
        const y = poolY * (0.2 + frac(i * 2.3) * 0.7);
        const r = W * 0.006 + frac(i * 4.4) * W * 0.012;
        const mg = ctx.createRadialGradient(x, y, 0, x, y, r);
        mg.addColorStop(0, 'rgba(78,102,54,0.5)');
        mg.addColorStop(1, 'rgba(78,102,54,0)');
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
      }

      // rock goes wet + dark near the pool
      const wet = ctx.createLinearGradient(0, poolY - H * 0.2, 0, poolY);
      wet.addColorStop(0, 'rgba(8,16,20,0)');
      wet.addColorStop(1, 'rgba(8,16,20,0.55)');
      ctx.fillStyle = wet;
      ctx.fillRect(-2, poolY - H * 0.2, W * 0.2, H * 0.2 + 2);
      ctx.restore();

      // =====================================================================
      // 2. the falling sheet
      // =====================================================================
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(edgeL(0), -2);
      for (let p = 0; p <= 1.0001; p += 0.04) ctx.lineTo(edgeL(p), p * poolY);
      for (let p = 1; p >= 0; p -= 0.04) ctx.lineTo(edgeR(p), p * poolY);
      ctx.lineTo(edgeR(0), -2);
      ctx.closePath();
      ctx.clip();

      // glassy at the top, aerated white by the bottom
      const wg = ctx.createLinearGradient(0, 0, 0, poolY);
      wg.addColorStop(0, 'rgba(108,168,200,0.38)');
      wg.addColorStop(0.22, 'rgba(146,198,226,0.48)');
      wg.addColorStop(0.6, 'rgba(190,226,246,0.6)');
      wg.addColorStop(1, 'rgba(238,250,255,0.82)');
      ctx.fillStyle = wg;
      ctx.fillRect(0, -2, W * 0.2, poolY + 2);

      ctx.globalCompositeOperation = 'lighter';

      // strands of water, accelerating as they fall
      const strands = reduced ? 0 : 46;
      for (let i = 0; i < strands; i++) {
        const s = i * 1.7;
        const fx = frac(s * 3.1);
        const speed = 0.45 + frac(s * 5.7) * 0.6;
        const phase = (t * 0.0042 * speed + frac(s * 9.3)) % 1;
        const p = Math.pow(phase, 1.7); // gravity: slow near the lip, fast at the base
        const y = p * poolY;
        const len = poolY * (0.05 + 0.3 * p);
        const x = lerp(edgeL(p), edgeR(p), fx) + noise(s + t * 0.02) * W * 0.003;
        const a = (0.04 + 0.2 * p) * (0.4 + 0.6 * frac(s * 2.2));

        const sg = ctx.createLinearGradient(x, y - len, x, y);
        sg.addColorStop(0, 'rgba(255,255,255,0)');
        sg.addColorStop(0.75, `rgba(238,251,255,${a})`);
        sg.addColorStop(1, `rgba(255,255,255,${a * 1.25})`);
        ctx.strokeStyle = sg;
        ctx.lineWidth = W * 0.0015 * (0.6 + p * 1.7);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y - len);
        ctx.quadraticCurveTo(x + noise(s * 2 + t * 0.03) * 2.5, y - len * 0.5, x, y);
        ctx.stroke();
      }

      // folds rolling down the face
      for (let i = 0; i < 5; i++) {
        const phase = (t * 0.004 + i / 5) % 1;
        const p = Math.pow(phase, 1.7);
        const y = p * poolY;
        const a = 0.1 * (1 - Math.abs(p - 0.5) * 1.4);
        if (a <= 0) continue;
        ctx.strokeStyle = `rgba(255,255,255,${a})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(edgeL(p), y);
        ctx.quadraticCurveTo(impactX, y + 5, edgeR(p), y);
        ctx.stroke();
      }

      // aeration haze in the lower third
      const ag = ctx.createLinearGradient(0, poolY * 0.5, 0, poolY);
      ag.addColorStop(0, 'rgba(255,255,255,0)');
      ag.addColorStop(1, 'rgba(255,255,255,0.26)');
      ctx.fillStyle = ag;
      ctx.fillRect(0, poolY * 0.5, W * 0.2, poolY * 0.5);

      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();

      // =====================================================================
      // 3. pool / river — only between poolY and riverBot
      // =====================================================================
      ctx.save();
      const pg = ctx.createLinearGradient(0, poolY, 0, riverBot);
      pg.addColorStop(0, 'rgba(48,104,136,0.6)');
      pg.addColorStop(0.45, 'rgba(30,78,110,0.44)');
      pg.addColorStop(1, 'rgba(18,52,80,0)');
      ctx.fillStyle = pg;
      ctx.fillRect(0, poolY, W, riverBot - poolY);

      // surface line catching light
      const sl = ctx.createLinearGradient(0, 0, W * cfg.current.reach, 0);
      sl.addColorStop(0, 'rgba(215,242,255,0.45)');
      sl.addColorStop(1, 'rgba(215,242,255,0)');
      ctx.strokeStyle = sl;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = 0; x <= W * cfg.current.reach; x += 8) {
        const y = poolY + noise(x * 0.02 + t * 0.03) * 1.6;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // ripple rings from the impact
      for (let r = 0; r < 5; r++) {
        const phase = (t * 0.005 + r / 5) % 1;
        const radius = phase * W * 0.24;
        const a = (1 - phase) * 0.22;
        ctx.strokeStyle = `rgba(190,232,255,${a})`;
        ctx.lineWidth = 1 + (1 - phase);
        ctx.beginPath();
        ctx.ellipse(impactX, poolY + 4 + radius * 0.16, radius, radius * 0.14, 0, 0, TAU);
        ctx.stroke();
      }

      // downstream flow lines drifting away from the fall
      for (let i = 0; i < 16; i++) {
        const s = i * 3.7;
        const span = W * cfg.current.reach;
        const x = ((frac(s) * span + t * (0.25 + frac(s * 2) * 0.5)) % (span + 80)) - 40;
        const y = poolY + 6 + frac(s * 5.1) * (riverBot - poolY - 10);
        const len = W * 0.02 + frac(s * 7) * W * 0.03;
        const a = 0.1 + 0.14 * Math.abs(Math.sin(t * 0.02 + i));
        ctx.strokeStyle = `rgba(200,238,255,${a})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + len / 2, y - 1.5, x + len, y);
        ctx.stroke();
      }
      ctx.restore();

      // =====================================================================
      // 4. impact foam
      // =====================================================================
      for (let i = 0; i < 16; i++) {
        const s = i * 2.3;
        const x = impactX + noise(s + t * 0.03) * W * 0.05;
        const y = poolY + noise(s * 1.7 + t * 0.026) * 4;
        const r = W * 0.01 + frac(s) * W * 0.02 + Math.sin(t * 0.05 + i) * 2;
        const fg = ctx.createRadialGradient(x, y, 0, x, y, Math.max(1, r));
        fg.addColorStop(0, 'rgba(255,255,255,0.45)');
        fg.addColorStop(0.6, 'rgba(232,248,255,0.16)');
        fg.addColorStop(1, 'rgba(232,248,255,0)');
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, r), 0, TAU);
        ctx.fill();
      }

      // =====================================================================
      // 5. droplets, splash, mist
      // =====================================================================
      if (!reduced && drops.length < MAX_DROPS) {
        // spray peeling off both edges of the sheet
        for (let k = 0; k < 2; k++) {
          const p0 = Math.random() * 0.55;
          const right = Math.random() < 0.5;
          drops.push({
            x: right ? edgeR(p0) + rand(-2, 4) : edgeL(p0) + rand(-4, 2),
            y: p0 * poolY,
            vx: (right ? 1 : -1) * rand(0.05, 0.55),
            vy: rand(0.8, 2.6) + p0 * 5,
            r: rand(0.6, 1.9),
            a: rand(0.3, 0.85),
            kind: 0,
          });
        }
        // mist rising off the impact
        if (t % 3 === 0) {
          drops.push({
            x: impactX + rand(-W * 0.05, W * 0.1),
            y: poolY - rand(0, H * 0.03),
            vx: rand(-0.2, 0.7),
            vy: -rand(0.15, 0.6),
            r: rand(W * 0.012, W * 0.045),
            a: rand(0.04, 0.13),
            kind: 2,
          });
        }
      }

      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];

        if (d.kind === 2) {
          d.x += d.vx;
          d.y += d.vy;
          d.vy *= 0.99;
          d.vx *= 0.985;
          d.r *= 1.006;
          d.a *= 0.986;
          if (d.a < 0.004) { drops.splice(i, 1); continue; }
          const mg = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
          mg.addColorStop(0, `rgba(226,244,255,${d.a})`);
          mg.addColorStop(1, 'rgba(226,244,255,0)');
          ctx.fillStyle = mg;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, TAU);
          ctx.fill();
          continue;
        }

        d.vy += GRAVITY;
        d.x += d.vx;
        d.y += d.vy;

        if (d.kind === 0 && d.y >= poolY) {
          // hits the pool → kick back up as splash
          d.kind = 1;
          d.y = poolY - 1;
          d.vy = -rand(1.4, 4.2);
          d.vx = rand(-1.6, 2.2);
          d.a = rand(0.35, 0.8);
          d.r = rand(0.7, 1.6);
        } else if (d.kind === 1 && d.y > poolY) {
          drops.splice(i, 1);
          continue;
        }

        const stretch = Math.min(d.vy * 1.5, 12);
        ctx.fillStyle = `rgba(244,253,255,${d.a})`;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.r, d.r + Math.max(0, stretch), 0, 0, TAU);
        ctx.fill();
      }

      while (drops.length > MAX_DROPS) drops.shift();

      // =====================================================================
      // 6. duck
      // =====================================================================
      const ds = Math.max(0.7, W * 0.0006);
      const duckMinX = edgeR(1) + W * 0.07;
      const duckMaxX = W * cfg.current.reach * 0.62;
      if (duckX < 0) duckX = duckMinX + (duckMaxX - duckMinX) * 0.4;
      duckX += duckDir * 0.16;
      if (duckX > duckMaxX) duckDir = -1;
      if (duckX < duckMinX) duckDir = 1;
      const bob = Math.sin(t * 0.04) * 3;
      const duckY = poolY + 12 * ds + bob;

      ctx.save();
      ctx.translate(duckX, duckY);
      if (duckDir < 0) ctx.scale(-1, 1);

      // wake
      ctx.strokeStyle = 'rgba(190,230,252,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 9 * ds, 30 * ds + Math.sin(t * 0.05) * 2, 4 * ds, 0, 0, TAU);
      ctx.stroke();

      ctx.fillStyle = 'rgba(16,52,78,0.22)';
      ctx.beginPath();
      ctx.ellipse(0, 13 * ds, 26 * ds, 5 * ds, 0, 0, TAU);
      ctx.fill();

      const bodyGrad = ctx.createRadialGradient(-4 * ds, -4 * ds, 2 * ds, 0, 0, 28 * ds);
      bodyGrad.addColorStop(0, '#f5f0e0');
      bodyGrad.addColorStop(0.4, '#e8e0c8');
      bodyGrad.addColorStop(0.8, '#c8bc98');
      bodyGrad.addColorStop(1, '#a89870');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(0, 2 * ds, 26 * ds, 13 * ds, -0.1, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = 'rgba(160,145,110,0.6)';
      ctx.lineWidth = 0.8 * ds;
      ctx.beginPath();
      ctx.moveTo(-8 * ds, -2 * ds);
      ctx.bezierCurveTo(2 * ds, 4 * ds, 12 * ds, 6 * ds, 18 * ds, 2 * ds);
      ctx.stroke();

      ctx.fillStyle = '#d4c89a';
      ctx.beginPath();
      ctx.moveTo(-20 * ds, -2 * ds);
      ctx.bezierCurveTo(-28 * ds, -8 * ds, -30 * ds, -2 * ds, -26 * ds, 4 * ds);
      ctx.bezierCurveTo(-24 * ds, 8 * ds, -18 * ds, 6 * ds, -16 * ds, 2 * ds);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#b8a870';
      ctx.beginPath();
      ctx.ellipse(16 * ds, -8 * ds, 7 * ds, 9 * ds, 0.3, 0, TAU);
      ctx.fill();

      const headGrad = ctx.createRadialGradient(18 * ds, -16 * ds, 1 * ds, 18 * ds, -16 * ds, 9 * ds);
      headGrad.addColorStop(0, '#4a9060');
      headGrad.addColorStop(0.5, '#2d7040');
      headGrad.addColorStop(1, '#1a5028');
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.arc(18 * ds, -17 * ds, 9 * ds, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 2.5 * ds;
      ctx.beginPath();
      ctx.ellipse(16 * ds, -8 * ds, 6 * ds, 3 * ds, 0.3, 0, TAU);
      ctx.stroke();

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

      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(21 * ds, -19 * ds, 2 * ds, 0, TAU);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(21.8 * ds, -19.8 * ds, 0.7 * ds, 0, TAU);
      ctx.fill();
      ctx.restore();

      // =====================================================================
      // 7. hard boundaries — nothing lives past the river
      // =====================================================================
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';

      // fade out downward, then erase everything below
      const fadeTop = riverBot - H * 0.09;
      const fb = ctx.createLinearGradient(0, fadeTop, 0, riverBot);
      fb.addColorStop(0, 'rgba(0,0,0,0)');
      fb.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = fb;
      ctx.fillRect(0, fadeTop, W, riverBot - fadeTop);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, riverBot, W, H - riverBot + 2);

      // fade out toward the right so it never sits behind copy
      const fadeStart = W * cfg.current.reach * 0.62;
      const fr = ctx.createLinearGradient(fadeStart, 0, W * cfg.current.reach, 0);
      fr.addColorStop(0, 'rgba(0,0,0,0)');
      fr.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = fr;
      ctx.fillRect(fadeStart, 0, W - fadeStart, H);
      ctx.restore();
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}

interface ForestEnvironmentProps {
  variant?: 'applicant' | 'admin';
  waterline?: number;
  reach?: number;
}

export function ForestEnvironment({ waterline, reach }: ForestEnvironmentProps) {
  return <WaterfallScene waterline={waterline} reach={reach} />;
}