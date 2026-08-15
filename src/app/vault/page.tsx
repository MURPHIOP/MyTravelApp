'use client';

import React from 'react';
import { CreditCard, Download, ExternalLink, QrCode } from 'lucide-react';
import { TRAINS, HOTELS } from '@/lib/tripData';

// ── PHYSICAL TICKET COMPONENT ─────────────────────────────
function PhysicalTicket({ type, title, subtitle, date, info1, info2, info3 }: any) {
  return (
    <div className="mb-8 relative transition-transform active:scale-95 duration-300">
      {/* ── MAIN TICKET BODY ── */}
      <div 
        className="texture-paper rounded-[24px] rounded-b-none p-5 relative overflow-hidden"
        style={{
          boxShadow: '0 12px 30px rgba(0,0,0,0.4), inset 0 2px 10px rgba(255,255,255,0.8)',
          border: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{type}</div>
            <h3 className="font-extrabold text-xl text-gray-800 leading-tight">{title}</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center opacity-40">
            <QrCode size={36} color="#000" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-6">
          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase">Date</div>
            <div className="font-bold text-sm text-gray-800">{date}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase">{info1.label}</div>
            <div className="font-bold text-sm text-gray-800">{info1.val}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase">{info2.label}</div>
            <div className="font-bold text-sm text-gray-800">{info2.val}</div>
          </div>
        </div>
      </div>

      {/* ── PERFORATED EDGE ── */}
      <div className="texture-paper ticket-edge h-4 w-full relative z-10" />

      {/* ── TEAR-OFF STUB ── */}
      <div 
        className="texture-paper rounded-[24px] rounded-t-none p-4 flex justify-between items-center"
        style={{
          boxShadow: '0 12px 30px rgba(0,0,0,0.4), inset 0 -2px 10px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.1)',
          borderTop: 'none'
        }}
      >
        <div className="flex flex-col">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{info3.label}</div>
          <div className="font-black text-lg text-gray-800">{info3.val}</div>
        </div>
        
        {/* GLOSSY PHYSICAL BUTTON */}
        <button 
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
          style={{
            background: 'linear-gradient(145deg, #FF5E3A, #FF2A54)',
            boxShadow: '0 8px 16px rgba(255,42,84,0.4), inset 0 4px 6px rgba(255,255,255,0.5), inset 0 -4px 6px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <Download size={18} color="#FFF" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default function VaultPage() {
  return (
    <div className="page-content bg-[var(--bg)] min-h-screen">
      
      {/* ── LEATHER WALLET TEXTURE BACKGROUND ── */}
      <div className="fixed inset-0 texture-leather z-[-1]" />

      <div className="pt-8 px-6 pb-6">
        <h1 className="heading-xl flex items-center gap-3 text-[#F1D4B3]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          <CreditCard size={32} /> Vault
        </h1>
        <p className="text-xs font-bold text-orange-200/60 mt-1 uppercase tracking-widest">Travel Documents</p>
      </div>

      <div className="inner pb-12 px-4 md:px-6">
        
        {/* POCKET LIP EFFECT */}
        <div className="w-full h-8 mb-6 rounded-b-[40px] shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-10 bg-[#2C1E16] border-b border-orange-900/30" />

        <div className="text-xs font-black uppercase tracking-[0.2em] text-[#F1D4B3]/60 mb-4 pl-2">Train Tickets</div>
        {TRAINS.map((train, idx) => (
          <PhysicalTicket 
            key={`train-${idx}`}
            type="Boarding Pass"
            title={train.name}
            subtitle={`${train.fromCode} → ${train.toCode}`}
            date={train.departureDate}
            info1={{ label: 'Departure', val: train.departure }}
            info2={{ label: 'Class', val: train.classes[0] }}
            info3={{ label: 'PNR No.', val: '8492019482' }}
          />
        ))}

        <div className="text-xs font-black uppercase tracking-[0.2em] text-[#F1D4B3]/60 mt-10 mb-4 pl-2">Hotel Passes</div>
        {HOTELS.map((hotel, idx) => (
          <PhysicalTicket 
            key={`hotel-${idx}`}
            type="Hotel Voucher"
            title={hotel.name}
            subtitle={hotel.city}
            date={hotel.checkIn}
            info1={{ label: 'Nights', val: hotel.nights }}
            info2={{ label: 'Rooms', val: '2 AC' }}
            info3={{ label: 'Booking ID', val: 'HTL-93820' }}
          />
        ))}

      </div>
    </div>
  );
}
