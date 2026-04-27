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
