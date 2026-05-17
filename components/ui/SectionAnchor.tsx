import type { ReactNode } from 'react';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';

interface SectionAnchorProps {
  id: string;
  tile?: ReactNode;
  eyebrow?: string;
  headline: ReactNode;
  lede?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * SectionAnchor — centered section-opener primitive for the 4 non-hero
 * narrative anchors (Threats, Architecture, FiveLayers, Founder).
 *
 * Composition: tile? -> eyebrow? -> headline (h2, displayAnchor) ->
 * lede? -> full-width children slot. Text column constrained to
 * max-w-anchor (720px); children slot uses full container width.
 *
 * Hero is NOT a consumer of this primitive — its composition is more
 * complex (HeroWave backdrop, glow-bloom, CTA pair, trust band) and
 * gets a manual rewrite using the same new tokens.
 */
export function SectionAnchor({
  id,
  tile,
  eyebrow,
  headline,
  lede,
  children,
  className = '',
}: SectionAnchorProps) {
  return (
    <section id={id} className={['py-section', className].join(' ')}>
      <div className="mx-auto max-w-container px-gutter">
        <div className="mx-auto max-w-anchor text-center">
          {tile && (
            <FadeInOnScroll>
              <div className="flex justify-center">{tile}</div>
            </FadeInOnScroll>
          )}
          {eyebrow && (
            <FadeInOnScroll delay={0.1}>
              <p
                className={[
                  'font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan',
                  tile ? 'mt-8' : '',
                ].join(' ')}
              >
                {eyebrow}
              </p>
            </FadeInOnScroll>
          )}
          <FadeInOnScroll delay={0.2}>
            <h2
              className={[
                'text-displayAnchor font-display font-semibold text-text-primary text-balance',
                eyebrow || tile ? 'mt-6' : '',
              ].join(' ')}
            >
              {headline}
            </h2>
          </FadeInOnScroll>
          {lede && (
            <FadeInOnScroll delay={0.4}>
              <p className="mt-6 text-lede text-text-secondary max-w-[65ch] mx-auto">
                {lede}
              </p>
            </FadeInOnScroll>
          )}
        </div>
        {children && (
          <FadeInOnScroll delay={0.5}>
            <div className="mt-16">{children}</div>
          </FadeInOnScroll>
        )}
      </div>
    </section>
  );
}

export default SectionAnchor;
