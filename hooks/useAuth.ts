'use client';

import { useEffect, useState, useCallback } from 'react';
import { type User, type AuthChangeEvent, type Session } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function init() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    }
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  }, []);

  return { user, loading, signOut };
}
