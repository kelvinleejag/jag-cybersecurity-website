'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

/**
 * FadeInOnScroll — CSS-keyframe fade-in wrapper with IntersectionObserver gating.
 *
 * Behaviour:
 *   - On mount: hidden (opacity: 0) until the wrapper crosses 10% into view,
 *     at which point we apply the `animate-fade-in-up` Tailwind utility.
 *   - A 1500 ms `setTimeout` fallback flips visibility to true if the
 *     observer never fires (covers SSR + Strict-Mode + hidden-tab edge cases
 *     that caused the framer-motion regression documented in spec
 *     docs/superpowers/specs/2026-04-25-fade-animation-css-refactor-design.md).
 *   - `prefers-reduced-motion`: bypass the observer and reveal immediately.
 *
 * Public API:
 *   - Named export (back-compat with existing section consumers).
 *   - Default export (forward-compat for new Phase B+ components).
 *   - `delay` is in **seconds** (back-compat). Forwarded as CSS
 *     `animation-delay` once visible.
 *
 * History (do not revert without justification):
 *   1. framer-motion `whileInView` → sections invisible.
 *   2. framer-motion `useInView` deterministic init → sections invisible
 *      (commit 81fb7f8 type-checked + built clean but headless render
 *      showed 39 wrappers stuck at opacity:0).
 *   3. CSS-only always-on (no observer) → worked but couldn't stagger
 *      based on viewport intersection.
 *   4. Current: native IntersectionObserver + setTimeout fallback +
 *      reduced-motion guard. Bundle delta vs framer-motion: −36 kB.
 */
interface Props {
  children: ReactNode;
  className?: string;
  /** Animation delay in **seconds**. Matches prior API. */
  delay?: number;
}

export function FadeInOnScroll({ children, className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const fallback = window.setTimeout(() => setVisible(true), 1500);
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            window.clearTimeout(fallback);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
    );
    if (ref.current) obs.observe(ref.current);
    return () => {
      window.clearTimeout(fallback);
      obs.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={visible && delay > 0 ? { animationDelay: `${delay}s` } : undefined}
      className={`${visible ? 'animate-fade-in-up' : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  );
}

export default FadeInOnScroll;
