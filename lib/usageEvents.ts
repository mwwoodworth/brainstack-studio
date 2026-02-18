import { createServiceRoleClient, createSupabaseServerClient } from '@/lib/supabase/server';
import { getOptionalEnv } from '@/lib/env';

export type UsageEventCategory =
  | 'explorer'
  | 'tools'
  | 'api'
  | 'dashboard'
  | 'docs'
  | 'billing'
  | 'auth';

export type UsageEventInput = {
  eventName: string;
  category?: UsageEventCategory;
  path?: string;
  toolId?: string;
  userId?: string | null;
  metadata?: Record<string, unknown>;
};

type UsageEventRow = {
  user_id: string | null;
  event_name: string;
  category: UsageEventCategory;
  path: string | null;
  tool_id: string | null;
  metadata: Record<string, unknown>;
};

function hasServiceRoleKey() {
  return Boolean(getOptionalEnv('SUPABASE_SERVICE_ROLE_KEY'));
}

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function recordUsageEvent(input: UsageEventInput): Promise<void> {
  try {
    const fallbackUserId = await getCurrentUserId();
    const row: UsageEventRow = {
      user_id: input.userId ?? fallbackUserId ?? null,
      event_name: input.eventName,
      category: input.category ?? 'api',
      path: input.path ?? null,
      tool_id: input.toolId ?? null,
      metadata: input.metadata ?? {},
    };

    if (hasServiceRoleKey()) {
      const admin = createServiceRoleClient();
      await admin.from('bss_usage_events').insert(row);
      return;
    }

    const supabase = await createSupabaseServerClient();
    await supabase.from('bss_usage_events').insert(row);
  } catch {
    // Usage analytics should never block user workflows.
  }
}

export async function fetchUsageEventsForUser(userId: string, sinceIso: string) {
  const select = 'event_name,category,path,tool_id,created_at';

  if (hasServiceRoleKey()) {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from('bss_usage_events')
      .select(select)
      .eq('user_id', userId)
      .gte('created_at', sinceIso)
      .order('created_at', { ascending: true })
      .limit(5000);

    if (error) throw error;
    return data ?? [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('bss_usage_events')
    .select(select)
    .eq('user_id', userId)
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: true })
    .limit(5000);

  if (error) throw error;
  return data ?? [];
}
