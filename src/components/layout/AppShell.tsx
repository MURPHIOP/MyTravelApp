'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';
import DesktopSidebar from './DesktopSidebar';
import TopBar from './TopBar';
import Preloader from './Preloader';
import { gsap } from 'gsap';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, [pathname]);

  if (pathname?.startsWith('/auth')) return <>{children}</>;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      <Preloader />
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>
      <div className="block md:hidden">
        <TopBar />
      </div>
      <main ref={mainRef} className="page-content">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
