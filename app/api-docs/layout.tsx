import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Docs',
  description:
    'Interactive API reference for BrainStack Studio capability and tools endpoints with live request examples.',
  alternates: {
    canonical: '/api-docs',
  },
  openGraph: {
    title: 'API Docs | BrainStack Studio',
    description:
      'Run live requests against BrainStack Studio APIs and inspect real endpoint responses.',
    url: '/api-docs',
    type: 'website',
  },
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
