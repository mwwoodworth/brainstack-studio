import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Implementation',
  description:
    'Share your operational context and receive a scoped AI implementation plan. Enterprise intake for BrainStack Studio deployments.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Request Implementation | BrainStack Studio',
    description:
      'Enterprise intake form for operational AI deployments. Share your context, get a scoped implementation plan.',
    url: '/contact',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
