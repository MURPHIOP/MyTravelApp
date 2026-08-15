'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeProvider';
import {
  Home, Wallet, Compass,
  Sun, Moon, Plane, User, Lock, CreditCard, ShieldAlert
} from 'lucide-react';

const NAV = [
  { href: '/', label: 'Home Dashboard', icon: Home },
  { href: '/admin', label: 'Control Center', icon: ShieldAlert },
  { href: '/vault', label: 'Document Vault', icon: CreditCard },
  { href: '/expenses', label: 'Budget & Splitter', icon: Wallet },
  { href: '/places', label: 'Encyclopedia', icon: Compass },
];

export default function DesktopSidebar() {
  const pathname = usePathname() ?? '/';
  const { toggleTheme, isDark } = useTheme();

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 z-50 hidden md:flex flex-col neu-flat"
      style={{
        width: 'var(--sidebar-width)',
        margin: '20px 0 20px 20px',
        borderRadius: '32px',
        border: 'none',
        height: 'calc(100vh - 40px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-4 px-6 py-8">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-[18px] flex-shrink-0 neu-convex"
        >
          <Plane size={24} className="neon-text-orange" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            MyTravelApp
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            Mitra &amp; Ghosh
          </div>
        </div>
      </div>

      <div className="mx-6 mb-6 h-px bg-white/5 opacity-10" />

      {/* Nav items */}
      <nav className="flex flex-col gap-3 px-6 flex-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${active ? 'neu-pressed' : ''}`}
              style={{
                color: active ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: active ? 800 : 600,
                fontSize: '0.95rem',
              }}
            >
              <div className="flex items-center justify-center w-6 h-6">
                <Icon size={20} strokeWidth={active ? 2.5 : 2} className={active ? 'neon-text-cyan' : ''} />
              </div>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-6 pb-8 pt-4 flex flex-col gap-4">
        
        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl neu-convex transition-all"
          style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 700 }}
        >
          <Lock size={18} className="neon-text-orange" />
          Head Login
        </Link>

        <button
          onClick={toggleTheme}
          className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl neu-convex transition-all w-full"
          style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 700 }}
        >
          {isDark
            ? <Sun size={18} className="neon-text-orange" />
            : <Moon size={18} />
          }
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </aside>
  );
}
