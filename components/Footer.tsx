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
          <p className="text-xs text-text-tertiary">
            © 2026 JAG Cybersecurity Sdn Bhd · Penang, Malaysia · All rights reserved.
          </p>
          <p className="text-xs text-text-tertiary flex items-center gap-3">
            <Linkedin className="h-4 w-4" aria-hidden />
            Operations: Malaysia · Holdco: Singapore
          </p>
        </div>
      </div>
    </footer>
  );
}
