'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, Lock, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    description: 'Guided Explorer with deterministic outputs',
    price: '$0',
    period: ' / forever',
    features: [
      'Guided AI Explorer (bounded)',
      'Solution previews',
      'Confidence scoring + decision trail',
      'Local-only saved sessions',
    ],
    cta: 'Start Free',
    href: '/explorer',
  },
  {
    name: 'Pro',
    description: 'Advanced workflows + saved sessions',
    price: '$99',
    period: ' / month',
    features: [
      'Advanced workflow templates',
      'Team-shared saved sessions',
      'Exportable decision trails',
      'Priority support',
    ],
    cta: 'Subscribe to Pro',
    href: '/contact',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'Custom ops solutions + deployment',
    price: 'Custom',
    period: '',
    features: [
      'Dedicated implementation team',
      'System integration & onboarding',
      'Compliance-ready audit trails',
      'SLA-backed reliability',
    ],
    cta: 'Request Implementation',
    href: '/contact',
  },
];

const CAPABILITIES = [
  {
    name: 'Advanced Forecasting',
    description: '13-week cash flow, demand forecasting, and scenario sensitivity.',
    price: '$1,500 / module',
  },
  {
    name: 'Process Automation Builder',
    description: 'Deterministic workflow builders with guardrails.',
    price: '$2,000 / module',
  },
  {
    name: 'Compliance Logic Pack',
    description: 'Audit-ready controls and exception handling.',
    price: '$1,200 / module',
  },
  {
    name: 'Scenario Modeling',
    description: 'Operational what-if modeling with safe constraints.',
    price: '$1,800 / module',
  },
];

export default function PricingPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="primary" className="mb-4">Pricing</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Revenue paths without pressure.</h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Start free. Upgrade when the workflows prove value. Enterprise deployments are scoped
              with clear boundaries and deterministic outcomes.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <Card key={plan.name} className={plan.popular ? 'border-cyan-500 ring-1 ring-cyan-500' : ''}>
              <CardHeader>
                {plan.popular && (
                  <Badge variant="primary" className="w-fit">Most Chosen</Badge>
                )}
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-sm text-slate-400">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-sm text-slate-400">{plan.period}</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="w-full">
                  <Link href={plan.href}>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="pb-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Lock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-bold">Pay-per-capability</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {CAPABILITIES.map((capability) => (
              <Card key={capability.name}>
                <CardContent>
                  <h3 className="font-semibold text-lg">{capability.name}</h3>
                  <p className="text-sm text-slate-400 mt-2">{capability.description}</p>
                  <div className="mt-4 text-sm font-semibold text-cyan-300">{capability.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">From Exploration to Implementation</h2>
          <p className="text-slate-400">
            Start with the Guided Explorer or a solution preview. When there&apos;s a clear fit, we scope a production
            implementation with requirements, integration plan, acceptance criteria, and deployment support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Request Implementation</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/solutions">Explore Solutions</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
