'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { Sun, Moon, Bell, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/itinerary': 'Journey Map',
  '/trains': 'Train Info',
  '/hotels': 'Hotels',
  '/expenses': 'Expenses',
  '/places': 'Explore Places',
  '/profile': 'My Profile',
};

export default function TopBar() {
  const { toggleTheme, isDark } = useTheme();
  const pathname = usePathname() ?? '/';
  const isHome = pathname === '/';
  const label = PAGE_LABELS[pathname] ?? 'MyTravelApp';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:hidden"
      style={{
        height: 'var(--header-height)',
        background: isHome
          ? 'linear-gradient(180deg, rgba(7,11,20,0.8) 0%, rgba(7,11,20,0) 100%)'
          : 'var(--glass-bg)',
        backdropFilter: isHome ? 'none' : 'blur(24px)',
        WebkitBackdropFilter: isHome ? 'none' : 'blur(24px)',
        borderBottom: isHome ? 'none' : '1px solid var(--border)',
      }}
    >
      {/* Location + Title */}
      <div>
        <div
          className="flex items-center gap-1.5 mb-0.5"
          style={{ color: isHome ? 'rgba(255,255,255,0.75)' : 'var(--accent)' }}
        >
          <MapPin size={11} strokeWidth={2.5} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}>
            Ancient Maharashtra Tour
          </span>
        </div>
        <div
          style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: isHome ? '#FFFFFF' : 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          {label}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          id="theme-toggle-topbar"
          onClick={toggleTheme}
          className="btn-icon btn tap"
          aria-label="Toggle theme"
          style={{
            background: isHome ? 'rgba(255,255,255,0.16)' : 'var(--surface-2)',
            border: isHome ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border)',
            color: isHome ? '#fff' : 'var(--text-primary)',
          }}
        >
          {isDark
            ? <Sun size={18} strokeWidth={2} style={{ color: '#F59E0B' }} />
            : <Moon size={18} strokeWidth={2} style={{ color: '#3B82F6' }} />
          }
        </button>
      </div>
    </header>
  );
}
