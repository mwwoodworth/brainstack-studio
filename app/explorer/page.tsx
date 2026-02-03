'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { GuidedExplorer } from '@/components/GuidedExplorer';

export default function ExplorerPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />
      <GuidedExplorer />
      <Footer />
    </main>
  );
}
