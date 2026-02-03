'use client';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Shield, Lock, Eye } from 'lucide-react';

export default function SecurityPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Security</h1>
            <p className="text-slate-400">
              BrainStack Studio is designed to demonstrate capability without exposing proprietary
              infrastructure. Security is enforced through strict boundaries and deterministic
              scaffolding.
            </p>
          </div>

          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold">Boundary Enforcement</h2>
              </div>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>No internal agent names or orchestration logic exposed.</li>
                <li>No database schemas, infrastructure maps, or service topology shown.</li>
                <li>Deterministic outputs prevent data leakage from hidden sources.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold">Secure Operations</h2>
              </div>
              <p className="text-sm text-slate-300">
                Production deployments run behind authenticated capability facades with rate
                limiting and audit trails.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-300" />
                <h2 className="text-lg font-semibold">Responsible Disclosure</h2>
              </div>
              <p className="text-sm text-slate-300">
                If you discover a security issue, please use the enterprise intake form to contact
                us. We respond quickly and coordinate remediation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
