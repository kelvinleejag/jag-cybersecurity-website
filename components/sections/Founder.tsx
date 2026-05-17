import Image from 'next/image';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { BrowserChrome } from '@/components/ui/BrowserChrome';
import { SectionAnchor } from '@/components/ui/SectionAnchor';
import { founder } from '@/lib/content';
import { Linkedin } from 'lucide-react';

export function Founder() {
  return (
    <SectionAnchor id="founder" headline={founder.headline}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2">
          <BrowserChrome tab="founder.credential" className="max-w-sm mx-auto md:mx-0">
            <div className="relative aspect-square">
              <Image
                src={founder.photo}
                alt={`Portrait of ${founder.name}, founder of JAG Cybersecurity`}
                width={640}
                height={640}
                priority
                className="object-cover w-full h-full"
              />
            </div>
          </BrowserChrome>
        </div>
        <FadeInOnScroll delay={0.2} className="md:col-span-3 block">
          <p className="font-display text-h3 font-semibold text-text-primary">{founder.name}</p>
          <p className="mt-1 font-mono text-sm text-brand-cyan">{founder.title}</p>
          <div className="mt-6 space-y-4">
            {founder.paragraphs.map((p) => (
              <p key={p.slice(0, 30)} className="text-body text-text-secondary leading-body max-w-[65ch]">
                {p}
              </p>
            ))}
          </div>
          <a
            href={founder.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-brand-cyan hover:text-brand-cyanBright active:scale-[0.97] transition-all duration-fast"
          >
            <Linkedin className="h-5 w-5" aria-hidden="true" />
            {founder.linkedin.label} →
          </a>
        </FadeInOnScroll>
      </div>
    </SectionAnchor>
  );
}
