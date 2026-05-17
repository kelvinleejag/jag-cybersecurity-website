import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { BrandTile } from '@/components/ui/BrandTile';
import { BrowserChrome } from '@/components/ui/BrowserChrome';
import { SectionAnchor } from '@/components/ui/SectionAnchor';
import { LayerStratigraphyTile } from '@/components/ui/tiles/LayerStratigraphyTile';
import { LayerCard } from '@/components/ui/LayerCard';
import { LayerStack } from '@/components/ui/LayerStack';
import { fiveLayers } from '@/lib/content';

export function FiveLayers() {
  return (
    <SectionAnchor
      id="five-layers"
      tile={
        <BrandTile size="md">
          <LayerStratigraphyTile />
        </BrandTile>
      }
      eyebrow={fiveLayers.eyebrow}
      headline={fiveLayers.headline}
      lede={fiveLayers.lede}
    >
      <BrowserChrome tab="five-layers.spec">
        <div className="p-6 md:p-10">
          <LayerStack />
        </div>
      </BrowserChrome>
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
    </SectionAnchor>
  );
}
