'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import FloatingNav from '@/components/ui/FloatingNav';
import { AnimatePresence, motion } from 'framer-motion';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Assuming auth pages don't need the standard mobile shell
  if (pathname?.startsWith('/auth')) return <>{children}</>;

  return (
    <div className="relative w-full max-w-[500px] mx-auto min-h-[100dvh] bg-[var(--bg)] shadow-2xl overflow-x-hidden">
      
      {/* ── MAIN CONTENT AREA ── */}
      <AnimatePresence mode="wait">
        <motion.main 
          key={pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="page-content"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* ── FLOATING BOTTOM NAVIGATION ── */}
      <FloatingNav />
      
    </div>
  );
}
