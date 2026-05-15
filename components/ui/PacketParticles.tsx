'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  lane: number;
  progress: number;
  speed: number;
  blocked: boolean;
  blockProgress: number;
}

const LANES = 5;
const MAX_PARTICLES = 60;
const EMIT_INTERVAL_MS = 80;
const SHIELD_X = 0.5;
const BLOCK_CHANCE = 0.04;

export function PacketParticles({ width = 900, height = 500 }: { width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    let running = false;
    let rafId = 0;
    let lastEmit = 0;
    const particles: Particle[] = [];

    const tick = (now: number) => {
      if (!running) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      if (now - lastEmit > EMIT_INTERVAL_MS && particles.length < MAX_PARTICLES) {
        particles.push({
          lane: Math.floor(Math.random() * LANES),
          progress: 0,
          speed: 0.0025 + Math.random() * 0.0015,
          blocked: false,
          blockProgress: 0,
        });
        lastEmit = now;
      }
      ctx.clearRect(0, 0, width, height);
      const laneSpacing = height / (LANES + 1);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p.blocked) {
          p.progress += p.speed;
          if (p.progress >= SHIELD_X && Math.random() < BLOCK_CHANCE) p.blocked = true;
          if (p.progress > 1) {
            particles.splice(i, 1);
            continue;
          }
        } else {
          p.blockProgress += 0.04;
          if (p.blockProgress >= 1) {
            particles.splice(i, 1);
            continue;
          }
        }
        const y = laneSpacing * (p.lane + 1);
        const x = p.progress * width;
        ctx.beginPath();
        if (p.blocked) {
          ctx.fillStyle = `rgba(239, 68, 68, ${1 - p.blockProgress})`;
        } else {
          const alpha = p.progress < SHIELD_X ? 0.7 : 0.5;
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
        }
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && document.visibilityState === 'visible';
      },
      { threshold: 0.1 },
    );
    obs.observe(wrapper);

    const onVis = () => {
      running = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVis);

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      obs.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [width, height]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
