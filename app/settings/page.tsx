'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useExplorerPreferences } from '@/hooks/useExplorerPreferences';
import { useExplorerSessions } from '@/hooks/useExplorerSessions';
import {
  Settings,
  Shield,
  Database,
  Download,
  RotateCcw,
  Trash2,
  Check,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const { preferences, isLoaded, updatePreferences, resetToDefaults } = useExplorerPreferences();
  const { sessions, clearSessions } = useExplorerSessions();
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExport = () => {
    const payload = JSON.stringify(
      {
        preferences,
        sessions,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bss-explorer-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    resetToDefaults();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleToggle = (key: 'saveSessions' | 'telemetryEnabled') => {
    updatePreferences({ [key]: !preferences[key] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAll = () => {
    clearSessions();
    setShowDeleteConfirm(false);
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-20 px-6 flex items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading settings...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-10 h-10 text-cyan-400" />
              <h1 className="text-4xl font-bold">Settings</h1>
            </div>
            <p className="text-slate-400">
              Control local data retention and telemetry preferences for Guided Explorer sessions.
            </p>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    Privacy & Preferences
                  </CardTitle>
                  <CardDescription>
                    Deterministic outputs remain enabled. You control local storage and telemetry.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Save Sessions Locally</label>
                      <p className="text-xs text-slate-400">Store Guided Explorer sessions in your browser.</p>
                    </div>
                    <button
                      onClick={() => handleToggle('saveSessions')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        preferences.saveSessions ? 'bg-cyan-500' : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          preferences.saveSessions ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Anonymous Telemetry</label>
                      <p className="text-xs text-slate-400">Help us improve with minimal usage signals.</p>
                    </div>
                    <button
                      onClick={() => handleToggle('telemetryEnabled')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        preferences.telemetryEnabled ? 'bg-cyan-500' : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          preferences.telemetryEnabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    Data Management
                  </CardTitle>
                  <CardDescription>
                    Export or clear your saved Guided Explorer sessions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="secondary" onClick={handleExport} className="flex-1">
                      <Download className="w-4 h-4" />
                      Export Sessions
                    </Button>
                    <Button variant="secondary" onClick={handleReset} className="flex-1">
                      <RotateCcw className="w-4 h-4" />
                      Reset Preferences
                    </Button>
                  </div>

                  {!showDeleteConfirm ? (
                    <Button
                      variant="danger"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Saved Sessions ({sessions.length})
                    </Button>
                  ) : (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-400">Are you sure?</p>
                          <p className="text-sm text-slate-400">This action cannot be undone.</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="danger" onClick={handleDeleteAll} className="flex-1">
                          Yes, Clear All
                        </Button>
                        <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              {saved && (
                <div className="inline-flex items-center gap-2 text-sm text-emerald-400">
                  <Check className="w-4 h-4" />
                  Preferences saved.
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2">
                Preferences are saved automatically when toggled.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
