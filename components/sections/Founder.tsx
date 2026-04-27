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
              className="h-56 w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 rounded-full bg-gradient-to-br from-accent/30 to-accent/5 border border-accent/30 flex items-center justify-center shadow-glow-lg"
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
