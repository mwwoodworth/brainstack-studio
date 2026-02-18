import { NextRequest, NextResponse } from "next/server";
import {
  createServiceRoleClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { getStripeServerClient } from "@/lib/stripe/config";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  try {
    const userClient = await createSupabaseServerClient();
    const {
      data: { user },
    } = await userClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const stripe = getStripeServerClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session.payment_status !== "paid" &&
      session.payment_status !== "no_payment_required"
    ) {
      return NextResponse.json({
        status: "pending",
        message: "Payment not yet confirmed",
      });
    }

    const userId = session.metadata?.user_id;
    if (userId && userId !== user.id) {
      return NextResponse.json(
        { status: "error", message: "Forbidden" },
        { status: 403 }
      );
    }

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
      .eq("user_id", user.id)
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
