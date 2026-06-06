'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[S2 Tech App Error]', error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '40px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '520px', width: '100%' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>Something went wrong</h2>
        <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
          <code style={{ fontSize: '12px', color: '#ef4444', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {error.message || String(error)}
          </code>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '20px' }}>
          Open browser <strong>DevTools → Console</strong> for the full stack trace.
        </p>
        <button onClick={reset} style={{ background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          Try again
        </button>
      </div>
    </div>
  );
}
