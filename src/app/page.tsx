'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ArrowRight, MapPin, Calendar, Users, Train, Hotel, Wallet, Compass } from 'lucide-react';
import { PLACE_IMAGES, TRIP_CONFIG } from '@/lib/tripData';

export default function HomePage() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-anim',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.bento-anim',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.4 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full">
      {/* ── IMMERSIVE HERO SECTION ── */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        <div className="ambient-orb bg-blue-500/20 top-1/4 left-1/4" style={{ width: '50vw', height: '50vw' }} />
        <div className="ambient-orb bg-purple-500/20 bottom-1/4 right-1/4" style={{ width: '40vw', height: '40vw', animationDelay: '2s' }} />
        
        <div className="container-wide relative z-10 flex flex-col items-center text-center">
          <div className="hero-anim inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-sm font-bold tracking-wide uppercase">Starts October 16, 2026</span>
          </div>

          <h1 className="hero-anim heading-hero mb-6 max-w-5xl">
            Experience the <span className="text-gradient">Ancient Soul</span> of Maharashtra.
          </h1>

          <p className="hero-anim text-body-large text-muted max-w-2xl mb-12">
            An exclusive 11-day private journey for the Mitra & Ghosh families. 
            Exploring 3 Jyotirlingas, UNESCO heritage caves, and sacred destinations.
          </p>

          <div className="hero-anim flex flex-col sm:flex-row items-center gap-4">
            <Link href="/itinerary" className="tap px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2">
              Explore the Itinerary <ArrowRight size={20} />
            </Link>
            <Link href="/places" className="tap px-8 py-4 rounded-full glass-card text-white font-bold text-lg hover:bg-white/5 transition-colors">
              View Destinations
            </Link>
          </div>
        </div>

        {/* Hero Background Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[var(--bg-dark)] to-transparent pointer-events-none" />
      </section>

      {/* ── BENTO GRID FEATURES ── */}
      <section className="py-24">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div>
              <h2 className="heading-section">Your Journey Hub</h2>
              <p className="text-muted mt-2">Everything you need for the trip in one place.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
            
            {/* Itinerary / Map (Large Box) */}
            <Link href="/itinerary" className="bento-anim tap glass-card md:col-span-2 md:row-span-2 relative overflow-hidden group">
              <img src={PLACE_IMAGES.ellora} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-700" alt="Ellora" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/60 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center backdrop-blur-md border border-blue-500/30">
                  <MapPin size={28} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">11-Day Interactive Itinerary</h3>
                  <p className="text-muted">Explore the day-by-day plan, including 3D route maps and daily schedules.</p>
                </div>
              </div>
            </Link>

            {/* Destinations */}
            <Link href="/places" className="bento-anim tap glass-card relative overflow-hidden group">
              <img src={PLACE_IMAGES.ajanta} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700" alt="Ajanta" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <Compass size={24} className="text-purple-400 mb-3" />
                <h3 className="text-xl font-bold">Destinations</h3>
                <p className="text-sm text-muted mt-1">8 sacred & heritage spots.</p>
              </div>
            </Link>

            {/* Trains */}
            <Link href="/trains" className="bento-anim tap glass-card relative overflow-hidden group">
              <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-br from-indigo-900/40 to-transparent">
                <Train size={24} className="text-indigo-400 mb-3" />
                <h3 className="text-xl font-bold">Train Info</h3>
                <p className="text-sm text-muted mt-1">Schedules & Boarding passes.</p>
              </div>
            </Link>

            {/* Hotels */}
            <Link href="/hotels" className="bento-anim tap glass-card relative overflow-hidden group">
              <img src={PLACE_IMAGES.hotel} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700" alt="Hotel" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <Hotel size={24} className="text-orange-400 mb-3" />
                <h3 className="text-xl font-bold">Stays</h3>
                <p className="text-sm text-muted mt-1">5 Premium accommodations.</p>
              </div>
            </Link>

            {/* Expenses (Wide Box) */}
            <Link href="/expenses" className="bento-anim tap glass-card md:col-span-2 relative overflow-hidden group">
              <div className="absolute inset-0 p-8 flex flex-col justify-center bg-gradient-to-r from-emerald-900/20 to-transparent">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center backdrop-blur-md border border-emerald-500/30">
                    <Wallet size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Auto-Split Expenses</h3>
                </div>
                <p className="text-muted">Real-time ledger for Mitra & Ghosh families. Add expenses and let the app split them perfectly.</p>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ── FAMILY SECTION ── */}
      <section className="py-24 border-t border-[var(--border-glass)] relative overflow-hidden">
        <div className="container-wide text-center">
          <h2 className="heading-section mb-12">The Travelers</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {TRIP_CONFIG.families.map((f) => (
              <div key={f.id} className="glass-card p-8 flex flex-col items-center w-64">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mb-4 shadow-xl shadow-[color:var(--shadow-color)]"
                  style={{ background: f.color, '--shadow-color': `${f.color}40` } as React.CSSProperties}
                >
                  {f.avatar}
                </div>
                <h3 className="text-lg font-bold">{f.family}</h3>
                <p className="text-muted text-sm mt-1">Head: {f.head}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
