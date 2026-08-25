import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function TopNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--bg-color)] border-b-2 border-[var(--border-color)]">
      <div className="container-wide flex items-center justify-between h-20">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 brutal-btn hover:translate-y-0 hover:translate-x-0" style={{ padding: '8px 16px', boxShadow: 'none' }}>
          <div className="flex items-center justify-center w-8 h-8 bg-[var(--accent)] border-2 border-[var(--border-color)]">
            <Compass size={18} color="#FFF" />
          </div>
          <span className="font-black text-lg tracking-tighter uppercase">Maharashtra v2</span>
        </Link>
        
        {/* LINKS */}
        <div className="hidden md:flex items-center gap-8 text-mono font-bold text-sm tracking-wider uppercase">
          <Link href="/itinerary" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Route</Link>
          <Link href="/places" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Sites</Link>
          <Link href="/hotels" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Stays</Link>
          <Link href="/trains" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Logistics</Link>
          <Link href="/expenses" className="hover:text-[var(--accent)] hover:underline decoration-2 transition-colors">Ledger</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Link href="/itinerary" className="brutal-btn brutal-btn-accent text-xs">
            Start Journey
          </Link>
        </div>

      </div>
    </nav>
  );
}
