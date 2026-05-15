'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * MetricCounter — number ramp-up animation triggered when scrolled into view,
 * with a 1.5 s fallback timer that guarantees the count-up runs even if the
 * IntersectionObserver never fires.
 *
 * History (do not revert):
 *   The previous motion.div wrapper used framer-motion's animate prop to
 *   transition opacity from 0→1, gated on framer-motion's useInView hook.
 *   In Next.js 14 + React 18 + framer-motion 11, that useInView never flipped
 *   in headless render and (per user report) in production, leaving the four
 *   metric values stuck invisible at opacity:0. Replaced with a hand-rolled
 *   IntersectionObserver + setTimeout race: whichever signal fires first
 *   triggers the count-up and cancels the other. framer-motion was removed
 *   from this file entirely so it cannot be a failure point. The fade-in
 *   itself is now a pure-CSS keyframe (.animate-fade-in-up, defined in
 *   tailwind.config.ts).
 *
 * Spec: docs/superpowers/specs/2026-04-25-fade-animation-css-refactor-design.md
 *   (§4 in the spec called for keeping useInView; main-agent Task 5 dispatch
 *   superseded that — see commit message for the full rationale.)
 */

function parseNumeric(value: string): { num: number; suffix: string; prefix: string } | null {
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] };
}

export function MetricCounter({
  value,
  label,
  numberClassName = 'font-mono text-4xl md:text-5xl font-medium text-accent tabular-nums animate-fade-in-up',
  labelClassName = 'mt-3 text-sm text-text-secondary leading-snug',
}: {
  value: string;
  label: string;
  numberClassName?: string;
  labelClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const parsed = useMemo(() => parseNumeric(value), [value]);
  const [display, setDisplay] = useState(
    parsed ? `${parsed.prefix}0${parsed.suffix}` : value
  );

  useEffect(() => {
    // Non-numeric value (defensive): no animation possible.
    if (!parsed) return;

    // prefers-reduced-motion: skip the count-up entirely, snap to final value.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    const element = ref.current;
    if (!element) return;

    let frame = 0;
    let started = false;

    const animateCount = () => {
      if (started) return;
      started = true;
      const duration = 1200;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = parsed.num * eased;
        const formatted = Number.isInteger(parsed.num)
          ? Math.round(current).toString()
          : current.toFixed(1);
        setDisplay(`${parsed.prefix}${formatted}${parsed.suffix}`);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    // Observer triggers when element scrolls into view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) animateCount();
      },
      { threshold: 0.3 },
    );
    observer.observe(element);

    // 1.5 s fallback in case observer never fires (hidden tab, SSR edge case).
    const fallbackTimer = setTimeout(animateCount, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [parsed, value]);

  return (
    <div ref={ref} className="text-center">
      <div className={numberClassName}>{display}</div>
      <p className={labelClassName}>{label}</p>
    </div>
  );
}
