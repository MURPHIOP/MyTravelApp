'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Radio, FileText, Upload, Users, Bell, ChevronRight, Activity } from 'lucide-react';
import TactileButton from '@/components/ui/TactileButton';
import BottomSheet from '@/components/ui/BottomSheet';

export default function AdminControlCenter() {
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  return (
    <div className="pb-safe relative w-full min-h-screen">
      
      {/* ── BACKGROUND UTILITARIAN AESTHETIC ── */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[var(--bg)]">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="inner pt-safe">
        
        {/* ── HEADER ── */}
        <div className="mb-12 mt-8 lg:mt-16">
          <div className="text-eyebrow text-[var(--accent-danger)] mb-2 flex items-center gap-2">
            <ShieldAlert size={14} /> RESTRICTED ACCESS
          </div>
          <h1 className="text-title-main">Command Center</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* ── LEFT COLUMN: STATUS ── */}
          <div className="lg:col-span-5 space-y-12">
            
            <section>
              <h2 className="text-eyebrow mb-6">SYSTEM STATUS</h2>
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--accent-success)] animate-pulse" />
                    <span className="text-title-section text-[var(--text-primary)]">ONLINE</span>
                  </div>
                  <p className="text-body text-[var(--text-secondary)]">
                    Core travel services and vault are fully operational.
                  </p>
                </div>

                <div className="pt-6 border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
                  <div className="text-[56px] font-mono font-bold leading-none text-[var(--text-primary)] mb-2">
                    12
                  </div>
                  <div className="text-title-card text-[var(--text-secondary)]">CONNECTED MEMBERS</div>
                </div>
              </div>
            </section>

          </div>

          {/* ── RIGHT COLUMN: OPERATIONS ── */}
          <div className="lg:col-span-7 space-y-16">
            
            <section>
              <h2 className="text-eyebrow mb-6">OPERATIONS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div 
                  className="mat-paper p-6 flex flex-col gap-6 cursor-pointer hover:bg-[var(--surface-2)] transition-colors border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]"
                  onClick={() => setBroadcastMode(true)}
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                    <Radio size={20} />
                  </div>
                  <div>
                    <div className="text-title-card mb-1">Broadcast</div>
                    <div className="text-body text-sm">Send a push notification to all family members.</div>
                  </div>
                </div>

                <div className="mat-paper p-6 flex flex-col gap-6 cursor-pointer hover:bg-[var(--surface-2)] transition-colors border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
                  <div className="w-12 h-12 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-[var(--text-primary)]">
                    <Upload size={20} />
                  </div>
                  <div>
                    <div className="text-title-card mb-1">Batch Upload</div>
                    <div className="text-body text-sm">Process multiple tickets or vouchers at once.</div>
                  </div>
                </div>

                <div className="mat-paper p-6 flex flex-col gap-6 cursor-pointer hover:bg-[var(--surface-2)] transition-colors border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--accent-warning)]/10 flex items-center justify-center text-[var(--accent-warning)]">
                        <Bell size={20} />
                      </div>
                      <div>
                        <div className="text-title-card mb-1">Pending Approvals</div>
                        <div className="text-body text-sm">2 expense resolutions require your signature.</div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-[var(--text-muted)] hidden md:block" />
                  </div>
                </div>

              </div>
            </section>

            <section>
              <h2 className="text-eyebrow mb-6">RECENT ACTIVITY</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 py-4 border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
                    <div className="text-[var(--text-muted)]"><Activity size={18} /></div>
                    <div className="flex-1">
                      <div className="text-body font-bold text-[var(--text-primary)]">Vault updated</div>
                      <div className="text-metadata text-[var(--text-secondary)]">Admin uploaded Vande Bharat PNR • 12 mins ago</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

      </div>

      {/* ── BROADCAST SHEET ── */}
      <BottomSheet isOpen={broadcastMode} onClose={() => setBroadcastMode(false)} title="Trip Broadcast">
        <div className="flex flex-col gap-8 pt-4">
          <div className="p-6 bg-[var(--surface-2)] rounded-[24px] border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
            <textarea 
              className="w-full bg-transparent outline-none text-[var(--text-primary)] text-body resize-none placeholder:text-[var(--text-muted)] h-32"
              placeholder="What do you need to tell everyone?"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="flex gap-4">
            {['5 min', '30 min', 'Forever'].map(t => (
              <button key={t} className="flex-1 py-4 rounded-[16px] text-eyebrow bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[var(--surface-3)] transition-colors">
                {t}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[rgba(0,0,0,0.05)]">
            <TactileButton 
              fullWidth 
              size="lg" 
              onClick={() => { setBroadcastMode(false); setAnnouncement(''); }}
              disabled={!announcement.trim()}
              className={`bg-[var(--accent)] text-white shadow-md ${!announcement.trim() ? 'opacity-50' : ''}`}
            >
              <Radio size={18} className="mr-2" /> Send Push Notification
            </TactileButton>
          </div>
        </div>
      </BottomSheet>

    </div>
  );
}
