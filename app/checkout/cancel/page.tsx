'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, ArrowRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';

export default function CheckoutCancelPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-slate-500/20 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-slate-400" />
            </div>

            <h1 className="text-4xl font-bold">Checkout Cancelled</h1>

            <p className="text-lg text-slate-400 max-w-lg mx-auto">
              No worries. You can continue using our free tools and Explorer.
              When you&apos;re ready, the Pro plan will be here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/pricing">
                <Button size="lg">
                  Back to Pricing
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/explorer">
                <Button variant="secondary" size="lg">
                  Continue Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
