/** @type {import('next').NextConfig} */

// CSP construction: Next.js dev mode uses React Fast Refresh which requires
// `unsafe-eval` to execute hot-reload module replacement. We allow it ONLY
// in development. Production CSP (served via public/_headers for Cloudflare
// Pages) does NOT include unsafe-eval — strict policy stands at deploy.
//
// Why this matters: previously, dev-mode CSP blocked Fast Refresh → React
// client-side hydration failed silently → useEffect never ran → canvas
// stayed blank, animated SVG bars never grew, MetricCounter never counted
// up. From the browser console:
//   Uncaught EvalError: Evaluating a string as JavaScript violates the
//   following CSP directive: script-src 'self' 'unsafe-inline'
//
// Charter §12 two-file invariant note: public/_headers must continue to
// encode the PRODUCTION policy (no unsafe-eval). This file's headers()
// only apply in `next dev` and `next start`, never in static export.

const isDev = process.env.NODE_ENV !== 'production';

const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.jag-cybersecurity.io" + (isDev ? ' ws: wss:' : ''),
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://api.jag-cybersecurity.io",
    ].join('; '),
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // headers() applies in dev / next start; NOT in static export output.
  // Production policy lives in public/_headers per charter §12.
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
