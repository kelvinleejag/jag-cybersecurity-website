import { ImageResponse } from 'next/og';

// Required under output: 'export' — without these, the dev server throws
// "Page /icon is missing exported function generateStaticParams()" 500s
// and the static export build can't emit the icon at all.
export const dynamic = 'force-static';
export const revalidate = false;

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#00D9FF',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%',
          color: '#0A1628',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '-0.05em',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        JAG
      </div>
    ),
    { ...size }
  );
}
