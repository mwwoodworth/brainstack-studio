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
    title: 'Controlled Automation',
    description: 'Workflows run within explicit constraints, with clear inputs and outputs.',
  },
  {
    title: 'Governance & Observability',
    description: 'Runs are traceable and measurable, so teams can monitor performance and risk.',
  },
  {
    title: 'Secure Integration',
    description: 'Connect to real systems with least-privilege access and scoped integrations.',
  },
  {
    title: 'Human-in-the-Loop',
    description: 'People stay in control for exceptions and high-impact actions.',
  },
];

const SAFETY_RAILS = [
  'Public demos use safe examples and sanitized data.',
  'Production deployments run behind authentication and role-based access.',
  'Data access is scoped to explicit integrations and permissions.',
  'High-impact actions can require approvals and audit trails.',
];

export default function TechnologyPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="primary" className="mb-4">Platform Trust</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Secure operational AI, built to ship.</h1>
            <p className="text-slate-300 max-w-2xl mx-auto">
              BrainStack Studio is engineered for operational use: controlled automation, secure integration, and clear governance.
              We prioritize safety, observability, and auditability so AI can be trusted in production.
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
                  <p className="text-sm text-slate-300">{principle.description}</p>
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
                Workflow summaries and realistic example outputs
              </div>
              <div className="flex gap-2">
                <Eye className="w-4 h-4 text-cyan-400 mt-0.5" />
                Audit trails and run traces (inputs, decisions, results)
              </div>
              <div className="flex gap-2">
                <Eye className="w-4 h-4 text-cyan-400 mt-0.5" />
                Industry-specific previews and free operational tools
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
          <p className="text-slate-300">
            We scope and deploy operational AI with clear guardrails, auditable workflows, and measurable outcomes.
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
