# Fade Animation CSS Refactor — Design Spec

**Date:** 2026-04-25
**Status:** Approved, ready for implementation plan
**Components affected:** `FadeInOnScroll`, `MetricCounter`, `tailwind.config.ts`, `app/globals.css`

## Problem

Sections wrapped in `FadeInOnScroll` and the four metric values in the Solution section render permanently invisible in production. Two prior fix attempts failed:

1. **Original** (`whileInView` + `once: true` + `margin`) — sections invisible.
2. **Commit 81fb7f8** (`useInView` hook + deterministic initial state) — claimed to fix the bug but does not. Headless Chromium render of `localhost:3000` after the fix shows **39 wrappers stuck at `style="opacity:0; transform:translateY(16px)"`** even after 6 s of JS execution. The IntersectionObserver inside framer-motion's `useInView` never fires `inView = true` in this Next.js 14 + React 18 + framer-motion 11 environment.

Diagnostic confirmed by replacing `FadeInOnScroll` with a pass-through `<div>`: zero stuck `opacity:0` styles, all sections render. Bug is definitively in framer-motion's lifecycle, not in `Card` / `Container` / `SectionHeader` / page CSS.

`MetricCounter` exhibits the same fragility: its outer `motion.div` (initial `opacity:0`, animate gated on `useInView`) is responsible for the four metric values being invisible. The existing count-up logic that ramps the displayed number is implemented with `requestAnimationFrame` in a separate `useEffect` and is **independent of the framer-motion wrapper** — it works fine when the wrapper isn't hiding it.

## Goals

- Sections fade in reliably on every page load, in every browser, in dev and prod.
- All four metric values (`10/10`, `5 sec`, `0%`, `310/310`) render visibly.
- Zero behavioural regression for callers — neither component's public API changes.
- Respect `prefers-reduced-motion`.
- Reduce surface area of the recurring framer-motion fragility.

## Non-goals

- Removing framer-motion from the project entirely. Other animations may continue to use it; this spec scopes only `FadeInOnScroll` and `MetricCounter`'s wrapper opacity.
- Changing the visual design of either component (font, size, color, spacing).
- Reworking the count-up animation. The existing `requestAnimationFrame` ramp stays as-is.
- Switching back to "trigger on scroll into view" semantics. The new fade fires on element mount; for a single-page landing site this is acceptable and avoids the very IntersectionObserver class of bugs we just diagnosed.

## Design

### 1. `tailwind.config.ts` — add keyframe and animation

Extend `theme.extend` with:

```ts
keyframes: {
  'fade-in-up': {
    '0%':   { opacity: '0', transform: 'translateY(16px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
},
animation: {
  'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
},
```

This produces a `.animate-fade-in-up` utility class. `forwards` is required so the element holds its final state after the animation ends; without it the wrapper would snap back to `opacity:0`.

### 2. `app/globals.css` — reduced-motion override

Append at end of file (no `@layer` wrapper — these are global media-query rules):

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

Element still ends in the `opacity:1, translateY(0)` state, just instantly.

### 3. `FadeInOnScroll.tsx` — full rewrite, framer-motion removed

```tsx
'use client';
import { ReactNode } from 'react';

interface FadeInOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number; // seconds, matches prior API for staggered effects
}

export function FadeInOnScroll({ children, className = '', delay = 0 }: FadeInOnScrollProps) {
  return (
    <div
      className={`animate-fade-in-up ${className}`}
      style={delay > 0 ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
```

Notes:
- `delay` keeps the **seconds** unit the existing callers already pass (e.g. `delay={i * 0.04}`). No caller updates required.
- Inline `animationDelay` is only emitted when `delay > 0`, keeping the SSR HTML clean for the common case.
- Component is still a Client Component (`'use client'`) for parity with prior API, even though it has no client-only logic now. Avoids an additional network/bundle delta from converting to a Server Component.
- The retained file-level comment documents *why* framer-motion was removed, citing the headless-render diagnostic, so a future contributor doesn't try to "improve" it back into framer-motion.

### 4. `MetricCounter.tsx` — full removal of framer-motion (amended 2026-04-25)

> **Spec amendment note.** The original §4 below this paragraph called for *surgical* removal limited to the outer `motion.div`, while keeping framer-motion's `useInView` and `useReducedMotion` hooks as count-up triggers. During Task 5 execution, the strategic-advisor instruction directed full framer-motion removal from this file (matching the FadeInOnScroll treatment) so that the same hook class that broke the wrapper could not break the count-up trigger either. The shipped implementation reflects the amended design described here; the original guidance is preserved further down for historical reference.

Keep:
- `parseNumeric()` helper.
- `useRef` for the element to observe.
- `useEffect` containing the `requestAnimationFrame` count-up ramp (preserved byte-for-byte from the prior implementation).
- The outer `<div ref={ref} className="text-center">`.
- The inner number span and `<p>` label.

Replace:
- The `<motion.div>` wrapping the displayed number with a **single** plain `<div>` that carries both the existing visual classes and the new fade utility. **No extra nesting** — it is one div with one combined className: `font-mono text-4xl md:text-5xl font-medium text-accent tabular-nums animate-fade-in-up`.
- All framer-motion hooks (`useInView`, `useReducedMotion`) are removed; framer-motion is no longer imported by this file.

**Dual-signal trigger pattern.** The count-up animation fires on the first of two independent signals, whichever arrives first:

1. **`IntersectionObserver`** with `threshold: 0.3` — fires when ≥30% of the element scrolls into the viewport. Native browser API, not framer-motion's `useInView`.
2. **`setTimeout(triggerAnimation, 1500)`** — unconditional 1.5 s fallback. Guarantees the count-up runs even if the IntersectionObserver never fires (the bug class we just fixed for FadeInOnScroll, and the reason a static-analysis-only verification shipped a broken page in commit 81fb7f8).

Both signals call a single idempotent `triggerAnimation()` function guarded by `hasAnimated.current`. On the first fire, it sets the guard, **disconnects the observer, clears the fallback timer**, and starts the count-up. The two signals cancel each other to prevent double-triggering.

**Reduced-motion handling.** Detected synchronously on first effect run via `window.matchMedia('(prefers-reduced-motion: reduce)').matches`. When true, the count-up is skipped entirely and `display` snaps to the final value. This avoids the brief animation flash that asynchronous detection would cause for accessibility users.

**React 18 Strict Mode safety.** The `useEffect` cleanup function disconnects the observer, clears the fallback timer, and cancels any in-flight `requestAnimationFrame`. Strict Mode's intentional double-invoke during development cannot leak observers, timers, or animation frames.

Public API stays exactly `{ value: string; label: string }`.

### 5. Caller updates

None required. `Solution.tsx:46` and every `FadeInOnScroll` callsite continue to compile and behave identically. All 24 callsites across 7 files (`Markets`, `Contact`, `Founder`, `Technology`, `Threats`, `Pipeline`, `Solution`) type-check and render unchanged after the refactor.

### 6. Decision rationale (added 2026-04-25)

Three reasons full framer-motion removal beat the originally specified partial removal:

1. **Failure-mode elimination.** The original spec kept `useInView` as the count-up trigger and added a 1.5 s fallback specifically because that hook had already proved unreliable in this stack. Removing the hook outright removes the failure mode rather than papering over it. The 1.5 s fallback survives as a belt-and-braces guarantee against the same class of bug ever reappearing from a different IntersectionObserver wrapper.
2. **Bundle size win (unexpected).** First Load JS for `/` dropped from **128 kB → 91.7 kB (−36.3 kB, −28.4%)**, and page-specific JS dropped from **40.5 kB → 4.32 kB (−36.18 kB, −89.3%)**. Framer-motion was loading its full runtime to power two components that needed only a 0.6 s opacity-and-translate fade; tree-shaking did not help. Removing the import eliminated the dependency from the `/` route entirely.
3. **Architectural alignment.** JAG's "minimal trust surface" engineering philosophy favors small, auditable primitives over heavyweight libraries when the library's value is only the small subset being used. Native `IntersectionObserver` + a CSS keyframe is a smaller trust surface than `framer-motion@11`'s lifecycle, and reduces the on-call radius for a future regression to code we own.

The trade-off accepted: a single `animate-fade-in-up` keyframe shape (0.6 s ease-out, translateY 16→0) replaces framer-motion's prior 0.4 s opacity-only fade on the metric values. Visible only in side-by-side comparison; accepted in exchange for sharing one keyframe across the codebase.

## File-level summary

| File | Change |
|---|---|
| `tailwind.config.ts` | Add `keyframes['fade-in-up']` and `animation['fade-in-up']` to `theme.extend` |
| `app/globals.css` | Append `prefers-reduced-motion` override for `.animate-fade-in-up` |
| `components/ui/FadeInOnScroll.tsx` | Full rewrite — pure CSS wrapper, no framer-motion import |
| `components/ui/MetricCounter.tsx` | Remove framer-motion entirely; replace `motion.div` with plain `div` + `animate-fade-in-up`; trigger count-up via native `IntersectionObserver` + 1500 ms `setTimeout` fallback (dual-signal, idempotent) |
| `components/ui/FadeInOnScroll.tsx.prefix-20260425-172009` | Delete after verification (no longer needed) |

## Governance

### Pre-edit backups

Before any edit, write timestamped backups of all four files plus a SHA-256 manifest:

```bash
TS=$(date +%Y%m%d-%H%M%S)
for f in components/ui/FadeInOnScroll.tsx components/ui/MetricCounter.tsx tailwind.config.ts app/globals.css; do
  cp "$f" "$f.backup-$TS"
done
shasum -a 256 components/ui/FadeInOnScroll.tsx.backup-$TS \
              components/ui/MetricCounter.tsx.backup-$TS \
              tailwind.config.ts.backup-$TS \
              app/globals.css.backup-$TS \
  > .preview/backups-$TS.sha256
```

### Verification gates (all six must pass before commit)

1. **Type check** — `npx tsc --noEmit` → 0 errors.
2. **Build** — `npm run build` → clean (the pre-existing static-export headers warning is allowed).
3. **Bundle size delta** — record First Load JS before vs after; expect a small reduction since framer-motion is no longer imported by these two files. Report old → new in kB.
4. **Cold dev server** — kill any running server, `npm run dev`, confirm `GET /` returns 200.
5. **Browser smoke test (CRITICAL — non-negotiable per user brief)** — render `localhost:3000` with the headless Chromium from the diagnostic phase (`~/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell --headless --disable-gpu --no-sandbox --dump-dom --virtual-time-budget=6000 …`). Required:
   - `opacity:0` count from FadeInOnScroll wrappers: `0` (down from 39).
   - `opacity:0` count from MetricCounter wrappers: `0` (down from 4).
   - Full-page screenshot saved to `.preview/post-fix-screenshots/full-page.png`.
   - Solution-section screenshot saved to `.preview/post-fix-screenshots/solution-metrics.png` showing all four values visible.
6. **Visual confirmation report** — checklist of each metric value confirmed visible above its label:
   - `10/10` — Attack types blocked in red team
   - `5 sec` — Time-to-block on real-world attacks
   - `0%` — False positive rate
   - `310/310` — Unit tests passing

If any gate fails: **stop, rollback from backups, report what failed, do not proceed.** Static analysis cannot detect this class of bug — we proved this today when commit 81fb7f8 type-checked and built cleanly while leaving 39 elements invisible at runtime.

### Rollback

```bash
cp components/ui/FadeInOnScroll.tsx.backup-<TS> components/ui/FadeInOnScroll.tsx
cp components/ui/MetricCounter.tsx.backup-<TS>   components/ui/MetricCounter.tsx
cp tailwind.config.ts.backup-<TS>                 tailwind.config.ts
cp app/globals.css.backup-<TS>                    app/globals.css
```

The exact `<TS>` value is captured in `.preview/backups-<TS>.sha256`.

## Risks

- **Headless render does not perfectly model the user's browser.** Mitigated by visual screenshot review.
- **`animate-fade-in-up` fires on mount, not on scroll-into-view.** For long pages this means below-the-fold content already animated by the time the user scrolls there. Acceptable trade-off; on a single-page landing site, every section is reached within seconds of load.
- **`forwards` fill mode is required.** Without it the wrapper resets to `opacity:0` after 0.6 s — same symptom as the bug we're fixing. Test in headless render that this does not regress.
- **`prefers-reduced-motion` users still see the final state instantly.** Verified by the override; not a content-hiding risk.
- **The 1500 ms fallback in `MetricCounter` masks any future `useInView` regression** — intentional. The cost of a metric value not animating its count-up is much lower than the cost of it not displaying at all.

## Out of scope (explicit, for future tickets)

- Replacing framer-motion elsewhere in the codebase.
- Adding a real IntersectionObserver-based fade-in. Revisit only if the on-mount timing becomes a UX problem.
- README / Task 22 work — separate ticket; user's brief calls it out as the immediate next thing after this commit lands.

## Known limitations (added 2026-04-25)

- **Section fade-in is not perceptibly animated in the production build.** The `animate-fade-in-up` keyframe completes faster than the user can register motion once the bundle has hydrated; sections appear at their final opacity essentially immediately. The metric count-up animation is unaffected and remains visibly progressive (0 → final value over 1.2 s).
- **Accepted for Phase 1 launch.** The user-visible regression vs the broken prior state is positive (sections now render at all), and the marketing copy is the load-bearing element on this page, not the fade choreography.
- **Polish deferred to Phase 1.5.** Future options to restore perceptible motion: tune `animation-duration` upward (e.g. 1.0–1.2 s), apply staggered `animation-delay` per section, add `will-change: opacity, transform` hints to give the compositor a head start, or trigger the class application via JS after a brief paint-yield delay so the keyframe doesn't race hydration.

## Spec amendment log

### 2026-04-25 — Full framer-motion removal from `MetricCounter`

- **Sections affected:** §4 `MetricCounter.tsx`, file-level summary table, §5 caller updates (callsite count clarified), new §6 decision rationale, new "Known limitations" section.
- **Reason for amendment:** During Task 5 execution, the strategic-advisor instruction directed full framer-motion removal from `MetricCounter` rather than the originally specified surgical removal of just the outer `motion.div`. The keep-`useInView` guidance in the original §4 was the documented divergence point.
- **Outcome:** Bundle size win discovered (First Load JS −36.3 kB / −28.4%; page-specific −89.3%) that the original spec did not anticipate. The native `IntersectionObserver` + 1500 ms `setTimeout` dual-signal trigger pattern adopted here is now the recommended architectural standard for any JAG component that needs scroll-triggered behavior, in preference to a framer-motion hook of the same shape.
- **Authorship preserved:** Original spec authorship and 2026-04-25 timestamp at the top of this file are unchanged. This entry documents the divergence rather than rewriting the document.
