'use client';

import { useEffect, useRef } from 'react';

/**
 * HeroWave — single canvas-rendered wave mesh, scoped to the Hero section.
 *
 * Replaces the full-page WaveBackground that was reported (2026-05-16
 * round 4) as too busy — lines flowing across every section overlapped
 * content and competed for attention.
 *
 * New design, matching owner's reference video (Waving Technology Grids):
 *   - Single horizontal wave band, not full-page scattered lines.
 *   - 70 thin parallel lines clustered in a narrow vertical band (50–95%
 *     of hero height — bottom half only).
 *   - Density + alpha peak at the centre of the band and fade at the
 *     edges, producing a wave-mesh that reads as one structure.
 *   - Lives INSIDE the Hero section (absolute, parent-relative), so
 *     ContentSections (Threats / Pipeline / Architecture / etc.) below
 *     see a plain dark-navy body background. Zero overlap with the
 *     content-heavy parts of the page.
 *   - prefers-reduced-motion: draws a single static frame (lines visible,
 *     no animation). visibilitychange pauses the rAF loop on tab blur.
 */

interface Line {
  baseFrac: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  width: number;
  alpha: number;
}

const LINE_COUNT = 70;

function makeLines(): Line[] {
  return Array.from({ length: LINE_COUNT }, (_, i) => {
    const t = i / (LINE_COUNT - 1);
    // Band spans 50 % → 95 % of canvas height (bottom half of hero).
    const baseFrac = 0.5 + t * 0.45;
    // Density/alpha peaks at the centre of the band; fades at edges with
    // a cosine falloff so the band reads as one cohesive structure.
    const distFromCenter = Math.abs(t - 0.5) * 2;
    const alphaFalloff = Math.cos((distFromCenter * Math.PI) / 2);
    return {
      baseFrac,
      amplitude: 26 + Math.random() * 10,
      frequency: 360 + Math.random() * 60,
      speed: 0.00018 + Math.random() * 0.00003,
      phase: i * 0.04 + Math.random() * 0.15,
      width: 0.6 + Math.random() * 0.4,
      alpha: 0.5 * alphaFalloff,
    };
  });
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  lines: Line[],
  width: number,
  height: number,
  time: number,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const line of lines) {
    const baseY = line.baseFrac * height;
    ctx.strokeStyle = `rgba(34, 211, 238, ${line.alpha})`;
    ctx.lineWidth = line.width;
    ctx.shadowBlur = 14;
    ctx.shadowColor = `rgba(103, 232, 249, ${Math.min(1, line.alpha * 1.8)})`;

    ctx.beginPath();
    const STEP = 4;
    for (let x = -STEP; x <= width + STEP; x += STEP) {
      const y =
        baseY +
        line.amplitude *
          Math.sin(x / line.frequency + time * line.speed + line.phase);
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

    const resize = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(ctx, lines, width, height, performance.now());
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
      if (running) drawFrame(ctx, lines, width, height, time);
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
