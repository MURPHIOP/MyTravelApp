'use client';

import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { PLACES } from '@/lib/tripData';
import { MapPin, ChevronRight, Mountain, Zap, Star, Leaf, Filter } from 'lucide-react';
import Link from 'next/link';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'temple', label: 'Jyotirlinga' },
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
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, stagger: 0.07, duration: 0.4, ease: 'power3.out', delay: 0.1 }
    );
  }, [filter]);

  const filtered = filter === 'all' ? PLACES : PLACES.filter(p => p.type === filter);

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 16px)', paddingBottom: 24 }}>

      {/* Header */}
      <div className="inner mb-5">
        <p className="label-sm">8 Destinations</p>
        <h1 className="heading-lg">Places We're Visiting</h1>
        <p className="body-sm mt-1">Heritage sites, Jyotirlingas, and unique experiences across Maharashtra</p>
      </div>

      {/* Filter chips */}
      <div className="scroll-x mb-5" style={{ paddingLeft: 18, paddingRight: 18 }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            className="btn tap flex-shrink-0"
            style={{
              borderRadius: 999,
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 700,
              background: filter === f.id ? 'var(--accent)' : 'var(--surface)',
              color: filter === f.id ? '#fff' : 'var(--text-secondary)',
              border: filter === f.id ? 'none' : '1px solid var(--border)',
              boxShadow: filter === f.id ? '0 4px 20px rgba(59,130,246,0.3)' : 'var(--shadow-xs)',
            }}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        className="inner grid"
        style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}
      >
        {filtered.map((place) => (
          <Link key={place.id} href={`/places/${place.slug}`} className="tap">
            <div
              className="place-card photo-card"
              style={{ height: 220 }}
            >
              <img src={place.coverImage} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="photo-card-overlay" />

              <div className="absolute inset-0 flex flex-col justify-between p-3">
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: `${place.accentColor}CC`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', backdropFilter: 'blur(8px)',
                    }}
                  >
                    <PlaceTypeIcon type={place.type} />
                  </div>
                  <div
                    className="pill pill-sm"
                    style={{
                      background: 'rgba(0,0,0,0.45)', color: '#fff',
                      backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)',
                      fontSize: 9,
                    }}
                  >
                    Day {place.visitDay}
                  </div>
                </div>

                {/* Bottom */}
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
                    {place.typeLabel}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                    {place.name}
                  </div>
                  <div className="flex items-center gap-1 mt-1" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>
                    <MapPin size={9} /> {place.city}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom summary */}
      <div className="inner mt-6">
        <div
          className="p-4 rounded-3xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { val: '3', label: 'Jyotirlingas', color: '#EF4444' },
              { val: '2', label: 'UNESCO Sites', color: '#F59E0B' },
              { val: '3', label: 'Other Spots', color: '#10B981' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color, letterSpacing: '-0.04em' }}>{s.val}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
