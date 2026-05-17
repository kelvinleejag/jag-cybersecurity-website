import type { ReactNode } from 'react';

interface BrowserChromeProps {
  children: ReactNode;
  /** Optional file-tab label rendered in the chrome top bar. */
  tab?: string;
  className?: string;
}

/**
 * BrowserChrome — frames any child as if displayed inside a macOS
 * application window. Three traffic-light dots (red / amber / green)
 * are the universally-recognized OS UI artifact, exempt from §11
 * single-accent rule per spec §4.2.
 *
 * Used to wrap diagrams (architecture-overview.png), data displays
 * (ThreatTimeline, LayerStack), and the Founder photo so they read as
 * "viewer applications" rather than naked illustrations.
 */
export function BrowserChrome({ children, tab, className = '' }: BrowserChromeProps) {
  return (
    <div
      className={[
        'relative rounded-2xl overflow-hidden',
        'bg-bg-surface',
        'border border-border-default',
        'shadow-glow-md',
        className,
      ].join(' ')}
    >
      <div
        className="relative flex items-center px-4 h-9 border-b border-border-default"
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 100%)',
        }}
      >
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full" style={{ background: '#FF5F57' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#FEBC2E' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#28C840' }} />
        </div>
        {tab && (
          <div className="ml-6 inline-flex items-center px-3 h-7 rounded-md bg-bg-surfaceElevated font-mono text-xs text-text-tertiary">
            {tab}
          </div>
        )}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

export default BrowserChrome;
