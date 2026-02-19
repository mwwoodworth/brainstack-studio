import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'BrainStack Studio Privacy Policy. Learn what data we collect, how we use it, and your controls over your information.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | BrainStack Studio',
    description:
      'What data BrainStack Studio collects, how we use it, and your choices.',
    url: '/privacy',
    type: 'website',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
