'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ITINERARY, TRIP_CONFIG } from '@/lib/tripData';
import { MapPin, Clock, ChevronDown, ChevronUp, Info } from 'lucide-react';

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

function ActivityDot({ type }: { type: string }) {
  return (
    <div
      className="flex-shrink-0 w-2 h-2 rounded-full mt-1.5"
      style={{ background: ACTIVITY_COLORS[type] ?? '#64748B' }}
    />
  );
}

export default function ItineraryPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.day-card',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.45, ease: 'power3.out', delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, []);

  const today = (() => {
    const diff = Math.floor((Date.now() - new Date(TRIP_CONFIG.departureDate).getTime()) / 86400000);
    if (diff < 0 || diff >= ITINERARY.length) return null;
    return diff + 1;
  })();

  return (
    <div style={{ minHeight: '100dvh', paddingTop: 'var(--header-height)' }}>

      {/* ── 3D Map ────────────────────────────────────── */}
      <div
        className="relative"
        style={{ height: 280, borderBottom: '1px solid var(--border)' }}
      >
        <JourneyMap3D
          selectedDay={selectedDay}
          onSelectCity={(day) => {
            setSelectedDay(prev => prev === day ? null : day);
            setExpandedDay(day);
          }}
        />

        {/* Instruction overlay */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(7,11,20,0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600, whiteSpace: 'nowrap',
          }}
        >
          <Info size={11} /> Tap a city node to explore
        </div>

        {/* Map header */}
        <div className="absolute top-4 left-4">
          <div className="glass-card" style={{ padding: '8px 14px', borderRadius: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>ROUTE</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>HWH → JLG → AUR → SRD → NK → PUNE</div>
          </div>
        </div>
      </div>

      {/* ── Timeline ──────────────────────────────────── */}
      <div className="inner py-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="label-sm">Complete Schedule</p>
            <h1 className="heading-lg" style={{ fontSize: '1.3rem' }}>11-Day Itinerary</h1>
          </div>
          {today && (
            <div className="pill pill-sm pill-green">
              Live: Day {today}
            </div>
          )}
        </div>

        <div ref={cardsRef} className="relative flex flex-col gap-3">
          {/* Timeline line */}
          <div className="timeline-line" style={{ left: 23, top: 44, background: 'var(--accent)', opacity: 0.15, borderRadius: 2 }} />

          {ITINERARY.map((day) => {
            const isToday = today === day.day;
            const isExpanded = expandedDay === day.day;
            const isPast = today !== null && day.day < today;

            return (
              <div
                key={day.day}
                className="day-card"
                onClick={() => {
                  setExpandedDay(isExpanded ? null : day.day);
                  setSelectedDay(isExpanded ? null : day.day);
                }}
              >
                <div
                  className="flex items-start gap-4 p-4 rounded-3xl tap transition-all duration-200"
                  style={{
                    background: isToday
                      ? 'var(--accent-light)'
                      : selectedDay === day.day
                      ? 'var(--surface-2)'
                      : 'var(--surface)',
                    border: isToday
                      ? '1.5px solid var(--accent)'
                      : '1px solid var(--border)',
                    boxShadow: isToday ? '0 4px 20px var(--accent-light)' : 'var(--shadow-xs)',
                    opacity: isPast ? 0.6 : 1,
                  }}
                >
                  {/* Day number + photo circle */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div
                      style={{
                        width: 44, height: 44, borderRadius: 14, overflow: 'hidden',
                        backgroundImage: `url(${day.coverImage})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        border: isToday ? `2px solid var(--accent)` : '2px solid transparent',
                      }}
                    />
                    <div
                      className="pill pill-sm"
                      style={{
                        background: isToday ? 'var(--accent)' : 'var(--surface-2)',
                        color: isToday ? '#fff' : 'var(--text-muted)',
                        border: 'none', fontSize: 9, padding: '2px 8px',
                      }}
                    >
                      D{day.day}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {day.title}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={10} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{day.location}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>
                          {day.date}
                        </div>
                      </div>
                      <div style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }}>
                        {isExpanded
                          ? <ChevronUp size={16} />
                          : <ChevronDown size={16} />
                        }
                      </div>
                    </div>

                    {/* Highlight pills */}
                    {!isExpanded && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {day.highlights.slice(0, 2).map((h) => (
                          <span key={h} className="pill pill-sm pill-muted" style={{ fontSize: 10 }}>{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded activities */}
                {isExpanded && (
                  <div
                    className="mx-3 mt-1 mb-1 rounded-2xl overflow-hidden"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                  >
                    {/* Day image */}
                    <div
                      style={{
                        height: 140,
                        backgroundImage: `linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7)), url(${day.coverImage})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        position: 'relative',
                      }}
                    >
                      <div className="absolute bottom-3 left-4">
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{day.title}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{day.location}</div>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Activities */}
                      <p className="label-sm mb-3">Schedule</p>
                      <div className="flex flex-col gap-3">
                        {day.activities.map((a, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', minWidth: 42, paddingTop: 1 }}>{a.time}</span>
                            <ActivityDot type={a.type} />
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{a.title}</span>
                          </div>
                        ))}
                      </div>

                      {/* Note */}
                      {day.note && (
                        <div
                          className="mt-4 p-3 rounded-2xl flex items-start gap-2"
                          style={{ background: 'var(--accent-amber-light)', border: '1px solid rgba(245,158,11,0.2)' }}
                        >
                          <Info size={14} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: 1 }} />
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.5 }}>
                            {day.note}
                          </p>
                        </div>
                      )}

                      {/* Highlights */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {day.highlights.map((h) => (
                          <span key={h} className="pill pill-sm pill-blue">{h}</span>
                        ))}
                      </div>
                    </div>
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
