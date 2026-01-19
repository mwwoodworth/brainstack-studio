import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrainStack Studio - Multi-AI Platform',
  description: 'The worldwide tech platform powered by Claude, GPT, Gemini, and Perplexity. Access multiple AI models in one unified interface.',
  keywords: ['AI', 'Claude', 'GPT', 'Gemini', 'Perplexity', 'Multi-AI', 'Chat', 'Platform'],
  authors: [{ name: 'BrainOps' }],
  openGraph: {
    title: 'BrainStack Studio - Multi-AI Platform',
    description: 'Access Claude, GPT, Gemini, and Perplexity in one unified platform.',
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
