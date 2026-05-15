# JAG Website Rebuild — Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the JAG Cybersecurity homepage to 10 sections with elevated visual craft (NVIDIA Inception / sovereign-AI investor / CISO bar), staying within charter v2.0 (no framer-motion on `/`, Lighthouse ≥95 across desktop AND mobile, First Load JS ≤100 kB).

**Architecture:** Single-route Next.js 14 App Router site, static export → Cloudflare Pages. All motion via CSS keyframes + IntersectionObserver + SVG `stroke-dasharray` + one small canvas (Architecture perimeter-inspector animation, ~3 kB). Tokens in `tailwind.config.ts`, content in `lib/content.ts`, sections in `components/sections/`, primitives in `components/ui/`.

**Tech Stack:** Next.js 14.2.35, React 18, Tailwind 3.4.1, TypeScript strict, lucide-react, `next/font` (Geist + JetBrains Mono), Playwright 1.60, @axe-core/playwright, @lhci/cli ≥95, @vercel/og, sharp.

**Spec reference:** `docs/superpowers/specs/2026-05-15-website-rebuild-phase2-design.md` (committed `98bed2b`). Read it before starting — this plan executes that spec.

---

## Working assumptions

- All commands run from `/Users/cavslee/Projects/JAG/01_website` (verify with `pwd`).
- Charter §1.2 BACKUP-FIRST is honoured: every file modification preceded by a git commit (L1 backup) and a filesystem `<file>.backup-YYYYMMDD-HHMMSS` (L2 backup) for major refactor points (tokens, layout, pages, UI primitives).
- Charter §1.5 ASK-BEFORE-ACTING: any time a Type-1 action (irreversible) appears, halt and confirm with owner. This plan contains no Type-1 actions — only Type-2 reversible.
- Each phase ends with: owner-visible checkpoint (build + manual smoke + visual diff at 5 breakpoints + Lighthouse mobile probe) → atomic git commit `feat(phase-X): ...` → proceed.
- TypeScript strict mode is on. `npm run typecheck && npm run lint` runs between every task is encouraged but mandated at every phase boundary.

---

## File map

**Modified existing files:**
- `tailwind.config.ts` — extend tokens (new alongside old; old removed after migration sweep)
- `app/globals.css` — font CSS vars, reduced-motion shorthand
- `app/layout.tsx` — `next/font` wiring, metadata, OG meta, Navigation, Footer
- `app/page.tsx` — re-order section imports, add 2 new sections
- `lib/content.ts` — new keys for Architecture, FiveLayers, ProofBar; refine existing
- `components/Navigation.tsx` — sticky/blur/hide-on-scroll-down, mobile overlay, active-link underline
- `components/Footer.tsx` — minimal redesign
- `components/sections/Hero.tsx` — single drawing shield + radial glow + staggered reveals
- `components/sections/Threats.tsx` — drop amber border, top-edge cyan hover line
- `components/sections/Solution.tsx` — 2×2 grid + ProofBar
- `components/sections/Pipeline.tsx` — 5-stage horizontal flow + animated SVG lines
- `components/sections/Technology.tsx` — restyled 11-framework grid
- `components/sections/Markets.tsx` — restyled
- `components/sections/Founder.tsx` — real photo
- `components/sections/Contact.tsx` — restyled form
- `components/ui/FadeInOnScroll.tsx` — `delay` prop
- `components/ui/MetricCounter.tsx` — verify tokens, no logic change
- `components/ui/SectionHeader.tsx` — token sweep
- `components/ui/Card.tsx` — token sweep
- `components/ui/Container.tsx` — token sweep
- `next.config.mjs` — no change expected; verify CSP after final build
- `public/_headers` — verify in sync with `next.config.mjs` post-build

**Created files:**
- `components/sections/Architecture.tsx` — new section
- `components/sections/FiveLayers.tsx` — new section
- `components/ui/ShieldSVG.tsx` — inline shield primitive (used by Hero + Architecture)
- `components/ui/ProofBar.tsx` — animated 5-stat band
- `components/ui/ArchitectureDiagram.tsx` — SVG perimeter-inspector diagram
- `components/ui/PacketParticles.tsx` — small canvas overlay (~3 kB)
- `components/ui/LayerCard.tsx` — Five Layers primitive
- `components/ui/FrameworkBadge.tsx` — Standards primitive
- `app/og/route.tsx` — OG image route handler
- `public/assets/jag-logo.png` — from session image
- `public/assets/founder-photo.png` — from session image
- `tests/visual-rebuild.spec.ts` — visual diff baseline
- (conditional) `workers/contact/` — Cloudflare Worker if Phase G probe fails

**Deleted files:**
- `" "` (literal space) empty-name file in working tree
- Backup files older than 30 days — DEFER, charter says don't delete prior backups without explicit owner approval

---

# Phase 0 — Pre-flight cleanup

Establish a clean baseline before any rebuild work.

### Task 0.1: Verify working tree state

**Files:** none

- [ ] **Step 1: Confirm working directory and state**

Run:
```bash
pwd && git status && git log --oneline -3
```

Expected output:
```
/Users/cavslee/Projects/JAG/01_website
On branch main
Your branch is ahead of 'origin/main' by 3 commits.
Changes not staged for commit:
  modified:   .gitignore
  modified:   package-lock.json
  modified:   package.json
Untracked files:
  " "
  lighthouserc.json
  playwright.config.ts
  scripts/
  tests/
98bed2b docs(spec): website rebuild Phase 2 design — charter-compatible (Option D)
f844a28 docs(charter): v2.0 — structural §0 routing change
4e15f1f docs(charter): v1.2 — harvest motion-craft (§3.2.1) + anti-pattern catalogue (§10.2)
```

If state differs, HALT and surface the difference to owner.

### Task 0.2: Delete empty-name file with owner confirmation

**Files:** `" "` (single-space filename in repo root)

- [ ] **Step 1: Inspect the file**

Run:
```bash
ls -la ./" " 2>&1
file ./" " 2>&1
wc -c ./" " 2>&1
```

If the file is empty (0 bytes) and unowned by any tracked path, proceed. Otherwise HALT and surface.

- [ ] **Step 2: Remove**

```bash
rm -- " "
```

- [ ] **Step 3: Verify gone**

```bash
ls -la | grep -E '^[^ ]+ +[^ ]+ +[^ ]+ +[^ ]+ +[0-9]+ +[A-Za-z]+ +[0-9]+ +[0-9:]+ +" "$' || echo "removed"
```

Expected: `removed`

### Task 0.3: Commit existing Phase 1.5 dev tooling

**Files:** `.gitignore`, `package.json`, `package-lock.json`, `lighthouserc.json`, `playwright.config.ts`, `scripts/`, `tests/`

- [ ] **Step 1: Review the diffs**

```bash
git diff .gitignore package.json
```

Verify changes are only Playwright/Lighthouse/axe/sharp/@vercel/og install + script entries — nothing suspicious.

- [ ] **Step 2: Stage exact paths**

```bash
git add .gitignore package.json package-lock.json lighthouserc.json playwright.config.ts scripts/ tests/
```

- [ ] **Step 3: Commit**

```bash
git commit -m "chore(tooling): commit Phase 1.5 dev-tooling install

@playwright/test + @axe-core/playwright + @lhci/cli + sharp + @vercel/og.
playwright.config.ts (5 browser profiles), lighthouserc.json (≥95 across
Perf/A11y/BP/SEO), scripts/lighthouse.mjs, tests/a11y.spec.ts, tests/smoke.spec.ts.

Establishes clean baseline before website rebuild Phase 2."
```

- [ ] **Step 4: Verify clean tree**

```bash
git status
```

Expected: `nothing to commit, working tree clean`

---

# Phase A — Token foundation + fonts + layout + nav + footer + assets

Land the design-system foundation. Existing components keep working throughout — new tokens added alongside old, full sweep happens at end of phase.

### Task A.1: Backup files about to be modified

**Files:** `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`

- [ ] **Step 1: L2 filesystem backups**

```bash
TS=$(date +%Y%m%d-%H%M%S)
cp -p tailwind.config.ts tailwind.config.ts.backup-$TS
cp -p app/globals.css app/globals.css.backup-$TS
cp -p app/layout.tsx app/layout.tsx.backup-$TS
ls -la tailwind.config.ts.backup-$TS app/globals.css.backup-$TS app/layout.tsx.backup-$TS
```

Expected: three files listed with same timestamp suffix.

### Task A.2: Copy assets into `public/assets/`

**Files:** `public/assets/jag-logo.png`, `public/assets/founder-photo.png`

- [ ] **Step 1: Create directory**

```bash
mkdir -p public/assets
```

- [ ] **Step 2: Copy JAG logo**

Source: image attached at session start (`/Users/cavslee/Desktop/JAG/JAG Logo/JAG_Logo.png` per project notes).

```bash
cp "/Users/cavslee/Desktop/JAG/JAG Logo/JAG_Logo.png" public/assets/jag-logo.png
```

If source path does not exist, HALT and ask owner for the actual logo location.

- [ ] **Step 3: Copy founder photo**

Source: image provided by owner during 2026-05-15 brainstorming (`/Users/cavslee/Desktop/JAG/JAG Decks/images/Screenshot 2026-05-05 at 7.09.36 PM-modified.png`).

```bash
cp "/Users/cavslee/Desktop/JAG/JAG Decks/images/Screenshot 2026-05-05 at 7.09.36 PM-modified.png" public/assets/founder-photo.png
```

- [ ] **Step 4: Verify and inspect dimensions**

```bash
ls -la public/assets/
file public/assets/jag-logo.png public/assets/founder-photo.png
```

Expected: both PNG files present, sane dimensions reported.

### Task A.3: Extend `tailwind.config.ts` with brief tokens (additive)

**Files:** `tailwind.config.ts`

- [ ] **Step 1: Rewrite the file with new tokens alongside old**

Replace `tailwind.config.ts` with:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#05080F',
          surface: '#0B1220',
          surfaceElevated: '#0F1A2E',
          surfaceMuted: '#080D17',
          primary: '#0A1628',
          secondary: '#111E32',
          elevated: '#1A2B47',
          deep: '#050D1A',
        },
        border: {
          DEFAULT: '#1E2F4A',
          subtle: 'rgba(148, 163, 184, 0.08)',
          default: 'rgba(148, 163, 184, 0.14)',
          strong: 'rgba(34, 211, 238, 0.30)',
          glow: 'rgba(34, 211, 238, 0.50)',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          tertiary: '#94A3B8',
          quaternary: '#64748B',
          inverse: '#0F172A',
          onAccent: '#05080F',
        },
        brand: {
          cyan: '#22D3EE',
          cyanBright: '#67E8F9',
          cyanDeep: '#0891B2',
          amber: '#F59E0B',
          red: '#EF4444',
          green: '#10B981',
        },
        accent: {
          DEFAULT: '#22D3EE',
          hover: '#67E8F9',
          glow: 'rgba(34, 211, 238, 0.15)',
        },
        metric: {
          green: '#10B981',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        eyebrow: ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.4', letterSpacing: '0.12em' }],
        body: ['clamp(1rem, 0.95rem + 0.25vw, 1.125rem)', { lineHeight: '1.6' }],
        bodyLg: ['clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem)', { lineHeight: '1.6' }],
        h3: ['clamp(1.5rem, 1.3rem + 1vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h2: ['clamp(2rem, 1.6rem + 2vw, 3.25rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h1: ['clamp(2.75rem, 2rem + 3.75vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        hero: ['clamp(3.5rem, 2.5rem + 5vw, 7.5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
      },
      maxWidth: {
        container: '1280px',
        containerWide: '1280px',
        content: '720px',
        narrow: '960px',
      },
      spacing: {
        section: 'clamp(5rem, 4rem + 5vw, 9rem)',
        sectionInner: 'clamp(3rem, 2rem + 3vw, 5rem)',
        gutter: 'clamp(1.5rem, 1rem + 2vw, 3rem)',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
        '2xl': '1920px',
      },
      borderRadius: {
        pill: '999px',
      },
      boxShadow: {
        'glow-sm': '0 0 24px rgba(34, 211, 238, 0.12)',
        'glow-md': '0 0 48px rgba(34, 211, 238, 0.20)',
        'glow-lg': '0 0 60px rgba(34, 211, 238, 0.12)',
        'glow-xl': '0 0 72px rgba(34, 211, 238, 0.25)',
        cardHover: '0 0 0 1px rgba(34, 211, 238, 0.2), 0 20px 40px -20px rgba(34, 211, 238, 0.15)',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
        decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
        hero: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '200ms',
        base: '400ms',
        slow: '800ms',
        hero: '1200ms',
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'draw-stroke': {
          '0%':   { strokeDashoffset: '1' },
          '100%': { strokeDashoffset: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.04' },
          '50%':      { opacity: '0.10' },
        },
        'glow-bloom': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-in-left': 'slide-in-left 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'draw-stroke': 'draw-stroke 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulse-glow 6s ease-in-out infinite',
        'glow-bloom': 'glow-bloom 2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Verify typecheck still passes**

```bash
npm run typecheck
```

Expected: no errors. (Existing components reference `text-text-primary`, `bg-bg-primary`, etc. via old keys still present.)

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: clean.

### Task A.4: Wire `next/font` (Geist + JetBrains Mono)

**Files:** `app/layout.tsx`, `app/globals.css`

- [ ] **Step 1: Read existing `app/layout.tsx`**

```bash
cat app/layout.tsx
```

- [ ] **Step 2: Rewrite `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JAG Cybersecurity — Sovereign Agentic AI. On-Device.',
  description:
    "JAG is the world's first standalone Agentic AI cybersecurity platform for sovereign and data-sensitive organizations. Every component runs entirely on the NVIDIA Jetson edge AI platform. Zero cloud. Zero exfiltration.",
  metadataBase: new URL('https://www.jag-cybersecurity.io'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'JAG Cybersecurity — Sovereign Agentic AI. On-Device.',
    description:
      'Sovereign Agentic AI cybersecurity. Zero cloud. Zero exfiltration. Zero trust.',
    url: 'https://www.jag-cybersecurity.io',
    siteName: 'JAG Cybersecurity',
    images: [{ url: '/og', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JAG Cybersecurity — Sovereign Agentic AI. On-Device.',
    description:
      'Sovereign Agentic AI cybersecurity. Zero cloud. Zero exfiltration. Zero trust.',
    images: ['/og'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg-base text-text-primary antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Rewrite `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body), system-ui, sans-serif;
  background: #05080F;
  color: #F8FAFC;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Verify CSP allows Google Fonts**

```bash
grep -n 'fonts.googleapis\|fonts.gstatic' next.config.mjs public/_headers
```

Expected: both files reference `https://fonts.googleapis.com` and `https://fonts.gstatic.com` in `style-src` and `font-src`. Verified — already configured.

- [ ] **Step 5: Build + smoke check**

```bash
npm run typecheck && npm run build
```

Expected: build succeeds, no warnings about fonts.

### Task A.5: Rebuild `components/Navigation.tsx`

**Files:** `components/Navigation.tsx`

- [ ] **Step 1: L2 backup**

```bash
cp -p components/Navigation.tsx components/Navigation.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Replace contents**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '#solution', label: 'Solution' },
  { href: '#pipeline', label: 'Technology' },
  { href: '#markets', label: 'Markets' },
  { href: '#contact', label: 'Contact' },
];

export default function Navigation() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > lastY.current && y > 120) setHidden(true);
        else setHidden(false);
        lastY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-base ease-standard ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="border-b border-border-default backdrop-blur-md bg-bg-base/80">
        <nav className="mx-auto flex max-w-container items-center justify-between px-gutter py-4">
          <Link href="/" className="font-display text-xl font-semibold tracking-tight">
            <span className="text-text-primary">JAG</span>
            <span className="text-brand-cyan">.</span>
          </Link>
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-fast"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="hidden md:inline-flex items-center rounded-md bg-brand-cyan px-5 py-2 text-sm font-semibold text-text-onAccent hover:bg-brand-cyanBright transition-colors duration-fast"
          >
            Request Demo
          </a>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            className="md:hidden text-text-primary"
            onClick={() => setOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </nav>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-bg-base transition-transform duration-base ease-standard md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-gutter py-4 border-b border-border-default">
          <span className="font-display text-xl font-semibold">
            <span className="text-text-primary">JAG</span>
            <span className="text-brand-cyan">.</span>
          </span>
          <button
            type="button"
            aria-label="Close menu"
            className="text-text-primary"
            onClick={() => setOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col gap-6 px-gutter py-8">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-2xl text-text-primary hover:text-brand-cyan transition-colors duration-fast"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="inline-flex items-center rounded-md bg-brand-cyan px-5 py-3 text-base font-semibold text-text-onAccent"
              onClick={() => setOpen(false)}
            >
              Request Demo
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: clean.

### Task A.6: Rebuild `components/Footer.tsx`

**Files:** `components/Footer.tsx`

- [ ] **Step 1: L2 backup**

```bash
cp -p components/Footer.tsx components/Footer.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Replace contents**

```tsx
import Link from 'next/link';
import { Linkedin } from 'lucide-react';

const COLS = [
  {
    title: 'Solution',
    links: [
      { href: '#threats', label: 'Threat Landscape' },
      { href: '#solution', label: 'Capabilities' },
      { href: '#five-layers', label: 'Five Layers' },
    ],
  },
  {
    title: 'Technology',
    links: [
      { href: '#pipeline', label: 'Pipeline' },
      { href: '#architecture', label: 'Architecture' },
      { href: '#technology', label: 'Standards' },
    ],
  },
  {
    title: 'Markets',
    links: [
      { href: '#markets', label: 'Who We Serve' },
      { href: '#founder', label: 'Founder' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { href: 'mailto:connect@jag-cybersecurity.io', label: 'connect@' },
      { href: 'mailto:kelvin@jag-cybersecurity.io', label: 'kelvin@' },
      { href: '#contact', label: 'Demo Request' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-default bg-bg-surfaceMuted">
      <div className="mx-auto max-w-container px-gutter py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="md:col-span-1">
            <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
              <span className="text-text-primary">JAG</span>
              <span className="text-brand-cyan">.</span>
            </Link>
            <p className="mt-3 text-sm text-text-tertiary max-w-[28ch]">
              Sovereign Agentic AI cybersecurity. Zero cloud. Zero exfiltration. Zero trust.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-xs uppercase tracking-eyebrow text-brand-cyan">{col.title}</h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-fast"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-border-subtle pt-8">
          <p className="text-xs text-text-quaternary">
            © 2026 JAG Cybersecurity Sdn Bhd · Penang, Malaysia · All rights reserved.
          </p>
          <p className="text-xs text-text-quaternary flex items-center gap-3">
            <Linkedin className="h-4 w-4" aria-hidden />
            Operations: Malaysia · Holdco: Singapore
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

```bash
npm run typecheck && npm run lint
```

Expected: clean.

### Task A.7: Extend `components/ui/FadeInOnScroll.tsx` with `delay` prop

**Files:** `components/ui/FadeInOnScroll.tsx`

- [ ] **Step 1: L2 backup**

```bash
cp -p components/ui/FadeInOnScroll.tsx components/ui/FadeInOnScroll.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Read current implementation**

```bash
cat components/ui/FadeInOnScroll.tsx
```

- [ ] **Step 3: Update with `delay` prop**

```tsx
'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function FadeInOnScroll({ children, delay = 0, className = '' }: Props) {
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
      style={{ animationDelay: visible ? `${delay}ms` : undefined }}
      className={`${visible ? 'animate-fade-in-up' : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: clean.

### Task A.8: Verify existing UI primitives still work with new tokens

**Files:** `components/ui/Container.tsx`, `components/ui/SectionHeader.tsx`, `components/ui/Card.tsx`, `components/ui/MetricCounter.tsx`

- [ ] **Step 1: Inspect each**

```bash
for f in components/ui/Container.tsx components/ui/SectionHeader.tsx components/ui/Card.tsx components/ui/MetricCounter.tsx; do
  echo "===== $f ====="
  cat "$f"
done
```

- [ ] **Step 2: Update any hex literals to token references**

For each file, search for hex / rgba literals:

```bash
rg "color:|background:|border:|#[0-9A-Fa-f]{6}|rgba\(" components/ui/
```

For any literal found, replace with the equivalent Tailwind class using new tokens (e.g., `#22D3EE` → `text-brand-cyan`, `rgba(0, 217, 255, 0.15)` → `bg-accent-glow`). Edit each occurrence individually.

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: clean.

### Task A.9: Phase A checkpoint — build + manual smoke

- [ ] **Step 1: Production build**

```bash
npm run build
```

Expected: build succeeds, no warnings. First Load JS on `/` reported.

- [ ] **Step 2: Serve and smoke**

```bash
npx serve out -p 3001 &
SERVE_PID=$!
sleep 2
curl -s http://localhost:3001 -o /tmp/smoke.html && grep -E 'JAG\.|Geist|JetBrains' /tmp/smoke.html | head -3
kill $SERVE_PID 2>/dev/null
```

Expected: HTML contains `JAG.` wordmark and font references.

- [ ] **Step 3: Commit Phase A**

```bash
git add -A
git commit -m "feat(rebuild): Phase A — tokens, fonts, layout, nav, footer

Adds design-tokens.ts equivalents to tailwind.config.ts (accent #22D3EE,
bg.base #05080F, 6-level text hierarchy, 4-level border alpha, fluid
type scale via clamp, motion easings). Wires Geist + JetBrains Mono via
next/font with CSS vars (--font-body, --font-mono). Rebuilds Navigation
(sticky, backdrop-blur, hide-on-scroll-down, mobile overlay) and Footer
(minimal 4-col + © strip). Extends FadeInOnScroll with delay prop.

Old tokens kept alongside new for backward compat; full sweep in Phase J.
Charter §1.2 backup discipline followed (.backup-YYYYMMDD-HHMMSS for
tailwind.config.ts, app/globals.css, app/layout.tsx, Navigation.tsx,
Footer.tsx, FadeInOnScroll.tsx)."
```

---

# Phase B — Hero (single drawing shield)

Spec §5. Inline SVG shield draws over 1.2 s with `cubic-bezier(0.16, 1, 0.3, 1)`, radial cyan glow blooms over 2 s, text staggered 200→1300 ms.

### Task B.1: Create `components/ui/ShieldSVG.tsx`

**Files:** `components/ui/ShieldSVG.tsx`

- [ ] **Step 1: Create the file**

```tsx
interface Props {
  className?: string;
  animate?: boolean;
  size?: number;
}

export default function ShieldSVG({ className = '', animate = false, size = 480 }: Props) {
  const animClass = animate ? 'animate-draw-stroke' : '';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id="shield-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#shield-stroke)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M100 8 L188 36 L188 116 C188 168 152 208 100 232 C48 208 12 168 12 116 L12 36 Z"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={animate ? '1' : '0'}
          className={animClass}
          style={animate ? { animationDelay: '0ms' } : undefined}
        />
        <path
          d="M100 38 L162 58 L162 116 C162 156 134 188 100 208 C66 188 38 156 38 116 L38 58 Z"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={animate ? '1' : '0'}
          className={animClass}
          style={animate ? { animationDelay: '200ms' } : undefined}
          opacity="0.5"
        />
        <path
          d="M70 100 L100 80 L130 100 L130 140 L100 160 L70 140 Z"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={animate ? '1' : '0'}
          className={animClass}
          style={animate ? { animationDelay: '400ms' } : undefined}
          opacity="0.7"
        />
        <path
          d="M100 80 L100 160 M70 120 L130 120"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={animate ? '1' : '0'}
          className={animClass}
          style={animate ? { animationDelay: '600ms' } : undefined}
          opacity="0.4"
        />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

### Task B.2: Add Hero content to `lib/content.ts`

**Files:** `lib/content.ts`

- [ ] **Step 1: L2 backup**

```bash
cp -p lib/content.ts lib/content.ts.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Read current file**

```bash
cat lib/content.ts
```

- [ ] **Step 3: Add hero key (preserve existing exports)**

In `lib/content.ts`, add the following named export (do not remove existing exports):

```ts
export const hero = {
  eyebrow: 'SOVEREIGN AGENTIC AI · APRIL 2026',
  headlineLine1: 'Agentic AI Cybersecurity.',
  headlineLine2: 'Runs Entirely On-Device.',
  subhead:
    "JAG is the world's first standalone Agentic AI cybersecurity platform for sovereign and data-sensitive organizations. Every component — threat detection, decision-making, autonomous response, AI validation — runs entirely on the NVIDIA Jetson edge AI platform. No cloud calls. No data exfiltration. No compromise.",
  ctaPrimary: { label: 'Request a Demo', href: '#contact' },
  ctaSecondary: { label: 'See How It Works', href: '#pipeline' },
  trust: ['NVIDIA Jetson Orin NX', 'Air-gap Capable', '6 Patents Pending', 'Sub-5-second Time-to-Block'],
} as const;
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```

### Task B.3: Rewrite `components/sections/Hero.tsx`

**Files:** `components/sections/Hero.tsx`

- [ ] **Step 1: L2 backup**

```bash
cp -p components/sections/Hero.tsx components/sections/Hero.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Replace contents**

```tsx
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import ShieldSVG from '@/components/ui/ShieldSVG';
import { hero } from '@/lib/content';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-bg-base px-gutter pt-32 pb-section"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 animate-glow-bloom"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(34, 211, 238, 0.12) 0%, transparent 60%)',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 animate-pulse-glow">
        <ShieldSVG animate size={560} />
      </div>
      <div className="relative mx-auto max-w-container text-center">
        <FadeInOnScroll delay={200}>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {hero.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={400}>
          <h1 className="mt-6 font-display text-hero font-semibold text-text-primary leading-display tracking-display">
            {hero.headlineLine1}
          </h1>
        </FadeInOnScroll>
        <FadeInOnScroll delay={600}>
          <h2
            className="font-display text-hero font-semibold leading-display tracking-display bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #22D3EE 0%, #67E8F9 50%, #A5F3FC 100%)',
            }}
          >
            {hero.headlineLine2}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={900}>
          <p className="mx-auto mt-8 max-w-[65ch] text-bodyLg text-text-secondary">
            {hero.subhead}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={1100}>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={hero.ctaPrimary.href}
              className="inline-flex items-center justify-center rounded-md bg-brand-cyan px-7 py-3 text-base font-semibold text-text-onAccent hover:bg-brand-cyanBright transition-colors duration-fast"
            >
              {hero.ctaPrimary.label} →
            </a>
            <a
              href={hero.ctaSecondary.href}
              className="inline-flex items-center justify-center rounded-md border border-brand-cyan px-7 py-3 text-base font-semibold text-brand-cyan hover:bg-brand-cyan/10 transition-colors duration-fast"
            >
              {hero.ctaSecondary.label}
            </a>
          </div>
        </FadeInOnScroll>
        <FadeInOnScroll delay={1300}>
          <p className="mt-14 font-mono text-xs text-text-quaternary flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            {hero.trust.map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden>·</span>}
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

- [ ] **Step 3: Typecheck + lint**

```bash
npm run typecheck && npm run lint
```

### Task B.4: Phase B checkpoint

- [ ] **Step 1: Build + serve**

```bash
npm run build && (npx serve out -p 3001 &) && sleep 2
```

- [ ] **Step 2: Visual smoke**

Open `http://localhost:3001` in browser. Confirm:
- Shield draws over ~1.2 s
- Glow blooms over ~2 s
- Eyebrow → H1 → H2 (gradient) → Subhead → CTAs → Trust band stagger in
- DevTools Rendering → Emulate `prefers-reduced-motion: reduce` → all animations skip to final state

Kill server: `pkill -f "serve out"`

- [ ] **Step 3: Lighthouse mobile probe**

```bash
npm run lighthouse
```

Expected: all four categories ≥95. If Performance <95, profile and tune before next phase.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(rebuild): Phase B — Hero with drawing shield + radial glow

Inline SVG shield (~2 kB) draws over 1.2s via stroke-dasharray + cubic-bezier
(0.16, 1, 0.3, 1). Single radial-gradient glow blooms over 2s. Six-element
text stagger 200→1300ms via extended FadeInOnScroll. Gradient lockup on
'Runs Entirely On-Device.' via background-clip: text. Reduced-motion
honoured via globals.css blanket short-circuit."
```

---

# Phase C — ThreatLandscape + Capabilities + ProofBar

Spec §6 rows 2-3.

### Task C.1: Add content keys

**Files:** `lib/content.ts`

- [ ] **Step 1: Append new exports** (preserve all existing)

```ts
export const threatLandscape = {
  eyebrow: 'THE NEW THREAT LANDSCAPE',
  headline: 'The AI-fication of Cyber Threats Has Begun.',
  lede:
    'Autonomous AI agents are now writing exploits, conducting reconnaissance, and adapting attacks in real time. Legacy security stacks — designed for human-paced threats — cannot match machine-speed adversaries. The defenders need their own AI.',
  cards: [
    {
      title: 'The Sovereignty Gap',
      body:
        'Cloud-dependent security tools ship sensitive data to vendor infrastructure outside your jurisdiction. For sovereign and regulated organizations, this is increasingly untenable.',
      icon: 'ShieldOff',
    },
    {
      title: 'The Legacy Stack',
      body:
        'Signature-based detection and static rules cannot keep up with AI-generated polymorphic attacks and novel multi-stage intrusions.',
      icon: 'AlertTriangle',
    },
    {
      title: 'The Skills Shortage',
      body:
        'There are not enough security analysts on Earth to investigate every alert. Autonomous response is no longer optional — it is operationally required.',
      icon: 'Users',
    },
    {
      title: 'The Attack Surface Explosion',
      body:
        'OT, IoT, SCADA, and edge devices have multiplied the entry points. Centralized cloud-based defense cannot reach the edge fast enough.',
      icon: 'Network',
    },
  ],
  closing: 'JAG was built for this new reality.',
} as const;

export const capabilities = {
  eyebrow: 'INTRODUCING JAG',
  headline: 'Cybersecurity That Thinks at the Edge.',
  cards: [
    {
      title: 'Real-Time Threat Detection',
      body:
        'Wire-speed packet inspection paired with on-device AI classifiers. Threats are identified and scored in sub-second time, every time.',
      icon: 'Activity',
    },
    {
      title: 'Autonomous Response',
      body:
        'Block, quarantine, alert, or escalate — JAG decides and acts without waiting for a human. The human reviews; the system does not stall.',
      icon: 'Zap',
    },
    {
      title: 'AI Validation Watchdog',
      body:
        'A second AI keeps the first one honest. Hallucinations, prompt injections, and adversarial inputs are caught before any enforcement action fires.',
      icon: 'Eye',
    },
    {
      title: 'Sovereign by Design',
      body:
        'Every decision happens on the NVIDIA Jetson Orin NX. No cloud round-trips, no data exfiltration, no third-party visibility into your traffic.',
      icon: 'Lock',
    },
  ],
  proofBar: {
    stats: [
      { value: 10, suffix: '/10', label: 'Attack types blocked' },
      { value: 5, suffix: ' sec', label: 'Time-to-block' },
      { value: 0, suffix: '%', label: 'False positive rate' },
      { value: 310, suffix: '/310', label: 'Unit tests passing' },
      { value: 113, suffix: ' claims', label: 'Patent claims filed' },
    ],
    caption:
      'Validated in controlled red-team exercise — April 2026. Patents filed with MyIPO under Solarz personal name, assignment to JAG Cybersecurity Sdn Bhd in Q3-Q4 2026.',
  },
} as const;
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

### Task C.2: Rebuild `components/sections/Threats.tsx` (the ThreatLandscape section)

**Files:** `components/sections/Threats.tsx`

- [ ] **Step 1: L2 backup**

```bash
cp -p components/sections/Threats.tsx components/sections/Threats.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Replace contents**

```tsx
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import { threatLandscape } from '@/lib/content';
import { ShieldOff, AlertTriangle, Users, Network, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = { ShieldOff, AlertTriangle, Users, Network };

export default function Threats() {
  return (
    <section id="threats" className="bg-bg-base py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {threatLandscape.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={150}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[24ch]">
            {threatLandscape.headline}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={300}>
          <p className="mt-6 max-w-[65ch] text-body text-text-secondary">{threatLandscape.lede}</p>
        </FadeInOnScroll>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {threatLandscape.cards.map((c, i) => {
            const Icon = ICONS[c.icon];
            return (
              <FadeInOnScroll key={c.title} delay={100 * i}>
                <div className="group relative rounded-lg bg-bg-surface border border-border-default p-7 transition-all duration-base ease-standard hover:-translate-y-1 hover:border-border-strong hover:shadow-cardHover overflow-hidden h-full">
                  <span className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-brand-cyan to-transparent transition-all duration-base ease-standard group-hover:w-full" />
                  <Icon className="h-8 w-8 text-brand-cyan" aria-hidden />
                  <h3 className="mt-6 font-display text-h3 font-semibold text-text-primary leading-heading tracking-heading">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-body text-text-secondary leading-body">{c.body}</p>
                </div>
              </FadeInOnScroll>
            );
          })}
        </div>
        <FadeInOnScroll delay={500}>
          <p className="mt-16 text-center italic text-text-tertiary">{threatLandscape.closing}</p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

```bash
npm run typecheck && npm run lint
```

### Task C.3: Build `components/ui/ProofBar.tsx`

**Files:** `components/ui/ProofBar.tsx`

- [ ] **Step 1: Read existing `components/ui/MetricCounter.tsx`**

```bash
cat components/ui/MetricCounter.tsx
```

Note its API (props: `value`, `suffix`, etc.).

- [ ] **Step 2: Create `ProofBar.tsx`**

```tsx
import MetricCounter from '@/components/ui/MetricCounter';
import { capabilities } from '@/lib/content';

export default function ProofBar() {
  const { stats, caption } = capabilities.proofBar;
  return (
    <div className="bg-bg-surfaceMuted border-y border-border-default">
      <div className="mx-auto max-w-container px-gutter py-12">
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {stats.map((s) => (
            <li key={s.label} className="text-center">
              <p className="font-mono text-h2 font-semibold text-brand-cyan">
                <MetricCounter value={s.value} />
                <span>{s.suffix}</span>
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-eyebrow text-text-tertiary">
                {s.label}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-text-quaternary max-w-[80ch] mx-auto">{caption}</p>
      </div>
    </div>
  );
}
```

If `MetricCounter` API does not accept a single `value` prop, adapt the call signature. Inspect first; do not assume.

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

### Task C.4: Rebuild `components/sections/Solution.tsx` (the Capabilities section)

**Files:** `components/sections/Solution.tsx`

- [ ] **Step 1: L2 backup**

```bash
cp -p components/sections/Solution.tsx components/sections/Solution.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Replace contents**

```tsx
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import ProofBar from '@/components/ui/ProofBar';
import { capabilities } from '@/lib/content';
import { Activity, Zap, Eye, Lock, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = { Activity, Zap, Eye, Lock };

export default function Solution() {
  return (
    <>
      <section id="solution" className="bg-bg-base py-section">
        <div className="mx-auto max-w-container px-gutter">
          <FadeInOnScroll>
            <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
              {capabilities.eyebrow}
            </p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={150}>
            <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[24ch]">
              {capabilities.headline}
            </h2>
          </FadeInOnScroll>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.cards.map((c, i) => {
              const Icon = ICONS[c.icon];
              return (
                <FadeInOnScroll key={c.title} delay={100 * i}>
                  <div className="group relative rounded-lg bg-bg-surface border border-border-default p-8 transition-all duration-base ease-standard hover:-translate-y-1 hover:border-border-strong hover:shadow-cardHover overflow-hidden h-full">
                    <span className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-brand-cyan to-transparent transition-all duration-base ease-standard group-hover:w-full" />
                    <Icon className="h-9 w-9 text-brand-cyan" aria-hidden />
                    <h3 className="mt-6 font-display text-h3 font-semibold text-text-primary leading-heading tracking-heading">
                      {c.title}
                    </h3>
                    <p className="mt-3 text-body text-text-secondary leading-body">{c.body}</p>
                  </div>
                </FadeInOnScroll>
              );
            })}
          </div>
        </div>
      </section>
      <ProofBar />
    </>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

```bash
npm run typecheck && npm run lint
```

### Task C.5: Phase C checkpoint

- [ ] **Step 1: Build + visual smoke**

```bash
npm run build && (npx serve out -p 3001 &) && sleep 2
```

Open browser, scroll through Threats and Solution+ProofBar. Confirm:
- 4 threat cards: hover lifts, top-edge cyan line slides in
- 4 capability cards: hover lifts, top-edge cyan line slides in
- ProofBar stats animate 0 → target on scroll-into-view (10/10, 5, 0%, 310/310, 113)
- Mobile (resize DevTools to 375): cards stack 1-col, ProofBar grid stacks to 2-col

`pkill -f "serve out"`

- [ ] **Step 2: a11y check**

```bash
npm run test:a11y
```

Expected: zero violations.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(rebuild): Phase C — ThreatLandscape + Capabilities + animated ProofBar

Threats and Solution rewritten: amber border dropped, top-edge cyan
gradient hover line introduced. 2×2 capability grid. New ProofBar
primitive lays a full-width band with 5 animated metrics (10/10,
5s, 0%, 310/310, 113 claims) using existing MetricCounter."
```

---

# Phase D — Pipeline (5-stage horizontal flow + SVG lines)

Spec §6 row 4. Pipeline keeps animated `stroke-dasharray` lines but NO canvas particles (canvas budget consolidated to §5 Architecture per spec).

### Task D.1: Add pipeline content

**Files:** `lib/content.ts`

- [ ] **Step 1: Append (preserve existing)**

```ts
export const pipeline = {
  eyebrow: 'HOW IT WORKS',
  headline: 'Five-Stage Tiered Inference Pipeline.',
  lede:
    "JAG's patented architecture routes every packet through five escalating inference tiers — fast decisions at the edge, deep analysis where it matters.",
  stages: [
    {
      step: '01',
      title: 'Inspect',
      tagline: 'Watches every packet',
      detail:
        'Wire-speed inspection of network packets. Kernel-level visibility before any rule fires.',
      tone: 'cyanDeep',
    },
    {
      step: '02',
      title: 'Block',
      tagline: 'Stops known bad traffic',
      detail:
        'iptables/ipset enforcement at line rate. Known signatures and protocol violations dropped immediately.',
      tone: 'cyanDeep',
    },
    {
      step: '03',
      title: 'Quick Think',
      tagline: 'Fast on-device AI checks suspicious traffic',
      detail:
        'Lightweight CPU-tier classifier resolves ambiguous traffic in sub-second. Most ambiguity ends here.',
      tone: 'cyan',
    },
    {
      step: '04',
      title: 'Deep Think',
      tagline: 'Foundation-Sec-8B reasons through the trickiest cases',
      detail:
        'GPU-accelerated cybersecurity-specialized LLM. Reasons about novel attack patterns, social engineering, multi-stage intrusions.',
      tone: 'cyanBright',
    },
    {
      step: '05',
      title: 'Act',
      tagline: 'Takes action, alerts, seals the proof',
      detail:
        'Autonomous block / quarantine / alert / escalate. Cryptographic evidence bundle written to tamper-evident ledger.',
      tone: 'cyanBright',
    },
  ],
  caption:
    'Most threats are stopped at the gate (01-02). Only the suspicious reach Quick Think (03). Only the trickiest reach Deep Think (04). The right amount of brainpower for every threat.',
} as const;
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

### Task D.2: Rebuild `components/sections/Pipeline.tsx`

**Files:** `components/sections/Pipeline.tsx`

- [ ] **Step 1: L2 backup**

```bash
cp -p components/sections/Pipeline.tsx components/sections/Pipeline.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Replace contents**

```tsx
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import { pipeline } from '@/lib/content';

const TONE: Record<string, string> = {
  cyanDeep: 'border-brand-cyanDeep',
  cyan: 'border-brand-cyan',
  cyanBright: 'border-brand-cyanBright shadow-glow-sm',
};

export default function Pipeline() {
  return (
    <section id="pipeline" className="bg-bg-base py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {pipeline.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={150}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[28ch]">
            {pipeline.headline}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={300}>
          <p className="mt-6 max-w-[65ch] text-body text-text-secondary">{pipeline.lede}</p>
        </FadeInOnScroll>

        <div className="relative mt-16 hidden lg:block">
          <svg
            className="absolute inset-x-0 top-1/2 -z-0 h-2 w-full -translate-y-1/2"
            viewBox="0 0 1200 8"
            preserveAspectRatio="none"
            aria-hidden
          >
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={120 + i * 240}
                y1="4"
                x2={360 + i * 240}
                y2="4"
                stroke="#22D3EE"
                strokeWidth="1"
                strokeOpacity="0.4"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                className="animate-draw-stroke"
                style={{ animationDelay: `${i * 300}ms` }}
              />
            ))}
          </svg>
          <ol className="relative grid grid-cols-5 gap-4">
            {pipeline.stages.map((s, i) => (
              <FadeInOnScroll key={s.step} delay={150 * i}>
                <li
                  className={`relative bg-bg-surface border ${TONE[s.tone]} rounded-lg p-6 h-full`}
                >
                  <p className="font-mono text-h2 font-semibold text-brand-cyan leading-none">
                    {s.step}
                  </p>
                  <h3 className="mt-4 font-display text-h3 font-semibold text-text-primary leading-heading tracking-heading">
                    {s.title}
                  </h3>
                  <p className="mt-2 font-mono text-xs text-text-tertiary">{s.tagline}</p>
                  <p className="mt-4 text-sm text-text-secondary leading-body">{s.detail}</p>
                </li>
              </FadeInOnScroll>
            ))}
          </ol>
        </div>

        <ol className="mt-16 grid gap-4 lg:hidden">
          {pipeline.stages.map((s, i) => (
            <FadeInOnScroll key={s.step} delay={100 * i}>
              <li className={`bg-bg-surface border ${TONE[s.tone]} rounded-lg p-6`}>
                <p className="font-mono text-h2 font-semibold text-brand-cyan leading-none">{s.step}</p>
                <h3 className="mt-4 font-display text-h3 font-semibold text-text-primary leading-heading tracking-heading">
                  {s.title}
                </h3>
                <p className="mt-2 font-mono text-xs text-text-tertiary">{s.tagline}</p>
                <p className="mt-4 text-sm text-text-secondary leading-body">{s.detail}</p>
              </li>
            </FadeInOnScroll>
          ))}
        </ol>

        <FadeInOnScroll delay={500}>
          <p className="mt-12 text-center italic text-text-tertiary max-w-[70ch] mx-auto">
            {pipeline.caption}
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck + lint + build**

```bash
npm run typecheck && npm run lint && npm run build
```

Capture First Load JS for `/` from build output. Note in commit message.

### Task D.3: Phase D checkpoint

- [ ] **Step 1: Visual smoke**

```bash
(npx serve out -p 3001 &) && sleep 2
```

Open browser. Verify:
- Desktop ≥1024 px: 5 cards in horizontal row, connecting lines draw left-to-right on scroll-in
- Mobile: 5 cards stack vertical
- Tone escalation cyan-deep → cyan → cyan-bright with glow on stages 04 + 05

`pkill -f "serve out"`

- [ ] **Step 2: Lighthouse mobile**

```bash
npm run lighthouse
```

Expected: ≥95 all four. If Perf <96, halt and tune before next phase.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(rebuild): Phase D — Pipeline 5-stage horizontal flow + animated lines

Desktop: 5-card horizontal grid with cyan SVG connecting lines that draw
left-to-right via stroke-dasharray, staggered 0/300/600/900ms. Tone
escalates cyanDeep → cyan → cyanBright through tiers, with soft glow
on Deep Think (04) and Act (05). Mobile: vertical stack.

Per spec §6: canvas particles deferred to Phase E Architecture section
to consolidate the rebuild's single-canvas budget where the packet
metaphor is literally the architecture story."
```

---

# Phase E — Architecture (SVG diagram + canvas perimeter inspector)

Spec §7. The centrepiece of the rebuild. **If First Load JS exceeds 95 kB after this phase, drop the canvas and ship SVG-only fallback.**

### Task E.1: Add architecture content

**Files:** `lib/content.ts`

- [ ] **Step 1: Append**

```ts
export const architecture = {
  eyebrow: 'ARCHITECTURE',
  headline: 'One Sovereign Device. Five Defense Layers.',
  lede:
    'JAG sits inline between the untrusted internet and your protected network. Every packet is inspected, classified, and either blocked at the edge or escalated to deeper inference — all on a single NVIDIA Jetson Orin NX.',
  destinations: [
    { icon: 'Monitor', label: 'Workstations' },
    { icon: 'Server', label: 'Servers & IoT' },
    { icon: 'Camera', label: 'IP Surveillance' },
    { icon: 'Factory', label: 'Industrial / SCADA / PLC' },
  ],
  jetsonLayers: ['Edge AI Processing', 'Adaptive Threat Management', 'Intelligent Gateway'],
  caption:
    'All inference, validation, and enforcement happens on the device. Zero cloud round-trips. Zero data exfiltration.',
} as const;
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

### Task E.2: Create `components/ui/PacketParticles.tsx`

**Files:** `components/ui/PacketParticles.tsx`

- [ ] **Step 1: Create**

```tsx
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
const EMIT_RATE_MS = 80;
const SHIELD_X = 0.5;

export default function PacketParticles({ width = 900, height = 500 }: { width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastEmitRef = useRef(0);
  const runningRef = useRef(false);
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

    const tick = (now: number) => {
      if (!runningRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (now - lastEmitRef.current > EMIT_RATE_MS && particlesRef.current.length < MAX_PARTICLES) {
        particlesRef.current.push({
          lane: Math.floor(Math.random() * LANES),
          progress: 0,
          speed: 0.0025 + Math.random() * 0.0015,
          blocked: false,
          blockProgress: 0,
        });
        lastEmitRef.current = now;
      }
      ctx.clearRect(0, 0, width, height);

      particlesRef.current = particlesRef.current.filter((p) => {
        if (!p.blocked) {
          p.progress += p.speed;
          if (p.progress >= SHIELD_X && Math.random() < 0.04) p.blocked = true;
          if (p.progress > 1) return false;
        } else {
          p.blockProgress += 0.04;
          if (p.blockProgress >= 1) return false;
        }
        const laneSpacing = height / (LANES + 1);
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
        return true;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        runningRef.current = entry.isIntersecting && document.visibilityState === 'visible';
      },
      { threshold: 0.1 },
    );
    obs.observe(wrapper);

    const onVis = () => {
      runningRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVis);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      obs.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [width, height]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 pointer-events-none" aria-hidden>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

### Task E.3: Create `components/ui/ArchitectureDiagram.tsx`

**Files:** `components/ui/ArchitectureDiagram.tsx`

- [ ] **Step 1: Create**

```tsx
import { Monitor, Server, Camera, Factory, type LucideIcon } from 'lucide-react';
import PacketParticles from '@/components/ui/PacketParticles';
import ShieldSVG from '@/components/ui/ShieldSVG';
import { architecture } from '@/lib/content';

const ICONS: Record<string, LucideIcon> = { Monitor, Server, Camera, Factory };

export default function ArchitectureDiagram() {
  const { destinations, jetsonLayers } = architecture;
  return (
    <div className="relative w-full aspect-[9/5] bg-bg-surfaceMuted border border-border-default rounded-xl overflow-hidden">
      <svg viewBox="0 0 900 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <defs>
          <radialGradient id="shield-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#22D3EE" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.5">
          {[100, 175, 250, 325, 400].map((y, i) => (
            <line
              key={`in-${y}`}
              x1="80"
              y1={y}
              x2="400"
              y2={y}
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
              className="animate-draw-stroke"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </g>

        <g stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.5">
          {[125, 215, 305, 395].map((y, i) => (
            <line
              key={`out-${y}`}
              x1="500"
              y1={y}
              x2="800"
              y2={y}
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
              className="animate-draw-stroke"
              style={{ animationDelay: `${800 + i * 150}ms` }}
            />
          ))}
        </g>

        <g transform="translate(20, 200)">
          <path
            d="M0 20 C0 10, 10 0, 20 0 H40 C45 -5, 55 -10, 65 0 H80 C90 0, 95 10, 90 20 V40 C100 50, 90 60, 80 60 H10 C0 60, -5 50, 0 40 Z"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeOpacity="0.8"
          />
          <text x="45" y="80" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="#64748B">
            Internet
          </text>
        </g>

        <circle cx="450" cy="250" r="180" fill="url(#shield-glow)" className="opacity-0 animate-glow-bloom" style={{ animationDelay: '1200ms' }} />

        <g transform="translate(370, 130)">
          <rect x="0" y="0" width="160" height="240" rx="14" fill="#0B1220" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1.5" />
          {jetsonLayers.map((label, i) => (
            <g key={label} transform={`translate(12, ${20 + i * 70})`}>
              <rect width="136" height="56" rx="8" fill="#0F1A2E" stroke="#1E2F4A" strokeWidth="1" />
              <text x="68" y="33" textAnchor="middle" fontFamily="var(--font-body)" fontSize="11" fill="#CBD5E1">
                {label}
              </text>
            </g>
          ))}
        </g>

        <g transform="translate(390, 70)" opacity="0.6">
          <foreignObject x="0" y="0" width="120" height="120">
            <ShieldSVG size={120} />
          </foreignObject>
        </g>
      </svg>

      <div className="absolute right-6 top-6 bottom-6 w-44 flex flex-col justify-around">
        {destinations.map((d) => {
          const Icon = ICONS[d.icon];
          return (
            <div key={d.label} className="flex items-center gap-3 bg-bg-surface/60 backdrop-blur-sm border border-border-subtle rounded-md px-3 py-2">
              <Icon className="h-5 w-5 text-brand-cyan shrink-0" aria-hidden />
              <span className="text-xs text-text-secondary">{d.label}</span>
            </div>
          );
        })}
      </div>

      <PacketParticles width={900} height={500} />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

### Task E.4: Create `components/sections/Architecture.tsx`

**Files:** `components/sections/Architecture.tsx`

- [ ] **Step 1: Create**

```tsx
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import ArchitectureDiagram from '@/components/ui/ArchitectureDiagram';
import { architecture } from '@/lib/content';

export default function Architecture() {
  return (
    <section id="architecture" className="bg-bg-base py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {architecture.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={150}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[28ch]">
            {architecture.headline}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={300}>
          <p className="mt-6 max-w-[65ch] text-body text-text-secondary">{architecture.lede}</p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={500}>
          <div className="mt-16">
            <ArchitectureDiagram />
          </div>
        </FadeInOnScroll>
        <FadeInOnScroll delay={700}>
          <p className="mt-6 font-mono text-xs text-text-quaternary text-center max-w-[70ch] mx-auto">
            {architecture.caption}
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + build**

```bash
npm run typecheck && npm run build
```

**Capture First Load JS for `/` from build output.** If >95 kB, halt and apply fallback: comment-out `<PacketParticles />` in `ArchitectureDiagram.tsx`, rebuild, recheck.

### Task E.5: Wire Architecture into `app/page.tsx`

**Files:** `app/page.tsx`

- [ ] **Step 1: L2 backup**

```bash
cp -p app/page.tsx app/page.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Read current page**

```bash
cat app/page.tsx
```

- [ ] **Step 3: Replace with new section order**

```tsx
import Hero from '@/components/sections/Hero';
import Threats from '@/components/sections/Threats';
import Solution from '@/components/sections/Solution';
import Pipeline from '@/components/sections/Pipeline';
import Architecture from '@/components/sections/Architecture';
import FiveLayers from '@/components/sections/FiveLayers';
import Technology from '@/components/sections/Technology';
import Markets from '@/components/sections/Markets';
import Founder from '@/components/sections/Founder';
import Contact from '@/components/sections/Contact';

export default function Page() {
  return (
    <>
      <Hero />
      <Threats />
      <Solution />
      <Pipeline />
      <Architecture />
      <FiveLayers />
      <Technology />
      <Markets />
      <Founder />
      <Contact />
    </>
  );
}
```

Note: `FiveLayers` is created in Phase F. To avoid a broken intermediate state, temporarily stub it for the Phase E commit:

```bash
cat > components/sections/FiveLayers.tsx <<'EOF'
export default function FiveLayers() {
  return <section id="five-layers" className="bg-bg-base py-section" aria-hidden />;
}
EOF
```

- [ ] **Step 4: Typecheck + build**

```bash
npm run typecheck && npm run build
```

### Task E.6: Phase E checkpoint

- [ ] **Step 1: Visual smoke**

```bash
(npx serve out -p 3001 &) && sleep 2
```

Open browser, scroll to Architecture section. Verify:
- 5 ingress lines draw left-to-right with 150 ms stagger
- 4 egress lines draw 800 ms later
- Shield glow blooms at 1200 ms
- Cyan packets emit from left, flow through, ~96% pass through, ~4% are stopped at the shield (red fade-out)
- DevTools → Rendering → Emulate `prefers-reduced-motion: reduce` → canvas is blank, lines snap to drawn state

`pkill -f "serve out"`

- [ ] **Step 2: Lighthouse mobile**

```bash
npm run lighthouse
```

Expected: ≥95 all four. If Perf <96 OR First Load JS >95 kB, drop canvas before commit.

- [ ] **Step 3: a11y check**

```bash
npm run test:a11y
```

Expected: zero violations.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(rebuild): Phase E — Architecture section + perimeter inspector

New Architecture.tsx section (spec §7). Custom inline SVG diagram (3 columns:
untrusted internet → JAG Jetson Orin NX with shield → 4 protected destination
types). Lines draw via stroke-dasharray on scroll-in. Single ~3 kB canvas
overlay (PacketParticles) animates cyan packets along the lanes, ~96% pass
through, ~4% blocked at shield and fade red. Paused under prefers-reduced-
motion, paused off-screen via IntersectionObserver, paused on tab-blur.

FiveLayers temporarily stubbed (built next phase). app/page.tsx updated to
new 10-section order. First Load JS recorded in build output."
```

---

# Phase F — FiveLayers + Standards + Markets

### Task F.1: Add FiveLayers content

**Files:** `lib/content.ts`

- [ ] **Step 1: Append. Body paragraphs drafted to match the brief's plain-English quotes + existing Technology section voice. Owner reviews at Phase F checkpoint.**

```ts
export const fiveLayers = {
  eyebrow: 'THE FIVE LAYERS',
  headline: 'Five Patented Inventions. One Unified Ecosystem.',
  lede:
    "JAG isn't a single tool — it's five integrated defense layers, each a patented invention, working together inside one sovereign device.",
  layers: [
    {
      step: '01',
      title: 'Enforce',
      subtitle: 'The Front Gate',
      body:
        'Kernel-level packet inspection paired with iptables/ipset enforcement at line rate. Known signatures and protocol violations are dropped before any AI tier sees them. The cheapest decision is the one made first.',
      quote:
        'Stops the obvious bad guys at the door — so the rest of the system never has to deal with them.',
    },
    {
      step: '02',
      title: 'Understand',
      subtitle: 'The On-Device Brain',
      body:
        'A cybersecurity-specialized LLM (Foundation-Sec-8B class) runs on the Jetson Orin NX GPU. It reasons about novel attack patterns, multi-stage intrusions, and social engineering — and emits a human-readable explanation alongside every decision.',
      quote:
        'A specialist AI that figures out what the attacker is up to — and explains it in words humans can read.',
    },
    {
      step: '03',
      title: 'Prove',
      subtitle: 'The Tamper-Proof Logbook',
      body:
        'Every decision, every enforcement action, every model output is sealed into a cryptographic evidence bundle and written to a tamper-evident ledger. Auditors and regulators get a chain of custody that holds up under scrutiny.',
      quote:
        'An unbreakable record of every decision — auditors, regulators, and courts can trust it.',
    },
    {
      step: '04',
      title: 'Guard the AI',
      subtitle: 'The AI That Watches the AI',
      body:
        'A second validation model runs adversarial checks against the primary AI: hallucination detection, prompt-injection probes, output-grounding verification. If the validator disagrees, no enforcement fires. The AI is never alone with the gun.',
      quote:
        'A second AI keeps the first one honest — so a tricked or hallucinating AI never gets to take action.',
    },
    {
      step: '05',
      title: 'Adapt',
      subtitle: 'The Self-Improving Loop',
      body:
        'Every attack JAG sees becomes training signal for the on-device classifier. Updates are staged, validated against the proof ledger, and reviewed by a human operator before they go live. The system learns; the human approves.',
      quote:
        'JAG gets smarter with every attack it sees — but a human always has the final say before anything goes live.',
    },
  ],
  closing: {
    title: 'A Defensible Moat by Design',
    body:
      'Protected under a portfolio of 6 patents · 113 claims · filed with MyIPO. The integrated architecture cannot be replicated without infringing.',
  },
} as const;
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

### Task F.2: Create `components/ui/LayerCard.tsx`

**Files:** `components/ui/LayerCard.tsx`

- [ ] **Step 1: Create**

```tsx
interface Props {
  step: string;
  title: string;
  subtitle: string;
  body: string;
  quote: string;
}

export default function LayerCard({ step, title, subtitle, body, quote }: Props) {
  return (
    <article className="group relative rounded-lg bg-bg-surface border border-border-default p-7 h-full transition-all duration-base ease-standard hover:border-border-strong hover:shadow-cardHover overflow-hidden">
      <span className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-brand-cyan to-transparent transition-all duration-base ease-standard group-hover:w-full" />
      <p className="font-mono text-h2 font-semibold text-brand-cyan leading-none">{step}</p>
      <h3 className="mt-4 font-display text-h3 font-semibold text-text-primary leading-heading tracking-heading">
        {title}
      </h3>
      <p className="mt-1 italic text-sm text-text-tertiary">{subtitle}</p>
      <p className="mt-4 text-body text-text-secondary leading-body">{body}</p>
      <div className="mt-6 rounded-md border border-border-subtle bg-bg-surfaceMuted p-4">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-cyan">In Plain English</p>
        <p className="mt-2 text-sm italic text-text-secondary">{quote}</p>
      </div>
    </article>
  );
}
```

### Task F.3: Build `components/sections/FiveLayers.tsx` (replacing the stub)

**Files:** `components/sections/FiveLayers.tsx`

- [ ] **Step 1: Replace stub**

```tsx
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import LayerCard from '@/components/ui/LayerCard';
import { fiveLayers } from '@/lib/content';

export default function FiveLayers() {
  return (
    <section id="five-layers" className="bg-bg-base py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {fiveLayers.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={150}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[28ch]">
            {fiveLayers.headline}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={300}>
          <p className="mt-6 max-w-[65ch] text-body text-text-secondary">{fiveLayers.lede}</p>
        </FadeInOnScroll>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {fiveLayers.layers.map((l, i) => (
            <FadeInOnScroll key={l.step} delay={80 * i} className={i === 4 ? 'md:col-span-2 md:max-w-[calc(50%-12px)] md:mx-auto' : ''}>
              <LayerCard {...l} />
            </FadeInOnScroll>
          ))}
        </div>
        <FadeInOnScroll delay={500}>
          <div className="mt-16 bg-bg-surfaceMuted border-y border-border-default py-12 -mx-gutter px-gutter">
            <p className="text-center font-display text-h3 font-semibold text-text-primary">
              {fiveLayers.closing.title}
            </p>
            <p className="mt-3 text-center text-body text-text-secondary max-w-[60ch] mx-auto">
              {fiveLayers.closing.body}
            </p>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

```bash
npm run typecheck && npm run lint
```

### Task F.4: Add Standards content + rebuild `components/sections/Technology.tsx`

**Files:** `lib/content.ts`, `components/sections/Technology.tsx`

- [ ] **Step 1: Append content**

```ts
export const standards = {
  eyebrow: 'STANDARDS-ALIGNED. AUDIT-READY.',
  headline: 'Mapped to the Frameworks Your Auditors Already Use.',
  lede:
    'Every JAG decision, log, and enforcement action is designed to satisfy global cybersecurity, AI governance, and data protection standards.',
  frameworks: [
    'NIST CSF 2.0',
    'ISO 27001:2022',
    'SOC 2 Type II',
    'OWASP Top 10 + LLM Top 10',
    'CWE / CAPEC',
    'GDPR Art. 44-49',
    'PDPA (Malaysia)',
    'EU AI Act',
    'ISA 18.2',
    'IEC 62443',
    'NIST AI RMF 1.0',
  ],
  caption:
    'JAG is designed to align with leading global cybersecurity, AI governance, and data protection standards. Formal certifications in roadmap.',
} as const;
```

- [ ] **Step 2: L2 backup Technology.tsx**

```bash
cp -p components/sections/Technology.tsx components/sections/Technology.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 3: Replace Technology.tsx**

```tsx
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import { standards } from '@/lib/content';

export default function Technology() {
  return (
    <section id="technology" className="bg-bg-base py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {standards.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={150}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[28ch]">
            {standards.headline}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={300}>
          <p className="mt-6 max-w-[65ch] text-body text-text-secondary">{standards.lede}</p>
        </FadeInOnScroll>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {standards.frameworks.map((f, i) => (
            <FadeInOnScroll key={f} delay={40 * i}>
              <span className="block rounded-pill border border-border-default bg-bg-surface px-5 py-3 text-center font-mono text-xs sm:text-sm text-text-secondary transition-all duration-fast hover:border-border-strong hover:-translate-y-px">
                {f}
              </span>
            </FadeInOnScroll>
          ))}
        </div>
        <FadeInOnScroll delay={500}>
          <p className="mt-8 text-xs text-text-quaternary text-center max-w-[70ch] mx-auto">
            {standards.caption}
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```

### Task F.5: Add Markets content + rebuild `components/sections/Markets.tsx`

**Files:** `lib/content.ts`, `components/sections/Markets.tsx`

- [ ] **Step 1: Append content**

```ts
export const markets = {
  eyebrow: 'WHO WE SERVE',
  headline: 'Built for Sovereign and Data-Sensitive Organizations.',
  segments: [
    {
      icon: 'Banknote',
      title: 'Banking & Financial Services',
      body:
        'Real-time fraud detection and insider threat defense without cloud data exposure.',
    },
    {
      icon: 'Radio',
      title: 'Telecommunications',
      body:
        'Protect core network infrastructure and subscriber data at edge speed.',
    },
    {
      icon: 'Zap',
      title: 'Critical Infrastructure',
      body:
        'Energy grids, water utilities, transportation systems — where downtime is not an option.',
    },
    {
      icon: 'Landmark',
      title: 'Government & Sovereign Agencies',
      body:
        'National security-grade AI defense that never sends data offshore.',
    },
    {
      icon: 'HeartPulse',
      title: 'Healthcare & Research',
      body:
        'Protect patient data and research IP with compliance-ready sovereign architecture.',
    },
    {
      icon: 'Factory',
      title: 'Enterprise & Industrial IoT',
      body:
        'Secure the expanding edge — OT networks, IoT fleets, distributed operations.',
    },
  ],
} as const;
```

- [ ] **Step 2: L2 backup Markets.tsx**

```bash
cp -p components/sections/Markets.tsx components/sections/Markets.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 3: Replace Markets.tsx**

```tsx
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import { markets } from '@/lib/content';
import { Banknote, Radio, Zap, Landmark, HeartPulse, Factory, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = { Banknote, Radio, Zap, Landmark, HeartPulse, Factory };

export default function Markets() {
  return (
    <section id="markets" className="bg-bg-base py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {markets.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={150}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[28ch]">
            {markets.headline}
          </h2>
        </FadeInOnScroll>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.segments.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <FadeInOnScroll key={s.title} delay={80 * i}>
                <article className="group rounded-lg bg-bg-surface border border-border-default p-7 h-full transition-all duration-base ease-standard hover:border-border-strong hover:shadow-cardHover">
                  <Icon className="h-8 w-8 text-brand-cyan" aria-hidden />
                  <h3 className="mt-6 font-display text-h3 font-semibold text-text-primary leading-heading tracking-heading">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-body text-text-secondary leading-body">{s.body}</p>
                </article>
              </FadeInOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Typecheck + lint**

```bash
npm run typecheck && npm run lint
```

### Task F.6: Phase F checkpoint

- [ ] **Step 1: Build + smoke**

```bash
npm run build && (npx serve out -p 3001 &) && sleep 2
```

Open browser. Verify:
- FiveLayers: 5 cards (last centred), each with In-Plain-English quote box, hover lifts top-edge cyan line
- Standards: 11 framework pills in 3-col grid, hover lifts border
- Markets: 6-segment 3×2 grid (1-col on mobile)

`pkill -f "serve out"`

- [ ] **Step 2: Owner reviews Five Layers body paragraphs**

This is a manual step per spec §8. Halt and surface the 5 paragraphs from `lib/content.ts` to owner. Wait for approval. Apply any edits to `lib/content.ts`.

- [ ] **Step 3: a11y check + Lighthouse**

```bash
npm run test:a11y && npm run lighthouse
```

Expected: zero violations, all four ≥95.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(rebuild): Phase F — FiveLayers + Standards + Markets

FiveLayers (new section): 5 cards (Enforce/Understand/Prove/Guard the AI/
Adapt), each with subtitle, body paragraph (owner-reviewed), and In Plain
English quote box. Closes with 'A Defensible Moat by Design' band.

Standards: 11-framework grid (NIST CSF 2.0 → NIST AI RMF 1.0), pill style,
hover lifts. No fake certifications.

Markets: 6-segment 3×2 grid (Banking, Telco, Critical Infra, Government,
Healthcare, Industrial IoT)."
```

---

# Phase G — Founder + Contact + Worker probe

### Task G.1: Add Founder + Contact content

**Files:** `lib/content.ts`

- [ ] **Step 1: Append**

```ts
export const founder = {
  headline: 'Built by a Serial Founder. Engineered for Scale.',
  name: 'Kelvin Lee',
  title: 'Founder & Chief Architect',
  paragraphs: [
    'Kelvin is the founder and chief architect of JAG Cybersecurity. Over the past two decades, he has successfully co-founded and scaled three technology companies — two of which were acquired by investors — and continues to actively lead operations across Singapore and Malaysia.',
    "With deep expertise spanning edge computing, AI systems architecture, and cybersecurity engineering, Kelvin personally designed and implemented JAG's full stack: from kernel-level network inspection through GPU-accelerated AI inference and autonomous response orchestration.",
    'JAG represents over 12 months of dedicated engineering work, resulting in a production-validated platform tested in controlled red-team exercises.',
  ],
  linkedin: { url: 'https://www.linkedin.com/in/kelvinleeyl/', label: 'Connect on LinkedIn' },
  photo: '/assets/founder-photo.png',
} as const;

export const contact = {
  eyebrow: 'CONTACT',
  headline: 'Get in Touch.',
  lede:
    "Interested in a demo, partnership, or investment conversation? We'd like to hear from you.",
  endpoint: 'https://api.jag-cybersecurity.io/contact',
  interests: ['Request Demo', 'Investor Inquiry', 'Partnership', 'Media', 'Other'],
  direct: [
    { label: 'GENERAL INQUIRIES', value: 'connect@jag-cybersecurity.io', icon: 'Mail' },
    { label: 'FOUNDER DIRECT', value: 'kelvin@jag-cybersecurity.io', icon: 'User' },
    { label: 'LOCATION', value: 'Penang, Malaysia · Southeast Asia Headquarters', icon: 'MapPin' },
    { label: 'LINKEDIN', value: 'JAG Cybersecurity', icon: 'Linkedin', href: 'https://www.linkedin.com/company/jag-cybersecurity/' },
  ],
} as const;
```

If the LinkedIn URLs differ, halt and confirm with owner. Otherwise proceed.

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

### Task G.2: Rebuild `components/sections/Founder.tsx`

**Files:** `components/sections/Founder.tsx`

- [ ] **Step 1: L2 backup**

```bash
cp -p components/sections/Founder.tsx components/sections/Founder.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Replace**

```tsx
import Image from 'next/image';
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import { founder } from '@/lib/content';
import { Linkedin } from 'lucide-react';

export default function Founder() {
  return (
    <section id="founder" className="bg-bg-base py-section">
      <div className="mx-auto max-w-container px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          <FadeInOnScroll className="md:col-span-2">
            <div className="relative aspect-square max-w-sm mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-glow-lg">
              <Image
                src={founder.photo}
                alt={`Portrait of ${founder.name}, founder of JAG Cybersecurity`}
                width={640}
                height={640}
                priority
                className="object-cover w-full h-full"
              />
            </div>
          </FadeInOnScroll>
          <FadeInOnScroll delay={200} className="md:col-span-3">
            <h2 className="font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[24ch]">
              {founder.headline}
            </h2>
            <p className="mt-8 font-display text-h3 font-semibold text-text-primary">{founder.name}</p>
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
              className="mt-6 inline-flex items-center gap-2 text-brand-cyan hover:text-brand-cyanBright transition-colors duration-fast"
            >
              <Linkedin className="h-5 w-5" aria-hidden />
              {founder.linkedin.label} →
            </a>
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

### Task G.3: Probe the Cloudflare Worker contact endpoint

**Files:** none (network probe only)

- [ ] **Step 1: CORS preflight probe**

```bash
curl -i -X OPTIONS https://api.jag-cybersecurity.io/contact \
  -H "Origin: https://www.jag-cybersecurity.io" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type"
```

- [ ] **Step 2: Categorize response**

- 200 / 204 with CORS headers: **endpoint live**. Mark `WORKER=live`. Proceed to G.4 (no scaffolding).
- 404 / 5xx / timeout / DNS fail: **endpoint dead**. Mark `WORKER=dead`. Spawn a sub-plan for Worker scaffold (skip ahead — not in this plan; flag to owner).

Record result in commit message.

### Task G.4: Rebuild `components/sections/Contact.tsx`

**Files:** `components/sections/Contact.tsx`

- [ ] **Step 1: L2 backup**

```bash
cp -p components/sections/Contact.tsx components/sections/Contact.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Replace**

```tsx
'use client';

import { useState } from 'react';
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import { contact } from '@/lib/content';
import { Mail, User, MapPin, Linkedin, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = { Mail, User, MapPin, Linkedin };

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get('website')) {
      setStatus('sent');
      return;
    }
    try {
      const res = await fetch(contact.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="bg-bg-base py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {contact.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={150}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading">
            {contact.headline}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={300}>
          <p className="mt-6 max-w-[65ch] text-body text-text-secondary">{contact.lede}</p>
        </FadeInOnScroll>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-12">
          <FadeInOnScroll className="md:col-span-3">
            <form onSubmit={onSubmit} className="space-y-5">
              <input type="text" name="website" tabIndex={-1} aria-hidden className="hidden" autoComplete="off" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="block">
                  <span className="text-sm text-text-tertiary">Name</span>
                  <input
                    name="name"
                    required
                    className="mt-1 block w-full rounded-md bg-bg-surface border border-border-default px-4 py-3 text-text-primary placeholder-text-quaternary focus:outline-none focus:border-brand-cyan focus:shadow-glow-sm transition-all duration-fast"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-text-tertiary">Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1 block w-full rounded-md bg-bg-surface border border-border-default px-4 py-3 text-text-primary placeholder-text-quaternary focus:outline-none focus:border-brand-cyan focus:shadow-glow-sm transition-all duration-fast"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm text-text-tertiary">Organization (optional)</span>
                <input
                  name="organization"
                  className="mt-1 block w-full rounded-md bg-bg-surface border border-border-default px-4 py-3 text-text-primary placeholder-text-quaternary focus:outline-none focus:border-brand-cyan focus:shadow-glow-sm transition-all duration-fast"
                />
              </label>
              <label className="block">
                <span className="text-sm text-text-tertiary">Interest</span>
                <select
                  name="interest"
                  required
                  className="mt-1 block w-full rounded-md bg-bg-surface border border-border-default px-4 py-3 text-text-primary focus:outline-none focus:border-brand-cyan focus:shadow-glow-sm transition-all duration-fast"
                >
                  {contact.interests.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-text-tertiary">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="mt-1 block w-full rounded-md bg-bg-surface border border-border-default px-4 py-3 text-text-primary placeholder-text-quaternary focus:outline-none focus:border-brand-cyan focus:shadow-glow-sm transition-all duration-fast"
                />
              </label>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full md:w-auto inline-flex items-center justify-center rounded-md bg-brand-cyan px-7 py-3 text-base font-semibold text-text-onAccent hover:bg-brand-cyanBright transition-colors duration-fast disabled:opacity-60"
              >
                {status === 'idle' && 'Send Message'}
                {status === 'sending' && 'Sending…'}
                {status === 'sent' && 'Message Sent ✓'}
                {status === 'error' && 'Retry'}
              </button>
            </form>
          </FadeInOnScroll>

          <FadeInOnScroll delay={200} className="md:col-span-2">
            <div className="rounded-lg border border-border-default bg-bg-surface p-7 space-y-6">
              {contact.direct.map((d) => {
                const Icon = ICONS[d.icon];
                const inner = (
                  <>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-brand-cyan" aria-hidden />
                      <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-cyan">{d.label}</p>
                    </div>
                    <p className="mt-2 text-body text-text-secondary">{d.value}</p>
                  </>
                );
                return 'href' in d ? (
                  <a key={d.label} href={d.href} target="_blank" rel="noopener noreferrer" className="block hover:text-text-primary transition-colors duration-fast">
                    {inner}
                  </a>
                ) : (
                  <div key={d.label}>{inner}</div>
                );
              })}
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

```bash
npm run typecheck && npm run lint
```

### Task G.5: Phase G checkpoint

- [ ] **Step 1: Build + smoke**

```bash
npm run build && (npx serve out -p 3001 &) && sleep 2
```

Open browser. Scroll to Founder, verify real photo loads with glow ring. Scroll to Contact, fill in fields, submit. Verify status transitions idle → sending → sent (or error if Worker is dead).

`pkill -f "serve out"`

- [ ] **Step 2: a11y + Lighthouse**

```bash
npm run test:a11y && npm run lighthouse
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(rebuild): Phase G — Founder (real photo) + Contact + Worker probe

Founder section uses public/assets/founder-photo.png via next/image with
priority. 2-col 40/60 layout. LinkedIn link.

Contact form: 60/40 split form + direct-contact card. Honeypot field
('website' tabIndex=-1 hidden). Optimistic UI: idle → sending → sent / error.
POSTs JSON to https://api.jag-cybersecurity.io/contact.

Worker probe result: WORKER=<live|dead> (filled in by executor at commit time)."
```

---

# Phase H — OG image + polish + responsive + reduced-motion sweep

### Task H.1: Create OG image route

**Files:** `app/og/route.tsx`

- [ ] **Step 1: Create**

```tsx
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#05080F',
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(34, 211, 238, 0.18) 0%, rgba(5, 8, 15, 0) 60%)',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', fontSize: 160, fontWeight: 700, letterSpacing: '-0.04em', color: '#F8FAFC' }}>
          JAG<span style={{ color: '#22D3EE' }}>.</span>
        </div>
        <div style={{ marginTop: 32, fontSize: 36, color: '#CBD5E1', textAlign: 'center', maxWidth: 900 }}>
          Sovereign Agentic AI Cybersecurity.
        </div>
        <div style={{ marginTop: 12, fontSize: 28, color: '#22D3EE', textAlign: 'center', fontFamily: 'monospace' }}>
          Zero cloud · Zero exfiltration · Zero trust
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
```

**Note:** `runtime = 'edge'` is incompatible with `output: 'export'`. For static export, the OG image must be pre-rendered. Replace with a build-time generated PNG approach: change to a Node script in `scripts/og-build.mjs` that uses `@vercel/og` and writes to `public/og.png` at build time, then reference `/og.png` in `app/layout.tsx`.

- [ ] **Step 2: Replace with build-time script**

Delete `app/og/route.tsx` (was a placeholder). Create `scripts/og-build.mjs`:

```js
import { ImageResponse } from '@vercel/og';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const html = {
  type: 'div',
  props: {
    style: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#05080F',
      backgroundImage:
        'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(34, 211, 238, 0.18) 0%, rgba(5, 8, 15, 0) 60%)',
      padding: 80,
    },
    children: [
      {
        type: 'div',
        props: {
          style: { display: 'flex', fontSize: 160, fontWeight: 700, letterSpacing: '-0.04em', color: '#F8FAFC' },
          children: [
            'JAG',
            { type: 'span', props: { style: { color: '#22D3EE' }, children: '.' } },
          ],
        },
      },
      {
        type: 'div',
        props: {
          style: { marginTop: 32, fontSize: 36, color: '#CBD5E1', textAlign: 'center', maxWidth: 900 },
          children: 'Sovereign Agentic AI Cybersecurity.',
        },
      },
      {
        type: 'div',
        props: {
          style: { marginTop: 12, fontSize: 28, color: '#22D3EE', textAlign: 'center', fontFamily: 'monospace' },
          children: 'Zero cloud · Zero exfiltration · Zero trust',
        },
      },
    ],
  },
};

const res = new ImageResponse(html, { width: 1200, height: 630 });
const buf = Buffer.from(await res.arrayBuffer());
const out = join(process.cwd(), 'public', 'og.png');
await writeFile(out, buf);
console.log(`OG image written: ${out} (${buf.length} bytes)`);
```

- [ ] **Step 3: Wire into package.json `build` step**

Read current scripts:
```bash
cat package.json | grep -A 12 '"scripts"'
```

Update `package.json` `scripts.build` to:
```json
"build": "node scripts/og-build.mjs && next build"
```

Add a standalone task too:
```json
"og": "node scripts/og-build.mjs"
```

- [ ] **Step 4: Update `app/layout.tsx` OG references**

In `app/layout.tsx`, change `images: [{ url: '/og', ... }]` to `images: [{ url: '/og.png', width: 1200, height: 630 }]` for both OpenGraph and Twitter blocks.

- [ ] **Step 5: Build + verify**

```bash
npm run build
ls -la public/og.png
file public/og.png
```

Expected: PNG file ~30-80 kB, 1200×630.

### Task H.2: Reduced-motion sweep

**Files:** all section components + UI primitives

- [ ] **Step 1: Test reduced-motion behaviour**

```bash
(npx serve out -p 3001 &) && sleep 2
```

In Chrome DevTools → Rendering panel → Emulate CSS media feature `prefers-reduced-motion: reduce`. Reload page. Scroll through every section. Verify:
- Hero: shield draws but does not pulse (or skips draw and shows final state); text appears with opacity-only transition, no Y translate
- Threats / Solution / Markets / FiveLayers: cards appear with opacity only, no Y translate; hover effects still work (state, not motion)
- Pipeline: connecting lines snap to drawn state; cards appear opacity-only
- Architecture: shield glow fades in (opacity); lines snap to drawn; canvas does not start
- ProofBar: numbers snap to final value (no count animation)

`pkill -f "serve out"`

- [ ] **Step 2: Fix any violations**

If MetricCounter still animates under reduced-motion: open `components/ui/MetricCounter.tsx` and add a check at the top of `useEffect`:

```ts
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setValue(value);
  return;
}
```

Apply the same guard to any other component using `requestAnimationFrame` or `setInterval` for visual animation.

### Task H.3: Responsive sweep

**Files:** none (visual verification)

- [ ] **Step 1: Capture at 5 breakpoints**

```bash
mkdir -p playwright-snapshots
```

Add to `tests/visual-rebuild.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const BREAKPOINTS = [
  { name: '375',  width: 375,  height: 800 },
  { name: '768',  width: 768,  height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

for (const bp of BREAKPOINTS) {
  test(`visual ${bp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot(`home-${bp.name}.png`, { fullPage: true, animations: 'disabled' });
  });
}
```

- [ ] **Step 2: Run + commit baseline**

```bash
npm test -- --update-snapshots tests/visual-rebuild.spec.ts
```

Expected: 5 baseline PNGs committed in `tests/visual-rebuild.spec.ts-snapshots/` (or wherever Playwright stores them per project config).

### Task H.4: Phase H checkpoint

- [ ] **Step 1: Lighthouse desktop + mobile**

```bash
npm run lighthouse
```

Expected: ≥95 all four on both profiles.

- [ ] **Step 2: a11y**

```bash
npm run test:a11y
```

Expected: zero violations.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(rebuild): Phase H — OG image + reduced-motion + responsive baseline

OG image generated at build time via scripts/og-build.mjs using @vercel/og.
1200×630 PNG written to public/og.png. Wired into layout.tsx Open Graph
+ Twitter Card metadata. Closes charter §12 Phase 1.5 gap #4.

Reduced-motion sweep: every animation respects prefers-reduced-motion:
reduce. MetricCounter, canvas particles, and stroke-dasharray draws all
either skip to final state or hold static.

Visual regression baseline captured at 375/768/1024/1440/1920px."
```

---

# Phase I — Cross-browser + final test sweep

### Task I.1: Cross-browser Playwright run

- [ ] **Step 1: Run full Playwright suite across all 5 browser projects**

```bash
npm test
```

Expected: all tests pass on Chromium, WebKit, Firefox, Mobile Chrome, Mobile Safari. If any fail, halt and triage — do not deploy.

### Task I.2: Console-error sweep

- [ ] **Step 1: Add Playwright check for console errors**

Append to `tests/smoke.spec.ts`:

```ts
test('no console errors on home', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  expect(errors).toEqual([]);
});
```

- [ ] **Step 2: Run**

```bash
npx playwright test -g "no console errors"
```

Expected: PASS.

### Task I.3: Final acceptance gate

- [ ] **Step 1: Full pre-merge gate (charter §7)**

```bash
npm run lint && npm run typecheck && npm run build && npm test && npm run lighthouse
```

Expected: all green. Any red — halt and fix before Phase J.

- [ ] **Step 2: Verify two-file security-header invariant**

```bash
diff <(grep -E 'Content-Security-Policy|Strict-Transport-Security|X-Frame-Options|Referrer-Policy|Permissions-Policy' next.config.mjs | sort) <(grep -E 'Content-Security-Policy|Strict-Transport-Security|X-Frame-Options|Referrer-Policy|Permissions-Policy' public/_headers | sort) || echo "DRIFT — reconcile by value"
```

Expected: no DRIFT message.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "test(rebuild): Phase I — cross-browser + console-error sweep + final gate

All acceptance criteria GREEN:
- Lint, typecheck, build, full Playwright (5 browser profiles), Lighthouse
  desktop + mobile all ≥95 on Perf/A11y/BP/SEO.
- Zero console errors on home page.
- next.config.mjs and public/_headers in sync.
- Visual regression baseline established."
```

---

# Phase J — Charter MINOR amendment + final commit

### Task J.1: Update `CLAUDE.md` v2.0 → v2.1

**Files:** `CLAUDE.md`

- [ ] **Step 1: L2 backup**

```bash
cp -p CLAUDE.md CLAUDE.md.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Patch frontmatter**

Edit `CLAUDE.md`:
- Set `version: 2.1`
- Set `last_amended: 2026-05-15 (v2.1 — website rebuild Phase 2 landing)`
- Set `supersedes: v2.0 (2026-05-15 structural §0 routing change)`
- Set `sha256_body: <recomputed-on-install>` (will be recomputed in Step 5)

- [ ] **Step 3: Update §5 / §11.1 / §12**

In §11.1, close the open decisions:
- WEB-TASK-20260515-A → accent `#22D3EE` (resolved)
- WEB-TASK-20260515-B → body Geist (resolved)
- WEB-TASK-20260515-C → mono JetBrains Mono (resolved)

In §12 known Phase 1.5 gaps section: mark gaps #1, #2, #3, #4, #5, #6 as RESOLVED with commit references.

In §12 section list: add Architecture and FiveLayers to the section description.

In §12 reference paths: add `components/sections/Architecture.tsx`, `components/sections/FiveLayers.tsx`, `components/ui/ShieldSVG.tsx`, `components/ui/ProofBar.tsx`, `components/ui/PacketParticles.tsx`, `components/ui/ArchitectureDiagram.tsx`, `components/ui/LayerCard.tsx`, `scripts/og-build.mjs`, `tests/visual-rebuild.spec.ts`.

In §12 Worker probe row: record outcome (`WORKER=live` or `WORKER=dead → scaffold deferred to Phase 2.5`).

In §12 open WEB-TASK entries table: remove A, B, C, mark E as in progress (design-system.md follow-up still pending unless promoted post-build).

Add v2.1 changelog row at the bottom of the document.

- [ ] **Step 4: Compute new body SHA**

```bash
FRONTMATTER_END=$(grep -n '^---$' CLAUDE.md | sed -n '2p' | cut -d: -f1)
BODY_START=$((FRONTMATTER_END + 1))
BODY_SHA=$(tail -n +${BODY_START} CLAUDE.md | shasum -a 256 | awk '{print $1}')
echo "New body SHA: $BODY_SHA"
```

- [ ] **Step 5: Patch SHA into frontmatter**

```bash
sed -i '' "s|^sha256_body:.*|sha256_body: ${BODY_SHA}|" CLAUDE.md
```

- [ ] **Step 6: Verify**

```bash
head -25 CLAUDE.md
```

Expected: frontmatter shows `version: 2.1` and correct body SHA.

### Task J.2: Remove `framer-motion` from `package.json` (if zero imports remain)

**Files:** `package.json`, `package-lock.json`

- [ ] **Step 1: Verify zero imports**

```bash
rg "from 'framer-motion'|from \"framer-motion\"" app/ components/
```

Expected: zero matches.

- [ ] **Step 2: Uninstall**

```bash
npm uninstall framer-motion
```

- [ ] **Step 3: Verify build still passes**

```bash
npm run typecheck && npm run build
```

### Task J.3: Final commit + handoff

- [ ] **Step 1: Commit**

```bash
git add -A
git commit -m "docs(charter): v2.1 — website rebuild Phase 2 landed

Resolves WEB-TASK-20260515-A (accent #22D3EE), -B (body Geist), -C (mono
JetBrains Mono). Closes Phase 1.5 gaps #1 (fade-in polish via FadeInOnScroll
delay prop), #2 (JAG logo), #3 (founder photo), #4 (OG image), #5 (compliance
badges restyled), #6 (framer-motion uninstalled — zero imports on /).

Adds Architecture and FiveLayers to §12 section list. Updates §12 reference
paths with new components and scripts. Records Worker probe outcome.

Body SHA: <auto-filled from Task J.1 step 4>."
```

- [ ] **Step 2: Show final git state**

```bash
git log --oneline -15
```

Expected: 11 new commits (chore tooling + Phase A–J).

- [ ] **Step 3: Stop**

Deployment to Cloudflare Pages production is a Type-1 irreversible action — **HALT** and surface to owner. Do not push, do not deploy.

---

## Self-review

**Spec coverage** — every spec section is covered by at least one task:
- §1 Purpose → plan header
- §2 Stack & constraints → Task 0.1 baseline + all phases preserve
- §3 Token system → Task A.3 (additive), A.8 (primitive sweep), J.1 (close WEB-TASK)
- §4 Motion architecture → Task A.3 keyframes + A.7 FadeInOnScroll delay + B/C/D/E/G use them
- §5 Hero → Phase B (Tasks B.1-B.4)
- §6 10-section structure → Phases B-G (each row of the spec table mapped)
- §7 Architecture perimeter-inspector → Phase E (Tasks E.1-E.6) including canvas fallback
- §8 Content & assets → Task A.2 (assets), Phase B-G (content), Task F.6 step 2 (owner review of Five Layers body)
- §9 Contact form backend → Task G.3 probe + G.4 form
- §10 OG image → Task H.1
- §11 Phasing → maps 1:1 to plan phases
- §12 Risks → mitigations baked into Task E.4 (bundle check), G.3 (probe), F.6 (Five Layers review), 0.2 (empty-name file), 0.3 (uncommitted tooling)
- §13 Acceptance criteria → Phase I
- §14 Out of scope → not present (correctly omitted)
- §15 Post-build follow-ups → Phase J
- §16 Approvals → not applicable to plan

**Placeholder scan**: no TBDs, no "implement later", every code step has actual code.

**Type consistency**: `FadeInOnScroll` props (`children`, `delay`, `className`) consistent across all usages. `MetricCounter` usage in `ProofBar.tsx` flagged with "if API differs, adapt" note — this is a verification step, not a placeholder.

**Scope check**: single coherent rebuild, one plan, correct.
