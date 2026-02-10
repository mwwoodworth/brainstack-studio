const isBrowser = typeof window !== 'undefined';

// Explorer sessions
export function getExplorerSessions<T>(): T[] {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem('bss-explorer-sessions');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Export all data (for backup)
export function exportAllData(): string {
  return JSON.stringify({
    explorerSessions: getExplorerSessions(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}
