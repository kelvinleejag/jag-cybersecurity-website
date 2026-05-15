import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import ShieldSVG from '@/components/ui/ShieldSVG';
import { hero } from '@/lib/content';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-bg-base px-gutter pt-32 pb-section"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 animate-glow-bloom"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(34, 211, 238, 0.12) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 animate-pulse-glow"
        style={{ animationDelay: '1200ms' }}
      >
        <ShieldSVG animate size={560} />
      </div>
      <div className="relative mx-auto max-w-container text-center">
        <FadeInOnScroll delay={0.2}>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {hero.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.4}>
          <h1 className="mt-6 font-display text-hero font-semibold leading-display tracking-display text-balance">
            <span className="block text-text-primary">{hero.headlineLine1}</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #22D3EE 0%, #67E8F9 50%, #A5F3FC 100%)',
              }}
            >
              {hero.headlineLine2}
            </span>
          </h1>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.9}>
          <p className="mx-auto mt-8 max-w-[65ch] text-bodyLg text-text-secondary">
            {hero.subhead}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={1.1}>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={hero.ctaPrimary.href}
              className="inline-flex items-center justify-center rounded-md bg-brand-cyan px-7 py-3 text-base font-semibold text-text-onAccent hover:bg-brand-cyanBright active:scale-[0.97] transition-all duration-fast"
            >
              {hero.ctaPrimary.label} →
            </a>
            <a
              href={hero.ctaSecondary.href}
              className="inline-flex items-center justify-center rounded-md border border-brand-cyan px-7 py-3 text-base font-semibold text-brand-cyan hover:bg-brand-cyan/10 active:scale-[0.97] transition-all duration-fast"
            >
              {hero.ctaSecondary.label}
            </a>
          </div>
        </FadeInOnScroll>
        <FadeInOnScroll delay={1.3}>
          <p className="mt-14 font-mono text-xs text-text-quaternary flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            {hero.trust.map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true">·</span>}
                {t}
              </span>
            ))}
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
