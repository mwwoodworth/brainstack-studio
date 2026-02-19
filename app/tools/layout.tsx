import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Business Tools',
  description:
    'Free AI-powered calculators, analyzers, and generators for real business problems. ROI calculator, cash flow forecaster, lead scorer, SOP generator, and more.',
  keywords: [
    'Free Business Tools',
    'ROI Calculator',
    'Cash Flow Forecaster',
    'Lead Scorer',
    'SOP Generator',
    'AI Business Tools',
    'Operational AI Tools',
  ].join(', '),
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'Free Business Tools | BrainStack Studio',
    description:
      '15 free AI-powered business tools. Calculators, analyzers, and generators for operations, finance, HR, and sales.',
    url: '/tools',
    type: 'website',
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
