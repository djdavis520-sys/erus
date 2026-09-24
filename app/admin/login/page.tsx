'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin/products');
    } else {
      setError('Invalid password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div
        className="w-full max-w-sm p-8 rounded-2xl border"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}
      >
        <div className="text-center mb-8">
          <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 700, fontSize: '1.8rem', color: 'var(--primary)' }}>
            EXOTICS <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>R</span> US
          </div>
          <div className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Admin Access</div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            required
            autoFocus
            className="w-full px-4 py-3 rounded-xl border text-sm"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
          />
          {error && (
            <p className="text-sm text-center" style={{ color: 'var(--pop)' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-white font-semibold disabled:opacity-60"
            style={{ background: 'var(--primary)', border: 'none', cursor: 'pointer', fontFamily: 'Fredoka, sans-serif', fontSize: '1rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
