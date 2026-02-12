import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// In Stripe API 2026-01-28.clover, current_period_end moved to subscription items
function getSubscriptionPeriodEnd(sub: Stripe.Subscription): string | null {
  const item = sub.items?.data?.[0];
  if (item?.current_period_end) {
    return new Date(item.current_period_end * 1000).toISOString();
  }
  return null;
}

async function logWebhookEvent(
  supabase: ReturnType<typeof createServiceRoleClient>,
  eventId: string,
  payload: object,
  status: string,
  error?: string
) {
  await supabase.from("bss_webhook_events").upsert(
    {
      id: eventId,
      payload,
      status,
      error: error || null,
      processed_at: status === "PROCESSED" ? new Date().toISOString() : null,
    },
    { onConflict: "id" }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // Atomic dedup: upsert with ignoreDuplicates so only the first writer claims the event
  const { data: claimed } = await supabase
    .from("bss_webhook_events")
    .upsert(
      {
        id: event.id,
        payload: event.data.object as object,
        status: "PROCESSING",
      },
      { onConflict: "id", ignoreDuplicates: true }
    )
    .select("id")
    .single();

  if (!claimed) {
    // Another process already claimed this event — skip
    return NextResponse.json({ received: true, deduplicated: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userId = session.metadata?.user_id;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (!userId || !customerId || !subscriptionId) {
          console.error("Missing metadata in checkout session:", {
            userId,
            customerId,
            subscriptionId,
          });
          break;
        }

        // Fetch subscription details for period end
        const sub = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ["items"],
        });

        await supabase.from("bss_subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: sub.status,
            tier: session.metadata?.plan || "pro",
            current_period_end: getSubscriptionPeriodEnd(sub),
            cancel_at_period_end: sub.cancel_at_period_end,
          },
          { onConflict: "stripe_subscription_id" }
        );
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const subId = sub.id;

        await supabase
          .from("bss_subscriptions")
          .update({
            status: sub.status,
            current_period_end: getSubscriptionPeriodEnd(sub),
            cancel_at_period_end: sub.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subId);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from("bss_subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subRef = invoice.parent?.subscription_details?.subscription;
        const subId = typeof subRef === "string" ? subRef : subRef?.id;
        if (subId) {
          await supabase
            .from("bss_subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subId);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subRef = invoice.parent?.subscription_details?.subscription;
        const subId = typeof subRef === "string" ? subRef : subRef?.id;
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId, {
            expand: ["items"],
          });
          await supabase
            .from("bss_subscriptions")
            .update({
              status: sub.status,
              current_period_end: getSubscriptionPeriodEnd(sub),
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subId);
        }
        break;
      }
    }

    await logWebhookEvent(
      supabase,
      event.id,
      event.data.object as object,
      "PROCESSED"
    );
  } catch (err) {
    console.error("Webhook handler error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    await logWebhookEvent(
      supabase,
      event.id,
      event.data.object as object,
      "FAILED",
      message
    );
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
