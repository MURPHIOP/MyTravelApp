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
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe md:hidden"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="grid grid-cols-5 items-center"
        style={{ height: 'var(--nav-height)', padding: '4px 8px 0' }}
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl tap"
              style={{
                height: 56,
                color: active ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
                style={{
                  background: active ? 'var(--accent-light)' : 'transparent',
                  transform: active ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <Icon size={active ? 20 : 19} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span style={{ fontSize: '9.5px', fontWeight: active ? 800 : 500, lineHeight: 1 }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
