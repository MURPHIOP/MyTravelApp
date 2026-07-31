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
    <div style={{ minHeight: '100dvh', paddingBottom: 50 }}>

      {/* Hero Header */}
      <div className="relative" style={{ height: 380 }}>
        <img
          src={place.coverImage}
          alt={place.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(7,11,20,0.2) 0%, rgba(7,11,20,0.6) 50%, rgba(7,11,20,0.98) 100%)',
          }}
        />

        {/* Floating Back button */}
        <Link
          href="/places"
          className="absolute top-14 left-4 sm:left-6 flex items-center justify-center w-11 h-11 rounded-2xl tap z-20"
          style={{
            background: 'rgba(7,11,20,0.6)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF',
          }}
        >
          <ChevronLeft size={22} />
        </Link>

        {/* Hero title overlay */}
        <div className="absolute bottom-0 left-0 right-0 inner pb-6 z-10">
          <div
            className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-xl"
            style={{
              background: `${place.accentColor}DD`,
              backdropFilter: 'blur(10px)',
              color: '#FFFFFF', fontSize: 12, fontWeight: 800,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
          >
            <PlaceTypeIcon type={place.type} />
            {place.typeLabel}
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.6rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.15,
              letterSpacing: '-0.035em',
              textShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}
          >
            {place.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600 }}>
              <MapPin size={13} style={{ color: place.accentColor }} /> {place.city}
            </div>
            <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600 }}>
              <Calendar size={13} style={{ color: '#F59E0B' }} /> Scheduled for Day {place.visitDay}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="inner flex flex-col gap-6 pt-6">

        {/* Quick Essential Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div
            className="p-4 rounded-2xl flex items-start gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Clock size={18} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>OPENING HOURS</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{place.timings}</div>
            </div>
          </div>

          <div
            className="p-4 rounded-2xl flex items-start gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: 'rgba(245,158,11,0.14)', color: '#F59E0B' }}>
              <Ticket size={18} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>ENTRY FEE</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{place.entryFee}</div>
            </div>
          </div>

          <div
            className="p-4 rounded-2xl flex items-start gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: 'rgba(16,185,129,0.14)', color: '#10B981' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>BEST TIME TO VISIT</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{place.bestTimeToVisit}</div>
            </div>
          </div>

          <div
            className="p-4 rounded-2xl flex items-start gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: 'rgba(139,92,246,0.14)', color: '#8B5CF6' }}>
              <Shirt size={18} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>DRESS CODE &amp; ATTIRE</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{place.dressCode}</div>
            </div>
          </div>
        </div>

        {/* Overview & Description */}
        <div className="card-elevated p-6" style={{ borderRadius: 28 }}>
          <div className="flex items-center gap-2.5 mb-3">
            <Compass size={18} style={{ color: place.accentColor }} />
            <h2 className="heading-md">About &amp; Overview</h2>
          </div>
          <p className="body-sm" style={{ fontSize: 14.5, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
            {place.description}
          </p>
        </div>

        {/* Detailed History & Mythology */}
        <div className="card-elevated p-6" style={{ borderRadius: 28 }}>
          <div className="flex items-center gap-2.5 mb-3">
            <History size={18} style={{ color: '#F59E0B' }} />
            <h2 className="heading-md">History &amp; Spiritual Significance</h2>
          </div>
          <p className="body-sm" style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
            {place.history}
          </p>
        </div>

        {/* Key Attractions Inside */}
        <div className="card-elevated p-6" style={{ borderRadius: 28 }}>
          <div className="flex items-center gap-2.5 mb-4">
            <Eye size={18} style={{ color: '#10B981' }} />
            <h2 className="heading-md">Key Attractions &amp; Highlights Inside</h2>
          </div>
          <div className="flex flex-col gap-3">
            {place.keyAttractions.map((att, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {att}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fascinating Facts */}
        <div className="card-elevated p-6" style={{ borderRadius: 28 }}>
          <div className="flex items-center gap-2.5 mb-4">
            <Lightbulb size={18} style={{ color: '#EC4899' }} />
            <h2 className="heading-md">Fascinating Facts</h2>
          </div>
          <div className="flex flex-col gap-3.5">
            {place.facts.map((fact, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <div
                  className="flex items-center justify-center flex-shrink-0 rounded-xl"
                  style={{
                    width: 30, height: 30,
                    background: `${place.accentColor}18`,
                    color: place.accentColor,
                    fontSize: 12, fontWeight: 900, flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500, paddingTop: 4 }}>
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Practical Traveler Tips */}
        <div
          className="p-6 rounded-3xl"
          style={{ background: `${place.accentColor}10`, border: `1px solid ${place.accentColor}30` }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <ShieldAlert size={18} style={{ color: place.accentColor }} />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Traveler Practical Tips for Day {place.visitDay}
            </h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {place.travelTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span style={{ color: place.accentColor, fontSize: 14, fontWeight: 900 }}>&bull;</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.5 }}>
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <Link
          href="/places"
          className="tap flex items-center justify-center gap-2 mt-2 py-4 rounded-2xl"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 700 }}
        >
          <ChevronLeft size={16} /> Return to Places Overview
        </Link>
      </div>
    </div>
  );
}
