'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
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
  FileText,
  Activity,
  ShieldCheck,
  Building2,
  Briefcase,
  Globe,
  Server,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SOLUTIONS } from '@/lib/solutions';
import { ToolCard } from '@/components/tools';
import { getFeaturedTools } from '@/lib/tools';

const METRICS = [
  { value: '15', label: 'Free AI Tools', icon: Calculator },
  { value: '12', label: 'Industries Supported', icon: Globe },
  { value: '100%', label: 'Deterministic Output', icon: ShieldCheck },
  { value: '5', label: 'Solution Blueprints', icon: ClipboardList },
];

const USE_CASES = [
  {
    title: 'Finance Operations',
    description: 'Automate invoice reconciliation, expense approvals, and audit prep.',
    icon: TrendingUp,
    color: 'text-emerald-400',
  },
  {
    title: 'HR & People Ops',
    description: 'Streamline onboarding, benefits enrollment, and compliance checks.',
    icon: Users,
    color: 'text-violet-400',
  },
  {
    title: 'IT Service Management',
    description: 'Auto-triage tickets, provision access, and manage asset lifecycles.',
    icon: Server,
    color: 'text-cyan-400',
  },
  {
    title: 'Sales Operations',
    description: 'Enrich leads, generate contracts, and automate deal desk approvals.',
    icon: Briefcase,
    color: 'text-amber-400',
  },
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

const PROOF_TABS = [
  {
    id: 'trace',
    label: 'Run Trace',
    icon: Activity,
    title: 'Sample Run Trace',
    description: 'Every workflow execution captures a full decision trail.',
    content: [
      { label: 'Trigger', value: 'Weekly churn risk scan', type: 'input' },
      { label: 'Data Sources', value: '3 connected (CRM, billing, support)', type: 'input' },
      { label: 'Accounts Scanned', value: '847', type: 'metric' },
      { label: 'High-Risk Flagged', value: '23 accounts (2.7%)', type: 'metric' },
      { label: 'Confidence', value: '94.2%', type: 'success' },
      { label: 'Decision', value: 'Auto-escalated 8 accounts to CS team; 15 queued for review', type: 'output' },
      { label: 'Approval Gate', value: 'Manager approval required for accounts > $50K ARR', type: 'guard' },
      { label: 'Duration', value: '12.4s', type: 'metric' },
    ],
  },
  {
    id: 'audit',
    label: 'Audit Trail',
    icon: FileText,
    title: 'Sample Audit Trail',
    description: 'Immutable log of every input, decision, and output.',
    content: [
      { label: '09:00:01', value: 'Workflow initiated by scheduled trigger', type: 'input' },
      { label: '09:00:02', value: 'Data fetched from 3 integrations (CRM, Stripe, Zendesk)', type: 'input' },
      { label: '09:00:03', value: 'Churn model applied: logistic regression + rule engine', type: 'metric' },
      { label: '09:00:08', value: 'Risk scores computed for 847 accounts', type: 'metric' },
      { label: '09:00:09', value: 'Threshold filter: 23 accounts above 0.75 risk score', type: 'output' },
      { label: '09:00:10', value: 'Approval gate triggered for 3 enterprise accounts', type: 'guard' },
      { label: '09:00:12', value: 'Notifications dispatched: Slack + email to CS leads', type: 'output' },
      { label: '09:00:12', value: 'Run complete. Trace ID: run_2026_02_16_0900_churn_scan', type: 'success' },
    ],
  },
  {
    id: 'governance',
    label: 'Governance Rules',
    icon: ShieldCheck,
    title: 'Sample Governance Model',
    description: 'Explicit rules that bound every automated decision.',
    content: [
      { label: 'Scope', value: 'Churn prevention workflow — SaaS accounts only', type: 'input' },
      { label: 'Data Access', value: 'Read-only: CRM contacts, billing status, ticket history', type: 'guard' },
      { label: 'Confidence Floor', value: 'Suppress actions below 85% confidence', type: 'guard' },
      { label: 'Approval Required', value: 'Accounts with ARR > $50K require human approval', type: 'guard' },
      { label: 'Rate Limit', value: 'Max 50 auto-escalations per run', type: 'guard' },
      { label: 'Fallback', value: 'Queue for manual review if model uncertainty > 20%', type: 'output' },
      { label: 'Retention', value: 'All traces retained 90 days; exportable as CSV/JSON', type: 'metric' },
      { label: 'Owner', value: 'CS Operations Lead (role-based, revocable)', type: 'input' },
    ],
  },
];

const SOFTWARE_APPLICATION_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BrainStack Studio',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '0',
    highPrice: '99',
    priceCurrency: 'USD',
    offerCount: '3',
  },
};

function ProofArtifactStrip() {
  const [activeTab, setActiveTab] = useState('trace');
  const activeProof = PROOF_TABS.find((t) => t.id === activeTab)!;

  const typeStyles: Record<string, string> = {
    input: 'text-slate-400',
    metric: 'text-cyan-400',
    output: 'text-emerald-400',
    success: 'text-emerald-300 font-medium',
    guard: 'text-amber-400',
  };

  return (
    <section className="py-16 px-6 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <Badge variant="default" className="mb-4">
            <Shield className="w-3 h-3 mr-1" />
            Proof, Not Promises
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">See What the Output Looks Like</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Every workflow produces traceable, auditable artifacts. Here are real examples.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist">
          {PROOF_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <activeProof.icon className="w-5 h-5 text-cyan-400" />
                <CardTitle className="text-lg">{activeProof.title}</CardTitle>
              </div>
              <p className="text-sm text-slate-400">{activeProof.description}</p>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm space-y-1 bg-black/30 rounded-lg p-4 border border-white/5 overflow-x-auto">
                <div className="min-w-[600px]">
                  {activeProof.content.map((line, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-slate-500 w-32 shrink-0 text-right">{line.label}</span>
                      <span className="text-slate-600">|</span>
                      <span className={typeStyles[line.type] || 'text-slate-300'}>{line.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center">
                Sample data. Real deployments connect to your systems with full governance controls.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <JsonLd id="home-softwareapplication-jsonld" data={SOFTWARE_APPLICATION_STRUCTURED_DATA} />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]" />
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              AI that runs your
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">operations</span>, end-to-end.
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
              BrainStack Studio turns real workflows into reliable AI automation.
              Deterministic. Auditable. Measurable.
            </p>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Deterministic = bounded outputs + explicit rules + approval gates + full traceability.
              No hallucinations. No black boxes. Start free with 15 tools and a guided explorer across 12 industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/explorer">
                <Button size="xl" aria-label="Try the Explorer Free">
                  Try the Explorer Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" size="xl" aria-label="View Pricing">
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* Metrics bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-white/5 pt-10">
              {METRICS.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="text-center group"
                >
                  <div className="flex items-center justify-center gap-2 mb-1 group-hover:scale-105 transition-transform">
                    <stat.icon className="w-5 h-5 text-cyan-400" />
                    <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise Use Cases</h2>
            <p className="text-slate-400">Proven automation patterns for every department.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {USE_CASES.map((useCase, idx) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full hover:bg-white/5 transition-colors">
                  <CardHeader>
                    <div className="mb-4">
                      <useCase.icon className={`w-8 h-8 ${useCase.color}`} />
                    </div>
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400">{useCase.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof Artifact Strip */}
      <ProofArtifactStrip />

      {/* Pain Points */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-xl px-6 py-5 hover:border-white/10 transition-colors"
              >
                <pain.icon className="w-6 h-6 text-amber-400 shrink-0" />
                <p className="text-slate-300 font-medium">{pain.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-slate-400">
              BrainStack Studio was built to solve exactly these problems. <span className="text-cyan-400 font-medium">Here&apos;s how.</span>
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="default" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From Problem to Production</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              A guided path that turns operational complexity into measurable automation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full group hover:border-white/20 transition-colors border-t-4 border-t-transparent hover:border-t-cyan-500/50">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="text-xs font-mono text-slate-500 mb-2">STEP {item.step}</div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
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
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="primary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Free Tools
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Try Before You Buy</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Interactive calculators and analyzers you can use right now. No signup. No credit card.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFeaturedTools().slice(0, 6).map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/tools">
              <Button size="lg" variant="secondary" aria-label="Browse all tools">
                <Calculator className="w-5 h-5 mr-2" />
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
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Solution Gallery</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Practical workflows built for real teams. See what it does, what it needs, and how it ships.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {SOLUTIONS.slice(0, 4).map((solution, idx) => (
              <motion.div
                key={solution.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full hover:border-white/20 transition-colors flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{solution.name}</CardTitle>
                      <Badge variant="default" className="text-xs">{solution.industry}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col">
                    <p className="text-sm text-slate-300 flex-1">{solution.problem}</p>
                    <div className="flex flex-wrap gap-2">
                      {solution.outputs.slice(0, 3).map((output) => (
                        <Badge key={output} variant="default" className="text-xs bg-white/10 hover:bg-white/20">
                          {output}
                        </Badge>
                      ))}
                    </div>
                    <div className="pt-2">
                      <Link href={`/solutions/${solution.slug}`} className="inline-flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                        View solution <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/solutions">
              <Button size="lg" variant="secondary" aria-label="Browse all solutions">
                Browse All Solutions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Mechanisms */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="default" className="mb-4">
              <Shield className="w-3 h-3 mr-1" />
              Trust & Governance
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Real Operations</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Operational AI needs controls, not vibes. We build for governance, safety, and repeatability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {TRUST_MECHANISMS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="hover:border-emerald-500/30 transition-colors">
                  <CardContent className="flex gap-4 items-start pt-6">
                    <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">{item.title}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Results */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Teams That Ship</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Operations leaders use BrainStack Studio to cut cycle times, reduce manual errors, and scale without proportional headcount.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { metric: '15', label: 'Free AI-powered business tools', sublabel: 'No signup required to get started' },
              { metric: '100%', label: 'Deterministic, auditable outputs', sublabel: 'Every result includes a full trace' },
              { metric: '12', label: 'Industries with tailored solutions', sublabel: 'Finance, HR, IT, Sales, and more' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-3">
                  {stat.metric}
                </div>
                <p className="font-medium text-white mb-1">{stat.label}</p>
                <p className="text-sm text-slate-400">{stat.sublabel}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                principle: 'Deterministic outputs replace guesswork. Every workflow produces bounded, rule-governed results with explicit approval gates.',
                label: 'Proof, Not Promises',
                icon: 'audit',
              },
              {
                principle: 'Full traceability from input to output. Every decision has a reason. Every automation has a paper trail.',
                label: 'Built for Compliance',
                icon: 'trace',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full bg-white/[0.03]">
                  <CardContent className="pt-6">
                    <p className="text-slate-200 leading-relaxed mb-4">{item.principle}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-cyan-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-transparent to-cyan-900/10">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="primary">
            <Sparkles className="w-3 h-3 mr-1" />
            Get Started
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to automate
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">real operations?</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Start free with the Explorer and 15 business tools. No signup required.
            Upgrade to Pro at $99/mo when you need team collaboration and advanced workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/explorer">
              <Button size="xl" aria-label="Try Explorer Free">
                Try the Explorer Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" size="xl" aria-label="Subscribe to Pro">
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
