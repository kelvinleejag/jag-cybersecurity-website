/**
 * LayerStratigraphyTile — 5 horizontal cyan layers stacked vertically,
 * each with a slightly different opacity to suggest depth.
 * Renders inside <BrandTile size="md"> in FiveLayers. Each layer
 * represents one of the 5 patented inventions.
 */
export function LayerStratigraphyTile() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <rect x="6" y="12" width="52" height="6" rx="1.5" fill="#22D3EE" fillOpacity="0.20" stroke="#22D3EE" strokeOpacity="0.50" />
      <rect x="6" y="21" width="52" height="6" rx="1.5" fill="#22D3EE" fillOpacity="0.32" stroke="#22D3EE" strokeOpacity="0.65" />
      <rect x="6" y="30" width="52" height="6" rx="1.5" fill="#67E8F9" fillOpacity="0.40" stroke="#67E8F9" strokeOpacity="0.75" />
      <rect x="6" y="39" width="52" height="6" rx="1.5" fill="#67E8F9" fillOpacity="0.50" stroke="#67E8F9" strokeOpacity="0.85" />
      <rect x="6" y="48" width="52" height="6" rx="1.5" fill="#A5F3FC" fillOpacity="0.60" stroke="#A5F3FC" />
    </svg>
  );
}

export default LayerStratigraphyTile;
