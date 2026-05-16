/**
 * LayerStack — vertical layered-architecture diagram for the Five
 * Patented Inventions. All five layers sit inside a single "sovereign
 * device" outline (the visual claim of the section copy: "one unified
 * ecosystem"). Layers are color-graded from cyanDeep at the foundation
 * (Enforce) to cyanBright at the top (Adapt).
 *
 * Inline SVG. No JS. The vertical stack reads like a stratigraphy column
 * and reinforces "five integrated layers, one device" at a glance.
 */
const LAYERS = [
  { step: '05', name: 'Adapt', sub: 'Self-Improving Loop', color: '#67E8F9', alpha: 0.95 },
  { step: '04', name: 'Guard the AI', sub: 'AI Validation Watchdog', color: '#67E8F9', alpha: 0.78 },
  { step: '03', name: 'Prove', sub: 'Tamper-Proof Ledger', color: '#22D3EE', alpha: 0.7 },
  { step: '02', name: 'Understand', sub: 'On-Device Reasoning AI', color: '#22D3EE', alpha: 0.6 },
  { step: '01', name: 'Enforce', sub: 'Wire-Speed Front Gate', color: '#0891B2', alpha: 0.55 },
] as const;

export function LayerStack() {
  const rowHeight = 64;
  const gap = 8;
  const padding = 24;
  const totalHeight = LAYERS.length * rowHeight + (LAYERS.length - 1) * gap + padding * 2;

  return (
    <div className="w-full rounded-xl border border-border-default bg-bg-surface/40 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-cyan">
          Defense stack
        </p>
        <p className="font-mono text-xs text-text-tertiary">One sovereign device</p>
      </div>
      <svg
        viewBox={`0 0 720 ${totalHeight}`}
        className="w-full h-auto max-w-2xl mx-auto"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="device-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0891B2" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Device outline */}
        <rect
          x="20"
          y="10"
          width="680"
          height={totalHeight - 20}
          rx="18"
          fill="none"
          stroke="url(#device-stroke)"
          strokeWidth="1.5"
        />

        {/* Layer bands */}
        {LAYERS.map((layer, i) => {
          const y = padding + i * (rowHeight + gap);
          return (
            <g key={layer.step}>
              <rect
                x="40"
                y={y}
                width="640"
                height={rowHeight}
                rx="8"
                fill={layer.color}
                fillOpacity={layer.alpha * 0.18}
                stroke={layer.color}
                strokeOpacity={layer.alpha}
                strokeWidth="1.2"
              />
              <text
                x="60"
                y={y + rowHeight / 2 + 5}
                fontFamily="var(--font-mono)"
                fontSize="18"
                fontWeight="600"
                fill={layer.color}
              >
                {layer.step}
              </text>
              <text
                x="120"
                y={y + rowHeight / 2 - 4}
                fontFamily="var(--font-body)"
                fontSize="16"
                fontWeight="600"
                fill="#F8FAFC"
              >
                {layer.name}
              </text>
              <text
                x="120"
                y={y + rowHeight / 2 + 16}
                fontFamily="var(--font-mono)"
                fontSize="11"
                fill="#94A3B8"
                letterSpacing="0.04em"
              >
                {layer.sub}
              </text>
              <rect
                x="640"
                y={y + 14}
                width="20"
                height={rowHeight - 28}
                rx="2"
                fill={layer.color}
                fillOpacity={layer.alpha * 0.4}
              />
            </g>
          );
        })}
      </svg>
      <p className="mt-4 font-mono text-xs text-text-tertiary text-center">
        Five patented inventions · One integrated ecosystem · Single sovereign device
      </p>
    </div>
  );
}
