'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { PLACES } from '@/lib/tripData';
import { MapPin, ChevronLeft, Lightbulb, Calendar, Mountain, Zap, Star, Leaf } from 'lucide-react';
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
    <div style={{ minHeight: '100dvh', paddingBottom: 40 }}>

      {/* Hero */}
      <div
        className="relative"
        style={{ height: 340 }}
      >
        <img
          src={place.coverImage}
          alt={place.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)',
          }}
        />

        {/* Back button */}
        <Link
          href="/places"
          className="absolute top-14 left-4 flex items-center justify-center w-10 h-10 rounded-2xl tap"
          style={{
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
          }}
        >
          <ChevronLeft size={20} />
        </Link>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div
            className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-xl"
            style={{
              background: `${place.accentColor}CC`,
              backdropFilter: 'blur(8px)',
              color: '#fff', fontSize: 12, fontWeight: 700,
            }}
          >
            <PlaceTypeIcon type={place.type} />
            {place.typeLabel}
          </div>

          <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.03em' }}>
            {place.name}
          </h1>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
              <MapPin size={11} /> {place.city}
            </div>
            <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
              <Calendar size={11} /> Day {place.visitDay}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="inner pt-5">

        {/* Description */}
        <div className="card-elevated p-5 mb-4" style={{ borderRadius: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 10 }}>About This Place</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, fontWeight: 500 }}>
            {place.description}
          </p>
        </div>

        {/* Amazing Facts */}
        <div className="card-elevated p-5 mb-4" style={{ borderRadius: 24 }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-xl"
              style={{ background: `${place.accentColor}20` }}
            >
              <Lightbulb size={15} style={{ color: place.accentColor }} />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>Amazing Facts</h2>
          </div>

          <div className="flex flex-col gap-4">
            {place.facts.map((fact, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center flex-shrink-0 rounded-xl"
                  style={{
                    width: 28, height: 28,
                    background: `${place.accentColor}18`,
                    color: place.accentColor,
                    fontSize: 12, fontWeight: 800, flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, fontWeight: 500, paddingTop: 5 }}>
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Visit tip */}
        <div
          className="p-4 rounded-3xl"
          style={{ background: `${place.accentColor}0F`, border: `1px solid ${place.accentColor}25` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} style={{ color: place.accentColor }} />
            <span style={{ fontWeight: 700, fontSize: 13, color: place.accentColor }}>
              Visit Info — Day {place.visitDay}
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            This place is scheduled for <strong>Day {place.visitDay}</strong> of the Maharashtra Tour.
            Plan comfortable footwear and carry water. Best visited early morning to avoid crowds.
          </p>
        </div>

        {/* Back link */}
        <Link
          href="/places"
          className="tap flex items-center justify-center gap-2 mt-5 py-4 rounded-2xl"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600 }}
        >
          <ChevronLeft size={15} /> All Places
        </Link>
      </div>
    </div>
  );
}
