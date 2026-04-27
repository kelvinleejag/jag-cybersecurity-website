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
