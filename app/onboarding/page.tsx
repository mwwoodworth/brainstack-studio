'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { sanitizeRedirectPath } from '@/lib/authRedirect';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

type OnboardingForm = {
  role: string;
  teamSize: string;
  primaryGoal: string;
  industry: string;
  integrationReadiness: string;
};

const TEAM_SIZE_OPTIONS = ['1-5', '6-20', '21-100', '101-500', '500+'];
const GOAL_OPTIONS = [
  'Reduce manual operations workload',
  'Increase revenue reliability',
  'Improve compliance and audit readiness',
  'Scale delivery without adding headcount',
];
const READINESS_OPTIONS = ['Researching', 'Pilot-ready', 'Actively implementing'];

const DEFAULT_FORM: OnboardingForm = {
  role: '',
  teamSize: '',
  primaryGoal: '',
  industry: '',
  integrationReadiness: '',
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      </main>
    }>
      <OnboardingPageInner />
    </Suspense>
  );
}

function OnboardingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = useMemo(
    () => sanitizeRedirectPath(searchParams.get('redirect'), '/dashboard'),
    [searchParams]
  );

  const [form, setForm] = useState<OnboardingForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      try {
        const response = await fetch('/api/onboarding');
        const data = await response.json();
        if (!isMounted) return;

        if (data.success && data.completed) {
          router.replace(redirect);
          return;
        }

        if (data.success && data.profile) {
          setForm({
            role: String(data.profile.role || ''),
            teamSize: String(data.profile.teamSize || ''),
            primaryGoal: String(data.profile.primaryGoal || ''),
            industry: String(data.profile.industry || ''),
            integrationReadiness: String(data.profile.integrationReadiness || ''),
          });
        }
      } catch {
        // Keep form available even if status check fails.
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadStatus();
    return () => {
      isMounted = false;
    };
  }, [redirect, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete onboarding');
      }

      router.push(redirect);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Onboarding failed');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Badge variant="primary" className="mb-4">Onboarding</Badge>
            <h1 className="text-4xl font-bold mb-3">Set up your workspace</h1>
            <p className="text-slate-400">
              Complete this once so your dashboard and recommendations match your operating context.
            </p>
          </motion.div>

          <Card>
            <CardHeader>
              <CardTitle>Organization profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="onboarding-role" className="block text-sm font-medium mb-2">
                    Your role
                  </label>
                  <Input
                    id="onboarding-role"
                    value={form.role}
                    onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                    placeholder="Operations Manager, Founder, Director..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="onboarding-industry" className="block text-sm font-medium mb-2">
                    Industry
                  </label>
                  <Input
                    id="onboarding-industry"
                    value={form.industry}
                    onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))}
                    placeholder="Construction, SaaS, Healthcare..."
                  />
                </div>

                <div>
                  <span className="block text-sm font-medium mb-2">Team size</span>
                  <div className="flex flex-wrap gap-2">
                    {TEAM_SIZE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, teamSize: option }))}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          form.teamSize === option
                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                            : 'border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-medium mb-2">Primary goal</span>
                  <div className="grid gap-2">
                    {GOAL_OPTIONS.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, primaryGoal: goal }))}
                        className={`text-left px-3 py-2 rounded-lg border text-sm ${
                          form.primaryGoal === goal
                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                            : 'border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-medium mb-2">Integration readiness</span>
                  <div className="flex flex-wrap gap-2">
                    {READINESS_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, integrationReadiness: option }))}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          form.integrationReadiness === option
                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                            : 'border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    You can update this later from Settings.
                  </p>
                  <Button type="submit" size="lg" isLoading={saving}>
                    Finish onboarding
                    {!saving && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
