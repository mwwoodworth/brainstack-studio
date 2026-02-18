'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useExplorerSessions } from '@/hooks/useExplorerSessions';
import { useSubscription } from '@/hooks/useSubscription';
import { INDUSTRIES, PAIN_POINTS, ROLES } from '@/lib/explorer';
import { copyToClipboard, formatDate, truncateText } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  Trash2,
  Clock,
  Target,
  ClipboardList,
  ArrowRight,
  Activity,
  BarChart3,
  KeyRound,
  Plus,
  Copy,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Crown,
} from 'lucide-react';

type UsageTotals = {
  events: number;
  explorerRuns: number;
  toolExecutions: number;
  apiCalls: number;
};

type UsageSeriesPoint = {
  day: string;
  total: number;
  explorer: number;
  tools: number;
  api: number;
};

type UsageResponse = {
  success: boolean;
  totals?: UsageTotals;
  dailySeries?: UsageSeriesPoint[];
  topTools?: Array<{ toolId: string; count: number }>;
  error?: string;
};

type ApiKeyRecord = {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
};

const getLabel = (list: Array<{ id: string; label: string }>, id?: string) =>
  list.find((item) => item.id === id)?.label ?? 'Unspecified';

const EMPTY_USAGE: UsageTotals = {
  events: 0,
  explorerRuns: 0,
  toolExecutions: 0,
  apiCalls: 0,
};

export default function DashboardPage() {
  const { sessions, isLoaded, deleteSession, clearSessions } = useExplorerSessions();
  const { isPro, loading: subLoading } = useSubscription();
  const [searchQuery, setSearchQuery] = useState('');

  const [usageTotals, setUsageTotals] = useState<UsageTotals>(EMPTY_USAGE);
  const [usageSeries, setUsageSeries] = useState<UsageSeriesPoint[]>([]);
  const [topTools, setTopTools] = useState<Array<{ toolId: string; count: number }>>([]);
  const [usageLoading, setUsageLoading] = useState(true);
  const [usageError, setUsageError] = useState<string | null>(null);

  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [apiKeysLoading, setApiKeysLoading] = useState(true);
  const [apiKeyName, setApiKeyName] = useState('');
  const [apiKeyBusy, setApiKeyBusy] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [apiKeysError, setApiKeysError] = useState<string | null>(null);
  const [apiKeysLocked, setApiKeysLocked] = useState(false);

  const filteredSessions = useMemo(() => {
    if (!searchQuery) return sessions;
    const query = searchQuery.toLowerCase();
    return sessions.filter((session) => {
      const industry = getLabel(INDUSTRIES, session.input.industry).toLowerCase();
      const role = getLabel(ROLES, session.input.role).toLowerCase();
      const pain = getLabel(PAIN_POINTS, session.input.painPoint).toLowerCase();
      const summary = session.result.identifiedPain.toLowerCase();
      return (
        industry.includes(query) ||
        role.includes(query) ||
        pain.includes(query) ||
        summary.includes(query)
      );
    });
  }, [sessions, searchQuery]);

  const totalSessions = sessions.length;
  const lastSession = sessions[0];
  const lastRun = lastSession ? formatDate(Date.parse(lastSession.createdAt)) : 'No runs yet';

  const topIndustry = useMemo(() => {
    const counts = sessions.reduce<Record<string, number>>((acc, session) => {
      const key = session.input.industry ?? 'unknown';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? getLabel(INDUSTRIES, top[0]) : 'N/A';
  }, [sessions]);

  const peakSeriesValue = useMemo(() => {
    return Math.max(1, ...usageSeries.map((point) => point.total));
  }, [usageSeries]);

  async function loadUsage() {
    setUsageLoading(true);
    setUsageError(null);
    try {
      const response = await fetch('/api/dashboard/usage', { cache: 'no-store' });
      const data = (await response.json()) as UsageResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load usage analytics');
      }
      setUsageTotals(data.totals ?? EMPTY_USAGE);
      setUsageSeries(data.dailySeries ?? []);
      setTopTools(data.topTools ?? []);
    } catch (error) {
      setUsageTotals(EMPTY_USAGE);
      setUsageSeries([]);
      setTopTools([]);
      setUsageError(error instanceof Error ? error.message : 'Failed to load usage analytics');
    } finally {
      setUsageLoading(false);
    }
  }

  async function loadApiKeys() {
    setApiKeysLoading(true);
    setApiKeysError(null);
    try {
      const response = await fetch('/api/dashboard/api-keys', { cache: 'no-store' });
      const data = await response.json();

      if (response.status === 403 && data.code === 'PRO_REQUIRED') {
        setApiKeys([]);
        setApiKeysLocked(true);
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load API keys');
      }

      setApiKeysLocked(false);
      setApiKeys((data.keys as ApiKeyRecord[]) ?? []);
    } catch (error) {
      setApiKeys([]);
      setApiKeysLocked(false);
      setApiKeysError(error instanceof Error ? error.message : 'Failed to load API keys');
    } finally {
      setApiKeysLoading(false);
    }
  }

  async function handleCreateApiKey() {
    if (apiKeysLocked) return;
    setApiKeyBusy(true);
    setApiKeysError(null);
    setCreatedKey(null);

    try {
      const response = await fetch('/api/dashboard/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: apiKeyName }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create API key');
      }

      setCreatedKey(data.rawKey || null);
      setApiKeyName('');
      await loadApiKeys();
    } catch (error) {
      setApiKeysError(error instanceof Error ? error.message : 'Failed to create API key');
    } finally {
      setApiKeyBusy(false);
    }
  }

  async function handleRevokeApiKey(id: string) {
    if (apiKeysLocked) return;
    setApiKeyBusy(true);
    setApiKeysError(null);
    try {
      const response = await fetch(`/api/dashboard/api-keys/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to revoke API key');
      }

      await loadApiKeys();
    } catch (error) {
      setApiKeysError(error instanceof Error ? error.message : 'Failed to revoke API key');
    } finally {
      setApiKeyBusy(false);
    }
  }

  useEffect(() => {
    void loadUsage();
  }, []);

  useEffect(() => {
    if (subLoading) return;

    if (!isPro) {
      setApiKeys([]);
      setApiKeysLocked(true);
      setApiKeysLoading(false);
      return;
    }

    void loadApiKeys();
  }, [isPro, subLoading]);

  if (!isLoaded) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-20 px-6 flex items-center justify-center">
          <div className="animate-pulse text-slate-400" role="status" aria-live="polite">Loading dashboard...</div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LayoutDashboard className="w-10 h-10 text-cyan-400" aria-hidden="true" />
                <h1 className="text-4xl font-bold">Explorer Dashboard</h1>
              </div>
              <p className="text-slate-400">
                Track usage analytics, manage API keys, and review saved explorer sessions.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/explorer">
                <Button size="lg">
                  Run Explorer
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              {sessions.length > 0 && (
                <Button variant="secondary" size="lg" onClick={clearSessions}>
                  Clear All
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalSessions}</div>
                    <div className="text-xs text-slate-400">Saved Sessions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Target className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold truncate">{topIndustry}</div>
                    <div className="text-xs text-slate-400">Top Industry</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-400" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{lastRun}</div>
                    <div className="text-xs text-slate-400">Last Run</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-fuchsia-500/10 rounded-lg">
                    <Activity className="w-5 h-5 text-fuchsia-400" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{usageTotals.events}</div>
                    <div className="text-xs text-slate-400">Tracked Events</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                      Usage Analytics
                    </CardTitle>
                    <CardDescription>Last 14 days of tracked workspace activity</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={loadUsage} disabled={usageLoading}>
                    {usageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {usageError ? (
                    <div className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                      {usageError}
                    </div>
                  ) : null}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-xs text-slate-500">Explorer Runs</div>
                      <div className="text-xl font-semibold">{usageTotals.explorerRuns}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-xs text-slate-500">Tool Executions</div>
                      <div className="text-xl font-semibold">{usageTotals.toolExecutions}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-xs text-slate-500">API Calls</div>
                      <div className="text-xl font-semibold">{usageTotals.apiCalls}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-xs text-slate-500">Total Events</div>
                      <div className="text-xl font-semibold">{usageTotals.events}</div>
                    </div>
                  </div>

                  <div className="h-44 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    {usageSeries.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-sm text-slate-500">
                        No usage events yet.
                      </div>
                    ) : (
                      <div className="h-full flex items-end gap-2">
                        {usageSeries.map((point) => {
                          const height = Math.max(6, Math.round((point.total / peakSeriesValue) * 120));
                          return (
                            <div key={point.day} className="flex-1 flex flex-col items-center gap-2">
                              <div
                                className="w-full rounded-t-md bg-gradient-to-t from-cyan-600/80 to-cyan-300/80"
                                style={{ height }}
                                title={`${point.day}: ${point.total} events`}
                              />
                              <span className="text-[10px] text-slate-500">
                                {point.day.slice(5)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Top Tool Usage
                  </CardTitle>
                  <CardDescription>Most frequently executed tools</CardDescription>
                </CardHeader>
                <CardContent>
                  {topTools.length === 0 ? (
                    <p className="text-sm text-slate-500">No tool execution data yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {topTools.map((item) => (
                        <div key={item.toolId} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                          <span className="text-sm text-slate-300">{item.toolId}</span>
                          <Badge variant="default">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-cyan-400" />
                  API Key Management
                </CardTitle>
                <CardDescription>Create and revoke keys for external integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subLoading ? (
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading subscription...
                  </div>
                ) : apiKeysLocked ? (
                  <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-4 space-y-3">
                    <p className="text-sm text-cyan-200">
                      API key management is available on the Pro plan.
                    </p>
                    <Link href="/pricing">
                      <Button>
                        <Crown className="w-4 h-4" />
                        Upgrade to Pro
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row gap-3">
                      <Input
                        value={apiKeyName}
                        onChange={(event) => setApiKeyName(event.target.value)}
                        placeholder="Optional key name (e.g. Production MCP)"
                      />
                      <Button onClick={handleCreateApiKey} disabled={apiKeyBusy}>
                        {apiKeyBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Create key
                      </Button>
                    </div>

                    {createdKey && (
                      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 space-y-2">
                        <p className="text-xs text-emerald-200">
                          Copy this key now. It will not be shown again.
                        </p>
                        <div className="flex flex-col md:flex-row gap-2 md:items-center">
                          <code className="flex-1 text-xs bg-black/40 rounded px-2 py-2 break-all">{createdKey}</code>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={async () => {
                              await copyToClipboard(createdKey);
                            }}
                          >
                            <Copy className="w-4 h-4" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    )}

                    {apiKeysError && (
                      <div className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                        {apiKeysError}
                      </div>
                    )}

                    {apiKeysLoading ? (
                      <div className="text-sm text-slate-500 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading API keys...
                      </div>
                    ) : apiKeys.length === 0 ? (
                      <p className="text-sm text-slate-500">No active API keys.</p>
                    ) : (
                      <div className="space-y-2">
                        {apiKeys.map((key) => (
                          <div key={key.id} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                              <p className="font-medium">{key.name}</p>
                              <p className="text-xs text-slate-500">
                                Prefix {key.key_prefix}... • Created {formatDate(Date.parse(key.created_at))}
                                {key.last_used_at ? ` • Last used ${formatDate(Date.parse(key.last_used_at))}` : ''}
                              </p>
                            </div>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRevokeApiKey(key.id)}
                              disabled={apiKeyBusy}
                            >
                              Revoke
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by industry, role, pain point, or summary..."
                className="pl-12"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {filteredSessions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-semibold mb-2">
                    {sessions.length === 0 ? 'No sessions saved yet' : 'No matching sessions'}
                  </h3>
                  <p className="text-slate-400 mb-6">
                    {sessions.length === 0
                      ? 'Run the Guided Explorer and save a session to build a deployment plan.'
                      : 'Try a different search term.'}
                  </p>
                  {sessions.length === 0 && (
                    <Link href="/explorer">
                      <Button>
                        Run Explorer
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredSessions.map((session) => {
                    const industry = getLabel(INDUSTRIES, session.input.industry);
                    const role = getLabel(ROLES, session.input.role);
                    const pain = getLabel(PAIN_POINTS, session.input.painPoint);

                    return (
                      <motion.div
                        key={session.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card variant="interactive">
                          <CardContent className="py-4 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <div className="text-sm text-slate-400">{industry}</div>
                                <div className="text-lg font-semibold">{role} · {pain}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant="default">
                                  Confidence {Math.round(session.result.confidence * 100)}%
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  {formatDate(Date.parse(session.createdAt))}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-slate-300">
                              {truncateText(session.result.identifiedPain, 160)}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {session.result.outputs.map((output) => (
                                <Badge key={output} variant="default" className="text-xs">
                                  {output}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between">
                              <Link href="/explorer">
                                <Button variant="secondary" size="sm">
                                  Open Explorer
                                  <ArrowRight className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(event) => {
                                  event.preventDefault();
                                  deleteSession(session.id);
                                }}
                                className="text-slate-400 hover:text-red-400"
                                aria-label="Delete session"
                              >
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
