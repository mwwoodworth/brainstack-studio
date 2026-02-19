import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'Technical documentation for BrainStack Studio. Guided Explorer, Solution Gallery, Capability API, telemetry, privacy, and implementation guides.',
  alternates: {
    canonical: '/docs',
  },
  openGraph: {
    title: 'Documentation | BrainStack Studio',
    description:
      'Complete technical documentation for the BrainStack Studio operational AI platform.',
    url: '/docs',
    type: 'website',
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
