import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--bg-color)] border-t-[3px] border-[var(--border-color)] mt-24">
      <div className="container-wide py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-3 w-max">
            <div className="flex items-center justify-center w-10 h-10 border-2 border-[var(--border-color)] bg-[var(--accent)] shadow-[4px_4px_0px_0px_var(--shadow-color)]">
              <Compass size={20} color="#FFF" />
            </div>
            <span className="font-black text-xl tracking-tight uppercase">Maharashtra</span>
          </Link>
          <p className="text-mono text-sm leading-relaxed border-l-4 border-[var(--accent)] pl-4">
            A premium private family journey covering the most sacred and ancient sites of Maharashtra, India.
          </p>
        </div>

        <div>
          <h3 className="font-black uppercase mb-4 tracking-widest text-sm text-[var(--accent)]">System // Map</h3>
          <div className="flex flex-col gap-3 font-mono text-sm font-bold">
            <Link href="/itinerary" className="hover:underline hover:text-[var(--accent)] transition-colors">11-Day Route</Link>
            <Link href="/places" className="hover:underline hover:text-[var(--accent)] transition-colors">Sites & Temples</Link>
            <Link href="/hotels" className="hover:underline hover:text-[var(--accent)] transition-colors">Accommodations</Link>
            <Link href="/trains" className="hover:underline hover:text-[var(--accent)] transition-colors">Logistics</Link>
          </div>
        </div>

        <div>
          <h3 className="font-black uppercase mb-4 tracking-widest text-sm text-[var(--accent)]">Modules</h3>
          <div className="flex flex-col gap-3 font-mono text-sm font-bold">
            <Link href="/expenses" className="hover:underline hover:text-[var(--accent)] transition-colors">Auto-Ledger</Link>
            <Link href="/auth/login" className="hover:underline hover:text-[var(--accent)] transition-colors">Family Head Login</Link>
            <Link href="/vault" className="hover:underline hover:text-[var(--accent)] transition-colors">Secure Vault</Link>
          </div>
        </div>

        <div>
          <h3 className="font-black uppercase mb-4 tracking-widest text-sm text-[var(--accent)]">Telemetry</h3>
          <div className="flex flex-col gap-3 font-mono text-sm font-bold text-muted border border-[var(--border-color)] p-4 bg-white shadow-[4px_4px_0px_0px_var(--shadow-color)]">
            <p>16 OCT – 26 OCT</p>
            <p>MITRA & GHOSH</p>
            <p className="text-[var(--accent)]">STATUS: CONFIRMED</p>
          </div>
        </div>
      </div>
      <div className="border-t-2 border-[var(--border-color)] bg-[var(--text-primary)] text-[var(--bg-color)] py-4 font-mono text-xs font-bold text-center uppercase tracking-widest">
        <p>SYSTEM ONLINE © 2026 ANCIENT MAHARASHTRA TOUR</p>
      </div>
    </footer>
  );
}
