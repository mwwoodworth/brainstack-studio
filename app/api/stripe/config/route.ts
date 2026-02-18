import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripeEnvVerification } from "@/lib/stripe/config";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      ...getStripeEnvVerification(),
    });
  } catch (error) {
    console.error("[stripe/config] GET failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify Stripe configuration" },
      { status: 500 }
    );
  }
}
