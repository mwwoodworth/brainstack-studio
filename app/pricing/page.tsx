'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { FeatureComparisonRow, PlanId, PricingPlan } from '@/lib/pricing';
import {
  Check,
  ArrowRight,
  Loader2,
  Star,
  Building2,
  Rocket,
  RefreshCw,
  ShieldCheck,
  Lock,
  ChevronDown,
} from 'lucide-react';

type PricingResponse = {
  success: boolean;
  updatedAt: string;
  plans: PricingPlan[];
  comparison: FeatureComparisonRow[];
};

type BillingCycle = 'monthly' | 'annual';

const PLAN_ICONS = {
  free: Rocket,
  pro: Star,
  enterprise: Building2,
} as const;

const PLAN_ORDER: PlanId[] = ['free', 'pro', 'enterprise'];

const TRUST_SIGNALS = ['Encrypted at Rest', 'Audit Trail on Every Action', 'Cancel Anytime', 'No Lock-in Contracts'] as const;

const FAQ_ITEMS = [
  {
    id: 'cancel-anytime',
    question: 'Can I cancel anytime?',
    answer:
      'Yes. Cancel your subscription at any time from your dashboard. No lock-in contracts, no cancellation fees.',
  },
  {
    id: 'free-trial',
    question: 'Is there a free trial?',
    answer:
      'The Explorer and all 15 business tools are free forever. Pro features include a 14-day trial period.',
  },
  {
    id: 'payment-methods',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards via Stripe. Enterprise plans can pay via invoice.',
  },
  {
    id: 'switch-plans',
    question: 'Can I switch plans?',
    answer:
      'Yes. Upgrade or downgrade at any time. Changes take effect immediately, and we prorate billing automatically.',
  },
  {
    id: 'data-security',
    question: 'Is my data secure?',
    answer:
      'Absolutely. All data is encrypted at rest and in transit. Your data stays isolated and never trains public AI models. See our Security page for details.',
  },
  {
    id: 'post-trial',
    question: 'What happens after the trial?',
    answer:
      'After your 14-day Pro trial, you can continue on the free tier or subscribe to Pro. No automatic charges.',
  },
] as const;

const FAQ_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const VALUE_PROPS = [
  {
    title: 'Real capability data',
    description: 'Plan details hydrate from live pricing APIs and capability counts.',
  },
  {
    title: 'Deterministic outputs',
    description: 'All tiers use bounded workflows with explicit confidence signaling.',
  },
  {
    title: 'Operational scale path',
    description: 'Start self-serve, then expand to team workflows and enterprise deployment.',
  },
];

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount);
}

function getPlanPriceDisplay(plan: PricingPlan, billingCycle: BillingCycle) {
  if (plan.id === 'free' || plan.price.amount === 0) {
    return {
      amountText: '$0',
      billingText: null as string | null,
    };
  }

  if (plan.id === 'enterprise' || plan.price.amount === null) {
    return {
      amountText: 'Custom',
      billingText: null as string | null,
    };
  }

  const monthlyBaseAmount =
    plan.price.interval === 'year'
      ? Math.round(plan.price.amount / 12)
      : Math.round(plan.price.amount);

  return {
    amountText: `${formatCurrency(monthlyBaseAmount, plan.price.currency)}/mo`,
    billingText: null as string | null,
  };
}

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [pricingData, setPricingData] = useState<PricingResponse | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedComparisonPlan, setSelectedComparisonPlan] = useState<'all' | PlanId>('all');
  const [openComparisonRowId, setOpenComparisonRowId] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0]?.id ?? '');

  const comparisonRows = pricingData?.comparison ?? [];

  const sortedPlans = useMemo(() => {
    const plans = pricingData?.plans ?? [];
    return [...plans].sort((a, b) => PLAN_ORDER.indexOf(a.id) - PLAN_ORDER.indexOf(b.id));
  }, [pricingData]);

  async function loadPricingData() {
    setDataLoading(true);
    setDataError(null);
    try {
      const response = await fetch('/api/pricing', { cache: 'no-store' });
      const data = (await response.json()) as PricingResponse;

      if (!response.ok || !data.success) {
        throw new Error('Failed to load pricing');
      }

      setPricingData(data);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Failed to load pricing');
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    void loadPricingData();
  }, []);

  async function handleCheckout(plan: string) {
    setLoadingPlan(plan);
    setCheckoutError(null);
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
        setCheckoutError('Unable to start checkout. Please try again or contact support.');
        setLoadingPlan(null);
      }
    } catch {
      setCheckoutError('Something went wrong. Please try again.');
      setLoadingPlan(null);
    }
  }

  return (
    <main id="main-content" className="min-h-screen">
      <JsonLd id="pricing-faq-jsonld" data={FAQ_STRUCTURED_DATA} />
      <Navigation />

      <section className="pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="primary" className="mb-4">Pricing</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Start free. Scale when ready.</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Compare plans with live product and pricing data. Choose the level that matches your current
              operating complexity, then upgrade without migration friction.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Plans</h2>
            <Button variant="ghost" size="sm" onClick={loadPricingData} disabled={dataLoading}>
              {dataLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Refresh
            </Button>
          </div>

          {dataError && (
            <div className="mb-6 text-sm text-amber-300 border border-amber-500/20 bg-amber-500/10 rounded-lg px-3 py-2">
              {dataError}
            </div>
          )}

          {dataLoading && sortedPlans.length === 0 ? (
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading plans...
            </div>
          ) : (
            <>
              {/* Monthly billing only — annual pricing will be added when Stripe annual price is configured */}

              <div className="grid md:grid-cols-3 gap-6">
                {sortedPlans.map((plan, idx) => {
                  const PlanIcon = PLAN_ICONS[plan.id];
                  const priceDisplay = getPlanPriceDisplay(plan, billingCycle);
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                    >
                      <Card className={`h-full flex flex-col ${plan.popular ? 'border-cyan-500 ring-2 ring-cyan-500/30 relative' : ''}`}>
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <Badge variant="primary">Most Popular</Badge>
                          </div>
                        )}

                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${plan.popular ? 'bg-cyan-500/20' : 'bg-white/5'}`}>
                              <PlanIcon className={`w-5 h-5 ${plan.popular ? 'text-cyan-400' : 'text-slate-300'}`} />
                            </div>
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                          </div>
                          <p className="text-sm text-slate-300">{plan.description}</p>
                        </CardHeader>

                        <CardContent className="flex-1 flex flex-col">
                          <div className="mb-6">
                            <span className="text-4xl font-bold">{priceDisplay.amountText}</span>
                            {priceDisplay.billingText && (
                              <p className="text-sm text-slate-400 mt-2">{priceDisplay.billingText}</p>
                            )}
                            {plan.id === 'pro' && billingCycle === 'monthly' && (
                              <p className="text-sm text-slate-400 mt-2">That&apos;s just $3.30/day</p>
                            )}
                          </div>

                          <ul className="space-y-2 text-sm flex-1">
                            {plan.features.map((feature) => (
                              <li key={feature} className="flex gap-2">
                                <Check className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                                <span className="text-slate-300">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-6">
                            {plan.id === 'pro' && (
                              <Badge className="mb-3 w-full justify-center border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                14-Day Free Trial — Cancel Anytime
                              </Badge>
                            )}
                            {plan.stripePlan ? (
                              <Button
                                size="lg"
                                className="w-full"
                                onClick={() => handleCheckout(plan.stripePlan as string)}
                                disabled={loadingPlan !== null}
                              >
                                {loadingPlan === plan.stripePlan ? (
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
                                <Link href={plan.href || '/pricing'}>
                                  {plan.cta}
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              </Button>
                            )}
                            {plan.id === 'free' && (
                              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                                <Lock className="w-3.5 h-3.5" />
                                No credit card required
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
              {checkoutError && (
                <div className="mt-4 mx-auto max-w-md p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                  <p className="text-sm text-red-400">{checkoutError}</p>
                  <button
                    onClick={() => setCheckoutError(null)}
                    className="mt-1 text-xs text-slate-400 hover:text-slate-300"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {TRUST_SIGNALS.map((signal) => (
              <Badge key={signal} className="border border-white/10 bg-white/5 text-slate-300">
                {signal}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-2xl font-bold">Interactive Feature Comparison</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedComparisonPlan('all')}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  selectedComparisonPlan === 'all'
                    ? 'border-cyan-500 text-cyan-300 bg-cyan-500/10'
                    : 'border-white/10 text-slate-300'
                }`}
              >
                Show all
              </button>
              {PLAN_ORDER.map((planId) => (
                <button
                  key={planId}
                  type="button"
                  onClick={() => setSelectedComparisonPlan(planId)}
                  className={`px-3 py-1.5 rounded-full text-xs border capitalize ${
                    selectedComparisonPlan === planId
                      ? 'border-cyan-500 text-cyan-300 bg-cyan-500/10'
                      : 'border-white/10 text-slate-300'
                  }`}
                >
                  Focus {planId}
                </button>
              ))}
            </div>
          </div>

          <Card className="hidden md:block">
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-slate-400 font-medium">Capability</th>
                    {PLAN_ORDER.map((planId) => (
                      <th
                        key={planId}
                        className={`text-left py-3 px-4 capitalize font-medium ${
                          selectedComparisonPlan === 'all' || selectedComparisonPlan === planId
                            ? 'text-white'
                            : 'text-slate-500'
                        }`}
                      >
                        {planId}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.id} className="border-b border-white/5">
                      <td className="py-3 pr-4 text-slate-300">{row.label}</td>
                      {PLAN_ORDER.map((planId) => (
                        <td
                          key={`${row.id}-${planId}`}
                          className={`py-3 px-4 ${
                            selectedComparisonPlan === 'all' || selectedComparisonPlan === planId
                              ? 'text-slate-200'
                              : 'text-slate-500'
                          }`}
                        >
                          {row.values[planId]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="md:hidden space-y-3">
            {comparisonRows.map((row) => {
              const isOpen = openComparisonRowId === row.id;
              return (
                <Card key={row.id} className="p-0 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenComparisonRowId(isOpen ? null : row.id)}
                    className="flex w-full items-center justify-between px-4 py-4 text-left"
                  >
                    <span className="font-medium text-slate-200">{row.label}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={`${row.id}-mobile-values`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 px-4 pb-4">
                          {PLAN_ORDER.map((planId) => (
                            <div key={`${row.id}-${planId}-mobile`} className="rounded-xl border border-white/10 bg-white/5 p-3">
                              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{planId}</p>
                              <p
                                className={
                                  selectedComparisonPlan === 'all' || selectedComparisonPlan === planId
                                    ? 'text-sm text-slate-200'
                                    : 'text-sm text-slate-500'
                                }
                              >
                                {row.values[planId]}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <Card key={item.id} className="p-0 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? '' : item.id)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-medium text-slate-100">{item.question}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={`${item.id}-answer`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-slate-300">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4">
          {VALUE_PROPS.map((item) => (
            <Card key={item.title}>
              <CardContent>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-300">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to operationalize AI?</h2>
          <p className="text-slate-300">
            Start with the free Explorer. Upgrade when you need team workflows, integrations, and production support.
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
