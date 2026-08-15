'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Html, Float } from '@react-three/drei';
import { ITINERARY, TRIP_CONFIG, TRAINS, HOTELS } from '@/lib/tripData';
import { MapPin, Train, Hotel, Clock, Calendar, ChevronRight, Wallet } from 'lucide-react';

// ── 3D Roadmap Component ──────────────────────────────────
function Roadmap3D() {
  const groupRef = useRef<any>(null);
  const [currentDayIdx, setCurrentDayIdx] = useState(0);
  
  useEffect(() => {
    const diff = Math.floor((Date.now() - new Date(TRIP_CONFIG.departureDate).getTime()) / 86400000);
    if (diff >= 0 && diff < ITINERARY.length) {
      setCurrentDayIdx(diff);
    }
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  // Coordinates for a stylized route map
  const routePoints: [number, number, number][] = [
    [-2, -1, 0],   // HWH
    [-1, 0.5, 1],  // JLG
    [0, 1, 0],     // AUR
    [1, 0.5, -1],  // SRD
    [2, -0.5, 0],  // NK
    [1.5, -1.5, 1],// PUNE
    [0, -2, 0]     // HWH (Return)
  ];

  return (
    <group ref={groupRef} scale={1.2}>
      <Line
        points={routePoints}
        color="#00F0FF"
        lineWidth={3}
        dashed={true}
        dashSize={0.2}
        dashScale={1}
        dashOffset={0}
      />
      {routePoints.map((pos, i) => {
        const isCurrent = i === Math.min(currentDayIdx, routePoints.length - 1);
        return (
          <Float key={i} speed={isCurrent ? 4 : 2} rotationIntensity={isCurrent ? 0.5 : 0.1} floatIntensity={isCurrent ? 0.5 : 0.2}>
            <Sphere position={pos} args={isCurrent ? [0.15, 32, 32] : [0.08, 16, 16]}>
              <meshStandardMaterial 
                color={isCurrent ? "#FF5E3A" : "#00F0FF"} 
                emissive={isCurrent ? "#FF5E3A" : "#00F0FF"} 
                emissiveIntensity={isCurrent ? 2 : 0.8}
                toneMapped={false}
              />
            </Sphere>
            {isCurrent && (
              <Html position={[pos[0], pos[1] + 0.3, pos[2]]} center>
                <div className="px-3 py-1.5 rounded-full neu-convex text-xs font-bold whitespace-nowrap neon-text-orange" style={{ background: 'var(--surface)'}}>
                  Current: {ITINERARY[currentDayIdx]?.location || 'Pune'}
                </div>
              </Html>
            )}
          </Float>
        );
      })}
    </group>
  );
}

// ── Upcoming Schedule Card (Puffy Tile) ───────────────────
function ScheduleCard({ title, time, type, icon: Icon }: { title: string, time: string, type: string, icon: any }) {
  return (
    <div className="neu-convex p-4 mb-4 flex items-center gap-4 transition-transform active:scale-95">
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl neu-pressed">
        <Icon size={20} className="neon-text-cyan" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-bold uppercase text-gray-500 mb-1">{type}</div>
        <div className="text-[15px] font-extrabold text-white leading-tight">{title}</div>
      </div>
      <div className="text-right">
        <div className="neu-flat px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Clock size={12} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-300">{time}</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="page-content bg-[var(--bg)]">
      
      {/* ── HEADER ── */}
      <div className="pt-8 px-6 pb-6">
        <h1 className="heading-xl neon-text-orange">3D Itinerary</h1>
        <p className="text-sm font-semibold text-gray-400 mt-1 uppercase tracking-widest">Live Trip Dashboard</p>
      </div>

      <div className="inner pb-12">
        {/* ── 3D MAP HERO CONTAINER ── */}
        <div className="neu-concave rounded-[32px] overflow-hidden relative mb-10 h-[380px] w-full border border-white/5">
          <div className="absolute top-4 left-4 z-10 neu-flat px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF5E3A] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">Live Tracking</span>
          </div>
          
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00F0FF" />
            <Roadmap3D />
            <OrbitControls enableZoom={false} autoRotate={false} />
          </Canvas>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <div className="neu-flat px-6 py-3 rounded-[20px] backdrop-blur-md bg-white/5 text-center">
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Drag to rotate</div>
              <div className="text-sm font-extrabold text-white">Interactive Route Map</div>
            </div>
          </div>
        </div>

        {/* ── TODAY'S SCHEDULE ── */}
        <div className="mb-6 px-2 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-black text-white">Today's Schedule</h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Day 4 • Aurangabad</p>
          </div>
        </div>

        <div>
          <ScheduleCard title="Ajanta Caves Tour" time="09:00 AM" type="Excursion" icon={MapPin} />
          <ScheduleCard title="Check-in: Hotel Lemon Tree" time="02:00 PM" type="Accommodation" icon={Hotel} />
          <ScheduleCard title="Dinner at Bhoj" time="08:30 PM" type="Dining" icon={Wallet} />
        </div>

        <div className="mt-8">
          <Link href="/expenses">
            <button className="neu-btn-primary w-full py-4 rounded-[20px] text-lg font-black tracking-wide flex items-center justify-center gap-3">
              <Wallet size={20} /> Open Auto-Budget
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
