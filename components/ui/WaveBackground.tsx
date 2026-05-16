'use client';

import { useEffect, useRef } from 'react';

/**
 * WaveBackground — canvas-rendered parallel sine-wave ribbons.
 *
 * v3 (2026-05-16 round 3): waves were invisible in the previous build —
 * alpha was too low (0.22-0.5) for the lines to read against the pure-black
 * #05080F field, and early-return on prefers-reduced-motion left the canvas
 * literally blank for any user with motion preferences set. Both fixed:
 *   - alpha bumped to 0.5-0.95
 *   - shadowBlur bumped to 28
 *   - stroke width bumped
 *   - line count bumped from 14 to 18
 *   - reduced-motion now draws a single static frame (lines visible, no
 *     animation) instead of returning early
 *
 * Charter compliance:
 *   - visibilitychange: paused on tab blur to save battery
 *   - DPR capped at 2 to avoid burning fill rate on retina
 *   - Single rAF loop; cleanup cancels it
 *   - Bundle delta: ~3 kB code; no dependencies
 */

interface Line {
  baseFrac: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  width: number;
  alpha: number;
  hueShift: number;
}

const COLORS = {
  cyan: '34, 211, 238',
  cyanBright: '103, 232, 249',
  cyanDeep: '8, 145, 178',
};

function pickColor(line: Line): string {
  if (line.hueShift > 0.33) return COLORS.cyanBright;
  if (line.hueShift < -0.33) return COLORS.cyanDeep;
  return COLORS.cyan;
}

function makeLines(): Line[] {
  const LINE_COUNT = 18;
  return Array.from({ length: LINE_COUNT }, (_, i) => {
    const t = i / (LINE_COUNT - 1);
    return {
      baseFrac: 0.05 + t * 0.9 + (Math.random() - 0.5) * 0.015,
      amplitude: 32 + Math.random() * 28,
      frequency: 240 + Math.random() * 220,
      speed: 0.00018 + Math.random() * 0.00014,
      phase: Math.random() * Math.PI * 2,
      width: 1.5 + Math.random() * 1.8,
      alpha: 0.5 + Math.random() * 0.45,
      hueShift: (Math.random() - 0.5) * 2,
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
    const color = pickColor(line);
    ctx.strokeStyle = `rgba(${color}, ${line.alpha})`;
    ctx.lineWidth = line.width;
    ctx.shadowBlur = 28;
    ctx.shadowColor = `rgba(${color}, ${Math.min(1, line.alpha * 1.8)})`;

    ctx.beginPath();
    const STEP = 6;
    for (let x = -STEP; x <= width + STEP; x += STEP) {
      const y =
        baseY +
        line.amplitude *
          Math.sin(x / line.frequency + time * line.speed + line.phase) +
        line.amplitude *
          0.35 *
          Math.sin(
            x / (line.frequency * 0.45) +
              time * line.speed * 1.7 +
              line.phase * 1.3,
          );
      if (x === -STEP) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    const lines = makeLines();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Re-draw immediately after resize so the lines never blank out.
      drawFrame(ctx, lines, width, height, performance.now());
    };
    resize();
    window.addEventListener('resize', resize);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      // Static frame — lines visible, no animation. Avoids the prior
      // failure mode where reduced-motion users saw a completely blank
      // canvas.
      return () => {
        window.removeEventListener('resize', resize);
      };
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
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 bg-bg-base"
      aria-hidden="true"
    />
  );
}
