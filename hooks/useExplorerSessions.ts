import { useCallback, useEffect, useState } from 'react';
import type { ExplorerInput, ExplorerResult } from '@/lib/explorer';
import { useAuth } from './useAuth';

export type ExplorerSession = {
  id: string;
  createdAt: string;
  input: ExplorerInput;
  result: ExplorerResult;
};

const STORAGE_KEY = 'bss_explorer_sessions';

const loadSessions = (): ExplorerSession[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ExplorerSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistSessions = (sessions: ExplorerSession[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export function useExplorerSessions() {
  const { user, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<ExplorerSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadFromCloud() {
      try {
        const response = await fetch('/api/dashboard/sessions', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || 'Failed to load sessions');

        const remoteSessions = Array.isArray(data.sessions)
          ? (data.sessions as ExplorerSession[])
          : [];

        if (!isMounted) return;

        // One-time migration path: if cloud is empty, bootstrap from local history.
        if (remoteSessions.length === 0) {
          const localSessions = loadSessions();
          if (localSessions.length > 0) {
            await Promise.all(
              localSessions.map((session) =>
                fetch('/api/dashboard/sessions', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ session }),
                }).catch(() => null)
              )
            );
            if (isMounted) setSessions(localSessions);
            return;
          }
        }

        setSessions(remoteSessions);
      } catch {
        if (!isMounted) return;
        setSessions(loadSessions());
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    }

    setIsLoaded(false);

    if (authLoading) {
      return () => {
        isMounted = false;
      };
    }

    if (user) {
      void loadFromCloud();
    } else {
      setSessions(loadSessions());
      setIsLoaded(true);
    }

    return () => {
      isMounted = false;
    };
  }, [authLoading, user]);

  const saveSession = useCallback((session: ExplorerSession) => {
    setSessions((prevSessions) => {
      const next = [session, ...prevSessions].slice(0, 50);
      if (!user) {
        persistSessions(next);
      }
      return next;
    });

    if (user) {
      void fetch('/api/dashboard/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session }),
      });
    }
  }, [user]);

  const deleteSession = useCallback((id: string) => {
    setSessions((prevSessions) => {
      const next = prevSessions.filter((session) => session.id !== id);
      if (!user) {
        persistSessions(next);
      }
      return next;
    });

    if (user) {
      void fetch(`/api/dashboard/sessions/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    }
  }, [user]);

  const clearSessions = useCallback(() => {
    setSessions([]);
    if (!user) {
      persistSessions([]);
      return;
    }
    void fetch('/api/dashboard/sessions', { method: 'DELETE' });
  }, [user]);

  return {
    sessions,
    isLoaded,
    saveSession,
    deleteSession,
    clearSessions,
  };
}
