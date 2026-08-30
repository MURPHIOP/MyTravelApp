'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase.storage.from('photos').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

      if (error) throw error;

      // Filter out system files like .emptyFolderPlaceholder
      const validFiles = data?.filter(file => file.name !== '.emptyFolderPlaceholder' && !file.name.startsWith('.')) || [];

      const photoUrls = validFiles.map(file => {
        const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(file.name);
        return { name: file.name, url: publicUrl };
      });

      setPhotos(photoUrls);
    } catch (err: any) {
      console.error('Error fetching photos:', err);
      setError(err.message || 'Failed to load photos');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!user) {
      setError('You must be logged in to upload photos.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image.`);
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${uuidv4()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;
      }

      await fetchPhotos(); // Refresh gallery
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload photos.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input
      }
    }
  };

  const deletePhoto = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    
    try {
      const { error } = await supabase.storage.from('photos').remove([fileName]);
      if (error) throw error;
      await fetchPhotos(); // Refresh gallery
    } catch (err: any) {
      console.error('Delete error:', err);
      alert('Failed to delete photo: ' + err.message);
    }
  };

  return (
    <div className="w-full pt-32 pb-24 min-h-screen bg-[var(--bg-color)]">
      <div className="container-wide">
        
        {/* HEADER SECTION */}
        <div className="mb-16 border-b-4 border-[var(--border-color)] pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[var(--text-primary)] text-white px-4 py-2 font-mono text-sm font-bold uppercase mb-8 shadow-[4px_4px_0px_0px_var(--accent)]">
              <Camera size={18} /> Memory Dump
            </div>
            <h1 className="heading-hero">Photos</h1>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button 
              className="brutal-btn brutal-btn-accent text-lg px-8 py-4 flex items-center gap-3 w-full md:w-auto justify-center"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="w-6 h-6 border-4 border-black border-t-white rounded-full animate-spin" />
              ) : (
                <Upload size={24} />
              )}
              {isUploading ? 'UPLOADING...' : 'UPLOAD PHOTOS'}
            </button>
            <span className="font-mono text-xs font-bold uppercase">Supported: JPG, PNG, GIF, WEBP</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-red-500 p-4 mb-12 flex items-start gap-4">
            <div className="bg-red-500 text-white p-1 mt-1">
              <ImageIcon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-red-700 uppercase">Error</h3>
              <p className="text-red-600 font-mono text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* GALLERY GRID */}
        {photos.length === 0 && !isUploading ? (
          <div className="brutal-card p-16 text-center bg-white flex flex-col items-center">
            <ImageIcon size={64} className="mb-6 opacity-20" />
            <h3 className="text-3xl font-black uppercase mb-4">No Photos Yet</h3>
            <p className="font-mono text-lg max-w-md mx-auto">
              The memory dump is empty. Be the first to upload a photo from the journey.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {photos.map((photo, idx) => (
              <div key={idx} className="relative group brutal-card p-0 overflow-hidden bg-black aspect-square">
                <img 
                  src={photo.url} 
                  alt="Travel memory" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    {user?.role === 'FAMILY_HEAD' && (
                      <button 
                        onClick={() => deletePhoto(photo.name)}
                        className="bg-white text-red-600 p-2 border-2 border-black hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                  <div className="bg-[var(--accent)] text-white font-mono text-xs font-black uppercase px-2 py-1 border-2 border-black truncate">
                    {photo.name.split('-').pop()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
