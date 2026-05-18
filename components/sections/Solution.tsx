import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { CapabilityIcon } from '@/components/ui/CapabilityIcon';
import { capabilities } from '@/lib/content';

// Map content icon-keys to the bespoke CapabilityIcon kinds.
const KIND_BY_ICON: Record<string, 'detection' | 'response' | 'watchdog' | 'sovereign'> = {
  Activity: 'detection',
  Zap: 'response',
  Eye: 'watchdog',
  Lock: 'sovereign',
};

export function Solution() {
  return (
    <section id="solution" className="py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {capabilities.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[24ch] text-balance">
            {capabilities.headline}
          </h2>
        </FadeInOnScroll>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.cards.map((c, i) => {
            const kind = KIND_BY_ICON[c.icon] ?? 'detection';
            return (
              <FadeInOnScroll key={c.title} delay={0.1 * i}>
                <article className="group relative rounded-lg bg-bg-surface border border-border-default p-8 transition-all duration-base ease-standard hover:-translate-y-1 hover:border-border-strong hover:shadow-cardHover overflow-hidden h-full">
                  <span
                    className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-brand-cyan to-transparent transition-all duration-base ease-standard group-hover:w-full"
                    aria-hidden="true"
                  />
                  <CapabilityIcon kind={kind} className="h-20 w-32" />
                  <h3 className="mt-6 font-display text-h3 font-semibold text-text-primary leading-heading tracking-heading">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-body text-text-secondary leading-body">{c.body}</p>
                </article>
              </FadeInOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
