'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, FileText, IndianRupee, ShieldAlert, User } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Home', path: '/', exact: true },
  { name: 'Itinerary', path: '/itinerary' },
  { name: 'Places', path: '/places' },
  { name: 'Vault', path: '/vault' },
  { name: 'Ledger', path: '/expenses' },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:block fixed top-0 left-0 w-full z-50 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] transition-all h-[var(--nav-height)]">
      <div className="inner h-full flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--text-primary)] text-[var(--bg)] flex items-center justify-center font-bold">
            M
          </div>
          <span className="font-bold text-[var(--text-primary)] tracking-tight">MYTRAVEL</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact 
              ? pathname === item.path 
              : pathname?.startsWith(item.path);
              
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`text-sm font-semibold transition-colors ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Profile / Contextual */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 rounded-full hover:bg-[var(--surface-2)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <ShieldAlert size={20} />
          </Link>
          <div className="flex items-center gap-2 pl-4 border-l border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-[var(--text-primary)]">
              <User size={16} />
            </div>
            <span className="text-sm font-bold text-[var(--text-primary)]">Family</span>
          </div>
        </div>

      </div>
    </div>
  );
}
