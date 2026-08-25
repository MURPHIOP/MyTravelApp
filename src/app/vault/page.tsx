'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Train, Hotel, Map, FileText } from 'lucide-react';

interface VaultDocument {
  id: string;
  filename: string;
  category: string;
  uploadDate: string;
  url: string;
}

export default function VaultPage() {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For local visual testing, pre-populate if empty or fetch
    fetch('/api/documents/list')
      .then(res => res.json())
      .then(data => {
        if (data.documents?.length > 0) {
          setDocuments(data.documents);
        } else {
          // Dummy data for presentation testing since we might not have a backend populated
          setDocuments([
            {
              id: '1',
              filename: 'Vande_Bharat_Ticket.pdf',
              category: 'TRAIN',
              uploadDate: '2026-10-15',
              url: '#'
            },
            {
              id: '2',
              filename: 'Taj_Aurangabad_Booking.pdf',
              category: 'HOTELS',
              uploadDate: '2026-10-10',
              url: '#'
            }
          ]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'TRAIN', label: 'TRAIN', icon: Train },
    { id: 'HOTELS', label: 'HOTELS', icon: Hotel },
    { id: 'ACTIVITIES', label: 'ACTIVITIES', icon: Map },
    { id: 'OTHER', label: 'OTHER DOCUMENTS', icon: FileText }
  ];

  if (loading) return <div className="p-12 text-center text-body">Loading...</div>;

  return (
    <div className="pb-safe relative w-full min-h-screen pt-safe">
      <div className="inner">
        
        {/* ── HEADER ── */}
        <div className="mb-16">
          <h1 className="text-title-page mb-2">VAULT</h1>
          <div className="text-title-section text-[var(--text-secondary)]">
            Your travel documents<br />in one place.
          </div>
        </div>

        {/* ── SECTIONS ── */}
        <div className="flex flex-col">
          {categories.map((cat) => {
            const catDocs = documents.filter(d => d.category === cat.id);
            
            return (
              <div key={cat.id} className="border-t border-[var(--border)] py-8">
                
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-title-section">{cat.label}</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-body text-[var(--text-secondary)]">
                      {catDocs.length} {catDocs.length === 1 ? 'document' : 'documents'}
                    </span>
                    <button className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center hover:bg-[var(--surface-hover)] transition-colors">
                      <Plus size={20} className="text-[var(--text-primary)]" />
                    </button>
                  </div>
                </div>

                {catDocs.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catDocs.map((doc) => (
                      <div 
                        key={doc.id}
                        className="border border-[var(--border)] rounded-[var(--radius-card)] p-6 bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer flex flex-col gap-6"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        <div className="text-[var(--text-primary)] opacity-80">
                          <cat.icon size={24} />
                        </div>
                        
                        <div>
                          <div className="text-title-card mb-2 truncate">{doc.filename.replace('.pdf', '')}</div>
                          <div className="text-body text-[var(--text-secondary)]">
                            {new Date(doc.uploadDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-[var(--border)] flex justify-between items-center text-body">
                          <span className="text-[var(--text-secondary)] truncate flex-1 pr-4">
                            {doc.filename}
                          </span>
                          <span className="font-semibold text-[var(--text-primary)]">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
              </div>
            );
          })}
          <div className="border-t border-[var(--border)]" />
        </div>

      </div>
    </div>
  );
}
