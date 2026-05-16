/**
 * PipelineFunnel — horizontal funnel visualization of traffic % reaching
 * each of the 5 inference tiers. Visualizes the unique JAG IP:
 *   - 100% inspect at the wire
 *   -  ~85% dropped at Block (signatures)
 *   -  ~15% escalate to Quick Think
 *   -   ~2% escalate to Deep Think
 *   -   <1% generate an Act
 *
 * Wide funnel = lots of traffic; narrow funnel = small subset.
 * Visualizes "the right amount of brainpower for every threat."
 */
const STAGES = [
  { id: '01', name: 'Inspect', pct: 100, color: '#0891B2', dropped: 0 },
  { id: '02', name: 'Block', pct: 85, color: '#0891B2', dropped: 15 },
  { id: '03', name: 'Quick Think', pct: 15, color: '#22D3EE', dropped: 70 },
  { id: '04', name: 'Deep Think', pct: 2, color: '#67E8F9', dropped: 13 },
  { id: '05', name: 'Act', pct: 0.5, color: '#67E8F9', dropped: 1.5 },
] as const;

export function PipelineFunnel() {
  const maxBarWidth = 760;
  const barHeight = 36;
  const gap = 14;

  return (
    <div className="w-full rounded-xl border border-border-default bg-bg-surface/40 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-cyan">
          Traffic funnel
        </p>
        <p className="font-mono text-xs text-text-tertiary">% of packets escalated</p>
      </div>
      <svg
        viewBox={`0 0 900 ${STAGES.length * (barHeight + gap) + 30}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {STAGES.map((s) => (
            <linearGradient
              key={`grad-${s.id}`}
              id={`funnel-grad-${s.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={s.color} stopOpacity="0.85" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.4" />
            </linearGradient>
          ))}
        </defs>

        {STAGES.map((s, i) => {
          const w = Math.max(60, (s.pct / 100) * maxBarWidth);
          const y = i * (barHeight + gap) + 12;
          const x = 100;
          return (
            <g key={s.id}>
              <text
                x="60"
                y={y + barHeight / 2 + 4}
                textAnchor="end"
                fontFamily="var(--font-mono)"
                fontSize="13"
                fontWeight="600"
                fill="#22D3EE"
              >
                {s.id}
              </text>
              <text
                x="76"
                y={y + barHeight / 2 + 4}
                textAnchor="start"
                fontFamily="var(--font-body)"
                fontSize="13"
                fill="#CBD5E1"
              >
                {s.name}
              </text>
              <rect
                x={x}
                y={y}
                width={w}
                height={barHeight}
                rx="6"
                fill={`url(#funnel-grad-${s.id})`}
                stroke={s.color}
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <text
                x={x + w + 12}
                y={y + barHeight / 2 + 4}
                fontFamily="var(--font-mono)"
                fontSize="13"
                fontWeight="600"
                fill="#F8FAFC"
              >
                {s.pct < 1 ? '<1%' : `${s.pct}%`}
              </text>
              {s.dropped > 0 && (
                <text
                  x={x + w + 70}
                  y={y + barHeight / 2 + 4}
                  fontFamily="var(--font-mono)"
                  fontSize="11"
                  fill="#64748B"
                >
                  −{s.dropped}% dropped
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="mt-4 font-mono text-xs text-text-tertiary leading-relaxed">
        <span className="text-brand-cyan">Cheapest decisions first.</span> Only the
        traffic that survives one tier ever costs the next. GPU compute reserved
        for the <span className="text-text-secondary">2%</span> that needs it.
      </p>
    </div>
  );
}
