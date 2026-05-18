import Image from 'next/image';
import { BrowserChrome } from '@/components/ui/BrowserChrome';
import { SectionAnchor } from '@/components/ui/SectionAnchor';
import { dashboard } from '@/lib/content';

export function Dashboard() {
  return (
    <SectionAnchor
      id="dashboard"
      eyebrow={dashboard.eyebrow}
      headline={dashboard.headline}
      lede={dashboard.lede}
    >
      <BrowserChrome tab={dashboard.image.chromeTab}>
        <Image
          src={dashboard.image.src}
          alt={dashboard.image.alt}
          width={3420}
          height={1968}
          className="w-full h-auto"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority={false}
        />
      </BrowserChrome>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboard.captions.map((c) => (
          <div key={c.label}>
            <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand-cyan">
              {c.label}
            </p>
            <p className="mt-2 text-body text-text-secondary leading-body">{c.text}</p>
          </div>
        ))}
      </div>
    </SectionAnchor>
  );
}
