'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
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
} from 'lucide-react';

type PricingResponse = {
  success: boolean;
  updatedAt: string;
  plans: PricingPlan[];
  comparison: FeatureComparisonRow[];
};

const PLAN_ICONS = {
  free: Rocket,
  pro: Star,
  enterprise: Building2,
} as const;

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

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [pricingData, setPricingData] = useState<PricingResponse | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [selectedComparisonPlan, setSelectedComparisonPlan] = useState<'all' | PlanId>('all');

  const comparisonRows = pricingData?.comparison ?? [];

  const sortedPlans = useMemo(() => {
    const order: PlanId[] = ['free', 'pro', 'enterprise'];
    const plans = pricingData?.plans ?? [];
    return [...plans].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
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
        setLoadingPlan(null);
      }
    } catch {
      setLoadingPlan(null);
    }
  }

  return (
    <main id="main-content" className="min-h-screen">
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
            <div className="grid md:grid-cols-3 gap-6">
              {sortedPlans.map((plan, idx) => {
                const PlanIcon = PLAN_ICONS[plan.id];
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
                          <span className="text-4xl font-bold">{plan.price.display}</span>
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
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
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
              {(['free', 'pro', 'enterprise'] as PlanId[]).map((planId) => (
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

          <Card>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-slate-400 font-medium">Capability</th>
                    {(['free', 'pro', 'enterprise'] as PlanId[]).map((planId) => (
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
                      {(['free', 'pro', 'enterprise'] as PlanId[]).map((planId) => (
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
