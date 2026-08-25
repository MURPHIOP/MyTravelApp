'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, MapPin, Train, Hotel, Wallet, Compass } from 'lucide-react';
import { PLACE_IMAGES, TRIP_CONFIG } from '@/lib/tripData';
import ScrambleText from '@/components/ui/ScrambleText';
import BrutalistMarquee from '@/components/ui/BrutalistMarquee';

export default function HomePage() {
  const headlineWords = ["ANCIENT.", "SACRED.", "JOURNEY."];
  const lastWord = "MAHARASHTRA.";

  return (
    <div className="w-full">
      {/* ── BRUTALIST HERO SECTION ── */}
      <section className="relative min-h-[90vh] w-full flex flex-col items-center justify-center pt-24 pb-32 overflow-hidden bg-grid">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

        <div className="container-wide relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT COLUMN: Copy & CTAs */}
          <div className="flex flex-col items-start text-left order-1 pt-10 lg:pt-0">
            
            <div className="border-2 border-[var(--border-color)] px-3 py-1 mb-10 bg-white inline-flex items-center gap-2 shadow-[4px_4px_0px_0px_var(--shadow-color)]">
              <div className="w-3 h-3 bg-[var(--accent)] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest font-black">System Ready</span>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-mono text-[var(--accent)] tracking-[0.2em] text-sm font-black uppercase"
              >
                Mitra & Ghosh Families // Fall 2026
              </motion.div>
              
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase flex flex-col">
                {headlineWords.map((word, i) => (
                  <ScrambleText key={i} text={word} delay={1.2 + i * 0.4} />
                ))}
                <span className="text-[var(--accent)]">
                  <ScrambleText text={lastWord} delay={1.2 + headlineWords.length * 0.4} />
                </span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-lg sm:text-xl font-mono leading-[1.6] tracking-wide mt-8 border-l-4 border-[var(--accent)] pl-6 bg-white/40 p-4 border-y-2 border-r-2 border-r-transparent border-y-transparent"
            >
              A robust command center for our 11-day private journey. Exploring 3 Jyotirlingas, UNESCO heritage caves, and sacred destinations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-stretch gap-6 pt-10 w-full sm:w-auto"
            >
              <Link href="/itinerary" className="brutal-btn brutal-btn-accent group gap-3">
                <Terminal className="w-5 h-5" />
                Init Route
              </Link>
              <Link href="/places" className="brutal-btn group gap-3">
                Browse Sites
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Visual Anchor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="order-2 w-full flex justify-center lg:justify-end"
          >
             <div className="relative w-full aspect-square max-w-[500px] bg-white border-4 border-[var(--border-color)] p-6 flex flex-col shadow-[12px_12px_0px_0px_var(--shadow-color)] transform rotate-1 hover:rotate-0 transition-transform">
               
               <div className="flex justify-between items-center border-b-4 border-[var(--border-color)] pb-4 mb-4">
                 <span className="font-mono text-sm font-black uppercase tracking-widest">Map Viewer v1.0</span>
                 <div className="w-4 h-4 rounded-full bg-[var(--accent)]" />
               </div>
               
               <div className="flex-1 border-2 border-[var(--border-color)] relative overflow-hidden flex items-center justify-center">
                  <img src={PLACE_IMAGES.ellora} className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125" alt="Hero Art" />
                  <div className="absolute inset-0 bg-[var(--accent)] mix-blend-color opacity-50" />
                  <div className="absolute inset-0 grid-bg opacity-30" />
                  
                  <div className="z-10 bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Compass className="animate-spin-slow w-12 h-12 text-[var(--accent)]" />
                  </div>
               </div>
               
               <div className="mt-4 pt-4 border-t-4 border-[var(--border-color)] flex justify-between font-mono text-xs uppercase tracking-widest font-bold">
                  <span>GPS: 19.896, 75.319</span>
                  <span>ONLINE</span>
               </div>
             </div>
          </motion.div>
          
        </div>

        {/* INFINITE MARQUEE */}
        <div className="absolute bottom-10 -left-[5%] w-[110%] z-20 rotate-[-1.5deg] transform-gpu">
          <BrutalistMarquee 
            items={[
              "3 JYOTIRLINGAS",
              "11 DAYS",
              "UNESCO CAVES",
              "MITRA & GHOSH",
              "AUTO-SPLIT EXPENSES"
            ]}
            speed={35}
            className="shadow-[0_8px_0_0_rgba(28,25,23,0.3)] text-xl"
          />
        </div>
      </section>

      {/* ── BENTO GRID HUB ── */}
      <section className="py-32">
        <div className="container-wide">
          <div className="mb-16 border-b-4 border-[var(--border-color)] pb-8 flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h2 className="heading-section">Mission Control</h2>
              <p className="font-mono mt-4 font-bold uppercase tracking-widest text-[var(--accent)]">Select Module</p>
            </div>
            <div className="mt-6 md:mt-0 font-mono text-xl font-black bg-white border-2 border-[var(--border-color)] px-4 py-2 shadow-[4px_4px_0px_0px_var(--shadow-color)]">
              TOTAL: 5 MODULES
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-[320px]">
            
            {/* Itinerary */}
            <Link href="/itinerary" className="brutal-card md:col-span-2 md:row-span-2 relative overflow-hidden group p-8 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <img src={PLACE_IMAGES.ajanta} className="w-full h-full object-cover grayscale opacity-20 group-hover:scale-105 transition-transform duration-700" alt="Ajanta" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 border-4 border-[var(--border-color)] bg-[var(--accent)] text-white flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_var(--shadow-color)] group-hover:translate-x-2 transition-transform">
                  <MapPin size={32} />
                </div>
              </div>
              <div className="relative z-10 bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_var(--accent)] group-hover:shadow-[12px_12px_0px_0px_var(--accent)] transition-all">
                <h3 className="text-3xl font-black mb-2 uppercase">11-Day Route Plan</h3>
                <p className="font-mono text-sm font-bold">EXECUTE TIMELINE SEQUENCE</p>
              </div>
            </Link>

            {/* Destinations */}
            <Link href="/places" className="brutal-card p-6 flex flex-col justify-between group bg-[#FFEDD5]">
              <Compass size={40} className="text-[var(--accent)]" />
              <div>
                <h3 className="text-2xl font-black uppercase border-b-2 border-black pb-2 mb-2 group-hover:pl-2 transition-all">Destinations</h3>
                <p className="font-mono text-xs font-bold uppercase tracking-widest">8 Sacred Sites</p>
              </div>
            </Link>

            {/* Trains */}
            <Link href="/trains" className="brutal-card p-6 flex flex-col justify-between group bg-white">
              <Train size={40} className="text-[var(--border-color)]" />
              <div>
                <h3 className="text-2xl font-black uppercase border-b-2 border-black pb-2 mb-2 group-hover:pl-2 transition-all">Train Info</h3>
                <p className="font-mono text-xs font-bold uppercase tracking-widest">Boarding Passes</p>
              </div>
            </Link>

            {/* Hotels */}
            <Link href="/hotels" className="brutal-card p-6 flex flex-col justify-between group bg-[var(--text-primary)] text-white border-[var(--text-primary)] shadow-[4px_4px_0px_0px_var(--accent)]">
              <Hotel size={40} className="text-[var(--accent)]" />
              <div>
                <h3 className="text-2xl font-black uppercase border-b-2 border-white pb-2 mb-2 group-hover:pl-2 transition-all">Stays</h3>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--accent)]">5 Accommodations</p>
              </div>
            </Link>

            {/* Expenses */}
            <Link href="/expenses" className="brutal-card lg:col-span-2 p-8 flex flex-col justify-center group bg-[#ECFCCB]">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-16 h-16 border-4 border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_var(--border-color)]">
                  <Wallet size={32} />
                </div>
                <h3 className="text-3xl font-black uppercase underline decoration-[var(--accent)] decoration-4 underline-offset-8 group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                  Auto-Split Ledger
                </h3>
              </div>
              <p className="font-mono text-sm font-bold border-l-4 border-black pl-4 py-2 mt-4">
                Real-time synchronization of shared expenses between families.
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* ── FAMILY SECTION ── */}
      <section className="py-24 border-t-[4px] border-black bg-white">
        <div className="container-wide text-center">
          <h2 className="heading-section mb-16">The Travelers</h2>
          <div className="flex flex-wrap justify-center gap-12">
            {TRIP_CONFIG.families.map((f) => (
              <div key={f.id} className="brutal-card p-8 flex flex-col items-center w-72 hover:-translate-y-4 transition-transform duration-300">
                <div 
                  className="w-24 h-24 border-4 border-black flex items-center justify-center text-3xl font-black mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  style={{ background: f.color }}
                >
                  {f.avatar}
                </div>
                <h3 className="text-2xl font-black uppercase mb-2">{f.family}</h3>
                <div className="bg-black text-white px-4 py-1 font-mono text-xs font-bold uppercase w-full border-2 border-black">
                  CMD: {f.head}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
