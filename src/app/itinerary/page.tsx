'use client';

import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ITINERARY } from '@/lib/tripData';
import { MapPin, ChevronDown, ChevronUp, Map, Navigation, Sparkles, Navigation2 } from 'lucide-react';

export default function ItineraryPage() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    gsap.fromTo('.day-card',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
    );
  }, []);

  return (
    <div className="w-full pt-24 pb-24 min-h-screen">
      
      {/* Interactive Map Header */}
      <section className="relative w-full h-[50vh] border-b border-[var(--border-glass)] overflow-hidden">
        <img 
          src={ITINERARY[0].coverImage} 
          alt="Map Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-dark)] to-transparent" />
        
        <div className="absolute top-8 left-8 z-10 hidden md:block">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2 text-accent-primary">
              <Navigation size={20} />
              <span className="text-sm font-black tracking-widest uppercase">Interactive Route Map</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Ancient Maharashtra</h2>
            <p className="text-muted text-sm font-semibold">HWH → JLG → AUR → SRD → NK → PUNE</p>
          </div>
        </div>
      </section>

      {/* Itinerary Timeline */}
      <section className="container-wide pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <h1 className="heading-section text-gradient mb-4">Day-by-Day Journey</h1>
            <p className="text-body-large text-muted">Complete 11-Day Schedule & Route Plan</p>
          </div>

          <div className="relative flex flex-col gap-8 border-l border-[var(--border-glass)] ml-4 md:ml-8 pl-8 md:pl-12">
            
            {ITINERARY.map((day, idx) => {
              const isExpanded = expandedDay === day.day;
              const isSelected = selectedDay === day.day;
              
              return (
                <div key={day.day} className="day-card relative">
                  
                  {/* Timeline Node */}
                  <div className="absolute -left-[54px] md:-left-[70px] top-6 w-5 h-5 rounded-full bg-[var(--bg-dark)] border-4 border-blue-500 z-10 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />

                  <div 
                    className={`glass-card p-6 md:p-8 rounded-3xl tap cursor-pointer transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500 bg-blue-900/10' : ''}`}
                    onClick={() => {
                      setExpandedDay(isExpanded ? null : day.day);
                      setSelectedDay(isExpanded ? null : day.day);
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      
                      <div className="w-full md:w-48 h-40 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden relative shadow-lg">
                        <img src={day.coverImage} className="w-full h-full object-cover" alt={day.title} />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-3 py-1 rounded-lg border border-white/20 text-xs font-bold text-white">
                          Day {day.day}
                        </div>
                      </div>

                      <div className="flex-grow flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl font-black mb-2">{day.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted font-medium">
                              <MapPin size={14} className="text-red-400" /> {day.location}
                              <span className="mx-2 text-border-glass">|</span>
                              {day.date}
                            </div>
                          </div>
                          <div className="hidden md:flex w-10 h-10 rounded-full bg-white/5 items-center justify-center text-muted">
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-6 pt-6 border-t border-[var(--border-glass)]">
                            <p className="text-sm text-muted italic mb-6">"{day.note}"</p>
                            
                            <div className="flex flex-col gap-4">
                              {day.activities.map((act, i) => (
                                <div key={i} className="flex gap-4 group">
                                  <div className="text-sm font-black text-blue-400 w-12 pt-1">{act.time}</div>
                                  <div className="flex flex-col">
                                    <div className="w-2.5 h-2.5 rounded-full bg-border-glass group-hover:bg-blue-400 mt-1.5 transition-colors absolute -ml-9" />
                                    <span className="text-base font-semibold text-white">{act.title}</span>
                                    <span className="text-xs font-bold text-muted uppercase tracking-wider mt-1">{act.type}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {!isExpanded && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {day.highlights.map(h => (
                              <span key={h} className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-muted border border-white/10">
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
