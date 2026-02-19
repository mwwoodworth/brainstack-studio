'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { sanitizeRedirectPath } from '@/lib/authRedirect';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type AuthMode = 'signin' | 'signup' | 'magic-link' | 'forgot-password';

export default function AuthPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </main>
    }>
      <AuthPageInner />
    </Suspense>
  );
}

function AuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirectPath(searchParams.get('redirect'), '/dashboard');

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const supabase = createSupabaseBrowserClient();

  async function handleEmailPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
          },
        });
        if (signUpError) throw signUpError;
        setMagicLinkSent(true);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push(redirect);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        },
      });
      if (otpError) throw otpError;
      setMagicLinkSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (resetError) throw resetError;
      setMagicLinkSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  }

  if (magicLinkSent) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-slate-400">
            We sent a {mode === 'signup' ? 'confirmation' : mode === 'forgot-password' ? 'password reset' : 'sign-in'} link to{' '}
            <span className="text-white font-medium">{email}</span>.
            Click the link to continue.
          </p>
          <Button variant="secondary" onClick={() => { setMagicLinkSent(false); setError(null); }}>
            Back to sign in
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <Brain className="w-8 h-8 text-cyan-400" />
          <span className="text-xl font-bold">BrainStack Studio</span>
        </Link>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            {mode === 'signin' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'magic-link' && 'Sign in with magic link'}
            {mode === 'forgot-password' && 'Reset your password'}
          </h1>
          <p className="text-sm text-slate-400 text-center mb-6">
            {mode === 'magic-link'
              ? 'We\'ll email you a passwordless sign-in link.'
              : mode === 'forgot-password'
              ? 'Enter your email and we\'ll send you a reset link.'
              : 'Access your Pro dashboard, saved sessions, and tools.'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={mode === 'magic-link' ? handleMagicLink : mode === 'forgot-password' ? handleForgotPassword : handleEmailPassword} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  className="pl-10"
                />
              </div>
            </div>

            {mode !== 'magic-link' && mode !== 'forgot-password' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                    minLength={6}
                    autoComplete="current-password"
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'magic-link' ? 'Sending link...' : mode === 'forgot-password' ? 'Sending reset link...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'magic-link' && 'Send Magic Link'}
                  {mode === 'forgot-password' && 'Send Reset Link'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Mode switchers */}
          <div className="mt-6 space-y-3 text-center text-sm">
            {mode === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={() => { setMode('forgot-password'); setError(null); }}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot your password?
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('magic-link'); setError(null); }}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Sign in with magic link instead
                </button>
                <p className="text-slate-400">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(null); }}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}
            {mode === 'signup' && (
              <p className="text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(null); }}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'magic-link' && (
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); }}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Sign in with password instead
              </button>
            )}
            {mode === 'forgot-password' && (
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); }}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>

        {/* Back to home */}
        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            Back to BrainStack Studio
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
