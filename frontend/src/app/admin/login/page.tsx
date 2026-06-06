'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import PasswordInput from '@/components/ui/PasswordInput';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const inp: React.CSSProperties = {
    width: '100%', background: 'var(--inp)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '12px 14px', fontSize: '14px', color: 'var(--text)',
    fontFamily: 'inherit', outline: 'none',
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      Cookies.set('admin_token', data.access_token, { expires: 7 });
      router.push('/admin');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', color: 'var(--teal)', margin: '0 auto 16px' }}>S2</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-1px', color: 'var(--text)', marginBottom: '6px' }}>Admin Login</h1>
          <p style={{ fontSize: '14px', color: 'var(--text2)' }}>S2 Tech Training Center</p>
        </div>
        <form onSubmit={handleLogin} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '6px' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@s2tech.com" style={inp} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '6px' }}>Password</label>
            <PasswordInput value={password} onChange={setPassword} required style={inp} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}
