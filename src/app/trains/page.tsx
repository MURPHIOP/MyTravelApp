'use client';

import React from 'react';
import { Train, Ticket, Clock, AlertCircle } from 'lucide-react';
import { useTripData } from '@/context/TripDataContext';
import UploadDownload from '@/components/UploadDownload';

export default function TrainsPage() {
  const { trains: TRAINS, setTrains } = useTripData();
  return (
    <div className="w-full pt-32 pb-24 min-h-screen">
      <div className="container-wide">
        
        <div className="mb-24 border-b-4 border-[var(--border-color)] pb-12">
          <div className="inline-block bg-[var(--text-primary)] text-white px-4 py-2 font-mono text-sm font-bold uppercase mb-8 shadow-[4px_4px_0px_0px_var(--accent)]">
            Logistics Module
          </div>
          <h1 className="heading-hero">Train Status</h1>
        </div>

        <div className="space-y-12">
          {TRAINS.map((ticket, idx) => (
            <div key={idx} className="brutal-card p-0 flex flex-col md:flex-row overflow-hidden bg-white">
              
              {/* Train Name & PNR (Left) */}
              <div className="p-8 md:w-1/3 bg-[var(--accent)] text-white border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-between">
                <div>
                  <Train size={48} className="mb-6 opacity-80" />
                  <h3 className="text-4xl font-black uppercase leading-none mb-2">{ticket.name}</h3>
                  <div className="font-mono font-bold tracking-widest text-lg bg-black px-3 py-1 w-max shadow-[4px_4px_0px_0px_white]">
                    {ticket.number}
                  </div>
                </div>
              </div>

              {/* Timing & Stations (Right) */}
              <div className="p-8 md:w-2/3 flex flex-col justify-between">
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 border-b-4 border-dashed border-[var(--border-color)] pb-8">
                  <div className="text-center md:text-left">
                    <div className="font-mono font-black uppercase text-[var(--accent)] mb-2">DEP</div>
                    <div className="text-5xl font-black">{ticket.departure}</div>
                    <div className="font-mono font-bold uppercase tracking-widest mt-2">{ticket.from}</div>
                  </div>
                  
                  <div className="w-full md:w-32 h-2 bg-black relative shadow-[4px_4px_0px_0px_var(--accent)]" />

                  <div className="text-center md:text-right">
                    <div className="font-mono font-black uppercase text-[var(--accent)] mb-2">ARR</div>
                    <div className="text-5xl font-black">{ticket.arrival}</div>
                    <div className="font-mono font-bold uppercase tracking-widest mt-2">{ticket.to}</div>
                  </div>
                </div>

                {/* Status Footer */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono">
                  <div className="border-2 border-black p-4 bg-[#ECFCCB]">
                    <div className="text-xs font-black uppercase mb-2 flex items-center gap-2"><Ticket size={16}/> STATUS</div>
                    <div className="text-xl font-bold uppercase">CONFIRMED</div>
                  </div>
                  <div className="border-2 border-black p-4 bg-white">
                    <div className="text-xs font-black uppercase mb-2 flex items-center gap-2"><Ticket size={16}/> PNR</div>
                    <div className="text-xl font-bold uppercase">{ticket.pnr || 'TBD'}</div>
                  </div>
                  <div className="border-2 border-black p-4 bg-white">
                    <div className="text-xs font-black uppercase mb-2 flex items-center gap-2"><Clock size={16}/> DATE</div>
                    <div className="text-xl font-bold uppercase">{ticket.departureDate}</div>
                  </div>
                  <div className="border-2 border-black p-4 bg-[var(--accent)] text-white">
                    <div className="text-xs font-black uppercase mb-2 flex items-center gap-2 text-white"><AlertCircle size={16}/> COACH</div>
                    <div className="text-xl font-bold uppercase text-white">{ticket.coach || 'TBD'}</div>
                  </div>
                </div>

                {/* Tickets Section */}
                <div className="mt-8 pt-8 border-t-4 border-[var(--border-color)]">
                  <div className="flex flex-col md:flex-row gap-8">
                    <UploadDownload 
                      label="Mitra Family Ticket"
                      currentUrl={ticket.tickets.mitra}
                      storagePathPrefix={`train_${ticket.id}_mitra`}
                      onUploadSuccess={(url) => {
                        const newTrains = [...TRAINS];
                        newTrains[idx].tickets.mitra = url;
                        setTrains(newTrains);
                      }}
                    />
                    <UploadDownload 
                      label="Ghosh Family Ticket"
                      currentUrl={ticket.tickets.ghosh}
                      storagePathPrefix={`train_${ticket.id}_ghosh`}
                      onUploadSuccess={(url) => {
                        const newTrains = [...TRAINS];
                        newTrains[idx].tickets.ghosh = url;
                        setTrains(newTrains);
                      }}
                    />
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
