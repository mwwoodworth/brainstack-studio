'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_EXPLORER_PREFERENCES,
  loadExplorerPreferences,
  resetExplorerPreferences,
  saveExplorerPreferences,
  type ExplorerPreferences,
} from '@/lib/explorerPreferences';

export function useExplorerPreferences() {
  const [preferences, setPreferences] = useState<ExplorerPreferences>(DEFAULT_EXPLORER_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = loadExplorerPreferences();
    setPreferences(stored);
    setIsLoaded(true);
  }, []);

  const updatePreferences = (updates: Partial<ExplorerPreferences>) => {
    const next = { ...preferences, ...updates };
    setPreferences(next);
    saveExplorerPreferences(next);
  };

  const resetToDefaults = () => {
    const next = resetExplorerPreferences();
    setPreferences(next);
  };

  return {
    preferences,
    isLoaded,
    updatePreferences,
    resetToDefaults,
  };
}
