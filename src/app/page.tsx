'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, CloudSun, Calendar, Navigation, 
  Coffee, Map, Camera, UtensilsCrossed, Hotel, Plus, User 
} from 'lucide-react';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import BottomSheet from '@/components/ui/BottomSheet';
import TactileButton from '@/components/ui/TactileButton';

export default function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="pt-safe pb-24 relative min-h-screen">
      {/* ── EDITORIAL BACKGROUND ── */}
      <div 
        className="absolute inset-0 z-[-1] opacity-[0.85] dark:opacity-30 pointer-events-none mix-blend-multiply dark:mix-blend-screen"
        style={{
          backgroundImage: 'url(/destinations/hero_map.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 z-[-1] pointer-events-none bg-gradient-to-b from-[var(--bg)]/40 via-[var(--bg)]/80 to-[var(--bg)]" />

      
      {/* ── HEADER GREETING ── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-6 pb-4 flex justify-between items-start"
      >
        <div>
          <div className="label-sm mb-1">Good Morning, Mitra & Ghosh</div>
          <h1 className="heading-xl">Maharashtra Journey</h1>
        </div>
        <button 
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/auth/login';
          }}
          className="w-10 h-10 bg-[var(--surface-2)] rounded-full flex items-center justify-center text-[var(--text-secondary)] shadow-sm border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] tap-effect"
        >
          <User size={16} />
        </button>
      </motion.div>

      <div className="inner space-y-8">

        {/* ── HERO TRIP CARD ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative h-[420px] rounded-[32px] overflow-hidden mat-elevated"
        >
          {/* Cinematic Image */}
          <img 
            src="/destinations/dest_ellora.jpg" 
            alt="Maharashtra Journey" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 cinematic-overlay" />

          {/* Card Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="mat-glass px-4 py-2 rounded-full flex items-center gap-2">
                <span className="font-bold text-white text-xs tracking-wider">DAY 4 OF 11</span>
              </div>
              <div className="mat-glass px-3 py-2 rounded-2xl flex flex-col items-center">
                <CloudSun size={18} className="text-white mb-1" />
                <span className="font-bold text-white text-xs">28°</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <MapPin size={16} className="text-[var(--accent-secondary)]" />
                <span className="text-sm font-bold uppercase tracking-widest">Aurangabad</span>
              </div>
              <h2 className="heading-display text-white mb-6" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                Ajanta Caves Expedition
              </h2>

              {/* Progress Line */}
              <div className="mat-glass p-4 rounded-2xl">
                <div className="flex justify-between text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                  <span>Howrah</span>
                  <span className="text-[var(--accent-secondary)]">Aurangabad</span>
                  <span className="opacity-50">Mumbai</span>
                </div>
                <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-[45%] bg-[var(--accent-secondary)] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── COMPACT MAP MODULE ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="heading-lg">Live Tracker</h3>
            <button className="text-[var(--accent-secondary)] font-bold text-sm flex items-center gap-1">
              Open Map <Navigation size={14} />
            </button>
          </div>

          <div className="mat-paper p-4 flex gap-4 items-center">
            <div className="w-20 h-20 shrink-0 rounded-[20px] bg-[var(--surface-3)] overflow-hidden relative border border-white/5">
              {/* Map placeholder */}
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover opacity-60" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[var(--accent-secondary)] rounded-full shadow-[0_0_12px_var(--accent-secondary)]" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="label-sm mb-1 truncate">Current Location</div>
              <div className="font-bold text-base text-[var(--text-primary)] mb-2 truncate">En Route to Ellora</div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                <Navigation size={12} className="shrink-0" /> <span className="truncate">45 mins remaining</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── VERTICAL JOURNAL TIMELINE ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="heading-lg mb-6 px-2">Today&apos;s Journal</h3>

          <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[35px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--accent)] before:via-[var(--surface-3)] before:to-transparent">
            
            {/* Timeline Item 1 */}
            <div className="relative flex items-start gap-6">
              <div className="absolute left-[-2px] w-6 h-6 rounded-full bg-[var(--bg)] border-4 border-[var(--accent)] z-10 shadow-[0_0_12px_rgba(255,90,54,0.4)]" />
              <div className="flex-1 mat-paper p-5 transition-transform active:scale-95">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-black text-lg text-[var(--text-primary)]">09:00</div>
                  <div className="mat-inset w-8 h-8 flex items-center justify-center rounded-xl text-[var(--accent)]">
                    <Coffee size={14} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="font-bold text-[var(--text-primary)] mb-1">Ajanta Caves Exploration</div>
                <div className="text-xs font-semibold text-[var(--text-secondary)]">Guided tour. Wear comfortable walking shoes.</div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full border-[3px] border-[var(--surface-3)] z-10 bg-[var(--bg)]" />
              </div>
              <div className="flex-1 pb-6">
                <div className="text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase mb-1">14:00</div>
                <div className="mat-paper p-4 border border-[rgba(255,160,0,0.2)] bg-[rgba(255,160,0,0.02)]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-[#FFA000]">
                      <UtensilsCrossed size={16} />
                    </div>
                    <div className="text-[10px] font-bold text-[#FFA000] uppercase tracking-wider">Lunch</div>
                  </div>
                  <div className="font-bold text-[var(--text-primary)] mb-1">MTDC Restaurant</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-[var(--surface-3)] z-10 ring-4 ring-[var(--bg)]" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase mb-1">15:00</div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-secondary)]">
                    <Navigation size={14} />
                  </div>
                </div>
                <div className="font-bold text-[var(--text-primary)] mb-1">Drive to Aurangabad</div>
                <div className="text-xs font-semibold text-[var(--text-secondary)]">Ellora Cave 16 is the world&apos;s largest monolithic excavation.</div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>

      {/* FAB */}
      <FloatingActionButton 
        icon={<Plus size={24} />} 
        onClick={() => setSheetOpen(true)} 
      />

      {/* Bottom Sheet */}
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Quick Action">
        <div className="grid grid-cols-2 gap-4">
          <TactileButton variant="secondary" className="flex-col h-24 gap-3">
            <Camera size={24} /> Add Memory
          </TactileButton>
          <TactileButton variant="secondary" className="flex-col h-24 gap-3 text-[var(--accent)]">
            <MapPin size={24} /> Check In
          </TactileButton>
          <TactileButton variant="secondary" className="flex-col h-24 gap-3 col-span-2">
            <Plus size={24} /> Custom Event
          </TactileButton>
        </div>
      </BottomSheet>

    </div>
  );
}
