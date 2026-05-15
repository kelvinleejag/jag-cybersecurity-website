/**
 * RibbonBackground — ambient flowing-light layer behind page content.
 *
 * Five layered SVG paths with gaussian blur and per-path animation-duration
 * variance produce a depth-of-field flowing ribbon effect. Pure CSS — no JS,
 * no canvas, no observer. GPU-accelerated transform animations.
 *
 * Charter compliance:
 *   - prefers-reduced-motion: animations short-circuit via globals.css blanket
 *     (animation-duration: 0.01ms). Ribbons render static, no movement.
 *   - Bundle cost: ~2 kB inline SVG. Zero JS.
 *   - z-index: -10 so it sits behind all content. pointer-events: none so it
 *     never intercepts clicks. aria-hidden so AT skips it entirely.
 *
 * Reads on a dark-navy background with subtle cyan accents — matches the
 * §11 sovereign-AI brand voice while delivering the "captivating" feel
 * requested 2026-05-16 by owner.
 */
export function RibbonBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-bg-base"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="ribbon-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id="ribbon-blur-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="32" />
          </filter>
          <linearGradient id="ribbon-grad-cyan-bright" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
            <stop offset="40%" stopColor="rgba(103, 232, 249, 0.55)" />
            <stop offset="60%" stopColor="rgba(34, 211, 238, 0.55)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
          </linearGradient>
          <linearGradient id="ribbon-grad-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
            <stop offset="50%" stopColor="rgba(34, 211, 238, 0.35)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
          </linearGradient>
          <linearGradient id="ribbon-grad-deep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(8, 145, 178, 0)" />
            <stop offset="50%" stopColor="rgba(8, 145, 178, 0.4)" />
            <stop offset="100%" stopColor="rgba(8, 145, 178, 0)" />
          </linearGradient>
        </defs>

        {/* Five ribbon paths, each animated with a different speed for parallax depth. */}
        <g filter="url(#ribbon-blur-soft)">
          <path
            d="M-400 200 C 200 100, 800 400, 1400 250 S 2400 350, 2800 180"
            stroke="url(#ribbon-grad-deep)"
            strokeWidth="80"
            fill="none"
            className="ribbon-flow-1"
          />
        </g>
        <g filter="url(#ribbon-blur)">
          <path
            d="M-400 380 C 300 280, 900 520, 1500 400 S 2400 480, 2800 350"
            stroke="url(#ribbon-grad-cyan)"
            strokeWidth="50"
            fill="none"
            className="ribbon-flow-2"
          />
          <path
            d="M-400 600 C 400 500, 1000 720, 1600 580 S 2400 660, 2800 540"
            stroke="url(#ribbon-grad-cyan-bright)"
            strokeWidth="40"
            fill="none"
            className="ribbon-flow-3"
          />
          <path
            d="M-400 780 C 200 700, 800 900, 1400 800 S 2400 880, 2800 740"
            stroke="url(#ribbon-grad-cyan)"
            strokeWidth="45"
            fill="none"
            className="ribbon-flow-4"
          />
        </g>
        <g filter="url(#ribbon-blur-soft)">
          <path
            d="M-400 920 C 300 820, 900 1020, 1500 920 S 2400 1000, 2800 880"
            stroke="url(#ribbon-grad-deep)"
            strokeWidth="70"
            fill="none"
            className="ribbon-flow-5"
          />
        </g>
      </svg>
    </div>
  );
}
