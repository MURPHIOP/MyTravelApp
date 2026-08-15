'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TactileButton from '@/components/ui/TactileButton';
import { Lock, User } from 'lucide-react';

export default function LoginPage() {
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
      const data = await res.json();

      if (res.ok) {
        window.location.href = '/'; // hard redirect to evaluate middleware
      } else {
        setError(data.error || 'Login failed');
        setLoading(false);
      }
    } catch {
      setError('Network error');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--bg)] shadow-2xl">
      {/* Background Image */}
      <img 
        src="/destinations/dest_ajanta.jpg" 
        className="absolute inset-0 w-full h-full object-cover" 
        alt="Travel Background" 
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="absolute inset-0 cinematic-overlay" />

      {/* Content */}
      <div className="relative z-10 h-full min-h-[100dvh] flex flex-col justify-end p-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mat-glass rounded-[32px] p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">MyTravelApp</h1>
            <p className="text-white/70 font-medium text-sm">PRIVATE FAMILY TRAVEL SYSTEM</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                <User size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors"
                required
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm font-semibold text-center">
                {error}
              </motion.div>
            )}

            <TactileButton type="submit" fullWidth size="lg" disabled={loading} className="mt-4 border-none shadow-[0_4px_24px_rgba(255,90,54,0.4)]">
              {loading ? 'Authenticating...' : 'Secure Login'}
            </TactileButton>

            <div className="text-center mt-6">
              <p className="text-white/40 text-xs font-semibold">
                Authorized family members only.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
