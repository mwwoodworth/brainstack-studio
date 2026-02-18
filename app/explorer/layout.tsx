import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guided Explorer',
  description:
    'Run deterministic operational AI mappings by industry, role, and pain point. Search and compare saved explorer results.',
  alternates: {
    canonical: '/explorer',
  },
  openGraph: {
    title: 'Guided Explorer | BrainStack Studio',
    description:
      'Deterministic operational AI mappings with confidence scoring, decision trails, and saved run history.',
    url: '/explorer',
    type: 'website',
  },
};

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
