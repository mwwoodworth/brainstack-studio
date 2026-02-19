import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'BrainStack Studio Terms of Service. Terms governing your access to and use of BrainStack Studio platform, APIs, and related services.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | BrainStack Studio',
    description:
      'Terms governing access to and use of the BrainStack Studio operational AI platform.',
    url: '/terms',
    type: 'website',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
