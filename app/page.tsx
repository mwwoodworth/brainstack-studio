'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Shield,
  Target,
  Zap,
  Calculator,
  Sparkles,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SOLUTIONS } from '@/lib/solutions';
import { ToolCard } from '@/components/tools';
import { getFeaturedTools } from '@/lib/tools';

const STATS = [
  { value: '5', label: 'Industries Supported' },
  { value: 'Deterministic', label: 'Workflow Previews' },
  { value: 'Confidence', label: 'Scored Outputs' },
  { value: 'IP-Safe', label: 'Public Demos' },
];

const TRUST_MECHANISMS = [
  {
    title: 'Confidence Scoring',
    description: 'Every output includes a confidence score with explicit uncertainty signaling.',
  },
  {
    title: 'Deterministic Outputs',
    description: 'Bounded results that do not hallucinate or over-promise.',
  },
  {
    title: 'Decision Trails',
    description: 'User-visible summaries that show how conclusions are formed.',
  },
  {
    title: 'Clear Boundaries',
    description: 'We show what is safe to show and keep proprietary infrastructure hidden.',
  },
];

const HOW_IT_WORKS = [
  {
    title: 'Context Intake',
    description: 'Industry, role, and pain-point selection.',
    icon: Target,
  },
  {
    title: 'Solution Mapping',
    description: 'Deterministic workflow and automation preview.',
    icon: ClipboardList,
  },
  {
    title: 'Value Demonstration',
    description: 'Time saved, errors prevented, decision latency reduced.',
    icon: Zap,
  },
  {
    title: 'Deployment Paths',
    description: 'Subscribe, request implementation, or unlock advanced tools.',
    icon: Shield,
  },
];

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="primary" className="mb-6">
              BrainStack Studio
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Operational AI solutions,
              <br />
              built for trust.
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10">
              BrainStack Studio is where teams explore operational AI workflows built on BrainOps.
              Get deterministic previews, confidence-scored outputs, and decision trails—without
              exposing proprietary infrastructure. Start with the Guided Explorer or browse
              solutions, then move to a scoped implementation when there&apos;s a clear fit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/explorer">
                <Button size="xl">
                  Run Guided Explorer
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/solutions">
                <Button variant="secondary" size="xl">
                  View Solutions
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-400">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Guided AI Explorer</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A deterministic flow that maps your operational pain to an actionable AI workflow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent>
                    <item.icon className="w-8 h-8 text-cyan-400 mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Tools Showcase */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="primary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" aria-hidden="true" />
              Free Tools
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Try Before You Buy</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Interactive calculators and analyzers you can use right now. No signup required.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFeaturedTools().map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/tools">
              <Button size="lg" variant="secondary">
                <Calculator className="w-5 h-5" />
                Browse All Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Preview */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Solution Gallery</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Specific, believable, and safe to share. Each solution is a bounded preview.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {SOLUTIONS.slice(0, 4).map((solution) => (
              <Card key={solution.slug} className="h-full">
                <CardHeader>
                  <CardTitle>{solution.name}</CardTitle>
                  <p className="text-sm text-slate-400">{solution.industry}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-300">{solution.problem}</p>
                  <div className="flex flex-wrap gap-2">
                    {solution.outputs.slice(0, 3).map((output) => (
                      <Badge key={output} variant="default" className="text-xs">
                        {output}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/solutions/${solution.slug}`} className="inline-flex items-center text-sm text-cyan-400">
                    View solution <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/solutions">
              <Button size="lg" variant="secondary">
                Browse All Solutions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Mechanisms */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trust & Reliability</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              BrainStack Studio is designed to show what AI can do without hiding its limits.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {TRUST_MECHANISMS.map((item) => (
              <Card key={item.title}>
                <CardContent className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mt-1" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teaser */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <Badge variant="warning">Coming Soon</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Prompt-to-Operational System</h2>
          <p className="text-slate-400 max-w-3xl mx-auto">
            We are building AI that can assemble operational SaaS systems from intent — safely,
            deterministically, and responsibly. This capability is not yet public.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/contact">
              <Button size="lg">Join the Pilot List</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" size="lg">View Plans</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
