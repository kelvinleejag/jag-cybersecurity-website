import Image from 'next/image';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { BrandTile } from '@/components/ui/BrandTile';
import { BrowserChrome } from '@/components/ui/BrowserChrome';
import { SectionAnchor } from '@/components/ui/SectionAnchor';
import { ConcentricRingsTile } from '@/components/ui/tiles/ConcentricRingsTile';
import { architecture } from '@/lib/content';

export function Architecture() {
  return (
    <SectionAnchor
      id="architecture"
      tile={
        <BrandTile size="md">
          <ConcentricRingsTile />
        </BrandTile>
      }
      eyebrow={architecture.eyebrow}
      headline={architecture.headline}
      lede={architecture.lede}
    >
      <BrowserChrome tab="architecture-overview.svg">
        <Image
          src="/assets/architecture-overview.webp"
          alt="JAG Agentic AI Cybersecurity Gateway architecture: untrusted internet on the left connects via wired or wireless to the central JAG-powered NVIDIA Jetson Orin NX module — running Edge AI Processing, Adaptive Threat Management, and Intelligent Gateway layers — which then secures workstations, IoT systems, IP surveillance, and industrial control/SCADA/PLC devices on the internal network."
          width={1920}
          height={1080}
          className="w-full h-auto"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority={false}
        />
      </BrowserChrome>
      <FadeInOnScroll delay={0.7}>
        <p className="mt-6 font-mono text-xs text-text-tertiary text-center max-w-[70ch] mx-auto">
          {architecture.caption}
        </p>
      </FadeInOnScroll>
    </SectionAnchor>
  );
}
