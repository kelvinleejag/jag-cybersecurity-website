import {
  Building2,
  RadioTower,
  Factory,
  Flag,
  HeartPulse,
  Server,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { MARKETS } from '@/lib/content';

const ICONS: Record<string, LucideIcon> = {
  Building2,
  RadioTower,
  Factory,
  Flag,
  HeartPulse,
  Server,
};

export function Markets() {
  return (
    <section id="markets" className="section-padding-y bg-bg-primary">
      <Container>
        <FadeInOnScroll>
          <SectionHeader eyebrow="Who We Serve" title={MARKETS.header} />
        </FadeInOnScroll>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MARKETS.cards.map((card, i) => {
            const Icon = ICONS[card.icon];
            return (
              <FadeInOnScroll key={card.title} delay={i * 0.04}>
                <Card className="h-full">
                  {Icon && (
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                      <Icon size={20} />
                    </div>
                  )}
                  <h3 className="font-display text-lg font-bold text-text-primary mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{card.body}</p>
                </Card>
              </FadeInOnScroll>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
