import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security',
  description:
    'BrainStack Studio security practices. Boundary enforcement, encryption, access controls, and audit-ready operational AI governance.',
  alternates: {
    canonical: '/security',
  },
  openGraph: {
    title: 'Security | BrainStack Studio',
    description:
      'Security practices and governance model for the BrainStack Studio operational AI platform.',
    url: '/security',
    type: 'website',
  },
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
