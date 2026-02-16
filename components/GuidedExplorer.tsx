'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  Mail,
  Save,
  Shield,
  Target,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  buildExplorerResult,
  CONFIDENCE_THRESHOLD,
  INDUSTRIES,
  PAIN_POINTS,
  ROLES,
  type ExplorerInput,
} from '@/lib/explorer';
import { useExplorerSessions } from '@/hooks/useExplorerSessions';
import { useExplorerPreferences } from '@/hooks/useExplorerPreferences';
import { trackEvent } from '@/lib/telemetry';

const DEFAULT_INPUT: ExplorerInput = {};

export function GuidedExplorer() {
  const [input, setInput] = useState<ExplorerInput>(DEFAULT_INPUT);
  const [hasRun, setHasRun] = useState(false);
  const [captureEmail, setCaptureEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const { saveSession } = useExplorerSessions();
  const { preferences } = useExplorerPreferences();

  const result = useMemo(() => buildExplorerResult(input), [input]);
  const canRun = Boolean(input.industry && input.role && input.painPoint);

  const runExplorer = async () => {
    if (!canRun) return;
    setHasRun(true);
    try {
      await trackEvent({
        name: 'explorer_run',
        payload: input,
      });
    } catch (error) {
      // Telemetry failure should not break UI functionality
      console.error('Failed to track explorer run:', error);
    }
  };

  const handleSave = async () => {
    if (!result || !canRun) return;
    if (!preferences.saveSessions) return;
    try {
      const session = {
        id: `sess_${Date.now().toString(36)}_${Array.from(crypto.getRandomValues(new Uint8Array(4))).map(b => b.toString(16).padStart(2, '0')).join('')}`,
        createdAt: new Date().toISOString(),
        input,
        result,
      };
      saveSession(session);
      await trackEvent({
        name: 'explorer_save',
        payload: { ...input, confidence: result.confidence },
      });
    } catch (error) {
      // Save/telemetry failure should not break UI functionality
      console.error('Failed to save explorer session:', error);
    }
  };

  const handleEmailCapture = async () => {
    if (!captureEmail.trim() || emailSubmitting) return;
    setEmailSubmitting(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          email: captureEmail.trim(),
          company: '',
          industry: input.industry ?? '',
          role: input.role ?? '',
          painPoint: input.painPoint ?? '',
          message: `Explorer result request — confidence: ${result ? Math.round(result.confidence * 100) : 'N/A'}%`,
        }),
      });
      setEmailSubmitted(true);
      await trackEvent({ name: 'explorer_email_capture', payload: { industry: input.industry } });
    } catch {
      // Silently fail — don't block UX
    } finally {
      setEmailSubmitting(false);
    }
  };

  return (
    <section className="pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-3 mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="primary">Guided AI Explorer</Badge>
            <Badge variant="default" className="text-xs">
              Deterministic Mode: ON
            </Badge>
            <Badge variant="default" className="text-xs">
              Confidence Threshold: {Math.round(CONFIDENCE_THRESHOLD * 100)}%
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Operational AI, mapped to your reality.</h1>
          <p className="text-lg text-slate-400 max-w-3xl">
            Answer three questions. Get a bounded, deterministic workflow preview with confidence scoring,
            decision trail, and clear boundaries. No hype. No hallucinated promises.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Step 1: Context Intake
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  {INDUSTRIES.map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {industry.label}
                    </option>
                  ))}
                </select>
                <p id="explorer-industry-desc" className="text-xs text-slate-500 mt-2">
                  {INDUSTRIES.find((industry) => industry.id === input.industry)?.description}
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
                  {ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="explorer-painpoint" className="block text-sm font-medium mb-2">Primary Pain Point</label>
                <select
                  id="explorer-painpoint"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                  value={input.painPoint ?? ''}
                  onChange={(event) =>
                    setInput((prev) => ({ ...prev, painPoint: event.target.value as ExplorerInput['painPoint'] }))
                  }
                >
                  <option value="">Select pain point</option>
                  {PAIN_POINTS.map((pain) => (
                    <option key={pain.id} value={pain.id}>
                      {pain.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button className="w-full" size="lg" onClick={runExplorer} disabled={!canRun}>
                Generate Deterministic Mapping
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-start gap-2 text-xs text-slate-500">
                <Shield className="w-4 h-4 text-emerald-400 mt-0.5" />
                Outputs are bounded, deterministic, and do not expose proprietary systems.
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Step 2: Solution Mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!hasRun || !result ? (
                <div className="text-sm text-slate-400">
                  Select your context and run the explorer to generate a deterministic mapping.
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="default">
                      Confidence: {Math.round(result.confidence * 100)}% ({result.confidenceLabel})
                    </Badge>
                    {result.confidence < CONFIDENCE_THRESHOLD && (
                      <Badge variant="warning" className="text-xs">
                        Needs more detail
                      </Badge>
                    )}
                  </div>

                  {result.uncertaintyNote && (
                    <div className="flex items-start gap-2 text-sm text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                      <AlertTriangle className="w-4 h-4 mt-0.5" />
                      <p>{result.uncertaintyNote}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Identified Operational Pain</h3>
                    <p className="text-sm text-slate-300">{result.identifiedPain}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Example Workflow Solution</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {result.workflow.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Automation Logic (Bounded)</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {result.automationLogic.map((item) => (
                        <li key={item} className="flex gap-2">
                          <Clock className="w-4 h-4 text-emerald-400 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Example Outputs</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.outputs.map((output) => (
                        <Badge key={output} variant="default" className="text-xs">
                          {output}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Email Capture — visible after explorer run */}
        {hasRun && result && !emailSubmitted && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Get this analysis as a summary</h3>
                  <p className="text-xs text-slate-400">We will send a formatted recap to your inbox. No spam.</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <label htmlFor="explorer-email" className="sr-only">Work email</label>
                <input
                  id="explorer-email"
                  type="email"
                  placeholder="you@company.com"
                  value={captureEmail}
                  onChange={(e) => setCaptureEmail(e.target.value)}
                  className="flex-1 sm:w-56 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <Button size="sm" onClick={handleEmailCapture} disabled={emailSubmitting || !captureEmail.trim()}>
                  {emailSubmitting ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          </div>
        )}
        {hasRun && emailSubmitted && (
          <div className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-sm text-emerald-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Summary sent. Check your inbox.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Step 3: Value Demonstration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!hasRun || !result ? (
                <p className="text-sm text-slate-400">Run the explorer to reveal impact metrics.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400">Time Saved</div>
                    <div className="text-lg font-semibold">{result.value.timeSaved}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400">Labor Reduced</div>
                    <div className="text-lg font-semibold">{result.value.laborReduced}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400">Errors Prevented</div>
                    <div className="text-lg font-semibold">{result.value.errorsPrevented}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400">Decision Latency</div>
                    <div className="text-lg font-semibold">{result.value.decisionLatency}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Step 4: Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-400">
                Want this running in your operation? Choose the path that matches your intent.
              </p>

              <div className="grid gap-3">
                <Button asChild size="lg">
                  <Link href="/pricing">Subscribe to Pro</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/contact">Request Implementation</Link>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link href="/solutions">Unlock Advanced Tools</Link>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link href="/contact">Enterprise Inquiry</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSave}
                  disabled={!hasRun || !result || !preferences.saveSessions}
                >
                  <Save className="w-4 h-4" />
                  Save Session (Local)
                </Button>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Pro unlocks team-shared sessions & advanced tools
                </div>
              </div>

              {!preferences.saveSessions && (
                <div className="text-xs text-amber-200">
                  Local session saving is disabled in Settings.
                </div>
              )}

              {result && (
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold mb-2">Decision Trail (User-Visible)</h4>
                  <ul className="space-y-2 text-xs text-slate-400">
                    {result.decisionTrail.map((step) => (
                      <li key={step} className="flex gap-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
