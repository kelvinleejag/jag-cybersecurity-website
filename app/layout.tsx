import type { Metadata } from 'next';
// NOTE: `Geist` is not exported by next/font/google in next@14.2.x.
// `Inter` (same design lineage — Vercel) is the closest taste substitute and
// satisfies WEB-TASK-20260515-B (body-font decision deferred). Phase A
// deviation, logged in Phase A report.
import { Inter, JetBrains_Mono } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import './globals.css';

const geist = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JAG Cybersecurity — Sovereign Agentic AI. On-Device.',
  description:
    "JAG is the world's first standalone Agentic AI cybersecurity platform for sovereign and data-sensitive organizations. Every component runs entirely on the NVIDIA Jetson edge AI platform. Zero cloud. Zero exfiltration.",
  metadataBase: new URL('https://www.jag-cybersecurity.io'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'JAG Cybersecurity — Sovereign Agentic AI. On-Device.',
    description:
      'Sovereign Agentic AI cybersecurity. Zero cloud. Zero exfiltration. Zero trust.',
    url: 'https://www.jag-cybersecurity.io',
    siteName: 'JAG Cybersecurity',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JAG Cybersecurity — Sovereign Agentic AI. On-Device.',
    description:
      'Sovereign Agentic AI cybersecurity. Zero cloud. Zero exfiltration. Zero trust.',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg-base text-text-primary antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
