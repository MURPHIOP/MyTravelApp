'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, Compass, User, CreditCard, ShieldAlert } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/admin', label: 'Admin', icon: ShieldAlert },
  { href: '/vault', label: 'Vault', icon: CreditCard },
  { href: '/expenses', label: 'Expenses', icon: Wallet },
  { href: '/places', label: 'Explore', icon: Compass },
];

export default function BottomNav() {
  const pathname = usePathname() ?? '/';

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div
        className="flex items-center justify-between px-2 py-2 neu-convex"
        style={{ height: '76px', borderRadius: '38px' }}
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center flex-1 h-full rounded-[28px] transition-all duration-300"
              style={{
                boxShadow: active ? 'var(--neu-pressed)' : 'none',
                background: active ? 'var(--surface)' : 'transparent',
                color: active ? 'var(--accent-cyan)' : 'var(--text-muted)',
              }}
            >
              <div
                className="flex items-center justify-center w-12 h-8 rounded-full mb-0.5 transition-all duration-300"
                style={{
                  textShadow: active ? '0 0 10px rgba(0,240,255,0.6)' : 'none',
                  transform: active ? 'translateY(2px)' : 'translateY(0)',
                }}
              >
                <Icon 
                  size={ active ? 22 : 20 } 
                  strokeWidth={ active ? 2.5 : 2 } 
                  className={active ? 'neon-text-cyan' : ''} 
                />
              </div>
              <span 
                className={active ? 'neon-text-cyan' : ''}
                style={{ 
                  fontSize: '10px', 
                  fontWeight: active ? 800 : 600, 
                  lineHeight: 1,
                  transform: active ? 'translateY(2px)' : 'translateY(0)',
                  transition: 'transform 0.3s'
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
