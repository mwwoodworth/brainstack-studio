/**
 * @jest-environment node
 */

const getOptionalEnvMock = jest.fn();
const getStripeProPlanConfigMock = jest.fn();
const getStripeServerClientMock = jest.fn();
const retrievePriceMock = jest.fn();

type ImportRouteOptions = {
  hasSecret?: boolean;
  priceResponse?: {
    unit_amount: number | null;
    currency: string;
    recurring?: { interval?: string | null } | null;
  };
  throwError?: Error;
};

async function importRoute(options: ImportRouteOptions = {}) {
  jest.resetModules();
  getOptionalEnvMock.mockReset();
  getStripeProPlanConfigMock.mockReset();
  getStripeServerClientMock.mockReset();
  retrievePriceMock.mockReset();

  getOptionalEnvMock.mockImplementation((key: string) => {
    if (key === 'STRIPE_SECRET_KEY' && options.hasSecret) return 'sk_test_123';
    return undefined;
  });

  getStripeProPlanConfigMock.mockReturnValue({
    productId: 'prod_bss_pro',
    priceId: 'price_bss_pro',
  });

  if (options.throwError) {
    retrievePriceMock.mockRejectedValue(options.throwError);
  } else {
    retrievePriceMock.mockResolvedValue(
      options.priceResponse || {
        unit_amount: 14900,
        currency: 'usd',
        recurring: { interval: 'year' },
      }
    );
  }

  getStripeServerClientMock.mockReturnValue({
    prices: {
      retrieve: retrievePriceMock,
    },
  });

  jest.doMock('@/lib/env', () => ({
    getOptionalEnv: (...args: unknown[]) => getOptionalEnvMock(...args),
  }));

  jest.doMock('@/lib/stripe/config', () => ({
    getStripeProPlanConfig: (...args: unknown[]) => getStripeProPlanConfigMock(...args),
    getStripeServerClient: (...args: unknown[]) => getStripeServerClientMock(...args),
  }));

  return import('@/app/api/stripe/prices/route');
}

describe('/api/stripe/prices', () => {
  it('returns configured fallback pricing by default when Stripe secret is not present', async () => {
    const { GET } = await importRoute();
    const response = await GET({ url: 'https://brainstackstudio.com/api/stripe/prices' } as any);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(getStripeServerClientMock).not.toHaveBeenCalled();
    expect(body).toEqual({
      prices: [
        {
          key: 'pro',
          productId: 'prod_bss_pro',
          priceId: 'price_bss_pro',
          amount: 99,
          currency: 'usd',
          interval: 'month',
          display: '$99/mo',
        },
      ],
    });
  });

  it('returns a filtered map when keys are provided and ignores unknown keys', async () => {
    const { GET } = await importRoute();
    const response = await GET({
      url: 'https://brainstackstudio.com/api/stripe/prices?keys=PRO,missing',
    } as any);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      prices: {
        pro: {
          key: 'pro',
          productId: 'prod_bss_pro',
          priceId: 'price_bss_pro',
          amount: 99,
          currency: 'usd',
          interval: 'month',
          display: '$99/mo',
        },
      },
    });
  });

  it('returns an empty map when keys is present but empty', async () => {
    const { GET } = await importRoute();
    const response = await GET({
      url: 'https://brainstackstudio.com/api/stripe/prices?keys=,%20,%20',
    } as any);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ prices: {} });
  });

  it('returns all prices with hydrated Stripe values when all=true', async () => {
    const { GET } = await importRoute({
      hasSecret: true,
      priceResponse: {
        unit_amount: 14900,
        currency: 'usd',
        recurring: { interval: 'year' },
      },
    });
    const response = await GET({
      url: 'https://brainstackstudio.com/api/stripe/prices?all=true',
    } as any);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(getStripeServerClientMock).toHaveBeenCalledTimes(1);
    expect(retrievePriceMock).toHaveBeenCalledWith('price_bss_pro');
    expect(body).toEqual({
      prices: [
        {
          key: 'pro',
          productId: 'prod_bss_pro',
          priceId: 'price_bss_pro',
          amount: 149,
          currency: 'usd',
          interval: 'year',
          display: '$149/yr',
        },
      ],
    });
  });

  it('supports null Stripe unit_amount and defaults recurring interval to month', async () => {
    const { GET } = await importRoute({
      hasSecret: true,
      priceResponse: {
        unit_amount: null,
        currency: 'usd',
        recurring: { interval: 'week' },
      },
    });
    const response = await GET({
      url: 'https://brainstackstudio.com/api/stripe/prices?all=true',
    } as any);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      prices: [
        {
          key: 'pro',
          productId: 'prod_bss_pro',
          priceId: 'price_bss_pro',
          amount: null,
          currency: 'usd',
          interval: 'month',
          display: 'Custom',
        },
      ],
    });
  });

  it('falls back to default currency and interval when Stripe returns empty values', async () => {
    const { GET } = await importRoute({
      hasSecret: true,
      priceResponse: {
        unit_amount: 19900,
        currency: '',
        recurring: null,
      },
    });
    const response = await GET({
      url: 'https://brainstackstudio.com/api/stripe/prices?all=true',
    } as any);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      prices: [
        {
          key: 'pro',
          productId: 'prod_bss_pro',
          priceId: 'price_bss_pro',
          amount: 199,
          currency: 'usd',
          interval: 'month',
          display: '$199/mo',
        },
      ],
    });
  });

  it('returns a safe 500 response when Stripe retrieval fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { GET } = await importRoute({
      hasSecret: true,
      throwError: new Error('stripe down'),
    });
    const response = await GET({
      url: 'https://brainstackstudio.com/api/stripe/prices',
    } as any);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      prices: [],
      error: 'Unable to fetch Stripe prices',
    });
    consoleSpy.mockRestore();
  });
});
