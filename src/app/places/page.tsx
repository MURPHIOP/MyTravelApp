'use client';

import React, { useState } from 'react';
import { PLACES } from '@/lib/tripData';
import { MapPin, Mountain, Zap, Star, Leaf, Clock, Ticket, ArrowRight, LibraryBig } from 'lucide-react';
import Link from 'next/link';

const FILTERS = [
  { id: 'all', label: 'All Artifacts' },
  { id: 'temple', label: 'Shrines' },
  { id: 'heritage', label: 'UNESCO' },
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

  const filtered = filter === 'all' ? PLACES : PLACES.filter(p => p.type === filter);

  return (
    <div className="page-content bg-[var(--bg)] min-h-screen">
      
      {/* ── HEADER ── */}
      <div className="pt-8 px-6 pb-6">
        <h1 className="heading-xl neon-text-cyan flex items-center gap-3">
          <LibraryBig size={32} /> Encyclopedia
        </h1>
        <p className="text-sm font-semibold text-gray-400 mt-1 uppercase tracking-widest">Digital Museum of Temples</p>
      </div>

      <div className="inner pb-12">
        
        {/* ── FILTERS ── */}
        <div className="scroll-x mb-8 px-2 flex gap-4">
          {FILTERS.map(f => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex-shrink-0 ${active ? 'neu-pressed text-white' : 'neu-flat text-gray-500'}`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* ── CARVED STONE NEUMORPHIC CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
          {filtered.map((place) => (
            <Link key={place.id} href={`/places/${place.slug}`} className="block transition-transform duration-300 active:scale-[0.98]">
              
              <div 
                className="rounded-[40px] p-4 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, var(--surface-2), var(--surface))',
                  boxShadow: 'var(--neu-convex)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {/* Image Container with Glowing Backlight */}
                <div className="relative h-[260px] rounded-[32px] overflow-hidden mb-6">
                  {/* The Glow */}
                  <div 
                    className="absolute inset-0 blur-xl opacity-60 mix-blend-screen scale-110"
                    style={{ background: place.accentColor }}
                  />
                  {/* The Image */}
                  <img 
                    src={place.coverImage} 
                    alt={place.name} 
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    style={{
                      borderRadius: '32px',
                      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
                      mixBlendMode: 'luminosity',
                      opacity: 0.85
                    }}
                  />
                  
                  {/* Glass Overlay Badges */}
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <div className="frosted-glass px-3 py-1.5 rounded-full flex items-center justify-center">
                      <PlaceTypeIcon type={place.type} />
                    </div>
                    <div className="frosted-glass px-3 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                      Day {place.visitDay}
                    </div>
                  </div>
                </div>

                {/* Info Section (Carved look) */}
                <div className="px-2">
                  <h2 className="text-2xl font-black text-white tracking-wide mb-1" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }}>
                    {place.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                    <MapPin size={12} /> {place.city}
                  </div>

                  {/* Grooved Details */}
                  <div className="neu-pressed rounded-3xl p-4 flex justify-between items-center bg-black/10">
                    <div>
                      <div className="text-[10px] font-black uppercase text-gray-500 mb-1 flex items-center gap-1">
                        <Clock size={10} /> Timings
                      </div>
                      <div className="text-xs font-bold text-gray-300 w-32 truncate">{place.timings}</div>
                    </div>
                    
                    <div className="h-8 w-px bg-white/10 mx-2" />
                    
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase text-gray-500 mb-1 flex items-center justify-end gap-1">
                        Entry <Ticket size={10} />
                      </div>
                      <div className="text-xs font-bold text-orange-400">{place.entryFee.split('|')[0]}</div>
                    </div>
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
