'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Download, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface UploadDownloadProps {
  currentUrl: string | null;
  onUploadSuccess: (url: string) => void;
  storagePathPrefix: string;
  label: string;
}

export default function UploadDownload({ currentUrl, onUploadSuccess, storagePathPrefix, label }: UploadDownloadProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFamilyHead = user?.role === 'FAMILY_HEAD';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${storagePathPrefix}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('vault-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Upload error:', error);
        alert(`Upload failed: ${error.message}`);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('vault-documents')
        .getPublicUrl(data.path);

      // Save metadata to Supabase DB so it shows up in Vault
      await supabase.from('documents').insert([
        {
          name: fileName,
          type: file.type || 'application/octet-stream',
          size: file.size,
          url: publicUrlData.publicUrl,
          uploaded_by: user?.role === 'FAMILY_HEAD' ? 'Family Head' : 'User',
          family: 'TOUR'
        }
      ]);

      onUploadSuccess(publicUrlData.publicUrl);
      
    } catch (err: any) {
      console.error('Upload exception:', err);
      alert('Upload failed.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-black uppercase text-black">{label}</div>
      <div className="flex gap-2 items-center flex-wrap">
        {currentUrl ? (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-black text-white px-4 py-2 border-2 border-black font-bold uppercase text-xs shadow-[2px_2px_0px_0px_var(--accent)] hover:translate-y-px hover:shadow-none transition-all"
          >
            <Download size={14} /> Download
          </a>
        ) : (
          <span className="text-xs text-gray-500 font-mono italic">No file uploaded</span>
        )}

        {isFamilyHead && (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 border-2 border-black font-bold uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-none transition-all disabled:opacity-50"
            >
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
