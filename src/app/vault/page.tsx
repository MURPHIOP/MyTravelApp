'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Download, Share2, ChevronRight, Plus, Search, Trash2 } from 'lucide-react';
import { TRAINS, HOTELS } from '@/lib/tripData';
import BottomSheet from '@/components/ui/BottomSheet';
import TactileButton from '@/components/ui/TactileButton';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

function TicketCard({ type, title, subtitle, date, info1, info2, info3, onClick }: {
  type: string;
  title: string;
  subtitle: string;
  date: string;
  info1: { label: string, val: string };
  info2: { label: string, val: string };
  info3: { label: string, val: string };
  onClick?: () => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="mb-4 cursor-pointer tap-effect"
      onClick={onClick}
    >
      <div className="mat-paper relative overflow-hidden rounded-t-[16px] rounded-b-none p-4 pb-5 border-b-0 shadow-sm">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]" />
        
        <div className="flex justify-between items-start mb-4">
          <div className="pl-2 min-w-0 pr-2">
            <h3 className="text-[17px] font-bold leading-tight mb-1 text-[var(--text-primary)] truncate">{title}</h3>
            <p className="text-xs font-semibold text-[var(--text-secondary)] truncate">{subtitle}</p>
          </div>
          <div className="w-8 h-8 shrink-0 bg-[var(--surface-3)] rounded-lg flex items-center justify-center text-[var(--text-secondary)]">
            <QrCode size={16} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pl-2">
          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider mb-1">Date</div>
            <div className="font-semibold text-[13px] text-[var(--text-primary)]">{date}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider mb-1">{info1.label}</div>
            <div className="font-semibold text-[13px] text-[var(--text-primary)] truncate">{info1.val}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider mb-1">{info2.label}</div>
            <div className="font-semibold text-[13px] text-[var(--text-primary)]">{info2.val}</div>
          </div>
        </div>
      </div>

      <div className="relative h-4 flex items-center overflow-hidden bg-[var(--surface)] border-x border-[rgba(255,255,255,0.05)]">
        <div className="absolute left-[-10px] w-5 h-5 rounded-full bg-[var(--bg)] shadow-[inset_-2px_0_4px_rgba(0,0,0,0.05)] z-10" />
        <div className="absolute right-[-10px] w-5 h-5 rounded-full bg-[var(--bg)] shadow-[inset_2px_0_4px_rgba(0,0,0,0.05)] z-10" />
        <div className="w-full border-t-2 border-dashed border-[var(--surface-3)] mx-4" />
      </div>

      <div className="mat-paper rounded-b-[16px] rounded-t-none p-3 px-4 flex justify-between items-center bg-[var(--surface-2)] shadow-sm border-t-0">
        <div className="pl-2">
          <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider mb-0.5">{info3.label}</div>
          <div className="font-bold text-sm text-[var(--text-primary)] tracking-wide">{info3.val}</div>
        </div>
        <div className="w-6 h-6 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--accent)] shadow-sm">
          <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
  );
}

export default function VaultPage() {
  const [selectedDoc, setSelectedDoc] = useState<Record<string, unknown> | null>(null);
  const [uploadSheet, setUploadSheet] = useState(false);
  const [uploadCat, setUploadCat] = useState('');
  const [userRole, setUserRole] = useState<string>('');

  React.useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => {
      if (data.authenticated) setUserRole(data.user.role);
    });
  }, []);

  return (
    <div className="pt-safe pb-24">
      
      {/* ── HEADER ── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-6 pb-4 flex items-center justify-between"
      >
        <div>
          <h1 className="heading-xl">Travel Vault</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center border border-black/5 dark:border-white/5">
          <Search size={18} className="text-[var(--text-secondary)]" />
        </div>
      </motion.div>

      <div className="inner space-y-8 mt-2">

        <section>
          <div className="flex items-center gap-2 mb-3 px-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Train Tickets</h3>
            <div className="h-px flex-1 bg-[var(--surface-3)]" />
          </div>
          {TRAINS.map((train, idx) => (
            <TicketCard 
              key={`train-${idx}`}
              type="Indian Railways"
              title={train.name}
              subtitle={`${train.fromCode} → ${train.toCode}`}
              date={train.departureDate}
              info1={{ label: 'Dep', val: train.departure }}
              info2={{ label: 'Class', val: train.classes[0] }}
              info3={{ label: 'PNR No.', val: '8492019482' }}
              onClick={() => setSelectedDoc({ ...train, docType: 'train' })}
            />
          ))}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 px-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Hotel Vouchers</h3>
            <div className="h-px flex-1 bg-[var(--surface-3)]" />
          </div>
          {HOTELS.map((hotel, idx) => (
            <TicketCard 
              key={`hotel-${idx}`}
              type="Accommodation"
              title={hotel.name}
              subtitle={hotel.city}
              date={hotel.checkIn}
              info1={{ label: 'Nights', val: String(hotel.nights) }}
              info2={{ label: 'Rooms', val: '2 AC' }}
              info3={{ label: 'Booking ID', val: 'HTL-93820' }}
              onClick={() => setSelectedDoc({ ...hotel, docType: 'hotel' })}
            />
          ))}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 px-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Activities & Excursions</h3>
            <div className="h-px flex-1 bg-[var(--surface-3)]" />
          </div>
          <TicketCard 
            type="Activity"
            title="Ajanta Caves Guided Tour"
            subtitle="Aurangabad"
            date="18 Oct 2026"
            info1={{ label: 'Time', val: '09:30 AM' }}
            info2={{ label: 'Pax', val: '8' }}
            info3={{ label: 'Pass ID', val: 'AJT-8821' }}
            onClick={() => setSelectedDoc({ title: 'Ajanta Caves', docType: 'activity' })}
          />
        </section>

      </div>

      <FloatingActionButton 
        icon={<Plus size={24} />} 
        label="Upload"
        onClick={() => setUploadSheet(true)} 
        visible={userRole === 'FAMILY_HEAD'}
      />

      {/* ── DOCUMENT PREVIEW SHEET ── */}
      <BottomSheet isOpen={!!selectedDoc} onClose={() => setSelectedDoc(null)} title="Document Details">
        {selectedDoc && (
          <div className="flex flex-col gap-5">
            <div className="w-full aspect-[4/3] bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center p-8 border border-black/5">
              <QrCode size={100} color="#000" />
              <div className="mt-4 font-mono font-bold tracking-widest text-black/50 text-sm">8492019482</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TactileButton>
                <Download size={18} /> Save PDF
              </TactileButton>
              <TactileButton variant="secondary">
                <Share2 size={18} /> Share
              </TactileButton>
            </div>
            {userRole === 'FAMILY_HEAD' && (
              <TactileButton variant="ghost" className="text-[var(--accent-danger)] hover:bg-[var(--accent-danger)]/10">
                <Trash2 size={18} /> Delete Document
              </TactileButton>
            )}
          </div>
        )}
      </BottomSheet>

      {/* ── UPLOAD DOCUMENT SHEET ── */}
      <BottomSheet isOpen={uploadSheet} onClose={() => setUploadSheet(false)} title="Upload Document">
        <div className="flex flex-col gap-4">
          <div className="text-sm font-bold text-[var(--text-primary)] mb-1">Select Category</div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {['Train Ticket', 'Flight Ticket', 'Hotel Voucher', 'Activity', 'Identity', 'Other'].map(cat => (
              <button 
                key={cat}
                onClick={() => setUploadCat(cat)}
                className={`p-3 rounded-xl text-xs font-bold text-left transition-colors border ${uploadCat === cat ? 'bg-[var(--text-primary)] text-[var(--bg)] border-transparent' : 'bg-[var(--surface)] text-[var(--text-secondary)] border-black/5 dark:border-white/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mat-inset h-32 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[var(--text-muted)] cursor-pointer">
            <Plus size={20} className="text-[var(--text-secondary)]" />
            <div className="font-bold text-xs text-[var(--text-secondary)]">Tap to browse files</div>
          </div>
          
          <TactileButton fullWidth size="lg" disabled={!uploadCat} className="mt-2">
            Upload PDF
          </TactileButton>
        </div>
      </BottomSheet>

    </div>
  );
}
