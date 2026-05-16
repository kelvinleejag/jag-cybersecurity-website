import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { PipelineFunnel } from '@/components/ui/PipelineFunnel';
import { pipeline } from '@/lib/content';

const TONE: Record<string, string> = {
  cyanDeep: 'border-brand-cyanDeep',
  cyan: 'border-brand-cyan',
  cyanBright: 'border-brand-cyanBright shadow-glow-sm',
};

export function Pipeline() {
  return (
    <section id="pipeline" className="py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {pipeline.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[28ch] text-balance">
            {pipeline.headline}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.3}>
          <p className="mt-6 max-w-[65ch] text-body text-text-secondary">{pipeline.lede}</p>
        </FadeInOnScroll>

        {/* Desktop horizontal flow with animated SVG connecting lines */}
        <div className="relative mt-16 hidden lg:block">
          <svg
            className="absolute inset-x-0 top-1/2 -z-0 h-2 w-full -translate-y-1/2"
            viewBox="0 0 1200 8"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={120 + i * 240}
                y1="4"
                x2={360 + i * 240}
                y2="4"
                stroke="#22D3EE"
                strokeWidth="1"
                strokeOpacity="0.4"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                className="animate-draw-stroke"
                style={{ animationDelay: `${i * 300}ms` }}
              />
            ))}
          </svg>
          <ol className="relative grid grid-cols-5 gap-4">
            {pipeline.stages.map((s, i) => (
              <li key={s.step}>
                <FadeInOnScroll delay={0.15 * i} className={`relative block bg-bg-surface border ${TONE[s.tone]} rounded-lg p-6 h-full`}>
                  <p className="font-mono text-h2 font-semibold text-brand-cyan leading-none">
                    {s.step}
                  </p>
                  <h3 className="mt-4 font-display text-h3 font-semibold text-text-primary leading-heading tracking-heading">
                    {s.title}
                  </h3>
                  <p className="mt-2 font-mono text-xs text-text-tertiary">{s.tagline}</p>
                  <p className="mt-4 text-sm text-text-secondary leading-body">{s.detail}</p>
                </FadeInOnScroll>
              </li>
            ))}
          </ol>
        </div>

        {/* Mobile vertical stack */}
        <ol className="mt-16 grid gap-4 lg:hidden">
          {pipeline.stages.map((s, i) => (
            <li key={s.step}>
              <FadeInOnScroll delay={0.1 * i} className={`block bg-bg-surface border ${TONE[s.tone]} rounded-lg p-6`}>
                <p className="font-mono text-h2 font-semibold text-brand-cyan leading-none">{s.step}</p>
                <h3 className="mt-4 font-display text-h3 font-semibold text-text-primary leading-heading tracking-heading">
                  {s.title}
                </h3>
                <p className="mt-2 font-mono text-xs text-text-tertiary">{s.tagline}</p>
                <p className="mt-4 text-sm text-text-secondary leading-body">{s.detail}</p>
              </FadeInOnScroll>
            </li>
          ))}
        </ol>

        <FadeInOnScroll delay={0.5}>
          <div className="mt-16">
            <PipelineFunnel />
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.6}>
          <p className="mt-10 text-center italic text-text-tertiary max-w-[70ch] mx-auto">
            {pipeline.caption}
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
