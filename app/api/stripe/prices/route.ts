import { NextRequest, NextResponse } from 'next/server';
import { getOptionalEnv } from '@/lib/env';
import { formatPriceDisplay } from '@/lib/pricing';
import { getStripeProPlanConfig, getStripeServerClient } from '@/lib/stripe/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONFIGURED_PRICE_KEYS = ['pro'] as const;
type PriceKey = (typeof CONFIGURED_PRICE_KEYS)[number];

type StripePriceView = {
  key: PriceKey;
  productId: string;
  priceId: string;
  amount: number | null;
  currency: string;
  interval: 'month' | 'year';
  display: string;
};

async function resolveProPrice(): Promise<StripePriceView> {
  const { productId, priceId } = getStripeProPlanConfig();
  const fallbackAmount = 99;
  let amount: number | null = fallbackAmount;
  let currency = 'usd';
  let interval: 'month' | 'year' = 'month';

  if (getOptionalEnv('STRIPE_SECRET_KEY')) {
    const stripe = getStripeServerClient();
    const price = await stripe.prices.retrieve(priceId);
    amount = price.unit_amount === null ? null : price.unit_amount / 100;
    currency = price.currency || currency;
    interval = price.recurring?.interval === 'year' ? 'year' : 'month';
  }

  return {
    key: 'pro',
    productId,
    priceId,
    amount,
    currency,
    interval,
    display: formatPriceDisplay(amount, currency, interval),
  };
}

function parseKeys(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const includeAll = url.searchParams.get('all') === 'true';
    const hasKeysParam = url.searchParams.has('keys');
    const keys = parseKeys(url.searchParams.get('keys'));

    const proPrice = await resolveProPrice();
    const priceMap: Record<PriceKey, StripePriceView> = {
      pro: proPrice,
    };

    if (hasKeysParam) {
      if (keys.length === 0) {
        return NextResponse.json({ prices: {} });
      }

      const selected: Record<string, StripePriceView> = {};
      for (const key of keys) {
        const normalized = key.toLowerCase();
        if (normalized in priceMap) {
          selected[normalized] = priceMap[normalized as PriceKey];
        }
      }
      return NextResponse.json({ prices: selected });
    }

    if (includeAll) {
      return NextResponse.json({ prices: Object.values(priceMap) });
    }

    const configured = CONFIGURED_PRICE_KEYS
      .map((key) => priceMap[key])
      .filter(Boolean);

    return NextResponse.json({ prices: configured });
  } catch (error) {
    console.error('[stripe/prices] GET failed:', error);
    return NextResponse.json(
      {
        prices: [],
        error: 'Unable to fetch Stripe prices',
      },
      { status: 500 }
    );
  }
}
