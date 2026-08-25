'use client';

import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { PLACES } from '@/lib/tripData';
import { MapPin, Mountain, Zap, Star, Leaf, Clock, Ticket, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FILTERS = [
  { id: 'all', label: 'All Destinations' },
  { id: 'temple', label: 'Sacred Shrines' },
  { id: 'heritage', label: 'UNESCO Heritage' },
  { id: 'experience', label: 'Experiences' },
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
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
    );
  }, [filter]);

  const filtered = filter === 'all' ? PLACES : PLACES.filter(p => p.type === filter);

  return (
    <div className="w-full pt-32 pb-24 min-h-screen">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="heading-hero text-gradient mb-6">Destinations</h1>
          <p className="text-body-large text-muted">
            Explore detailed guides, historical backgrounds, and travel tips for all 8 curated spots on our journey.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {FILTERS.map(f => (
            <button
              key={f.id}
              className="tap flex-shrink-0 transition-all duration-300"
              style={{
                borderRadius: 999,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 700,
                background: filter === f.id ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: filter === f.id ? '#FFFFFF' : 'var(--text-secondary)',
                border: filter === f.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                boxShadow: filter === f.id ? '0 8px 24px var(--accent-glow)' : 'none',
              }}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Expansive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((place) => (
            <Link key={place.id} href={`/places/${place.slug}`} className="place-card tap block group">
              <div className="glass-card overflow-hidden h-full flex flex-col relative">
                
                {/* Photo Section */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={place.coverImage} 
                    alt={place.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] to-transparent opacity-80" />
                  
                  <div className="absolute top-4 right-4 pill text-xs font-bold px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white">
                    Day {place.visitDay}
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold tracking-wider uppercase" style={{ color: place.accentColor }}>
                      <PlaceTypeIcon type={place.type} />
                      {place.typeLabel}
                    </div>
                    <h3 className="text-2xl font-black text-white leading-tight">
                      {place.name}
                    </h3>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 flex flex-col flex-grow justify-between gap-6 bg-[#0A0A0F]/50">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <MapPin size={16} className="text-blue-400" /> {place.city}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted">
                      <Clock size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" /> 
                      <span className="line-clamp-1">{place.timings}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border-glass)]">
                    <span className="text-sm font-semibold text-muted">
                      {place.keyAttractions.length} Attractions
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform">
                      Read Guide <ArrowRight size={16} />
                    </span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
