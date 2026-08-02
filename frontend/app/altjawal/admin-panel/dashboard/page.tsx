'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/dashApi';
import '../../../styles/dashboard/dashboard.css';

const BASE = '/altjawal/admin-panel/dashboard';
type View = 'login' | 'fp-email' | 'fp-otp' | 'fp-reset';

export default function DashboardRootPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [view, setView] = useState<View>('login');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Forgot-password state
  const [fpEmail, setFpEmail] = useState('');
  const [fpOtp, setFpOtp] = useState('');
  const [fpNew, setFpNew] = useState('');
  const [fpConfirm, setFpConfirm] = useState('');
  const [fpMsg, setFpMsg] = useState('');
  const [fpError, setFpError] = useState('');
  const [fpLoading, setFpLoading] = useState(false);

  // On mount: check if already logged in
  useEffect(() => {
    apiFetch('/api/admin/verify')
      .then((res) => {
        if (res.ok) router.replace(`${BASE}/bookings`);
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  // ── Login ──────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await apiFetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.replace(`${BASE}/bookings`);
      } else {
        const data = await res.json();
        setLoginError(data.error || 'Invalid email or password.');
      }
    } catch {
      setLoginError('Network error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  }

  // ── Forgot: Step 1 — send OTP ─────────────────────
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setFpError('');
    setFpLoading(true);
    try {
      const res = await apiFetch('/api/admin/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: fpEmail }),
      });
      const data = await res.json();
      setFpMsg(data.message || 'OTP sent to your email.');
      setView('fp-otp');
    } catch {
      setFpError('Network error. Please try again.');
    } finally {
      setFpLoading(false);
    }
  }

  // ── Forgot: Step 2 — verify OTP ───────────────────
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setFpError('');
    setFpLoading(true);
    try {
      const res = await apiFetch('/api/admin/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ otp: fpOtp }),
      });
      if (res.ok) {
        setView('fp-reset');
      } else {
        const data = await res.json();
        setFpError(data.error || 'Invalid or expired OTP.');
      }
    } catch {
      setFpError('Network error. Please try again.');
    } finally {
      setFpLoading(false);
    }
  }

  // ── Forgot: Step 3 — reset password ───────────────
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setFpError('');
    if (fpNew !== fpConfirm) { setFpError('Passwords do not match.'); return; }
    if (fpNew.length < 8) { setFpError('Password must be at least 8 characters.'); return; }
    setFpLoading(true);
    try {
      const res = await apiFetch('/api/admin/reset-password', {
        method: 'POST',
        body: JSON.stringify({ newPassword: fpNew, confirmPassword: fpConfirm }),
      });
      if (res.ok) {
        setView('login');
        setLoginError('');
        setFpEmail(''); setFpOtp(''); setFpNew(''); setFpConfirm('');
        setFpMsg('Password updated. Please sign in.');
      } else {
        const data = await res.json();
        setFpError(data.error || 'Failed to reset password.');
      }
    } catch {
      setFpError('Network error. Please try again.');
    } finally {
      setFpLoading(false);
    }
  }

  function backToLogin() {
    setView('login');
    setFpError(''); setFpMsg('');
  }

  if (checking) return (
    <div className="db-scope db-login-page">
      <div className="db-login-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <p style={{ fontFamily: 'var(--font-ivy-presto), Georgia, serif', fontSize: '13px', letterSpacing: '1px', color: '#38443E' }}>Al Tajwal</p>
        <p style={{ fontSize: '13px', color: '#7a8982' }}>Connecting…</p>
      </div>
    </div>
  );

  return (
    <div className="db-scope db-login-page">
      <div className="db-login-card">
        <div className="db-login-brand">
          <h1>Al Tajwal</h1>
          <p>Admin Dashboard</p>
        </div>

        {/* ── Login form ── */}
        {view === 'login' && (
          <form className="db-login-form" onSubmit={handleLogin}>
            {fpMsg && <p className="db-save-success" style={{ textAlign: 'center' }}>{fpMsg}</p>}
            <div className="db-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoFocus
              />
            </div>
            <div className="db-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            {loginError && <p className="db-login-error">{loginError}</p>}
            <button type="submit" className="db-btn db-btn--primary" disabled={loginLoading}>
              {loginLoading ? 'Signing in…' : 'Sign In'}
            </button>
            <button type="button" className="db-login-forgot" onClick={() => { setView('fp-email'); setFpMsg(''); setFpError(''); }}>
              Forgot password?
            </button>
          </form>
        )}

        {/* ── Step 1: Enter email ── */}
        {view === 'fp-email' && (
          <form className="db-login-form" onSubmit={handleSendOtp}>
            <p className="db-login-hint">Enter your admin email. We will send a one-time code to it.</p>
            <div className="db-field">
              <label htmlFor="fp-email">Admin Email</label>
              <input
                id="fp-email"
                type="email"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoFocus
              />
            </div>
            {fpError && <p className="db-login-error">{fpError}</p>}
            <button type="submit" className="db-btn db-btn--primary" disabled={fpLoading}>
              {fpLoading ? 'Sending…' : 'Send OTP'}
            </button>
            <button type="button" className="db-login-forgot" onClick={backToLogin}>Back to login</button>
          </form>
        )}

        {/* ── Step 2: Enter OTP ── */}
        {view === 'fp-otp' && (
          <form className="db-login-form" onSubmit={handleVerifyOtp}>
            {fpMsg && <p className="db-login-hint">{fpMsg}</p>}
            <div className="db-field">
              <label htmlFor="fp-otp">6-Digit OTP</label>
              <input
                id="fp-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={fpOtp}
                onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                required
                autoFocus
                style={{ letterSpacing: '8px', fontSize: '20px', textAlign: 'center' }}
              />
            </div>
            {fpError && <p className="db-login-error">{fpError}</p>}
            <button type="submit" className="db-btn db-btn--primary" disabled={fpLoading}>
              {fpLoading ? 'Verifying…' : 'Verify OTP'}
            </button>
            <button type="button" className="db-login-forgot" onClick={() => setView('fp-email')}>Resend OTP</button>
          </form>
        )}

        {/* ── Step 3: Set new password ── */}
        {view === 'fp-reset' && (
          <form className="db-login-form" onSubmit={handleResetPassword}>
            <div className="db-field">
              <label htmlFor="fp-new">New Password</label>
              <input
                id="fp-new"
                type="password"
                value={fpNew}
                onChange={(e) => setFpNew(e.target.value)}
                placeholder="Min 8 characters"
                required
                autoFocus
              />
            </div>
            <div className="db-field">
              <label htmlFor="fp-confirm">Confirm Password</label>
              <input
                id="fp-confirm"
                type="password"
                value={fpConfirm}
                onChange={(e) => setFpConfirm(e.target.value)}
                placeholder="Repeat password"
                required
              />
            </div>
            {fpError && <p className="db-login-error">{fpError}</p>}
            <button type="submit" className="db-btn db-btn--primary" disabled={fpLoading}>
              {fpLoading ? 'Saving…' : 'Set New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
