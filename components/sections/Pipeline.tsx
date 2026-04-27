import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInOnScroll } from '@/components/ui/FadeInOnScroll';
import { PIPELINE } from '@/lib/content';

export function Pipeline() {
  return (
    <section id="pipeline" className="section-padding-y bg-bg-primary">
      <Container>
        <FadeInOnScroll>
          <SectionHeader
            eyebrow="How It Works"
            title={PIPELINE.header}
            lead={PIPELINE.lead}
          />
        </FadeInOnScroll>
        <FadeInOnScroll>
          <div
            className="mt-12 overflow-x-auto"
            role="img"
            aria-label="Pipeline stages: Packet, Guardian, CPU LLM, GPU LLM, Action"
          >
            <div className="flex items-center gap-3 min-w-max px-2 py-4">
              {PIPELINE.stages.map((s, i) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="rounded-md border border-accent/40 bg-accent/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent shadow-glow-sm">
                    {s.label}
                  </div>
                  {i < PIPELINE.stages.length - 1 && <ChevronRight size={16} className="text-accent/60" />}
                </div>
              ))}
            </div>
          </div>
        </FadeInOnScroll>
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {PIPELINE.stages.map((s, i) => (
            <FadeInOnScroll key={s.title} delay={i * 0.04}>
              <li className="rounded-xl border border-border bg-bg-secondary p-6 h-full">
                <div className="font-mono text-xs text-accent mb-2">0{i + 1}</div>
                <h3 className="font-display text-base font-bold text-text-primary mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">{s.body}</p>
              </li>
            </FadeInOnScroll>
          ))}
        </ol>
      </Container>
    </section>
  );
}
