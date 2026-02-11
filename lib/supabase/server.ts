import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { getEnv, getOptionalEnv } from "@/lib/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });
}

export function createServiceRoleClient() {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = getOptionalEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations.");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "public" },
  });
}
