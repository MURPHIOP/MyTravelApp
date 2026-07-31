'use client';

import React from 'react';
import { TRIP_CONFIG, ITINERARY, HOTELS, TRAINS } from '@/lib/tripData';
import { User, Calendar, MapPin, Train, Hotel, Wallet, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="inner py-6" style={{ paddingTop: 'calc(var(--header-height) + 16px)' }}>

      {/* Trip card */}
      <div
        className="relative overflow-hidden rounded-3xl mb-6 p-5"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(59,130,246,0.95) 0%, rgba(99,102,241,0.95) 100%)`,
          boxShadow: '0 16px 48px rgba(59,130,246,0.35)',
        }}
      >
        <div className="orb" style={{ width: 200, height: 200, top: -80, right: -60, background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />

        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', marginBottom: 4 }}>
          CURRENT TOUR
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          {TRIP_CONFIG.name}
        </h2>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>
          {TRIP_CONFIG.subtitle}
        </p>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { val: TRIP_CONFIG.totalDays, label: 'Days' },
            { val: HOTELS.length, label: 'Hotels' },
            { val: TRAINS.length, label: 'Trains' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>{s.val}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Families */}
      <div className="mb-6">
        <p className="label-sm mb-3">Families on This Trip</p>
        <div className="flex flex-col gap-3">
          {TRIP_CONFIG.families.map(f => (
            <div
              key={f.id}
              className="flex items-center gap-4 p-4 card"
              style={{ borderRadius: 22 }}
            >
              <div
                style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: f.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 900, flexShrink: 0,
                  boxShadow: `0 8px 24px ${f.color}50`,
                }}
              >
                {f.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{f.head}</div>
                <div style={{ fontSize: 12, color: f.color, fontWeight: 600 }}>{f.family}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Family Head</div>
              </div>
              <Link
                href="/auth/login"
                className="ml-auto btn btn-ghost tap"
                style={{ padding: '8px 14px', borderRadius: 12, fontSize: 12, flexShrink: 0 }}
              >
                Login
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Trip dates */}
      <div className="mb-6">
        <p className="label-sm mb-3">Trip Dates</p>
        <div className="card p-4 flex items-center gap-4" style={{ borderRadius: 22 }}>
          <div className="flex items-center gap-2">
            <Calendar size={15} style={{ color: 'var(--accent)' }} />
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Departure</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>{TRIP_CONFIG.departureDate}</div>
            </div>
          </div>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <div className="flex items-center gap-2 text-right">
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Return</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>{TRIP_CONFIG.returnDate}</div>
            </div>
            <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <p className="label-sm mb-3">Quick Links</p>
      <div className="card overflow-hidden" style={{ borderRadius: 22 }}>
        {[
          { href: '/itinerary', icon: MapPin, label: 'Full Itinerary', color: '#3B82F6' },
          { href: '/trains', icon: Train, label: 'Train Bookings', color: '#8B5CF6' },
          { href: '/hotels', icon: Hotel, label: 'Hotel Bookings', color: '#F59E0B' },
          { href: '/expenses', icon: Wallet, label: 'Expense Tracker', color: '#10B981' },
          { href: '/auth/login', icon: User, label: 'Family Head Login', color: '#EF4444' },
        ].map(({ href, icon: Icon, label, color }, i, arr) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-4 py-4 tap"
            style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: `${color}15`, color }}
            >
              <Icon size={16} strokeWidth={2} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>{label}</span>
            <ExternalLink size={13} style={{ color: 'var(--text-muted)' }} />
          </Link>
        ))}
      </div>

      {/* App version */}
      <p className="text-center mt-8" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        MyTravelApp v1.0 &bull; Ancient Maharashtra Tour 2026
      </p>
    </div>
  );
}
