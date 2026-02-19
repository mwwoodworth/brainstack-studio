import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getStripeServerClient } from '@/lib/stripe/config';
import { resolveTrustedAppOrigin } from '@/lib/url';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Look up stripe customer ID from bss_subscriptions
    const { data: sub } = await supabase
      .from('bss_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!sub?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    const origin = resolveTrustedAppOrigin(request);

    const stripe = getStripeServerClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${origin}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Portal session error:', err);
    const message = err instanceof Error ? err.message : 'Portal failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
