'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';

export default function CheckoutSuccessPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold">
              Welcome to <span className="text-gradient">Pro</span>
            </h1>

            <p className="text-lg text-slate-400 max-w-lg mx-auto">
              Your subscription is active. You now have access to advanced workflow templates,
              team collaboration, exportable run summaries, and priority support.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                What&apos;s unlocked
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Advanced workflow templates for your industry
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Team-shared saved sessions and collaboration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Exportable audit-ready run summaries (PDF/CSV)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Priority support with 24-hour response SLA
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/explorer">
                <Button size="lg">
                  Launch Explorer
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button variant="secondary" size="lg">
                  Browse Pro Tools
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
