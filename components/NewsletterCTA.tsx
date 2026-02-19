'use client';

import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/telemetry';

interface NewsletterCTAProps {
  /** Compact mode for inline placement (e.g. blog sidebar) */
  variant?: 'default' | 'compact' | 'footer';
  className?: string;
}

export function NewsletterCTA({ variant = 'default', className = '' }: NewsletterCTAProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Subscription failed');
      }

      await trackEvent({ name: 'newsletter_subscribe', payload: { variant } });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  if (status === 'success') {
    return (
      <div className={`rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center ${className}`}>
        <Mail className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
        <p className="text-emerald-300 font-medium">You&apos;re subscribed.</p>
        <p className="text-sm text-emerald-400/70 mt-1">
          We&apos;ll send you operational AI insights — no spam, unsubscribe anytime.
        </p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h3 className="font-semibold text-white mb-3">Stay updated</h3>
        <p className="text-sm text-slate-400 mb-3">Operational AI insights, delivered monthly.</p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoComplete="email"
            className="flex-1 min-w-0 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
          />
          <Button type="submit" size="sm" disabled={status === 'loading'}>
            {status === 'loading' ? '...' : 'Join'}
          </Button>
        </form>
        {status === 'error' && (
          <p className="text-xs text-amber-400 mt-2">{errorMsg}</p>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`rounded-xl border border-white/10 bg-white/5 p-5 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold">Get operational AI insights</h3>
        </div>
        <p className="text-xs text-slate-400 mb-3">Monthly playbooks and frameworks. No spam.</p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoComplete="email"
            className="flex-1 min-w-0 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
          />
          <Button type="submit" size="sm" disabled={status === 'loading'}>
            {status === 'loading' ? '...' : 'Subscribe'}
          </Button>
        </form>
        {status === 'error' && (
          <p className="text-xs text-amber-400 mt-2">{errorMsg}</p>
        )}
      </div>
    );
  }

  // Default: full-width CTA block
  return (
    <div className={`rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/40 to-blue-500/10 p-8 md:p-10 ${className}`}>
      <div className="max-w-2xl mx-auto text-center">
        <Mail className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Stay ahead of operational AI</h3>
        <p className="text-slate-300 mb-6">
          Monthly playbooks, governance frameworks, and automation strategies from the BrainStack team. No fluff.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoComplete="email"
            className="flex-1 min-w-0 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
          />
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Subscribing...' : (
              <>
                Subscribe
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </form>
        {status === 'error' && (
          <p className="text-sm text-amber-400 mt-3">{errorMsg}</p>
        )}
        <p className="text-xs text-slate-500 mt-4">Unsubscribe anytime. We respect your inbox.</p>
      </div>
    </div>
  );
}
