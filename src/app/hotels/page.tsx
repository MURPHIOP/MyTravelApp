'use client';

import React from 'react';
import { MapPin, ExternalLink, Star } from 'lucide-react';

import { useTripData } from '@/context/TripDataContext';
import UploadDownload from '@/components/UploadDownload';

export default function HotelsPage() {
  const { hotels, setHotels } = useTripData();
  return (
    <div className="w-full pt-32 pb-24 min-h-screen">
      <div className="container-wide">
        
        <div className="mb-24 border-b-4 border-black pb-12">
          <div className="inline-block bg-[var(--text-primary)] text-white px-4 py-2 font-mono text-sm font-bold uppercase mb-8 shadow-[4px_4px_0px_0px_var(--accent)]">
            Accommodations
          </div>
          <h1 className="heading-hero">Stays</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {hotels.map((hotel, idx) => (
            <div key={idx} className="brutal-card p-0 flex flex-col overflow-hidden bg-white group">
              
              <div className="relative h-72 border-b-4 border-black overflow-hidden bg-black">
                <img 
                  src={hotel.coverImage} 
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-all duration-500 opacity-80" 
                />
                
                <div className="absolute top-0 left-0 bg-[var(--accent)] text-white border-r-4 border-b-4 border-black px-4 py-2 flex items-center gap-2 font-mono font-black text-xl">
                  {hotel.nights} Nights
                </div>
              </div>

              <div className="p-8 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center gap-3 text-white bg-black w-max px-3 py-1 font-mono font-bold tracking-widest text-sm mb-6 border-2 border-black shadow-[4px_4px_0px_0px_var(--accent)]">
                    <MapPin size={18} className="text-[var(--accent)]" /> {hotel.city}
                  </div>
                  
                  <h3 className="text-5xl font-black uppercase mb-8">{hotel.name}</h3>
                </div>
                
                <div>
                  <div className="grid grid-cols-2 gap-0 border-4 border-black bg-[#FFEDD5] mb-8 font-mono">
                    <div className="p-4 border-r-4 border-black">
                      <div className="text-xs font-black uppercase mb-1">Check-in</div>
                      <div className="text-2xl font-bold uppercase">{hotel.checkIn}</div>
                    </div>
                    <div className="p-4">
                      <div className="text-xs font-black uppercase mb-1">Check-out</div>
                      <div className="text-2xl font-bold uppercase">{hotel.checkOut}</div>
                    </div>
                  </div>

                  <button className="brutal-btn w-full">
                    <ExternalLink size={20} className="mr-3" /> View Booking
                  </button>
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
