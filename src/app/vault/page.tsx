'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Train, Hotel, Map, FileText, Upload, Trash2, Download } from 'lucide-react';

interface VaultDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  family: string;
}

export default function VaultPage() {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/documents/list');
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', 'Mitra Head'); // Mock user
    formData.append('family', 'MITRA'); // Mock family

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchDocuments();
      }
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      fetchDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full pt-32 pb-24 min-h-screen">
      <div className="container-wide">
        
        {/* Brutalist Header */}
        <div className="mb-16 border-b-4 border-black pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <div className="inline-block bg-[var(--text-primary)] text-white px-3 py-1 font-mono text-sm font-bold uppercase mb-6 shadow-[4px_4px_0px_0px_var(--accent)]">
              Secure Storage
            </div>
            <h1 className="heading-hero">Vault</h1>
          </div>
          
          <div className="flex gap-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleUpload}
            />
            <button 
              className="brutal-btn brutal-btn-accent flex items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'UPLOADING...' : <><Upload size={20} /> UPLOAD FILE</>}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="font-mono text-2xl font-black uppercase text-center p-24 animate-pulse">
            LOADING SECURE VAULT...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documents.length === 0 ? (
              <div className="col-span-full border-4 border-dashed border-black p-24 text-center">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-mono font-bold text-xl uppercase">Vault is empty.</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="brutal-card p-0 flex flex-col justify-between">
                  <div className="p-6 bg-[#E5E5E5] border-b-2 border-black flex justify-between items-start">
                    <div className="font-mono text-xs font-black bg-black text-white px-2 py-1 uppercase shadow-[2px_2px_0px_0px_var(--accent)]">
                      {doc.family}
                    </div>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-4">
                    <h3 className="text-xl font-black truncate" title={doc.name}>
                      {doc.name}
                    </h3>
                    
                    <div className="font-mono text-xs font-bold text-muted flex flex-col gap-1">
                      <span>SIZE: {(doc.size / 1024).toFixed(1)} KB</span>
                      <span>DATE: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      <span>USER: {doc.uploadedBy}</span>
                    </div>
                  </div>

                  <div className="mt-auto border-t-2 border-black">
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      className="w-full p-4 flex justify-center items-center gap-2 font-mono font-black uppercase hover:bg-black hover:text-white transition-colors"
                    >
                      <Download size={18} /> Download
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
