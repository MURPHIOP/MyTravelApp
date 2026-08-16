'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { ITINERARY } from '@/lib/tripData';

export default function ItineraryPage() {
  return (
    <div className="pb-safe relative w-full min-h-screen">
      
      {/* ── BACKGROUND ART DIRECTION ── */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[var(--bg)]">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="inner pt-safe">
        
        {/* ── HEADER ── */}
        <div className="mb-16 mt-8 lg:mt-16">
          <div className="text-eyebrow text-[var(--accent)] mb-2 flex items-center gap-2">
            <Calendar size={14} /> DAY BY DAY
          </div>
          <h1 className="text-title-main mb-4">Itinerary</h1>
          <div className="text-title-section text-[var(--text-secondary)]">
            11 Days in Maharashtra
          </div>
        </div>

        {/* ── TIMELINE ── */}
        <div className="max-w-4xl relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-[2px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)]" />

          <div className="space-y-12">
            {ITINERARY.map((day, index) => (
              <motion.div 
                key={day.day}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Center Node */}
                <div className="absolute left-6 md:left-[50%] -translate-x-[50%] w-4 h-4 rounded-full bg-[var(--bg)] border-2 z-10 mt-2" style={{ borderColor: day.accentColor }}>
                  <div className="absolute inset-1 rounded-full opacity-50" style={{ backgroundColor: day.accentColor }} />
                </div>

                {/* Content Side */}
                <div className="w-full md:w-[calc(50%-2rem)] pl-16 md:pl-0">
                  <div className="mat-paper p-6 md:p-8 rounded-[24px] border border-[rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-eyebrow" style={{ color: day.accentColor }}>DAY {day.day}</div>
                      <div className="text-sm font-bold text-[var(--text-muted)]">{new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                    </div>

                    <h2 className="text-title-card mb-2">{day.title}</h2>
                    <div className="text-body text-[var(--text-secondary)] mb-8 flex items-center gap-2 text-sm">
                      <MapPin size={14} /> {day.location}
                    </div>

                    {/* Image */}
                    <div className="relative w-full aspect-[16/9] mb-8 rounded-[16px] overflow-hidden bg-[var(--surface-2)]">
                      <img src={day.coverImage} alt={day.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Schedule */}
                    <div className="space-y-4">
                      {day.activities.map((act, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="w-16 shrink-0 text-sm font-mono font-bold text-[var(--text-primary)]">
                            {act.time}
                          </div>
                          <div className="text-body text-sm pt-[2px]">
                            {act.title}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Highlights */}
                    {day.highlights && day.highlights.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-[rgba(0,0,0,0.05)]">
                        <div className="text-eyebrow mb-3">HIGHLIGHTS</div>
                        <div className="flex flex-wrap gap-2">
                          {day.highlights.map((hl, i) => (
                            <span key={i} className="px-3 py-1 bg-[var(--surface-3)] text-[var(--text-secondary)] rounded-full text-xs font-bold">
                              {hl}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {day.note && (
                      <div className="mt-6 p-4 bg-[var(--accent)]/5 rounded-[12px] border border-[var(--accent)]/10 text-sm text-[var(--text-secondary)] leading-relaxed">
                        {day.note}
                      </div>
                    )}
                  </div>
                </div>

                {/* Empty Side for staggering */}
                <div className="hidden md:block w-full md:w-[calc(50%-2rem)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
