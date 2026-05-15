export interface LayerCardProps {
  step: string;
  title: string;
  subtitle: string;
  body: string;
  quote: string;
}

export function LayerCard({ step, title, subtitle, body, quote }: LayerCardProps) {
  return (
    <article className="group relative rounded-lg bg-bg-surface border border-border-default p-7 h-full transition-all duration-base ease-standard hover:border-border-strong hover:shadow-cardHover overflow-hidden">
      <span
        className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-brand-cyan to-transparent transition-all duration-base ease-standard group-hover:w-full"
        aria-hidden="true"
      />
      <p className="font-mono text-h2 font-semibold text-brand-cyan leading-none">{step}</p>
      <h3 className="mt-4 font-display text-h3 font-semibold text-text-primary leading-heading tracking-heading">
        {title}
      </h3>
      <p className="mt-1 italic text-sm text-text-tertiary">{subtitle}</p>
      <p className="mt-4 text-body text-text-secondary leading-body">{body}</p>
      <div className="mt-6 rounded-md border border-border-subtle bg-bg-surfaceMuted p-4">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-cyan">In Plain English</p>
        <p className="mt-2 text-sm italic text-text-secondary">{quote}</p>
      </div>
    </article>
  );
}
