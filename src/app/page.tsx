'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import {
  MapPin, Train, Hotel, Wallet, Compass, ArrowRight,
  ChevronRight, Calendar, Users, Zap, Clock,
  Mountain, Star, Leaf, Map, LucideIcon
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
    <div className="flex flex-col items-center gap-1.5">
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
      <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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

// ── Quick Link Card - SQUARE ICON & CENTER ALIGNED ───────
function QuickLinkCard({ href, icon: Icon, label, sub, color, id }: {
  href: string; icon: LucideIcon; label: string; sub: string; color: string; id: string;
}) {
  return (
    <Link href={href} className="tap flex-shrink-0 block" id={id}>
      <div
        className="flex flex-col items-center justify-center text-center gap-3 p-4 transition-all duration-200 hover:-translate-y-1"
        style={{
          width: 135,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 22,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="flex items-center justify-center w-12 h-12 rounded-2xl flex-shrink-0"
          style={{ background: `${color}16`, color }}
        >
          <Icon size={22} strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {label}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-el',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
      );
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

      {/* ─── HERO BANNER ──────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative overflow-hidden"
        style={{
          minHeight: 460,
          paddingTop: 'calc(var(--header-height) + 16px)',
          paddingBottom: 40,
        }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(180deg, rgba(7,11,20,0.35) 0%, rgba(7,11,20,0.7) 50%, rgba(7,11,20,0.98) 100%),
              url(${PLACE_IMAGES.hero})
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
          }}
        />

        <div className="relative z-10 inner flex flex-col gap-5">

          {/* Status badge */}
          <div className="hero-el">
            <div
              className="pill pill-sm inline-flex items-center gap-2"
              style={{
                background: t.live ? 'rgba(16,185,129,0.95)' : 'rgba(245,158,11,0.95)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(16px)',
                fontSize: 11,
                padding: '6px 14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: '#FFFFFF', animation: 'pulse 1.5s infinite' }}
              />
              {t.live ? 'Trip is Live Now!' : t.over ? 'Trip Completed' : `${t.d} Days to Departure`}
            </div>
          </div>

          {/* Main Title */}
          <div className="hero-el">
            <h1
              style={{
                fontSize: 'clamp(2.1rem, 5.5vw, 3.2rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                textShadow: '0 4px 24px rgba(0,0,0,0.5)',
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
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 8, fontWeight: 500, lineHeight: 1.5 }}>
              Mitra Family • Ghosh Family • 11 Days Tour • Starts Oct 16, 2026
            </p>
          </div>

          {/* Route Chips */}
          <div className="hero-el flex items-center gap-2 flex-wrap">
            {['HWH', '→', 'JLG', '→', 'AUR', '→', 'SRD', '→', 'NK', '→', 'PUNE', '→', 'HWH'].map((c, i) =>
              c === '→' ? (
                <span key={i} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>→</span>
              ) : (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    padding: '5px 12px',
                    background: c === 'HWH' ? 'rgba(59,130,246,0.9)' : 'rgba(255,255,255,0.16)',
                    border: `1px solid ${c === 'HWH' ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.22)'}`,
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {c}
                </span>
              )
            )}
          </div>

          {/* Countdown timer */}
          {!t.live && !t.over && (
            <div className="hero-el flex items-center gap-4 mt-1">
              <Digit val={t.d} label="Days" />
              <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.35)', marginBottom: 22 }}>:</span>
              <Digit val={t.h} label="Hours" />
              <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.35)', marginBottom: 22 }}>:</span>
              <Digit val={t.m} label="Mins" />
              <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.35)', marginBottom: 22 }}>:</span>
              <Digit val={t.s} label="Secs" />
            </div>
          )}

          {/* Family Heads */}
          <div className="hero-el flex items-center gap-6 pt-1">
            {TRIP_CONFIG.families.map((f) => (
              <div key={f.id} className="flex items-center gap-3">
                <div
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: f.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 900, color: '#FFFFFF',
                    border: '2px solid rgba(255,255,255,0.4)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                  }}
                >
                  {f.avatar}
                </div>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF', display: 'block', lineHeight: 1.2 }}>
                    {f.family}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                    {f.head}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT AREA ────────────────────────── */}
      <div className="inner flex flex-col gap-9 py-6" style={{ paddingBottom: 40 }}>

        {/* Quick Access SLIDING Strip (Square icons + Center aligned) */}
        <div className="home-section">
          <p className="label-sm mb-3">Quick Access</p>
          <div className="scroll-x">
            <QuickLinkCard href="/itinerary" icon={Map} label="Journey Map" sub="11 Days Plan" color="#3B82F6" id="ql-itinerary" />
            <QuickLinkCard href="/trains" icon={Train} label="Train Info" sub="2 Journeys" color="#8B5CF6" id="ql-trains" />
            <QuickLinkCard href="/hotels" icon={Hotel} label="Hotels" sub="5 Stays" color="#F59E0B" id="ql-hotels" />
            <QuickLinkCard href="/expenses" icon={Wallet} label="Expenses" sub="Auto Split" color="#10B981" id="ql-expenses" />
            <QuickLinkCard href="/places" icon={Compass} label="Explore" sub="8 Spots" color="#EC4899" id="ql-places" />
          </div>
        </div>

        {/* Departure Train Card - REFINED MARGINS & COMPACT PROPORTIONS */}
        <div className="home-section">
          <SectionHeader label="Train Journey" title="Departure Train" href="/trains" />
          <Link href="/trains" className="tap block">
            <div
              className="relative overflow-hidden rounded-3xl p-5 sm:p-6"
              style={{
                background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                color: '#FFFFFF',
                boxShadow: '0 12px 36px rgba(30,64,175,0.25)',
              }}
            >
              {/* Header Row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex flex-col">
                  <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    TRAIN #{TRAINS[0].number}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', marginTop: 2, lineHeight: 1.2 }}>
                    {TRAINS[0].name}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {TRAINS[0].classes.map((c) => (
                    <span
                      key={c}
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 8,
                        padding: '3px 9px',
                        fontSize: 11,
                        fontWeight: 800,
                        color: '#FFFFFF',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Station Row */}
              <div className="flex items-center justify-between gap-3 my-4">
                {/* Departure */}
                <div className="flex flex-col items-start min-w-[90px]">
                  <span style={{ fontSize: '1.85rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {TRAINS[0].fromCode}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                    {TRAINS[0].from}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
                    {TRAINS[0].departure}
                  </span>
                </div>

                {/* Center Line */}
                <div className="flex-1 flex flex-col items-center px-2">
                  <span className="pill pill-sm" style={{ background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', fontSize: 10, padding: '3px 10px', marginBottom: 6 }}>
                    <Clock size={11} /> {TRAINS[0].duration}
                  </span>
                  <div className="flex items-center w-full gap-2">
                    <div className="flex-1 h-0.5" style={{ background: 'rgba(255,255,255,0.3)' }} />
                    <Train size={16} color="#FFFFFF" className="flex-shrink-0" />
                    <div className="flex-1 h-0.5" style={{ background: 'rgba(255,255,255,0.3)' }} />
                  </div>
                </div>

                {/* Arrival */}
                <div className="flex flex-col items-end text-right min-w-[90px]">
                  <span style={{ fontSize: '1.85rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {TRAINS[0].toCode}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                    {TRAINS[0].to}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
                    {TRAINS[0].arrival}
                  </span>
                </div>
              </div>

              {/* Footer Row */}
              <div
                className="flex items-center justify-between pt-3.5 mt-3 text-xs font-semibold text-white/90"
                style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
              >
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} style={{ color: 'rgba(255,255,255,0.75)' }} />
                  <span>Departs: <strong style={{ color: '#FFFFFF' }}>{TRAINS[0].departureDate}</strong></span>
                </div>
                <div className="flex items-center gap-1 font-extrabold" style={{ color: '#FFFFFF' }}>
                  <span>View Ticket &amp; Passes</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* First Hotel Card */}
        <div className="home-section">
          <SectionHeader label="First Accommodation" title="Hotel Stay" href="/hotels" />
          <Link href="/hotels" className="tap block">
            <div className="card-elevated overflow-hidden" style={{ borderRadius: 28 }}>
              <div
                className="relative"
                style={{
                  height: 200,
                  backgroundImage: `
                    linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.92) 100%),
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
                      background: 'rgba(245,158,11,0.95)',
                      color: '#FFFFFF',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      padding: '6px 12px',
                    }}
                  >
                    <Calendar size={12} /> {HOTELS[0].nights} Night Stay
                  </div>
                </div>
                <div className="absolute bottom-4 left-5 right-5">
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      lineHeight: 1.2,
                      textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                    }}
                  >
                    {HOTELS[0].name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
                    <MapPin size={13} /> {HOTELS[0].city}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 flex-wrap mb-3.5">
                  {HOTELS[0].amenities.map((a) => (
                    <span key={a} className="pill pill-sm pill-muted">{a}</span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between pt-3 gap-2" style={{ borderTop: '1px solid var(--border)' }}>
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
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-150"
                  style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 16,
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundImage: `url(${day.coverImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
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
              <Link key={place.id} href={`/places/${place.slug}`} className="tap block flex-shrink-0">
                <div className="photo-card" style={{ width: 190, height: 250 }}>
                  <img src={place.coverImage} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="photo-card-overlay" />

                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="pill pill-sm mb-2" style={{ background: 'rgba(255,255,255,0.22)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)', alignSelf: 'flex-start', fontSize: 10 }}>
                      <PlaceTypeIcon type={place.type} />
                      {place.typeLabel}
                    </div>
                    <div
                      className="line-clamp-2"
                      style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}
                    >
                      {place.name}
                    </div>
                    <div className="flex items-center gap-1 mt-1.5" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>
                      <MapPin size={10} /> {place.city}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Track Trip Expenses Banner - SINGLE CLICKABLE CARD, ONLY NAME, NO SUBTEXT */}
        <div className="home-section">
          <Link href="/expenses" className="tap block">
            <div
              className="flex items-center justify-between p-5 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                border: '1px solid rgba(255,255,255,0.14)',
                boxShadow: 'var(--shadow-md)',
                color: '#FFFFFF',
              }}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-2xl flex-shrink-0"
                  style={{ background: 'rgba(59,130,246,0.2)', color: '#3B82F6' }}
                >
                  <Wallet size={22} strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  Auto Budget &amp; Split Calculator
                </h3>
              </div>
              <ArrowRight size={20} style={{ color: '#3B82F6', flexShrink: 0 }} />
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
