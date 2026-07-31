'use client';

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { TRAINS } from '@/lib/tripData';
import {
  Train, Calendar, Clock, ArrowRight, Download,
  AlertCircle, ChevronRight, Users
} from 'lucide-react';

function TrainCard({ train }: { train: typeof TRAINS[0] }) {
  return (
    <div
      className="train-card overflow-hidden rounded-3xl"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Top Banner Header */}
      <div
        className="px-6 py-5 flex items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
          color: '#FFFFFF',
        }}
      >
        <div>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em' }}>
            TRAIN #{train.number}
          </span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', marginTop: 2, letterSpacing: '-0.02em' }}>
            {train.name}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {train.classes.map(c => (
            <span
              key={c}
              style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 10,
                padding: '4px 10px',
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

      {/* Route & Timings Section */}
      <div className="p-6">
        <div className="grid grid-cols-3 items-center gap-4 text-center mb-6">
          {/* Departure */}
          <div className="text-left">
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.05em', lineHeight: 1 }}>
              {train.fromCode}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 4 }}>
              {train.from}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)', marginTop: 8 }}>
              {train.departure}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>
              {train.departureDate}
            </div>
          </div>

          {/* Duration Indicator */}
          <div className="flex flex-col items-center gap-2 px-2">
            <div className="pill pill-sm pill-blue">
              <Clock size={12} /> {train.duration}
            </div>
            <div className="flex items-center w-full gap-2 mt-1">
              <div className="flex-1 h-0.5" style={{ background: 'var(--border)' }} />
              <Train size={20} style={{ color: 'var(--accent)' }} />
              <div className="flex-1 h-0.5" style={{ background: 'var(--border)' }} />
            </div>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.05em', lineHeight: 1 }}>
              {train.toCode}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 4 }}>
              {train.to}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)', marginTop: 8 }}>
              {train.arrival}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>
              {train.arrivalDate}
            </div>
          </div>
        </div>

        {/* Family Tickets Divider */}
        <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="label-sm mb-3">Family Tickets &amp; Passes</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['Mitra Family', 'Ghosh Family'].map((family, fi) => {
              const ticketKey = fi === 0 ? 'mitra' : 'ghosh';
              const ticketUrl = train.tickets[ticketKey as keyof typeof train.tickets];

              return (
                <div
                  key={family}
                  className="flex items-center justify-between p-4 rounded-2xl"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-2xl"
                      style={{ background: fi === 0 ? 'rgba(59,130,246,0.14)' : 'rgba(139,92,246,0.14)' }}
                    >
                      <Users size={18} style={{ color: fi === 0 ? '#3B82F6' : '#8B5CF6' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>{family}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                        {ticketUrl ? 'Pass Ready' : 'Pending Backend Upload'}
                      </div>
                    </div>
                  </div>

                  {ticketUrl ? (
                    <a
                      href={ticketUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost tap"
                      style={{ padding: '8px 14px', fontSize: 13 }}
                    >
                      <Download size={14} /> Download
                    </a>
                  ) : (
                    <span className="pill pill-sm pill-amber">
                      Pending
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Platform Note */}
          <div
            className="flex items-center gap-2.5 mt-4 p-3.5 rounded-2xl"
            style={{ background: 'var(--accent-light)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <AlertCircle size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>
              Platform: <strong>{train.platform}</strong> &bull; Confirm live platform on NTES 3 hours before departure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrainsPage() {
  useEffect(() => {
    gsap.fromTo(
      '.train-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.55, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="inner py-8">
      <div className="mb-6">
        <p className="label-sm">Train Bookings</p>
        <h1 className="heading-lg" style={{ marginTop: 2 }}>Train Information</h1>
        <p className="body-sm mt-1">Both departure and return train tickets for Mitra &amp; Ghosh families.</p>
      </div>

      <div className="flex flex-col gap-6">
        {TRAINS.map((train) => (
          <TrainCard key={train.id} train={train} />
        ))}
      </div>

      {/* NTES Link */}
      <div
        className="mt-6 flex items-center justify-between p-5 rounded-3xl tap"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        onClick={() => window.open('https://enquiry.indianrail.gov.in', '_blank')}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>Live Train Running Status</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Check platform and delay info on NTES</div>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
      </div>
    </div>
  );
}
