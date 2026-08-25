'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { PLACES } from '@/lib/tripData';
import {
  MapPin, ChevronLeft, Lightbulb, Calendar, Mountain, Zap, Star, Leaf,
  Clock, Ticket, Shirt, Sparkles, CheckCircle2, Compass, ShieldAlert,
  History, Eye
} from 'lucide-react';
import Link from 'next/link';

function PlaceTypeIcon({ type }: { type: string }) {
  const props = { size: 18, strokeWidth: 2 };
  if (type === 'heritage') return <Mountain {...props} />;
  if (type === 'temple') return <Zap {...props} />;
  if (type === 'experience') return <Star {...props} />;
  return <Leaf {...props} />;
}

export default function PlaceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const place = PLACES.find(p => p.slug === slug);

  if (!place) return notFound();

  return (
    <div className="w-full pb-32 min-h-screen">

      {/* Massive Desktop Hero */}
      <div className="relative w-full h-[60vh] min-h-[500px]">
        <img
          src={place.coverImage}
          alt={place.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-dark)] via-[var(--bg-dark)]/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-wide pb-12">
            <Link
              href="/places"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 font-bold tap"
            >
              <ChevronLeft size={20} /> Back to Destinations
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div
                  className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20"
                  style={{ background: `${place.accentColor}80`, color: '#FFFFFF', fontSize: 14, fontWeight: 800 }}
                >
                  <PlaceTypeIcon type={place.type} />
                  {place.typeLabel}
                </div>
                <h1 className="heading-hero text-white mb-4 leading-tight">{place.name}</h1>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-white/90 font-semibold">
                    <MapPin size={18} style={{ color: place.accentColor }} /> {place.city}
                  </div>
                  <div className="flex items-center gap-2 text-white/90 font-semibold">
                    <Calendar size={18} className="text-yellow-400" /> Scheduled for Day {place.visitDay}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expansive Content Layout */}
      <div className="container-wide pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Article Content (Left) */}
          <div className="lg:col-span-2 space-y-12">
            <section className="glass-card p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Compass size={28} style={{ color: place.accentColor }} />
                <h2 className="heading-section">About & Overview</h2>
              </div>
              <p className="text-lg leading-relaxed text-muted">
                {place.description}
              </p>
            </section>

            <section className="glass-card p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <History size={28} className="text-yellow-400" />
                <h2 className="heading-section">History & Significance</h2>
              </div>
              <p className="text-lg leading-relaxed text-muted">
                {place.history}
              </p>
            </section>

            <section className="glass-card p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <Eye size={28} className="text-emerald-400" />
                <h2 className="heading-section">Key Attractions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {place.keyAttractions.map((att, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white leading-relaxed">{att}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Info (Right) */}
          <div className="space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="glass-card p-8">
              <h3 className="font-bold text-xl mb-6">Essential Info</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted tracking-widest uppercase mb-1">Opening Hours</div>
                    <div className="font-bold">{place.timings}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0">
                    <Ticket size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted tracking-widest uppercase mb-1">Entry Fee</div>
                    <div className="font-bold">{place.entryFee}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted tracking-widest uppercase mb-1">Best Time</div>
                    <div className="font-bold">{place.bestTimeToVisit}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Shirt size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted tracking-widest uppercase mb-1">Dress Code</div>
                    <div className="font-bold">{place.dressCode}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Tips */}
            <div className="glass-card p-8" style={{ borderColor: `${place.accentColor}40` }}>
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert size={24} style={{ color: place.accentColor }} />
                <h3 className="font-bold text-xl">Traveler Tips</h3>
              </div>
              <div className="space-y-4">
                {place.travelTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span style={{ color: place.accentColor }} className="mt-1 font-black">•</span>
                    <span className="text-sm font-medium text-muted leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Facts */}
            <div className="glass-card p-8 bg-gradient-to-br from-pink-900/10 to-transparent">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb size={24} className="text-pink-400" />
                <h3 className="font-bold text-xl">Fascinating Facts</h3>
              </div>
              <div className="space-y-4">
                {place.facts.map((fact, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-black"
                      style={{ background: `${place.accentColor}20`, color: place.accentColor }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-sm font-medium text-muted leading-relaxed mt-1">{fact}</p>
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
