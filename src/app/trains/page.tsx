'use client';

import React from 'react';
import { Train, Ticket, Clock, AlertCircle } from 'lucide-react';
import { TRAINS } from '@/lib/tripData';

export default function TrainsPage() {
  return (
    <div className="w-full pt-32 pb-24 min-h-screen">
      <div className="container-wide">
        
        <div className="mb-16 max-w-3xl">
          <h1 className="heading-hero text-gradient mb-6">Train Logistics</h1>
          <p className="text-body-large text-muted">
            All train boarding passes, schedules, and live tracking information for the journey.
          </p>
        </div>

        <div className="space-y-8">
          {TRAINS.map((ticket, idx) => (
            <div key={idx} className="glass-card overflow-hidden">
              <div className="p-6 md:p-8 bg-white/5 border-b border-[var(--border-glass)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center backdrop-blur-md border border-indigo-500/30">
                    <Train size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{ticket.name}</h3>
                    <p className="text-muted font-semibold tracking-widest uppercase text-sm mt-1">{ticket.number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-center md:text-right w-full md:w-auto justify-between md:justify-end">
                  <div>
                    <div className="text-3xl font-black text-white">{ticket.departure}</div>
                    <div className="text-muted text-sm font-bold">{ticket.from}</div>
                  </div>
                  <div className="h-px w-16 bg-white/20 relative hidden md:block">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white">{ticket.arrival}</div>
                    <div className="text-muted text-sm font-bold">{ticket.to}</div>
                  </div>
                </div>
                
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[var(--bg-dark)]/50">
                <div className="flex items-start gap-4">
                  <Ticket size={24} className="text-accent-secondary" />
                  <div>
                    <div className="text-sm text-muted font-bold tracking-wider uppercase mb-1">Status</div>
                    <div className="text-lg font-black text-emerald-400">Confirmed</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={24} className="text-blue-400" />
                  <div>
                    <div className="text-sm text-muted font-bold tracking-wider uppercase mb-1">Date</div>
                    <div className="text-lg font-bold text-white">{ticket.departureDate}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <AlertCircle size={24} className="text-yellow-400" />
                  <div>
                    <div className="text-sm text-muted font-bold tracking-wider uppercase mb-1">Coach</div>
                    <div className="text-lg font-bold text-white">B4, B5</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
