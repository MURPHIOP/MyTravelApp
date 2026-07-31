'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TRAINS } from '@/lib/tripData';
import {
  Train, Calendar, Clock, ArrowRight, Download,
  AlertCircle, ChevronRight, Users, Tag
} from 'lucide-react';

function TrainCard({ train, index }: { train: typeof TRAINS[0]; index: number }) {
  return (
    <div
      className="train-card overflow-hidden rounded-3xl"
      style={{
        background: `linear-gradient(135deg, ${train.color}18 0%, ${train.color}08 100%)`,
        border: `1px solid ${train.color}30`,
        boxShadow: `0 8px 32px ${train.color}15`,
      }}
    >
      {/* Header bar */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${train.color} 0%, ${train.color}CC 100%)` }}
      >
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em' }}>
            TRAIN NUMBER
          </p>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
            {train.number}
          </h2>
        </div>
        <div className="text-right">
          <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{train.name}</p>
          <div className="flex items-center gap-1.5 justify-end mt-1">
            {train.classes.map(c => (
              <span
                key={c}
                style={{
                  background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: '2px 8px',
                  fontSize: 10, fontWeight: 700, color: '#fff',
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Route display */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-4">
          {/* From */}
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.05em', lineHeight: 1 }}>
              {train.fromCode}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 4 }}>{train.from}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 6 }}>{train.departure}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{train.departureDate}</div>
          </div>

          {/* Middle */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <div
              className="pill pill-sm"
              style={{ background: `${train.color}18`, color: train.color }}
            >
              <Clock size={10} /> {train.duration}
            </div>
            <div className="flex items-center w-full gap-1">
              <div className="flex-1 h-px" style={{ background: `${train.color}40` }} />
              <Train size={16} style={{ color: train.color }} />
              <div className="flex-1 h-px" style={{ background: `${train.color}40` }} />
            </div>
          </div>

          {/* To */}
          <div className="text-right">
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.05em', lineHeight: 1 }}>
              {train.toCode}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 4 }}>{train.to}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 6 }}>{train.arrival}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{train.arrivalDate}</div>
          </div>
        </div>
      </div>

      {/* Ticket notch divider */}
      <div
        className="ticket-notch mx-0"
        style={{ height: 1, background: 'var(--border)', margin: '0 20px', position: 'relative' }}
      />

      {/* Tickets section */}
      <div className="px-5 py-4">
        <p className="label-sm mb-3">Family Tickets</p>
        <div className="flex flex-col gap-3">
          {['Mitra Family', 'Ghosh Family'].map((family, fi) => {
            const ticketKey = fi === 0 ? 'mitra' : 'ghosh';
            const ticketUrl = train.tickets[ticketKey as keyof typeof train.tickets];

            return (
              <div
                key={family}
                className="flex items-center justify-between p-3.5 rounded-2xl"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-xl"
                    style={{ background: fi === 0 ? 'rgba(59,130,246,0.12)' : 'rgba(139,92,246,0.12)' }}
                  >
                    <Users size={15} style={{ color: fi === 0 ? '#3B82F6' : '#8B5CF6' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{family}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {ticketUrl ? 'Ticket Available' : 'Ticket not uploaded yet'}
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
                  <div
                    className="pill pill-sm"
                    style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}
                  >
                    Pending
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Platform info */}
        <div
          className="flex items-center gap-2 mt-4 p-3 rounded-2xl"
          style={{ background: 'var(--accent-light)', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          <AlertCircle size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
            Platform: <strong>{train.platform}</strong> — Confirm on NTES 3–4 hours before departure
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TrainsPage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo('.train-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.55, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  return (
    <div className="inner py-6" style={{ paddingTop: 'calc(var(--header-height) + 16px)' }}>
      <div className="mb-6">
        <p className="label-sm">Both Journeys</p>
        <h1 className="heading-lg">Train Information</h1>
        <p className="body-sm mt-1">Tickets are managed by family heads. Viewers can download their family's ticket below.</p>
      </div>

      <div className="flex flex-col gap-5" ref={ref}>
        {TRAINS.map((train, i) => (
          <TrainCard key={train.id} train={train} index={i} />
        ))}
      </div>

      {/* NTES link */}
      <div
        className="mt-5 flex items-center justify-between p-4 rounded-3xl tap"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        onClick={() => window.open('https://enquiry.indianrail.gov.in', '_blank')}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Live Train Status</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Check on NTES (Indian Railways)</div>
        </div>
        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
      </div>
    </div>
  );
}
