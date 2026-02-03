'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { INDUSTRIES, PAIN_POINTS, ROLES } from '@/lib/explorer';
import { trackEvent } from '@/lib/telemetry';
import { isFeatureEnabled } from '@/lib/featureFlags';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    role: '',
    painPoint: '',
    budget: '',
    message: '',
  });

  const updateField = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFeatureEnabled('leadCapture')) return;
    setStatus('loading');
    setError(null);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to submit');
      }

      await trackEvent({ name: 'lead_submit', payload: form });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Submission failed');
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <Badge variant="primary" className="mb-4">Enterprise Intake</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Request an implementation.
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Give us your context. We will respond with a scoped, deterministic plan and the safest
              path to deployment.
            </p>
          </motion.div>

          <Card>
            <CardHeader>
              <CardTitle>Tell us about your operation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-sm font-medium">Name</label>
                  <input
                    id="contact-name"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium">Work Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-company" className="text-sm font-medium">Company</label>
                  <input
                    id="contact-company"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                    value={form.company}
                    onChange={(e) => updateField('company', e.target.value)}
                    required
                    autoComplete="organization"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-industry" className="text-sm font-medium">Industry</label>
                  <select
                    id="contact-industry"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                    value={form.industry}
                    onChange={(e) => updateField('industry', e.target.value)}
                    required
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((industry) => (
                      <option key={industry.id} value={industry.label}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-role" className="text-sm font-medium">Role</label>
                  <select
                    id="contact-role"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                    value={form.role}
                    onChange={(e) => updateField('role', e.target.value)}
                    required
                  >
                    <option value="">Select role</option>
                    {ROLES.map((role) => (
                      <option key={role.id} value={role.label}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-painpoint" className="text-sm font-medium">Primary Pain Point</label>
                  <select
                    id="contact-painpoint"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                    value={form.painPoint}
                    onChange={(e) => updateField('painPoint', e.target.value)}
                    required
                  >
                    <option value="">Select pain point</option>
                    {PAIN_POINTS.map((pain) => (
                      <option key={pain.id} value={pain.label}>
                        {pain.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="contact-budget" className="text-sm font-medium">Budget Range (optional)</label>
                  <input
                    id="contact-budget"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                    value={form.budget}
                    onChange={(e) => updateField('budget', e.target.value)}
                    placeholder="$10k-$50k, $50k-$250k, $250k+"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="contact-message" className="text-sm font-medium">Describe the workflow you want improved</label>
                  <textarea
                    id="contact-message"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm min-h-[140px]"
                    value={form.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-4">
                  <Button type="submit" size="lg" disabled={status === 'loading' || !isFeatureEnabled('leadCapture')}>
                    {status === 'loading' ? 'Submitting…' : 'Request Implementation'}
                  </Button>
                  {status === 'success' && (
                    <span className="text-sm text-emerald-400">Request received. We will follow up shortly.</span>
                  )}
                  {status === 'error' && (
                    <span className="text-sm text-amber-300">{error}</span>
                  )}
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
