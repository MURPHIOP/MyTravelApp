'use client';

import React, { useEffect, useState } from 'react';
import { Plane } from 'lucide-react';
import { gsap } from 'gsap';

export default function Preloader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if loaded in this session
    const hasLoaded = sessionStorage.getItem('mt-preloaded');
    if (hasLoaded) {
      setLoaded(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('mt-preloaded', 'true');
          gsap.to('.preloader-overlay', {
            opacity: 0,
            pointerEvents: 'none',
            duration: 0.6,
            ease: 'power3.inOut',
            onComplete: () => setLoaded(true),
          });
        },
      });

      tl.fromTo(
        '.preloader-logo',
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
      )
        .fromTo(
          '.preloader-title',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.2'
        )
        .fromTo(
          '.preloader-bar-fill',
          { width: '0%' },
          { width: '100%', duration: 1.2, ease: 'power2.inOut' },
          '-=0.3'
        );
    });

    return () => ctx.revert();
  }, []);

  if (loaded) return null;

  return (
    <div
      className="preloader-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: '#070B14',
        color: '#FFFFFF',
      }}
    >
      <div className="flex flex-col items-center gap-4 text-center px-6">
        <div
          className="preloader-logo flex items-center justify-center w-20 h-20 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)',
            boxShadow: '0 20px 60px rgba(99,102,241,0.5)',
          }}
        >
          <Plane size={36} color="#FFFFFF" strokeWidth={2} />
        </div>

        <div className="preloader-title">
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
            MyTravelApp
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4, fontWeight: 500 }}>
            Ancient Maharashtra Tour • Mitra &amp; Ghosh Family
          </p>
        </div>

        <div
          className="w-48 h-1.5 rounded-full overflow-hidden mt-4"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <div
            className="preloader-bar-fill h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)' }}
          />
        </div>
      </div>
    </div>
  );
}
