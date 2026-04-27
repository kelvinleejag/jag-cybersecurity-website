'use client';
import { ReactNode } from 'react';

/**
 * FadeInOnScroll — CSS-only fade-in wrapper.
 *
 * Renders a div with the `animate-fade-in-up` Tailwind utility (defined
 * in tailwind.config.ts). Animation fires on element mount; for a
 * single-page landing site this is acceptable and avoids the
 * IntersectionObserver class of bugs that plagued the prior framer-motion
 * implementations.
 *
 * History (do not revert):
 *   1. whileInView + once:true + margin   → sections invisible.
 *   2. useInView hook + deterministic init → sections invisible
 *      (commit 81fb7f8 type-checked + built clean but headless render
 *      showed 39 wrappers stuck at opacity:0; transform:translateY(16px)).
 * Spec: docs/superpowers/specs/2026-04-25-fade-animation-css-refactor-design.md
 */
export function FadeInOnScroll({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number; // seconds — matches prior API for staggered effects
}) {
  return (
    <div
      className={`animate-fade-in-up ${className}`}
      style={delay > 0 ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
