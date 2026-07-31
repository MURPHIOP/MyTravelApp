'use client';

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { HOTELS } from '@/lib/tripData';
import { MapPin, Calendar, Wifi, Wind, Car, UtensilsCrossed, Droplets, Download, ExternalLink, ChevronRight } from 'lucide-react';

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={12} />,
  AC: <Wind size={12} />,
  Parking: <Car size={12} />,
  Restaurant: <UtensilsCrossed size={12} />,
  'Vegetarian Food': <UtensilsCrossed size={12} />,
  Breakfast: <UtensilsCrossed size={12} />,
  Pool: <Droplets size={12} />,
  Spa: <Droplets size={12} />,
};

function HotelCard({ hotel }: { hotel: typeof HOTELS[0] }) {
  return (
    <div
      className="hotel-card card-elevated overflow-hidden"
      style={{ borderRadius: 28 }}
    >
      {/* Photo header */}
      <div
        className="relative"
        style={{
          height: 180,
          backgroundImage: `
            linear-gradient(180deg, transparent 25%, rgba(0,0,0,0.75) 100%),
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
              background: `${hotel.color}CC`,
              color: '#fff',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Calendar size={10} />
            {hotel.nights} Night{hotel.nights > 1 ? 's' : ''}
          </div>
        </div>

        {/* Hotel name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {hotel.days.map(d => (
              <div
                key={d}
                className="pill pill-sm"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 10 }}
              >
                Day {d}
              </div>
            ))}
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{hotel.name}</h3>
          <div className="flex items-center gap-1 mt-1" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
            <MapPin size={10} /> {hotel.city}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Dates */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex-1 p-3 rounded-2xl flex flex-col gap-0.5"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>CHECK-IN</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{hotel.checkIn}</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 16 }}>→</div>
          <div
            className="flex-1 p-3 rounded-2xl flex flex-col gap-0.5"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>CHECK-OUT</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{hotel.checkOut}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.map((a) => (
            <div
              key={a}
              className="pill pill-sm pill-muted flex items-center gap-1"
            >
              {AMENITY_ICONS[a] ?? null}
              {a}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider mb-4" />

        {/* Address */}
        <div className="flex items-start gap-2 mb-4">
          <MapPin size={13} style={{ color: 'var(--text-muted)', marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{hotel.address}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <a
            href={hotel.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost tap flex-1"
            style={{ padding: '11px 16px', borderRadius: 14, fontSize: 13 }}
          >
            <ExternalLink size={14} /> View on Map
          </a>
          {hotel.bookingPassUrl ? (
            <a
              href={hotel.bookingPassUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary tap flex-1"
              style={{ padding: '11px 16px', borderRadius: 14, fontSize: 13 }}
            >
              <Download size={14} /> Booking Pass
            </a>
          ) : (
            <div
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl"
              style={{
                background: 'var(--surface-2)', border: '1.5px dashed var(--border)',
                color: 'var(--text-muted)', fontSize: 13, fontWeight: 600,
              }}
            >
              <Download size={14} /> Pass Pending
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  useEffect(() => {
    gsap.fromTo('.hotel-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.55, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  return (
    <div className="inner py-6" style={{ paddingTop: 'calc(var(--header-height) + 16px)' }}>
      <div className="mb-6">
        <p className="label-sm">5 Nights Across Maharashtra</p>
        <h1 className="heading-lg">Hotel Bookings</h1>
        <p className="body-sm mt-1">All booking passes will be available for download once uploaded by the family heads.</p>
      </div>

      {/* Route timeline mini */}
      <div
        className="flex items-center gap-2 p-3 rounded-2xl mb-6 scroll-x"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
      >
        {HOTELS.map((h, i) => (
          <React.Fragment key={h.id}>
            <div className="flex-shrink-0 text-center">
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
                D{h.days[0]}
              </div>
              <div
                style={{
                  fontSize: 11, fontWeight: 800, color: h.color,
                  background: `${h.color}15`, borderRadius: 8, padding: '4px 8px', whiteSpace: 'nowrap',
                }}
              >
                {h.city}
              </div>
            </div>
            {i < HOTELS.length - 1 && (
              <ChevronRight size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        {HOTELS.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}
