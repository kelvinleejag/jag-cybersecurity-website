---
doc_id: SPEC-WEBSITE-REBUILD-PHASE2
title: JAG Website Rebuild — Phase 2 Design
status: APPROVED
owner: Kelvin Lee
date: 2026-05-15
charter_reference: CLAUDE.md v2.0
approved_approach: Option D — Charter-compatible rebuild
supersedes: app/page.tsx current 8-section composition (preserved as Phase 1 baseline)
---

# JAG Website Rebuild — Phase 2 Design

## 1 · Purpose

Restructure the homepage from 8 sections to 10 with elevated visual craft to clear the NVIDIA Inception Program / sovereign-AI investor / CISO bar, **without abandoning the charter's documented architecture decisions.** Specifically: no `framer-motion` on `/` (charter §3.2, §12), Lighthouse ≥95 on Perf / A11y / BP / SEO across desktop **and** mobile (charter §3.4, §8), First Load JS ≤100 kB (charter §3.4). The brief's design ambition is delivered within these constraints.

This spec supersedes the master prompt's stack choices (Next 15 / React 19 / Tailwind v4 / framer-motion / mobile Perf ≥85) on owner instruction during 2026-05-15 brainstorming session. Rationale: the brief's conflicts with charter v2.0 were surfaced (9 conflicts ranked by severity); owner selected Option D (Charter-compatible rebuild) over Options A/B/C.

## 2 · Stack & constraints (preserved from current)

- **Next.js 14.2.35** · **React 18** · **Tailwind 3.4.1** · **lucide-react 0.4.0** · **TypeScript strict**
- `output: 'export'` static export → Cloudflare Pages
- `images: { unoptimized: true }` (static-export limitation; manual responsive `srcset` strategy)
- Test rig already in place: Playwright 1.60 (5 browser profiles), @axe-core/playwright, @lhci/cli ≥95 thresholds, @vercel/og, sharp
- Security headers preserved across `next.config.mjs` + `public/_headers` (charter two-file invariant)
- Zero `framer-motion` imports on `/`. `framer-motion` ^11.18.2 stays in `package.json` for now; removal from deps is a post-build follow-up once `rg "framer-motion" app/ components/` returns empty.

## 3 · Token system (resolves WEB-TASK-A/B/C)

Apply the brief's `design-tokens.ts` verbatim to `tailwind.config.ts`. The new tokens are added alongside the current ones, then components are migrated section by section — the build stays green throughout. Old tokens are deleted only after every component has migrated and a clean `rg` confirms no references.

**Color** (resolves WEB-TASK-20260515-A):
- `bg.base #05080F` (page) · `bg.surface #0B1220` (card) · `bg.surfaceElevated #0F1A2E` (hover) · `bg.surfaceMuted #080D17` (dividers)
- `brand.cyan #22D3EE` (replaces current `#00D9FF` — more institutional / less neon)
- `brand.cyanBright #67E8F9` · `brand.cyanDeep #0891B2`
- `brand.gradient linear-gradient(135deg, #22D3EE 0%, #67E8F9 50%, #A5F3FC 100%)` — used **only** for the hero word "Runs Entirely On-Device." and the architecture-diagram fill
- Signal accents — at most one per page: `amber #F59E0B`, `red #EF4444`, `green #10B981`
- Six-level text hierarchy: `primary #F8FAFC` → `secondary #CBD5E1` → `tertiary #94A3B8` → `quaternary #64748B` → `inverse #0F172A` → `onAccent #05080F`
- Four-level border alpha: `subtle 0.08` → `default 0.14` → `strong 0.30 cyan` → `glow 0.50 cyan`

**Typography** (resolves WEB-TASK-20260515-B and -C):
- Body / display: **Geist** via `next/font/google`
- Mono: **JetBrains Mono** via `next/font/google` (fallback to Geist Mono)
- Fluid type scale via `clamp()`: eyebrow → body → bodyLg → h3 → h2 → h1 → hero (7 sizes)
- `letterSpacing.display = -0.03em`, `letterSpacing.heading = -0.02em`, `letterSpacing.eyebrow = 0.12em`
- `lineHeight.display = 1.02`, `lineHeight.body = 1.6`

**Spacing & geometry**:
- `space.section = clamp(5rem, 4rem+5vw, 9rem)` for vertical between-section padding
- `space.container = clamp(1.5rem, 1rem+2vw, 3rem)` horizontal page padding
- `space.maxWidth = 1280px` (was 1200px) — slightly wider to support 5-card pipeline horizontal flow
- `space.maxWidthNarrow = 960px` for text-heavy content
- Existing `maxWidth.container` / `maxWidth.content` aliased to new tokens for backward compat during migration

**Motion**:
- `motion.duration.fast 0.2s` · `base 0.4s` · `slow 0.8s` · `hero 1.2s`
- `motion.easing.standard [0.22, 1, 0.36, 1]` (ease-out-quart, the "expensive" curve)
- `motion.easing.hero [0.16, 1, 0.3, 1]`
- All easing exposed as Tailwind `transitionTimingFunction` extensions + CSS custom properties

**Shadow / glow**:
- `shadow.cardHover` · `shadow.glow` · `shadow.glowStrong` per brief

**Background gradient on hero** is delivered via CSS radial-gradient, not an image, so it themes with the tokens.

## 4 · Motion architecture (no framer-motion)

Every effect from the brief reproduced with charter-compatible primitives:

1. **CSS keyframes** declared in `tailwind.config.ts theme.extend.keyframes` — extends the existing `fade-in-up`. New keyframes: `fade-in`, `slide-in-left`, `slide-in-right`, `draw-stroke` (for SVG `stroke-dasharray`), `pulse-glow`, `counter-up` (hand-off variable), `particle-flow` (CSS-driven; replaced by canvas where needed).
2. **`components/ui/FadeInOnScroll.tsx`** — already exists. Extended to accept a `delay` prop (0-1500 ms range) so stagger sequences are declarative: `<FadeInOnScroll delay={200}>...</FadeInOnScroll>`. Existing IntersectionObserver + 1500 ms `setTimeout` fallback preserved (charter §12 load-bearing pattern).
3. **`components/ui/MetricCounter.tsx`** — already exists. Reused as-is for the new ProofBar in §3. Already handles 0→target animation on scroll-in with `requestAnimationFrame`.
4. **SVG `stroke-dasharray`** animated via CSS — for the Hero shield draw, the Pipeline connecting lines, and the Architecture perimeter-inspector packet paths. All inline SVG; no external fetches.
5. **One small `<canvas>` element** for the Architecture-section packet particles (§5 below). ~3 kB hand-rolled with `requestAnimationFrame`. Paused under `prefers-reduced-motion`, paused when off-screen via IntersectionObserver, paused on `visibilitychange` tab-blur.
6. **Tailwind `hover:` / `focus-visible:` / `active:` / `disabled:`** for every interactive element — four states per charter §3.2.1.
7. **Sticky / hide-on-scroll-down navigation** via vanilla `requestAnimationFrame` + `useEffect`, no framer `useScroll`.
8. **Mobile menu transition** via CSS `transform: translateX(...)` + `transition-transform`, no framer layout transitions.

**Reduced-motion compliance**: every keyframe ships with a `@media (prefers-reduced-motion: reduce)` short-circuit. Per charter §3.2.1 harvest note, this means "fewer and gentler" — opacity transitions and colour changes that aid comprehension are kept; movement is dropped.

## 5 · Hero — single drawing shield + radial glow (Option A from session)

The brief's hero specification, executed verbatim. The shield IS the JAG logo mark — leaning into it is brand consistency.

**Visual**:
- Full viewport min `90vh`
- Background `#05080F` with one large radial gradient centred at 50% 45%: `radial-gradient(ellipse at center, rgba(34,211,238,0.12) 0%, transparent 60%)` — fades from `rgba(34,211,238,0)` to `rgba(34,211,238,0.12)` over 2 s on mount
- Single inlined SVG shield (~2 kB optimised) positioned behind the headline. The shield path uses `stroke-dasharray: var(--shield-length); stroke-dashoffset: var(--shield-length);` and animates to `stroke-dashoffset: 0` over 1.2 s with `cubic-bezier(0.16, 1, 0.3, 1)`. After draw completes, a 6 s loop with `opacity: 0.04 → 0.08 → 0.04` pulse — barely perceptible.

**Content** — verbatim from brief, no invention:
- Eyebrow (mono uppercase, cyan, 0.12em tracking): `SOVEREIGN AGENTIC AI · APRIL 2026`
- Headline line 1: `Agentic AI Cybersecurity.` (text-primary, hero size, display tracking)
- Headline line 2: `Runs Entirely On-Device.` (cyan gradient `background-clip: text`)
- Subhead (max 65 ch): brief's verbatim copy
- Primary CTA: `Request a Demo →` (filled cyan, dark text, anchors `#contact`)
- Secondary CTA: `See How It Works` (outline cyan, anchors `#pipeline`)
- Trust band (mono quaternary, `·` separators): `NVIDIA Jetson Orin NX · Air-gap Capable · 6 Patents Pending · Sub-5-second Time-to-Block`

**Motion stagger** (FadeInOnScroll with `delay` prop):
- Eyebrow @ 200 ms · Headline L1 @ 400 ms · Headline L2 @ 600 ms · Subhead @ 900 ms · CTAs @ 1100 ms · Trust band @ 1300 ms
- All `y: 20 → 0`, `opacity: 0 → 1`, `motion.easing.hero`
- Shield draw 0 → 1200 ms (in parallel)

## 6 · 10-section structure

| # | Section | Status | Brief reference | Notes |
|---|---|---|---|---|
| 1 | Hero | RESHAPE | §1 | Single drawing shield. New hero copy. |
| 2 | ThreatLandscape | RESHAPE | §2 | Drop the amber left-border (cheap-looking). Top-edge cyan gradient line on hover. |
| 3 | Capabilities + ProofBar | RESHAPE | §3 | 2×2 grid + new full-width animated proof bar (10/10, 5 s, 0%, 310/310, 113 claims). Uses existing `MetricCounter`. |
| 4 | Pipeline | RESHAPE | §4 | 5-stage horizontal flow on desktop, stacked on mobile. SVG `stroke-dasharray` connecting lines. Particles deferred to §5 perimeter-inspector to save bundle. |
| 5 | **Architecture** | **NEW** | §5 | Custom SVG diagram with **perimeter inspector animation (Option B)**. See section below for spec. |
| 6 | **FiveLayers** | **NEW** | §6 | 5 layer cards with plain-English quote boxes. Body paragraphs drafted by me (see §10). |
| 7 | Standards | RESHAPE | §7 | 11-framework grid (NIST CSF 2.0 → NIST AI RMF 1.0). 3-column desktop, 4 rows. No new frameworks. |
| 8 | Markets | RESHAPE | §8 | 6-segment 3×2 grid. Existing copy preserved, lightly tightened. |
| 9 | Founder | RESHAPE | §9 | Real founder photo (provided 2026-05-15) replaces K monogram. 2-col 40/60 layout. |
| 10 | Contact | RESHAPE | §10 | 60/40 form + direct-contact split. Existing form preserved, restyled. |
| – | Navigation | RESHAPE | – | Sticky, backdrop-blur, hide-on-scroll-down, active-link cyan underline. Mobile full-screen overlay. |
| – | Footer | RESHAPE | §11 | Minimal — wordmark + 4 link columns + © strip. |

## 7 · Architecture section §5 — perimeter inspector animation (Option B)

This is the explanatory motion piece. It tells JAG's actual story: **inline gateway between untrusted traffic and protected assets, with on-device AI inspecting every packet**.

**Layout** (inline SVG, ~900×500 viewBox, `preserveAspectRatio="xMidYMid meet"`):

- **Left column** — "Untrusted Internet" cloud silhouette in `text.tertiary`. Five ingress lanes emerge to the right.
- **Centre** — Stylised Jetson Orin NX module rendered as SVG. The JAG shield (reuse the hero shield SVG, scaled smaller) sits on top of the module. Three labelled processing layer rectangles stack inside: "Edge AI Processing" / "Adaptive Threat Management" / "Intelligent Gateway".
- **Right column** — Four destination icons stacked vertically (lucide Monitor / Server / Camera / Factory) with text labels: Workstations · Servers & IoT · IP Surveillance · Industrial Control / SCADA / PLC.

**Animation** (CSS + canvas, all paused under reduced-motion):

1. **On scroll-in**: each ingress line draws left-to-right via `stroke-dasharray`, 1.5 s total with 150 ms stagger between lanes.
2. **Shield**: radial cyan glow fades in beneath the shield concurrent with the line draws.
3. **Once draw completes**: a single `<canvas>` overlay (~3 kB hand-rolled) starts animating packets:
   - ~10-15 cyan dots per second emit from the left edge, flow along the lane paths toward the shield
   - At the shield: ~80% pass through and continue to the right column destinations (cyan, fading to the destination icons)
   - ~20% are stopped at the shield boundary — they decelerate, fade to red, and disappear over ~300 ms
   - Total particle count capped at 60 concurrent. Easy on the CPU; profiled to <1% main thread on M1 mobile-throttle equivalent.
4. Canvas paused via IntersectionObserver when off-screen, paused on `visibilitychange`, never starts under `prefers-reduced-motion: reduce`.

**Caption below diagram** (mono, quaternary):
`All inference, validation, and enforcement happens on the device. Zero cloud round-trips. Zero data exfiltration.`

**Fallback**: if the canvas budget bumps First Load JS past 95 kB after Phase E (see §9 risks), the canvas drops and the SVG lines + shield glow ship without packets. The story still lands.

## 8 · Content & assets

**Content single-source**: `lib/content.ts` extended with new keys. No marketing copy lives in section components. Brand voice filter (§11 charter — no exclamation marks, no "leverage", no "revolutionary", specific over abstract) applied to every new line.

**Founder photo**: image provided by owner during 2026-05-15 session (source: `~/Desktop/JAG/JAG Decks/images/Screenshot 2026-05-05 at 7.09.36 PM-modified.png`). Copied to `public/assets/founder-photo.png` in Phase A. Used via `next/image` with `priority` because it's above the fold once scrolled into Founder section.

**JAG logo**: image attached at session start. Copied to `public/assets/jag-logo.png` in Phase A. Used in Navigation wordmark (small, ~32 px h) and Footer wordmark. Hero centrepiece does NOT use this raster — the hero shield is inline SVG so it themes and scales.

**Five Layers body paragraphs**: NOT pasted in brief (referenced as "Tech Summary p.3"). Drafted by me from the brief's plain-English quotes + existing `lib/content.ts` Technology section voice. Owner reviews drafts before Phase F merges. Each paragraph stays within ~60-80 words, plainspoken-technical, no marketing inflation.

**Compliance frameworks**: exactly the 11 from brief, no inventions per charter §1.4. NIST CSF 2.0 · ISO 27001:2022 · SOC 2 Type II · OWASP Top 10 + LLM Top 10 · CWE/CAPEC · GDPR Art. 44-49 · PDPA Malaysia · EU AI Act · ISA 18.2 · IEC 62443 · NIST AI RMF 1.0.

**Direct-contact card**: 4 lines — General (`connect@`), Founder (`kelvin@`), Location (Penang, Malaysia · Southeast Asia HQ), LinkedIn link.

## 9 · Contact form backend

Worker source is not in this repo. CSP and `_headers` both allow `https://api.jag-cybersecurity.io`.

**Phase G probe** (before scaffolding anything):
```bash
curl -i -X OPTIONS https://api.jag-cybersecurity.io/contact \
  -H "Origin: https://www.jag-cybersecurity.io" \
  -H "Access-Control-Request-Method: POST"
```
- If 200 / 204 with CORS headers: leave alone. Form POSTs to existing endpoint.
- If 404 / 5xx / timeout: scaffold a minimal Worker in `workers/contact/` (new sibling directory, separate Wrangler config). Honeypot field, 10-req/IP/hour rate limit via Durable Object, forward via MailChannels to `connect@jag-cybersecurity.io`. Tracked as separate atomic phase G2; rebuild homepage merge does not block on it.

The homepage rebuild ships the form regardless of probe result — the form renders, validates, posts, shows "Sending… / Sent" optimistic UI. Worker recovery is parallel work.

## 10 · OG image

Generate at build time as a Next route handler: `app/og/route.tsx` using `@vercel/og`. 1200×630, deep navy `#05080F` field, JAG shield SVG, wordmark in Geist 96 px, tagline in JetBrains Mono 24 px, single radial cyan glow. Output PNG referenced via `<meta property="og:image" />` in `app/layout.tsx`. Closes charter §12 Phase 1.5 gap #4.

Verification: post-deploy, hit `https://www.opengraph.xyz/url/www.jag-cybersecurity.io` and confirm preview renders.

## 11 · Phasing

Each phase ends with a checkpoint: owner reviews, then I take a `.backup-YYYYMMDD-HHMMSS` snapshot + git commit per charter §1.2, then proceed.

| Phase | Scope | Estimate | Verification |
|---|---|---|---|
| A | Token migration + fonts (`next/font`) + globals.css + Layout + Nav + Footer + asset copies (logo, founder photo) + delete `" "` empty-name file | 1-2 h | Type-check + lint clean. Manual nav check at 375 / 768 / 1440. |
| B | Hero — SVG shield, gradient lockup, staggered reveals via extended `FadeInOnScroll` | 1-2 h | Visual diff at 5 breakpoints. Reduced-motion verified in DevTools. |
| C | ThreatLandscape + Capabilities + ProofBar (animated counters) | 2 h | `MetricCounter` re-test. Hover states verified on all 4 cards. |
| D | Pipeline with 5-stage SVG flow + connecting `stroke-dasharray` lines | 2-3 h | Mobile stack layout verified. Connecting-line draw timing < 1.5 s. |
| E | Architecture SVG diagram + canvas perimeter-inspector animation | 2-3 h | First Load JS measured. **If >95 kB, drop canvas, ship lines only.** Reduced-motion verified. |
| F | FiveLayers (5 cards + quote boxes) + Standards (11-badge grid) + Markets (6 cards) — owner reviews Five Layers drafted paragraphs here | 1-2 h | Lighthouse a11y dry-run. |
| G | Founder + Contact + Worker probe (+ Worker scaffold if probe fails) | 1-2 h | Form submit end-to-end. Real email arrives. |
| H | OG image route + polish + responsive sweep + reduced-motion sweep | 1-2 h | OG render confirmed via opengraph.xyz. |
| I | Cross-browser sanity (Chrome / Safari / Firefox + iOS Safari + Android Chrome via Playwright projects) + Lighthouse mobile + desktop + axe + visual-regression baseline | 1 h | All 12 brief acceptance criteria + 4 charter §3 craft gates GREEN. |
| J | Charter MINOR amendment v2.0 → v2.1 (resolves WEB-TASK-A/B/C, records rebuild + 2 new sections + Worker outcome, updates §12 reference paths) + final commit + handoff doc | 30 m | SHA workflow per Appendix B. Body SHA verified. |

Total: **12-18 h of focused work** with owner checkpoints between every phase. No phase merges without checkpoint sign-off.

## 12 · Risks (named, mitigations included)

1. **Bundle ceiling.** 10 sections + hero SVG + pipeline lines + architecture canvas + animated counters could push First Load JS past 100 kB.
   - Mitigation: `npm run build` after Phase D and after Phase E. If First Load JS >95 kB at end of Phase E, drop canvas particles (Option B keeps lines + shield glow, no packets). Brief's "fallback to static SVG" clause covers this.
2. **Lighthouse mobile ≥95.** Strict charter SLA. CPU throttle on mid-tier mobile is harsh on canvas + multiple IntersectionObservers.
   - Mitigation: Lighthouse mobile run after every section, not at the end. Any section that drops Perf below 96 (1-point buffer) is reworked before next phase begins.
3. **Cloudflare Worker.** May be live, may be dead. CSP allows it but no source in repo.
   - Mitigation: probe in Phase G before any code change. Worker rebuild is a separate atomic phase if needed.
4. **Five Layers body copy.** Drafted by me, not owner.
   - Mitigation: Phase F checkpoint includes copy review. No deploy without owner sign-off on the 5 paragraphs.
5. **Empty-name file `" "`** in working tree (visible in `ls`).
   - Mitigation: delete in Phase A with owner confirmation. Suspect accidental shell paste; not load-bearing.
6. **Uncommitted Phase 1.5 dev-tooling install** (modified `package.json`, `package-lock.json`, untracked `playwright.config.ts`, `lighthouserc.json`, `scripts/`, `tests/`).
   - Mitigation: commit this BEFORE Phase A starts as `chore(tooling): commit Phase 1.5 dev-tooling install` — backup-first per §1.2. Establishes clean baseline.

## 13 · Acceptance criteria

**Brief's 12** (all required):
1. Backup created and verified (`tar -tzf ...`)
2. `REBUILD-AUDIT.md` exists — this spec stands in for it
3. All 10 sections render on `localhost:3000`
4. `npm run build` exit 0, zero warnings
5. Lighthouse Performance ≥95 desktop
6. **Lighthouse Performance ≥95 mobile** (charter override of brief's 85)
7. Lighthouse A11y ≥98
8. Responsive at 375 / 768 / 1024 / 1440 / 1920
9. No console errors
10. `prefers-reduced-motion` honored — all looping animations pause
11. Contact form end-to-end (real email arrives)
12. OG image renders correctly post-deploy

**Charter §3 craft benchmarks** (all required):
- Type tokens used everywhere — `rg "color:|background:|border:" components/ app/` returns zero hex/rgba literals
- Every interactive element has hover / focus-visible / active / disabled states (§3.2.1)
- Colour contrast ≥4.5:1 body, ≥3:1 large/UI (axe verified)
- Type-check clean, lint clean (`npm run lint && npm run typecheck`)
- Zero axe violations on `tests/a11y.spec.ts`

**Commit hygiene** (charter §1.2 / §1.8):
- One commit per phase A-J
- Each commit message references the phase and what shipped
- No commit skips hooks
- Pre-deploy: `npm run lint && npm run typecheck && npm run build && npm test && npm run lighthouse` all green

## 14 · Out of scope (deferred / not in this build)

- Customer logo wall (no real customers yet — charter §11 forbids)
- Testimonials (same)
- Stock photography of any kind (charter §11)
- Three.js / WebGL / any non-CSS-keyframe motion library
- Cookie banner / chat widget / popup
- Analytics scripts (privacy stance — charter §11)
- Blog / news section
- Internationalisation
- Light mode (dark-only is the brand decision — charter §3.1 / §11)
- Spinning earth / global attack heatmap (rejected during brainstorming as off-brand for sovereign-edge story)

## 15 · Post-build follow-ups (charter MINOR amendment payload)

These get folded into v2.0 → v2.1 amendment in Phase J:
- Close WEB-TASK-20260515-A — accent decided as `#22D3EE`
- Close WEB-TASK-20260515-B — body font Geist
- Close WEB-TASK-20260515-C — mono font JetBrains Mono
- Close WEB-TASK-20260515-E — design-system.md companion (this spec partially serves it; promote to `docs/design-system.md` post-build)
- Close charter §12 Phase 1.5 gap #1 (fade-in polish — now bundled into FadeInOnScroll `delay` prop)
- Close charter §12 Phase 1.5 gap #2 (JAG logo)
- Close charter §12 Phase 1.5 gap #3 (founder photo)
- Close charter §12 Phase 1.5 gap #4 (OG image)
- Close charter §12 Phase 1.5 gap #5 (compliance badges restyled — still text, no fake certifications)
- Resolve charter §12 Phase 1.5 gap #6 (framer-motion in `package.json`) — `npm uninstall framer-motion` once `rg "framer-motion" app/ components/` returns empty post-build
- Add two new section entries to charter §12 section list (Architecture, FiveLayers)
- Record Worker probe outcome (live / scaffold-needed / scaffolded)

## 16 · Approvals

- Design approved by owner 2026-05-15 (verbal in brainstorming session)
- This spec written 2026-05-15 for owner review before `writing-plans` phase
- Charter conflicts reconciled: brief overridden where it contradicted charter, charter overridden on nothing
