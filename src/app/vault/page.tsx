'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Plus, Trash2, FileText, Loader2, Plane, Train, Hotel, ShieldCheck } from 'lucide-react';
import BottomSheet from '@/components/ui/BottomSheet';
import TactileButton from '@/components/ui/TactileButton';

interface VaultDocument {
  id: string;
  filename: string;
  storedName: string;
  category: string;
  size: number;
  mimeType: string;
  uploadDate: string;
  uploadedBy: string;
  url: string;
}

function TicketCard({ doc, onClick }: { doc: VaultDocument; onClick?: () => void; }) {
  const isTrain = doc.category === 'TRAIN TICKETS';
  const isHotel = doc.category === 'HOTEL VOUCHERS';
  
  if (isTrain) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="cursor-pointer tap-effect mat-ticket group"
        onClick={onClick}
      >
        <div className="p-6 md:p-8 flex flex-col h-full border-l-[6px] border-l-[var(--accent)] bg-[var(--surface)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Train size={120} />
          </div>
          
          <div className="text-eyebrow text-[var(--accent)] mb-6 flex justify-between items-center">
            <span>INDIAN RAILWAYS</span>
            <span className="text-[var(--text-muted)] font-mono text-[10px]">{(doc.size / 1024 / 1024).toFixed(1)} MB</span>
          </div>

          <div className="flex-1">
            <h3 className="text-title-section mb-1 truncate leading-tight tracking-tight">{doc.filename.replace('.pdf', '')}</h3>
            <div className="text-body text-[var(--text-secondary)] font-mono text-sm mt-4 uppercase">
              {new Date(doc.uploadDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-dashed border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] flex justify-between items-end">
             <div>
               <div className="text-eyebrow mb-1">PASSENGER</div>
               <div className="font-bold text-sm">{doc.uploadedBy} FAMILY</div>
             </div>
             <div className="text-sm font-bold text-[var(--accent)] group-hover:underline">VIEW →</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`cursor-pointer tap-effect group h-full ${isHotel ? 'mat-paper border-t-[8px] border-t-[var(--accent-secondary)]' : 'mat-receipt'}`}
      onClick={onClick}
    >
      <div className="p-6 md:p-8 flex flex-col h-full bg-[var(--surface)] relative overflow-hidden rounded-[inherit]">
        <div className="flex justify-between items-start mb-8">
          <div className="w-12 h-12 shrink-0 bg-[var(--surface-3)] rounded-full flex items-center justify-center text-[var(--text-secondary)] shadow-sm">
            {isHotel ? <Hotel size={20} /> : <FileText size={20} />}
          </div>
          <div className="text-right">
             <div className="text-eyebrow mb-1">DATE ISSUED</div>
             <div className="font-bold text-sm text-[var(--text-primary)]">{new Date(doc.uploadDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
           </div>
        </div>

        <div className="flex-1 mb-8">
          <h3 className="text-title-card mb-2 truncate leading-tight">{doc.filename.replace('.pdf', '')}</h3>
          <p className="text-body text-sm truncate">Added by {doc.uploadedBy}</p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
           <div className="font-mono font-bold text-xs text-[var(--text-muted)]">{(doc.size / 1024 / 1024).toFixed(1)} MB</div>
           <div className="text-sm font-bold text-[var(--text-primary)] group-hover:underline">VIEW →</div>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyTicketState({ category, onUpload }: { category: string, onUpload: () => void }) {
  return (
    <div className="w-full aspect-[2/1] md:aspect-[3/1] rounded-[12px] border-2 border-dashed border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-[var(--surface-2)]/50 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-eyebrow text-[var(--text-muted)] mb-2">NO {category} YET</div>
      <p className="text-body text-sm mb-6 text-balance max-w-sm">
        Your travel documents will appear here once uploaded by the family head.
      </p>
      <button 
        onClick={onUpload}
        className="px-6 py-2 bg-[var(--surface)] text-[var(--text-primary)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-full text-xs font-bold hover:bg-[var(--surface-3)] transition-colors shadow-sm flex items-center gap-2"
      >
        <Plus size={14} /> ADD DOCUMENT
      </button>
    </div>
  );
}

export default function VaultPage() {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<VaultDocument | null>(null);
  const [uploadSheet, setUploadSheet] = useState(false);
  const [uploadCat, setUploadCat] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [loadingDocs, setLoadingDocs] = useState(true);

  const fetchDocs = async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch('/api/documents/list');
      const data = await res.json();
      if (res.ok) {
        setDocuments(data.documents || []);
      }
    } catch {
      console.error('Fetch docs failed');
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => {
      if (data.authenticated) setUserRole(data.user.role);
    });
    setTimeout(() => {
      fetchDocs();
    }, 0);
  }, []);

  const handleUpload = async () => {
    if (!fileToUpload || !uploadCat) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('category', uploadCat);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setUploadSheet(false);
        setFileToUpload(null);
        setUploadCat('');
        fetchDocs(); 
      } else {
        alert('Upload failed');
      }
    } catch {
      alert('Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDoc) return;
    try {
      const res = await fetch(`/api/documents/${selectedDoc.id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedDoc(null);
        fetchDocs(); 
      } else {
        alert('Failed to delete document');
      }
    } catch {
      alert('Delete error');
    }
  };

  const handleDownload = () => {
    if (selectedDoc?.url) {
      const a = document.createElement('a');
      a.href = selectedDoc.url;
      a.download = selectedDoc.filename;
      a.click();
    }
  };

  const categories = ['TRAIN TICKETS', 'HOTEL VOUCHERS', 'ACTIVITIES', 'OTHER'];

  return (
    <div className="pb-safe relative w-full min-h-screen">
      
      {/* ── BACKGROUND ARCHIVAL AESTHETIC ── */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[var(--bg)]">
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="inner pt-safe">
        
        {/* ── HEADER ── */}
        <div className="mb-16 mt-8 lg:mt-16 flex justify-between items-end">
          <div>
            <h1 className="text-title-main mb-2">FAMILY VAULT</h1>
            <div className="text-title-section text-[var(--text-secondary)]">
              Travel documents
            </div>
          </div>
          
          {userRole === 'FAMILY_HEAD' && (
            <button 
              onClick={() => setUploadSheet(true)}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-[var(--text-primary)] text-[var(--bg)] rounded-full text-sm font-bold shadow-md hover:bg-[var(--text-secondary)] transition-colors"
            >
              <Plus size={16} /> ADD DOCUMENT
            </button>
          )}
        </div>

        {/* ── DOCUMENT SECTIONS ── */}
        {loadingDocs ? (
           <div className="flex justify-center py-32"><Loader2 className="animate-spin text-[var(--text-muted)] w-10 h-10" /></div>
        ) : (
          <div className="space-y-16 max-w-5xl">
            {categories.map(cat => {
              const catDocs = documents.filter(d => d.category === cat);
              return (
                <section key={cat}>
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-title-section text-[var(--text-primary)]">{cat}</h2>
                    <div className="h-[2px] flex-1 bg-[var(--surface-3)]" />
                  </div>
                  
                  {catDocs.length === 0 ? (
                    <EmptyTicketState category={cat} onUpload={() => {
                      if (userRole === 'FAMILY_HEAD') {
                        setUploadCat(cat);
                        setUploadSheet(true);
                      }
                    }} />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {catDocs.map(doc => (
                        <TicketCard 
                          key={doc.id}
                          doc={doc}
                          onClick={() => setSelectedDoc(doc)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

      </div>

      {/* Mobile action button */}
      {userRole === 'FAMILY_HEAD' && (
        <div className="md:hidden fixed bottom-[100px] right-6 z-40">
          <button 
            onClick={() => setUploadSheet(true)}
            className="w-14 h-14 bg-[var(--text-primary)] text-[var(--bg)] rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>
      )}

      {/* ── DOCUMENT PREVIEW SHEET ── */}
      <BottomSheet isOpen={!!selectedDoc} onClose={() => setSelectedDoc(null)} title="Document Overview">
        {selectedDoc && (
          <div className="flex flex-col gap-8 -mt-6">
            <div className="w-full aspect-[16/10] bg-[var(--surface-2)] rounded-[24px] shadow-[var(--inset-deep)] flex flex-col items-center justify-center p-8 border border-[rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                 <ShieldCheck size={200} />
              </div>
              <FileText size={64} className="text-[var(--text-muted)] mb-4" />
              <div className="text-title-card text-center text-safe px-4">{selectedDoc.filename}</div>
              <div className="text-eyebrow text-[var(--accent)] mt-4">{selectedDoc.category}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TactileButton size="lg" className="bg-[var(--text-primary)] text-[var(--bg)]" onClick={handleDownload}>
                <Download size={18} className="mr-2" /> Download
              </TactileButton>
              <TactileButton variant="secondary" size="lg" onClick={() => window.open(selectedDoc.url, '_blank')}>
                <QrCode size={18} className="mr-2" /> Preview
              </TactileButton>
            </div>
            {userRole === 'FAMILY_HEAD' && (
              <div className="pt-4 border-t border-[rgba(0,0,0,0.05)]">
                <TactileButton variant="ghost" className="text-[var(--accent-danger)] hover:bg-[var(--accent-danger)]/10" onClick={handleDelete}>
                  <Trash2 size={18} className="mr-2" /> Permanently Delete
                </TactileButton>
              </div>
            )}
          </div>
        )}
      </BottomSheet>

      {/* ── UPLOAD DOCUMENT SHEET ── */}
      <BottomSheet isOpen={uploadSheet} onClose={() => setUploadSheet(false)} title="Upload Document">
        <div className="flex flex-col gap-8">
          <div>
            <label className="text-eyebrow mb-4 block">DOCUMENT CATEGORY</label>
            <div className="grid grid-cols-2 gap-4">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setUploadCat(c)}
                  className={`p-4 rounded-[16px] text-sm font-bold transition-colors text-left border ${uploadCat === c ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-[rgba(0,0,0,0.05)]'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-eyebrow mb-4 block">SELECT PDF FILE</label>
            <input 
              type="file" 
              accept="application/pdf"
              onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
              className="w-full text-body file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[var(--surface-3)] file:text-[var(--text-primary)] hover:file:bg-[var(--surface-3)] cursor-pointer bg-[var(--surface-2)] rounded-[24px] p-4 border border-[rgba(0,0,0,0.05)]"
            />
          </div>
          <div className="pt-4 mt-2 border-t border-[rgba(0,0,0,0.05)]">
            <TactileButton fullWidth onClick={handleUpload} disabled={isUploading || !fileToUpload || !uploadCat} size="lg" className="bg-[var(--text-primary)] text-[var(--bg)]">
              {isUploading ? <Loader2 className="animate-spin" /> : 'Secure Upload'}
            </TactileButton>
          </div>
        </div>
      </BottomSheet>

    </div>
  );
}
