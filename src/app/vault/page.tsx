'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, ChevronRight, Plus, Search, Trash2, FileText, Loader2 } from 'lucide-react';
import BottomSheet from '@/components/ui/BottomSheet';
import TactileButton from '@/components/ui/TactileButton';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

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

function TicketCard({ title, subtitle, date, file, onClick }: {
  title: string;
  subtitle: string;
  date: string;
  file: VaultDocument;
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
          <div className="pl-2 min-w-0 pr-2 flex-1">
            <h3 className="text-[17px] font-bold leading-tight mb-1 text-[var(--text-primary)] truncate">{title}</h3>
            <p className="text-xs font-semibold text-[var(--text-secondary)] truncate">{subtitle}</p>
          </div>
          <div className="w-8 h-8 shrink-0 bg-[var(--surface-3)] rounded-lg flex items-center justify-center text-[var(--text-secondary)]">
            <FileText size={16} />
          </div>
        </div>

        <div className="pl-2">
           <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider mb-1">Uploaded On</div>
           <div className="font-semibold text-[13px] text-[var(--text-primary)]">{new Date(date).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="relative h-4 flex items-center overflow-hidden bg-[var(--surface)] border-x border-[rgba(255,255,255,0.05)]">
        <div className="absolute left-[-10px] w-5 h-5 rounded-full bg-[var(--bg)] shadow-[inset_-2px_0_4px_rgba(0,0,0,0.05)] z-10" />
        <div className="absolute right-[-10px] w-5 h-5 rounded-full bg-[var(--bg)] shadow-[inset_2px_0_4px_rgba(0,0,0,0.05)] z-10" />
        <div className="w-full border-t-2 border-dashed border-[var(--surface-3)] mx-4" />
      </div>

      <div className="mat-paper rounded-b-[16px] rounded-t-none p-3 px-4 flex justify-between items-center bg-[var(--surface-2)] shadow-sm border-t-0">
        <div className="pl-2 flex-1 min-w-0">
          <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider mb-0.5">Size</div>
          <div className="font-bold text-sm text-[var(--text-primary)] tracking-wide">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
        </div>
        <div className="w-6 h-6 shrink-0 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--accent)] shadow-sm">
          <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
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
        fetchDocs(); // Refresh list
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
        fetchDocs(); // Refresh
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

      <div className="inner space-y-8 mt-2 px-2">
        {loadingDocs ? (
           <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[var(--accent)]" /></div>
        ) : (
          categories.map(cat => {
            const catDocs = documents.filter(d => d.category === cat);
            return (
              <section key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{cat}</h3>
                  <div className="h-px flex-1 bg-[var(--surface-3)]" />
                </div>
                {catDocs.length === 0 ? (
                  <div className="p-6 rounded-[16px] bg-[var(--surface-2)] border border-dashed border-[var(--surface-3)] text-center text-sm font-semibold text-[var(--text-muted)]">
                    No documents uploaded.
                  </div>
                ) : (
                  catDocs.map(doc => (
                    <TicketCard 
                      key={doc.id}
                      title={doc.filename}
                      subtitle={`Uploaded by ${doc.uploadedBy}`}
                      date={doc.uploadDate}
                      file={doc}
                      onClick={() => setSelectedDoc(doc)}
                    />
                  ))
                )}
              </section>
            );
          })
        )}
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
              <FileText size={80} className="text-black/20" />
              <div className="mt-4 font-bold text-center text-black/80 truncate px-4 w-full">{selectedDoc.filename}</div>
              <div className="mt-1 font-mono font-bold tracking-widest text-black/40 text-xs uppercase">{selectedDoc.category}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TactileButton onClick={handleDownload}>
                <Download size={18} /> Download PDF
              </TactileButton>
              <TactileButton variant="secondary" onClick={() => window.open(selectedDoc.url, '_blank')}>
                <QrCode size={18} /> View
              </TactileButton>
            </div>
            {userRole === 'FAMILY_HEAD' && (
              <TactileButton variant="ghost" className="text-[var(--accent-danger)] hover:bg-[var(--accent-danger)]/10" onClick={handleDelete}>
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
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setUploadCat(cat)}
                className={`p-3 rounded-xl text-xs font-bold text-left transition-colors border ${uploadCat === cat ? 'bg-[var(--text-primary)] text-[var(--bg)] border-transparent' : 'bg-[var(--surface)] text-[var(--text-secondary)] border-black/5 dark:border-white/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="mat-inset h-32 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[var(--text-muted)] cursor-pointer relative overflow-hidden">
             <input 
               type="file" 
               accept="application/pdf"
               onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
               className="absolute inset-0 opacity-0 cursor-pointer"
             />
             {fileToUpload ? (
               <div className="text-center px-4">
                 <FileText size={20} className="text-[var(--accent)] mx-auto mb-2" />
                 <div className="font-bold text-xs text-[var(--text-primary)] truncate max-w-full">{fileToUpload.name}</div>
               </div>
             ) : (
               <>
                <Plus size={20} className="text-[var(--text-secondary)]" />
                <div className="font-bold text-xs text-[var(--text-secondary)]">Tap to browse PDFs</div>
               </>
             )}
          </label>
          
          <TactileButton 
            fullWidth 
            size="lg" 
            disabled={!uploadCat || !fileToUpload || isUploading} 
            className="mt-2"
            onClick={handleUpload}
          >
            {isUploading ? <Loader2 className="animate-spin" /> : 'Upload Document'}
          </TactileButton>
        </div>
      </BottomSheet>

    </div>
  );
}
