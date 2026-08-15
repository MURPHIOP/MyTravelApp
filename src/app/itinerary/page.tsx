'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ITINERARY, TRIP_CONFIG } from '@/lib/tripData';
import { MapPin, Clock, ChevronDown, ChevronUp, Info, Map, Sparkles, Navigation } from 'lucide-react';

const JourneyMap3D = dynamic(() => import('./JourneyMap3D'), { ssr: false });

const ACTIVITY_COLORS: Record<string, string> = {
  transport: '#3B82F6',
  temple: '#EF4444',
  sightseeing: '#F59E0B',
  food: '#10B981',
  hotel: '#8B5CF6',
  explore: '#EC4899',
  meetup: '#06B6D4',
  rest: '#64748B',
};

export default function ItineraryPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.day-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  const [today, setToday] = React.useState<number | null>(null);

  React.useEffect(() => {
    const diff = Math.floor((Date.now() - new Date(TRIP_CONFIG.departureDate).getTime()) / 86400000);
    if (diff >= 0 && diff < ITINERARY.length) {
      setToday(diff + 1);
    }
  }, []);

  return (
    <div style={{ minHeight: '100dvh' }}>

      {/* ── 3D Interactive Map Container ────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ height: 420, borderBottom: '1px solid var(--border)' }}
      >
        <JourneyMap3D
          selectedDay={selectedDay}
          onSelectCity={(day) => {
            setSelectedDay(prev => prev === day ? null : day);
            setExpandedDay(day);
          }}
        />

        {/* Map Header Overlay */}
        <div className="absolute top-4 left-4 z-10">
          <div className="glass-card px-4 py-2.5" style={{ borderRadius: 16 }}>
            <div className="flex items-center gap-2">
              <Navigation size={14} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                3D INTERACTIVE ROADMAP
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
              HWH &rarr; JLG &rarr; AUR &rarr; SRD &rarr; NK &rarr; PUNE
            </div>
          </div>
        </div>

        {/* Instruction overlay */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
          style={{
            background: 'rgba(7,11,20,0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.18)',
            fontSize: 12, color: '#FFFFFF', fontWeight: 700, whiteSpace: 'nowrap',
          }}
        >
          <Sparkles size={14} style={{ color: '#F59E0B' }} /> Drag to rotate map &bull; Tap city node to focus
        </div>
      </div>

      {/* ── 11-Day Timeline Schedule ───────────────────── */}
      <div className="inner py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="label-sm">Day-by-Day Journey</p>
            <h1 className="heading-lg" style={{ marginTop: 2 }}>11-Day Itinerary Schedule</h1>
          </div>
          {today && (
            <div className="pill pill-md pill-green">
              Live: Day {today}
            </div>
          )}
        </div>

        <div ref={timelineRef} className="relative flex flex-col gap-5">
          <div className="timeline-line" style={{ top: 52 }} />

          {ITINERARY.map((day) => {
            const isToday = today === day.day;
            const isExpanded = expandedDay === day.day;
            const isSelected = selectedDay === day.day;

            return (
              <div key={day.day} className="day-card">
                <div
                  className="flex items-start gap-4 p-5 sm:p-6 rounded-3xl tap transition-all duration-200"
                  style={{
                    background: isToday
                      ? 'var(--accent-light)'
                      : isSelected
                      ? 'var(--surface-2)'
                      : 'var(--surface)',
                    border: isToday
                      ? '2px solid var(--accent)'
                      : isSelected
                      ? '1.5px solid var(--accent)'
                      : '1px solid var(--border)',
                    boxShadow: isToday ? '0 8px 30px var(--accent-light)' : 'var(--shadow-sm)',
                  }}
                  onClick={() => {
                    setExpandedDay(isExpanded ? null : day.day);
                    setSelectedDay(isExpanded ? null : day.day);
                  }}
                >
                  {/* Photo Thumbnail + Day Badge */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div
                      style={{
                        width: 52, height: 52, borderRadius: 16, overflow: 'hidden',
                        backgroundImage: `url(${day.coverImage})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    />
                    <div
                      className="pill pill-sm"
                      style={{
                        background: isToday ? 'var(--accent)' : 'var(--surface-2)',
                        color: isToday ? '#FFFFFF' : 'var(--text-muted)',
                        fontSize: 10, padding: '3px 9px', fontWeight: 800,
                        border: '1px solid var(--border)',
                      }}
                    >
                      Day {day.day}
                    </div>
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {day.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{day.location}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>•</span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{day.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', flexShrink: 0 }}>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>

                    {/* Highlights Pills */}
                    {!isExpanded && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {day.highlights.map((h) => (
                          <span key={h} className="pill pill-sm pill-muted" style={{ fontSize: 10 }}>{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    className="mt-3 p-5 rounded-3xl"
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-inner)',
                    }}
                  >
                    {/* Header Image inside dropdown */}
                    <div
                      className="rounded-2xl overflow-hidden mb-4 relative"
                      style={{
                        height: 160,
                        backgroundImage: `linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.8) 100%), url(${day.coverImage})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                      }}
                    >
                      <div className="absolute bottom-4 left-4 right-4">
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>{day.title}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{day.location} &bull; {day.date}</div>
                      </div>
                    </div>

                    <p className="label-sm mb-3">Activities Schedule</p>
                    <div className="flex flex-col gap-3">
                      {day.activities.map((act, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl" style={{ background: 'var(--surface)' }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', minWidth: 46 }}>{act.time}</span>
                          <div
                            className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ background: ACTIVITY_COLORS[act.type] ?? 'var(--accent)' }}
                          />
                          <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>{act.title}</span>
                        </div>
                      ))}
                    </div>

                    {day.note && (
                      <div
                        className="mt-4 p-3.5 rounded-2xl flex items-start gap-2.5"
                        style={{ background: 'var(--accent-amber-light)', border: '1px solid rgba(245,158,11,0.25)' }}
                      >
                        <Info size={16} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: 1 }} />
                        <p style={{ fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5 }}>
                          {day.note}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
