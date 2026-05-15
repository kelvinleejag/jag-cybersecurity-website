import Image from 'next/image';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { architecture } from '@/lib/content';

export function Architecture() {
  return (
    <section id="architecture" className="py-section">
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
          <div className="mt-16 rounded-2xl overflow-hidden border border-border-default bg-bg-surfaceMuted shadow-glow-md">
            <Image
              src="/assets/architecture-overview.png"
              alt="JAG Agentic AI Cybersecurity Gateway architecture: untrusted internet on the left connects via wired or wireless to the central JAG-powered NVIDIA Jetson Orin NX module — running Edge AI Processing, Adaptive Threat Management, and Intelligent Gateway layers — which then secures workstations, IoT systems, IP surveillance, and industrial control/SCADA/PLC devices on the internal network."
              width={1920}
              height={1080}
              className="w-full h-auto"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority={false}
            />
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
