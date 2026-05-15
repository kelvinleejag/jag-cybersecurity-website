import { MetricCounter } from '@/components/ui/MetricCounter';
import { capabilities } from '@/lib/content';

/**
 * ProofBar — 5-stat band of validated proof points, surfaced below the
 * Capabilities grid. Each stat counts up from 0 → target on scroll-into-view
 * via MetricCounter (which owns the IntersectionObserver + reduced-motion
 * + 1.5 s fallback logic — see MetricCounter.tsx history).
 *
 * MetricCounter API note (verified 2026-05-15):
 *   - Signature is `{ value: string; label: string }` — the count-up parses
 *     prefix/number/suffix out of a single `value` string and renders its own
 *     center-aligned div with the label below.
 *   - The Phase-C spec assumed `<MetricCounter value={number}/><span>{suffix}</span>`
 *     which does NOT match the installed primitive. Adapted by joining
 *     `${value}${suffix}` into the string MetricCounter parses.
 *   - Per charter §1.6 AUDIT-EXISTING-FIRST: we adapt the consumer, not the
 *     shared primitive (which Solution.tsx pre-rewrite also consumed).
 */
export function ProofBar() {
  const { stats, caption } = capabilities.proofBar;
  return (
    <div className="bg-bg-surfaceMuted border-y border-border-default">
      <div className="mx-auto max-w-container px-gutter py-12">
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {stats.map((s) => (
            <li key={s.label}>
              <MetricCounter
                value={`${s.value}${s.suffix}`}
                label={s.label}
                numberClassName="font-mono text-h2 font-semibold text-brand-cyan tabular-nums animate-fade-in-up"
                labelClassName="mt-2 font-mono text-xs uppercase tracking-eyebrow text-text-tertiary"
              />
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-text-tertiary max-w-[80ch] mx-auto">
          {caption}
        </p>
      </div>
    </div>
  );
}
