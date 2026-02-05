import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';

export const metadata: Metadata = {
  title: 'BrainStack Studio | Operational AI Workflows & Automation',
  description:
    'Explore deterministic operational AI workflows and automation tools built for reliability, auditability, and clear boundaries. Guided Explorer, solution previews, and scoped implementations.',
  keywords: [
    'Operational AI',
    'Workflow Automation',
    'Business Process Automation',
    'Deterministic AI',
    'Decision Trails',
    'Audit Trails',
    'BrainStack Studio',
    'BrainOps',
  ],
  authors: [{ name: 'BrainOps' }],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'BrainStack Studio | Operational AI Workflows & Automation',
    description:
      'Deterministic operational AI workflows with clear boundaries, confidence scoring, and audit-ready decision trails.',
    type: 'website',
    url: 'https://brainstackstudio.com',
    siteName: 'BrainStack Studio',
    images: [
      {
        url: 'https://brainstackstudio.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BrainStack Studio - Operational AI, Built for Trust',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrainStack Studio | Operational AI Workflows & Automation',
    description:
      'Deterministic operational AI workflows with clear boundaries, confidence scoring, and audit-ready decision trails.',
    images: ['https://brainstackstudio.com/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
