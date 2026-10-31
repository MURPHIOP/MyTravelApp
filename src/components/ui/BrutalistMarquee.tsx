'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
  items: string[];
  speed?: number; // seconds to complete one loop
  direction?: 'left' | 'right';
  className?: string;
  itemClassName?: string;
}

export default function BrutalistMarquee({ 
  items, 
  speed = 20, 
  direction = 'left',
  className = '',
  itemClassName = ''
}: MarqueeProps) {
  // Duplicate items array to ensure seamless looping without gaps
  const duplicatedItems = [...items, ...items, ...items, ...items];
  
  return (
    <div 
      className={`relative flex overflow-hidden whitespace-nowrap bg-[var(--text-primary)] text-[var(--bg-color)] py-4 border-y-[3px] border-[var(--border-color)] min-h-[58px] ${className}`}
    >
      <motion.div
        className="flex whitespace-nowrap will-change-transform transform-gpu"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <div key={idx} className={`flex items-center mx-4 font-mono font-bold uppercase tracking-widest text-sm ${itemClassName}`}>
            <span>{item}</span>
            {/* Brutalist Divider */}
            <span className="mx-8 text-[var(--accent)] font-black text-xl select-none">*</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
