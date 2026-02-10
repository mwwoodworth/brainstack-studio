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
  BarChart3,
  Brain,
  Lock,
  TrendingUp,
  Clock,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SOLUTIONS } from '@/lib/solutions';
import { ToolCard } from '@/components/tools';
import { getFeaturedTools } from '@/lib/tools';

const METRICS = [
  { value: '15+', label: 'Free Tools', icon: Calculator },
  { value: '12', label: 'Industries', icon: Target },
  { value: '72', label: 'Workflow Maps', icon: ClipboardList },
  { value: '100%', label: 'Audit-Ready', icon: Shield },
];

const TRUST_MECHANISMS = [
  {
    title: 'Guardrails & Approvals',
    description: 'Automation runs within explicit rules and can require human approval for high-impact actions.',
    icon: Shield,
  },
  {
    title: 'Audit-Ready Traces',
    description: 'Every run captures inputs, outputs, and key decisions so teams can review and improve.',
    icon: ClipboardList,
  },
  {
    title: 'Secure by Default',
    description: "Your data stays isolated. Least-privilege access. Your proprietary data never trains public models.",
    icon: Lock,
  },
  {
    title: 'Measurable Outcomes',
    description: 'We focus on cycle time, error reduction, and revenue impact. Value you can see and quantify.',
    icon: BarChart3,
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Discover',
    description: 'Select your industry, role, and pain point. Our Explorer maps workflows in seconds.',
    icon: Target,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  {
    step: '02',
    title: 'Preview',
    description: 'See a realistic walkthrough with confidence scores, projected savings, and decision trails.',
    icon: ClipboardList,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    step: '03',
    title: 'Pilot',
    description: 'Run a scoped pilot with guardrails. Measure real results before scaling.',
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    step: '04',
    title: 'Deploy',
    description: 'Integrate with your systems. Monitor, harden, and scale across the organization.',
    icon: Shield,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
  },
];

const PAIN_POINTS = [
  { icon: Clock, text: 'Teams spending hours on repetitive operational decisions' },
  { icon: AlertTriangle, text: 'Errors from manual processes that should be automated' },
  { icon: TrendingUp, text: 'Revenue leaking through slow, inconsistent workflows' },
  { icon: Users, text: 'Scaling operations without proportional headcount' },
];

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="primary" className="mb-6">
              <Brain className="w-3 h-3 mr-1" />
              Operational AI Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              AI that runs your
              <br />
              <span className="text-gradient">operations</span>, not your mouth.
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10">
              BrainStack Studio turns real workflows into reliable AI automation.
              Deterministic. Auditable. Measurable. Start free with 15 business tools and
              a guided explorer across 12 industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/explorer">
                <Button size="xl">
                  Try the Explorer Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" size="xl">
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* Metrics bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {METRICS.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <stat.icon className="w-5 h-5 text-cyan-400" />
                    <span className="text-3xl font-bold text-white">{stat.value}</span>
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Sound familiar?</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {PAIN_POINTS.map((pain, idx) => (
              <motion.div
                key={pain.text}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-xl px-6 py-4"
              >
                <pain.icon className="w-6 h-6 text-amber-400 shrink-0" />
                <p className="text-slate-300">{pain.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-slate-400">
              BrainStack Studio was built to solve exactly these problems. <span className="text-cyan-400">Here&apos;s how.</span>
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge variant="default" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From Problem to Production</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A guided path that turns operational complexity into measurable automation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full group hover:border-white/20 transition-colors">
                  <CardContent>
                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="text-xs font-mono text-slate-500 mb-2">STEP {item.step}</div>
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
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="primary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Free Tools
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Try Before You Buy</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Interactive calculators and analyzers you can use right now. No signup. No credit card.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFeaturedTools().slice(0, 6).map((tool, idx) => (
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
                Browse All 15 Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Preview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Solution Gallery</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Practical workflows built for real teams. See what it does, what it needs, and how it ships.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {SOLUTIONS.slice(0, 4).map((solution, idx) => (
              <motion.div
                key={solution.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full hover:border-white/20 transition-colors">
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
                    <Link href={`/solutions/${solution.slug}`} className="inline-flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                      View solution <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
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
            <Badge variant="default" className="mb-4">
              <Shield className="w-3 h-3 mr-1" />
              Trust & Governance
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Real Operations</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Operational AI needs controls, not vibes. We build for governance, safety, and repeatability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {TRUST_MECHANISMS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card>
                  <CardContent className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="primary">
            <Sparkles className="w-3 h-3 mr-1" />
            Get Started
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to automate
            <br />
            <span className="text-gradient">real operations?</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start free with the Explorer and 15 business tools. No signup required.
            Upgrade to Pro at $99/mo when you need team collaboration and advanced workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/explorer">
              <Button size="xl">
                Try the Explorer Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" size="xl">
                Subscribe to Pro - $99/mo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-500">
            No credit card required for free tier. Cancel Pro anytime.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
