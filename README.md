# JAG Cybersecurity — Marketing Website

Phase 1 marketing website for **JAG Cybersecurity** (Jetson-AI-Guard). Static export, deployed to Cloudflare Pages at `jag-cybersecurity.io`. Built for sovereign-AI cybersecurity positioning, NVIDIA Inception application, and initial investor outreach.

---

## Tech stack

| Concern         | Choice                                                                    |
| --------------- | ------------------------------------------------------------------------- |
| Framework       | Next.js **14.2.35** (App Router)                                          |
| Language        | TypeScript **5**                                                          |
| Styling         | Tailwind CSS **3.4.1**                                                    |
| Runtime         | React **18**                                                              |
| Icons           | `lucide-react` **0.400.0** (icons only, no other UI primitives)           |
| Output          | Static export (`output: 'export'`) for Cloudflare Pages                   |
| Deploy target   | Cloudflare Pages, edge-served, no Node runtime at request time            |

**On `framer-motion`.** It still appears in `package.json` (`^11.18.2`) but is **no longer imported by the components on the `/` route**. During Phase 1, `FadeInOnScroll` and `MetricCounter` were rewritten to remove the dependency after a runtime bug (see *Architecture decisions* below). The package is retained in `dependencies` only because no other consumer has been audited yet; Phase 1.5 will either uninstall it or re-introduce a controlled use.

## Performance

```
Route (app)                              Size     First Load JS
┌ ○ /                                    4.32 kB        91.7 kB
├ ○ /_not-found                          875 B          88.2 kB
+ First Load JS shared by all            87.4 kB
```

Static prerendered, zero runtime overhead, edge-deployable.

---

## Local development

### Prerequisites

- Node.js **18.17+** or **20.x**
- npm (bundled with Node)

### Setup

```bash
git clone <repo>
cd 01_website
npm install
npm run dev
```

Open http://localhost:3000.

### Production build (matches deployment)

```bash
npm run build
npx serve out -p 3001
```

Open http://localhost:3001.

> **Always verify visual changes against the production build before considering work complete.** Dev mode and the static export differ in CSP enforcement, hydration timing, and bundle composition. Bugs that pass dev have shipped broken before — see commit `81fb7f8` for the canonical example.

---

## File structure

```
01_website/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx          # Root layout, metadata, fonts
│   ├── page.tsx            # Homepage composition
│   ├── globals.css         # Global styles + reduced-motion overrides
│   ├── icon.tsx            # Favicon (text-based JAG)
│   └── apple-icon.tsx      # Apple touch icon
├── components/
│   ├── Navigation.tsx      # Top nav bar
│   ├── Footer.tsx          # Page footer
│   ├── sections/           # Page sections
│   │   ├── Hero.tsx
│   │   ├── Threats.tsx
│   │   ├── Solution.tsx
│   │   ├── Pipeline.tsx
│   │   ├── Technology.tsx
│   │   ├── Markets.tsx
│   │   ├── Founder.tsx
│   │   └── Contact.tsx
│   └── ui/                 # Reusable primitives
│       ├── Container.tsx       # Layout container (max-w-container)
│       ├── SectionHeader.tsx   # Section eyebrow + heading
│       ├── Card.tsx            # Content cards (default / concern / success)
│       ├── FadeInOnScroll.tsx  # CSS-only fade-in wrapper
│       └── MetricCounter.tsx   # Number ramp-up display
├── lib/
│   └── content.ts          # Single source of truth for all copy
├── public/
│   └── _headers            # Cloudflare Pages security headers
├── docs/
│   └── superpowers/        # Architecture specs and implementation plans
│       ├── specs/
│       └── plans/
├── tailwind.config.ts      # Design tokens, colors, keyframes
├── next.config.mjs         # Next.js config (static export + headers)
└── tsconfig.json
```

---

## Design system

All tokens live in `tailwind.config.ts` under `theme.extend`. Use the Tailwind utility classes — do not hard-code hex values in components.

### Colors

| Token              | Hex                  | Use                                     |
| ------------------ | -------------------- | --------------------------------------- |
| `bg-primary`       | `#0A1628`            | Main background                         |
| `bg-secondary`     | `#111E32`            | Section backgrounds                     |
| `bg-elevated`      | `#1A2B47`            | Cards, elevated surfaces                |
| `bg-deep`          | `#050D1A`            | Deepest backdrop wash                   |
| `border`           | `#1E2F4A`            | Default border                          |
| `text-primary`     | `#E8EEF7`            | Body text                               |
| `text-secondary`   | `#8A9CB5`            | Secondary text, captions                |
| `text-tertiary`    | `#5A6B85`            | Tertiary text, footnotes                |
| `accent`           | `#00D9FF`            | Brand accent (links, focus, metrics)    |
| `accent-hover`     | `#33E1FF`            | Hover state                             |
| `accent-glow`      | `rgba(0,217,255,.15)`| Glow halo on accented surfaces          |
| `metric-amber`     | `#FFB800`            | Warning / amber metric                  |
| `metric-green`     | `#00FF9F`            | Success / positive metric               |

### Typography

- **Headlines:** Space Grotesk 700 — `font-display` (`--font-headline`)
- **Body:** Inter 400/500 — `font-sans` (`--font-body`)
- **Mono:** JetBrains Mono 500 — `font-mono` (`--font-mono`)

### Layout

- Container: `max-w-container` (1200px)
- Content: `max-w-content` (720px)
- Section padding: `clamp(4rem, 8vw, 8rem)`

### Breakpoints

| Name | Width   |
| ---- | ------- |
| `xs` | 375px   |
| `sm` | 640px   |
| `md` | 768px   |
| `lg` | 1024px  |
| `xl` | 1440px  |

### Glow shadow utilities

`shadow-glow-sm` / `shadow-glow-md` / `shadow-glow-lg` / `shadow-glow-xl` — accent-colored radial shadows for focal surfaces.

### Animation

A single shared keyframe `fade-in-up` (0.6s ease-out, translateY 16→0, `forwards` fill mode), exposed as the `animate-fade-in-up` utility. Reduced-motion override lives in `app/globals.css`.

---

## Content management

All copy lives in `lib/content.ts` as a typed export. This is the **single source of truth**. Sections import strings from this file rather than defining them inline.

To edit copy: open `lib/content.ts`, modify the relevant string, save. Changes propagate to all consumers automatically and are type-checked at compile time.

This pattern enables:

- One-place global edits
- Compile-time errors if a referenced key changes shape
- A foundation for i18n if/when needed

---

## Deployment

| Field            | Value                              |
| ---------------- | ---------------------------------- |
| Target           | Cloudflare Pages                   |
| Build command    | `npm run build`                    |
| Output directory | `out`                              |
| Custom domain    | `jag-cybersecurity.io`             |

Static export means **no server-side rendering at request time**. All pages are prerendered at build and served as static HTML/CSS/JS from Cloudflare's edge.

### Security headers

The same security policy is declared in two files in the formats each consumer expects:

- `next.config.mjs` — `headers()` for `next dev` / `next start`
- `public/_headers` — text format for Cloudflare Pages production

**These two files must be kept in sync by value.** Verify any change with a programmatic diff of the directive content (CSP, HSTS, X-Frame-Options, etc.) — not by eye. The static export warning Next.js emits about `headers()` not being applied at runtime is expected: in production, Cloudflare's `_headers` is the live policy.

---

## Architecture decisions

### Why static export

- **Edge-deployable** — Cloudflare Pages, no Node runtime needed.
- **Maximum performance** — pure CDN serving.
- **Minimal trust surface** — JAG's engineering philosophy. No request-time runtime, no request-time attack surface.
- **Auditable** — the `out/` directory is the entire shippable artifact and can be reviewed byte-for-byte before deploy.

### Why CSS keyframes over framer-motion (Phase 1 critical decision)

The first attempt used `framer-motion`'s `whileInView` / `useInView` for fade-in animations. This pattern failed in **Next.js 14 + React 18 + SSR + Strict Mode**: `motion.div` emitted `opacity:0` in the SSR HTML, but the IntersectionObserver inside `useInView` never flipped client-side, leaving sections permanently invisible.

The fix replaced framer-motion entirely in the affected components with:

- **`FadeInOnScroll`** — pure CSS `@keyframes` via the `animate-fade-in-up` Tailwind utility.
- **`MetricCounter`** — native `IntersectionObserver` + 1500 ms `setTimeout` fallback (dual-signal, idempotent) for the count-up trigger; `requestAnimationFrame` for the count-up itself.

**Bundle impact:** First Load JS for `/` dropped from 128 kB → 91.7 kB (**−36.3 kB, −28.4%**). Page-specific JS dropped from 40.5 kB → 4.32 kB (**−89.3%**). framer-motion was loading its full runtime to power two components that only needed a 0.6 s fade — tree-shaking did not help.

References:

- Commit `6c2f230` — full rationale and verification evidence.
- `docs/superpowers/specs/2026-04-25-fade-animation-css-refactor-design.md` — the architectural spec, including the amendment log.

### Why content is separated to `lib/content.ts`

- Single source of truth for marketing copy.
- Type-safe at compile time.
- Easier to edit copy without touching component logic.
- Foundation for future i18n.

---

## Known limitations (Phase 1)

1. **Section fade-in animation is not perceptibly animated in production.** The CSS keyframe completes faster than the user can register motion once the bundle has hydrated. Sections appear at final opacity essentially immediately. Polish deferred to Phase 1.5.
2. **JAG logo is rendered as the text "JAG."** Logo image integration deferred to Phase 1.5.
3. **Founder photo is a "K" placeholder.** Real photo deferred to Phase 1.5.
4. **OG (Open Graph) social-sharing image not yet generated.** Deferred to Phase 1.5.
5. **Compliance badges are plain text rectangles.** Visual treatment deferred to Phase 1.5.

---

## Phase 1.5 polish roadmap (post-launch)

After Phase 1 deploys and initial investor / NVIDIA Inception outreach begins:

- JAG logo image integration
- OG image generation for social sharing
- Real founder photo
- Compliance badge visual treatment
- Section fade-in animation polish (timing, will-change hints, or post-hydration trigger)
- Mobile audit and refinement
- Lighthouse 95+ verification across all metrics
- WCAG 2.1 AA accessibility audit
- Cross-browser testing (Chrome, Safari, Firefox)
- Pipeline diagram visual weight enhancement
- Resolve framer-motion: uninstall or document an audited reintroduction

---

## Contributing

This is currently a single-founder codebase. If JAG expands beyond solo development:

1. Read this README in full.
2. Read `docs/superpowers/specs/` for architectural decisions and amendment logs.
3. Use the inverted-permission Claude Code workflow established in this project (see `.claude/settings.json`).
4. Backups before edits, evidence-based verification gates, single atomic commit per logical change.
5. Visual smoke testing in the production build is **mandatory** before merge — see commit `81fb7f8` for what happens when only static analysis is trusted.

---

## License

To be determined.

---

## Contact

**Kelvin Lee** — Founder & Chief Architect

- Email: `kelvin@jag-cybersecurity.io`
- General: `connect@jag-cybersecurity.io`
- Location: Penang, Malaysia / Southeast Asia
