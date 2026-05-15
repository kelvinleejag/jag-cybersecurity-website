'use client';

import { useState } from 'react';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { contactSection } from '@/lib/content';
import { Mail, User, MapPin, Linkedin, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = { Mail, User, MapPin, Linkedin };

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get('website')) {
      // Honeypot tripped — pretend success silently.
      setStatus('sent');
      return;
    }
    try {
      const res = await fetch(contactSection.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {contactSection.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading text-balance">
            {contactSection.headline}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.3}>
          <p className="mt-6 max-w-[65ch] text-body text-text-secondary">{contactSection.lede}</p>
        </FadeInOnScroll>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-12">
          <FadeInOnScroll className="md:col-span-3 block">
            <form onSubmit={onSubmit} className="space-y-5">
              <input type="text" name="website" tabIndex={-1} aria-hidden="true" className="hidden" autoComplete="off" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="block">
                  <span className="text-sm text-text-tertiary">Name</span>
                  <input
                    name="name"
                    required
                    className="mt-1 block w-full rounded-md bg-bg-surface border border-border-default px-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-brand-cyan focus:shadow-glow-sm transition-all duration-fast"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-text-tertiary">Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1 block w-full rounded-md bg-bg-surface border border-border-default px-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-brand-cyan focus:shadow-glow-sm transition-all duration-fast"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm text-text-tertiary">Organization (optional)</span>
                <input
                  name="organization"
                  className="mt-1 block w-full rounded-md bg-bg-surface border border-border-default px-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-brand-cyan focus:shadow-glow-sm transition-all duration-fast"
                />
              </label>
              <label className="block">
                <span className="text-sm text-text-tertiary">Interest</span>
                <select
                  name="interest"
                  required
                  className="mt-1 block w-full rounded-md bg-bg-surface border border-border-default px-4 py-3 text-text-primary focus:outline-none focus:border-brand-cyan focus:shadow-glow-sm transition-all duration-fast"
                >
                  {contactSection.interests.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-text-tertiary">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="mt-1 block w-full rounded-md bg-bg-surface border border-border-default px-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-brand-cyan focus:shadow-glow-sm transition-all duration-fast"
                />
              </label>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full md:w-auto inline-flex items-center justify-center rounded-md bg-brand-cyan px-7 py-3 text-base font-semibold text-text-onAccent hover:bg-brand-cyanBright active:scale-[0.97] transition-all duration-fast disabled:opacity-60"
              >
                {status === 'idle' && 'Send Message'}
                {status === 'sending' && 'Sending…'}
                {status === 'sent' && 'Message Sent ✓'}
                {status === 'error' && 'Retry'}
              </button>
              {status === 'error' && (
                <p role="alert" className="text-sm text-brand-red">
                  Could not send. Please email connect@jag-cybersecurity.io directly.
                </p>
              )}
            </form>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.2} className="md:col-span-2 block">
            <ul className="rounded-lg border border-border-default bg-bg-surface p-7 space-y-6 list-none">
              {contactSection.direct.map((d) => {
                const Icon = ICONS[d.icon];
                const inner = (
                  <>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
                      <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-cyan">{d.label}</p>
                    </div>
                    <p className="mt-2 text-body text-text-secondary">{d.value}</p>
                  </>
                );
                return (
                  <li key={d.label}>
                    {d.href ? (
                      <a href={d.href} target={d.href.startsWith('http') ? '_blank' : undefined} rel={d.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="block hover:text-text-primary transition-colors duration-fast">
                        {inner}
                      </a>
                    ) : (
                      <div>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}
