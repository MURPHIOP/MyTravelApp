'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PLACES } from '@/lib/tripData';
import { MapPin, Mountain, Zap, Star, Leaf, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FILTERS = [
  { id: 'all', label: 'All Destinations' },
  { id: 'temple', label: 'Sacred Shrines' },
  { id: 'heritage', label: 'UNESCO Heritage' },
  { id: 'experience', label: 'Experiences' },
];

function PlaceTypeIcon({ type }: { type: string }) {
  const props = { size: 20, strokeWidth: 3 };
  if (type === 'heritage') return <Mountain {...props} />;
  if (type === 'temple') return <Zap {...props} />;
  if (type === 'experience') return <Star {...props} />;
  return <Leaf {...props} />;
}

export default function PlacesPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? PLACES : PLACES.filter(p => p.type === filter);

  return (
    <div className="w-full pt-32 pb-24 min-h-screen">
      <div className="container-wide">
        
        {/* Brutalist Header */}
        <div className="mb-16 border-b-[4px] border-[var(--border-color)] pb-12 flex flex-col md:flex-row justify-between items-end">
          <div>
            <div className="inline-block bg-[var(--text-primary)] text-white px-3 py-1 font-mono text-sm font-bold uppercase mb-6 shadow-[4px_4px_0px_0px_var(--accent)]">
              Index / 8 Sites
            </div>
            <h1 className="heading-hero">Destinations</h1>
          </div>
          <p className="text-xl font-bold max-w-sm border-l-4 border-[var(--accent)] pl-4 bg-white p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-8 md:mt-0">
            Curated travel intelligence for our journey across Maharashtra.
          </p>
        </div>

        {/* Brutalist Filters */}
        <div className="flex flex-wrap gap-4 mb-16">
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`brutal-btn ${filter === f.id ? 'bg-[var(--accent)] text-white' : 'bg-white'}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Expansive Brutalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((place) => (
            <Link key={place.id} href={`/places/${place.slug}`} className="brutal-card block group h-full flex flex-col hover:bg-[var(--accent-light)]">
                
              {/* Photo Section */}
              <div className="relative h-64 border-b-2 border-[var(--border-color)] overflow-hidden">
                <img 
                  src={place.coverImage} 
                  alt={place.name} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" 
                />
                
                <div className="absolute top-0 left-0 bg-[var(--accent)] text-white border-r-2 border-b-2 border-[var(--border-color)] font-mono font-black text-sm px-4 py-2">
                  DAY {place.visitDay}
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6 flex flex-col flex-grow justify-between gap-6 bg-white group-hover:bg-transparent transition-colors">
                
                <div>
                  <div className="flex items-center gap-2 mb-3 text-xs font-black tracking-widest uppercase border-2 border-[var(--border-color)] w-max px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <PlaceTypeIcon type={place.type} />
                    {place.typeLabel}
                  </div>
                  <h3 className="text-3xl font-black uppercase leading-none mb-4 group-hover:text-[var(--accent)] transition-colors">
                    {place.name}
                  </h3>
                </div>

                <div className="flex flex-col gap-4 border-t-2 border-dashed border-[var(--border-color)] pt-4 font-mono font-bold text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[var(--accent)]" /> {place.city}
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={18} className="shrink-0 mt-0.5" /> 
                    <span className="line-clamp-1">{place.timings}</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between border-t-2 border-[var(--border-color)] pt-4">
                  <span className="font-mono text-sm font-black bg-black text-white px-2 py-1">
                    {place.keyAttractions.length} ATTR
                  </span>
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-[var(--accent)] text-white group-hover:translate-x-2 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <ArrowRight size={20} />
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
