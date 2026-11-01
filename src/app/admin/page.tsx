'use client';

import React, { useState, useEffect } from 'react';
import { useTripData } from '@/context/TripDataContext';
import { useTrip } from '@/context/TripContext';
import GodCursor from '@/components/admin/GodCursor';
import InteractiveCanvasBackground from '@/components/ui/InteractiveCanvasBackground';
import { Save, RefreshCw, Terminal, Hotel, Train, MapPin, Globe, Plus, Compass, X, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  ITINERARY as DEFAULT_ITINERARY, 
  TRAINS as DEFAULT_TRAINS, 
  HOTELS as DEFAULT_HOTELS,
  TRIP_CONFIG
} from '@/lib/tripData';

interface TripDataEditorProps {
  initialItinerary: typeof DEFAULT_ITINERARY;
  initialTrains: typeof DEFAULT_TRAINS;
  initialHotels: typeof DEFAULT_HOTELS;
  initialFamilies: typeof TRIP_CONFIG.families;
  onSave: (data: {
    itinerary: typeof DEFAULT_ITINERARY;
    trains: typeof DEFAULT_TRAINS;
    hotels: typeof DEFAULT_HOTELS;
    families: typeof TRIP_CONFIG.families;
  }) => void;
}

function TripDataEditor({
  initialItinerary,
  initialTrains,
  initialHotels,
  initialFamilies,
  onSave,
}: TripDataEditorProps) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'trains' | 'hotels' | 'families'>('itinerary');

  // Local buffer for active editing
  const [localItinerary, setLocalItinerary] = useState([...initialItinerary]);
  const [localTrains, setLocalTrains] = useState([...initialTrains]);
  const [localHotels, setLocalHotels] = useState([...initialHotels]);
  const [localFamilies, setLocalFamilies] = useState([...initialFamilies]);

  const handleReset = () => {
    setLocalItinerary([...initialItinerary]);
    setLocalTrains([...initialTrains]);
    setLocalHotels([...initialHotels]);
    setLocalFamilies([...initialFamilies]);
  };

  const handleCommit = () => {
    onSave({
      itinerary: localItinerary,
      trains: localTrains,
      hotels: localHotels,
      families: localFamilies,
    });
  };

  const handleFamilyChange = (idx: number, field: string, value: string) => {
    const newFams = [...localFamilies];
    newFams[idx] = { ...newFams[idx], [field]: value };
    setLocalFamilies(newFams);
  };

  const addFamily = () => {
    const newId = `fam-${Date.now()}`;
    setLocalFamilies([
      ...localFamilies,
      {
        id: newId,
        family: 'New Family',
        head: 'Family Head',
        email: 'head@family.com',
        color: '#10B981',
        avatar: 'NF',
      },
    ]);
  };

  const removeFamily = (idx: number) => {
    if (localFamilies.length <= 1) return;
    setLocalFamilies(localFamilies.filter((_, i) => i !== idx));
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
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center mb-6 sm:mb-8 gap-4">
        {/* Tabs */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 w-full lg:w-auto">
          <button 
            className={`px-3 sm:px-6 py-2.5 sm:py-3 font-mono font-bold uppercase flex items-center justify-center gap-2 border-2 text-xs sm:text-sm transition-all ${activeTab === 'itinerary' ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10 shadow-[2px_2px_0px_0px_var(--accent)]' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 bg-zinc-950'}`}
            onClick={() => setActiveTab('itinerary')}
          >
            <MapPin size={16} /> Itinerary
          </button>
          <button 
            className={`px-3 sm:px-6 py-2.5 sm:py-3 font-mono font-bold uppercase flex items-center justify-center gap-2 border-2 text-xs sm:text-sm transition-all ${activeTab === 'trains' ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10 shadow-[2px_2px_0px_0px_var(--accent)]' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 bg-zinc-950'}`}
            onClick={() => setActiveTab('trains')}
          >
            <Train size={16} /> Trains
          </button>
          <button 
            className={`px-3 sm:px-6 py-2.5 sm:py-3 font-mono font-bold uppercase flex items-center justify-center gap-2 border-2 text-xs sm:text-sm transition-all ${activeTab === 'hotels' ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10 shadow-[2px_2px_0px_0px_var(--accent)]' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 bg-zinc-950'}`}
            onClick={() => setActiveTab('hotels')}
          >
            <Hotel size={16} /> Hotels
          </button>
          <button 
            className={`px-3 sm:px-6 py-2.5 sm:py-3 font-mono font-bold uppercase flex items-center justify-center gap-2 border-2 text-xs sm:text-sm transition-all ${activeTab === 'families' ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10 shadow-[2px_2px_0px_0px_var(--accent)]' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 bg-zinc-950'}`}
            onClick={() => setActiveTab('families')}
          >
            <Users size={16} /> Families
          </button>
        </div>

        {/* Save & Reset Actions */}
        <div className="flex w-full lg:w-auto gap-2 sm:gap-4">
          <button 
            onClick={handleReset}
            className="flex-1 sm:flex-initial justify-center px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-zinc-700 hover:border-zinc-500 font-mono font-bold uppercase flex items-center gap-2 transition-colors text-xs sm:text-sm bg-zinc-950"
          >
            <RefreshCw size={16} /> Reset
          </button>
          <button 
            onClick={handleCommit}
            className="flex-1 sm:flex-initial justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--accent)] text-white font-mono font-bold uppercase flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.4)] text-xs sm:text-sm"
          >
            <Save size={16} /> Commit
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-3.5 sm:p-6 md:p-8">
        {activeTab === 'itinerary' && (
          <div className="space-y-4 sm:space-y-6">
            {localItinerary.map((day, idx) => (
              <div key={day.day} className="border border-zinc-800 p-4 sm:p-6 bg-zinc-950 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="text-xl sm:text-3xl font-black text-zinc-700 font-mono flex items-center sm:block">D{day.day}</div>
                <div className="flex-1 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block font-mono text-xs text-zinc-500 mb-1">TITLE</label>
                      <input 
                        className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono text-xs sm:text-sm" 
                        value={day.title} 
                        onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-zinc-500 mb-1">LOCATION</label>
                      <input 
                        className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono text-xs sm:text-sm" 
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
          <div className="space-y-4 sm:space-y-6">
            {localTrains.map((train, idx) => (
              <div key={train.id} className="border border-zinc-800 p-4 sm:p-6 bg-zinc-950">
                <div className="text-lg sm:text-xl font-black mb-3 text-[var(--accent)] uppercase">{train.id}</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-mono text-xs text-zinc-500 mb-1">NAME</label>
                    <input 
                      className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono text-xs sm:text-sm" 
                      value={train.name} 
                      onChange={(e) => handleTrainChange(idx, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-zinc-500 mb-1">NUMBER</label>
                    <input 
                      className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono text-xs sm:text-sm" 
                      value={train.number} 
                      onChange={(e) => handleTrainChange(idx, 'number', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-zinc-500 mb-1">DATE</label>
                    <input 
                      className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono text-xs sm:text-sm" 
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
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-start sm:justify-end mb-2 sm:mb-4">
              <button 
                onClick={addHotel}
                className="w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold text-xs sm:text-sm uppercase text-center"
              >
                + Add Hotel Override
              </button>
            </div>
            {localHotels.map((hotel, idx) => (
              <div key={hotel.id} className="border border-zinc-800 p-4 sm:p-6 bg-zinc-950">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-lg sm:text-xl font-black text-[var(--accent)] uppercase truncate mr-2">{hotel.name}</div>
                  <button 
                    onClick={() => removeHotel(idx)}
                    className="text-red-500 hover:text-red-400 font-mono text-xs uppercase flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-mono text-xs text-zinc-500 mb-1">HOTEL NAME</label>
                    <input 
                      className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono text-xs sm:text-sm" 
                      value={hotel.name} 
                      onChange={(e) => handleHotelChange(idx, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-zinc-500 mb-1">CITY</label>
                    <input 
                      className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono text-xs sm:text-sm" 
                      value={hotel.city} 
                      onChange={(e) => handleHotelChange(idx, 'city', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FAMILIES TAB */}
        {activeTab === 'families' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2 sm:mb-4">
              <div className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                CONFIGURED TRAVELING FAMILIES ({localFamilies.length})
              </div>
              <button 
                onClick={addFamily} 
                className="w-full sm:w-auto justify-center px-4 py-2 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black font-mono text-xs font-bold uppercase flex items-center gap-2 transition-colors"
              >
                <Plus size={14} /> Add Traveling Family
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {localFamilies.map((fam, idx) => (
                <div key={fam.id || idx} className="p-4 sm:p-6 bg-zinc-950 border-2 border-zinc-800 relative group shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs text-white flex-shrink-0"
                        style={{ backgroundColor: fam.color }}
                      >
                        {fam.avatar || 'FA'}
                      </div>
                      <span className="font-mono text-xs font-black uppercase text-zinc-300 truncate">
                        FAMILY RECORD #{idx + 1}
                      </span>
                    </div>
                    {localFamilies.length > 1 && (
                      <button 
                        onClick={() => removeFamily(idx)}
                        className="text-zinc-500 hover:text-red-400 font-mono text-xs uppercase transition-colors"
                        title="Remove Family"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 sm:space-y-4 font-mono text-xs">
                    <div>
                      <label className="block text-zinc-500 mb-1">FAMILY / SURNAMES TITLE</label>
                      <input 
                        className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-bold text-xs sm:text-sm"
                        value={fam.family}
                        onChange={(e) => handleFamilyChange(idx, 'family', e.target.value)}
                        placeholder="e.g. Mitra Family"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-zinc-500 mb-1">HEAD OF FAMILY</label>
                        <input 
                          className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white text-xs sm:text-sm"
                          value={fam.head}
                          onChange={(e) => handleFamilyChange(idx, 'head', e.target.value)}
                          placeholder="e.g. Gopal Mitra"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 mb-1">AVATAR INITIALS</label>
                        <input 
                          className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white uppercase text-center font-black text-xs sm:text-sm"
                          maxLength={3}
                          value={fam.avatar}
                          onChange={(e) => handleFamilyChange(idx, 'avatar', e.target.value.toUpperCase())}
                          placeholder="GM"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-zinc-500 mb-1">CONTACT EMAIL</label>
                        <input 
                          className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white text-xs sm:text-sm"
                          value={fam.email}
                          onChange={(e) => handleFamilyChange(idx, 'email', e.target.value)}
                          placeholder="family@domain.com"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 mb-1">THEME COLOR ACCENT</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color"
                            className="w-8 h-8 p-0 bg-transparent border-0 cursor-pointer flex-shrink-0"
                            value={fam.color}
                            onChange={(e) => handleFamilyChange(idx, 'color', e.target.value)}
                          />
                          <input 
                            className="w-full bg-zinc-900 border border-zinc-700 p-2 text-white font-mono uppercase text-xs sm:text-sm"
                            value={fam.color}
                            onChange={(e) => handleFamilyChange(idx, 'color', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GodModeAdminPage() {
  const { itinerary, setItinerary, trains, setTrains, hotels, setHotels, families, setFamilies } = useTripData();
  const { trips, activeTrip, activeTripId, switchActiveTrip, createTrip, updateActiveTrip } = useTrip();
  const [successMsg, setSuccessMsg] = useState('');

  // Trip Creation Modal State
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripSlug, setNewTripSlug] = useState('');
  const [newTripStartDate, setNewTripStartDate] = useState('');
  const [newTripEndDate, setNewTripEndDate] = useState('');

  // Auto-open creation form if routed via mobile drawer with ?deploy=new or ?newTrip=true
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('deploy') === 'new' || params.get('newTrip') === 'true') {
          setIsCreatingTrip(true);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
    families: typeof TRIP_CONFIG.families;
  }) => {
    setItinerary(data.itinerary);
    setTrains(data.trains);
    setHotels(data.hotels);
    setFamilies(data.families);
    updateActiveTrip({
      itinerary: data.itinerary,
      trains: data.trains,
      hotels: data.hotels,
      families: data.families,
    });
    setSuccessMsg(`SYSTEM OVERRIDE COMMITTED FOR [${activeTrip.title}]`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="w-full pt-24 sm:pt-32 pb-16 sm:pb-24 min-h-screen relative text-white selection:bg-[var(--accent)] px-3 sm:px-6 md:px-8">
      <InteractiveCanvasBackground variant="admin" />
      <GodCursor />
      
      <div className="container-wide">
        {/* Header */}
        <div className="mb-8 sm:mb-12 border-b-2 border-zinc-800 pb-6 sm:pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-3 bg-[var(--accent)] text-white px-3 py-1 font-mono text-xs sm:text-sm font-black uppercase mb-4 sm:mb-6 animate-pulse shadow-[0_0_15px_var(--accent)]">
              <Terminal size={16} /> GOD MODE AUTHORIZED
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 break-words">
              System Override
            </h1>
          </div>
        </div>

        {/* Multi-Trip Tactical Switcher Block */}
        <div className="mb-8 sm:mb-12 p-4 sm:p-6 bg-zinc-950 border-2 border-zinc-800 shadow-[6px_6px_0px_0px_rgba(249,115,22,0.3)]">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-6">
            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-3 text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase mb-2">
                <Compass size={14} className="text-[var(--accent)]" /> Active Fleet Deployment
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-white break-words">{activeTrip.title}</span>
                <span className="bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)] px-2.5 py-0.5 font-mono text-xs font-black uppercase tracking-widest animate-pulse">
                  ACTIVE TRIP
                </span>
              </div>
              <div className="font-mono text-xs text-zinc-500 mt-2 flex items-center gap-3 sm:gap-4 flex-wrap">
                <span>SLUG: <span className="text-zinc-300 font-bold">{activeTrip.slug}</span></span>
                <span className="hidden sm:inline">•</span>
                <span>TIMEFRAME: <span className="text-zinc-300 font-bold">{activeTrip.start_date || 'TBD'} → {activeTrip.end_date || 'TBD'}</span></span>
                <span className="hidden sm:inline">•</span>
                <span>DAYS: <span className="text-[var(--accent)] font-bold">{itinerary.length}</span></span>
              </div>
            </div>

            <button
              onClick={() => setIsCreatingTrip(!isCreatingTrip)}
              className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 bg-zinc-900 border-2 border-zinc-700 hover:border-[var(--accent)] hover:text-[var(--accent)] text-zinc-200 font-mono text-xs font-black uppercase flex items-center gap-2 transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] active:translate-y-0.5"
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
              className="mb-6 p-4 sm:p-6 border-2 border-[var(--accent)] bg-zinc-900/90"
            >
              <div className="font-mono text-xs sm:text-sm font-black text-[var(--accent)] uppercase mb-4 flex items-center gap-2">
                <Plus size={16} /> Initialize New Trip Instance
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block font-mono text-xs text-zinc-400 mb-1">TRIP TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kashmir Valley Expedition"
                    value={newTripTitle}
                    onChange={(e) => setNewTripTitle(e.target.value)}
                    className="w-full bg-black border border-zinc-700 p-2 text-white font-mono text-xs sm:text-sm focus:border-[var(--accent)] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-zinc-400 mb-1">SLUG (URL KEY)</label>
                  <input
                    type="text"
                    placeholder="e.g. kashmir-2027"
                    value={newTripSlug}
                    onChange={(e) => setNewTripSlug(e.target.value)}
                    className="w-full bg-black border border-zinc-700 p-2 text-white font-mono text-xs sm:text-sm focus:border-[var(--accent)] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-zinc-400 mb-1">START DATE</label>
                  <input
                    type="date"
                    value={newTripStartDate}
                    onChange={(e) => setNewTripStartDate(e.target.value)}
                    className="w-full bg-black border border-zinc-700 p-2 text-white font-mono text-xs sm:text-sm focus:border-[var(--accent)] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-zinc-400 mb-1">END DATE</label>
                  <input
                    type="date"
                    value={newTripEndDate}
                    onChange={(e) => setNewTripEndDate(e.target.value)}
                    className="w-full bg-black border border-zinc-700 p-2 text-white font-mono text-xs sm:text-sm focus:border-[var(--accent)] outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingTrip(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-zinc-700 font-mono text-xs font-bold uppercase text-zinc-400 hover:text-white text-center"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 bg-[var(--accent)] text-white font-mono text-xs font-black uppercase hover:bg-orange-600 transition-colors shadow-[0_0_12px_rgba(249,115,22,0.4)] text-center"
                >
                  Create & Activate Fleet
                </button>
              </div>
            </motion.form>
          )}

          {/* Tactical Trip Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-zinc-800">
            <span className="w-full sm:w-auto font-mono text-xs text-zinc-500 font-bold uppercase mb-1 sm:mb-0 mr-1">FLEET SWITCHER:</span>
            {trips.map(trip => {
              const isSelected = trip.id === activeTripId;
              return (
                <button
                  key={trip.id}
                  onClick={() => switchActiveTrip(trip.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-xs font-bold uppercase border-2 flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_0_12px_rgba(249,115,22,0.5)]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  <Globe size={14} />
                  <span className="truncate max-w-[150px] sm:max-w-none">{trip.title}</span>
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
            className="mb-8 p-4 bg-green-500/20 border-2 border-green-500 text-green-400 font-mono font-bold uppercase text-xs sm:text-sm"
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
          initialFamilies={families}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
