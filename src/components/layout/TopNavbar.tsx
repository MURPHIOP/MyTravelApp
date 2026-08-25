'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Menu, X, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function TopNavbar() {
  const { user, openLoginModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[var(--bg-color)] border-b-2 border-[var(--border-color)]">
        <div className="container-wide flex items-center justify-between h-20">
          
          {/* LOGO */}
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 brutal-btn hover:translate-y-0 hover:translate-x-0" style={{ padding: '8px 16px', boxShadow: 'none' }}>
            <div className="flex items-center justify-center w-8 h-8 bg-[var(--accent)] border-2 border-[var(--border-color)]">
              <Compass size={18} color="#FFF" />
            </div>
            <span className="font-black text-lg tracking-tighter uppercase">Maharashtra v2</span>
          </Link>
          
          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-8 text-mono font-bold text-sm tracking-wider uppercase">
            <Link href="/itinerary" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Route</Link>
            <Link href="/places" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Sites</Link>
            <Link href="/hotels" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Stays</Link>
            <Link href="/trains" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Logistics</Link>
            <Link href="/vault" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Vault</Link>
            {user?.role === 'FAMILY_HEAD' && (
              <Link href="/expenses" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Ledger</Link>
            )}
          </div>

          {/* DESKTOP CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase">{user.name}</span>
                <button onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.reload(); }} className="hover:text-[var(--accent)] transition-colors">
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
            className="lg:hidden flex items-center justify-center w-12 h-12 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all z-[60]"
            onClick={toggleMenu}
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
            <div className="flex flex-col gap-6 text-white font-black text-4xl uppercase tracking-tighter mt-8">
              <Link href="/" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4">Home</Link>
              <Link href="/itinerary" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4">Route Plan</Link>
              <Link href="/places" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4">Destinations</Link>
              <Link href="/hotels" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4">Hotels & Stays</Link>
              <Link href="/trains" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4">Train Tickets</Link>
              <Link href="/vault" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4">Secure Vault</Link>
              {user?.role === 'FAMILY_HEAD' && (
                <Link href="/expenses" onClick={toggleMenu} className="hover:pl-4 transition-all border-b-2 border-white/20 pb-4 text-black">Auto Ledger</Link>
              )}
            </div>
            
            <div className="mt-auto pt-12">
              <div className="bg-black text-white p-6 border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                <div className="font-mono text-xs font-bold uppercase mb-2">System Status</div>
                <div className="text-xl font-black uppercase">Online // Mobile Mode</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
