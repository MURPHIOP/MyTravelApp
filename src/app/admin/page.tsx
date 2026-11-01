'use client';

import React, { useState } from 'react';
import { useTripData } from '@/context/TripDataContext';
import { useTrip } from '@/context/TripContext';
import GodCursor from '@/components/admin/GodCursor';
import InteractiveCanvasBackground from '@/components/ui/InteractiveCanvasBackground';
import { Save, RefreshCw, Terminal, Hotel, Train, MapPin, Globe, Plus, Compass, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  ITINERARY as DEFAULT_ITINERARY, 
  TRAINS as DEFAULT_TRAINS, 
  HOTELS as DEFAULT_HOTELS 
} from '@/lib/tripData';

interface TripDataEditorProps {
  initialItinerary: typeof DEFAULT_ITINERARY;
  initialTrains: typeof DEFAULT_TRAINS;
  initialHotels: typeof DEFAULT_HOTELS;
  onSave: (data: {
    itinerary: typeof DEFAULT_ITINERARY;
    trains: typeof DEFAULT_TRAINS;
    hotels: typeof DEFAULT_HOTELS;
  }) => void;
}

function TripDataEditor({
  initialItinerary,
  initialTrains,
  initialHotels,
  onSave,
}: TripDataEditorProps) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'trains' | 'hotels'>('itinerary');

  // Local buffer for active editing
  const [localItinerary, setLocalItinerary] = useState([...initialItinerary]);
  const [localTrains, setLocalTrains] = useState([...initialTrains]);
  const [localHotels, setLocalHotels] = useState([...initialHotels]);

  const handleReset = () => {
    setLocalItinerary([...initialItinerary]);
    setLocalTrains([...initialTrains]);
    setLocalHotels([...initialHotels]);
  };

  const handleCommit = () => {
    onSave({
      itinerary: localItinerary,
      trains: localTrains,
      hotels: localHotels,
    });
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
    <div>
      {/* Action Controls */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-4">
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

        <div className="flex gap-4">
          <button 
            onClick={handleReset}
            className="px-6 py-3 border-2 border-zinc-700 hover:border-zinc-500 font-mono font-bold uppercase flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={18} /> Reset
          </button>
          <button 
            onClick={handleCommit}
            className="px-6 py-3 bg-[var(--accent)] text-white font-mono font-bold uppercase flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.4)]"
          >
            <Save size={18} /> Commit Changes
          </button>
        </div>
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
            <div className="flex justify-end mb-4">
              <button 
                onClick={addHotel}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold text-sm uppercase"
              >
                + Add Hotel Override
              </button>
            </div>
            {localHotels.map((hotel, idx) => (
              <div key={hotel.id} className="border border-zinc-800 p-6 bg-zinc-950">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xl font-black text-[var(--accent)] uppercase">{hotel.name}</div>
                  <button 
                    onClick={() => removeHotel(idx)}
                    className="text-red-500 hover:text-red-400 font-mono text-xs uppercase"
                  >
                    Delete
                  </button>
                </div>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GodModeAdminPage() {
  const { itinerary, setItinerary, trains, setTrains, hotels, setHotels } = useTripData();
  const { trips, activeTrip, activeTripId, switchActiveTrip, createTrip, updateActiveTrip } = useTrip();
  const [successMsg, setSuccessMsg] = useState('');

  // Trip Creation Modal State
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripSlug, setNewTripSlug] = useState('');
  const [newTripStartDate, setNewTripStartDate] = useState('');
  const [newTripEndDate, setNewTripEndDate] = useState('');

  const handleCreateNewTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripTitle.trim()) return;

    const slug = newTripSlug.trim() || newTripTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = await createTrip({
      title: newTripTitle.trim(),
      slug,
      start_date: newTripStartDate || undefined,
      end_date: newTripEndDate || undefined,
      description: `Deployment plan for ${newTripTitle.trim()}`,
      itinerary,
      trains,
      hotels,
    });

    if (created) {
      await switchActiveTrip(created.id);
      setIsCreatingTrip(false);
      setNewTripTitle('');
      setNewTripSlug('');
      setNewTripStartDate('');
      setNewTripEndDate('');
      setSuccessMsg(`NEW FLEET DEPLOYED: ${created.title}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleSave = (data: {
    itinerary: typeof DEFAULT_ITINERARY;
    trains: typeof DEFAULT_TRAINS;
    hotels: typeof DEFAULT_HOTELS;
  }) => {
    setItinerary(data.itinerary);
    setTrains(data.trains);
    setHotels(data.hotels);
    updateActiveTrip({
      itinerary: data.itinerary,
      trains: data.trains,
      hotels: data.hotels,
    });
    setSuccessMsg(`SYSTEM OVERRIDE COMMITTED FOR [${activeTrip.title}]`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="w-full pt-32 pb-24 min-h-screen relative text-white selection:bg-[var(--accent)]">
      <InteractiveCanvasBackground variant="admin" />
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
        </div>

        {/* Multi-Trip Tactical Switcher Block */}
        <div className="mb-12 p-6 bg-zinc-950 border-2 border-zinc-800 shadow-[6px_6px_0px_0px_rgba(249,115,22,0.3)]">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase mb-2">
                <Compass size={14} className="text-[var(--accent)]" /> Active Fleet Deployment
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl md:text-3xl font-black uppercase text-white">{activeTrip.title}</span>
                <span className="bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)] px-2.5 py-0.5 font-mono text-xs font-black uppercase tracking-widest animate-pulse">
                  ACTIVE TRIP
                </span>
              </div>
              <div className="font-mono text-xs text-zinc-500 mt-2 flex items-center gap-4 flex-wrap">
                <span>SLUG: <span className="text-zinc-300 font-bold">{activeTrip.slug}</span></span>
                <span>•</span>
                <span>TIMEFRAME: <span className="text-zinc-300 font-bold">{activeTrip.start_date || 'TBD'} → {activeTrip.end_date || 'TBD'}</span></span>
                <span>•</span>
                <span>DAYS: <span className="text-[var(--accent)] font-bold">{itinerary.length}</span></span>
              </div>
            </div>

            <button
              onClick={() => setIsCreatingTrip(!isCreatingTrip)}
              className="px-5 py-2.5 bg-zinc-900 border-2 border-zinc-700 hover:border-[var(--accent)] hover:text-[var(--accent)] text-zinc-200 font-mono text-xs font-black uppercase flex items-center gap-2 transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]"
            >
              {isCreatingTrip ? <X size={16} /> : <Plus size={16} />}
              {isCreatingTrip ? 'Cancel Creation' : 'Deploy New Trip'}
            </button>
          </div>

          {/* New Trip Creation Inline Form */}
          {isCreatingTrip && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleCreateNewTrip}
              className="mb-6 p-6 border-2 border-[var(--accent)] bg-zinc-900/90"
            >
              <div className="font-mono text-sm font-black text-[var(--accent)] uppercase mb-4 flex items-center gap-2">
                <Plus size={16} /> Initialize New Trip Instance
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block font-mono text-xs text-zinc-400 mb-1">TRIP TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kashmir Valley Expedition"
                    value={newTripTitle}
                    onChange={(e) => setNewTripTitle(e.target.value)}
                    className="w-full bg-black border border-zinc-700 p-2 text-white font-mono text-sm focus:border-[var(--accent)] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-zinc-400 mb-1">SLUG (URL KEY)</label>
                  <input
                    type="text"
                    placeholder="e.g. kashmir-2027"
                    value={newTripSlug}
                    onChange={(e) => setNewTripSlug(e.target.value)}
                    className="w-full bg-black border border-zinc-700 p-2 text-white font-mono text-sm focus:border-[var(--accent)] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-zinc-400 mb-1">START DATE</label>
                  <input
                    type="date"
                    value={newTripStartDate}
                    onChange={(e) => setNewTripStartDate(e.target.value)}
                    className="w-full bg-black border border-zinc-700 p-2 text-white font-mono text-sm focus:border-[var(--accent)] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-zinc-400 mb-1">END DATE</label>
                  <input
                    type="date"
                    value={newTripEndDate}
                    onChange={(e) => setNewTripEndDate(e.target.value)}
                    className="w-full bg-black border border-zinc-700 p-2 text-white font-mono text-sm focus:border-[var(--accent)] outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingTrip(false)}
                  className="px-4 py-2 border border-zinc-700 font-mono text-xs font-bold uppercase text-zinc-400 hover:text-white"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[var(--accent)] text-white font-mono text-xs font-black uppercase hover:bg-orange-600 transition-colors shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                >
                  Create & Activate Fleet
                </button>
              </div>
            </motion.form>
          )}

          {/* Tactical Trip Switcher Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-800">
            <span className="font-mono text-xs text-zinc-500 font-bold uppercase mr-1">FLEET SWITCHER:</span>
            {trips.map(trip => {
              const isSelected = trip.id === activeTripId;
              return (
                <button
                  key={trip.id}
                  onClick={() => switchActiveTrip(trip.id)}
                  className={`px-4 py-2 font-mono text-xs font-bold uppercase border-2 flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_0_12px_rgba(249,115,22,0.5)]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  <Globe size={14} />
                  <span>{trip.title}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                </button>
              );
            })}
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

        {/* Editor Form keyed by activeTripId so state resets cleanly on trip switch */}
        <TripDataEditor
          key={activeTripId}
          initialItinerary={itinerary}
          initialTrains={trains}
          initialHotels={hotels}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
