import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solution Gallery',
  description:
    'Explore operational AI workflows tailored to real industries. Each solution shows deterministic workflows, outputs, and production implementation paths.',
  alternates: {
    canonical: '/solutions',
  },
  openGraph: {
    title: 'Solution Gallery | BrainStack Studio',
    description:
      'Industry-specific operational AI solutions with deterministic workflows, audit trails, and clear deployment paths.',
    url: '/solutions',
    type: 'website',
  },
};

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
