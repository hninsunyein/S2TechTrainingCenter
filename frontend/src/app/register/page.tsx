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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('s2-user-token', data.access_token);
      localStorage.setItem('s2-user', JSON.stringify(data.user));
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 5% 60px', background: 'var(--bg)' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 8px 40px rgba(0,0,0,.12)' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎓</div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-.5px', color: 'var(--text)', marginBottom: '6px' }}>Create account</h1>
              <p style={{ fontSize: '13px', color: 'var(--text2)' }}>Join S2 Tech Training Center</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>Password</label>
                <PasswordInput value={password} onChange={setPassword} placeholder="Min 6 characters" required style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>Confirm Password</label>
                <PasswordInput value={confirm} onChange={setConfirm} placeholder="Repeat password" required style={inp} />
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#ef4444' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ background: loading ? 'var(--text3)' : 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '13px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', fontFamily: 'inherit', marginTop: '4px', transition: 'background .2s' }}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text2)' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--teal)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
