'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function LoginContent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const redirectUrl = searchParams.get('redirect') || '/';
        router.push(redirectUrl);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 bg-[var(--bg)]">
      
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        
        <h1 className="text-title-section mb-2">MYTRAVEL</h1>
        <p className="text-body text-[var(--text-secondary)] mb-12 max-w-[200px]">
          Your family&apos;s journey, all in one place.
        </p>

        <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] p-8 shadow-sm">
          <div className="text-metadata mb-8 text-left">FAMILY ACCESS</div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5 text-left">
            <div>
              <label className="text-body text-sm font-medium mb-2 block">Username</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-[var(--radius-button)] bg-[var(--bg)] border border-[var(--border)] outline-none focus:border-[var(--text-primary)] transition-colors text-body"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-body text-sm font-medium mb-2 block">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-[var(--radius-button)] bg-[var(--bg)] border border-[var(--border)] outline-none focus:border-[var(--text-primary)] transition-colors text-body font-mono tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-sm font-medium text-[var(--accent)]">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[var(--text-primary)] text-[var(--surface)] rounded-[var(--radius-button)] py-3 font-medium flex items-center justify-center hover:bg-black transition-colors"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Continue'}
            </button>
          </form>
        </div>

        <p className="text-metadata mt-12">Private family space</p>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <LoginContent />
    </Suspense>
  );
}
