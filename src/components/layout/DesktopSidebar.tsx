'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeProvider';
import {
  Home, MapPin, Train, Hotel, Wallet, Compass,
  Sun, Moon, Plane, User, Lock
} from 'lucide-react';

const NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/itinerary', label: 'Journey Map', icon: MapPin },
  { href: '/trains', label: 'Trains', icon: Train },
  { href: '/hotels', label: 'Hotels', icon: Hotel },
  { href: '/expenses', label: 'Expenses', icon: Wallet },
  { href: '/places', label: 'Explore Places', icon: Compass },
  { href: '/profile', label: 'My Profile', icon: User },
];

export default function DesktopSidebar() {
  const pathname = usePathname() ?? '/';
  const { toggleTheme, isDark } = useTheme();

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 z-50 hidden md:flex flex-col"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div
          className="flex items-center justify-center w-11 h-11 rounded-2xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)', boxShadow: '0 8px 24px rgba(59,130,246,0.4)' }}
        >
          <Plane size={19} color="#fff" strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            MyTravelApp
          </div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.02em' }}>
            Mitra &amp; Ghosh Family
          </div>
        </div>
      </div>

      <div className="divider mx-4 mb-3" />

      <p className="label-sm px-6 mb-2">Menu</p>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-2xl tap transition-all duration-200"
              style={{
                background: active ? 'var(--accent-light)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: active ? 700 : 500,
                fontSize: '0.875rem',
              }}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-xl"
                style={{ background: active ? 'var(--accent-light)' : 'transparent' }}
              >
                <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              {label}
              {active && (
                <div className="ml-auto w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 pt-2 flex flex-col gap-2">
        <div className="divider mb-2" />

        <Link
          href="/auth/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-2xl tap"
          style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-xl" style={{ background: 'var(--accent-light)' }}>
            <Lock size={15} style={{ color: 'var(--accent)' }} />
          </div>
          Family Head Login
        </Link>

        <button
          id="sidebar-theme-btn"
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-2xl tap w-full"
          style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-xl">
            {isDark
              ? <Sun size={15} style={{ color: '#F59E0B' }} />
              : <Moon size={15} />
            }
          </div>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </aside>
  );
}
