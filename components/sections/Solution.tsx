import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { ProofBar } from '@/components/ui/ProofBar';
import { capabilities } from '@/lib/content';
import { Activity, Zap, Eye, Lock, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = { Activity, Zap, Eye, Lock };

export function Solution() {
  return (
    <>
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
              const Icon = ICONS[c.icon];
              return (
                <FadeInOnScroll key={c.title} delay={0.1 * i}>
                  <article className="group relative rounded-lg bg-bg-surface border border-border-default p-8 transition-all duration-base ease-standard hover:-translate-y-1 hover:border-border-strong hover:shadow-cardHover overflow-hidden h-full">
                    <span
                      className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-brand-cyan to-transparent transition-all duration-base ease-standard group-hover:w-full"
                      aria-hidden="true"
                    />
                    <Icon className="h-9 w-9 text-brand-cyan" aria-hidden="true" />
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
      <ProofBar />
    </>
  );
}
