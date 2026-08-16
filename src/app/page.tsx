'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Compass as CompassIcon, Camera, Map } from 'lucide-react';
import Link from 'next/link';
import TactileButton from '@/components/ui/TactileButton';

export default function HomePage() {
  return (
    <div className="pb-safe relative w-full overflow-hidden">
      
      <main className="w-full">
        
        {/* ── 1. CINEMATIC HERO ── */}
        <section className="relative w-full h-[100dvh] flex flex-col justify-center">
          {/* Main Hero Photograph */}
          <motion.div 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img 
              src="/destinations/dest_ajanta.jpg" 
              alt="Ajanta Caves Maharashtra" 
              className="w-full h-full object-cover object-[center_30%]"
            />
            {/* Proper Cinematic Gradient for Typography Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
          </motion.div>

          {/* Hero Content Overlay */}
          <div className="relative z-10 w-full inner flex flex-col justify-end h-full pb-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <div className="text-eyebrow text-white/80 mb-6 flex items-center gap-2">
                STARTING POINT · AURANGABAD
              </div>
              
              <h1 className="text-title-main text-white mb-6">
                Ancient<br/>Maharashtra
              </h1>
              
              <p className="text-body text-white/80 mb-10 text-balance">
                An 11-day private expedition through monolithic temples, hidden caves, and the sacred Jyotirlingas.
              </p>

              <Link href="#journey">
                <TactileButton className="bg-white text-black hover:bg-white/90 shadow-xl px-8 py-4">
                  Explore the journey <ArrowRight size={18} className="ml-2" />
                </TactileButton>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── 2. THE JOURNEY ── */}
        <section id="journey" className="relative w-full py-24 lg:py-32 bg-[var(--bg)]">
          <div className="inner">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-title-section mb-12">The Grand Route</h2>
                
                <div className="flex flex-col gap-10">
                  <div className="border-l-2 border-[var(--accent)] pl-6">
                    <div className="text-title-card text-[var(--text-primary)] mb-2">11 Days</div>
                    <div className="text-body">Across the Western Ghats and Deccan Plateau.</div>
                  </div>
                  <div className="border-l-2 border-[var(--accent-secondary)] pl-6">
                    <div className="text-title-card text-[var(--text-primary)] mb-2">4 Cities</div>
                    <div className="text-body">Aurangabad, Ellora, Nashik, and Mumbai.</div>
                  </div>
                  <div className="border-l-2 border-[var(--accent-success)] pl-6">
                    <div className="text-title-card text-[var(--text-primary)] mb-2">9 Landmarks</div>
                    <div className="text-body">Including 3 Jyotirlingas and 2 UNESCO World Heritage sites.</div>
                  </div>
                </div>

                <p className="text-body mt-12 text-balance">
                  A carefully paced route through the architecture and spiritual history of Maharashtra.
                </p>
              </div>

              {/* Route Visualization Area */}
              <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square bg-[var(--surface-2)] rounded-[32px] overflow-hidden border border-[rgba(0,0,0,0.05)] flex items-center justify-center p-8">
                <div 
                  className="absolute inset-0 opacity-[0.15] dark:opacity-10 mix-blend-multiply dark:mix-blend-screen"
                  style={{
                    backgroundImage: 'url(/destinations/hero_map.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'contrast(1.2) sepia(1)'
                  }}
                />
                <Map className="w-32 h-32 text-[var(--text-muted)] opacity-20 relative z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. THE PLACES ── */}
        <section className="relative w-full py-24 lg:py-32 bg-[var(--surface)]">
          <div className="inner">
            <div className="flex justify-between items-end mb-16">
              <div>
                <div className="text-eyebrow mb-4">Featured Destinations</div>
                <h2 className="text-title-section">The Places</h2>
              </div>
              <Link href="/places" className="hidden md:flex items-center gap-2 text-sm font-bold text-[var(--accent)] hover:underline">
                View All Destinations <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Ellora Caves', img: 'dest_ellora.jpg', tag: 'UNESCO' },
                { name: 'Shirdi', img: 'dest_shirdi.jpg', tag: 'SPIRITUAL' },
                { name: 'Trimbakeshwar', img: 'dest_trimbakeshwar.jpg', tag: 'JYOTIRLINGA' },
              ].map((place, i) => (
                <Link href="/places" key={i}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] mb-6">
                      <img src={`/destinations/${place.img}`} alt={place.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                    <div className="text-eyebrow mb-2">{place.tag}</div>
                    <h3 className="text-title-card">{place.name}</h3>
                  </div>
                </Link>
              ))}
            </div>

            <Link href="/places" className="mt-12 md:hidden flex justify-center items-center gap-2 text-sm font-bold text-[var(--accent)]">
              View All Destinations <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ── 4. FAMILY TRAVEL SYSTEM ── */}
        <section className="relative w-full py-24 lg:py-32 bg-[var(--surface-2)]">
          <div className="inner">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-eyebrow mb-4">Operating System</div>
              <h2 className="text-title-section mb-6">Family Travel</h2>
              <p className="text-body text-balance">
                Everything you need for the journey. Your secure travel vault, shared expense ledger, and real-time itinerary.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Link href="/vault" className="block">
                <div className="mat-paper p-10 h-full hover:-translate-y-2 transition-transform cursor-pointer border border-[rgba(0,0,0,0.05)] flex flex-col justify-center text-center">
                  <h3 className="text-title-card mb-4">Vault</h3>
                  <p className="text-body">Secure access to all train tickets, hotel vouchers, and identification.</p>
                </div>
              </Link>

              <Link href="/expenses" className="block">
                <div className="mat-paper p-10 h-full hover:-translate-y-2 transition-transform cursor-pointer border border-[rgba(0,0,0,0.05)] flex flex-col justify-center text-center">
                  <h3 className="text-title-card mb-4">Ledger</h3>
                  <p className="text-body">Shared accounting for the Mitra and Ghosh families. Track every split.</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 5. CLOSING ── */}
        <section className="relative w-full py-32 lg:py-48 bg-black text-center flex flex-col items-center justify-center">
          <div className="absolute inset-0 opacity-40">
             <img src="/destinations/dest_nashik.jpg" alt="Nashik" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/60" />
          </div>
          
          <div className="relative z-10 inner">
            <h2 className="text-title-main text-white mb-8 max-w-4xl mx-auto">
              Your Journey Is Just Beginning.
            </h2>
            <div className="text-eyebrow text-white/60 tracking-widest">
              Ancient Maharashtra · 11 days · 4 cities
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
