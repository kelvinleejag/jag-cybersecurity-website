/**
 * ThreatTimeline — horizontal timeline showing cybersecurity-threat
 * sophistication rising over 2018→2026, with JAG entering the frame at
 * the AI-agent epoch.
 *
 * Pure inline SVG. Read top-to-bottom: title → curve with markers →
 * x-axis labels. The rising curve is a quadratic bezier so the visual
 * intuition is "threat capability is accelerating" — exactly what the
 * section copy claims.
 */
export function ThreatTimeline() {
  const points = [
    { x: 80, y: 230, label: '2018', threat: 'Manual exploits' },
    { x: 280, y: 210, label: '2020', threat: 'Polymorphic malware' },
    { x: 480, y: 170, label: '2022', threat: 'Targeted ransomware' },
    { x: 680, y: 110, label: '2024', threat: 'AI-assisted recon' },
    { x: 880, y: 50, label: '2026', threat: 'Autonomous AI agents' },
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border-default bg-bg-surface/40 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-brand-cyan">
          Threat sophistication
        </p>
        <p className="font-mono text-xs text-text-tertiary">2018 — 2026</p>
      </div>
      <svg
        viewBox="0 0 960 280"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="threat-curve-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0891B2" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#22D3EE" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#67E8F9" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="threat-fill-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis label */}
        <text
          x="20"
          y="40"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="#94A3B8"
          letterSpacing="0.12em"
        >
          HIGH
        </text>
        <text
          x="20"
          y="245"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="#94A3B8"
          letterSpacing="0.12em"
        >
          LOW
        </text>

        {/* Horizontal grid lines */}
        <g stroke="#1E2F4A" strokeWidth="1" strokeDasharray="4 8" opacity="0.5">
          <line x1="60" y1="60" x2="940" y2="60" />
          <line x1="60" y1="140" x2="940" y2="140" />
          <line x1="60" y1="220" x2="940" y2="220" />
        </g>

        {/* Filled area under curve */}
        <path
          d={`M ${points[0].x} 240 Q ${(points[0].x + points[1].x) / 2} ${points[0].y - 10} ${points[1].x} ${points[1].y} T ${points[2].x} ${points[2].y} T ${points[3].x} ${points[3].y} T ${points[4].x} ${points[4].y} L ${points[4].x} 240 Z`}
          fill="url(#threat-fill-grad)"
        />

        {/* Curve */}
        <path
          d={`M ${points[0].x} ${points[0].y} Q ${(points[0].x + points[1].x) / 2} ${points[0].y - 10} ${points[1].x} ${points[1].y} T ${points[2].x} ${points[2].y} T ${points[3].x} ${points[3].y} T ${points[4].x} ${points[4].y}`}
          fill="none"
          stroke="url(#threat-curve-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Markers + labels */}
        {points.map((p, i) => {
          const isLast = i === points.length - 1;
          return (
            <g key={p.label}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isLast ? 8 : 5}
                fill={isLast ? '#22D3EE' : '#0F1A2E'}
                stroke="#22D3EE"
                strokeWidth={isLast ? 2 : 1.5}
              />
              {isLast && (
                <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1.5">
                  <animate attributeName="r" values="8;18;8" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
                </circle>
              )}
              <text
                x={p.x}
                y={p.y - 18}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="10"
                fill={isLast ? '#22D3EE' : '#CBD5E1'}
                fontWeight={isLast ? 600 : 400}
              >
                {p.threat}
              </text>
              <text
                x={p.x}
                y={262}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="11"
                fill="#94A3B8"
                letterSpacing="0.05em"
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* "JAG enters here" callout near 2026 */}
        <g transform="translate(820, 40)">
          <rect width="120" height="22" rx="11" fill="#22D3EE" />
          <text
            x="60"
            y="15"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fontWeight="600"
            fill="#05080F"
          >
            JAG ENTERS
          </text>
        </g>
      </svg>
    </div>
  );
}
