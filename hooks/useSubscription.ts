'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

interface SubscriptionState {
  isPro: boolean;
  status: string | null;
  tier: string | null;
  loading: boolean;
}

export function useSubscription(): SubscriptionState {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    isPro: false,
    status: null,
    tier: null,
    loading: true,
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setState({ isPro: false, status: null, tier: null, loading: false });
      return;
    }

    async function fetchSubscription() {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('bss_subscriptions')
        .select('status, tier')
        .eq('user_id', user!.id)
        .in('status', ['active', 'trialing'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        setState({ isPro: false, status: null, tier: null, loading: false });
      } else {
        const row = data as { status: string; tier: string };
        setState({
          isPro: true,
          status: row.status,
          tier: row.tier,
          loading: false,
        });
      }
    }

    fetchSubscription();
  }, [user, authLoading]);

  return state;
}
