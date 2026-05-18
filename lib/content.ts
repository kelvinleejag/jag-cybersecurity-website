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
    "Kelvin is the founder and chief architect of JAG Cybersecurity. Over the past two decades, he has successfully co-founded and scaled three technology companies — two of which were acquired by investors.",
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
  emailFallback: 'jag@jag-cybersecurity.io',
  successMessage: "Message received. We'll respond within 48 hours.",
  errorMessage: 'Unable to send. Please email jag@jag-cybersecurity.io directly.',
  interestOptions: [
    'Request Demo',
    'Partnership Inquiry',
    'Investment Discussion',
    'General Inquiry',
  ],
  direct: {
    general: 'jag@jag-cybersecurity.io',
    founder: 'kelvin@jag-cybersecurity.io',
    location: '',
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
  patentNote: 'Six patents filed. International filings in preparation.',
  general: 'jag@jag-cybersecurity.io',
  location: '',
  linkedinHref: '#',
} as const;

export const hero = {
  eyebrow: 'SOVEREIGN AGENTIC AI',
  headlineLine1: 'Agentic AI Cybersecurity.',
  headlineLine2: 'Runs Entirely On-Device.',
  subhead:
    "JAG is the world's first standalone Agentic AI cybersecurity platform for sovereign and data-sensitive organizations. Every component — threat detection, decision-making, autonomous response, AI validation — runs entirely on the NVIDIA Jetson edge AI platform. No cloud calls. No data exfiltration. No compromise.",
  ctaPrimary: { label: 'Request a Demo', href: '#contact' },
  ctaSecondary: { label: 'See JAG Guardian', href: '#dashboard' },
  trust: ['NVIDIA Jetson Orin NX', 'Air-gap Capable', '6 Patents Pending', 'Sub-5-second Time-to-Block'],
} as const;

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
} as const;

export const architecture = {
  eyebrow: 'ARCHITECTURE',
  headline: 'One Sovereign Device. Five Defense Layers.',
  lede:
    'JAG sits inline between the untrusted internet and your protected network. Five patented defense layers — Enforce, Understand, Prove, Guard the AI, Adapt — work together inside a single NVIDIA Jetson Orin NX. Every packet inspected, classified, blocked at the edge or escalated to deeper inference.',
  destinations: [
    { icon: 'Monitor', label: 'Workstations' },
    { icon: 'Server', label: 'Servers & IoT' },
    { icon: 'Camera', label: 'IP Surveillance' },
    { icon: 'Factory', label: 'Industrial / SCADA / PLC' },
  ],
  jetsonLayers: ['Edge AI Processing', 'Adaptive Threat Management', 'Intelligent Gateway'],
  caption:
    'All inference, validation, and enforcement happens on the device. Zero cloud round-trips. Zero data exfiltration.',
  closing: {
    title: 'A Defensible Moat by Design',
    body:
      'Protected under a portfolio of 6 patents · 113 claims. The integrated architecture cannot be replicated without infringing.',
  },
} as const;

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
    'PDPA',
    'EU AI Act',
    'ISA 18.2',
    'IEC 62443',
    'NIST AI RMF 1.0',
  ],
  caption:
    'JAG is designed to align with leading global cybersecurity, AI governance, and data protection standards. Formal certifications in roadmap.',
} as const;

export const markets = {
  eyebrow: 'WHO WE SERVE',
  headline: 'Built for Sovereign and Data-Sensitive Organizations.',
  segments: [
    { icon: 'Banknote', title: 'Banking & Financial Services', body: 'Real-time fraud detection and insider threat defense without cloud data exposure.' },
    { icon: 'Radio', title: 'Telecommunications', body: 'Protect core network infrastructure and subscriber data at edge speed.' },
    { icon: 'Zap', title: 'Critical Infrastructure', body: 'Energy grids, water utilities, transportation systems — where downtime is not an option.' },
    { icon: 'Landmark', title: 'Government & Sovereign Agencies', body: 'National security-grade AI defense that never sends data offshore.' },
    { icon: 'HeartPulse', title: 'Healthcare & Research', body: 'Protect patient data and research IP with compliance-ready sovereign architecture.' },
    { icon: 'Factory', title: 'Enterprise & Industrial IoT', body: 'Secure the expanding edge — OT networks, IoT fleets, distributed operations.' },
  ],
} as const;

export const founder = {
  headline: 'Built by a Serial Founder. Engineered for Scale.',
  name: 'Kelvin Lee',
  title: 'Founder & Chief Architect',
  paragraphs: [
    'Kelvin is the founder and chief architect of JAG Cybersecurity. Over the past two decades, he has successfully co-founded and scaled three technology companies — two of which were acquired by investors.',
    "With deep expertise spanning edge computing, AI systems architecture, and cybersecurity engineering, Kelvin personally designed and implemented JAG's full stack: from kernel-level network inspection through GPU-accelerated AI inference and autonomous response orchestration.",
    'JAG represents over 12 months of dedicated engineering work, resulting in a production-validated platform tested in controlled red-team exercises.',
  ],
  linkedin: { url: 'https://www.linkedin.com/in/kelvinleeyl/', label: 'Connect on LinkedIn' },
  photo: '/assets/founder-photo.webp',
} as const;

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

export const contactSection = {
  eyebrow: 'CONTACT',
  headline: 'Get in Touch.',
  lede:
    "Interested in a demo, partnership, or investment conversation? We'd like to hear from you.",
  endpoint: 'https://api.jag-cybersecurity.io/contact',
  interests: ['Request Demo', 'Investor Inquiry', 'Partnership', 'Media', 'Other'],
  direct: [
    { label: 'GENERAL INQUIRIES', value: 'jag@jag-cybersecurity.io', icon: 'Mail', href: 'mailto:jag@jag-cybersecurity.io' },
    { label: 'FOUNDER DIRECT', value: 'kelvin@jag-cybersecurity.io', icon: 'User', href: 'mailto:kelvin@jag-cybersecurity.io' },
    { label: 'LINKEDIN', value: 'JAG Cybersecurity', icon: 'Linkedin', href: 'https://www.linkedin.com/company/jag-cybersecurity/' },
  ],
} as const;
