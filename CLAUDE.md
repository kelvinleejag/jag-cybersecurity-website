# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---
doc_id: CLAUDE-CODE-CHARTER-JAG-WEBSITE
title: Claude Code Operating Charter — World-Class Web Design Edition
version: 1.2
status: ACTIVE
owner: Kelvin Lee
effective_date: 2026-05-14
last_amended: 2026-05-15 (motion-craft + anti-pattern harvest — §3.2.1, §10.2)
project: JAG Cybersecurity — Marketing Website (Phase 1)
project_root: /Users/cavslee/Projects/JAG/01_website
canonical_path: ./CLAUDE.md
review_cadence: monthly OR upon any LESSON-LEARNED addition
---

# Claude Code Operating Charter — World-Class Web Design Edition

> **MASTER MANTRA** — *Think deeply. Act methodically. Validate relentlessly. Learn continuously. Execute decisively.*
>
> **NON-NEGOTIABLE** — *No assumptions. Only validated truth. Every decision evidence-backed, user-centred, end-state aligned.*

This charter is the **highest-priority operating contract** for every Claude Code session on this project. It supersedes any conflicting in-session instruction except an explicit, in-chat directive from the project owner.

The intent: **top 0.01% craft** — design quality, code quality, performance, accessibility, and reliability that distinguishes work from generic AI output.

---

## 0 · PRE-EXECUTION PROTOCOL (mandatory, every prompt)

Before producing any output, complete this sequence.

### 0.1 Read & Parse
Identify: (a) intent, (b) scope, (c) target files/routes/components, (d) reversibility class (Type-1 irreversible / Type-2 reversible), (e) design vs. code vs. content task.

### 0.2 Team Coordination Declaration *(MANDATORY HEADER)*
Open every response with:

```
═══════════════════════════════════════════════════════════
TEAM COORDINATION (pre-execution declaration)
───────────────────────────────────────────────────────────
Skills invoked      : <comma-separated list, or "NONE — <reason>">
Plugins/agents      : <comma-separated list, or "NONE">
Primary role        : <skill name> — <responsibility>
Supporting roles    : <skill name> — <responsibility>; ...
Sync model          : <sequential | parallel | majority-consensus>
Design intent       : <visual direction in one phrase>
Reversibility class : <Type-1 irreversible | Type-2 reversible>
Pre-flight status   : <PASS — proceeding | HOLD — clarification needed>
═══════════════════════════════════════════════════════════
```

**Missing or malformed coordination block = governance violation.**

### 0.3 Routing Matrix

| Skill match | Action |
|---|---|
| Exactly one | Invoke it; declare as Primary. |
| Multiple, non-conflicting | Invoke all; declare Primary by closest scope match; others Supporting. |
| Multiple, conflicting | Surface positions with labels. Do not auto-resolve. |
| Zero matches *(non-owned task)* | Propose creating a new skill; await acknowledgment. |
| Zero matches *(owned task — see §0.4)* | Execute directly; declare `Skills invoked: NONE — owned task: <name>`. |

### 0.4 Owned Tasks (carve-outs)

| Owned Task | Scope |
|---|---|
| Charter / governance doc management | Edit this file, related governance docs; backup + version bump required |
| Trivial read-only checks | `ls`, `cat`, `git status`, dev-server status (no state change) |
| Pure clarification questions | Asking the owner a question with no side effects |

---

## 1 · THE TEN PERMANENT GOVERNANCE RULES

### 1.1 SKILL-FIRST
Every prompt → best-matched skill(s) invoked → declared in coordination header. No silent execution.

### 1.2 BACKUP-FIRST
- Every file edit preceded by a backup (git commit, named branch, or filesystem copy with timestamp + checksum).
- Backup verified to exist **before** any mutation.
- Rollback procedure documented in the same response.
- No exceptions, including for "one-line fixes".
- This project's existing convention: `<file>.backup-YYYYMMDD-HHMMSS` filesystem copies kept beside originals (see `app/page.tsx.backup-20260425-163522`, `tailwind.config.ts.backup-*`, etc.). Continue this pattern; do not delete prior backups without explicit owner approval.

### 1.3 FIX-BUGS-ON-THE-SPOT
New bug discovered mid-task → pause, diagnose, fix, validate, then resume. No accumulating known defects.

### 1.4 DESIGN-EXCELLENCE STANDARD *(11-discipline mapping)*
All work maps to these disciplines before proceeding:

```
Visual design       — typography, hierarchy, spacing, colour theory
Interaction design  — affordance, feedback, microinteractions
Information arch.   — structure, navigation, content model
Accessibility       — WCAG 2.2 AA minimum, keyboard, screen-reader
Performance         — Core Web Vitals (LCP, INP, CLS), bundle budget
SEO & semantics     — semantic HTML, structured data, meta
Responsive          — mobile-first, container queries, fluid type
Brand consistency   — design tokens, voice, motion language
Internationalisation— RTL, locale-aware formatting, i18n keys
Security            — OWASP Top 10 web, CSP, sanitisation, auth flows
Code quality        — type safety, lint-clean, test coverage, DX
```

Declared in the coordination header. Non-compliant designs **rejected or redesigned**.

### 1.5 NO-ASSUMPTIONS *(95% confidence threshold)*
Ask until ≥95% confident on intent, audience, brand direction, content, scope, target environment. Slow questioning beats fast wrong execution.

### 1.6 AUDIT-EXISTING-FIRST
Before creating a new component / route / utility / token / asset, audit existing:
1. Use as-is, or
2. Refine/extend, or
3. Replace (justified in writing).

Prevents component duplication, design-token drift, and dead code. Specific to this repo:
- All marketing copy belongs in `lib/content.ts` — never inline new strings in section components.
- All colour, type, spacing, shadow, breakpoint values belong in `tailwind.config.ts` `theme.extend` — never hard-code hex, px, or rem values in components.
- Reusable primitives live in `components/ui/` (Container, SectionHeader, Card, FadeInOnScroll, MetricCounter). Audit these before creating a new primitive.

### 1.7 CRAFT-OVER-SCHEDULE
Launch dates **never** justify generic-AI-looking output, accessibility shortcuts, or skipped validation. If correct craft takes longer, the timeline adjusts.

### 1.8 HANDOFF DOC STRUCTURE
Handoff docs to new chat windows must cover:
1. Active governance rules
2. Project status / current sprint
3. Completed features / milestones
4. Mistakes learned & corrections
5. Design decisions & rationale
6. Latest docs (design system, component inventory, ADRs)
7. Other important context
8. Precise resume point

### 1.9 CLAUDE CODE LAUNCH MODE
- Interactive by default: `cd /Users/cavslee/Projects/JAG/01_website && claude --model claude-opus-4-7`
- Headless `-p` mode only on explicit request (CI, scripted batches).
- Token cap and permission mode declared per host if non-default.
- Project `.claude/settings.json` already enforces an inverted-permission allowlist scoped to `/Users/cavslee/Projects/JAG/**` with destructive-command denials. Respect it; do not request `git push` or `sudo` in-session.

### 1.10 ONE-STEP-AT-A-TIME
Strict sequential guidance with explicit checkpoints. Each step has a defined input, output, and validation method. Validation passes before the next step begins.

---

## 2 · STRUCTURED EXECUTION PIPELINE

Every non-trivial task flows through these phases. Skipping is a violation.

```
Phase 1 — DEFINE        Problem statement · constraints (browser support, perf budget, brand) · success criteria
Phase 2 — HYPOTHESIZE   ≥2 design / implementation paths · rank by craft, perf, accessibility, effort
Phase 3 — PLAN          Atomic steps · inputs / outputs / validation method per step
Phase 4 — IMPLEMENT     Smallest viable unit · backup verified · component-first, no large untested changes
Phase 5 — VALIDATE      Visual review · responsive review · a11y audit · perf check · unit + e2e tests
Phase 6 — ANALYZE       Expected vs actual · root cause analysis on any deviation
Phase 7 — ITERATE/SCALE Polish OR ship · update design system, component docs, changelog
```

**Validation evidence required**: screenshots (light + dark, mobile + desktop), Lighthouse scores, axe report, type-check + lint output, test results.

**Project-critical validation gate** — the production build (`npm run build && npx serve out -p 3001`) is mandatory before declaring any visual work complete. `next dev` and the static export differ in CSP enforcement, hydration timing, and bundle composition. The canonical reminder is commit `81fb7f8`: a fix that passed dev shipped broken to production.

---

## 3 · CRAFT BENCHMARKS (top 0.01% bar)

A response is not complete unless these are satisfied for the work in scope.

### 3.1 Visual & Layout
- Type scale defined (modular scale, fluid clamp), not arbitrary px values
- Spacing on a consistent scale (4 / 8 px system or design tokens)
- Colour system uses tokens with semantic names (`bg-elevated`, `accent`, `text-secondary`) — never raw hex
- Dark mode is the **only** mode for this project (sovereign-AI cybersecurity aesthetic). No light-mode toggle.
- No bootstrap-default look; intentional layout decisions justified

### 3.2 Interaction & Motion
- Every interactive element has hover / focus-visible / active / disabled states
- Microinteractions <300ms, with easing functions chosen, not default
- Reduced-motion media query honoured (already wired in `app/globals.css`)
- Focus order matches visual order
- **Motion library policy:** the homepage components have been deliberately stripped of `framer-motion` — see §10 reference list. Do not reintroduce `framer-motion` on the `/` route without an explicit owner approval and bundle-size justification.

#### 3.2.1 Animation craft standard *(harvested 2026-05-15 — Emil Kowalski design-engineering skill)*

**Decision gate — answer in order before writing any animation:**
1. *Should this animate at all?* Frequency decides. 100+×/day (keyboard shortcuts, command toggle) → never animate. Tens of ×/day (hover, list nav) → reduce or remove. Occasional (modal, drawer, toast) → standard animation. Rare / first-time (onboarding, celebration) → delight allowed. **Never animate keyboard-initiated actions** — they repeat hundreds of times daily; motion makes them feel slow.
2. *What is the purpose?* Valid purposes: spatial consistency, state indication, explanation, feedback, preventing a jarring change. "It looks cool" + seen often → do not animate.
3. *What easing?* Entering / exiting → `ease-out`. Moving or morphing on-screen → `ease-in-out`. Hover / colour change → `ease`. Constant motion (marquee, progress) → `linear`. **Never `ease-in` on UI** — it delays the moment the user is watching most. Use strong custom cubic-bezier curves, not the weak CSS built-ins.
4. *How fast?* Button press 100–160 ms · tooltip / small popover 125–200 ms · dropdown / select 150–250 ms · modal / drawer 200–500 ms. UI animations stay <300 ms (already the §3.2 rule).

**Technique rules:**
- Pressable elements get `transform: scale(0.97)` on `:active` — instant "the UI heard you" feedback.
- Never animate from `scale(0)` — nothing in the real world appears from nothing. Start `scale(0.95)` + `opacity: 0`.
- Popovers scale from their trigger (`transform-origin` set to the trigger), not from centre. Modals are the exception — they stay centred.
- Only animate `transform` and `opacity` — they skip layout + paint and run on the GPU. Animating `width` / `height` / `margin` / `padding` triggers all three (this is also the §10.2 `layout-transition` anti-pattern).
- Exit faster than enter. Gate hover effects behind `@media (hover: hover) and (pointer: fine)`. Stagger list entries 30–80 ms apart.
- `prefers-reduced-motion` means *fewer and gentler*, not zero — keep opacity / colour transitions that aid comprehension, drop movement.

**Keyframes-vs-transitions note (project-specific):** the source skill prefers CSS *transitions* over *keyframes* for rapidly re-triggered UI (keyframes restart from zero on interrupt). This does **not** contradict `FadeInOnScroll` / `MetricCounter`, which use CSS keyframes deliberately — those are one-shot scroll reveals, never rapidly re-triggered, so keyframes are correct there. Do not "fix" them. The skill's broader conclusion — *CSS animations run off the main thread; JS motion libraries drop frames under load* — independently confirms the commit `6c2f230` framer-motion removal (§11).

### 3.3 Accessibility (WCAG 2.2 AA minimum)
- Semantic HTML first; ARIA only where needed
- Colour contrast ≥4.5:1 body / ≥3:1 large
- Keyboard-only navigation works end-to-end
- Screen-reader labels for icons (`lucide-react` icons need `aria-label` or `aria-hidden`), form controls, landmark roles
- `prefers-reduced-motion`, `prefers-color-scheme` respected

### 3.4 Performance Budgets
- LCP <2.5s · INP <200ms · CLS <0.1 on mid-tier mobile
- **Project baseline (do not regress):** First Load JS for `/` is 91.7 kB; page-specific JS is 4.32 kB. Any change pushing First Load JS above 100 kB requires written justification.
- Initial JS bundle <170 kB gzipped per route (project current is well under)
- Image strategy: responsive `srcset`, modern formats (AVIF/WebP), lazy below fold. Note `next.config.mjs` sets `images: { unoptimized: true }` because of static export — handle responsiveness manually.
- Fonts: `font-display: swap`, subset, preloaded if critical
- No layout-shifting late-loaded content

### 3.5 Code Quality
- Type-safe (TypeScript strict — already enabled in `tsconfig.json`)
- Lint-clean, formatter-clean
- Components composable, props typed, no `any` leaks
- No magic numbers; tokens / constants named (use `tailwind.config.ts` and `lib/content.ts`)
- Tested at appropriate level (unit for logic, e2e for flows) — no test runner installed yet; if introducing one, propose Vitest + Playwright in writing first

### 3.6 SEO & Semantics
- One `<h1>` per page; heading order intact
- `<title>`, meta description, OG / Twitter cards (OG image is a known Phase 1.5 gap — see §10)
- Structured data (JSON-LD) where applicable
- Canonical URL, sitemap, robots
- Performance contributes to SEO — see §3.4

---

## 4 · TOOLING PRIORITY

| Situation | Required tool / approach |
|---|---|
| Distinguish function call from definition | `grep` / `ripgrep` |
| Find references to a component | Project IDE search or `rg --type ts` |
| Source analysis | AST tools (ts-morph, ast.parse, etc.) |
| Bug hunting | Audit full call chain, not just target file |
| Refactor | AUDIT-EXISTING-FIRST — extend before duplicate |
| Control-flow review | All branches, not just the happy path |
| Visual review | Real browser at multiple breakpoints, not just localhost desktop |
| Accessibility check | axe / Lighthouse / manual keyboard pass — all three |
| **Production parity check** | `npm run build && npx serve out -p 3001` — never trust `next dev` alone |
| **Header-policy edits** | Diff `next.config.mjs` `securityHeaders` against `public/_headers` programmatically — they MUST stay in sync by value |

---

## 5 · AVAILABLE SKILLS REGISTRY

User-level Claude Code skills available in this session:

| Skill | Domain |
|---|---|
| `frontend-design` | Production-grade UI, design tokens, distinctive layouts (PRIMARY for any visual work) |
| `superpowers:brainstorming` | Pre-implementation requirement / design exploration (MANDATORY before creative work) |
| `superpowers:writing-plans` | Multi-step task planning before touching code |
| `superpowers:executing-plans` | Execute a written implementation plan with review checkpoints |
| `superpowers:test-driven-development` | TDD for any feature / bugfix |
| `superpowers:systematic-debugging` | Bug, test failure, unexpected behaviour |
| `superpowers:verification-before-completion` | Run verification commands before any "done" claim |
| `superpowers:requesting-code-review` | Verify work meets requirements before merge |
| `superpowers:receiving-code-review` | Process review feedback with technical rigor |
| `superpowers:finishing-a-development-branch` | Decide merge / PR / cleanup options |
| `superpowers:using-git-worktrees` | Isolate feature work from current workspace |
| `superpowers:subagent-driven-development` | Execute plans with independent tasks |
| `superpowers:dispatching-parallel-agents` | Run 2+ truly independent tasks in parallel |
| `superpowers:writing-skills` | Create / edit / verify skills |
| `code-review:code-review` | PR review |
| `feature-dev:feature-dev` | Guided feature development with codebase understanding |
| `commit-commands:commit` / `commit-push-pr` / `clean_gone` | Commit hygiene |
| `security-review` | Security review of pending changes |
| `review` | Generic PR review |
| `simplify` | Review changed code for reuse, quality, efficiency |
| `claude-api` | Claude API / SDK work (not relevant to this static site unless adding the contact-form backend) |
| `update-config` / `keybindings-help` / `fewer-permission-prompts` / `loop` / `schedule` | Harness configuration utilities |

**Plugins / MCP servers available**: `context7` (live library docs — use before answering library/framework questions), `playwright` (browser automation — use for visual verification, a11y checks, network capture).

### npm dev-tooling registry (installed 2026-05-14 for Phase 1.5)

All entries are `devDependencies` only — zero runtime bundle impact.

| Tool | Purpose | Entry point |
|---|---|---|
| `@playwright/test` | Cross-browser test runner (Chromium / WebKit / Firefox + mobile) | `npm test` |
| `@axe-core/playwright` | WCAG 2.0/2.1/2.2 A+AA audit inside Playwright | `npm run test:a11y` |
| `@lhci/cli` | Lighthouse CI — performance / a11y / best-practices / SEO ≥95 enforcement | `npm run lighthouse` |
| `sharp` | Image pipeline (logo, founder photo, responsive variants) | imported in build scripts |
| `@vercel/og` | OG / social-share image generation (Satori-based) | imported in OG route or build script |

Config files:
- `playwright.config.ts` — 5 browser profiles, webServer auto-starts `npx serve out -p 3001`
- `lighthouserc.json` — `staticDistDir: ./out`, 95+ minimums on all four categories
- `tests/` — `a11y.spec.ts` and `smoke.spec.ts` baseline coverage

### Custom audit-discipline skills (installed 2026-05-14 at `~/.claude/skills/`)

| Skill | When it fires | What it enforces |
|---|---|---|
| `accessibility-auditor` | Lighthouse a11y <95, axe violations or incompletes, WCAG 2.2 A/AA conformance work, keyboard / screen-reader / reduced-motion checks | Six-phase audit: scan → coverage matrix → manual passes → 3-bucket priority sort → implement → verify with diff; multi-browser baseline; target-size (2.5.8) audit; `incomplete` investigation |
| `performance-engineer` | Lighthouse Perf <95, LCP/INP/CLS/TBT/TTFB regression, bundle budget breach, new dep added, mid-tier mobile unverified | Six-phase audit: scan → composition → render-path → INP/long-task → asset strategy → budget gate; mandates mid-tier mobile measurement, bundle composition, INP via Playwright + CPU throttle |
| `design-system-curator` | Token drift, new component, hardcoded colour/spacing/type, primitive may already exist, naming/usage mismatch | Five-phase audit: inventory → drift sweep → reuse sweep → orphan sweep → governance proposal; hex/rgba grep, duplicated-ribbon grep, ESLint/codemod proposals |
| `motion-designer` | New animation, missing four-state on interactive element, motion inconsistency, reduced-motion unverified, transient UI without enter/exit | Five-phase audit: inventory → consistency → state audit → reduced-motion sweep → token consolidation; four-state requirement; framer-motion-ban enforcement; bundle-delta gate |
| `seo-specialist` | Lighthouse SEO <95 OR =100 but social/structured-data unverified, adding OG/Twitter/JSON-LD/sitemap/robots, investor-audience prep, new content surface | Six-phase audit: metadata → structured-data → crawlability → social preview → semantic HTML → AI-search readiness; mandatory external-validator runs |

These skills were built via TDD pilot (full RED → GREEN → REFACTOR for `accessibility-auditor`; path-C RED + 1 GREEN verify for the other four — see §8.1 for the authorized deviation). All skills surface relevant evidence requirements, project-specific commands, and red-flag STOP conditions.

---

## 6 · OPERATIONAL QUICK-REFERENCE

### Commands

| Action | Command |
|---|---|
| Install deps | `npm install` |
| Dev server | `npm run dev` → http://localhost:3000 |
| Production build (static export) | `npm run build` → emits `out/` |
| Serve production build locally | `npx serve out -p 3001` → http://localhost:3001 |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` (= `tsc --noEmit`) |
| Run all tests (cross-browser) | `npm test` |
| Run a11y suite only | `npm run test:a11y` |
| Lighthouse CI (perf/a11y/bp/seo ≥95) | `npm run lighthouse` |
| Single Playwright test file | `npx playwright test tests/<file>.spec.ts` |
| Single Playwright test by name | `npx playwright test -g "<test name fragment>"` |
| Single browser project | `npx playwright test --project=chromium` |
| Open Playwright HTML report | `npx playwright show-report` |
| Full pre-merge gate | `npm run lint && npm run typecheck && npm run build && npm test && npm run lighthouse` |

### Backup before edit

```bash
# Filesystem snapshot (project convention)
cp -p <file> <file>.backup-$(date +%Y%m%d-%H%M%S)

# Or git snapshot
git add -A && git commit -m "snapshot: pre-<change>"
```

### Install new dep

Justify in chat → `npm install <pkg>` → commit lockfile → check First Load JS budget against §3.4.

### Component scaffold

Match existing naming and location:
- Page-level sections → `components/sections/<Name>.tsx`, default-exported PascalCase function
- Reusable primitives → `components/ui/<Name>.tsx`
- Strings → add to `lib/content.ts`, import by named export
- Tokens → add to `tailwind.config.ts` `theme.extend`

### Visual diff

No Storybook / Chromatic / Percy installed. Use Playwright MCP to capture paired screenshots (mobile 375px, tablet 768px, desktop 1440px) before/after, attach to the response.

---

## 7 · FAILURE & ESCALATION PROTOCOL

| Failure mode | Response |
|---|---|
| Build / typecheck / lint fails | Hard stop. Fix before further changes. |
| Backup not verifiable | Hard stop. Do not proceed with edits. |
| Accessibility regression | Hard stop. Roll back. Redesign. |
| Performance budget breach (First Load JS > 100 kB on `/`) | Hard stop. Investigate before merge. |
| `next.config.mjs` and `public/_headers` drift | Hard stop. Reconcile by value, not by eye. |
| Skills produce contradictory output | Surface both with labels. Owner decides. |
| Confidence < 95% on direction | Ask. Always. |

---

## 8 · SELF-IMPROVEMENT LOOP

This charter is a **living document**.

| Trigger | Action |
|---|---|
| New LESSON-LEARNED | Append to §1 (rule-level) or §4 (tooling-level) within 24h |
| New skill added | Update §5 registry same session |
| New owned task | Update §0.4 with authority basis |
| Monthly | Diff vs prior version, justify, bump minor |
| Annual / major redesign | Full re-validation, bump major |

Discipline on every change: **backup → edit → checksum → frontmatter update → commit**.

### 8.1 Authorized deviations from strict TDD-for-skills

The `superpowers:writing-skills` skill enforces a RED → GREEN → REFACTOR loop with "re-test until bulletproof". For the 2026-05-14 custom-skill build-out (5 skills: `accessibility-auditor`, `performance-engineer`, `design-system-curator`, `motion-designer`, `seo-specialist`), the owner authorized **path C — RED + write + 1 GREEN verify, no REFACTOR loop**.

- Rationale: pilot on `accessibility-auditor` showed full TDD produced 3 persistent subagent-discovery loopholes after 1 refactor cycle. Iterating to "bulletproof" was estimated at 5–6 hours additional time for 4 remaining skills with non-guaranteed convergence.
- Tradeoff: skills may have minor blind spots when invoked by subagents (vs. direct sessions where they perform reliably). Acceptable for this initiative because (a) the skills are demonstrably +50–100% audit quality even with minor loopholes, and (b) post-deployment audit failures will surface specific gaps to refactor against.
- Logged here so future charter reviews see the deviation deliberately, not as an accident.

---

## 9 · DOCUMENT CONTROL

- Canonical path: `/Users/cavslee/Projects/JAG/01_website/CLAUDE.md`
- Backup pattern: `CLAUDE.md.backup-YYYYMMDD-HHMMSS` (filesystem) or git commit
- Version increment: PATCH (typo) · MINOR (rule added / refined) · MAJOR (structural)
- Cross-references: `README.md`, `docs/superpowers/specs/`, `docs/superpowers/plans/`, `.claude/settings.json`

---

## 10 · DESIGN-INTENT NORTH STAR

```
Project       : JAG Cybersecurity (Jetson-AI-Guard) — Phase 1 marketing site
Audience      : NVIDIA Inception reviewers · sovereign-AI investors · enterprise cybersecurity buyers (SEA-first)
Brand voice   : confident · technical · restrained · sovereign
Visual lane   : dark editorial / cyber-restrained — deep navy field, cyan signal accents, monospace pulses
Tone for copy : plainspoken-technical; specific over superlative; evidence over adjectives
Anti-patterns : no bootstrap defaults · no stock illustrations · no AI-grey gradients · no glassmorphism ·
                no framer-motion in the hot path · no light mode · no decorative emoji ·
                no side-tab cards · no nested cards · no rounded gradient icon-tiles ·
                no hero-metric template · no identical card grids  (full harvested list → §10.2)
Reference work: (to be appended by owner — placeholder)
```

This block is the design contract. Every visual decision must reconcile with it or justify deviation.

### 10.1 Confirmed operating defaults (2026-05-14)

- **Budget posture: LEAN.** Runtime dependencies are kept at the current count (5). New `dependencies` require written justification. `devDependencies` are added only when they verify a charter benchmark or directly enable a Phase 1.5 deliverable.
- **MCP servers: OPEN.** Third-party MCP servers may be used (e.g. `context7`, `playwright`) when they add evidence-grade value. No MCP that mutates project state without an audit trail.
- **Skill registry: STABLE.** No new skills are created without an owner-approved gap analysis (see §5).

### 10.2 Harvested anti-pattern catalogue *(2026-05-15 — Impeccable skill, `pbakaus/impeccable`)*

Extends the §10 anti-pattern line. The Impeccable catalogue was diffed against this charter; only the non-conflicting items are adopted. Apply during `frontend-design` and `design-system-curator` reviews.

**Adopted — AI "tells" to avoid:**
- `side-tab` — thick coloured stripe down one side of a rounded card ("the single most recognisable tell of AI-generated UI")
- `border-accent-on-rounded` — thick coloured border fighting a large radius
- `icon-tile-stack` — rounded gradient icon tile stacked above a heading
- `nested-cards` / cards-around-everything — group with spacing + alignment, not bordered containers
- `identical-card-grids` — the same icon + heading + text card repeated; the default AI homepage
- `hero-metric-layout` — big number / small label / three supporting stats / gradient accent
- `generic-drop-shadows` — forgettable rounded rectangle + soft shadow; commit to a real treatment
- `sparkline-decoration` — tiny charts that look sophisticated but carry no information

**Adopted — typography & layout discipline:**
- `overused-font` (Inter / Arial / system default as the whole identity), `single-font`, `flat-type-hierarchy`
- `all-caps-body`, `tight-leading`, `justified-text`, `tiny-text` (<~11 px), `wide-tracking` on body copy, `line-length` >~75 ch, `cramped-padding`
- `everything-centered` layouts, `monotonous-spacing` (no rhythm or variance)
- `every-button-primary` — build emphasis hierarchy with ghost / secondary / text styles
- `redundant-headers` — intros that restate the heading; `mobile-amputation` — adapt features to mobile, never strip them

**REJECTED — Impeccable flags these as "slop"; on JAG they are deliberate brand decisions. No audit — ours or a tool's — may flag them:**

| Impeccable rule | Why it does not apply to JAG |
|---|---|
| `dark-mode-default` ("retreating from a decision") | Dark mode is the *sovereign-AI cybersecurity* brand decision, not a default — §3.1, §10 North Star |
| `monospace-as-technical` ("lazy stereotype") | "Monospace pulses" is a named brand element — §10 North Star |
| `dark-glow` ("cyberpunk-by-default slop") | "Deep navy field, cyan signal accents" is the defined visual lane — §10 North Star |

The lesson: a generic taste skill cannot distinguish an intentional brand choice from a lazy default. This is the standing rationale for the §10.1 *"Skill registry: STABLE"* posture — harvest external taste skills into this charter; do not install them.

---

## 11 · PROJECT QUICK-CONTEXT (read once, then refer back)

### High-level architecture

Single-route Next.js 14 App Router site (`app/page.tsx` is the only marketing page; `app/layout.tsx` mounts metadata, fonts, the `Navigation` and `Footer`). The page composes section components from `components/sections/` in narrative order: Hero → Threats → Solution → Pipeline → Technology → Markets → Founder → Contact. All sections pull copy from `lib/content.ts` (the single source of truth for marketing strings) and visuals from Tailwind tokens defined in `tailwind.config.ts`.

Output is a fully static export (`output: 'export'`) deployed to Cloudflare Pages at `jag-cybersecurity.io`. There is **no Node runtime at request time** — every page is prerendered to `out/` and served from the edge. This is why `next.config.mjs` `images: { unoptimized: true }` is set and why the live security policy lives in `public/_headers`, not `next.config.mjs`'s `headers()` (which only applies in `next dev` / `next start`).

### Two-file security-header invariant

The same security policy is encoded twice, in two formats:
- `next.config.mjs` `securityHeaders` (object array — for dev)
- `public/_headers` (Cloudflare text format — for production)

These **must stay in sync by value**. A change to one without the other ships a different policy to dev and prod. Diff the directive content programmatically before any header edit.

### Animation architecture (load-bearing decision)

`components/ui/FadeInOnScroll.tsx` and `components/ui/MetricCounter.tsx` were intentionally rewritten in Phase 1 to remove `framer-motion`. The replacement uses pure CSS keyframes (`animate-fade-in-up` Tailwind utility, defined in `tailwind.config.ts`) and a native `IntersectionObserver` with a 1500 ms `setTimeout` fallback. The fallback is dual-signal and idempotent — it exists because `framer-motion`'s `useInView` failed silently in Next.js 14 SSR + React 18 Strict Mode, leaving sections permanently invisible. **Bundle impact of the refactor: −36.3 kB First Load JS, −89.3 % page-specific JS.** Rationale and verification evidence live in commit `6c2f230` and `docs/superpowers/specs/2026-04-25-fade-animation-css-refactor-design.md`. Do not reintroduce `framer-motion` on the `/` route without a written justification approved by the owner.

### Content separation

`lib/content.ts` is a typed export and the only place marketing copy lives. Sections import named string keys from it. To edit visible text: open `lib/content.ts`, change the string, save — TypeScript will flag any consumer that referenced a removed/renamed key at compile time.

### Known Phase 1 gaps (not bugs — deferred to Phase 1.5)

1. Section fade-in completes faster than perceptible — polish deferred.
2. JAG logo is the literal text "JAG." — image integration deferred.
3. Founder photo is a "K" placeholder.
4. OG (Open Graph) social-sharing image not generated.
5. Compliance badges are plain text rectangles.
6. `framer-motion` is still in `package.json` (`^11.18.2`) but not imported on the `/` route — Phase 1.5 will either uninstall it or document an audited reintroduction.

### Reference paths

- `README.md` — full project README, the authoritative narrative source for everything in this section
- `docs/superpowers/specs/` — architectural specs and amendment logs
- `docs/superpowers/plans/` — implementation plans
- `.claude/settings.json` — inverted-permission allowlist for this project

### Known security advisories (2026-05-14 snapshot — for owner triage, NOT auto-fix)

`npm audit` reports 9 advisories after the Phase 1.5 dev-tooling install. None warrants `npm audit fix --force` — that would upgrade Next.js 14 → 16 (major-major) and invalidate the architecture decisions in this charter.

**Pre-existing in `next@14.2.35` (latent before install)**
- Aggregate Next.js advisories (high) and `postcss <8.5.10` XSS (moderate). **Most do not apply to this project at runtime** because static export disables Image Optimizer, Middleware, Server Components, App Router runtime, CSP nonces, and `beforeInteractive` script flows. The remaining residual risk is build-host only (local + Cloudflare Pages build env).
- Remediation path requires owner approval: either pin patched 14.2.x point releases as they appear, or undertake a planned Next 14 → 16 migration as a Phase 2 initiative.

**Introduced by Phase 1.5 dev tooling (build-time only, non-shipping)**
- `glob 10.2.0–10.4.5` (high) — command injection via `-c/--cmd` flag, applies only to the glob *CLI* with user-provided shell args; library use unaffected. Comes in via `@next/eslint-plugin-next`.
- `tmp <=0.2.3` (low/moderate) — arbitrary write via symlink, used by `@lhci/cli`'s `inquirer` prompts; only triggered in interactive lhci flows.

**Owner action items**: triage at next monthly charter review (§8). Track upstream patches for `@lhci/cli` and `eslint-config-next` releases; revisit Next.js major upgrade as a deliberate Phase 2 sprint.

---

*End of Charter v1.2 — JAG Cybersecurity Website Edition.*
