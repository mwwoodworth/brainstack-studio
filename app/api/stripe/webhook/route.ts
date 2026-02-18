import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getOptionalEnv } from "@/lib/env";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getStripeServerClient } from "@/lib/stripe/config";

function getSubscriptionPeriodEnd(sub: Stripe.Subscription): string | null {
  const item = sub.items?.data?.[0];
  if (item?.current_period_end) {
    return new Date(item.current_period_end * 1000).toISOString();
  }
  return null;
}

function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const nested = invoice.parent?.subscription_details?.subscription;
  if (typeof nested === "string") return nested;
  if (nested?.id) return nested.id;
  return null;
}

async function logWebhookEvent(
  supabase: ReturnType<typeof createServiceRoleClient>,
  eventId: string,
  payload: object,
  status: "PROCESSING" | "PROCESSED" | "FAILED",
  error?: string
) {
  await supabase.from("bss_webhook_events").upsert(
    {
      id: eventId,
      payload,
      status,
      error: error || null,
      processed_at: status === "PROCESSED" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );
}

async function upsertSubscriptionState(
  supabase: ReturnType<typeof createServiceRoleClient>,
  sub: Stripe.Subscription,
  options?: {
    userId?: string;
    tier?: string;
    customerId?: string;
    forcedStatus?: string;
  }
) {
  const customerId =
    options?.customerId ||
    (typeof sub.customer === "string" ? sub.customer : sub.customer?.id) ||
    null;
  const metadataUserId =
    typeof sub.metadata?.user_id === "string" ? sub.metadata.user_id : undefined;
  const metadataTier =
    typeof sub.metadata?.plan === "string" ? sub.metadata.plan : undefined;

  const { data: existing } = await supabase
    .from("bss_subscriptions")
    .select("user_id,tier")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();

  const userId = options?.userId || metadataUserId || existing?.user_id || null;
  const tier = options?.tier || metadataTier || existing?.tier || "pro";

  if (!userId || !customerId) {
    console.error("[stripe/webhook] Missing subscription identity fields", {
      subscriptionId: sub.id,
      userId,
      customerId,
    });
    return;
  }

  await supabase.from("bss_subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      status: options?.forcedStatus || sub.status,
      tier,
      current_period_end: getSubscriptionPeriodEnd(sub),
      cancel_at_period_end: sub.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const secretKey = getOptionalEnv("STRIPE_SECRET_KEY");
  const webhookSecret = getOptionalEnv("STRIPE_WEBHOOK_SECRET");
  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured on this deployment." },
      { status: 500 }
    );
  }

  const stripe = getStripeServerClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // Retry-safe dedupe: allow retries for FAILED/PROCESSING, skip only PROCESSED.
  const { data: existingEvent } = await supabase
    .from("bss_webhook_events")
    .select("status")
    .eq("id", event.id)
    .maybeSingle();

  if (existingEvent?.status === "PROCESSED") {
    return NextResponse.json({ received: true, deduplicated: true });
  }

  await logWebhookEvent(
    supabase,
    event.id,
    event.data.object as object,
    "PROCESSING"
  );

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

        const sub = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ["items"],
        });

        await upsertSubscriptionState(supabase, sub, {
          userId,
          tier: session.metadata?.plan || "pro",
          customerId,
        });
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.paused":
      case "customer.subscription.resumed": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscriptionState(supabase, sub);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscriptionState(supabase, sub, {
          forcedStatus: "canceled",
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = getSubscriptionIdFromInvoice(invoice);
        if (!subId) break;

        const { data: existing } = await supabase
          .from("bss_subscriptions")
          .select("stripe_subscription_id")
          .eq("stripe_subscription_id", subId)
          .maybeSingle();

        if (existing?.stripe_subscription_id) {
          await supabase
            .from("bss_subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subId);
          break;
        }

        const sub = await stripe.subscriptions.retrieve(subId, {
          expand: ["items"],
        });
        await upsertSubscriptionState(supabase, sub, {
          forcedStatus: "past_due",
        });
        break;
      }

      case "invoice.paid":
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = getSubscriptionIdFromInvoice(invoice);
        if (!subId) break;

        const sub = await stripe.subscriptions.retrieve(subId, {
          expand: ["items"],
        });
        await upsertSubscriptionState(supabase, sub);
        break;
      }

      default:
        break;
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
