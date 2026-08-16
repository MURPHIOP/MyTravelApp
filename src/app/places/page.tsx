'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, IndianRupee } from 'lucide-react';
import { PLACES, PlaceItem } from '@/lib/tripData';
import BottomSheet from '@/components/ui/BottomSheet';
import TactileButton from '@/components/ui/TactileButton';

export default function ExplorePage() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);

  const featured = PLACES[0];
  const otherPlaces = PLACES.slice(1);

  return (
    <div className="pb-safe relative w-full overflow-hidden min-h-screen">
      
      {/* ── BACKGROUND ART DIRECTION ── */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[var(--bg)]">
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-multiply dark:mix-blend-screen"
          style={{
            backgroundImage: 'url(/destinations/hero_map.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'contrast(1.2) sepia(1)'
          }}
        />
      </div>

      <div className="inner pt-safe">
        
        {/* ── HEADER ── */}
        <div className="mb-12 mt-8 lg:mt-16">
          <h1 className="text-title-main mb-4">DISCOVER</h1>
          <div className="text-title-section text-[var(--text-secondary)]">
            Maharashtra, slowly.
          </div>
        </div>

        {/* ── CATEGORY FILTERS ── */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-6 -mx-[var(--page-padding-mobile)] px-[var(--page-padding-mobile)] md:mx-0 md:px-0 mb-8">
          {['All Destinations', 'UNESCO Heritage', 'Jyotirlinga', 'Experiences'].map((cat, i) => (
            <button 
              key={cat}
              className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                i === 0 
                  ? 'bg-[var(--text-primary)] text-[var(--bg)]' 
                  : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── FEATURED EDITORIAL HERO ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-square md:aspect-[21/9] bg-[var(--surface-2)] overflow-hidden cursor-pointer group mb-16"
          onClick={() => setSelectedPlace(featured)}
        >
          <img 
            src={featured.coverImage} 
            alt={featured.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
            <div className="max-w-2xl">
              <div className="text-eyebrow text-white/80 mb-3 flex items-center gap-2">
                <MapPin size={14} /> {featured.city}
              </div>
              <h2 className="text-title-section text-white mb-4">
                {featured.name}
              </h2>
              <p className="text-body text-white/90 line-clamp-2 md:line-clamp-none">
                {featured.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── OTHER DESTINATIONS ── */}
        <div>
          <div className="text-eyebrow mb-8">Featured Destinations</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {otherPlaces.map((place) => (
              <motion.div 
                key={place.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group cursor-pointer flex flex-col"
                onClick={() => setSelectedPlace(place)}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--surface-2)] mb-6">
                  <img 
                    src={place.coverImage} 
                    alt={place.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="text-eyebrow mb-2">{place.city}</div>
                <h3 className="text-title-card mb-3">{place.name}</h3>
                <p className="text-body line-clamp-2">
                  {place.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* ── DESTINATION DETAILS SHEET ── */}
      <BottomSheet isOpen={!!selectedPlace} onClose={() => setSelectedPlace(null)}>
        {selectedPlace && (
          <div className="flex flex-col gap-8 -mt-6">
            
            <div className="relative h-[400px] -mx-6 mb-4">
              <img src={selectedPlace.coverImage} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/40 to-transparent" />
              <div className="absolute bottom-8 left-6 right-6">
                <div className="text-eyebrow text-white/80 mb-3 flex items-center gap-2">
                  <MapPin size={14} /> {selectedPlace.city}
                </div>
                <h2 className="text-title-section text-white">{selectedPlace.name}</h2>
              </div>
            </div>

            <div className="px-2">
              <p className="text-body mb-8 text-safe text-balance">
                {selectedPlace.description}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="border-l-2 border-[var(--accent)] pl-4">
                  <div className="text-eyebrow mb-2 flex items-center gap-2">
                    <Clock size={14} /> HOURS
                  </div>
                  <div className="font-semibold text-sm text-[var(--text-primary)] text-safe">{selectedPlace.timings}</div>
                </div>

                <div className="border-l-2 border-[var(--accent-secondary)] pl-4">
                  <div className="text-eyebrow mb-2 flex items-center gap-2">
                    <IndianRupee size={14} /> ENTRY FEE
                  </div>
                  <div className="font-semibold text-sm text-[var(--text-primary)] text-safe">{selectedPlace.entryFee.split('|')[0]}</div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-title-card mb-6">Highlights</h3>
                <div className="space-y-4">
                  {selectedPlace.keyAttractions.map((attr: string, i: number) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="mt-1 w-6 h-6 rounded-full bg-[var(--surface-2)] border border-[rgba(0,0,0,0.05)] flex items-center justify-center shrink-0 text-[10px] font-bold text-[var(--text-secondary)]">
                        {i + 1}
                      </div>
                      <span className="text-body text-sm text-safe">{attr}</span>
                    </div>
                  ))}
                </div>
              </div>

              <TactileButton fullWidth size="lg" className="bg-[var(--text-primary)] text-[var(--bg)]">
                <MapPin size={18} className="mr-2" /> Open Directions
              </TactileButton>
            </div>

          </div>
        )}
      </BottomSheet>

    </div>
  );
}
