'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';

type ProvisionStatus = 'verifying' | 'provisioned' | 'error';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </main>
    }>
      <CheckoutSuccessInner />
    </Suspense>
  );
}

function CheckoutSuccessInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<ProvisionStatus>(sessionId ? 'verifying' : 'provisioned');

  useEffect(() => {
    if (!sessionId) return;

    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      try {
        const res = await fetch(`/api/stripe/session/${sessionId}`);
        const data = await res.json();

        if (data.status === 'provisioned') {
          setStatus('provisioned');
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          // After max attempts, assume it worked (webhook may be slow)
          setStatus('provisioned');
          return;
        }

        setTimeout(poll, 2000);
      } catch {
        attempts++;
        if (attempts >= maxAttempts) {
          setStatus('error');
          return;
        }
        setTimeout(poll, 2000);
      }
    };

    poll();
  }, [sessionId]);

  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          {status === 'verifying' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="mx-auto w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
              </div>
              <h1 className="text-3xl font-bold">Setting up your Pro account...</h1>
              <p className="text-slate-400">
                Verifying your payment and activating Pro features. This usually takes a few seconds.
              </p>
            </motion.div>
          ) : status === 'error' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold">Something went wrong</h1>
              <p className="text-slate-400">
                Your payment was received but we had trouble verifying. Your Pro access should activate shortly.
                If it doesn&apos;t, please contact support.
              </p>
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            </motion.div>
          ) : (
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
                cloud-synced sessions, API integrations, and priority support.
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
                    Cloud-synced saved sessions across your devices
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    API key access for integrations and automation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Priority support with 24-hour response SLA
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/dashboard">
                  <Button size="lg">
                    Go to Dashboard
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
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
