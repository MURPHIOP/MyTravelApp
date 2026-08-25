'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { useTripData } from '@/context/TripDataContext';
import {
  MapPin, ChevronLeft, Lightbulb, Calendar, Mountain, Zap, Star, Leaf,
  Clock, Ticket, Shirt, Sparkles, CheckCircle2, Compass, ShieldAlert,
  History, Eye
} from 'lucide-react';
import Link from 'next/link';

function PlaceTypeIcon({ type }: { type: string }) {
  const props = { size: 24, strokeWidth: 3 };
  if (type === 'heritage') return <Mountain {...props} />;
  if (type === 'temple') return <Zap {...props} />;
  if (type === 'experience') return <Star {...props} />;
  return <Leaf {...props} />;
}

export default function PlaceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { places: PLACES } = useTripData();
  const place = PLACES.find(p => p.slug === slug);

  if (!place) return notFound();

  return (
    <div className="w-full pb-32 min-h-screen">

      {/* Brutalist Hero */}
      <div className="relative w-full h-[70vh] min-h-[600px] border-b-4 border-black bg-white flex flex-col md:flex-row">
        
        {/* Left Info Column */}
        <div className="w-full md:w-5/12 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-between p-8 md:p-12 order-2 md:order-1 z-10 bg-white">
          <div>
            <Link
              href="/places"
              className="brutal-btn text-xs mb-12 inline-flex"
            >
              <ChevronLeft size={16} /> RETURN
            </Link>

            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono font-black uppercase text-sm"
              style={{ background: place.accentColor, color: '#FFFFFF' }}
            >
              <PlaceTypeIcon type={place.type} />
              {place.typeLabel}
            </div>
            
            <h1 className="text-5xl lg:text-6xl xl:text-[5rem] font-black uppercase tracking-tighter text-black mb-6 leading-none break-words hyphens-auto">
              {place.name}
            </h1>
          </div>
          
          <div className="flex flex-col gap-4 font-mono font-bold text-sm">
            <div className="flex items-center gap-3 bg-[var(--bg-color)] p-4 border-2 border-black">
              <MapPin size={24} style={{ color: place.accentColor }} /> {place.city}
            </div>
            <div className="flex items-center gap-3 bg-[var(--bg-color)] p-4 border-2 border-black">
              <Calendar size={24} /> SCHEDULED DAY {place.visitDay}
            </div>
          </div>
        </div>

        {/* Right Image Column */}
        <div className="w-full md:w-7/12 relative order-1 md:order-2 flex-grow min-h-[300px]">
          <img
            src={place.coverImage}
            alt={place.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Brutalist Corner Marks */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8 w-4 h-4 md:w-8 md:h-8 border-t-4 md:border-t-8 border-l-4 md:border-l-8 border-[var(--accent)]" />
          <div className="absolute top-4 right-4 md:top-8 md:right-8 w-4 h-4 md:w-8 md:h-8 border-t-4 md:border-t-8 border-r-4 md:border-r-8 border-[var(--accent)]" />
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-4 h-4 md:w-8 md:h-8 border-b-4 md:border-b-8 border-l-4 md:border-l-8 border-[var(--accent)]" />
          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-4 h-4 md:w-8 md:h-8 border-b-4 md:border-b-8 border-r-4 md:border-r-8 border-[var(--accent)]" />
        </div>
      </div>

      {/* Expansive Content Layout */}
      <div className="container-wide pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Article Content (Left) */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
                <Compass size={36} className="text-[var(--accent)]" />
                <h2 className="heading-section">Overview</h2>
              </div>
              <p className="text-xl font-bold leading-relaxed text-[var(--text-primary)]">
                {place.description}
              </p>
            </section>

            <section className="brutal-card p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <History size={36} className="text-[var(--accent)]" />
                <h2 className="text-4xl font-black uppercase">History</h2>
              </div>
              <p className="text-lg font-medium leading-relaxed">
                {place.history}
              </p>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
                <Eye size={36} className="text-[var(--text-primary)]" />
                <h2 className="heading-section">Key Attractions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {place.keyAttractions.map((att, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <CheckCircle2 size={28} className="text-[var(--accent)] shrink-0" />
                    <span className="font-bold text-lg leading-tight uppercase">{att}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Info (Right) */}
          <div className="space-y-12">
            
            {/* Essential Info Panel */}
            <div className="brutal-card p-0 overflow-hidden">
              <div className="bg-black text-white p-6 border-b-2 border-black">
                <h3 className="font-black text-2xl uppercase tracking-widest">Essential Info</h3>
              </div>
              <div className="p-0 flex flex-col divide-y-2 divide-[var(--border-color)] font-mono">
                <div className="flex items-center p-6 gap-6 bg-white">
                  <div className="text-[var(--accent)]"><Clock size={32} /></div>
                  <div>
                    <div className="text-xs font-black text-muted tracking-widest uppercase mb-1">Hours</div>
                    <div className="font-bold text-lg uppercase">{place.timings}</div>
                  </div>
                </div>
                
                <div className="flex items-center p-6 gap-6 bg-[#FFEDD5]">
                  <div className="text-black"><Ticket size={32} /></div>
                  <div>
                    <div className="text-xs font-black text-muted tracking-widest uppercase mb-1">Entry Fee</div>
                    <div className="font-bold text-lg uppercase">{place.entryFee}</div>
                  </div>
                </div>

                <div className="flex items-center p-6 gap-6 bg-white">
                  <div className="text-[var(--accent)]"><Sparkles size={32} /></div>
                  <div>
                    <div className="text-xs font-black text-muted tracking-widest uppercase mb-1">Best Time</div>
                    <div className="font-bold text-lg uppercase">{place.bestTimeToVisit}</div>
                  </div>
                </div>

                <div className="flex items-center p-6 gap-6 bg-white">
                  <div className="text-black"><Shirt size={32} /></div>
                  <div>
                    <div className="text-xs font-black text-muted tracking-widest uppercase mb-1">Dress Code</div>
                    <div className="font-bold text-lg uppercase">{place.dressCode}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Tips */}
            <div className="brutal-card p-8 bg-[var(--text-primary)] text-white border-[var(--text-primary)] shadow-[8px_8px_0px_0px_var(--accent)]">
              <div className="flex items-center gap-4 mb-8">
                <ShieldAlert size={32} className="text-[var(--accent)]" />
                <h3 className="font-black text-2xl uppercase">Traveler Tips</h3>
              </div>
              <div className="space-y-6">
                {place.travelTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-[var(--accent)] font-black text-xl leading-none">0{i+1}</span>
                    <span className="font-bold uppercase tracking-wider">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
