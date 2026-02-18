import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://brainstackstudio.com').replace(/\/$/, '');

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BrainStack Studio',
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
  sameAs: ['https://github.com/mwwoodworth', 'https://linkedin.com/in/mattwoodworth'],
};

const softwareStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BrainStack Studio',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    price: '99',
    category: 'subscription',
  },
  url: siteUrl,
  description:
    'Operational AI workflows and automation designed for real operations: secure, governed, and measurable.',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BrainStack Studio | Operational AI Platform',
    template: '%s | BrainStack Studio',
  },
  description:
    'Operational AI workflows and enterprise automation that integrate with how your business runs: secure, governed, and measurable.',
  applicationName: 'BrainStack Studio',
  keywords: [
    'Operational AI Platform',
    'Operational AI',
    'Enterprise Automation',
    'Workflow Automation',
    'Business Process Automation',
    'AI Governance',
    'AI Agents',
    'Audit Trails',
    'BrainStack Studio',
  ],
  authors: [{ name: 'BrainStack Studio' }],
  category: 'Technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'BrainStack Studio | Operational AI Platform',
    description:
      'Operational AI workflows and automation designed for real operations: secure, governed, and measurable.',
    type: 'website',
    url: siteUrl,
    siteName: 'BrainStack Studio',
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'BrainStack Studio - Operational AI Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrainStack Studio | Operational AI Platform',
    description:
      'Operational AI workflows and automation designed for real operations: secure, governed, and measurable.',
    images: ['/opengraph-image'],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareStructuredData) }}
        />
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
