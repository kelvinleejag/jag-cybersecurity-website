'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '#solution', label: 'Solution' },
  { href: '#pipeline', label: 'Technology' },
  { href: '#markets', label: 'Markets' },
  { href: '#contact', label: 'Contact' },
];

export default function Navigation() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > lastY.current && y > 120) setHidden(true);
        else setHidden(false);
        lastY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-base ease-standard ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="border-b border-border-default backdrop-blur-md bg-bg-base/80">
        <nav className="mx-auto flex max-w-container items-center justify-between px-gutter py-4">
          <Link href="/" className="font-display text-xl font-semibold tracking-tight">
            <span className="text-text-primary">JAG</span>
            <span className="text-brand-cyan">.</span>
          </Link>
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-fast"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="hidden md:inline-flex items-center rounded-md bg-brand-cyan px-5 py-2 text-sm font-semibold text-text-onAccent hover:bg-brand-cyanBright transition-colors duration-fast"
          >
            Request Demo
          </a>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            className="md:hidden text-text-primary"
            onClick={() => setOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </nav>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-bg-base transition-transform duration-base ease-standard md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-gutter py-4 border-b border-border-default">
          <span className="font-display text-xl font-semibold">
            <span className="text-text-primary">JAG</span>
            <span className="text-brand-cyan">.</span>
          </span>
          <button
            type="button"
            aria-label="Close menu"
            className="text-text-primary"
            onClick={() => setOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col gap-6 px-gutter py-8">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-2xl text-text-primary hover:text-brand-cyan transition-colors duration-fast"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="inline-flex items-center rounded-md bg-brand-cyan px-5 py-3 text-base font-semibold text-text-onAccent"
              onClick={() => setOpen(false)}
            >
              Request Demo
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
