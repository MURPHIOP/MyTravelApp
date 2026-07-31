'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, Wallet, Compass, User } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/itinerary', label: 'Journey', icon: MapPin },
  { href: '/expenses', label: 'Expenses', icon: Wallet },
  { href: '/places', label: 'Explore', icon: Compass },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname() ?? '/';

  return (
    <nav
      className="fixed bottom-3 left-3 right-3 z-50 md:hidden"
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'blur(28px) saturate(200%)',
        WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        borderRadius: 28,
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <div
        className="grid grid-cols-5 items-center px-2 py-1.5"
        style={{ height: 64 }}
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl tap"
              style={{
                height: 52,
                color: active ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              <div
                className="flex items-center justify-center w-10 h-8 rounded-full transition-all duration-300"
                style={{
                  background: active ? 'var(--accent-light)' : 'transparent',
                  transform: active ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                <Icon size={ active ? 20 : 19 } strokeWidth={ active ? 2.5 : 1.8 } />
              </div>
              <span style={{ fontSize: '10px', fontWeight: active ? 800 : 600, lineHeight: 1 }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
