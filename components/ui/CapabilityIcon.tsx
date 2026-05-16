/**
 * CapabilityIcon — bespoke SVG motif for each of the four JAG capabilities.
 * Replaces the lucide line-icons (Activity / Zap / Eye / Lock) with
 * mini-diagrams that actually illustrate what each capability does.
 *
 * Each motif is inline SVG, ~80x80 viewBox, cyan-on-transparent. No
 * dependencies. Charter §11 imagery rule: hand-composed, not stock,
 * not AI-generated.
 */

type Kind = 'detection' | 'response' | 'watchdog' | 'sovereign';

interface Props {
  kind: Kind;
  className?: string;
}

export function CapabilityIcon({ kind, className = 'h-14 w-14' }: Props) {
  const stroke = '#22D3EE';
  const strokeBright = '#67E8F9';
  const strokeFaint = 'rgba(34, 211, 238, 0.35)';

  if (kind === 'detection') {
    // Oscilloscope waveform with anomaly spike highlighted.
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
        <rect x="6" y="6" width="68" height="68" rx="8" stroke={strokeFaint} strokeWidth="1" />
        <line x1="6" y1="40" x2="74" y2="40" stroke={strokeFaint} strokeWidth="0.5" strokeDasharray="2 4" />
        <path
          d="M 10 42 L 16 42 L 20 40 L 24 44 L 28 38 L 32 41 L 36 35 L 40 18 L 44 56 L 48 39 L 52 42 L 56 41 L 60 40 L 66 40 L 74 40"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="40" cy="18" r="3" fill={strokeBright} />
        <circle cx="40" cy="18" r="6" fill="none" stroke={strokeBright} strokeWidth="1" opacity="0.6" />
        <text x="40" y="74" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill="rgba(148,163,184,0.7)" letterSpacing="0.1em">
          ANOMALY
        </text>
      </svg>
    );
  }

  if (kind === 'response') {
    // Branching decision tree: one input, four autonomous actions out.
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
        <circle cx="14" cy="40" r="4" fill={stroke} />
        <line x1="18" y1="40" x2="34" y2="40" stroke={stroke} strokeWidth="1.5" />
        <rect x="34" y="34" width="14" height="12" rx="2" stroke={strokeBright} strokeWidth="1.5" />
        <text x="41" y="42" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill={strokeBright}>AI</text>
        <g stroke={stroke} strokeWidth="1.2" fill="none">
          <path d="M 48 38 L 56 18 L 70 18" />
          <path d="M 48 40 L 56 32 L 70 32" />
          <path d="M 48 42 L 56 48 L 70 48" />
          <path d="M 48 44 L 56 62 L 70 62" />
        </g>
        <g fontFamily="var(--font-mono)" fontSize="5" fill="rgba(203,213,225,0.85)">
          <text x="70" y="20">block</text>
          <text x="70" y="34">quarantine</text>
          <text x="70" y="50">alert</text>
          <text x="70" y="64">escalate</text>
        </g>
      </svg>
    );
  }

  if (kind === 'watchdog') {
    // Two AI circles facing each other with a verifying arrow between them.
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
        <circle cx="22" cy="40" r="14" stroke={stroke} strokeWidth="1.5" />
        <text x="22" y="43" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fontWeight="600" fill={stroke}>AI1</text>
        <circle cx="58" cy="40" r="14" stroke={strokeBright} strokeWidth="1.5" />
        <text x="58" y="43" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fontWeight="600" fill={strokeBright}>AI2</text>
        <path
          d="M 37 36 L 43 36 M 43 36 L 40 33 M 43 36 L 40 39"
          stroke={strokeBright}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 43 44 L 37 44 M 37 44 L 40 41 M 37 44 L 40 47"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="40" y="12" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="5.5" fill="rgba(148,163,184,0.7)" letterSpacing="0.1em">
          CROSS-CHECK
        </text>
        <text x="40" y="72" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="5.5" fill="rgba(148,163,184,0.7)" letterSpacing="0.1em">
          NO ACTION UNTIL BOTH AGREE
        </text>
      </svg>
    );
  }

  // sovereign: walled perimeter with a blocked outbound arrow.
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
      <path
        d="M 14 30 L 14 56 C 14 60 18 62 20 62 L 60 62 C 62 62 66 60 66 56 L 66 30 L 40 16 Z"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path
        d="M 22 38 L 22 54 L 58 54 L 58 38 L 40 28 Z"
        stroke={strokeBright}
        strokeWidth="1.2"
        opacity="0.7"
      />
      <text x="40" y="50" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fontWeight="600" fill={strokeBright}>
        JAG
      </text>
      {/* Outbound arrow with a slash through it */}
      <g transform="translate(64, 14)">
        <circle cx="6" cy="6" r="6" stroke="#EF4444" strokeWidth="1.2" />
        <path d="M 2 2 L 10 10 M 10 2 L 2 10" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      <text x="74" y="28" textAnchor="end" fontFamily="var(--font-mono)" fontSize="5.5" fill="rgba(239,68,68,0.85)" letterSpacing="0.1em">
        NO CLOUD
      </text>
    </svg>
  );
}
