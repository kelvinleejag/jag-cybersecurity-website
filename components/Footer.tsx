import Link from 'next/link';
import Image from 'next/image';

const COLS = [
  {
    title: 'Solution',
    links: [
      { href: '#threats', label: 'Threat Landscape' },
      { href: '#solution', label: 'Capabilities' },
      { href: '#dashboard', label: 'Guardian Dashboard' },
    ],
  },
  {
    title: 'Technology',
    links: [
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
      { href: 'mailto:jag@jag-cybersecurity.io', label: 'jag@' },
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
            <Link href="/" aria-label="JAG Cybersecurity — home" className="inline-flex items-center">
              <Image
                src="/assets/jag-logo.webp"
                alt="JAG Cybersecurity"
                width={96}
                height={105}
                className="h-24 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-text-tertiary max-w-[28ch]">
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
        <div className="mt-16 border-t border-border-subtle pt-8">
          <p className="text-xs text-text-tertiary">© 2026 JAGuardian</p>
        </div>
      </div>
    </footer>
  );
}
