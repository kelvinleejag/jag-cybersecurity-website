'use client';

import { useEffect, useRef } from 'react';

/**
 * WaveBackground — canvas-rendered parallel sine-wave ribbons.
 *
 * Replaces the prior SVG `RibbonBackground` (which was a static set of
 * gaussian-blurred bezier paths translating horizontally — owner reported
 * 2026-05-16 it looked static / not animated enough). This version draws
 * ~14 parallel glowing lines that genuinely undulate using sin() with
 * per-line phase, amplitude, frequency, and speed variance — closer to
 * the "Waving Ribbons of Light Loop" motionarray reference.
 *
 * Charter compliance:
 *   - prefers-reduced-motion: returns early, canvas stays empty. The
 *     globals.css blanket short-circuit covers any related transitions.
 *   - visibilitychange: paused on tab blur to save battery.
 *   - DPR capped at 2 to avoid burning fill rate on retina.
 *   - Lines drawn with shadowBlur for glow without WebGL.
 *   - Single rAF loop. Cleanup on unmount cancels the loop.
 *   - Bundle delta: ~3 kB code; no dependencies.
 */

interface Line {
  baseFrac: number;     // baseline Y as fraction of canvas height (0..1)
  amplitude: number;    // pixel-amplitude of the sine wave
  frequency: number;    // wavelength in pixels
  speed: number;        // phase advance per ms
  phase: number;        // initial phase offset
  width: number;        // stroke width
  alpha: number;        // base opacity (0..1)
  hueShift: number;     // 0=brand-cyan, 1=cyanBright, -1=cyanDeep
}

const COLORS = {
  cyan: '34, 211, 238',        // brand.cyan
  cyanBright: '103, 232, 249', // brand.cyanBright
  cyanDeep: '8, 145, 178',     // brand.cyanDeep
};

function pickColor(line: Line): string {
  if (line.hueShift > 0.33) return COLORS.cyanBright;
  if (line.hueShift < -0.33) return COLORS.cyanDeep;
  return COLORS.cyan;
}

function makeLines(): Line[] {
  // Distribute lines vertically across the viewport with slight jitter
  // so they read as a coherent "ribbon band" rather than a perfect grid.
  const LINE_COUNT = 14;
  return Array.from({ length: LINE_COUNT }, (_, i) => {
    const t = i / (LINE_COUNT - 1);
    return {
      baseFrac: 0.08 + t * 0.84 + (Math.random() - 0.5) * 0.02,
      amplitude: 28 + Math.random() * 22,
      frequency: 280 + Math.random() * 220,
      speed: 0.00018 + Math.random() * 0.00012,
      phase: Math.random() * Math.PI * 2,
      width: 1.2 + Math.random() * 1.4,
      alpha: 0.22 + Math.random() * 0.28,
      hueShift: (Math.random() - 0.5) * 2,
    };
  });
}

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    };
    resize();
    window.addEventListener('resize', resize);

    let running = document.visibilityState === 'visible';
    const onVis = () => {
      running = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVis);

    let rafId = 0;
    const tick = (time: number) => {
      if (running) {
        ctx.clearRect(0, 0, width, height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (const line of lines) {
          const baseY = line.baseFrac * height;
          const color = pickColor(line);
          ctx.strokeStyle = `rgba(${color}, ${line.alpha})`;
          ctx.lineWidth = line.width;
          ctx.shadowBlur = 18;
          ctx.shadowColor = `rgba(${color}, ${Math.min(1, line.alpha * 2.2)})`;

          ctx.beginPath();
          const STEP = 6;
          for (let x = -STEP; x <= width + STEP; x += STEP) {
            // Two stacked sine waves at different frequencies and speeds
            // produce non-repeating organic motion instead of a clean sine.
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
