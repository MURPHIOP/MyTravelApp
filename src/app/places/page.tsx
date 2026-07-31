'use client';

import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { PLACES } from '@/lib/tripData';
import { MapPin, Mountain, Zap, Star, Leaf } from 'lucide-react';
import Link from 'next/link';

const FILTERS = [
  { id: 'all', label: 'All Places' },
  { id: 'temple', label: 'Jyotirlinga Shrines' },
  { id: 'heritage', label: 'UNESCO Heritage' },
  { id: 'experience', label: 'Experience' },
];

function PlaceTypeIcon({ type }: { type: string }) {
  const props = { size: 16, strokeWidth: 2 };
  if (type === 'heritage') return <Mountain {...props} />;
  if (type === 'temple') return <Zap {...props} />;
  if (type === 'experience') return <Star {...props} />;
  return <Leaf {...props} />;
}

export default function PlacesPage() {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    gsap.fromTo('.place-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.06, duration: 0.45, ease: 'power3.out' }
    );
  }, [filter]);

  const filtered = filter === 'all' ? PLACES : PLACES.filter(p => p.type === filter);

  return (
    <div className="inner py-8">

      {/* Header */}
      <div className="mb-6">
        <p className="label-sm">8 Destinations</p>
        <h1 className="heading-lg" style={{ marginTop: 2 }}>Places We're Visiting</h1>
        <p className="body-sm mt-1">Sacred Jyotirlingas, UNESCO caves, and scenic vineyards across Maharashtra.</p>
      </div>

      {/* Filter chips */}
      <div className="scroll-x mb-6 pb-2">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className="btn tap flex-shrink-0"
            style={{
              borderRadius: 999,
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 800,
              background: filter === f.id ? 'var(--accent)' : 'var(--surface)',
              color: filter === f.id ? '#FFFFFF' : 'var(--text-secondary)',
              border: filter === f.id ? 'none' : '1px solid var(--border)',
              boxShadow: filter === f.id ? '0 4px 16px rgba(59,130,246,0.3)' : 'var(--shadow-xs)',
            }}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((place) => (
          <Link key={place.id} href={`/places/${place.slug}`} className="tap block">
            <div className="place-card photo-card" style={{ height: 260 }}>
              <img src={place.coverImage} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="photo-card-overlay" />

              <div className="absolute inset-0 flex flex-col justify-between p-5">
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: 12,
                      background: `${place.accentColor}DD`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}
                  >
                    <PlaceTypeIcon type={place.type} />
                  </div>
                  <div
                    className="pill pill-sm"
                    style={{
                      background: 'rgba(0,0,0,0.5)', color: '#fff',
                      backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
                      fontSize: 10, padding: '4px 10px',
                    }}
                  >
                    Day {place.visitDay}
                  </div>
                </div>

                {/* Bottom */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>
                    {place.typeLabel}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', lineHeight: 1.25, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                    {place.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                    <MapPin size={11} /> {place.city}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Summary */}
      <div className="mt-8">
        <div
          className="p-5 rounded-3xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { val: '3', label: 'Jyotirlingas', color: '#EF4444' },
              { val: '2', label: 'UNESCO Sites', color: '#F59E0B' },
              { val: '3', label: 'Other Spots', color: '#10B981' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: s.color, letterSpacing: '-0.04em' }}>{s.val}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
