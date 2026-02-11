import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({
        status: "pending",
        message: "Payment not yet confirmed",
      });
    }

    const userId = session.metadata?.user_id;
    if (!userId) {
      return NextResponse.json({
        status: "provisioned",
        message: "Subscription active (no user tracking)",
      });
    }

    // Check if subscription record exists in DB
    const supabase = createServiceRoleClient();
    const { data: sub } = await supabase
      .from("bss_subscriptions")
      .select("status, tier")
      .eq("user_id", userId)
      .in("status", ["active", "trialing"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (sub) {
      return NextResponse.json({
        status: "provisioned",
        tier: sub.tier,
        subscriptionStatus: sub.status,
      });
    }

    return NextResponse.json({
      status: "processing",
      message: "Subscription is being provisioned",
    });
  } catch (err) {
    console.error("Session verification error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to verify session" },
      { status: 500 }
    );
  }
}
