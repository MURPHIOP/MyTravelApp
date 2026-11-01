'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useTripData } from '@/context/TripDataContext';
import { MapPin, ChevronDown, ChevronUp, Navigation } from 'lucide-react';

const emptySubscribe = () => () => {};

export default function ItineraryPage() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const currentDateString = useSyncExternalStore(
    emptySubscribe,
    () => new Date().toISOString().split('T')[0],
    () => ''
  );
  const { itinerary: ITINERARY } = useTripData();

  return (
    <div className="w-full pt-32 pb-24 min-h-screen">
      
      {/* Brutalist Header */}
      <section className="container-wide mb-24">
        <div className="border-b-[6px] border-black pb-12">
          <div className="inline-flex items-center gap-3 bg-[var(--accent)] text-white px-4 py-2 font-mono font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
            <Navigation size={20} /> ROUTE MAP
          </div>
          <h1 className="heading-hero">11-Day Journey</h1>
          <p className="font-mono text-xl font-bold uppercase mt-6 max-w-2xl bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_var(--shadow-color)]">
            HWH → JLG → AUR → SRD → NK → PUNE
          </p>
        </div>
      </section>

      {/* Itinerary Timeline */}
      <section className="container-wide">
        <div className="max-w-5xl">
          
          <div className="relative flex flex-col gap-12 border-l-4 border-black ml-4 md:ml-8 pl-8 md:pl-16">
            
            {ITINERARY.map((day) => {
              const isExpanded = expandedDay === day.day;
              const isActive = day.date === currentDateString;
              
              return (
                <div key={day.day} className="relative">
                  
                  {/* Timeline Node */}
                  <div className={`absolute -left-[46px] md:-left-[78px] top-6 w-8 h-8 bg-[var(--bg-color)] border-4 ${isActive ? 'border-[var(--accent)]' : 'border-[var(--border-color)]'} z-10 flex items-center justify-center`}>
                    <div className={`w-3 h-3 ${isExpanded || isActive ? 'bg-[var(--accent)]' : 'bg-[var(--border-color)]'} ${isActive ? 'animate-ping' : ''}`} />
                  </div>

                  <div 
                    className={`brutal-card p-0 overflow-hidden cursor-pointer transition-all duration-300 ${isExpanded ? 'bg-[var(--surface-light)]' : 'bg-[var(--surface-light)]/90'} ${isActive ? 'ring-4 ring-[var(--accent)] border-[var(--accent)]' : ''}`}
                    onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                  >
                    <div className="flex flex-col md:flex-row">
                      
                      <div className={`w-full md:w-72 h-52 md:h-auto md:min-h-[220px] flex-shrink-0 relative overflow-hidden border-b-2 md:border-b-0 md:border-r-2 ${isActive ? 'border-[var(--accent)]' : 'border-[var(--border-color)]'}`}>
                        <Image 
                          src={day.coverImage} 
                          alt={day.title} 
                          fill
                          sizes="(max-width: 768px) 100vw, 288px"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className={`absolute top-0 left-0 text-white border-r-2 border-b-2 font-mono font-black text-sm px-4 py-2 ${isActive ? 'bg-[var(--accent)] border-[var(--accent)]' : 'bg-[var(--accent)] border-[var(--border-color)]'}`}>
                          DAY {day.day}
                        </div>
                        {isActive && (
                          <div className="absolute bottom-4 left-4 bg-[var(--surface-light)] text-[var(--accent)] border-2 border-[var(--accent)] px-3 py-1 font-mono text-xs font-black tracking-widest shadow-[2px_2px_0px_0px_var(--accent)] animate-pulse flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--accent)]" /> LIVE CURRENT
                          </div>
                        )}
                      </div>

                      <div className="flex-grow p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-3xl font-black uppercase mb-3 text-[var(--text-primary)]">{day.title}</h3>
                            <div className="flex flex-wrap items-center gap-4 font-mono font-bold text-sm">
                              <span className="flex items-center gap-2 bg-[var(--surface-light)] text-[var(--text-primary)] px-2 py-1 border-2 border-[var(--border-color)] shadow-[2px_2px_0px_0px_var(--shadow-color)]">
                                <MapPin size={16} className="text-[var(--accent)]" /> {day.location}
                              </span>
                              <span className="bg-[var(--surface-contrast)] text-[var(--text-inverse)] px-2 py-1 uppercase">{day.date}</span>
                            </div>
                          </div>
                          <div className="hidden md:flex w-12 h-12 border-2 border-[var(--border-color)] bg-[var(--surface-light)] text-[var(--text-primary)] items-center justify-center shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:-translate-y-1 transition-transform">
                            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-8 pt-8 border-t-4 border-[var(--border-color)] border-dashed">
                            <p className="font-mono font-bold text-lg p-4 bg-[var(--card-tint-warm)] text-[var(--text-primary)] border-2 border-[var(--border-color)] mb-8 uppercase">
                              &gt; {day.note}
                            </p>
                            
                            <div className="flex flex-col gap-6">
                              {day.activities.map((act, i) => (
                                <div key={i} className="flex gap-6 group">
                                  <div className="font-mono font-black text-[var(--accent)] w-16 pt-1 text-lg">{act.time}</div>
                                  <div className="flex flex-col border-l-2 border-[var(--border-color)] pl-6 relative">
                                    <div className="absolute top-2 -left-[7px] w-3 h-3 bg-[var(--surface-light)] border-2 border-[var(--border-color)] group-hover:bg-[var(--accent)] transition-colors" />
                                    <span className="text-xl font-black uppercase text-[var(--text-primary)]">{act.title}</span>
                                    <span className="font-mono text-sm font-bold tracking-widest mt-1 bg-[var(--surface-contrast)] text-[var(--text-inverse)] w-max px-2 py-0.5">{act.type}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {!isExpanded && (
                          <div className="flex flex-wrap gap-3 mt-6">
                            {day.highlights.map(h => (
                              <span key={h} className="font-mono text-xs font-black px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </section>
    </div>
  );
}
