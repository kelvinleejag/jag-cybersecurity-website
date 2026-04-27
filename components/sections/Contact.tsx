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
