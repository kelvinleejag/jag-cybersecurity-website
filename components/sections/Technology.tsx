import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { standards } from '@/lib/content';

export function Technology() {
  return (
    <section id="technology" className="bg-bg-base py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {standards.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[28ch] text-balance">
            {standards.headline}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.3}>
          <p className="mt-6 max-w-[65ch] text-body text-text-secondary">{standards.lede}</p>
        </FadeInOnScroll>
        <ul
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3"
          aria-label="Aligned cybersecurity, AI governance, and data protection frameworks"
        >
          {standards.frameworks.map((f, i) => (
            <li key={f}>
              <FadeInOnScroll delay={0.04 * i} className="block">
                <span className="block rounded-pill border border-border-default bg-bg-surface px-5 py-3 text-center font-mono text-xs sm:text-sm text-text-secondary transition-all duration-fast hover:border-border-strong hover:-translate-y-px">
                  {f}
                </span>
              </FadeInOnScroll>
            </li>
          ))}
        </ul>
        <FadeInOnScroll delay={0.5}>
          <p className="mt-8 text-xs text-text-tertiary text-center max-w-[70ch] mx-auto">
            {standards.caption}
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
