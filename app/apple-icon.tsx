import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const revalidate = false;

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          borderRadius: '22%',
          color: '#0A1628',
          fontSize: 72,
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
