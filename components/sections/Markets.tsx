import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { markets } from '@/lib/content';
import { Banknote, Radio, Zap, Landmark, HeartPulse, Factory, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = { Banknote, Radio, Zap, Landmark, HeartPulse, Factory };

export function Markets() {
  return (
    <section id="markets" className="py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {markets.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[28ch] text-balance">
            {markets.headline}
          </h2>
        </FadeInOnScroll>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.segments.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <FadeInOnScroll key={s.title} delay={0.08 * i}>
                <article className="group rounded-lg bg-bg-surface border border-border-default p-7 h-full transition-all duration-base ease-standard hover:border-border-strong hover:shadow-cardHover">
                  <Icon className="h-8 w-8 text-brand-cyan" aria-hidden="true" />
                  <h3 className="mt-6 font-display text-h3 font-semibold text-text-primary leading-heading tracking-heading">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-body text-text-secondary leading-body">{s.body}</p>
                </article>
              </FadeInOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
