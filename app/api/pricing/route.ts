import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getAllTools } from '@/lib/tools/registry';
import { INDUSTRIES } from '@/lib/explorer';
import {
  DEFAULT_PRO_FEATURES,
  FEATURE_COMPARISON_ROWS,
  formatPriceDisplay,
  parseProductFeatures,
  type PricingPlan,
} from '@/lib/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2026-01-28.clover' });
}

function basePlans(toolCount: number, industryCount: number): PricingPlan[] {
  return [
    {
      id: 'free',
      name: 'Free',
      description: 'Explore operational AI at your own pace',
      cta: 'Start Free',
      href: '/explorer',
      stripePlan: null,
      price: {
        amount: 0,
        currency: 'usd',
        interval: 'once',
        display: '$0',
      },
      features: [
        `Guided Explorer across ${industryCount} industries`,
        `${toolCount} interactive business tools`,
        'Saved local sessions',
        'Audit-ready run summaries',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For teams ready to operationalize AI',
      cta: 'Subscribe to Pro',
      href: null,
      stripePlan: 'pro',
      popular: true,
      price: {
        amount: 99,
        currency: 'usd',
        interval: 'month',
        display: '$99/mo',
      },
      features: DEFAULT_PRO_FEATURES,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Custom implementation and deployment',
      cta: 'Request Implementation',
      href: '/contact',
      stripePlan: null,
      price: {
        amount: null,
        currency: 'usd',
        interval: 'custom',
        display: 'Custom',
      },
      features: [
        'Dedicated implementation team',
        'Custom governance and audit controls',
        'SLA-backed reliability guarantees',
        'On-prem / VPC deployment options',
      ],
    },
  ];
}

export async function GET() {
  const toolCount = getAllTools().filter((tool) => !tool.comingSoon).length;
  const industryCount = INDUSTRIES.length;
  const plans = basePlans(toolCount, industryCount);
  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRICE_PRO;
  const productId = process.env.STRIPE_PRODUCT_PRO || 'prod_TxJIELH1qRihyq';

  if (stripe && priceId) {
    try {
      const price = await stripe.prices.retrieve(priceId, { expand: ['product'] });
      const product =
        typeof price.product === 'string'
          ? await stripe.products.retrieve(productId)
          : price.product;

      const proPlan = plans.find((plan) => plan.id === 'pro');
      if (proPlan) {
        const productData = 'deleted' in product ? null : product;
        const amount = price.unit_amount === null ? null : price.unit_amount / 100;
        const interval = price.recurring?.interval === 'year' ? 'year' : 'month';
        const metadataFeatures = parseProductFeatures(productData?.metadata?.features);

        proPlan.name = productData?.name || proPlan.name;
        proPlan.description = productData?.description || proPlan.description;
        proPlan.price = {
          amount,
          currency: price.currency || 'usd',
          interval,
          display: formatPriceDisplay(amount, price.currency || 'usd', interval),
        };
        proPlan.features = metadataFeatures.length > 0 ? metadataFeatures : proPlan.features;
      }
    } catch (error) {
      console.error('[pricing] Failed to hydrate Stripe plan data:', error);
    }
  }

  return NextResponse.json({
    success: true,
    updatedAt: new Date().toISOString(),
    plans,
    comparison: FEATURE_COMPARISON_ROWS,
  });
}
