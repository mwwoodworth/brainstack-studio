import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="text-8xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            404
          </div>
          <h1 className="text-3xl font-bold">Page not found</h1>
          <p className="text-slate-400 text-lg">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/">
              <Button size="lg">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/tools">
              <Button variant="secondary" size="lg">
                <Search className="w-4 h-4" />
                Explore Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
