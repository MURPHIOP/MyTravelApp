'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldAlert, Settings, Mic, Radio, FileText, Upload, 
  Trash2, GripVertical, Plus, CheckCircle, BellRing, 
  MapPin, Clock, Folder
} from 'lucide-react';
import { ITINERARY, TRIP_CONFIG } from '@/lib/tripData';

export default function AdminControlCenter() {
  const [editMode, setEditMode] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [timerIdx, setTimerIdx] = useState(0);
  const [broadcasting, setBroadcasting] = useState(false);
  
  // Dropzone state
  const [uploads, setUploads] = useState<{name: string, type: string}[]>([
    { name: 'Vande_Bharat_Ticket.pdf', type: 'Train Tickets' }
  ]);
  const [uploadCat, setUploadCat] = useState('Train Tickets');

  // Itinerary state for DND
  const [itinerary, setItinerary] = useState(ITINERARY.slice(0, 5));
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Quick Approve state
  const [approved, setApproved] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  // Quick Approve Slider Logic
  useEffect(() => {
    const knob = knobRef.current;
    const track = sliderRef.current;
    if (!knob || !track || approved) return;

    let isDown = false;
    let startX = 0;
    
    const maxOffset = track.clientWidth - knob.clientWidth - 8; // 8px for padding

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDown = true;
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };
    
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown || approved) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const walk = Math.max(0, Math.min(x - startX, maxOffset));
      knob.style.transform = `translateX(${walk}px)`;
      
      if (walk >= maxOffset - 10) {
        setApproved(true);
        isDown = false;
        knob.style.transform = `translateX(${maxOffset}px)`;
        // Play success anim or sound here
      }
    };
    
    const onUp = () => {
      isDown = false;
      if (!approved) {
        knob.style.transform = 'translateX(0px)';
        knob.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
          if (knob) knob.style.transition = '';
        }, 300);
      }
    };

    knob.addEventListener('mousedown', onDown);
    knob.addEventListener('touchstart', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    return () => {
      knob.removeEventListener('mousedown', onDown);
      knob.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [approved]);

  // Handle DND
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    // Hide ghost image to just rely on UI state if preferred, but default is fine
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    
    const newItems = [...itinerary];
    const draggedItem = newItems[draggedIdx];
    
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    setItinerary(newItems);
  };
  
  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  // Flip Cover State
  const [coverOpen, setCoverOpen] = useState(false);
  const [rallyFired, setRallyFired] = useState(false);

  return (
    <div className="page-content bg-[var(--bg)] min-h-screen pb-32">
      
      {/* ── HEADER ── */}
      <div className="pt-8 px-6 pb-6 flex items-start justify-between">
        <div>
          <h1 className="heading-lg text-white" style={{ textShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
            Control Center
          </h1>
          <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldAlert size={14} className="neon-text-orange" /> Family Head
          </p>
        </div>

        {/* METALLIC TOGGLE SWITCH */}
        <div 
          className="neu-pressed w-20 h-10 rounded-full flex items-center relative p-1 cursor-pointer bg-black/20"
          onClick={() => setEditMode(!editMode)}
        >
          <div 
            className="w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all duration-300"
            style={{ 
              background: 'linear-gradient(145deg, #e0e0e0, #ffffff)', 
              boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.4)',
              transform: editMode ? 'translateX(40px)' : 'translateX(0)'
            }}
          >
            {editMode ? <Settings size={14} color="#000" /> : <Radio size={14} color="#000" />}
          </div>
        </div>
      </div>

      <div className="inner space-y-10 px-4 md:px-6">

        {/* ── THE INTERCOM (Broadcasting System) ── */}
        <section>
          <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 pl-2 flex items-center gap-2">
            <Mic size={14} /> The Intercom
          </div>
          
          <div className="neu-flat rounded-[32px] p-5">
            {/* Deep inset textarea */}
            <textarea
              className="w-full h-24 neu-pressed bg-black/10 rounded-[20px] p-4 text-white font-bold resize-none placeholder:text-gray-600 focus:outline-none focus:ring-2 ring-cyan-500/50 transition-all"
              placeholder="Broadcast an announcement..."
              value={announcement}
              onChange={e => setAnnouncement(e.target.value)}
            />
            
            <div className="flex items-center justify-between mt-5">
              {/* Rotary Dials for Timer */}
              <div className="flex items-center gap-4">
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Duration</div>
                <div 
                  className="w-14 h-14 rotary-dial flex items-center justify-center cursor-pointer"
                  onClick={() => setTimerIdx((timerIdx + 1) % 3)}
                  style={{ transform: `rotate(${timerIdx * 120}deg)` }}
                >
                  <div className="rotary-dial-indicator" />
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white pointer-events-none" style={{ transform: `rotate(-${timerIdx * 120}deg)` }}>
                    {['5m', '30m', '∞'][timerIdx]}
                  </div>
                </div>
              </div>

              {/* Broadcast Pill Button */}
              <button 
                className="neu-convex rounded-full h-14 px-8 flex items-center justify-center gap-2 transition-all active:scale-95"
                onClick={() => {
                  setBroadcasting(true);
                  setTimeout(() => setBroadcasting(false), 2000);
                }}
              >
                <Radio size={18} className={broadcasting ? 'neon-text-cyan animate-pulse' : 'text-gray-400'} />
                <span className={`font-black uppercase tracking-wider ${broadcasting ? 'neon-text-cyan' : 'text-gray-400'}`}>
                  {broadcasting ? 'Live' : 'Broadcast'}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── DOCUMENT DROPZONE ── */}
        <section>
          <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 pl-2 flex items-center gap-2">
            <Upload size={14} /> Pneumatic Dropzone
          </div>
          
          <div className="neu-flat rounded-[32px] p-5">
            {/* Soft-extruded Grouped Buttons */}
            <div className="flex gap-2 mb-5">
              {['Train Tickets', 'Hotel Passes', 'Info PDFs'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setUploadCat(cat)}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${uploadCat === cat ? 'neu-pressed text-cyan-400' : 'neu-convex text-gray-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Inset Dashed Dropzone */}
            <div className="dropzone-inset h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
              <Folder size={32} className="text-gray-600 mb-2 anim-float" />
              <div className="text-xs font-bold text-gray-500">Tap or Drop Files Here</div>
            </div>

            {/* Live Preview */}
            <div className="mt-5 space-y-3">
              {uploads.map((file, i) => (
                <div key={i} className="texture-paper p-3 rounded-[16px] flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-800 truncate w-40">{file.name}</div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase">{file.type}</div>
                    </div>
                  </div>
                  <button 
                    className="w-10 h-10 neu-pressed rounded-xl flex items-center justify-center active:scale-90"
                    onClick={() => setUploads(uploads.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 size={16} className="text-red-500/80" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MODULAR ITINERARY EDITOR ── */}
        <section>
          <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 pl-2 flex items-center gap-2">
            <MapPin size={14} /> Modular Itinerary
          </div>
          
          <div className="neu-flat rounded-[32px] p-4">
            <div className="space-y-3">
              {itinerary.map((item, index) => (
                <div 
                  key={item.day}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-stretch bg-[var(--surface)] neu-convex rounded-[20px] transition-transform duration-200 ${draggedIdx === index ? 'opacity-50 scale-95' : 'hover:scale-[1.02]'}`}
                  style={{ cursor: 'grab' }}
                >
                  {/* Skeuomorphic Grip Lines */}
                  <div className="w-8 grip-lines rounded-l-[20px] border-r border-white/5 opacity-50 flex items-center justify-center pointer-events-none">
                    <GripVertical size={16} className="text-gray-500" />
                  </div>
                  
                  <div className="p-3 flex-1 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase">Day {item.day}</div>
                      <div className="text-sm font-black text-white">{item.location}</div>
                    </div>
                    
                    {editMode ? (
                      <button className="w-8 h-8 rounded-full neu-pressed flex items-center justify-center text-cyan-400">
                        <Settings size={14} />
                      </button>
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600">
                        <Clock size={14} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {editMode && (
              <button className="w-full mt-4 py-3 neu-pressed rounded-[20px] flex items-center justify-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                <Plus size={16} /> Add Stop
              </button>
            )}
          </div>
        </section>

        {/* ── BONUS: RALLY POINT & QUICK APPROVE ── */}
        <section className="flex gap-4">
          
          {/* Rally Point Panic Button */}
          <div className="neu-flat rounded-[32px] p-5 flex-1 flex flex-col items-center justify-center relative overflow-visible">
            <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Rally Point</div>
            
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* The Glass Cover */}
              <div 
                className={`glass-cover absolute inset-[-10px] rounded-2xl z-20 cursor-pointer ${coverOpen ? 'open' : ''}`}
                onClick={() => setCoverOpen(!coverOpen)}
              >
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/30 rounded-full" />
              </div>
              
              {/* The Launch Button */}
              <button 
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-150 relative z-10 ${!coverOpen ? 'opacity-50 pointer-events-none' : 'active:scale-90 active:shadow-inner'}`}
                style={{
                  background: 'linear-gradient(145deg, #EF4444, #991B1B)',
                  boxShadow: '0 8px 16px rgba(239,68,68,0.4), inset 0 4px 6px rgba(255,255,255,0.4)',
                  border: '2px solid #7F1D1D'
                }}
                onClick={() => {
                  setRallyFired(true);
                  setTimeout(() => { setRallyFired(false); setCoverOpen(false); }, 3000);
                }}
              >
                <BellRing size={32} color="#FFF" className={rallyFired ? 'animate-bounce' : ''} />
              </button>
            </div>
            
            {rallyFired && <div className="absolute bottom-2 text-[9px] font-black text-red-500 uppercase animate-pulse">Ping Sent!</div>}
          </div>

          {/* Quick Approve Slider */}
          <div className="neu-flat rounded-[32px] p-5 flex-1 flex flex-col justify-center relative overflow-hidden">
             <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Quick Approve</div>
             <div className="text-sm font-black text-white mb-6">₹12,450 <span className="text-[10px] font-bold text-gray-500 block">Pending Split</span></div>
             
             {/* Slide Track */}
             <div 
               ref={sliderRef}
               className="slide-track w-full h-14"
             >
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-6">
                    {approved ? 'Approved' : 'Slide'}
                  </span>
               </div>
               
               {/* Knob */}
               <div 
                 ref={knobRef}
                 className="slide-knob w-[48px] z-10"
               >
                 {approved ? <CheckCircle size={20} className="text-[#00FF41]" /> : <ArrowRightIcon size={20} className="text-gray-400" />}
               </div>
             </div>
          </div>

        </section>

      </div>
    </div>
  );
}

function ArrowRightIcon({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14"></path>
      <path d="M12 5l7 7-7 7"></path>
    </svg>
  );
}
