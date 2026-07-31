'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ChevronLeft, Users, Plane } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TRIP_CONFIG, PLACE_IMAGES } from '@/lib/tripData';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo auth: check against env vars or defaults
    const validUsers = [
      {
        email: process.env.NEXT_PUBLIC_GOPAL_EMAIL ?? 'gopal@mitrafamily.com',
        password: '1234',
        family: TRIP_CONFIG.families[0],
      },
      {
        email: process.env.NEXT_PUBLIC_SUDIP_EMAIL ?? 'sudip@ghoshfamily.com',
        password: '5678',
        family: TRIP_CONFIG.families[1],
      },
    ];

    await new Promise(r => setTimeout(r, 700));

    const user = validUsers.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('mt-head', user.family.id);
      localStorage.setItem('mt-head-name', user.family.head);
      router.push('/expenses');
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'var(--bg)',
        backgroundImage: `linear-gradient(180deg, rgba(7,11,20,0.9) 0%, rgba(7,11,20,0.98) 100%), url(${PLACE_IMAGES.hero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Back */}
      <div className="p-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 tap"
          style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: 600 }}
        >
          <ChevronLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5">
        {/* Logo */}
        <div
          className="flex items-center justify-center w-16 h-16 rounded-3xl mb-5"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
            boxShadow: '0 16px 48px rgba(59,130,246,0.5)',
          }}
        >
          <Lock size={26} color="#fff" strokeWidth={2} />
        </div>

        <h1
          className="heading-xl text-center mb-2"
          style={{ color: '#fff' }}
        >
          Family Head Login
        </h1>

        <p
          className="text-center body-sm mb-8"
          style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 280 }}
        >
          Only family heads can access expense management. Viewers can explore the app without logging in.
        </p>

        {/* Card */}
        <div
          className="w-full max-w-sm rounded-3xl p-6"
          style={{
            background: 'rgba(15,24,41,0.75)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}
        >
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="field"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="field"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    paddingRight: 48,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.45)' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="p-3 rounded-2xl"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', fontSize: 13, fontWeight: 500 }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary tap"
              style={{ borderRadius: 16, padding: '14px', fontSize: 15, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Family accounts */}
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', marginBottom: 10 }}>FAMILY HEAD ACCOUNTS</p>
            <div className="flex flex-col gap-2">
              {TRIP_CONFIG.families.map(f => (
                <div
                  key={f.id}
                  className="tap flex items-center gap-3 p-3 rounded-2xl cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onClick={() => setEmail(f.email)}
                >
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: f.color, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, flexShrink: 0,
                    }}
                  >
                    {f.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{f.head}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{f.family}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                    {f.email}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Note for viewers */}
        <p
          className="text-center mt-6"
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', maxWidth: 280 }}
        >
          Viewers can browse the entire app — itinerary, trains, hotels, and places — without any login.
        </p>
      </div>
    </div>
  );
}
