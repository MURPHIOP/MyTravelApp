'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, MapPin, Clock, IndianRupee, Image as ImageIcon 
} from 'lucide-react';
import { PLACES, PlaceItem } from '@/lib/tripData';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import BottomSheet from '@/components/ui/BottomSheet';
import TactileButton from '@/components/ui/TactileButton';

export default function ExplorePage() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);

  // Separate places for varied editorial rhythm
  const featured = PLACES[0]; // Trimbakeshwar or Ajanta
  const masonryPlaces = PLACES.slice(1);

  return (
    <div className="pt-safe pb-24">
      
      {/* ── HEADER ── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-6 pb-6 flex items-center justify-between"
      >
        <div>
          <div className="label-sm mb-1">Travel Guide</div>
          <h1 className="heading-xl">Discovery</h1>
        </div>
        <div className="w-12 h-12 rounded-full mat-metal flex items-center justify-center">
          <Compass size={20} className="text-[var(--text-primary)]" />
        </div>
      </motion.div>

      <div className="inner space-y-6">

        {/* ── CATEGORY FILTERS ── */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar px-2 pb-2">
          {['All Destinations', 'UNESCO Heritage', 'Jyotirlinga', 'Experiences'].map((cat, i) => (
            <button 
              key={cat}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold transition-colors ${i === 0 ? 'bg-[var(--text-primary)] text-[var(--bg)]' : 'bg-[var(--surface-2)] text-[var(--text-secondary)] border border-black/5 dark:border-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── FEATURED EDITORIAL HERO ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative h-[480px] rounded-[32px] overflow-hidden mat-elevated cursor-pointer"
          onClick={() => setSelectedPlace(featured)}
        >
          <img 
            src={featured.coverImage} 
            alt={featured.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 cinematic-overlay" />

          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="self-start mat-glass px-4 py-2 rounded-full flex items-center gap-2">
              <span className="font-bold text-white text-xs tracking-wider">MUST VISIT</span>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[var(--accent-secondary)] mb-2">
                <MapPin size={16} />
                <span className="text-sm font-bold uppercase tracking-widest">{featured.city}</span>
              </div>
              <h2 className="heading-display text-white mb-2 leading-tight">
                {featured.name}
              </h2>
              <p className="text-white/80 text-sm font-medium line-clamp-2 pr-8">
                Explore the ancient rock-cut caves and stunning architecture dating back centuries.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── MASONRY-STYLE EDITORIAL GRID ── */}
        <div className="grid grid-cols-2 gap-4">
          {masonryPlaces.map((place, idx) => (
            <motion.div 
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`relative rounded-[24px] overflow-hidden mat-paper cursor-pointer tap-effect ${idx % 3 === 0 ? 'col-span-2 aspect-[2/1]' : 'aspect-[4/5]'}`}
              onClick={() => setSelectedPlace(place)}
            >
              <img 
                src={place.coverImage} 
                alt={place.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 cinematic-overlay" />
              
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <div className="label-sm text-[var(--accent-secondary)] mb-1">{place.city}</div>
                <div className="font-bold text-white text-base leading-tight">{place.name}</div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      <FloatingActionButton 
        icon={<ImageIcon size={24} />} 
        onClick={() => {}} 
        visible={!selectedPlace}
      />

      {/* ── DESTINATION DETAILS SHEET ── */}
      <BottomSheet isOpen={!!selectedPlace} onClose={() => setSelectedPlace(null)}>
        {selectedPlace && (
          <div className="flex flex-col gap-6 -mt-6">
            
            <div className="relative h-[300px] -mx-6 rounded-b-[32px] overflow-hidden mb-2">
              <img src={selectedPlace.coverImage} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="label-sm text-[var(--accent-secondary)] mb-2">{selectedPlace.city}</div>
                <h2 className="heading-xl text-white">{selectedPlace.name}</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="mat-inset p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-[var(--text-primary)]">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Hours</div>
                  <div className="font-bold text-xs text-[var(--text-primary)] truncate w-24">{selectedPlace.timings}</div>
                </div>
              </div>

              <div className="mat-inset p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-[var(--text-primary)]">
                  <IndianRupee size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Entry Fee</div>
                  <div className="font-bold text-xs text-[var(--text-primary)]">{selectedPlace.entryFee.split('|')[0]}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[var(--text-primary)] mb-3">Highlights</h3>
              <div className="space-y-2">
                {selectedPlace.keyAttractions.map((attr: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--surface-2)]">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                    <span className="font-medium text-sm text-[var(--text-secondary)]">{attr}</span>
                  </div>
                ))}
              </div>
            </div>

            <TactileButton fullWidth size="lg">
              <MapPin size={18} /> View on Map
            </TactileButton>

          </div>
        )}
      </BottomSheet>

    </div>
  );
}
