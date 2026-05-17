/**
 * ShieldTile — JAG shield motif as a glass-tile child icon.
 * Renders inside <BrandTile size="lg"> in Hero. Cyan stroke, subtle
 * inner gradient, fits 100% of the icon slot (BrandTile sizes child
 * to ~55% of tile dimension).
 */
export function ShieldTile() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="shield-tile-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="shield-tile-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <path
        d="M32 4 L56 12 V32 C56 46 46 56 32 60 C18 56 8 46 8 32 V12 L32 4 Z"
        fill="url(#shield-tile-fill)"
        stroke="url(#shield-tile-stroke)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M22 32 L29 39 L43 25"
        stroke="#67E8F9"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default ShieldTile;
