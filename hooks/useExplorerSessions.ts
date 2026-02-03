import { useCallback, useEffect, useState } from 'react';
import type { ExplorerInput, ExplorerResult } from '@/lib/explorer';

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
  const [sessions, setSessions] = useState<ExplorerSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = loadSessions();
    setSessions(data);
    setIsLoaded(true);
  }, []);

  const saveSession = useCallback((session: ExplorerSession) => {
    setSessions((prevSessions) => {
      const next = [session, ...prevSessions].slice(0, 50);
      persistSessions(next);
      return next;
    });
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prevSessions) => {
      const next = prevSessions.filter((session) => session.id !== id);
      persistSessions(next);
      return next;
    });
  }, []);

  const clearSessions = useCallback(() => {
    setSessions([]);
    persistSessions([]);
  }, []);

  return {
    sessions,
    isLoaded,
    saveSession,
    deleteSession,
    clearSessions,
  };
}
