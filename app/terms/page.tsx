'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { ClipboardCheck, Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Terms of Use</h1>
            <p className="text-slate-400">
              BrainStack Studio provides example previews of operational AI capabilities. By using this site, you agree
              to these basic terms.
            </p>
          </div>

          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold">Acceptable Use</h2>
              </div>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>Use the Explorer and Solution Gallery for evaluation and planning.</li>
                <li>Do not attempt to reverse-engineer or probe internal systems.</li>
                <li>Respect rate limits and safety boundaries.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold">Disclaimers</h2>
              </div>
              <p className="text-sm text-slate-300">
                Outputs are example previews and are not legal, financial, or operational advice. Production deployments
                require a scoped agreement with BrainStack Studio.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
