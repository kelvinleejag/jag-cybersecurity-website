/**
 * PipelineFunnel — horizontal funnel showing % of packets surviving each
 * tier of the patented 5-stage inference pipeline.
 *
 * v2 (2026-05-16): replaces the prior SVG positioning approach which had
 * three problems —
 *   1. text overlapping bars when % was small
 *   2. the 100% bar's "%" sign clipping the right edge of the viewBox
 *   3. no animation; bars rendered at final width immediately
 *
 * New approach is HTML flex layout with CSS-keyframe grow-in animation
 * on each bar. Three explicit columns:
 *   [01 Inspect (label)] [grow-in bar] [85% / -15% dropped (stats)]
 *
 * The bar widths are percentages of the available middle column, so they
 * scale cleanly at any viewport width without text overlap.
 */
const STAGES = [
  { id: '01', name: 'Inspect', pct: 100, dropped: 0,   tone: 'cyanDeep'   },
  { id: '02', name: 'Block', pct: 85,  dropped: 15,  tone: 'cyanDeep'   },
  { id: '03', name: 'Quick Think', pct: 15,  dropped: 70,  tone: 'cyan'       },
  { id: '04', name: 'Deep Think',  pct: 2,   dropped: 13,  tone: 'cyanBright' },
  { id: '05', name: 'Act',  pct: 0.5, dropped: 1.5, tone: 'cyanBright' },
] as const;

const TONE_STYLES: Record<string, { from: string; to: string; border: string }> = {
  cyanDeep:   { from: 'rgba(8, 145, 178, 0.85)',  to: 'rgba(8, 145, 178, 0.35)',  border: '#0891B2' },
  cyan:       { from: 'rgba(34, 211, 238, 0.85)', to: 'rgba(34, 211, 238, 0.35)', border: '#22D3EE' },
  cyanBright: { from: 'rgba(103, 232, 249, 0.9)', to: 'rgba(103, 232, 249, 0.4)', border: '#67E8F9' },
};

export function PipelineFunnel() {
  return (
    <div className="w-full rounded-xl border border-border-default bg-bg-surface/40 backdrop-blur-sm p-6 md:p-8">
      <style>{`
        @keyframes funnel-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(var(--target)); }
        }
        @keyframes funnel-fade {
          to { opacity: 1; }
        }
        .funnel-bar {
          transform-origin: left center;
          transform: scaleX(0);
          animation: funnel-grow 1400ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .funnel-stat {
          opacity: 0;
          animation: funnel-fade 500ms ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .funnel-bar { animation: none; transform: scaleX(var(--target)); }
          .funnel-stat { animation: none; opacity: 1; }
        }
      `}</style>
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-cyan">
          Traffic funnel
        </p>
        <p className="font-mono text-xs text-text-tertiary hidden sm:block">% of packets escalated</p>
      </div>

      <ul className="space-y-4">
        {STAGES.map((s, i) => {
          const tone = TONE_STYLES[s.tone];
          const targetScale = (s.pct / 100).toFixed(4);
          const barDelay = 200 + i * 150;
          const statDelay = barDelay + 700;
          return (
            <li
              key={s.id}
              className="grid grid-cols-[auto_1fr_auto] gap-3 sm:gap-5 items-center"
            >
              {/* Column 1: label (fixed width) */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-[110px] sm:min-w-[150px]">
                <span className="font-mono text-sm sm:text-base font-semibold text-brand-cyan">
                  {s.id}
                </span>
                <span className="text-sm sm:text-base text-text-secondary">
                  {s.name}
                </span>
              </div>

              {/* Column 2: bar track + filled bar */}
              <div className="relative h-9 sm:h-10 rounded-md bg-bg-surfaceMuted/70 overflow-hidden">
                <div
                  className="funnel-bar absolute inset-y-0 left-0 right-0 rounded-md"
                  style={{
                    background: `linear-gradient(to right, ${tone.from}, ${tone.to})`,
                    boxShadow: `inset 0 0 0 1px ${tone.border}66`,
                    animationDelay: `${barDelay}ms`,
                    // CSS custom property consumed by the keyframe.
                    ['--target' as string]: targetScale,
                  }}
                />
              </div>

              {/* Column 3: percentage + dropped (fixed width) */}
              <div
                className="funnel-stat flex items-baseline gap-3 sm:gap-4 min-w-[140px] sm:min-w-[170px] justify-end"
                style={{ animationDelay: `${statDelay}ms` }}
              >
                <span className="font-mono text-sm sm:text-base font-semibold text-text-primary tabular-nums">
                  {s.pct < 1 ? '<1%' : `${s.pct}%`}
                </span>
                <span className="font-mono text-xs text-text-tertiary tabular-nums w-[88px] text-right hidden sm:inline">
                  {s.dropped > 0 ? `−${s.dropped}% dropped` : '—'}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 font-mono text-xs text-text-tertiary leading-relaxed">
        <span className="text-brand-cyan">Cheapest decisions first.</span> Only
        the traffic that survives one tier ever costs the next. GPU compute
        reserved for the <span className="text-text-secondary">2%</span> that
        needs it.
      </p>
    </div>
  );
}
