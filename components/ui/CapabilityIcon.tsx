/**
 * CapabilityIcon — bespoke SVG motif for each of the four JAG capabilities.
 *
 * v2 (2026-05-16): previous motifs were 80×80 with 5-6px label text — too
 * dense to read at the card rendering size. This version uses a 120×80
 * viewBox, larger strokes, brighter cyan, and no in-icon labels (the card
 * heading already provides the label). The motif reads at a glance as
 * the metaphor it intends — oscilloscope spike / decision tree / dual-AI
 * cross-check / walled perimeter — without depending on text legibility.
 */

type Kind = 'detection' | 'response' | 'watchdog' | 'sovereign';

interface Props {
  kind: Kind;
  className?: string;
}

const STROKE = '#22D3EE';
const STROKE_BRIGHT = '#67E8F9';
const STROKE_DEEP = '#0891B2';
const STROKE_FAINT = 'rgba(34, 211, 238, 0.25)';
const RED = '#EF4444';

export function CapabilityIcon({ kind, className = 'h-20 w-32' }: Props) {
  if (kind === 'detection') {
    // Oscilloscope: baseline grid + waveform with one big anomaly spike.
    return (
      <svg viewBox="0 0 120 80" className={className} fill="none" aria-hidden="true">
        <rect x="2" y="2" width="116" height="76" rx="6" stroke={STROKE_FAINT} strokeWidth="1" />
        {/* Grid lines */}
        <g stroke={STROKE_FAINT} strokeWidth="0.5" strokeDasharray="2 3">
          <line x1="2" y1="20" x2="118" y2="20" />
          <line x1="2" y1="40" x2="118" y2="40" />
          <line x1="2" y1="60" x2="118" y2="60" />
        </g>
        {/* Waveform */}
        <path
          d="M 6 42 L 14 42 L 18 38 L 22 44 L 28 40 L 34 41 L 40 38 L 48 41 L 56 14 L 64 66 L 72 40 L 80 42 L 88 41 L 96 40 L 104 40 L 114 40"
          stroke={STROKE_BRIGHT}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Anomaly highlight */}
        <circle cx="56" cy="14" r="5" fill={STROKE_BRIGHT} />
        <circle cx="56" cy="14" r="9" fill="none" stroke={STROKE_BRIGHT} strokeWidth="1.5" opacity="0.5">
          <animate attributeName="r" values="5;14;5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="64" cy="66" r="4" fill={RED} opacity="0.85" />
      </svg>
    );
  }

  if (kind === 'response') {
    // One input → AI core → branches to 4 autonomous actions.
    return (
      <svg viewBox="0 0 120 80" className={className} fill="none" aria-hidden="true">
        <rect x="2" y="2" width="116" height="76" rx="6" stroke={STROKE_FAINT} strokeWidth="1" />
        {/* Input */}
        <circle cx="14" cy="40" r="5" fill={STROKE} />
        <line x1="19" y1="40" x2="40" y2="40" stroke={STROKE} strokeWidth="2" strokeLinecap="round" />
        {/* AI core */}
        <rect x="40" y="30" width="26" height="20" rx="4" fill={STROKE_DEEP} fillOpacity="0.5" stroke={STROKE_BRIGHT} strokeWidth="1.5" />
        <text x="53" y="44" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" fill={STROKE_BRIGHT}>AI</text>
        {/* 4 branches */}
        <g stroke={STROKE} strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M 66 34 L 84 16 L 110 16" />
          <path d="M 66 38 L 84 30 L 110 30" />
          <path d="M 66 42 L 84 50 L 110 50" />
          <path d="M 66 46 L 84 64 L 110 64" />
        </g>
        <g fill={STROKE_BRIGHT}>
          <circle cx="110" cy="16" r="3" />
          <circle cx="110" cy="30" r="3" />
          <circle cx="110" cy="50" r="3" />
          <circle cx="110" cy="64" r="3" />
        </g>
      </svg>
    );
  }

  if (kind === 'watchdog') {
    // Two AI circles cross-checking each other with bidirectional arrows;
    // a small green checkmark between them indicates agreement gate.
    return (
      <svg viewBox="0 0 120 80" className={className} fill="none" aria-hidden="true">
        <rect x="2" y="2" width="116" height="76" rx="6" stroke={STROKE_FAINT} strokeWidth="1" />
        {/* AI 1 */}
        <circle cx="30" cy="40" r="18" fill={STROKE_DEEP} fillOpacity="0.25" stroke={STROKE} strokeWidth="2" />
        <text x="30" y="44" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill={STROKE}>AI</text>
        {/* AI 2 */}
        <circle cx="90" cy="40" r="18" fill={STROKE_BRIGHT} fillOpacity="0.18" stroke={STROKE_BRIGHT} strokeWidth="2" />
        <text x="90" y="44" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill={STROKE_BRIGHT}>AI</text>
        {/* Cross-check arrows */}
        <g stroke={STROKE_BRIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 50 34 L 70 34 M 70 34 L 66 30 M 70 34 L 66 38" />
          <path d="M 70 46 L 50 46 M 50 46 L 54 42 M 50 46 L 54 50" />
        </g>
      </svg>
    );
  }

  // sovereign: walled perimeter around JAG with a blocked outbound cloud.
  return (
    <svg viewBox="0 0 120 80" className={className} fill="none" aria-hidden="true">
      <rect x="2" y="2" width="116" height="76" rx="6" stroke={STROKE_FAINT} strokeWidth="1" />
      {/* Outer wall */}
      <path
        d="M 16 22 L 16 64 C 16 68 20 70 22 70 L 78 70 C 80 70 84 68 84 64 L 84 22 L 50 8 Z"
        stroke={STROKE_BRIGHT}
        strokeWidth="2"
        fill={STROKE_DEEP}
        fillOpacity="0.15"
      />
      {/* Inner wall */}
      <path
        d="M 24 30 L 24 60 L 76 60 L 76 30 L 50 18 Z"
        stroke={STROKE}
        strokeWidth="1.5"
        opacity="0.7"
        fill="none"
      />
      {/* JAG label inside */}
      <text x="50" y="50" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fontWeight="700" fill={STROKE_BRIGHT}>
        JAG
      </text>
      {/* Outbound cloud + blocked */}
      <g transform="translate(94, 24)">
        <path
          d="M 4 8 C 4 4 8 2 10 2 L 14 2 C 18 2 20 6 18 8 L 18 12 C 22 14 18 18 16 18 L 4 18 C 0 18 0 12 4 12 Z"
          fill="none"
          stroke="#94A3B8"
          strokeWidth="1.2"
        />
        <circle cx="11" cy="10" r="11" stroke={RED} strokeWidth="2" fill="rgba(239, 68, 68, 0.12)" />
        <path d="M 4 4 L 18 16 M 18 4 L 4 16" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
