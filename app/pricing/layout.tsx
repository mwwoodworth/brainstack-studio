import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Compare Free, Pro, and Enterprise plans with live pricing data, capability breakdowns, and feature comparisons.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Pricing | BrainStack Studio',
    description:
      'Live pricing and feature comparison for BrainStack Studio operational AI plans.',
    url: '/pricing',
    type: 'website',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
