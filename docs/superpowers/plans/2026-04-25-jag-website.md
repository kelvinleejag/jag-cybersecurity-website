# JAG Cybersecurity Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade single-page marketing website for JAG Cybersecurity with 8 content sections, statically exported and ready for Cloudflare Pages deployment.

**Architecture:** Next.js 14 App Router with `output: 'export'` for static generation. Tailwind 3.x for styling with a centralized design token system. Framer Motion used sparingly for fade-in-on-scroll. All section components composed into a single root page. Contact form posts to a placeholder Cloudflare Worker endpoint.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS 3.x, Framer Motion, Lucide React, next/font/google (Space Grotesk, Inter, JetBrains Mono).

---

## File Structure

```
01_website/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, metadata, body wrapper
│   ├── page.tsx                      # Single-page composition of all sections
│   └── globals.css                   # Tailwind layers + CSS variables
├── components/
│   ├── Navigation.tsx                # Sticky top nav
│   ├── Footer.tsx                    # 3-column footer
│   ├── ui/
│   │   ├── Container.tsx             # Max-width content wrapper
│   │   ├── SectionHeader.tsx         # Header + lead pattern
│   │   ├── Card.tsx                  # Card primitive (capability/market cards)
│   │   ├── MetricCounter.tsx         # Count-up animated metric
│   │   └── FadeInOnScroll.tsx        # Framer Motion scroll-triggered fade
│   └── sections/
│       ├── Hero.tsx                  # Section 1
│       ├── Threats.tsx               # Section 2
│       ├── Solution.tsx              # Section 3
│       ├── Pipeline.tsx              # Section 4
│       ├── Technology.tsx            # Section 5 (incl. Compliance)
│       ├── Markets.tsx               # Section 6
│       ├── Founder.tsx               # Section 7
│       └── Contact.tsx               # Section 8
├── lib/
│   └── content.ts                    # Centralized strings/copy as typed constants
├── public/
│   └── (assets to be added later)
├── next.config.js                    # output: 'export', security headers (dev only)
├── tailwind.config.ts                # Design tokens
├── tsconfig.json                     # TS strict config
├── postcss.config.js                 # Tailwind/Autoprefixer
├── package.json
└── README.md                         # Build & deploy instructions
```

**Notes on decomposition:**
- One file per section keeps each concern isolated and reviewable.
- `lib/content.ts` centralizes copy so future copy edits don't require touching layout.
- `ui/` primitives prevent duplication across capability/market card grids.
- Security headers in `next.config.js` apply only to `next dev`; for static export, the production headers must also be set in `_headers` (Cloudflare Pages convention) — included in Task 4.

---

## Validation Gates Between Phases

| Gate | Command | Pass Criteria |
|---|---|---|
| Type check | `npx tsc --noEmit` | Zero errors |
| Lint | `npm run lint` | Zero errors, zero warnings |
| Build | `npm run build` | Exits 0, produces `out/` directory |
| Dev server | `npm run dev` | Starts on :3000, page renders |
| Visual check | Playwright browser at :3000 | All sections render, no console errors |
| Bundle budget | Inspect `out/_next/static/chunks/` | Initial JS < 250KB |

---

## Commit Message Convention

All commits to the parent repo at `/Users/cavslee/Projects/JAG/` MUST be prefixed with `[01_website]` for clear workstream identification. The parent repo will eventually contain commits for `02_email/`, `03_inception/`, and other workstreams.

**Format:** `[01_website] <Imperative summary in sentence case>`

**Examples:**

- `[01_website] Initialize Next.js scaffold with TypeScript and Tailwind`
- `[01_website] Add design system tokens to tailwind.config.ts`
- `[01_website] Implement Hero section component`
- `[01_website] Configure security headers via public/_headers`

Every commit step in this plan already conforms to this convention.

---

## Phase 0 — Project Initialization

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `postcss.config.js`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `next-env.d.ts`, `.eslintrc.json`

- [ ] **Step 1: Verify clean working directory**

```bash
cd /Users/cavslee/Projects/JAG/01_website && ls -la
```

Expected: only `.claude/` directory present (and `docs/` from this plan).

- [ ] **Step 2: Run create-next-app with the exact flags**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --no-turbo
```

Expected: project scaffolded; if prompted to overwrite `.gitignore`, say no (parent project already has one).

- [ ] **Step 3: Verify scaffold**

```bash
ls -la /Users/cavslee/Projects/JAG/01_website && cat /Users/cavslee/Projects/JAG/01_website/package.json
```

Expected: `app/`, `package.json`, `next.config.js`, `tailwind.config.ts`, `tsconfig.json` exist. `next` version 14.x in dependencies.

- [ ] **Step 4: Smoke-test build**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npm run build
```

Expected: Build succeeds, "Generating static pages" output, no errors.

- [ ] **Step 5: Commit scaffold**

```bash
cd /Users/cavslee/Projects/JAG && git add 01_website/ && git commit -m "[01_website] Initialize Next.js 14 scaffold with TypeScript and Tailwind"
```

---

### Task 2: Install additional dependencies

**Files:** Modify `package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npm install framer-motion@^11 lucide-react@^0.400.0
```

Expected: both packages added; no peer-dep warnings beyond expected.

- [ ] **Step 2: Verify versions**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npm ls framer-motion lucide-react next react react-dom typescript tailwindcss
```

Expected: framer-motion 11.x, lucide-react 0.400+, next 14.x, react 18.x, typescript 5.x, tailwindcss 3.x.

- [ ] **Step 3: Commit dependencies**

```bash
cd /Users/cavslee/Projects/JAG && git add 01_website/package.json 01_website/package-lock.json && git commit -m "[01_website] Add framer-motion and lucide-react dependencies"
```

---

### Task 3: Configure next.config.js for static export + security headers

**Files:** Modify `next.config.js`

- [ ] **Step 1: Backup existing file**

```bash
cp /Users/cavslee/Projects/JAG/01_website/next.config.js /Users/cavslee/Projects/JAG/01_website/next.config.js.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Replace next.config.js with this exact content**

```javascript
/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.jag-cybersecurity.io",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://api.jag-cybersecurity.io",
    ].join('; '),
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Note: headers() does not run for static export. These are dev-only.
  // Production headers are set via public/_headers for Cloudflare Pages.
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

module.exports = nextConfig;
```

- [ ] **Step 3: Create public/_headers for Cloudflare Pages**

Create `public/_headers` with this content:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://api.jag-cybersecurity.io; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://api.jag-cybersecurity.io
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

- [ ] **Step 4: Verify build still passes**

```bash
cd /Users/cavslee/Projects/JAG/01_website && rm -rf .next out && npm run build
```

Expected: build succeeds; `out/` directory created; `out/_headers` present.

- [ ] **Step 5: Commit**

```bash
cd /Users/cavslee/Projects/JAG && git add 01_website/next.config.js 01_website/public/_headers && git commit -m "[01_website] Configure static export and security headers via public/_headers"
```

---

### Task 4: Configure Tailwind with design tokens

**Files:** Modify `tailwind.config.ts`, `app/globals.css`

- [ ] **Step 1: Backup existing files**

```bash
cd /Users/cavslee/Projects/JAG/01_website && cp tailwind.config.ts tailwind.config.ts.backup-$(date +%Y%m%d-%H%M%S) && cp app/globals.css app/globals.css.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Replace tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A1628',
          secondary: '#111E32',
          elevated: '#1A2B47',
          deep: '#050D1A',
        },
        border: { DEFAULT: '#1E2F4A' },
        text: {
          primary: '#E8EEF7',
          secondary: '#8A9CB5',
          tertiary: '#5A6B85',
        },
        accent: {
          DEFAULT: '#00D9FF',
          hover: '#33E1FF',
          glow: 'rgba(0, 217, 255, 0.15)',
        },
        metric: {
          green: '#00FF9F',
          amber: '#FFB800',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        container: '1200px',
        content: '720px',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Replace app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --section-padding: clamp(4rem, 8vw, 8rem);
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-bg-primary text-text-primary font-sans antialiased;
  }
  *:focus-visible {
    @apply outline-none ring-2 ring-accent ring-offset-2 ring-offset-bg-primary;
  }
}

@layer utilities {
  .section-padding-y {
    padding-top: var(--section-padding);
    padding-bottom: var(--section-padding);
  }
  .text-balance {
    text-wrap: balance;
  }
}
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
cd /Users/cavslee/Projects/JAG && git add 01_website/tailwind.config.ts 01_website/app/globals.css && git commit -m "[01_website] Add design system tokens to tailwind.config.ts and global styles"
```

---

## Phase 1 — Layout & Foundation

### Task 5: Configure fonts and root layout

**Files:** Modify `app/layout.tsx`

- [ ] **Step 1: Backup**

```bash
cp /Users/cavslee/Projects/JAG/01_website/app/layout.tsx /Users/cavslee/Projects/JAG/01_website/app/layout.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Replace app/layout.tsx**

```typescript
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JAG Cybersecurity | Agentic AI Cybersecurity. Runs On-Device.',
  description:
    'Standalone Agentic AI cybersecurity for sovereign and data-sensitive organizations. Runs entirely on-device with zero cloud dependency. Built on NVIDIA Jetson edge AI.',
  keywords:
    'agentic AI cybersecurity, edge AI security, sovereign cybersecurity, on-device threat detection, NVIDIA Jetson cybersecurity, zero-trust AI, autonomous cyber defense',
  metadataBase: new URL('https://www.jag-cybersecurity.io'),
  openGraph: {
    title: 'JAG Cybersecurity | Agentic AI Cybersecurity',
    description:
      "World's first standalone Agentic AI cybersecurity platform. Runs entirely on-device.",
    url: 'https://www.jag-cybersecurity.io',
    siteName: 'JAG Cybersecurity',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-bg-primary text-text-primary">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Build to verify font loading**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npm run build
```

Expected: build succeeds; fonts referenced in CSS output.

- [ ] **Step 4: Commit**

```bash
cd /Users/cavslee/Projects/JAG && git add 01_website/app/layout.tsx && git commit -m "[01_website] Configure root layout with Google Fonts and metadata"
```

---

### Task 6: Generate text-based favicon

**Files:** Create `app/icon.tsx`, `app/apple-icon.tsx`. Delete `app/favicon.ico` (default scaffold) if present so `app/icon.tsx` becomes the source of truth.

- [ ] **Step 1: Remove default favicon to avoid conflict with icon.tsx**

```bash
cd /Users/cavslee/Projects/JAG/01_website && rm -f app/favicon.ico
```

Expected: file removed silently, or no-op if not present.

- [ ] **Step 2: Create app/icon.tsx (32x32 favicon, JAG text on accent background)**

```typescript
import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#00D9FF',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
          color: '#0A1628',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '-0.05em',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        JAG
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 3: Create app/apple-icon.tsx (180x180 Apple touch icon)**

```typescript
import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#00D9FF',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '22%',
          color: '#0A1628',
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: '-0.05em',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        JAG
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 4: Build and verify generated icons exist**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npm run build && ls -la out/icon.png out/apple-icon.png 2>/dev/null || find out -maxdepth 2 -name "*icon*"
```

Expected: build succeeds; PNG icons present in `out/` (Next.js may name them `icon.png`, `apple-icon.png`, or with content hashes — both are acceptable).

- [ ] **Step 5: Commit**

```bash
cd /Users/cavslee/Projects/JAG && git add 01_website/app/icon.tsx 01_website/app/apple-icon.tsx && git rm --ignore-unmatch -f 01_website/app/favicon.ico && git commit -m "[01_website] Generate text-based favicon and Apple touch icon"
```

> **Note:** This is a Phase 1 placeholder. Replace with the official JAG brand asset in a later phase by removing `app/icon.tsx` / `app/apple-icon.tsx` and adding the brand-approved `favicon.ico`, `apple-icon.png`, and OG image to `app/`.

---

### Task 7: Create centralized content module

**Files:** Create `lib/content.ts`

- [ ] **Step 1: Create lib/content.ts**

```typescript
export const HERO = {
  headlineLine1: 'Agentic AI Cybersecurity.',
  headlineLine2: 'Runs On-Device.',
  subTagline:
    "World's first standalone Agentic AI cybersecurity for sovereign and data-sensitive organizations. Runs entirely on-device — zero cloud dependency, zero data exfiltration, zero-trust by design — on the NVIDIA Jetson edge AI platform.",
  primaryCta: { label: 'Request Demo', href: '#contact' },
  secondaryCta: { label: 'See How It Works', href: '#pipeline' },
} as const;

export const THREATS = {
  header: 'The AI-fication of Cyber Threats Has Begun.',
  lead:
    'The threat landscape has transformed. Attackers now deploy AI to generate polymorphic malware, craft personalized social engineering at scale, automate vulnerability discovery, and evade detection with unprecedented sophistication. Conventional firewalls — built for signature matching and rule-based defense — were not designed for this adversary.',
  cards: [
    {
      title: 'The Sovereignty Gap',
      body:
        'Cloud-dependent security routes sensitive telemetry through foreign data centers, creating regulatory exposure, exfiltration risk, and unacceptable latency for real-time defense.',
    },
    {
      title: 'The Legacy Stack',
      body:
        'Signature-based firewalls and human-in-the-loop SOCs cannot match the speed of AI-driven attacks. By the time an alert reaches an analyst, the breach has occurred.',
    },
    {
      title: 'The Skills Shortage',
      body:
        'Organizations worldwide face a chronic cybersecurity talent gap, leaving defense operations understaffed and reactive rather than proactive.',
    },
    {
      title: 'The Attack Surface Explosion',
      body:
        'IoT, OT convergence, edge computing, and distributed work have created expanding attack surfaces that centralized cloud security cannot protect effectively.',
    },
  ],
  transition: 'JAG was built for this new reality.',
} as const;

export const SOLUTION = {
  header: 'Cybersecurity That Thinks at the Edge.',
  lead:
    'JAG (Jetson-AI-Guard) is a standalone Agentic AI cybersecurity platform built for sovereign and data-sensitive organizations. Every component — threat detection, decision-making, autonomous response, AI validation — runs entirely on-device. No cloud calls. No data exfiltration. No compromise.',
  capabilities: [
    {
      icon: 'Radar',
      title: 'Real-Time Threat Detection',
      body:
        'Multi-stage inference pipeline analyzes network traffic at line speed. Detects known and unknown attack patterns, zero-day behaviors, and AI-generated threats.',
    },
    {
      icon: 'Zap',
      title: 'Autonomous Response',
      body:
        'AI-driven decision engine automatically blocks, quarantines, or escalates threats with sub-5-second time-to-block — no human bottleneck required.',
    },
    {
      icon: 'Eye',
      title: 'AI Validation Watchdog',
      body:
        'Proprietary validation layer prevents AI hallucinations from triggering false actions. Patent-protected technology ensuring 0% false positive rate in live testing.',
    },
    {
      icon: 'Lock',
      title: 'Sovereign by Design',
      body:
        'Runs entirely on-device with zero cloud dependency. Your data never leaves your network. Compliance-ready for data sovereignty mandates across sectors.',
    },
  ],
  metrics: [
    { value: '10/10', label: 'Attack types blocked in red team' },
    { value: '5 sec', label: 'Time-to-block on real-world attacks' },
    { value: '0%', label: 'False positive rate' },
    { value: '310/310', label: 'Unit tests passing' },
  ],
  metricsCaption: 'Validated in controlled red team exercise, April 2026.',
} as const;

export const PIPELINE = {
  header: 'Five-Stage Tiered Inference Pipeline.',
  lead:
    "JAG's patented architecture routes every packet through five escalating inference tiers — fast decisions at the edge, deep analysis where it matters.",
  stages: [
    {
      label: 'PACKET',
      title: 'Packet Analysis',
      body:
        'Wire-speed inspection of network packets. Immediate blocking of known malicious signatures and protocol violations.',
    },
    {
      label: 'GUARDIAN',
      title: 'Guardian Layer',
      body:
        'Rule-based behavioral analysis. Detects reconnaissance, scanning patterns, and policy violations at kernel level with iptables-grade performance.',
    },
    {
      label: 'CPU LLM',
      title: 'CPU LLM Analysis',
      body:
        'Lightweight language model analyzes ambiguous traffic for contextual threats. Sub-second classification of anomalies.',
    },
    {
      label: 'GPU LLM',
      title: 'GPU LLM Deep Inference',
      body:
        'Foundation-Sec-8B cybersecurity-specialized large language model performs deep threat analysis on GPU. Reasoning about novel attack patterns, social engineering, and multi-stage intrusions.',
    },
    {
      label: 'ACTION',
      title: 'Autonomous Action',
      body:
        'AI Validation Watchdog gates every decision. Validated actions execute automatically: block, quarantine, alert, or escalate based on severity and confidence.',
    },
  ],
} as const;

export const TECHNOLOGY = {
  header: 'Edge AI, Purpose-Built for Cybersecurity.',
  edgeAi: {
    icon: 'Cpu',
    title: 'Edge AI Foundation',
    body:
      'JAG is purpose-built on the NVIDIA Jetson Orin NX 16GB platform, leveraging GPU-accelerated inference for real-time threat analysis. The complete cybersecurity intelligence stack — including a cybersecurity-specialized large language model — runs natively on-device, consuming under 15W of power.',
  },
  aiSafety: {
    icon: 'ShieldCheck',
    title: 'AI Safety Layer',
    body:
      'Every autonomous decision passes through the AI Validation Watchdog — a patent-protected safety layer that prevents AI hallucinations from triggering false positives. Our Prompt Shield technology blocks 71+ known injection patterns, hardening the AI itself against manipulation.',
  },
  innovationStatement:
    "JAG's core technology is protected by a multi-patent portfolio covering Agentic AI cybersecurity, edge inference, and AI safety. International filings in preparation.",
  compliance: {
    subHeader: 'Standards-Aligned. Audit-Ready.',
    badges: [
      ['NIST CSF 2.0', 'ISO 27001:2022', 'SOC 2 Type II'],
      ['OWASP LLM Top 10', 'ISA 18.2', 'IEC 62443'],
      ['EU AI Act', 'NIST AI RMF 1.0', 'GDPR / PDPA'],
    ],
    caption:
      'JAG is designed to align with leading global cybersecurity, AI governance, and data protection standards.',
  },
} as const;

export const MARKETS = {
  header: 'Built for Sovereign and Data-Sensitive Organizations.',
  cards: [
    {
      icon: 'Building2',
      title: 'Banking & Financial Services',
      body: 'Real-time fraud detection and insider threat defense without cloud data exposure.',
    },
    {
      icon: 'RadioTower',
      title: 'Telecommunications',
      body: 'Protect core network infrastructure and subscriber data at edge speed.',
    },
    {
      icon: 'Factory',
      title: 'Critical Infrastructure',
      body:
        'Energy grids, water utilities, transportation systems — where downtime is not an option.',
    },
    {
      icon: 'Flag',
      title: 'Government & Sovereign Agencies',
      body: 'National security-grade AI defense that never sends data offshore.',
    },
    {
      icon: 'HeartPulse',
      title: 'Healthcare & Research',
      body:
        'Protect patient data and research IP with compliance-ready sovereign architecture.',
    },
    {
      icon: 'Server',
      title: 'Enterprise & Industrial IoT',
      body: 'Secure the expanding edge — OT networks, IoT fleets, and distributed operations.',
    },
  ],
} as const;

export const FOUNDER = {
  header: 'Built by a Serial Founder. Engineered for Scale.',
  name: 'Kelvin Lee',
  title: 'Founder & Chief Architect',
  bio: [
    "Kelvin is the founder and chief architect of JAG Cybersecurity. Over the past two decades, he has successfully co-founded and scaled three technology companies — two of which were acquired by investors — and continues to actively lead operations across Singapore and Malaysia.",
    "With deep expertise spanning edge computing, AI systems architecture, and cybersecurity engineering, Kelvin personally designed and implemented JAG's full stack: from kernel-level network inspection through GPU-accelerated AI inference and autonomous response orchestration.",
    'JAG represents over 12 months of dedicated engineering work, resulting in a production-validated platform tested in controlled red team exercises.',
  ],
  linkedinHref: '#',
} as const;

export const CONTACT = {
  header: 'Get in Touch.',
  lead:
    "Interested in a demo, partnership, or investment conversation? We'd like to hear from you.",
  endpoint: 'https://api.jag-cybersecurity.io/contact',
  emailFallback: 'connect@jag-cybersecurity.io',
  successMessage: "Message received. We'll respond within 48 hours.",
  errorMessage: 'Unable to send. Please email connect@jag-cybersecurity.io directly.',
  interestOptions: [
    'Request Demo',
    'Partnership Inquiry',
    'Investment Discussion',
    'General Inquiry',
  ],
  direct: {
    general: 'connect@jag-cybersecurity.io',
    founder: 'kelvin@jag-cybersecurity.io',
    location: 'Penang, Malaysia / Southeast Asia Headquarters',
    linkedinHref: '#',
  },
} as const;

export const NAV = {
  links: [
    { label: 'Solution', href: '#solution' },
    { label: 'Technology', href: '#technology' },
    { label: 'Markets', href: '#markets' },
    { label: 'Contact', href: '#contact' },
  ],
  cta: { label: 'Request Demo', href: '#contact' },
} as const;

export const FOOTER = {
  tagline:
    'Agentic AI Cybersecurity that runs on-device. Built for sovereign and data-sensitive organizations.',
  navLinks: [
    { label: 'Solution', href: '#solution' },
    { label: 'Technology', href: '#technology' },
    { label: 'Markets', href: '#markets' },
    { label: 'Contact', href: '#contact' },
  ],
  copyright: '© 2026 JAG Cybersecurity. All rights reserved.',
  patentNote: 'Patents filed with MyIPO. International filings in preparation.',
  general: 'connect@jag-cybersecurity.io',
  location: 'Penang, Malaysia',
  linkedinHref: '#',
} as const;
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/cavslee/Projects/JAG && git add 01_website/lib/content.ts && git commit -m "[01_website] Add centralized content module with all section copy"
```

---

### Task 8: Build UI primitive components

**Files:** Create `components/ui/Container.tsx`, `components/ui/SectionHeader.tsx`, `components/ui/Card.tsx`, `components/ui/FadeInOnScroll.tsx`, `components/ui/MetricCounter.tsx`

- [ ] **Step 1: Create components/ui/Container.tsx**

```typescript
import { ReactNode } from 'react';

export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-container px-6 md:px-10 ${className}`}>{children}</div>
  );
}
```

- [ ] **Step 2: Create components/ui/SectionHeader.tsx**

```typescript
import { ReactNode } from 'react';

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  align?: 'left' | 'center';
}) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-content ${alignClass}`}>
      {eyebrow && (
        <p className="font-mono text-sm uppercase tracking-widest text-accent mb-4">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary text-balance leading-tight">
        {title}
      </h2>
      {lead && <p className="mt-6 text-lg text-text-secondary leading-relaxed">{lead}</p>}
    </div>
  );
}
```

- [ ] **Step 3: Create components/ui/Card.tsx**

```typescript
import { ReactNode } from 'react';

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-bg-secondary p-6 md:p-8 transition-colors duration-200 hover:bg-bg-elevated hover:border-accent/30 ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create components/ui/FadeInOnScroll.tsx**

```typescript
'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

export function FadeInOnScroll({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5: Create components/ui/MetricCounter.tsx**

```typescript
'use client';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function parseNumeric(value: string): { num: number; suffix: string; prefix: string } | null {
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] };
}

export function MetricCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const reduce = useReducedMotion();
  const parsed = parseNumeric(value);
  const [display, setDisplay] = useState(parsed && !reduce ? `${parsed.prefix}0${parsed.suffix}` : value);

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

  return (
    <div ref={ref} className="text-center">
      <motion.div
        className="font-mono text-4xl md:text-5xl font-medium text-accent tabular-nums"
        initial={reduce ? false : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {display}
      </motion.div>
      <p className="mt-3 text-sm text-text-secondary leading-snug">{label}</p>
    </div>
  );
}
```

- [ ] **Step 6: Type-check**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 7: Commit**

```bash
cd /Users/cavslee/Projects/JAG && git add 01_website/components/ui/ && git commit -m "[01_website] Add UI primitive components (Container, SectionHeader, Card, FadeInOnScroll, MetricCounter)"
```

---

### Task 9: Build Navigation component

**Files:** Create `components/Navigation.tsx`

- [ ] **Step 1: Create components/Navigation.tsx**

```typescript
'use client';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV } from '@/lib/content';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled ? 'bg-bg-primary/85 backdrop-blur border-b border-border' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-container px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#hero" className="font-display font-bold text-xl text-text-primary tracking-tight">
          JAG<span className="text-accent">.</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {NAV.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={NAV.cta.href}
            className="ml-2 inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg-primary hover:bg-accent-hover transition-colors"
          >
            {NAV.cta.label}
          </a>
        </div>
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="md:hidden text-text-primary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-border bg-bg-primary">
          <div className="mx-auto max-w-container px-6 py-4 flex flex-col gap-3">
            {NAV.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2 text-text-secondary hover:text-text-primary"
              >
                {link.label}
              </a>
            ))}
            <a
              href={NAV.cta.href}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg-primary"
            >
              {NAV.cta.label}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/cavslee/Projects/JAG && git add 01_website/components/Navigation.tsx && git commit -m "[01_website] Implement sticky responsive Navigation component"
```

---

### Task 10: Build Footer component

**Files:** Create `components/Footer.tsx`

- [ ] **Step 1: Create components/Footer.tsx**

```typescript
import { Linkedin, Mail, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { FOOTER } from '@/lib/content';

export function Footer() {
  return (
    <footer className="bg-bg-deep border-t border-border mt-12">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="font-display font-bold text-xl text-text-primary tracking-tight">
              JAG<span className="text-accent">.</span>
            </div>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed max-w-sm">
              {FOOTER.tagline}
            </p>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {FOOTER.navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary mb-4">
              Connect
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>
                <a
                  href={FOOTER.linkedinHref}
                  className="inline-flex items-center gap-2 hover:text-accent transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} /> LinkedIn
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <Mail size={16} className="text-text-tertiary" />
                <a href={`mailto:${FOOTER.general}`} className="hover:text-accent transition-colors">
                  {FOOTER.general}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-text-tertiary" /> {FOOTER.location}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-text-tertiary">
          <p>{FOOTER.copyright}</p>
          <p>{FOOTER.patentNote}</p>
        </div>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/cavslee/Projects/JAG && git add 01_website/components/Footer.tsx && git commit -m "[01_website] Implement Footer with navigation and contact links"
```

---

## Phase 2 — Section Components

> **Note for sections:** After each section task, the section is wired into `app/page.tsx` only at Task 20 (page assembly). Each section task ends with a type-check + commit. A visual gate is performed once after Task 20.

### Task 11: Hero section

**Files:** Create `components/sections/Hero.tsx`

- [ ] **Step 1: Create components/sections/Hero.tsx**

```typescript
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { HERO } from '@/lib/content';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,217,255,0.10), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 30%, rgba(0,217,255,0.06), transparent 60%)',
        }}
      />
      <Container>
        <div className="max-w-4xl">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-[1.05]">
            <span className="block text-text-primary">{HERO.headlineLine1}</span>
            <span className="block text-accent">{HERO.headlineLine2}</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-text-secondary leading-relaxed max-w-3xl">
            {HERO.subTagline}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href={HERO.primaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-medium text-bg-primary hover:bg-accent-hover transition-colors"
            >
              {HERO.primaryCta.label} <ArrowRight size={18} />
            </a>
            <a
              href={HERO.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3 font-medium text-text-primary hover:bg-bg-secondary hover:border-accent/40 transition-colors"
            >
              {HERO.secondaryCta.label}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit && cd /Users/cavslee/Projects/JAG && git add 01_website/components/sections/Hero.tsx && git commit -m "[01_website] Implement Hero section"
```

---

### Task 12: Threats section

**Files:** Create `components/sections/Threats.tsx`

- [ ] **Step 1: Create components/sections/Threats.tsx**

```typescript
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { THREATS } from '@/lib/content';

export function Threats() {
  return (
    <section id="threats" className="section-padding-y bg-bg-primary">
      <Container>
        <FadeInOnScroll>
          <SectionHeader
            eyebrow="The New Threat Landscape"
            title={THREATS.header}
            lead={THREATS.lead}
          />
        </FadeInOnScroll>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {THREATS.cards.map((card, i) => (
            <FadeInOnScroll key={card.title} delay={i * 0.05}>
              <Card className="h-full">
                <h3 className="font-display text-lg font-bold text-text-primary mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">{card.body}</p>
              </Card>
            </FadeInOnScroll>
          ))}
        </div>
        <FadeInOnScroll>
          <p className="mt-16 text-center italic text-lg text-accent">{THREATS.transition}</p>
        </FadeInOnScroll>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit && cd /Users/cavslee/Projects/JAG && git add 01_website/components/sections/Threats.tsx && git commit -m "[01_website] Implement Threats section with gap analysis grid"
```

---

### Task 13: Solution section

**Files:** Create `components/sections/Solution.tsx`

- [ ] **Step 1: Create components/sections/Solution.tsx**

```typescript
import { Radar, Zap, Eye, Lock, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { MetricCounter } from '@/components/ui/MetricCounter';
import { SOLUTION } from '@/lib/content';

const ICONS: Record<string, LucideIcon> = { Radar, Zap, Eye, Lock };

export function Solution() {
  return (
    <section id="solution" className="section-padding-y bg-bg-secondary/30">
      <Container>
        <FadeInOnScroll>
          <SectionHeader
            eyebrow="Introducing JAG"
            title={SOLUTION.header}
            lead={SOLUTION.lead}
          />
        </FadeInOnScroll>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SOLUTION.capabilities.map((cap, i) => {
            const Icon = ICONS[cap.icon];
            return (
              <FadeInOnScroll key={cap.title} delay={i * 0.05}>
                <Card className="h-full">
                  {Icon && (
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                      <Icon size={20} />
                    </div>
                  )}
                  <h3 className="font-display text-lg font-bold text-text-primary mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{cap.body}</p>
                </Card>
              </FadeInOnScroll>
            );
          })}
        </div>
        <FadeInOnScroll>
          <div className="mt-20 rounded-xl border border-border bg-bg-secondary p-8 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {SOLUTION.metrics.map((m) => (
                <MetricCounter key={m.label} value={m.value} label={m.label} />
              ))}
            </div>
            <p className="mt-8 text-center text-xs text-text-tertiary">
              {SOLUTION.metricsCaption}
            </p>
          </div>
        </FadeInOnScroll>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit && cd /Users/cavslee/Projects/JAG && git add 01_website/components/sections/Solution.tsx && git commit -m "[01_website] Implement Solution section with capabilities and metrics bar"
```

---

### Task 14: Pipeline section

**Files:** Create `components/sections/Pipeline.tsx`

- [ ] **Step 1: Create components/sections/Pipeline.tsx**

```typescript
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { PIPELINE } from '@/lib/content';

export function Pipeline() {
  return (
    <section id="pipeline" className="section-padding-y bg-bg-primary">
      <Container>
        <FadeInOnScroll>
          <SectionHeader
            eyebrow="How It Works"
            title={PIPELINE.header}
            lead={PIPELINE.lead}
          />
        </FadeInOnScroll>
        <FadeInOnScroll>
          <div
            className="mt-12 overflow-x-auto"
            role="img"
            aria-label="Pipeline stages: Packet, Guardian, CPU LLM, GPU LLM, Action"
          >
            <div className="flex items-center gap-3 min-w-max px-2 py-4">
              {PIPELINE.stages.map((s, i) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="rounded-md border border-accent/40 bg-accent/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent shadow-[0_0_24px_rgba(0,217,255,0.15)]">
                    {s.label}
                  </div>
                  {i < PIPELINE.stages.length - 1 && <ChevronRight size={16} className="text-accent/60" />}
                </div>
              ))}
            </div>
          </div>
        </FadeInOnScroll>
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {PIPELINE.stages.map((s, i) => (
            <FadeInOnScroll key={s.title} delay={i * 0.04}>
              <li className="rounded-xl border border-border bg-bg-secondary p-6 h-full">
                <div className="font-mono text-xs text-accent mb-2">0{i + 1}</div>
                <h3 className="font-display text-base font-bold text-text-primary mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">{s.body}</p>
              </li>
            </FadeInOnScroll>
          ))}
        </ol>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit && cd /Users/cavslee/Projects/JAG && git add 01_website/components/sections/Pipeline.tsx && git commit -m "[01_website] Implement Pipeline section with five-stage diagram"
```

---

### Task 15: Technology section (incl. Compliance)

**Files:** Create `components/sections/Technology.tsx`

- [ ] **Step 1: Create components/sections/Technology.tsx**

```typescript
import { Cpu, ShieldCheck, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { TECHNOLOGY } from '@/lib/content';

const ICONS: Record<string, LucideIcon> = { Cpu, ShieldCheck };

export function Technology() {
  const EdgeIcon = ICONS[TECHNOLOGY.edgeAi.icon];
  const SafetyIcon = ICONS[TECHNOLOGY.aiSafety.icon];

  return (
    <section id="technology" className="section-padding-y bg-bg-secondary/30">
      <Container>
        <FadeInOnScroll>
          <SectionHeader
            eyebrow="Technology & Innovation"
            title={TECHNOLOGY.header}
          />
        </FadeInOnScroll>
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <FadeInOnScroll>
            <div className="rounded-xl border border-border bg-bg-secondary p-8">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                <EdgeIcon size={20} />
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-3">
                {TECHNOLOGY.edgeAi.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">{TECHNOLOGY.edgeAi.body}</p>
            </div>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.05}>
            <div className="rounded-xl border border-border bg-bg-secondary p-8">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                <SafetyIcon size={20} />
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-3">
                {TECHNOLOGY.aiSafety.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">{TECHNOLOGY.aiSafety.body}</p>
            </div>
          </FadeInOnScroll>
        </div>
        <FadeInOnScroll>
          <p className="mt-12 text-center text-sm text-text-tertiary max-w-content mx-auto">
            {TECHNOLOGY.innovationStatement}
          </p>
        </FadeInOnScroll>

        <div className="mt-24">
          <FadeInOnScroll>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-text-primary text-center">
              {TECHNOLOGY.compliance.subHeader}
            </h3>
          </FadeInOnScroll>
          <FadeInOnScroll>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {TECHNOLOGY.compliance.badges.flat().map((badge) => (
                <div
                  key={badge}
                  className="rounded-md border border-border bg-bg-secondary px-4 py-3 text-center font-mono text-xs uppercase tracking-wider text-text-secondary"
                >
                  {badge}
                </div>
              ))}
            </div>
          </FadeInOnScroll>
          <FadeInOnScroll>
            <p className="mt-8 text-center text-xs text-text-tertiary max-w-content mx-auto">
              {TECHNOLOGY.compliance.caption}
            </p>
          </FadeInOnScroll>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit && cd /Users/cavslee/Projects/JAG && git add 01_website/components/sections/Technology.tsx && git commit -m "[01_website] Implement Technology and Compliance section"
```

---

### Task 16: Markets section

**Files:** Create `components/sections/Markets.tsx`

- [ ] **Step 1: Create components/sections/Markets.tsx**

```typescript
import {
  Building2,
  RadioTower,
  Factory,
  Flag,
  HeartPulse,
  Server,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { MARKETS } from '@/lib/content';

const ICONS: Record<string, LucideIcon> = {
  Building2,
  RadioTower,
  Factory,
  Flag,
  HeartPulse,
  Server,
};

export function Markets() {
  return (
    <section id="markets" className="section-padding-y bg-bg-primary">
      <Container>
        <FadeInOnScroll>
          <SectionHeader eyebrow="Who We Serve" title={MARKETS.header} />
        </FadeInOnScroll>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MARKETS.cards.map((card, i) => {
            const Icon = ICONS[card.icon];
            return (
              <FadeInOnScroll key={card.title} delay={i * 0.04}>
                <Card className="h-full">
                  {Icon && (
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                      <Icon size={20} />
                    </div>
                  )}
                  <h3 className="font-display text-lg font-bold text-text-primary mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{card.body}</p>
                </Card>
              </FadeInOnScroll>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit && cd /Users/cavslee/Projects/JAG && git add 01_website/components/sections/Markets.tsx && git commit -m "[01_website] Implement Markets section with six market cards"
```

---

### Task 17: Founder section

**Files:** Create `components/sections/Founder.tsx`

- [ ] **Step 1: Create components/sections/Founder.tsx**

```typescript
import { Linkedin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { FOUNDER } from '@/lib/content';

export function Founder() {
  return (
    <section id="founder" className="section-padding-y bg-bg-secondary/30">
      <Container>
        <FadeInOnScroll>
          <SectionHeader title={FOUNDER.header} />
        </FadeInOnScroll>
        <div className="mt-16 grid gap-12 md:grid-cols-5 items-start">
          <FadeInOnScroll className="md:col-span-2 flex justify-center md:justify-start">
            <div
              aria-label={`Portrait placeholder for ${FOUNDER.name}`}
              className="h-56 w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-gradient-to-br from-accent/30 to-accent/5 border border-accent/30 flex items-center justify-center shadow-[0_0_60px_rgba(0,217,255,0.15)]"
            >
              <span className="font-display text-7xl font-bold text-accent">K</span>
            </div>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.1} className="md:col-span-3">
            <h3 className="font-display text-3xl font-bold text-text-primary">{FOUNDER.name}</h3>
            <p className="mt-2 text-accent font-medium">{FOUNDER.title}</p>
            <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
              {FOUNDER.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <a
              href={FOUNDER.linkedinHref}
              className="mt-8 inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors"
            >
              <Linkedin size={18} /> Connect on LinkedIn →
            </a>
          </FadeInOnScroll>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit && cd /Users/cavslee/Projects/JAG && git add 01_website/components/sections/Founder.tsx && git commit -m "[01_website] Implement Founder section"
```

---

### Task 18: Contact section

**Files:** Create `components/sections/Contact.tsx`

- [ ] **Step 1: Create components/sections/Contact.tsx**

```typescript
'use client';
import { useState, FormEvent } from 'react';
import { Mail, MapPin, Linkedin, User } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { CONTACT } from '@/lib/content';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if ((data.get('honeypot') as string)?.length) {
      setStatus('success');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(CONTACT.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          organization: data.get('organization'),
          interest: data.get('interest'),
          message: data.get('message'),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="section-padding-y bg-bg-primary">
      <Container>
        <FadeInOnScroll>
          <SectionHeader eyebrow="Contact" title={CONTACT.header} lead={CONTACT.lead} />
        </FadeInOnScroll>
        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          <FadeInOnScroll className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-border bg-bg-secondary p-6 md:p-8 space-y-5"
              noValidate
            >
              <input
                type="text"
                name="honeypot"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
              <Field label="Name" name="name" type="text" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Organization" name="organization" type="text" />
              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-text-primary mb-2">
                  Interest
                </label>
                <select
                  id="interest"
                  name="interest"
                  className="w-full rounded-md border border-border bg-bg-primary px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
                  defaultValue={CONTACT.interestOptions[0]}
                >
                  {CONTACT.interestOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                  Message <span className="text-accent">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full rounded-md border border-border bg-bg-primary px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none resize-y"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-medium text-bg-primary hover:bg-accent-hover transition-colors disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              {status === 'success' && (
                <p className="text-sm text-metric-green">{CONTACT.successMessage}</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-metric-amber">{CONTACT.errorMessage}</p>
              )}
            </form>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.1} className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-bg-secondary p-6 md:p-8 space-y-5">
              <h3 className="font-display text-lg font-bold text-text-primary">Direct Contact</h3>
              <ContactRow icon={<Mail size={16} />} label="General Inquiries" value={CONTACT.direct.general} href={`mailto:${CONTACT.direct.general}`} />
              <ContactRow icon={<User size={16} />} label="Founder Direct" value={CONTACT.direct.founder} href={`mailto:${CONTACT.direct.founder}`} />
              <ContactRow icon={<MapPin size={16} />} label="Location" value={CONTACT.direct.location} />
              <ContactRow icon={<Linkedin size={16} />} label="LinkedIn" value="JAG Cybersecurity" href={CONTACT.direct.linkedinHref} />
            </div>
          </FadeInOnScroll>
        </div>
      </Container>
    </section>
  );
}

function Field({
  label,
  name,
  type,
  required = false,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-text-primary mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-border bg-bg-primary px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
      />
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <span className="mt-1 text-text-tertiary">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-wider text-text-tertiary font-mono">{label}</p>
        <p className={`mt-1 text-sm ${href ? 'text-text-primary hover:text-accent transition-colors' : 'text-text-secondary'}`}>
          {value}
        </p>
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
```

- [ ] **Step 2: Type-check + commit**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit && cd /Users/cavslee/Projects/JAG && git add 01_website/components/sections/Contact.tsx && git commit -m "[01_website] Implement Contact section with form and direct contact panel"
```

---

## Phase 3 — Polish, Page Assembly & Validation

### Task 19: Polish — Card tone variants, glow shadow utilities, design-system audit

**Files:** Modify `components/ui/Card.tsx`, `tailwind.config.ts`, `components/sections/Threats.tsx`, `components/sections/Pipeline.tsx`. Audit all `components/sections/*.tsx` and `components/ui/*.tsx`.

**Rationale.** Mid-section checkpoint surfaced two design-system gaps that this task remediates before page assembly:

- **Issue A (mid-section checkpoint):** Threats cards reuse the default Card primitive and visually match Solution cards, contrary to the brief which calls for a "warning/concern" feel. Industry pattern (CrowdStrike, SentinelOne, Wiz) differentiates threat vs. solution cards.
- **Issue B (mid-section checkpoint):** Pipeline chip glow uses a hardcoded `shadow-[0_0_24px_rgba(0,217,255,0.15)]` that bypasses the `colors.accent.glow` design token. Future palette tweaks won't propagate.

This task gates Task 20 (page assembly) behind a clean primitive layer.

- [ ] **Step 19.1: Card primitive — `tone` prop**

Update `components/ui/Card.tsx` to accept a `tone` prop. Define type `CardTone = 'default' | 'concern' | 'success'` (extensible).

- `'default'` (current behaviour): `bg-bg-secondary`, `border-border`, hover-state cyan accent.
- `'concern'`: `bg-bg-secondary`, `border-l-4 border-metric-amber`, subtle muted background tint, icon colour shifts to amber on hover.
- `'success'`: `bg-bg-secondary`, `border-l-4 border-metric-green`, subtle success tint, icon colour shifts to green on hover.

Update `components/sections/Threats.tsx` to pass `tone="concern"` to each Card. Verify Solution and any other consumers still render with default tone unchanged.

- [ ] **Step 19.2: Tailwind shadow utilities — replace hardcoded glow**

Add to `tailwind.config.ts` under `theme.extend.boxShadow`:

```ts
boxShadow: {
  'glow-sm': '0 0 24px rgba(0, 217, 255, 0.15)',
  'glow-md': '0 0 48px rgba(0, 217, 255, 0.25)',
  'glow-lg': '0 0 72px rgba(0, 217, 255, 0.35)',
},
```

Replace `components/sections/Pipeline.tsx` chip class `shadow-[0_0_24px_rgba(0,217,255,0.15)]` with `shadow-glow-sm`. Add a brief comment block above the boxShadow utilities documenting the cyan-glow design intent.

- [ ] **Step 19.3: Design-system audit — hardcoded colour scan**

```bash
cd /Users/cavslee/Projects/JAG/01_website && grep -rE "rgba\(|hsl\(|#[0-9a-fA-F]{3,8}" components/sections/ components/ui/
```

For each finding, evaluate whether it should reference a design token. Refactor where reasonable. Report any findings deliberately kept as hardcoded along with the rationale (e.g. one-off Hero gradient stops). Verify zero design-token bypass remains in section files after the pass.

- [ ] **Step 19.4: Validation**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit && npm run build
```

Expected: zero TypeScript errors, zero new build warnings, bundle size unchanged within ±2 kB tolerance, no rendering changes from refactor (visual identity preserved).

- [ ] **Step 19.5: Commit**

```bash
cd /Users/cavslee/Projects/JAG && git add 01_website/components/ui/Card.tsx 01_website/tailwind.config.ts 01_website/components/sections/Threats.tsx 01_website/components/sections/Pipeline.tsx && git commit -m "[01_website] Polish: Card tone variants, glow shadow utilities, design system audit"
```

---

### Task 20: Assemble app/page.tsx

**Files:** Modify `app/page.tsx`

- [ ] **Step 1: Backup**

```bash
cp /Users/cavslee/Projects/JAG/01_website/app/page.tsx /Users/cavslee/Projects/JAG/01_website/app/page.tsx.backup-$(date +%Y%m%d-%H%M%S)
```

- [ ] **Step 2: Replace app/page.tsx**

```typescript
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/sections/Hero';
import { Threats } from '@/components/sections/Threats';
import { Solution } from '@/components/sections/Solution';
import { Pipeline } from '@/components/sections/Pipeline';
import { Technology } from '@/components/sections/Technology';
import { Markets } from '@/components/sections/Markets';
import { Founder } from '@/components/sections/Founder';
import { Contact } from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Threats />
        <Solution />
        <Pipeline />
        <Technology />
        <Markets />
        <Founder />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Type-check + lint + build**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npx tsc --noEmit && npm run lint && npm run build
```

Expected: all three succeed; `out/index.html` exists.

- [ ] **Step 4: Commit**

```bash
cd /Users/cavslee/Projects/JAG && git add 01_website/app/page.tsx && git commit -m "[01_website] Assemble single-page composition with all sections"
```

---

### Task 21: Local dev server smoke test

- [ ] **Step 1: Start dev server in background**

```bash
cd /Users/cavslee/Projects/JAG/01_website && npm run dev
```

(Run in background; wait for "Ready" message.)

- [ ] **Step 2: Verify page renders via Playwright**

Use Playwright MCP: navigate to `http://localhost:3000`, take a full-page snapshot, capture console messages.

Expected:
- All 8 sections present in snapshot
- No console errors (warnings about Strict Mode double-mount are OK)
- Sticky nav anchors scroll to correct sections

- [ ] **Step 3: Verify mobile breakpoint**

Use Playwright MCP: resize browser to 375px width, snapshot. Verify nav collapses, grids stack, no horizontal scroll.

- [ ] **Step 4: Stop dev server**

Kill the background bash shell.

- [ ] **Step 5: Bundle size check**

```bash
cd /Users/cavslee/Projects/JAG/01_website && du -sh out/_next/static/chunks/ && find out/_next/static/chunks -name "*.js" -exec ls -la {} \; | sort -k5 -n
```

Expected: total chunk size manageable; report the largest chunks. Flag if any single chunk exceeds 250KB.

---

### Task 22: Add README and finalize

**Files:** Create `README.md` (project root for website)

- [ ] **Step 1: Create README.md**

```markdown
# JAG Cybersecurity Website

Production marketing site for jag-cybersecurity.io. Single-page Next.js 14 static export, deployed to Cloudflare Pages.

## Local Development

\`\`\`bash
npm install
npm run dev    # http://localhost:3000
\`\`\`

## Build

\`\`\`bash
npm run build    # outputs to out/
\`\`\`

## Deploy

Output of \`npm run build\` (\`out/\` directory) is deployed to Cloudflare Pages. Production headers are configured via \`public/_headers\`.

## Stack

- Next.js 14 (App Router, static export)
- TypeScript (strict)
- Tailwind CSS 3.x
- Framer Motion (scroll-triggered fade only)
- Lucide React (icons)
- Fonts via next/font/google: Space Grotesk, Inter, JetBrains Mono

## Content

All copy lives in \`lib/content.ts\`. Update there, not in component JSX.

## Brand

- Primary background: #0A1628
- Accent: #00D9FF (electric cyan)
- See \`tailwind.config.ts\` for full design tokens.

## Forms

Contact form posts to \`https://api.jag-cybersecurity.io/contact\` (Cloudflare Worker, separate project at \`../02_email/\`).
```

- [ ] **Step 2: Final build verification**

```bash
cd /Users/cavslee/Projects/JAG/01_website && rm -rf .next out && npm run build && ls -la out/
```

Expected: clean build, `out/index.html` and `out/_headers` present.

- [ ] **Step 3: Commit**

```bash
cd /Users/cavslee/Projects/JAG && git add 01_website/README.md && git commit -m "[01_website] Add README with build and deploy instructions"
```

---

## Checkpoints for Founder Review

The plan is structured around three natural review checkpoints. **Stop and report at each.**

| Checkpoint | After Task | Reviewable Artifact |
|---|---|---|
| Foundation | Task 10 | Scaffold + config + favicon + nav + footer (no sections yet, but builds) |
| Sections | Task 18 | All 8 section components built (not yet wired into page) |
| Live | Task 21 | Full site running locally, Playwright snapshot reviewed |

## Phase 4 — Cloudflare Pages Deployment (Documented, Not Executed)

> **STATUS: DO NOT EXECUTE.** Phase 4 begins only when the founder explicitly says "begin Phase 4". Phase 3 must be fully complete and locally verified first. Phase 4 requires interactive participation (GitHub repo creation, Cloudflare dashboard, DNS propagation).

### Task 23: Receive GitHub repository URL from founder (manual handoff)

**Owner:** Founder. **Agent role:** Wait and confirm.

- [ ] **Step 1: Founder creates GitHub repo manually**

Founder creates a new GitHub repository (recommended name: `jag-monorepo` or `jag-cybersecurity`). Visibility per founder's preference (private recommended for pre-launch).

- [ ] **Step 2: Founder provides repo URL to agent**

Expected format: `git@github.com:<user>/<repo>.git` or `https://github.com/<user>/<repo>.git`.

- [ ] **Step 3: Agent confirms receipt and proceeds to Task 24**

No commit at this step.

---

### Task 24: Initialize git remote and push parent repo

**Files:** No file changes — git plumbing only. The parent repo at `/Users/cavslee/Projects/JAG/` is the source of truth; pushing it carries `01_website/` along with sibling workstreams.

- [ ] **Step 1: Verify clean working tree**

```bash
cd /Users/cavslee/Projects/JAG && git status
```

Expected: nothing to commit, working tree clean.

- [ ] **Step 2: Add the remote (replace `<URL>` with founder-provided value)**

```bash
cd /Users/cavslee/Projects/JAG && git remote add origin <URL>
git remote -v
```

Expected: `origin` listed for both fetch and push.

- [ ] **Step 3: Verify branch and push**

```bash
cd /Users/cavslee/Projects/JAG && git branch --show-current && git push -u origin main
```

Expected: pushes successfully; remote `main` now tracks local `main`.

- [ ] **Step 4: Verify on GitHub**

Founder confirms the repo on GitHub now contains `01_website/` (and sibling workstreams).

> **Note:** No new commit in this task. Pushing publishes existing commits.

---

### Task 25: Cloudflare Pages dashboard setup

**Owner:** Founder, with agent providing exact values to enter. Agent cannot click through dashboards.

- [ ] **Step 1: Create new Pages project**

In Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**. Authorize Cloudflare to access the GitHub repo and select the JAG repository.

- [ ] **Step 2: Configure build settings (use these exact values)**

| Field | Value |
|---|---|
| Production branch | `main` |
| Framework preset | `Next.js (Static HTML Export)` |
| Build command | `cd 01_website && npm install && npm run build` |
| Build output directory | `01_website/out` |
| Root directory (advanced) | `/` (leave default) |

- [ ] **Step 3: Set environment variables**

| Name | Value |
|---|---|
| `NODE_VERSION` | `20` |
| `NPM_FLAGS` | `--prefer-offline --no-audit` |

- [ ] **Step 4: Trigger first deploy**

Click **Save and Deploy**. Build runs in Cloudflare's environment.

- [ ] **Step 5: Verify build log**

Founder pastes the build log to agent if it fails. If success, note the auto-assigned `*.pages.dev` URL (e.g., `jag-cybersecurity.pages.dev`).

- [ ] **Step 6: Smoke-test the .pages.dev URL**

Agent uses Playwright to navigate to the `*.pages.dev` URL and confirms all 8 sections render. No commit.

---

### Task 26: Custom domain + Cloudflare DNS configuration

**Owner:** Founder, with agent providing record values.

- [ ] **Step 1: Add custom domain in Cloudflare Pages**

Pages project → **Custom domains** → **Set up a custom domain** → enter `jag-cybersecurity.io`. Cloudflare auto-creates the required CNAME because the zone is already on Cloudflare DNS.

- [ ] **Step 2: Add www subdomain**

Repeat for `www.jag-cybersecurity.io`.

- [ ] **Step 3: Verify DNS records in Cloudflare DNS dashboard**

Expected records (auto-created):

| Type | Name | Target | Proxy |
|---|---|---|---|
| CNAME | `jag-cybersecurity.io` (apex) | `<project>.pages.dev` | Proxied (orange cloud) |
| CNAME | `www` | `<project>.pages.dev` | Proxied (orange cloud) |

- [ ] **Step 4: Wait for SSL provisioning**

Cloudflare provisions Universal SSL automatically (1–15 minutes typically). Status visible in Pages → Custom domains.

- [ ] **Step 5: Verify HTTPS works**

```bash
curl -sI https://jag-cybersecurity.io/ | head -20
curl -sI https://www.jag-cybersecurity.io/ | head -20
```

Expected: `HTTP/2 200`, valid security headers from `_headers`.

- [ ] **Step 6: Set apex/www redirect preference**

Founder decides apex-canonical vs www-canonical. Configure a Cloudflare Bulk Redirect or Page Rule for the non-canonical to 301-redirect to canonical.

---

### Task 27: Production verification with Lighthouse

- [ ] **Step 1: Run Lighthouse against production URL**

```bash
npx -y lighthouse https://www.jag-cybersecurity.io --quiet --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=/tmp/lighthouse-jag.json
```

Or use PageSpeed Insights: `https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.jag-cybersecurity.io`.

- [ ] **Step 2: Verify scores meet target**

| Category | Target |
|---|---|
| Performance | ≥ 95 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |

If any score is below target, agent diagnoses (LCP image, missing alt text, render-blocking resources, etc.) and proposes fixes — does not silently mark complete.

- [ ] **Step 3: Verify security headers in production**

```bash
curl -sI https://www.jag-cybersecurity.io/ | grep -iE 'content-security|strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy'
```

Expected: all 6 headers present with the values defined in `public/_headers`.

- [ ] **Step 4: Final deploy report to founder**

Agent reports: production URL, Lighthouse scores, header verification, screenshot of homepage. No commit unless fixes required.

---

## Out of Scope (Phase 1)

- Patent portfolio section (HIDDEN per brief)
- Cloudflare Worker for contact form (separate project at `02_email/`)
- Real founder photo (placeholder K-initial used)
- Cloudflare Web Analytics integration (added post-deploy)
- OG image generation (text-based favicon used in Phase 1; brand asset integration is a Phase 1.5 follow-up)
- Real brand favicon (text-based JAG placeholder generated in Task 6)
