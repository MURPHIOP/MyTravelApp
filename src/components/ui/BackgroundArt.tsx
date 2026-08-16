import React from 'react';

export default function BackgroundArt() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Base Radial Gradient for Atmosphere */}
      <div className="absolute inset-0 radial-gradient-bg opacity-70" />

      {/* Subtle Grain Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-multiply dark:mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Topographic Lines / Cartographic Art (Using the God-Tier Map) */}
      <div 
        className="absolute inset-0 opacity-[0.15] dark:opacity-10 mix-blend-multiply dark:mix-blend-screen"
        style={{
          backgroundImage: 'url(/destinations/hero_map.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'contrast(1.2) sepia(1)'
        }}
      />

      {/* Route Line Geometry (Abstract decoration) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M -100 200 C 300 150, 500 500, 1000 300 S 1400 800, 1800 600" 
          fill="none" 
          stroke="var(--text-primary)" 
          strokeWidth="1.5" 
          strokeDasharray="8 8"
        />
        <circle cx="300" cy="180" r="4" fill="var(--text-primary)" />
        <circle cx="1000" cy="300" r="4" fill="var(--text-primary)" />
      </svg>
    </div>
  );
}
