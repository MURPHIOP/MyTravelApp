'use client';

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { HOTELS } from '@/lib/tripData';
import { MapPin, Calendar, Wifi, Wind, Car, UtensilsCrossed, Droplets, Download, ExternalLink, ChevronRight } from 'lucide-react';

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={13} />,
  AC: <Wind size={13} />,
  Parking: <Car size={13} />,
  Restaurant: <UtensilsCrossed size={13} />,
  'Vegetarian Food': <UtensilsCrossed size={13} />,
  Breakfast: <UtensilsCrossed size={13} />,
  Pool: <Droplets size={13} />,
  Spa: <Droplets size={13} />,
};

function HotelCard({ hotel }: { hotel: typeof HOTELS[0] }) {
  return (
    <div
      className="hotel-card card-elevated overflow-hidden"
      style={{ borderRadius: 28 }}
    >
      {/* Photo Header */}
      <div
        className="relative"
        style={{
          height: 220,
          backgroundImage: `
            linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.92) 100%),
            url(${hotel.coverImage})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Nights badge */}
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
            <Calendar size={12} />
            {hotel.nights} Night{hotel.nights > 1 ? 's' : ''}
          </div>
        </div>

        {/* Days badge */}
        <div className="absolute top-4 left-4 flex gap-1.5">
          {hotel.days.map(d => (
            <span
              key={d}
              className="pill pill-sm"
              style={{
                background: 'rgba(0,0,0,0.5)',
                color: '#FFFFFF',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: 11,
              }}
            >
              Day {d}
            </span>
          ))}
        </div>

        {/* Hotel Title Overlay */}
        <div className="absolute bottom-4 left-5 right-5">
          <h3
            style={{
              fontSize: '1.3rem',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.2,
              textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            }}
          >
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
            <MapPin size={12} /> {hotel.city}
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className="p-6">
        {/* Dates Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div
            className="p-3.5 rounded-2xl flex flex-col gap-1"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>CHECK-IN</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{hotel.checkIn}</span>
          </div>
          <div
            className="p-3.5 rounded-2xl flex flex-col gap-1"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>CHECK-OUT</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{hotel.checkOut}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-5">
          {hotel.amenities.map((a) => (
            <div key={a} className="pill pill-sm pill-muted flex items-center gap-1.5">
              {AMENITY_ICONS[a] ?? null}
              {a}
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 mb-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <MapPin size={15} style={{ color: 'var(--text-muted)', marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>
            {hotel.address}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={hotel.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost tap w-full"
            style={{ padding: '12px 18px', borderRadius: 16, fontSize: 14 }}
          >
            <ExternalLink size={15} /> View Location Map
          </a>
          {hotel.bookingPassUrl ? (
            <a
              href={hotel.bookingPassUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary tap w-full"
              style={{ padding: '12px 18px', borderRadius: 16, fontSize: 14 }}
            >
              <Download size={15} /> Download Booking Pass
            </a>
          ) : (
            <div
              className="flex items-center justify-center gap-2 rounded-2xl w-full"
              style={{
                background: 'var(--surface-2)',
                border: '1.5px dashed var(--border)',
                color: 'var(--text-muted)',
                fontSize: 13,
                fontWeight: 700,
                padding: '12px 18px',
              }}
            >
              <Download size={15} /> Pass Pending Upload
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  useEffect(() => {
    gsap.fromTo(
      '.hotel-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.55, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="inner py-8">
      <div className="mb-6">
        <p className="label-sm">5 Nights Across Maharashtra</p>
        <h1 className="heading-lg" style={{ marginTop: 2 }}>Hotel Bookings</h1>
        <p className="body-sm mt-1">Confirmed stays for Mitra &amp; Ghosh families across all tour stops.</p>
      </div>

      {/* Hotel Cities Timeline Bar */}
      <div
        className="flex items-center gap-2 p-3.5 rounded-2xl mb-6 scroll-x"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        {HOTELS.map((h, i) => (
          <React.Fragment key={h.id}>
            <div className="flex-shrink-0 text-center">
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
                Day {h.days[0]}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: 'var(--accent)',
                  background: 'var(--accent-light)',
                  borderRadius: 10,
                  padding: '5px 10px',
                  whiteSpace: 'nowrap',
                }}
              >
                {h.city}
              </div>
            </div>
            {i < HOTELS.length - 1 && (
              <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {HOTELS.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}
