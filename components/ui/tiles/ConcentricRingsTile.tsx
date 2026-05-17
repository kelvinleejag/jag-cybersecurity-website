/**
 * ConcentricRingsTile — perimeter-inspector motif: 4 concentric rings
 * with a center dot, evoking JAG's tiered-inference architecture.
 * Renders inside <BrandTile size="md"> in Architecture. Outer rings
 * fade outward to suggest depth/layering.
 */
export function ConcentricRingsTile() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="28" stroke="#22D3EE" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="32" cy="32" r="21" stroke="#22D3EE" strokeOpacity="0.55" strokeWidth="1" />
      <circle cx="32" cy="32" r="14" stroke="#22D3EE" strokeOpacity="0.8" strokeWidth="1.25" />
      <circle cx="32" cy="32" r="7" stroke="#67E8F9" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="2.5" fill="#A5F3FC" />
      <line x1="32" y1="4" x2="32" y2="11" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
      <line x1="32" y1="53" x2="32" y2="60" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
      <line x1="4" y1="32" x2="11" y2="32" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
      <line x1="53" y1="32" x2="60" y2="32" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
    </svg>
  );
}

export default ConcentricRingsTile;
