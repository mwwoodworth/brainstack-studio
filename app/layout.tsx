import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';
import { JsonLd } from '@/components/JsonLd';
import { constructMetadata, constructOrganizationStructuredData } from '@/app/lib/metadata';

const organizationStructuredData = constructOrganizationStructuredData();

export const metadata: Metadata = constructMetadata();

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
        <JsonLd id="organization-jsonld" data={organizationStructuredData} />
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
