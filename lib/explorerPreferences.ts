export type ExplorerPreferences = {
  saveSessions: boolean;
  telemetryEnabled: boolean;
};

export const DEFAULT_EXPLORER_PREFERENCES: ExplorerPreferences = {
  saveSessions: true,
  telemetryEnabled: true,
};

const STORAGE_KEY = 'bss_explorer_preferences';

const isBrowser = typeof window !== 'undefined';

export function loadExplorerPreferences(): ExplorerPreferences {
  if (!isBrowser) return DEFAULT_EXPLORER_PREFERENCES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_EXPLORER_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<ExplorerPreferences>;
    return { ...DEFAULT_EXPLORER_PREFERENCES, ...parsed };
  } catch {
    return DEFAULT_EXPLORER_PREFERENCES;
  }
}

export function saveExplorerPreferences(preferences: ExplorerPreferences): void {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export function updateExplorerPreferences(
  updates: Partial<ExplorerPreferences>
): ExplorerPreferences {
  const current = loadExplorerPreferences();
  const next = { ...current, ...updates };
  saveExplorerPreferences(next);
  return next;
}

export function resetExplorerPreferences(): ExplorerPreferences {
  if (!isBrowser) return DEFAULT_EXPLORER_PREFERENCES;
  window.localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_EXPLORER_PREFERENCES;
}

export function isTelemetryEnabled(): boolean {
  if (!isBrowser) return false;
  return loadExplorerPreferences().telemetryEnabled;
}
