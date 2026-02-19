import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'BrainStack Studio is an operational AI platform built for trust, clarity, and audit-ready automation. Learn about our mission, values, and journey.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About | BrainStack Studio',
    description:
      'Operational AI built for trust. Learn about our mission, values, and the journey behind BrainStack Studio.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
