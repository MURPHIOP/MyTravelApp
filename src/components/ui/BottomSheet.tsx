'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-[101] mat-paper pb-safe rounded-t-[32px] rounded-b-none mx-auto w-full max-w-[500px]"
            style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="px-6 pb-4 flex items-center justify-between border-b border-black/5 dark:border-white/5">
                <h3 className="heading-lg">{title}</h3>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-gray-500 hover:text-[var(--text-primary)] transition-colors tap-effect"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-6">
              {children}
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
