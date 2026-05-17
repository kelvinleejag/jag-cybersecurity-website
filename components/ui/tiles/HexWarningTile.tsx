/**
 * HexWarningTile — hexagonal warning motif. Renders inside
 * <BrandTile size="md"> in Threats. Hexagon with cyan inner-light
 * fill and a tightly-tracked exclamation mark.
 */
export function HexWarningTile() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hex-tile-fill" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      <path
        d="M32 4 L56 18 V46 L32 60 L8 46 V18 Z"
        fill="url(#hex-tile-fill)"
        stroke="#22D3EE"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line
        x1="32"
        y1="20"
        x2="32"
        y2="38"
        stroke="#A5F3FC"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="46" r="2.25" fill="#A5F3FC" />
    </svg>
  );
}

export default HexWarningTile;
