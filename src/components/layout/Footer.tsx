import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-32 border-t" style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-dark)' }}>
      <div className="container-wide py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)' }}>
              <Compass size={20} color="#FFF" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">Ancient Maharashtra</span>
          </Link>
          <p className="text-muted text-sm leading-relaxed">
            A premium private family journey covering the most sacred and ancient sites of Maharashtra, India.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white mb-4">Journey Map</h3>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/itinerary" className="text-muted hover:text-white transition-colors">11-Day Itinerary</Link>
            <Link href="/places" className="text-muted hover:text-white transition-colors">Destinations & Temples</Link>
            <Link href="/hotels" className="text-muted hover:text-white transition-colors">Accommodations</Link>
            <Link href="/trains" className="text-muted hover:text-white transition-colors">Train Logistics</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white mb-4">Features</h3>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/expenses" className="text-muted hover:text-white transition-colors">Auto-Split Expenses</Link>
            <Link href="/auth/login" className="text-muted hover:text-white transition-colors">Family Head Login</Link>
            <Link href="/vault" className="text-muted hover:text-white transition-colors">Document Vault</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white mb-4">Trip Details</h3>
          <div className="flex flex-col gap-3 text-sm text-muted">
            <p>16 Oct 2026 – 26 Oct 2026</p>
            <p>Mitra & Ghosh Families</p>
            <p>11 Days, 6 Cities</p>
          </div>
        </div>
      </div>
      <div className="container-wide py-6 border-t" style={{ borderColor: 'var(--border-glass)' }}>
        <p className="text-center text-xs text-muted">
          © 2026 Ancient Maharashtra Tour. Designed for Mitra & Ghosh Families.
        </p>
      </div>
    </footer>
  );
}
