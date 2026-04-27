import { ReactNode } from 'react';

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  align?: 'left' | 'center';
}) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-content ${alignClass}`}>
      {eyebrow && (
        <p className="font-mono text-sm uppercase tracking-widest text-accent mb-4">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary text-balance leading-tight">
        {title}
      </h2>
      {lead && <p className="mt-6 text-lg text-text-secondary leading-relaxed">{lead}</p>}
    </div>
  );
}
