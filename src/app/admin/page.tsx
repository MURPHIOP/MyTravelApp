'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Radio, FileText, Upload, Plus, Users, Bell, ChevronRight, X } from 'lucide-react';
import TactileButton from '@/components/ui/TactileButton';
import BottomSheet from '@/components/ui/BottomSheet';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

export default function AdminControlCenter() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  return (
    <div className="pt-safe pb-24">
      
      {/* ── HEADER ── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-6 pb-6 flex items-center justify-between"
      >
        <div>
          <div className="label-sm mb-1 text-[var(--accent-danger)]">Restricted Access</div>
          <h1 className="heading-xl">Trip Command</h1>
        </div>
        <div className="w-12 h-12 rounded-full mat-metal flex items-center justify-center">
          <ShieldAlert size={20} className="text-[var(--accent-danger)]" />
        </div>
      </motion.div>

      <div className="inner space-y-6">

        {/* ── STATUS CARD ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mat-paper p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-[var(--text-secondary)]">
                  <Users size={20} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--accent-success)] border-2 border-[var(--surface)] rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[var(--text-primary)] truncate">Mitra & Ghosh</div>
                <div className="text-xs font-semibold text-[var(--text-muted)] truncate">All members connected</div>
              </div>
            </div>
            <TactileButton variant="secondary" size="sm" className="px-3 rounded-xl">Ping</TactileButton>
          </div>

          <div className="h-px bg-[var(--surface-3)] w-full mb-6" />

          {/* Broadcast Trigger */}
          <div 
            className="mat-inset p-4 flex items-center gap-4 cursor-pointer tap-effect"
            onClick={() => setBroadcastMode(true)}
          >
            <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <Radio size={18} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm text-[var(--text-primary)]">Send Broadcast</div>
              <div className="text-xs font-semibold text-[var(--text-muted)]">Notify everyone instantly</div>
            </div>
            <ChevronRight size={16} className="text-[var(--text-muted)]" />
          </div>
        </motion.div>

        {/* ── QUICK ACTIONS GRID ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <div 
            className="mat-paper p-5 flex flex-col gap-4 cursor-pointer tap-effect"
            onClick={() => setSheetOpen(true)}
          >
            <div className="w-10 h-10 rounded-2xl mat-metal flex items-center justify-center text-[var(--text-primary)]">
              <Upload size={18} />
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--text-primary)]">Upload Doc</div>
              <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-1">Voucher or Ticket</div>
            </div>
          </div>

          <div className="mat-paper p-5 flex flex-col gap-4 cursor-pointer tap-effect">
            <div className="w-10 h-10 rounded-2xl mat-metal flex items-center justify-center text-[var(--text-primary)]">
              <Bell size={18} />
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--text-primary)]">Alerts</div>
              <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-1">2 Pending Approvals</div>
            </div>
          </div>
        </motion.div>

        {/* ── RECENT DOCUMENTS ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="heading-lg mb-4 px-2">Uploaded</h3>
          <div className="mat-paper p-2 space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="p-3 rounded-2xl bg-[var(--surface-2)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--surface)] shadow-sm flex items-center justify-center text-[var(--accent)]">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-[var(--text-primary)]">Vande Bharat PNR</div>
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Uploaded just now</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      <FloatingActionButton 
        icon={<Radio size={24} />} 
        onClick={() => setBroadcastMode(true)} 
      />

      {/* ── BROADCAST SHEET ── */}
      <BottomSheet isOpen={broadcastMode} onClose={() => setBroadcastMode(false)} title="Trip Broadcast">
        <div className="flex flex-col gap-6">
          <div className="mat-inset p-4">
            <textarea 
              className="w-full bg-transparent outline-none text-[var(--text-primary)] font-bold text-lg resize-none placeholder:text-[var(--text-muted)] h-24"
              placeholder="What do you need to tell everyone?"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="flex gap-3">
            {['5 min', '30 min', 'Forever'].map(t => (
              <button key={t} className="flex-1 py-3 rounded-xl font-bold text-xs bg-[var(--surface-2)] text-[var(--text-secondary)] border border-black/5 dark:border-white/5 active:bg-[var(--surface-3)] transition-colors">
                {t}
              </button>
            ))}
          </div>

          <TactileButton 
            fullWidth 
            size="lg" 
            onClick={() => { setBroadcastMode(false); setAnnouncement(''); }}
            disabled={!announcement.trim()}
            className={!announcement.trim() ? 'opacity-50' : ''}
          >
            <Radio size={18} /> Send Broadcast
          </TactileButton>
        </div>
      </BottomSheet>

      {/* ── UPLOAD SHEET ── */}
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Add Document">
        <div className="flex flex-col gap-4">
          <div className="mat-inset h-40 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[var(--text-muted)] cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-[var(--surface)] shadow-sm flex items-center justify-center text-[var(--text-secondary)]">
              <Plus size={24} />
            </div>
            <div className="font-bold text-sm text-[var(--text-secondary)]">Tap to browse files</div>
          </div>
          <TactileButton fullWidth variant="secondary" onClick={() => setSheetOpen(false)}>Cancel</TactileButton>
        </div>
      </BottomSheet>

    </div>
  );
}
