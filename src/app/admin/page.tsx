'use client';

import React from 'react';

export default function AdminPage() {
  const actions = [
    { title: 'Broadcast', description: 'Send an update to the family' },
    { title: 'Documents', description: 'Manage travel documents' },
    { title: 'Approvals', description: '2 items waiting', highlight: true },
    { title: 'Settings', description: 'App preferences and notifications' },
  ];

  return (
    <div className="pb-safe relative w-full min-h-screen pt-safe">
      <div className="inner max-w-[800px]">
        
        {/* ── HEADER ── */}
        <div className="mb-16">
          <h1 className="text-title-page mb-2">CONTROL</h1>
          <div className="text-title-section text-[var(--text-secondary)] mb-6">
            Family status
          </div>
          <div className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-button)] px-4 py-3 shadow-sm max-w-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-body font-medium">Everyone is connected</span>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div>
          <div className="text-eyebrow mb-8">QUICK ACTIONS</div>

          <div className="flex flex-col border-t border-[var(--border)]">
            {actions.map((action, i) => (
              <div 
                key={i}
                className="py-6 border-b border-[var(--border)] flex justify-between items-center group cursor-pointer hover:bg-[var(--surface-hover)] -mx-4 px-4 rounded-[8px] transition-colors"
              >
                <div>
                  <div className="text-body font-medium mb-1 flex items-center gap-3">
                    {action.title}
                    {action.highlight && (
                      <span className="px-2 py-0.5 bg-[var(--accent)] text-[var(--surface)] text-[10px] font-bold rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="text-metadata text-[var(--text-secondary)]">
                    {action.description}
                  </div>
                </div>
                <div className="text-[var(--text-primary)] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  →
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
