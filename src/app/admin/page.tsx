'use client';

import React, { useState } from 'react';
import { useTripData } from '@/context/TripDataContext';
import GodCursor from '@/components/admin/GodCursor';
import { Save, RefreshCw, Terminal, Hotel, Train, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GodModeAdminPage() {
  const { itinerary, setItinerary, trains, setTrains, hotels, setHotels } = useTripData();
  const [activeTab, setActiveTab] = useState<'itinerary' | 'trains' | 'hotels'>('itinerary');
  const [successMsg, setSuccessMsg] = useState('');

  // Local state for editing
  const [localItinerary, setLocalItinerary] = useState([...itinerary]);
  const [localTrains, setLocalTrains] = useState([...trains]);
  const [localHotels, setLocalHotels] = useState([...hotels]);

  const saveChanges = () => {
    setItinerary(localItinerary);
    setTrains(localTrains);
    setHotels(localHotels);
    setSuccessMsg('SYSTEM OVERRIDE SUCCESSFUL');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleItineraryChange = (idx: number, field: string, value: string) => {
    const newItin = [...localItinerary];
    newItin[idx] = { ...newItin[idx], [field]: value };
    setLocalItinerary(newItin);
  };

  const handleTrainChange = (idx: number, field: string, value: string) => {
    const newTrains = [...localTrains];
    newTrains[idx] = { ...newTrains[idx], [field]: value };
    setLocalTrains(newTrains);
  };

  const handleHotelChange = (idx: number, field: string, value: string) => {
    const newHotels = [...localHotels];
    newHotels[idx] = { ...newHotels[idx], [field]: value };
    setLocalHotels(newHotels);
  };

  const addHotel = () => {
    setLocalHotels([
      ...localHotels,
      {
        id: `hotel-${Date.now()}`,
        name: 'NEW HOTEL OVERRIDE',
        city: 'TBD',
        checkIn: 'TBD',
        checkOut: 'TBD',
        nights: 1,
        address: 'TBD',
        mapUrl: '',
        amenities: [],
        color: '#000000',
        coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        bookingPassUrl: null,
        days: []
      }
    ]);
  };
  
  const removeHotel = (idx: number) => {
    const newHotels = [...localHotels];
    newHotels.splice(idx, 1);
    setLocalHotels(newHotels);
  };

  return (
    <div className="w-full pt-32 pb-24 min-h-screen bg-[#0a0a0a] text-white selection:bg-[var(--accent)]">
      <GodCursor />
      
      <div className="container-wide">
        
        {/* Header */}
        <div className="mb-12 border-b-2 border-zinc-800 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-3 bg-[var(--accent)] text-white px-3 py-1 font-mono text-sm font-black uppercase mb-6 animate-pulse shadow-[0_0_15px_var(--accent)]">
              <Terminal size={16} /> GOD MODE AUTHORIZED
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
              System Override
            </h1>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => {
                setLocalItinerary([...itinerary]);
                setLocalTrains([...trains]);
                setLocalHotels([...hotels]);
              }}
              className="px-6 py-3 border-2 border-zinc-700 hover:border-zinc-500 font-mono font-bold uppercase flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={18} /> Reset
            </button>
            <button 
              onClick={saveChanges}
              className="px-6 py-3 bg-[var(--accent)] text-white font-mono font-bold uppercase flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.4)]"
            >
              <Save size={18} /> Commit Changes
            </button>
          </div>
        </div>

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-green-500/20 border-2 border-green-500 text-green-400 font-mono font-bold uppercase"
          >
            &gt; {successMsg}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            className={`px-6 py-3 font-mono font-bold uppercase flex items-center gap-2 border-2 ${activeTab === 'itinerary' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
            onClick={() => setActiveTab('itinerary')}
          >
            <MapPin size={18} /> Itinerary
          </button>
          <button 
            className={`px-6 py-3 font-mono font-bold uppercase flex items-center gap-2 border-2 ${activeTab === 'trains' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
            onClick={() => setActiveTab('trains')}
          >
            <Train size={18} /> Trains
          </button>
          <button 
            className={`px-6 py-3 font-mono font-bold uppercase flex items-center gap-2 border-2 ${activeTab === 'hotels' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
            onClick={() => setActiveTab('hotels')}
          >
            <Hotel size={18} /> Hotels
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
          
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              {localItinerary.map((day, idx) => (
                <div key={day.day} className="border border-zinc-800 p-6 bg-zinc-950 flex gap-6">
                  <div className="text-3xl font-black text-zinc-700">D{day.day}</div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-xs text-zinc-500 mb-1">TITLE</label>
                        <input 
                          className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono" 
                          value={day.title} 
                          onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-zinc-500 mb-1">LOCATION</label>
                        <input 
                          className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono" 
                          value={day.location} 
                          onChange={(e) => handleItineraryChange(idx, 'location', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'trains' && (
            <div className="space-y-6">
              {localTrains.map((train, idx) => (
                <div key={train.id} className="border border-zinc-800 p-6 bg-zinc-950">
                  <div className="text-xl font-black mb-4 text-[var(--accent)] uppercase">{train.id}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-zinc-500 mb-1">NAME</label>
                      <input 
                        className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono" 
                        value={train.name} 
                        onChange={(e) => handleTrainChange(idx, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-zinc-500 mb-1">NUMBER</label>
                      <input 
                        className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono" 
                        value={train.number} 
                        onChange={(e) => handleTrainChange(idx, 'number', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-zinc-500 mb-1">DATE</label>
                      <input 
                        className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono" 
                        value={train.departureDate} 
                        onChange={(e) => handleTrainChange(idx, 'departureDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'hotels' && (
            <div className="space-y-6">
              {localHotels.map((hotel, idx) => (
                <div key={hotel.id} className="border border-zinc-800 p-6 bg-zinc-950 relative">
                  <button 
                    onClick={() => removeHotel(idx)}
                    className="absolute top-4 right-4 text-xs font-mono bg-red-900/30 text-red-500 px-2 py-1 border border-red-900 hover:bg-red-900 hover:text-white transition-colors"
                  >
                    REMOVE
                  </button>
                  <div className="text-xl font-black mb-4 text-[var(--accent)] uppercase">{hotel.name}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-zinc-500 mb-1">HOTEL NAME</label>
                      <input 
                        className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono" 
                        value={hotel.name} 
                        onChange={(e) => handleHotelChange(idx, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-zinc-500 mb-1">CITY</label>
                      <input 
                        className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono" 
                        value={hotel.city} 
                        onChange={(e) => handleHotelChange(idx, 'city', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-zinc-500 mb-1">CHECK IN</label>
                      <input 
                        className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono" 
                        value={hotel.checkIn} 
                        onChange={(e) => handleHotelChange(idx, 'checkIn', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-zinc-500 mb-1">CHECK OUT</label>
                      <input 
                        className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono" 
                        value={hotel.checkOut} 
                        onChange={(e) => handleHotelChange(idx, 'checkOut', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={addHotel}
                className="w-full py-4 border-2 border-dashed border-zinc-700 text-zinc-500 font-mono font-bold uppercase hover:border-zinc-500 hover:text-zinc-300 transition-colors"
              >
                + ADD NEW HOTEL
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
