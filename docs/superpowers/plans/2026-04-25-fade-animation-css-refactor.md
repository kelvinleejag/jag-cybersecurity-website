# Fade Animation CSS Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace framer-motion's `motion.div + useInView` lifecycle (currently leaving 39 section wrappers + 4 metric values stuck at `opacity:0`) with a Tailwind keyframe animation that fires on mount, restoring section and metric visibility on the JAG landing page.

**Architecture:** Add an `animate-fade-in-up` Tailwind utility (defined via `theme.extend.keyframes` + `theme.extend.animation`) that runs a 0.6 s opacity+translateY ramp on mount with `forwards` fill. `FadeInOnScroll` becomes a pure CSS wrapper with no framer-motion import. `MetricCounter` keeps its `requestAnimationFrame` count-up but loses its `motion.div` wrapper, gaining the same Tailwind utility on the value div plus a 1.5 s `setTimeout` fallback that snaps `display` to the final `value` whether or not `useInView` ever flips. `prefers-reduced-motion` is honored via a media-query override in `globals.css`.

**Tech Stack:** Next.js 14.2 App Router, React 18, TypeScript 5, Tailwind 3.4, framer-motion 11.18 (kept for `useInView` + `useReducedMotion` hooks in `MetricCounter`; `motion` component dropped from both files in scope).

**Spec:** `docs/superpowers/specs/2026-04-25-fade-animation-css-refactor-design.md`

---

## File Structure

| File | Action | Purpose |
|---|---|---|
| `tailwind.config.ts` | modify | Register `fade-in-up` keyframe + animation utility |
| `app/globals.css` | modify | Append `prefers-reduced-motion` override for `.animate-fade-in-up` |
| `components/ui/FadeInOnScroll.tsx` | rewrite | Pure CSS wrapper — drop framer-motion entirely |
| `components/ui/MetricCounter.tsx` | modify | Replace `motion.div` with plain `div` + fade utility; add 1.5 s fallback timer |
| `components/ui/FadeInOnScroll.tsx.prefix-20260425-172009` | delete | Stale diagnostic backup, no longer needed |
| `.preview/backups-<TS>.sha256` | create | Pre-edit checksum manifest |
| `.preview/post-fix-screenshots/` | create | Verification artifacts |

---

## Task 1: Pre-flight — backups, checksums, baseline metrics

**Files:**
- Read: `tailwind.config.ts`, `app/globals.css`, `components/ui/FadeInOnScroll.tsx`, `components/ui/MetricCounter.tsx`
- Create: `.preview/backups-<TS>.sha256`, four `.backup-<TS>` siblings

- [ ] **Step 1: Capture a single shared timestamp and write backups + manifest**

```bash
cd /Users/cavslee/Projects/JAG/01_website
mkdir -p .preview
TS=$(date +%Y%m%d-%H%M%S)
echo "$TS" > .preview/.last-backup-ts
for f in components/ui/FadeInOnScroll.tsx components/ui/MetricCounter.tsx tailwind.config.ts app/globals.css; do
  cp "$f" "$f.backup-$TS"
done
shasum -a 256 \
  components/ui/FadeInOnScroll.tsx.backup-$TS \
  components/ui/MetricCounter.tsx.backup-$TS \
  tailwind.config.ts.backup-$TS \
  app/globals.css.backup-$TS \
  > .preview/backups-$TS.sha256
cat .preview/backups-$TS.sha256
```
Expected: four SHA-256 lines, one per backup file. The `.last-backup-ts` file lets later tasks reuse the same `$TS` without re-deriving it.

- [ ] **Step 2: Capture baseline (broken-state) metrics for the verification report**

These numbers are already known from the diagnostic phase but recapturing makes the plan self-contained. Confirm they match before proceeding.

```bash
git stash push -m "wip-diagnostic" -- components/ui/FadeInOnScroll.tsx
# Now working tree has commit 81fb7f8's useInView version
```

- [ ] **Step 3: Start dev server and snapshot the broken-state DOM**

If a dev server is already running (background ID `b79c1e1x7` from the diagnostic session), kill it first so tailwind reloads cleanly:
```bash
pkill -f "next dev" 2>/dev/null; sleep 2
npm run dev > /tmp/jag-dev.log 2>&1 &
echo $! > /tmp/jag-dev.pid
until curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null | grep -q "200"; do sleep 2; done
```

```bash
CHROMIUM=~/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell
"$CHROMIUM" --headless --disable-gpu --no-sandbox --dump-dom --virtual-time-budget=6000 \
  http://localhost:3000 2>/dev/null > .preview/baseline-broken.html
echo "FadeInOnScroll wrappers stuck at opacity:0:"
grep -oE 'style="opacity:0;transform:translateY\(16px\)"' .preview/baseline-broken.html | wc -l
echo "MetricCounter wrappers stuck at opacity:0:"
grep -oE 'style="opacity:0"' .preview/baseline-broken.html | wc -l
```
Expected output: `39` and `4`. If different, investigate before proceeding — the spec's verification gates assume these exact baselines.

- [ ] **Step 4: Restore the diagnostic and shut down the dev server**

```bash
git stash pop  # restores diagnostic plain-div FadeInOnScroll
kill $(cat /tmp/jag-dev.pid) 2>/dev/null; rm -f /tmp/jag-dev.pid
```

- [ ] **Step 5: Commit nothing — this task only creates backups and gathers evidence; no source files changed**

No commit. Proceed to Task 2.

---

## Task 2: Add `fade-in-up` keyframe + animation to `tailwind.config.ts`

**Files:**
- Modify: `tailwind.config.ts` (within `theme.extend`)

- [ ] **Step 1: Add the `keyframes` and `animation` blocks**

Open `tailwind.config.ts`. Inside `theme.extend`, after the existing `boxShadow` block (the last entry), add:

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

The full `theme.extend` after the edit ends with `boxShadow: { … }, keyframes: { … }, animation: { … },`. The trailing commas matter — `theme.extend` is a normal object literal.

- [ ] **Step 2: Verify the file is still valid TypeScript**

```bash
npx tsc --noEmit -p tsconfig.json 2>&1 | head -20
```
Expected: no errors mentioning `tailwind.config.ts`. (Tailwind config is type-checked because `tsconfig.json` includes the project root.)

- [ ] **Step 3: Sanity-check that the utility resolves**

```bash
npx tailwindcss -i app/globals.css -o /tmp/tw-check.css --content "<div class='animate-fade-in-up'>" 2>&1 | tail -5
grep -A4 "animate-fade-in-up" /tmp/tw-check.css | head -10
grep -A4 "@keyframes fade-in-up" /tmp/tw-check.css | head -10
rm /tmp/tw-check.css
```
Expected: `.animate-fade-in-up { animation: 0.6s ease-out 0s 1 normal forwards running fade-in-up; }` (or equivalent shorthand) **and** an `@keyframes fade-in-up` block emitted.

- [ ] **Step 4: No commit yet — Tailwind change is part of the same logical commit as the component refactors**

---

## Task 3: Add `prefers-reduced-motion` override to `app/globals.css`

**Files:**
- Modify: `app/globals.css` (append at end of file)

- [ ] **Step 1: Append the media-query override**

Append, with a single blank line separator, after the closing `}` of the existing `@layer utilities` block:

```css

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

The override sits **outside** any `@layer` block — Tailwind layer ordering does not apply to raw `@media` rules and putting it in a layer can cause specificity surprises. The `!important` is necessary to defeat the utility class's animation shorthand.

- [ ] **Step 2: No standalone verification step — the override is exercised in Task 7's reduced-motion check**

---

## Task 4: Rewrite `FadeInOnScroll` as a pure CSS wrapper

**Files:**
- Rewrite: `components/ui/FadeInOnScroll.tsx`

- [ ] **Step 1: Replace the entire file contents**

```tsx
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
```

- [ ] **Step 2: Verify no caller breaks**

```bash
grep -rn "FadeInOnScroll" components/sections | grep -v ":import"
```
Expected: every call passes `children`, optional `delay` (always a number — seconds), optional `className`. The new signature is a strict superset of what callers use.

- [ ] **Step 3: No commit — bundled with Tasks 2, 3, 5 in the final commit**

---

## Task 5: Refactor `MetricCounter` — drop `motion.div`, add fallback timer

**Files:**
- Modify: `components/ui/MetricCounter.tsx`

- [ ] **Step 1: Replace the entire file contents**

```tsx
'use client';
import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * MetricCounter — number ramp-up animation triggered when scrolled into view,
 * with a CSS-keyframe fade-in on the value and a 1.5 s fallback timer that
 * snaps to the final value if useInView never fires.
 *
 * History (do not revert):
 *   The previous motion.div wrapper used framer-motion's animate prop to
 *   transition opacity from 0→1, gated on useInView. In Next.js 14 + React 18
 *   + framer-motion 11, useInView was observed to never flip in headless
 *   render and (per user report) in production, leaving the four metric
 *   values stuck invisible. Replaced with .animate-fade-in-up Tailwind
 *   utility on a plain div + a setTimeout safety net.
 * Spec: docs/superpowers/specs/2026-04-25-fade-animation-css-refactor-design.md
 */

function parseNumeric(value: string): { num: number; suffix: string; prefix: string } | null {
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] };
}

export function MetricCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduce = useReducedMotion();
  const parsed = parseNumeric(value);
  const [display, setDisplay] = useState(parsed && !reduce ? `${parsed.prefix}0${parsed.suffix}` : value);

  // Count-up: scroll-triggered, dependent on useInView.
  useEffect(() => {
    if (!inView || !parsed || reduce) {
      setDisplay(value);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = parsed.num * eased;
      const formatted = Number.isInteger(parsed.num) ? Math.round(current).toString() : current.toFixed(1);
      setDisplay(`${parsed.prefix}${formatted}${parsed.suffix}`);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, parsed, reduce, value]);

  // Safety net: if useInView never flips (the bug we just fixed for
  // FadeInOnScroll lives in the same package), guarantee the final value
  // is shown after 1500 ms regardless of inView state. If the count-up
  // already completed (typical case), this sets the same value again —
  // a no-op render. If useInView was broken, this rescues the display.
  useEffect(() => {
    const t = setTimeout(() => setDisplay(value), 1500);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-mono text-4xl md:text-5xl font-medium text-accent tabular-nums animate-fade-in-up">
        {display}
      </div>
      <p className="mt-3 text-sm text-text-secondary leading-snug">{label}</p>
    </div>
  );
}
```

Key differences from the prior version:
- Imports drop `motion` (kept `useInView`, `useReducedMotion`).
- The inner `<motion.div>` becomes a plain `<div>` carrying the original visual classes plus `animate-fade-in-up`. **One div, no extra nesting** — see spec §3.4.
- New `useEffect` with `setTimeout(setDisplay, 1500)` as the safety net.
- Public API unchanged: `{ value: string; label: string }`.

- [ ] **Step 2: Verify caller still compiles**

```bash
grep -A2 "MetricCounter" components/sections/Solution.tsx
```
Expected: `<MetricCounter key={m.label} value={m.value} label={m.label} />` — unchanged.

- [ ] **Step 3: No commit yet — bundled into the final commit at Task 9**

---

## Task 6: Static verification gates 1–3 (tsc, build, bundle delta)

**Files:** none modified.

- [ ] **Step 1 (Gate 1): Type check**

```bash
npx tsc --noEmit
```
Expected: exit 0, no errors. If errors appear, **stop, rollback (Task 9 rollback block), report.**

- [ ] **Step 2: Capture First Load JS baseline (already known but re-derive for the report)**

```bash
git stash push -m "wip-fix" -- \
  components/ui/FadeInOnScroll.tsx components/ui/MetricCounter.tsx \
  tailwind.config.ts app/globals.css
npm run build 2>&1 | tee /tmp/jag-build-before.log
grep -E "^[├└┌]\s+[○●λƒ]\s+/" /tmp/jag-build-before.log | head -10
git stash pop
```
Note the First Load JS column for `/`. Save the value: `BEFORE_KB=<value>`.

- [ ] **Step 3 (Gate 2): Build with the fix applied**

```bash
npm run build 2>&1 | tee /tmp/jag-build-after.log
grep -E "^[├└┌]\s+[○●λƒ]\s+/" /tmp/jag-build-after.log | head -10
```
Expected: clean build. Pre-existing static-export `headers` warning is tolerated. **Any new error → stop, rollback, report.**

Save the new value: `AFTER_KB=<value>`.

- [ ] **Step 4 (Gate 3): Compute and report bundle delta**

```bash
echo "First Load JS for '/': $BEFORE_KB → $AFTER_KB"
```
Expected direction: equal or smaller (the `motion` component is no longer imported by either file, but framer-motion as a whole is still pulled in for `useInView`/`useReducedMotion` in `MetricCounter`, so delta will be modest — likely 0 to −5 kB). **A meaningful increase is a red flag — stop, investigate.**

- [ ] **Step 5: No commit — verification only**

---

## Task 7: Cold dev server + browser smoke test (Gates 4 + 5)

**Files:**
- Create: `.preview/post-fix-screenshots/full-page.png`, `.preview/post-fix-screenshots/solution-metrics.png`, `.preview/post-fix-screenshots/rendered.html`, `.preview/post-fix-screenshots/reduced-motion.html`

- [ ] **Step 1 (Gate 4): Kill any running dev server, start fresh**

```bash
pkill -f "next dev" 2>/dev/null; sleep 2
npm run dev > /tmp/jag-dev.log 2>&1 &
echo $! > /tmp/jag-dev.pid
until curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null | grep -q "200"; do sleep 2; done
echo "Dev server up: HTTP $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)"
```
Expected: `Dev server up: HTTP 200`. **Any other code → stop, check `/tmp/jag-dev.log`, rollback if broken.**

- [ ] **Step 2 (Gate 5a): Render with headless Chromium and sweep for stuck `opacity:0`**

```bash
mkdir -p .preview/post-fix-screenshots
CHROMIUM=~/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell

"$CHROMIUM" --headless --disable-gpu --no-sandbox \
  --dump-dom --virtual-time-budget=6000 \
  http://localhost:3000 2>/dev/null \
  > .preview/post-fix-screenshots/rendered.html

echo "===== POST-FIX OPACITY SWEEP ====="
echo -n "FadeInOnScroll-style opacity:0 wrappers: "
grep -oE 'style="opacity:0;transform:translateY\(16px\)"' .preview/post-fix-screenshots/rendered.html | wc -l | tr -d ' '
echo -n "MetricCounter-style opacity:0 wrappers:  "
grep -oE 'style="opacity:0"' .preview/post-fix-screenshots/rendered.html | wc -l | tr -d ' '
echo -n "Any inline opacity:0 anywhere:           "
grep -oE 'opacity:0' .preview/post-fix-screenshots/rendered.html | wc -l | tr -d ' '
```
**Required:** all three counts must be `0`. (Baselines were 39, 4, and 43 respectively.) If any count is non-zero, the fix did not work — **stop, rollback, report.**

- [ ] **Step 3 (Gate 5b): Capture full-page screenshot**

```bash
"$CHROMIUM" --headless --disable-gpu --no-sandbox \
  --window-size=1440,8000 \
  --virtual-time-budget=8000 \
  --hide-scrollbars \
  --screenshot=.preview/post-fix-screenshots/full-page.png \
  http://localhost:3000 2>/dev/null
ls -la .preview/post-fix-screenshots/full-page.png
```
Expected: a PNG file >50 kB. If 0 bytes or missing: chrome-headless-shell error — **stop, check stderr by re-running without `2>/dev/null`.**

- [ ] **Step 4 (Gate 5c): Capture Solution-section screenshot via the `#solution` anchor**

```bash
"$CHROMIUM" --headless --disable-gpu --no-sandbox \
  --window-size=1440,1200 \
  --virtual-time-budget=8000 \
  --hide-scrollbars \
  --screenshot=.preview/post-fix-screenshots/solution-metrics.png \
  "http://localhost:3000#solution" 2>/dev/null
ls -la .preview/post-fix-screenshots/solution-metrics.png
```
Expected: a PNG file >50 kB. The Solution section is `id="solution"` (verified `components/sections/Solution.tsx:13`); the URL fragment scrolls it into the 1200 px viewport.

- [ ] **Step 5 (Gate 5d): Reduced-motion sanity check**

The Tailwind keyframe runs in `forwards` mode, so the *post-animation* state is `opacity:1`. Under `prefers-reduced-motion`, the animation should still complete (just instantly) — also yielding `opacity:1`. Verify that the override CSS is in the served stylesheet:

```bash
"$CHROMIUM" --headless --disable-gpu --no-sandbox \
  --dump-dom --virtual-time-budget=4000 \
  http://localhost:3000 2>/dev/null \
  > .preview/post-fix-screenshots/reduced-motion.html
# Find the stylesheet URL, fetch it, search for the override
STYLESHEET=$(grep -oE '/_next/static/css/[a-z0-9]+\.css' .preview/post-fix-screenshots/reduced-motion.html | head -1)
echo "Stylesheet: $STYLESHEET"
curl -s "http://localhost:3000$STYLESHEET" | grep -A3 "prefers-reduced-motion"
```
Expected: the `@media (prefers-reduced-motion: reduce) { .animate-fade-in-up { animation-duration: 0.01ms !important; … } }` block is present in the bundled CSS.

- [ ] **Step 6: No commit — Task 8 produces the report; Task 9 commits**

---

## Task 8: Visual confirmation report (Gate 6)

**Files:** none modified.

- [ ] **Step 1: Open both screenshots and verify each metric value visible above its label**

This is a **human-eyes** verification step. Report a four-line checklist with PASS/FAIL for each:

```
☐ "10/10"   visible above "Attack types blocked in red team"
☐ "5 sec"   visible above "Time-to-block on real-world attacks"
☐ "0%"      visible above "False positive rate"
☐ "310/310" visible above "Unit tests passing"
```

The exact label strings come from `lib/content.ts` — re-check there if any label seems off.

- [ ] **Step 2: Spot-check the full-page screenshot**

Confirm visually that all eight sections render content (Hero, Threats, Solution, Pipeline, Technology, Markets, Founder, Contact) — no stretches of empty navy background that should contain copy.

- [ ] **Step 3: If any check fails — stop, rollback, report**

```bash
TS=$(cat .preview/.last-backup-ts)
cp components/ui/FadeInOnScroll.tsx.backup-$TS components/ui/FadeInOnScroll.tsx
cp components/ui/MetricCounter.tsx.backup-$TS   components/ui/MetricCounter.tsx
cp tailwind.config.ts.backup-$TS                 tailwind.config.ts
cp app/globals.css.backup-$TS                    app/globals.css
echo "Rolled back to backup $TS"
```

- [ ] **Step 4: If all checks pass, proceed to Task 9**

---

## Task 9: Cleanup, kill dev server, commit

**Files:**
- Delete: `components/ui/FadeInOnScroll.tsx.prefix-20260425-172009`
- Stage: the four edited source files only (NOT the `.backup-*` siblings — keep them locally for rollback safety until the next commit lands)

- [ ] **Step 1: Delete the stale diagnostic backup**

```bash
rm components/ui/FadeInOnScroll.tsx.prefix-20260425-172009
```

- [ ] **Step 2: Kill the dev server**

```bash
kill $(cat /tmp/jag-dev.pid) 2>/dev/null
rm -f /tmp/jag-dev.pid
```

- [ ] **Step 3: Add `.preview/` to `.gitignore` if not already present**

```bash
grep -q "^\.preview/" .gitignore 2>/dev/null || echo ".preview/" >> .gitignore
grep -q "\.backup-" .gitignore 2>/dev/null || echo "*.backup-*" >> .gitignore
git diff .gitignore
```
Expected: `.preview/` and `*.backup-*` patterns added (or the file is unchanged if they were already there). The screenshots, baseline HTML, and timestamped backups are local-only artifacts; the spec and plan documents committed earlier are the durable record.

- [ ] **Step 4: Stage source changes**

```bash
git add components/ui/FadeInOnScroll.tsx \
        components/ui/MetricCounter.tsx \
        tailwind.config.ts \
        app/globals.css \
        .gitignore
git status --short
```
Expected `git status`:
```
 D components/ui/FadeInOnScroll.tsx.prefix-20260425-172009
M  app/globals.css
M  components/ui/FadeInOnScroll.tsx
M  components/ui/MetricCounter.tsx
M  tailwind.config.ts
M  .gitignore
?? components/ui/*.backup-<TS>
?? tailwind.config.ts.backup-<TS>
?? app/globals.css.backup-<TS>
?? .preview/
```
The deletion of the `.prefix-*` file is staged separately in the next step (it shows `D` because it's tracked-but-not-yet-deleted; `git rm` was implicit via `rm` + `git add -A` would catch it but we're deliberately scoping `git add` to specific files — so explicitly stage the deletion):

```bash
git add components/ui/FadeInOnScroll.tsx.prefix-20260425-172009  # stage the deletion
git status --short
```

- [ ] **Step 5: Commit with rationale + rollback instructions**

```bash
TS=$(cat .preview/.last-backup-ts)
git commit -m "$(cat <<EOF
[01_website] Fix invisible sections + missing metrics: replace framer-motion fade with CSS keyframes

Root cause: framer-motion 11.x useInView never fires its IntersectionObserver
in this Next.js 14 App Router + React 18 Strict Mode + SSR environment. The
motion.div emits opacity:0 / translateY(16px) during SSR but the observer
never flips client-side, leaving 39 FadeInOnScroll wrappers + 4 MetricCounter
values permanently invisible. Static analysis (tsc, build) passed cleanly
even with this bug shipping (commit 81fb7f8) — this is a runtime-only
failure mode discoverable only via headless render.

Fix:
- tailwind.config.ts: register fade-in-up keyframe + animation utility.
- app/globals.css: prefers-reduced-motion override for the new utility.
- FadeInOnScroll: full rewrite as a pure CSS wrapper, framer-motion import
  removed; component still 'use client' for API parity.
- MetricCounter: motion.div replaced by a single plain div carrying the
  original visual classes + animate-fade-in-up; added 1.5s setTimeout
  fallback to snap display to the final value if useInView never flips.
  Public API unchanged. Count-up logic untouched.

Verification (all six gates passed):
  1. tsc --noEmit:                         0 errors
  2. next build:                           clean (only the pre-existing
                                            static-export headers warning)
  3. Bundle size delta /:                  <fill in BEFORE → AFTER kB>
  4. Cold dev server:                      HTTP 200
  5. Headless Chromium opacity sweep:      39 → 0  /  4 → 0  /  43 → 0
                                            (FadeInOnScroll / MetricCounter / total)
  6. Screenshots:                          .preview/post-fix-screenshots/
                                            full-page.png + solution-metrics.png
                                            confirm 10/10, 5 sec, 0%, 310/310 visible

Spec:  docs/superpowers/specs/2026-04-25-fade-animation-css-refactor-design.md
Plan:  docs/superpowers/plans/2026-04-25-fade-animation-css-refactor.md

Rollback (timestamp $TS, manifest .preview/backups-$TS.sha256):
  cp components/ui/FadeInOnScroll.tsx.backup-$TS components/ui/FadeInOnScroll.tsx
  cp components/ui/MetricCounter.tsx.backup-$TS   components/ui/MetricCounter.tsx
  cp tailwind.config.ts.backup-$TS                 tailwind.config.ts
  cp app/globals.css.backup-$TS                    app/globals.css

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
git status --short
git log -1 --stat
```
Expected: commit lands cleanly. `git status` shows the `.backup-<TS>` files still untracked (now ignored by `.gitignore`).

- [ ] **Step 6: Capture commit hash for the report**

```bash
git rev-parse --short HEAD
```

---

## Final Report Template

After Task 9, report back to the user:

```
✅ All six gates passed.

  Gate 1 (tsc):           0 errors
  Gate 2 (next build):    clean (only pre-existing headers warning)
  Gate 3 (bundle delta):  <BEFORE> kB → <AFTER> kB  (Δ <DELTA> kB)
  Gate 4 (dev server):    HTTP 200
  Gate 5 (opacity sweep): 39 → 0 (FadeInOnScroll), 4 → 0 (MetricCounter)
  Gate 6 (screenshots):   .preview/post-fix-screenshots/full-page.png
                          .preview/post-fix-screenshots/solution-metrics.png
                          ☑ 10/10   ☑ 5 sec   ☑ 0%   ☑ 310/310

Commit: <SHORT_HASH>
Backup TS: <TS>  (manifest: .preview/backups-<TS>.sha256)

Ready for visual review and Task 22 (README).
```
