import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { ArchitectureDiagram } from '@/components/ui/ArchitectureDiagram';
import { architecture } from '@/lib/content';

export function Architecture() {
  return (
    <section id="architecture" className="bg-bg-base py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {architecture.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[28ch] text-balance">
            {architecture.headline}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.3}>
          <p className="mt-6 max-w-[65ch] text-body text-text-secondary">{architecture.lede}</p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.5}>
          <div className="mt-16">
            <ArchitectureDiagram />
          </div>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.7}>
          <p className="mt-6 font-mono text-xs text-text-tertiary text-center max-w-[70ch] mx-auto">
            {architecture.caption}
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
