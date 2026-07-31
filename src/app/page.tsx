'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import {
  MapPin, Train, Hotel, Wallet, Compass, ArrowRight,
  ChevronRight, Calendar, Users, Zap, Clock,
  Mountain, Star, Leaf, Map, Sparkles, ShieldCheck, LucideIcon
} from 'lucide-react';
import { ITINERARY, TRIP_CONFIG, HOTELS, TRAINS, PLACES, PLACE_IMAGES } from '@/lib/tripData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Countdown Hook ────────────────────────────────────────
function useCountdown(target: string) {
  const [mounted, setMounted] = useState(false);
  const calc = () => {
    const now = Date.now();
    const start = new Date(TRIP_CONFIG.departureDate).getTime();
    const end = new Date(TRIP_CONFIG.returnDate).getTime();
    if (now >= start && now <= end) return { live: true, over: false, d: 0, h: 0, m: 0, s: 0 };
    if (now > end) return { live: false, over: true, d: 0, h: 0, m: 0, s: 0 };
    const diff = start - now;
    return {
      live: false, over: false,
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc());
  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return mounted ? t : { live: false, over: false, d: 0, h: 0, m: 0, s: 0 };
}

// ── Countdown Digit ──────────────────────────────────────
function Digit({ val, label }: { val: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{
          width: 52,
          height: 52,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.22)',
          fontSize: '1.4rem',
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '-0.04em',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}
      >
        {String(val).padStart(2, '0')}
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );
}

// ── Place Icon ────────────────────────────────────────────
function PlaceTypeIcon({ type }: { type: string }) {
  const props = { size: 14, strokeWidth: 2 };
  if (type === 'heritage') return <Mountain {...props} />;
  if (type === 'temple') return <Zap {...props} />;
  if (type === 'experience') return <Star {...props} />;
  return <Leaf {...props} />;
}

// ── Quick Link Card ───────────────────────────────────────
function QuickLinkCard({ href, icon: Icon, label, sub, color, id }: {
  href: string; icon: LucideIcon; label: string; sub: string; color: string; id: string;
}) {
  return (
    <Link href={href} className="tap flex-shrink-0" id={id}>
      <div
        className="flex flex-col gap-3.5 transition-all duration-300 hover:-translate-y-1"
        style={{
          width: 140,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 22,
          padding: '18px 16px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="flex items-center justify-center w-11 h-11 rounded-2xl"
          style={{ background: `${color}16`, color }}
        >
          <Icon size={22} strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {label}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginTop: 3 }}>
            {sub}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Section Header ────────────────────────────────────────
function SectionHeader({ label, title, href }: { label: string; title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <p className="label-sm">{label}</p>
        <h2 className="heading-lg" style={{ marginTop: 2 }}>{title}</h2>
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1.5 tap" style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700 }}>
          See all <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

// ── Main Home Page ────────────────────────────────────────
export default function HomePage() {
  const t = useCountdown(TRIP_CONFIG.departureDate);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero elements animation
      gsap.fromTo(
        '.hero-el',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
      );

      // Section animations
      gsap.fromTo(
        '.home-section',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
      );
    });

    return () => ctx.revert();
  }, []);

  const todayDay = (() => {
    const diff = Math.floor((Date.now() - new Date(TRIP_CONFIG.departureDate).getTime()) / 86400000);
    if (diff < 0 || diff >= ITINERARY.length) return null;
    return ITINERARY[diff];
  })();

  return (
    <div style={{ minHeight: '100dvh' }}>

      {/* ─── HERO WITH PARALLAX ──────────────────────── */}
      <div
        ref={heroRef}
        className="relative overflow-hidden"
        style={{
          minHeight: 460,
          paddingTop: 'calc(var(--header-height) + 16px)',
          paddingBottom: 40,
        }}
      >
        {/* Parallax Background photo */}
        <div
          ref={heroBgRef}
          className="absolute inset-0 z-0 scale-105 transition-transform duration-700"
          style={{
            backgroundImage: `
              linear-gradient(180deg, rgba(7,11,20,0.3) 0%, rgba(7,11,20,0.65) 55%, rgba(7,11,20,0.98) 100%),
              url(${PLACE_IMAGES.hero})
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
          }}
        />

        {/* Hero Content Container */}
        <div className="relative z-10 inner flex flex-col gap-5">

          {/* Status pill */}
          <div className="hero-el">
            <div
              className="pill pill-sm inline-flex items-center gap-2"
              style={{
                background: t.live ? 'rgba(16,185,129,0.9)' : 'rgba(245,158,11,0.9)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(12px)',
                fontSize: 11,
                padding: '6px 14px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: '#FFFFFF', animation: 'pulse 1.5s infinite' }}
              />
              {t.live ? 'Trip is Live Now!' : t.over ? 'Trip Completed' : `${t.d} Days to Departure`}
            </div>
          </div>

          {/* Title */}
          <div className="hero-el">
            <h1
              style={{
                fontSize: 'clamp(2rem, 6vw, 3rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                textShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              Ancient{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #60A5FA 0%, #C084FC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Maharashtra
              </span>{' '}
              Tour
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 8, fontWeight: 500, lineHeight: 1.5 }}>
              Mitra Family &bull; Ghosh Family &bull; {TRIP_CONFIG.totalDays} Days &bull; 3 Jyotirlingas &bull; Oct 16, 2026
            </p>
          </div>

          {/* Route Chips */}
          <div className="hero-el flex items-center gap-2 flex-wrap">
            {['HWH', '→', 'JLG', '→', 'AUR', '→', 'SRD', '→', 'NK', '→', 'PUNE', '→', 'HWH'].map((c, i) =>
              c === '→' ? (
                <span key={i} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>→</span>
              ) : (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    padding: '4px 10px',
                    background: c === 'HWH' ? 'rgba(59,130,246,0.9)' : 'rgba(255,255,255,0.15)',
                    border: `1px solid ${c === 'HWH' ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.2)'}`,
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {c}
                </span>
              )
            )}
          </div>

          {/* Countdown timer */}
          {!t.live && !t.over && (
            <div className="hero-el flex items-center gap-3.5 mt-1">
              <Digit val={t.d} label="Days" />
              <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>:</span>
              <Digit val={t.h} label="Hours" />
              <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>:</span>
              <Digit val={t.m} label="Mins" />
              <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>:</span>
              <Digit val={t.s} label="Secs" />
            </div>
          )}

          {/* Families */}
          <div className="hero-el flex items-center gap-4 pt-2">
            {TRIP_CONFIG.families.map((f) => (
              <div key={f.id} className="flex items-center gap-2.5">
                <div
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: f.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color: '#FFFFFF',
                    border: '2px solid rgba(255,255,255,0.4)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  {f.avatar}
                </div>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', display: 'block', lineHeight: 1.2 }}>
                    {f.family}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                    {f.head}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── BODY CONTAINER ────────────────────────── */}
      <div className="inner flex flex-col gap-10 py-8" style={{ paddingBottom: 32 }}>

        {/* Quick Access Grid */}
        <div className="home-section">
          <p className="label-sm mb-3">Quick Navigation</p>
          <div className="scroll-x pb-2">
            <QuickLinkCard href="/itinerary" icon={Map} label="Journey Map" sub="11 Days Plan" color="#3B82F6" id="ql-itinerary" />
            <QuickLinkCard href="/trains" icon={Train} label="Train Info" sub="2 Journeys" color="#8B5CF6" id="ql-trains" />
            <QuickLinkCard href="/hotels" icon={Hotel} label="Hotels" sub="5 Stays" color="#F59E0B" id="ql-hotels" />
            <QuickLinkCard href="/expenses" icon={Wallet} label="Expenses" sub="Auto Split" color="#10B981" id="ql-expenses" />
            <QuickLinkCard href="/places" icon={Compass} label="Explore" sub="8 Spots" color="#EC4899" id="ql-places" />
          </div>
        </div>

        {/* Today's highlight (if live) */}
        {t.live && todayDay && (
          <div className="home-section">
            <div className="card-elevated overflow-hidden" style={{ borderRadius: 28 }}>
              <div
                className="relative"
                style={{
                  height: 180,
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url(${todayDay.coverImage})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }}
              >
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="pill pill-sm pill-green mb-2">Day {todayDay.day} — Happening Today</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{todayDay.title}</div>
                  <div className="flex items-center gap-1 mt-1" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
                    <MapPin size={12} /> {todayDay.location}
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3">
                {todayDay.activities.slice(0, 3).map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', minWidth: 44 }}>{a.time}</span>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{a.title}</span>
                  </div>
                ))}
                <Link href="/itinerary" className="flex items-center gap-1.5 mt-2" style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 700 }}>
                  View Full Schedule <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Train Card - CLEAN RESPONSIVE DESIGN */}
        <div className="home-section">
          <SectionHeader label="Train Journey" title="Departure Train" href="/trains" />
          <Link href="/trains" className="tap block">
            <div
              className="relative overflow-hidden rounded-3xl p-6"
              style={{
                background: 'linear-gradient(135deg, #1E40AF 0%, #4338CA 100%)',
                boxShadow: '0 16px 48px rgba(30,64,175,0.35)',
                color: '#FFFFFF',
              }}
            >
              <div className="orb" style={{ width: 220, height: 220, top: -80, right: -60, background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)' }} />

              {/* Train Header */}
              <div className="flex items-center justify-between mb-6 relative z-10 gap-3">
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em' }}>
                    TRAIN #{TRAINS[0].number}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
                    {TRAINS[0].name}
                  </h3>
                </div>
                <div
                  className="pill pill-sm"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255,255,255,0.25)',
                    padding: '6px 12px',
                    fontSize: 11,
                  }}
                >
                  {TRAINS[0].classes.join(' &bull; ')}
                </div>
              </div>

              {/* Stations & Duration Row */}
              <div className="grid grid-cols-3 items-center gap-2 relative z-10 mb-6 text-center">
                {/* From Station */}
                <div className="text-left">
                  <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.05em', lineHeight: 1 }}>
                    {TRAINS[0].fromCode}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginTop: 4 }}>
                    {TRAINS[0].from}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
                    {TRAINS[0].departure}
                  </div>
                </div>

                {/* Duration Line */}
                <div className="flex flex-col items-center gap-1.5 px-2">
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 700 }}>
                    {TRAINS[0].duration}
                  </span>
                  <div className="flex items-center w-full gap-2">
                    <div className="flex-1 h-0.5" style={{ background: 'rgba(255,255,255,0.3)' }} />
                    <Train size={18} color="#FFFFFF" />
                    <div className="flex-1 h-0.5" style={{ background: 'rgba(255,255,255,0.3)' }} />
                  </div>
                </div>

                {/* To Station */}
                <div className="text-right">
                  <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.05em', lineHeight: 1 }}>
                    {TRAINS[0].toCode}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginTop: 4 }}>
                    {TRAINS[0].to}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
                    {TRAINS[0].arrival}
                  </div>
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div
                className="flex items-center justify-between pt-4 relative z-10"
                style={{ borderTop: '1px solid rgba(255,255,255,0.18)' }}
              >
                <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                  <Calendar size={14} />
                  <span>Departs: <strong>{TRAINS[0].departureDate}</strong></span>
                </div>
                <div className="flex items-center gap-1" style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 800 }}>
                  View Ticket <ChevronRight size={15} />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* First Hotel Card - CLEAN DESIGN */}
        <div className="home-section">
          <SectionHeader label="First Accommodation" title="Hotel Stay" href="/hotels" />
          <Link href="/hotels" className="tap block">
            <div className="card-elevated overflow-hidden" style={{ borderRadius: 28 }}>
              {/* Hotel Header Image */}
              <div
                className="relative"
                style={{
                  height: 200,
                  backgroundImage: `
                    linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.92) 100%),
                    url(${HOTELS[0].coverImage})
                  `,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute top-4 right-4">
                  <div
                    className="pill pill-sm"
                    style={{
                      background: 'rgba(245,158,11,0.9)',
                      color: '#FFFFFF',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      padding: '6px 12px',
                    }}
                  >
                    <Calendar size={11} /> {HOTELS[0].nights} Night Stay
                  </div>
                </div>
                <div className="absolute bottom-4 left-5 right-5">
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      lineHeight: 1.2,
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    }}
                  >
                    {HOTELS[0].name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
                    <MapPin size={12} /> {HOTELS[0].city}
                  </div>
                </div>
              </div>

              {/* Hotel Info Body */}
              <div className="p-5">
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {HOTELS[0].amenities.map((a) => (
                    <span key={a} className="pill pill-sm pill-muted">{a}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Check-in: <strong>{HOTELS[0].checkIn}</strong>
                  </span>
                  <div className="flex items-center gap-1" style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 800 }}>
                    Hotel Details <ChevronRight size={15} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 11-Day Itinerary Preview */}
        <div className="home-section">
          <SectionHeader label="Detailed Timeline" title="11-Day Itinerary" href="/itinerary" />
          <div className="card overflow-hidden" style={{ borderRadius: 28 }}>
            {ITINERARY.slice(0, 5).map((day, i) => (
              <Link key={day.day} href="/itinerary" className="tap block">
                <div
                  className="flex items-center gap-4 px-5 py-4 transition-colors duration-150"
                  style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 18,
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundImage: `url(${day.coverImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="pill pill-sm pill-muted" style={{ fontSize: 10 }}>Day {day.day}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{day.date}</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {day.title}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{day.location}</span>
                    </div>
                  </div>

                  <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </div>
              </Link>
            ))}

            <div className="p-4" style={{ background: 'var(--surface-2)' }}>
              <Link href="/itinerary" className="tap block">
                <div
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl"
                  style={{ border: '1.5px dashed var(--border)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 700 }}
                >
                  <Map size={16} style={{ color: 'var(--accent)' }} /> Explore Complete 11-Day Journey
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Places Carousel */}
        <div className="home-section">
          <SectionHeader label="Must-Visit Spots" title="Places &amp; Temples" href="/places" />
          <div className="scroll-x">
            {PLACES.map((place) => (
              <Link key={place.id} href={`/places/${place.slug}`} className="tap block">
                <div className="photo-card" style={{ width: 180, height: 230 }}>
                  <img src={place.coverImage} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="photo-card-overlay" />

                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="pill pill-sm mb-2" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)', alignSelf: 'flex-start' }}>
                      <PlaceTypeIcon type={place.type} />
                      {place.typeLabel}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                      {place.name}
                    </div>
                    <div className="flex items-center gap-1 mt-1" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>
                      <MapPin size={10} /> {place.city}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Track Trip Expenses Banner - FIXED OVERFLOW & LAYOUT */}
        <div className="home-section">
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-3xl gap-4"
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: 'var(--shadow-md)',
              color: '#FFFFFF',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-2xl flex-shrink-0"
                style={{ background: 'rgba(59,130,246,0.2)', color: '#3B82F6' }}
              >
                <Wallet size={24} strokeWidth={2} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  Auto Budget &amp; Split Calculator
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 3, lineHeight: 1.5 }}>
                  Mitra Family &bull; Ghosh Family &bull; Real-time settlement &amp; downloadable invoices
                </p>
              </div>
            </div>
            <Link href="/expenses" className="tap flex-shrink-0 w-full sm:w-auto">
              <div
                className="flex items-center justify-center gap-2"
                style={{
                  background: 'var(--accent-gradient)',
                  borderRadius: 16,
                  padding: '12px 24px',
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 800,
                  boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
                }}
              >
                Open Calculator <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
