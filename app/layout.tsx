import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BrainOps | The First Business AI Operating System',
  description: 'BrainOps AI OS is the world\'s first autonomous AI Operating System for business. 59 AI agents, 245 integrated tools, persistent memory, and 24/7 autonomous operations.',
  keywords: 'AI Operating System, Business AI, Autonomous AI, AI Agents, Enterprise AI, AUREA, Self-Healing AI, Multi-Agent Orchestration, BrainOps',
  openGraph: {
    title: 'BrainOps | The First Business AI Operating System',
    description: 'The OS that runs your company, not just your computer. 59 autonomous AI agents. 245 tools. Persistent memory. Self-healing. 24/7 operations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
