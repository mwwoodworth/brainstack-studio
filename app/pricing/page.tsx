'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Check,
  ArrowRight,
  Zap,
  Shield,
  Users,
  BarChart3,
  Loader2,
  Star,
  Building2,
  Rocket,
} from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    description: 'Explore operational AI at your own pace',
    price: '$0',
    period: 'forever',
    icon: Rocket,
    features: [
      'Guided Explorer with 12 industries',
      '15 interactive business tools',
      'Solution gallery with previews',
      'Audit-ready run summaries',
      'Local saved sessions',
    ],
    cta: 'Start Free',
    href: '/explorer',
    stripeplan: null,
  },
  {
    name: 'Pro',
    description: 'For teams ready to operationalize AI',
    price: '$99',
    period: '/month',
    icon: Star,
    features: [
      'Everything in Free, plus:',
      'Advanced workflow templates',
      'Team-shared saved sessions',
      'Exportable run summaries (PDF/CSV)',
      'Priority support (24hr SLA)',
      'API access for integrations',
      'Custom industry configurations',
    ],
    cta: 'Subscribe to Pro',
    href: null,
    stripeplan: 'pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'Custom implementation and deployment',
    price: 'Custom',
    period: 'per engagement',
    icon: Building2,
    features: [
      'Everything in Pro, plus:',
      'Dedicated implementation team',
      'System integration and onboarding',
      'Custom governance and audit trails',
      'SLA-backed reliability guarantees',
      'White-label deployment option',
      'On-premise / VPC available',
    ],
    cta: 'Request Implementation',
    href: '/contact',
    stripeplan: null,
  },
];

const VALUE_PROPS = [
  {
    icon: BarChart3,
    title: 'Measurable ROI',
    description: 'Every workflow shows projected time saved, error reduction, and revenue impact before you commit.',
  },
  {
    icon: Shield,
    title: 'Audit-Ready',
    description: 'Full decision trails and run summaries that satisfy compliance and governance requirements.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share sessions, templates, and insights across your organization with role-based access.',
  },
  {
    icon: Zap,
    title: 'No Lock-In',
    description: 'Cancel anytime. Export your data. We earn your business every month through results, not contracts.',
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(plan: string) {
    setLoading(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.authRedirect) {
        window.location.href = data.authRedirect;
      } else {
        console.error('Checkout error:', data.error);
        setLoading(null);
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      setLoading(null);
    }
  }

  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="primary" className="mb-4">Pricing</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Start free. Scale when ready.
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              No credit card for free tier. No lock-in contracts.
              Upgrade to Pro when you need advanced workflows, team collaboration, and priority support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`h-full flex flex-col ${plan.popular
                ? 'border-cyan-500 ring-2 ring-cyan-500/30 relative'
                : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary" className="shadow-lg shadow-cyan-500/20">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      plan.popular ? 'bg-cyan-500/20' : 'bg-white/5'
                    }`}>
                      <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-cyan-400' : 'text-slate-300'}`} />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                  </div>
                  <p className="text-sm text-slate-300">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-slate-300 ml-1">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 text-sm flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2.5">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${
                          feature.startsWith('Everything') ? 'text-cyan-400' : 'text-emerald-400'
                        }`} />
                        <span className={feature.startsWith('Everything') ? 'text-cyan-300 font-medium' : 'text-slate-300'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {plan.stripeplan ? (
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={() => handleCheckout(plan.stripeplan!)}
                        disabled={loading !== null}
                      >
                        {loading === plan.stripeplan ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            {plan.cta}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button asChild size="lg" className="w-full" variant={plan.popular ? 'primary' : 'secondary'}>
                        <Link href={plan.href!}>
                          {plan.cta}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Value Props */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map((prop, idx) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent>
                    <prop.icon className="w-8 h-8 text-cyan-400 mb-3" />
                    <h3 className="font-semibold mb-1">{prop.title}</h3>
                    <p className="text-sm text-slate-300">{prop.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to operationalize AI?</h2>
          <p className="text-slate-300">
            Start with the free Explorer and tools. When you see the value, Pro gives you the power
            to scale workflows across your entire team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explorer">
              <Button size="lg">Try Free Explorer</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">Talk to Sales</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
