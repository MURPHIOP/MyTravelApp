'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { X, Loader2, Fingerprint } from 'lucide-react';

const PARTICLES = [
  { id: 0, left: '10%', top: '20%', scale: 1.5, opacity: 0.4, duration: 18, delay: 0 },
  { id: 1, left: '25%', top: '70%', scale: 2.0, opacity: 0.3, duration: 22, delay: 1 },
  { id: 2, left: '40%', top: '15%', scale: 1.2, opacity: 0.5, duration: 16, delay: 2 },
  { id: 3, left: '55%', top: '85%', scale: 2.4, opacity: 0.35, duration: 25, delay: 0.5 },
  { id: 4, left: '70%', top: '35%', scale: 1.8, opacity: 0.45, duration: 20, delay: 1.5 },
  { id: 5, left: '85%', top: '65%', scale: 1.3, opacity: 0.4, duration: 17, delay: 2.5 },
  { id: 6, left: '15%', top: '50%', scale: 2.2, opacity: 0.3, duration: 23, delay: 3 },
  { id: 7, left: '30%', top: '30%', scale: 1.6, opacity: 0.5, duration: 19, delay: 0.8 },
  { id: 8, left: '60%', top: '60%', scale: 1.4, opacity: 0.4, duration: 21, delay: 1.2 },
  { id: 9, left: '80%', top: '10%', scale: 2.1, opacity: 0.35, duration: 24, delay: 2.2 },
  { id: 10, left: '50%', top: '40%', scale: 1.7, opacity: 0.45, duration: 18, delay: 1.8 },
  { id: 11, left: '90%', top: '90%', scale: 1.5, opacity: 0.3, duration: 20, delay: 0.2 },
];

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
      setError('An error occurred during authentication');
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
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {PARTICLES.map((p) => (
              <motion.div
                key={p.id}
                className="absolute w-2 h-2 rounded-full bg-blue-500/20"
                style={{ left: p.left, top: p.top }}
                initial={{
                  scale: p.scale,
                  opacity: p.opacity,
                  y: 0,
                }}
                animate={{
                  y: [-20, 20, -20],
                  x: [-15, 15, -15],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            className="w-full max-w-md bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden"
          >
            {/* Glossy Reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/0 to-white/20 pointer-events-none rounded-3xl" />

            <button 
              onClick={closeLoginModal}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10 bg-black/20 p-2 rounded-full backdrop-blur-sm"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <Fingerprint size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Secure Access</h2>
              <p className="text-sm text-blue-200/80 mt-1">Authenticate to unlock Family Ledger</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5 relative z-10">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-blue-200/70 uppercase tracking-wider ml-1">Username</label>
                <input
                  type="text"
                  className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all backdrop-blur-sm"
                  placeholder="Enter your family ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-blue-200/70 uppercase tracking-wider ml-1">Password</label>
                <input
                  type="password"
                  className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all backdrop-blur-sm"
                  placeholder="Enter access code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-sm font-medium text-red-400 bg-red-900/20 border border-red-500/20 px-4 py-3 rounded-xl text-center"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-2xl overflow-hidden transition-transform active:scale-[0.98] shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                {loading ? <Loader2 size={20} className="animate-spin relative z-10" /> : <span className="relative z-10 tracking-wide">AUTHENTICATE</span>}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
