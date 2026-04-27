import { Radar, Zap, Eye, Lock, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { MetricCounter } from '@/components/ui/MetricCounter';
import { SOLUTION } from '@/lib/content';

const ICONS: Record<string, LucideIcon> = { Radar, Zap, Eye, Lock };

export function Solution() {
  return (
    <section id="solution" className="section-padding-y bg-bg-secondary/30">
      <Container>
        <FadeInOnScroll>
          <SectionHeader
            eyebrow="Introducing JAG"
            title={SOLUTION.header}
            lead={SOLUTION.lead}
          />
        </FadeInOnScroll>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SOLUTION.capabilities.map((cap, i) => {
            const Icon = ICONS[cap.icon];
            return (
              <FadeInOnScroll key={cap.title} delay={i * 0.05}>
                <Card className="h-full">
                  {Icon && (
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                      <Icon size={20} />
                    </div>
                  )}
                  <h3 className="font-display text-lg font-bold text-text-primary mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{cap.body}</p>
                </Card>
              </FadeInOnScroll>
            );
          })}
        </div>
        <FadeInOnScroll>
          <div className="mt-20 rounded-xl border border-border bg-bg-secondary p-8 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {SOLUTION.metrics.map((m) => (
                <MetricCounter key={m.label} value={m.value} label={m.label} />
              ))}
            </div>
            <p className="mt-8 text-center text-xs text-text-tertiary">
              {SOLUTION.metricsCaption}
            </p>
          </div>
        </FadeInOnScroll>
      </Container>
    </section>
  );
}
