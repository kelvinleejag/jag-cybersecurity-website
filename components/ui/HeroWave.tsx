'use client';

import { useEffect, useRef } from 'react';

/**
 * HeroWave — canvas-rendered audio-waveform-style wave mesh, scoped to
 * the Hero section.
 *
 * v6 (2026-05-16 round 6): owner provided 8 new reference frames from the
 * motionarray Waving Ribbons / Technology Grids family. Common features
 * across all 8 frames:
 *   - Wave enters from the LEFT as a single thin horizontal line.
 *   - Expands rightward into a wide mesh of ~50-80 thin parallel lines.
 *   - Has localized humps of high amplitude (the "audio" feel) — one
 *     section peaks high, another stays flat, peaks shift over time.
 *   - Mesh thickness varies along x: collapsed on the left (single line),
 *     fully spread on the right (where the action is).
 *   - Sparkle particles scattered around the wave area.
 *   - Cyan glow on dark navy.
 *
 * Implementation:
 *   1. 80 thin lines, each at a fixed vertical offset (spreadFrac) from
 *      the band centre. ALL lines coalesce to the same baseY when the
 *      local envelope is 0 — this produces the single thin line on the
 *      left. As the envelope grows, each line moves to its allotted
 *      vertical offset, fanning the mesh open.
 *   2. envelopeAt(xNorm, time) — sum of three traveling Gaussian peaks
 *      with morphing positions/widths/heights, gated by a "growth"
 *      multiplier that's 0 from x=0 to x~0.10 and ramps to 1 by x~0.45.
 *      The growth multiplier is the "entering from left" effect; the
 *      Gaussians supply the audio-visualizer dynamics.
 *   3. 50 particles drift slowly. Alpha modulated by distance from
 *      band centre AND by local envelope, so particles look like
 *      "wave debris" — brighter where the wave is loud.
 *
 * Charter compliance: prefers-reduced-motion draws a static frame;
 * visibilitychange pauses rAF; DPR capped at 2.
 */

interface Line {
  spreadFrac: number; // -0.5 to 0.5 — relative vertical position inside mesh
  frequency: number;
  speed: number;
  phase: number;
  width: number;
  alpha: number;
}

interface Particle {
  x: number; // 0..1 normalized
  y: number; // 0..1 normalized
  size: number;
  alpha: number;
  driftX: number;
  driftY: number;
}

const LINE_COUNT = 80;
const PARTICLE_COUNT = 55;
const BAND_CENTER_Y = 0.62;
const MESH_THICKNESS_FRAC = 0.22; // max vertical fan-out of the mesh (fraction of canvas height)

function makeLines(): Line[] {
  return Array.from({ length: LINE_COUNT }, (_, i) => {
    const t = i / (LINE_COUNT - 1) - 0.5; // -0.5 to +0.5
    return {
      spreadFrac: t,
      frequency: 260 + Math.random() * 80,
      speed: 0.00018 + Math.random() * 0.00006,
      phase: i * 0.06 + Math.random() * 0.2,
      width: 0.4 + Math.random() * 0.4,
      alpha: 0.3 + Math.random() * 0.35,
    };
  });
}

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random(),
    y: BAND_CENTER_Y + (Math.random() - 0.5) * 0.28,
    size: 0.5 + Math.random() * 1.4,
    alpha: 0.35 + Math.random() * 0.5,
    driftX: 0.00008 + Math.random() * 0.00018, // drift slowly right
    driftY: (Math.random() - 0.5) * 0.0001,
  }));
}

/**
 * envelopeAt — returns 0..1 multiplier for amplitude + mesh-spread at
 * a given normalized x position and time. Composed of:
 *   - growth: 0 from x∈[0, 0.05], ramps to 1 by x=0.45 (the "entering
 *     from left" effect)
 *   - peaks: sum of three Gaussian peaks whose centres, widths, and
 *     heights morph sinusoidally on different periods so the bursts
 *     shift without ever exactly repeating
 */
function envelopeAt(xNorm: number, time: number): number {
  const t = time * 0.0003;

  const growth = Math.min(1, Math.max(0, (xNorm - 0.05) / 0.4));

  const p1pos = 0.45 + 0.15 * Math.sin(t * 0.9);
  const p1w = 0.12 + 0.05 * Math.sin(t * 0.7 + 1);
  const p1h = 0.65 + 0.35 * Math.sin(t * 0.5 + 2);

  const p2pos = 0.68 + 0.15 * Math.sin(t * 1.1 + 2);
  const p2w = 0.14 + 0.05 * Math.sin(t * 0.8 + 0.5);
  const p2h = 0.8 + 0.35 * Math.sin(t * 0.6 + 1.2);

  const p3pos = 0.88 + 0.08 * Math.sin(t * 0.8 + 4);
  const p3w = 0.09 + 0.03 * Math.sin(t * 1.0);
  const p3h = 0.55 + 0.4 * Math.sin(t * 0.7 + 3);

  const b1 =
    Math.max(0, p1h) *
    Math.exp(-Math.pow((xNorm - p1pos) / Math.max(0.02, p1w), 2));
  const b2 =
    Math.max(0, p2h) *
    Math.exp(-Math.pow((xNorm - p2pos) / Math.max(0.02, p2w), 2));
  const b3 =
    Math.max(0, p3h) *
    Math.exp(-Math.pow((xNorm - p3pos) / Math.max(0.02, p3w), 2));

  return Math.min(1, growth * Math.min(1.15, b1 + b2 + b3));
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  lines: Line[],
  particles: Particle[],
  width: number,
  height: number,
  time: number,
) {
  ctx.clearRect(0, 0, width, height);

  const baseY = BAND_CENTER_Y * height;
  const maxAmplitude = height * 0.14;
  const meshSpreadPx = height * MESH_THICKNESS_FRAC;

  // ---------- Particles (drawn first, behind the lines) ----------
  for (const p of particles) {
    p.x += p.driftX;
    p.y += p.driftY;
    if (p.x > 1.05) p.x = -0.05;
    if (p.x < -0.05) p.x = 1.05;
    if (p.y > 1) p.y -= 1;
    if (p.y < 0) p.y += 1;

    const distFromBand = Math.abs(p.y - BAND_CENTER_Y);
    const bandAlpha = Math.max(0, 1 - distFromBand / 0.18);
    const env = envelopeAt(p.x, time);
    const alpha = p.alpha * bandAlpha * (0.15 + 0.85 * env);

    if (alpha > 0.015) {
      ctx.fillStyle = `rgba(186, 230, 253, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ---------- Wave lines (mesh) ----------
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const line of lines) {
    ctx.strokeStyle = `rgba(34, 211, 238, ${line.alpha})`;
    ctx.lineWidth = line.width;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(103, 232, 249, ${Math.min(1, line.alpha * 1.6)})`;

    ctx.beginPath();
    const STEP = 3;
    for (let x = -STEP; x <= width + STEP; x += STEP) {
      const xNorm = x / width;
      const env = envelopeAt(xNorm, time);
      // verticalSpread: when env=0 → 0 (all lines collapsed to baseY);
      // when env=1 → spreadFrac * meshSpreadPx (lines fanned out).
      const verticalSpread = line.spreadFrac * meshSpreadPx * env;
      const oscillation =
        maxAmplitude *
        env *
        Math.sin(x / line.frequency + time * line.speed + line.phase);
      const y = baseY + verticalSpread + oscillation;
      if (x === -STEP) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

export function HeroWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = parent.clientWidth;
    let height = parent.clientHeight;
    const lines = makeLines();
    const particles = makeParticles();

    const resize = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(ctx, lines, particles, width, height, performance.now());
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      return () => ro.disconnect();
    }

    let running = document.visibilityState === 'visible';
    const onVis = () => {
      running = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVis);

    let rafId = 0;
    const tick = (time: number) => {
      if (running) drawFrame(ctx, lines, particles, width, height, time);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
