'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Menu, X, LogIn, LogOut, ChevronDown, Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTrip } from '@/context/TripContext';

export default function TopNavbar() {
  const { user, openLoginModal } = useAuth();
  const { trips, activeTrip, activeTripId, switchActiveTrip } = useTrip();
  const [isOpen, setIsOpen] = useState(false);
  const [isTripMenuOpen, setIsTripMenuOpen] = useState(false);
  const tripMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tripMenuRef.current && !tripMenuRef.current.contains(event.target as Node)) {
        setIsTripMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[var(--bg-color)] border-b-2 border-[var(--border-color)] transition-colors duration-300">
        <div className="container-wide flex items-center justify-between h-20">
          
          {/* LOGO & ACTIVE TRIP METADATA */}
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center gap-3 brutal-btn hover:translate-y-0 hover:translate-x-0 text-[var(--text-primary)]" 
              style={{ padding: '8px 16px', boxShadow: 'none' }}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-[var(--accent)] border-2 border-[var(--border-color)] transition-colors duration-300">
                <Compass size={18} color="#FFF" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base sm:text-lg tracking-tighter uppercase leading-tight line-clamp-1 max-w-[200px] sm:max-w-[260px] text-[var(--text-primary)]">
                  {activeTrip.title}
                </span>
              </div>
            </Link>

            {/* Tactical Status Pill */}
            <div className="hidden xl:flex items-center gap-2 pl-2 border-l-2 border-[var(--border-color)]/20">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--accent)] text-white text-[10px] font-mono font-black tracking-widest border-2 border-[var(--border-color)] uppercase shadow-[2px_2px_0px_0px_var(--shadow-color)]">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                ACTIVE DEPLOYMENT
              </span>
              {activeTrip.start_date && (
                <span className="font-mono text-[11px] text-[var(--text-muted)] font-bold uppercase">
                  [{activeTrip.start_date}]
                </span>
              )}
            </div>
          </div>
          
          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-mono font-bold text-sm tracking-wider uppercase text-[var(--text-primary)]">
            <Link href="/itinerary" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Route</Link>
            <Link href="/places" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Sites</Link>
            <Link href="/hotels" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Stays</Link>
            <Link href="/trains" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Logistics</Link>
            <Link href="/vault" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Vault</Link>
            <Link href="/photos" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Photos</Link>
            {user?.role === 'FAMILY_HEAD' && (
              <Link href="/expenses" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Ledger</Link>
            )}
          </div>

          {/* DESKTOP CTA & TRIP QUICK SWITCHER */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Quick Trip Switcher Pill */}
            <div className="relative" ref={tripMenuRef}>
              <button
                onClick={() => setIsTripMenuOpen(!isTripMenuOpen)}
                className="px-3 py-1.5 bg-[var(--surface-light)] text-[var(--text-primary)] border-2 border-[var(--border-color)] text-xs font-mono font-bold uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--shadow-color)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                title="Switch active fleet deployment"
              >
                <Globe size={14} className="text-[var(--accent)]" />
                <span className="max-w-[120px] truncate">{activeTrip.slug}</span>
                <ChevronDown size={14} className={`transition-transform ${isTripMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Trip Switcher Dropdown */}
              <AnimatePresence>
                {isTripMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 bg-[var(--surface-light)] text-[var(--text-primary)] border-2 border-[var(--border-color)] p-3 shadow-[6px_6px_0px_0px_var(--accent)] z-50"
                  >
                    <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest pb-2 mb-2 border-b border-[var(--border-color)]/20">
                      FLEET DEPLOYMENTS ({trips.length})
                    </div>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto">
                      {trips.map(t => {
                        const isCurrent = t.id === activeTripId;
                        return (
                          <button
                            key={t.id}
                            onClick={() => {
                              switchActiveTrip(t.id);
                              setIsTripMenuOpen(false);
                            }}
                            className={`w-full text-left p-2 border flex items-center justify-between text-xs font-mono transition-all ${
                              isCurrent
                                ? 'border-[var(--accent)] bg-[var(--accent)] text-white font-black'
                                : 'border-[var(--border-color)]/20 text-[var(--text-primary)] hover:border-[var(--border-color)] font-bold hover:bg-[var(--accent-light)]'
                            }`}
                          >
                            <span className="truncate pr-2">{t.title}</span>
                            {isCurrent && <Check size={14} className="flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                    {user?.role === 'FAMILY_HEAD' && (
                      <div className="pt-2.5 mt-2 border-t border-[var(--border-color)]/20">
                        <Link
                          href="/admin"
                          onClick={() => setIsTripMenuOpen(false)}
                          className="w-full block text-center py-1.5 bg-[var(--bg-color)] text-[var(--text-primary)] border border-[var(--border-color)] text-[11px] font-mono font-black uppercase hover:bg-[var(--accent)] hover:text-white transition-colors"
                        >
                          + Manage / Deploy in Admin
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Block */}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase">
                  {user.role === 'FAMILY_HEAD' ? 'FAMILY HEAD' : user.name}
                </span>
                <button 
                  onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.reload(); }} 
                  className="hover:text-[var(--accent)] transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button onClick={openLoginModal} className="brutal-btn brutal-btn-accent text-xs flex items-center gap-2">
                <LogIn size={16} /> Login
              </button>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="lg:hidden flex items-center justify-center w-12 h-12 bg-[var(--surface-light)] text-[var(--text-primary)] border-2 border-[var(--border-color)] shadow-[4px_4px_0px_0px_var(--shadow-color)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all z-[60]"
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </nav>

      {/* MOBILE FULLSCREEN OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-[55] bg-[var(--accent)] flex flex-col pt-24 pb-8 px-6 overflow-y-auto"
          >
            {/* Active Trip Badge for Mobile */}
            <div className="bg-black text-white p-4 border-2 border-white mb-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-widest uppercase mb-1 text-zinc-400">
                <span>Active Deployment</span>
                <span className="text-[var(--accent)]">● ONLINE</span>
              </div>
              <div className="text-xl font-black uppercase truncate">{activeTrip.title}</div>
              <div className="text-xs font-mono text-zinc-400 mt-1">
                {activeTrip.start_date || 'TBD'} → {activeTrip.end_date || 'TBD'}
              </div>

              {/* Mobile Quick Switcher if > 1 trips */}
              {trips.length > 1 && (
                <div className="mt-3 pt-3 border-t border-zinc-800 flex flex-wrap gap-2">
                  {trips.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        switchActiveTrip(t.id);
                        toggleMenu();
                      }}
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase border ${
                        t.id === activeTripId
                          ? 'border-white bg-white text-black'
                          : 'border-zinc-700 bg-zinc-900 text-zinc-300'
                      }`}
                    >
                      {t.slug}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6 text-white font-black text-3xl sm:text-4xl uppercase tracking-tighter">
              <Link href="/" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4">Home</Link>
              <Link href="/itinerary" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4">Route Plan</Link>
              <Link href="/places" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4">Destinations</Link>
              <Link href="/hotels" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4">Hotels & Stays</Link>
              <Link href="/trains" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4">Train Tickets</Link>
              <Link href="/vault" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4">Secure Vault</Link>
              <Link href="/photos" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4">Photos Gallery</Link>
              {user?.role === 'FAMILY_HEAD' && (
                <Link href="/expenses" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4 text-black">Auto Ledger</Link>
              )}
            </div>
            
            <div className="mt-auto pt-8">
              <div className="bg-black text-white p-4 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex justify-between items-center">
                <span className="font-mono text-xs font-bold uppercase">
                  {user ? (user.role === 'FAMILY_HEAD' ? 'FAMILY HEAD' : user.name) : 'GUEST SESSION'}
                </span>
                {user ? (
                  <button 
                    onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.reload(); }}
                    className="font-mono text-xs font-bold uppercase underline"
                  >
                    Logout
                  </button>
                ) : (
                  <button onClick={() => { toggleMenu(); openLoginModal(); }} className="font-mono text-xs font-bold uppercase underline">
                    Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
