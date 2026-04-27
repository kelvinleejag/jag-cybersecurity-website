import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-headline',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JAG Cybersecurity | Agentic AI Cybersecurity. Runs On-Device.',
  description:
    'Standalone Agentic AI cybersecurity for sovereign and data-sensitive organizations. Runs entirely on-device with zero cloud dependency. Built on NVIDIA Jetson edge AI.',
  keywords:
    'agentic AI cybersecurity, edge AI security, sovereign cybersecurity, on-device threat detection, NVIDIA Jetson cybersecurity, zero-trust AI, autonomous cyber defense',
  metadataBase: new URL('https://www.jag-cybersecurity.io'),
  openGraph: {
    title: 'JAG Cybersecurity | Agentic AI Cybersecurity',
    description:
      "World's first standalone Agentic AI cybersecurity platform. Runs entirely on-device.",
    url: 'https://www.jag-cybersecurity.io',
    siteName: 'JAG Cybersecurity',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-bg-primary text-text-primary">{children}</body>
    </html>
  );
}
