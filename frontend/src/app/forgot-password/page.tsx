'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PasswordInput from '@/components/ui/PasswordInput';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--inp)', border: '1px solid var(--border)',
  borderRadius: '10px', padding: '11px 14px', fontSize: '14px',
  color: 'var(--text)', outline: 'none', fontFamily: 'inherit',
};

type Step = 'email' | 'otp' | 'reset';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep]             = useState<Step>('email');
  const [email, setEmail]           = useState('');
  const [otp, setOtp]               = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm]       = useState('');
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [loading, setLoading]       = useState(false);

  const stepNum = step === 'email' ? 1 : step === 'otp' ? 2 : 3;

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API}/auth/user/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      setSuccess('OTP sent! Check your email inbox.');
      setStep('otp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally { setLoading(false); }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API}/auth/user/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid OTP');
      setSuccess('OTP verified! Set your new password.');
      setStep('reset');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally { setLoading(false); }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) { setError('Passwords do not match'); return; }
    if (newPassword.length < 6)  { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/user/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      router.push('/login?reset=success');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally { setLoading(false); }
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 5% 60px', background: 'var(--bg)' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 8px 40px rgba(0,0,0,.12)' }}>

            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < 3 ? 1 : 'none' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0, background: n <= stepNum ? 'var(--teal)' : 'var(--inp)', color: n <= stepNum ? '#fff' : 'var(--text3)', border: n <= stepNum ? 'none' : '1px solid var(--border)', transition: 'all .3s' }}>
                    {n}
                  </div>
                  {n < 3 && <div style={{ flex: 1, height: '2px', background: n < stepNum ? 'var(--teal)' : 'var(--border)', margin: '0 6px', transition: 'background .3s' }} />}
                </div>
              ))}
            </div>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-.5px', color: 'var(--text)', marginBottom: '6px' }}>
                {step === 'email' ? 'Forgot Password' : step === 'otp' ? 'Enter OTP' : 'New Password'}
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text2)' }}>
                {step === 'email' && "Enter your email and we'll send you a reset code."}
                {step === 'otp'   && `We sent a 6-digit code to ${email}`}
                {step === 'reset' && 'Choose a strong new password.'}
              </p>
            </div>

            {/* Success message */}
            {success && (
              <div style={{ background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#16a34a', marginBottom: '16px' }}>
                {success}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#ef4444', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {/* Step 1 — Email */}
            {step === 'email' && (
              <form onSubmit={handleEmail} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={inp} />
                </div>
                <button type="submit" disabled={loading} style={{ background: loading ? 'var(--text3)' : 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '13px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', fontFamily: 'inherit', transition: 'background .2s' }}>
                  {loading ? 'Sending OTP…' : 'Send OTP →'}
                </button>
              </form>
            )}

            {/* Step 2 — OTP */}
            {step === 'otp' && (
              <form onSubmit={handleOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>6-Digit OTP Code</label>
                  <input
                    type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000" required maxLength={6}
                    style={{ ...inp, fontSize: '24px', fontWeight: 700, letterSpacing: '8px', textAlign: 'center' }}
                  />
                  <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '6px' }}>OTP expires in 10 minutes</p>
                </div>
                <button type="submit" disabled={loading || otp.length !== 6} style={{ background: (loading || otp.length !== 6) ? 'var(--text3)' : 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '13px', borderRadius: '12px', border: 'none', cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer', width: '100%', fontFamily: 'inherit', transition: 'background .2s' }}>
                  {loading ? 'Verifying…' : 'Verify OTP →'}
                </button>
                <button type="button" onClick={() => { setSuccess(''); setError(''); handleEmail({ preventDefault: () => {} } as React.FormEvent); }} style={{ background: 'transparent', border: 'none', color: 'var(--teal)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Resend OTP
                </button>
              </form>
            )}

            {/* Step 3 — New Password */}
            {step === 'reset' && (
              <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>New Password</label>
                  <PasswordInput value={newPassword} onChange={setNewPassword} placeholder="Min 6 characters" required style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>Confirm Password</label>
                  <PasswordInput value={confirm} onChange={setConfirm} placeholder="Repeat password" required style={inp} />
                </div>
                <button type="submit" disabled={loading} style={{ background: loading ? 'var(--text3)' : 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '13px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', fontFamily: 'inherit', transition: 'background .2s' }}>
                  {loading ? 'Resetting…' : 'Reset Password ✓'}
                </button>
              </form>
            )}

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text2)' }}>
              <Link href="/login" style={{ color: 'var(--teal)', fontWeight: 700, textDecoration: 'none' }}>← Back to Login</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
