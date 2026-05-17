# Resend-Grade Premium Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lift the JAG homepage's perceived premium quality toward the resend.com bar by adding 3 new charter-compatible primitives (BrandTile, BrowserChrome, SectionAnchor) and applying them to 5 narrative-anchor sections (Hero, Threats, Architecture, FiveLayers, Founder), with new fluid display-type tokens.

**Architecture:** Additive Tailwind tokens (no removals), 3 new presentational primitives in `components/ui/`, 4 custom SVG tile icons in `components/ui/tiles/`, and surgical rewrites of 5 section files. No new runtime dependencies, no `framer-motion` reintroduction, no charter §11 amendments. Each task is one commit.

**Tech Stack:** Next.js 14.2.35 · React 18 · Tailwind 3.4.1 · TypeScript strict · Playwright (visual regression) · lucide-react (existing). All animation via existing CSS keyframes (`fade-in-up`, etc.) + existing `FadeInOnScroll` primitive.

**Spec reference:** `docs/superpowers/specs/2026-05-17-resend-grade-premium-polish-design.md` (v2.1 charter-compatible)

**Hard constraints (charter §3.4 / §8):**
- First Load JS on `/` must stay ≤100 kB (current baseline 96.9 kB). If exceeded, Task 14 executes the §8 mitigation (code-split below-fold tiles).
- Lighthouse Perf / A11y / BP / SEO ≥95 on mid-tier mobile profile.
- No `framer-motion` imports added.
- Single accent: cyan family only (the 3 macOS traffic-light colors in BrowserChrome are exempt per spec §4.2).

**Implementation note — TDD adaptation:** The writing-plans skill's TDD template (write failing test → red → green → refactor) was authored for logic-heavy code. This plan implements presentational React components, Tailwind tokens, and SVG markup. Per charter §3.5 ("Tested at appropriate level — unit for logic, e2e for flows"), strict unit-TDD for `<div>` rendering produces low-signal tests. The validation regime used here:
- **Per task:** TypeScript typecheck + production build must pass (catches API errors)
- **Per integration task (9-13):** Playwright visual-regression diff at 3 breakpoints (catches visual regressions)
- **Final (task 14):** full pre-merge gate + Lighthouse + First Load JS measurement against ≤100 kB hard rule

This is the same pragmatic adaptation the owner authorized in charter §9.4 for the 2026-05-14 custom-skill build-out. Logged here for the same reason: deliberate deviation, not accidental.

---

## File map (decomposition decisions)

### Files to CREATE

| Path | Responsibility |
|---|---|
| `components/ui/BrandTile.tsx` | Square SVG tile primitive (3 sizes); cyan glass-frame; accepts child icon SVG; aria-hidden |
| `components/ui/BrowserChrome.tsx` | macOS-window wrapper primitive; 3 traffic-light dots + optional tab label; opaque dark inner |
| `components/ui/SectionAnchor.tsx` | Centered section-opener primitive; optional tile, eyebrow, headline, lede, children content slot |
| `components/ui/tiles/ShieldTile.tsx` | Custom SVG: JAG shield motif (cyan), drop-in child for `BrandTile size="lg"` |
| `components/ui/tiles/HexWarningTile.tsx` | Custom SVG: hexagonal warning motif (cyan), drop-in child for `BrandTile size="md"` |
| `components/ui/tiles/ConcentricRingsTile.tsx` | Custom SVG: 4 concentric rings (perimeter motif, cyan), drop-in child for `BrandTile size="md"` |
| `components/ui/tiles/LayerStratigraphyTile.tsx` | Custom SVG: 5 horizontal layers (cyan), drop-in child for `BrandTile size="md"` |

### Files to MODIFY

| Path | Change |
|---|---|
| `tailwind.config.ts` | Add `fontSize.displayHero`, `fontSize.displayAnchor`, `fontSize.lede`, `maxWidth.anchor`, `maxWidth.anchor-tight`, `boxShadow.tile`, `boxShadow.tile-hover` |
| `components/sections/Hero.tsx` | Replace 560px `ShieldSVG` with `<BrandTile size="lg"><ShieldTile/></BrandTile>` above eyebrow; remove pulse-glow; bump headline to `text-displayHero`; subhead becomes `text-lede` |
| `components/sections/Threats.tsx` | Wrap opener (eyebrow + headline + lede) in `<SectionAnchor>` with `<BrandTile><HexWarningTile/></BrandTile>`; wrap `<ThreatTimeline/>` in `<BrowserChrome tab="incidents · 2018-2026"/>` |
| `components/sections/Architecture.tsx` | Wrap opener in `<SectionAnchor>` with `<BrandTile><ConcentricRingsTile/></BrandTile>`; wrap architecture image in `<BrowserChrome tab="architecture-overview.svg"/>` |
| `components/sections/FiveLayers.tsx` | Wrap opener in `<SectionAnchor>` with `<BrandTile><LayerStratigraphyTile/></BrandTile>`; wrap `<LayerStack/>` in `<BrowserChrome tab="five-layers.spec"/>` |
| `components/sections/Founder.tsx` | Wrap opener in `<SectionAnchor>` (no tile, no eyebrow); wrap founder photo in `<BrowserChrome tab="founder.credential"/>` |

### Files to LEAVE UNTOUCHED

`components/sections/{Solution,Pipeline,Technology,Markets,Contact}.tsx` (5 non-anchor sections — they act as breath between anchors per spec §5.6).

---

## Pre-flight checks (run once before Task 1)

- [ ] **Verify clean working tree**

```bash
git status
```
Expected: `nothing to commit, working tree clean`. If dirty, stash or commit before starting.

- [ ] **Verify on main, up to date**

```bash
git branch --show-current && git fetch && git status -uno
```
Expected: current branch is `main`; `Your branch is up to date with 'origin/main'`.

- [ ] **Verify baseline build passes**

```bash
npm run typecheck && npm run build
```
Expected: both succeed. The build output ends with a `Route (app)` table — note the First Load JS for `/` (current baseline: **96.9 kB**). This is the number Task 14 will compare against.

---

## Task 1: Extend Tailwind tokens

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Add `fontSize` tokens for display headlines and lede**

In `tailwind.config.ts`, locate the `fontSize` block (currently ends with `hero: ['clamp(3.5rem, 2.5rem + 5vw, 7.5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],`). **Append** these three lines inside the same `fontSize` object:

```ts
        displayHero:   ['clamp(4rem, 3rem + 5vw, 7rem)',      { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        displayAnchor: ['clamp(3rem, 2.25rem + 3.75vw, 5rem)', { lineHeight: '1.0',  letterSpacing: '-0.035em' }],
        lede:          ['clamp(1.125rem, 1rem + 0.625vw, 1.375rem)', { lineHeight: '1.5', letterSpacing: '-0.005em' }],
```

- [ ] **Step 2: Add `maxWidth` tokens for anchor column**

Locate the `maxWidth` block. **Append** these two lines inside it:

```ts
        anchor: '720px',
        anchorTight: '620px',
```

- [ ] **Step 3: Add `boxShadow` tokens for the brand tile**

Locate the `boxShadow` block. **Append** these two lines inside it:

```ts
        tile:      '0 0 32px 0 rgba(34, 211, 238, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        tileHover: '0 0 48px 0 rgba(34, 211, 238, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
```

- [ ] **Step 4: Verify typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both succeed. No new lint warnings.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts
git commit -m "$(cat <<'EOF'
feat(tokens): displayHero/displayAnchor/lede + anchor maxWidths + tile shadows

Additive Tailwind tokens for Resend-grade premium polish (spec
2026-05-17). No existing tokens removed. Phase 2 sections continue to
render unchanged.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: BrandTile primitive

**Files:**
- Create: `components/ui/BrandTile.tsx`

- [ ] **Step 1: Create the file with the full component**

```tsx
import type { ReactNode } from 'react';

interface BrandTileProps {
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

const SIZE_PX: Record<'sm' | 'md' | 'lg', number> = {
  sm: 96,
  md: 128,
  lg: 192,
};

/**
 * BrandTile — square cyan glass-tile used at narrative section pivots.
 *
 * Decorative (aria-hidden). Inner radial cyan bloom, bottom-edge cyan
 * bevel line, outer cyan-glow shadow via shadow-tile token. The child
 * SVG renders at ~55% of tile dimension, centered.
 *
 * Used at: Hero (lg), Threats / Architecture / FiveLayers (md).
 */
export function BrandTile({ size = 'md', children, className = '' }: BrandTileProps) {
  const px = SIZE_PX[size];
  const iconPx = Math.round(px * 0.55);
  return (
    <div
      aria-hidden="true"
      style={{ width: `${px}px`, height: `${px}px`, borderRadius: '24%' }}
      className={[
        'relative inline-flex items-center justify-center',
        'bg-gradient-to-br from-bg-surfaceElevated to-bg-surfaceMuted',
        'border border-border-default',
        'shadow-tile',
        'overflow-hidden',
        className,
      ].join(' ')}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(103, 232, 249, 0.22), transparent 60%)',
        }}
      />
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.30), transparent)',
        }}
      />
      <span
        className="relative z-10 flex items-center justify-center"
        style={{ width: `${iconPx}px`, height: `${iconPx}px` }}
      >
        {children}
      </span>
    </div>
  );
}

export default BrandTile;
```

- [ ] **Step 2: Verify typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both succeed. The component is not yet imported anywhere — that's intentional, it lands first, integrators consume it in tasks 9-13.

- [ ] **Step 3: Commit**

```bash
git add components/ui/BrandTile.tsx
git commit -m "$(cat <<'EOF'
feat(ui): BrandTile primitive for narrative-anchor pivots

Square cyan glass-tile with inner radial bloom + bottom cyan bevel +
outer shadow-tile glow. Sizes sm/md/lg (96/128/192 px). aria-hidden
decorative. Child icon renders at 55% tile dimension, centered.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: BrowserChrome primitive

**Files:**
- Create: `components/ui/BrowserChrome.tsx`

- [ ] **Step 1: Create the file with the full component**

```tsx
import type { ReactNode } from 'react';

interface BrowserChromeProps {
  children: ReactNode;
  /** Optional file-tab label rendered in the chrome top bar. */
  tab?: string;
  className?: string;
}

/**
 * BrowserChrome — frames any child as if displayed inside a macOS
 * application window. Three traffic-light dots (red / amber / green)
 * are the universally-recognized OS UI artifact, exempt from §11
 * single-accent rule per spec §4.2.
 *
 * Used to wrap diagrams (architecture-overview.png), data displays
 * (ThreatTimeline, LayerStack), and the Founder photo so they read as
 * "viewer applications" rather than naked illustrations.
 */
export function BrowserChrome({ children, tab, className = '' }: BrowserChromeProps) {
  return (
    <div
      className={[
        'relative rounded-2xl overflow-hidden',
        'bg-bg-surface',
        'border border-border-default',
        'shadow-glow-md',
        className,
      ].join(' ')}
    >
      <div
        className="relative flex items-center px-4 h-9 border-b border-border-default"
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 100%)',
        }}
      >
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full" style={{ background: '#FF5F57' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#FEBC2E' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#28C840' }} />
        </div>
        {tab && (
          <div className="ml-6 inline-flex items-center px-3 h-7 rounded-md bg-bg-surfaceElevated font-mono text-xs text-text-tertiary">
            {tab}
          </div>
        )}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

export default BrowserChrome;
```

- [ ] **Step 2: Verify typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add components/ui/BrowserChrome.tsx
git commit -m "$(cat <<'EOF'
feat(ui): BrowserChrome primitive for diagram framing

macOS-window wrapper: traffic-light dots (system-recognized OS colors,
exempt per spec §4.2), optional file-tab label, opaque dark inner.
Used to frame diagrams, data displays, and the founder photo as
'viewer applications' rather than naked illustrations.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: SectionAnchor primitive

**Files:**
- Create: `components/ui/SectionAnchor.tsx`

- [ ] **Step 1: Create the file with the full component**

```tsx
import type { ReactNode } from 'react';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';

interface SectionAnchorProps {
  id: string;
  tile?: ReactNode;
  eyebrow?: string;
  headline: ReactNode;
  lede?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * SectionAnchor — centered section-opener primitive for the 4 non-hero
 * narrative anchors (Threats, Architecture, FiveLayers, Founder).
 *
 * Composition: tile? -> eyebrow? -> headline (h2, displayAnchor) ->
 * lede? -> full-width children slot. Text column constrained to
 * max-w-anchor (720px); children slot uses full container width.
 *
 * Hero is NOT a consumer of this primitive — its composition is more
 * complex (HeroWave backdrop, glow-bloom, CTA pair, trust band) and
 * gets a manual rewrite using the same new tokens.
 */
export function SectionAnchor({
  id,
  tile,
  eyebrow,
  headline,
  lede,
  children,
  className = '',
}: SectionAnchorProps) {
  return (
    <section id={id} className={['py-section', className].join(' ')}>
      <div className="mx-auto max-w-container px-gutter">
        <div className="mx-auto max-w-anchor text-center">
          {tile && (
            <FadeInOnScroll>
              <div className="flex justify-center">{tile}</div>
            </FadeInOnScroll>
          )}
          {eyebrow && (
            <FadeInOnScroll delay={0.1}>
              <p
                className={[
                  'font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan',
                  tile ? 'mt-8' : '',
                ].join(' ')}
              >
                {eyebrow}
              </p>
            </FadeInOnScroll>
          )}
          <FadeInOnScroll delay={0.2}>
            <h2
              className={[
                'text-displayAnchor font-display font-semibold text-text-primary text-balance',
                eyebrow || tile ? 'mt-6' : '',
              ].join(' ')}
            >
              {headline}
            </h2>
          </FadeInOnScroll>
          {lede && (
            <FadeInOnScroll delay={0.4}>
              <p className="mt-6 text-lede text-text-secondary max-w-[65ch] mx-auto">
                {lede}
              </p>
            </FadeInOnScroll>
          )}
        </div>
        {children && (
          <FadeInOnScroll delay={0.5}>
            <div className="mt-16">{children}</div>
          </FadeInOnScroll>
        )}
      </div>
    </section>
  );
}

export default SectionAnchor;
```

- [ ] **Step 2: Verify typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add components/ui/SectionAnchor.tsx
git commit -m "$(cat <<'EOF'
feat(ui): SectionAnchor primitive for narrative-anchor openers

Centered section-opener: optional tile + optional eyebrow + h2
headline (displayAnchor token) + optional lede + full-width children
slot. Text column constrained to max-w-anchor (720px). Hero opts out
(too custom); used by Threats, Architecture, FiveLayers, Founder.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: ShieldTile SVG (Hero icon)

**Files:**
- Create: `components/ui/tiles/ShieldTile.tsx`

- [ ] **Step 1: Create the directory if needed, then the file**

```bash
mkdir -p components/ui/tiles
```

Then create the file with this content:

```tsx
/**
 * ShieldTile — JAG shield motif as a glass-tile child icon.
 * Renders inside <BrandTile size="lg"> in Hero. Cyan stroke, subtle
 * inner gradient, fits 100% of the icon slot (BrandTile sizes child
 * to ~55% of tile dimension).
 */
export function ShieldTile() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="shield-tile-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="shield-tile-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <path
        d="M32 4 L56 12 V32 C56 46 46 56 32 60 C18 56 8 46 8 32 V12 L32 4 Z"
        fill="url(#shield-tile-fill)"
        stroke="url(#shield-tile-stroke)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M22 32 L29 39 L43 25"
        stroke="#67E8F9"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default ShieldTile;
```

- [ ] **Step 2: Verify typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add components/ui/tiles/ShieldTile.tsx
git commit -m "$(cat <<'EOF'
feat(ui): ShieldTile SVG for Hero BrandTile

JAG shield motif: shield silhouette with linear-gradient fill (cyan
0.16 -> 0.04) and gradient stroke; centered checkmark in
brand-cyanBright. Renders inside <BrandTile size='lg'> in Hero.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: HexWarningTile SVG (Threats icon)

**Files:**
- Create: `components/ui/tiles/HexWarningTile.tsx`

- [ ] **Step 1: Create the file**

```tsx
/**
 * HexWarningTile — hexagonal warning motif. Renders inside
 * <BrandTile size="md"> in Threats. Hexagon with cyan inner-light
 * fill and a tightly-tracked exclamation mark.
 */
export function HexWarningTile() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hex-fill" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      <path
        d="M32 4 L56 18 V46 L32 60 L8 46 V18 Z"
        fill="url(#hex-fill)"
        stroke="#22D3EE"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line
        x1="32"
        y1="20"
        x2="32"
        y2="38"
        stroke="#A5F3FC"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="46" r="2.25" fill="#A5F3FC" />
    </svg>
  );
}

export default HexWarningTile;
```

- [ ] **Step 2: Verify typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add components/ui/tiles/HexWarningTile.tsx
git commit -m "$(cat <<'EOF'
feat(ui): HexWarningTile SVG for Threats BrandTile

Hexagon with cyan radial-gradient fill + cyan stroke + centered
exclamation mark in cyanBright. Renders inside <BrandTile size='md'>
in Threats.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: ConcentricRingsTile SVG (Architecture icon)

**Files:**
- Create: `components/ui/tiles/ConcentricRingsTile.tsx`

- [ ] **Step 1: Create the file**

```tsx
/**
 * ConcentricRingsTile — perimeter-inspector motif: 4 concentric rings
 * with a center dot, evoking JAG's tiered-inference architecture.
 * Renders inside <BrandTile size="md"> in Architecture. Outer rings
 * fade outward to suggest depth/layering.
 */
export function ConcentricRingsTile() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="28" stroke="#22D3EE" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="32" cy="32" r="21" stroke="#22D3EE" strokeOpacity="0.55" strokeWidth="1" />
      <circle cx="32" cy="32" r="14" stroke="#22D3EE" strokeOpacity="0.8" strokeWidth="1.25" />
      <circle cx="32" cy="32" r="7" stroke="#67E8F9" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="2.5" fill="#A5F3FC" />
      <line x1="32" y1="4" x2="32" y2="11" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
      <line x1="32" y1="53" x2="32" y2="60" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
      <line x1="4" y1="32" x2="11" y2="32" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
      <line x1="53" y1="32" x2="60" y2="32" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
    </svg>
  );
}

export default ConcentricRingsTile;
```

- [ ] **Step 2: Verify typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add components/ui/tiles/ConcentricRingsTile.tsx
git commit -m "$(cat <<'EOF'
feat(ui): ConcentricRingsTile SVG for Architecture BrandTile

4 concentric cyan rings with center dot + 4 cardinal-direction tick
marks. Perimeter-inspector motif evoking JAG's tiered-inference
architecture. Renders inside <BrandTile size='md'> in Architecture.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: LayerStratigraphyTile SVG (FiveLayers icon)

**Files:**
- Create: `components/ui/tiles/LayerStratigraphyTile.tsx`

- [ ] **Step 1: Create the file**

```tsx
/**
 * LayerStratigraphyTile — 5 horizontal cyan layers stacked vertically,
 * each with a slightly different opacity to suggest depth.
 * Renders inside <BrandTile size="md"> in FiveLayers. Each layer
 * represents one of the 5 patented inventions.
 */
export function LayerStratigraphyTile() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <rect x="6" y="12" width="52" height="6" rx="1.5" fill="#22D3EE" fillOpacity="0.20" stroke="#22D3EE" strokeOpacity="0.50" />
      <rect x="6" y="21" width="52" height="6" rx="1.5" fill="#22D3EE" fillOpacity="0.32" stroke="#22D3EE" strokeOpacity="0.65" />
      <rect x="6" y="30" width="52" height="6" rx="1.5" fill="#67E8F9" fillOpacity="0.40" stroke="#67E8F9" strokeOpacity="0.75" />
      <rect x="6" y="39" width="52" height="6" rx="1.5" fill="#67E8F9" fillOpacity="0.50" stroke="#67E8F9" strokeOpacity="0.85" />
      <rect x="6" y="48" width="52" height="6" rx="1.5" fill="#A5F3FC" fillOpacity="0.60" stroke="#A5F3FC" />
    </svg>
  );
}

export default LayerStratigraphyTile;
```

- [ ] **Step 2: Verify typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add components/ui/tiles/LayerStratigraphyTile.tsx
git commit -m "$(cat <<'EOF'
feat(ui): LayerStratigraphyTile SVG for FiveLayers BrandTile

5 horizontal cyan layers stacked vertically; each layer progressively
brighter (cyan -> cyanBright -> cyanBright/A5F3FC) to suggest depth.
Renders inside <BrandTile size='md'> in FiveLayers.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Integrate Hero

**Files:**
- Modify: `components/sections/Hero.tsx`

- [ ] **Step 1: Replace the file content with the new composition**

Overwrite `components/sections/Hero.tsx` with:

```tsx
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import { BrandTile } from '@/components/ui/BrandTile';
import { ShieldTile } from '@/components/ui/tiles/ShieldTile';
import { HeroWave } from '@/components/ui/HeroWave';
import { hero } from '@/lib/content';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-gutter pt-32 pb-section"
    >
      <HeroWave />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 animate-glow-bloom"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(34, 211, 238, 0.12) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-anchor text-center">
        <FadeInOnScroll>
          <div className="flex justify-center">
            <BrandTile size="lg">
              <ShieldTile />
            </BrandTile>
          </div>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.2}>
          <p className="mt-8 font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {hero.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.4}>
          <h1 className="mt-6 font-display text-displayHero font-semibold text-balance">
            <span className="block text-text-primary">{hero.headlineLine1}</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #22D3EE 0%, #67E8F9 50%, #A5F3FC 100%)',
              }}
            >
              {hero.headlineLine2}
            </span>
          </h1>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.9}>
          <p className="mx-auto mt-8 max-w-[65ch] text-lede text-text-secondary">
            {hero.subhead}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={1.1}>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={hero.ctaPrimary.href}
              className="inline-flex items-center justify-center rounded-md bg-brand-cyan px-7 py-3 text-base font-semibold text-text-onAccent hover:bg-brand-cyanBright active:scale-[0.97] transition-all duration-fast"
            >
              {hero.ctaPrimary.label} →
            </a>
            <a
              href={hero.ctaSecondary.href}
              className="inline-flex items-center justify-center rounded-md border border-brand-cyan px-7 py-3 text-base font-semibold text-brand-cyan hover:bg-brand-cyan/10 active:scale-[0.97] transition-all duration-fast"
            >
              {hero.ctaSecondary.label}
            </a>
          </div>
        </FadeInOnScroll>
        <FadeInOnScroll delay={1.3}>
          <p className="mt-14 font-mono text-xs text-text-quaternary flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            {hero.trust.map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true">·</span>}
                {t}
              </span>
            ))}
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
```

Changes from the previous version:
- Removed `ShieldSVG` import + 560px decorative shield (and its `pulse-glow` animation).
- Added `BrandTile` + `ShieldTile` imports + tile rendered above the eyebrow.
- Changed text column max-width: `max-w-container` → `max-w-anchor` (narrower, matches magazine rhythm).
- Headline class: `text-hero leading-display tracking-display` → `text-displayHero` (the new token already encodes leading + tracking).
- Subhead class: `text-bodyLg` → `text-lede`.

- [ ] **Step 2: Verify typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both succeed.

- [ ] **Step 3: Visual diff — production-build parity check**

Start the production build server in one terminal:
```bash
npx serve out -p 3001
```
Open `http://localhost:3001` and inspect the Hero section at 3 breakpoints:
- Desktop (1440px viewport)
- Tablet (768px)
- Mobile (375px)

Expected:
- Tile is visible above the eyebrow text, centered, ~192 px square, cyan glass with shield + check inside
- Headline is significantly larger than before (~4-7rem fluid)
- Subhead is slightly larger than the previous body size (~1.125-1.375rem)
- HeroWave canvas animation still plays
- No 560 px decorative shield remains anywhere
- CTAs and trust band unchanged
- No console errors

If anything doesn't render as expected, **stop and investigate before committing**.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "$(cat <<'EOF'
feat(hero): adopt BrandTile + displayHero + lede tokens

- 560px ShieldSVG -> BrandTile size='lg' with ShieldTile child
- pulse-glow removed (tile carries the inner light now)
- Headline: text-hero -> text-displayHero (larger, tighter)
- Subhead: text-bodyLg -> text-lede
- Text column: max-w-container -> max-w-anchor (720px) for magazine rhythm
- HeroWave, glow-bloom, CTAs, trust band preserved as-is

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Integrate Threats

**Files:**
- Modify: `components/sections/Threats.tsx`

- [ ] **Step 1: Replace the file content**

Overwrite `components/sections/Threats.tsx` with:

```tsx
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { BrandTile } from '@/components/ui/BrandTile';
import { BrowserChrome } from '@/components/ui/BrowserChrome';
import { SectionAnchor } from '@/components/ui/SectionAnchor';
import { HexWarningTile } from '@/components/ui/tiles/HexWarningTile';
import { ThreatTimeline } from '@/components/ui/ThreatTimeline';
import { threatLandscape } from '@/lib/content';
import { ShieldOff, AlertTriangle, Users, Network, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = { ShieldOff, AlertTriangle, Users, Network };

export function Threats() {
  return (
    <SectionAnchor
      id="threats"
      tile={
        <BrandTile size="md">
          <HexWarningTile />
        </BrandTile>
      }
      eyebrow={threatLandscape.eyebrow}
      headline={threatLandscape.headline}
      lede={threatLandscape.lede}
    >
      <BrowserChrome tab="incidents · 2018-2026">
        <div className="p-6 md:p-10">
          <ThreatTimeline />
        </div>
      </BrowserChrome>
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {threatLandscape.cards.map((c, i) => {
          const Icon = ICONS[c.icon];
          return (
            <FadeInOnScroll key={c.title} delay={0.1 * i}>
              <article className="group relative rounded-lg bg-bg-surface border border-border-default p-7 transition-all duration-base ease-standard hover:-translate-y-1 hover:border-border-strong hover:shadow-cardHover overflow-hidden h-full">
                <span
                  className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-brand-cyan to-transparent transition-all duration-base ease-standard group-hover:w-full"
                  aria-hidden="true"
                />
                <Icon className="h-8 w-8 text-brand-cyan" aria-hidden="true" />
                <h3 className="mt-6 font-display text-h3 font-semibold text-text-primary leading-heading tracking-heading">
                  {c.title}
                </h3>
                <p className="mt-3 text-body text-text-secondary leading-body">{c.body}</p>
              </article>
            </FadeInOnScroll>
          );
        })}
      </div>
      <FadeInOnScroll delay={0.5}>
        <p className="mt-16 text-center italic text-text-tertiary">{threatLandscape.closing}</p>
      </FadeInOnScroll>
    </SectionAnchor>
  );
}
```

Changes:
- Section wrapped in `<SectionAnchor>` (replaces the ad-hoc `<section>` + opener markup).
- Tile + eyebrow + headline + lede now passed as `SectionAnchor` props.
- `<ThreatTimeline />` wrapped in `<BrowserChrome tab="incidents · 2018-2026">` with internal padding so the timeline doesn't crash the chrome edge.
- The 4 threat-cards grid and the closing italic line stay as `children`.

- [ ] **Step 2: Verify typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both succeed.

- [ ] **Step 3: Visual diff at 3 breakpoints**

With `npx serve out -p 3001` running, scroll to `#threats` and inspect at 1440 / 768 / 375 px:
- Tile visible above eyebrow text, centered
- Headline is significantly larger than the previous `text-h2`
- Lede slightly larger than previous body
- `ThreatTimeline` is framed by the macOS-style chrome with traffic-light dots and the `incidents · 2018-2026` tab label
- The 4 threat cards below still render correctly
- Closing italic line unchanged

- [ ] **Step 4: Commit**

```bash
git add components/sections/Threats.tsx
git commit -m "$(cat <<'EOF'
feat(threats): adopt SectionAnchor + BrandTile + BrowserChrome

- Opener migrated to <SectionAnchor> with HexWarningTile
- <ThreatTimeline> wrapped in <BrowserChrome tab='incidents · 2018-2026'>
- Threat-card grid + closing line preserved as children

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Integrate Architecture

**Files:**
- Modify: `components/sections/Architecture.tsx`

- [ ] **Step 1: Replace the file content**

Overwrite `components/sections/Architecture.tsx` with:

```tsx
import Image from 'next/image';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { BrandTile } from '@/components/ui/BrandTile';
import { BrowserChrome } from '@/components/ui/BrowserChrome';
import { SectionAnchor } from '@/components/ui/SectionAnchor';
import { ConcentricRingsTile } from '@/components/ui/tiles/ConcentricRingsTile';
import { architecture } from '@/lib/content';

export function Architecture() {
  return (
    <SectionAnchor
      id="architecture"
      tile={
        <BrandTile size="md">
          <ConcentricRingsTile />
        </BrandTile>
      }
      eyebrow={architecture.eyebrow}
      headline={architecture.headline}
      lede={architecture.lede}
    >
      <BrowserChrome tab="architecture-overview.svg">
        <Image
          src="/assets/architecture-overview.png"
          alt="JAG Agentic AI Cybersecurity Gateway architecture: untrusted internet on the left connects via wired or wireless to the central JAG-powered NVIDIA Jetson Orin NX module — running Edge AI Processing, Adaptive Threat Management, and Intelligent Gateway layers — which then secures workstations, IoT systems, IP surveillance, and industrial control/SCADA/PLC devices on the internal network."
          width={1920}
          height={1080}
          className="w-full h-auto"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority={false}
        />
      </BrowserChrome>
      <FadeInOnScroll delay={0.7}>
        <p className="mt-6 font-mono text-xs text-text-tertiary text-center max-w-[70ch] mx-auto">
          {architecture.caption}
        </p>
      </FadeInOnScroll>
    </SectionAnchor>
  );
}
```

Changes:
- Section wrapped in `<SectionAnchor>` with `ConcentricRingsTile` inside `BrandTile`.
- `architecture-overview.png` wrapped in `<BrowserChrome tab="architecture-overview.svg">` — replaces the previous `rounded-2xl overflow-hidden border` wrapper (chrome subsumes it).
- Caption preserved.

- [ ] **Step 2: Verify typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both succeed.

- [ ] **Step 3: Visual diff at 3 breakpoints**

Scroll to `#architecture` at 1440 / 768 / 375 px:
- Tile visible above eyebrow (concentric rings + center dot, cyan)
- Headline + lede with new larger sizes
- `architecture-overview.png` framed by browser chrome with `architecture-overview.svg` tab label
- Caption below the chrome frame unchanged

- [ ] **Step 4: Commit**

```bash
git add components/sections/Architecture.tsx
git commit -m "$(cat <<'EOF'
feat(architecture): adopt SectionAnchor + BrandTile + BrowserChrome

- Opener migrated to <SectionAnchor> with ConcentricRingsTile
- architecture-overview.png wrapped in <BrowserChrome>
- Previous rounded-border wrapper replaced by chrome frame
- Caption preserved

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Integrate FiveLayers

**Files:**
- Modify: `components/sections/FiveLayers.tsx`

- [ ] **Step 1: Replace the file content**

Overwrite `components/sections/FiveLayers.tsx` with:

```tsx
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { BrandTile } from '@/components/ui/BrandTile';
import { BrowserChrome } from '@/components/ui/BrowserChrome';
import { SectionAnchor } from '@/components/ui/SectionAnchor';
import { LayerStratigraphyTile } from '@/components/ui/tiles/LayerStratigraphyTile';
import { LayerCard } from '@/components/ui/LayerCard';
import { LayerStack } from '@/components/ui/LayerStack';
import { fiveLayers } from '@/lib/content';

export function FiveLayers() {
  return (
    <SectionAnchor
      id="five-layers"
      tile={
        <BrandTile size="md">
          <LayerStratigraphyTile />
        </BrandTile>
      }
      eyebrow={fiveLayers.eyebrow}
      headline={fiveLayers.headline}
      lede={fiveLayers.lede}
    >
      <BrowserChrome tab="five-layers.spec">
        <div className="p-6 md:p-10">
          <LayerStack />
        </div>
      </BrowserChrome>
      <ol className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {fiveLayers.layers.map((l, i) => (
          <li
            key={l.step}
            className={i === 4 ? 'md:col-span-2 md:max-w-[calc(50%-12px)] md:mx-auto md:w-full' : ''}
          >
            <FadeInOnScroll delay={0.08 * i} className="block h-full">
              <LayerCard {...l} />
            </FadeInOnScroll>
          </li>
        ))}
      </ol>
      <FadeInOnScroll delay={0.5}>
        <div className="mt-16 bg-bg-surfaceMuted border-y border-border-default py-12 -mx-gutter px-gutter">
          <p className="text-center font-display text-h3 font-semibold text-text-primary">
            {fiveLayers.closing.title}
          </p>
          <p className="mt-3 text-center text-body text-text-secondary max-w-[60ch] mx-auto">
            {fiveLayers.closing.body}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionAnchor>
  );
}
```

Changes:
- Section wrapped in `<SectionAnchor>` with `LayerStratigraphyTile` inside `BrandTile`.
- `<LayerStack />` wrapped in `<BrowserChrome tab="five-layers.spec">` with internal padding.
- The 5 `LayerCard` grid items and the closing block stay as `children`.

- [ ] **Step 2: Verify typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both succeed.

- [ ] **Step 3: Visual diff at 3 breakpoints**

Scroll to `#five-layers` at 1440 / 768 / 375 px:
- Tile visible above eyebrow (5 horizontal layers, progressively brighter cyan)
- Headline + lede with new larger sizes
- `LayerStack` framed by chrome with `five-layers.spec` tab label
- The 5 `LayerCard` items unchanged
- Closing block ("A Defensible Moat by Design") unchanged

- [ ] **Step 4: Commit**

```bash
git add components/sections/FiveLayers.tsx
git commit -m "$(cat <<'EOF'
feat(fivelayers): adopt SectionAnchor + BrandTile + BrowserChrome

- Opener migrated to <SectionAnchor> with LayerStratigraphyTile
- <LayerStack> wrapped in <BrowserChrome tab='five-layers.spec'>
- LayerCard grid + closing block preserved as children

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Integrate Founder

**Files:**
- Modify: `components/sections/Founder.tsx`

- [ ] **Step 1: Replace the file content**

Overwrite `components/sections/Founder.tsx` with:

```tsx
import Image from 'next/image';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { BrowserChrome } from '@/components/ui/BrowserChrome';
import { SectionAnchor } from '@/components/ui/SectionAnchor';
import { founder } from '@/lib/content';
import { Linkedin } from 'lucide-react';

export function Founder() {
  return (
    <SectionAnchor id="founder" headline={founder.headline}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2">
          <BrowserChrome tab="founder.credential" className="max-w-sm mx-auto md:mx-0">
            <div className="relative aspect-square">
              <Image
                src={founder.photo}
                alt={`Portrait of ${founder.name}, founder of JAG Cybersecurity`}
                width={640}
                height={640}
                priority
                className="object-cover w-full h-full"
              />
            </div>
          </BrowserChrome>
        </div>
        <FadeInOnScroll delay={0.2} className="md:col-span-3 block">
          <p className="font-display text-h3 font-semibold text-text-primary">{founder.name}</p>
          <p className="mt-1 font-mono text-sm text-brand-cyan">{founder.title}</p>
          <div className="mt-6 space-y-4">
            {founder.paragraphs.map((p) => (
              <p key={p.slice(0, 30)} className="text-body text-text-secondary leading-body max-w-[65ch]">
                {p}
              </p>
            ))}
          </div>
          <a
            href={founder.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-brand-cyan hover:text-brand-cyanBright active:scale-[0.97] transition-all duration-fast"
          >
            <Linkedin className="h-5 w-5" aria-hidden="true" />
            {founder.linkedin.label} →
          </a>
        </FadeInOnScroll>
      </div>
    </SectionAnchor>
  );
}
```

Changes:
- Section wrapped in `<SectionAnchor id="founder" headline={founder.headline}>` — no tile, no eyebrow (per spec §5.5).
- Founder photo wrapped in `<BrowserChrome tab="founder.credential">` — replaces the previous `rounded-2xl overflow-hidden shadow-glow-lg` wrapper.
- Name + title + paragraphs + LinkedIn link preserved as before.
- The headline (`founder.headline`) now renders at top-center via SectionAnchor; previous in-grid h2 removed.

- [ ] **Step 2: Verify typecheck + build**

```bash
npm run typecheck && npm run build
```
Expected: both succeed.

- [ ] **Step 3: Visual diff at 3 breakpoints**

Scroll to `#founder` at 1440 / 768 / 375 px:
- Centered headline at top with new larger size (no eyebrow, no tile — intentional)
- Below: 5-column grid with founder photo (left, in chrome frame with `founder.credential` tab) and bio block (right)
- On mobile: photo stacks above bio block, both centered
- LinkedIn link unchanged

- [ ] **Step 4: Commit**

```bash
git add components/sections/Founder.tsx
git commit -m "$(cat <<'EOF'
feat(founder): adopt SectionAnchor + BrowserChrome around photo

- Opener migrated to <SectionAnchor> (no tile, no eyebrow per spec §5.5)
- Founder photo wrapped in <BrowserChrome tab='founder.credential'>
  — reads as a credentialing card rather than a marketing portrait
- Bio block and LinkedIn link preserved

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Pre-merge gate + perf check + visual baseline update

**Files:**
- Modify (possibly): one or more section files if § mitigation is required
- Modify (possibly): visual regression snapshots in `tests/visual-rebuild.spec.ts-snapshots/`

- [ ] **Step 1: Run the full pre-merge gate**

```bash
npm run lint && npm run typecheck && npm run build && npm test && npm run lighthouse
```

For each command, expected outcome:
- `npm run lint` — no errors, no new warnings
- `npm run typecheck` — passes
- `npm run build` — completes; **note the First Load JS for `/`** in the route table at the end
- `npm test` — Playwright cross-browser tests pass. Note: the existing `tests/visual-rebuild.spec.ts` will likely fail at the 5 changed sections because the snapshots are stale. This is **expected** — fix in step 3 below.
- `npm run lighthouse` — Perf/A11y/BP/SEO each ≥95. If any score is below 95, **stop and investigate before committing**.

- [ ] **Step 2: Check First Load JS against ≤100 kB hard rule**

If First Load JS for `/` is **≤100 kB** → proceed to step 3.

If First Load JS is **>100 kB** → execute the spec §8 mitigation. Code-split the below-fold tiles (Threats, Architecture, FiveLayers) using `next/dynamic`. For each of the 3 section files, change the tile import from a static `import` to a dynamic one:

```tsx
import dynamic from 'next/dynamic';
const HexWarningTile = dynamic(() => import('@/components/ui/tiles/HexWarningTile').then((m) => m.HexWarningTile), { ssr: true });
```

Repeat for `ConcentricRingsTile` (Architecture) and `LayerStratigraphyTile` (FiveLayers). Re-run `npm run build` and confirm First Load JS drops below 100 kB. If still over, escalate to owner per charter §8 hard-stop.

- [ ] **Step 3: Update visual-regression snapshots**

The visual baselines in `tests/visual-rebuild.spec.ts-snapshots/` are stale for the 5 changed sections. Update them:

```bash
npx playwright test tests/visual-rebuild.spec.ts --update-snapshots
```

Then **manually review the updated snapshots** before committing. Open them in Finder or VS Code and confirm:
- Hero shows the new BrandTile + larger headline
- Threats shows the new BrandTile + chrome-wrapped timeline
- Architecture shows the new BrandTile + chrome-wrapped diagram
- FiveLayers shows the new BrandTile + chrome-wrapped LayerStack
- Founder shows the new chrome-wrapped photo + centered headline above

If any snapshot shows an unexpected regression (broken layout, missing element, wrong color), **stop and investigate** before committing.

- [ ] **Step 4: Capture paired before/after screenshots for owner review**

Open the production-build site (`http://localhost:3001`) in a browser at desktop (1440px) and mobile (375px) viewports. Capture a full-page screenshot at each viewport and attach to the owner-review message. Compare against the screenshots committed in the most recent rebuild commit chain (find via `git log --oneline | head -20`).

Per charter §1.10 ONE-STEP-AT-A-TIME, these screenshots must be available to the owner before declaring done.

- [ ] **Step 5: Final commit (snapshot updates + any mitigation changes)**

```bash
git add tests/ components/sections/  # only what changed in steps 2-3
git commit -m "$(cat <<'EOF'
test(visual): update visual-regression baselines for Resend polish

Updates snapshots for the 5 changed anchor sections (Hero, Threats,
Architecture, FiveLayers, Founder) to reflect the new BrandTile +
BrowserChrome + display-type composition.

If perf-budget mitigation was required (First Load JS > 100 kB),
includes dynamic imports for below-fold tiles per spec §8.

Final pre-merge gate: lint / typecheck / build / test / lighthouse
all green. First Load JS: <REPORTED NUMBER> kB (baseline 96.9 kB).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

When writing this commit message, **replace `<REPORTED NUMBER>` with the actual measured value from step 1's build output.**

- [ ] **Step 6: Notify owner for review and push approval**

Per charter §1.9 the harness allowlist blocks `git push`. After all commits are in place, summarize for the owner:
- Total commits added (should be 14, one per task above)
- Final First Load JS number (post-mitigation if any) and how it compares to the 96.9 kB baseline
- Lighthouse scores (Perf / A11y / BP / SEO) — each must be ≥95
- Paired desktop + mobile screenshots attached
- Ask owner to run `git push origin main` once they've reviewed

---

## Verification summary

| Verification | Where it lives |
|---|---|
| TypeScript compiles | Per-task step 2 of every task |
| Production build succeeds | Per-task step 2 of every task |
| Visual fidelity at 3 breakpoints | Per-integration-task step 3 (tasks 9-13) |
| Visual regression baseline updated | Task 14 step 3 |
| Lint passes | Task 14 step 1 |
| All Playwright tests pass | Task 14 step 1 + step 3 |
| Lighthouse ≥95 on all 4 categories | Task 14 step 1 |
| First Load JS ≤100 kB | Task 14 step 2 (mitigation if needed) |
| Paired before/after screenshots | Task 14 step 4 |
| Owner approval before `git push` | Task 14 step 6 (charter §1.9) |

## Rollback procedure

Each task is one commit. To roll back any single task without affecting others:

```bash
git revert <commit-sha>
```

To roll back the entire feature (all 14 commits) cleanly, find the pre-Task-1 commit:

```bash
git log --oneline | grep -m1 "before resend polish" || git log --oneline | head -20
```

Then revert the range (this creates revert commits, preserving history):

```bash
git revert <pre-task-1-sha>..HEAD
```

Filesystem `.backup-YYYYMMDD-HHMMSS` copies are **not** created for this feature — charter §1.2 L1 (git commit) is the rollback path. Each task's commit is a verifiable checkpoint.

---

*End of plan — JAG Resend-Grade Premium Polish, 14 tasks, 2026-05-17.*
