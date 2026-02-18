import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getStripeProPlanConfig, getStripeServerClient } from '@/lib/stripe/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan } = body;
    const proPlan = getStripeProPlanConfig();
    const priceMap: Record<string, string> = {
      pro: proPlan.priceId,
    };

    if (!plan || !priceMap[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    if (!proPlan.productIdMatchesExpected || !proPlan.priceIdMatchesExpected) {
      return NextResponse.json(
        {
          error:
            'Stripe Pro plan configuration mismatch. Check STRIPE_PRODUCT_PRO and STRIPE_PRICE_PRO.',
        },
        { status: 500 }
      );
    }

    const priceId = priceMap[plan];
    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured' }, { status: 500 });
    }

    // Get authenticated user
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://brainstackstudio.com';

    // If not logged in, return auth redirect
    if (!user) {
      return NextResponse.json({
        error: 'Authentication required',
        authRedirect: `/auth?redirect=/pricing&plan=${plan}`,
      }, { status: 401 });
    }

    const stripe = getStripeServerClient();

    // Prevent duplicate Stripe customers — look up existing customer first
    let customerId: string | undefined;
    if (user.email) {
      const existing = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });
      if (existing.data.length > 0) {
        customerId = existing.data[0].id;
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      ...(customerId
        ? { customer: customerId }
        : { customer_email: user.email }),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        source: 'brainstack-studio',
        plan,
        user_id: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    const message = err instanceof Error ? err.message : 'Checkout failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
