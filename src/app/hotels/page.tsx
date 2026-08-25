'use client';

import React from 'react';
import { Hotel, MapPin, CalendarDays, ExternalLink, Star } from 'lucide-react';

const HOTELS = [
  {
    city: 'Jalgaon',
    name: 'President Cottage Resort',
    nights: 2,
    checkIn: '17 Oct 2026',
    checkOut: '19 Oct 2026',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    address: 'Near Ajanta Caves Road, Jalgaon',
  },
  {
    city: 'Aurangabad',
    name: 'Vivanta Aurangabad',
    nights: 2,
    checkIn: '19 Oct 2026',
    checkOut: '21 Oct 2026',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?w=800&q=80',
    address: 'Rauza Baugh, CIDCO, Aurangabad',
  }
];

export default function HotelsPage() {
  return (
    <div className="w-full pt-32 pb-24 min-h-screen">
      <div className="container-wide">
        
        <div className="mb-16 max-w-3xl">
          <h1 className="heading-hero text-gradient mb-6">Accommodations</h1>
          <p className="text-body-large text-muted">
            Premium stays booked for the Mitra & Ghosh families across Maharashtra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {HOTELS.map((hotel, idx) => (
            <div key={idx} className="glass-card overflow-hidden group">
              
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-dark)] to-transparent" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-bold flex items-center gap-2">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {hotel.rating}
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2 text-accent-secondary font-bold text-sm tracking-widest uppercase mb-2">
                  <MapPin size={16} /> {hotel.city}
                </div>
                
                <h3 className="text-3xl font-black mb-6">{hotel.name}</h3>
                
                <div className="grid grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/10 mb-6">
                  <div>
                    <div className="text-sm text-muted font-bold tracking-wider uppercase mb-1">Check-in</div>
                    <div className="font-bold text-lg">{hotel.checkIn}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted font-bold tracking-wider uppercase mb-1">Check-out</div>
                    <div className="font-bold text-lg">{hotel.checkOut}</div>
                  </div>
                </div>

                <button className="w-full tap bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                  <ExternalLink size={20} /> View Booking Details
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
