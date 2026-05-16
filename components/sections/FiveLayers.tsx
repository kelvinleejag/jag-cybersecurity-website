import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { LayerCard } from '@/components/ui/LayerCard';
import { LayerStack } from '@/components/ui/LayerStack';
import { fiveLayers } from '@/lib/content';

export function FiveLayers() {
  return (
    <section id="five-layers" className="py-section">
      <div className="mx-auto max-w-container px-gutter">
        <FadeInOnScroll>
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
            {fiveLayers.eyebrow}
          </p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.15}>
          <h2 className="mt-3 font-display text-h2 font-semibold text-text-primary leading-heading tracking-heading max-w-[28ch] text-balance">
            {fiveLayers.headline}
          </h2>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.3}>
          <p className="mt-6 max-w-[65ch] text-body text-text-secondary">{fiveLayers.lede}</p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.45}>
          <div className="mt-12">
            <LayerStack />
          </div>
        </FadeInOnScroll>
        <ol className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {fiveLayers.layers.map((l, i) => (
            <li
              key={l.step}
              className={i === 4 ? 'md:col-span-2 md:max-w-[calc(50%-12px)] md:mx-auto md:w-full' : ''}
            >
              <FadeInOnScroll delay={0.08 * i} className="block h-full">
                <LayerCard {...l} />
              </FadeInOnScroll>
            </li>
          ))}
        </ol>
        <FadeInOnScroll delay={0.5}>
          <div className="mt-16 bg-bg-surfaceMuted border-y border-border-default py-12 -mx-gutter px-gutter">
            <p className="text-center font-display text-h3 font-semibold text-text-primary">
              {fiveLayers.closing.title}
            </p>
            <p className="mt-3 text-center text-body text-text-secondary max-w-[60ch] mx-auto">
              {fiveLayers.closing.body}
            </p>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
