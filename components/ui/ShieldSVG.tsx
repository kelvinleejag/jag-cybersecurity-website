interface Props {
  className?: string;
  animate?: boolean;
  size?: number;
}

export default function ShieldSVG({ className = '', animate = false, size = 480 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id="shield-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#shield-stroke)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M100 8 L188 36 L188 116 C188 168 152 208 100 232 C48 208 12 168 12 116 L12 36 Z"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={animate ? '1' : '0'}
          className={animate ? 'animate-draw-stroke' : ''}
          style={animate ? { animationDelay: '0ms' } : undefined}
        />
        <path
          d="M100 38 L162 58 L162 116 C162 156 134 188 100 208 C66 188 38 156 38 116 L38 58 Z"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={animate ? '1' : '0'}
          className={animate ? 'animate-draw-stroke' : ''}
          style={animate ? { animationDelay: '200ms' } : undefined}
          opacity="0.5"
        />
        <path
          d="M70 100 L100 80 L130 100 L130 140 L100 160 L70 140 Z"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={animate ? '1' : '0'}
          className={animate ? 'animate-draw-stroke' : ''}
          style={animate ? { animationDelay: '400ms' } : undefined}
          opacity="0.7"
        />
        <path
          d="M100 80 L100 160 M70 120 L130 120"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={animate ? '1' : '0'}
          className={animate ? 'animate-draw-stroke' : ''}
          style={animate ? { animationDelay: '600ms' } : undefined}
          opacity="0.4"
        />
      </g>
    </svg>
  );
}
