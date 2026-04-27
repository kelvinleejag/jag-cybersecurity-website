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
