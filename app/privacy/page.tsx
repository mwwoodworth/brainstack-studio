'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Shield, EyeOff, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Privacy</h1>
            <p className="text-slate-400">
              BrainStack Studio is designed to minimize data exposure. We prioritize local storage
              and deterministic outputs over invasive tracking.
            </p>
          </div>

          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold">What We Collect</h2>
              </div>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>Anonymous telemetry events (if enabled) to understand usage patterns.</li>
                <li>Enterprise intake data submitted through the contact form.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold">What We Do Not Collect</h2>
              </div>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>No hidden background recordings or undisclosed tracking.</li>
                <li>No internal system data or customer data from BrainOps.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-300" />
                <h2 className="text-lg font-semibold">Your Controls</h2>
              </div>
              <p className="text-sm text-slate-300">
                You can disable telemetry or clear local sessions in Settings. For data removal
                requests, contact the BrainStack Studio team through the enterprise intake form.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
