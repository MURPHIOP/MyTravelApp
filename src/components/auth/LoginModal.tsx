'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { X, Loader2 } from 'lucide-react';

export default function LoginModal() {
  const { isModalOpen, closeLoginModal, refreshAuth } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        await refreshAuth();
        closeLoginModal();
        setUsername('');
        setPassword('');
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
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-[var(--surface-light)] border-4 border-[var(--border-color)] p-8 shadow-[8px_8px_0px_0px_var(--shadow-color)] relative"
          >
            <button 
              onClick={closeLoginModal}
              className="absolute top-4 right-4 text-[var(--border-color)] hover:text-[var(--accent)] transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">System Login</h2>
            <p className="text-sm font-mono text-[var(--text-muted)] mb-8">Authenticate to access secured modules.</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label className="font-mono text-xs font-bold uppercase mb-2 block">Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-[var(--bg-color)] border-2 border-[var(--border-color)] outline-none focus:border-[var(--accent)] transition-colors font-mono"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-mono text-xs font-bold uppercase mb-2 block">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-[var(--bg-color)] border-2 border-[var(--border-color)] outline-none focus:border-[var(--accent)] transition-colors font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="text-sm font-mono font-bold text-red-500">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="brutal-btn brutal-btn-accent w-full mt-4"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'AUTHENTICATE'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
