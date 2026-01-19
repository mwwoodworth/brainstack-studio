'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserPreferences } from '@/types';
import { getPreferences, savePreferences, resetPreferences } from '@/lib/storage';
import { DEFAULT_PREFERENCES } from '@/lib/constants';

export function usePreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = getPreferences();
    setPreferencesState(stored);
    setIsLoaded(true);
  }, []);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferencesState((prev) => {
      const newPrefs = { ...prev, ...updates };
      savePreferences(newPrefs);
      return newPrefs;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    resetPreferences();
    setPreferencesState(DEFAULT_PREFERENCES);
  }, []);

  return {
    preferences,
    isLoaded,
    updatePreferences,
    resetToDefaults,
  };
}
