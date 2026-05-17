---
doc_id: SPEC-RESEND-PREMIUM-POLISH
title: JAG Website — Resend-Grade Premium Polish (Charter-Compatible)
status: APPROVED
owner: Kelvin Lee
date: 2026-05-17
charter_reference: CLAUDE.md v2.1
approved_approach: Path 2 of 3 — Charter-compatible (no §11 amendments)
supersedes: none — additive on top of Phase 2 (spec 2026-05-15-website-rebuild-phase2-design.md)
---

# JAG Website — Resend-Grade Premium Polish (Charter-Compatible)

## 1 · Purpose

Lift the perceived premium quality of the homepage toward Resend's bar (resend.com) without violating the brand contract in CLAUDE.md §11 or §11.2. The owner selected Path 2 ("Charter-compatible only") from the 2026-05-17 brainstorming session: adopt the 4 non-conflicting Resend techniques fully, and add disciplined cyan-only versions of the 2 conflicting techniques (3D tiles, inner-glow surfaces) as one-off composition decisions rather than system patterns. No charter amendments.

The target audiences stay as charter §11: NVIDIA Inception evaluators, sovereign-AI investors, CISOs, technical practitioners. The success metric stays as charter §11: a casual visitor mistakes the site for an institutional security vendor; an evaluator reaches "this is technically serious" within 5 seconds of the fold.

## 2 · Stack & constraints (preserved)

- Next.js 14.2.35 · React 18 · Tailwind 3.4.1 · TypeScript strict · `output: 'export'` → Cloudflare Pages
- No `framer-motion` imports on `/` (charter §3.2, §12)
- Lighthouse ≥95 on Perf / A11y / BP / SEO across desktop **and** mid-tier mobile (charter §3.4, §8)
- First Load JS ≤100 kB on `/` — current baseline 96.9 kB (charter §3.4)
- Security headers stay in sync across `next.config.mjs` + `public/_headers` (charter two-file invariant)
- Single accent colour: cyan family only (charter §11)

## 3 · Resend pattern decomposition (analysis from reference frames)

The reference frames provided by the owner (resend.com homepage, 5 frames) were decomposed into 8 mechanical techniques. The classification below records which were adopted, which were rejected, and the rationale.

| # | Resend technique | Status | Rationale |
|---|---|---|---|
| 1 | 3D-rendered icon tile per section | ADOPTED (disciplined, cyan-only, custom SVG) | §11.2 `icon-tile-stack` was harvested as an AI tell against *lazy default* use. Crafted, brand-disciplined, per-pivot tiles do not trigger the same failure mode. Used at 4 of 10 sections only (rhythm, not repetition). |
| 2 | Sectional color signature (multiple hues per section) | REJECTED | Violates §11 "no more than one accent colour". Substitute: vary cyan brightness / finish (deep / standard / bright / frosted) for rhythm. |
| 3 | Massive display type at section openers | ADOPTED | Fully charter-compatible. Implemented via new `displayHero` and `displayAnchor` fluid tokens. |
| 4 | Centered narrow column rhythm | ADOPTED | Fully charter-compatible. Implemented via new `maxW-anchor` 720px token plus `SectionAnchor` primitive. |
| 5 | macOS-style browser-chrome wrappers on screenshots | ADOPTED | Fully charter-compatible. Implemented via new `BrowserChrome` primitive. |
| 6 | Outlined inner-glow cards (icon-on-left feature cards) | ADOPTED (single-instance only, no 3-up grid) | §11.2 `identical-card-grids` is the trap. Used as a one-off composition element, not a grid template. No new `InnerGlowCard` primitive — applied inline where it serves. |
| 7 | Product dashboard cutouts | ADOPTED (via `BrowserChrome` wrap of existing artifacts) | We have no live JAG product UI to screenshot. The existing `architecture-overview.png`, `ThreatTimeline`, and `LayerStack` get the chrome wrap so they read as "viewer applications" rather than naked diagrams. |
| 8 | SDK / integration tile grid | NOT APPLICABLE | JAG is not an SDK. The compliance-framework pill grid in Standards already covers an analogous slot and is staying as-is. |

## 4 · New primitives (`components/ui/`)

### 4.1 `BrandTile.tsx`

Square SVG-based tile in three sizes: `sm` (96px), `md` (128px), `lg` (192px). Visual:

- Opaque dark fill: `bg-surface` → `bg-surfaceElevated` radial gradient from upper-left
- 1px border: `border-default` (alpha 0.14), darkening to `border-strong` (cyan 0.30) on bottom edge for bevel illusion
- Outer drop shadow: cyan glow at low opacity (`0 0 32px rgba(34, 211, 238, 0.18)`)
- Inner radial light: small cyan bloom at the center-upper region (`radial-gradient(circle at 50% 30%, rgba(103, 232, 249, 0.22), transparent 60%)`)
- Rounded corners: `border-radius: 24%` (Apple icon mask, not a fixed px value, so it scales correctly)
- Accepts a single child SVG icon as `children`. Icon is centered, sized to ~50% of tile dimension
- `aria-hidden="true"` — decorative

Estimated size: ~3 kB of inline JSX + tokens (no external assets).

### 4.2 `BrowserChrome.tsx`

Wrapper component that frames any child as if displayed inside a macOS window:

- 1px outer border (`border-default`), 16px rounded top corners, 0px rounded bottom (full window) or 16px rounded bottom (compact)
- 36px tall top bar with: 3 traffic-light dots (`#FF5F57` red, `#FEBC2E` amber, `#28C840` green — these accent colors are exempted from §11 because they are not brand accents; they are recognized macOS UI artifacts that signal "this is a window")
- Optional file-tab row below traffic lights (variant prop, used in `ThreatTimeline` to show "incidents · 2018-2026")
- Subtle inner-top gradient `linear-gradient(180deg, rgba(255,255,255,0.04), transparent 20%)` for the glassy top-bar feel
- Inside content area uses `bg-surface` to distinguish from page background
- Accepts any child via composition

**Charter check (traffic-light accent colors):** the three macOS-system colors (red/amber/green) are universally recognized OS UI signals, not brand accents. They appear at ≤8px each. This is the same exemption rule that allows raw HTML form-field default styles or browser-native scrollbar arrows. Documented here so a future audit does not flag them as a multi-accent violation.

### 4.3 `SectionAnchor.tsx`

Centered composition primitive for the 5 narrative anchors. Slots:

- `tile?: ReactNode` — optional `<BrandTile>` (used by 4 of 5 anchors; Founder uses chrome-framed photo instead)
- `eyebrow?: string` — optional mono eyebrow text above the headline
- `headline: ReactNode` — required, rendered with `text-displayAnchor` (or `text-displayHero` if `variant="hero"`)
- `lede?: string` — optional paragraph below headline, rendered with `text-lede` and `max-w-[65ch]`
- `children?: ReactNode` — main content slot below the text column, full container width

Layout: centered flex column, gap 24/32/40px responsive between slots, `max-w-[720px]` on the text column only (the children slot is full width).

Replaces ad-hoc opener markup currently scattered across the 5 anchor sections.

## 5 · Per-anchor section treatment

### 5.1 Hero (`components/sections/Hero.tsx`)

- **Tile:** new custom SVG, "JAG shield in glass-tile". The current 560px `ShieldSVG` is replaced with a `BrandTile size="lg"` (192px) containing a reworked shield icon. The shield itself uses cyan stroke with subtle inner gradient. This is a significant visual reduction (560 → 192px) — owner-approved during 2026-05-17 brainstorming.
- **Headline:** existing two-span headline uses new `text-displayHero` token (`clamp(64px, 8vw, 112px)`, `leading: 0.95`, `tracking: -0.04em`)
- **Lede:** existing subhead gets `text-lede` styling
- **HeroWave:** preserved as-is (canvas v6 wave is already premium-grade)
- **Cyan-glow inner backdrop:** existing `animate-glow-bloom` ellipse stays
- **Pulse-glow:** removed (the tile carries the inner light now; doubling it competes)

### 5.2 Threats (`components/sections/Threats.tsx`)

- **Tile:** new custom SVG, "hexagonal warning with cyan core". 128px `BrandTile size="md"`
- **Anchor wrap:** opener wrapped in `<SectionAnchor>` with tile + eyebrow + headline + lede
- **Chrome wrap:** existing `ThreatTimeline` component wrapped in `<BrowserChrome variant="tabbed">` with a single file-tab labeled `incidents · 2018-2026`
- All content / motion / SVG inside `ThreatTimeline` preserved

### 5.3 Architecture (`components/sections/Architecture.tsx`)

- **Tile:** new custom SVG, "4 concentric cyan rings, perimeter-inspector motif". 128px `BrandTile size="md"`
- **Anchor wrap:** opener wrapped in `<SectionAnchor>`
- **Chrome wrap:** existing `public/assets/architecture-overview.png` rendered inside `<BrowserChrome>`
- All content preserved

### 5.4 FiveLayers (`components/sections/FiveLayers.tsx`)

- **Tile:** new custom SVG, "5 horizontal cyan layers, stratigraphy motif". 128px `BrandTile size="md"`
- **Anchor wrap:** opener wrapped in `<SectionAnchor>`
- **Chrome wrap:** existing `<LayerStack />` (`components/ui/LayerStack.tsx`) wrapped in `<BrowserChrome>`
- `<LayerCard />` instances (the grid below `LayerStack`) stay as-is structurally; light addition of a 1px cyan border + soft inner-glow **on focus / keyboard-nav only**, not on hover (avoids `every-button-primary` / `identical-card-grids` traps)

### 5.5 Founder (`components/sections/Founder.tsx`)

- **No tile.** The founder photo gets `<BrowserChrome variant="portrait">` framing — reads as a "credentialing card" rather than a marketing portrait.
- **Anchor wrap:** opener wrapped in `<SectionAnchor>` (no `tile` prop)
- **Bio:** existing bio paragraph wrapped in `max-w-[620px]` centered column for tighter reading rhythm
- **Photo:** existing `public/assets/founder-photo.png` reused inside the chrome frame, no new asset

### 5.6 Sections explicitly NOT changed

Capabilities, Pipeline, Standards, Markets, Contact. These act as breath between anchors. Treatment is deliberate per owner instruction: applying the lift uniformly to all 10 sections would trigger `identical-card-grids` monotony. They keep current Phase 2 styling.

## 6 · Cross-cutting `tailwind.config.ts` extensions

All additive. No removal of existing tokens (Phase 2 sections continue to render unchanged).

```ts
// theme.extend.fontSize additions
'displayHero':   ['clamp(64px, 8vw, 112px)',  { lineHeight: '0.95', letterSpacing: '-0.04em',  fontWeight: '600' }],
'displayAnchor': ['clamp(48px, 6vw, 80px)',   { lineHeight: '1.0',  letterSpacing: '-0.035em', fontWeight: '600' }],
'lede':          ['clamp(18px, 1.5vw, 22px)', { lineHeight: '1.5',  letterSpacing: '-0.005em' }],

// theme.extend.maxWidth additions
'anchor':       '720px',
'anchor-tight': '620px',

// theme.extend.boxShadow additions
'tile':       '0 0 32px 0 rgba(34, 211, 238, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
'tile-hover': '0 0 48px 0 rgba(34, 211, 238, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
```

No new colour tokens. No new font families. No new keyframes.

## 7 · Charter compliance audit

| Charter rule | Compliance | Note |
|---|---|---|
| §3.1 dark-only | ✓ | No light mode introduced |
| §3.1 design tokens, not hex | ✓ | All values in `tailwind.config.ts`; component uses tokens only |
| §3.2 no framer-motion on `/` | ✓ | Pure CSS animation; no new JS animation deps |
| §3.2.1 motion craft | ✓ | Tiles fade-in only (via existing `FadeInOnScroll`); chrome wrappers static; no rapid re-triggered animations |
| §3.3 WCAG 2.2 AA | ✓ | Tiles `aria-hidden`; display type passes contrast at larger sizes; chrome decorative |
| §3.4 First Load JS ≤100 kB | ⚠️ | Estimated +2–4 kB; verified post-build. Fallback: code-split below-fold tiles |
| §3.4 Lighthouse ≥95 | ✓ | Verified in pre-merge gate |
| §11 single accent colour | ✓ | Cyan family only; macOS traffic-light colors exempt per §4.2 note |
| §11 no glassmorphism | ✓ | Tiles opaque with bevel, not frosted; chrome bar has subtle gradient but child content is opaque |
| §11 no AI-generated imagery | ✓ | All tile SVGs hand-crafted; no Midjourney / DALL-E / generative source |
| §11.2 `icon-tile-stack` | ✓ MITIGATED | Per-section unique icons; used at 4 of 10 sections; not a system pattern |
| §11.2 `identical-card-grids` | ✓ | No 3-up card row introduced; each anchor visually distinct |
| §11.2 `nested-cards` | ✓ | Chrome wrap is one outer frame; no card-inside-card pattern |
| §11.2 `generic-drop-shadows` | ✓ | Tile shadow is cyan-tinted (`rgba(34, 211, 238, 0.18)`), specific to brand |

## 8 · Performance budget

Current baseline: First Load JS **96.9 kB**, page-specific **4.4 kB**.

Estimated impact:

- `BrandTile.tsx` primitive: ~2 kB JSX (loads once, reused 4×)
- `BrowserChrome.tsx` primitive: ~1 kB JSX (loads once, reused 4×)
- `SectionAnchor.tsx` primitive: ~1 kB JSX (loads once, reused 5×)
- 4 custom SVG tile icons (Hero, Threats, Architecture, FiveLayers): ~0.5–1 kB each as inline SVG; total ~3 kB
- Tailwind config additions: <0.1 kB after build

**Total estimated First Load increase: 2–4 kB.** New baseline projected: 98.9–100.9 kB.

If post-build measurement shows > 100 kB:
1. Code-split `BrandTile` instances for Threats, Architecture, FiveLayers (below-fold) into their section component chunks — drops ~3 kB cleanly
2. If still > 100 kB, code-split `BrowserChrome` similarly

The final First Load JS number is captured in the pre-merge gate output and reported to the owner before declaring complete.

## 9 · Verification (pre-merge gate)

The §7 charter compliance audit and §8 perf-budget measurement are mandatory before declaring done. The full pre-merge gate from CLAUDE.md §7:

```
npm run lint && npm run typecheck && npm run build && npm test && npm run lighthouse
```

Additional verification:

- Production-build parity check: `npx serve out -p 3001` and visually inspect the 5 changed sections at desktop (1440px), tablet (768px), and mobile (375px)
- Lighthouse mobile profile (M-series-Mac throttle) on each of the 5 changed sections
- Paired before/after screenshots (mobile + desktop) attached to the PR / commit chain
- `prefers-reduced-motion` test (existing `tests/reduced-motion.spec.ts` must still pass)
- Visual regression baseline (existing `tests/visual-rebuild.spec.ts` will need updates for the 5 changed sections — that's expected; owner reviews the new baseline)

## 10 · Out of scope

- Changes to the 5 non-anchor sections (Capabilities, Pipeline, Standards, Markets, Contact)
- New runtime dependencies — none required; charter §11.1 LEAN posture preserved
- Charter amendments — none required (Path 2 was chosen specifically to avoid amendments)
- Brand colour expansion — cyan family stays the sole accent
- Font family changes — Geist Sans + JetBrains Mono stay
- Mobile-specific layout overhauls — responsive treatment uses existing fluid tokens
- Worker / backend changes — `workers/contact/` is unaffected

## 11 · Sequencing

5 tasks. Each is one commit. Aligned with CLAUDE.md §2 structured execution pipeline.

1. **Tokens** — extend `tailwind.config.ts` (fontSize, maxWidth, boxShadow). No component changes. Build must stay green.
2. **Primitives** — create `BrandTile.tsx`, `BrowserChrome.tsx`, `SectionAnchor.tsx`. Unit tests for prop variants. No section integration yet. Build stays green.
3. **Tile SVGs** — author the 4 custom tile-icon SVGs (shield, hex-warning, concentric-rings, layer-stratigraphy). Export from `components/ui/tiles/` or inline within `BrandTile` consumers.
4. **Per-section integration** — rewrite the 5 anchor section openers (Hero, Threats, Architecture, FiveLayers, Founder) to use new primitives. Visual diff at each section before moving to the next.
5. **Pre-merge gate** — full validation per §9. Capture First Load JS number; if > 100 kB execute §8 mitigation. Paired screenshots. Owner approval. Push to `origin/main` (owner-executed, charter §1.9).

## 12 · Cross-references

- Brainstorming source: 2026-05-17 session (Resend reference frames provided by owner)
- Charter: `CLAUDE.md` v2.1, sections §3 (craft benchmarks), §11 (design intent), §11.2 (anti-pattern catalogue)
- Phase 2 baseline spec: `docs/superpowers/specs/2026-05-15-website-rebuild-phase2-design.md`
- Components to be modified: `components/sections/Hero.tsx`, `Threats.tsx`, `Architecture.tsx`, `FiveLayers.tsx`, `Founder.tsx`
- Components to be created: `components/ui/BrandTile.tsx`, `BrowserChrome.tsx`, `SectionAnchor.tsx`, `components/ui/tiles/*.tsx`
- Config: `tailwind.config.ts` (fontSize, maxWidth, boxShadow extensions)
- Tests to be updated: `tests/visual-rebuild.spec.ts` (new visual baseline)

---

*End of spec — JAG Resend-Grade Premium Polish, Charter-Compatible, 2026-05-17.*
