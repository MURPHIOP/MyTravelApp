'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { resolvePlaceImage } from '@/lib/destinationImageService';

import { useTripData } from '@/context/TripDataContext';
import UploadDownload from '@/components/UploadDownload';

export default function HotelsPage() {
  const { hotels, setHotels } = useTripData();
  return (
    <div className="w-full pt-32 pb-24 min-h-screen">
      <div className="container-wide">
        
        <div className="mb-24 border-b-4 border-[var(--border-color)] pb-12">
          <div className="inline-block bg-[var(--surface-contrast)] text-[var(--text-inverse)] px-4 py-2 font-mono text-sm font-bold uppercase mb-8 shadow-[4px_4px_0px_0px_var(--accent)]">
            Accommodations
          </div>
          <h1 className="heading-hero">Stays</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {hotels.map((hotel, idx) => (
            <div key={idx} className="brutal-card p-0 flex flex-col overflow-hidden bg-[var(--surface-light)] group relative">
              
              <div className="relative h-72 border-b-4 border-[var(--border-color)] overflow-hidden bg-black">
                <Image 
                  src={resolvePlaceImage(hotel.name + ' ' + hotel.city, hotel.coverImage)} 
                  alt={hotel.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
                />
                
                <div className="absolute top-0 left-0 bg-[var(--accent)] text-white border-r-4 border-b-4 border-[var(--border-color)] px-4 py-2 flex items-center gap-2 font-mono font-black text-xl">
                  {hotel.nights} Nights
                </div>
              </div>

              <div className="p-8 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center gap-3 text-[var(--text-inverse)] bg-[var(--surface-contrast)] w-max px-3 py-1 font-mono font-bold tracking-widest text-sm mb-6 border-2 border-[var(--border-color)] shadow-[4px_4px_0px_0px_var(--accent)]">
                    <MapPin size={18} className="text-[var(--accent)]" /> {hotel.city}
                  </div>
                  
                  <h3 className="text-5xl font-black uppercase mb-8 text-[var(--text-primary)]">{hotel.name}</h3>
                </div>
                
                <div>
                  <div className="grid grid-cols-2 gap-0 border-4 border-[var(--border-color)] bg-[var(--card-tint-warm)] text-[var(--text-primary)] mb-8 font-mono">
                    <div className="p-4 border-r-4 border-[var(--border-color)]">
                      <div className="text-xs font-black uppercase mb-1">Check-in</div>
                      <div className="text-2xl font-bold uppercase">{hotel.checkIn}</div>
                    </div>
                    <div className="p-4">
                      <div className="text-xs font-black uppercase mb-1">Check-out</div>
                      <div className="text-2xl font-bold uppercase">{hotel.checkOut}</div>
                    </div>
                  </div>

                  {/* Button removed */}
                </div>

                <div className="mt-8 pt-8 border-t-4 border-[var(--border-color)]">
                  <UploadDownload 
                    label="Hotel Voucher"
                    currentUrl={hotel.bookingPassUrl}
                    storagePathPrefix={`hotel_${hotel.id}`}
                    onUploadSuccess={(url) => {
                      const newHotels = [...hotels];
                      newHotels[idx].bookingPassUrl = url;
                      setHotels(newHotels);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
