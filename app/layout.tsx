import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrainStack Studio - Operational AI, Built for Trust',
  description:
    'BrainStack Studio is the public interface for BrainOps, showcasing deterministic operational AI workflows without exposing proprietary systems.',
  keywords: ['Operational AI', 'Deterministic', 'AI Studio', 'Workflow Automation', 'BrainOps'],
  authors: [{ name: 'BrainOps' }],
  openGraph: {
    title: 'BrainStack Studio - Operational AI, Built for Trust',
    description:
      'Deterministic operational AI workflows with clear boundaries and confidence scoring.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
