'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function GodCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <>
      <style jsx global>{`
        @media (pointer: fine) and (min-width: 1024px) {
          body {
            cursor: none;
          }
          a, button, input, textarea, select {
            cursor: none !important;
          }
        }
      `}</style>
      
      {/* Core Dot - Active strictly on desktop devices with fine pointer */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-[var(--accent)] rounded-full pointer-events-none z-[9999] hidden lg:block"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      
      {/* Outer Ring - Active strictly on desktop devices with fine pointer */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border-2 border-[var(--accent)] rounded-full pointer-events-none z-[9998] hidden lg:block"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
      />
    </>
  );
}
