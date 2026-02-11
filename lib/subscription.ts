import { createSupabaseServerClient } from "@/lib/supabase/server";

export type UserTier = "free" | "pro";

export async function getUserTier(): Promise<{
  tier: UserTier;
  userId: string | null;
}> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { tier: "free", userId: null };
    }

    const { data: sub } = await supabase
      .from("bss_subscriptions")
      .select("tier, status")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (sub) {
      return { tier: (sub.tier as UserTier) || "pro", userId: user.id };
    }

    return { tier: "free", userId: user.id };
  } catch {
    return { tier: "free", userId: null };
  }
}
