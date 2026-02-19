import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platform Trust & Technology',
  description:
    'Secure operational AI built to ship. Controlled automation, governance, observability, and human-in-the-loop safety for enterprise workflows.',
  alternates: {
    canonical: '/technology',
  },
  openGraph: {
    title: 'Platform Trust and Technology | BrainStack Studio',
    description:
      'Enterprise-grade operational AI with safety rails, audit trails, and secure integration by design.',
    url: '/technology',
    type: 'website',
  },
};

export default function TechnologyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
