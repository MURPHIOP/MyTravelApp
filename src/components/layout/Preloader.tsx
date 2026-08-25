'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500); // Wait a bit at 100%
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-[var(--bg-color)] flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md px-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="font-black text-4xl tracking-tighter uppercase mb-2">MyTravel</h1>
              <p className="font-mono text-xs font-bold tracking-widest text-[var(--accent)] uppercase">
                Initializing Secure System
              </p>
            </motion.div>

            {/* Brutalist Progress Bar */}
            <div className="w-full h-8 border-4 border-[var(--border-color)] bg-white relative shadow-[4px_4px_0px_0px_var(--shadow-color)]">
              <motion.div
                className="h-full bg-[var(--accent)]"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.2 }}
              />
            </div>

            <div className="font-mono text-2xl font-black">{progress}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
