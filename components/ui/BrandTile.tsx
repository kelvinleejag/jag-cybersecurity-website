import type { ReactNode } from 'react';

interface BrandTileProps {
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

const SIZE_PX: Record<'sm' | 'md' | 'lg', number> = {
  sm: 96,
  md: 128,
  lg: 192,
};

/**
 * BrandTile — square cyan glass-tile used at narrative section pivots.
 *
 * Decorative (aria-hidden). Inner radial cyan bloom, bottom-edge cyan
 * bevel line, outer cyan-glow shadow via shadow-tile token. The child
 * SVG renders at ~55% of tile dimension, centered.
 *
 * Used at: Hero (lg), Threats / Architecture / FiveLayers (md).
 */
export function BrandTile({ size = 'md', children, className = '' }: BrandTileProps) {
  const px = SIZE_PX[size];
  const iconPx = Math.round(px * 0.55);
  return (
    <div
      aria-hidden="true"
      style={{ width: `${px}px`, height: `${px}px`, borderRadius: '24%' }}
      className={[
        'relative inline-flex items-center justify-center',
        'bg-gradient-to-br from-bg-surfaceElevated to-bg-surfaceMuted',
        'border border-border-default',
        'shadow-tile',
        'overflow-hidden',
        className,
      ].join(' ')}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(103, 232, 249, 0.22), transparent 60%)',
        }}
      />
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.30), transparent)',
        }}
      />
      <span
        className="relative z-10 flex items-center justify-center"
        style={{ width: `${iconPx}px`, height: `${iconPx}px` }}
      >
        {children}
      </span>
    </div>
  );
}

export default BrandTile;
