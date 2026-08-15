'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShieldAlert, CreditCard, IndianRupee, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/admin', label: 'Control', icon: ShieldAlert },
  { href: '/vault', label: 'Vault', icon: CreditCard },
  { href: '/expenses', label: 'Ledger', icon: IndianRupee },
  { href: '/places', label: 'Explore', icon: Compass },
];

export default function FloatingNav() {
  const pathname = usePathname() ?? '/';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe pointer-events-none flex justify-center">
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.1 }}
        className="pointer-events-auto mat-glass rounded-[32px] mx-4 mb-4 px-2 py-2 flex items-center justify-between w-full max-w-[420px]"
        style={{ height: '72px' }}
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center flex-1 h-full rounded-[24px] transition-all duration-300 tap-effect"
            >
              {active && (
                <motion.div 
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white dark:bg-white/10 rounded-[24px]"
                  style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                <Icon 
                  size={20} 
                  strokeWidth={active ? 2.5 : 2} 
                  color={active ? 'var(--accent-secondary)' : 'var(--text-muted)'} 
                  className="transition-colors duration-300"
                />
                <span 
                  className="text-[10px] tracking-wide transition-all duration-300"
                  style={{ 
                    fontWeight: active ? 700 : 600, 
                    color: active ? 'var(--text-primary)' : 'var(--text-muted)' 
                  }}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
