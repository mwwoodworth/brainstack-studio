'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  Save,
  Shield,
  Target,
  Zap,
  Search,
  Filter,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  CONFIDENCE_THRESHOLD,
  INDUSTRIES,
  PAIN_POINTS,
  ROLES,
  type ExplorerInput,
  type ExplorerResult,
} from '@/lib/explorer';
import { useExplorerSessions } from '@/hooks/useExplorerSessions';
import { useExplorerPreferences } from '@/hooks/useExplorerPreferences';
import { formatDate, truncateText } from '@/lib/utils';

type CapabilityOption = {
  id: string;
  label: string;
  description?: string;
};

type CapabilityResponse = {
  status: string;
  confidenceThreshold: number;
  industries: CapabilityOption[];
  roles: CapabilityOption[];
  painPoints: CapabilityOption[];
};

type CapabilityRunResponse = {
  status: string;
  result: ExplorerResult;
  error?: string;
};

const DEFAULT_INPUT: ExplorerInput = {};

const RESULT_TABS = [
  { id: 'workflow', label: 'Workflow' },
  { id: 'logic', label: 'Automation Logic' },
  { id: 'boundaries', label: 'Boundaries' },
  { id: 'trail', label: 'Decision Trail' },
] as const;

type ResultTab = (typeof RESULT_TABS)[number]['id'];

export function GuidedExplorer() {
  const [input, setInput] = useState<ExplorerInput>(DEFAULT_INPUT);
  const [hasRun, setHasRun] = useState(false);
  const [result, setResult] = useState<ExplorerResult | null>(null);
  const [activeTab, setActiveTab] = useState<ResultTab>('workflow');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [capabilities, setCapabilities] = useState<CapabilityResponse | null>(null);
  const [capabilityLoading, setCapabilityLoading] = useState(true);

  const [historySearch, setHistorySearch] = useState('');
  const [historyIndustry, setHistoryIndustry] = useState<string>('all');
  const [historyConfidence, setHistoryConfidence] = useState<'all' | 'high' | 'moderate' | 'low'>('all');

  const { sessions, saveSession } = useExplorerSessions();
  const { preferences } = useExplorerPreferences();

  const canRun = Boolean(input.industry && input.role && input.painPoint);

  useEffect(() => {
    let isMounted = true;

    async function loadCapabilities() {
      setCapabilityLoading(true);
      try {
        const response = await fetch('/api/capability', { cache: 'no-store' });
        const data = (await response.json()) as CapabilityResponse;
        if (!isMounted) return;

        if (response.ok && data.status === 'ok') {
          setCapabilities(data);
        } else {
          setCapabilities({
            status: 'ok',
            confidenceThreshold: CONFIDENCE_THRESHOLD,
            industries: INDUSTRIES,
            roles: ROLES,
            painPoints: PAIN_POINTS,
          });
        }
      } catch {
        if (!isMounted) return;
        setCapabilities({
          status: 'ok',
          confidenceThreshold: CONFIDENCE_THRESHOLD,
          industries: INDUSTRIES,
          roles: ROLES,
          painPoints: PAIN_POINTS,
        });
      } finally {
        if (isMounted) setCapabilityLoading(false);
      }
    }

    void loadCapabilities();
    return () => {
      isMounted = false;
    };
  }, []);

  const allIndustries = capabilities?.industries ?? INDUSTRIES;
  const allRoles = capabilities?.roles ?? ROLES;
  const allPainPoints = capabilities?.painPoints ?? PAIN_POINTS;
  const confidenceThreshold = capabilities?.confidenceThreshold ?? CONFIDENCE_THRESHOLD;

  const historyResults = useMemo(() => {
    return sessions.filter((session) => {
      if (historyIndustry !== 'all' && session.input.industry !== historyIndustry) return false;

      const confidence = session.result.confidence;
      if (historyConfidence === 'high' && confidence < 0.8) return false;
      if (historyConfidence === 'moderate' && (confidence < 0.65 || confidence >= 0.8)) return false;
      if (historyConfidence === 'low' && confidence >= 0.65) return false;

      if (!historySearch.trim()) return true;
      const query = historySearch.toLowerCase();
      const searchable = [
        allIndustries.find((item) => item.id === session.input.industry)?.label ?? '',
        allRoles.find((item) => item.id === session.input.role)?.label ?? '',
        allPainPoints.find((item) => item.id === session.input.painPoint)?.label ?? '',
        session.result.identifiedPain,
        ...session.result.workflow,
        ...session.result.outputs,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [sessions, historyIndustry, historyConfidence, historySearch, allIndustries, allRoles, allPainPoints]);

  async function runExplorer() {
    if (!canRun || running) return;
    setRunning(true);
    setError(null);

    try {
      const response = await fetch('/api/capability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = (await response.json()) as CapabilityRunResponse;

      if (!response.ok || data.status !== 'ok' || !data.result) {
        throw new Error(data.error || 'Failed to generate deterministic mapping');
      }

      setResult(data.result);
      setHasRun(true);
      setActiveTab('workflow');
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : 'Explorer run failed');
      setHasRun(false);
      setResult(null);
    } finally {
      setRunning(false);
    }
  }

  function applySession(sessionId: string) {
    const selected = sessions.find((session) => session.id === sessionId);
    if (!selected) return;
    setInput(selected.input);
    setResult(selected.result);
    setHasRun(true);
    setActiveTab('workflow');
  }

  function handleSave() {
    if (!result || !canRun || !preferences.saveSessions) return;
    const suffix =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID().slice(0, 8)
        : Math.random().toString(36).slice(2, 10);
    const session = {
      id: `sess_${Date.now().toString(36)}_${suffix}`,
      createdAt: new Date().toISOString(),
      input,
      result,
    };
    saveSession(session);
  }

  const renderResultTab = () => {
    if (!result) return null;
    if (activeTab === 'workflow') return result.workflow;
    if (activeTab === 'logic') return result.automationLogic;
    if (activeTab === 'boundaries') return result.boundaries;
    return result.decisionTrail;
  };

  return (
    <section className="pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="primary">Guided AI Explorer</Badge>
            <Badge variant="default" className="text-xs">
              Deterministic mode
            </Badge>
            <Badge variant="default" className="text-xs">
              Confidence threshold {Math.round(confidenceThreshold * 100)}%
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Operational AI mapped to your context</h1>
          <p className="text-lg text-slate-400 max-w-3xl">
            Run capability mappings against real, bounded API responses. Search and filter your previous runs
            to compare outputs, confidence, and decision trails.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Context Intake
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {capabilityLoading && (
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading capability options...
                </div>
              )}

              <div>
                <label htmlFor="explorer-industry" className="block text-sm font-medium mb-2">Industry</label>
                <select
                  id="explorer-industry"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                  value={input.industry ?? ''}
                  onChange={(event) =>
                    setInput((prev) => ({ ...prev, industry: event.target.value as ExplorerInput['industry'] }))
                  }
                >
                  <option value="">Select industry</option>
                  {allIndustries.map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {industry.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2">
                  {allIndustries.find((industry) => industry.id === input.industry)?.description || ' '}
                </p>
              </div>

              <div>
                <label htmlFor="explorer-role" className="block text-sm font-medium mb-2">Role</label>
                <select
                  id="explorer-role"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                  value={input.role ?? ''}
                  onChange={(event) =>
                    setInput((prev) => ({ ...prev, role: event.target.value as ExplorerInput['role'] }))
                  }
                >
                  <option value="">Select role</option>
                  {allRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="explorer-painpoint" className="block text-sm font-medium mb-2">Primary pain point</label>
                <select
                  id="explorer-painpoint"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                  value={input.painPoint ?? ''}
                  onChange={(event) =>
                    setInput((prev) => ({ ...prev, painPoint: event.target.value as ExplorerInput['painPoint'] }))
                  }
                >
                  <option value="">Select pain point</option>
                  {allPainPoints.map((pain) => (
                    <option key={pain.id} value={pain.id}>
                      {pain.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <Button className="w-full" size="lg" onClick={runExplorer} disabled={!canRun || running}>
                {running ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Generate Deterministic Mapping
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-start gap-2 text-xs text-slate-500">
                <Shield className="w-4 h-4 text-emerald-400 mt-0.5" />
                Responses are generated by bounded capability APIs and never expose internal orchestration.
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Result Mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {!hasRun || !result ? (
                <p className="text-sm text-slate-400">
                  Run the explorer to view deterministic workflow logic, value metrics, and boundaries.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="default">
                      Confidence {Math.round(result.confidence * 100)}% ({result.confidenceLabel})
                    </Badge>
                    {result.confidence < confidenceThreshold && (
                      <Badge variant="warning" className="text-xs">
                        Below threshold
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Identified operational pain</h3>
                    <p className="text-sm text-slate-300">{result.identifiedPain}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-slate-400">Time saved</div>
                      <div className="font-semibold">{result.value.timeSaved}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-slate-400">Labor reduced</div>
                      <div className="font-semibold">{result.value.laborReduced}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-slate-400">Errors prevented</div>
                      <div className="font-semibold">{result.value.errorsPrevented}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-slate-400">Decision latency</div>
                      <div className="font-semibold">{result.value.decisionLatency}</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {RESULT_TABS.map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-3 py-1.5 text-xs rounded-full border ${
                            activeTab === tab.id
                              ? 'border-cyan-500 text-cyan-300 bg-cyan-500/10'
                              : 'border-white/10 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {renderResultTab()?.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Example outputs</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.outputs.map((output) => (
                        <Badge key={output} variant="default" className="text-xs">
                          {output}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleSave}
                      disabled={!preferences.saveSessions}
                    >
                      <Save className="w-4 h-4" />
                      Save Session
                    </Button>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {preferences.saveSessions ? 'Saved locally for your dashboard' : 'Session saving disabled'}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              Result Library
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  className="pl-9"
                  placeholder="Search saved results"
                  value={historySearch}
                  onChange={(event) => setHistorySearch(event.target.value)}
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={historyIndustry}
                  onChange={(event) => setHistoryIndustry(event.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 pl-9 pr-3 py-2 text-sm"
                >
                  <option value="all">All industries</option>
                  {allIndustries.map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {industry.label}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={historyConfidence}
                onChange={(event) => setHistoryConfidence(event.target.value as typeof historyConfidence)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
              >
                <option value="all">All confidence</option>
                <option value="high">High (80%+)</option>
                <option value="moderate">Moderate (65-79%)</option>
                <option value="low">Low (&lt;65%)</option>
              </select>
            </div>

            {historyResults.length === 0 ? (
              <div className="text-sm text-slate-500 py-6 text-center border border-white/10 rounded-lg">
                No matching saved sessions.
              </div>
            ) : (
              <div className="space-y-2">
                {historyResults.slice(0, 8).map((session) => {
                  const industry = allIndustries.find((item) => item.id === session.input.industry)?.label ?? 'Unknown';
                  return (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => applySession(session.id)}
                      className="w-full text-left rounded-lg border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition px-3 py-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="text-sm font-medium">{industry}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="text-xs">
                            {Math.round(session.result.confidence * 100)}%
                          </Badge>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(Date.parse(session.createdAt))}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">
                        {truncateText(session.result.identifiedPain, 150)}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            <Button asChild size="lg">
              <Link href="/pricing">Subscribe to Pro</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Request Implementation</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
