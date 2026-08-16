'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TactileButton from '@/components/ui/TactileButton';
import { Lock, User, PlaneTakeoff, ShieldCheck } from 'lucide-react';
import BackgroundArt from '@/components/ui/BackgroundArt';

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
        window.location.href = '/'; 
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
    <div className="relative min-h-screen w-full flex overflow-hidden bg-[var(--bg)]">
      <BackgroundArt />
      
      {/* ── LEFT: CINEMATIC HERO (HIDDEN ON MOBILE, 50% ON DESKTOP) ── */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <img 
          src="/destinations/dest_ellora.jpg" 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Maharashtra Journey" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-[var(--bg)]" />
        <div className="absolute inset-0 cinematic-overlay" />
        
        <div className="absolute bottom-16 left-16 text-white max-w-lg">
          <div className="label-sm text-white/70 mb-4 flex items-center gap-2">
            <PlaneTakeoff size={14} />
            <span>Private Family Journey</span>
          </div>
          <h1 className="heading-display mb-4">Ancient<br/>Maharashtra</h1>
          <p className="body-base text-white/80">
            A curated 11-day expedition traversing the architectural monoliths, ancient Jyotirlingas, and historic vineyards of India.
          </p>
        </div>
      </div>

      {/* ── RIGHT: LOGIN PANEL (100% MOBILE, 45% DESKTOP) ── */}
      <div className="w-full lg:w-[45%] min-h-[100dvh] flex flex-col justify-center items-center p-6 lg:p-12 relative z-10">
        
        {/* Mobile-only Branding */}
        <div className="lg:hidden text-center mb-10 mt-safe">
          <h1 className="heading-xl text-[var(--text-primary)] tracking-tight mb-2">MyTravelApp</h1>
          <p className="label-micro text-[var(--text-secondary)]">Private Family Travel System</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] mat-paper p-8 lg:p-10 relative overflow-hidden"
        >
          {/* Subtle Document styling (Perforation/Stamp effect) */}
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck size={120} />
          </div>
          
          <div className="mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-xs font-bold tracking-wider mb-6">
              SECURE PORTAL
            </div>
            <h2 className="heading-lg mb-2">Family Sign In</h2>
            <p className="body-base text-[var(--text-muted)]">
              Enter your credentials to access the travel itinerary, documents, and expense ledger.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div className="space-y-1">
              <label className="label-micro pl-1">Username</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[var(--surface-2)] border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] rounded-xl py-3.5 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all shadow-[var(--inset-soft)]"
                  placeholder="e.g. admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="label-micro pl-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--surface-2)] border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] rounded-xl py-3.5 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-all shadow-[var(--inset-soft)]"
                  placeholder="Enter passcode"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-[var(--accent-danger)] text-sm font-semibold pt-2">
                {error}
              </motion.div>
            )}

            <div className="pt-4">
              <TactileButton type="submit" fullWidth size="lg" disabled={loading} className="bg-[var(--accent)] text-white shadow-md">
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </TactileButton>
            </div>
          </form>
        </motion.div>

        {/* Security Footer */}
        <div className="mt-12 text-center max-w-[300px]">
          <p className="label-micro text-[var(--text-muted)] mb-1">
            Strictly Private • Mitra & Ghosh Family
          </p>
          <p className="text-[10px] text-[var(--text-muted)]/50 uppercase tracking-widest">
            End-to-End Encrypted Session
          </p>
        </div>

      </div>
    </div>
  );
}
