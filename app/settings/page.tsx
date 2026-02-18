'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useExplorerPreferences } from '@/hooks/useExplorerPreferences';
import { useExplorerSessions } from '@/hooks/useExplorerSessions';
import { useSubscription } from '@/hooks/useSubscription';
import {
  Settings,
  Shield,
  Database,
  Download,
  RotateCcw,
  Trash2,
  Check,
  AlertTriangle,
  CreditCard,
  Crown,
  ExternalLink,
  Loader2,
} from 'lucide-react';

export default function SettingsPage() {
  const { preferences, isLoaded, updatePreferences, resetToDefaults } = useExplorerPreferences();
  const { sessions, clearSessions } = useExplorerSessions();
  const { isPro, status: subStatus, tier, loading: subLoading } = useSubscription();
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

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

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // silent fail — user can try again
    } finally {
      setPortalLoading(false);
    }
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
      <main id="main-content" className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-20 px-6 flex items-center justify-center">
          <div className="animate-pulse text-slate-400">Loading settings...</div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen">
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
              Control session retention and telemetry preferences for Guided Explorer runs.
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
                      <label className="text-sm font-medium">Save Explorer Sessions</label>
                      <p className="text-xs text-slate-400">
                        Store sessions in your workspace (cloud when signed in, local when signed out).
                      </p>
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
              transition={{ delay: 0.15 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                    Subscription
                  </CardTitle>
                  <CardDescription>
                    Manage your BrainStack Studio plan and billing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subLoading ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading subscription...
                    </div>
                  ) : isPro ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                        <Crown className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="font-medium text-cyan-300">
                            Pro Plan
                            {subStatus === 'trialing' && (
                              <span className="ml-2 text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                                Trial
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400">
                            {subStatus === 'active' ? 'Active subscription' : subStatus === 'trialing' ? 'Trial period' : `Status: ${subStatus}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={handleManageSubscription}
                        disabled={portalLoading}
                        className="w-full"
                      >
                        {portalLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ExternalLink className="w-4 h-4" />
                        )}
                        Manage Subscription
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                        <Shield className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-300">Free Plan</p>
                          <p className="text-xs text-slate-400">
                            Upgrade to Pro for cloud sessions, API key access, and billing controls.
                          </p>
                        </div>
                      </div>
                      <Link href="/pricing">
                        <Button className="w-full">
                          <Crown className="w-4 h-4" />
                          Upgrade to Pro
                        </Button>
                      </Link>
                    </div>
                  )}
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
