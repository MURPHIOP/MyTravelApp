import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function TopNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div 
        className="container-wide glass-card px-6 py-4 flex items-center justify-between"
        style={{ borderRadius: '999px', padding: '16px 32px' }}
      >
        <Link href="/" className="flex items-center gap-3 tap">
          <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)' }}>
            <Compass size={20} color="#FFF" />
          </div>
          <span className="font-black text-xl tracking-tight">Ancient Maharashtra</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
          <Link href="/itinerary" className="text-muted hover:text-white transition-colors">The Journey</Link>
          <Link href="/places" className="text-muted hover:text-white transition-colors">Destinations</Link>
          <Link href="/hotels" className="text-muted hover:text-white transition-colors">Stays</Link>
          <Link href="/trains" className="text-muted hover:text-white transition-colors">Logistics</Link>
          <Link href="/expenses" className="text-muted hover:text-white transition-colors">Expenses</Link>
        </div>

        <Link href="/itinerary" className="hidden md:flex tap bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform">
          View Itinerary
        </Link>
      </div>
    </nav>
  );
}
