import { Monitor, Server, Camera, Factory, type LucideIcon } from 'lucide-react';
import { PacketParticles } from '@/components/ui/PacketParticles';
import { architecture } from '@/lib/content';

const ICONS: Record<string, LucideIcon> = { Monitor, Server, Camera, Factory };

export function ArchitectureDiagram() {
  const { destinations, jetsonLayers } = architecture;
  return (
    <div className="relative w-full aspect-[9/5] bg-bg-surfaceMuted border border-border-default rounded-xl overflow-hidden">
      <svg viewBox="0 0 900 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <radialGradient id="shield-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#22D3EE" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ingress lines from internet to center */}
        <g stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.5">
          {[100, 175, 250, 325, 400].map((y, i) => (
            <line
              key={`in-${y}`}
              x1="80"
              y1={y}
              x2="400"
              y2={y}
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
              className="animate-draw-stroke"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </g>

        {/* Egress lines from center to destinations */}
        <g stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.5">
          {[125, 215, 305, 395].map((y, i) => (
            <line
              key={`out-${y}`}
              x1="540"
              y1={y}
              x2="800"
              y2={y}
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
              className="animate-draw-stroke"
              style={{ animationDelay: `${800 + i * 150}ms` }}
            />
          ))}
        </g>

        {/* Cloud "Internet" silhouette on left */}
        <g transform="translate(20, 220)">
          <path
            d="M0 30 C0 15, 15 0, 30 0 H50 C60 -10, 75 -10, 85 0 H100 C115 0, 130 15, 125 30 V50 C140 60, 130 75, 115 75 H15 C0 75, -10 60, 0 50 Z"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />
          <text x="62" y="95" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="#94A3B8">
            Internet
          </text>
        </g>

        {/* Shield glow */}
        <circle cx="470" cy="250" r="180" fill="url(#shield-glow)" className="opacity-0 animate-glow-bloom" style={{ animationDelay: '1200ms' }} />

        {/* Jetson Orin NX module */}
        <g transform="translate(390, 130)">
          <rect x="0" y="0" width="160" height="240" rx="14" fill="#0B1220" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1.5" />
          {jetsonLayers.map((label, i) => (
            <g key={label} transform={`translate(12, ${20 + i * 70})`}>
              <rect width="136" height="56" rx="8" fill="#0F1A2E" stroke="#1E2F4A" strokeWidth="1" />
              <text x="68" y="33" textAnchor="middle" fontFamily="var(--font-body)" fontSize="11" fill="#CBD5E1">
                {label}
              </text>
            </g>
          ))}
          <text x="80" y="260" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="#94A3B8">
            NVIDIA Jetson Orin NX
          </text>
        </g>
      </svg>

      {/* Destinations panel on right (HTML, not SVG, so we get lucide icons + accessible labels) */}
      <ul className="absolute right-6 top-1/2 -translate-y-1/2 w-44 flex flex-col gap-3" aria-label="Protected destination types">
        {destinations.map((d) => {
          const Icon = ICONS[d.icon];
          return (
            <li key={d.label} className="flex items-center gap-3 bg-bg-surface/70 backdrop-blur-sm border border-border-subtle rounded-md px-3 py-2">
              <Icon className="h-5 w-5 text-brand-cyan shrink-0" aria-hidden="true" />
              <span className="text-xs text-text-secondary">{d.label}</span>
            </li>
          );
        })}
      </ul>

      {/* Canvas overlay for packet particles */}
      <PacketParticles width={900} height={500} />
    </div>
  );
}
