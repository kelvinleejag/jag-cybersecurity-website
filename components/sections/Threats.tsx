import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { ThreatTimeline } from '@/components/ui/ThreatTimeline';
import { threatLandscape } from '@/lib/content';
import { ShieldOff, AlertTriangle, Users, Network, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = { ShieldOff, AlertTriangle, Users, Network };

export function Threats() {
  return (
    <section id="threats" className="py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {threatLandscape.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[24ch] text-balance">
            {threatLandscape.headline}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.3}>
          <p className="mt-6 max-w-[65ch] text-body text-text-secondary">{threatLandscape.lede}</p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.45}>
          <div className="mt-12">
            <ThreatTimeline />
          </div>
        </FadeInOnScroll>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {threatLandscape.cards.map((c, i) => {
            const Icon = ICONS[c.icon];
            return (
              <FadeInOnScroll key={c.title} delay={0.1 * i}>
                <article className="group relative rounded-lg bg-bg-surface border border-border-default p-7 transition-all duration-base ease-standard hover:-translate-y-1 hover:border-border-strong hover:shadow-cardHover overflow-hidden h-full">
                  <span
                    className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-brand-cyan to-transparent transition-all duration-base ease-standard group-hover:w-full"
                    aria-hidden="true"
                  />
                  <Icon className="h-8 w-8 text-brand-cyan" aria-hidden="true" />
                  <h3 className="mt-6 font-display text-h3 font-semibold text-text-primary leading-heading tracking-heading">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-body text-text-secondary leading-body">{c.body}</p>
                </article>
              </FadeInOnScroll>
            );
          })}
        </div>
        <FadeInOnScroll delay={0.5}>
          <p className="mt-16 text-center italic text-text-tertiary">{threatLandscape.closing}</p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
