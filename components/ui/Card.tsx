import { ReactNode } from 'react';

export type CardTone = 'default' | 'concern' | 'success';

const toneClasses: Record<CardTone, string> = {
  default: 'border border-border hover:border-accent/30 hover:bg-bg-elevated',
  concern: 'border border-border border-l-4 border-l-metric-amber hover:bg-bg-elevated',
  success: 'border border-border border-l-4 border-l-metric-green hover:bg-bg-elevated',
};

export function Card({
  children,
  className = '',
  tone = 'default',
}: {
  children: ReactNode;
  className?: string;
  tone?: CardTone;
}) {
  return (
    <div
      className={`rounded-xl bg-bg-secondary p-6 md:p-8 transition-colors duration-200 ${toneClasses[tone]} ${className}`}
    >
      {children}
    </div>
  );
}
