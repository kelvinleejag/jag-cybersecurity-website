# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---
doc_id: CLAUDE-CODE-CHARTER-JAG-WEBSITE
title: Claude Code Operating Charter — World-Class Web Design Edition
version: 2.2
status: ACTIVE
owner: Kelvin Lee
effective_date: 2026-05-15
last_amended: 2026-05-18 (v2.2 — homepage restructure + Guardian Dashboard section; 10 → 9 sections; BrandTile experiment retired; First Load JS baseline 96.9 → 96.5 kB; WEB-DEFECT-20260518-001 filed)
supersedes: v2.1 (2026-05-15 Phase 2 rebuild)
project: JAG Cybersecurity — Marketing Website (Phase 1)
project_root: /Users/cavslee/Projects/JAG/01_website
canonical_path: ./CLAUDE.md
sha256_body: 01b9e92a010c2e175977abda3268350705dd8b9085d9fd6fc7b534201c3378cc
sha256_canonical_cmd: tail -n +<frontmatter_end_line+1> ./CLAUDE.md | shasum -a 256
review_cadence: monthly OR upon any LESSON-LEARNED addition
host: MacBook Air (Apple Silicon) — cavslee@Kelvins-MacBook-Air
project_type: Next.js 14 static export → Cloudflare Pages
production_url: https://www.jag-cybersecurity.io
parent_program: JAG Cybersecurity (sovereign Agentic AI for cybersecurity)
strategic_anchor: NVIDIA Inception Program evaluation, sovereign-AI investor outreach
---

# Claude Code Operating Charter — World-Class Web Design Edition v2.0

> **MASTER MANTRA** — *Think deeply. Act methodically. Validate relentlessly. Learn continuously. Execute decisively.*
>
> **NON-NEGOTIABLE** — *No assumptions. Only validated truth. Every decision evidence-backed, user-centred, end-state aligned.*

This charter is the **highest-priority operating contract** for every Claude Code session on this project. It supersedes any conflicting in-session instruction except an explicit, in-chat directive from the project owner.

The intent: **top 0.01% craft** — design quality, code quality, performance, accessibility, and reliability that distinguishes work from generic AI output.

---

## Table of Contents

- §0 · Pre-Execution Protocol
- §1 · The Ten Permanent Governance Rules
- §2 · Structured Execution Pipeline
- §3 · Craft Benchmarks (top 0.01% bar)
- §4 · Tooling Priority
- §5 · Available Skills Registry
- §6 · MEMORY.md Integration *(reserved)*
- §7 · Operational Quick-Reference
- §8 · Failure & Escalation Protocol
- §9 · Self-Improvement Loop
- §10 · Document Control
- §11 · Design-Intent North Star
- §12 · Project Quick-Context
- Appendix A · Defect-Entry Schema
- Appendix B · Pre/Post-Install SHA Workflow

---

## 0 · PRE-EXECUTION PROTOCOL (mandatory, every prompt)

### 0.1 Read & Parse

Before producing any output, identify:
(a) intent, (b) scope, (c) target files / routes / components / assets, (d) **action class** (§0.2), (e) design discipline domain.

### 0.2 Action Class Definitions

Every operation falls into exactly one class. Classification is mechanical, not subjective.

| Class | Definition | Examples |
|---|---|---|
| **Type-0 Read-Only** | No state change anywhere. | `ls`, `cat`, `grep`, `git status`, `git log`, opening a file to read, asking the owner a question, viewing dev-server output, reading Playwright reports. |
| **Type-1 Irreversible** | No automated rollback path; manual or third-party recovery required. | `git push --force`, deploy to Cloudflare Pages production, `npm publish`, sending a webhook, deleting a remote branch, removing a DNS record on `jag-cybersecurity.io`, posting to social media. |
| **Type-2 Reversible** | Documented automated rollback (backup / git revert / re-deploy previous). | File edit paired with git commit, local `npm run dev` restart, `npm install <pkg>` (counter: `npm uninstall`), Cloudflare Pages preview deploy, design-token change, content edit. |

When in doubt between Type-1 and Type-2, classify as Type-1 (the stricter discipline).

### 0.3 Coordination Block (Tiered)

Open every response with a coordination signal. The form is mechanical based on action class.

**ABBREVIATED form** — for Type-0 read-only AND pure clarification questions:

```
Coord: <skill-list, or NONE — owned task: <name>>
```

(One line, ≤140 chars.)

**Exception — ABBREVIATED is FORBIDDEN even for Type-0 reads** on these audit-sensitive paths (use FULL block):
- `.env`, `.env.local`, `.env.production`, or any file containing API keys / tokens / secrets
- `~/.ssh/`, `~/.aws/`, `~/.npmrc` (if it contains auth tokens), `~/.docker/config.json`
- `package-lock.json` *immediately before* a publish or production deploy
- `.claude/settings.json` *immediately before* an edit (config governs permission boundaries)
- Cloudflare API credentials, deploy tokens (wherever stored)
- Any file containing PII or user analytics data

**FULL form** — for any Type-1 or Type-2 action, multi-skill coordination, any prompt requesting code / config / asset / content mutations, OR any audit-sensitive Type-0 read:

```
═══════════════════════════════════════════════════════════
TEAM COORDINATION (pre-execution declaration)
───────────────────────────────────────────────────────────
Skills invoked      : <comma-separated list, or "NONE — owned task: <name>">
Plugins/agents      : <comma-separated list, or "NONE">
Primary role        : <skill name> — <responsibility>
Supporting roles    : <skill name> — <responsibility>; ...
Sync model          : <sequential | parallel | majority-consensus>
Design intent       : <one-phrase visual direction tied to §11 North Star>
Action class        : <Type-0 | Type-1 | Type-2>
Pre-flight status   : <PASS — proceeding | HOLD — clarification needed>
═══════════════════════════════════════════════════════════
```

**Missing or malformed coordination block = governance violation.**

### 0.4 Routing Matrix

| Skill match | Action |
|---|---|
| Exactly one | Invoke it; declare as Primary. |
| Multiple, non-conflicting | Invoke all; declare Primary by **scope-closest match (owner-judgment read of which skill's `description` most directly addresses the prompt's core intent)**; others Supporting; sync = parallel. |
| Multiple, conflicting | (1) Pick scope-closest by owner-judgment read; (2) if genuinely tied → **invoke all tied skills in parallel and present each perspective explicitly labeled**, then let the owner disambiguate. **Never break a true tie with mtime, alphabetical sort, or majority vote — surface the tie honestly.** |
| Zero matches (non-owned task) | Notify owner: *"no existing skill matches — propose creating skill `<name>` for `<purpose>`"*; await acknowledgment. |
| Zero matches (owned task, §0.5) | Execute directly; declare `Skills invoked: NONE — owned task: <name>`. |
| Skill registry entry tagged `[PLANNED]` | Treat as non-existent for routing; do not invoke. |

### 0.5 Owned-Task Carve-Outs

| Owned Task | Scope | Authority basis |
|---|---|---|
| Charter / governance doc management | Edit `CLAUDE.md`, design-system docs, `.claude/MEMORY.md`; timestamped backup, frontmatter integrity, index sync. | Owner directive |
| Trivial read-only verification | `ls`, `cat`, `grep`, `git status`, `git log` — strictly no state change, strictly non-audit-sensitive paths (see §0.3 exception). | Operational efficiency |
| Pure clarification questions | Asking the owner a question with no side effects. | ASK-BEFORE-ACTING (§1.5) |
| Local dev-server lifecycle | `npm run dev` start/stop on localhost — local only, no deploy. | Operational efficiency |

---

## 1 · THE TEN PERMANENT GOVERNANCE RULES

### 1.1 SKILL-FIRST
Every prompt → best-matched skill(s) invoked → declared in coordination header (§0.3). No silent execution.

### 1.2 BACKUP-FIRST (Type-1 and Type-2 only)
Every file edit preceded by a verifiable rollback path:

- **L1 (preferred):** git commit on a working branch — `git add -A && git commit -m "snapshot: pre_<tag>"`. Acceptable shortcut: `git stash push -m "pre_<tag>"`. Rationale: fast same-session rollback via `git reset --hard HEAD~1`.
- **L2 (project convention):** `<file>.backup-YYYYMMDD-HHMMSS` filesystem copy beside the original (see `app/page.tsx.backup-20260425-163522`, `tailwind.config.ts.backup-*`, etc.). Rationale: durable record surviving branch deletion, rebase, force-push. Continue this pattern; do not delete prior backups without explicit owner approval.

Backup verified to exist **before** any mutation. Rollback procedure documented in the same response. No exceptions, including for "one-line fixes."

### 1.3 FIX-OR-FILE
When a new bug or design debt is discovered mid-task:

- **In-scope AND cheap** → fix in same diff. Document in the same response.
- **Out-of-scope OR expensive** → file a `WEB-DEFECT-YYYYMMDD-NNN` entry (Appendix A), schedule to a wave (Hotfix / Pre-launch / Design-debt / Backlog), resume original task.

Principle: **never silently ignore.**

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

Non-compliant designs **rejected or redesigned** before implementation.

### 1.5 ASK-BEFORE-ACTING
Ask before acting when **any** of the following is unresolved:

1. **Target environment** (local dev / Cloudflare preview / Cloudflare production) not explicit.
2. **Action class** is Type-1 (irreversible).
3. **Output path** or destination not specified — including which component file, which route, which design token.
4. **Two or more skills** give conflicting guidance (per §0.4).
5. **Operation crosses** a previously-undocumented boundary (new dependency, new route, new env var, new external service, new domain).
6. **Destructive verb directed at the action I'm about to take** — `delete`, `drop`, `remove`, `rm`, `force-push`, `revert`, `decommission`, `unpublish`, `purge`, `destroy`, `revoke`, `expire`, `wipe` (case-insensitive). Confirm exact target and intent before execution. *Narrative use* of these verbs in prose ("delete the duplicate string") does not trigger §1.5; only verbs that name the operation I am about to perform.
7. **Design ambiguity** — brand voice, visual direction, target audience, or content stance not specified or contradicted by §11 North Star.

§1.5 applies to **Type-1 and Type-2 actions only**. Type-0 read-only operations are exempt — except for audit-sensitive Type-0 reads per §0.3, which still require the FULL coordination block but do not invoke §1.5.

### 1.6 AUDIT-EXISTING-FIRST
Before creating any new component / route / utility / token / asset, audit existing:
1. **Use as-is** (preferred), or
2. **Refine / extend / compose**, or
3. **Replace** (justified in writing).

Default assumption: existing artifacts were designed by prior sessions and likely function correctly.

**Project-specific conventions:**
- All marketing copy belongs in `lib/content.ts` — never inline new strings in section components.
- All colour, type, spacing, shadow, breakpoint values belong in `tailwind.config.ts` `theme.extend` — never hard-code hex, px, or rem values in components.
- Reusable primitives live in `components/ui/` (Container, SectionHeader, Card, FadeInOnScroll, MetricCounter). Audit these before creating a new primitive.

### 1.7 CRAFT-OVER-SCHEDULE
Launch dates (NVIDIA Inception submission, investor demos) **do not** justify generic-AI output, accessibility shortcuts, or skipped validation. If correct craft takes longer, the timeline adjusts.

**Escape valve** for tactical hotfixes:
(a) `WEB-DEFECT` entry for craft follow-up (Appendix A);
(b) Named owner + target wave for the craft fix;
(c) Explicit deferral acknowledgment in same response;
(d) **Maximum deferral window: ≤2 sprints OR ≤30 calendar days, whichever shorter.** Otherwise the hotfix is **not permitted** — redesign.

### 1.8 HANDOFF DOC STRUCTURE
A handoff document is required when **any** of:
(a) Current chat reaches >75% of context window;
(b) Owner explicitly requests handoff;
(c) A multi-day initiative spans chat sessions.

Handoff docs must cover:
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

Every non-trivial task flows through these phases. Skipping is a governance violation.

```
Phase 1 — DEFINE        Problem statement · constraints (browser support, perf budget, brand) · success criteria
Phase 2 — HYPOTHESIZE   ≥2 design / implementation paths · rank by craft, perf, accessibility, effort · action class
Phase 3 — PLAN          Atomic steps · inputs / outputs / validation method per step
Phase 4 — IMPLEMENT     Smallest viable unit · backup verified · component-first, no large untested changes
Phase 5 — VALIDATE      Visual review (light + dark, mobile + desktop) · responsive review · a11y audit
                        (axe + Lighthouse + manual keyboard pass) · perf check · unit + e2e tests.
                        REQUIREMENT: the production build (`npm run build && npx serve out -p 3001`)
                        is mandatory before declaring any visual work complete. `next dev` and the
                        static export differ in CSP enforcement, hydration timing, and bundle
                        composition. The canonical reminder is commit 81fb7f8: a fix that passed
                        dev shipped broken to production. Localhost-on-M-series-Mac is also ~10×
                        faster than mid-tier mobile; run Lighthouse with mobile throttle profile
                        before declaring perf complete.
Phase 6 — ANALYZE       Expected vs actual · root cause analysis on any deviation
Phase 7 — ITERATE/SCALE Polish OR ship · update design system, component docs, changelog
```

**Validation evidence required**: screenshots (light + dark, mobile + desktop), Lighthouse scores, axe report, type-check + lint output, test results — captured in same response or linked from commit.

---

## 3 · CRAFT BENCHMARKS (top 0.01% bar)

A response is not complete unless these are satisfied for the work in scope.

### 3.1 Visual & Layout
- Type scale defined (modular scale, fluid `clamp()`), not arbitrary px values
- Spacing on a consistent scale (4/8 px system or design tokens)
- Colour system uses tokens with semantic names (`bg-elevated`, `accent`, `text-secondary`) — never raw hex
- Dark mode is the **only** mode for this project (sovereign-AI cybersecurity aesthetic). No light-mode toggle.
- No bootstrap-default look; intentional layout decisions justified

### 3.2 Interaction & Motion
- Every interactive element has hover / focus-visible / active / disabled states
- Microinteractions <300ms, with easing functions chosen, not default
- Reduced-motion media query honoured (already wired in `app/globals.css`)
- Focus order matches visual order
- **Motion library policy:** the homepage components have been deliberately stripped of `framer-motion` — see §12 reference list. Do not reintroduce `framer-motion` on the `/` route without explicit owner approval and bundle-size justification.

#### 3.2.1 Animation craft standard *(harvested 2026-05-15 — Emil Kowalski design-engineering skill; per §9.2 harvest pattern)*

**Decision gate — answer in order before writing any animation:**
1. *Should this animate at all?* Frequency decides. 100+×/day (keyboard shortcuts, command toggle) → never animate. Tens of ×/day (hover, list nav) → reduce or remove. Occasional (modal, drawer, toast) → standard animation. Rare / first-time (onboarding, celebration) → delight allowed. **Never animate keyboard-initiated actions** — they repeat hundreds of times daily; motion makes them feel slow.
2. *What is the purpose?* Valid purposes: spatial consistency, state indication, explanation, feedback, preventing a jarring change. "It looks cool" + seen often → do not animate.
3. *What easing?* Entering / exiting → `ease-out`. Moving or morphing on-screen → `ease-in-out`. Hover / colour change → `ease`. Constant motion (marquee, progress) → `linear`. **Never `ease-in` on UI** — it delays the moment the user is watching most. Use strong custom cubic-bezier curves, not the weak CSS built-ins.
4. *How fast?* Button press 100–160 ms · tooltip / small popover 125–200 ms · dropdown / select 150–250 ms · modal / drawer 200–500 ms. UI animations stay <300 ms (already the §3.2 rule).

**Technique rules:**
- Pressable elements get `transform: scale(0.97)` on `:active` — instant "the UI heard you" feedback.
- Never animate from `scale(0)` — nothing in the real world appears from nothing. Start `scale(0.95)` + `opacity: 0`.
- Popovers scale from their trigger (`transform-origin` set to the trigger), not from centre. Modals are the exception — they stay centred.
- Only animate `transform` and `opacity` — they skip layout + paint and run on the GPU. Animating `width` / `height` / `margin` / `padding` triggers all three.
- Exit faster than enter. Gate hover effects behind `@media (hover: hover) and (pointer: fine)`. Stagger list entries 30–80 ms apart.
- `prefers-reduced-motion` means *fewer and gentler*, not zero — keep opacity / colour transitions that aid comprehension, drop movement.

**Keyframes-vs-transitions note (project-specific):** the source skill prefers CSS *transitions* over *keyframes* for rapidly re-triggered UI (keyframes restart from zero on interrupt). This does **not** contradict `FadeInOnScroll`, which uses CSS keyframes deliberately — it is a one-shot scroll reveal, never rapidly re-triggered, so keyframes are correct there. Do not "fix" it. The skill's broader conclusion — *CSS animations run off the main thread; JS motion libraries drop frames under load* — independently confirms the commit `6c2f230` framer-motion removal (§12). *(MetricCounter, the original sibling component built on the same pattern, was deleted in v2.2 alongside ProofBar — see §12.)*

### 3.3 Accessibility (WCAG 2.2 AA minimum)
- Semantic HTML first; ARIA only where needed
- Colour contrast ≥4.5:1 body / ≥3:1 large or UI (**critical for dark theme** — light grey on near-black often fails; verify with axe)
- Keyboard-only navigation works end-to-end
- Screen-reader labels for icons (`lucide-react` icons need `aria-label` or `aria-hidden`), form controls, landmark roles
- `prefers-reduced-motion`, `prefers-color-scheme` respected

### 3.4 Performance Budgets
- LCP <2.5s · INP <200ms · CLS <0.1 on mid-tier mobile (4G throttle)
- **Project baseline (do not regress):** First Load JS for `/` is 96.5 kB; page-specific JS is 3.98 kB (post-v2.2 baseline; 2026-05-18). Any change pushing First Load JS above 100 kB requires written justification.
- Initial JS bundle <170 kB gzipped per route (project current is well under)
- **JAG-specific Lighthouse SLA: Performance / A11y / Best-Practices / SEO ≥95** — enforced by `@lhci/cli` (`lighthouserc.json`). Lighthouse Performance <95 is a §8 hard-stop for production deploy.
- Image strategy: responsive `srcset`, modern formats (AVIF/WebP), lazy below fold. Note `next.config.mjs` sets `images: { unoptimized: true }` because of static export — handle responsiveness manually.
- Fonts: `font-display: swap`, subset, preloaded if critical
- No layout-shifting late-loaded content

### 3.5 Code Quality
- Type-safe (TypeScript strict — already enabled in `tsconfig.json`)
- Lint-clean, formatter-clean
- Components composable, props typed, no `any` leaks
- No magic numbers; tokens / constants named (use `tailwind.config.ts` and `lib/content.ts`)
- Tested at appropriate level (unit for logic, e2e for flows) — Playwright + axe wired in `tests/`; full pre-merge gate in §7.

### 3.6 SEO & Semantics
- One `<h1>` per page; heading order intact
- `<title>`, meta description, OG / Twitter cards (OG image is a known Phase 1.5 gap — see §12)
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
| Diff before commit | `git diff --stat && git diff` — never blind-commit |
| Verify file ownership / mode | `stat -f '%Su:%Sg %Lp %N' <file>` *(macOS BSD stat)* |
| Real-mobile perf check | Lighthouse with mobile throttle profile, or Safari Web Inspector connected to iPhone via USB |
| Design-token usage | `rg "color:|background:|border:" components/ app/` for hex/rgb literals — detects token bypass |

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

These skills were built via TDD pilot (full RED → GREEN → REFACTOR for `accessibility-auditor`; path-C RED + 1 GREEN verify for the other four — see §9.4 for the authorized deviation). All skills surface relevant evidence requirements, project-specific commands, and red-flag STOP conditions.

---

## 6 · MEMORY.md INTEGRATION *(reserved)*

Reserved for the protocol governing `.claude/MEMORY.md` once that file is adopted. Tracked by `WEB-TASK-20260515-D` in §12. Until then: do not rely on or cite a `.claude/MEMORY.md` file in this project — it does not yet exist. This section will be authored at adoption time so the protocol matches the actual artifact.

---

## 7 · OPERATIONAL QUICK-REFERENCE

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

## 8 · FAILURE & ESCALATION PROTOCOL

| Failure mode | Response |
|---|---|
| Skill invocation fails | Re-attempt once with corrected parameters. On second failure → notify owner with diagnostic. |
| Skills produce contradictory output | Apply §0.4 tiebreaker — scope-closest first; true tie → invoke all in parallel and present each perspective labeled. |
| Build / typecheck / lint fails | **Hard stop.** Fix before further changes. |
| Backup not verifiable | **Hard stop.** Do not proceed with edits. |
| Accessibility regression | **Hard stop.** Roll back. Redesign. |
| Performance budget breach (First Load JS > 100 kB on `/`) | **Hard stop.** Investigate before merge. |
| **Lighthouse score <95 on any of Perf / A11y / BP / SEO** | **Hard stop** for production deploy. Lower scores acceptable on dev branches only. |
| `next.config.mjs` and `public/_headers` drift | **Hard stop.** Reconcile by value, not by eye. |
| §1.5 ASK-BEFORE-ACTING trigger fires | Ask owner. Do not infer past trigger. |
| PLANNED skill / artifact is routing match | Notify owner; proceed with closest ACTIVE skill OR ask. |
| Body SHA verification fails (Appendix B) | **Hard stop.** Charter install NOT complete. Re-stage and retry. |
| Secret accidentally committed | **Hard stop.** Rotate first (Type-1 operation); history rewrite as separate confirmed operation. |
| Output exhibits generic-AI tell (§11 / §11.2) | Self-scan once before final response; if §11.2 anti-pattern present, rewrite once. **Two consecutive rejections → escalate to owner**, do not loop further. |
| Runtime dependency added without justification | **Hard stop.** Uninstall. File defect. |

---

## 9 · SELF-IMPROVEMENT LOOP

This charter is a **living document**.

### 9.1 Addition Triggers

| Trigger | Action |
|---|---|
| New LESSON-LEARNED | Append to §1 (rule), §3 (benchmark), or §4 (tooling) within 24h |
| New skill added | Update §5 registry same session |
| New owned task | Update §0.5 with authority basis |
| External skill harvest | Follow §9.2 procedure |
| Monthly | Diff vs prior version, justify, bump minor |
| Annual / major redesign | Full re-validation, bump major |

Discipline on every change: **backup → edit → checksum → frontmatter update → commit**.

### 9.2 External-Skill Harvest Pattern

External taste / craft skills (e.g. Emil Kowalski's design-engineering skill, `pbakaus/impeccable`) often encode valuable knowledge that does not justify installing the whole skill (per §11.1: "Skill registry: STABLE"). The harvest pattern extracts non-conflicting items into this charter while explicitly documenting rejections with rationale.

**Procedure — every harvest follows these five phases:**

#### Phase H1 — SOURCE
- Identify the external skill / catalogue / guide.
- Record provenance: author, URL or repo, version / commit SHA if versioned, date of harvest.
- Read the source in full. Skim-harvests produce contamination.

#### Phase H2 — DIFF
For each rule / claim / heuristic in the source, classify as:
- **ALREADY-COVERED** — this charter already says it (cite §).
- **NEW-ADOPT** — adds genuine value, does not conflict with charter.
- **NEW-REJECT** — conflicts with a deliberate charter decision (brand, architecture, audience). Reject with rationale.
- **DEFER** — interesting but not actionable for this project right now; park in `MEMORY.md` under "Harvest backlog" once §6 is live.

#### Phase H3 — REJECT WITH RATIONALE *(load-bearing step)*
Every NEW-REJECT item gets a one-row entry in the harvested section:

| External rule | Why it does not apply to this project |

The rejection table is the antibody against future audits flagging deliberate brand choices as "slop". Without it, harvested content can erase project identity over time.

#### Phase H4 — ADOPT WITH ATTRIBUTION
- Adopted items added to the relevant charter section (§3.x for craft, §11 for design intent, §4 for tooling, §1 for governance rules).
- Provenance line: *"(harvested YYYY-MM-DD — <source>; per §9.2 harvest pattern)"* at section head.
- If an adopted rule already echoed a charter rule, keep ours and cite the source as corroborating evidence.

#### Phase H5 — VERSION BUMP & LOG
- MINOR version bump (harvest adds rules / refines existing).
- Changelog entry naming the source and the sections touched.
- `MEMORY.md` entry under "Harvest log" with: date, source, adopted-count, rejected-count, deferred-count *(once §6 is live; until then, log in commit message)*.

**Discipline rules:**
- *Harvest into the charter; do not install the source skill.* See §11.1 STABLE posture. A skill installed runs every session and cannot distinguish brand choice from default. Harvested content becomes our governance, not a vendor's.
- *Reject loudly, not quietly.* Silent rejections cause the same item to be re-proposed at every future harvest. The §11.2 REJECTED table is a forcing function against that drift.
- *Provenance survives even after the source disappears.* If the external skill is later renamed, deleted, or abandoned, the harvested content remains attributable and reviewable.
- *One harvest per session, maximum.* Harvest work requires focused judgment on each rule. Batching multiple harvests in one session produces contamination — items get adopted from one source and rejected from another for inconsistent reasons.

**Worked examples (the canonical references):**
- §3.2.1 Animation Craft Standard — Emil Kowalski design-engineering skill, harvested 2026-05-15. Adopted: decision gate, easing rules, duration table, technique rules. Rejected: none. Reconciled: keyframes-vs-transitions note defending `FadeInOnScroll`.
- §11.2 Harvested Anti-Pattern Catalogue — `pbakaus/impeccable`, harvested 2026-05-15. Adopted: 8 AI-tell items, ~13 typography/layout items. Rejected: 3 (`dark-mode-default`, `monospace-as-technical`, `dark-glow` — all explicit JAG brand decisions per §11).

### 9.3 Retirement Procedure (Rules / Principles Proven Wrong)

A rule or principle may be retired only when:
(a) Evidence the rule is wrong or obsolete is documented (a LESSON-LEARNED citing the inversion);
(b) MINOR version bump with explicit "retired §X.Y" note in the changelog;
(c) One-line entry added to `MEMORY.md` under "Retired charter rules" index *(once §6 is live; until then, the changelog entry is the canonical record)*.

### 9.4 Authorized Deviations from strict TDD-for-skills *(historical record)*

The `superpowers:writing-skills` skill enforces a RED → GREEN → REFACTOR loop with "re-test until bulletproof". For the 2026-05-14 custom-skill build-out (5 skills: `accessibility-auditor`, `performance-engineer`, `design-system-curator`, `motion-designer`, `seo-specialist`), the owner authorized **path C — RED + write + 1 GREEN verify, no REFACTOR loop**.

- Rationale: pilot on `accessibility-auditor` showed full TDD produced 3 persistent subagent-discovery loopholes after 1 refactor cycle. Iterating to "bulletproof" was estimated at 5–6 hours additional time for 4 remaining skills with non-guaranteed convergence.
- Tradeoff: skills may have minor blind spots when invoked by subagents (vs. direct sessions where they perform reliably). Acceptable for this initiative because (a) the skills are demonstrably +50–100% audit quality even with minor loopholes, and (b) post-deployment audit failures will surface specific gaps to refactor against.
- Logged here so future charter reviews see the deviation deliberately, not as an accident.

---

## 10 · DOCUMENT CONTROL

- **Canonical path:** `/Users/cavslee/Projects/JAG/01_website/CLAUDE.md`
- **Backup pattern:** `CLAUDE.md.backup-YYYYMMDD-HHMMSS` (filesystem) AND git commit
- **Version increment rules:**
  - **PATCH** (e.g. 2.0.0 → 2.0.1) — typo, clarification, link fix.
  - **MINOR** (e.g. 2.0 → 2.1) — rule/principle added, refined, retired; harvest.
  - **MAJOR** (e.g. 2.x → 3.0) — structural change to §0 routing or section taxonomy.
- **SHA workflow:** see Appendix B. The frontmatter `sha256_body` field self-attests the charter's body content. Body SHA recompute on every install; mismatch is a §8 hard-stop.
- **Cross-references:** `README.md`, `docs/superpowers/specs/`, `docs/superpowers/plans/`, `.claude/settings.json`, `package.json`, `tailwind.config.ts`, `next.config.mjs`, `public/_headers`.

---

## 11 · DESIGN-INTENT NORTH STAR

```
Project        : JAG Cybersecurity (Jetson-AI-Guard) — Phase 1 marketing site
Production URL : https://www.jag-cybersecurity.io
Tagline        : Sovereign Agentic AI cybersecurity. Zero cloud. Zero exfiltration. Zero trust.

Audience       : (1) NVIDIA Inception evaluators — technical credibility, defensible IP,
                  GPU-native architecture, commercial viability.
                 (2) Sovereign / data-sensitive enterprise buyers — government, defence,
                  critical infrastructure, regulated industries. Proof, not promises.
                 (3) Venture capital — founder credibility, market timing, moat, exit.
                 (4) Technical practitioners (CISOs, security architects) — fine-print
                  readers who respect technical honesty over marketing language.

Brand voice    : Confident, technical, restrained, sovereign. Engineered, not marketed.
                 Specific over abstract. Evidence over claims. The voice of someone
                 who has shipped, not someone selling a vision.

Visual lane    : Dark editorial / cyber-restrained — deep navy field, cyan signal
                 accents, monospace pulses. Closer to Linear / Vercel / Palantir
                 than typical AI-startup gradient-soup. Closer to a defence-industry
                 annual report than a SaaS landing page.

                 Inspiration references (the bar):
                 - linear.app (precision, type discipline, restraint)
                 - vercel.com (minimal chrome, content-forward, density done right)
                 - palantir.com (institutional gravitas without bombast)
                 - anthropic.com (the calm restraint of serious AI)

Tone for copy  : Plainspoken-technical. Specific numbers (10/10 attack types blocked,
                 5-second time-to-block, 96.6% hallucination detection rate, 6 patents
                 / 113 claims). No exclamation marks. No "leverage." No "revolutionary."

Motion stance  : Minimal & functional. CSS keyframes only (framer-motion removed by
                 architecture decision — see §12 commit 6c2f230). Microinteractions
                 that confirm action or guide focus. No decorative motion. No parallax.
                 No scroll-jacking. The site moves like an instrument, not a showreel.
                 Animation craft standard: §3.2.1.

Imagery stance : Real, specific, evidence-bearing.
                 - Real JAG logo (Phase 1.5 deliverable)
                 - Real founder photo (Phase 1.5 deliverable) — not stock, not AI-generated
                 - Real architecture diagrams, real dashboard screenshots, real hardware
                 No stock photography. No AI-generated imagery. No abstract gradient art.

JAG-original anti-patterns: (explicitly forbidden — see §11.2 for harvested catalogue)
                 - Bootstrap defaults
                 - Stock illustrations
                 - AI-grey gradients
                 - Glassmorphism
                 - Framer-motion in the hot path
                 - Light mode (dark-only is the brand decision, not a default — see §3.1)
                 - Decorative emoji
                 - Purple-blue-gradient hero backgrounds
                 - "Trusted by" carousels with fake or unspecific logos
                 - Generic SaaS-startup language ("leverage AI to revolutionise")
                 - Exclamation marks anywhere in copy
                 - More than one body font family
                 - More than one accent colour

Open decisions : RESOLVED in v2.1.
                 - Accent colour: `#22D3EE` (Tailwind cyan-400 family) — replaces the legacy `#00D9FF`.
                 - Body font: Geist Sans via the official `geist` npm package
                   (not next/font/google — Geist not exported there on Next 14.2.x).
                 - Mono font: JetBrains Mono via `next/font/google`, used for
                   eyebrow labels, step numbers, ProofBar stats, and packet-spec
                   captions.
                 Token surface: tailwind.config.ts §theme.extend.colors / fontSize
                 / letterSpacing / spacing / transitionTimingFunction / keyframes.

Reference work : (to be appended by owner — placeholder)

Success metric : The site is mistakeable for the website of an institutional security
                 vendor (Palantir, Crowdstrike, SentinelOne) by a casual visitor.
                 NVIDIA Inception evaluator reaches "this is technically serious"
                 within 5 seconds of the fold.
                 CISO finds the technical proof points (architecture, patents,
                 validated metrics) within two scrolls.
```

This block is the design contract. Every visual decision must reconcile with it or justify deviation.

### 11.1 Confirmed operating defaults (2026-05-14)

- **Budget posture: LEAN.** Runtime dependencies are kept at the current count (6 (`next`, `react`, `react-dom`, `lucide-react`, `geist` — `framer-motion` removed in v2.1)). New `dependencies` require written justification. `devDependencies` are added only when they verify a charter benchmark or directly enable a Phase 1.5 deliverable.
- **MCP servers: OPEN.** Third-party MCP servers may be used (e.g. `context7`, `playwright`) when they add evidence-grade value. No MCP that mutates project state without an audit trail.
- **Skill registry: STABLE.** No new skills are installed without an owner-approved gap analysis (see §5). External taste skills are *harvested* per §9.2, not installed.

### 11.2 Harvested anti-pattern catalogue *(harvested 2026-05-15 — pbakaus/impeccable; per §9.2 harvest pattern)*

Source: `pbakaus/impeccable`. The Impeccable catalogue was diffed against this charter; only the non-conflicting items are adopted. Apply during `frontend-design` and `design-system-curator` reviews.

**Adopted — AI "tells" to avoid:**
- `side-tab` — thick coloured stripe down one side of a rounded card ("the single most recognisable tell of AI-generated UI")
- `border-accent-on-rounded` — thick coloured border fighting a large radius
- `icon-tile-stack` — rounded gradient icon tile stacked above a heading. *Empirically confirmed for JAG (2026-05-17): the BrandTile experiment — four cyan glass-tile icons crafted with charter discipline and brand alignment — was rejected by owner local review ("the icons are unimpressive, I don't see the value"). The anti-pattern fails even when executed with intent, not just as a lazy default.*
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
| `dark-mode-default` ("retreating from a decision") | Dark mode is the *sovereign-AI cybersecurity* brand decision, not a default — §3.1, §11 North Star |
| `monospace-as-technical` ("lazy stereotype") | "Monospace pulses" is a named brand element — §11 North Star |
| `dark-glow` ("cyberpunk-by-default slop") | "Deep navy field, cyan signal accents" is the defined visual lane — §11 North Star |

The lesson: a generic taste skill cannot distinguish an intentional brand choice from a lazy default. This is the standing rationale for the §11.1 *"Skill registry: STABLE"* posture — harvest external taste skills into this charter (§9.2); do not install them.

---

## 12 · PROJECT QUICK-CONTEXT (read once, then refer back)

### High-level architecture

Single-route Next.js 14 App Router site (`app/page.tsx` is the only marketing page; `app/layout.tsx` mounts metadata, fonts, the `Navigation` and `Footer`). The page composes **9 section components** from `components/sections/` in narrative order: Hero → Threats → Solution → Architecture (combined with former FiveLayers content as of v2.2) → Dashboard → Technology → Markets → Founder → Contact. All sections pull copy from `lib/content.ts` (the single source of truth for marketing strings) and visuals from Tailwind tokens defined in `tailwind.config.ts`.

Output is a fully static export (`output: 'export'`) deployed to Cloudflare Pages at `jag-cybersecurity.io`. There is **no Node runtime at request time** — every page is prerendered to `out/` and served from the edge. This is why `next.config.mjs` `images: { unoptimized: true }` is set and why the live security policy lives in `public/_headers`, not `next.config.mjs`'s `headers()` (which only applies in `next dev` / `next start`).

### Two-file security-header invariant

The same security policy is encoded twice, in two formats:
- `next.config.mjs` `securityHeaders` (object array — for dev)
- `public/_headers` (Cloudflare text format — for production)

These **must stay in sync by value**. A change to one without the other ships a different policy to dev and prod. Diff the directive content programmatically before any header edit.

### Animation architecture (load-bearing decision)

`components/ui/FadeInOnScroll.tsx` was intentionally rewritten in Phase 1 to remove `framer-motion`. The replacement uses pure CSS keyframes (`animate-fade-in-up` Tailwind utility, defined in `tailwind.config.ts`) and a native `IntersectionObserver` with a 1500 ms `setTimeout` fallback. The fallback is dual-signal and idempotent — it exists because `framer-motion`'s `useInView` failed silently in Next.js 14 SSR + React 18 Strict Mode, leaving sections permanently invisible. **Bundle impact of the refactor: −36.3 kB First Load JS, −89.3 % page-specific JS.** Rationale and verification evidence live in commit `6c2f230` and `docs/superpowers/specs/2026-04-25-fade-animation-css-refactor-design.md`. Do not reintroduce `framer-motion` on the `/` route without a written justification approved by the owner. *(Companion `MetricCounter.tsx`, originally part of the same CSS-keyframe refactor, was deleted in v2.2 alongside ProofBar — see "v2.2 changes" below.)*

`components/ui/HeroWave.tsx` is the one canvas-rendered motion element retained on `/`. **Known performance issue:** continuous `requestAnimationFrame` while the tab is visible blocks the main thread (PSI 2026-05-18: TBT 8,100-8,400 ms; mobile Perf 53, desktop Perf 60 — vs the §3.4 ≥95 SLA). Owner accepted via §1.7 escape valve. Tracked as **`WEB-DEFECT-20260518-001`**; deadline 2026-06-17. Fix recipe documented in defect: IntersectionObserver pause-on-scroll + 30 fps throttle + reduce 80→50 lines and 55→35 particles.

### Content separation

`lib/content.ts` is a typed export and the only place marketing copy lives. Sections import named string keys from it. To edit visible text: open `lib/content.ts`, change the string, save — TypeScript will flag any consumer that referenced a removed/renamed key at compile time. Post-v2.2: the `pipeline` export, `fiveLayers` export, and `capabilities.proofBar` field are removed.

### v2.2 changes (homepage restructure + Guardian Dashboard, 2026-05-18, commits `0a7c04d..3e7f2cc`)

1. **New section: Guardian Dashboard (`components/sections/Dashboard.tsx`).** Showcases the actual JAG Guardian product UI via a chrome-framed `public/assets/guardian-dashboard.webp` plus 4 caption blocks (PIPELINE / AI ANALYST / SYSTEM HEALTH / EVIDENCE). Located between Architecture and Technology. Anchor `#dashboard`. Dashboard image enhanced with sharp filter pipeline (linear contrast + saturation boost + edge sharpening, quality 88).
2. **Architecture absorbed FiveLayers.** The section now renders both the outside view (`architecture-overview.webp` diagram showing network positioning) AND the inside view (`LayerStack` stratigraphy showing 5 defense layers within the device), plus the "A Defensible Moat by Design" closing block. Anchor `#architecture` preserved; `#five-layers` retired.
3. **Sections / components removed:** Pipeline section entirely; ProofBar stat band (from Solution); 5 LayerCard grid (from former FiveLayers); 4 BrandTile icons + 4 tile SVG components (the 2026-05-17 polish experiment — see §11.2 `icon-tile-stack` empirical confirmation).
4. **Section count: 10 → 9.**
5. **Hero CTA secondary:** "See How It Works" → "See JAG Guardian"; href `#pipeline` → `#dashboard`.
6. **Hero animation stagger** tightened from `{0, 0.2, 0.4, 0.9, 1.1, 1.3}s` to `{0, 0.05, 0.1, 0.15, 0.2}s` — eyebrow paints immediately. Aligns with §3.2.1 *"never delay the moment the user is watching most"*.
7. **Navigation:** added `#dashboard → Guardian` link (4 → 5 links); fixed pre-existing bug where the `Technology` label was hardcoded to `#pipeline` (now correctly `#technology`).
8. **Footer:** Solution column row updated `Five Layers → Guardian Dashboard`; Technology column dropped the Pipeline row (3 → 2 rows).
9. **Image optimization (cumulative across 2026-05-17 + 2026-05-18 perf passes):** all marketing images now WebP via sharp (logo, founder photo, architecture-overview, guardian-dashboard). Total payload reduced ~1.2 MB across all marketing PNG → WebP conversions. Pattern: sharp WebP quality 85 baseline; quality 88 for the contrast-enhanced dashboard.
10. **First Load JS baseline:** 96.9 kB → **96.5 kB**.

### Phase 1 + Phase 1.5 gap resolution (historical — closed by v2.1)

1. ✅ Section fade-in completes faster than perceptible — RESOLVED. FadeInOnScroll extended with `delay` prop.
2. ✅ JAG logo placeholder — RESOLVED. Real logo at `public/assets/jag-logo.webp` (WebP since v2.2 perf pass; was PNG before).
3. ✅ Founder photo placeholder — RESOLVED. Real photo at `public/assets/founder-photo.webp` (WebP since v2.2 perf pass).
4. ✅ OG image — RESOLVED. Build-time generation via `scripts/og-build.mjs` using `@vercel/og`; output at `public/og.png`, 1200×630.
5. ✅ Compliance badges restyled — RESOLVED. 11-framework pill grid in Standards (Technology.tsx); no fake certifications, caption notes formal certs in roadmap.
6. ✅ framer-motion in package.json — RESOLVED. Uninstalled in v2.1 after `rg "framer-motion" app/ components/` returned zero.

### Open defects / WEB-TASK entries

| Entry | Description | Wave / Deadline |
|---|---|---|
| `WEB-DEFECT-20260518-001` | HeroWave canvas continuous rAF blocks main thread → PSI mobile Perf 53 / desktop 60 (target ≥95 per §3.4). Fix recipe: IntersectionObserver pause-when-offscreen + 30 fps throttle + reduce 80→50 lines and 55→35 particles. Expected outcome: mobile Perf ≥90. | Pre-launch / **2026-06-17** (§1.7 30-day cap from 2026-05-18 filing) |
| `WEB-TASK-20260515-D` | Adopt `.claude/MEMORY.md` (per §6) — currently reserved | When first cross-session resume point needed |
| `WEB-TASK-20260515-E` | Author `docs/design-system.md` companion | Pre-launch |
| `WEB-TASK-20260515-F` | Author `docs/runbooks/claude-launch.md` companion | Backlog |
| ~~`WEB-TASK-20260515-G`~~ | ~~Provision Cloudflare Worker at api.jag-cybersecurity.io/contact~~ | **CLOSED 2026-05-15** — Worker `jag-contact-form` deployed, Resend backend (`RESEND_API_KEY` secret), custom domain bound, end-to-end smoke verified |

### Reference paths

- `README.md` — full project README, the authoritative narrative source
- `package.json` — runtime + devDependency manifest (6-dep runtime budget per §11.1: next, react, react-dom, lucide-react, geist, sharp)
- `tailwind.config.ts` — design tokens (colour, type, spacing, shadow, breakpoint, motion)
- `next.config.mjs` — Next.js + dev security headers
- `public/_headers` — production security headers (Cloudflare)
- `lib/content.ts` — marketing copy single source of truth (post-v2.2: no `pipeline` / `fiveLayers` exports; no `capabilities.proofBar` field)
- `components/ui/` — reusable primitives
- `components/sections/` — page-level sections
- `lighthouserc.json` — Lighthouse CI thresholds (≥95)
- `playwright.config.ts` — cross-browser test profiles
- `docs/superpowers/specs/` — architectural specs and amendment logs
- `docs/superpowers/plans/` — implementation plans
- `docs/superpowers/handoffs/` — session handoff docs (per §1.8)
- `workers/contact/` — Cloudflare Worker source for contact form (Resend backend)
- `.claude/settings.json` — inverted-permission allowlist
- `components/sections/Architecture.tsx` — combined section (outside view + LayerStack inside view + moat closing; absorbed FiveLayers content in v2.2)
- `components/sections/Dashboard.tsx` — Guardian Dashboard section (v2.2; chrome-framed product UI + 4 captions)
- `components/ui/SectionAnchor.tsx` — centered section-opener primitive (added 2026-05-17 polish initiative; retained after BrandTile rejection)
- `components/ui/BrowserChrome.tsx` — macOS-window framing primitive used for diagrams + dashboard image (added 2026-05-17 polish initiative; retained)
- `components/ui/HeroWave.tsx` — canvas wave (perf issue tracked as `WEB-DEFECT-20260518-001`)
- `components/ui/LayerStack.tsx` — 5-layer stratigraphy SVG (rendered inside Architecture section since v2.2)
- `components/ui/ThreatTimeline.tsx` — incidents timeline (wrapped in BrowserChrome inside Threats)
- `components/ui/ShieldSVG.tsx` — Hero shield primitive (retained)
- `components/ui/FadeInOnScroll.tsx` — IntersectionObserver-driven CSS-keyframe reveal
- `components/ui/CapabilityIcon.tsx` — bespoke 120×80 SVG motifs for the Solution capability cards
- `scripts/og-build.mjs` — build-time OG image generator
- `tests/reduced-motion.spec.ts` — prefers-reduced-motion verification
- `tests/visual-rebuild.spec.ts` — visual regression baseline (chromium, 5 breakpoints)
- `docs/superpowers/specs/2026-05-15-website-rebuild-phase2-design.md` — Phase 2 design spec
- `docs/superpowers/specs/2026-05-17-resend-grade-premium-polish-design.md` — premium polish spec (tile pattern subsequently rejected; typography + chrome + anchor primitives retained)
- `docs/superpowers/plans/2026-05-17-resend-grade-premium-polish.md` — premium polish plan (16 tasks)
- `docs/superpowers/specs/2026-05-18-dashboard-section-and-restructure-design.md` — v2.2 spec
- `docs/superpowers/plans/2026-05-18-dashboard-section-and-restructure.md` — v2.2 plan (10 tasks)
- `docs/superpowers/handoffs/2026-05-18-session-handoff.md` — 2026-05-17/18 session handoff
- `public/assets/jag-logo.webp` — navigation + footer logo (WebP since v2.2 perf pass)
- `public/assets/founder-photo.webp` — founder portrait (WebP since v2.2 perf pass)
- `public/assets/architecture-overview.webp` — Architecture section diagram (WebP since v2.2 perf pass)
- `public/assets/guardian-dashboard.webp` — Guardian Dashboard product UI (WebP at quality 88, sharp-enhanced)

**Components deleted in v2.2** (do not search for these — they are removed): `components/sections/Pipeline.tsx`, `components/sections/FiveLayers.tsx`, `components/ui/PipelineFunnel.tsx`, `components/ui/LayerCard.tsx`, `components/ui/ProofBar.tsx`, `components/ui/MetricCounter.tsx`, `components/ui/ArchitectureDiagram.tsx`, `components/ui/PacketParticles.tsx`, `components/ui/BrandTile.tsx`, `components/ui/tiles/ShieldTile.tsx`, `components/ui/tiles/HexWarningTile.tsx`, `components/ui/tiles/ConcentricRingsTile.tsx`, `components/ui/tiles/LayerStratigraphyTile.tsx`.

### Known security advisories (2026-05-14 snapshot — for owner triage, NOT auto-fix)

`npm audit` reports 9 advisories after the Phase 1.5 dev-tooling install. None warrants `npm audit fix --force` — that would upgrade Next.js 14 → 16 (major-major) and invalidate the architecture decisions in this charter.

**Pre-existing in `next@14.2.35` (latent before install)**
- Aggregate Next.js advisories (high) and `postcss <8.5.10` XSS (moderate). **Most do not apply to this project at runtime** because static export disables Image Optimizer, Middleware, Server Components, App Router runtime, CSP nonces, and `beforeInteractive` script flows. The remaining residual risk is build-host only (local + Cloudflare Pages build env).
- Remediation path requires owner approval: either pin patched 14.2.x point releases as they appear, or undertake a planned Next 14 → 16 migration as a Phase 2 initiative.

**Introduced by Phase 1.5 dev tooling (build-time only, non-shipping)**
- `glob 10.2.0–10.4.5` (high) — command injection via `-c/--cmd` flag, applies only to the glob *CLI* with user-provided shell args; library use unaffected. Comes in via `@next/eslint-plugin-next`.
- `tmp <=0.2.3` (low/moderate) — arbitrary write via symlink, used by `@lhci/cli`'s `inquirer` prompts; only triggered in interactive lhci flows.

**Owner action items**: triage at next monthly charter review (§9). Track upstream patches for `@lhci/cli` and `eslint-config-next` releases; revisit Next.js major upgrade as a deliberate Phase 2 sprint.

---

## Appendix A · Defect-Entry Schema

Use this schema for §1.3 (FIX-OR-FILE) and §1.7 (tactical hotfix follow-up).

```
WEB-DEFECT-YYYYMMDD-NNN [Severity: Low/Med/High/Critical] OPEN
Title:          <one-line description>
File/Route:     <path:line OR route URL>
Domain:         <visual / interaction / a11y / perf / SEO / responsive /
                 brand / i18n / security / code-quality>
Symptom:        <observable behaviour, screenshot link, axe rule ID, Lighthouse score>
Evidence:       <single best command output, screenshot path, or test result>
Root cause:     <SPECULATION until proven>
Proposed fix:   <smallest viable correction; estimated diff size>
Fix wave:       <Hotfix | Pre-launch | Design-debt | Backlog>
Discipline:     <which of the 11 disciplines from §1.4>
Owner:          <named individual>
Deadline:       <date — required if Fix wave is Hotfix and §1.7(d) applies>
```

Until §6 MEMORY.md is live, defect entries are tracked in commit messages and (when volume warrants) a dedicated `docs/defects.md` ledger.

---

## Appendix B · Pre/Post-Install SHA Workflow (operational, macOS)

```bash
TS=$(date +%Y%m%d_%H%M%S)
TAG="charter-vX.Y-install"
PROJECT_ROOT="/Users/cavslee/Projects/JAG/01_website"
CHARTER="${PROJECT_ROOT}/CLAUDE.md"
BACKUP_DIR="${HOME}/claude-backups/jag-website/${TAG}-${TS}"
MANIFEST_DIR="${HOME}/claude-backups/jag-website/manifests"

cd "${PROJECT_ROOT}"

# 1. L1 snapshot — git commit existing charter (if present and dirty).
if [ -f "${CHARTER}" ]; then
  git add CLAUDE.md && git commit -m "snapshot: pre_${TAG}" 2>/dev/null || true
fi

# 2. L2 filesystem backup (project convention + central archive).
mkdir -p "${BACKUP_DIR}" "${MANIFEST_DIR}"
if [ -f "${CHARTER}" ]; then
  cp -p "${CHARTER}" "${CHARTER}.backup-${TS}"
  cp -p "${CHARTER}" "${BACKUP_DIR}/CLAUDE.md.pre_${TAG}"
fi

# 3. Pre-install SHA manifest.
[ -f "${CHARTER}" ] && shasum -a 256 "${CHARTER}" > "${MANIFEST_DIR}/sha256_pre_${TAG}_${TS}.manifest"

# 4. Stage new charter at /tmp/CLAUDE.md.staged (frontmatter sha256_body placeholder = literal "<recomputed-on-install>").

# 5. Install (user-owned project path; no sudo).
cp /tmp/CLAUDE.md.staged "${CHARTER}"

# 6. Compute post-install body SHA.
FRONTMATTER_END=$(grep -n '^---' "${CHARTER}" | sed -n '2p' | cut -d: -f1)
BODY_START=$((FRONTMATTER_END + 1))
BODY_SHA=$(tail -n +${BODY_START} "${CHARTER}" | shasum -a 256 | awk '{print $1}')

# 7. Patch frontmatter with real SHA, re-install.
sed -i '' "s|^sha256_body:.*|sha256_body: ${BODY_SHA}|" /tmp/CLAUDE.md.staged
cp /tmp/CLAUDE.md.staged "${CHARTER}"

# 8. Post-install manifest.
shasum -a 256 "${CHARTER}" > "${MANIFEST_DIR}/sha256_post_${TAG}_${TS}.manifest"

# 9. Git commit the installed charter.
git add CLAUDE.md && git commit -m "charter: install ${TAG} (body SHA ${BODY_SHA:0:12})"

echo "✅ Charter install complete."
echo "   Canonical path : ${CHARTER}"
echo "   Body SHA       : ${BODY_SHA}"
echo "   Backups        : ${BACKUP_DIR}/  and  ${CHARTER}.backup-${TS}"
```

*Note on `sed -i ''`*: macOS BSD `sed` requires the empty `''` after `-i`. The script above is macOS-correct.

---

## Changelog

| Version | Date | Summary |
|---|---|---|
| 2.2 | 2026-05-18 | Homepage restructure + Guardian Dashboard section. Spec `docs/superpowers/specs/2026-05-18-dashboard-section-and-restructure-design.md`; plan `docs/superpowers/plans/2026-05-18-dashboard-section-and-restructure.md`; session handoff `docs/superpowers/handoffs/2026-05-18-session-handoff.md`. Net 13 implementation commits `0a7c04d..3e7f2cc` plus this charter update. **New `components/sections/Dashboard.tsx`** showcases the JAG Guardian product UI (chrome-framed `guardian-dashboard.webp` + 4 caption blocks: PIPELINE / AI ANALYST / SYSTEM HEALTH / EVIDENCE). **Architecture absorbed FiveLayers** (outside view diagram + inside view LayerStack + "Defensible Moat" closing). **Removed:** Pipeline section (entirely), ProofBar stat band (from Solution), 5 LayerCard grid (from former FiveLayers), 4 BrandTile icons + 4 tile SVG components (the 2026-05-17 polish experiment — empirical confirmation of §11.2 `icon-tile-stack` anti-pattern). **Section count 10 → 9.** First Load JS baseline 96.9 kB → **96.5 kB**. Hero CTA secondary updated to `See JAG Guardian → #dashboard`. Hero animation stagger tightened to 0.25 s end-time (§3.2.1 alignment). All marketing PNGs → WebP via sharp (logo, founder, architecture, dashboard); ~1.2 MB total asset savings. Dashboard image enhanced with sharp filter pipeline (linear contrast + saturation + edge sharpening, quality 88). **New `WEB-DEFECT-20260518-001` filed under §1.7 escape valve** (HeroWave canvas perf, deadline 2026-06-17). **WEB-TASK-G closed** (Cloudflare Worker `jag-contact-form` provisioned with Resend backend, custom domain `api.jag-cybersecurity.io` bound, end-to-end smoke verified). Navigation: 4 → 5 links (added Guardian), fixed pre-existing `#pipeline → Technology` label bug. Footer: Solution column `Five Layers → Guardian Dashboard`, Technology column dropped Pipeline row. |
| 2.1 | 2026-05-15 | Website rebuild Phase 2 landed (11 commits 01128ad..0b646b8). Resolves WEB-TASK-A (accent #22D3EE), -B (body Geist via `geist` package), -C (mono JetBrains Mono). Closes all 6 Phase 1.5 gaps (fade-in polish, logo, founder photo, OG image, compliance restyle, framer-motion uninstall). Adds Architecture + FiveLayers as new sections — homepage now 10 sections. Project First Load JS baseline updates from 91.7 kB → 96.9 kB. Runtime deps: 5 → 6 (geist), framer-motion uninstalled (net change same vs v2.0 baseline if framer is counted). Cloudflare Worker contact endpoint probe found DNS not provisioned → new WEB-TASK-G filed. Charter §3.2 motion-library policy honoured: zero framer-motion imports on `/`; all motion via CSS keyframes + IntersectionObserver + SVG stroke-dasharray + one ~3 kB canvas (Architecture perimeter-inspector). |
| 2.0 | 2026-05-15 | Structural §0 routing change (action classes Type-0/1/2; tiered FULL/ABBREVIATED coordination block). §1.5 ASK-BEFORE-ACTING enumerated triggers (7) replacing 95%-confidence rule, with destructive-verb scoped to action-naming use only. §1.3 FIX-OR-FILE replaces FIX-BUGS-ON-THE-SPOT. §1.7 hotfix escape valve with ≤30-day cap. §6 reserved for MEMORY.md (avoid over-engineering an artifact that doesn't exist). §8 generic-AI self-reject rule bounded to one rewrite then escalate. §9.2 harvest pattern formalised; §9.3 retirement procedure added. §11 expanded with reference brands, success metric, JAG-original anti-pattern list; PLANNED typography/colour decisions consolidated to single "Open decisions" pointer; canonical decision tracker is §12 only. §11.2 anti-pattern catalogue de-duplicated from §11. Appendix A defect schema. Appendix B SHA install workflow. Frontmatter `sha256_body` self-attestation. Trimmed from proposed v1.3 by removing companion-doc phantom references, tautological SHA verification step, unverified sister-charter reference, and fake-mechanical "keyword overlap" tiebreaker. |
| 1.2 | 2026-05-15 | Motion-craft (§3.2.1, Emil Kowalski harvest) + anti-pattern catalogue (§10.2, Impeccable harvest). |
| 1.0–1.1 | 2026-05-14 | Initial charter authoring; Phase 1.5 dev-tooling registry; project quick-context. |

---

*End of Charter v2.1 — JAG Cybersecurity Website Edition.*
