import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { HERO } from '@/lib/content';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32"
    >
      {/*
        Hero ambient gradient — intentionally bypasses shadow-glow utilities.
        This is a structural composition (page atmosphere), not a reusable
        glow effect. If a second similar treatment is added elsewhere,
        extract to a Tailwind component plugin. Until then, inline is correct.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,217,255,0.10), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 30%, rgba(0,217,255,0.06), transparent 60%)',
        }}
      />
      <Container>
        <div className="max-w-4xl">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-[1.05]">
            <span className="block text-text-primary">{HERO.headlineLine1}</span>
            <span className="block text-accent">{HERO.headlineLine2}</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-text-secondary leading-relaxed max-w-3xl">
            {HERO.subTagline}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href={HERO.primaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-medium text-bg-primary hover:bg-accent-hover transition-colors"
            >
              {HERO.primaryCta.label} <ArrowRight size={18} />
            </a>
            <a
              href={HERO.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3 font-medium text-text-primary hover:bg-bg-secondary hover:border-accent/40 transition-colors"
            >
              {HERO.secondaryCta.label}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
