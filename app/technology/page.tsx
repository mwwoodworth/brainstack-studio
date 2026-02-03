'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Shield,
  Target,
  CheckCircle2,
  Lock,
  Eye,
  ClipboardCheck,
} from 'lucide-react';

const PRINCIPLES = [
  {
    title: 'Deterministic Outputs',
    description: 'Every response is bounded and generated from a controlled scaffold. No surprises.',
  },
  {
    title: 'Confidence & Uncertainty',
    description: 'We score confidence and explicitly flag when more detail is required.',
  },
  {
    title: 'Clear Boundaries',
    description: 'BSS exposes capability facades, not proprietary infrastructure.',
  },
  {
    title: 'Operational Safety',
    description: 'Decision trails and audit-friendly summaries are always visible.',
  },
];

const SAFETY_RAILS = [
  'No internal agent names, orchestration logic, or system topology exposed.',
  'No database schemas, internal tables, or infrastructure diagrams.',
  'All outputs are example-grade and bounded to provided context.',
  'Enterprise deployments require explicit scope and approval.',
];

export default function TechnologyPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="primary" className="mb-4">Platform Trust</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Operational AI, without the engine room.</h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              BrainStack Studio is intentionally restrained. We show what is safe to show, and we keep
              proprietary systems hidden. Trust is a design constraint, not an afterthought.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {PRINCIPLES.map((principle) => (
            <Card key={principle.title}>
              <CardContent className="flex gap-3">
                <Target className="w-6 h-6 text-cyan-400 mt-1" />
                <div>
                  <h3 className="font-semibold">{principle.title}</h3>
                  <p className="text-sm text-slate-400">{principle.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="pb-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Safety Rails
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              {SAFETY_RAILS.map((rail) => (
                <div key={rail} className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                  {rail}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-cyan-400" />
                What We Show
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <div className="flex gap-2">
                <Eye className="w-4 h-4 text-cyan-400 mt-0.5" />
                Deterministic workflow summaries and bounded outputs
              </div>
              <div className="flex gap-2">
                <Eye className="w-4 h-4 text-cyan-400 mt-0.5" />
                Confidence scores, uncertainty notes, and decision trails
              </div>
              <div className="flex gap-2">
                <Eye className="w-4 h-4 text-cyan-400 mt-0.5" />
                Industry-specific capability previews (sandboxed)
              </div>
              <div className="flex gap-2">
                <Lock className="w-4 h-4 text-amber-300 mt-0.5" />
                Proprietary infrastructure and internal logic remain private
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready for deployment?</h2>
          <p className="text-slate-400">
            We scope and deploy operational AI with clear guardrails, audited workflows, and
            deterministic outputs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Request Implementation</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/solutions">View Solutions</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
