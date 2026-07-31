'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Train, Hotel, Wallet, Compass, ArrowRight,
  ChevronRight, Calendar, Users, Zap, Clock,
  Mountain, Waves, Leaf, Star, Map
} from 'lucide-react';
import { ITINERARY, TRIP_CONFIG, HOTELS, TRAINS, PLACES, PLACE_IMAGES } from '@/lib/tripData';

// ── Countdown ────────────────────────────────────────────
function useCountdown(target: string) {
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
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  });
  return t;
}

// ── Countdown Digit ──────────────────────────────────────
function Digit({ val, label }: { val: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        style={{
          width: 54, height: 54, borderRadius: 16,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 900, color: '#fff',
          letterSpacing: '-0.04em', backdropFilter: 'blur(8px)',
        }}
      >
        {String(val).padStart(2, '0')}
      </div>
      <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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

// ── Route Chip ────────────────────────────────────────────
function RouteChip({ code, active }: { code: string; active?: boolean }) {
  return (
    <div
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 10,
        padding: '5px 10px',
        background: active ? 'rgba(59,130,246,0.9)' : 'rgba(255,255,255,0.12)',
        border: `1px solid ${active ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.18)'}`,
        fontSize: 11, fontWeight: 800, color: '#fff',
        backdropFilter: 'blur(8px)',
        letterSpacing: '0.02em',
      }}
    >
      {code}
    </div>
  );
}

// ── Quick Link ────────────────────────────────────────────
function QuickLink({ href, icon: Icon, label, sub, color, id }: {
  href: string; icon: React.ElementType; label: string; sub: string; color: string; id: string;
}) {
  return (
    <Link href={href} className="tap flex-shrink-0" id={id}>
      <div
        className="flex flex-col gap-3"
        style={{
          width: 120,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 16,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="flex items-center justify-center w-10 h-10 rounded-2xl"
          style={{ background: `${color}18` }}
        >
          <Icon size={20} color={color} strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {label}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>
            {sub}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Section Header ────────────────────────────────────────
function SH({ label, title, href }: { label: string; title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between inner mb-3">
      <div>
        <p className="label-sm">{label}</p>
        <h2 className="heading-lg" style={{ fontSize: '1.25rem', marginTop: 2 }}>{title}</h2>
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1 tap" style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700 }}>
          See all <ArrowRight size={13} />
        </Link>
      )}
    </div>
  );
}

// ── Main Home Page ────────────────────────────────────────
export default function HomePage() {
  const t = useCountdown(TRIP_CONFIG.departureDate);
  const heroRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-el', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
      gsap.fromTo('.body-el', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out', delay: 0.4 });
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

      {/* ─── HERO ─────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ minHeight: 420, paddingTop: 'calc(var(--header-height) + 8px)', paddingBottom: 32 }}
      >
        {/* Background photo */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(180deg, rgba(7,11,20,0.15) 0%, rgba(7,11,20,0.55) 55%, rgba(7,11,20,0.98) 100%),
              url(${PLACE_IMAGES.hero})
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />

        {/* Content */}
        <div className="relative z-10 inner flex flex-col gap-4">

          {/* Status pill */}
          <div className="hero-el">
            <div
              className="pill pill-sm inline-flex"
              style={{
                background: t.live ? 'rgba(16,185,129,0.85)' : 'rgba(245,158,11,0.85)',
                color: '#fff',
                border: 'none',
                backdropFilter: 'blur(8px)',
                fontSize: 11,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#fff', animation: 'pulse 1.5s infinite' }}
              />
              {t.live ? 'Trip is Live Now!' : t.over ? 'Trip Completed' : `${t.d}d ${t.h}h to Departure`}
            </div>
          </div>

          {/* Title */}
          <div className="hero-el">
            <h1 style={{ fontSize: 'clamp(1.7rem, 6vw, 2.6rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.04em' }}>
              Ancient
              <br />
              <span style={{ background: 'linear-gradient(90deg,#60A5FA,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Maharashtra
              </span>
              <br />
              Tour
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 8, fontWeight: 500 }}>
              Mitra Family &bull; Ghosh Family &bull; {TRIP_CONFIG.totalDays} Days &bull; 3 Jyotirlingas
            </p>
          </div>

          {/* Route */}
          <div className="hero-el flex items-center gap-2 flex-wrap">
            {['HWH', '→', 'JLG', '→', 'AUR', '→', 'SRD', '→', 'NK', '→', 'PUNE', '→', 'HWH'].map((c, i) =>
              c === '→'
                ? <span key={i} style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>→</span>
                : <RouteChip key={i} code={c} active={c === 'HWH'} />
            )}
          </div>

          {/* Countdown */}
          {!t.live && !t.over && (
            <div className="hero-el flex items-center gap-3">
              <Digit val={t.d} label="Days" />
              <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>:</span>
              <Digit val={t.h} label="Hrs" />
              <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>:</span>
              <Digit val={t.m} label="Min" />
              <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>:</span>
              <Digit val={t.s} label="Sec" />
            </div>
          )}

          {/* Families */}
          <div className="hero-el flex items-center gap-3">
            {TRIP_CONFIG.families.map((f) => (
              <div key={f.id} className="flex items-center gap-2">
                <div
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: f.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: '#fff',
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}
                >
                  {f.avatar}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                  {f.family}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── BODY ─────────────────────────────────────── */}
      <div ref={bodyRef} className="flex flex-col gap-8 py-6" style={{ paddingBottom: 24 }}>

        {/* Today's highlight (if trip is live) */}
        {t.live && todayDay && (
          <div className="inner body-el">
            <div className="card-elevated overflow-hidden" style={{ borderRadius: 24 }}>
              <div
                className="relative"
                style={{
                  height: 160,
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.75)), url(${todayDay.coverImage})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }}
              >
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="pill pill-sm pill-blue mb-2">Day {todayDay.day} — Today</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{todayDay.title}</div>
                  <div className="flex items-center gap-1 mt-1" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                    <MapPin size={11} /> {todayDay.location}
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2.5">
                {todayDay.activities.slice(0, 3).map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', minWidth: 40 }}>{a.time}</span>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{a.title}</span>
                  </div>
                ))}
                <Link href="/itinerary" className="flex items-center gap-1 mt-1" style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700 }}>
                  Full Day View <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Access */}
        <div className="body-el">
          <p className="label-sm inner mb-3">Quick Access</p>
          <div className="scroll-x px-4 md:px-6" style={{ paddingLeft: 18, paddingRight: 18 }}>
            <QuickLink href="/itinerary" icon={Map} label="Journey" sub="11 Days" color="#3B82F6" id="ql-itinerary" />
            <QuickLink href="/trains" icon={Train} label="Trains" sub="2 Bookings" color="#8B5CF6" id="ql-trains" />
            <QuickLink href="/hotels" icon={Hotel} label="Hotels" sub="5 Hotels" color="#F59E0B" id="ql-hotels" />
            <QuickLink href="/expenses" icon={Wallet} label="Expenses" sub="Split Bills" color="#10B981" id="ql-expenses" />
            <QuickLink href="/places" icon={Compass} label="Explore" sub="8 Places" color="#EC4899" id="ql-places" />
          </div>
        </div>

        {/* Upcoming Train */}
        <div className="inner body-el">
          <SH label="Upcoming" title="First Train" href="/trains" />
          <Link href="/trains" className="tap">
            <div
              className="relative overflow-hidden rounded-3xl p-5"
              style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #4F46E5 100%)', boxShadow: '0 12px 40px rgba(59,130,246,0.3)' }}
            >
              {/* Blurry circle accent */}
              <div className="orb" style={{ width: 200, height: 200, top: -80, right: -60, background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)' }} />

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em' }}>TRAIN {TRAINS[0].number}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{TRAINS[0].name}</p>
                </div>
                <div className="pill pill-sm" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                  {TRAINS[0].classes.join(' · ')}
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1 }}>
                    {TRAINS[0].fromCode}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{TRAINS[0].from}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'rgba(255,255,255,0.95)', marginTop: 4 }}>
                    {TRAINS[0].departure}
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center gap-1">
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{TRAINS[0].duration}</span>
                  <div className="flex items-center w-full gap-1">
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.2)' }} />
                    <Train size={14} color="rgba(255,255,255,0.6)" />
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.2)' }} />
                  </div>
                </div>

                <div className="text-right">
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1 }}>
                    {TRAINS[0].toCode}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{TRAINS[0].to}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'rgba(255,255,255,0.95)', marginTop: 4 }}>
                    {TRAINS[0].arrival}
                  </div>
                </div>
              </div>

              <div
                className="flex items-center justify-between mt-4 pt-4 relative z-10"
                style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
              >
                <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                  <Calendar size={11} /> {TRAINS[0].departureDate}
                </div>
                <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 700 }}>
                  View Tickets <ChevronRight size={13} />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* First Hotel */}
        <div className="inner body-el">
          <SH label="First Stay" title="Hotel" href="/hotels" />
          <Link href="/hotels" className="tap">
            <div className="card-elevated overflow-hidden" style={{ borderRadius: 24 }}>
              <div
                className="relative"
                style={{
                  height: 140,
                  backgroundImage: `linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%), url(${HOTELS[0].coverImage})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }}
              >
                <div className="absolute top-3 right-3">
                  <div className="pill pill-sm pill-amber">
                    <Calendar size={9} />
                    {HOTELS[0].nights} Night
                  </div>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{HOTELS[0].name}</div>
                  <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
                    <MapPin size={10} /> {HOTELS[0].city}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {HOTELS[0].amenities.map((a) => (
                    <span key={a} className="pill pill-sm pill-muted">{a}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Check-in: {HOTELS[0].checkIn}</span>
                  <div className="flex items-center gap-1" style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>
                    Details <ChevronRight size={13} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Itinerary preview */}
        <div className="body-el">
          <SH label="The Journey" title="11-Day Itinerary" href="/itinerary" />
          <div className="flex flex-col" style={{ gap: 0 }}>
            {ITINERARY.slice(0, 5).map((day, i) => (
              <Link key={day.day} href="/itinerary" className="tap">
                <div
                  className="flex items-center gap-4 px-5 py-4 transition-all duration-150"
                  style={{
                    borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Photo circle */}
                  <div
                    style={{
                      width: 48, height: 48, borderRadius: 16, overflow: 'hidden', flexShrink: 0,
                      backgroundImage: `url(${day.coverImage})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="pill pill-sm pill-muted">Day {day.day}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{day.date}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {day.title}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{day.location}</span>
                    </div>
                  </div>

                  <ChevronRight size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </div>
              </Link>
            ))}

            <div className="inner mt-3">
              <Link href="/itinerary" className="tap">
                <div
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl"
                  style={{ border: '1.5px dashed var(--border)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600 }}
                >
                  <Map size={15} /> View Full 11-Day Journey
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Places carousel */}
        <div className="body-el">
          <SH label="Highlights" title="Places We're Visiting" href="/places" />
          <div className="scroll-x" style={{ paddingLeft: 18, paddingRight: 18, gap: 14 }}>
            {PLACES.map((place) => (
              <Link key={place.id} href={`/places/${place.slug}`} className="tap">
                <div
                  className="photo-card"
                  style={{ width: 160, height: 210 }}
                >
                  <img src={place.coverImage} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="photo-card-overlay" />

                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="pill pill-sm mb-2" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', alignSelf: 'flex-start' }}>
                      <PlaceTypeIcon type={place.type} />
                      {place.typeLabel}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                      {place.name}
                    </div>
                    <div className="flex items-center gap-1 mt-1" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>
                      <MapPin size={9} /> {place.city}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Expense CTA */}
        <div className="inner body-el">
          <div
            className="flex items-center justify-between p-5 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Track Trip Expenses
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>
                Split bills instantly between families
              </div>
            </div>
            <Link href="/expenses">
              <div
                className="tap flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                  borderRadius: 14, padding: '10px 16px',
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
                }}
              >
                Open <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
