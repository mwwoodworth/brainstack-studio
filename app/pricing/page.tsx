'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Check,
  Sparkles,
  Zap,
  Building2,
  MessageSquare,
  Brain,
  Globe,
  Shield,
  Headphones,
  Code,
} from 'lucide-react';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Free',
    description: 'Perfect for trying out BrainStack Studio',
    price: '$0',
    period: 'forever',
    features: [
      'Access to AI Playground',
      'Claude, GPT, Gemini models',
      'Local conversation storage',
      'Basic code highlighting',
      'Community support',
    ],
    cta: 'Get Started',
    href: '/playground',
    popular: false,
  },
  {
    name: 'Pro (Lifetime)',
    description: 'Get the complete BrainOps source code & tools',
    price: '$997',
    period: 'one-time',
    features: [
      'Everything in Free',
      'Full Source Code Access',
      'AI Orchestrator Framework',
      'SaaS ERP Starter Kit',
      'Automation Pack (Make.com)',
      'Priority support',
      'Lifetime updates',
    ],
    cta: 'Get Lifetime Access',
    href: 'https://gumroad.com/l/gr-ultimate',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For teams and organizations',
    price: 'Custom',
    period: '',
    features: [
      'Everything in Pro',
      'Unlimited API access',
      'Team collaboration',
      'SSO & SAML',
      'Custom model fine-tuning',
      'Dedicated support',
      'SLA guarantees',
      'On-premise deployment',
    ],
    cta: 'Contact Sales',
    href: 'mailto:sales@brainops.io?subject=Enterprise%20Inquiry',
    popular: false,
  },
];

const FEATURES_COMPARISON = [
  { feature: 'AI Playground', free: true, pro: true, enterprise: true },
  { feature: 'Claude Opus 4.5', free: true, pro: true, enterprise: true },
  { feature: 'GPT-5.2', free: true, pro: true, enterprise: true },
  { feature: 'Gemini 3 Pro', free: true, pro: true, enterprise: true },
  { feature: 'Perplexity Sonar', free: false, pro: true, enterprise: true },
  { feature: 'Local Storage', free: true, pro: true, enterprise: true },
  { feature: 'Cloud Sync', free: false, pro: true, enterprise: true },
  { feature: 'API Access', free: false, pro: '100K tokens', enterprise: 'Unlimited' },
  { feature: 'Custom System Prompts', free: false, pro: true, enterprise: true },
  { feature: 'Team Collaboration', free: false, pro: false, enterprise: true },
  { feature: 'SSO/SAML', free: false, pro: false, enterprise: true },
  { feature: 'Support', free: 'Community', pro: 'Priority', enterprise: 'Dedicated' },
];

const FAQ = [
  {
    question: 'Can I switch plans at any time?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.',
  },
  {
    question: 'Do I need API keys for the Free plan?',
    answer: 'For self-hosted deployments, yes. For our hosted version, we provide API access through your BrainStack account.',
  },
  {
    question: 'What happens to my data if I downgrade?',
    answer: 'Your data remains intact. Cloud-synced conversations will become read-only on the Free plan until you upgrade again.',
  },
  {
    question: 'Is there a discount for annual billing?',
    answer: 'Yes! Annual billing saves you 20%. Pro annual is $279/year instead of $348.',
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Simple, Transparent</span>
              <br />
              <span className="text-white">Pricing</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge variant="primary" className="px-4 py-1">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card
                  className={`h-full flex flex-col ${
                    plan.popular ? 'border-cyan-500 ring-1 ring-cyan-500' : ''
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-slate-400 text-sm">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-slate-400">{plan.period}</span>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={plan.href}>
                      <Button
                        className="w-full"
                        variant={plan.popular ? 'primary' : 'secondary'}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Compare Plans</h2>
            <p className="text-slate-400">See what's included in each plan</p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 font-medium text-slate-400">Feature</th>
                  <th className="text-center py-4 px-4 font-medium">Free</th>
                  <th className="text-center py-4 px-4 font-medium text-cyan-400">Pro</th>
                  <th className="text-center py-4 px-4 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES_COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? (
                          <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600">—</span>
                        )
                      ) : (
                        <span className="text-slate-400 text-sm">{row.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center bg-cyan-500/5">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600">—</span>
                        )
                      ) : (
                        <span className="text-cyan-400 text-sm">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? (
                          <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600">—</span>
                        )
                      ) : (
                        <span className="text-slate-400 text-sm">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <CardContent>
                    <h3 className="font-semibold mb-2">{item.question}</h3>
                    <p className="text-slate-400 text-sm">{item.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card variant="gradient">
            <CardContent className="text-center py-12">
              <Zap className="w-12 h-12 text-amber-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Join thousands of developers using BrainStack Studio to build amazing AI-powered applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/playground">
                  <Button size="lg">Start Free Today</Button>
                </Link>
                <Link href="/docs">
                  <Button variant="secondary" size="lg">View Documentation</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
