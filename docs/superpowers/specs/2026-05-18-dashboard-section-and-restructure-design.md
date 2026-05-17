---
doc_id: SPEC-DASHBOARD-AND-RESTRUCTURE
title: JAG Website — Guardian Dashboard Section + Homepage Restructure
status: APPROVED
owner: Kelvin Lee
date: 2026-05-18
charter_reference: CLAUDE.md v2.1
brainstorming_session: 2026-05-18 (this conversation)
supersedes: none — additive + structural pruning on the post-2026-05-17 homepage
---

# JAG Website — Guardian Dashboard Section + Homepage Restructure

## 1 · Purpose

Three coordinated changes to shift the homepage from "tell" to "show" and reduce technical surface area:

1. **Add a Guardian Dashboard section** that displays the actual JAG Guardian product UI as evidence the product is real, with brief capability labels so non-operators understand what they're looking at.
2. **Combine the Architecture and FiveLayers sections** into a single section that tells one coherent story (outside view → inside view) instead of two adjacent sections covering overlapping ground.
3. **Remove decorative / technical clutter:** the ProofBar stat band, the entire Pipeline section (funnel + opener), and the 5 LayerCard grid. The website is the overview; technical depth lives in the demo and presentation.

Together: 10 sections → 8 sections, the visitor's path becomes *threats exist → here are our capabilities → here's the system → here it is running → here's the evidence → markets/founder/contact.*

## 2 · Stack & constraints (preserved)

- Next.js 14.2.35 · React 18 · Tailwind 3.4.1 · TypeScript strict · `output: 'export'` → Cloudflare Pages
- No new runtime deps (`devDependencies` only; sharp is already installed for WebP conversion)
- No `framer-motion` reintroduction
- First Load JS on `/` must stay ≤100 kB (current baseline: 97 kB)
- Lighthouse A11y / BP / SEO ≥95 (current: 100 / 100 / 100); Perf target ≥95 on production (PSI)
- Single accent: cyan family only

## 3 · New section: Guardian Dashboard

### 3.1 Identity

- **File:** `components/sections/Dashboard.tsx` (NEW)
- **Anchor:** `#dashboard`
- **Position in `app/page.tsx`:** between `Architecture` (now combined with FiveLayers — see §4) and `Technology`
- **No nav link added.** Main nav stays at 4 links (Solution / Technology / Markets / Contact). Dashboard is part of the homepage flow, not a separate destination.

### 3.2 Composition (uses existing SectionAnchor primitive)

```
<SectionAnchor
  id="dashboard"
  eyebrow="GUARDIAN DASHBOARD"
  headline="Defense, in Real Time."
  lede="The operator's view into the JAG defense stack. Every threat detected. Every decision logged. Every AI output validated. Every action sealed."
>
  <BrowserChrome tab="jag-guardian.app">
    <Image src="/assets/guardian-dashboard.webp" ... />
  </BrowserChrome>
  <DashboardCaptions />  // 4 caption labels in a row
</SectionAnchor>
```

### 3.3 Caption row design (`DashboardCaptions`, inlined in `Dashboard.tsx`)

4 caption blocks in a `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10` layout. Each block:

- **Label** (mono, eyebrow-styled, cyan): one of `PIPELINE` / `AI ANALYST` / `SYSTEM HEALTH` / `EVIDENCE`
- **Caption** (body, secondary text): one short line, no more than ~10 words

Final caption copy:

| Label | Caption |
|---|---|
| `PIPELINE` | 5-stage decision flow at line rate |
| `AI ANALYST` | Plain-English explanations alongside every decision |
| `SYSTEM HEALTH` | Live on-device telemetry — temp, memory, throughput |
| `EVIDENCE` | Every action sealed to a tamper-evident ledger |

No icons. Aligns with the "clean, brief" pivot — the dashboard image itself is the visual; captions are pure typography.

### 3.4 Image asset

- **Source PNG:** `public/assets/guardian-dashboard.png` (3420×1968, 1.05 MB, RGBA) — already saved by owner during the 2026-05-18 session.
- **Build output:** `public/assets/guardian-dashboard.webp` — converted via sharp during implementation (quality 85). Expected output: 150-350 KB.
- **Source PNG deleted after WebP confirmed working** (same pattern as logo / founder / architecture-overview during the 2026-05-17 perf pass).
- **Image consumer:** `<Image>` from `next/image` with `priority={false}` (below-fold), `width={3420}`, `height={1968}`, `sizes="(max-width: 1280px) 100vw, 1280px"`, `className="w-full h-auto"`.

### 3.5 Content additions in `lib/content.ts`

Add a new top-level export:

```ts
export const dashboard = {
  eyebrow: 'GUARDIAN DASHBOARD',
  headline: 'Defense, in Real Time.',
  lede:
    "The operator's view into the JAG defense stack. Every threat detected. Every decision logged. Every AI output validated. Every action sealed.",
  image: {
    src: '/assets/guardian-dashboard.webp',
    alt:
      'JAG Guardian dashboard: HEALTHY status header, 5-stage threat-decision pipeline (Packet → Guardian → CPU LLM → GPU LLM → Action), AI Analyst sidebar with plain-English explanations, system health telemetry (GPU/CPU temperature, memory, storage), and 24-hour activity counters.',
    chromeTab: 'jag-guardian.app',
  },
  captions: [
    { label: 'PIPELINE', text: '5-stage decision flow at line rate' },
    { label: 'AI ANALYST', text: 'Plain-English explanations alongside every decision' },
    { label: 'SYSTEM HEALTH', text: 'Live on-device telemetry — temp, memory, throughput' },
    { label: 'EVIDENCE', text: 'Every action sealed to a tamper-evident ledger' },
  ],
} as const;
```

## 4 · Combined section: Architecture + FiveLayers

### 4.1 Identity

- **File:** `components/sections/Architecture.tsx` (modified — absorbs FiveLayers content)
- **File deleted:** `components/sections/FiveLayers.tsx`
- **Anchor:** `#architecture` (preserved — kept for any existing inbound links)
- **Position in `app/page.tsx`:** unchanged (where Architecture currently sits; FiveLayers import removed)

### 4.2 Composition (outside-first vertical layout per 2026-05-18 owner approval)

```
<SectionAnchor
  id="architecture"
  eyebrow="ARCHITECTURE"
  headline="One Sovereign Device. Five Defense Layers."
  lede={architecture.lede}  // combined lede, see §4.3
>
  {/* OUTSIDE VIEW — architecture diagram (network positioning) */}
  <BrowserChrome tab="architecture-overview.svg">
    <Image src="/assets/architecture-overview.webp" ... />
  </BrowserChrome>

  {/* INSIDE VIEW — LayerStack stratigraphy (5 layers within device) */}
  <BrowserChrome tab="five-layers.spec" className="mt-12">
    <div className="p-6 md:p-10">
      <LayerStack />
    </div>
  </BrowserChrome>

  {/* CLOSING — defensible moat statement, preserved from FiveLayers */}
  <FadeInOnScroll delay={0.5}>
    <div className="mt-16 bg-bg-surfaceMuted border-y border-border-default py-12 -mx-gutter px-gutter">
      <p className="text-center font-display text-h3 font-semibold text-text-primary">
        A Defensible Moat by Design
      </p>
      <p className="mt-3 text-center text-body text-text-secondary max-w-[60ch] mx-auto">
        Protected under a portfolio of 6 patents · 113 claims. The integrated architecture cannot be replicated without infringing.
      </p>
    </div>
  </FadeInOnScroll>
</SectionAnchor>
```

### 4.3 Combined lede

Current Architecture lede: *"JAG sits inline between the untrusted internet and your protected network. Every packet is inspected, classified, and either blocked at the edge or escalated to deeper inference — all on a single NVIDIA Jetson Orin NX."*

Current FiveLayers lede: *"JAG isn't a single tool — it's five integrated defense layers, each a patented invention, working together inside one sovereign device."*

Combined (drafted; owner can adjust during implementation):

> "JAG sits inline between the untrusted internet and your protected network. Five patented defense layers — Enforce, Understand, Prove, Guard the AI, Adapt — work together inside a single NVIDIA Jetson Orin NX. Every packet inspected, classified, blocked at the edge or escalated to deeper inference."

### 4.4 Content changes in `lib/content.ts`

- Keep the `architecture` export, replace its `lede` field with the combined version above
- Keep `fiveLayers.closing` (the "Defensible Moat" block content — used by combined section's closing)
- Delete `fiveLayers.layers` (the 5 LayerCard items — no longer rendered per §5)
- Delete `fiveLayers.eyebrow`, `fiveLayers.headline`, `fiveLayers.lede` (subsumed by `architecture` export)
- Cleanest: delete the entire `fiveLayers` export and add `architecture.closing = { title, body }` field carrying the moat content. **Decision:** do this — consolidate to one export per section.

## 5 · Removals (Request 3)

### 5.1 ProofBar (from Solution section)

- **File modified:** `components/sections/Solution.tsx` — remove `<ProofBar />` usage + import
- **Component file deleted:** `components/ui/ProofBar.tsx`
- **Content removed:** `capabilities.proofBar` field deleted from `lib/content.ts` (the `Solution.tsx` section consumes the `capabilities` export, not `solution`)
- **Verify before delete:** grep for `MetricCounter` usage — if only ProofBar consumed it, delete `components/ui/MetricCounter.tsx` too. If used elsewhere (Hero stat? Footer?), keep.

### 5.2 Pipeline section (entirely)

- **File deleted:** `components/sections/Pipeline.tsx`
- **Component files deleted (verify first):** `components/ui/PipelineFunnel.tsx`, `components/ui/PacketParticles.tsx` (canvas overlay), and any other Pipeline-only primitives
- **Import removed from `app/page.tsx`:** `import { Pipeline } from '@/components/sections/Pipeline';` and `<Pipeline />` JSX
- **Content removed:** `pipeline` export deleted from `lib/content.ts`
- **Anchor `#pipeline` no longer exists** — verify no nav link, no Hero CTA, no footer link points to it. Hero's `ctaSecondary.href` was `#pipeline` historically; needs updating to a still-existing anchor (likely `#dashboard` — fits the "See How It Works" CTA label semantically).

### 5.3 LayerCards (the 5 cards in former FiveLayers section)

- **JSX removed:** the `<ol>` grid rendering `LayerCard` instances in the combined section. Already covered by §4.2 (the combined section composition doesn't include the LayerCard grid).
- **Component file deleted:** `components/ui/LayerCard.tsx`
- **Content removed:** `fiveLayers.layers[]` deleted from `lib/content.ts` (covered by §4.4)

## 6 · `app/page.tsx` final section order

Before (10): Hero · Threats · Solution · Pipeline · Architecture · FiveLayers · Technology · Markets · Founder · Contact

After (9): **Hero · Threats · Solution · Architecture (+ FiveLayers content merged in) · Dashboard · Technology · Markets · Founder · Contact**

Delta: −2 (Pipeline + FiveLayers as separate sections) + 1 (Dashboard) = −1 net.

## 7 · Hero secondary CTA — `ctaSecondary.href` update

Current `hero.ctaSecondary.href = '#pipeline'`. With Pipeline removed, this CTA points nowhere.

**Decision:** change to `'#dashboard'` and change the label from `'See How It Works'` to `'See JAG Guardian'`. Rationale: the dashboard IS the "how it works" answer post-restructure, and the new label is more concrete.

Update in `lib/content.ts`:
```ts
hero.ctaSecondary = { label: 'See JAG Guardian', href: '#dashboard' }
```

## 8 · Charter compliance check

| Charter rule | Status | Note |
|---|---|---|
| §3.1 dark-only | ✓ | No mode change |
| §3.1 design tokens, not hex | ✓ | All values from `tailwind.config.ts` |
| §3.2 no framer-motion on `/` | ✓ | Pure CSS animation; sections use existing FadeInOnScroll |
| §3.3 WCAG 2.2 AA | ✓ | New section: `aria-hidden` on chrome dots; descriptive `alt` on dashboard image |
| §3.4 First Load JS ≤100 kB | ✓ projected | New `Dashboard.tsx` is ~50 lines of JSX; ~+1 kB. Combined section trims net code (FiveLayers + LayerCard grid removed). Pipeline removal trims more (~2-3 kB of canvas + funnel code). Net delta probably **−2 to −5 kB**. |
| §3.4 Lighthouse ≥95 | ✓ projected | Dashboard image is below-fold (no LCP impact); page-specific JS shrinks |
| §11 single accent colour | ✓ | Cyan only |
| §11 no AI-generated imagery | ✓ | Dashboard screenshot is a real product UI capture |
| §11 no glassmorphism | ✓ | BrowserChrome is opaque-bordered, not frosted |
| §11.2 `icon-tile-stack` | ✓ | No tiles — removed in the 2026-05-17 simplification |
| §11.2 `identical-card-grids` | ✓ | Dashboard captions are 4 typographic blocks, not iconed cards |

## 9 · Performance budget

Net First Load JS projection: **−2 to −5 kB** (more code removed than added).

Asset weight: new `guardian-dashboard.webp` will be 150-350 KB at quality 85 (down from 1.05 MB PNG). Since the image is below-fold and lazy-loaded by `next/image`, no LCP impact.

PageSpeed Insights (PSI) Perf score expected to stay ≥95 on production.

## 10 · Sequencing

5 tasks. Each a single commit. Aligned with charter §2 Phase 5 verification at each step.

1. **Image conversion + content additions** — convert `guardian-dashboard.png` → `.webp` via sharp; add `dashboard` export to `lib/content.ts`; update `architecture` export with combined lede + closing block field; remove `pipeline`, `fiveLayers`, and `solution.proofBar` (or wherever ProofBar content lives) fields. Update Hero's `ctaSecondary`.
2. **New `Dashboard.tsx` section** — build the new section component using existing `SectionAnchor` + `BrowserChrome`. Inline the captions row. Verify typecheck + build.
3. **Modify `Architecture.tsx`** — absorb FiveLayers content (LayerStack + closing block). Delete `FiveLayers.tsx`. Update lede to combined version. Verify typecheck + build.
4. **Removals** — delete `Pipeline.tsx`, `PipelineFunnel.tsx`, `PacketParticles.tsx` (verify), `LayerCard.tsx`, `ProofBar.tsx`, `MetricCounter.tsx` (verify). Update `app/page.tsx` imports + JSX (drop Pipeline, drop FiveLayers, add Dashboard). Verify typecheck + build at each removal.
5. **Pre-merge gate** — full pre-merge gate (lint / typecheck / build / test / lighthouse). Update visual-regression snapshots (homepage now has Dashboard + combined section, different layout). Capture before/after screenshots for owner review.

## 11 · Out of scope

- New routes (Request 1 collapsed to a homepage section per owner decision)
- Nav link changes (stays at 4)
- Footer link changes (footer doesn't reference any of the removed anchors — verify in Task 1)
- Brand colour expansion / new font families
- Charter §11 amendments
- Worker / backend changes

## 12 · Cross-references

- Brainstorming source: 2026-05-18 session, this conversation
- Charter: `CLAUDE.md` v2.1
- Prior spec: `docs/superpowers/specs/2026-05-17-resend-grade-premium-polish-design.md` (the section primitives and image-optimisation pattern this spec inherits)
- Owner reference for new section visual style: Darktrace homepage screenshot (image #106 in 2026-05-18 chat) — adopted *concept* (product UI as evidence), rejected *layout* (4-column value-prop grid alongside)
- Files to be created: `components/sections/Dashboard.tsx`, `public/assets/guardian-dashboard.webp`
- Files to be modified: `components/sections/Architecture.tsx`, `app/page.tsx`, `lib/content.ts`
- Files to be deleted: `components/sections/Pipeline.tsx`, `components/sections/FiveLayers.tsx`, `components/ui/PipelineFunnel.tsx`, `components/ui/PacketParticles.tsx` (verify), `components/ui/LayerCard.tsx`, `components/ui/ProofBar.tsx`, `components/ui/MetricCounter.tsx` (verify), `public/assets/guardian-dashboard.png` (after WebP confirmed)

---

*End of spec — JAG Guardian Dashboard section + homepage restructure, 2026-05-18.*
