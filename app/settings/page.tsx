'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { usePreferences } from '@/hooks/usePreferences';
import { AI_MODELS, DEFAULT_PREFERENCES } from '@/lib/constants';
import { exportAllData, clearAllConversations } from '@/lib/storage';
import {
  Settings,
  Brain,
  Sliders,
  Database,
  Download,
  Trash2,
  RotateCcw,
  Save,
  Check,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const { preferences, isLoaded, updatePreferences, resetToDefaults } = usePreferences();
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    defaultModel: 'claude',
    systemPrompt: '',
    temperature: 0.7,
    maxTokens: 4096,
    streamingEnabled: true,
  });

  useEffect(() => {
    if (isLoaded) {
      setFormData({
        defaultModel: preferences.defaultModel,
        systemPrompt: preferences.systemPrompt,
        temperature: preferences.temperature,
        maxTokens: preferences.maxTokens,
        streamingEnabled: preferences.streamingEnabled,
      });
    }
  }, [isLoaded, preferences]);

  const handleSave = () => {
    updatePreferences(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brainstack-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAll = () => {
    clearAllConversations();
    setShowDeleteConfirm(false);
  };

  const handleReset = () => {
    resetToDefaults();
    setFormData({
      defaultModel: DEFAULT_PREFERENCES.defaultModel,
      systemPrompt: DEFAULT_PREFERENCES.systemPrompt,
      temperature: DEFAULT_PREFERENCES.temperature,
      maxTokens: DEFAULT_PREFERENCES.maxTokens,
      streamingEnabled: DEFAULT_PREFERENCES.streamingEnabled,
    });
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
          {/* Header */}
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
              Customize your BrainStack Studio experience.
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* AI Model Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-cyan-400" />
                    AI Model Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure your default AI model and behavior.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Default Model */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Default Model</label>
                    <div className="grid grid-cols-2 gap-3">
                      {AI_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => setFormData({ ...formData, defaultModel: model.id })}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            formData.defaultModel === model.id
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${model.gradientColor} flex items-center justify-center`}>
                              <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">{model.name}</div>
                              <div className="text-xs text-slate-400">{model.provider}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* System Prompt */}
                  <div>
                    <label className="block text-sm font-medium mb-2">System Prompt</label>
                    <p className="text-xs text-slate-400 mb-3">
                      Customize the AI's behavior and personality.
                    </p>
                    <Textarea
                      value={formData.systemPrompt}
                      onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                      rows={5}
                      placeholder="You are a helpful assistant..."
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Generation Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-cyan-400" />
                    Generation Settings
                  </CardTitle>
                  <CardDescription>
                    Fine-tune AI response generation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Temperature */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Temperature</label>
                      <span className="text-sm text-cyan-400">{formData.temperature}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      Higher values make output more random, lower values more deterministic.
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  {/* Max Tokens */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Tokens</label>
                    <p className="text-xs text-slate-400 mb-3">
                      Maximum length of AI responses.
                    </p>
                    <Input
                      type="number"
                      value={formData.maxTokens}
                      onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) || 4096 })}
                      min={256}
                      max={32000}
                    />
                  </div>

                  {/* Streaming Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Streaming Responses</label>
                      <p className="text-xs text-slate-400">Show responses as they're generated</p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, streamingEnabled: !formData.streamingEnabled })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        formData.streamingEnabled ? 'bg-cyan-500' : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          formData.streamingEnabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Data Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    Data Management
                  </CardTitle>
                  <CardDescription>
                    Export or delete your data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="secondary" onClick={handleExport} className="flex-1">
                      <Download className="w-4 h-4" />
                      Export All Data
                    </Button>
                    <Button variant="secondary" onClick={handleReset} className="flex-1">
                      <RotateCcw className="w-4 h-4" />
                      Reset to Defaults
                    </Button>
                  </div>

                  {!showDeleteConfirm ? (
                    <Button
                      variant="danger"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete All Conversations
                    </Button>
                  ) : (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-400">Are you sure?</p>
                          <p className="text-sm text-slate-400">This action cannot be undone. All conversations will be permanently deleted.</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="danger" onClick={handleDeleteAll} className="flex-1">
                          Yes, Delete All
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

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button onClick={handleSave} size="lg" className="w-full">
                {saved ? (
                  <>
                    <Check className="w-5 h-5" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Settings
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
