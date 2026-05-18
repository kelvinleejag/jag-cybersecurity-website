import Image from 'next/image';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { BrowserChrome } from '@/components/ui/BrowserChrome';
import { SectionAnchor } from '@/components/ui/SectionAnchor';
import { LayerStack } from '@/components/ui/LayerStack';
import { architecture } from '@/lib/content';

export function Architecture() {
  return (
    <SectionAnchor
      id="architecture"
      eyebrow={architecture.eyebrow}
      headline={architecture.headline}
      lede={architecture.lede}
    >
      {/* OUTSIDE VIEW — JAG positioned between untrusted internet and protected devices */}
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
      <p className="mt-6 font-mono text-xs text-text-tertiary text-center max-w-[70ch] mx-auto">
        {architecture.caption}
      </p>

      {/* INSIDE VIEW — 5 defense layers within the device */}
      <BrowserChrome tab="five-layers.spec" className="mt-16">
        <div className="p-6 md:p-10">
          <LayerStack />
        </div>
      </BrowserChrome>

      {/* CLOSING — defensible moat statement (absorbed from FiveLayers) */}
      <FadeInOnScroll delay={0.5}>
        <div className="mt-16 bg-bg-surfaceMuted border-y border-border-default py-12 -mx-gutter px-gutter">
          <p className="text-center font-display text-h3 font-semibold text-text-primary">
            {architecture.closing.title}
          </p>
          <p className="mt-3 text-center text-body text-text-secondary max-w-[60ch] mx-auto">
            {architecture.closing.body}
          </p>
        </div>
      </FadeInOnScroll>
    </SectionAnchor>
  );
}
