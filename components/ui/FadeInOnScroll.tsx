import { ReactNode } from 'react';

/**
 * FadeInOnScroll — CSS-keyframe fade-in wrapper.
 *
 * Behaviour (post-2026-05-16 simplification):
 *   - Always applies `animate-fade-in-up` on render. Browser handles the
 *     animation entirely via CSS — no JS state, no IntersectionObserver, no
 *     fallback timer.
 *   - `delay` applies as CSS `animation-delay` so callers can stagger.
 *   - The fade-in-up keyframe in tailwind.config.ts uses `animation-fill-mode:
 *     both`, so the element is at opacity:0 during the delay window and stays
 *     at opacity:1 after the keyframe completes.
 *   - `prefers-reduced-motion: reduce` is covered by the app/globals.css
 *     blanket short-circuit (animation-duration: 0.01ms) — animation
 *     effectively snaps to the end state, element renders visible.
 *
 * Why this is simpler than the prior IntersectionObserver design:
 *   - React Strict Mode (Next.js dev) double-invokes effects. The previous
 *     pattern set up observer A + timer A in the first effect, cleaned them
 *     up, then set up observer B + timer B in the second effect. In some
 *     dev scenarios neither observer's initial callback nor the 1500ms
 *     fallback fired before the user inspected the page, leaving wrappers
 *     stuck at opacity:0. Removing the JS state machine entirely eliminates
 *     that whole class of failure.
 *   - For above-fold elements: animation runs on mount (was the desired
 *     behavior anyway — Hero text fades in immediately).
 *   - For below-fold elements: animation runs during initial render (user
 *     can't see it). By the time the user scrolls down, content is already
 *     at the end state. The "fade in on scroll" affordance is lost, but the
 *     brief's restraint aesthetic doesn't actually require scroll-triggered
 *     reveals — and the page-load fade-in is the same charter §3.2 motion
 *     language.
 *
 * Public API: identical to prior version (named + default export, delay in
 * seconds, optional className passthrough). Drop-in replacement.
 *
 * History (do not revert without justification):
 *   1. framer-motion `whileInView` → sections invisible.
 *   2. framer-motion `useInView` deterministic init → sections invisible
 *      (commit 81fb7f8 type-checked + built clean but headless render
 *      showed 39 wrappers stuck at opacity:0).
 *   3. CSS-only always-on (no observer) → worked but couldn't stagger.
 *   4. Native IntersectionObserver + setTimeout fallback → worked in
 *      production (Playwright/build), broke in Next.js dev under React 18
 *      Strict Mode double-invocation (reported 2026-05-16).
 *   5. Current: pure CSS animation. No JS state. Robust under both dev and
 *      prod. Stagger handled by CSS animation-delay. Fade-in-up keyframe
 *      uses animation-fill-mode: both so delay shows starting state.
 */
interface Props {
  children: ReactNode;
  className?: string;
  /** Animation delay in **seconds**. */
  delay?: number;
}

export function FadeInOnScroll({ children, className = '', delay = 0 }: Props) {
  return (
    <div
      style={delay > 0 ? { animationDelay: `${delay}s` } : undefined}
      className={`animate-fade-in-up ${className}`}
    >
      {children}
    </div>
  );
}

export default FadeInOnScroll;
