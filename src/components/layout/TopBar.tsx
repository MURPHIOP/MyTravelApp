'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { Sun, Moon, Bell, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/itinerary': 'Journey',
  '/trains': 'Trains',
  '/hotels': 'Hotels',
  '/expenses': 'Expenses',
  '/places': 'Explore',
  '/profile': 'Profile',
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
          ? 'transparent'
          : 'var(--surface)',
        backdropFilter: isHome ? 'none' : 'blur(24px)',
        WebkitBackdropFilter: isHome ? 'none' : 'blur(24px)',
        borderBottom: isHome ? 'none' : '1px solid var(--border)',
      }}
    >
      {/* Location + Title */}
      <div>
        <div
          className="flex items-center gap-1 mb-0.5"
          style={{ color: isHome ? 'rgba(255,255,255,0.7)' : 'var(--accent)' }}
        >
          <MapPin size={10} strokeWidth={2.5} />
          <span className="label-sm" style={{ color: 'inherit', textTransform: 'none', fontSize: 9 }}>
            Maharashtra Tour
          </span>
        </div>
        <div
          className="heading-md"
          style={{
            fontSize: '1.05rem',
            color: isHome ? '#fff' : 'var(--text-primary)',
          }}
        >
          {label}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          id="notif-btn"
          className="btn-icon btn relative tap"
          aria-label="Notifications"
          style={{ background: isHome ? 'rgba(255,255,255,0.12)' : undefined, border: isHome ? '1px solid rgba(255,255,255,0.15)' : undefined }}
        >
          <Bell size={17} strokeWidth={1.8} color={isHome ? '#fff' : undefined} />
          <span
            className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#EF4444', border: '1.5px solid var(--surface)' }}
          />
        </button>

        <button
          id="theme-toggle-topbar"
          onClick={toggleTheme}
          className="btn-icon btn tap"
          aria-label="Toggle theme"
          style={{
            background: isHome ? 'rgba(255,255,255,0.12)' : undefined,
            border: isHome ? '1px solid rgba(255,255,255,0.15)' : undefined,
            color: isHome ? '#fff' : undefined,
          }}
        >
          {isDark
            ? <Sun size={17} strokeWidth={1.8} style={{ color: '#F59E0B' }} />
            : <Moon size={17} strokeWidth={1.8} />
          }
        </button>
      </div>
    </header>
  );
}
