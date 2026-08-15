'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  visible?: boolean;
}

export default function FloatingActionButton({ 
  icon, 
  label, 
  onClick, 
  visible = true 
}: FloatingActionButtonProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ scale: 0, opacity: 0, rotate: -45 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, rotate: 45 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9, rotate: 15 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={onClick}
          className="fixed z-[45] right-6 bottom-[100px] bg-[var(--text-primary)] text-[var(--bg)] flex items-center justify-center gap-2 px-4 h-14 rounded-full shadow-[var(--elevation-3)] border border-white/10"
        >
          {icon}
          {label && <span className="font-bold text-sm tracking-wide pr-2">{label}</span>}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
