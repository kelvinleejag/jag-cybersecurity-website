import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { THREATS } from '@/lib/content';

export function Threats() {
  return (
    <section id="threats" className="section-padding-y bg-bg-primary">
      <Container>
        <FadeInOnScroll>
          <SectionHeader
            eyebrow="The New Threat Landscape"
            title={THREATS.header}
            lead={THREATS.lead}
          />
        </FadeInOnScroll>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {THREATS.cards.map((card, i) => (
            <FadeInOnScroll key={card.title} delay={i * 0.05}>
              <Card tone="concern" className="h-full">
                <h3 className="font-display text-lg font-bold text-text-primary mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">{card.body}</p>
              </Card>
            </FadeInOnScroll>
          ))}
        </div>
        <FadeInOnScroll>
          <p className="mt-16 text-center italic text-lg text-accent">{THREATS.transition}</p>
        </FadeInOnScroll>
      </Container>
    </section>
  );
}
