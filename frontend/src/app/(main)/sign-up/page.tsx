'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { account, databases } from '@/lib/appwrite';
import { OAuthProvider, Query } from 'appwrite';
import SectionBadge from '@/components/ui/SectionBadge';
import GradientHeading from '@/components/ui/GradientHeading';

/* ─── Social provider config ──────────────────────────────────────────────── */
const socialProviders = [
  {
    id: 'google' as const,
    label: 'Google',
    provider: OAuthProvider.Google,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    id: 'microsoft' as const,
    label: 'Microsoft',
    provider: OAuthProvider.Microsoft,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect x="1" y="1" width="10" height="10" fill="#F25022" />
        <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
        <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
        <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
      </svg>
    ),
  },
  {
    id: 'github' as const,
    label: 'GitHub',
    provider: OAuthProvider.Github,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    id: 'discord' as const,
    label: 'Discord',
    provider: OAuthProvider.Discord,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
];

/* ─── Constants ───────────────────────────────────────────────────────────── */
const ADMIN_DATABASE_ID = '69a83b2f002fc2ab7386';
const ADMIN_TABLE_ID = 'admin';

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function SignUpPage() {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [loginRole, setLoginRole] = useState<'user' | 'admin'>('user');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* If user already has an active session, redirect to dashboard */
  useEffect(() => {
    account
      .get()
      .then(() => {
        window.location.href = '/dashboard';
      })
      .catch(() => {
        // No active session — stay on sign-up page
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* Email / Password submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (loginRole === 'admin' && mode === 'signin') {
        // ── Admin sign-in: verify against the Admin table directly via REST ──
        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69a7f212001b0a737d22';

        const url = `${endpoint}/databases/${ADMIN_DATABASE_ID}/collections/${ADMIN_TABLE_ID}/documents?queries[]=${encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'Email', values: [form.email] }))}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': projectId,
          },
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          console.error('Admin table query failed:', response.status, errData);
          setError('Unable to verify admin credentials. Check database permissions.');
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!data.documents || data.documents.length === 0) {
          setError('This email is not registered as an admin.');
          setLoading(false);
          return;
        }

        const adminDoc = data.documents[0];

        if (adminDoc.Password !== form.password) {
          setError('Invalid admin password.');
          setLoading(false);
          return;
        }

        // Store admin info in sessionStorage so the admin dashboard can read it
        sessionStorage.setItem('adminSession', JSON.stringify({
          id: adminDoc.$id,
          email: adminDoc.Email,
          role: adminDoc.role,
          isActive: adminDoc.isActive,
        }));

        window.location.href = '/admin';
      } else {
        // ── Regular user sign-up / sign-in via Appwrite auth ──
        // Delete any stale session before creating a new one
        try { await account.deleteSession('current'); } catch { /* no active session — ok */ }

        if (mode === 'signup') {
          await account.create('unique()', form.email, form.password, form.name);
          await account.createEmailPasswordSession(form.email, form.password);
        } else {
          await account.createEmailPasswordSession(form.email, form.password);
        }
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /* OAuth social login */
  const handleSocialLogin = (providerId: string, provider: OAuthProvider) => {
    setSocialLoading(providerId);
    setError(null);
    try {
      const successRedirect = loginRole === 'admin' 
        ? `${window.location.origin}/admin`
        : `${window.location.origin}/dashboard`;
      account.createOAuth2Session(
        provider,
        successRedirect,   // success redirect - redirects to /admin for admins, /dashboard for users
        `${window.location.origin}/sign-up`,       // failure redirect
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'OAuth failed';
      setError(message);
      setSocialLoading(null);
    }
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00ff88]/40 focus:ring-1 focus:ring-[#00ff88]/20 transition-all duration-200';

  return (
    <main className="bg-black min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md flex flex-col gap-8">

        {/* ── Branding ───────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center gap-3">
          <SectionBadge text="Community" />
          <GradientHeading className="text-[32px] md:text-[40px]">
            {mode === 'signup' ? 'Join AgentsClan' : 'Welcome back'}
          </GradientHeading>
          <p className="text-white/50 text-sm leading-relaxed max-w-[320px]">
            {mode === 'signup'
              ? 'Create your account and start building with the community.'
              : 'Sign in to your AgentsClan account.'}
          </p>
        </div>

        {/* ── Toggle ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
          {(['signup', 'signin'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-white text-black'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {m === 'signup' ? 'Sign Up' : 'Sign In'}
            </button>
          ))}
        </div>

        {/* ── Role selector (only on Sign In) ────────────────────────────── */}
        {mode === 'signin' && (
          <div className="flex items-center gap-3">
            <label className="text-white/40 text-xs font-medium uppercase tracking-wider">
              Sign in as
            </label>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
              {(['user', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setLoginRole(r); setError(null); }}
                  className={`px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    loginRole === r
                      ? r === 'admin'
                        ? 'bg-[#00ff88] text-[#0b1a13]'
                        : 'bg-white text-black'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Social Login Buttons ───────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {socialProviders.map((sp) => (
              <button
                key={sp.id}
                onClick={() => handleSocialLogin(sp.id, sp.provider)}
                disabled={!!socialLoading}
                className="group flex items-center justify-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 hover:border-[#00ff88]/30 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {socialLoading === sp.id ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-[#00ff88] rounded-full animate-spin" />
                ) : (
                  sp.icon
                )}
                <span>{sp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs uppercase tracking-wider font-medium">or continue with email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* ── Error ──────────────────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* ── Email / Password Form ──────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">

          {mode === 'signup' && (
            <div className="flex flex-col gap-2">
              <label className="text-white/60 text-xs font-medium uppercase tracking-wider">
                Full Name <span className="text-[#00ff88]">*</span>
              </label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Arjun Mehta"
                className={inputClass}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-white/60 text-xs font-medium uppercase tracking-wider">
              Email <span className="text-[#00ff88]">*</span>
            </label>
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/60 text-xs font-medium uppercase tracking-wider">
              Password <span className="text-[#00ff88]">*</span>
            </label>
            <input
              required
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00cc66] opacity-40 blur-md group-hover:opacity-70 transition-opacity duration-300" />
            <div className="relative bg-gradient-to-r from-[#00ff88] to-[#00cc66] rounded-full px-[29px] py-[13px] overflow-hidden transition-transform active:scale-95">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-white/40 blur-[2px]" />
              <span className="text-[#0b1a13] text-sm font-semibold relative z-10 flex items-center justify-center gap-2">
                {loading && (
                  <div className="w-4 h-4 border-2 border-[#0b1a13]/30 border-t-[#0b1a13] rounded-full animate-spin" />
                )}
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
              </span>
            </div>
          </button>

          <p className="text-white/30 text-xs text-center">
            {mode === 'signup'
              ? 'By signing up you agree to our Terms of Service.'
              : 'Forgot your password? Reach us on Discord.'}
          </p>
        </form>

        {/* ── Back link ──────────────────────────────────────────────────── */}
        <p className="text-center text-white/40 text-sm">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to home
          </Link>
        </p>

      </div>
    </main>
  );
}
